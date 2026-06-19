import type { AmbientType, ResourceType } from './types'

// =====================================================
//  Аудио-движок BlindCraft
//  Web Audio API — все звуки синтезируются на лету
// =====================================================

class AudioEngine {
  private ctx: AudioContext | null = null
  private masterGain: GainNode | null = null
  private ambientGain: GainNode | null = null
  private ambientNodes: Array<OscillatorNode | AudioBufferSourceNode | GainNode> = []
  private currentAmbient: AmbientType | null = null
  public enabled = true

  init() {
    if (this.ctx) return
    try {
      const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      this.ctx = new Ctor()
      this.masterGain = this.ctx.createGain()
      this.masterGain.gain.value = 0.5
      this.masterGain.connect(this.ctx.destination)
      this.ambientGain = this.ctx.createGain()
      this.ambientGain.gain.value = 0.0
      this.ambientGain.connect(this.masterGain)
    } catch {
      this.ctx = null
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  setEnabled(v: boolean) {
    this.enabled = v
    if (this.masterGain) {
      this.masterGain.gain.value = v ? 0.5 : 0
    }
  }

  // ====== Примитивы ======
  private tone(freq: number, duration: number, type: OscillatorType = 'sine', volume = 0.3, attack = 0.01, release = 0.1) {
    if (!this.ctx || !this.masterGain || !this.enabled) return
    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = type
    osc.frequency.value = freq
    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(volume, now + attack)
    gain.gain.linearRampToValueAtTime(0, now + duration + release)
    osc.connect(gain)
    gain.connect(this.masterGain)
    osc.start(now)
    osc.stop(now + duration + release + 0.05)
  }

  private noise(duration: number, volume = 0.3, filterFreq = 1000, filterType: BiquadFilterType = 'lowpass') {
    if (!this.ctx || !this.masterGain || !this.enabled) return
    const now = this.ctx.currentTime
    const bufferSize = Math.floor(this.ctx.sampleRate * duration)
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize)
    }
    const src = this.ctx.createBufferSource()
    src.buffer = buffer
    const filter = this.ctx.createBiquadFilter()
    filter.type = filterType
    filter.frequency.value = filterFreq
    const gain = this.ctx.createGain()
    gain.gain.value = volume
    src.connect(filter)
    filter.connect(gain)
    gain.connect(this.masterGain)
    src.start(now)
    src.stop(now + duration + 0.05)
  }

  private sweep(startFreq: number, endFreq: number, duration: number, type: OscillatorType = 'sine', volume = 0.3) {
    if (!this.ctx || !this.masterGain || !this.enabled) return
    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(startFreq, now)
    osc.frequency.exponentialRampToValueAtTime(Math.max(endFreq, 1), now + duration)
    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(volume, now + 0.01)
    gain.gain.linearRampToValueAtTime(0, now + duration)
    osc.connect(gain)
    gain.connect(this.masterGain)
    osc.start(now)
    osc.stop(now + duration + 0.05)
  }

  // ====== Игровые звуки ======

  // Эхолокация — главный звук
  echo() {
    if (!this.ctx || !this.enabled) return
    // Импульс: высокий щелчок
    this.sweep(2000, 800, 0.15, 'sine', 0.25)
    // Через 150мс — отклик с реверберацией (несколько отголосков)
    setTimeout(() => {
      this.tone(440, 0.08, 'sine', 0.15)
      setTimeout(() => this.tone(330, 0.1, 'sine', 0.1), 80)
      setTimeout(() => this.tone(220, 0.15, 'sine', 0.07), 180)
    }, 150)
  }

  // Шаг
  step() {
    this.noise(0.05, 0.15, 500, 'lowpass')
  }

  // Копание киркой
  mine() {
    this.noise(0.15, 0.35, 1500, 'bandpass')
    setTimeout(() => this.tone(120, 0.08, 'square', 0.15), 50)
  }

