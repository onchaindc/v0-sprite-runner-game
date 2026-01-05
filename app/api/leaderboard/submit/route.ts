import { type NextRequest, NextResponse } from "next/server"

// In-memory storage for demo purposes
// In production, this would be a database
const globalScores: Array<{
  fid: string
  username: string
  score: number
  coins: number
  distance: number
  level: number
  timestamp: number
}> = []

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fid, username, score, coins, distance, level } = body

    if (!fid || !username || typeof score !== "number") {
      return NextResponse.json({ message: "Invalid data" }, { status: 400 })
    }

    // Add score to global leaderboard
    globalScores.push({
      fid,
      username,
      score,
      coins,
      distance,
      level,
      timestamp: Date.now(),
    })

    // Sort by score descending
    globalScores.sort((a, b) => b.score - a.score)

    // Keep top 1000 scores
    if (globalScores.length > 1000) {
      globalScores.splice(1000)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error submitting score:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// Export global scores for other routes to access
export { globalScores }
