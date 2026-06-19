'use client'

import { CHANGELOG } from '@/lib/game/changelog'

interface ChangelogModalProps {
  onClose: () => void
}

const VERSION_BADGE: Record<string, string> = {
  major: 'bg-purple-500/20 text-purple-200 border-purple-400/40',
  minor: 'bg-cyan-500/20 text-cyan-200 border-cyan-400/40',
  patch: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40'
}

export function ChangelogModal({ onClose }: ChangelogModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-sm flex flex-col"
      onClick={onClose}
    >
      {/* Шапка */}
      <header
        className="px-4 py-3 border-b border-cyan-400/20 flex items-center justify-between bg-slate-950/80"
        onClick={e => e.stopPropagation()}
      >
        <div>
          <h2 className="text-lg font-bold text-cyan-200">📜 Changelog</h2>
          <div className="text-[10px] text-cyan-200/60 font-mono">
            История версий BlindCraft · текущая: v2.1
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-md bg-slate-900 border border-cyan-400/30 text-cyan-100 hover:border-cyan-400/70"
        >✕</button>
      </header>

      {/* Список версий */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-5"
        onClick={e => e.stopPropagation()}
      >
        {CHANGELOG.map(version => (
          <article
            key={version.version}
            className={`rounded-lg border p-4 ${
              version.version === 'v2.1'
                ? 'border-emerald-400/50 bg-emerald-950/20 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                : version.version === 'v2.0'
                  ? 'border-cyan-400/40 bg-cyan-950/10'
                  : 'border-slate-700/40 bg-slate-900/40'
            }`}
          >
            {/* Заголовок версии */}
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span
                className={`text-xs px-2 py-0.5 rounded font-mono font-bold border ${
                  VERSION_BADGE[version.type] || VERSION_BADGE.patch
                }`}
              >
                {version.version}
              </span>
              <span className="text-xs text-cyan-200/50 font-mono">
                {version.date}
              </span>
              {version.version === 'v2.1' && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-400/20 text-emerald-200 font-mono">
                  ТЕКУЩАЯ
                </span>
              )}
              {version.version === 'v2.0' && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-400/20 text-purple-200 font-mono">
                  MAJOR UPDATE
                </span>
              )}
            </div>

            {/* Название версии */}
            <h3 className="text-base font-bold text-cyan-100 mb-2">
              {version.title}
            </h3>

            {/* Описание */}
            {version.description && (
              <p className="text-xs text-slate-300/80 leading-relaxed mb-3">
                {version.description}
              </p>
            )}

            {/* Список изменений по категориям */}
            <div className="space-y-2">
              {version.sections.map(section => (
                <div key={section.title}>
                  <div className="text-[10px] uppercase tracking-wider text-cyan-300/70 font-mono mb-1 flex items-center gap-1">
                    <span>{section.icon}</span>
                    <span>{section.title}</span>
                  </div>
                  <ul className="space-y-0.5 pl-5">
                    {section.items.map((item, idx) => (
                      <li key={idx} className="text-xs text-slate-300/90 leading-snug flex gap-1.5">
                        <span className="text-cyan-400/50 shrink-0">›</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Метаданные */}
            {(version.stats || version.tags) && (
              <div className="mt-3 pt-2 border-t border-slate-700/30 flex flex-wrap gap-1.5">
                {version.stats && version.stats.map((stat, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800/60 text-cyan-200/70 font-mono"
                  >
                    {stat}
                  </span>
                ))}
                {version.tags && version.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800/60 text-cyan-200/50 font-mono"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </article>
        ))}

        {/* Легенда */}
        <div className="mt-4 p-3 rounded-lg bg-slate-900/60 border border-slate-700/40 text-[10px] text-slate-400 space-y-1">
          <div className="font-mono text-cyan-300/80 uppercase tracking-wider mb-1">Типы релизов</div>
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-200 border border-purple-400/40 font-mono">major</span>
            <span>— крупное обновление с новыми механиками</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-200 border border-cyan-400/40 font-mono">minor</span>
            <span>— новый контент (сцены, предметы, торговцы)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-200 border border-emerald-400/40 font-mono">patch</span>
            <span>— баг-фиксы, мелкие улучшения UI/UX</span>
          </div>
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