  // Получение предмета — приятный звон
  pickup(resource: ResourceType) {
    const freqs: Record<ResourceType, number[]> = {
      wood: [220, 330],
      stone: [180, 220],
      coal: [200, 240],
      iron: [330, 440],
      gold: [440, 550, 660],
      diamond: [880, 1100, 1320, 1760],
      torch: [330, 440],
      pickaxe: [440, 550, 660],
      mushroom: [550, 660, 770]
    }
    const notes = freqs[resource] || [440]
    notes.forEach((f, i) => {
      setTimeout(() => this.tone(f, 0.15, 'sine', 0.25), i * 80)
    })
  }

  // Урон
  damage() {
    this.noise(0.3, 0.4, 200, 'lowpass')
    this.tone(80, 0.3, 'sawtooth', 0.2)
  }

  // Победа
  victory() {
    const notes = [523, 659, 784, 1047, 1319]
    notes.forEach((f, i) => {
      setTimeout(() => this.tone(f, 0.4, 'sine', 0.3), i * 150)
    })
  }

  // Смерть
  death() {
    this.sweep(440, 55, 1.5, 'sawtooth', 0.3)
    setTimeout(() => this.noise(1, 0.2, 100), 500)
  }

  // Клик по кнопке
  click() {
    this.tone(800, 0.03, 'sine', 0.1)
  }

  // ====== Звуки действий (v2) ======

  // Ходьба — серия шагов
  walk(durationMs: number = 3000) {
    if (!this.ctx || !this.enabled) return
    const stepCount = Math.max(3, Math.floor(durationMs / 600))
    for (let i = 0; i < stepCount; i++) {
      setTimeout(() => this.noise(0.08, 0.18, 500, 'lowpass'), i * (durationMs / stepCount))
    }
  }

  // Копание — серия ударов киркой
  mineAction(durationMs: number = 8000) {
    if (!this.ctx || !this.enabled) return
    const hitCount = Math.max(4, Math.floor(durationMs / 1200))
    for (let i = 0; i < hitCount; i++) {
      setTimeout(() => {
        this.noise(0.18, 0.32, 1500, 'bandpass')
        setTimeout(() => this.tone(120 + Math.random() * 60, 0.08, 'square', 0.15), 50)
      }, i * (durationMs / hitCount))
    }
  }

  // Крафт — удары молотком + завершающий звон
  craftAction(durationMs: number = 5000) {
    if (!this.ctx || !this.enabled) return
    const hitCount = Math.max(3, Math.floor(durationMs / 800))
    for (let i = 0; i < hitCount; i++) {
      setTimeout(() => {
        this.tone(200, 0.06, 'square', 0.2)
        this.noise(0.04, 0.15, 2000, 'bandpass')
      }, i * (durationMs / hitCount))
    }
    // Финальный аккорд
    setTimeout(() => {
      this.tone(523, 0.15, 'sine', 0.25)
      setTimeout(() => this.tone(784, 0.2, 'sine', 0.25), 100)
    }, durationMs - 200)
  }

  // Торговля — звон монет
  tradeAction(durationMs: number = 4000) {
    if (!this.ctx || !this.enabled) return
    const coinCount = Math.max(4, Math.floor(durationMs / 400))
    for (let i = 0; i < coinCount; i++) {
      setTimeout(() => {
        this.tone(800 + Math.random() * 400, 0.05, 'sine', 0.15)
        setTimeout(() => this.tone(1200 + Math.random() * 300, 0.04, 'sine', 0.1), 80)
      }, i * (durationMs / coinCount))
    }
  }

  // Наблюдение/прислушивание — мягкий вдох
  observeAction(durationMs: number = 2500) {
    if (!this.ctx || !this.enabled) return
    this.sweep(200, 400, durationMs / 1000 * 0.5, 'sine', 0.1)
    setTimeout(() => this.sweep(400, 200, durationMs / 1000 * 0.4, 'sine', 0.1), durationMs * 0.5)
  }

