'use client'

import { useMemo } from 'react'
import type { Scene, Choice, ResourceType, PickaxeTier } from '@/lib/game/types'
import { ALL_SCENES } from '@/lib/game/story'

interface StoryTreeProps {
  currentSceneId: string
  visited: string[]
  onClose: () => void
  inventory: Partial<Record<ResourceType, number>>
  flags: string[]
  pickaxeTier: PickaxeTier
}

interface SceneNode {
  scene: Scene
  choices: Choice[]
}

const BRANCH_META: Record<string, { label: string; color: string; icon: string }> = {
  start:   { label: 'Поверхность и верхний туннель', color: 'text-cyan-300',    icon: '⛰️' },
  water:   { label: 'Путь Воды',                     color: 'text-sky-300',     icon: '💧' },
  lava:    { label: 'Путь Жара',                     color: 'text-orange-300',  icon: '🔥' },
  dark:    { label: 'Путь Тишины',                   color: 'text-purple-300',  icon: '🌑' },
  gold:    { label: 'Золотая камера и спуск',        color: 'text-amber-300',   icon: '🟡' },
  diamond: { label: 'Алмазная камера',               color: 'text-cyan-200',    icon: '💎' },
  end:     { label: 'Концовки',                      color: 'text-slate-300',   icon: '⚖️' }
}

