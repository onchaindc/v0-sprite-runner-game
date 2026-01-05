"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trophy, Coins, Map, RotateCcw, Home } from "lucide-react"
import { useState } from "react"

interface GameOverModalProps {
  score: number
  coins: number
  distance: number
  onRestart: () => void
  onMenu: () => void
  onSubmitScore: (playerName: string) => void
}

export function GameOverModal({ score, coins, distance, onRestart, onMenu, onSubmitScore }: GameOverModalProps) {
  const [playerName, setPlayerName] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (playerName.trim()) {
      onSubmitScore(playerName.trim())
      setSubmitted(true)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <Card className="p-8 max-w-md w-full space-y-6 animate-in fade-in zoom-in duration-300">
        <div className="text-center space-y-2">
          <h2 className="text-4xl font-bold text-red-600">Game Over!</h2>
          <p className="text-gray-600">You've completed your run</p>
        </div>

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

        {!submitted ? (
          <div className="space-y-3">
            <label className="text-sm font-medium">Save your score to leaderboard</label>
            <Input
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
            <Button onClick={handleSubmit} className="w-full" disabled={!playerName.trim()}>
              Submit Score
            </Button>
          </div>
        ) : (
          <div className="text-center text-green-600 font-medium">Score saved successfully!</div>
        )}

        <div className="flex gap-3">
          <Button onClick={onRestart} className="flex-1 gap-2">
            <RotateCcw className="w-4 h-4" /> Play Again
          </Button>
          <Button onClick={onMenu} variant="outline" className="flex-1 gap-2 bg-transparent">
            <Home className="w-4 h-4" /> Menu
          </Button>
        </div>
      </Card>
    </div>
  )
}
