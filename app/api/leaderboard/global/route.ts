import { type NextRequest, NextResponse } from "next/server"
import { globalScores } from "../submit/route"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    const topScores = globalScores.slice(0, Math.min(limit, 100))

    return NextResponse.json({ scores: topScores })
  } catch (error) {
    console.error("[v0] Error fetching global leaderboard:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
