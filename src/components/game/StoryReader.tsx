'use client'

import { useMemo, useState } from 'react'
import type { GameState, Scene } from '@/lib/game/types'
import { ALL_SCENES, BRANCH_META } from '@/lib/game/story'
import { ACT_META } from '@/lib/game/types'

interface StoryReaderProps {
  state: GameState
  onClose: () => void
}

interface StoryEntry {
  scene: Scene
  act: 'act1' | 'act2'
  branch: string
  title: string
  text: string
  visited: boolean
}

// Короткое описание-вступление для каждой ветки (раскрывается по мере посещения)
const BRANCH_INTROS: Record<string, string> = {
  start: 'Ты — слепой рудокоп. Слепым от рождения, ты научился слышать мир так, как не слышат зрячие. Говорят, глубоко под горой спят алмазы — кристаллы, что поют свою песню в темноте. Ты решил спуститься.',
  water: 'Путь Воды — холодный, сырой. Здесь капает с потолка, а под ногами — илистое дно водоёмов. Жители этого пути — отшельники, прячущиеся в сухих гротах.',
  lava: 'Путь Жара — сера, пепел, кипящая лава. Здесь жарко, как в кузнице, и только кузнецы могут вынести этот путь. Они куют медь и железо.',
  dark: 'Путь Тишины — самый страшный. Здесь эхо не возвращается. Слепой монстр, такой же слепой как ты, но с острым слухом, охотится в темноте.',
  gold: 'Золотая камера — точка схождения всех путей. Здесь золото лежит прямо под ногами, и старый сундук хранит железную кирку для тех, кто забрёл без снаряжения.',
  diamond: 'Алмазная камера — цель всего спуска. Хор крошечных колокольчиков, чистый звон, вибрирующий в пальцах. Только железная кирка может добыть алмаз из породы.',
  hunt: 'Охотничья тропа — тайный путь с Капельной комнаты. Здесь живут пещерные кролики, медведи, и старый охотник, который знает тайный лаз вниз.',
  trials: 'The Trials — древние испытания Строителей. Дверь с рукоятью в форме змей скрывает залы, где можно добыть Булаву Ветров и Стержень Ветра.',
  surface2: 'После победы в шахте ты вышел на поверхность. Но мир снаружи оказался не таким, как раньше. Деревня, руины, и тайны, что ждут исследователя.',
  end: 'Финал. Каждая концовка — отдельная история. Победа с алмазами, поражение, или путь Мастера Испытаний.'
}

