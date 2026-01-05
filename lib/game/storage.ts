export interface LeaderboardEntry {
  id: string
  playerName: string
  score: number
  coins: number
  distance: number
  level: number
  timestamp: number
  farcasterFid?: string
}

export class GameStorage {
  private readonly LOCAL_STORAGE_KEY = "sprite-runner-leaderboard"
  private readonly SETTINGS_KEY = "sprite-runner-settings"

  // Local leaderboard methods
  saveScore(entry: Omit<LeaderboardEntry, "id" | "timestamp">): LeaderboardEntry {
    const newEntry: LeaderboardEntry = {
      ...entry,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    }

    const leaderboard = this.getLocalLeaderboard()
    leaderboard.push(newEntry)
    leaderboard.sort((a, b) => b.score - a.score)

    // Keep top 100 scores
    const topScores = leaderboard.slice(0, 100)
    localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(topScores))

    return newEntry
  }

  getLocalLeaderboard(): LeaderboardEntry[] {
    const data = localStorage.getItem(this.LOCAL_STORAGE_KEY)
    if (!data) return []

    try {
      return JSON.parse(data)
    } catch {
      return []
    }
  }

  getTopScores(limit = 10): LeaderboardEntry[] {
    return this.getLocalLeaderboard().slice(0, limit)
  }

  getPlayerBestScore(playerName: string): LeaderboardEntry | null {
    const scores = this.getLocalLeaderboard().filter(
      (entry) => entry.playerName.toLowerCase() === playerName.toLowerCase(),
    )
    return scores.length > 0 ? scores[0] : null
  }

  // Settings methods
  saveSettings(settings: { playerName?: string; soundEnabled?: boolean; musicEnabled?: boolean }) {
    const current = this.getSettings()
    const updated = { ...current, ...settings }
    localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(updated))
  }

  getSettings(): { playerName: string; soundEnabled: boolean; musicEnabled: boolean } {
    const data = localStorage.getItem(this.SETTINGS_KEY)
    if (!data) {
      return { playerName: "Player", soundEnabled: true, musicEnabled: true }
    }

    try {
      return JSON.parse(data)
    } catch {
      return { playerName: "Player", soundEnabled: true, musicEnabled: true }
    }
  }

  clearAllData() {
    localStorage.removeItem(this.LOCAL_STORAGE_KEY)
    localStorage.removeItem(this.SETTINGS_KEY)
  }
}
