import { type NextRequest, NextResponse } from "next/server"
import { globalScores } from "../../submit/route"

export async function GET(request: NextRequest, { params }: { params: Promise<{ fid: string }> }) {
  try {
    const { fid } = await params
    const userScores = globalScores.filter((score) => score.fid === fid)

    // Sort by score descending
    userScores.sort((a, b) => b.score - a.score)

    return NextResponse.json({ scores: userScores })
  } catch (error) {
    console.error("[v0] Error fetching user scores:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
