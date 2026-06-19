'use client'

import { useEffect, useState, useRef } from 'react'

interface EchoRadarProps {
  active: boolean        // идёт ли сейчас импульс
  ambient: string        // тип окружения для оттенка
  hasMonster?: boolean   // есть ли угроза рядом
  hasOre?: boolean       // есть ли руда/предмет рядом (по эхо-подсказке)
}

export function EchoRadar({ active, ambient, hasMonster, hasOre }: EchoRadarProps) {
  const [waves, setWaves] = useState<number[]>([])
  const waveId = useRef(0)

  // Цвета по окружению (футуристичные, не киберпанк)
  const colors: Record<string, string> = {
    surface: '#7dd3fc',  // светло-голубой
    cave:   '#5eead4',   // бирюзовый
    water:  '#67e8f9',   // циан
    lava:   '#fbbf24',   // янтарный
    monster:'#f87171',   // красный
    diamond:'#a5f3fc',   // бледно-циан
    void:   '#475569'    // тёмный сланец
  }
  const color = colors[ambient] || colors.cave

  useEffect(() => {
    if (!active) return
    const id = waveId.current++
    setWaves(prev => [...prev, id])
    const t1 = setTimeout(() => {
      // волна начинает исчезать
      setWaves(prev => prev.filter(w => w !== id))
    }, 2200)
    return () => clearTimeout(t1)
  }, [active])

  return (
    <div className="relative w-full h-32 overflow-hidden rounded-lg bg-slate-950/60 border border-cyan-400/20">
      {/* Сетка — тонкие концентрические круги */}
      <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
        <circle cx="50" cy="50" r="15" stroke={color} strokeWidth="0.3" fill="none" />
        <circle cx="50" cy="50" r="30" stroke={color} strokeWidth="0.3" fill="none" />
        <circle cx="50" cy="50" r="45" stroke={color} strokeWidth="0.3" fill="none" />
        <line x1="0" y1="50" x2="100" y2="50" stroke={color} strokeWidth="0.2" />
        <line x1="50" y1="0" x2="50" y2="100" stroke={color} strokeWidth="0.2" />
      </svg>

      {/* Источник сигнала в центре — пульсирующая точка */}
      <div
        className="absolute left-1/2 top-1/2 w-2 h-2 -ml-1 -mt-1 rounded-full"
        style={{
          background: color,
          boxShadow: `0 0 8px ${color}, 0 0 16px ${color}`,
          animation: active ? 'echo-pulse 0.8s ease-out' : 'echo-idle 2s ease-in-out infinite'
        }}
      />

      {/* Расходящиеся волны */}
      {waves.map(id => (
        <div
          key={id}
          className="absolute left-1/2 top-1/2 rounded-full pointer-events-none"
          style={{
            width: 4,
            height: 4,
            marginLeft: -2,
            marginTop: -2,
            border: `1.5px solid ${color}`,
            boxShadow: `0 0 12px ${color}`,
            animation: 'echo-wave 2.2s ease-out forwards'
          }}
        />
      ))}

      {/* Маркеры опасности / ресурсов */}
      {hasMonster && active && (
        <div
          className="absolute text-red-400 font-bold text-lg"
          style={{
            left: '75%', top: '30%',
            animation: 'echo-marker 1s ease-out',
            textShadow: '0 0 8px #f87171'
          }}
        >!</div>
      )}
      {hasOre && active && (
        <div
          className="absolute text-amber-300 font-bold text-lg"
          style={{
            left: '30%', top: '70%',
            animation: 'echo-marker 1s ease-out',
            textShadow: '0 0 8px #fbbf24'
          }}
        >◆</div>
      )}

      {/* Подпись */}
      <div className="absolute bottom-1 left-2 text-[10px] uppercase tracking-widest text-cyan-200/50 font-mono">
        echo·sonar
      </div>

      <style jsx global>{`
        @keyframes echo-pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.8); opacity: 0.6; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes echo-idle {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes echo-wave {
          0% {
            width: 4px; height: 4px;
            margin-left: -2px; margin-top: -2px;
            opacity: 1;
          }
          100% {
            width: 240px; height: 240px;
            margin-left: -120px; margin-top: -120px;
            opacity: 0;
          }
        }
        @keyframes echo-marker {
          0% { opacity: 0; transform: scale(0.5); }
          30% { opacity: 1; transform: scale(1.2); }
          100% { opacity: 0.4; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}