  // Бой — резкие удары и крики
  combatAction(durationMs: number = 5000) {
    if (!this.ctx || !this.enabled) return
    const hitCount = Math.max(3, Math.floor(durationMs / 1000))
    for (let i = 0; i < hitCount; i++) {
      setTimeout(() => {
        this.noise(0.15, 0.4, 400, 'lowpass')
        this.tone(90, 0.12, 'sawtooth', 0.25)
      }, i * (durationMs / hitCount) + 200)
    }
  }

  // Экипировка брони — металлический лязг
  armorEquip() {
    this.tone(180, 0.1, 'square', 0.2)
    setTimeout(() => this.noise(0.2, 0.3, 1500, 'bandpass'), 100)
    setTimeout(() => this.tone(220, 0.08, 'square', 0.18), 250)
  }

  // Улучшение кирки — кузнечный звон
  pickaxeUpgrade() {
    this.tone(440, 0.1, 'sine', 0.25)
    setTimeout(() => this.tone(554, 0.1, 'sine', 0.25), 100)
    setTimeout(() => this.tone(659, 0.15, 'sine', 0.25), 200)
    setTimeout(() => this.noise(0.15, 0.2, 2000, 'bandpass'), 350)
  }

  // v2.2: Отдых у костра — потрескивание огня + восстановление
  restAction(durationMs: number = 8000) {
    if (!this.ctx || !this.enabled) return
    // Потрескивание костра на протяжении всего отдыха
    const crackleCount = Math.max(8, Math.floor(durationMs / 800))
    for (let i = 0; i < crackleCount; i++) {
      setTimeout(() => {
        this.noise(0.08, 0.18, 1500 + Math.random() * 1500, 'bandpass')
        if (Math.random() > 0.5) {
          setTimeout(() => this.tone(180 + Math.random() * 100, 0.05, 'sine', 0.08), 30)
        }
      }, i * (durationMs / crackleCount) + Math.random() * 200)
    }
    // Мягкий финальный аккорд
    setTimeout(() => {
      this.tone(523, 0.3, 'sine', 0.2)
      setTimeout(() => this.tone(659, 0.3, 'sine', 0.2), 100)
      setTimeout(() => this.tone(784, 0.4, 'sine', 0.2), 200)
    }, durationMs - 500)
  }

  // v2.2: Питьё из колодца — бульканье + восстановление
  drinkWell() {
    if (!this.ctx || !this.enabled) return
    this.tone(300, 0.15, 'sine', 0.15)
    setTimeout(() => this.noise(0.2, 0.2, 800, 'lowpass'), 100)
    setTimeout(() => this.tone(400, 0.1, 'sine', 0.12), 250)
    setTimeout(() => this.noise(0.15, 0.15, 600, 'lowpass'), 400)
    // Финальный восстанавливающий аккорд
    setTimeout(() => {
      this.tone(659, 0.3, 'sine', 0.2)
      setTimeout(() => this.tone(880, 0.4, 'sine', 0.2), 150)
    }, 600)
  }

  // v2.2: Приготовление еды — шипение на сковороде
  cookAction(durationMs: number = 6000) {
    if (!this.ctx || !this.enabled) return
    const sizzleCount = Math.max(6, Math.floor(durationMs / 800))
    for (let i = 0; i < sizzleCount; i++) {
      setTimeout(() => {
        this.noise(0.1, 0.15, 2500 + Math.random() * 1000, 'highpass')
      }, i * (durationMs / sizzleCount))
    }
    // Финальный «готово»
    setTimeout(() => {
      this.tone(523, 0.1, 'sine', 0.2)
      setTimeout(() => this.tone(784, 0.15, 'sine', 0.2), 80)
    }, durationMs - 200)
  }

