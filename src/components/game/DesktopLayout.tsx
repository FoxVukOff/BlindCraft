'use client'

import type { GameState, Choice, ActionType, Scene } from '@/lib/game/types'
import { PICKAXE_NAME, ARMOR_NAME } from '@/lib/game/types'
import { BRANCH_META } from '@/lib/game/story'
import { InventoryBar } from './Inventory'

const ACTION_META: Record<ActionType, { icon: string; label: string; color: string }> = {
  walk:    { icon: '🚶', label: 'Идти',       color: 'text-cyan-300' },
  mine:    { icon: '⛏️', label: 'Копать',     color: 'text-amber-300' },
  craft:   { icon: '🔨', label: 'Крафт',      color: 'text-orange-300' },
  trade:   { icon: '🤝', label: 'Обмен',      color: 'text-yellow-300' },
  observe: { icon: '👁️', label: 'Осмотреть',  color: 'text-sky-300' },
  combat:  { icon: '⚔️', label: 'Действие',   color: 'text-red-300' }
}

interface ActionProgressType {
  choice: Choice
  start: number
  duration: number
  elapsed: number
}

interface DesktopLayoutProps {
  state: GameState
  scene: Scene
  action: ActionProgressType | null
  audioOn: boolean
  onChoice: (choice: Choice) => void
  onUseMushroom: () => void
  onUseFood: () => void
  onRest: () => void
  canRest: boolean
  onToggleAudio: () => void
  onShowTree: () => void
  onShowMenu: () => void
  onVersionTap: () => void
  isChoiceAvailable: (choice: Choice) => { ok: boolean; reason?: string }
}

