"use client";

import { useState } from "react";
import { useAccount, useConnect, useSendTransaction } from "wagmi";
import { parseEther } from "viem";

const RECIPIENT_ADDRESS = "0xE00Ecb51e1bA79731E78D443A90e3AD200107c4b";
const PAYMENT_AMOUNT = "0.00001";

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
  const { sendTransactionAsync } = useSendTransaction();

  const payToReveal = async () => {
    setError(null);

    try {
      // Ensure wallet is connected (Farcaster handles UI)
      if (!isConnected) {
        const connector = connectors?.[0];
        if (!connector) throw new Error("No wallet connector");
        await connect({ connector });
      }

      setIsProcessing(true);

      // 🔥 THIS LINE TRIGGERS THE FARCASTER WALLET POPUP
      const hash = await sendTransactionAsync({
        to: RECIPIENT_ADDRESS,
        value: parseEther(PAYMENT_AMOUNT),
      });

      setTxHash(hash);
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