  // ====== Фоновый эмбиент ======
  setAmbient(type: AmbientType) {
    if (this.currentAmbient === type) return
    this.currentAmbient = type
    this.stopAmbient()

    if (!this.ctx || !this.ambientGain || !this.enabled) return

    switch (type) {
      case 'surface':
        this.startWind()
        break
      case 'cave':
        this.startCave()
        break
      case 'water':
        this.startWater()
        break
      case 'lava':
        this.startLava()
        break
      case 'monster':
        this.startMonster()
        break
      case 'diamond':
        this.startDiamond()
        break
      case 'void':
        // Тишина
        break
    }

    // Плавно поднять громкость
    if (this.ambientGain) {
      const now = this.ctx.currentTime
      this.ambientGain.gain.cancelScheduledValues(now)
      this.ambientGain.gain.setValueAtTime(this.ambientGain.gain.value, now)
      this.ambientGain.gain.linearRampToValueAtTime(0.3, now + 1.5)
    }
  }

  private stopAmbient() {
    if (!this.ctx) return
    const now = this.ctx.currentTime
    if (this.ambientGain) {
      this.ambientGain.gain.cancelScheduledValues(now)
      this.ambientGain.gain.setValueAtTime(this.ambientGain.gain.value, now)
      this.ambientGain.gain.linearRampToValueAtTime(0, now + 0.5)
    }
    // Останавливаем через 600мс
    setTimeout(() => {
      this.ambientNodes.forEach(n => {
        try {
          if ('stop' in n) (n as OscillatorNode).stop()
        } catch {}
        try { n.disconnect() } catch {}
      })
      this.ambientNodes = []
    }, 600)
  }

