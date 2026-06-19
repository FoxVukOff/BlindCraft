// =====================================================
//  Retention: daily streak, достижения, статистика сессий
// =====================================================

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt?: number
}

export interface RetentionStats {
  // Сессии (убрали daily streak — пользователю не нужны)
  totalSessions: number
  totalPlayTime: number
  lastSessionStart: number

  // Достижения
  achievements: Achievement[]

  // Метрики
  totalActions: number
  totalScenesVisited: number
  deaths: number
  victories: number
}

const RETENTION_KEY = 'blindcraft_retention_v2'

export const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  // Базовые
  { id: 'first_step', name: 'Первый шаг', description: 'Начать игру', icon: '👣', unlocked: false },
  { id: 'first_death', name: 'Первая смерть', description: 'Умереть в первый раз', icon: '💀', unlocked: false },
  { id: 'first_victory', name: 'Первая победа', description: 'Получить первую концовку', icon: '🏆', unlocked: false },

  // Исследование
  { id: 'scenes_25', name: 'Любопытный', description: 'Посетить 25 сцен', icon: '🗺️', unlocked: false },
  { id: 'scenes_50', name: 'Исследователь', description: 'Посетить 50 сцен', icon: '🧭', unlocked: false },
  { id: 'scenes_100', name: 'Картограф', description: 'Посетить 100 сцен', icon: '📍', unlocked: false },
  { id: 'scenes_150', name: 'Путешественник', description: 'Посетить 150 сцен', icon: '🌍', unlocked: false },

  // Действия
  { id: 'actions_50', name: 'Начинающий', description: 'Сделать 50 действий', icon: '⚙️', unlocked: false },
  { id: 'actions_100', name: 'Деятель', description: 'Сделать 100 действий', icon: '🔧', unlocked: false },
  { id: 'actions_250', name: 'Трудяга', description: 'Сделать 250 действий', icon: '🔨', unlocked: false },
  { id: 'actions_500', name: 'Виртуоз', description: 'Сделать 500 действий', icon: '⭐', unlocked: false },

  // Победы и смерти
  { id: 'victories_1', name: 'Победитель', description: 'Получить 1 победу', icon: '🥇', unlocked: false },
  { id: 'victories_3', name: 'Триумфатор', description: 'Получить 3 победы', icon: '🥈', unlocked: false },
  { id: 'victories_5', name: 'Чемпион', description: 'Получить 5 побед', icon: '👑', unlocked: false },
  { id: 'deaths_5', name: 'Упорный', description: 'Умереть 5 раз', icon: '💀', unlocked: false },
  { id: 'deaths_10', name: 'Непобедимый', description: 'Умереть 10 раз', icon: '☠️', unlocked: false },

  // Концовки
  { id: 'all_endings', name: 'Все концовки', description: 'Получить все концовки', icon: '⚖️', unlocked: false },
  { id: 'ending_victory', name: 'Свет', description: 'Получить концовку «Свет»', icon: '✨', unlocked: false },
  { id: 'ending_surrender', name: 'Уход', description: 'Получить концовку «Уход»', icon: '🚶', unlocked: false },
  { id: 'ending_trials_master', name: 'Мастер Испытаний', description: 'Получить концовку «Мастер Испытаний»', icon: '🔑', unlocked: false },
  { id: 'ending_act2_complete', name: 'Врата открыты', description: 'Получить концовку «Портал открыт»', icon: '🌋', unlocked: false },

  // Прогресс Act 1
  { id: 'got_wood', name: 'Лесоруб', description: 'Подобрать дерево', icon: '🪵', unlocked: false },
  { id: 'got_coal', name: 'Шахтёр', description: 'Добыть уголь', icon: '⚫', unlocked: false },
  { id: 'got_copper', name: 'Медник', description: 'Добыть медь', icon: '🟠', unlocked: false },
  { id: 'got_iron', name: 'Железных дел мастер', description: 'Добыть железо', icon: '⚙️', unlocked: false },
  { id: 'got_gold', name: 'Золотоискатель', description: 'Собрать золото', icon: '🟡', unlocked: false },
  { id: 'got_diamonds', name: 'Алмазный король', description: 'Добыть алмазы', icon: '💎', unlocked: false },
  { id: 'got_mace', name: 'Оружие Строителей', description: 'Получить булаву', icon: '🔱', unlocked: false },

  // Прогресс Act 2
  { id: 'act2_unlocked', name: 'Продолжение следует', description: 'Открыть Act 2', icon: '🎭', unlocked: false },
  { id: 'trials_complete', name: 'Прошёл Испытания', description: 'Пройти Trials', icon: '🗝️', unlocked: false },
  { id: 'portal_built', name: 'Архитектор', description: 'Построить портал в Ад', icon: '🔮', unlocked: false },
  { id: 'got_nether_star', name: 'Звезда', description: 'Получить звезду Нужера', icon: '🌟', unlocked: false },
  { id: 'forest_shrine', name: 'Жрец леса', description: 'Найти святилище в лесу', icon: '✨', unlocked: false },
  { id: 'fortress_explorer', name: 'Крепостной страж', description: 'Исследовать крепость', icon: '🏰', unlocked: false },
  { id: 'lake_discoverer', name: 'Подводник', description: 'Найти подземное озеро', icon: '🌊', unlocked: false },

  // Прогресс Act 3
  { id: 'nether_entered', name: 'Путник во тьме', description: 'Войти в Нижний мир', icon: '🌋', unlocked: false },
  { id: 'nether_fortress', name: 'Завоеватель', description: 'Найти Адскую крепость', icon: '🔥', unlocked: false },
  { id: 'killed_wither', name: 'Убийца Иссушителя', description: 'Победить Иссушителя', icon: '💀', unlocked: false },
  { id: 'nether_star_real', name: 'Настоящая звезда', description: 'Получить настоящую звезду Нужера', icon: '⭐', unlocked: false },
  { id: 'nether_complete', name: 'Покоритель Ада', description: 'Завершить Act 3', icon: '👹', unlocked: false },

  // Прогресс Act 4
  { id: 'end_entered', name: 'В конце всего', description: 'Войти в Край', icon: '🌌', unlocked: false },
  { id: 'end_city_found', name: 'Город в пустоте', description: 'Найти Энд-сити', icon: '🏙️', unlocked: false },
  { id: 'got_elytra', name: 'Крылья', description: 'Получить элитры', icon: '🪽', unlocked: false },
  { id: 'killed_dragon', name: 'Драконоборец', description: 'Победить Дракона Края', icon: '🐉', unlocked: false },
  { id: 'got_dragon_egg', name: 'Яйцо', description: 'Получить яйцо дракона', icon: '🥚', unlocked: false },
  { id: 'end_complete', name: 'Конец', description: 'Завершить Act 4', icon: '🏁', unlocked: false },
  { id: 'end_absorbed', name: 'Дракон', description: 'Поглотить силу дракона', icon: '🐲', unlocked: false },
  { id: 'end_spared', name: 'Милосердный', description: 'Пощадить нового дракона', icon: '🕊️', unlocked: false },

  // Секретные
  { id: 'dice_winner', name: 'Игрок', description: 'Выиграть в кости', icon: '🎲', unlocked: false },
  { id: 'wish_maker', name: 'Мечтатель', description: 'Загадать желание в колодце', icon: '🪙', unlocked: false },
  { id: 'well_listener', name: 'Слышащий', description: 'Услышать звон Строителей', icon: '🔔', unlocked: false },
  { id: 'stranger_met', name: 'Встреча', description: 'Встретить Строителя-путника', icon: '🧙', unlocked: false }
]

