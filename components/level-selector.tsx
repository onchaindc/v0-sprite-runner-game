"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LEVELS } from "@/lib/game/constants"
import { Lock, Star, Trophy } from "lucide-react"

interface LevelSelectorProps {
  onSelectLevel: (levelIndex: number) => void
  unlockedLevels: number
}

export function LevelSelector({ onSelectLevel, unlockedLevels }: LevelSelectorProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3 w-full max-w-4xl">
      {LEVELS.map((level, index) => {
        const isUnlocked = index <= unlockedLevels
        const difficulty = ["Easy", "Medium", "Hard"][index]
        const difficultyColor = ["text-green-600", "text-orange-600", "text-red-600"][index]

        return (
          <Card
            key={level.id}
            className={`p-6 space-y-4 transition-all ${
              isUnlocked
                ? "hover:shadow-xl hover:scale-105 cursor-pointer border-2 border-primary/20"
                : "opacity-50 cursor-not-allowed bg-gray-50"
            }`}
            onClick={() => isUnlocked && onSelectLevel(index)}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold">{level.name}</h3>
                <p className={`text-sm font-medium ${difficultyColor}`}>{difficulty}</p>
              </div>
              {!isUnlocked && <Lock className="w-5 h-5 text-gray-400" />}
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                <span>{level.checkpoints.length} Checkpoints</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                <span>Speed: {level.obstacleSpeed.toFixed(1)}x</span>
              </div>
            </div>

            {isUnlocked ? (
              <Button className="w-full" onClick={() => onSelectLevel(index)}>
                Play Level {level.id}
              </Button>
            ) : (
              <Button className="w-full" disabled>
                Complete Previous Level
              </Button>
            )}
          </Card>
        )
      })}
    </div>
  )
}
