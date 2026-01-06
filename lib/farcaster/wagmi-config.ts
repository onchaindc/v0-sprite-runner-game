"use client"

import { createConfig, http } from "wagmi"
import { base, mainnet, optimism } from "wagmi/chains"
import { QueryClient } from "@tanstack/react-query"

// Farcaster SDK will be initialized separately
export const wagmiConfig = createConfig({
  chains: [base, mainnet, optimism],
  transports: {
    [base.id]: http(),
    [mainnet.id]: http(),
    [optimism.id]: http(),
  },
  ssr: true,
})

export const queryClient = new QueryClient()
