import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Coins, Map, RotateCcw, Home, Lock, Wallet, ExternalLink } from "lucide-react";
import { useState } from "react";
import { usePayToReveal } from "@/hooks/use-pay-to-reveal";
import { useAccount, useConnect } from "wagmi";
import { PAYMENT_CONFIG } from "@/lib/farcaster/config";

interface GameOverModalProps {
  score: number;
  coins: number;
  distance: number;
  onRestart: () => void;
  onMenu: () => void;
  onSubmitScore: (playerName: string) => void;
}

export function GameOverModal({ score, coins, distance, onRestart, onMenu, onSubmitScore }: GameOverModalProps) {
  const [playerName, setPlayerName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const { isRevealed, isProcessing, error, payToReveal, txHash, resetPaymentState, needsPayment } = usePayToReveal();
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();

  // Connect wallet using Wagmi
  const handleConnectWallet = async () => {
    try {
      if (connectors.length > 0) {
        await connect({ connector: connectors[0] });
        console.log("✅ Wallet connected");
      }
    } catch (err) {
      console.error("Failed to connect wallet:", err);
    }
  };

  // Handle payment and start a new round
  const handlePayAndPlayAgain = async () => {
    resetPaymentState();

    if (!isConnected) {
      await handleConnectWallet();
    }

    console.log("Starting payment process...");
    await payToReveal();
  };

  const handleSubmit = () => {
    if (playerName.trim()) {
      onSubmitScore(playerName.trim());
      setSubmitted(true);
    }
  };

  const showScoreGate = needsPayment && !isRevealed;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <Card className="p-8 max-w-md w-full space-y-6 animate-in fade-in zoom-in duration-300">
        <div className="text-center space-y-2">
          <h2 className="text-4xl font-bold text-red-600">Game Over!</h2>
          <p className="text-gray-600">You've completed your run</p>
        </div>

        {showScoreGate ? (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 p-6 rounded-lg text-center space-y-4">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                <Lock className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-blue-900">Unlock Your Score</h3>
              <p className="text-sm text-gray-700">
                Pay {PAYMENT_CONFIG.PAYMENT_AMOUNT} ETH on Base network to reveal your final score and stats
              </p>

              {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded border border-red-200">{error}</div>}

              {!isConnected ? (
                <Button onClick={handleConnectWallet} className="w-full gap-2" size="lg">
                  <Wallet className="w-4 h-4" /> Connect Wallet
                </Button>
              ) : (
                <div className="space-y-3">
                  <div className="text-xs text-gray-600 bg-white p-2 rounded border">
                    <div className="font-medium mb-1">Connected Wallet</div>
                    <div className="truncate font-mono">{address}</div>
                  </div>
                  <Button onClick={handlePayAndPlayAgain} disabled={isProcessing} className="w-full" size="lg">
                    {isProcessing ? <span className="animate-spin mr-2">⏳</span> : <>Pay {PAYMENT_CONFIG.PAYMENT_AMOUNT} ETH to Reveal</>}
                  </Button>
                  {txHash && (
                    <a
                      href={`https://basescan.org/tx/${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline flex items-center justify-center gap-1"
                    >
                      View transaction <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-600" />
                <span className="font-medium">Score</span>
              </div>
              <span className="text-xl font-bold">{score}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-yellow-500" />
                <span className="font-medium">Coins</span>
              </div>
              <span className="text-xl font-bold">{coins}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Map className="w-5 h-5 text-blue-600" />
                <span className="font-medium">Distance</span>
              </div>
              <span className="text-xl font-bold">{distance}m</span>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <Button
            onClick={() => {
              resetPaymentState();
              onRestart();
            }}
            className="flex-1 gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Play Again
          </Button>
          <Button onClick={onMenu} variant="outline" className="flex-1 gap-2 bg-transparent">
            <Home className="w-4 h-4" /> Menu
          </Button>
        </div>
      </Card>
    </div>
  );
}
