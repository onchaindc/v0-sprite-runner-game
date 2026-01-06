"use client"

import { GameCanvas } from "./game-canvas"
import { GameOverModal } from "./game-over-modal"
import { LevelCompleteModal } from "./level-complete-modal"
import { useGame } from "@/hooks/use-game"
import { LEVELS } from "@/lib/game/constants"
import { MainMenu } from "./main-menu"
import { LevelSelector } from "./level-selector"
import { Leaderboard } from "./leaderboard"
import { Button } from "./ui/button"
import { ArrowLeft } from "lucide-react"

export function GameContainer() {
  const {
    currentView,
    unlockedLevels,
    selectedLevel,
    gameOverData,
    levelCompleteData,
    restartKey,
    handleStartGame,
    handleSelectLevel,
    handleGameOver,
    handleLevelComplete,
    handleSubmitScore,
    handleBackToMenu,
    handleShowLeaderboard,
    handleShowLevelSelect,
    handleNextLevel,
  } = useGame()

  if (currentView === "menu") {
    return (
      <MainMenu
        onStartGame={handleStartGame}
        onShowLevelSelect={handleShowLevelSelect}
        onShowLeaderboard={handleShowLeaderboard}
      />
    )
  }

  if (currentView === "levelselect") {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleBackToMenu} className="gap-2 bg-transparent">
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
          <h2 className="text-3xl font-bold">Select Level</h2>
        </div>
        <LevelSelector onSelectLevel={handleSelectLevel} unlockedLevels={unlockedLevels} />
      </div>
    )
  }

  if (currentView === "leaderboard") {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleBackToMenu} className="gap-2 bg-transparent">
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
        </div>
        <Leaderboard />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={handleBackToMenu} className="gap-2 bg-transparent">
          <ArrowLeft className="w-4 h-4" /> Back to Menu
        </Button>
        <h2 className="text-2xl font-bold">{LEVELS[selectedLevel].name}</h2>
      </div>

      <GameCanvas key={restartKey} onGameOver={handleGameOver} onLevelComplete={handleLevelComplete} />

      {gameOverData && (
        <GameOverModal
          score={gameOverData.score}
          coins={gameOverData.coins}
          distance={gameOverData.distance}
          onRestart={handleStartGame}
          onMenu={handleBackToMenu}
          onSubmitScore={handleSubmitScore}
        />
      )}

      {levelCompleteData && (
        <LevelCompleteModal
          level={levelCompleteData.level}
          score={levelCompleteData.score}
          coins={levelCompleteData.coins}
          onNextLevel={handleNextLevel}
          onMenu={handleBackToMenu}
          hasNextLevel={LEVELS.findIndex((l) => l.id === levelCompleteData.level.id) < LEVELS.length - 1}
        />
      )}
    </div>
  )
}
