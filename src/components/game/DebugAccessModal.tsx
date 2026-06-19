'use client'

import { useState } from 'react'

interface DebugAccessModalProps {
  onClose: () => void
  onApply100: () => void
  onShowInfo: () => void
}

/**
 * Секретная модалка для доступа к debug-функциям.
 * Открывается 5 быстрыми тапами по версии в шапке.
 * Не упоминается в UI/changelog — для продакшена скрыта.
 */
export function DebugAccessModal({ onClose, onApply100, onShowInfo }: DebugAccessModalProps) {
  const [confirmStep, setConfirmStep] = useState(false)

  return (
    <div
      className="fixed inset-0 z-[70] bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-slate-900 border-2 border-purple-500/50 rounded-2xl p-5 shadow-2xl"
        style={{ animation: 'debug-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-purple-500/20 border-2 border-purple-500/40 flex items-center justify-center text-2xl shrink-0">
            🎮
          </div>
          <div>
            <h3 className="text-base font-bold text-purple-200">Режим отладки</h3>
            <p className="text-[11px] text-slate-400">Секретное меню</p>
          </div>
        </div>

        <p className="text-xs text-slate-400/80 leading-relaxed mb-4 italic">
          Это скрытое меню для тестирования. Не предназначено для обычных игроков.
          Действия могут необратимо изменить ваш прогресс.
        </p>

        {!confirmStep ? (
          <div className="space-y-2">
            <button
              onClick={() => {
                setConfirmStep(true)
              }}
              className="w-full px-3 py-2.5 rounded-lg bg-purple-950/50 border border-purple-400/40 text-sm text-purple-100 hover:bg-purple-900/50 hover:border-purple-400/70 transition-all text-left"
            >
              <div className="font-bold mb-0.5">✅ Разблокировать весь контент</div>
              <div className="text-[10px] text-purple-300/60">
                Все сцены, предметы, концовки и достижения
              </div>
            </button>
            <button
              onClick={onShowInfo}
              className="w-full px-3 py-2.5 rounded-lg bg-slate-800/60 border border-cyan-400/30 text-sm text-cyan-100 hover:bg-slate-700/60 hover:border-cyan-400/60 transition-all text-left"
            >
              <div className="font-bold mb-0.5">ℹ️ Информация о сохранении</div>
              <div className="text-[10px] text-cyan-300/60">
                Вывести в консоль таблицу с текущим состоянием
              </div>
            </button>
            <button
              onClick={onClose}
              className="w-full px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-600 text-sm text-slate-300 hover:bg-slate-700/60 transition-all"
            >
              ← Закрыть
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="rounded-lg bg-purple-950/40 border border-purple-500/40 p-3">
              <div className="text-sm font-bold text-purple-200 mb-1">Разблокировать весь контент?</div>
              <div className="text-[11px] text-purple-300/70 leading-relaxed">
                Это перезапишет ваш текущий прогресс полным прохождением.
                Текущее сохранение будет потеряно. Действие нельзя отменить.
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmStep(false)}
                className="flex-1 px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 text-slate-200 text-sm font-medium hover:bg-slate-700 transition-colors"
              >
                Назад
              </button>
              <button
                onClick={() => {
                  onApply100()
                  onClose()
                }}
                className="flex-1 px-3 py-2 rounded-lg bg-purple-600 border border-purple-400 text-white text-sm font-bold hover:bg-purple-500 transition-colors"
              >
                Применить
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes debug-in {
          0% { opacity: 0; transform: scale(0.85) translateY(20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  )
}
