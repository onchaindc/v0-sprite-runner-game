"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, Coins, Star, ArrowRight, Home } from "lucide-react"

interface LevelCompleteModalProps {
  level: { id: number; name: string }
  score: number
  coins: number
  onNextLevel: () => void
  onMenu: () => void
  hasNextLevel: boolean
}

export function LevelCompleteModal({
  level,
  score,
  coins,
  onNextLevel,
  onMenu,
  hasNextLevel,
}: LevelCompleteModalProps) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <Card className="p-8 max-w-md w-full space-y-6 animate-in fade-in zoom-in duration-300">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <Star className="w-16 h-16 text-yellow-500 animate-pulse" />
          </div>
          <h2 className="text-4xl font-bold text-green-600">Level Complete!</h2>
          <p className="text-gray-600">{level.name}</p>
        </div>

        <div className="space-y-3 bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-lg border-2 border-amber-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-600" />
              <span className="font-medium">Final Score</span>
            </div>
            <span className="text-xl font-bold">{score}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-yellow-500" />
              <span className="font-medium">Coins Collected</span>
            </div>
            <span className="text-xl font-bold">{coins}</span>
          </div>
        </div>

        <div className="flex gap-3">
          {hasNextLevel ? (
            <Button onClick={onNextLevel} className="flex-1 gap-2">
              Next Level <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button onClick={onMenu} className="flex-1 gap-2">
              All Levels Complete!
            </Button>
          )}
          <Button onClick={onMenu} variant="outline" className="flex-1 gap-2 bg-transparent">
            <Home className="w-4 h-4" /> Menu
          </Button>
        </div>
      </Card>
    </div>
  )
}
