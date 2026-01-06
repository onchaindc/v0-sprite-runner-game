"use client"

import { type ReactNode, createContext, useContext, useEffect, useState } from "react"

interface FarcasterContextType {
  isSDKLoaded: boolean
  context: any
  user: any
  isInFarcaster: boolean
}

const FarcasterContext = createContext<FarcasterContextType>({
  isSDKLoaded: false,
  context: null,
  user: null,
  isInFarcaster: false,
})

function isInFarcasterFrame(): boolean {
  if (typeof window === "undefined") return false

  // Check if we're in an iframe (Farcaster frames run in iframes)
  if (window.self === window.top) return false

  // Check for Farcaster-specific query parameters or parent frame
  const params = new URLSearchParams(window.location.search)
  const hasFarcasterParams = params.has("fid") || params.has("fc")

  // Check for Farcaster parent origin
  try {
    const parentOrigin = document.referrer
    const isFarcasterOrigin =
      parentOrigin.includes("warpcast.com") ||
      parentOrigin.includes("farcaster.xyz") ||
      parentOrigin.includes("far.quest")
    return hasFarcasterParams || isFarcasterOrigin
  } catch (e) {
    return hasFarcasterParams
  }
}

export function FarcasterProvider({ children }: { children: ReactNode }) {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false)
  const [context, setContext] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [isInFarcaster, setIsInFarcaster] = useState(false)

  useEffect(() => {
    const initSDK = async () => {
      const inFrame = isInFarcasterFrame()

      if (!inFrame) {
        console.log("[v0] Not in Farcaster frame - skipping SDK initialization")
        setIsInFarcaster(false)
        setIsSDKLoaded(true)
        return
      }

      try {
        // Dynamically import SDK only when needed
        const { default: sdk } = await import("@farcaster/frame-sdk")

        // Initialize Farcaster SDK
        const ctx = await sdk.context
        setContext(ctx)
        setIsInFarcaster(true)

        // Get user info
        if (ctx?.user) {
          setUser(ctx.user)
        }

        // Signal SDK is ready
        sdk.actions.ready()
        setIsSDKLoaded(true)
        console.log("[v0] Farcaster SDK initialized successfully")
      } catch (error) {
        // Not in Farcaster environment or SDK failed to load
        console.log("[v0] Farcaster SDK initialization failed:", error)
        setIsInFarcaster(false)
        setIsSDKLoaded(true)
      }
    }

    initSDK()
  }, [])

  return (
    <FarcasterContext.Provider value={{ isSDKLoaded, context, user, isInFarcaster }}>
      {children}
    </FarcasterContext.Provider>
  )
}

export function useFarcaster() {
  const context = useContext(FarcasterContext)
  if (!context) {
    throw new Error("useFarcaster must be used within FarcasterProvider")
  }
  return context
}