  private startWind() {
    if (!this.ctx || !this.ambientGain) return
    const bufferSize = this.ctx.sampleRate * 4
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.4
    }
    const src = this.ctx.createBufferSource()
    src.buffer = buffer
    src.loop = true
    const filter = this.ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 300
    const gain = this.ctx.createGain()
    gain.gain.value = 0.5
    src.connect(filter)
    filter.connect(gain)
    gain.connect(this.ambientGain)
    src.start()
    this.ambientNodes.push(src, gain, filter)
  }

  private startCave() {
    if (!this.ctx || !this.ambientGain) return
    // Низкий гул
    const osc1 = this.ctx.createOscillator()
    osc1.type = 'sine'
    osc1.frequency.value = 55
    const gain1 = this.ctx.createGain()
    gain1.gain.value = 0.4
    osc1.connect(gain1)
    gain1.connect(this.ambientGain)
    osc1.start()
    this.ambientNodes.push(osc1, gain1)
    // Капель
    const dropInterval = setInterval(() => {
      if (!this.ctx || !this.ambientGain) return
      this.tone(800 + Math.random() * 400, 0.05, 'sine', 0.1)
    }, 2000)
    // Сохраним id интервала в gain-узле (хак для остановки)
    ;(gain1 as unknown as { __interval?: number }).__interval = dropInterval as unknown as number
  }

  private startWater() {
    if (!this.ctx || !this.ambientGain) return
    // Шум воды
    const bufferSize = this.ctx.sampleRate * 4
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.5
    }
    const src = this.ctx.createBufferSource()
    src.buffer = buffer
    src.loop = true
    const filter = this.ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = 800
    filter.Q.value = 0.5
    const gain = this.ctx.createGain()
    gain.gain.value = 0.3
    src.connect(filter)
    filter.connect(gain)
    gain.connect(this.ambientGain)
    src.start()
    this.ambientNodes.push(src, gain, filter)
    // Капли
    const dropInterval = setInterval(() => {
      this.tone(1000 + Math.random() * 500, 0.04, 'sine', 0.08)
    }, 600)
    ;(gain as unknown as { __interval?: number }).__interval = dropInterval as unknown as number
  }

  private startLava() {
    if (!this.ctx || !this.ambientGain) return
    // Бульканье
    const osc1 = this.ctx.createOscillator()
    osc1.type = 'sawtooth'
    osc1.frequency.value = 60
    const gain1 = this.ctx.createGain()
    gain1.gain.value = 0.2
    osc1.connect(gain1)
    gain1.connect(this.ambientGain)
    osc1.start()
    // Шум
    const bufferSize = this.ctx.sampleRate * 4
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.3
    }
    const src = this.ctx.createBufferSource()
    src.buffer = buffer
    src.loop = true
    const filter = this.ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 500
    const gain2 = this.ctx.createGain()
    gain2.gain.value = 0.5
    src.connect(filter)
    filter.connect(gain2)
    gain2.connect(this.ambientGain)
    src.start()
    // Потрескивание
    const crackleInterval = setInterval(() => {
      this.noise(0.05, 0.15, 2000, 'highpass')
    }, 1500)
    this.ambientNodes.push(osc1, gain1, src, gain2, filter)
    ;(gain2 as unknown as { __interval?: number }).__interval = crackleInterval as unknown as number
  }

  private startMonster() {
    if (!this.ctx || !this.ambientGain) return
    // Очень низкий пульсирующий гул
    const osc1 = this.ctx.createOscillator()
    osc1.type = 'sine'
    osc1.frequency.value = 40
    const gain1 = this.ctx.createGain()
    gain1.gain.value = 0.3
    // LFO для пульсации
    const lfo = this.ctx.createOscillator()
    lfo.frequency.value = 0.5
    const lfoGain = this.ctx.createGain()
    lfoGain.gain.value = 0.2
    lfo.connect(lfoGain)
    lfoGain.connect(gain1.gain)
    osc1.connect(gain1)
    gain1.connect(this.ambientGain)
    osc1.start()
    lfo.start()
    // Далёкие шорохи
    const rustleInterval = setInterval(() => {
      this.noise(0.2, 0.1, 300, 'lowpass')
    }, 3000 + Math.random() * 2000)
    this.ambientNodes.push(osc1, gain1, lfo, lfoGain)
    ;(gain1 as unknown as { __interval?: number }).__interval = rustleInterval as unknown as number
  }

  private startDiamond() {
    if (!this.ctx || !this.ambientGain) return
    // Высокий хор кристаллов
    const freqs = [1047, 1319, 1568, 2093]
    freqs.forEach((f, i) => {
      const osc = this.ctx!.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = f
      const gain = this.ctx!.createGain()
      gain.gain.value = 0.05
      // Лёгкое тремоло
      const lfo = this.ctx!.createOscillator()
      lfo.frequency.value = 0.3 + i * 0.1
      const lfoGain = this.ctx!.createGain()
      lfoGain.gain.value = 0.03
      lfo.connect(lfoGain)
      lfoGain.connect(gain.gain)
      osc.connect(gain)
      gain.connect(this.ambientGain!)
      osc.start()
      lfo.start()
      this.ambientNodes.push(osc, gain, lfo, lfoGain)
    })
  }

  // Очистка при выходе
  destroy() {
    this.stopAmbient()
    if (this.ctx) {
      this.ctx.close()
      this.ctx = null
    }
  }
}

export const audioEngine = new AudioEngine()

// ====== Вибро (отключено в v3.1 — не работает на большинстве устройств) ======
export function vibrate(_pattern: number | number[]) {
  // No-op: вибро убрано — не работает на iOS и большинстве браузеров
}

export const VIBRO_PATTERNS = {
  echo: [10, 30, 60],
  step: 8,
  mine: [40, 20, 40],
  pickup: [15, 30, 15, 30, 15],
  damage: 100,
  victory: [50, 50, 50, 50, 100, 200],
  death: [200, 100, 300],
  click: 5,
  monster: [60, 100, 60],
  walk: [20, 100, 20, 100, 20],
  craft: [30, 50, 30, 50, 30],
  trade: [10, 30, 10, 30, 10, 30, 10],
  combat: [80, 100, 80],
  observe: 15,
  armor: [40, 30, 60],
  upgrade: [20, 40, 20, 40, 80],
  rest: [30, 200, 30, 200, 30, 200],
  drink: [20, 50, 20, 50, 80],
  cook: [15, 100, 15, 100, 15, 100]
}
