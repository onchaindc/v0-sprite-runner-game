"use client"

import { WagmiProvider } from "wagmi"
import { QueryClientProvider } from "@tanstack/react-query"
import { wagmiConfig, queryClient } from "@/lib/farcaster/wagmi-config"
import { FarcasterProvider } from "@/lib/farcaster/farcaster-provider"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <FarcasterProvider>
          {children}
        </FarcasterProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}