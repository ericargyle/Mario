import Phaser from 'phaser'

// NOTE:
// This is an original platformer prototype inspired by classic side-scrollers.
// It is NOT a copy of Nintendo assets.
// You can replace sprites later by dropping files into public/assets and adjusting keys below.

const ASSET = {
  player: 'player',
  coin: 'coin',
  flag: 'flag',
  ground: 'ground',
  block: 'block',
}

function makePlaceholderTextures(scene) {
  // Only generate placeholder textures if real assets were not provided.
  const missing = (key) => !scene.textures.exists(key)

  const g = scene.add.graphics()

  if (missing(ASSET.player)) {
    g.clear()
    g.fillStyle(0x2dd4bf, 1)
    g.fillRoundedRect(0, 0, 22, 28, 6)
    g.fillStyle(0x0f172a, 0.35)
    g.fillCircle(7, 10, 2)
    g.fillCircle(15, 10, 2)
    g.generateTexture(ASSET.player, 22, 28)
  }

  if (missing(ASSET.ground)) {
    g.clear()
    g.fillStyle(0x1f2937, 1)
    g.fillRect(0, 0, 64, 32)
    g.fillStyle(0x334155, 1)
    for (let i = 0; i < 6; i++) g.fillRect(i * 12, 0, 6, 32)
    g.generateTexture(ASSET.ground, 64, 32)
  }

  if (missing(ASSET.block)) {
    g.clear()
    g.fillStyle(0x6b7280, 1)
    g.fillRoundedRect(0, 0, 40, 24, 6)
    g.lineStyle(2, 0x0b1020, 0.5)
    g.strokeRoundedRect(1, 1, 38, 22, 6)
    g.generateTexture(ASSET.block, 40, 24)
  }

  if (missing(ASSET.coin)) {
    g.clear()
    g.fillStyle(0xfbbf24, 1)
    g.fillCircle(10, 10, 10)
    g.lineStyle(2, 0x92400e, 0.5)
    g.strokeCircle(10, 10, 9)
    g.generateTexture(ASSET.coin, 20, 20)
  }

  if (missing(ASSET.flag)) {
    g.clear()
    g.fillStyle(0xffffff, 0.9)
    g.fillRect(0, 0, 6, 60)
    g.fillStyle(0x22c55e, 1)
    g.fillTriangle(6, 6, 36, 14, 6, 22)
    g.generateTexture(ASSET.flag, 40, 60)
  }

  g.destroy()
}

class AudioBus {
  constructor(scene) {
    this.scene = scene
    this.enabled = true
    this.musicOn = false
    this.osc = null
    this._tick = 0
  }

  toggleMusic() {
    this.musicOn = !this.musicOn
    if (!this.musicOn) {
      this.stopMusic()
      return
    }
    this.startMusic()
  }

  startMusic() {
    if (!this.enabled) return
    // Simple arpeggio via WebAudio (placeholder)
    const ctx = this.scene.sound.context
    this.osc = ctx.createOscillator()
    const gain = ctx.createGain()
    gain.gain.value = 0.03
    this.osc.type = 'triangle'
    this.osc.connect(gain)
    gain.connect(ctx.destination)
    this.osc.start()

    this._tick = 0
    this.scene.time.addEvent({
      delay: 140,
      loop: true,
      callback: () => {
        if (!this.osc) return
        const notes = [261.63, 329.63, 392.0, 523.25, 392.0, 329.63]
        this.osc.frequency.value = notes[this._tick % notes.length]
        this._tick++
      },
    })
  }

  stopMusic() {
    if (this.osc) {
      try {
        this.osc.stop()
      } catch {}
      this.osc.disconnect()
      this.osc = null
    }
  }

