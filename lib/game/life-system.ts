export class LifeSystem {
  private readonly STORAGE_KEY = "sprite-runner-lives"
  private readonly MAX_LIVES = 5
  private readonly REFILL_INTERVAL = 30 * 60 * 1000 // 30 minutes in milliseconds

  getCurrentLives(): number {
    const data = this.getLifeData()
    return Math.min(this.calculateCurrentLives(data), this.MAX_LIVES)
  }

  consumeLife(): boolean {
    const lives = this.getCurrentLives()
    if (lives <= 0) return false

    const data = this.getLifeData()
    data.currentLives = lives - 1
    data.lastUpdated = Date.now()
    this.saveLifeData(data)
    return true
  }

  getTimeUntilNextLife(): number {
    const data = this.getLifeData()
    const currentLives = this.calculateCurrentLives(data)

    if (currentLives >= this.MAX_LIVES) return 0

    const timeSinceUpdate = Date.now() - data.lastUpdated
    const timeForNextLife = this.REFILL_INTERVAL - (timeSinceUpdate % this.REFILL_INTERVAL)
    return timeForNextLife
  }

  getMaxLives(): number {
    return this.MAX_LIVES
  }

  private calculateCurrentLives(data: LifeData): number {
    const timePassed = Date.now() - data.lastUpdated
    const livesRestored = Math.floor(timePassed / this.REFILL_INTERVAL)
    return Math.min(data.currentLives + livesRestored, this.MAX_LIVES)
  }

  private getLifeData(): LifeData {
    if (typeof window === "undefined") {
      return { currentLives: this.MAX_LIVES, lastUpdated: Date.now() }
    }

    const data = localStorage.getItem(this.STORAGE_KEY)
    if (!data) {
      return { currentLives: this.MAX_LIVES, lastUpdated: Date.now() }
    }

    try {
      return JSON.parse(data)
    } catch {
      return { currentLives: this.MAX_LIVES, lastUpdated: Date.now() }
    }
  }

  private saveLifeData(data: LifeData) {
    if (typeof window === "undefined") return
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data))
  }

  resetLives() {
    this.saveLifeData({ currentLives: this.MAX_LIVES, lastUpdated: Date.now() })
  }
}

interface LifeData {
  currentLives: number
  lastUpdated: number
}
