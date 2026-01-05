"use client"

import { useEffect, useRef, useState } from "react"
import { GameEngine } from "@/lib/game/engine"
import { LifeSystem } from "@/lib/game/life-system"
import type { GameState } from "@/lib/game/types"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Pause, Play, RotateCcw, Trophy, Coins, Heart, Zap } from "lucide-react"

interface GameCanvasProps {
  onGameOver?: (data: { score: number; coins: number; distance: number }) => void
  onLevelComplete?: (data: { level: any; score: number; coins: number }) => void
}

export function GameCanvas({ onGameOver, onLevelComplete }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<GameEngine | null>(null)
  const lifeSystemRef = useRef<LifeSystem>(new LifeSystem())
  const [gameState, setGameState] = useState<GameState>("menu")
  const [playerData, setPlayerData] = useState({ score: 0, coins: 0, lives: 3, distance: 0 })
  const [checkpointNotification, setCheckpointNotification] = useState<string | null>(null)
  const [systemLives, setSystemLives] = useState(5)
  const [timeUntilNextLife, setTimeUntilNextLife] = useState(0)

  const handleStart = () => {
    if (lifeSystemRef.current.getCurrentLives() <= 0) {
      alert("No lives available! Wait for them to refill.")
      return
    }
    lifeSystemRef.current.consumeLife()
    setSystemLives(lifeSystemRef.current.getCurrentLives())
    engineRef.current?.startLevel(0)
  }

  const handlePause = () => {
    if (gameState === "playing") {
      engineRef.current?.pause()
    } else if (gameState === "paused") {
      engineRef.current?.resume()
    }
  }

  const handleReset = () => {
    engineRef.current?.reset()
  }

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  useEffect(() => {
    const updateLives = () => {
      const lifeSystem = lifeSystemRef.current
      setSystemLives(lifeSystem.getCurrentLives())
      setTimeUntilNextLife(lifeSystem.getTimeUntilNextLife())
    }

    updateLives()
    const interval = setInterval(updateLives, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const dpr = window.devicePixelRatio || 1

    const width = Math.min(800, window.innerWidth - 32)
    const height = Math.min(600, window.innerHeight - 200)

    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`

    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.scale(dpr, dpr)
    }

    const engine = new GameEngine(canvas, (state, data) => {
      setGameState(state)

      if (state === "gameover") {
        onGameOver?.(data)
      } else if (state === "levelcomplete") {
        onLevelComplete?.(data)
      } else if (state === "playing" && data?.checkpoint) {
        setCheckpointNotification(`Checkpoint: ${data.checkpoint.name}!`)
        setTimeout(() => setCheckpointNotification(null), 3000)
      }
    })

    engineRef.current = engine

    const interval = setInterval(() => {
      if (engine.getGameState() === "playing") {
        setPlayerData(engine.getPlayerData())
      }
    }, 100)

    return () => {
      clearInterval(interval)
      engine.destroy()
    }
  }, [onGameOver, onLevelComplete])

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* HUD */}
      <Card className="w-full max-w-3xl p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-600" />
              <span className="font-bold text-lg">{playerData.score}</span>
            </div>
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-yellow-500" />
              <span className="font-bold text-lg">{playerData.coins}</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              <span className="font-bold text-lg">{playerData.lives}</span>
            </div>
            <div className="text-sm font-medium text-gray-700">{playerData.distance}m</div>
          </div>

          <div className="flex gap-2">
            {gameState === "playing" || gameState === "paused" ? (
              <>
                <Button size="sm" variant="outline" onClick={handlePause} className="gap-2 bg-transparent">
                  {gameState === "paused" ? (
                    <>
                      <Play className="w-4 h-4" /> Resume
                    </>
                  ) : (
                    <>
                      <Pause className="w-4 h-4" /> Pause
                    </>
                  )}
                </Button>
                <Button size="sm" variant="outline" onClick={handleReset} className="gap-2 bg-transparent">
                  <RotateCcw className="w-4 h-4" /> Reset
                </Button>
              </>
            ) : null}
          </div>
        </div>
      </Card>

      <Card className="w-full max-w-3xl p-4 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Heart className="w-6 h-6 text-red-500" />
            <div className="flex gap-1">
              {Array.from({ length: lifeSystemRef.current.getMaxLives() }).map((_, i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded border-2 ${
                    i < systemLives ? "bg-red-500 border-red-600" : "bg-gray-200 border-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="font-bold text-lg">
              {systemLives} / {lifeSystemRef.current.getMaxLives()}
            </span>
          </div>
          {systemLives < lifeSystemRef.current.getMaxLives() && (
            <div className="text-sm text-gray-600">
              Next life in: <span className="font-bold text-red-600">{formatTime(timeUntilNextLife)}</span>
            </div>
          )}
        </div>
      </Card>

      {/* Canvas */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="border-4 border-gray-800 rounded-lg shadow-2xl bg-sky-100"
          style={{ touchAction: "none" }}
        />

        {/* Checkpoint Notification */}
        {checkpointNotification && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg animate-bounce">
            {checkpointNotification}
          </div>
        )}

        {/* Game State Overlays */}
        {gameState === "menu" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-lg">
            <Card className="p-8 text-center space-y-4 max-w-md">
              <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">
                Sprite Runner
              </h2>
              <p className="text-gray-600">Swipe or use arrow keys to move, jump, and slide!</p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>← → or Swipe: Change lanes</p>
                <p>↑ or Swipe Up: Jump (press twice for double jump!)</p>
                <p>↓ or Swipe Down: Slide</p>
                <p className="flex items-center justify-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  Collect boosters for super jumps!
                </p>
              </div>
              <Button onClick={handleStart} size="lg" className="w-full" disabled={systemLives <= 0}>
                {systemLives > 0 ? "Start Game" : "No Lives Available"}
              </Button>
              {systemLives <= 0 && (
                <p className="text-sm text-red-600">Wait {formatTime(timeUntilNextLife)} for next life</p>
              )}
            </Card>
          </div>
        )}

        {gameState === "paused" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-lg">
            <Card className="p-8 text-center space-y-4">
              <h2 className="text-3xl font-bold">Paused</h2>
              <Button onClick={handlePause} size="lg">
                Resume
              </Button>
            </Card>
          </div>
        )}
      </div>

      {/* Mobile Controls Hint */}
      <div className="md:hidden text-center text-sm text-gray-500 px-4">
        Swipe on the canvas to control your character
      </div>
    </div>
  )
}
