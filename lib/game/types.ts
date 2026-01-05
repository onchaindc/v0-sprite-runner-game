export interface Position {
  x: number
  y: number
}

export interface Size {
  width: number
  height: number
}

export interface Sprite {
  position: Position
  size: Size
  velocity: Position
  imageUrl?: string
}

export interface Player extends Sprite {
  lane: number // 0 = left, 1 = center, 2 = right
  isJumping: boolean
  isSliding: boolean
  jumpVelocity: number
  score: number
  coins: number
  lives: number
  canDoubleJump: boolean
  hasBooster: boolean
  boosterDuration: number
}

export interface Obstacle extends Sprite {
  type: "ground" | "air" | "barrier"
  passed: boolean
}

export interface Coin extends Sprite {
  collected: boolean
}

export interface PowerUp extends Sprite {
  type: "booster" | "health"
  collected: boolean
}

export interface Checkpoint {
  id: string
  distance: number
  name: string
  reached: boolean
  coinsRequired?: number
}

export interface Level {
  id: number
  name: string
  checkpoints: Checkpoint[]
  obstacleSpeed: number
  obstacleFrequency: number
  coinFrequency: number
}

export type GameState = "menu" | "playing" | "paused" | "gameover" | "levelcomplete"

export interface GameConfig {
  canvasWidth: number
  canvasHeight: number
  gravity: number
  jumpForce: number
  laneWidth: number
  playerSpeed: number
  initialObstacleSpeed: number
}