  sfx(type) {
    if (!this.enabled) return
    const ctx = this.scene.sound.context
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    g.gain.value = 0.08
    o.connect(g)
    g.connect(ctx.destination)

    const now = ctx.currentTime
    if (type === 'jump') {
      o.type = 'square'
      o.frequency.setValueAtTime(280, now)
      o.frequency.exponentialRampToValueAtTime(520, now + 0.06)
      g.gain.setValueAtTime(0.08, now)
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.12)
      o.start(now)
      o.stop(now + 0.13)
    } else if (type === 'coin') {
      o.type = 'sine'
      o.frequency.setValueAtTime(880, now)
      o.frequency.exponentialRampToValueAtTime(1320, now + 0.08)
      g.gain.setValueAtTime(0.08, now)
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.10)
      o.start(now)
      o.stop(now + 0.11)
    } else if (type === 'win') {
      o.type = 'triangle'
      o.frequency.setValueAtTime(392, now)
      o.frequency.exponentialRampToValueAtTime(784, now + 0.2)
      g.gain.setValueAtTime(0.07, now)
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.25)
      o.start(now)
      o.stop(now + 0.26)
    } else {
      o.type = 'sawtooth'
      o.frequency.setValueAtTime(180, now)
      g.gain.setValueAtTime(0.06, now)
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.15)
      o.start(now)
      o.stop(now + 0.16)
    }
  }
}

const LEVELS = [
  {
    name: 'Level 1',
    spawn: { x: 80, y: 340 },
    flagX: 1800,
    grounds: [
      { x: 0, y: 430, w: 2200 },
      { x: 420, y: 360, w: 220 },
      { x: 780, y: 300, w: 220 },
      { x: 1180, y: 340, w: 220 },
    ],
    blocks: [
      { x: 520, y: 320 },
      { x: 820, y: 260 },
      { x: 1220, y: 300 },
    ],
    coins: [
      { x: 520, y: 280 },
      { x: 820, y: 220 },
      { x: 1220, y: 260 },
      { x: 1400, y: 390 },
    ],
  },
  {
    name: 'Level 2',
    spawn: { x: 80, y: 340 },
    flagX: 2200,
    grounds: [
      { x: 0, y: 430, w: 2600 },
      { x: 420, y: 360, w: 160 },
      { x: 700, y: 320, w: 160 },
      { x: 980, y: 280, w: 160 },
      { x: 1300, y: 320, w: 180 },
      { x: 1640, y: 360, w: 180 },
    ],
    blocks: [
      { x: 720, y: 280 },
      { x: 1000, y: 240 },
      { x: 1660, y: 320 },
    ],
    coins: Array.from({ length: 10 }, (_, i) => ({ x: 520 + i * 160, y: 380 - (i % 3) * 40 })),
  },
  {
    name: 'Level 3',
    spawn: { x: 80, y: 340 },
    flagX: 2600,
    grounds: [
      { x: 0, y: 430, w: 3000 },
      { x: 520, y: 360, w: 140 },
      { x: 760, y: 300, w: 140 },
      { x: 1000, y: 240, w: 140 },
      { x: 1240, y: 300, w: 140 },
      { x: 1480, y: 360, w: 140 },
      { x: 1860, y: 320, w: 200 },
      { x: 2200, y: 280, w: 200 },
    ],
    blocks: [
      { x: 1900, y: 280 },
      { x: 2240, y: 240 },
    ],
    coins: [
      { x: 560, y: 320 },
      { x: 800, y: 260 },
      { x: 1040, y: 200 },
      { x: 1280, y: 260 },
      { x: 1520, y: 320 },
      { x: 1900, y: 240 },
      { x: 2240, y: 200 },
      { x: 2480, y: 390 },
    ],
  },
  {
    name: 'Level 4',
    spawn: { x: 80, y: 340 },
    flagX: 2800,
    grounds: [
      { x: 0, y: 430, w: 3200 },
      { x: 420, y: 380, w: 120 },
      { x: 640, y: 330, w: 120 },
      { x: 860, y: 280, w: 120 },
      { x: 1080, y: 230, w: 120 },
      { x: 1300, y: 280, w: 120 },
      { x: 1520, y: 330, w: 120 },
      { x: 1740, y: 380, w: 120 },
      { x: 2060, y: 340, w: 220 },
      { x: 2400, y: 300, w: 220 },
    ],
    blocks: [
      { x: 2100, y: 300 },
      { x: 2440, y: 260 },
      { x: 2680, y: 360 },
    ],
    coins: Array.from({ length: 14 }, (_, i) => ({ x: 460 + i * 170, y: 200 + (i % 4) * 40 })),
  },
]

