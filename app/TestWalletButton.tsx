"use client";

import { sdk } from "@farcaster/miniapp-sdk";

export default function TestWalletButton() {
  async function testTx() {
    // @ts-ignore — Farcaster SDK types are incomplete, runtime is correct
    const wallet = await sdk.wallet.getWalletClient();

    if (!wallet) {
      console.error("Wallet not available");
      return;
    }

    await wallet.sendTransaction({
      to: "0x000000000000000000000000000000000000dead",
      value: BigInt(1),
    });
  }

  return (
    <button
      onClick={testTx}
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        padding: "12px 16px",
        background: "black",
        color: "white",
        zIndex: 9999,
      }}
    >
      Test Wallet Popup
    </button>
  );
}