export const DEFAULT_RETENTION: RetentionStats = {
  totalSessions: 0,
  totalPlayTime: 0,
  lastSessionStart: 0,
  achievements: DEFAULT_ACHIEVEMENTS,
  totalActions: 0,
  totalScenesVisited: 0,
  deaths: 0,
  victories: 0
}

export function loadRetention(): RetentionStats {
  if (typeof window === 'undefined') return { ...DEFAULT_RETENTION }
  try {
    const raw = localStorage.getItem(RETENTION_KEY)
    if (!raw) return { ...DEFAULT_RETENTION }
    const parsed = JSON.parse(raw) as Partial<RetentionStats>
    // Миграция достижений — добавляем новые если их нет
    const existingAchievements = parsed.achievements || []
    const mergedAchievements = DEFAULT_ACHIEVEMENTS.map(def => {
      const existing = existingAchievements.find(a => a.id === def.id)
      return existing || def
    })
    return {
      ...DEFAULT_RETENTION,
      ...parsed,
      achievements: mergedAchievements
    }
  } catch {
    return { ...DEFAULT_RETENTION }
  }
}

export function saveRetention(stats: RetentionStats) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(RETENTION_KEY, JSON.stringify(stats))
  } catch {}
}

// Регистрация новой сессии (без streak — не нужен)
export function registerSession(stats: RetentionStats): RetentionStats {
  const now = Date.now()
  return {
    ...stats,
    totalSessions: stats.totalSessions + 1,
    lastSessionStart: now
  }
}