class GameScene extends Phaser.Scene {
  constructor() {
    super('game')
    this.levelIndex = 0
    this.score = 0
  }

  preload() {
    // Drop-in asset override
    // Put your sprite at: public/assets/player.png
    this.load.image(ASSET.player, 'assets/player.png')
  }

  init(data) {
    if (typeof data.levelIndex === 'number') this.levelIndex = data.levelIndex
    if (typeof data.score === 'number') this.score = data.score
  }

  create() {
    makePlaceholderTextures(this)

    this.audioBus = new AudioBus(this)

    this.cursors = this.input.keyboard.createCursorKeys()
    this.keys = this.input.keyboard.addKeys('W,A,S,D,SPACE,M')

    this.keys.M.on('down', () => this.audioBus.toggleMusic())

    this.physics.world.setBounds(0, 0, 3200, 480)

    this.add.text(12, 10, 'Mario (prototype)', { fontSize: '14px', color: '#eef2ff' }).setScrollFactor(0)
    this.hud = this.add
      .text(12, 30, '', { fontSize: '12px', color: 'rgba(238,242,255,.85)' })
      .setScrollFactor(0)

    this.buildLevel(LEVELS[this.levelIndex])

    // Camera
    this.cameras.main.setBounds(0, 0, this.physics.world.bounds.width, this.physics.world.bounds.height)
    this.cameras.main.startFollow(this.player, true, 0.12, 0.12)

    // Mobile: tap left/right half of screen to move, swipe up to jump (simple)
    this.pointer = { active: false, x0: 0, y0: 0, dx: 0, dy: 0 }
    this.input.on('pointerdown', (p) => {
      this.pointer.active = true
      this.pointer.x0 = p.x
      this.pointer.y0 = p.y
      this.pointer.dx = 0
      this.pointer.dy = 0
    })
    this.input.on('pointermove', (p) => {
      if (!this.pointer.active) return
      this.pointer.dx = p.x - this.pointer.x0
      this.pointer.dy = p.y - this.pointer.y0
    })
    this.input.on('pointerup', () => {
      this.pointer.active = false
      this.pointer.dx = 0
      this.pointer.dy = 0
    })
  }

  buildLevel(level) {
    // Groups
    this.platforms = this.physics.add.staticGroup()
    this.blocks = this.physics.add.staticGroup()
    this.coins = this.physics.add.staticGroup()

    // Ground sections
    for (const g of level.grounds) {
      const segmentCount = Math.ceil(g.w / 64)
      for (let i = 0; i < segmentCount; i++) {
        const x = g.x + i * 64 + 32
        const tile = this.platforms.create(x, g.y, ASSET.ground)
        tile.refreshBody()
      }
    }

    for (const b of level.blocks) {
      const block = this.blocks.create(b.x, b.y, ASSET.block)
      block.refreshBody()
    }

    for (const c of level.coins) {
      const coin = this.coins.create(c.x, c.y, ASSET.coin)
      coin.refreshBody()
    }

    // Flag
    this.flag = this.physics.add.staticSprite(level.flagX, 370, ASSET.flag)
    this.flag.refreshBody()

    // Player
    this.player = this.physics.add.sprite(level.spawn.x, level.spawn.y, ASSET.player)
    this.player.setCollideWorldBounds(false)
    this.player.body.setSize(18, 26)
    this.player.body.setOffset(2, 2)

    this.physics.add.collider(this.player, this.platforms)
    this.physics.add.collider(this.player, this.blocks)

    this.physics.add.overlap(this.player, this.coins, (player, coin) => {
      coin.destroy()
      this.score += 10
      this.audioBus.sfx('coin')
    })

    this.physics.add.overlap(this.player, this.flag, () => {
      this.audioBus.sfx('win')
      this.nextLevel()
    })
  }

  nextLevel() {
    const next = this.levelIndex + 1
    if (next >= LEVELS.length) {
      this.scene.start('win', { score: this.score })
      return
    }
    this.scene.start('game', { levelIndex: next, score: this.score })
  }

