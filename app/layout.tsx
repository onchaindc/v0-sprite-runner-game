import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

import { WagmiProvider } from "wagmi"
import { QueryClientProvider } from "@tanstack/react-query"
import { wagmiConfig, queryClient } from "@/lib/farcaster/wagmi-config"
import { FarcasterProvider } from "@/lib/farcaster/farcaster-provider"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sprite Runner - Farcaster Mini App",
  description: "Play the endless runner game and compete on the leaderboard",
  generator: "v0.app",
  other: {
    "base:app_id": "695ef0cf646908900bbdae0e",
    "fc:miniapp": JSON.stringify({
      version: "1",
      imageUrl: "https://v0-sprite-runner-game.vercel.app/og-image.png",
      button: {
        title: "Play Game",
        action: {
          type: "launch_frame",
          name: "Sprite Runner",
          url: "https://v0-sprite-runner-game.vercel.app/",
          splashImageUrl: "https://v0-sprite-runner-game.vercel.app/icon.png",
          splashBackgroundColor: "#FFF7ED",
        },
      },
    }),
  },
  icons: {
    icon: [
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {/* ✅ Correct provider order */}
        <WagmiProvider config={wagmiConfig}>
          <QueryClientProvider client={queryClient}>
            <FarcasterProvider>
              {children}
            </FarcasterProvider>
          </QueryClientProvider>
        </WagmiProvider>

        <Analytics />
      </body>
    </html>
  )
}