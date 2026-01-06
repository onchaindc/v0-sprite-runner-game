# Farcaster Mini App Integration Guide

## Overview
This sprite runner game has been integrated as a Farcaster Mini App with on-chain payment gating for score reveal. Players must pay 0.00001 ETH to see their final score when playing inside the Farcaster environment.

## Architecture

### 1. Project Structure
```
├── farcaster.json                    # Farcaster Mini App manifest
├── lib/farcaster/
│   ├── wagmi-config.ts              # Wagmi configuration for Web3
│   └── farcaster-provider.tsx       # Farcaster SDK context provider
├── hooks/
│   └── use-pay-to-reveal.ts         # Custom hook for payment logic
└── components/
    └── game-over-modal.tsx           # Updated with payment gate
```

### 2. Key Components

#### Farcaster Provider (`lib/farcaster/farcaster-provider.tsx`)
- Initializes the Farcaster Frame SDK
- Detects if the app is running inside Farcaster
- Provides SDK context and user info to the entire app
- Signals SDK ready state with `sdk.actions.ready()`

#### Wagmi Configuration (`lib/farcaster/wagmi-config.ts`)
- Configures Web3 connections for Base, Mainnet, and Optimism
- Uses HTTP transports for RPC connections
- Provides SSR support for Next.js

#### Pay-to-Reveal Hook (`hooks/use-pay-to-reveal.ts`)
- Manages payment state and transaction flow
- Automatically reveals score if not in Farcaster (fallback behavior)
- Handles wallet connection via Farcaster SDK
- Switches to Base network for payments
- Sends 0.00001 ETH transaction to recipient address
- Tracks transaction status and reveals score on confirmation

#### Game Over Modal (`components/game-over-modal.tsx`)
- Shows payment gate when in Farcaster and score not revealed
- Displays "Connect Wallet" button if wallet not connected
- Shows "Pay to Reveal" button once connected
- Reveals full score stats after successful payment
- Falls back to immediate score display outside Farcaster

### 3. Payment Flow

1. **Game Ends**: Player finishes their run
2. **Environment Check**: App detects if running in Farcaster Mini App
3. **Payment Gate**: If in Farcaster, score is hidden behind payment
4. **Wallet Connection**: Player connects wallet via Farcaster SDK
5. **Transaction**: Player approves 0.00001 ETH payment on Base network
6. **Confirmation**: Transaction is confirmed on-chain
7. **Score Reveal**: Full stats (score, coins, distance) are displayed
8. **Leaderboard**: Player can submit their score to the leaderboard

### 4. Environment Detection

The app uses `useFarcaster()` hook to detect the environment:
- `isInFarcaster`: true if running inside Farcaster Mini App
- `isSDKLoaded`: true when SDK initialization is complete
- `context`: Farcaster frame context
- `user`: Farcaster user information

### 5. Fallback Support

When running outside Farcaster (e.g., in a browser):
- Payment gate is automatically bypassed
- Scores are immediately visible
- All game features work normally
- No wallet connection required

## Configuration

### Update Recipient Address
In `hooks/use-pay-to-reveal.ts`, replace the placeholder address:
```typescript
const RECIPIENT_ADDRESS = '0xYourAddressHere' // Replace with your actual address
```

### Update Farcaster Manifest
In `farcaster.json`, update with your actual URLs:
```json
{
  "iconUrl": "https://your-domain.com/icon.png",
  "splashImageUrl": "https://your-domain.com/splash.png",
  "homeUrl": "https://your-domain.com"
}
```

### Update Meta Tags
In `app/layout.tsx`, update the Open Graph image:
```typescript
'fc:frame:image': 'https://your-domain.com/og-image.png'
```

## Deployment

1. **Install Dependencies**:
```bash
npm install
```

2. **Build for Production**:
```bash
npm run build
```

3. **Deploy to Vercel** (or your hosting platform)

4. **Register with Farcaster**:
   - Ensure `farcaster.json` is accessible at your domain root
   - Submit your app to Farcaster for Mini App registration
   - Test in Farcaster client before public launch

## Testing

### Local Testing (Browser)
- Run `npm run dev`
- Game works normally without payment gate
- Scores are immediately visible

### Farcaster Testing
- Deploy to a public URL
- Open in Farcaster client
- Test wallet connection flow
- Verify payment transaction on Base testnet first
- Test score reveal after payment

## Security Considerations

1. **Transaction Verification**: In production, implement server-side verification of transactions
2. **Network Selection**: App automatically switches to Base network for payments
3. **Error Handling**: Comprehensive error messages for failed transactions
4. **Wallet Security**: Uses Farcaster's secure wallet provider

## Future Enhancements

- Server-side transaction verification API
- Database storage for verified payments
- NFT rewards for top scores
- Multi-chain support
- Dynamic pricing based on difficulty

## Support

For issues or questions:
- Check Farcaster Frame SDK docs: https://docs.farcaster.xyz/
- Wagmi documentation: https://wagmi.sh/
- Open an issue in the repository