export function StoryTree({ currentSceneId, visited, onClose, inventory, flags, pickaxeTier }: StoryTreeProps) {
  // Группируем сцены по веткам и этажам
  const grouped = useMemo(() => {
    const groups: Record<string, { depth: number; nodes: SceneNode[] }> = {}
    for (const scene of Object.values(ALL_SCENES)) {
      const branch = scene.branch || 'start'
      if (!groups[branch]) groups[branch] = { depth: scene.depth, nodes: [] }
      groups[branch].nodes.push({ scene, choices: scene.choices })
    }
    // Сортируем ветки в логическом порядке
    const order = ['start', 'water', 'lava', 'dark', 'gold', 'diamond', 'end']
    return order.map(b => ({ branch: b, ...groups[b] })).filter(g => g.nodes)
  }, [])

  // Проверяет, доступен ли выбор в текущий момент (для подсказки в дереве)
  const choiceAvailable = (choice: Choice): { ok: boolean; reason?: string } => {
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
    if (r.minPickaxe) {
      const order: PickaxeTier[] = ['none', 'wood', 'copper', 'iron', 'diamond']
      if (order.indexOf(pickaxeTier) < order.indexOf(r.minPickaxe)) {
        return { ok: false, reason: `нужна ${r.minPickaxe} кирка` }
      }
    }
    return { ok: true }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-sm flex flex-col"
      onClick={onClose}
    >
      {/* Шапка */}
      <header
        className="px-4 py-3 border-b border-cyan-400/20 flex items-center justify-between"
        onClick={e => e.stopPropagation()}
      >
        <div>
          <h2 className="text-lg font-bold text-cyan-200">Дерево сюжета</h2>
          <div className="text-[10px] text-cyan-200/60 font-mono">
            {visited.length} / {Object.keys(ALL_SCENES).length} сцен посещено · вы в: «{ALL_SCENES[currentSceneId]?.title || currentSceneId}»
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-md bg-slate-900 border border-cyan-400/30 text-cyan-100 hover:border-cyan-400/70"
        >✕</button>
      </header>

      {/* Содержимое — список по веткам */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-5"
        onClick={e => e.stopPropagation()}
      >
        {grouped.map(group => {
          const meta = BRANCH_META[group.branch] || BRANCH_META.start
          return (
            <section key={group.branch}>
              <div className={`flex items-center gap-2 mb-2 sticky top-0 bg-slate-950/95 backdrop-blur-sm py-1.5 -mx-1 px-1 z-10`}>
                <span className="text-base">{meta.icon}</span>
                <h3 className={`text-sm font-bold uppercase tracking-wider ${meta.color}`}>
                  {meta.label}
                </h3>
                <span className="text-[10px] text-cyan-200/40 font-mono ml-1">
                  · этаж {group.nodes[0].scene.depth}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-1.5">
                {group.nodes
                  .sort((a, b) => a.scene.depth - b.scene.depth || a.scene.id.localeCompare(b.scene.id))
                  .map(({ scene, choices }) => {
                    const isCurrent = scene.id === currentSceneId
                    const isVisited = visited.includes(scene.id)
                    const isEnding = scene.isEnding
                    return (
                      <div
                        key={scene.id}
                        className={`rounded-lg border p-2.5 transition-all ${
                          isCurrent
                            ? 'border-cyan-400 bg-cyan-950/40 shadow-[0_0_12px_rgba(34,211,238,0.3)]'
                            : isVisited
                              ? 'border-cyan-400/30 bg-slate-900/60'
                              : 'border-slate-700/40 bg-slate-900/30'
                        } ${isEnding === 'victory' ? 'ring-1 ring-emerald-400/40' : ''} ${isEnding === 'death' ? 'ring-1 ring-red-400/30' : ''}`}
                      >
                        {/* Заголовок сцены */}
                        <div className="flex items-start gap-2">
                          <span className="text-xs mt-0.5">
                            {isCurrent ? '📍' : isVisited ? '✓' : '○'}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className={`text-xs font-bold ${isCurrent ? 'text-cyan-100' : isVisited ? 'text-cyan-200/80' : 'text-slate-500'}`}>
                              {scene.title || scene.id}
                              {scene.isHub && <span className="ml-1.5 text-[9px] px-1 py-0.5 rounded bg-amber-400/20 text-amber-200">ХАБ</span>}
                              {isEnding === 'victory' && <span className="ml-1.5 text-[9px] px-1 py-0.5 rounded bg-emerald-400/20 text-emerald-200">ПОБЕДА</span>}
                              {isEnding === 'death' && <span className="ml-1.5 text-[9px] px-1 py-0.5 rounded bg-red-400/20 text-red-200">КОНЕЦ</span>}
                            </div>
                            {!isVisited && !isCurrent && (
                              <div className="text-[10px] text-slate-600 italic mt-0.5">не посещено</div>
                            )}
                            {(isVisited || isCurrent) && (
                              <div className="text-[10px] text-slate-400/70 mt-0.5 line-clamp-2 leading-snug">
                                {scene.text.slice(0, 90).replace(/\n/g, ' ')}...
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Переходы — только для посещённых или текущей */}
                        {(isVisited || isCurrent) && choices.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-slate-700/40 space-y-0.5">
                            {choices.map((choice, idx) => {
                              const target = choice.next === '@self' ? scene : ALL_SCENES[choice.next]
                              const targetLabel = choice.next === '@self' ? '(торг)' : (target?.title || target?.id || '?')
                              const avail = choiceAvailable(choice)
                              const transition = choice.next === 'crossroads' && scene.branch !== 'start' && scene.depth >= 3
                              return (
                                <div
                                  key={idx}
                                  className={`flex items-center gap-1.5 text-[10px] ${
                                    transition ? 'text-amber-300/80' : 'text-slate-400/80'
                                  }`}
                                >
                                  <span className="text-slate-600">→</span>
                                  <span className="truncate flex-1">{choice.text.length > 50 ? choice.text.slice(0, 50) + '…' : choice.text}</span>
                                  <span className="text-slate-500 font-mono shrink-0">
                                    {choice.duration ? `${(choice.duration / 1000).toFixed(0)}с` : ''}
                                  </span>
                                  {!avail.ok && (
                                    <span className="text-red-400/60 italic shrink-0">[{avail.reason}]</span>
                                  )}
                                  <span className="text-slate-600 shrink-0">⇒ {targetLabel}</span>
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )
                  })}
              </div>
            </section>
          )
        })}

        {/* Легенда */}
        <div className="mt-4 p-3 rounded-lg bg-slate-900/60 border border-slate-700/40 text-[10px] text-slate-400 space-y-1">
          <div className="font-mono text-cyan-300/80 uppercase tracking-wider mb-1">Легенда</div>
          <div>📍 — текущая сцена</div>
          <div>✓ — посещено</div>
          <div>○ — не посещено</div>
          <div>⇒ — куда ведёт выбор</div>
          <div className="text-amber-300/70">жёлтым — переходы между ветками (только в определённых местах)</div>
          <div className="text-slate-500 italic mt-1.5">Некоторые выборы могут быть недоступны из-за нехватки предметов, кирки или уже сделанных действий. Это показано в [квадратных скобках].</div>
        </div>
      </div>

      {/* Футер */}
      <footer
        className="px-4 py-3 border-t border-cyan-400/20 bg-slate-950/90"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="w-full px-4 py-2.5 rounded-lg bg-cyan-600/30 border border-cyan-400/50 text-cyan-100 font-medium hover:bg-cyan-600/40"
        >
          ← Вернуться к игре
        </button>
      </footer>
    </div>
  )
}
