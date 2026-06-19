'use client'

import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import type { Scene, Choice, ResourceType, PickaxeTier } from '@/lib/game/types'
import { ALL_SCENES, BRANCH_META } from '@/lib/game/story'
import { PICKAXE_LEVEL, PICKAXE_NAME } from '@/lib/game/types'

interface StoryMapProps {
  currentSceneId: string
  visited: string[]
  onClose: () => void
  inventory: Partial<Record<ResourceType, number>>
  flags: string[]
  pickaxeTier: PickaxeTier
}

interface NodePosition {
  id: string
  x: number
  y: number
  scene: Scene
}

// Положения сцен — компактная двухколоночная раскладка
// Act 1: левая половина (x: 200-700)
// Act 2: правая половина (x: 1100-1300)
const SCENE_POSITIONS: Record<string, { x: number; y: number }> = {
  // ===== ACT 0 · ПРОЛОГ =====
  prelude_wake:   { x: 100, y: 50 },
  prelude_house:  { x: 100, y: 130 },
  prelude_wood:   { x: 30, y: 180 },
  prelude_stone:  { x: 170, y: 180 },
  prelude_father: { x: 100, y: 230 },
  prelude_yard:   { x: 100, y: 300 },

  // ===== ACT 1 =====
  start:          { x: 450, y: 50 },
  start_listen:   { x: 540, y: 100 },
  cave_mouth:     { x: 450, y: 150 },
  entry_tunnel:   { x: 450, y: 210 },
  take_wood:      { x: 360, y: 250 },
  craft_wood_pickaxe: { x: 540, y: 250 },
  drip_room:      { x: 450, y: 310 },
  mine_coal:      { x: 330, y: 340 },
  mine_copper:    { x: 570, y: 340 },
  craft_torch:    { x: 450, y: 370 },
  crossroads:     { x: 450, y: 450 },

  // hunt (влево от drip_room)
  hunt_entry:     { x: 180, y: 310 },
  hunt_rabbits:   { x: 100, y: 360 },
  hunt_bear:      { x: 180, y: 410 },
  hunt_meet_hunter: { x: 260, y: 410 },
  hunt_secret_revealed: { x: 260, y: 460 },
  hunt_secret:    { x: 330, y: 490 },

  // water (влево от crossroads)
  water_entry:    { x: 250, y: 490 },
  water_wade:     { x: 250, y: 540 },
  water_detour:   { x: 150, y: 540 },
  water_iron:     { x: 250, y: 590 },
  water_well:     { x: 350, y: 570 },
  water_meet_hermit: { x: 250, y: 630 },
  water_tunnel:   { x: 250, y: 690 },

  // lava (центр вниз)
  lava_entry:     { x: 450, y: 490 },
  lava_bridge:    { x: 450, y: 540 },
  lava_climb:     { x: 550, y: 540 },
  lava_iron:      { x: 450, y: 590 },
  lava_mushroom:  { x: 550, y: 590 },
  lava_meet_smith: { x: 450, y: 630 },
  lava_tunnel:    { x: 450, y: 690 },

  // dark (вправо от crossroads)
  dark_entry:     { x: 650, y: 490 },
  dark_torch:     { x: 650, y: 540 },
  dark_creep:     { x: 580, y: 540 },
  dark_shout:     { x: 720, y: 540 },
  dark_leather:   { x: 580, y: 590 },
  dark_torch_late:{ x: 650, y: 590 },
  dark_freeze:    { x: 580, y: 630 },
  dark_dodge:     { x: 720, y: 630 },
  dark_flee:      { x: 650, y: 630 },
  dark_iron:      { x: 650, y: 680 },
  dark_tunnel:    { x: 650, y: 690 },

  // gold
  gold_hall:      { x: 450, y: 770 },
  gold_collect:   { x: 370, y: 800 },
  gold_chest:     { x: 530, y: 800 },
  gold_well:      { x: 350, y: 770 },
  gold_meet_merchant: { x: 550, y: 770 },
  gold_hall_return: { x: 450, y: 840 },

  // trials (справа от gold)
  trials_entry:   { x: 820, y: 770 },
  trials_vault:   { x: 900, y: 810 },
  trials_combat:  { x: 820, y: 850 },
  trials_puzzle:  { x: 900, y: 880 },
  trials_riddle:  { x: 980, y: 850 },
  trials_combat_torch: { x: 740, y: 890 },
  trials_combat_pickaxe: { x: 820, y: 910 },
  trials_combat_dodge: { x: 900, y: 910 },
  trials_puzzle_correct: { x: 900, y: 940 },
  trials_puzzle_wrong: { x: 980, y: 940 },
  trials_riddle_correct: { x: 980, y: 910 },
  trials_riddle_wrong: { x: 1060, y: 880 },
  trials_reward:  { x: 900, y: 980 },
  trials_exit:    { x: 820, y: 1020 },

  // descent
  descent_narrow: { x: 390, y: 880 },
  descent_gentle: { x: 510, y: 880 },

  // diamond
  diamond_entry:  { x: 450, y: 930 },
  diamond_hand:   { x: 370, y: 960 },
  diamond_mine:   { x: 530, y: 960 },

  // ===== ACT 2 =====
  act2_surface_arrival: { x: 1200, y: 50 },
  act2_village:    { x: 1200, y: 130 },
  act2_trader_old: { x: 1100, y: 190 },
  act2_trader_hermit: { x: 1200, y: 190 },
  act2_trader_smith: { x: 1300, y: 190 },
  act2_trader_merchant: { x: 1100, y: 250 },
  act2_trader_hunter: { x: 1300, y: 250 },
  act2_tavern_rumors: { x: 1200, y: 310 },
  act2_dice_game:  { x: 1280, y: 310 },
  act2_dice_roll:  { x: 1360, y: 310 },
  act2_elder:      { x: 1100, y: 310 },
  act2_village_well: { x: 1200, y: 370 },
  act2_wish:       { x: 1280, y: 370 },
  act2_well_listen: { x: 1360, y: 370 },
  act2_stranger:   { x: 1200, y: 430 },
  act2_stranger_gift: { x: 1280, y: 430 },
  act2_stranger_secret: { x: 1360, y: 430 },
  act2_wander:     { x: 1100, y: 490 },
  act2_graveyard:  { x: 1000, y: 490 },
  act2_crypt_entry: { x: 1000, y: 550 },
  act2_crypt_open: { x: 1000, y: 610 },
  act2_forest:     { x: 1200, y: 490 },
  act2_forest_mushrooms: { x: 1280, y: 460 },
  act2_forest_herbs: { x: 1280, y: 490 },
  act2_forest_glade: { x: 1360, y: 490 },
  act2_forest_boar: { x: 1280, y: 520 },
  act2_forest_deep: { x: 1200, y: 550 },
  act2_shrine_fire: { x: 1280, y: 550 },
  act2_shrine_earth: { x: 1280, y: 580 },
  act2_shrine_air: { x: 1360, y: 550 },
  act2_shrine_blessing: { x: 1360, y: 580 },
  act2_fortress:   { x: 1100, y: 550 },
  act2_fortress_ruins: { x: 1020, y: 580 },
  act2_fortress_hall: { x: 1100, y: 610 },
  act2_fortress_lord: { x: 1180, y: 610 },
  act2_fortress_collapse: { x: 1180, y: 640 },
  act2_fortress_cellar: { x: 1100, y: 670 },
  act2_cellar_search: { x: 1020, y: 670 },
  act2_lake_entry: { x: 1100, y: 730 },
  act2_lake_island: { x: 1180, y: 730 },
  act2_portal_ritual: { x: 1180, y: 760 },
  act2_hill:       { x: 1300, y: 490 },
  act2_obsidian_quest: { x: 1300, y: 550 },
  act2_portal_build: { x: 1300, y: 610 },

  // endings
  ending_victory:  { x: 530, y: 1020 },
  ending_surrender: { x: 370, y: 1020 },
  ending_trials_master: { x: 900, y: 1090 },
  ending_act2_complete: { x: 1300, y: 630 },

  // ===== ACT 3 · THE NETHER =====
  nether_entry:    { x: 1500, y: 50 },
  nether_expanse:  { x: 1500, y: 130 },
  nether_lava_sea: { x: 1600, y: 200 },
  nether_bridge_run: { x: 1700, y: 200 },
  nether_bridge_careful: { x: 1700, y: 250 },
  nether_shoot_ghast: { x: 1700, y: 300 },
  nether_fortress_hall: { x: 1500, y: 280 },
  nether_blaze_spawner: { x: 1400, y: 350 },
  nether_blaze_fight: { x: 1400, y: 400 },
  nether_blaze_arrows: { x: 1400, y: 450 },
  nether_towers:   { x: 1600, y: 350 },
  nether_tower_chest: { x: 1700, y: 380 },
  nether_tower_view: { x: 1700, y: 430 },
  nether_prisoner: { x: 1500, y: 400 },
  nether_free_builder: { x: 1500, y: 460 },
  nether_search_corridors: { x: 1600, y: 460 },
  nether_piglin_battle: { x: 1400, y: 200 },
  nether_piglin_fight_all: { x: 1300, y: 200 },
  nether_piglin_help_gold: { x: 1300, y: 250 },
  nether_piglin_loot: { x: 1300, y: 300 },
  nether_soul_valley: { x: 1500, y: 530 },
  nether_skeleton:  { x: 1400, y: 560 },
  nether_trees:     { x: 1600, y: 560 },
  nether_soul_sand: { x: 1500, y: 600 },
  nether_mine_netherrack: { x: 1600, y: 130 },
  nether_mine_glowstone: { x: 1700, y: 130 },
  nether_altar:     { x: 1500, y: 680 },
  nether_wither_fight: { x: 1400, y: 720 },
  nether_wither_arrows: { x: 1600, y: 720 },
  ending_nether_complete: { x: 1500, y: 800 },
  ending_become_builder: { x: 1400, y: 870 },
  ending_go_home:   { x: 1600, y: 870 },

  // ===== ACT 4 · THE END =====
  end_entry:        { x: 1900, y: 50 },
  end_spawn_island: { x: 1900, y: 130 },
  end_dragon_info:  { x: 1800, y: 130 },
  end_chorus:       { x: 2000, y: 130 },
  end_mine_stone:   { x: 2000, y: 80 },
  end_islands:      { x: 1900, y: 230 },
  end_enderman_hunt:{ x: 1800, y: 280 },
  end_enderman_more:{ x: 1800, y: 330 },
  end_towers:       { x: 1900, y: 330 },
  end_destroy_arrows:{ x: 1800, y: 380 },
  end_destroy_climb:{ x: 2000, y: 380 },
  end_tower_search: { x: 2000, y: 330 },
  end_dragon_phase1:{ x: 1900, y: 430 },
  end_dragon_heal1: { x: 1800, y: 430 },
  end_dragon_phase2:{ x: 1900, y: 480 },
  end_dragon_heal2: { x: 1800, y: 480 },
  end_dragon_phase3:{ x: 1900, y: 530 },
  end_dragon_phase4:{ x: 1900, y: 580 },
  end_dragon_dead:  { x: 1900, y: 640 },
  end_dragon_egg:   { x: 1800, y: 640 },
  end_portal_return:{ x: 2000, y: 640 },
  end_city_approach:{ x: 1900, y: 720 },
  end_city_outskirts:{ x: 1800, y: 720 },
  end_city_hall:    { x: 1900, y: 770 },
  end_city_search:  { x: 1800, y: 770 },
  end_ship:         { x: 2000, y: 770 },
  end_elytra_test:  { x: 2000, y: 820 },
  end_outer_bridge: { x: 1900, y: 870 },
  end_outer_islands:{ x: 1900, y: 930 },
  end_outer_city:   { x: 1800, y: 980 },
  end_outer_ships:  { x: 1800, y: 1030 },
  end_chorus_forest:{ x: 2000, y: 980 },
  end_ruins:        { x: 1900, y: 1030 },
  end_ruins_search: { x: 1900, y: 1080 },
  end_random_island:{ x: 2000, y: 1030 },
  ending_absorb_dragon: { x: 1900, y: 1140 },
  ending_spare_dragon:  { x: 1800, y: 1140 },
  ending_end_return_home:{ x: 2000, y: 1140 },
  death_generic:   { x: 450, y: 1090 }
}

