export class SoundSystem {
  private audioContext: AudioContext | null = null
  private isMuted = false
  private bgMusic: AudioBufferSourceNode | null = null
  private musicGainNode: GainNode | null = null

  constructor() {
    if (typeof window !== "undefined" && window.AudioContext) {
      this.audioContext = new AudioContext()
      this.musicGainNode = this.audioContext.createGain()
      this.musicGainNode.gain.value = 0.3
      this.musicGainNode.connect(this.audioContext.destination)
    }
  }

  private createTone(frequency: number, duration: number, volume = 0.3) {
    if (!this.audioContext || this.isMuted) return

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    oscillator.frequency.value = frequency
    gainNode.gain.value = volume

    oscillator.start()
    oscillator.stop(this.audioContext.currentTime + duration)
  }

  public playJump() {
    this.createTone(400, 0.15, 0.2)
  }

  public playDoubleJump() {
    this.createTone(600, 0.15, 0.2)
    setTimeout(() => this.createTone(800, 0.1, 0.15), 50)
  }

  public playCoinCollect() {
    if (!this.audioContext || this.isMuted) return

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    oscillator.type = "sine"
    oscillator.frequency.value = 800

    gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2)

    oscillator.start()
    oscillator.stop(this.audioContext.currentTime + 0.2)
  }

  public playPowerUp() {
    if (!this.audioContext || this.isMuted) return

    const frequencies = [400, 500, 600, 800]
    frequencies.forEach((freq, index) => {
      setTimeout(() => {
        this.createTone(freq, 0.1, 0.15)
      }, index * 50)
    })
  }

  public playCollision() {
    if (!this.audioContext || this.isMuted) return

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    oscillator.type = "sawtooth"
    oscillator.frequency.value = 100

    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3)

    oscillator.start()
    oscillator.stop(this.audioContext.currentTime + 0.3)
  }

  public playGameOver() {
    if (!this.audioContext || this.isMuted) return

    const frequencies = [400, 350, 300, 250, 200]
    frequencies.forEach((freq, index) => {
      setTimeout(() => {
        this.createTone(freq, 0.2, 0.15)
      }, index * 100)
    })
  }

  public playLevelComplete() {
    if (!this.audioContext || this.isMuted) return

    const melody = [523, 659, 784, 1047]
    melody.forEach((freq, index) => {
      setTimeout(() => {
        this.createTone(freq, 0.2, 0.2)
      }, index * 150)
    })
  }

  public playCheckpoint() {
    if (!this.audioContext || this.isMuted) return

    const notes = [659, 784, 1047]
    notes.forEach((freq, index) => {
      setTimeout(() => {
        this.createTone(freq, 0.15, 0.15)
      }, index * 100)
    })
  }

  public startBackgroundMusic() {
    if (!this.audioContext || this.isMuted || this.bgMusic) return

    this.playBackgroundLoop()
  }

  private playBackgroundLoop() {
    if (!this.audioContext || this.isMuted) return

    const melody = [
      { freq: 523, duration: 0.2 },
      { freq: 587, duration: 0.2 },
      { freq: 659, duration: 0.2 },
      { freq: 523, duration: 0.2 },
      { freq: 659, duration: 0.2 },
      { freq: 784, duration: 0.4 },
      { freq: 659, duration: 0.2 },
      { freq: 587, duration: 0.2 },
    ]

    let time = 0
    melody.forEach((note) => {
      setTimeout(() => {
        if (!this.isMuted) {
          this.createTone(note.freq, note.duration, 0.1)
        }
      }, time * 1000)
      time += note.duration + 0.05
    })

    setTimeout(() => {
      if (!this.isMuted) {
        this.playBackgroundLoop()
      }
    }, time * 1000)
  }

  public stopBackgroundMusic() {
    if (this.bgMusic) {
      this.bgMusic.stop()
      this.bgMusic = null
    }
    this.isMuted = true
  }

  public toggleMute() {
    this.isMuted = !this.isMuted
    if (this.isMuted) {
      this.stopBackgroundMusic()
    } else {
      this.startBackgroundMusic()
    }
    return this.isMuted
  }

  public getMuteState() {
    return this.isMuted
  }

  public destroy() {
    this.stopBackgroundMusic()
    if (this.audioContext) {
      this.audioContext.close()
    }
  }
}
