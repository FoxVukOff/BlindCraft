'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import type { GameState, ResourceType, Effects, Choice, PickaxeTier, ArmorTier, ActionType, Scene } from '@/lib/game/types'
import { PICKAXE_LEVEL, ARMOR_REDUCTION, PICKAXE_NAME, ARMOR_NAME, ACT_META } from '@/lib/game/types'
import { getScene, BRANCH_META } from '@/lib/game/story'
import { audioEngine, vibrate, VIBRO_PATTERNS } from '@/lib/game/audio'
import { INITIAL_STATE, loadSave, saveGame, loadStats, clearSave, hasSave } from '@/lib/game/storage'
import { registerDebugHooks, apply100PercentSave } from '@/lib/game/debug'
import {
  loadRetention, saveRetention, registerSession, checkAchievements,
  incrementActions, addVictory, addDeath, addScenesVisited, DEFAULT_RETENTION,
  type RetentionStats
} from '@/lib/game/retention'
import { useDevice } from '@/hooks/use-device'
import { InventoryBar } from './Inventory'
import { StoryMap } from './StoryMap'
import { ChangelogModal } from './ChangelogModal'
import { DesktopLayout } from './DesktopLayout'
import { StoryReader } from './StoryReader'
import { ConfirmResetModal } from './ConfirmResetModal'
import { DebugAccessModal } from './DebugAccessModal'
import { AchievementsModal } from './AchievementsModal'

interface ActionProgress {
  choice: Choice
  start: number
  duration: number
  elapsed: number
}

const ACTION_META: Record<ActionType, { icon: string; label: string; color: string }> = {
  walk:    { icon: '🚶', label: 'Идти',       color: 'text-cyan-300' },
  mine:    { icon: '⛏️', label: 'Копать',     color: 'text-amber-300' },
  craft:   { icon: '🔨', label: 'Крафт',      color: 'text-orange-300' },
  trade:   { icon: '🤝', label: 'Обмен',      color: 'text-yellow-300' },
  observe: { icon: '👁️', label: 'Осмотреть',  color: 'text-sky-300' },
  combat:  { icon: '⚔️', label: 'Действие',   color: 'text-red-300' }
}