// Разблокировка достижения
export function unlockAchievement(
  stats: RetentionStats,
  achievementId: string
): { stats: RetentionStats; newlyUnlocked: boolean } {
  const achievement = stats.achievements.find(a => a.id === achievementId)
  if (!achievement || achievement.unlocked) {
    return { stats, newlyUnlocked: false }
  }

  const newStats: RetentionStats = {
    ...stats,
    achievements: stats.achievements.map(a =>
      a.id === achievementId
        ? { ...a, unlocked: true, unlockedAt: Date.now() }
        : a
    )
  }

  return { stats: newStats, newlyUnlocked: true }
}

// Проверка достижений на основе метрик и состояния игры
export function checkAchievements(stats: RetentionStats, gameState: {
  victories: number
  deaths: number
  act2Unlocked: boolean
  act1Endings: string[]
  act2Endings: string[]
  act3Endings: string[]
  act4Endings: string[]
  visited: string[]
  flags: string[]
  inventory: Partial<Record<string, number>>
}): { stats: RetentionStats; newlyUnlocked: string[] } {
  let newStats = stats
  const newlyUnlocked: string[] = []

  const tryUnlock = (id: string, condition: boolean) => {
    if (condition) {
      const result = unlockAchievement(newStats, id)
      if (result.newlyUnlocked) {
        newStats = result.stats
        newlyUnlocked.push(id)
      }
    }
  }

  const totalScenes = Math.max(gameState.visited.length, newStats.totalScenesVisited)
  const totalEndings = gameState.act1Endings.length + gameState.act2Endings.length

  // Базовые
  tryUnlock('first_step', true)
  tryUnlock('first_death', gameState.deaths > 0 || newStats.deaths > 0)
  tryUnlock('first_victory', gameState.victories > 0 || newStats.victories > 0)

  // Исследование
  tryUnlock('scenes_25', totalScenes >= 25)
  tryUnlock('scenes_50', totalScenes >= 50)
  tryUnlock('scenes_100', totalScenes >= 100)
  tryUnlock('scenes_150', totalScenes >= 150)

  // Действия
  tryUnlock('actions_50', newStats.totalActions >= 50)
  tryUnlock('actions_100', newStats.totalActions >= 100)
  tryUnlock('actions_250', newStats.totalActions >= 250)
  tryUnlock('actions_500', newStats.totalActions >= 500)

  // Победы и смерти
  const totalV = Math.max(gameState.victories, newStats.victories)
  const totalD = Math.max(gameState.deaths, newStats.deaths)
  tryUnlock('victories_1', totalV >= 1)
  tryUnlock('victories_3', totalV >= 3)
  tryUnlock('victories_5', totalV >= 5)
  tryUnlock('deaths_5', totalD >= 5)
  tryUnlock('deaths_10', totalD >= 10)

  // Концовки
  tryUnlock('all_endings', totalEndings >= 5)
  tryUnlock('ending_victory', gameState.act1Endings.includes('ending_victory'))
  tryUnlock('ending_surrender', gameState.act1Endings.includes('ending_surrender'))
  tryUnlock('ending_trials_master', gameState.act2Endings.includes('ending_trials_master'))
  tryUnlock('ending_act2_complete', gameState.act2Endings.includes('ending_act2_complete'))

  // Прогресс Act 1
  tryUnlock('got_wood', gameState.flags.includes('got_wood'))
  tryUnlock('got_coal', gameState.flags.includes('got_coal'))
  tryUnlock('got_copper', gameState.flags.includes('got_copper'))
  tryUnlock('got_iron', gameState.flags.includes('got_iron') || gameState.flags.includes('got_iron_pickaxe'))
  tryUnlock('got_gold', gameState.flags.includes('got_gold'))
  tryUnlock('got_diamonds', gameState.flags.includes('mined_diamonds'))
  tryUnlock('got_mace', gameState.flags.includes('got_mace') || (gameState.inventory.mace ?? 0) > 0)

  // Прогресс Act 2
  tryUnlock('act2_unlocked', gameState.act2Unlocked)
  tryUnlock('trials_complete', gameState.flags.includes('completed_trials'))
  tryUnlock('portal_built', gameState.flags.includes('portal_built'))
  tryUnlock('got_nether_star', gameState.flags.includes('got_nether_star') || (gameState.inventory.nether_star ?? 0) > 0)
  tryUnlock('forest_shrine', gameState.flags.includes('found_forest_shrine'))
  tryUnlock('fortress_explorer', gameState.flags.includes('found_fortress_map') || gameState.flags.includes('searched_lord'))
  tryUnlock('lake_discoverer', gameState.flags.includes('got_lake_keys') || gameState.flags.includes('drank_lake'))

  // Прогресс Act 3
  tryUnlock('nether_entered', gameState.flags.includes('nether_entered'))
  tryUnlock('nether_fortress', gameState.flags.includes('found_nether_fortress') || gameState.flags.includes('reached_nether_fortress'))
  tryUnlock('killed_wither', gameState.flags.includes('killed_wither'))
  tryUnlock('nether_star_real', gameState.flags.includes('got_real_nether_star'))
  tryUnlock('nether_complete', gameState.flags.includes('nether_complete'))

  // Прогресс Act 4
  tryUnlock('end_entered', gameState.flags.includes('end_entered'))
  tryUnlock('end_city_found', gameState.flags.includes('found_big_city') || gameState.flags.includes('saw_ship'))
  tryUnlock('got_elytra', gameState.flags.includes('got_elytra') || (gameState.inventory.elytra ?? 0) > 0)
  tryUnlock('killed_dragon', gameState.flags.includes('killed_dragon'))
  tryUnlock('got_dragon_egg', gameState.flags.includes('dragon_dead') || (gameState.inventory.dragon_egg ?? 0) > 0)
  tryUnlock('end_complete', gameState.flags.includes('end_entered') && gameState.flags.includes('dragon_dead'))
  tryUnlock('end_absorbed', gameState.act4Endings?.includes('ending_absorb_dragon'))
  tryUnlock('end_spared', gameState.act4Endings?.includes('ending_spare_dragon'))

  // Секретные
  tryUnlock('dice_winner', gameState.flags.includes('won_dice'))
  tryUnlock('wish_maker', gameState.flags.includes('made_wish'))
  tryUnlock('well_listener', gameState.flags.includes('heard_well_bell'))
  tryUnlock('stranger_met', gameState.flags.includes('met_stranger'))

  return { stats: newStats, newlyUnlocked }
}

// Обновление метрик
export function incrementActions(stats: RetentionStats): RetentionStats {
  return { ...stats, totalActions: stats.totalActions + 1 }
}

export function addVictory(stats: RetentionStats): RetentionStats {
  return { ...stats, victories: stats.victories + 1 }
}

export function addDeath(stats: RetentionStats): RetentionStats {
  return { ...stats, deaths: stats.deaths + 1 }
}

export function addScenesVisited(stats: RetentionStats, count: number): RetentionStats {
  return { ...stats, totalScenesVisited: stats.totalScenesVisited + count }
}
