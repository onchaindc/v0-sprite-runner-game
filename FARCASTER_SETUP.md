# Farcaster Mini App Setup Guide

## Overview
This sprite runner game is fully integrated with Farcaster as a Mini App with on-chain payment gating for score reveal.

## Features
- ✅ Farcaster Frame SDK integration
- ✅ Wagmi v2 for wallet connection
- ✅ On-chain payment gating (0.00001 ETH on Base)
- ✅ Transaction confirmation tracking
- ✅ Mobile-optimized for Warpcast
- ✅ Fallback for non-Farcaster environments

## Configuration

### 1. Update Payment Recipient Address
Edit `lib/farcaster/config.ts`:
```typescript
export const PAYMENT_CONFIG = {
  RECIPIENT_ADDRESS: "0xYOUR_WALLET_ADDRESS_HERE" as `0x${string}`,
  PAYMENT_AMOUNT: "0.00001",
  CHAIN_ID: 8453, // Base mainnet
}
```

### 2. Update farcaster.json
Replace the URLs in `farcaster.json` with your deployed domain:
- `homeUrl`: Your production URL
- `iconUrl`: Your app icon (256x256px recommended)
- `splashImageUrl`: Splash screen (1200x630px recommended)

### 3. Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### 4. Register with Farcaster
1. Go to https://warpcast.com/~/developers
2. Create a new Mini App
3. Upload your `farcaster.json` file
4. Submit your app URL
5. Wait for approval

## Payment Flow

1. **Game Over**: Player reaches game over screen
2. **Payment Gate**: If in Farcaster, score is hidden behind payment
3. **Connect Wallet**: Player connects Farcaster wallet
4. **Pay**: Player pays 0.00001 ETH on Base network
5. **Confirm**: Transaction is confirmed on-chain
6. **Reveal**: Score is revealed and player can save to leaderboard

## Testing

### Local Testing (Non-Farcaster)
```bash
npm run dev
```
- Scores will be visible immediately (no payment required)
- Full game functionality works

### Testing in Warpcast
1. Deploy to production
2. Share your app URL in a Warpcast cast
3. Click the cast to open in Mini App mode
4. Test the payment flow

## Network Configuration

- **Chain**: Base (Chain ID: 8453)
- **Payment Amount**: 0.00001 ETH
- **Required Balance**: ~0.0001 ETH (including gas)

## Troubleshooting

### Payment not working
- Ensure wallet has sufficient ETH on Base
- Check that RECIPIENT_ADDRESS is valid
- Verify you're on Base network

### SDK not loading
- Check browser console for errors
- Verify running inside Warpcast app
- Check Farcaster SDK version compatibility

### Transaction pending forever
- Check Base network status
- Verify gas settings
- Check wallet transaction history

## Environment Variables (Optional)

For production, you can add these to Vercel:
- `NEXT_PUBLIC_RECIPIENT_ADDRESS`: Override payment recipient
- `NEXT_PUBLIC_PAYMENT_AMOUNT`: Override payment amount

## Support

For issues with:
- **Game functionality**: Check GitHub issues
- **Farcaster integration**: https://docs.farcaster.xyz/
- **Wagmi/Viem**: https://wagmi.sh/