export function GameScreen() {
  const [state, setState] = useState<GameState>(INITIAL_STATE)
  const [action, setAction] = useState<ActionProgress | null>(null)
  const [showMenu, setShowMenu] = useState(false)
  const [showTree, setShowTree] = useState(false)
  const [showChangelog, setShowChangelog] = useState(false)
  const [showStory, setShowStory] = useState(false)
  const [showActSwitch, setShowActSwitch] = useState(false)
  const [showConfirmReset, setShowConfirmReset] = useState(false)
  const [showDebugAccess, setShowDebugAccess] = useState(false)
  const [showAchievements, setShowAchievements] = useState(false)
  const [showIntro, setShowIntro] = useState(true)
  const [audioOn, setAudioOn] = useState(true)
  const [toast, setToast] = useState<string | null>(null)
  // v4.2: retention — достижения и метрики (без streak)
  const [retention, setRetention] = useState<RetentionStats>(() => {
    if (typeof window === 'undefined') return DEFAULT_RETENTION
    const stats = loadRetention()
    const updated = registerSession(stats)
    saveRetention(updated)
    return updated
  })
  const actionIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  // v2.1: ref для защиты от дубля статистики при финале
  const lastEndingSceneId = useRef<string | null>(null)
  // v2.2: определение устройства
  const device = useDevice()
  const isDesktopLayout = device.isDesktop

  // v2.5: регистрация debug hooks для консоли (до early return)
  useEffect(() => {
    registerDebugHooks(() => {
      setToast('✅ Контент разблокирован! Перезагрузка...')
    })
  }, [])

  // ====== Инициализация — ленивая через useState ======
  const [bestDepth, setBestDepth] = useState(() => typeof window !== 'undefined' ? loadStats().bestDepth : 0)
  const [victories, setVictories] = useState(() => typeof window !== 'undefined' ? loadStats().victories : 0)
  const [deaths, setDeaths] = useState(() => typeof window !== 'undefined' ? loadStats().deaths : 0)
  const [hasContinue, setHasContinue] = useState(() => typeof window !== 'undefined' ? hasSave() : false)

  // v2.5: кастомный сброс сейва с двойным подтверждением
  const performFullReset = useCallback(() => {
    clearSave()
    localStorage.removeItem('blindcraft_stats_v3')
    localStorage.removeItem('blindcraft_save_v2')
    localStorage.removeItem('blindcraft_stats_v2')
    localStorage.removeItem('blindcraft_save_v1')
    localStorage.removeItem('blindcraft_stats_v1')
    setState({ ...INITIAL_STATE, log: ['Ты стоишь у входа в шахту.'], visited: ['start'] })
    setBestDepth(0)
    setVictories(0)
    setDeaths(0)
    setHasContinue(false)
    setShowConfirmReset(false)
    setShowMenu(false)
    setShowIntro(true)
    lastEndingSceneId.current = null
    setToast('🗑️ Сохранение удалено')
  }, [])

  // v2.5: применение 100% сейва (debug)
  const applyHundredPercent = useCallback(() => {
    if (apply100PercentSave()) {
      setToast('✅ Контент разблокирован! Перезагрузка...')
      setTimeout(() => window.location.reload(), 1500)
    }
  }, [])

  // v2.5: секретный вход в debug — 5 тапов по версии за 3 секунды
  const versionTapCount = useRef(0)
  const versionTapTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const handleVersionTap = useCallback(() => {
    versionTapCount.current += 1
    if (versionTapTimer.current) clearTimeout(versionTapTimer.current)
    if (versionTapCount.current >= 5) {
      versionTapCount.current = 0
      setShowDebugAccess(true)
    } else {
      versionTapTimer.current = setTimeout(() => {
        versionTapCount.current = 0
      }, 3000)
    }
  }, [])

  // v2.5: показать инфо о сейве в консоли
  const showDebugInfo = useCallback(() => {
    if (typeof window !== 'undefined' && (window as unknown as { __debugInfo?: () => void }).__debugInfo) {
      ;(window as unknown as { __debugInfo: () => void }).__debugInfo()
    }
  }, [])

  // ====== Подгрузка амбиента ======
  const scene = getScene(state.sceneId)
  useEffect(() => {
    if (showIntro) return
    audioEngine.init()
    audioEngine.setAmbient(scene.ambient)
  }, [scene.ambient, showIntro])

  // ====== Автосохранение ======
  useEffect(() => {
    if (showIntro) return
    saveGame(state, { victories, deaths })
  }, [state, showIntro, victories, deaths])

  // ====== Тосты ======
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2500)
    return () => clearTimeout(t)
  }, [toast])

  // ====== Применение эффектов (с учётом брони) ======
  const applyEffects = useCallback((prev: GameState, effects?: Effects): GameState => {
    const next: GameState = { ...prev, inventory: { ...prev.inventory }, flags: [...prev.flags], log: [...prev.log] }
    if (effects) {
      // Урон — редуцируется бронёй
      if (effects.health && effects.health < 0) {
        const reduction = ARMOR_REDUCTION[next.armor] ?? 0
        const reducedDamage = Math.round(Math.abs(effects.health) * (1 - reduction))
        next.health = Math.max(0, next.health - reducedDamage)
        if (reduction > 0 && reducedDamage > 0) {
          // Тост про поглощение бронёй
          const absorbed = Math.abs(effects.health) - reducedDamage
          if (absorbed > 0) {
            setToast(`🛡️ Броня поглотила ${absorbed} урона`)
          }
        }
      } else if (effects.health) {
        // Лечение
        next.health = Math.min(next.maxHealth, next.health + effects.health)
      }
      // Предметы
      if (effects.items) {
        for (const [k, v] of Object.entries(effects.items)) {
          const key = k as ResourceType
          const cur = next.inventory[key] ?? 0
          const nv = Math.max(0, cur + (v ?? 0))
          next.inventory[key] = nv
          if ((v ?? 0) > 0) {
            audioEngine.pickup(key)
            vibrate(VIBRO_PATTERNS.pickup)
          }
        }
      }
      // Флаги
      if (effects.flags) {
        for (const f of effects.flags) {
          if (!next.flags.includes(f)) next.flags.push(f)
        }
      }
      // Кирка — только апгрейд
      if (effects.pickaxeTier) {
        const currentLevel = PICKAXE_LEVEL[next.pickaxeTier]
        const newLevel = PICKAXE_LEVEL[effects.pickaxeTier]
        if (newLevel > currentLevel) {
          next.pickaxeTier = effects.pickaxeTier
          audioEngine.pickaxeUpgrade()
          vibrate(VIBRO_PATTERNS.upgrade)
          setToast(`⛏️ Новая кирка: ${PICKAXE_NAME[effects.pickaxeTier]}`)
        }
      }
      // Броня — только апгрейд
      if (effects.armor) {
        const currentLevel = ['none', 'leather', 'copper', 'iron', 'diamond'].indexOf(next.armor)
        const newLevel = ['none', 'leather', 'copper', 'iron', 'diamond'].indexOf(effects.armor)
        if (newLevel > currentLevel) {
          next.armor = effects.armor
          audioEngine.armorEquip()
          vibrate(VIBRO_PATTERNS.armor)
          setToast(`🛡️ Надета ${ARMOR_NAME[effects.armor]} броня`)
        }
      }
    }
    return next
  }, [])

  // ====== Переход на новую сцену ======
  const goToScene = useCallback((sceneId: string, choiceEffects?: Effects, stayOnSameScene: boolean = false) => {
    setState(prev => {
      let next = applyEffects(prev, choiceEffects)
      if (!stayOnSameScene) {
        const target = getScene(sceneId)
        next = applyEffects(next, target.onEnter)
        next.sceneId = sceneId
        next.depth = Math.max(next.depth, target.depth)
        next.maxDepth = Math.max(next.maxDepth, target.depth)
        next.turns += 1
        // Добавить в visited
        if (!next.visited.includes(sceneId)) {
          next.visited = [...next.visited, sceneId]
        }
        // Лог
        const logLine = target.text.slice(0, 90).replace(/\n/g, ' ') + (target.text.length > 90 ? '…' : '')
        next.log = [...next.log, logLine].slice(-30)
        // Проверка смерти от урона
        if (next.health <= 0) {
          next.health = 0
          next.sceneId = 'death_generic'
          if (!next.visited.includes('death_generic')) {
            next.visited = [...next.visited, 'death_generic']
          }
        }
        // Финал — победа/смерть (v2.1: защита от дубля статистики)
        const finalScene = getScene(next.sceneId)
        if (finalScene.isEnding && lastEndingSceneId.current !== next.sceneId) {
          lastEndingSceneId.current = next.sceneId
          // v2.4: отслеживание концовок по актам
          const act = finalScene.act || 'act1'
          if (act === 'act1' && !next.act1Endings.includes(next.sceneId)) {
            next.act1Endings = [...next.act1Endings, next.sceneId]
            // Открываем Act 2 после любой концовки Act 1
            next.act2Unlocked = true
            setTimeout(() => setToast('🔓 Act 2 разблокирован!'), 500)
          }
          if (act === 'act2' && !next.act2Endings.includes(next.sceneId)) {
            next.act2Endings = [...next.act2Endings, next.sceneId]
          }
          // Обновляем текущий акт на основе финальной сцены
          next.act = act
          if (finalScene.isEnding === 'victory') {
            setTimeout(() => {
              audioEngine.victory()
              vibrate(VIBRO_PATTERNS.victory)
              setVictories(v => v + 1)
            }, 0)
          } else if (finalScene.isEnding === 'death') {
            setTimeout(() => {
              audioEngine.death()
              vibrate(VIBRO_PATTERNS.death)
              setDeaths(d => d + 1)
            }, 0)
          }
        }
      } else {
        // Для торгов — добавляем запись в лог
        next.log = [...next.log, '🤝 Обмен завершён'].slice(-30)
      }
      return next
    })
    // v4.2: обновление retention — действия и сцены
    setRetention(prev => {
      const withAction = incrementActions(prev)
      if (!stayOnSameScene) {
        const withScenes = addScenesVisited(withAction, 1)
        // Проверка достижений
        const result = checkAchievements(withScenes, {
          victories,
          deaths,
          act2Unlocked: state.act2Unlocked,
          act1Endings: state.act1Endings,
          act2Endings: state.act2Endings,
          act3Endings: state.act3Endings,
          act4Endings: state.act4Endings,
          visited: state.visited,
          flags: state.flags,
          inventory: state.inventory
        })
        // Показать тосты за новые достижения
        if (result.newlyUnlocked.length > 0) {
          result.newlyUnlocked.forEach(id => {
            const ach = result.stats.achievements.find(a => a.id === id)
            if (ach) {
              setTimeout(() => setToast(`🏆 Достижение: ${ach.name}`), 500)
            }
          })
        }
        saveRetention(result.stats)
        return result.stats
      }
      saveRetention(withAction)
      return withAction
    })
  }, [applyEffects, victories, deaths, state.act2Unlocked, state.act1Endings, state.act2Endings, state.act3Endings, state.act4Endings, state.visited, state.flags, state.inventory])

  // ====== Запуск действия ======
  const startAction = useCallback((choice: Choice) => {
    if (action) return
    const duration = choice.duration ?? 3000
    const actionType = choice.action || 'walk'

    // Звук + вибрация
    audioEngine.init()
    audioEngine.resume()
    audioEngine.click()
    vibrate(VIBRO_PATTERNS.click)

    // Если длительность 0 — мгновенно
    if (duration <= 0) {
      const isStay = choice.next === '@self'
      goToScene(choice.next, choice.effects, isStay)
      return
    }

    // Запускаем звук действия
    switch (actionType) {
      case 'walk':    audioEngine.walk(duration); vibrate(VIBRO_PATTERNS.walk); break
      case 'mine':    audioEngine.mineAction(duration); vibrate(VIBRO_PATTERNS.mine); break
      case 'craft':   audioEngine.craftAction(duration); vibrate(VIBRO_PATTERNS.craft); break
      case 'trade':   audioEngine.tradeAction(duration); vibrate(VIBRO_PATTERNS.trade); break
      case 'observe': audioEngine.observeAction(duration); vibrate(VIBRO_PATTERNS.observe); break
      case 'combat':  audioEngine.combatAction(duration); vibrate(VIBRO_PATTERNS.combat); break
    }

    // Прогресс
    const start = Date.now()
    setAction({ choice, start, duration, elapsed: 0 })

    actionIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - start
      if (elapsed >= duration) {
        if (actionIntervalRef.current) {
          clearInterval(actionIntervalRef.current)
          actionIntervalRef.current = null
        }
        setAction(prev => {
          if (!prev) return null
          const isStay = prev.choice.next === '@self'
          // Завершаем — переходим
          setTimeout(() => {
            goToScene(prev.choice.next, prev.choice.effects, isStay)
          }, 50)
          return null
        })
      } else {
        setAction(prev => prev ? { ...prev, elapsed } : null)
      }
    }, 100)
  }, [action, goToScene])

  // Очистка интервала
  useEffect(() => {
    return () => {
      if (actionIntervalRef.current) {
        clearInterval(actionIntervalRef.current)
      }
    }
  }, [])

  // ====== Использовать гриб ======
  const useMushroom = useCallback(() => {
    if (action) return
    setState(prev => {
      const count = prev.inventory.mushroom ?? 0
      if (count <= 0) return prev
      const next = { ...prev, inventory: { ...prev.inventory, mushroom: count - 1 } }
      next.health = Math.min(next.maxHealth, next.health + 35)
      audioEngine.pickup('mushroom')
      vibrate(VIBRO_PATTERNS.pickup)
      next.log = [...next.log, '🍄 Съел гриб. +35 HP'].slice(-30)
      return next
    })
  }, [action])

  // v2.2: Использовать приготовленную еду (+50 HP)
  const useFood = useCallback(() => {
    if (action) return
    setState(prev => {
      const count = prev.inventory.food ?? 0
      if (count <= 0) return prev
      const next = { ...prev, inventory: { ...prev.inventory, food: count - 1 } }
      next.health = Math.min(next.maxHealth, next.health + 50)
      audioEngine.pickup('mushroom')
      vibrate(VIBRO_PATTERNS.pickup)
      next.log = [...next.log, '🍲 Съел приготовленную еду. +50 HP'].slice(-30)
      return next
    })
  }, [action])

  // v2.2: Отдых у костра (нужно 2 дерева, восстанавливает 30 HP, занимает 8с)
  const canRest = !action && state.health < state.maxHealth && (state.inventory.wood ?? 0) >= 2 && !scene.isEnding
  const rest = useCallback(() => {
    if (action || state.health >= state.maxHealth) return
    const woodCount = state.inventory.wood ?? 0
    if (woodCount < 2) return

    const duration = 8000
    audioEngine.init()
    audioEngine.resume()
    audioEngine.restAction(duration)
    vibrate(VIBRO_PATTERNS.rest)

    setAction({ choice: { text: 'Отдых у костра', next: '@self', duration }, start: Date.now(), duration, elapsed: 0 })

    actionIntervalRef.current = setInterval(() => {
      const now = Date.now()
      setAction(prev => {
        if (!prev) return null
        const e = now - prev.start
        if (e >= prev.duration) {
          if (actionIntervalRef.current) {
            clearInterval(actionIntervalRef.current)
            actionIntervalRef.current = null
          }
          // Завершаем отдых
          setState(s => {
            const w = s.inventory.wood ?? 0
            if (w < 2) return s
            const next = { ...s, inventory: { ...s.inventory, wood: w - 2, campfire: (s.inventory.campfire ?? 0) + 1 } }
            next.health = Math.min(next.maxHealth, next.health + 30)
            next.log = [...next.log, '🏕️ Отдохнул у костра. +30 HP'].slice(-30)
            return next
          })
          return null
        }
        return { ...prev, elapsed: e }
      })
    }, 100)
  }, [action, state.health, state.maxHealth, state.inventory.wood, scene.isEnding])

  // ====== Начать новую игру ======
  const startNew = useCallback(() => {
    audioEngine.init()
    audioEngine.resume()
    audioEngine.setEnabled(audioOn)
    clearSave()
    lastEndingSceneId.current = null  // v2.1: сброс флага финала
    const fresh: GameState = { ...INITIAL_STATE, log: ['Ты стоишь у входа в шахту.'], visited: ['start'] }
    setState(fresh)
    setShowIntro(false)
  }, [audioOn])

  // ====== Продолжить ======
  const continueGame = useCallback(() => {
    const save = loadSave()
    if (!save) return
    audioEngine.init()
    audioEngine.resume()
    audioEngine.setEnabled(audioOn)
    lastEndingSceneId.current = null  // v2.1: сброс флага финала
    setState(save.state)
    setShowIntro(false)
  }, [audioOn])

  // ====== Перезапуск ======
  const restart = useCallback(() => {
    clearSave()
    lastEndingSceneId.current = null  // v2.1: сброс флага финала
    setState({ ...INITIAL_STATE, log: ['Ты стоишь у входа в шахту.'], visited: ['start'] })
  }, [])

  // ====== Переключение звука ======
  const toggleAudio = useCallback(() => {
    setAudioOn(prev => {
      const next = !prev
      audioEngine.setEnabled(next)
      return next
    })
  }, [])

  // ====== Проверка доступности выбора ======
  const isChoiceAvailable = useCallback((choice: Choice): { ok: boolean; reason?: string } => {
    if (!choice.requires) return { ok: true }
    const r = choice.requires
    if (r.items) {
      for (const [k, v] of Object.entries(r.items)) {
        if ((state.inventory[k as ResourceType] ?? 0) < (v ?? 0)) {
          return { ok: false, reason: `нужно ${v} ${k}` }
        }
      }
    }
    if (r.flag && !state.flags.includes(r.flag)) return { ok: false, reason: 'недоступно' }
    if (r.notFlag && state.flags.includes(r.notFlag)) return { ok: false, reason: 'уже сделано' }
    if (r.minPickaxe) {
      if (PICKAXE_LEVEL[state.pickaxeTier] < PICKAXE_LEVEL[r.minPickaxe]) {
        return { ok: false, reason: `нужна ${PICKAXE_NAME[r.minPickaxe]} кирка` }
      }
    }
    if (r.maxPickaxe) {
      if (PICKAXE_LEVEL[state.pickaxeTier] >= PICKAXE_LEVEL[r.maxPickaxe]) {
        return { ok: false, reason: 'уже есть лучше' }
      }
    }
    if (r.minHealth && state.health < r.minHealth) {
      return { ok: false, reason: `HP ≥ ${r.minHealth}` }
    }
    return { ok: true }
  }, [state.inventory, state.flags, state.pickaxeTier, state.health])

  // v2.1: Горячие клавиши 1-9 для быстрого выбора действий (десктоп)
  useEffect(() => {
    if (showIntro || showMenu || showTree || action) return
    const handler = (e: KeyboardEvent) => {
      // Игнорируем если фокус в инпуте
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      const num = parseInt(e.key, 10)
      if (isNaN(num) || num < 1 || num > 9) return
      e.preventDefault()
      const choice = scene.choices[num - 1]
      if (choice) {
        const avail = isChoiceAvailable(choice)
        if (avail.ok) startAction(choice)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [showIntro, showMenu, showTree, action, scene, isChoiceAvailable, startAction])

  // ============ ЭКРАН ИНТРО ============
  if (showIntro) {
    return (
      <>
        <IntroScreen
          hasContinue={hasContinue}
          onContinue={continueGame}
          onNew={startNew}
          bestDepth={bestDepth}
          victories={victories}
          deaths={deaths}
          onVersionTap={handleVersionTap}
        />
        {showDebugAccess && (
          <DebugAccessModal
            onClose={() => setShowDebugAccess(false)}
            onApply100={applyHundredPercent}
            onShowInfo={showDebugInfo}
          />
        )}
        {toast && (
          <div className="fixed top-16 left-1/2 -translate-x-1/2 z-40 px-3 py-1.5 rounded-md bg-cyan-950/90 border border-cyan-400/40 text-xs text-cyan-100 shadow-lg backdrop-blur-sm animate-[toast-in_0.2s_ease-out]">
            {toast}
          </div>
        )}
      </>
    )
  }

  // ============ ИГРОВОЙ ЭКРАН ============
  const hpPercent = (state.health / state.maxHealth) * 100
  const hpColor = hpPercent > 60 ? 'bg-emerald-400' : hpPercent > 30 ? 'bg-amber-400' : 'bg-red-500'
  const actionMeta = action ? ACTION_META[action.choice.action || 'walk'] : null
  const actionProgress = action ? Math.min(100, (action.elapsed / action.duration) * 100) : 0
  const actionRemaining = action ? Math.ceil((action.duration - action.elapsed) / 1000) : 0

  // v2.2: оверлеи (меню, чейнджлог, карта) — общие для обоих layout
  const overlays = (
    <>
      {/* ====== Тосты ====== */}
      {toast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-40 px-3 py-1.5 rounded-md bg-cyan-950/90 border border-cyan-400/40 text-xs text-cyan-100 shadow-lg backdrop-blur-sm animate-[toast-in_0.2s_ease-out]">
          {toast}
        </div>
      )}

      {/* ====== Модалка меню ====== */}
      {showMenu && (
        <MenuModal
          state={state}
          bestDepth={bestDepth}
          victories={victories}
          deaths={deaths}
          onClose={() => setShowMenu(false)}
          onRestart={restart}
          onShowTree={() => { setShowMenu(false); setShowTree(true) }}
          onShowChangelog={() => { setShowMenu(false); setShowChangelog(true) }}
          onShowStory={() => { setShowMenu(false); setShowStory(true) }}
          onShowActSwitch={() => { setShowMenu(false); setShowActSwitch(true) }}
          onShowConfirmReset={() => { setShowMenu(false); setShowConfirmReset(true) }}
          onShowAchievements={() => { setShowMenu(false); setShowAchievements(true) }}
          audioOn={audioOn}
          onToggleAudio={toggleAudio}
        />
      )}

      {/* ====== Changelog ====== */}
      {showChangelog && (
        <ChangelogModal onClose={() => setShowChangelog(false)} />
      )}

      {/* ====== Карта сюжета (2D) ====== */}
      {showTree && (
        <StoryMap
          currentSceneId={state.sceneId}
          visited={state.visited}
          inventory={state.inventory}
          flags={state.flags}
          pickaxeTier={state.pickaxeTier}
          onClose={() => setShowTree(false)}
        />
      )}

      {/* ====== Story Reader (читалка сюжета) ====== */}
      {showStory && (
        <StoryReader
          state={state}
          onClose={() => setShowStory(false)}
        />
      )}

      {/* ====== Переключатель актов ====== */}
      {showActSwitch && (
        <ActSwitchModal
          state={state}
          onClose={() => setShowActSwitch(false)}
          onSwitchAct={(act) => {
            const sceneId = act === 'act0' ? 'prelude_wake' : act === 'act1' ? 'start' : act === 'act2' ? 'act2_surface_arrival' : act === 'act3' ? 'nether_entry' : 'end_entry'
            setState(prev => ({ ...prev, act, sceneId }))
            setShowActSwitch(false)
            setToast(act === 'act0' ? '🏠 Переключено в Act 0' : act === 'act1' ? '⛏️ Переключено в Act 1' : act === 'act2' ? '🔑 Переключено в Act 2' : act === 'act3' ? '🌋 Переключено в Act 3' : '🌌 Переключено в Act 4')
          }}
        />
      )}

      {/* ====== Подтверждение сброса сейва ====== */}
      {showConfirmReset && (
        <ConfirmResetModal
          onClose={() => setShowConfirmReset(false)}
          onConfirm={performFullReset}
        />
      )}

      {/* ====== Секретное debug-меню (5 тапов по версии) ====== */}
      {showDebugAccess && (
        <DebugAccessModal
          onClose={() => setShowDebugAccess(false)}
          onApply100={applyHundredPercent}
          onShowInfo={showDebugInfo}
        />
      )}

      {/* ====== Достижения (retention) ====== */}
      {showAchievements && (
        <AchievementsModal
          stats={retention}
          onClose={() => setShowAchievements(false)}
        />
      )}

      <style jsx global>{`
        @keyframes toast-in {
          0% { opacity: 0; transform: translate(-50%, -8px); }
          100% { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </>
  )

  // v2.2: десктопный layout
  if (isDesktopLayout) {
    return (
      <>
        <DesktopLayout
          state={state}
          scene={scene as Scene}
          action={action}
          audioOn={audioOn}
          onChoice={startAction}
          onUseMushroom={useMushroom}
          onUseFood={useFood}
          onRest={rest}
          canRest={canRest}
          onToggleAudio={toggleAudio}
          onShowTree={() => setShowTree(true)}
          onShowMenu={() => setShowMenu(true)}
          onVersionTap={handleVersionTap}
          isChoiceAvailable={isChoiceAvailable}
        />
        {overlays}
      </>
    )
  }

  // v2.2: мобильный layout
  return (
    <div className="relative min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Фоновое свечение */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background: `radial-gradient(ellipse at top, ${ambientGlow(scene.ambient)} 0%, transparent 60%)`
        }}
      />

      {/* ====== Шапка ====== */}
      <header className="relative z-10 px-4 pt-3 pb-2 border-b border-cyan-400/20">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <h1 className="text-sm font-mono tracking-widest text-cyan-300 uppercase shrink-0">
              BlindCraft
            </h1>
            <span
              onClick={handleVersionTap}
              className="text-[10px] text-cyan-200/40 shrink-0 cursor-pointer select-none hover:text-cyan-200/70 transition-colors"
              title="v4.3"
            >v4.3</span>
            {/* v2.1: индикатор текущей ветки */}
            {scene.branch && BRANCH_META[scene.branch] && (
              <span
                className={`hidden xs:inline sm:inline text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900/60 border border-cyan-400/20 truncate ${BRANCH_META[scene.branch].color}`}
                title={`Ветка: ${BRANCH_META[scene.branch].label}`}
              >
                {BRANCH_META[scene.branch].icon} {BRANCH_META[scene.branch].label}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setShowTree(true)}
              className="w-8 h-8 rounded-md bg-slate-900/60 border border-cyan-400/20 text-sm hover:border-cyan-400/60"
              title="Дерево сюжета"
            >🌳</button>
            <button
              onClick={toggleAudio}
              className="w-8 h-8 rounded-md bg-slate-900/60 border border-cyan-400/20 text-sm hover:border-cyan-400/60"
              title={audioOn ? 'Выключить звук' : 'Включить звук'}
            >{audioOn ? '🔊' : '🔇'}</button>
            <button
              onClick={() => setShowMenu(true)}
              className="w-8 h-8 rounded-md bg-slate-900/60 border border-cyan-400/20 text-sm hover:border-cyan-400/60"
              title="Меню"
            >☰</button>
          </div>
        </div>

        {/* Статус-бар */}
        <div className="mt-2 flex items-center gap-3 text-xs">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-cyan-200/70 font-mono">HP</span>
              <span className="text-cyan-100 font-mono">{state.health}/{state.maxHealth}</span>
            </div>
            <div className="h-2 rounded-full bg-slate-900/80 overflow-hidden">
              <div className={`h-full ${hpColor} transition-all duration-500`} style={{ width: `${hpPercent}%` }} />
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wider text-cyan-200/50 font-mono">Глубина</div>
            <div className="text-lg font-bold text-cyan-300 leading-none">{state.depth}</div>
          </div>
        </div>
      </header>

      {/* ====== Текст сцены ====== */}
      <main className="relative z-10 flex-1 px-4 py-3 overflow-y-auto">
        {scene.title && (
          <div className="text-[10px] uppercase tracking-widest text-cyan-300/70 font-mono mb-1">
            {scene.title} · этаж {scene.depth}{scene.isHub ? ' · хаб' : ''}
          </div>
        )}
        <div className="text-base leading-relaxed text-slate-100 whitespace-pre-line">
          {scene.text}
        </div>

        {scene.isEnding && (
          <div className="mt-6 p-4 rounded-lg border border-cyan-400/40 bg-cyan-950/40 text-center">
            <div className="text-xs uppercase tracking-widest text-cyan-300/80 mb-1">
              {scene.isEnding === 'victory' ? 'Победа' : 'Конец пути'}
            </div>
          </div>
        )}
      </main>

      {/* ====== Инвентарь ====== */}
      <div className="relative z-10 px-4 py-2 border-t border-cyan-400/10 bg-slate-950/60">
        <InventoryBar
          inventory={state.inventory}
          pickaxeTier={state.pickaxeTier}
          armor={state.armor}
          onUseMushroom={useMushroom}
          onUseFood={useFood}
          onRest={rest}
          canRest={canRest}
        />
      </div>

      {/* ====== Кнопки выбора ИЛИ прогресс действия ====== */}
      <footer className="relative z-10 px-4 pb-4 pt-2 border-t border-cyan-400/20 bg-slate-950/80 backdrop-blur-sm">
        {action && actionMeta ? (
          /* Прогресс действия */
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-xl">{actionMeta.icon}</span>
              <div className="flex-1">
                <div className={`${actionMeta.color} font-medium`}>
                  {actionMeta.label}…
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  {action.choice.text}
                </div>
              </div>
              <div className="text-cyan-300 font-mono text-sm">
                {actionRemaining}с
              </div>
            </div>
            <div className="h-2 rounded-full bg-slate-900/80 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-cyan-300 transition-all duration-100"
                style={{ width: `${actionProgress}%` }}
              />
            </div>
            <div className="text-center text-[10px] text-cyan-200/40 font-mono">
              ⏳ нельзя прервать — дождись завершения
            </div>
          </div>
        ) : (
          /* Кнопки выбора */
          <div className="space-y-1.5">
            <div className="grid grid-cols-1 gap-1.5">
              {scene.choices.map((choice, idx) => {
                const avail = isChoiceAvailable(choice)
                const duration = choice.duration ?? 3000
                const meta = ACTION_META[choice.action || 'walk']
                const hasHotkey = idx < 9
                return (
                  <button
                    key={idx}
                    onClick={() => avail.ok && startAction(choice)}
                    disabled={!avail.ok}
                    className={`w-full px-3 py-2.5 rounded-lg text-sm text-left border transition-all flex items-center gap-2 ${
                      avail.ok
                        ? 'bg-slate-900/70 border-cyan-400/30 text-cyan-50 hover:border-cyan-400/70 hover:bg-slate-900 active:scale-[0.98]'
                        : 'bg-slate-900/30 border-slate-700/40 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {/* v2.1: бейдж горячей клавиши */}
                    {hasHotkey && avail.ok && (
                      <span
                        className="hidden md:inline-flex items-center justify-center w-5 h-5 shrink-0 rounded text-[10px] font-mono bg-cyan-950/60 border border-cyan-400/30 text-cyan-300/70"
                        title={`Горячая клавиша: ${idx + 1}`}
                      >{idx + 1}</span>
                    )}
                    <span className="text-base shrink-0">{meta.icon}</span>
                    <span className="flex-1 min-w-0">
                      <span className="block truncate">{choice.text}</span>
                      {!avail.ok && (
                        <span className="block text-[10px] text-red-400/70 italic">
                          {avail.reason}
                        </span>
                      )}
                    </span>
                    <span className="text-[10px] text-cyan-200/50 font-mono shrink-0">
                      {(duration / 1000).toFixed(0)}с
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Глобальные кнопки */}
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              <button
                onClick={() => setShowTree(true)}
                className="px-3 py-2.5 rounded-lg text-sm font-mono bg-slate-900/70 border border-cyan-400/30 text-cyan-100 hover:border-cyan-400/60 active:scale-[0.98]"
              >
                🗺️ Карта
              </button>
              <button
                onClick={() => setShowStory(true)}
                className="px-3 py-2.5 rounded-lg text-sm font-mono bg-slate-900/70 border border-cyan-400/30 text-cyan-100 hover:border-cyan-400/60 active:scale-[0.98]"
              >
                📖 Сюжет
              </button>
              <button
                onClick={() => setShowActSwitch(true)}
                className={`px-3 py-2.5 rounded-lg text-sm font-mono border active:scale-[0.98] ${
                  state.act2Unlocked
                    ? 'bg-amber-950/40 border-amber-400/40 text-amber-100 hover:border-amber-400/70'
                    : 'bg-slate-900/30 border-slate-700/40 text-slate-500 cursor-not-allowed'
                }`}
                disabled={!state.act2Unlocked}
              >
                🎭 Act {state.act === 'act1' ? '1 → 2' : '2 → 1'}
              </button>
              <button
                onClick={() => setShowMenu(true)}
                className="px-3 py-2.5 rounded-lg text-sm font-mono bg-slate-900/70 border border-cyan-400/30 text-cyan-100 hover:border-cyan-400/60 active:scale-[0.98]"
              >
                ☰ Меню
              </button>
            </div>
          </div>
        )}
      </footer>

      {overlays}
    </div>
  )
}