  restartLevel() {
    this.scene.start('game', { levelIndex: this.levelIndex, score: this.score })
  }

  update() {
    const level = LEVELS[this.levelIndex]

    // Input
    const left = this.cursors.left.isDown || this.keys.A.isDown || this.pointer.dx < -18
    const right = this.cursors.right.isDown || this.keys.D.isDown || this.pointer.dx > 18
    const wantJump = Phaser.Input.Keyboard.JustDown(this.cursors.space) || Phaser.Input.Keyboard.JustDown(this.keys.SPACE) || this.pointer.dy < -40

    const speed = 180
    if (left) this.player.setVelocityX(-speed)
    else if (right) this.player.setVelocityX(speed)
    else this.player.setVelocityX(0)

    const onGround = this.player.body.blocked.down || this.player.body.touching.down
    if (wantJump && onGround) {
      this.player.setVelocityY(-330)
      this.audioBus.sfx('jump')
    }

    // If fall, reset
    if (this.player.y > 520) {
      this.scene.start('game', { levelIndex: this.levelIndex, score: this.score })
    }

    // Wrap / clamp world x
    if (this.player.x < 0) this.player.x = 0
    if (this.player.x > level.flagX + 200) this.player.x = level.flagX + 200

    this.hud.setText(`${LEVELS[this.levelIndex].name}  |  Score: ${this.score}`)
  }
}

class StartScene extends Phaser.Scene {
  constructor() {
    super('start')
  }

  preload() {
    this.load.image(ASSET.player, 'assets/player.png')
  }

  create() {
    const w = this.scale.width
    const h = this.scale.height

    makePlaceholderTextures(this)

    this.add.rectangle(w / 2, h / 2, w, h, 0x0b1020, 0.55)

    this.add.text(w / 2, h / 2 - 40, 'Mario (prototype)', { fontSize: '28px', color: '#eef2ff' }).setOrigin(0.5)
    this.add
      .text(w / 2, h / 2, '4 levels. Replace sprites later in /public/assets.', { fontSize: '13px', color: 'rgba(238,242,255,.80)' })
      .setOrigin(0.5)

    this.add
      .text(w / 2, h / 2 + 34, 'Press Start (or Space) to begin', { fontSize: '13px', color: 'rgba(238,242,255,.80)' })
      .setOrigin(0.5)

    this.input.keyboard.once('keydown-SPACE', () => this.scene.start('game', { levelIndex: 0, score: 0 }))
  }
}

class WinScene extends Phaser.Scene {
  constructor() {
    super('win')
  }

  init(data) {
    this.score = data?.score || 0
  }

  create() {
    const w = this.scale.width
    const h = this.scale.height
    this.add.rectangle(w / 2, h / 2, w, h, 0x0b1020, 0.7)
    this.add.text(w / 2, h / 2 - 30, 'You win!', { fontSize: '34px', color: '#eef2ff' }).setOrigin(0.5)
    this.add.text(w / 2, h / 2 + 10, `Final Score: ${this.score}`, { fontSize: '14px', color: 'rgba(238,242,255,.85)' }).setOrigin(0.5)
    this.add.text(w / 2, h / 2 + 44, 'Refresh or Restart Level to play again.', { fontSize: '12px', color: 'rgba(238,242,255,.75)' }).setOrigin(0.5)
  }
}

export function startGame({ mountId, startButton, restartButton }) {
  let game = null

  function boot() {
    if (game) return

    const width = 900
    const height = 480

    game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: mountId,
      width,
      height,
      backgroundColor: '#0b1020',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 740 },
          debug: false,
        },
      },
      scene: [StartScene, GameScene, WinScene],
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    })

    // Start scene
    game.scene.start('start')

    // Expose restart
    restartButton?.addEventListener('click', () => {
      const s = game.scene.getScene('game')
      if (s) s.restartLevel()
      else game.scene.start('game', { levelIndex: 0, score: 0 })
    })

    startButton?.addEventListener('click', () => {
      game.sound?.unlock?.()
      game.scene.start('game', { levelIndex: 0, score: 0 })
    })
  }

  boot()
}
