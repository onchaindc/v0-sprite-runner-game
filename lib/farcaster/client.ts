export interface FarcasterScore {
  fid: string
  username: string
  score: number
  coins: number
  distance: number
  level: number
  timestamp: number
}

export class FarcasterClient {
  private apiEndpoint = "/api/leaderboard"

  async submitScore(data: {
    fid: string
    username: string
    score: number
    coins: number
    distance: number
    level: number
  }): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.apiEndpoint}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        return { success: false, error: error.message || "Failed to submit score" }
      }

      return { success: true }
    } catch (error) {
      console.error("[v0] Error submitting score to Farcaster:", error)
      return { success: false, error: "Network error" }
    }
  }

  async getGlobalLeaderboard(limit = 50): Promise<FarcasterScore[]> {
    try {
      const response = await fetch(`${this.apiEndpoint}/global?limit=${limit}`)

      if (!response.ok) {
        console.error("[v0] Failed to fetch global leaderboard")
        return []
      }

      const data = await response.json()
      return data.scores || []
    } catch (error) {
      console.error("[v0] Error fetching global leaderboard:", error)
      return []
    }
  }

  async getUserScores(fid: string): Promise<FarcasterScore[]> {
    try {
      const response = await fetch(`${this.apiEndpoint}/user/${fid}`)

      if (!response.ok) {
        return []
      }

      const data = await response.json()
      return data.scores || []
    } catch (error) {
      console.error("[v0] Error fetching user scores:", error)
      return []
    }
  }
}

export const farcasterClient = new FarcasterClient()
