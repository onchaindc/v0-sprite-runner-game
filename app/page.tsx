import { GameContainer } from "@/components/game-container"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-100 via-orange-50 to-amber-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <GameContainer />
      </div>
    </main>
  )
}