const MAP_WIDTH = 2100
const MAP_HEIGHT = 1600

// Цвета веток для линий и узлов
const BRANCH_COLORS: Record<string, { line: string; node: string; stroke: string }> = {
  prelude: { line: '#4ade80', node: '#14532d', stroke: '#4ade80' }, // зелёный
  start:   { line: '#22d3ee', node: '#0e7490', stroke: '#22d3ee' },  // бирюзовый
  water:   { line: '#38bdf8', node: '#075985', stroke: '#38bdf8' },  // голубой
  lava:    { line: '#fb923c', node: '#7c2d12', stroke: '#fb923c' },  // оранжевый
  dark:    { line: '#a78bfa', node: '#3730a3', stroke: '#a78bfa' },  // фиолетовый
  gold:    { line: '#fbbf24', node: '#78350f', stroke: '#fbbf24' },  // золотой
  diamond: { line: '#67e8f9', node: '#155e75', stroke: '#67e8f9' },  // циан
  hunt:    { line: '#4ade80', node: '#14532d', stroke: '#4ade80' },  // зелёный
  trials:  { line: '#fbbf24', node: '#713f12', stroke: '#fbbf24' },  // янтарный
  surface2: { line: '#fcd34d', node: '#92400e', stroke: '#fcd34d' }, // янтарный светлый
  nether:  { line: '#ef4444', node: '#7f1d1d', stroke: '#ef4444' },   // красный
  end:     { line: '#a855f7', node: '#581c87', stroke: '#a855f7' },  // фиолетовый
  end:     { line: '#94a3b8', node: '#334155', stroke: '#94a3b8' }   // сланцевый
}

