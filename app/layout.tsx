"use client"; // Add this line to mark this as a client component

import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { WagmiProvider } from "wagmi";
import { QueryClientProvider } from "@tanstack/react-query";
import { wagmiConfig, queryClient } from "@/lib/farcaster/wagmi-config";
import { FarcasterProvider } from "@/lib/farcaster/farcaster-provider";
import sdk from "@farcaster/miniapp-sdk"; // Import Farcaster SDK
import { useEffect } from "react";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sprite Runner - Farcaster Mini App",
  description: "Play the endless runner game and compete on the leaderboard",
  generator: "v0.app",
  other: {
    "fc:frame": "vNext",
    "fc:frame:image": "https://your-domain.com/og-image.png",
    "fc:frame:button:1": "Play Game",
    "fc:frame:button:1:action": "link",
    "fc:frame:button:1:target": "https://your-domain.com",
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    async function initializeApp() {
      try {
        // Inform Farcaster that the app is ready to display
        await sdk.actions.ready();
        console.log("[Farcaster] App is now ready!");
      } catch (error) {
        console.error("[Farcaster] Error during app initialization:", error);
      }
    }
    initializeApp();
  }, []); // This effect runs once when the component is mounted

  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <WagmiProvider config={wagmiConfig}>
          <QueryClientProvider client={queryClient}>
            <FarcasterProvider>{children}</FarcasterProvider>
          </QueryClientProvider>
        </WagmiProvider>
        <Analytics />
      </body>
    </html>
  );
}
