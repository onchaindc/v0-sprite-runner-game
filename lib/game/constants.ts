import type { GameConfig, Level } from "./types"

export const GAME_CONFIG: GameConfig = {
  canvasWidth: 800,
  canvasHeight: 600,
  gravity: 0.8,
  jumpForce: -15,
  boosterJumpForce: -22,
  laneWidth: 100,
  playerSpeed: 5,
  initialObstacleSpeed: 5,
}

export const LEVELS: Level[] = [
  {
    id: 1,
    name: "Beginner Trail",
    checkpoints: [
      { id: "cp1-1", distance: 500, name: "First Steps", reached: false },
      { id: "cp1-2", distance: 1000, name: "Getting Started", reached: false, coinsRequired: 10 },
      { id: "cp1-3", distance: 1500, name: "Trail End", reached: false, coinsRequired: 25 },
    ],
    obstacleSpeed: 5,
    obstacleFrequency: 100,
    coinFrequency: 50,
  },
  {
    id: 2,
    name: "Runner's Path",
    checkpoints: [
      { id: "cp2-1", distance: 700, name: "Speed Up", reached: false, coinsRequired: 15 },
      { id: "cp2-2", distance: 1400, name: "Halfway Point", reached: false, coinsRequired: 35 },
      { id: "cp2-3", distance: 2100, name: "Path Complete", reached: false, coinsRequired: 55 },
    ],
    obstacleSpeed: 6.5,
    obstacleFrequency: 80,
    coinFrequency: 45,
  },
  {
    id: 3,
    name: "Champion Sprint",
    checkpoints: [
      { id: "cp3-1", distance: 900, name: "Elite Zone", reached: false, coinsRequired: 25 },
      { id: "cp3-2", distance: 1800, name: "Champion Mile", reached: false, coinsRequired: 50 },
      { id: "cp3-3", distance: 2700, name: "Victory Line", reached: false, coinsRequired: 80 },
    ],
    obstacleSpeed: 8,
    obstacleFrequency: 65,
    coinFrequency: 40,
  },
]

// Sprite asset URLs - these would be hosted on Vercel or another CDN
export const ASSET_URLS = {
  player: "/pixel-art-runner-character.jpg",
  playerJump: "/pixel-art-runner-jumping.jpg",
  playerSlide: "/pixel-art-runner-sliding.jpg",
  obstacleGround: "/pixel-art-rock-obstacle.png",
  obstacleAir: "/pixel-art-flying-obstacle.jpg",
  obstacleBarrier: "/pixel-art-wall-barrier.jpg",
  coin: "/mario-gold-coin.jpg",
  booster: "/power-up-booster.jpg",
  background: "/pixel-art-runner-background-path.jpg",
}
