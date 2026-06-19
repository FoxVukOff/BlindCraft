'use client'

import type { RetentionStats } from '@/lib/game/retention'

interface AchievementsModalProps {
  stats: RetentionStats
  onClose: () => void
}

export function AchievementsModal({ stats, onClose }: AchievementsModalProps) {
  const unlockedCount = stats.achievements.filter(a => a.unlocked).length
  const totalCount = stats.achievements.length
  const progressPercent = (unlockedCount / totalCount) * 100

  // Время игры в читаемом формате
  const formatPlayTime = (seconds: number): string => {
    if (seconds < 60) return `${Math.floor(seconds)}с`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}м ${Math.floor(seconds % 60)}с`
    return `${Math.floor(seconds / 3600)}ч ${Math.floor((seconds % 3600) / 60)}м`
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col"
      onClick={onClose}
    >
      {/* Шапка */}
      <header
        className="px-4 py-3 border-b border-cyan-400/20 flex items-center justify-between bg-slate-950/95 backdrop-blur-sm shrink-0"
        onClick={e => e.stopPropagation()}
      >
        <div>
          <h2 className="text-lg font-bold text-cyan-200">🏆 Достижения</h2>
          <div className="text-[10px] text-cyan-200/60 font-mono">
            {unlockedCount} / {totalCount} открыто
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-md bg-slate-900 border border-cyan-400/30 text-cyan-100 hover:border-cyan-400/70 transition-colors"
        >✕</button>
      </header>

      <div
        className="flex-1 overflow-y-auto p-4 space-y-4"
        onClick={e => e.stopPropagation()}
      >
        {/* Streak и статистика */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-cyan-950/30 border border-cyan-400/30 p-3">
            <div className="text-[10px] uppercase tracking-wider text-cyan-300/70 font-mono mb-1">🏠 Сессий</div>
            <div className="text-2xl font-bold text-cyan-200">{stats.totalSessions}</div>
          </div>
          <div className="rounded-lg bg-emerald-950/30 border border-emerald-400/30 p-3">
            <div className="text-[10px] uppercase tracking-wider text-emerald-300/70 font-mono mb-1">⏱️ Время в игре</div>
            <div className="text-2xl font-bold text-emerald-200">{formatPlayTime(stats.totalPlayTime)}</div>
          </div>
          <div className="rounded-lg bg-purple-950/30 border border-purple-400/30 p-3">
            <div className="text-[10px] uppercase tracking-wider text-purple-300/70 font-mono mb-1">⚙️ Действий</div>
            <div className="text-2xl font-bold text-purple-200">{stats.totalActions}</div>
            <div className="text-[10px] text-purple-300/50 mt-1">сцен: {stats.totalScenesVisited}</div>
          </div>
          <div className="rounded-lg bg-amber-950/30 border border-amber-400/30 p-3">
            <div className="text-[10px] uppercase tracking-wider text-amber-300/70 font-mono mb-1">🏆 Побед / Смертей</div>
            <div className="text-2xl font-bold text-amber-200">{stats.victories} / {stats.deaths}</div>
          </div>
        </div>

        {/* Прогресс достижений */}
        <div className="rounded-lg bg-slate-900/60 border border-cyan-400/20 p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-cyan-200/80 font-mono">Прогресс</span>
            <span className="text-xs text-cyan-200/80 font-mono">{unlockedCount}/{totalCount}</span>
          </div>
          <div className="h-2 rounded-full bg-slate-950/80 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-amber-300 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Список достижений */}
        <div className="space-y-1.5">
          <div className="text-[10px] uppercase tracking-widest text-cyan-300/70 font-mono mb-2">Список</div>
          {stats.achievements.map(ach => (
            <div
              key={ach.id}
              className={`rounded-lg border p-2.5 flex items-center gap-3 transition-all ${
                ach.unlocked
                  ? 'border-emerald-400/40 bg-emerald-950/20'
                  : 'border-slate-700/40 bg-slate-900/30 opacity-60'
              }`}
            >
              <div className={`text-2xl shrink-0 ${ach.unlocked ? '' : 'grayscale'}`}>
                {ach.unlocked ? ach.icon : '🔒'}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-bold ${ach.unlocked ? 'text-emerald-200' : 'text-slate-400'}`}>
                  {ach.name}
                </div>
                <div className="text-[11px] text-slate-400/80 leading-snug">
                  {ach.description}
                </div>
              </div>
              {ach.unlocked && ach.unlockedAt && (
                <div className="text-[9px] text-emerald-300/50 font-mono shrink-0">
                  {new Date(ach.unlockedAt).toLocaleDateString('ru-RU')}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Подсказка */}
        <div className="text-[10px] text-slate-500 italic text-center pt-2">
          Заходи каждый день, чтобы поддерживать серию! 🔥
        </div>
      </div>

      {/* Футер */}
      <footer
        className="px-4 py-3 border-t border-cyan-400/20 bg-slate-950/95 shrink-0"
        onClick={e => e.stopPropagation()}
      >
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
