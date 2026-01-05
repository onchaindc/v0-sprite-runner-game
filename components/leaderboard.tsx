"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Coins, Map, Medal, Crown } from "lucide-react"
import { GameStorage } from "@/lib/game/storage"
import { farcasterClient, type FarcasterScore } from "@/lib/farcaster/client"
import type { LeaderboardEntry } from "@/lib/game/storage"

const storage = new GameStorage()

export function Leaderboard() {
  const [localScores, setLocalScores] = useState<LeaderboardEntry[]>([])
  const [globalScores, setGlobalScores] = useState<FarcasterScore[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLeaderboards()
  }, [])

  const loadLeaderboards = async () => {
    setLoading(true)
    // Load local scores
    const local = storage.getTopScores(50)
    setLocalScores(local)

    // Load global scores
    const global = await farcasterClient.getGlobalLeaderboard(50)
    setGlobalScores(global)

    setLoading(false)
  }

  const getRankIcon = (index: number) => {
    if (index === 0) return <Crown className="w-5 h-5 text-yellow-500" />
    if (index === 1) return <Medal className="w-5 h-5 text-gray-400" />
    if (index === 2) return <Medal className="w-5 h-5 text-amber-700" />
    return null
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  return (
    <Card className="p-6 w-full max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="w-8 h-8 text-amber-600" />
        <h2 className="text-3xl font-bold">Leaderboard</h2>
      </div>

      <Tabs defaultValue="local" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="local">Local Scores</TabsTrigger>
          <TabsTrigger value="global">Global Scores</TabsTrigger>
        </TabsList>

        <TabsContent value="local" className="space-y-3">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading scores...</div>
          ) : localScores.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No scores yet. Play a game to get started!</div>
          ) : (
            <div className="space-y-2">
              {localScores.map((entry, index) => (
                <div
                  key={entry.id}
                  className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-colors ${
                    index < 3
                      ? "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-center w-8 h-8 font-bold text-lg">
                    {getRankIcon(index) || `${index + 1}`}
                  </div>

                  <div className="flex-1">
                    <div className="font-bold text-lg">{entry.playerName}</div>
                    <div className="text-sm text-gray-500">{formatDate(entry.timestamp)}</div>
                  </div>

                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-1">
                      <Trophy className="w-4 h-4 text-amber-600" />
                      <span className="font-bold">{entry.score}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Coins className="w-4 h-4 text-yellow-500" />
                      <span className="font-bold">{entry.coins}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Map className="w-4 h-4 text-blue-600" />
                      <span className="font-bold">{entry.distance}m</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="global" className="space-y-3">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading global scores...</div>
          ) : globalScores.length === 0 ? (
            <div className="text-center py-8 space-y-4">
              <p className="text-gray-500">No global scores yet. Be the first to submit!</p>
              <p className="text-sm text-gray-400">Connect your Farcaster account to compete globally</p>
            </div>
          ) : (
            <div className="space-y-2">
              {globalScores.map((entry, index) => (
                <div
                  key={`${entry.fid}-${entry.timestamp}`}
                  className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-colors ${
                    index < 3
                      ? "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-center w-8 h-8 font-bold text-lg">
                    {getRankIcon(index) || `${index + 1}`}
                  </div>

                  <div className="flex-1">
                    <div className="font-bold text-lg">{entry.username}</div>
                    <div className="text-sm text-gray-500">Level {entry.level}</div>
                  </div>

                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-1">
                      <Trophy className="w-4 h-4 text-amber-600" />
                      <span className="font-bold">{entry.score}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Coins className="w-4 h-4 text-yellow-500" />
                      <span className="font-bold">{entry.coins}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Map className="w-4 h-4 text-blue-600" />
                      <span className="font-bold">{entry.distance}m</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className="mt-6">
        <Button onClick={loadLeaderboards} variant="outline" className="w-full bg-transparent">
          Refresh Leaderboard
        </Button>
      </div>
    </Card>
  )
}
