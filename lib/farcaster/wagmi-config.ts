"use client"

import { createConfig, http } from "wagmi"
import { base } from "wagmi/chains"
import { QueryClient } from "@tanstack/react-query"
import { farcasterMiniApp } from "@farcaster/miniapp-wagmi-connector"

// Configure Wagmi to use the Farcaster Mini App connector
export const wagmiConfig = createConfig({
  chains: [base], // only Base chain for Mini App
  transports: {
    [base.id]: http(),
  },
  connectors: [
    farcasterMiniApp(), // ← this allows connecting to the user's wallet
  ],
  ssr: true, // keep if you need server-side rendering
})

export const queryClient = new QueryClient()
