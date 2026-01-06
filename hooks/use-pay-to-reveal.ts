"use client"

import { useState } from "react"
import { useAccount, useWalletClient, useSwitchChain, useChainId, usePublicClient } from "wagmi"
import { parseEther } from "viem"
import { base } from "wagmi/chains"
import { useFarcaster } from "@/lib/farcaster/farcaster-provider"
import { PAYMENT_CONFIG } from "@/lib/farcaster/config"

interface UsePayToRevealReturn {
  isRevealed: boolean
  isProcessing: boolean
  error: string | null
  payToReveal: () => Promise<void>
  isConnected: boolean
  needsPayment: boolean
  transactionHash: string | null
}

export function usePayToReveal(): UsePayToRevealReturn {
  const [isRevealed, setIsRevealed] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [transactionHash, setTransactionHash] = useState<string | null>(null)

  const { isInFarcaster } = useFarcaster()
  const { address, isConnected } = useAccount()
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()
  const { switchChain } = useSwitchChain()
  const currentChainId = useChainId()

  const needsPayment = isInFarcaster && !isRevealed

  const payToReveal = async () => {
    if (!isInFarcaster) {
      // Not in Farcaster, reveal immediately
      setIsRevealed(true)
      return
    }

    if (!isConnected || !walletClient) {
      setError("Please connect your wallet first")
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      if (currentChainId !== base.id) {
        console.log("[v0] Switching to Base network...")
        await switchChain({ chainId: base.id })
      }

      console.log("[v0] Sending payment transaction...")
      const hash = await walletClient.sendTransaction({
        to: PAYMENT_CONFIG.RECIPIENT_ADDRESS,
        value: parseEther(PAYMENT_CONFIG.PAYMENT_AMOUNT),
        chain: base,
      })

      console.log("[v0] Transaction sent:", hash)
      setTransactionHash(hash)

      if (publicClient) {
        console.log("[v0] Waiting for transaction confirmation...")
        const receipt = await publicClient.waitForTransactionReceipt({
          hash,
          confirmations: 1,
        })

        if (receipt.status === "success") {
          console.log("[v0] Payment confirmed, score revealed")
          setIsRevealed(true)
        } else {
          throw new Error("Transaction failed")
        }
      } else {
        // Fallback: wait briefly and reveal (for testing)
        await new Promise((resolve) => setTimeout(resolve, 3000))
        setIsRevealed(true)
      }
    } catch (err: any) {
      console.error("[v0] Payment error:", err)
      if (err.message?.includes("User rejected")) {
        setError("Transaction was cancelled")
      } else if (err.message?.includes("insufficient funds")) {
        setError("Insufficient funds for transaction")
      } else {
        setError(err.shortMessage || err.message || "Transaction failed")
      }
    } finally {
      setIsProcessing(false)
    }
  }

  return {
    isRevealed,
    isProcessing,
    error,
    payToReveal,
    isConnected,
    needsPayment,
    transactionHash,
  }
}
