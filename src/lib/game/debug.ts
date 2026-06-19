// =====================================================
//  DEBUG: INEEDTHIS100PERCENTSAVE
//  Полное 100% прохождение для v4.3
//  Активируется через консоль: window.__debugSave100()
// =====================================================

import type { GameState, SaveData, ResourceType, PickaxeTier, ArmorTier } from './types'
import { ALL_SCENES } from './story'
import { DEFAULT_RETENTION, type RetentionStats } from './retention'

// Все ID сцен для 100% visited
const ALL_SCENE_IDS = Object.keys(ALL_SCENES)

// Все концовки по актам
const ACT1_ENDINGS = ['ending_victory', 'ending_surrender', 'death_generic']
const ACT2_ENDINGS = ['ending_trials_master', 'ending_act2_complete']

// Полный инвентарь со всеми предметами
const FULL_INVENTORY: Partial<Record<ResourceType, number>> = {
  wood: 99,
  stone: 99,
  coal: 99,
  copper: 99,
  iron: 99,
  gold: 99,
  diamond: 99,
  leather: 99,
  meat: 99,
  torch: 99,
  campfire: 50,
  food: 99,
  mushroom: 99,
  arrow: 99,
  trial_key: 99,
  mace: 1,
  breeze_rod: 5,
  vault_loot: 99,
  obsidian: 99,
  nether_star: 3,
  netherrack: 50,
  blaze_rod: 10,
  wither_skull: 3,
  glowstone: 20,
  soul_sand: 10,
  end_stone: 50,
  chorus_fruit: 20,
  purpur: 20,
  shulker_shell: 10,
  elytra: 1,
  dragon_egg: 1,
  ender_pearl: 20,
  netherite_ingot: 5,
  sword_wood: 1,
  sword_stone: 1,
  sword_iron: 1,
  sword_diamond: 1,
  sword_netherite: 1
}

// Все сюжетные флаги
const ALL_FLAGS = [
  // Act 1
  'entered_cave',
  'got_wood',
  'got_wood_pickaxe',
  'got_coal',
  'got_copper',
  'has_torch',
  'chose_water',
  'waded_water',
  'got_iron',
  'chose_lava',
  'crossed_bridge',
  'chose_dark',
  'torch_used_dark',
  'got_leather_monster',
  'got_leather',
  'survived_monster',
  'evaded_monster',
  'wounded',
  'chose_hunt',
  'got_meat_rabbits',
  'got_meat_bear',
  'fought_bear',
  'met_hunter_flag',
  'knows_secret',
  'got_gold',
  'opened_chest',
  'got_iron_pickaxe',
  'has_leather_armor',
  'has_copper_armor',
  'has_iron_armor',
  'has_diamond_armor',
  'got_copper_pickaxe',
  'drank_well',
  'drank_gold_well',
  'reached_diamonds',
  'mined_diamonds',
  // Trials
  'found_trials',
  'opened_trials',
  'trials_started',
  'got_trial_key',
  'got_mace',
  'completed_trials',
  // Act 2
  'act2_started',
  'act2Unlocked',
  'found_act2_crypt',
  'found_act2_hill',
  'learned_nether_recipe',
  'got_obsidian',
  'portal_built',
  // Act 2 extra
  'met_elder', 'elder_forest', 'elder_fortress', 'elder_well', 'elder_moonstone', 'elder_builders',
  'drank_village_well', 'made_wish', 'heard_well_bell', 'met_stranger', 'got_stranger_gift', 'heard_stranger_secret',
  'found_forest_shrine', 'shrine_fire', 'shrine_earth', 'shrine_air',
  'searched_ruins', 'found_fortress_map', 'searched_lord', 'got_lord_amulet', 'got_fortress_obsidian',
  'searched_cellar', 'got_lake_keys', 'drank_lake', 'got_nether_star',
  'forest_mushrooms', 'forest_herbs', 'got_moonstone', 'hunted_boar',
  'won_dice',
  // Act 3
  'nether_entered', 'act3Unlocked', 'reached_nether_fortress', 'got_blaze_rods',
  'opened_tower_chest', 'got_wither_skull_1', 'saw_altar', 'searched_fortress', 'got_wither_skull_2',
  'freed_builder', 'got_wither_skull_3', 'got_builder_shard', 'killed_piglins', 'piglin_alliance', 'piglin_loot',
  'examined_skeleton', 'learned_truth', 'found_crimson_trees', 'mined_soul_sand',
  'mined_netherrack', 'mined_glowstone', 'summoned_wither', 'killed_wither', 'got_real_nether_star', 'nether_complete',
  // Act 4
  'end_entered', 'act4Unlocked', 'crystals_destroyed', 'dragon_dead', 'killed_dragon', 'got_elytra', 'tested_elytra',
  'examined_egg', 'saw_ship', 'found_big_city', 'searched_outer_ships', 'found_chorus_forest',
  'found_end_ruins', 'learned_final_truth', 'searched_end_ruins', 'found_end_crystal',
  'got_chorus', 'mined_end_stone', 'searched_city_outskirts', 'searched_city_halls',
  'searched_towers', 'got_dragon_head',
  // v4.3
  'found_ancient_debris', 'got_netherite_pickaxe', 'has_netherite_armor',
  'prelude_got_wood', 'prelude_got_stone', 'prelude_remembered_father', 'prelude_breakfast',
  'prelude_well_drank', 'prelude_heard_bell', 'met_neighbor', 'neighbor_tea',
  'got_diamond_pickaxe', 'has_diamond_armor'
]