// ====== Вспомогательные ======

function ambientGlow(ambient: string): string {
  const map: Record<string, string> = {
    surface: 'rgba(125, 211, 252, 0.15)',
    cave:    'rgba(94, 234, 212, 0.10)',
    water:   'rgba(103, 232, 249, 0.15)',
    lava:    'rgba(251, 191, 36, 0.15)',
    monster: 'rgba(248, 113, 113, 0.20)',
    diamond: 'rgba(165, 243, 252, 0.20)',
    void:    'rgba(71, 85, 105, 0.10)'
  }
  return map[ambient] || map.cave
}

function IntroScreen({
  hasContinue, onContinue, onNew, bestDepth, victories, deaths, onVersionTap
}: {
  hasContinue: boolean
  onContinue: () => void
  onNew: () => void
  bestDepth: number
  victories: number
  deaths: number
  onVersionTap: () => void
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-100 px-6 py-8 relative overflow-hidden">
      {/* Декоративные волны */}
      <div className="absolute inset-0 pointer-events-none">
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            className="absolute left-1/2 top-1/2 rounded-full border border-cyan-400/10"
            style={{
              width: `${(i + 1) * 200}px`,
              height: `${(i + 1) * 200}px`,
              marginLeft: `${-(i + 1) * 100}px`,
              marginTop: `${-(i + 1) * 100}px`,
              animation: `intro-ring ${4 + i * 0.5}s ease-in-out infinite`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center max-w-md">
        <div
          onClick={onVersionTap}
          className="text-[10px] uppercase tracking-[0.4em] text-cyan-300/70 font-mono mb-2 cursor-pointer select-none hover:text-cyan-300 transition-colors"
          title="v4.3"
        >
          text·quest · v4.3
        </div>
        <h1 className="text-4xl font-bold text-cyan-200 mb-1 tracking-tight">
          BlindCraft
        </h1>
        <div className="text-sm text-cyan-100/60 font-mono mb-4">
          Эхо Глубин · Finale Edition
        </div>

        {/* === ГИГАНТСКОЕ ПРЕДУПРЕЖДЕНИЕ О ЗАВЕРШЕНИИ === */}
        <div className="mb-6 p-5 rounded-xl border-2 border-red-500/60 bg-red-950/30 backdrop-blur-sm">
          <div className="text-3xl mb-3">⚠️</div>
          <h2 className="text-xl font-bold text-red-300 mb-2 tracking-tight">
            ПРОЕКТ ЗАВЕРШЁН
          </h2>
          <p className="text-sm text-red-200/80 leading-relaxed mb-3">
            Это финальное обновление BlindCraft.
            Больше никаких обновлений, исправлений или поддержки не будет.
            Игра остаётся доступной и playable, но разработка прекращена.
          </p>

          {/* ОГРОМНЫЙ ТЕКСТ — ПРОЛИСТАЙ ВНИЗ */}
          <div className="my-4 py-4 border-y border-red-500/30">
            <p className="text-2xl font-bold text-red-300/90 text-center leading-tight mb-2">
              ЕСЛИ ХОТИТЕ ИГРАТЬ —
            </p>
            <p className="text-3xl font-extrabold text-red-200 text-center leading-tight">
              ПРОЛИСТАЙТЕ ВНИЗ 👇
            </p>
          </div>

          <p className="text-xs text-red-300/60 leading-relaxed mb-3">
            Спасибо всем, кто играл, исследовал шахты, спускался в Ад,
            побеждал дракона и становился Строителем.
            Это было незабываемо. 🖤
          </p>
          <div className="pt-3 border-t border-red-500/20 space-y-3">
            <p className="text-xs text-slate-300/70 leading-relaxed">
              📧 Вопросы? Пишите: <span className="text-cyan-300 font-mono select-all">foxvuksautoreplysystem@gmail.com</span>
            </p>

            {/* Котики */}
            <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-400/30">
              <p className="text-xs text-slate-300/70 leading-relaxed mb-1">
                🐱 <b className="text-amber-300">«Котики»</b> — проект с долгосрочной поддержкой.
                Новости о новых проектах будут публиковаться там.
              </p>
              <a
                href="https://g115r51mjrc0-d.space-z.ai/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 px-4 py-2 rounded-lg bg-amber-600/30 border border-amber-400/50 text-amber-100 text-sm font-bold hover:bg-amber-600/40 hover:border-amber-400 transition-all active:scale-[0.98]"
              >
                🐱 Играть в «Котики» →
              </a>
            </div>

            {/* FNAF копия — тизер */}
            <div className="p-3 rounded-lg bg-purple-950/30 border border-purple-400/30">
              <p className="text-xs text-slate-300/70 leading-relaxed">
                🐻 <b className="text-purple-300">Планируется:</b> копия Five Nights at Freddy's.
                Ссылка пока недоступна, но скоро будет опубликована в «Котиках».
                Следите за новостями! 🎪
              </p>
            </div>
          </div>
        </div>

        <p className="text-sm text-slate-300/90 leading-relaxed mb-5">
          Ты — слепой рудокоп. Спустись в заброшенную шахту и найди алмазы,
          что поют в темноте. Копай медь и железо, куй кирку и броню, торгуй
          с жителями подземелий. Каждый шаг занимает время — выбирай с умом.
        </p>

        <div className="text-[11px] text-cyan-200/60 mb-4 space-y-1 text-left bg-slate-900/40 p-3 rounded-lg border border-cyan-400/20">
          <div className="font-bold text-cyan-300 mb-1">Основные механики:</div>
          <div>🟠 <b>Медь</b> — первый металл, медная кирка и броня</div>
          <div>🛡️ <b>Броня</b> — кожаная, медная, железная, алмазная, незеритовая</div>
          <div>🤝 <b>Торговцы</b> — 5 жителей с уникальными обменами</div>
          <div>🗺️ <b>2D-карта сюжета</b> — интерактивная, с pan/zoom</div>
          <div>⏳ <b>Время действий</b> — каждое действие занимает 2–12 сек</div>
          <div>🌌 <b>5 актов</b> — от дома до Края, дракон, элитры</div>
        </div>

        <div className="text-[11px] text-slate-400/60 mb-6 space-y-1 text-left bg-slate-900/30 p-3 rounded-lg border border-slate-700/40">
          <div className="font-bold text-slate-300 mb-1">📜 История обновлений (v1.0 → v4.3):</div>
          <div className="text-slate-500">v1.0 — Релиз: эхолокация, 3 ветки, алмазы</div>
          <div className="text-slate-500">v2.0 — Copper Edition: медь, броня, торговцы</div>
          <div className="text-slate-500">v2.3 — Act 2: Trials, булава, стержень ветра</div>
          <div className="text-slate-500">v3.0 — Act 3: The Nether, Иссушитель</div>
          <div className="text-slate-500">v4.0 — Act 4: The End, дракон, элитры</div>
          <div className="text-slate-500">v4.1 — Act 0: Пролог, лор-фиксы</div>
          <div className="text-slate-500">v4.2 — Netherite Update: мечи, незерит</div>
          <div className="text-red-400/80 font-bold">v4.3 — Finale Edition: проект завершён</div>
        </div>

        <div className="flex flex-col gap-2 mb-6">
          {hasContinue && (
            <button
              onClick={onContinue}
              className="w-full px-6 py-3 rounded-lg bg-cyan-600/30 border border-cyan-400/60 text-cyan-100 font-medium hover:bg-cyan-600/40 transition-all active:scale-[0.98]"
            >
              ▸ Продолжить
            </button>
          )}
          <button
            onClick={onNew}
            className="w-full px-6 py-3 rounded-lg bg-slate-900/80 border border-cyan-400/30 text-cyan-100 font-medium hover:border-cyan-400/70 transition-all active:scale-[0.98]"
          >
            {hasContinue ? '↻ Новая игра' : '▸ Начать спуск'}
          </button>
        </div>

        {(bestDepth > 0 || victories > 0 || deaths > 0) && (
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 rounded-md bg-slate-900/40 border border-cyan-400/10">
              <div className="text-cyan-300 font-bold text-base">{bestDepth}</div>
              <div className="text-cyan-200/50 mt-0.5">рекорд глубины</div>
            </div>
            <div className="p-2 rounded-md bg-slate-900/40 border border-cyan-400/10">
              <div className="text-emerald-300 font-bold text-base">{victories}</div>
              <div className="text-cyan-200/50 mt-0.5">побед</div>
            </div>
            <div className="p-2 rounded-md bg-slate-900/40 border border-cyan-400/10">
              <div className="text-red-300 font-bold text-base">{deaths}</div>
              <div className="text-cyan-200/50 mt-0.5">смертей</div>
            </div>
          </div>
        )}

        <div className="mt-8 text-[10px] text-cyan-200/30 font-mono">
          📱 Включите звук · удобнее всего — наушники
        </div>
      </div>

      <style jsx global>{`
        @keyframes intro-ring {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
      `}</style>
    </div>
  )
}

function MenuModal({
  state, bestDepth, victories, deaths, onClose, onRestart, onShowTree, onShowChangelog, onShowStory, onShowActSwitch, onShowConfirmReset, onShowAchievements, audioOn, onToggleAudio
}: {
  state: GameState
  bestDepth: number
  victories: number
  deaths: number
  onClose: () => void
  onRestart: () => void
  onShowTree: () => void
  onShowChangelog: () => void
  onShowStory: () => void
  onShowActSwitch: () => void
  onShowConfirmReset: () => void
  onShowAchievements: () => void
  audioOn: boolean
  onToggleAudio: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-slate-900 border border-cyan-400/30 rounded-xl p-5 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-cyan-200">Меню</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-md bg-slate-800 border border-cyan-400/20 text-cyan-100"
          >✕</button>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="p-2 rounded-md bg-slate-800/60 border border-cyan-400/10 text-xs">
            <div className="text-cyan-200/60">Глубина</div>
            <div className="text-cyan-100 font-bold">{state.depth} (рекорд: {bestDepth})</div>
          </div>
          <div className="p-2 rounded-md bg-slate-800/60 border border-cyan-400/10 text-xs">
            <div className="text-cyan-200/60">Ходов</div>
            <div className="text-cyan-100 font-bold">{state.turns}</div>
          </div>
          <div className="p-2 rounded-md bg-slate-800/60 border border-cyan-400/10 text-xs">
            <div className="text-cyan-200/60">Побед</div>
            <div className="text-emerald-300 font-bold">{victories}</div>
          </div>
          <div className="p-2 rounded-md bg-slate-800/60 border border-cyan-400/10 text-xs">
            <div className="text-cyan-200/60">Смертей</div>
            <div className="text-red-300 font-bold">{deaths}</div>
          </div>
          <div className="p-2 rounded-md bg-slate-800/60 border border-cyan-400/10 text-xs">
            <div className="text-cyan-200/60">Посещено сцен</div>
            <div className="text-cyan-100 font-bold">{state.visited.length}</div>
          </div>
          <div className="p-2 rounded-md bg-slate-800/60 border border-cyan-400/10 text-xs">
            <div className="text-cyan-200/60">Кирка / Броня</div>
            <div className="text-cyan-100 font-bold text-[11px]">
              {PICKAXE_NAME[state.pickaxeTier]} / {ARMOR_NAME[state.armor]}
            </div>
          </div>
        </div>

        {/* Журнал */}
        <div className="mb-4">
          <div className="text-[10px] uppercase tracking-widest text-cyan-300/70 font-mono mb-1">
            Журнал
          </div>
          <div className="max-h-32 overflow-y-auto text-xs text-cyan-100/70 space-y-1 p-2 rounded-md bg-slate-950/60 border border-cyan-400/10">
            {state.log.slice(-10).map((line, i) => (
              <div key={i} className="leading-snug">› {line}</div>
            ))}
          </div>
        </div>

        {/* Кнопки */}
        <div className="space-y-2">
          <button
            onClick={onShowTree}
            className="w-full px-3 py-2 rounded-md bg-cyan-950/40 border border-cyan-400/30 text-sm text-cyan-100 hover:border-cyan-400/60"
          >
            🗺️ Открыть карту сюжета
          </button>
          <button
            onClick={onShowStory}
            className="w-full px-3 py-2 rounded-md bg-emerald-950/30 border border-emerald-400/30 text-sm text-emerald-100 hover:border-emerald-400/60"
          >
            📖 Сюжет (читалка лора)
          </button>
          <button
            onClick={onShowAchievements}
            className="w-full px-3 py-2 rounded-md bg-orange-950/30 border border-orange-400/30 text-sm text-orange-100 hover:border-orange-400/60"
          >
            🏆 Достижения и статистика
          </button>
          <button
            onClick={onShowActSwitch}
            disabled={!state.act2Unlocked}
            className={`w-full px-3 py-2 rounded-md border text-sm ${
              state.act2Unlocked
                ? 'bg-amber-950/30 border-amber-400/30 text-amber-100 hover:border-amber-400/60'
                : 'bg-slate-800/30 border-slate-700/40 text-slate-500 cursor-not-allowed'
            }`}
          >
            🎭 Сменить акт {state.act2Unlocked ? `(сейчас Act ${state.act === 'act1' ? '1' : '2'})` : '(🔒 Act 2 закрыт)'}
          </button>
          <button
            onClick={onShowChangelog}
            className="w-full px-3 py-2 rounded-md bg-amber-950/30 border border-amber-400/30 text-sm text-amber-100 hover:border-amber-400/60"
          >
            📜 Changelog (история версий)
          </button>
          <button
            onClick={onToggleAudio}
            className="w-full px-3 py-2 rounded-md bg-slate-800/60 border border-cyan-400/20 text-sm text-cyan-100 hover:border-cyan-400/50"
          >
            {audioOn ? '🔊 Звук: вкл' : '🔇 Звук: выкл'}
          </button>
          <button
            onClick={onRestart}
            className="w-full px-3 py-2 rounded-md bg-amber-950/40 border border-amber-400/30 text-sm text-amber-200 hover:border-amber-400/60"
          >
            ↻ Начать заново (текущий акт)
          </button>
          <button
            onClick={onShowConfirmReset}
            className="w-full px-3 py-2 rounded-md bg-red-950/40 border border-red-400/40 text-sm text-red-200 hover:border-red-400/70 hover:bg-red-950/60"
          >
            🗑️ Удалить сохранение полностью
          </button>
          <button
            onClick={onClose}
            className="w-full px-3 py-2 rounded-md bg-slate-800/60 border border-cyan-400/20 text-sm text-cyan-100 hover:border-cyan-400/50"
          >
            ← Продолжить игру
          </button>
        </div>
      </div>
    </div>
  )
}

// v2.4: Модалка переключения актов
function ActSwitchModal({
  state, onClose, onSwitchAct
}: {
  state: GameState
  onClose: () => void
  onSwitchAct: (act: 'act0' | 'act1' | 'act2' | 'act3' | 'act4') => void
}) {
  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-slate-900 border border-cyan-400/30 rounded-xl p-5"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-cyan-200">🎭 Сменить акт</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-md bg-slate-800 border border-cyan-400/20 text-cyan-100"
          >✕</button>
        </div>

        <div className="space-y-3">
          {/* Act 0 */}
          <button
            onClick={() => onSwitchAct('act0')}
            className={`w-full p-4 rounded-lg border text-left transition-all ${
              state.act === 'act0'
                ? 'border-green-500 bg-green-950/30 shadow-[0_0_12px_rgba(34,197,94,0.2)]'
                : 'border-green-500/30 bg-slate-800/40 hover:border-green-500/60'
            }`}
          >
            <div className="flex items-center gap-3 mb-1">
              <span className="text-2xl">{ACT_META.act0.icon}</span>
              <div className="flex-1">
                <div className={`text-sm font-bold ${ACT_META.act0.color}`}>
                  {ACT_META.act0.label}
                </div>
                <div className="text-[10px] text-slate-400">
                  Дом, лес, воспоминания отца, путь к шахте
                </div>
              </div>
              {state.act === 'act0' && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-500/20 text-green-300 font-mono">
                  ТЕКУЩИЙ
                </span>
              )}
            </div>
          </button>

          {/* Act 1 */}
          <button
            onClick={() => onSwitchAct('act1')}
            className={`w-full p-4 rounded-lg border text-left transition-all ${
              state.act === 'act1'
                ? 'border-cyan-400 bg-cyan-950/30 shadow-[0_0_12px_rgba(34,211,238,0.2)]'
                : 'border-cyan-400/30 bg-slate-800/40 hover:border-cyan-400/60'
            }`}
          >
            <div className="flex items-center gap-3 mb-1">
              <span className="text-2xl">{ACT_META.act1.icon}</span>
              <div className="flex-1">
                <div className={`text-sm font-bold ${ACT_META.act1.color}`}>
                  {ACT_META.act1.label}
                </div>
                <div className="text-[10px] text-slate-400">
                  Спуск в шахту за алмазами
                </div>
              </div>
              {state.act === 'act1' && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-400/20 text-cyan-200 font-mono">
                  ТЕКУЩИЙ
                </span>
              )}
            </div>
            {state.act1Endings.length > 0 && (
              <div className="text-[10px] text-emerald-300/70 mt-2">
                ✓ Получено концовок: {state.act1Endings.length}
              </div>
            )}
          </button>

          {/* Act 2 */}
          <button
            onClick={() => onSwitchAct('act2')}
            disabled={!state.act2Unlocked}
            className={`w-full p-4 rounded-lg border text-left transition-all ${
              !state.act2Unlocked
                ? 'border-slate-700/40 bg-slate-800/20 cursor-not-allowed opacity-50'
                : state.act === 'act2'
                  ? 'border-amber-400 bg-amber-950/30 shadow-[0_0_12px_rgba(251,191,36,0.2)]'
                  : 'border-amber-400/30 bg-slate-800/40 hover:border-amber-400/60'
            }`}
          >
            <div className="flex items-center gap-3 mb-1">
              <span className="text-2xl">{ACT_META.act2.icon}</span>
              <div className="flex-1">
                <div className={`text-sm font-bold ${state.act2Unlocked ? ACT_META.act2.color : 'text-slate-500'}`}>
                  {ACT_META.act2.label}
                </div>
                <div className="text-[10px] text-slate-400">
                  Поверхность, деревня, Trials, портал в Ад
                </div>
              </div>
              {state.act === 'act2' && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-200 font-mono">
                  ТЕКУЩИЙ
                </span>
              )}
              {!state.act2Unlocked && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700/40 text-slate-400 font-mono">
                  🔒
                </span>
              )}
            </div>
            {state.act2Unlocked ? (
              state.act2Endings.length > 0 && (
                <div className="text-[10px] text-emerald-300/70 mt-2">
                  ✓ Получено концовок: {state.act2Endings.length}
                </div>
              )
            ) : (
              <div className="text-[10px] text-amber-300/60 mt-2">
                🔒 Получите любую концовку в Act 1, чтобы открыть
              </div>
            )}
          </button>

          {/* Act 3 */}
          <button
            onClick={() => onSwitchAct('act3')}
            disabled={!state.act3Unlocked}
            className={`w-full p-4 rounded-lg border text-left transition-all ${
              !state.act3Unlocked
                ? 'border-slate-700/40 bg-slate-800/20 cursor-not-allowed opacity-50'
                : state.act === 'act3'
                  ? 'border-red-500 bg-red-950/30 shadow-[0_0_12px_rgba(239,68,68,0.2)]'
                  : 'border-red-500/30 bg-slate-800/40 hover:border-red-500/60'
            }`}
          >
            <div className="flex items-center gap-3 mb-1">
              <span className="text-2xl">{ACT_META.act3.icon}</span>
              <div className="flex-1">
                <div className={`text-sm font-bold ${state.act3Unlocked ? ACT_META.act3.color : 'text-slate-500'}`}>
                  {ACT_META.act3.label}
                </div>
                <div className="text-[10px] text-slate-400">
                  Нижний мир, Адская крепость, Иссушитель, звезда Нужера
                </div>
              </div>
              {state.act === 'act3' && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 font-mono">
                  ТЕКУЩИЙ
                </span>
              )}
              {!state.act3Unlocked && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700/40 text-slate-400 font-mono">
                  🔒
                </span>
              )}
            </div>
            {state.act3Unlocked ? (
              state.act3Endings.length > 0 && (
                <div className="text-[10px] text-emerald-300/70 mt-2">
                  ✓ Получено концовок: {state.act3Endings.length}
                </div>
              )
            ) : (
              <div className="text-[10px] text-red-400/60 mt-2">
                🔒 Войдите в портал в Act 2, чтобы открыть
              </div>
            )}
          </button>

          {/* Act 4 */}
          <button
            onClick={() => onSwitchAct('act4')}
            disabled={!state.act4Unlocked}
            className={`w-full p-4 rounded-lg border text-left transition-all ${
              !state.act4Unlocked
                ? 'border-slate-700/40 bg-slate-800/20 cursor-not-allowed opacity-50'
                : state.act === 'act4'
                  ? 'border-purple-500 bg-purple-950/30 shadow-[0_0_12px_rgba(168,85,247,0.2)]'
                  : 'border-purple-500/30 bg-slate-800/40 hover:border-purple-500/60'
            }`}
          >
            <div className="flex items-center gap-3 mb-1">
              <span className="text-2xl">{ACT_META.act4.icon}</span>
              <div className="flex-1">
                <div className={`text-sm font-bold ${state.act4Unlocked ? ACT_META.act4.color : 'text-slate-500'}`}>
                  {ACT_META.act4.label}
                </div>
                <div className="text-[10px] text-slate-400">
                  Край, дракон, Энд-сити, элитры
                </div>
              </div>
              {state.act === 'act4' && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono">
                  ТЕКУЩИЙ
                </span>
              )}
              {!state.act4Unlocked && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700/40 text-slate-400 font-mono">
                  🔒
                </span>
              )}
            </div>
            {state.act4Unlocked ? (
              state.act4Endings.length > 0 && (
                <div className="text-[10px] text-emerald-300/70 mt-2">
                  ✓ Получено концовок: {state.act4Endings.length}
                </div>
              )
            ) : (
              <div className="text-[10px] text-purple-400/60 mt-2">
                🔒 Найдите крепость края и откройте портал
              </div>
            )}
          </button>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-700/30 text-[10px] text-slate-500 italic">
          Переключение сохраняет инвентарь и прогресс. Можно свободно перемещаться между актами.
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 px-4 py-2 rounded-lg bg-slate-800/60 border border-cyan-400/20 text-cyan-100 hover:border-cyan-400/50 text-sm"
        >
          ← Отмена
        </button>
      </div>
    </div>
  )
}
