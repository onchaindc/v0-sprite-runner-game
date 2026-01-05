import type { Player, Obstacle, Coin, GameState, Level, Sprite, PowerUp } from "./types"
import { GAME_CONFIG, LEVELS, ASSET_URLS } from "./constants"

export class GameEngine {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private gameState: GameState = "menu"
  private player: Player
  private obstacles: Obstacle[] = []
  private coins: Coin[] = []
  private powerups: PowerUp[] = []
  private currentLevel: Level
  private currentLevelIndex = 0
  private distance = 0
  private frameCount = 0
  private coinAnimationFrame = 0
  private keys: Set<string> = new Set()
  private touches: Map<number, { startX: number; startY: number }> = new Map()
  private animationFrameId: number | null = null
  private images: Map<string, HTMLImageElement> = new Map()
  private onStateChange?: (state: GameState, data?: any) => void

  constructor(canvas: HTMLCanvasElement, onStateChange?: (state: GameState, data?: any) => void) {
    this.canvas = canvas
    this.ctx = canvas.getContext("2d")!
    this.onStateChange = onStateChange
    this.currentLevel = LEVELS[0]
    this.player = this.createPlayer()
    this.setupEventListeners()
    this.preloadImages()
  }

  private preloadImages() {
    Object.entries(ASSET_URLS).forEach(([key, url]) => {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.src = url
      this.images.set(key, img)
    })
  }

  private createPlayer(): Player {
    return {
      position: { x: 150, y: GAME_CONFIG.canvasHeight - 150 },
      size: { width: 40, height: 60 },
      velocity: { x: 0, y: 0 },
      lane: 1,
      isJumping: false,
      isSliding: false,
      jumpVelocity: 0,
      score: 0,
      coins: 0,
      lives: 3,
      canDoubleJump: false,
      hasBooster: false,
      boosterDuration: 0,
      imageUrl: ASSET_URLS.player,
    }
  }

  private setupEventListeners() {
    window.addEventListener("keydown", (e) => {
      this.keys.add(e.key)
      this.handleKeyPress(e.key)
    })
    window.addEventListener("keyup", (e) => this.keys.delete(e.key))

    this.canvas.addEventListener("touchstart", (e) => this.handleTouchStart(e))
    this.canvas.addEventListener("touchmove", (e) => this.handleTouchMove(e))
    this.canvas.addEventListener("touchend", (e) => this.handleTouchEnd(e))
  }

  private handleKeyPress(key: string) {
    if (this.gameState !== "playing") return

    switch (key) {
      case "ArrowLeft":
      case "a":
        this.moveLane(-1)
        break
      case "ArrowRight":
      case "d":
        this.moveLane(1)
        break
      case "ArrowUp":
      case "w":
      case " ":
        this.jump()
        break
      case "ArrowDown":
      case "s":
        this.slide()
        break
    }
  }

  private handleTouchStart(e: TouchEvent) {
    e.preventDefault()
    Array.from(e.changedTouches).forEach((touch) => {
      this.touches.set(touch.identifier, {
        startX: touch.clientX,
        startY: touch.clientY,
      })
    })
  }

  private handleTouchMove(e: TouchEvent) {
    e.preventDefault()
  }

