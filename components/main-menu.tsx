"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Trophy, Settings } from "lucide-react"

interface MainMenuProps {
  onStartGame: () => void
  onShowLevelSelect: () => void
  onShowLeaderboard: () => void
}

export function MainMenu({ onStartGame, onShowLevelSelect, onShowLeaderboard }: MainMenuProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] gap-8">
      <div className="text-center space-y-4">
        <h1 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-600 to-red-600 animate-pulse">
          Sprite Runner
        </h1>
        <p className="text-xl text-gray-600 font-medium">Endless Adventure Awaits</p>
      </div>

      <Card className="p-8 space-y-4 w-full max-w-md bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-amber-200">
        <Button onClick={onStartGame} size="lg" className="w-full gap-3 text-lg h-14">
          <Play className="w-6 h-6" /> Quick Play
        </Button>

        <Button
          onClick={onShowLevelSelect}
          size="lg"
          variant="outline"
          className="w-full gap-3 text-lg h-14 bg-transparent"
        >
          <Settings className="w-6 h-6" /> Select Level
        </Button>

        <Button
          onClick={onShowLeaderboard}
          size="lg"
          variant="outline"
          className="w-full gap-3 text-lg h-14 bg-transparent"
        >
          <Trophy className="w-6 h-6" /> Leaderboard
        </Button>
      </Card>

      <div className="text-center space-y-2 text-sm text-gray-500 max-w-md">
        <p className="font-medium">How to Play:</p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-white p-2 rounded border">
            <p className="font-medium">Desktop</p>
            <p>Arrow Keys / WASD</p>
          </div>
          <div className="bg-white p-2 rounded border">
            <p className="font-medium">Mobile</p>
            <p>Swipe Gestures</p>
          </div>
        </div>
      </div>
    </div>
  )
}
