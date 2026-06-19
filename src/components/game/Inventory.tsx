'use client'

import type { Inventory, ResourceType, PickaxeTier, ArmorTier, SwordTier } from '@/lib/game/types'
import { PICKAXE_NAME, ARMOR_NAME, ARMOR_REDUCTION, SWORD_NAME, SWORD_DAMAGE } from '@/lib/game/types'

const SWORD_ORDER: SwordTier[] = ['netherite', 'diamond', 'iron', 'stone', 'wood']

const RESOURCE_INFO: Record<ResourceType, { icon: string; name: string; color: string }> = {
  wood:        { icon: '🪵', name: 'Дерево',         color: 'text-amber-200' },
  stone:       { icon: '🪨', name: 'Камень',         color: 'text-slate-300' },
  coal:        { icon: '⚫', name: 'Уголь',          color: 'text-slate-400' },
  copper:      { icon: '🟠', name: 'Медь',           color: 'text-orange-300' },
  iron:        { icon: '⚙️', name: 'Железо',         color: 'text-rose-300' },
  gold:        { icon: '🟡', name: 'Золото',         color: 'text-yellow-300' },
  diamond:     { icon: '💎', name: 'Алмаз',          color: 'text-cyan-200' },
  leather:     { icon: '🟤', name: 'Кожа',           color: 'text-amber-700' },
  meat:        { icon: '🍖', name: 'Мясо',           color: 'text-red-300' },
  torch:       { icon: '🔥', name: 'Факел',          color: 'text-orange-300' },
  campfire:    { icon: '🏕️', name: 'Костёр',         color: 'text-amber-300' },
  food:        { icon: '🍲', name: 'Еда',            color: 'text-emerald-300' },
  mushroom:    { icon: '🍄', name: 'Гриб',           color: 'text-emerald-300' },
  arrow:       { icon: '🏹', name: 'Стрелы',         color: 'text-yellow-200' },
  trial_key:   { icon: '🔑', name: 'Ключ испытаний', color: 'text-blue-300' },
  mace:        { icon: '🔱', name: 'Булава',         color: 'text-purple-300' },
  breeze_rod:  { icon: '🌀', name: 'Стержень ветра', color: 'text-sky-300' },
  vault_loot:  { icon: '💠', name: 'Сокровище',      color: 'text-blue-200' },
  obsidian:    { icon: '⬛', name: 'Обсидиан',       color: 'text-slate-200' },
  nether_star: { icon: '🌟', name: 'Звезда Нужера',  color: 'text-purple-200' },
  netherrack:  { icon: '🧱', name: 'Незерак',        color: 'text-red-400' },
  blaze_rod:   { icon: '🟡', name: 'Стержень ифрита', color: 'text-amber-400' },
  wither_skull:{ icon: '💀', name: 'Череп иссушителя', color: 'text-slate-300' },
  glowstone:   { icon: '💡', name: 'Светокамень',    color: 'text-yellow-200' },
  soul_sand:   { icon: '🟫', name: 'Песок душ',      color: 'text-slate-500' },
  end_stone:    { icon: '🟨', name: 'Эндерняк',      color: 'text-yellow-200' },
  chorus_fruit: { icon: '🍇', name: 'Плод хоруса',   color: 'text-purple-300' },
  purpur:       { icon: '🟪', name: 'Пурпур',        color: 'text-purple-400' },
  shulker_shell:{ icon: '🐚', name: 'Панцирь шалкера', color: 'text-purple-300' },
  elytra:       { icon: '🪽', name: 'Элитры',         color: 'text-cyan-300' },
  dragon_egg:   { icon: '🥚', name: 'Яйцо дракона',  color: 'text-purple-200' },
  ender_pearl:  { icon: '🟣', name: 'Жемчуг края',   color: 'text-purple-300' },
  netherite_ingot:{ icon: '🔲', name: 'Незерит',     color: 'text-slate-800' },
  sword_wood:   { icon: '🗡️', name: 'Дерев. меч',   color: 'text-amber-200' },
  sword_stone:  { icon: '🗡️', name: 'Каменный меч',  color: 'text-slate-300' },
  sword_iron:   { icon: '🗡️', name: 'Железный меч',  color: 'text-rose-300' },
  sword_diamond:{ icon: '🗡️', name: 'Алмазный меч',  color: 'text-cyan-200' },
  sword_netherite:{icon: '🗡️', name: 'Незерит. меч', color: 'text-slate-500' }
}