  private handleTouchEnd(e: TouchEvent) {
    e.preventDefault()
    if (this.gameState !== "playing") return

    Array.from(e.changedTouches).forEach((touch) => {
      const start = this.touches.get(touch.identifier)
      if (!start) return

      const deltaX = touch.clientX - start.startX
      const deltaY = touch.clientY - start.startY
      const threshold = 30

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (Math.abs(deltaX) > threshold) {
          this.moveLane(deltaX > 0 ? 1 : -1)
        }
      } else {
        // Vertical swipe
        if (Math.abs(deltaY) > threshold) {
          if (deltaY < 0) {
            this.jump()
          } else {
            this.slide()
          }
        }
      }

      this.touches.delete(touch.identifier)
    })
  }

  private moveLane(direction: number) {
    const newLane = Math.max(0, Math.min(2, this.player.lane + direction))
    if (newLane !== this.player.lane) {
      this.player.lane = newLane
      this.player.position.x = 150 + this.player.lane * GAME_CONFIG.laneWidth
    }
  }

  private jump() {
    if (!this.player.isJumping && !this.player.isSliding) {
      // First jump
      this.player.isJumping = true
      const jumpForce = this.player.hasBooster ? GAME_CONFIG.boosterJumpForce : GAME_CONFIG.jumpForce
      this.player.velocity.y = jumpForce
      this.player.canDoubleJump = true
    } else if (this.player.canDoubleJump && this.player.isJumping) {
      // Double jump
      const jumpForce = this.player.hasBooster ? GAME_CONFIG.boosterJumpForce : GAME_CONFIG.jumpForce
      this.player.velocity.y = jumpForce
      this.player.canDoubleJump = false
    }
  }

  private slide() {
    if (!this.player.isJumping && !this.player.isSliding) {
      this.player.isSliding = true
      this.player.size.height = 40
      setTimeout(() => {
        this.player.isSliding = false
        this.player.size.height = 60
      }, 500)
    }
  }

  public start() {
    this.gameState = "playing"
    this.onStateChange?.("playing")
    this.gameLoop()
  }

  public pause() {
    this.gameState = "paused"
    this.onStateChange?.("paused")
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = null
    }
  }

  public resume() {
    this.gameState = "playing"
    this.onStateChange?.("playing")
    this.gameLoop()
  }

  public reset() {
    this.player = this.createPlayer()
    this.obstacles = []
    this.coins = []
    this.powerups = []
    this.distance = 0
    this.frameCount = 0
    this.currentLevelIndex = 0
    this.currentLevel = LEVELS[0]
    this.gameState = "menu"
    this.onStateChange?.("menu")
  }

  public startLevel(levelIndex: number) {
    if (levelIndex >= 0 && levelIndex < LEVELS.length) {
      this.currentLevelIndex = levelIndex
      this.currentLevel = { ...LEVELS[levelIndex] }
      this.currentLevel.checkpoints = this.currentLevel.checkpoints.map((cp) => ({ ...cp, reached: false }))
      this.player = this.createPlayer()
      this.obstacles = []
      this.coins = []
      this.powerups = []
      this.distance = 0
      this.frameCount = 0
      this.start()
    }
  }

  private gameLoop = () => {
    if (this.gameState !== "playing") return

    this.update()
    this.render()
    this.animationFrameId = requestAnimationFrame(this.gameLoop)
  }

  private update() {
    this.frameCount++
    this.distance += this.currentLevel.obstacleSpeed

    if (this.frameCount % 8 === 0) {
      this.coinAnimationFrame = (this.coinAnimationFrame + 1) % 4
    }

    if (this.player.hasBooster) {
      this.player.boosterDuration--
      if (this.player.boosterDuration <= 0) {
        this.player.hasBooster = false
      }
    }

    if (this.player.isJumping) {
      this.player.velocity.y += GAME_CONFIG.gravity
      this.player.position.y += this.player.velocity.y

      const groundY = GAME_CONFIG.canvasHeight - 150
      if (this.player.position.y >= groundY) {
        this.player.position.y = groundY
        this.player.velocity.y = 0
        this.player.isJumping = false
        this.player.canDoubleJump = false
      }
    }

    if (this.frameCount % this.currentLevel.obstacleFrequency === 0) {
      this.spawnObstacle()
    }

    if (this.frameCount % this.currentLevel.coinFrequency === 0) {
      this.spawnCoin()
    }

    if (this.frameCount % 300 === 0 && Math.random() > 0.5) {
      this.spawnPowerUp()
    }

    this.obstacles = this.obstacles.filter((obstacle) => {
      obstacle.position.x -= this.currentLevel.obstacleSpeed

      if (!obstacle.passed && obstacle.position.x < this.player.position.x) {
        obstacle.passed = true
        this.player.score += 10
      }

      return obstacle.position.x > -obstacle.size.width
    })

    this.coins = this.coins.filter((coin) => {
      coin.position.x -= this.currentLevel.obstacleSpeed
      return coin.position.x > -coin.size.width
    })

    this.powerups = this.powerups.filter((powerup) => {
      powerup.position.x -= this.currentLevel.obstacleSpeed
      return powerup.position.x > -powerup.size.width
    })

    this.checkCollisions()

    this.checkCheckpoints()

    const lastCheckpoint = this.currentLevel.checkpoints[this.currentLevel.checkpoints.length - 1]
    if (lastCheckpoint.reached && this.distance > lastCheckpoint.distance + 200) {
      this.completeLevel()
    }

    if (this.frameCount % 600 === 0) {
      this.currentLevel.obstacleSpeed = Math.min(this.currentLevel.obstacleSpeed + 0.1, 12)
    }
  }

  private spawnObstacle() {
    const lane = Math.floor(Math.random() * 3)
    const types: Array<"ground" | "air" | "barrier"> = ["ground", "air", "barrier"]
    const type = types[Math.floor(Math.random() * types.length)]

    let y: number
    let height: number

    if (type === "ground") {
      height = 50
      y = GAME_CONFIG.canvasHeight - 150
    } else if (type === "air") {
      height = 50
      y = GAME_CONFIG.canvasHeight - 250
    } else {
      height = 80
      y = GAME_CONFIG.canvasHeight - 150 - 80
    }

    this.obstacles.push({
      position: { x: GAME_CONFIG.canvasWidth, y },
      size: { width: 50, height },
      velocity: { x: 0, y: 0 },
      type,
      passed: false,
      imageUrl: ASSET_URLS[`obstacle${type.charAt(0).toUpperCase() + type.slice(1)}` as keyof typeof ASSET_URLS],
    })
  }

  private spawnCoin() {
    const lane = Math.floor(Math.random() * 3)
    const y = GAME_CONFIG.canvasHeight - 200 - Math.random() * 100

    this.coins.push({
      position: { x: GAME_CONFIG.canvasWidth, y },
      size: { width: 30, height: 30 },
      velocity: { x: 0, y: 0 },
      collected: false,
      imageUrl: ASSET_URLS.coin,
    })
  }

  private spawnPowerUp() {
    const lane = Math.floor(Math.random() * 3)
    const x = 150 + lane * GAME_CONFIG.laneWidth
    const y = GAME_CONFIG.canvasHeight - 180

    this.powerups.push({
      position: { x: GAME_CONFIG.canvasWidth, y },
      size: { width: 35, height: 35 },
      velocity: { x: 0, y: 0 },
      type: "booster",
      collected: false,
      imageUrl: ASSET_URLS.booster,
    })
  }

  private checkCollisions() {
    for (const obstacle of this.obstacles) {
      if (this.isColliding(this.player, obstacle)) {
        this.player.lives--
        this.obstacles = this.obstacles.filter((o) => o !== obstacle)

        if (this.player.lives <= 0) {
          this.gameOver()
        }
      }
    }

    for (const coin of this.coins) {
      if (!coin.collected && this.isColliding(this.player, coin)) {
        coin.collected = true
        this.player.coins++
        this.player.score += 5
        this.coins = this.coins.filter((c) => c !== coin)
      }
    }

    for (const powerup of this.powerups) {
      if (!powerup.collected && this.isColliding(this.player, powerup)) {
        powerup.collected = true
        if (powerup.type === "booster") {
          this.player.hasBooster = true
          this.player.boosterDuration = 300
          this.player.score += 20
        }
        this.powerups = this.powerups.filter((p) => p !== powerup)
      }
    }
  }

  private isColliding(a: Sprite, b: Sprite): boolean {
    return (
      a.position.x < b.position.x + b.size.width &&
      a.position.x + a.size.width > b.position.x &&
      a.position.y < b.position.y + b.size.height &&
      a.position.y + a.size.height > b.position.y
    )
  }

  private checkCheckpoints() {
    for (const checkpoint of this.currentLevel.checkpoints) {
      if (!checkpoint.reached && this.distance >= checkpoint.distance) {
        if (!checkpoint.coinsRequired || this.player.coins >= checkpoint.coinsRequired) {
          checkpoint.reached = true
          this.onStateChange?.("playing", { checkpoint })
        }
      }
    }
  }

  private completeLevel() {
    this.gameState = "levelcomplete"
    this.onStateChange?.("levelcomplete", {
      level: this.currentLevel,
      score: this.player.score,
      coins: this.player.coins,
    })
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = null
    }
  }

  private gameOver() {
    this.gameState = "gameover"
    this.onStateChange?.("gameover", {
      score: this.player.score,
      coins: this.player.coins,
      distance: Math.floor(this.distance),
    })
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = null
    }
  }

  private render() {
    this.ctx.clearRect(0, 0, GAME_CONFIG.canvasWidth, GAME_CONFIG.canvasHeight)

    this.ctx.fillStyle = "#87CEEB"
    this.ctx.fillRect(0, 0, GAME_CONFIG.canvasWidth, GAME_CONFIG.canvasHeight)

    this.ctx.fillStyle = "#8B7355"
    this.ctx.fillRect(0, GAME_CONFIG.canvasHeight - 100, GAME_CONFIG.canvasWidth, 100)

    this.ctx.strokeStyle = "#FFFFFF"
    this.ctx.lineWidth = 2
    for (let i = 1; i < 3; i++) {
      const x = 150 + i * GAME_CONFIG.laneWidth
      this.ctx.setLineDash([10, 10])
      this.ctx.beginPath()
      this.ctx.moveTo(x, GAME_CONFIG.canvasHeight - 150)
      this.ctx.lineTo(x, GAME_CONFIG.canvasHeight - 100)
      this.ctx.stroke()
    }
    this.ctx.setLineDash([])

    this.obstacles.forEach((obstacle) => this.drawSprite(obstacle))

    this.coins.forEach((coin) => this.drawCoin(coin))

    this.powerups.forEach((powerup) => this.drawPowerUp(powerup))

    const playerImage = this.player.isJumping ? "playerJump" : this.player.isSliding ? "playerSlide" : "player"
    if (this.player.hasBooster) {
      this.ctx.shadowColor = "#FFD700"
      this.ctx.shadowBlur = 20
    }
    this.drawSprite({ ...this.player, imageUrl: ASSET_URLS[playerImage as keyof typeof ASSET_URLS] })
    this.ctx.shadowBlur = 0

    this.drawHUD()
  }

  private drawSprite(sprite: Sprite) {
    if (sprite.imageUrl) {
      const img = this.images.get(Object.entries(ASSET_URLS).find(([_, url]) => url === sprite.imageUrl)?.[0] || "")
      if (img && img.complete) {
        this.ctx.drawImage(img, sprite.position.x, sprite.position.y, sprite.size.width, sprite.size.height)
        return
      }
    }

    this.ctx.fillStyle = "#FF6B6B"
    this.ctx.fillRect(sprite.position.x, sprite.position.y, sprite.size.width, sprite.size.height)
  }

  private drawCoin(coin: Coin) {
    const img = this.images.get("coin")
    if (img && img.complete) {
      const scaleFactors = [1, 0.7, 0.3, 0.7]
      const scale = scaleFactors[this.coinAnimationFrame]
      const width = coin.size.width * scale
      const x = coin.position.x + (coin.size.width - width) / 2

      this.ctx.save()
      this.ctx.fillStyle = "#FFD700"
      this.ctx.beginPath()
      this.ctx.ellipse(
        coin.position.x + coin.size.width / 2,
        coin.position.y + coin.size.height / 2,
        width / 2,
        coin.size.height / 2,
        0,
        0,
        Math.PI * 2,
      )
      this.ctx.fill()
      this.ctx.strokeStyle = "#FFA500"
      this.ctx.lineWidth = 2
      this.ctx.stroke()
      this.ctx.restore()
    } else {
      this.ctx.fillStyle = "#FFD700"
      this.ctx.beginPath()
      this.ctx.arc(
        coin.position.x + coin.size.width / 2,
        coin.position.y + coin.size.height / 2,
        coin.size.width / 2,
        0,
        Math.PI * 2,
      )
      this.ctx.fill()
    }
  }

  private drawPowerUp(powerup: PowerUp) {
    const img = this.images.get("booster")
    if (img && img.complete) {
      this.ctx.drawImage(img, powerup.position.x, powerup.position.y, powerup.size.width, powerup.size.height)
    } else {
      this.ctx.fillStyle = "#FFD700"
      this.ctx.strokeStyle = "#FF8C00"
      this.ctx.lineWidth = 2
      this.ctx.beginPath()
      this.ctx.moveTo(powerup.position.x + powerup.size.width / 2, powerup.position.y)
      this.ctx.lineTo(powerup.position.x + powerup.size.width * 0.4, powerup.position.y + powerup.size.height * 0.5)
      this.ctx.lineTo(powerup.position.x + powerup.size.width * 0.6, powerup.position.y + powerup.size.height * 0.5)
      this.ctx.lineTo(powerup.position.x + powerup.size.width / 2, powerup.position.y + powerup.size.height)
      this.ctx.lineTo(powerup.position.x + powerup.size.width * 0.6, powerup.position.y + powerup.size.height * 0.6)
      this.ctx.lineTo(powerup.position.x + powerup.size.width * 0.4, powerup.position.y + powerup.size.height * 0.6)
      this.ctx.closePath()
      this.ctx.fill()
      this.ctx.stroke()
    }
  }

  private drawHUD() {
    this.ctx.fillStyle = "#000000"
    this.ctx.font = "bold 20px sans-serif"
    this.ctx.fillText(`Score: ${this.player.score}`, 10, 30)
    this.ctx.fillText(`Coins: ${this.player.coins}`, 10, 60)
    this.ctx.fillText(`Lives: ${this.player.lives}`, 10, 90)
    this.ctx.fillText(`Distance: ${Math.floor(this.distance)}m`, 10, 120)

    if (this.player.hasBooster) {
      this.ctx.fillStyle = "#FFD700"
      this.ctx.fillText(`BOOSTER! ${Math.ceil(this.player.boosterDuration / 60)}s`, 10, 150)
    }

    const nextCheckpoint = this.currentLevel.checkpoints.find((cp) => !cp.reached)
    if (nextCheckpoint) {
      this.ctx.fillStyle = "#000000"
      this.ctx.fillText(
        `Next: ${nextCheckpoint.name} (${nextCheckpoint.distance}m)`,
        10,
        this.player.hasBooster ? 180 : 150,
      )
    }
  }

  public getPlayerData() {
    return {
      score: this.player.score,
      coins: this.player.coins,
      lives: this.player.lives,
      distance: Math.floor(this.distance),
      level: this.currentLevel,
    }
  }

  public getCurrentLevel() {
    return this.currentLevelIndex
  }

  public getGameState() {
    return this.gameState
  }

  public destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId)
    }
    window.removeEventListener("keydown", () => {})
    window.removeEventListener("keyup", () => {})
  }
}