export function DesktopLayout(props: DesktopLayoutProps) {
  const { state, scene: s, action, audioOn, onChoice, onUseMushroom, onUseFood, onRest, canRest, onToggleAudio, onShowTree, onShowMenu, onVersionTap, isChoiceAvailable } = props
  const hpPercent = (state.health / state.maxHealth) * 100
  const hpColor = hpPercent > 60 ? 'bg-emerald-400' : hpPercent > 30 ? 'bg-amber-400' : 'bg-red-500'
  const actionMeta = action ? ACTION_META[action.choice.action || 'walk'] : null
  const actionProgress = action ? Math.min(100, (action.elapsed / action.duration) * 100) : 0
  const actionRemaining = action ? Math.ceil((action.duration - action.elapsed) / 1000) : 0
  const branchMeta = s.branch ? BRANCH_META[s.branch] : null

  return (
    <div className="relative min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Фоновое свечение */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{ background: `radial-gradient(ellipse at top, ${ambientGlow(s.ambient)} 0%, transparent 60%)` }}
      />

      {/* ====== Шапка ====== */}
      <header className="relative z-10 px-6 py-2.5 border-b border-cyan-400/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-base font-mono tracking-widest text-cyan-300 uppercase">
            BlindCraft
          </h1>
          <span
            onClick={onVersionTap}
            className="text-[10px] text-cyan-200/40 font-mono cursor-pointer select-none hover:text-cyan-200/70 transition-colors"
            title="v4.3"
          >v4.3</span>
          {branchMeta && (
            <span className={`text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900/60 border border-cyan-400/20 ${branchMeta.color}`}>
              {branchMeta.icon} {branchMeta.label}
            </span>
          )}
          {s.isHub && <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-200 font-mono">ХАБ</span>}
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={onShowTree} className="px-3 py-1.5 rounded-md bg-slate-900/60 border border-cyan-400/20 text-xs hover:border-cyan-400/60" title="Карта сюжета">
            🗺️ Карта
          </button>
          <button onClick={onToggleAudio} className="px-3 py-1.5 rounded-md bg-slate-900/60 border border-cyan-400/20 text-xs hover:border-cyan-400/60" title={audioOn ? 'Выключить звук' : 'Включить звук'}>
            {audioOn ? '🔊' : '🔇'}
          </button>
          <button onClick={onShowMenu} className="px-3 py-1.5 rounded-md bg-slate-900/60 border border-cyan-400/20 text-xs hover:border-cyan-400/60" title="Меню">
            ☰ Меню
          </button>
        </div>
      </header>

      {/* ====== Основная область: 2 колонки ====== */}
      <div className="relative z-10 flex-1 flex gap-4 p-4 overflow-hidden">
        {/* Левая колонка — текст сцены + кнопки */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Текст сцены */}
          <div className="flex-1 overflow-y-auto pr-2">
            {s.title && (
              <div className="text-[11px] uppercase tracking-widest text-cyan-300/70 font-mono mb-2">
                {s.title} · этаж {s.depth}{s.isHub ? ' · хаб' : ''}
              </div>
            )}
            <div className="text-base leading-relaxed text-slate-100 whitespace-pre-line">
              {s.text}
            </div>

            {s.isEnding && (
              <div className="mt-6 p-4 rounded-lg border border-cyan-400/40 bg-cyan-950/40 text-center">
                <div className="text-xs uppercase tracking-widest text-cyan-300/80 mb-1">
                  {s.isEnding === 'victory' ? 'Победа' : 'Конец пути'}
                </div>
              </div>
            )}
          </div>

          {/* Прогресс действия */}
          {action && actionMeta ? (
            <div className="mt-3 p-3 rounded-lg bg-slate-900/60 border border-cyan-400/30">
              <div className="flex items-center gap-3 text-sm mb-2">
                <span className="text-xl">{actionMeta.icon}</span>
                <div className="flex-1">
                  <div className={`${actionMeta.color} font-medium`}>{actionMeta.label}…</div>
                  <div className="text-[11px] text-slate-400 truncate">{action.choice.text}</div>
                </div>
                <div className="text-cyan-300 font-mono text-base">{actionRemaining}с</div>
              </div>
              <div className="h-2 rounded-full bg-slate-900/80 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-500 to-cyan-300 transition-all duration-100" style={{ width: `${actionProgress}%` }} />
              </div>
            </div>
          ) : (
            /* Кнопки выбора */
            <div className="mt-3 space-y-1.5">
              <div className="grid grid-cols-2 gap-1.5">
                {s.choices.map((choice: Choice, idx: number) => {
                  const avail = isChoiceAvailable(choice)
                  const duration = choice.duration ?? 3000
                  const meta = ACTION_META[choice.action || 'walk']
                  return (
                    <button
                      key={idx}
                      onClick={() => avail.ok && onChoice(choice)}
                      disabled={!avail.ok}
                      className={`px-3 py-2.5 rounded-lg text-sm text-left border transition-all flex items-center gap-2 ${
                        avail.ok
                          ? 'bg-slate-900/70 border-cyan-400/30 text-cyan-50 hover:border-cyan-400/70 hover:bg-slate-900 active:scale-[0.98]'
                          : 'bg-slate-900/30 border-slate-700/40 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <span className="inline-flex items-center justify-center w-5 h-5 shrink-0 rounded text-[10px] font-mono bg-cyan-950/60 border border-cyan-400/30 text-cyan-300/70">
                        {idx + 1}
                      </span>
                      <span className="text-base shrink-0">{meta.icon}</span>
                      <span className="flex-1 min-w-0">
                        <span className="block truncate">{choice.text}</span>
                        {!avail.ok && (
                          <span className="block text-[10px] text-red-400/70 italic">{avail.reason}</span>
                        )}
                      </span>
                      <span className="text-[10px] text-cyan-200/50 font-mono shrink-0">{(duration / 1000).toFixed(0)}с</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </main>

        {/* Правая колонка — боковая панель */}
        <aside className="w-72 shrink-0 flex flex-col gap-3 overflow-hidden">
          {/* Статус */}
          <div className="p-3 rounded-lg bg-slate-900/60 border border-cyan-400/20">
            <div className="text-[10px] uppercase tracking-widest text-cyan-300/70 font-mono mb-2">Статус</div>
            <div className="space-y-2">
              <div>
                <div className="flex items-center justify-between mb-0.5 text-xs">
                  <span className="text-cyan-200/70 font-mono">HP</span>
                  <span className="text-cyan-100 font-mono">{state.health}/{state.maxHealth}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-950/80 overflow-hidden">
                  <div className={`h-full ${hpColor} transition-all duration-500`} style={{ width: `${hpPercent}%` }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="text-cyan-200/50 text-[10px] uppercase">Глубина</div>
                  <div className="text-cyan-300 font-bold">{state.depth}</div>
                </div>
                <div>
                  <div className="text-cyan-200/50 text-[10px] uppercase">Ходов</div>
                  <div className="text-cyan-300 font-bold">{state.turns}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-700/30">
                <div>
                  <div className="text-cyan-200/50 text-[10px]">Кирка</div>
                  <div className="text-cyan-100 font-mono">{PICKAXE_NAME[state.pickaxeTier]}</div>
                </div>
                <div>
                  <div className="text-cyan-200/50 text-[10px]">Броня</div>
                  <div className="text-cyan-100 font-mono">{ARMOR_NAME[state.armor]}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Инвентарь */}
          <div className="p-3 rounded-lg bg-slate-900/60 border border-cyan-400/20">
            <div className="text-[10px] uppercase tracking-widest text-cyan-300/70 font-mono mb-2">Инвентарь</div>
            <InventoryBar
              inventory={state.inventory}
              pickaxeTier={state.pickaxeTier}
              armor={state.armor}
              onUseMushroom={onUseMushroom}
              onUseFood={onUseFood}
              onRest={onRest}
              canRest={canRest}
            />
          </div>

          {/* Журнал */}
          <div className="flex-1 p-3 rounded-lg bg-slate-900/60 border border-cyan-400/20 overflow-hidden flex flex-col min-h-0">
            <div className="text-[10px] uppercase tracking-widest text-cyan-300/70 font-mono mb-2 shrink-0">Журнал</div>
            <div className="flex-1 overflow-y-auto text-[11px] text-cyan-100/70 space-y-1 pr-1">
              {state.log.slice(-12).map((line, i) => (
                <div key={i} className="leading-snug">› {line}</div>
              ))}
            </div>
          </div>

          {/* Доп. кнопки */}
          <div className="grid grid-cols-2 gap-1.5">
            <button onClick={onShowTree} className="px-3 py-2 rounded-lg text-xs font-mono bg-slate-900/70 border border-cyan-400/30 text-cyan-100 hover:border-cyan-400/60">
              🗺️ Карта
            </button>
            <button onClick={onShowMenu} className="px-3 py-2 rounded-lg text-xs font-mono bg-slate-900/70 border border-cyan-400/30 text-cyan-100 hover:border-cyan-400/60">
              ☰ Меню
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}

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
