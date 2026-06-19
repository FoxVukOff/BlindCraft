'use client'

import { useState } from 'react'

interface ConfirmResetModalProps {
  onClose: () => void
  onConfirm: () => void
}

/**
 * Кастомный Alert с двойным подтверждением удаления сейва.
 * Заменяет window.confirm — два раза спрашивает "вы уверены?".
 */
export function ConfirmResetModal({ onClose, onConfirm }: ConfirmResetModalProps) {
  const [step, setStep] = useState<1 | 2>(1)

  const handleFirstConfirm = () => setStep(2)
  const handleSecondConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[60] bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-slate-900 border-2 border-red-500/50 rounded-2xl p-5 shadow-2xl"
        style={{ animation: 'alert-in 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Шаг 1 — первое подтверждение */}
        {step === 1 && (
          <>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-red-500/20 border-2 border-red-500/40 flex items-center justify-center text-2xl shrink-0">
                ⚠️
              </div>
              <div>
                <h3 className="text-base font-bold text-red-200">Удалить сохранение?</h3>
                <p className="text-[11px] text-slate-400">Шаг 1 из 2</p>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              Это действие удалит весь ваш прогресс: текущую игру, рекорды глубины,
              счётчики побед и смертей, открытые сцены и концовки.
            </p>

            <div className="rounded-lg bg-red-950/30 border border-red-500/20 p-2.5 mb-4">
              <div className="text-[11px] text-red-300/80 font-mono mb-1">Будет удалено:</div>
              <ul className="text-[11px] text-red-200/70 space-y-0.5">
                <li>• Текущее сохранение игры</li>
                <li>• Статистика (победы, смерти, рекорд)</li>
                <li>• Прогресс по актам и концовкам</li>
              </ul>
            </div>

            <div className="text-[11px] text-amber-300/80 mb-4 italic">
              ⚠️ Действие необратимо! Прогресс нельзя будет восстановить.
            </div>

            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-600 text-slate-200 text-sm font-medium hover:bg-slate-700 transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={handleFirstConfirm}
                className="flex-1 px-4 py-2.5 rounded-lg bg-red-600/80 border border-red-400 text-white text-sm font-bold hover:bg-red-600 transition-colors"
              >
                Продолжить
              </button>
            </div>
          </>
        )}

        {/* Шаг 2 — финальное подтверждение */}
        {step === 2 && (
          <>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-red-600/30 border-2 border-red-500 flex items-center justify-center text-2xl shrink-0">
                🗑️
              </div>
              <div>
                <h3 className="text-base font-bold text-red-200">Вы точно уверены?</h3>
                <p className="text-[11px] text-slate-400">Шаг 2 из 2 — последний шанс</p>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              Нажимая «Удалить навсегда», вы подтвердите полное удаление сейва.
              После этого игра начнётся с нуля.
            </p>

            <div className="rounded-lg bg-red-950/40 border border-red-500/40 p-3 mb-4 text-center">
              <div className="text-xs text-red-300 font-mono uppercase tracking-wider mb-1">
                Внимание
              </div>
              <div className="text-sm text-red-100 font-bold">
                Прогресс будет потерян навсегда
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-600 text-slate-200 text-sm font-medium hover:bg-slate-700 transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={handleSecondConfirm}
                className="flex-1 px-4 py-2.5 rounded-lg bg-red-700 border border-red-400 text-white text-sm font-bold hover:bg-red-600 transition-colors active:scale-[0.98]"
                style={{ animation: 'pulse-red 1.5s ease-in-out infinite' }}
              >
                Удалить навсегда
              </button>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes alert-in {
          0% { opacity: 0; transform: scale(0.85) translateY(20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes pulse-red {
          0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
          50% { box-shadow: 0 0 0 8px rgba(239, 68, 68, 0); }
        }
      `}</style>
    </div>
  )
}
