import type { GameState, SaveData } from './types'

const SAVE_KEY = 'blindcraft_save_v3'
const STATS_KEY = 'blindcraft_stats_v3'

export const INITIAL_STATE: GameState = {
  sceneId: 'prelude_wake',
  act: 'act0',
  health: 100,
  maxHealth: 100,
  inventory: {},
  flags: [],
  pickaxeTier: 'none',
  armor: 'none',
  log: ['Ты просыпаешься в своём доме.'],
  depth: 0,
  maxDepth: 0,
  turns: 0,
  visited: ['prelude_wake'],
  act1Endings: [],
  act2Endings: [],
  act3Endings: [],
  act4Endings: [],
  act2Unlocked: false,
  act3Unlocked: false,
  act4Unlocked: false
}

// Миграция старых сейвов (v1, v2, v2.1, v2.2, v2.3 -> v2.4)
function migrateState(s: Partial<GameState> & Record<string, unknown>): GameState {
  const base: GameState = {
    ...INITIAL_STATE,
    ...s,
    pickaxeTier: (s.pickaxeTier as GameState['pickaxeTier']) ?? 'none',
    armor: (s.armor as GameState['armor']) ?? 'none',
    visited: (s.visited as string[]) ?? ['start'],
    act: (s.act as GameState['act']) ?? 'act1',
    act1Endings: (s.act1Endings as string[]) ?? [],
    act2Endings: (s.act2Endings as string[]) ?? [],
    act3Endings: (s.act3Endings as string[]) ?? [],
    act4Endings: (s.act4Endings as string[]) ?? [],
    act2Unlocked: (s.act2Unlocked as boolean) ?? false,
    act3Unlocked: (s.act3Unlocked as boolean) ?? false,
    act4Unlocked: (s.act4Unlocked as boolean) ?? false
  }
  // Если в старом сейве уже была победа — считаем что Act 1 пройден
  if (s.flags && Array.isArray(s.flags) && s.flags.includes('mined_diamonds')) {
    base.act1Endings = ['ending_victory']
    base.act2Unlocked = true
  }
  return base
}

export function loadSave(): SaveData | null {
  if (typeof window === 'undefined') return null
  try {
    // Пробуем v2.4
    const raw = localStorage.getItem(SAVE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as SaveData
      return { ...parsed, state: migrateState(parsed.state as Record<string, unknown>) }
    }
    // Миграция v2.3 и ниже
    const oldRaw = localStorage.getItem('blindcraft_save_v2')
    if (oldRaw) {
      const oldParsed = JSON.parse(oldRaw) as SaveData
      const migrated: SaveData = {
        state: migrateState(oldParsed.state as Record<string, unknown>),
        bestDepth: oldParsed.bestDepth ?? 0,
        victories: oldParsed.victories ?? 0,
        deaths: oldParsed.deaths ?? 0,
        timestamp: Date.now()
      }
      return migrated
    }
    return null
  } catch {
    return null
  }
}

export function saveGame(state: GameState, stats?: Partial<SaveData>) {
  if (typeof window === 'undefined') return
  const existing = loadStats()
  const data: SaveData = {
    state,
    bestDepth: Math.max(existing.bestDepth, state.depth, state.maxDepth),
    victories: stats?.victories ?? existing.victories,
    deaths: stats?.deaths ?? existing.deaths,
    timestamp: Date.now()
  }
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(data))
    localStorage.setItem(STATS_KEY, JSON.stringify({
      bestDepth: data.bestDepth,
      victories: data.victories,
      deaths: data.deaths
    }))
  } catch {}
}

export function loadStats(): { bestDepth: number; victories: number; deaths: number } {
  if (typeof window === 'undefined') return { bestDepth: 0, victories: 0, deaths: 0 }
  try {
    const raw = localStorage.getItem(STATS_KEY)
    if (!raw) {
      const old = localStorage.getItem('blindcraft_stats_v2')
      if (old) return JSON.parse(old)
      return { bestDepth: 0, victories: 0, deaths: 0 }
    }
    return JSON.parse(raw)
  } catch {
    return { bestDepth: 0, victories: 0, deaths: 0 }
  }
}

export function clearSave() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(SAVE_KEY)
  localStorage.removeItem('blindcraft_save_v2')
  localStorage.removeItem('blindcraft_save_v1')
}

export function hasSave(): boolean {
  if (typeof window === 'undefined') return false
  return !!localStorage.getItem(SAVE_KEY) || !!localStorage.getItem('blindcraft_save_v2')
}