export function create100PercentState(): GameState {
  return {
    sceneId: 'ending_nether_complete',
    act: 'act3',
    health: 100,
    maxHealth: 100,
    inventory: { ...FULL_INVENTORY },
    flags: [...ALL_FLAGS],
    pickaxeTier: 'netherite' as PickaxeTier,
    armor: 'netherite' as ArmorTier,
    log: [
      '[DEBUG] 100% прохождение активировано',
      'Все сцены открыты, все предметы получены',
      'Act 1, Act 2 и Act 3 пройдены'
    ],
    depth: 6,
    maxDepth: 6,
    turns: 999,
    visited: [...ALL_SCENE_IDS],
    act1Endings: ['ending_victory', 'ending_surrender', 'death_generic'],
    act2Endings: ['ending_trials_master', 'ending_act2_complete'],
    act3Endings: ['ending_nether_complete', 'ending_become_builder', 'ending_go_home'],
    act4Endings: ['ending_absorb_dragon', 'ending_spare_dragon', 'ending_end_return_home'],
    act2Unlocked: true,
    act3Unlocked: true,
    act4Unlocked: true
  }
}

export function create100PercentSave(): SaveData {
  return {
    state: create100PercentState(),
    bestDepth: 6,
    victories: 10,
    deaths: 1,
    timestamp: Date.now()
  }
}

// Установка в localStorage
export function apply100PercentSave(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const save = create100PercentSave()
    localStorage.setItem('blindcraft_save_v3', JSON.stringify(save))
    localStorage.setItem('blindcraft_stats_v3', JSON.stringify({
      bestDepth: save.bestDepth,
      victories: save.victories,
      deaths: save.deaths
    }))
    // v4.3: Также выдаём все достижения
    const retention: RetentionStats = {
      ...DEFAULT_RETENTION,
      totalSessions: 99,
      totalPlayTime: 36000, // 10 часов
      lastSessionStart: Date.now(),
      totalActions: 999,
      totalScenesVisited: 200,
      deaths: 1,
      victories: 7,
      achievements: DEFAULT_RETENTION.achievements.map(a => ({
        ...a,
        unlocked: true,
        unlockedAt: Date.now()
      }))
    }
    localStorage.setItem('blindcraft_retention_v2', JSON.stringify(retention))
    return true
  } catch {
    return false
  }
}

// Авто-регистрация глобальной функции для консоли
export function registerDebugHooks(onApply: () => void) {
  if (typeof window === 'undefined') return
  ;(window as unknown as { __debugSave100?: () => string }).__debugSave100 = () => {
    const ok = apply100PercentSave()
    if (ok) {
      onApply()
      return 'OK'
    }
    return 'ERROR'
  }

  ;(window as unknown as { __debugInfo?: () => string }).__debugInfo = () => {
    const save = JSON.parse(localStorage.getItem('blindcraft_save_v3') || '{}')
    console.table({
      'Сцена': save.state?.sceneId || '—',
      'Акт': save.state?.act || '—',
      'HP': `${save.state?.health}/${save.state?.maxHealth}`,
      'Кирка': save.state?.pickaxeTier,
      'Броня': save.state?.armor,
      'Глубина': save.state?.depth,
      'Ходов': save.state?.turns,
      'Посещено сцен': save.state?.visited?.length,
      'Концовок Act 1': save.state?.act1Endings?.length,
      'Концовок Act 2': save.state?.act2Endings?.length,
      'Act 2 открыт': save.state?.act2Unlocked,
      'Побед': save.victories,
      'Смертей': save.deaths,
      'Рекорд глубины': save.bestDepth
    })
    return 'OK'
  }

  ;(window as unknown as { __debugReset?: () => string }).__debugReset = () => {
    localStorage.removeItem('blindcraft_save_v3')
    localStorage.removeItem('blindcraft_stats_v3')
    localStorage.removeItem('blindcraft_save_v2')
    localStorage.removeItem('blindcraft_stats_v2')
    return 'OK'
  }
}