interface InventoryBarProps {
  inventory: Inventory
  pickaxeTier: PickaxeTier
  armor: ArmorTier
  onUseMushroom?: () => void
  onUseFood?: () => void
  onRest?: () => void
  canRest?: boolean
}

export function InventoryBar({ inventory, pickaxeTier, armor, onUseMushroom, onUseFood, onRest, canRest }: InventoryBarProps) {
  const items = Object.entries(inventory).filter(([, count]) => (count ?? 0) > 0) as [ResourceType, number][]

  // Определяем лучший меч из инвентаря
  let bestSword: SwordTier = 'none'
  for (const tier of SWORD_ORDER) {
    const resKey = `sword_${tier}` as ResourceType
    if ((inventory[resKey] ?? 0) > 0) {
      bestSword = tier
      break
    }
  }

  // Убираем мечи из списка ресурсов — они в снаряжении
  const swordKeys = new Set(['sword_wood', 'sword_stone', 'sword_iron', 'sword_diamond', 'sword_netherite'])
  const resourceItems = items.filter(([k]) => !swordKeys.has(k))

  return (
    <div className="space-y-1.5">
      {/* Снаряжение — кирка, броня, меч */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-900/60 border border-cyan-400/20 text-xs">
          <span>⛏️</span>
          <span className="text-cyan-200 font-mono">{PICKAXE_NAME[pickaxeTier]}</span>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-900/60 border border-cyan-400/20 text-xs">
          <span>🛡️</span>
          <span className="text-cyan-200 font-mono">{ARMOR_NAME[armor]}</span>
          {armor !== 'none' && (
            <span className="text-emerald-300/70 text-[10px]">-{Math.round(ARMOR_REDUCTION[armor] * 100)}%</span>
          )}
        </div>
        {bestSword !== 'none' && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-900/60 border border-cyan-400/20 text-xs">
            <span>🗡️</span>
            <span className="text-cyan-200 font-mono">{SWORD_NAME[bestSword]}</span>
            <span className="text-red-300/70 text-[10px]">{SWORD_DAMAGE[bestSword]} ур.</span>
          </div>
        )}
        {/* v2.2: кнопка отдыха */}
        {onRest && canRest && (
          <button
            onClick={onRest}
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-950/40 border border-emerald-400/40 text-xs text-emerald-200 hover:bg-emerald-900/40 hover:border-emerald-400/70 transition-all"
            title="Развести костёр и отдохнуть (+30 HP, нужно 2 дерева)"
          >
            <span>🏕️</span>
            <span>Отдых</span>
          </button>
        )}
      </div>

      {/* Ресурсы */}
      <div className="flex flex-wrap gap-1.5 items-center">
        {resourceItems.length === 0 && (
          <span className="text-xs text-cyan-200/40 italic">Сумка пуста</span>
        )}
        {resourceItems.map(([resource, count]) => {
          const info = RESOURCE_INFO[resource]
          const isUsableMushroom = resource === 'mushroom' && onUseMushroom && count > 0
          const isUsableFood = resource === 'food' && onUseFood && count > 0
          const isUsable = isUsableMushroom || isUsableFood
          return (
            <button
              key={resource}
              onClick={isUsable ? (isUsableMushroom ? onUseMushroom : onUseFood) : undefined}
              disabled={!isUsable}
              title={`${info.name}${isUsableMushroom ? ' — съесть (+35 HP)' : ''}${isUsableFood ? ' — съесть (+50 HP)' : ''}`}
              className={`flex items-center gap-1 px-2 py-1 rounded-md bg-slate-900/60 border border-cyan-400/20 text-xs ${info.color} ${isUsable ? 'hover:border-emerald-400/60 hover:bg-emerald-900/30 cursor-pointer' : 'cursor-default'}`}
            >
              <span>{info.icon}</span>
              <span className="font-mono">{count}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