export function StoryReader({ state, onClose }: StoryReaderProps) {
  // Группируем сцены по актам и веткам
  const entries = useMemo<StoryEntry[]>(() => {
    const result: StoryEntry[] = []
    for (const scene of Object.values(ALL_SCENES)) {
      const branch = scene.branch || 'start'
      const act = scene.act || (branch === 'trials' || branch === 'surface2' ? 'act2' : 'act1')
      // Для Act 2 — trials и surface2 ветки
      // Для Act 1 — все остальные
      const isAct2Branch = branch === 'trials' || branch === 'surface2' || branch === 'end' && scene.id === 'ending_trials_master'
      const finalAct: 'act1' | 'act2' = isAct2Branch ? 'act2' : 'act1'
      result.push({
        scene,
        act: finalAct,
        branch,
        title: scene.title || scene.id,
        text: scene.text,
        visited: state.visited.includes(scene.id)
      })
    }
    return result
  }, [state.visited])

  // Группировка по акту и ветке
  const grouped = useMemo(() => {
    const groups: { act: 'act1' | 'act2'; branch: string; entries: StoryEntry[]; intro: string }[] = []
    const seen = new Set<string>()

    // Порядок веток для красоты
    const order1 = ['start', 'hunt', 'water', 'lava', 'dark', 'gold', 'diamond']
    const order2 = ['surface2', 'trials']

    for (const act of ['act1', 'act2'] as const) {
      const order = act === 'act1' ? order1 : order2
      for (const branch of order) {
        const branchEntries = entries.filter(e => e.act === act && e.branch === branch)
        if (branchEntries.length === 0) continue
        // Проверяем, посещена ли хоть одна сцена в ветке
        const anyVisited = branchEntries.some(e => e.visited)
        if (!anyVisited && act === 'act2' && !state.act2Unlocked) continue // скрываем Act 2 если не открыт
        groups.push({
          act,
          branch,
          entries: branchEntries.sort((a, b) => a.scene.depth - b.scene.depth),
          intro: BRANCH_INTROS[branch] || ''
        })
      }
    }

    // Endings — отдельная группа
    const endings = entries.filter(e => e.scene.isEnding)
    if (endings.length > 0) {
      groups.push({
        act: 'act1',
        branch: 'end',
        entries: endings,
        intro: BRANCH_INTROS.end
      })
    }

    return groups
  }, [entries, state.act2Unlocked])

  // Считаем статистику
  const stats = useMemo(() => {
    const total = entries.length
    const visitedCount = entries.filter(e => e.visited).length
    const act1Visited = entries.filter(e => e.act === 'act1' && e.visited).length
    const act2Visited = entries.filter(e => e.act === 'act2' && e.visited).length
    return { total, visitedCount, act1Visited, act2Visited }
  }, [entries])

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col">
      {/* Шапка */}
      <header className="px-4 py-3 border-b border-cyan-400/20 flex items-center justify-between bg-slate-950/90 backdrop-blur-sm shrink-0">
        <div>
          <h2 className="text-lg font-bold text-cyan-200">📖 Сюжет</h2>
          <div className="text-[10px] text-cyan-200/60 font-mono">
            Открыто {stats.visitedCount} из {stats.total} сцен · Act 1: {stats.act1Visited} · Act 2: {stats.act2Visited}
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-md bg-slate-900 border border-cyan-400/30 text-cyan-100 hover:border-cyan-400/70 transition-colors"
        >✕</button>
      </header>

      {/* Содержимое */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 max-w-3xl mx-auto w-full">
        {/* Пролог */}
        <section className="rounded-xl border border-cyan-400/30 bg-cyan-950/20 p-4">
          <h3 className="text-base font-bold text-cyan-200 mb-2 flex items-center gap-2">
            <span>📜</span> Пролог
          </h3>
          <p className="text-sm text-slate-300/90 leading-relaxed italic">
            {BRANCH_INTROS.start}
          </p>
        </section>

        {/* Act 1 */}
        <section>
          <div className="flex items-center gap-2 mb-3 sticky top-0 bg-slate-950/95 backdrop-blur-sm py-2 z-10">
            <span className="text-xl">{ACT_META.act1.icon}</span>
            <h2 className={`text-base font-bold uppercase tracking-wider ${ACT_META.act1.color}`}>
              {ACT_META.act1.label}
            </h2>
          </div>

          <div className="space-y-4">
            {grouped.filter(g => g.act === 'act1' && g.branch !== 'end').map(group => {
              const meta = BRANCH_META[group.branch]
              const anyVisited = group.entries.some(e => e.visited)
              return (
                <div key={group.branch} className="rounded-lg border border-slate-700/40 bg-slate-900/40 overflow-hidden">
                  <div className="px-3 py-2 border-b border-slate-700/40 bg-slate-900/60 flex items-center gap-2">
                    <span className="text-base">{meta?.icon || '📍'}</span>
                    <h3 className={`text-sm font-bold ${meta?.color || 'text-slate-300'}`}>
                      {meta?.label || group.branch}
                    </h3>
                    <span className="text-[10px] text-slate-500 ml-auto font-mono">
                      {group.entries.filter(e => e.visited).length}/{group.entries.length}
                    </span>
                  </div>
                  {anyVisited && group.intro && (
                    <div className="px-3 py-2 text-xs text-slate-400/80 italic border-b border-slate-700/20">
                      {group.intro}
                    </div>
                  )}
                  <div className="divide-y divide-slate-800/40">
                    {group.entries.map(entry => (
                      <SceneEntry key={entry.scene.id} entry={entry} />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Act 2 */}
        <section>
          <div className="flex items-center gap-2 mb-3 sticky top-0 bg-slate-950/95 backdrop-blur-sm py-2 z-10">
            <span className="text-xl">{ACT_META.act2.icon}</span>
            <h2 className={`text-base font-bold uppercase tracking-wider ${ACT_META.act2.color}`}>
              {ACT_META.act2.label}
            </h2>
            {!state.act2Unlocked && (
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-700/40 text-slate-400 font-mono">
                🔒 ЗАКРЫТО
              </span>
            )}
          </div>

          {!state.act2Unlocked ? (
            <div className="rounded-lg border border-slate-700/40 bg-slate-900/30 p-6 text-center">
              <div className="text-3xl mb-2 opacity-40">🔒</div>
              <div className="text-sm text-slate-400 mb-1">Act 2 ещё не открыт</div>
              <div className="text-xs text-slate-500">
                Получите любую концовку в Act 1, чтобы открыть продолжение.
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {grouped.filter(g => g.act === 'act2').map(group => {
                const meta = BRANCH_META[group.branch]
                const anyVisited = group.entries.some(e => e.visited)
                return (
                  <div key={group.branch} className="rounded-lg border border-slate-700/40 bg-slate-900/40 overflow-hidden">
                    <div className="px-3 py-2 border-b border-slate-700/40 bg-slate-900/60 flex items-center gap-2">
                      <span className="text-base">{meta?.icon || '📍'}</span>
                      <h3 className={`text-sm font-bold ${meta?.color || 'text-slate-300'}`}>
                        {meta?.label || group.branch}
                      </h3>
                      <span className="text-[10px] text-slate-500 ml-auto font-mono">
                        {group.entries.filter(e => e.visited).length}/{group.entries.length}
                      </span>
                    </div>
                    {anyVisited && group.intro && (
                      <div className="px-3 py-2 text-xs text-slate-400/80 italic border-b border-slate-700/20">
                        {group.intro}
                      </div>
                    )}
                    <div className="divide-y divide-slate-800/40">
                      {group.entries.map(entry => (
                        <SceneEntry key={entry.scene.id} entry={entry} />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* Концовки */}
        <section>
          <div className="flex items-center gap-2 mb-3 sticky top-0 bg-slate-950/95 backdrop-blur-sm py-2 z-10">
            <span className="text-xl">⚖️</span>
            <h2 className="text-base font-bold uppercase tracking-wider text-slate-300">
              Концовки
            </h2>
          </div>
          <div className="space-y-2">
            {grouped.find(g => g.branch === 'end')?.entries.map(entry => {
              const isGot = state.act1Endings.includes(entry.scene.id) || state.act2Endings.includes(entry.scene.id)
              return (
                <div
                  key={entry.scene.id}
                  className={`rounded-lg border p-3 ${
                    isGot
                      ? entry.scene.isEnding === 'victory'
                        ? 'border-emerald-400/40 bg-emerald-950/20'
                        : 'border-red-400/30 bg-red-950/10'
                      : 'border-slate-700/40 bg-slate-900/20'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base">
                      {isGot ? (entry.scene.isEnding === 'victory' ? '🏆' : '💀') : '🔒'}
                    </span>
                    <span className={`text-sm font-bold ${isGot ? 'text-slate-200' : 'text-slate-500'}`}>
                      {entry.title}
                    </span>
                    {isGot && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                        entry.scene.isEnding === 'victory' ? 'bg-emerald-400/20 text-emerald-200' : 'bg-red-400/20 text-red-200'
                      }`}>
                        ПОЛУЧЕНО
                      </span>
                    )}
                  </div>
                  {isGot ? (
                    <p className="text-xs text-slate-400/80 leading-relaxed whitespace-pre-line">
                      {entry.text}
                    </p>
                  ) : (
                    <p className="text-xs text-slate-600 italic">Концовка ещё не получена. Продолжай играть.</p>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        {/* Тизер Act 3 */}
        <section className="rounded-xl border border-red-500/30 bg-red-950/10 p-4">
          <h3 className="text-base font-bold text-red-300 mb-2 flex items-center gap-2">
            <span>🌋</span> Тизер: Act 3 — The Nether
          </h3>
          {state.act2Endings.length > 0 ? (
            <p className="text-sm text-slate-300/90 leading-relaxed">
              После Trials ты вышел из шахты с Булавой Ветров и Стержнем Ветра. Изучив их,
              ты понял: это лишь ключи. Настоящая сила — за порталом в Нижний мир.
              Ты добыл обсидиан, построил портал, и теперь Ад ждёт исследователя.
              <span className="block mt-2 text-red-300/80 italic">Act 3 будет в следующей версии (v3.0).</span>
            </p>
          ) : (
            <p className="text-sm text-slate-500 italic">
              🔒 Пройдите любую концовку Act 2, чтобы узнать предысторию Act 3.
            </p>
          )}
        </section>
      </div>

      {/* Футер */}
      <footer className="px-4 py-3 border-t border-cyan-400/20 bg-slate-950/90 shrink-0">
        <button
          onClick={onClose}
          className="w-full px-4 py-2 rounded-lg bg-cyan-600/30 border border-cyan-400/50 text-cyan-100 font-medium hover:bg-cyan-600/40 transition-colors"
        >
          ← Вернуться к игре
        </button>
      </footer>
    </div>
  )
}

function SceneEntry({ entry }: { entry: StoryEntry }) {
  const [expanded, setExpanded] = useState(false)
  if (!entry.visited) {
    return (
      <div className="px-3 py-2 flex items-center gap-2 opacity-50">
        <span className="text-xs">🔒</span>
        <span className="text-xs text-slate-500 italic">{entry.title}</span>
        <span className="text-[10px] text-slate-600 ml-auto font-mono">не открыто</span>
      </div>
    )
  }
  return (
    <button
      onClick={() => setExpanded(!expanded)}
      className="w-full px-3 py-2 text-left hover:bg-slate-800/40 transition-colors block"
    >
      <div className="flex items-center gap-2">
        <span className="text-xs">✓</span>
        <span className="text-xs font-medium text-slate-200 flex-1">
          {entry.title} <span className="text-slate-500 text-[10px]">· этаж {entry.scene.depth}</span>
        </span>
        <span className="text-[10px] text-cyan-400/60 font-mono">{expanded ? '▲' : '▼'}</span>
      </div>
      {expanded && (
        <div className="mt-2 text-xs text-slate-400/90 leading-relaxed whitespace-pre-line pl-5">
          {entry.text}
        </div>
      )}
    </button>
  )
}
