"use client";

import { useState } from "react";
import { useAccount, useConnect, useSendTransaction } from "wagmi";
import { parseEther } from "viem";

// Your wallet address
const RECIPIENT_ADDRESS = "0xE00Ecb51e1bA79731E78D443A90e3AD200107c4b";
const PAYMENT_AMOUNT = "0.00001"; // ETH

interface UsePayToRevealReturn {
  isRevealed: boolean;
  isProcessing: boolean;
  error: string | null;
  txHash: string | null;
  payToReveal: () => Promise<void>;
}

export function usePayToReveal(): UsePayToRevealReturn {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const { isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { sendTransaction, data } = useSendTransaction();

  const payToReveal = async () => {
    setError(null);

    // Connect wallet
    if (!isConnected) {
      const connector = connectors?.[0];
      if (!connector) {
        setError("No wallet connector available");
        return;
      }
      await connect({ connector });
    }

    setIsProcessing(true);

    try {
      // Fire the transaction
      await sendTransaction({
        to: RECIPIENT_ADDRESS,
        value: parseEther(PAYMENT_AMOUNT),
      });

      // Wagmi stores the tx hash in `data` (string | undefined)
      if (!data) throw new Error("Transaction hash not found");
      setTxHash(data);

      // Reveal after success
      setIsRevealed(true);
    } catch (err: any) {
      if (err?.message?.includes("User rejected")) {
        setError("Transaction was cancelled");
      } else {
        setError(err?.message || "Transaction failed");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return { isRevealed, isProcessing, error, txHash, payToReveal };
}
