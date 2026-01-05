"use client"

import { useState, useCallback } from "react"
import { GameStorage } from "@/lib/game/storage"
import { LEVELS } from "@/lib/game/constants"

const storage = new GameStorage()

export function useGame() {
  const [unlockedLevels, setUnlockedLevels] = useState(0)
  const [currentView, setCurrentView] = useState<"menu" | "levelselect" | "playing" | "leaderboard">("menu")
  const [selectedLevel, setSelectedLevel] = useState(0)
  const [gameOverData, setGameOverData] = useState<{ score: number; coins: number; distance: number } | null>(null)
  const [levelCompleteData, setLevelCompleteData] = useState<{
    level: any
    score: number
    coins: number
  } | null>(null)

  const handleStartGame = useCallback(() => {
    setCurrentView("playing")
    setGameOverData(null)
    setLevelCompleteData(null)
  }, [])

  const handleSelectLevel = useCallback((levelIndex: number) => {
    setSelectedLevel(levelIndex)
    setCurrentView("playing")
    setGameOverData(null)
    setLevelCompleteData(null)
  }, [])

  const handleGameOver = useCallback((data: { score: number; coins: number; distance: number }) => {
    setGameOverData(data)
  }, [])

  const handleLevelComplete = useCallback((data: { level: any; score: number; coins: number }) => {
    setLevelCompleteData(data)

    // Unlock next level
    const nextLevelIndex = LEVELS.findIndex((l) => l.id === data.level.id)
    if (nextLevelIndex >= 0 && nextLevelIndex + 1 < LEVELS.length) {
      setUnlockedLevels((prev) => Math.max(prev, nextLevelIndex + 1))
    }
  }, [])

  const handleSubmitScore = useCallback(
    (playerName: string) => {
      if (gameOverData) {
        storage.saveScore({
          playerName,
          score: gameOverData.score,
          coins: gameOverData.coins,
          distance: gameOverData.distance,
          level: selectedLevel + 1,
        })
      }
    },
    [gameOverData, selectedLevel],
  )

  const handleBackToMenu = useCallback(() => {
    setCurrentView("menu")
    setGameOverData(null)
    setLevelCompleteData(null)
  }, [])

  const handleShowLeaderboard = useCallback(() => {
    setCurrentView("leaderboard")
  }, [])

  const handleShowLevelSelect = useCallback(() => {
    setCurrentView("levelselect")
  }, [])

  const handleNextLevel = useCallback(() => {
    if (levelCompleteData) {
      const nextLevelIndex = LEVELS.findIndex((l) => l.id === levelCompleteData.level.id) + 1
      if (nextLevelIndex < LEVELS.length) {
        setSelectedLevel(nextLevelIndex)
        setLevelCompleteData(null)
        setCurrentView("playing")
      }
    }
  }, [levelCompleteData])

  return {
    currentView,
    unlockedLevels,
    selectedLevel,
    gameOverData,
    levelCompleteData,
    handleStartGame,
    handleSelectLevel,
    handleGameOver,
    handleLevelComplete,
    handleSubmitScore,
    handleBackToMenu,
    handleShowLeaderboard,
    handleShowLevelSelect,
    handleNextLevel,
  }
}
