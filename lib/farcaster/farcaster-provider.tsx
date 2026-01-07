"use client"

import { sdk } from "@farcaster/miniapp-sdk"
import { useEffect } from "react"

export function FarcasterProvider({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    async function init() {
      try {
        await sdk.actions.ready()
        console.log("✅ Farcaster Mini App ready() called")
      } catch (error) {
        console.error("❌ Farcaster Mini App ready() failed", error)
      }
    }

    init()
  }, [])

  return <>{children}</>
}
