// Игровые типы для BlindCraft: Эхо Глубин (v4.2)

export type ResourceType =
  | 'wood' | 'stone' | 'coal' | 'copper' | 'iron' | 'gold' | 'diamond'
  | 'leather' | 'meat' | 'torch' | 'campfire' | 'food' | 'mushroom' | 'arrow'
  | 'trial_key' | 'mace' | 'breeze_rod' | 'vault_loot'
  | 'obsidian' | 'nether_star' | 'netherrack' | 'blaze_rod' | 'wither_skull' | 'glowstone' | 'soul_sand'
  | 'end_stone' | 'chorus_fruit' | 'purpur' | 'shulker_shell' | 'elytra' | 'dragon_egg' | 'ender_pearl'
  | 'netherite_ingot'  // незеритовый слиток (NEW v4.2)
  | 'sword_wood'       // деревянный меч (NEW v4.2)
  | 'sword_stone'      // каменный меч (NEW v4.2)
  | 'sword_iron'       // железный меч (NEW v4.2)
  | 'sword_diamond'    // алмазный меч (NEW v4.2)
  | 'sword_netherite'  // незеритовый меч (NEW v4.2)

export type Inventory = Partial<Record<ResourceType, number>>

export type PickaxeTier = 'none' | 'wood' | 'copper' | 'iron' | 'diamond' | 'netherite'

export type ArmorTier = 'none' | 'leather' | 'copper' | 'iron' | 'diamond' | 'netherite'

export const PICKAXE_LEVEL: Record<PickaxeTier, number> = {
  none: 0, wood: 1, copper: 2, iron: 3, diamond: 4, netherite: 5
}

export const PICKAXE_NAME: Record<PickaxeTier, string> = {
  none: '—',
  wood: 'Деревянная',
  copper: 'Медная',
  iron: 'Железная',
  diamond: 'Алмазная',
  netherite: 'Незеритовая'
}

export const ARMOR_REDUCTION: Record<ArmorTier, number> = {
  none: 0, leather: 0.20, copper: 0.35, iron: 0.55, diamond: 0.80, netherite: 0.92
}

export const ARMOR_NAME: Record<ArmorTier, string> = {
  none: 'Без брони',
  leather: 'Кожаная',
  copper: 'Медная',
  iron: 'Железная',
  diamond: 'Алмазная',
  netherite: 'Незеритовая'
}

// Мечи (NEW v4.2)
export type SwordTier = 'none' | 'wood' | 'stone' | 'iron' | 'diamond' | 'netherite'

export const SWORD_DAMAGE: Record<SwordTier, number> = {
  none: 0, wood: 5, stone: 8, iron: 12, diamond: 18, netherite: 25
}

export const SWORD_NAME: Record<SwordTier, string> = {
  none: '—',
  wood: 'Деревянный меч',
  stone: 'Каменный меч',
  iron: 'Железный меч',
  diamond: 'Алмазный меч',
  netherite: 'Незеритовый меч'
}

export type ActionType = 'walk' | 'mine' | 'craft' | 'trade' | 'observe' | 'combat'

export type AmbientType =
  | 'surface'
  | 'cave'
  | 'water'
  | 'lava'
  | 'monster'
  | 'diamond'
  | 'void'
  | 'village'    // NEW v2.4 — деревня
  | 'trials'     // NEW v2.4 — испытания
  | 'nether'     // NEW v2.4 — ад (тизер)

// Система актов (NEW v2.4)
export type ActId = 'act0' | 'act1' | 'act2' | 'act3' | 'act4'

export const ACT_META: Record<ActId, { label: string; icon: string; color: string }> = {
  act0: { label: 'Act 0: Пролог',           icon: '🏠', color: 'text-green-300' },
  act1: { label: 'Act 1: Спуск',           icon: '⛏️', color: 'text-cyan-300' },
  act2: { label: 'Act 2: The Trials',      icon: '🔑', color: 'text-amber-200' },
  act3: { label: 'Act 3: The Nether',      icon: '🌋', color: 'text-red-400' },
  act4: { label: 'Act 4: The End',         icon: '🌌', color: 'text-purple-300' }
}

export interface Effects {
  health?: number
  items?: Partial<Record<ResourceType, number>>
  flags?: string[]
  pickaxeTier?: PickaxeTier
  armor?: ArmorTier
}

export interface Choice {
  text: string
  next: string
  duration?: number
  action?: ActionType
  requires?: {
    items?: Partial<Record<ResourceType, number>>
    flag?: string
    notFlag?: string
    minHealth?: number
    minPickaxe?: PickaxeTier
    maxPickaxe?: PickaxeTier
  }
  effects?: Effects
}

export interface Scene {
  id: string
  depth: number
  act?: ActId                  // NEW v2.4 — к какому акту принадлежит
  title?: string
  text: string
  ambient: AmbientType
  choices: Choice[]
  onEnter?: Effects
  isEnding?: 'victory' | 'death'
  isHub?: boolean
  branch?: 'prelude' | 'start' | 'water' | 'lava' | 'dark' | 'gold' | 'diamond' | 'hunt' | 'trials' | 'surface2' | 'nether' | 'end' | 'end'
}

export interface GameState {
  sceneId: string
  act: ActId                   // NEW v2.4 — текущий акт
  health: number
  maxHealth: number
  inventory: Inventory
  flags: string[]
  pickaxeTier: PickaxeTier
  armor: ArmorTier
  log: string[]
  depth: number
  maxDepth: number
  turns: number
  visited: string[]
  // Прогресс актов
  act1Endings: string[]
  act2Endings: string[]
  act3Endings: string[]
  act4Endings: string[]        // NEW v4.0
  act2Unlocked: boolean
  act3Unlocked: boolean
  act4Unlocked: boolean        // NEW v4.0
}

export interface SaveData {
  state: GameState
  bestDepth: number
  victories: number
  deaths: number
  timestamp: number
}