export function StoryMap({ currentSceneId, visited, onClose, inventory, flags, pickaxeTier }: StoryMapProps) {
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [selectedScene, setSelectedScene] = useState<string | null>(null)
  const [hoveredScene, setHoveredScene] = useState<string | null>(null)
  const [containerSize, setContainerSize] = useState({ width: 400, height: 400 })

  const containerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 })
  const rafRef = useRef<number | null>(null)
  const pendingPan = useRef({ x: 0, y: 0 })

  // Отслеживание размера контейнера
  useEffect(() => {
    if (!containerRef.current) return
    const update = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        })
      }
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  // Автоцентрирование при смене сцены
  const lastCenteredScene = useRef<string | null>(null)
  useEffect(() => {
    if (lastCenteredScene.current === currentSceneId) return
    lastCenteredScene.current = currentSceneId
    const pos = SCENE_POSITIONS[currentSceneId]
    if (pos) {
      requestAnimationFrame(() => {
        setPan({
          x: containerSize.width / 2 - pos.x * zoom,
          y: containerSize.height / 2 - pos.y * zoom
        })
      })
    }
  }, [currentSceneId, zoom, containerSize.width, containerSize.height])

  // Узлы (мемоизировано)
  const nodes = useMemo<NodePosition[]>(() => {
    return Object.values(ALL_SCENES).map(scene => {
      const pos = SCENE_POSITIONS[scene.id] || { x: 400, y: 500 }
      return { id: scene.id, x: pos.x, y: pos.y, scene }
    })
  }, [])

  // Рёбра с информацией для отрисовки
  const edges = useMemo(() => {
    const result: {
      from: string
      to: string
      fromX: number
      fromY: number
      toX: number
      toY: number
      isCrossBranch: boolean
      fromBranch: string
      toBranch: string
    }[] = []
    for (const node of nodes) {
      for (const choice of node.scene.choices) {
        if (choice.next === '@self') continue
        const target = ALL_SCENES[choice.next]
        if (!target) continue
        const fromPos = SCENE_POSITIONS[node.id]
        const toPos = SCENE_POSITIONS[choice.next]
        if (!fromPos || !toPos) continue
        result.push({
          from: node.id,
          to: choice.next,
          fromX: fromPos.x,
          fromY: fromPos.y,
          toX: toPos.x,
          toY: toPos.y,
          isCrossBranch: node.scene.branch !== target.branch,
          fromBranch: node.scene.branch || 'start',
          toBranch: target.branch || 'start'
        })
      }
    }
    return result
  }, [nodes])

  const visitedSet = useMemo(() => new Set(visited), [visited])

  // v3.1: Visible bounds — только рендерим то что в видимой области (отключение offscreen rendering)
  const visibleBounds = useMemo(() => {
    const margin = 100 // запас за краем экрана
    const left = -pan.x / zoom - margin
    const top = -pan.y / zoom - margin
    const right = (-pan.x + containerSize.width) / zoom + margin
    const bottom = (-pan.y + containerSize.height) / zoom + margin
    return { left, top, right, bottom }
  }, [pan, zoom, containerSize.width, containerSize.height])

  // v3.1: Фильтрация видимых узлов
  const visibleNodes = useMemo(() => {
    return nodes.filter(node =>
      node.x >= visibleBounds.left && node.x <= visibleBounds.right &&
      node.y >= visibleBounds.top && node.y <= visibleBounds.bottom
    )
  }, [nodes, visibleBounds])

  // v3.1: Фильтрация видимых рёбер
  const visibleEdges = useMemo(() => {
    return edges.filter(edge => {
      const midX = (edge.fromX + edge.toX) / 2
      const midY = (edge.fromY + edge.toY) / 2
      // Рендерим ребро если хотя бы один конец или середина в видимой области
      return (
        (edge.fromX >= visibleBounds.left && edge.fromX <= visibleBounds.right &&
         edge.fromY >= visibleBounds.top && edge.fromY <= visibleBounds.bottom) ||
        (edge.toX >= visibleBounds.left && edge.toX <= visibleBounds.right &&
         edge.toY >= visibleBounds.top && edge.toY <= visibleBounds.bottom) ||
        (midX >= visibleBounds.left && midX <= visibleBounds.right &&
         midY >= visibleBounds.top && midY <= visibleBounds.bottom)
      )
    })
  }, [edges, visibleBounds])

  // Throttled pan
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return
    setIsDragging(true)
    dragStart.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }, [pan])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return
    const dx = e.clientX - dragStart.current.x
    const dy = e.clientY - dragStart.current.y
    pendingPan.current = {
      x: dragStart.current.panX + dx,
      y: dragStart.current.panY + dy
    }
    if (rafRef.current == null) {
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null
        setPan(pendingPan.current)
      })
    }
  }, [isDragging])

  const handlePointerUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    setZoom(prev => Math.max(0.3, Math.min(2.5, prev * delta)))
  }, [])

  const zoomIn = useCallback(() => setZoom(prev => Math.min(2.5, prev * 1.25)), [])
  const zoomOut = useCallback(() => setZoom(prev => Math.max(0.3, prev / 1.25)), [])
  const resetView = useCallback(() => {
    setZoom(1)
    const pos = SCENE_POSITIONS[currentSceneId]
    if (pos) {
      setPan({
        x: containerSize.width / 2 - pos.x,
        y: containerSize.height / 2 - pos.y
      })
    }
  }, [currentSceneId, containerSize.width, containerSize.height])

  const choiceAvailable = useCallback((choice: Choice): { ok: boolean; reason?: string } => {
    if (!choice.requires) return { ok: true }
    const r = choice.requires
    if (r.items) {
      for (const [k, v] of Object.entries(r.items)) {
        if ((inventory[k as ResourceType] ?? 0) < (v ?? 0)) {
          return { ok: false, reason: `нужно ${v} ${k}` }
        }
      }
    }
    if (r.flag && !flags.includes(r.flag)) return { ok: false, reason: 'недоступно' }
    if (r.notFlag && flags.includes(r.notFlag)) return { ok: false, reason: 'уже сделано' }
    if (r.minPickaxe && PICKAXE_LEVEL[pickaxeTier] < PICKAXE_LEVEL[r.minPickaxe]) {
      return { ok: false, reason: `нужна ${PICKAXE_NAME[r.minPickaxe]} кирка` }
    }
    return { ok: true }
  }, [inventory, flags, pickaxeTier])

  const selectedSceneData = selectedScene ? ALL_SCENES[selectedScene] : null

  // Умная кривая: вертикальная для почти вертикальных линий, S-образная для остальных
  const getSmartPath = (x1: number, y1: number, x2: number, y2: number): string => {
    const dx = x2 - x1
    const dy = y2 - y1
    const adx = Math.abs(dx)
    const ady = Math.abs(dy)

    // Если линия почти вертикальная — прямая с лёгкой кривой
    if (adx < 20) {
      return `M ${x1} ${y1} L ${x2} ${y2}`
    }
    // Если почти горизонтальная — S-образная горизонтальная кривая
    if (ady < 20) {
      const cp1x = x1 + dx * 0.35
      const cp1y = y1
      const cp2x = x1 + dx * 0.65
      const cp2y = y2
      return `M ${x1} ${y1} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x2} ${y2}`
    }
    // Если вертикальная доминанта — вертикальная S-кривая
    if (ady > adx * 1.5) {
      const cp1x = x1
      const cp1y = y1 + dy * 0.4
      const cp2x = x2
      const cp2y = y1 + dy * 0.6
      return `M ${x1} ${y1} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x2} ${y2}`
    }
    // Общий случай — диагональная S-кривая
    const cp1x = x1 + dx * 0.3
    const cp1y = y1 + dy * 0.1
    const cp2x = x1 + dx * 0.7
    const cp2y = y1 + dy * 0.9
    return `M ${x1} ${y1} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x2} ${y2}`
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col">
      {/* Шапка */}
      <header className="px-4 py-2.5 border-b border-cyan-400/20 flex items-center justify-between bg-slate-950/95 backdrop-blur-sm shrink-0">
        <div>
          <h2 className="text-base font-bold text-cyan-200">🗺️ Карта сюжета</h2>
          <div className="text-[10px] text-cyan-200/60 font-mono">
            {visitedSet.size} / {nodes.length} сцен · тяни для перемещения · колесо для зума
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-md bg-slate-900 border border-cyan-400/30 text-cyan-100 hover:border-cyan-400/70 hover:bg-slate-800 transition-colors"
        >✕</button>
      </header>

      {/* Карта */}
      <div className="flex-1 relative overflow-hidden">
        <div
          ref={containerRef}
          className="absolute inset-0 touch-none select-none"
          style={{ cursor: isDragging ? 'grabbing' : 'grab', backgroundColor: '#020617' }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onWheel={handleWheel}
          onClick={() => setSelectedScene(null)}
        >
          <svg
            className="absolute top-0 left-0"
            width={MAP_WIDTH}
            height={MAP_HEIGHT}
            style={{
              transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
              transformOrigin: '0 0',
              willChange: 'transform'
            }}
          >
            {/* Декоративный фон-сетка */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.5" opacity="0.3" />
              </pattern>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#grid)" />

            {/* Разделители актов */}
            <line x1="1075" y1="0" x2="1075" y2={MAP_HEIGHT} stroke="#1e3a5f" strokeWidth="3" strokeDasharray="10 5" opacity="0.5" />
            <line x1="1380" y1="0" x2="1380" y2={MAP_HEIGHT} stroke="#7f1d1d" strokeWidth="3" strokeDasharray="10 5" opacity="0.5" />
            <line x1="1750" y1="0" x2="1750" y2={MAP_HEIGHT} stroke="#581c87" strokeWidth="3" strokeDasharray="10 5" opacity="0.5" />
            <text x="537" y="25" textAnchor="middle" fontSize="16" fill="#22d3ee" fontWeight="bold" style={{ fontFamily: 'monospace', userSelect: 'none' }}>
              ⛏️ ACT 1: СПУСК В ШАХТУ
            </text>
            <text x="1227" y="25" textAnchor="middle" fontSize="14" fill="#fcd34d" fontWeight="bold" style={{ fontFamily: 'monospace', userSelect: 'none' }}>
              🔑 ACT 2: THE TRIALS
            </text>
            <text x="1590" y="25" textAnchor="middle" fontSize="16" fill="#ef4444" fontWeight="bold" style={{ fontFamily: 'monospace', userSelect: 'none' }}>
              🌋 ACT 3: THE NETHER
            </text>
            <text x="1925" y="25" textAnchor="middle" fontSize="16" fill="#a855f7" fontWeight="bold" style={{ fontFamily: 'monospace', userSelect: 'none' }}>
              🌌 ACT 4: THE END
            </text>

            {/* Линии — умные кривые + стрелки */}
            <g>
              {visibleEdges.map((edge, idx) => {
                const fromVisited = visitedSet.has(edge.from)
                const isCurrentEdge = edge.from === currentSceneId || edge.to === currentSceneId
                const isHovered = hoveredScene === edge.from || hoveredScene === edge.to
                const colors = BRANCH_COLORS[edge.fromBranch] || BRANCH_COLORS.end

                let strokeWidth = 1.5
                let opacity = 0.35
                if (isHovered) { strokeWidth = 3; opacity = 1 }
                else if (isCurrentEdge) { strokeWidth = 2.5; opacity = 0.95 }
                else if (fromVisited && visitedSet.has(edge.to)) { strokeWidth = 2; opacity = 0.75 }
                else if (fromVisited) { strokeWidth = 1.5; opacity = 0.45 }

                const stroke = edge.isCrossBranch ? '#fbbf24' : colors.line
                const path = getSmartPath(edge.fromX, edge.fromY, edge.toX, edge.toY)

                // Стрелка на конце
                const angle = Math.atan2(edge.toY - edge.fromY, edge.toX - edge.fromX)
                const arrowSize = isHovered || isCurrentEdge ? 8 : 6
                const nodeRadius = visitedSet.has(edge.to) || edge.to === currentSceneId ? 22 : 18
                const arrowX = edge.toX - Math.cos(angle) * nodeRadius
                const arrowY = edge.toY - Math.sin(angle) * nodeRadius
                const arrowLeftX = arrowX - Math.cos(angle - 0.5) * arrowSize
                const arrowLeftY = arrowY - Math.sin(angle - 0.5) * arrowSize
                const arrowRightX = arrowX - Math.cos(angle + 0.5) * arrowSize
                const arrowRightY = arrowY - Math.sin(angle + 0.5) * arrowSize

                return (
                  <g key={idx}>
                    <path
                      d={path}
                      fill="none"
                      stroke={stroke}
                      strokeWidth={strokeWidth}
                      strokeDasharray={edge.isCrossBranch ? '6 3' : undefined}
                      opacity={opacity}
                      strokeLinecap="round"
                      filter={isHovered ? 'url(#glow)' : undefined}
                    />
                    <polygon
                      points={`${arrowX},${arrowY} ${arrowLeftX},${arrowLeftY} ${arrowRightX},${arrowRightY}`}
                      fill={stroke}
                      opacity={opacity}
                    />
                  </g>
                )
              })}
            </g>

            {/* Узлы сцен */}
            <g>
              {visibleNodes.map(node => {
                const isCurrent = node.id === currentSceneId
                const isVisited = visitedSet.has(node.id)
                const isSelected = node.id === selectedScene
                const isHovered = node.id === hoveredScene
                const scene = node.scene
                const branch = scene.branch || 'start'
                const meta = BRANCH_META[branch]
                const colors = BRANCH_COLORS[branch] || BRANCH_COLORS.end
                const isHub = scene.isHub
                const isVictory = scene.isEnding === 'victory'
                const isDeath = scene.isEnding === 'death'

                const size = isCurrent ? 28 : isHovered ? 24 : isVisited ? 20 : 16
                let fill = colors.node
                let stroke = colors.stroke
                if (isCurrent) { fill = '#0e7490'; stroke = '#22d3ee' }
                else if (isVictory) { fill = '#064e3b'; stroke = '#10b981' }
                else if (isDeath) { fill = '#450a0a'; stroke = '#ef4444' }
                else if (isHub) { fill = '#422006'; stroke = '#fbbf24' }

                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedScene(node.id === selectedScene ? null : node.id)
                    }}
                    onMouseEnter={() => setHoveredScene(node.id)}
                    onMouseLeave={() => setHoveredScene(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Пульсация для текущей */}
                    {isCurrent && (
                      <>
                        <circle r={size + 6} fill="none" stroke="#22d3ee" strokeWidth="1.5" opacity="0.3">
                          <animate attributeName="r" values={`${size + 2};${size + 12};${size + 2}`} dur="2.5s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0.5;0;0.5" dur="2.5s" repeatCount="indefinite" />
                        </circle>
                        <circle r={size + 3} fill="none" stroke="#22d3ee" strokeWidth="1" opacity="0.5">
                          <animate attributeName="r" values={`${size};${size + 8};${size}`} dur="2.5s" repeatCount="indefinite" begin="0.8s" />
                          <animate attributeName="opacity" values="0.4;0;0.4" dur="2.5s" repeatCount="indefinite" begin="0.8s" />
                        </circle>
                      </>
                    )}
                    {/* Внешний круг для хабов */}
                    {isHub && !isCurrent && (
                      <circle r={size + 2} fill="none" stroke="#fbbf24" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
                    )}
                    {/* Основной круг */}
                    <circle
                      r={size}
                      fill={fill}
                      stroke={stroke}
                      strokeWidth={isCurrent ? 3 : isSelected ? 2.5 : isHovered ? 2 : 1.5}
                      opacity={isVisited || isCurrent ? 1 : 0.55}
                      filter={isHovered || isCurrent ? 'url(#glow)' : undefined}
                      style={{ transition: 'r 0.15s ease-out' }}
                    />
                    {/* Кольцо выделения */}
                    {isSelected && (
                      <circle r={size + 4} fill="none" stroke="#67e8f9" strokeWidth="2" strokeDasharray="3 2" />
                    )}
                    {/* Иконка */}
                    <text
                      textAnchor="middle"
                      dy="0.35em"
                      fontSize={size * 0.75}
                      style={{ pointerEvents: 'none', userSelect: 'none' }}
                    >
                      {isVictory ? '🏆' : isDeath ? '💀' : isHub ? '⭐' : meta?.icon || '📍'}
                    </text>
                    {/* Подпись — только для текущей, посещённых, выделенных, хабов */}
                    {(isCurrent || isVisited || isSelected || isHub || isHovered) && (
                      <text
                        y={size + 10}
                        textAnchor="middle"
                        fontSize={9}
                        fill={isCurrent ? '#67e8f9' : isVisited ? '#cbd5e1' : '#64748b'}
                        fontWeight={isCurrent || isHovered ? 'bold' : 'normal'}
                        style={{ pointerEvents: 'none', userSelect: 'none', fontFamily: 'monospace' }}
                      >
                        {(scene.title || node.id).slice(0, 22)}
                      </text>
                    )}
                  </g>
                )
              })}
            </g>
          </svg>
        </div>

        {/* Контролы зума */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5">
          <button onClick={zoomIn} className="w-10 h-10 rounded-lg bg-slate-900/95 border border-cyan-400/30 text-cyan-100 hover:border-cyan-400/70 hover:bg-slate-800 backdrop-blur-sm text-xl font-bold transition-all active:scale-95" title="Приблизить">+</button>
          <button onClick={zoomOut} className="w-10 h-10 rounded-lg bg-slate-900/95 border border-cyan-400/30 text-cyan-100 hover:border-cyan-400/70 hover:bg-slate-800 backdrop-blur-sm text-xl font-bold transition-all active:scale-95" title="Отдалить">−</button>
          <button onClick={resetView} className="w-10 h-10 rounded-lg bg-slate-900/95 border border-cyan-400/30 text-cyan-100 hover:border-cyan-400/70 hover:bg-slate-800 backdrop-blur-sm text-sm transition-all active:scale-95" title="Центрировать на текущей">🎯</button>
        </div>

        {/* Легенда с цветами веток — компактная */}
        <div className="absolute bottom-3 left-3 p-2.5 rounded-xl bg-slate-950/95 border border-cyan-400/20 backdrop-blur-sm text-[10px] space-y-1 max-w-48">
          <div className="font-mono text-cyan-300/80 uppercase tracking-wider mb-1.5 font-bold">Ветки</div>
          {Object.entries(BRANCH_META).map(([key, meta]) => (
            <div key={key} className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full border" style={{ backgroundColor: BRANCH_COLORS[key]?.node, borderColor: BRANCH_COLORS[key]?.stroke }}></div>
              <span className="text-slate-300/80 truncate">{meta.label}</span>
            </div>
          ))}
        </div>

        {/* Миникарта */}
        <div className="absolute bottom-3 right-3 w-32 h-40 rounded-lg bg-slate-950/95 border border-cyan-400/20 backdrop-blur-sm p-1.5 overflow-hidden">
          <div className="text-[8px] text-cyan-300/60 font-mono mb-1 text-center uppercase tracking-wider">обзор</div>
          <div className="relative w-full h-32 rounded bg-slate-900/40">
            {nodes.map(node => {
              const isCurrent = node.id === currentSceneId
              const isVisited = visitedSet.has(node.id)
              const colors = BRANCH_COLORS[node.scene.branch || 'start'] || BRANCH_COLORS.end
              return (
                <div
                  key={node.id}
                  className="absolute rounded-full"
                  style={{
                    left: `${(node.x / MAP_WIDTH) * 100}%`,
                    top: `${(node.y / MAP_HEIGHT) * 100}%`,
                    width: isCurrent ? 5 : 2.5,
                    height: isCurrent ? 5 : 2.5,
                    backgroundColor: isCurrent ? '#22d3ee' : isVisited ? colors.line : '#334155',
                    transform: 'translate(-50%, -50%)',
                    boxShadow: isCurrent ? '0 0 4px #22d3ee' : undefined
                  }}
                />
              )
            })}
            <div
              className="absolute border border-cyan-400/50 bg-cyan-400/5 pointer-events-none rounded"
              style={{
                left: `${((-pan.x / zoom) / MAP_WIDTH) * 100}%`,
                top: `${((-pan.y / zoom) / MAP_HEIGHT) * 100}%`,
                width: `${(containerSize.width / zoom / MAP_WIDTH) * 100}%`,
                height: `${(containerSize.height / zoom / MAP_HEIGHT) * 100}%`
              }}
            />
          </div>
        </div>

        {/* Панель деталей */}
        {selectedSceneData && (
          <div
            className="absolute top-3 left-3 w-72 max-h-[70vh] overflow-y-auto rounded-xl bg-slate-950/97 border border-cyan-400/50 backdrop-blur-md p-3 shadow-2xl"
            onClick={e => e.stopPropagation()}
            style={{ animation: 'panel-in 0.2s ease-out' }}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <div className="text-[10px] uppercase tracking-widest text-cyan-300/70 font-mono">
                  {BRANCH_META[selectedSceneData.branch || 'start']?.label || '—'} · этаж {selectedSceneData.depth}
                </div>
                <h3 className="text-sm font-bold text-cyan-100 truncate">
                  {selectedSceneData.title || selectedSceneData.id}
                </h3>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setSelectedScene(null) }}
                className="w-6 h-6 rounded bg-slate-900 border border-cyan-400/30 text-cyan-100 text-xs hover:border-cyan-400/60 hover:bg-slate-800 transition-colors shrink-0"
              >✕</button>
            </div>

            <div className="text-xs text-slate-300/80 leading-relaxed mb-3 line-clamp-4">
              {selectedSceneData.text.slice(0, 200).replace(/\n/g, ' ')}...
            </div>

            <div className="flex flex-wrap gap-1 mb-2">
              {selectedSceneData.isHub && <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-200 font-mono">ХАБ</span>}
              {selectedSceneData.isEnding === 'victory' && <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-400/20 text-emerald-200 font-mono">ПОБЕДА</span>}
              {selectedSceneData.isEnding === 'death' && <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-400/20 text-red-200 font-mono">КОНЕЦ</span>}
            </div>

            <div className="space-y-1">
              <div className="text-[10px] uppercase tracking-wider text-cyan-300/70 font-mono mb-1">Переходы:</div>
              {selectedSceneData.choices.map((choice, idx) => {
                const target = choice.next === '@self' ? selectedSceneData : ALL_SCENES[choice.next]
                const avail = choiceAvailable(choice)
                const isCrossBranch = choice.next !== '@self' && ALL_SCENES[choice.next]?.branch !== selectedSceneData.branch
                return (
                  <div key={idx} className={`text-[10px] flex items-start gap-1.5 ${isCrossBranch ? 'text-amber-300/80' : 'text-slate-400/80'}`}>
                    <span className="text-slate-600 shrink-0">→</span>
                    <span className="flex-1">{choice.text.length > 45 ? choice.text.slice(0, 45) + '…' : choice.text}</span>
                    {choice.duration && <span className="text-slate-500 font-mono shrink-0">{(choice.duration / 1000).toFixed(0)}с</span>}
                    {!avail.ok && <span className="text-red-400/60 italic shrink-0">[{avail.reason}]</span>}
                    <span className="text-cyan-400/60 shrink-0">⇒ {target?.title?.slice(0, 15) || '?'}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Футер */}
      <footer className="px-4 py-2.5 border-t border-cyan-400/20 bg-slate-950/95 shrink-0">
        <button
          onClick={onClose}
          className="w-full px-4 py-2 rounded-lg bg-cyan-600/30 border border-cyan-400/50 text-cyan-100 font-medium hover:bg-cyan-600/40 transition-colors"
        >
          ← Вернуться к игре
        </button>
      </footer>

      <style jsx global>{`
        @keyframes panel-in {
          0% { opacity: 0; transform: translateY(-8px) scale(0.97); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  )
}
