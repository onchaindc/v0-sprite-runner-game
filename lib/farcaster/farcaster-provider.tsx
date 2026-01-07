"use client"

import { sdk } from "@farcaster/miniapp-sdk"
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"

interface FarcasterContextType {
  isReady: boolean
}

const FarcasterContext = createContext<FarcasterContextType | null>(null)

export function FarcasterProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    async function init() {
      try {
        await sdk.actions.ready()
        console.log("✅ Farcaster Mini App ready() called")
        setIsReady(true)
      } catch (error) {
        console.error("❌ Farcaster Mini App ready() failed", error)
        setIsReady(true) // unblock app even if SDK fails
      }
    }

    init()
  }, [])

  return (
    <FarcasterContext.Provider value={{ isReady }}>
      {children}
    </FarcasterContext.Provider>
  )
}

export function useFarcaster() {
  const ctx = useContext(FarcasterContext)
  if (!ctx) {
    throw new Error("useFarcaster must be used inside FarcasterProvider")
  }
  return ctx
}
