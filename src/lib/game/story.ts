import type { Scene } from './types'
import { END_SCENES } from './end_scenes'

// =====================================================
//  BlindCraft: Эхо Глубин (v2.4)
//  Act 1 + Act 2 + Village Hub + Story Reader
// =====================================================

// Метаданные веток для UI
export const BRANCH_META: Record<string, { label: string; icon: string; color: string }> = {
  prelude: { label: 'Act 0: Пролог',          icon: '🏠', color: 'text-green-300' },
  start:   { label: 'Act 1: Поверхность',     icon: '⛰️', color: 'text-cyan-300' },
  water:   { label: 'Act 1: Путь Воды',       icon: '💧', color: 'text-sky-300' },
  lava:    { label: 'Act 1: Путь Жара',       icon: '🔥', color: 'text-orange-300' },
  dark:    { label: 'Act 1: Путь Тишины',     icon: '🌑', color: 'text-purple-300' },
  gold:    { label: 'Act 1: Золотая камера',  icon: '🟡', color: 'text-amber-300' },
  diamond: { label: 'Act 1: Алмазы',          icon: '💎', color: 'text-cyan-200' },
  hunt:    { label: 'Act 1: Охотничья тропа', icon: '🏹', color: 'text-green-300' },
  surface2: { label: 'Act 2: Поверхность',    icon: '🌅', color: 'text-amber-300' },
  trials:  { label: 'Act 2: The Trials',      icon: '🔑', color: 'text-amber-200' },
  nether:  { label: 'Act 3: The Nether',      icon: '🌋', color: 'text-red-400' },
  end:     { label: 'Act 4: The End',         icon: '🌌', color: 'text-purple-300' },
  finale:  { label: 'Финал',                  icon: '⚖️', color: 'text-slate-300' }
}

export const SCENES: Record<string, Scene> = {
  // ============================================================
  //  ACT 0 · ПРОЛОГ (v4.1) — как мы строили дом и дошли до шахты
  // ============================================================
  prelude_wake: {
    id: 'prelude_wake',
    depth: 0,
    act: 'act0',
    branch: 'prelude',
    title: 'Act 0: Пробуждение',
    text: 'Ты просыпаешься. Не в шахте — в доме. Тёплый солнечный свет касается лица через окно. Птицы поют. Запах хлеба из печи.\n\nТы слепой. С самого рождения. Но ты знаешь свой дом — каждый угол, каждый порог. Дом, который ты построил сам, своими руками, из дерева и камня.\n\nДень начинается. Впереди — много дел. Но где-то в глубине души — зов. Далёкий, тихий, как звон кристаллов. Говорят, в горе за деревней — шахта. Старая, заброшенная. И в ней — алмазы.',
    ambient: 'surface',
    choices: [
      { text: '🛏️ Встать с кровати', next: 'prelude_house', duration: 2000, action: 'walk' }
    ]
  },

  prelude_house: {
    id: 'prelude_house',
    depth: 0,
    act: 'act0',
    branch: 'prelude',
    title: 'Act 0: Дом',
    text: 'Твой дом — небольшой, но крепкий. Деревянные стены, каменный фундамент, очаг в углу. Ты помнишь каждый день стройки: рубил деревья, таскал камни, клали стены.\n\nНа столе — завтрак. Хлеб, сыр, вода из колодца. У двери — корзина с инструментами: топор, верёвка, старая кирка отца.\n\nОтец. Он был рудокопом. Спускался в шахту каждый день. Не вернулся однажды. Мать говорила — нашёл что-то. Что-то, что затянуло его глубже. Алмазы, может быть. Или — что-то хуже.',
    ambient: 'surface',
    isHub: true,
    choices: [
      { text: '🍞 Позавтракать (+20 HP)', next: '@self', duration: 3000, action: 'observe', requires: { notFlag: 'prelude_breakfast' }, effects: { health: 20, flags: ['prelude_breakfast'] } },
      { text: '🪵 Нарубить дров (4с)', next: 'prelude_wood', duration: 4000, action: 'mine' },
      { text: '🪨 Добыть камень у дома (4с)', next: 'prelude_stone', duration: 4000, action: 'mine' },
      { text: '👨‍👩‍👦 Вспомнить отца', next: 'prelude_father', duration: 3000, action: 'observe' },
      { text: '🧭 Осмотреть окрестности', next: 'prelude_yard', duration: 3000, action: 'walk' },
      { text: '⛰️ Идти к горе (начать Act 1)', next: 'start', duration: 5000, action: 'walk' }
    ]
  },

  prelude_wood: {
    id: 'prelude_wood',
    depth: 0,
    act: 'act0',
    branch: 'prelude',
    title: 'Act 0: Лес',
    text: 'За домом — небольшой лес. Ты знаешь каждое дерево, каждый ручей. Топор в руках привычно. Три дерева — пять кусков дерева. Хватит для костра, для факелов, для крафта.\n\nТы рубишь, колешь, складываешь. Работа знакомая, успокаивающая. Но зов не стихает. Где-то в горе — шахта. И в ней — ответы.',
    ambient: 'surface',
    onEnter: { items: { wood: 5 }, flags: ['prelude_got_wood'] },
    choices: [
      { text: '← Вернуться к дому', next: 'prelude_house', duration: 2000, action: 'walk' }
    ]
  },

  prelude_stone: {
    id: 'prelude_stone',
    depth: 0,
    act: 'act0',
    branch: 'prelude',
    title: 'Act 0: Каменоломня',
    text: 'У дома — небольшой карьер. Ты добывал здесь камень для фундамента, для очага, для дорожки. Кирка отца — старая, деревянная, но привычная.\n\nПять кусков камня. Можно построить, можно крафтить. Но можно и взять с собой — в шахту. Если решишься.',
    ambient: 'surface',
    onEnter: { items: { stone: 5 }, flags: ['prelude_got_stone'] },
    choices: [
      { text: '← Вернуться к дому', next: 'prelude_house', duration: 2000, action: 'walk' }
    ]
  },

  prelude_father: {
    id: 'prelude_father',
    depth: 0,
    act: 'act0',
    branch: 'prelude',
    title: 'Act 0: Память отца',
    text: 'Отец. Ты помнишь его руки — шершавые, тёплые, сильные. Он учил тебя: «Слепой — не значит слабый. Слепой — значит, видишь иначе. Слышишь иначе. Чувствуешь иначе.»\n\nОн спускался в шахту каждый день. Приносил уголь, железо, иногда — золото. Говорил, что глубоко внизу — алмазы. Кристаллы, что поют. И что тот, кто их найдёт, услышит правду о мире.\n\nОднажды он не вернулся. Ты ждал. День, два, неделю. Потом — понял. Он нашёл что-то. Или что-то нашло его.\n\nТы берёшь его кирку. Деревянную, старую, но надёжную. Его наследство. Твой путь.',
    ambient: 'surface',
    onEnter: { flags: ['prelude_remembered_father'], items: { wood: 2 } },
    choices: [
      { text: '← Вернуться к дому', next: 'prelude_house', duration: 2000, action: 'walk' }
    ]
  },

  prelude_yard: {
    id: 'prelude_yard',
    depth: 0,
    act: 'act0',
    branch: 'prelude',
    title: 'Act 0: Двор',
    text: 'Ты выходишь во двор. Солнце на лице (ты чувствуешь тепло, хоть и не видишь). Ветер с гор — холодный, свежий. Огород, колодец, сарай.\n\nА за двором — гора. Большая, тёмная, молчаливая. В ней — вход в шахту. Старая, заброшенная. Другие рудокопы ушли — кто умер, кто испугался. Только ты остался.\n\nЗов сильнее. Алмазы. Правда отца. Путь.',
    ambient: 'surface',
    choices: [
      { text: '🧭 Идти к горе (начать Act 1)', next: 'start', duration: 5000, action: 'walk' },
      { text: '🚶 Пойти к соседу', next: 'prelude_neighbor', duration: 3000, action: 'walk' },
      { text: '💧 К колодцу', next: 'prelude_well', duration: 2000, action: 'walk' },
      { text: '🏠 Вернуться к дому', next: 'prelude_house', duration: 2000, action: 'walk' }
    ]
  },

  prelude_neighbor: {
    id: 'prelude_neighbor',
    depth: 0,
    act: 'act0',
    branch: 'prelude',
    title: 'Act 0: Сосед',
    text: 'Сосед — старый рудокоп, давно на пенсии. Слепой, как и ты. Но у него — слух, как у летучей мыши. Он слышит, что происходит в горе.\n\n— А, сосед. Заходи. Чай будешь? Слушай... гора опять гудит. Я слышу. Глубоко, глубоко. Что-то там просыпается. Или — кто-то.\n\nТвой отец... он тоже слышал. Перед тем как уйти. Сказал мне: «Если не вернусь — скажи сыну: шахта жива. Она зовёт. Но она и забирает.» Я не понял тогда. Теперь — понимаю.\n\nБудь осторожен. Гора — не просто камень. Она — живая.',
    ambient: 'surface',
    onEnter: { flags: ['met_neighbor'] },
    choices: [
      { text: '🍵 Попить чая (+10 HP)', next: '@self', duration: 3000, action: 'observe', requires: { notFlag: 'neighbor_tea' }, effects: { health: 10, flags: ['neighbor_tea'] } },
      { text: '← Вернуться к дому', next: 'prelude_house', duration: 3000, action: 'walk' }
    ]
  },

  prelude_well: {
    id: 'prelude_well',
    depth: 0,
    act: 'act0',
    branch: 'prelude',
    title: 'Act 0: Колодец',
    text: 'Колодец у дома — старый, каменный. Ты помнишь, как отец копал его. Три дня, три ночи. Говорил: «Вода — это жизнь. Без воды — никакой шахты.»\n\nВода чистая, холодная. Ты пьёшь. Силы возвращаются.\n\nА ещё — если прислушаться, опустив голову в колодец — слышно. Далёкий, едва уловимый звон. Как будто где-то глубоко, под водой, под камнем, под горой — поют кристаллы. Алмазы. Или — что-то другое.',
    ambient: 'surface',
    choices: [
      { text: '💧 Попить воды (+15 HP)', next: '@self', duration: 3000, action: 'observe', requires: { notFlag: 'prelude_well_drank' }, effects: { health: 15, flags: ['prelude_well_drank'] } },
      { text: '🔊 Прислушаться к звону', next: 'prelude_well_listen', duration: 5000, action: 'observe', requires: { notFlag: 'prelude_heard_bell' } },
      { text: '← Вернуться к дому', next: 'prelude_house', duration: 2000, action: 'walk' }
    ]
  },

  prelude_well_listen: {
    id: 'prelude_well_listen',
    depth: 0,
    act: 'act0',
    branch: 'prelude',
    title: 'Act 0: Звон',
    text: 'Ты наклоняешься над колодцем. Вода — далеко внизу. Ты слышишь её плеск. И — да. Звон. Тонкий, чистый, далёкий. Не водяной. Не каменный. Кристаллический.\n\nГолос отца — в памяти: «Слышишь? Это алмазы. Они поют. Если слышишь — значит, путь открыт. Иди.»\n\nТы поднимаешь голову. Звон стихает. Но ты запомнил. Путь открыт.',
    ambient: 'surface',
    onEnter: { flags: ['prelude_heard_bell'] },
    choices: [
      { text: '← Вернуться к колодцу', next: 'prelude_well', duration: 2000, action: 'walk' }
    ]
  },

  // ============================================================
  //  ЭТАЖ 0 · ПОВЕРХНОСТЬ (Act 1)
  // ============================================================
  start: {
    id: 'start',
    depth: 0,
    act: 'act1',
    branch: 'start',
    title: 'Поверхность',
    text: 'Холодный ветер обжигает щёки. Под ногами — хрустящий гравий. Тебя окружает тишина горного хребта, но где-то впереди, внизу, слышен далёкий гул.\n\nТы слеп. Ты всегда был слеп. Но слух и осязание приведут тебя туда, куда не доберётся ни один зрячий. Говорят, глубоко под этой горой спят алмазы — кристаллы, что поют свою песню в темноте.',
    ambient: 'surface',
    choices: [
      { text: 'Подойти к входу в шахту', next: 'cave_mouth', duration: 3500, action: 'walk' },
      { text: 'Прислушаться', next: 'start_listen', duration: 2000, action: 'observe', effects: { health: 2 } }
    ]
  },

  start_listen: {
    id: 'start_listen',
    depth: 0,
    branch: 'start',
    title: 'Поверхность',
    text: 'Ты замираешь. Ветер свистит в расщелинах. Где-то далеко внизу капает вода — ритмично, как метроном. Слышен шорох — мелкий зверёк пробежал по камням.\n\nИз провала впереди тянет затхлым воздухом и слабым запахом мха. Шахта ждёт.',
    ambient: 'surface',
    choices: [
      { text: 'Спуститься в шахту', next: 'cave_mouth', duration: 3500, action: 'walk' }
    ]
  },

  cave_mouth: {
    id: 'cave_mouth',
    depth: 0,
    branch: 'start',
    title: 'Вход в шахту',
    text: 'Ты делаешь первый шаг внутрь. Ветер стихает, эхо твоих шагов становится гулче. Под ногами — гладкий камень, отполированный тысячами шагов тех, кто ходил здесь до тебя.\n\nВоздух становится плотнее, прохладнее. Запах мха усиливается.',
    ambient: 'cave',
    onEnter: { flags: ['entered_cave'] },
    choices: [
      { text: 'Спускаться дальше', next: 'entry_tunnel', duration: 3500, action: 'walk' }
    ]
  },

  // ============================================================
  //  ЭТАЖ 1 · ВЕРХНИЙ ТУННЕЛЬ (дерево/уголь/медь)
  // ============================================================
  entry_tunnel: {
    id: 'entry_tunnel',
    depth: 1,
    branch: 'start',
    title: 'Верхний туннель',
    text: 'Ты идёшь вниз. Под пальцами — шершавые стены, иногда попадаются старые деревянные балки. Они почти сгнили, но ещё держат породу.\n\nГде-то впереди ритмично капает вода. Тишина такая плотная, что слышно, как бьётся твоё сердце.',
    ambient: 'cave',
    choices: [
      { text: 'Подобрать деревяшки', next: 'take_wood', duration: 3000, action: 'mine', requires: { notFlag: 'got_wood' } },
      { text: 'Идти к звуку воды', next: 'drip_room', duration: 3000, action: 'walk' }
    ]
  },

  take_wood: {
    id: 'take_wood',
    depth: 1,
    branch: 'start',
    title: 'Верхний туннель',
    text: 'Ты нащупываешь сухие деревянные балки. Две из них крепкие, третья — обломок. Скоро пригодятся — из них можно сделать кирку или факел, если найдёшь чем поджечь.\n\nВ карманах всегда был трут. Главное — топливо.',
    ambient: 'cave',
    onEnter: { items: { wood: 5 }, flags: ['got_wood'] },
    choices: [
      { text: 'Сделать деревянную кирку (3 дерева)', next: 'craft_wood_pickaxe', duration: 5000, action: 'craft', requires: { items: { wood: 3 }, maxPickaxe: 'wood' }, effects: { items: { wood: -3 }, pickaxeTier: 'wood', flags: ['got_wood_pickaxe'] } },
      { text: 'Идти к звуку воды', next: 'drip_room', duration: 3000, action: 'walk' }
    ]
  },

  craft_wood_pickaxe: {
    id: 'craft_wood_pickaxe',
    depth: 1,
    branch: 'start',
    title: 'Верхний туннель',
    text: 'Ты садишься на камень и работаешь. Обтёсываешь деревяшки, связываешь их крепко, как учил дед. Через несколько минут в твоих руках — деревянная кирка. Хрупкая, но для начала сойдёт.\n\nТеперь можно добыть уголь и медь. А может, и камень.',
    ambient: 'cave',
    choices: [
      { text: 'Идти к звуку воды', next: 'drip_room', duration: 3000, action: 'walk' }
    ]
  },

  drip_room: {
    id: 'drip_room',
    depth: 1,
    branch: 'start',
    title: 'Капельная комната',
    text: 'Капель становится громче. Ты входишь в небольшую камеру. С потолка падают тяжёлые холодные капли.\n\nУ дальней стены слышен скрежет — это уголь. А слева, где стена холоднее и шершавее — зеленоватые вкрапления. Это медь. Старые рудокопы говорили: медь — первое, что учит жить под землёй. Из неё куют крепкую кирку и лёгкую броню.\n\nСправа из узкой расщелины тянет звериным духом — там, кажется, живут дикие твари. Без факела соваться опасно.',
    ambient: 'cave',
    choices: [
      { text: 'Добыть уголь (8с, нужна кирка)', next: 'mine_coal', duration: 8000, action: 'mine', requires: { notFlag: 'got_coal', minPickaxe: 'wood' } },
      { text: 'Добыть медь (8с, нужна кирка)', next: 'mine_copper', duration: 8000, action: 'mine', requires: { notFlag: 'got_copper', minPickaxe: 'wood' } },
      { text: 'Сделать факел (1 дерево + 1 уголь)', next: 'craft_torch', duration: 5000, action: 'craft', requires: { items: { wood: 1, coal: 1 }, notFlag: 'has_torch' }, effects: { items: { wood: -1, coal: -1, torch: 1 }, flags: ['has_torch'] } },
      { text: '🏹 Войти в Охотничью тропу (нужен факел)', next: 'hunt_entry', duration: 4000, action: 'walk', requires: { item: 'torch' } },
      { text: 'Спускаться глубже к развилке', next: 'crossroads', duration: 4000, action: 'walk' }
    ]
  },

  mine_coal: {
    id: 'mine_coal',
    depth: 1,
    branch: 'start',
    title: 'Капельная комната',
    text: 'Ты бьёшь киркой по тёмной жиле. Уголь крошится, пачкает руки чёрной пылью, но послушно вынимается. Через несколько минут у тебя пригоршня угля.\n\nТеперь можно сделать факел — если есть дерево.',
    ambient: 'cave',
    onEnter: { items: { coal: 3 }, flags: ['got_coal'] },
    choices: [
      { text: 'Добыть медь (если ещё не брал)', next: 'mine_copper', duration: 8000, action: 'mine', requires: { notFlag: 'got_copper', minPickaxe: 'wood' } },
      { text: 'Сделать факел', next: 'craft_torch', duration: 5000, action: 'craft', requires: { items: { wood: 1, coal: 1 }, notFlag: 'has_torch' }, effects: { items: { wood: -1, coal: -1, torch: 1 }, flags: ['has_torch'] } },
      { text: 'Спускаться к развилке', next: 'crossroads', duration: 4000, action: 'walk' }
    ]
  },

  mine_copper: {
    id: 'mine_copper',
    depth: 1,
    branch: 'start',
    title: 'Капельная комната',
    text: 'Ты нащупываешь зеленоватые прожилки в стене. Медь. Кирка берётся за работу — звонко, упруго. Кусок за куском: три хороших куска руды.\n\nИз меди можно сделать крепкую кирку (лучше деревянной) или броню. Но для ковки нужна кузница. Спустись к торговцам — они помогут.',
    ambient: 'cave',
    onEnter: { items: { copper: 3 }, flags: ['got_copper'] },
    choices: [
      { text: 'Добыть уголь (если ещё не брал)', next: 'mine_coal', duration: 8000, action: 'mine', requires: { notFlag: 'got_coal', minPickaxe: 'wood' } },
      { text: 'Сделать факел', next: 'craft_torch', duration: 5000, action: 'craft', requires: { items: { wood: 1, coal: 1 }, notFlag: 'has_torch' }, effects: { items: { wood: -1, coal: -1, torch: 1 }, flags: ['has_torch'] } },
      { text: 'Спускаться к развилке', next: 'crossroads', duration: 4000, action: 'walk' }
    ]
  },

  craft_torch: {
    id: 'craft_torch',
    depth: 1,
    branch: 'start',
    title: 'Капельная комната',
    text: 'Ты обматываешь деревяшку тряпкой, делаешь лунку в угле, подсовываешь трут. Удар кремнем... ещё раз... искра!\n\nЧерез минуту факел разгорается. Тепло касается лица. Огонь отпугивает тварей и подсвечивает то, что ты не можешь увидеть глазами.',
    ambient: 'cave',
    choices: [
      { text: 'Спускаться к развилке', next: 'crossroads', duration: 4000, action: 'walk' }
    ]
  },

  // ============================================================
  //  ЭТАЖ 2 · РАЗВИЛКА (хаб)
  // ============================================================
  crossroads: {
    id: 'crossroads',
    depth: 2,
    branch: 'start',
    title: 'Развилка трёх путей',
    text: 'Туннель расширяется. Ты останавливаешься, вслушиваясь.\n\nСлева — влажный, холодный ток воздуха. Запах воды и ржавчины.\nПрямо — горячее дыхание, запах серы. Где-то глубоко потрескивает камень.\nСправа — ничто. Абсолютная, давящая тишина.\n\nУ стены слышно лёгкое покашливание. Кто-то сидит здесь, в темноте. Старик? Житель?',
    ambient: 'cave',
    isHub: true,
    choices: [
      { text: 'Путь Воды (налево)', next: 'water_entry', duration: 4000, action: 'walk' },
      { text: 'Путь Жара (прямо)', next: 'lava_entry', duration: 4000, action: 'walk' },
      { text: 'Путь Тишины (направо)', next: 'dark_entry', duration: 4000, action: 'walk' },
      { text: 'Подойти к старику', next: 'meet_old_miner', duration: 2500, action: 'walk' }
    ]
  },

  meet_old_miner: {
    id: 'meet_old_miner',
    depth: 2,
    branch: 'start',
    title: 'Старый рудокоп',
    text: 'Старик сидит у стены, обмотанный тряпьём. Он тоже слеп — как и ты, как все, кто решился спуститься сюда. У его ног — небольшая стойка с товарами.\n\n— Здравствуй, проходящий. Я тут сижу давно. Меняю, что у меня есть, на то, что у тебя. Не торопись — выбор за тобой.\n\nДоступные обмены:',
    ambient: 'cave',
    isHub: true,
    choices: [
      { text: '🤝 5 дерева → 1 факел', next: '@self', duration: 4000, action: 'trade', requires: { items: { wood: 5 } }, effects: { items: { wood: -5, torch: 1 } } },
      { text: '🤝 3 дерева + 2 камня → Деревянная кирка', next: '@self', duration: 5000, action: 'trade', requires: { items: { wood: 3, stone: 2 }, maxPickaxe: 'wood' }, effects: { items: { wood: -3, stone: -2 }, pickaxeTier: 'wood', flags: ['got_wood_pickaxe'] } },
      { text: '🤝 3 угля → 1 гриб (лечение)', next: '@self', duration: 4000, action: 'trade', requires: { items: { coal: 3 } }, effects: { items: { coal: -3, mushroom: 1 } } },
      { text: '🤝 5 меди → 1 кожа', next: '@self', duration: 4000, action: 'trade', requires: { items: { copper: 5 } }, effects: { items: { copper: -5, leather: 1 } } },
      { text: '🤝 3 кожи → Кожаная броня', next: '@self', duration: 5000, action: 'trade', requires: { items: { leather: 3 } }, effects: { items: { leather: -3 }, armor: 'leather', flags: ['has_leather_armor'] } },
      { text: '← Вернуться к развилке', next: 'crossroads', duration: 2000, action: 'walk' }
    ]
  },

  // ============================================================
  //  ЭТАЖ 3 · ПУТЬ ВОДЫ
  // ============================================================
  water_entry: {
    id: 'water_entry',
    depth: 3,
    branch: 'water',
    title: 'Путь Воды',
    text: 'Сырой воздух обволакивает. Под ногами — скользкий мокрый камень. Ты идёшь медленно, нащупывая стену. Звук твоих шагов становится глуше — где-то близко вода.\n\nЧерез двадцать шагов эхо твоего дыхания возвращается с задержкой — впереди большая пустота.',
    ambient: 'water',
    onEnter: { flags: ['chose_water'] },
    choices: [
      { text: 'Переходить вброд', next: 'water_wade', duration: 5000, action: 'walk' },
      { text: 'Искать обход', next: 'water_detour', duration: 4000, action: 'walk' },
      { text: '← Вернуться к развилке', next: 'crossroads', duration: 4500, action: 'walk' }
    ]
  },

  water_wade: {
    id: 'water_wade',
    depth: 3,
    branch: 'water',
    title: 'Водоём',
    text: 'Ты входишь в воду. Ледяная, до колен, потом до бёдер. Ноги немеют. Дно илистое, но устойчивое. Ты двигаешься медленно, прощупывая каждый шаг.\n\nНа середине ты спотыкаешься обо что-то твёрдое — это кусок руды, выступающий из дна. Холод пробирает до костей, но ты добираешься до другого берега.',
    ambient: 'water',
    onEnter: { health: -18, flags: ['waded_water'] },
    choices: [
      { text: 'Добыть железо (нужна медная+ кирка)', next: 'water_iron', duration: 9000, action: 'mine', requires: { notFlag: 'got_iron', minPickaxe: 'copper' } },
      { text: '💧 Найти колодец здоровья', next: 'water_well', duration: 3000, action: 'walk', requires: { notFlag: 'drank_well' } },
      { text: 'Подойти к отшельнику', next: 'water_meet_hermit', duration: 3000, action: 'walk' },
      { text: 'Идти дальше в туннель', next: 'water_tunnel', duration: 4000, action: 'walk' }
    ]
  },

  water_detour: {
    id: 'water_detour',
    depth: 3,
    branch: 'water',
    title: 'Обходной путь',
    text: 'Ты идёшь вдоль стены, ища обход. Туннель делает поворот, потом ещё один. Воздух становится суше — ты нашёл сухой проход за водоёмом.\n\nНо обход занял время, и в темноте что-то изменилось. Слишком тихо. Слишком пусто.',
    ambient: 'water',
    onEnter: { health: -6, flags: ['something_follows'] },
    choices: [
      { text: 'Подойти к отшельнику', next: 'water_meet_hermit', duration: 3000, action: 'walk' },
      { text: 'Идти дальше в туннель', next: 'water_tunnel', duration: 4000, action: 'walk' },
      { text: '← Вернуться к развилке', next: 'crossroads', duration: 4500, action: 'walk' }
    ]
  },

  water_iron: {
    id: 'water_iron',
    depth: 3,
    branch: 'water',
    title: 'Водоём — жила',
    text: 'Ты опускаешь кирку под воду. Холод бьёт по рукам, но ты работаешь методично. Кусок за куском — жёсткая холодная руда. Через несколько минут у тебя три хороших куска железа.\n\nИз них можно выковать кирку получше или крепкую броню. Но для этого нужна кузница.',
    ambient: 'water',
    onEnter: { items: { iron: 3 }, health: -6, flags: ['got_iron'] },
    choices: [
      { text: 'Подойти к отшельнику', next: 'water_meet_hermit', duration: 3000, action: 'walk' },
      { text: 'Идти дальше в туннель', next: 'water_tunnel', duration: 4000, action: 'walk' }
    ]
  },

  water_meet_hermit: {
    id: 'water_meet_hermit',
    depth: 3,
    branch: 'water',
    title: 'Пещерный отшельник',
    text: 'У сухого выступа сидит сгорбленная фигура. Старая женщина в мокрых тряпках, перед ней — небольшой ассортимент товаров, аккуратно разложенных на камне.\n\n— А, ещё один слепой. Хорошо. У меня есть то, что тебе нужно. Особенно если ты принёс железо — у меня есть на что его поменять.\n\nДоступные обмены:',
    ambient: 'water',
    isHub: true,
    choices: [
      { text: '🤝 5 железа → Железная броня', next: '@self', duration: 5000, action: 'trade', requires: { items: { iron: 5 } }, effects: { items: { iron: -5 }, armor: 'iron', flags: ['has_iron_armor'] } },
      { text: '🤝 3 дерева + 2 железа → Железная кирка', next: '@self', duration: 5000, action: 'trade', requires: { items: { wood: 3, iron: 2 }, maxPickaxe: 'iron' }, effects: { items: { wood: -3, iron: -2 }, pickaxeTier: 'iron', flags: ['got_iron_pickaxe'] } },
      { text: '🤝 5 меди → 1 гриб', next: '@self', duration: 4000, action: 'trade', requires: { items: { copper: 5 } }, effects: { items: { copper: -5, mushroom: 1 } } },
      { text: '🤝 2 гриба → 1 факел', next: '@self', duration: 4000, action: 'trade', requires: { items: { mushroom: 2 } }, effects: { items: { mushroom: -2, torch: 1 } } },
      { text: '🤝 3 золота → 1 кожа', next: '@self', duration: 4000, action: 'trade', requires: { items: { gold: 3 } }, effects: { items: { gold: -3, leather: 1 } } },
      { text: '← Идти в туннель', next: 'water_tunnel', duration: 4000, action: 'walk' },
      { text: '← Вернуться к развилке', next: 'crossroads', duration: 4500, action: 'walk' }
    ]
  },

  water_tunnel: {
    id: 'water_tunnel',
    depth: 4,
    branch: 'water',
    title: 'Сухой туннель',
    text: 'Ты выбираешься в сухой туннель. Здесь теплее. Стены покрыты тонкой коркой соли — они шуршат под пальцами, как наждачка.\n\nВпереди — новый звук: глухой, плотный отзвук. Это золото. Его всегда можно узнать по тяжёлому, бархатному отклику на удар.',
    ambient: 'water',
    choices: [
      { text: 'Войти в золотую камеру', next: 'gold_hall', duration: 4500, action: 'walk' },
      { text: '← Вернуться к развилке', next: 'crossroads', duration: 5000, action: 'walk' }
    ]
  },

  // ============================================================
  //  ЭТАЖ 3 · ПУТЬ ЖАРА
  // ============================================================
  lava_entry: {
    id: 'lava_entry',
    depth: 3,
    branch: 'lava',
    title: 'Путь Жара',
    text: 'Жар волнами накрывает лицо. Запах серы — резкий, едкий. Под ногами камень тёплый, кое-где горячий.\n\nГде-то впереди — низкий гул, как от кипящего котла. И треск — то ли раскалывающегося камня, то ли чего-то ещё.',
    ambient: 'lava',
    onEnter: { flags: ['chose_lava'] },
    choices: [
      { text: 'Перейти по каменному мосту', next: 'lava_bridge', duration: 5000, action: 'walk' },
      { text: 'Искать другой путь', next: 'lava_climb', duration: 4000, action: 'walk' },
      { text: '← Вернуться к развилке', next: 'crossroads', duration: 4500, action: 'walk' }
    ]
  },

  lava_bridge: {
    id: 'lava_bridge',
    depth: 3,
    branch: 'lava',
    title: 'Каменный мост',
    text: 'Ты ступаешь на мост. Он узкий — ступни помещаются едва-едва. Справа и слева — оранжевое зарево. Жар такой, что кожа стягивается.\n\nТы идёшь медленно, прощупывая каждый шаг. На середине мост качается — камень под ногами подрагивает. Но ты не останавливаешься. Остановка здесь — смерть.',
    ambient: 'lava',
    onEnter: { health: -12, flags: ['crossed_bridge'] },
    choices: [
      { text: 'Добыть железо (медная+ кирка)', next: 'lava_iron', duration: 9000, action: 'mine', requires: { notFlag: 'got_iron', minPickaxe: 'copper' } },
      { text: 'Подойти к кузнецу', next: 'lava_meet_smith', duration: 3000, action: 'walk' },
      { text: 'Идти в туннель', next: 'lava_tunnel', duration: 4000, action: 'walk' }
    ]
  },

  lava_climb: {
    id: 'lava_climb',
    depth: 3,
    branch: 'lava',
    title: 'Обход по стене',
    text: 'Ты ищешь обход. Стена туннеля идёт вверх, и ты карабкаешься по горячему камню. Пальцы скользят по поту, но ты цепляешься за выступы.\n\nЧерез десять минут ты на другой стороне. Жар менее intense, но ты потратил много сил. Голова кружится от обезвоживания.',
    ambient: 'lava',
    onEnter: { health: -22, flags: ['climbed_lava'] },
    choices: [
      { text: 'Сорвать светящийся гриб', next: 'lava_mushroom', duration: 3000, action: 'mine', requires: { notFlag: 'got_mushroom' } },
      { text: 'Подойти к кузнецу', next: 'lava_meet_smith', duration: 3000, action: 'walk' },
      { text: 'Идти в туннель', next: 'lava_tunnel', duration: 4000, action: 'walk' }
    ]
  },

  lava_mushroom: {
    id: 'lava_mushroom',
    depth: 3,
    branch: 'lava',
    title: 'Светящийся гриб',
    text: 'Ты нащупываешь гриб. Он тёплый, мягкий, слегка светится. Такие грибы восстанавливают силы и залечивают раны.\n\nТы аккуратно срываешь его и кладёшь в сумку. Пригодится, когда станет совсем плохо.',
    ambient: 'lava',
    onEnter: { items: { mushroom: 1 }, flags: ['got_mushroom'] },
    choices: [
      { text: 'Подойти к кузнецу', next: 'lava_meet_smith', duration: 3000, action: 'walk' },
      { text: 'Идти в туннель', next: 'lava_tunnel', duration: 4000, action: 'walk' }
    ]
  },

  lava_iron: {
    id: 'lava_iron',
    depth: 3,
    branch: 'lava',
    title: 'Железная жила',
    text: 'Ты бьёшь киркой по тёплому камню. Он поддаётся легко — жар сделал его хрупким. Куски железной руды отлетают один за другим. Через пару минут у тебя три хороших куска.',
    ambient: 'lava',
    onEnter: { items: { iron: 3 }, health: -6, flags: ['got_iron'] },
    choices: [
      { text: 'Подойти к кузнецу', next: 'lava_meet_smith', duration: 3000, action: 'walk' },
      { text: 'Идти в туннель', next: 'lava_tunnel', duration: 4000, action: 'walk' }
    ]
  },

  lava_meet_smith: {
    id: 'lava_meet_smith',
    depth: 3,
    branch: 'lava',
    title: 'Кузнец лавы',
    text: 'У расщелины с лавой стоит крупный мужчина. Голый по пояс, кожа обожжена, но он не жалуется. Перед ним — наковальня и молот. Это кузнец.\n\n— А, медь принёс? Хорошо. Медь — первый металл. Деревянная кирка ломается, медная — служит. И броню из меди я кую. Подходит тебе?\n\nДоступные обмены:',
    ambient: 'lava',
    isHub: true,
    choices: [
      { text: '🤝 3 дерева + 2 меди → Медная кирка', next: '@self', duration: 5000, action: 'trade', requires: { items: { wood: 3, copper: 2 }, maxPickaxe: 'copper' }, effects: { items: { wood: -3, copper: -2 }, pickaxeTier: 'copper', flags: ['got_copper_pickaxe'] } },
      { text: '🤝 5 меди → Медная броня', next: '@self', duration: 5000, action: 'trade', requires: { items: { copper: 5 } }, effects: { items: { copper: -5 }, armor: 'copper', flags: ['has_copper_armor'] } },
      { text: '🤝 5 железа → Железная броня', next: '@self', duration: 5000, action: 'trade', requires: { items: { iron: 5 } }, effects: { items: { iron: -5 }, armor: 'iron', flags: ['has_iron_armor'] } },
      { text: '🤝 2 гриба → 1 факел', next: '@self', duration: 4000, action: 'trade', requires: { items: { mushroom: 2 } }, effects: { items: { mushroom: -2, torch: 1 } } },
      { text: '🤝 3 камня → 1 гриб', next: '@self', duration: 4000, action: 'trade', requires: { items: { stone: 3 } }, effects: { items: { stone: -3, mushroom: 1 } } },
      { text: '← Идти в туннель', next: 'lava_tunnel', duration: 4000, action: 'walk' },
      { text: '← Вернуться к развилке', next: 'crossroads', duration: 5000, action: 'walk' }
    ]
  },

  lava_tunnel: {
    id: 'lava_tunnel',
    depth: 4,
    branch: 'lava',
    title: 'За лавой',
    text: 'Жар стихает. Ты входишь в туннель, где воздух снова становится прохладным. Переход резкий — тело покрывается мурашками от контраста.\n\nВпереди — новый звук: глухой, плотный отзвук. Это золото.',
    ambient: 'lava',
    choices: [
      { text: 'Войти в золотую камеру', next: 'gold_hall', duration: 4500, action: 'walk' },
      { text: '← Вернуться к развилке', next: 'crossroads', duration: 5000, action: 'walk' }
    ]
  },

  // ============================================================
  //  ЭТАЖ 3 · ПУТЬ ТИШИНЫ
  // ============================================================
  dark_entry: {
    id: 'dark_entry',
    depth: 3,
    branch: 'dark',
    title: 'Путь Тишины',
    text: 'Ты входишь в туннель, и звук исчезает. Совсем. Твои шаги не отзываются эхом. Дыхание глушится, как ватой. Это давит.\n\nВ этой тишине ты начинаешь слышать то, чего нет: шёпот, шорохи, скрежет. Или они есть на самом деле?',
    ambient: 'monster',
    onEnter: { flags: ['chose_dark'] },
    choices: [
      { text: 'Идти медленно и тихо', next: 'dark_creep', duration: 5000, action: 'walk' },
      { text: 'Зажечь факел', next: 'dark_torch', duration: 3000, action: 'observe', requires: { items: { torch: 1 }, notFlag: 'torch_used_dark' }, effects: { items: { torch: -1 }, flags: ['torch_used_dark'] } },
      { text: 'Крикнуть, чтобы проверить', next: 'dark_shout', duration: 4000, action: 'combat' },
      { text: '← Вернуться к развилке', next: 'crossroads', duration: 4500, action: 'walk', requires: { notFlag: 'monster_awake', notFlag: 'monster_chasing' } }
    ]
  },

  dark_torch: {
    id: 'dark_torch',
    depth: 3,
    branch: 'dark',
    title: 'Свет во тьме',
    text: 'Ты поджигаешь факел. Жаркое дыхание огня разгоняет мрак — ты чувствуешь это по теплу на лице. И тогда ты слышишь...\n\nШорох. Ускоряющийся. Что-то большое бросается прочь от света, вглубь туннеля. Тварь не любит огонь.\n\nТы поднимаешь факел выше и идёшь вперёд. Стены здесь покрыты странными наростами. И в стенах — жила железа.',
    ambient: 'cave',
    choices: [
      { text: 'Добыть железо (медная+ кирка)', next: 'dark_iron', duration: 9000, action: 'mine', requires: { notFlag: 'got_iron', minPickaxe: 'copper' } },
      { text: 'Снять шкуру с убитой твари', next: 'dark_leather', duration: 6000, action: 'mine', requires: { notFlag: 'got_leather_monster' } },
      { text: 'Идти в туннель', next: 'dark_tunnel', duration: 4000, action: 'walk' }
    ]
  },

  dark_leather: {
    id: 'dark_leather',
    depth: 3,
    branch: 'dark',
    title: 'Шкура твари',
    text: 'Ты находишь убитую светом тварь. Она мелкая, но шкура — толстая, прочная. Ты аккуратно срезаешь её камнем.\n\nЭто кожа. Из неё можно сделать крепкую броню — если найти, кто сошьёт.',
    ambient: 'cave',
    onEnter: { items: { leather: 3 }, flags: ['got_leather_monster', 'got_leather'] },
    choices: [
      { text: 'Добыть железо (медная+ кирка)', next: 'dark_iron', duration: 9000, action: 'mine', requires: { notFlag: 'got_iron', minPickaxe: 'copper' } },
      { text: 'Идти в туннель', next: 'dark_tunnel', duration: 4000, action: 'walk' }
    ]
  },

  dark_creep: {
    id: 'dark_creep',
    depth: 3,
    branch: 'dark',
    title: 'Крадучись',
    text: 'Ты идёшь медленно, ставя ногу за ногой. Каждый шаг — минута раздумий. Тишина такая, что ты слышишь, как стучит кровь в висках.\n\nГде-то рядом — мерный, низкий звук. Не дыхание. Скорее вибрация. Что-то очень большое ждёт.\n\nТы замираешь. И тогда слышишь: тяжёлый, утробный рык. Тварь проснулась.',
    ambient: 'monster',
    onEnter: { flags: ['monster_awake'] },
    choices: [
      { text: 'Замереть и не дышать', next: 'dark_freeze', duration: 5000, action: 'combat' },
      { text: 'Бежать назад', next: 'dark_flee', duration: 5000, action: 'combat' },
      { text: 'Зажечь факел', next: 'dark_torch_late', duration: 4000, action: 'combat', requires: { items: { torch: 1 } }, effects: { items: { torch: -1 } } }
    ]
  },

  dark_shout: {
    id: 'dark_shout',
    depth: 3,
    branch: 'dark',
    title: 'Крик во тьме',
    text: 'Ты кричишь. Голос уходит в темноту и не возвращается. Но в ответ — через секунду, через две — раздаётся рык. Не эхо. Ответ.\n\nТяжёлый, утробный звук приближается. Топот. Что-то большое несётся к тебе, и у тебя есть считанные секунды.',
    ambient: 'monster',
    onEnter: { flags: ['monster_chasing'] },
    choices: [
      { text: 'Прыгнуть в расщелину', next: 'dark_dodge', duration: 5000, action: 'combat' },
      { text: 'Зажечь факел', next: 'dark_torch_late', duration: 4000, action: 'combat', requires: { items: { torch: 1 } }, effects: { items: { torch: -1 } } }
    ]
  },

  dark_torch_late: {
    id: 'dark_torch_late',
    depth: 3,
    branch: 'dark',
    title: 'Огонь в последний момент',
    text: 'Ты чиркаешь кремнем. Искра, вторая — зелье вспыхивает. Жар факела бьёт в лицо, и в этот момент тварь бросается.\n\nОна врезается в стену огня и с воем откатывается. Ты слышишь, как она мечется, потом с воем уносится вглубь туннеля.\n\nТы выжил. Но чуть-чуть. На полу остался кусок её шкуры.',
    ambient: 'cave',
    onEnter: { health: -12, items: { leather: 2 }, flags: ['survived_monster', 'got_leather', 'got_leather_monster'] },
    choices: [
      { text: 'Добыть железо (медная+ кирка)', next: 'dark_iron', duration: 9000, action: 'mine', requires: { notFlag: 'got_iron', minPickaxe: 'copper' } },
      { text: 'Идти в туннель', next: 'dark_tunnel', duration: 4000, action: 'walk' }
    ]
  },

  dark_freeze: {
    id: 'dark_freeze',
    depth: 3,
    branch: 'dark',
    title: 'Замри',
    text: 'Ты замираешь. Не дышишь. Сердце колотится так громко, что, кажется, тварь должна его слышать.\n\nРык приближается. Топот. Тварь проходит мимо тебя — ты чувствуешь её тепло, запах гнилого мяса. Она останавливается. Принюхивается.\n\nСекунда. Две. Десять. Тварь фыркает и уходит в сторону. Ты выжил.',
    ambient: 'monster',
    onEnter: { health: -6, flags: ['evaded_monster'] },
    choices: [
      { text: 'Пробраться в туннель', next: 'dark_tunnel', duration: 4500, action: 'walk' },
      { text: '← Вернуться к развилке', next: 'crossroads', duration: 5000, action: 'walk' }
    ]
  },

  dark_dodge: {
    id: 'dark_dodge',
    depth: 3,
    branch: 'dark',
    title: 'В расщелину',
    text: 'Ты прыгаешь вправо, в узкую расщелину. Тварь проносится мимо — ты чувствуешь ветер от её движения. Она врезается в стену туннеля, рычит, разворачивается.\n\nНо в расщелину она не полезет — слишком узко. Ты прижат к стене, но в безопасности. Тварь некоторое время ещё рычит, потом уходит вглубь туннеля.',
    ambient: 'cave',
    onEnter: { health: -10, flags: ['evaded_monster'] },
    choices: [
      { text: 'Добыть железо (медная+ кирка)', next: 'dark_iron', duration: 9000, action: 'mine', requires: { notFlag: 'got_iron', minPickaxe: 'copper' } },
      { text: 'Выходить в туннель', next: 'dark_tunnel', duration: 4000, action: 'walk' }
    ]
  },

  dark_flee: {
    id: 'dark_flee',
    depth: 3,
    branch: 'dark',
    title: 'Бежать',
    text: 'Ты бросаешься назад. Топот за спиной нарастает. Ты спотыкаешься, падаешь, вскакиваешь. Тварь дышит в затылок.\n\nТы чувствуешь, как когти рвут рубаху на спине. Ещё рывок — и кусок мяса. Но тут впереди — просвет, поворот, и ты ныряешь за него. Тварь, разогнавшись, не успевает повернуть и проносится мимо.\n\nТы выжил. Но получил рану.',
    ambient: 'cave',
    onEnter: { health: -28, flags: ['evaded_monster', 'wounded'] },
    choices: [
      { text: 'Добыть железо (медная+ кирка)', next: 'dark_iron', duration: 9000, action: 'mine', requires: { notFlag: 'got_iron', minPickaxe: 'copper' } },
      { text: 'Выходить в туннель', next: 'dark_tunnel', duration: 4000, action: 'walk' }
    ]
  },

  dark_iron: {
    id: 'dark_iron',
    depth: 3,
    branch: 'dark',
    title: 'Железная жила',
    text: 'Ты бьёшь киркой. Камень здесь плотный, холодный. Но кирка берёт своё. Кусок за куском — три хороших куска руды.',
    ambient: 'cave',
    onEnter: { items: { iron: 3 }, flags: ['got_iron'] },
    choices: [
      { text: 'Выходить в туннель', next: 'dark_tunnel', duration: 4000, action: 'walk' }
    ]
  },

  dark_tunnel: {
    id: 'dark_tunnel',
    depth: 4,
    branch: 'dark',
    title: 'За тьмой',
    text: 'Ты выходишь в более широкий туннель. Воздух здесь теплее, суше. Эхо снова работает — ты слышишь нормальный отзвук своих шагов.\n\nВпереди — новый звук. Глухой, бархатный, тяжёлый. Золото.',
    ambient: 'cave',
    choices: [
      { text: 'Войти в золотую камеру', next: 'gold_hall', duration: 4500, action: 'walk' },
      { text: '← Вернуться к развилке', next: 'crossroads', duration: 5000, action: 'walk' }
    ]
  },

  // ============================================================
  //  ЭТАЖ 5 · ЗОЛОТАЯ КАМЕРА (точка схождения всех веток)
  // ============================================================
  gold_hall: {
    id: 'gold_hall',
    depth: 5,
    branch: 'gold',
    title: 'Золотая камера',
    text: 'Ты входишь в большую камеру. Эхо шагов расходится широко — свод где-то высоко над головой. Воздух сухой, тёплый.\n\nПод ногами — что-то хрустит. Ты наклоняешься, берёшь. Тяжёлое, шершавое, плотное. Самородок золота.\n\nВ дальнем углу — старый сундук. И слышен голос — где-то здесь бродит ещё один житель. А ещё — два спуска: узкий колодец в центре и пологий — у дальней стены. Где-то глубоко звенят алмазы.\n\nВ углу за сундуком мерцает вода — это колодец. А в дальней стене, за шершавым камнем, угадывается что-то гладкое, обработанное. Древнее. Но без булавы туда не попасть — рукоять не поддаётся.',
    ambient: 'cave',
    isHub: true,
    choices: [
      { text: 'Собрать золото (8с)', next: 'gold_collect', duration: 8000, action: 'mine', requires: { notFlag: 'got_gold' } },
      { text: 'Открыть сундук', next: 'gold_chest', duration: 3500, action: 'observe', requires: { notFlag: 'opened_chest' } },
      { text: '💧 Подойти к колодцу здоровья', next: 'gold_well', duration: 2500, action: 'walk', requires: { notFlag: 'drank_gold_well' } },
      { text: 'Подойти к торговцу', next: 'gold_meet_merchant', duration: 3000, action: 'walk' },
      { text: '🔑 Врата Испытаний (нужна булава)', next: 'trials_entry', duration: 3500, action: 'walk', requires: { flag: 'got_mace', notFlag: 'completed_trials' } },
      { text: 'Спуститься в узкий колодец', next: 'descent_narrow', duration: 4500, action: 'walk' },
      { text: 'Пойти по пологому спуску', next: 'descent_gentle', duration: 4500, action: 'walk' },
      { text: '← Вернуться к развилке (наверх)', next: 'crossroads', duration: 7000, action: 'walk' }
    ]
  },

  gold_collect: {
    id: 'gold_collect',
    depth: 5,
    branch: 'gold',
    title: 'Золотая камера',
    text: 'Ты собираешь самородки. Золото тяжёлое, оно оттягивает сумку, но согревает душу. Пять штук — этого хватит, чтобы никогда больше не спускаться в шахты. Если, конечно, выберешься.',
    ambient: 'cave',
    onEnter: { items: { gold: 5 }, flags: ['got_gold'] },
    choices: [
      { text: '← Вернуться в камеру', next: 'gold_hall', duration: 2500, action: 'walk' }
    ]
  },

  gold_chest: {
    id: 'gold_chest',
    depth: 5,
    branch: 'gold',
    title: 'Старый сундук',
    text: 'Ты подходишь к сундуку. Дерево сгнило, но железные полосы ещё держат. Ты нажимаешь на крышку — она поддаётся с протяжным скрипом.\n\nВнутри — ткань. Старая одежда. А под ней — холодная, тяжёлая вещь. Кирка! Железная, с чётким острым наконечником. С ней можно добыть любую руду, даже алмазы.\n\nВ углу сундука — светящийся гриб и кусок кожи. Кто-то собрал их для дальней дороги и не вернулся.',
    ambient: 'cave',
    onEnter: { pickaxeTier: 'iron', items: { mushroom: 1, leather: 2 }, flags: ['opened_chest', 'got_iron_pickaxe', 'got_leather'] },
    choices: [
      { text: '← Вернуться в камеру', next: 'gold_hall', duration: 2500, action: 'walk' }
    ]
  },

  gold_meet_merchant: {
    id: 'gold_meet_merchant',
    depth: 5,
    branch: 'gold',
    title: 'Странствующий торговец',
    text: 'У дальней стены сидит человек в богатом плаще. Он не слепой — у него глаза завязаны чёрной повязкой, но он "видит" пальцами, как ты. Перед ним — россыпь редких товаров.\n\n— А, дошёл. Я ждал. У меня есть то, чего нет у других. Алмазная броня — лучшая защита. Кожа, если беден. Грибы. Меняемся?\n\nДоступные обмены:',
    ambient: 'cave',
    isHub: true,
    choices: [
      { text: '🤝 5 алмазов → Алмазная броня', next: '@self', duration: 6000, action: 'trade', requires: { items: { diamond: 5 } }, effects: { items: { diamond: -5 }, armor: 'diamond', flags: ['has_diamond_armor'] } },
      { text: '🤝 3 железа + 2 золота → Железная кирка', next: '@self', duration: 5000, action: 'trade', requires: { items: { iron: 3, gold: 2 }, maxPickaxe: 'iron' }, effects: { items: { iron: -3, gold: -2 }, pickaxeTier: 'iron', flags: ['got_iron_pickaxe'] } },
      { text: '🤝 3 золота → 1 гриб', next: '@self', duration: 4000, action: 'trade', requires: { items: { gold: 3 } }, effects: { items: { gold: -3, mushroom: 1 } } },
      { text: '🤝 5 меди → 1 кожа', next: '@self', duration: 4000, action: 'trade', requires: { items: { copper: 5 } }, effects: { items: { copper: -5, leather: 1 } } },
      { text: '🤝 3 кожи → Кожаная броня', next: '@self', duration: 5000, action: 'trade', requires: { items: { leather: 3 } }, effects: { items: { leather: -3 }, armor: 'leather', flags: ['has_leather_armor'] } },
      { text: '← Вернуться в камеру', next: 'gold_hall', duration: 2500, action: 'walk' }
    ]
  },

  // ============================================================
  //  ЭТАЖ 5.5 · СПУСК К АЛМАЗАМ
  // ============================================================
  descent_narrow: {
    id: 'descent_narrow',
    depth: 5,
    branch: 'gold',
    title: 'Узкий колодец',
    text: 'Ты нащупываешь край колодца. Узкий — плечи едва помещаются. Стены гладкие, мокрые. Спускаться придётся на руках, прижимаясь спиной к одной стене и ногами к другой.\n\nЗвон алмазов здесь звучит отчётливее. Они близко.',
    ambient: 'cave',
    choices: [
      { text: 'Спускаться (нужно HP 30+)', next: 'diamond_entry', duration: 7000, action: 'walk', requires: { minHealth: 30 } },
      { text: 'Отступить к пологому спуску', next: 'descent_gentle', duration: 3000, action: 'walk' }
    ]
  },

  descent_gentle: {
    id: 'descent_gentle',
    depth: 5,
    branch: 'gold',
    title: 'Пологий спуск',
    text: 'Ты идёшь по пологому спуску. Это длинный, извилистый туннель. Стены постепенно меняются — становятся плотнее, холоднее. Воздух звенит.\n\nТы идёшь минут пятнадцать. Звон становится громче. Чище. Сладкое предвкушение сжимает грудь.',
    ambient: 'cave',
    choices: [
      { text: 'Войти в алмазную камеру', next: 'diamond_entry', duration: 5000, action: 'walk' }
    ]
  },

  // ============================================================
  //  ЭТАЖ 6 · АЛМАЗНАЯ КАМЕРА
  // ============================================================
  diamond_entry: {
    id: 'diamond_entry',
    depth: 6,
    branch: 'diamond',
    title: 'Алмазная камера',
    text: 'Ты входишь в камеру. Звон здесь почти невыносим — высокий, чистый, как хор крошечных колокольчиков. Под ногами — гладкий, очень плотный камень. Стены покрыты вкраплениями, которые отзываются на каждый твой шаг звоном.\n\nТы нащупываешь стену. Под пальцами — гладкая, прохладная грань кристалла. Алмаз, вросший в породу.\n\nЧтобы добыть его, нужна железная кирка. И сила. И время.',
    ambient: 'diamond',
    onEnter: { flags: ['reached_diamonds'] },
    choices: [
      { text: 'Добыть алмазы (12с, нужна железная+ кирка)', next: 'diamond_mine', duration: 12000, action: 'mine', requires: { minPickaxe: 'iron' } },
      { text: 'Попробовать руками', next: 'diamond_hand', duration: 8000, action: 'mine' }
    ]
  },

  diamond_hand: {
    id: 'diamond_hand',
    depth: 6,
    branch: 'diamond',
    title: 'Алмазная камера',
    text: 'Ты царапаешь породу ногтями. Алмаз гладкий, холодный, скользкий. Пальцы соскальзывают. Ты давишь, тянешь — без толку. Камень держит его крепко.\n\nТы тратишь час. Ногти обломаны, пальцы в крови. Алмаз даже не сдвинулся. Без кирки его не взять.',
    ambient: 'diamond',
    onEnter: { health: -10 },
    choices: [
      { text: 'Подняться обратно', next: 'gold_hall_return', duration: 7000, action: 'walk' },
      { text: 'Сдаться и уйти', next: 'ending_surrender', duration: 4000, action: 'walk' }
    ]
  },

  gold_hall_return: {
    id: 'gold_hall_return',
    depth: 5,
    branch: 'gold',
    title: 'Возврат в золотую камеру',
    text: 'Ты возвращаешься в золотую камеру. Если ещё не открыл сундук — там лежит железная кирка. Если не tradingовал с купцом — у него тоже есть что предложить.\n\nТы переводишь дыхание. Сердце колотится. Но цель близка.',
    ambient: 'cave',
    choices: [
      { text: 'Открыть сундук', next: 'gold_chest', duration: 3500, action: 'observe', requires: { notFlag: 'opened_chest' } },
      { text: 'Подойти к торговцу', next: 'gold_meet_merchant', duration: 3000, action: 'walk' },
      { text: 'Спуститься в узкий колодец', next: 'descent_narrow', duration: 4500, action: 'walk' },
      { text: 'Пойти по пологому спуску', next: 'descent_gentle', duration: 4500, action: 'walk' }
    ]
  },

  diamond_mine: {
    id: 'diamond_mine',
    depth: 6,
    branch: 'diamond',
    title: 'Алмазная камера',
    text: 'Ты поднимаешь кирку. Удар. Ещё удар. Порода крошится медленно — она тверже всего, что ты встречал. Но кирка берёт своё. Кусок за куском.\n\nЧерез полчаса — первый алмаз в твоей руке. Холодный, тяжёлый, гладкий. Звон его вибрирует в твоих пальцах.\n\nТы продолжаешь. Второй. Третий. Четвёртый. Пятый. Сумка тяжелеет, но ноги несут легче. Ты сделал это.',
    ambient: 'diamond',
    onEnter: { items: { diamond: 5 }, flags: ['mined_diamonds'] },
    choices: [
      { text: 'Подняться на поверхность', next: 'ending_victory', duration: 6000, action: 'walk' }
    ]
  },

  // ============================================================
  //  КОНЦОВКИ
  // ============================================================
  ending_victory: {
    id: 'ending_victory',
    depth: 6,
    act: 'act1',
    branch: 'end',
    title: 'Act 1: Свет (победа)',
    text: 'Подъём кажется легче спуска. Может, потому что в сумке — алмазы. Может, потому что ты наконец-то сделал то, что задумал.\n\nСвежий ветер касается лица. Запах мха. Холодный горный воздух. Ты выходишь из шахты на поверхность.\n\nТы слеп. Ты был слеп и останешься слепым. Но ты спустился туда, куда не каждый зрячий решится. И ты вернулся. С алмазами.\n\nГде-то в темноте шахты всё ещё звучит хор крошечных колокольчиков. Но тебе уже не нужно туда. Ты выполнил своё предназначение.\n\n...но мир снаружи оказался шире, чем ты думал. Поверхность ждёт — деревня, Trials, портал в Нижний мир и дальше, в Край. Путешествие только начинается.',
    ambient: 'surface',
    isEnding: 'victory',
    choices: [
      { text: '🌅 Продолжить в Act 2 (поверхность)', next: 'act2_surface_arrival', duration: 4000, action: 'walk' },
      { text: 'Начать Act 1 заново', next: 'start', duration: 2000, action: 'walk' }
    ]
  },

  ending_surrender: {
    id: 'ending_surrender',
    depth: 6,
    act: 'act1',
    branch: 'end',
    title: 'Act 1: Уход',
    text: 'Ты разворачиваешься и идёшь вверх. Без алмазов. С пустыми руками. Но живой.\n\nГде-то позади, в алмазной камере, всё ещё звучит хор колокольчиков. Они будут звать тебя. Они всегда будут звать.\n\nНо ты знаешь — можно вернуться. С киркой. С булавой. С силой. Путешествие не закончено.',
    ambient: 'cave',
    isEnding: 'death',
    choices: [
      { text: 'Начать заново', next: 'start', duration: 2000, action: 'walk' }
    ]
  },

  // ============================================================
  //  ЭТАЖ 2 · ОХОТНИЧЬЯ ТРОПА (новая ветка v2.2)
  // ============================================================
  hunt_entry: {
    id: 'hunt_entry',
    depth: 2,
    branch: 'hunt',
    title: 'Охотничья тропа',
    text: 'Ты протискиваешься в расщелину с факелом в руке. Жар огня разгоняет мрак, и ты слышишь, как по ту сторону что-то шебуршится и разбегается.\n\nЗа расщелиной — широкий туннель с земляным полом. Пахнет зверем, мхом и сырым мясом. На стенах — следы когтей: здесь живут дикие твари. Но здесь же — свежая вода, съедобные грибы и… мясо. Много мяса.\n\nВпереди слышно два звука: быстрый топот мелких лап слева, и тяжёлое сопение справа.',
    ambient: 'cave',
    onEnter: { flags: ['chose_hunt'] },
    choices: [
      { text: ' идти к мелким лапам (кролики)', next: 'hunt_rabbits', duration: 3000, action: 'walk' },
      { text: 'Подойти к сопению (медведь)', next: 'hunt_bear', duration: 4000, action: 'walk' },
      { text: 'Искать охотника', next: 'hunt_meet_hunter', duration: 3000, action: 'walk', requires: { flag: 'met_hunter_flag' } },
      { text: 'Найти тайный лаз вниз', next: 'hunt_secret', duration: 5000, action: 'walk', requires: { flag: 'met_hunter_flag' } },
      { text: '← Вернуться в Капельную комнату', next: 'drip_room', duration: 4000, action: 'walk' }
    ]
  },

  hunt_rabbits: {
    id: 'hunt_rabbits',
    depth: 2,
    branch: 'hunt',
    title: 'Кроличья нора',
    text: 'Мелкие лапы привели тебя в целую кроличью колонию. Пещерные кролики — слепые, как и ты, но пугливые. Они разбегаются при свете факела, но не все успевают.\n\nТы нащупываешь одного — тёплый, мягкий, ещё живой. Быстрый удар камнем по голове. Мясо. Ещё одного. Третьего. Хватит на пару дней.',
    ambient: 'cave',
    onEnter: { items: { meat: 3 }, flags: ['got_meat_rabbits'] },
    choices: [
      { text: 'Подойти к сопению (медведь)', next: 'hunt_bear', duration: 4000, action: 'walk', requires: { notFlag: 'got_meat_bear' } },
      { text: 'Искать охотника', next: 'hunt_meet_hunter', duration: 3000, action: 'walk' },
      { text: 'Вернуться к началу тропы', next: 'hunt_entry', duration: 3000, action: 'walk' }
    ]
  },

  hunt_bear: {
    id: 'hunt_bear',
    depth: 2,
    branch: 'hunt',
    title: 'Логово медведя',
    text: 'Тяжёлое сопение приводит тебя в большую берлогу. Пещерный медведь — огромный, по сравнению с тобой он как дом. Но он старый, и шкура его в шрамах от прошлых битв.\n\nТы подходишь тихо. Бьёшь факелом. Медведь рычит, бросается на тебя, но ты успеваешь откатиться. Ещё удар. Ещё. Наконец зверь падает.\n\nТы нащупываешь его тело. Три куска мяса и толстая шкура — две кожи. Но и сам ты потрёпан.',
    ambient: 'monster',
    onEnter: { items: { meat: 3, leather: 2 }, health: -25, flags: ['got_meat_bear', 'fought_bear'] },
    choices: [
      { text: 'Искать охотника', next: 'hunt_meet_hunter', duration: 3000, action: 'walk' },
      { text: 'Вернуться к началу тропы', next: 'hunt_entry', duration: 3000, action: 'walk' }
    ]
  },

  hunt_meet_hunter: {
    id: 'hunt_meet_hunter',
    depth: 2,
    branch: 'hunt',
    title: 'Старый охотник',
    text: 'В глубине туннеля, у небольшого костерка, сидит старик. Он одет в шкуры, на коленях — лук и колчан стрел. Старик тоже слеп, но охотится по слуху и запаху лучше многих зрячих.\n\n— А, прохожий. Мясо принёс? Или кожу? У меня есть что предложить. Грибы, стрелы. И — знаю тайный лаз вниз, к золоту. Если заслужишь.\n\nДоступные обмены:',
    ambient: 'cave',
    isHub: true,
    onEnter: { flags: ['met_hunter_flag'] },
    choices: [
      { text: '🤝 2 мяса → 1 гриб', next: '@self', duration: 4000, action: 'trade', requires: { items: { meat: 2 } }, effects: { items: { meat: -2, mushroom: 1 } } },
      { text: '🤝 3 мяса → 5 стрел', next: '@self', duration: 4000, action: 'trade', requires: { items: { meat: 3 } }, effects: { items: { meat: -3, arrow: 5 } } },
      { text: '🤝 2 кожи → 3 стрелы', next: '@self', duration: 4000, action: 'trade', requires: { items: { leather: 2 } }, effects: { items: { leather: -2, arrow: 3 } } },
      { text: '🤝 1 мясо + 1 гриб → приготовленная еда (+50 HP)', next: '@self', duration: 6000, action: 'craft', requires: { items: { meat: 1, mushroom: 1 } }, effects: { items: { meat: -1, mushroom: -1, food: 1 } } },
      { text: '🤝 5 стрел → 1 кожа', next: '@self', duration: 4000, action: 'trade', requires: { items: { arrow: 5 } }, effects: { items: { arrow: -5, leather: 1 } } },
      { text: '🗺️ Спросить про тайный лаз', next: 'hunt_secret_revealed', duration: 3000, action: 'observe', requires: { flag: 'met_hunter_flag', notFlag: 'knows_secret' } },
      { text: '← Вернуться к началу тропы', next: 'hunt_entry', duration: 3000, action: 'walk' }
    ]
  },

  hunt_secret_revealed: {
    id: 'hunt_secret_revealed',
    depth: 2,
    branch: 'hunt',
    title: 'Тайный лаз',
    text: 'Старик усмехается.\n\n— Вижу, ты не из трусливых. Ладно. За моей спиной, в дальнем углу, есть расщелина. Узкая, но проходимая. Она ведёт прямо в Золотую камеру, минуя все три пути. Те, кто знает этот лаз, добираются до алмазов в два раза быстрее.\n\nНо помни: обратно той же дорогой не вылезешь — слишком крутой спуск.',
    ambient: 'cave',
    onEnter: { flags: ['knows_secret'] },
    choices: [
      { text: '← Вернуться к охотнику', next: 'hunt_meet_hunter', duration: 2000, action: 'walk' },
      { text: 'Вернуться к началу тропы', next: 'hunt_entry', duration: 3000, action: 'walk' }
    ]
  },

  hunt_secret: {
    id: 'hunt_secret',
    depth: 5,
    branch: 'hunt',
    title: 'Тайный лаз',
    text: 'Ты нащупываешь расщелину за спиной охотника. Узкая, почти вертикальная. Ты протискиваешься вниз, обдирая бока о камень. Через несколько минут — вываливаешься в сухой тёплый воздух.\n\nЗолотая камера. Ты пропустил все три пути — Воду, Жар и Тишину. Прямо здесь, под ногами, хрустит золото.',
    ambient: 'cave',
    choices: [
      { text: 'Войти в золотую камеру', next: 'gold_hall', duration: 3000, action: 'walk' }
    ]
  },

  // ============================================================
  //  КОЛОДЦЫ ЗДОРОВЬЯ (v2.2) — встраиваются в существующие ветки
  // ============================================================
  water_well: {
    id: 'water_well',
    depth: 3,
    branch: 'water',
    title: 'Колодец здоровья',
    text: 'Среди обычных луж водоёма ты нащупываешь нечто иное. Холодный каменный край, гладкая поверхность. Это не просто вода — это старый колодец, выбитый в скале древними рудокопами.\n\nВода в нём не ледяная, как в остальном водоёме, а прохладная, мягкая на вкус. Говорят, такая вода восстанавливает силы — те, кто пил из неё, шли дальше, когда другие падали.',
    ambient: 'water',
    isHub: true,
    choices: [
      { text: '💧 Попить из колодца (+40 HP, 5с)', next: '@self', duration: 5000, action: 'observe', requires: { notFlag: 'drank_well' }, effects: { health: 40, flags: ['drank_well'] } },
      { text: '← Вернуться к водоёму', next: 'water_wade', duration: 3000, action: 'walk' }
    ]
  },

  gold_well: {
    id: 'gold_well',
    depth: 5,
    branch: 'gold',
    title: 'Золотой колодец',
    text: 'В углу золотой камеры, за старым сундуком, ты нащупываешь каменный край. Колодец! Здесь, в сухой тёплой камере, вода кажется чудом. Но она есть — прохладная, чистая, живая.\n\nСтарые рудокопы говорили: тот, кто найдёт два колодца в одной шахте, не умрёт в ней. У тебя, кажется, есть шанс.',
    ambient: 'cave',
    isHub: true,
    choices: [
      { text: '💧 Попить из колодца (+40 HP, 5с)', next: '@self', duration: 5000, action: 'observe', requires: { notFlag: 'drank_gold_well' }, effects: { health: 40, flags: ['drank_gold_well'] } },
      { text: '← Вернуться в камеру', next: 'gold_hall', duration: 2500, action: 'walk' }
    ]
  },

  // ============================================================
  //  ACT 2 · THE TRIALS (v2.3) — необязательная ветка
  //  Вдохновлено Trial Chambers из Minecraft 1.21
  // ============================================================
  trials_entry: {
    id: 'trials_entry',
    depth: 5,
    branch: 'trials',
    title: 'Врата Испытаний',
    text: 'В дальней стене Золотой камеры ты нащупываешь нечто странное. Камень здесь не шершавый, как везде, а гладкий, обработанный. И холодный — гораздо холоднее окружающего воздуха.\n\nТы проводишь пальцами выше. Рельеф. Какие-то символы. И — рукоять. Металлическая, ледяная, в форме переплетённых змей.\n\nЭто не природная пещера. Это дверь. Древняя, построенная теми, кто знал толк в камне и металле. Говорят, до рудокопов в этих горах жили другие — Строители. Они оставили после себя испытания. Тот, кто пройдёт их, получит оружие, какого не выкуёт ни один кузнец.\n\nНо это необязательно. Можно пройти мимо. К алмазам.',
    ambient: 'cave',
    onEnter: { flags: ['found_trials'] },
    choices: [
      { text: '🔑 Потянуть рукоять (открыть врата)', next: 'trials_vault', duration: 5000, action: 'observe', requires: { notFlag: 'opened_trials' }, effects: { flags: ['opened_trials'] } },
      { text: '← Вернуться в Золотую камеру', next: 'gold_hall', duration: 3000, action: 'walk' }
    ]
  },

  trials_vault: {
    id: 'trials_vault',
    depth: 5,
    branch: 'trials',
    title: 'Зал Испытаний',
    text: 'Дверь поддаётся с протяжным скрежетом. Ты входишь — и эхо шагов разносится далеко, как в соборе. Это не пещера. Это зал. Высокий сводчатый потолок, гладкие стены из тёмного камня, между которыми мерцают синие кристаллы.\n\nВ центре зала — три прохода. Над каждым — символ, вырезанный в камне. Слева — изображение меча (бой). Прямо — изображение шестерёнок (механизмы). Справа — изображение чаши (загадка).\n\nВ дальнем конце зала, за всеми тремя проходами, виднеется сияние. Это Сокровищница. Но к ней ведёт только один путь — тот, что ты выберешь сейчас.',
    ambient: 'diamond',
    isHub: true,
    choices: [
      { text: '⚔️ Войти в Зал Боя (меч)', next: 'trials_combat', duration: 4000, action: 'walk' },
      { text: '⚙️ Войти в Зал Механизмов (шестерёнки)', next: 'trials_puzzle', duration: 4000, action: 'walk' },
      { text: '🏺 Войти в Зал Загадки (чаша)', next: 'trials_riddle', duration: 4000, action: 'walk' },
      { text: '← Выйти из зала (нельзя вернуться)', next: 'gold_hall', duration: 3000, action: 'walk', requires: { notFlag: 'trials_started' } }
    ]
  },

  trials_combat: {
    id: 'trials_combat',
    depth: 5,
    branch: 'trials',
    title: 'Зал Боя',
    text: 'Ты входишь в левый проход. Стены сужаются, потом расширяются в круглую арену. Пол здесь не каменный — песчаный, утоптанный тысячами ног. И не только ног.\n\nВ центре арены — каменный пьедестал, на нём лежит ключ. Стержневидный, синий, мерцающий. Но как только ты делаешь шаг к нему, из стен с шипением выезжают четыре камня — и из них вылезают твари.\n\nЭто не пещерные звери. Это Големы-Стражи. Каменные, с горящими синими глазами. Они не рычат — они просто идут к тебе. Молча. Неотвратимо.',
    ambient: 'monster',
    onEnter: { flags: ['trials_started'], health: -10 },
    choices: [
      { text: '⚔️ Атаковать факелом (если есть)', next: 'trials_combat_torch', duration: 6000, action: 'combat', requires: { items: { torch: 1 } }, effects: { items: { torch: -1 } } },
      { text: '🛡️ Атаковать киркой', next: 'trials_combat_pickaxe', duration: 7000, action: 'combat' },
      { text: '🏃 Увернуться и схватить ключ', next: 'trials_combat_dodge', duration: 5000, action: 'combat' }
    ]
  },

  trials_combat_torch: {
    id: 'trials_combat_torch',
    depth: 5,
    branch: 'trials',
    title: 'Зал Боя — огонь',
    text: 'Ты бросаешь факел в ближайшего голема. Пламя охватывает его — но камень не горит. Голем замедляется, синие глаза тускнеют, но не гаснут. Он всё ещё идёт.\n\nТы используешь время. Оббегаешь его, хватаешь ключ с пьедестала. Второй голем тянется к тебе — ты увернулся. Третий — почти достал. Но ты уже у выхода.\n\nКлюч в руке. Големы остаются позади, медленно поворачивая головы тебе вслед.',
    ambient: 'monster',
    onEnter: { items: { trial_key: 1 }, health: -15, flags: ['got_trial_key'] },
    choices: [
      { text: '→ Бежать к Сокровищнице', next: 'trials_reward', duration: 3000, action: 'walk' }
    ]
  },

  trials_combat_pickaxe: {
    id: 'trials_combat_pickaxe',
    depth: 5,
    branch: 'trials',
    title: 'Зал Боя — кирка',
    text: 'Ты замахиваешься киркой. Удар — и каменная рука голема разлетается в крошку. Он останавливается, пытается восстановиться — но ты уже бьёшь по второй руке. Третий голем хватает тебя за плечо — больно, ты вырываешься.\n\nЧетвёртый голем почти у пьедестала. Ты бросаешься к ключу, хватаешь его первым. Големы замирают — будто их выключили. Ключ активировал что-то в зале.\n\nТы стоишь посреди четырёх обездвиженных каменных стражей. В руке — синий мерцающий ключ.',
    ambient: 'monster',
    onEnter: { items: { trial_key: 1 }, health: -20, flags: ['got_trial_key'] },
    choices: [
      { text: '→ Бежать к Сокровищнице', next: 'trials_reward', duration: 3000, action: 'walk' }
    ]
  },

  trials_combat_dodge: {
    id: 'trials_combat_dodge',
    depth: 5,
    branch: 'trials',
    title: 'Зал Боя — уклонение',
    text: 'Ты неfighter. Ты рудокоп. Ты бросаешься к пьедесталу, скользя под рукой ближайшего голема. Пальцы хватают ключ — и големы замирают. Все четверо. Кажется, ключ controls их.\n\nНо ты потрёпан. Один голем успел ударить тебя по спине — чувствуешь, как хрустнуло ребро. Дышать больно. Но ты жив. И у тебя есть ключ.',
    ambient: 'monster',
    onEnter: { items: { trial_key: 1 }, health: -30, flags: ['got_trial_key'] },
    choices: [
      { text: '→ Бежать к Сокровищнице', next: 'trials_reward', duration: 3000, action: 'walk' }
    ]
  },

  trials_puzzle: {
    id: 'trials_puzzle',
    depth: 5,
    branch: 'trials',
    title: 'Зал Механизмов',
    text: 'Ты входишь в центральный проход. Здесь нет арены — только лабиринт из медных шестерёнок, рычагов и труб. Всё это тихо поскрипывает, будто дышит. Механизмы Строителей работают уже тысячи лет — никто их не смазывает, но они работают.\n\nВ центре лабиринта — пьедестал с ключом. Но между тобой и им — пять движущихся платформ. Они сдвигаются и раздвигаются в сложном ритме. Шаг не в то время — и платформа уйдёт из-под ног, упадёшь в пропасть.\n\nНа стене — рельеф. Похоже, подсказка: три символа в определённом порядке. Солнце, луна, звезда. Может, это ритм платформ?',
    ambient: 'cave',
    onEnter: { flags: ['trials_started'] },
    choices: [
      { text: '⚙️ Идти по ритму: солнце-луна-звезда', next: 'trials_puzzle_correct', duration: 8000, action: 'walk' },
      { text: '⚙️ Идти наугад, быстро', next: 'trials_puzzle_wrong', duration: 5000, action: 'walk' }
    ]
  },

  trials_puzzle_correct: {
    id: 'trials_puzzle_correct',
    depth: 5,
    branch: 'trials',
    title: 'Зал Механизмов — успех',
    text: 'Ты делаешь шаг на первую платформу. Ждёшь — она сдвигается вправо, как и предсказывал ритм «солнце». Шаг на вторую — «луна» — она поднимается. Третья — «звезда» — опускается, но ты успеваешь.\n\nПлатформы несут тебя через пропасть как вежливые слуги. Через минуту ты на другой стороне, перед пьедесталом. Ключ в руке — синий, мерцающий, тёплый.\n\nМеханизмы за спиной замирают. Лабиринт пройден.',
    ambient: 'cave',
    onEnter: { items: { trial_key: 1 }, flags: ['got_trial_key'] },
    choices: [
      { text: '→ К Сокровищнице', next: 'trials_reward', duration: 3000, action: 'walk' }
    ]
  },

  trials_puzzle_wrong: {
    id: 'trials_puzzle_wrong',
    depth: 5,
    branch: 'trials',
    title: 'Зал Механизмов — ошибка',
    text: 'Ты бросаешься на первую платформу. Она уходит вбок — ты падаешь, скользишь, едва успеваешь ухватиться за край. Висишь над пропастью. Силы на исходе.\n\nКое-как подтягиваешься. Возвращаешься на исходную позицию. Теперь — по ритму. Солнце, луна, звезда. Платформы послушно несут тебя.\n\nКлюч в руке. Но ты потратил много сил и времени.',
    ambient: 'cave',
    onEnter: { items: { trial_key: 1 }, health: -25, flags: ['got_trial_key'] },
    choices: [
      { text: '→ К Сокровищнице', next: 'trials_reward', duration: 3000, action: 'walk' }
    ]
  },

  trials_riddle: {
    id: 'trials_riddle',
    depth: 5,
    branch: 'trials',
    title: 'Зал Загадки',
    text: 'Ты входишь в правый проход. Здесь тихо. Маленькая келья, в центре — каменная чаша на пьедестале. Над чашей, в воздухе, висит синий ключ — никто его не касается, но он не падает.\n\nНа стене — надпись. Старый язык, но ты узнаёшь символы — их учил дед. Перевод:\n\n«Я не живое, но расту. Не имею лёгких, но нуждаюсь в воздухе. Не имею рта, но вода убивает меня. Что я?»\n\nПод чашей — три кнопки. Символы: 🔥 огонь, 🌳 корень, ☁️ облако. Чаша пуста. Видимо, в неё нужно положить правильный ответ — но чем?',
    ambient: 'diamond',
    onEnter: { flags: ['trials_started'] },
    choices: [
      { text: '🔥 Положить факел в чашу (если есть)', next: 'trials_riddle_correct', duration: 4000, action: 'observe', requires: { items: { torch: 1 } }, effects: { items: { torch: -1 } } },
      { text: '🪵 Положить дерево в чашу', next: 'trials_riddle_correct', duration: 4000, action: 'observe', requires: { items: { wood: 1 } }, effects: { items: { wood: -1 } } },
      { text: '🪨 Положить камень в чашу', next: 'trials_riddle_wrong', duration: 4000, action: 'observe', requires: { items: { stone: 1 } }, effects: { items: { stone: -1 } } }
    ]
  },

  trials_riddle_correct: {
    id: 'trials_riddle_correct',
    depth: 5,
    branch: 'trials',
    title: 'Зал Загадки — ответ',
    text: 'Чаша принимает подношение. Вспышка синего света — и ключ падает в твою руку. Тёплый, мерцающий, лёгкий.\n\nГолос — нет, не голос. Скорее мысль в твоей голове — произносит:\n\n— Верно. Огонь не живой, но растёт. Не имеет лёгких, но нуждается в воздухе. Вода убивает его. Ты заслужил доступ в Сокровищницу.\n\nЗагадка была простой. Но не все проходят её. Многие клали камень — и камень забирал их.',
    ambient: 'diamond',
    onEnter: { items: { trial_key: 1 }, flags: ['got_trial_key'] },
    choices: [
      { text: '→ К Сокровищнице', next: 'trials_reward', duration: 3000, action: 'walk' }
    ]
  },

  trials_riddle_wrong: {
    id: 'trials_riddle_wrong',
    depth: 5,
    branch: 'trials',
    title: 'Зал Загадки — ошибка',
    text: 'Ты кладёшь камень в чашу. Вспышка — но не синяя, красная. Камень в чаше раскаляется, взрывается. Осколки бьют тебя по лицу и рукам.\n\nГолос в голове:\n\n— Неверно. Камень не растёт. Камень не дышит. Ты выбрал смерть.\n\nНо ты не умер. Чаша опустела. Ключ всё ещё висит — но теперь он чуть дальше. Ты тянешься — достаёшь. Боль от ожогов прошла — но урок усвоен.',
    ambient: 'diamond',
    onEnter: { items: { trial_key: 1 }, health: -35, flags: ['got_trial_key'] },
    choices: [
      { text: '→ К Сокровищнице', next: 'trials_reward', duration: 3000, action: 'walk' }
    ]
  },

  trials_reward: {
    id: 'trials_reward',
    depth: 5,
    branch: 'trials',
    title: 'Сокровищница',
    text: 'Ты выходишь к сиянию. Сокровищница — небольшой круглый зал, весь из синего кристалла. Стены мерцают, отражая твой силуэт. В центре — большой сундук из тёмного металла, с замком в форме переплетённых змей.\n\nТы вставляешь ключ. Замок щёлкает — густо, удовлетворяюще. Крышка поднимается.\n\nВнутри — булава. Не каменная, не железная — из тёмного металла с синими вкраплениями. Она тяжёлая, но когда ты берёшь её, кажется, будто она сама находит цель. Это оружие Строителей. Булава Ветров.\n\nПод булавой — стержень: тонкий, гибкий, из материала, которого ты не знаешь. Стержень Ветра. Говорят, из него можно сделать оружие пострашнее булавы.\n\nИ ещё — россыпь самоцветов. Не алмазы, но что-то похожее. Синие, как глаза големов.',
    ambient: 'diamond',
    onEnter: { items: { mace: 1, breeze_rod: 1, vault_loot: 3 }, flags: ['got_mace', 'completed_trials'] },
    choices: [
      { text: '→ Выход к алмазам', next: 'trials_exit', duration: 3000, action: 'walk' }
    ]
  },

  trials_exit: {
    id: 'trials_exit',
    depth: 6,
    act: 'act2',
    branch: 'trials',
    title: 'Act 2: Выход из Испытаний',
    text: 'За Сокровищницей — проход. Он ведёт вниз, в сторону алмазной камеры. Стены здесь снова естественные, шершавые — ты выходишь из построек Строителей обратно в пещеры.\n\nНо перед выходом — последний рельеф. На стене выбита картина: фигуры Строителей, уходящие вниз, в огонь. Под ними — надпись:\n\n«Мы спустились в Нижний мир за большим. Мы не вернулись. Тот, кто держит булаву, — продолжи наш путь.»\n\nНижний мир. Преисподняя. Строители шли туда — и не вернулись. Но их путь продолжается через тебя. После алмазов — портал в Ад ждёт.',
    ambient: 'cave',
    choices: [
      { text: '→ В Алмазную камеру', next: 'diamond_entry', duration: 4000, action: 'walk' },
      { text: '🏆 Закончить как Мастер Испытаний', next: 'ending_trials_master', duration: 5000, action: 'walk', requires: { flag: 'got_mace' } }
    ]
  },

  ending_trials_master: {
    id: 'ending_trials_master',
    depth: 6,
    act: 'act2',
    branch: 'trials',
    title: 'Act 2: Мастер Испытаний',
    text: 'Ты не пошёл за алмазами. Ты остановился у рельефа Строителей и задумался.\n\nАлмазы — это богатство. Но булава в твоей руке — это сила. Стержень Ветра — это знание. А надпись на стене — это приглашение. Приглашение туда, куда не доходил ни один рудокоп.\n\nТы разворачиваешься. Возвращаешься в Сокровищницу. Оттуда — в Зал Испытаний. Оттуда — к Вратам. И — наружу, на поверхность.\n\nТы не вернулся с алмазами. Ты вернулся с чем-то большим. Ты — Мастер Испытаний. И впереди — Нижний мир, Край, и конец всего. Путешествие продолжается.',
    ambient: 'diamond',
    isEnding: 'victory',
    choices: [
      { text: '🌅 Выйти на поверхность (Act 2)', next: 'act2_surface_arrival', duration: 4000, action: 'walk' },
      { text: 'Начать Act 1 заново', next: 'start', duration: 2000, action: 'walk' }
    ]
  },

  // ============================================================
  //  ACT 2 · ПОВЕРХНОСТЬ (новый контент v2.4)
  //  После любой концовки Act 1 — выход на поверхность, деревня, поиск Врат
  // ============================================================
  act2_surface_arrival: {
    id: 'act2_surface_arrival',
    depth: 0,
    act: 'act2',
    branch: 'surface2',
    title: 'Act 2: Выход на поверхность',
    text: 'Свежий ветер. Запах мха. Шум далёкой реки. Ты вышел из шахты.\n\nНо мир снаружи — не то, что ты помнил. Где-то впереди слышен стук топоров, мычание скота, детский смех. Деревня. Здесь живут люди — не слепые, как ты, но всё равно не видящие того, что видишь ты.\n\nВ кармане — алмазы (или булава, или просто опыт). В сердце — тревога. Что-то зовёт тебя дальше. Что-то, что ты не можешь объяснить словами. Что-то древнее.',
    ambient: 'village',
    onEnter: { flags: ['act2_started', 'act2Unlocked'] },
    choices: [
      { text: '🏠 Войти в деревню', next: 'act2_village', duration: 4000, action: 'walk' },
      { text: '🌲 Бродить по окрестностям', next: 'act2_wander', duration: 5000, action: 'walk' }
    ]
  },

  act2_village: {
    id: 'act2_village',
    depth: 0,
    act: 'act2',
    branch: 'surface2',
    title: 'Act 2: Деревня Слепых Рудокопов',
    text: 'Деревня оказывается больше, чем ты думал. Десятки домов, огороды, колодец в центре. Жители — кто слепой от рождения, кто ослеп в шахтах — живут здесь общей жизнью.\n\nВ центре деревни — площадь с пятью лавками торговцев. Все они собрались здесь, как на ярмарке, что не кончается. Рядом — трактир, где можно отдохнуть. А за деревней — целый мир: на востоке холм со странным сиянием, на западе старое кладбище, на севере — лес, на юге — руины древней крепости.\n\nСтарейшина деревни говорит, что в колодце деревни есть что-то особенное. А в трактире иногда появляются странные путники.',
    ambient: 'village',
    isHub: true,
    choices: [
      { text: '🤝 Подойти к старику-рудокопу', next: 'act2_trader_old', duration: 2000, action: 'walk' },
      { text: '🤝 Подойти к отшельнику', next: 'act2_trader_hermit', duration: 2000, action: 'walk' },
      { text: '🤝 Подойти к кузнецу', next: 'act2_trader_smith', duration: 2000, action: 'walk' },
      { text: '🤝 Подойти к купцу', next: 'act2_trader_merchant', duration: 2000, action: 'walk' },
      { text: '🤝 Подойти к охотнику', next: 'act2_trader_hunter', duration: 2000, action: 'walk' },
      { text: '🛌 Отдохнуть в трактире (+30 HP, 5 золота)', next: '@self', duration: 8000, action: 'observe', requires: { items: { gold: 5 }, minHealth: 1 }, effects: { items: { gold: -5 }, health: 30 } },
      { text: '🍻 Посидеть в трактире (послушать слухи)', next: 'act2_tavern_rumors', duration: 5000, action: 'observe' },
      { text: '👴 Поговорить со старейшиной', next: 'act2_elder', duration: 3000, action: 'walk' },
      { text: '💧 Колодец деревни', next: 'act2_village_well', duration: 2000, action: 'walk' },
      { text: '🌲 Идти в лес (север)', next: 'act2_forest', duration: 5000, action: 'walk' },
      { text: '🪦 Идти на кладбище (запад)', next: 'act2_graveyard', duration: 4000, action: 'walk' },
      { text: '🏰 Идти к руинам крепости (юг)', next: 'act2_fortress', duration: 6000, action: 'walk' },
      { text: '🌄 Идти к сияющему холму (восток)', next: 'act2_hill', duration: 6000, action: 'walk' },
      { text: '🕳️ Старая шахта (запад)', next: 'act2_mineshaft', duration: 3000, action: 'walk' },
      { text: '🏞️ Горная река (юго-восток)', next: 'act2_river', duration: 3000, action: 'walk' },
      { text: '🕳️ Спуститься обратно в шахту (Act 1)', next: 'cave_mouth', duration: 4000, action: 'walk' }
    ]
  },

  // Все торговцы собраны в деревне
  act2_trader_old: {
    id: 'act2_trader_old',
    depth: 0,
    act: 'act2',
    branch: 'surface2',
    title: 'Act 2: Старый рудокоп',
    text: 'Старик сидит у своей лавки, перебирая деревяшки. Он узнаёт тебя по шагам.\n\n— А, это ты. Дошёл до алмазов, значит. Или нет. Я тут сижу, меняю. Что принёс?',
    ambient: 'village',
    isHub: true,
    choices: [
      { text: '🤝 5 дерева → 1 факел', next: '@self', duration: 4000, action: 'trade', requires: { items: { wood: 5 } }, effects: { items: { wood: -5, torch: 1 } } },
      { text: '🤝 3 дерева + 2 камня → Деревянная кирка', next: '@self', duration: 5000, action: 'trade', requires: { items: { wood: 3, stone: 2 }, maxPickaxe: 'wood' }, effects: { items: { wood: -3, stone: -2 }, pickaxeTier: 'wood', flags: ['got_wood_pickaxe'] } },
      { text: '🤝 3 угля → 1 гриб', next: '@self', duration: 4000, action: 'trade', requires: { items: { coal: 3 } }, effects: { items: { coal: -3, mushroom: 1 } } },
      { text: '🤝 5 меди → 1 кожа', next: '@self', duration: 4000, action: 'trade', requires: { items: { copper: 5 } }, effects: { items: { copper: -5, leather: 1 } } },
      { text: '🤝 3 кожи → Кожаная броня', next: '@self', duration: 5000, action: 'trade', requires: { items: { leather: 3 } }, effects: { items: { leather: -3 }, armor: 'leather', flags: ['has_leather_armor'] } },
      { text: '← Вернуться на площадь', next: 'act2_village', duration: 2000, action: 'walk' }
    ]
  },

  act2_trader_hermit: {
    id: 'act2_trader_hermit',
    depth: 0,
    act: 'act2',
    branch: 'surface2',
    title: 'Act 2: Пещерный отшельник',
    text: 'Отшельник покинул свои водные пещеры и теперь живёт в деревне. Но всё ещё носит мокрые тряпки.\n\n— Я принёс с собой всё, что нашёл под водой. Меняйся, если нужно.',
    ambient: 'village',
    isHub: true,
    choices: [
      { text: '🤝 5 железа → Железная броня', next: '@self', duration: 5000, action: 'trade', requires: { items: { iron: 5 } }, effects: { items: { iron: -5 }, armor: 'iron', flags: ['has_iron_armor'] } },
      { text: '🤝 3 дерева + 2 железа → Железная кирка', next: '@self', duration: 5000, action: 'trade', requires: { items: { wood: 3, iron: 2 }, maxPickaxe: 'iron' }, effects: { items: { wood: -3, iron: -2 }, pickaxeTier: 'iron', flags: ['got_iron_pickaxe'] } },
      { text: '🤝 5 меди → 1 гриб', next: '@self', duration: 4000, action: 'trade', requires: { items: { copper: 5 } }, effects: { items: { copper: -5, mushroom: 1 } } },
      { text: '🤝 3 золота → 1 кожа', next: '@self', duration: 4000, action: 'trade', requires: { items: { gold: 3 } }, effects: { items: { gold: -3, leather: 1 } } },
      { text: '← Вернуться на площадь', next: 'act2_village', duration: 2000, action: 'walk' }
    ]
  },

  act2_trader_smith: {
    id: 'act2_trader_smith',
    depth: 0,
    act: 'act2',
    branch: 'surface2',
    title: 'Act 2: Кузнец',
    text: 'Кузнец построил в деревне настоящую кузницу. Жар от его горна чувствуется за десять шагов. Молот стучит по наковальне — звон разносится по всей деревне.\n\n— А, медь принёс? Хорошо. Медь — основа. Из неё куём кирки, броню, лезвия. Но если принесёшь железо — сделаю получше. Алмазы — ещё лучше. А незерит... незерит — это легенда. Говорят, его можно добыть только в Нижнем мире, из древних обломков. Но если принесёшь — выкую тебе снаряжение, которое переживёт дракона.\n\nЧто куём?',
    ambient: 'village',
    isHub: true,
    choices: [
      { text: '🤝 3 дерева + 2 меди → Медная кирка', next: '@self', duration: 5000, action: 'trade', requires: { items: { wood: 3, copper: 2 }, maxPickaxe: 'copper' }, effects: { items: { wood: -3, copper: -2 }, pickaxeTier: 'copper', flags: ['got_copper_pickaxe'] } },
      { text: '🤝 5 меди → Медная броня', next: '@self', duration: 5000, action: 'trade', requires: { items: { copper: 5 } }, effects: { items: { copper: -5 }, armor: 'copper', flags: ['has_copper_armor'] } },
      { text: '🤝 5 железа → Железная броня', next: '@self', duration: 5000, action: 'trade', requires: { items: { iron: 5 } }, effects: { items: { iron: -5 }, armor: 'iron', flags: ['has_iron_armor'] } },
      { text: '🤝 3 дерева + 2 железа → Железная кирка', next: '@self', duration: 5000, action: 'trade', requires: { items: { wood: 3, iron: 2 }, maxPickaxe: 'iron' }, effects: { items: { wood: -3, iron: -2 }, pickaxeTier: 'iron', flags: ['got_iron_pickaxe'] } },
      { text: '🤝 2 дерева → Деревянный меч', next: '@self', duration: 4000, action: 'trade', requires: { items: { wood: 2 } }, effects: { items: { wood: -2, sword_wood: 1 } } },
      { text: '🤝 1 дерево + 2 камня → Каменный меч', next: '@self', duration: 4000, action: 'trade', requires: { items: { wood: 1, stone: 2 } }, effects: { items: { wood: -1, stone: -2, sword_stone: 1 } } },
      { text: '🤝 2 железа → Железный меч', next: '@self', duration: 5000, action: 'trade', requires: { items: { iron: 2 } }, effects: { items: { iron: -2, sword_iron: 1 } } },
      { text: '🤝 2 алмаза → Алмазный меч', next: '@self', duration: 6000, action: 'trade', requires: { items: { diamond: 2 } }, effects: { items: { diamond: -2, sword_diamond: 1 } } },
      { text: '🤝 5 алмазов → Алмазная кирка', next: '@self', duration: 6000, action: 'trade', requires: { items: { diamond: 5 }, maxPickaxe: 'diamond' }, effects: { items: { diamond: -5 }, pickaxeTier: 'diamond', flags: ['got_diamond_pickaxe'] } },
      { text: '🤝 5 алмазов → Алмазная броня', next: '@self', duration: 6000, action: 'trade', requires: { items: { diamond: 5 } }, effects: { items: { diamond: -5 }, armor: 'diamond', flags: ['has_diamond_armor'] } },
      { text: '🤝 1 незерит + 1 алмазный меч → Незеритовый меч', next: '@self', duration: 8000, action: 'trade', requires: { items: { netherite_ingot: 1, sword_diamond: 1 } }, effects: { items: { netherite_ingot: -1, sword_diamond: -1, sword_netherite: 1 } } },
      { text: '🤝 1 незерит + алмазная кирка → Незеритовая кирка', next: '@self', duration: 8000, action: 'trade', requires: { items: { netherite_ingot: 1 }, flag: 'got_diamond_pickaxe', maxPickaxe: 'netherite' }, effects: { items: { netherite_ingot: -1 }, pickaxeTier: 'netherite', flags: ['got_netherite_pickaxe'] } },
      { text: '🤝 1 незерит + алмазная броня → Незеритовая броня', next: '@self', duration: 8000, action: 'trade', requires: { items: { netherite_ingot: 1 }, flag: 'has_diamond_armor' }, effects: { items: { netherite_ingot: -1 }, armor: 'netherite', flags: ['has_netherite_armor'] } },
      { text: '🤝 3 камня → 1 гриб', next: '@self', duration: 4000, action: 'trade', requires: { items: { stone: 3 } }, effects: { items: { stone: -3, mushroom: 1 } } },
      { text: '← Вернуться на площадь', next: 'act2_village', duration: 2000, action: 'walk' }
    ]
  },

  act2_trader_merchant: {
    id: 'act2_trader_merchant',
    depth: 0,
    act: 'act2',
    branch: 'surface2',
    title: 'Act 2: Странствующий торговец',
    text: 'Купец обосновался в деревне — говорит, ему здесь нравится. У него лучшие товары за золото и алмазы.\n\n— Дорогие товары для дорогих клиентов. Что возьмёшь?',
    ambient: 'village',
    isHub: true,
    choices: [
      { text: '🤝 5 алмазов → Алмазная броня', next: '@self', duration: 6000, action: 'trade', requires: { items: { diamond: 5 } }, effects: { items: { diamond: -5 }, armor: 'diamond', flags: ['has_diamond_armor'] } },
      { text: '🤝 3 железа + 2 золота → Железная кирка', next: '@self', duration: 5000, action: 'trade', requires: { items: { iron: 3, gold: 2 }, maxPickaxe: 'iron' }, effects: { items: { iron: -3, gold: -2 }, pickaxeTier: 'iron', flags: ['got_iron_pickaxe'] } },
      { text: '🤝 3 золота → 1 гриб', next: '@self', duration: 4000, action: 'trade', requires: { items: { gold: 3 } }, effects: { items: { gold: -3, mushroom: 1 } } },
      { text: '🤝 3 кожи → Кожаная броня', next: '@self', duration: 5000, action: 'trade', requires: { items: { leather: 3 } }, effects: { items: { leather: -3 }, armor: 'leather', flags: ['has_leather_armor'] } },
      { text: '← Вернуться на площадь', next: 'act2_village', duration: 2000, action: 'walk' }
    ]
  },

  act2_trader_hunter: {
    id: 'act2_trader_hunter',
    depth: 0,
    act: 'act2',
    branch: 'surface2',
    title: 'Act 2: Старый охотник',
    text: 'Охотник покинул свою тропу и теперь живет на окраине деревни. У него всегда есть мясо и стрелы.\n\n— Принёс что-нибудь? Или купить хочешь?',
    ambient: 'village',
    isHub: true,
    choices: [
      { text: '🤝 2 мяса → 1 гриб', next: '@self', duration: 4000, action: 'trade', requires: { items: { meat: 2 } }, effects: { items: { meat: -2, mushroom: 1 } } },
      { text: '🤝 3 мяса → 5 стрел', next: '@self', duration: 4000, action: 'trade', requires: { items: { meat: 3 } }, effects: { items: { meat: -3, arrow: 5 } } },
      { text: '🤝 2 кожи → 3 стрелы', next: '@self', duration: 4000, action: 'trade', requires: { items: { leather: 2 } }, effects: { items: { leather: -2, arrow: 3 } } },
      { text: '🤝 1 мясо + 1 гриб → приготовленная еда', next: '@self', duration: 6000, action: 'craft', requires: { items: { meat: 1, mushroom: 1 } }, effects: { items: { meat: -1, mushroom: -1, food: 1 } } },
      { text: '🤝 5 стрел → 1 мясо', next: '@self', duration: 4000, action: 'trade', requires: { items: { arrow: 5 } }, effects: { items: { arrow: -5, meat: 1 } } },
      { text: '← Вернуться на площадь', next: 'act2_village', duration: 2000, action: 'walk' }
    ]
  },

  act2_wander: {
    id: 'act2_wander',
    depth: 0,
    act: 'act2',
    branch: 'surface2',
    title: 'Act 2: Окрестности деревни',
    text: 'Ты бродишь по окрестностям. Лес, ручей, заброшенные шахты других рудокопов. Где-то вдалеке слышен волчий вой, но близко звери не подходят — чувствуешь, что от тебя пахнет шахтой и алмазами.\n\nНа востоке, за деревней, холм со странным сиянием. На западе — старое кладбище с надгробиями тех, кто не вернулся. На севере — дорога в горы, к другим шахтам.',
    ambient: 'surface',
    choices: [
      { text: '🌄 Идти к сияющему холму', next: 'act2_hill', duration: 6000, action: 'walk' },
      { text: '🪦 Осмотреть старое кладбище', next: 'act2_graveyard', duration: 4000, action: 'walk' },
      { text: '🏠 Вернуться в деревню', next: 'act2_village', duration: 3000, action: 'walk' }
    ]
  },

  act2_graveyard: {
    id: 'act2_graveyard',
    depth: 0,
    act: 'act2',
    branch: 'surface2',
    title: 'Act 2: Старое кладбище',
    text: 'Кладбище рудокопов. Десятки надгробий, многие без имён — просто «Здесь лежит тот, кто не вернулся». На некоторых — символы: кирка, алмаз, факел. На одном, самом старом — символ, которого ты не знаешь. Переплетённые змеи. Тот же, что и на Вратах Испытаний.\n\nПод этим надгробием — не тело. Глубокая яма, уходящая вниз. Кто-то ушёл сюда и не вернулся. Спустился в то, что под кладбищем.\n\nТы слышишь снизу далёкий звон. Не алмазный. Другой. Древний.',
    ambient: 'surface',
    choices: [
      { text: '🔍 Спуститься в яму (нужна кирка)', next: 'act2_crypt_entry', duration: 5000, action: 'walk', requires: { minPickaxe: 'wood' } },
      { text: '← Вернуться к блужданиям', next: 'act2_wander', duration: 3000, action: 'walk' }
    ]
  },

  act2_crypt_entry: {
    id: 'act2_crypt_entry',
    depth: 1,
    act: 'act2',
    branch: 'surface2',
    title: 'Act 2: Склеп Строителей',
    text: 'Яма ведёт в склеп. Стены — тот же гладкий обработанный камень, что и в Испытаниях. Но здесь нет залов — только узкий коридор, ведущий вниз.\n\nНа стенах — рельефы. История Строителей. Они приходили в эти горы тысячи лет назад. Копали, строили, создавали големов. Потом — нашли что-то глубоко. Что-то, что позвало их ниже. В Нижний мир.\n\nКоридор заканчивается дверью. На двери — тот же символ змей. И рукоять. Такие же врата.',
    ambient: 'cave',
    onEnter: { flags: ['found_act2_crypt'] },
    choices: [
      { text: '🔑 Открыть врата (нужна булава или ключ)', next: 'act2_crypt_open', duration: 5000, action: 'observe', requires: { flag: 'got_mace' } },
      { text: '🔑 Открыть врата (нужен ключ испытаний)', next: 'act2_crypt_open', duration: 5000, action: 'observe', requires: { items: { trial_key: 1 } }, effects: { items: { trial_key: -1 } } },
      { text: '← Отступить наверх', next: 'act2_graveyard', duration: 4000, action: 'walk' }
    ]
  },

  act2_crypt_open: {
    id: 'act2_crypt_open',
    depth: 2,
    act: 'act2',
    branch: 'surface2',
    title: 'Act 2: Зал Строителей',
    text: 'Врата открываются. За ними — круглый зал с куполообразным потолком. В центре — каменный столб, на нём — книга. Не бумажная. Каменная, с выбитыми символами.\n\nТы проводишь пальцами по символам. Это история. Строители нашли в Нижнем мире источник силы — обсидиан, что горит синим пламенем. Они строили из него порталы. Они хотели принести эту силу наверх.\n\nНо Нижний мир не отпускает. Строители исчезли — ушли за следующим порталом и не вернулись.\n\nВ книге — рецепт. Обсидиан + огонь = портал. Булава + стержень = ключ к силе Нижнего мира. Ты понимаешь: ты должен собрать обсидиан и построить портал. Это путь в Act 3.',
    ambient: 'cave',
    onEnter: { flags: ['learned_nether_recipe', 'act2Unlocked'] },
    choices: [
      { text: '⛰️ Выйти и искать обсидиан (нужна алмазная кирка)', next: 'act2_obsidian_quest', duration: 4000, action: 'walk', requires: { minPickaxe: 'diamond' } },
      { text: '← Выйти из склепа', next: 'act2_graveyard', duration: 4000, action: 'walk' }
    ]
  },

  act2_hill: {
    id: 'act2_hill',
    depth: 0,
    act: 'act2',
    branch: 'surface2',
    title: 'Act 2: Сияющий холм',
    text: 'Холм возвышается над деревней. На его вершине — древнее сооружение: каменное кольцо, в центре которого — плита. На плите — символ переплетённых змей. Это то же место, что и Врата в шахте, но больше. Намного больше.\n\nПлита холодная. Но когда ты касаешься её с булавой в руке — она теплеет. Символы начинают мерцать.\n\nГолос — нет, мысль — в твоей голове:\n\n— Тот, кто держит Булаву Ветров, может открыть большой путь. Но для этого нужно топливо. Обсидиан. Много обсидиана. И алмазная кирка, чтобы его добыть.\n\nЭто — путь в Нижний мир. Act 3.',
    ambient: 'surface',
    onEnter: { flags: ['found_act2_hill', 'act2Unlocked'] },
    choices: [
      { text: '⛏️ Искать обсидиан (нужна алмазная кирка)', next: 'act2_obsidian_quest', duration: 4000, action: 'walk', requires: { minPickaxe: 'diamond' } },
      { text: '🏠 Вернуться в деревню', next: 'act2_village', duration: 4000, action: 'walk' }
    ]
  },

  act2_obsidian_quest: {
    id: 'act2_obsidian_quest',
    depth: 3,
    act: 'act2',
    branch: 'surface2',
    title: 'Act 2: Поиски обсидиана',
    text: 'Обсидиан — чёрное вулканическое стекло. Ты помнишь: на Пути Жара в шахте были залежи чего-то похожего. Ты возвращаешься в шахту, к лаве.\n\nДействительно: у самого края лавового потока, где камень встречается с огнём, ты нащупываешь гладкие чёрные плиты. Обсидиан. Только алмазная кирка может её разбить.\n\nТы работаешь долго. Жар, удары, искры. Но постепенно — четыре куска обсидиана в твоей сумке.',
    ambient: 'lava',
    onEnter: { items: { obsidian: 4 }, flags: ['got_obsidian'], health: -20 },
    choices: [
      { text: '🌅 Подняться к холму с обсидианом', next: 'act2_portal_build', duration: 6000, action: 'walk' }
    ]
  },

  act2_portal_build: {
    id: 'act2_portal_build',
    depth: 0,
    act: 'act2',
    branch: 'surface2',
    title: 'Act 2: Постройка портала',
    text: 'Ты возвращаешься на холм с четырьмя кусками обсидиана. Кладёшь их на плиту. Булава в руке начинает гудеть.\n\nСимволы на плите вспыхивают синим. Обсидиан раскаляется, плавится, но не разрушается — он формируется в рамку. Рамка портала.\n\nТы подносишь факел к рамке. Вспышка. Внутри рамки — фиолетовое мерцание. Портал. Дорога вниз.\n\nГолос в голове:\n\n— Готов. Нижный мир примет тебя. Если ты готов — шагни.',
    ambient: 'nether',
    onEnter: { flags: ['portal_built'], items: { obsidian: -4 } },
    choices: [
      { text: '🌋 Шагнуть в портал (Act 3)', next: 'nether_entry', duration: 5000, action: 'walk' },
      { text: '🏠 Сначала вернуться в деревню', next: 'act2_village', duration: 4000, action: 'walk' }
    ]
  },

  ending_act2_complete: {
    id: 'ending_act2_complete',
    depth: 6,
    act: 'act2',
    branch: 'trials',
    title: 'Act 2: Портал открыт',
    text: 'Ты стоишь перед фиолетовым мерцанием портала. За ним — Нижний мир. Ад. Преисподняя.\n\nСтроители шли туда и не вернулись. Но у тебя есть то, чего не было у них: знание из их книги, булава, стержень ветра, и — главное — опыт двух актов за плечами.\n\nТы слеп. Но ты слышишь Нижний мир: треск огня, вой гастов, далёкие шаги пиглинов. Он зовёт тебя.\n\nТы делаешь шаг. Нижный мир ждёт.',
    ambient: 'nether',
    isEnding: 'victory',
    choices: [
      { text: '🌋 Шагнуть в портал (Act 3)', next: 'nether_entry', duration: 5000, action: 'walk' },
      { text: 'Начать Act 1 заново', next: 'start', duration: 2000, action: 'walk' }
    ]
  },

  // ============================================================
  //  ACT 2 · РАСШИРЕННЫЙ КОНТЕНТ (v2.6) — +20 сцен
  // ============================================================

  // ===== Трактир — слухи =====
  act2_tavern_rumors: {
    id: 'act2_tavern_rumors',
    depth: 0,
    act: 'act2',
    branch: 'surface2',
    title: 'Act 2: Трактир «Слепой Крот»',
    text: 'Трактир «Слепой Крот» — низкий потолок, дым от факелов, гул голосов. Ты садитесь за стойку. Трактирщик, тоже слепой, наливает тебе что-то горячее.\n\n— Слыхал, в лесу объявились волки-оборотни. А на кладбище кто-то копается по ночам. А ещё... говорят, в старой крепости живёт кто-то. Не человек. И не зверь.\n\nТы прислушиваешься к разговорам. Кто-то упоминает «камень луны», который светится в полнолуние. Кто-то — о подземном озере под деревней. Кто-то — о странном путнике, что приходил сюда год назад с булавой.',
    ambient: 'village',
    isHub: true,
    choices: [
      { text: '🍻 Заказать эль (1 золото, +10 HP)', next: '@self', duration: 4000, action: 'observe', requires: { items: { gold: 1 } }, effects: { items: { gold: -1 }, health: 10 } },
      { text: '🥩 Заказать ужин (2 золота, +25 HP)', next: '@self', duration: 6000, action: 'observe', requires: { items: { gold: 2 } }, effects: { items: { gold: -2 }, health: 25 } },
      { text: '🎲 Сыграть в кости (5 золота)', next: 'act2_dice_game', duration: 5000, action: 'observe', requires: { items: { gold: 5 } } },
      { text: '🧙 Поговорить со странным путником', next: 'act2_stranger', duration: 4000, action: 'walk', requires: { flag: 'met_stranger' } },
      { text: '← Вернуться на площадь', next: 'act2_village', duration: 2000, action: 'walk' }
    ]
  },

  act2_dice_game: {
    id: 'act2_dice_game',
    depth: 0,
    act: 'act2',
    branch: 'surface2',
    title: 'Act 2: Игра в кости',
    text: 'Трактирщик достаёт три кости из старого кожаного мешочка. Правила просты: кто выбросит больше — тот и выиграл. Ставка — 5 золота. Выиграешь — получишь 15. Проиграешь — прощаешься со своим.\n\nТы слепой. Но кости — они звучат. И ты чувствуешь их вес. Может, удача на твоей стороне?',
    ambient: 'village',
    choices: [
      { text: '🎲 Бросить кости', next: 'act2_dice_roll', duration: 3000, action: 'observe' },
      { text: '← Отказаться', next: 'act2_tavern_rumors', duration: 2000, action: 'walk' }
    ]
  },

  act2_dice_roll: {
    id: 'act2_dice_roll',
    depth: 0,
    act: 'act2',
    branch: 'surface2',
    title: 'Act 2: Бросок',
    text: 'Кости стучат по столу. Ты слышишь их вращение, замедление, остановку. Трактирщик считает.\n\n— Семь! — кричит он. — У тебя семь.\n\nПотом бросает сам. Его кости крутятся дольше. Пять. Он проиграл.\n\n— Ну, удача тебе сегодня благоволит. Вот твои пятнадцать золотых. Заходи ещё.',
    ambient: 'village',
    onEnter: { items: { gold: 10 }, flags: ['won_dice'] },  // -5 ставка +15 выигрыш = +10
    choices: [
      { text: '🎲 Сыграть ещё раз (5 золота)', next: 'act2_dice_game', duration: 3000, action: 'observe', requires: { items: { gold: 5 } } },
      { text: '← Вернуться в трактир', next: 'act2_tavern_rumors', duration: 2000, action: 'walk' }
    ]
  },

  // ===== Старейшина =====
  act2_elder: {
    id: 'act2_elder',
    depth: 0,
    act: 'act2',
    branch: 'surface2',
    title: 'Act 2: Старейшина деревни',
    text: 'Старейшина — древний старик, старше всех в деревне. Говорят, он помнит времена Строителей. Он сидит у своего дома, перебирая чётки из обсидиана.\n\n— А, прохожий. Я чувствую в тебе силу. Булава Ветров? Или алмазы? Не важно. Важно — что ты ищешь дальше.\n\nЯ расскажу тебе, что знаю. О лесе, о крепости, о колодце. Но сначала — ответь: зачем ты здесь?',
    ambient: 'village',
    isHub: true,
    onEnter: { flags: ['met_elder'] },
    choices: [
      { text: '👴 Расскажи о лесе', next: '@self', duration: 3000, action: 'observe', requires: { notFlag: 'elder_forest' }, effects: { flags: ['elder_forest'] } },
      { text: '🏰 Расскажи о крепости', next: '@self', duration: 3000, action: 'observe', requires: { notFlag: 'elder_fortress' }, effects: { flags: ['elder_fortress'] } },
      { text: '💧 Расскажи о колодце', next: '@self', duration: 3000, action: 'observe', requires: { notFlag: 'elder_well' }, effects: { flags: ['elder_well'] } },
      { text: '🌙 Расскажи о камне луны', next: '@self', duration: 3000, action: 'observe', requires: { notFlag: 'elder_moonstone' }, effects: { flags: ['elder_moonstone'] } },
      { text: '📜 Расскажи о Строителях', next: '@self', duration: 4000, action: 'observe', requires: { flag: 'learned_nether_recipe', notFlag: 'elder_builders' }, effects: { flags: ['elder_builders'] } },
      { text: '← Вернуться на площадь', next: 'act2_village', duration: 2000, action: 'walk' }
    ]
  },

  // ===== Колодец деревни =====
  act2_village_well: {
    id: 'act2_village_well',
    depth: 0,
    act: 'act2',
    branch: 'surface2',
    title: 'Act 2: Колодец деревни',
    text: 'Колодец в центре деревни — старый, каменный, с деревянным воротом. Но вода в нём не простая. Старейшина говорил: колодец связан с подземным озером, тем, что под всей деревней. Кто пьёт — восстанавливает силы. Кто бросает монету — загадывает желание.\n\nИногда из колодца доносится далёкий звон. Не алмазный. Другой. Будто кто-то звонит в колокольчик глубоко внизу.',
    ambient: 'village',
    isHub: true,
    choices: [
      { text: '💧 Попить воды (+20 HP)', next: '@self', duration: 4000, action: 'observe', requires: { notFlag: 'drank_village_well' }, effects: { health: 20, flags: ['drank_village_well'] } },
      { text: '🪙 Бросить монету (1 золото) и загадать', next: 'act2_wish', duration: 3000, action: 'observe', requires: { items: { gold: 1 }, notFlag: 'made_wish' }, effects: { items: { gold: -1 } } },
      { text: '🔊 Прислушаться к звону', next: 'act2_well_listen', duration: 5000, action: 'observe', requires: { notFlag: 'heard_well_bell' } },
      { text: '← Вернуться на площадь', next: 'act2_village', duration: 2000, action: 'walk' }
    ]
  },

  act2_wish: {
    id: 'act2_wish',
    depth: 0,
    act: 'act2',
    branch: 'surface2',
    title: 'Act 2: Желание',
    text: 'Ты бросаешь монету в колодец. Слышишь, как она падает в воду — долго, долго. Потом — всплеск. И через секунду — далёкий звон. Будто колокольчик ответил.\n\nЧто-то изменилось. Может, это просто совпадение. А может — желание сбудется. Ты чувствуешь лёгкое тепло в груди.',
    ambient: 'village',
    onEnter: { flags: ['made_wish'], health: 15 },
    choices: [
      { text: '← Вернуться к колодцу', next: 'act2_village_well', duration: 2000, action: 'walk' }
    ]
  },

  act2_well_listen: {
    id: 'act2_well_listen',
    depth: 0,
    act: 'act2',
    branch: 'surface2',
    title: 'Act 2: Звон из колодца',
    text: 'Ты наклоняешься над колодцем, прислушиваешься. Сначала — только эхо воды. Потом — да, точно. Звон. Тонкий, чистый, как хор крошечных колокольчиков. Но не алмазный — другой, древнее.\n\nГолос — нет, мысль — в твоей голове:\n\n— Ты слышишь нас. Мы — те, кто остался внизу. Строители, что не ушли в Нижний мир. Мы ждём. Когда будешь готов — найди нас.\n\nЗвон стихает. Ты поднимаешь голову. Вода в колодце снова просто вода.',
    ambient: 'village',
    onEnter: { flags: ['heard_well_bell'] },
    choices: [
      { text: '← Вернуться к колодцу', next: 'act2_village_well', duration: 2000, action: 'walk' }
    ]
  },

  // ===== Лес =====
  act2_forest: {
    id: 'act2_forest',
    depth: 0,
    act: 'act2',
    branch: 'surface2',
    title: 'Act 2: Тёмный лес',
    text: 'Лес к северу от деревни — старый, тёмный. Деревья здесь огромные, с корой, покрытой мхом и лишайником. Между ними — тропинки, протоптанные не людьми. Здесь водятся волки, кабаны, и — говорят — оборотни в полнолуние.\n\nНо здесь же растут грибы, ягоды, лечебные травы. И где-то в глубине леса, по слухам, есть поляна с лунным камнем — он светится в полнолуние и даёт силу.',
    ambient: 'surface',
    choices: [
      { text: '🍄 Собрать грибы (3с)', next: 'act2_forest_mushrooms', duration: 3000, action: 'mine', requires: { notFlag: 'forest_mushrooms' } },
      { text: '🌿 Собрать травы (3с)', next: 'act2_forest_herbs', duration: 3000, action: 'mine', requires: { notFlag: 'forest_herbs' } },
      { text: '🐺 Искать поляну лунного камня', next: 'act2_forest_glade', duration: 6000, action: 'walk', requires: { flag: 'elder_moonstone' } },
      { text: '🐗 Охотиться на кабана', next: 'act2_forest_boar', duration: 5000, action: 'combat' },
      { text: '🌲 Идти глубже в лес', next: 'act2_forest_deep', duration: 6000, action: 'walk', requires: { flag: 'forest_herbs' } },
      { text: '← Вернуться в деревню', next: 'act2_village', duration: 4000, action: 'walk' }
    ]
  },

  act2_forest_mushrooms: {
    id: 'act2_forest_mushrooms',
    depth: 0,
    act: 'act2',
    branch: 'surface2',
    title: 'Act 2: Грибы',
    text: 'Ты нащупываешь грибы у основания старого дуба. Не светящиеся, как в шахте, но съедобные. Корзинка заполняется быстро — пять штук. Хватит на ужин.\n\nСтарейшина говорил: лесные грибы полезнее шахтных. Не светятся, но лечат.',
    ambient: 'surface',
    onEnter: { items: { mushroom: 3 }, flags: ['forest_mushrooms'] },
    choices: [
      { text: '← Вернуться к тропе', next: 'act2_forest', duration: 2000, action: 'walk' }
    ]
  },

  act2_forest_herbs: {
    id: 'act2_forest_herbs',
    depth: 0,
    act: 'act2',
    branch: 'surface2',
    title: 'Act 2: Лечебные травы',
    text: 'Ты собираешь травы: ромашку, зверобой, мяту. Старейшина учил: заварить и выпить — снимает усталость, восстанавливает силы. Не так эффективно, как грибы, но всегда под рукой.\n\nВ сумке теперь пучок трав. Можно заварить у любого костра.',
    ambient: 'surface',
    onEnter: { items: { mushroom: 2 }, flags: ['forest_herbs'] },  // травы действуют как грибы
    choices: [
      { text: '← Вернуться к тропе', next: 'act2_forest', duration: 2000, action: 'walk' }
    ]
  },

  act2_forest_glade: {
    id: 'act2_forest_glade',
    depth: 0,
    act: 'act2',
    branch: 'surface2',
    title: 'Act 2: Поляна лунного камня',
    text: 'Ты находишь поляну. В центре — камень, размером с кулак. Он не светится сейчас — день. Но старейшина говорил: в полнолуние он загорается серебром, и тот, кто держит его, становится сильнее.\n\nТы берёшь камень. Он холодный, гладкий. В пальцах — лёгкая вибрация. Это артефакт Строителей, как и булава. Может быть, он пригодится для портала.',
    ambient: 'surface',
    onEnter: { items: { nether_star: 1 }, flags: ['got_moonstone'] },
    choices: [
      { text: '← Вернуться к тропе', next: 'act2_forest', duration: 3000, action: 'walk' }
    ]
  },

  act2_forest_boar: {
    id: 'act2_forest_boar',
    depth: 0,
    act: 'act2',
    branch: 'surface2',
    title: 'Act 2: Кабан',
    text: 'Ты слышишь хрюканье и топот. Кабан — крупный, с клыками. Он тебя не чует, но если почует — может броситься.\n\nТы подкрадываешься с подветренной стороны. Удар булавой — и зверь падает. Много мяса, но и ты потрёпан — кабан успел боднуть тебя в бок.',
    ambient: 'monster',
    onEnter: { items: { meat: 5, leather: 1 }, health: -15, flags: ['hunted_boar'] },
    choices: [
      { text: '← Вернуться к тропе', next: 'act2_forest', duration: 3000, action: 'walk' }
    ]
  },

  act2_forest_deep: {
    id: 'act2_forest_deep',
    depth: 1,
    act: 'act2',
    branch: 'surface2',
    title: 'Act 2: Глубокий лес',
    text: 'Тропинка ведёт всё глубже. Деревья здесь ещё старше, между корнями — странные камни с символами. Это не природные камни — кто-то их поставил. Давно.\n\nТы выходишь к небольшому святилищу: каменный круг, в центре — алтарь. На алтаре — чаша, как в Испытаниях. Но пустая.\n\nНа алтаре — надпись: «Принеси огонь, воду, землю и воздух. Получишь благословение леса.»',
    ambient: 'surface',
    isHub: true,
    onEnter: { flags: ['found_forest_shrine'] },
    choices: [
      { text: '🔥 Положить факел (огонь)', next: 'act2_shrine_fire', duration: 3000, action: 'observe', requires: { items: { torch: 1 }, notFlag: 'shrine_fire' }, effects: { items: { torch: -1 }, flags: ['shrine_fire'] } },
      { text: '💧 Положить воду (нужно сходить к колодцу)', next: '@self', duration: 1000, action: 'observe', requires: { notFlag: 'shrine_water' } },
      { text: '🪨 Положить камень (земля)', next: 'act2_shrine_earth', duration: 3000, action: 'observe', requires: { items: { stone: 1 }, notFlag: 'shrine_earth' }, effects: { items: { stone: -1 }, flags: ['shrine_earth'] } },
      { text: '🌀 Положить стержень ветра (воздух)', next: 'act2_shrine_air', duration: 3000, action: 'observe', requires: { items: { breeze_rod: 1 }, notFlag: 'shrine_air' }, effects: { items: { breeze_rod: -1 }, flags: ['shrine_air'] } },
      { text: '✨ Активировать алтарь (все 4 элемента)', next: 'act2_shrine_blessing', duration: 5000, action: 'observe', requires: { flag: 'shrine_fire', notFlag: 'shrine_water' } },
      { text: '← Вернуться к тропе', next: 'act2_forest', duration: 4000, action: 'walk' }
    ]
  },

  act2_shrine_fire: {
    id: 'act2_shrine_fire',
    depth: 1,
    act: 'act2',
    branch: 'surface2',
    title: 'Act 2: Алтарь — огонь',
    text: 'Ты кладёшь факел в чашу. Он вспыхивает — но не сгорает. Пламя застывает, превращается в камень. Огненный элемент принят.\n\nАлтарь гудит. Осталось три элемента: вода, земля, воздух.',
    ambient: 'surface',
    choices: [
      { text: '← Вернуться к алтарю', next: 'act2_forest_deep', duration: 2000, action: 'walk' }
    ]
  },

  act2_shrine_earth: {
    id: 'act2_shrine_earth',
    depth: 1,
    act: 'act2',
    branch: 'surface2',
    title: 'Act 2: Алтарь — земля',
    text: 'Ты кладёшь камень в чашу. Он тонет в свете, исчезает. Земной элемент принят.\n\nАлтарь гудит сильнее.',
    ambient: 'surface',
    choices: [
      { text: '← Вернуться к алтарю', next: 'act2_forest_deep', duration: 2000, action: 'walk' }
    ]
  },

  act2_shrine_air: {
    id: 'act2_shrine_air',
    depth: 1,
    act: 'act2',
    branch: 'surface2',
    title: 'Act 2: Алтарь — воздух',
    text: 'Ты кладёшь стержень ветра в чашу. Он начинает вращаться, поднимается, исчезает в воздухе. Воздушный элемент принят.\n\nАлтарь гудит. Осталась вода.',
    ambient: 'surface',
    choices: [
      { text: '← Вернуться к алтарю', next: 'act2_forest_deep', duration: 2000, action: 'walk' }
    ]
  },

  act2_shrine_blessing: {
    id: 'act2_shrine_blessing',
    depth: 1,
    act: 'act2',
    branch: 'surface2',
    title: 'Act 2: Благословение леса',
    text: 'Ты принёс огонь, землю и воздух. Но нет воды. Алтарь не активируется полностью.\n\nСтарейшина говорил: вода из колодца деревни — особенная. Может, принести её сюда? Но как нести воду в руках?',
    ambient: 'surface',
    choices: [
      { text: '← Вернуться к алтарю', next: 'act2_forest_deep', duration: 2000, action: 'walk' }
    ]
  },

  // ===== Руины крепости =====
  act2_fortress: {
    id: 'act2_fortress',
    depth: 0,
    act: 'act2',
    branch: 'surface2',
    title: 'Act 2: Руины крепости',
    text: 'К югу от деревни — руины старой крепости. Стены обрушены, башни накренились. Но подвалы — целы. Говорят, там живёт кто-то. Не человек. Не зверь. Что-то древнее.\n\nСтарейшина говорил, что в подвалах крепости хранится обсидиан — настоящий, не как в шахте. И что тот, кто пройдёт через подвалы, найдёт путь к нижнему озеру.',
    ambient: 'cave',
    choices: [
      { text: '🏰 Войти в крепость', next: 'act2_fortress_hall', duration: 4000, action: 'walk' },
      { text: '🔍 Осмотреть руины', next: 'act2_fortress_ruins', duration: 5000, action: 'observe', requires: { notFlag: 'searched_ruins' } },
      { text: '← Вернуться в деревню', next: 'act2_village', duration: 5000, action: 'walk' }
    ]
  },

  act2_fortress_ruins: {
    id: 'act2_fortress_ruins',
    depth: 0,
    act: 'act2',
    branch: 'surface2',
    title: 'Act 2: Руины',
    text: 'Ты бродишь среди руин. Камни, обломки, старые кости. В одном углу — заваленный проход. В другом — странный сундук, полуразрушенный.\n\nВ сундуке — немного золота и старая карта. На карте — подземное озеро под крепостью. И путь к нему — через подвалы.',
    ambient: 'cave',
    onEnter: { items: { gold: 3 }, flags: ['searched_ruins', 'found_fortress_map'] },
    choices: [
      { text: '🏰 Войти в крепость', next: 'act2_fortress_hall', duration: 4000, action: 'walk' },
      { text: '← Вернуться в деревню', next: 'act2_village', duration: 5000, action: 'walk' }
    ]
  },

  act2_fortress_hall: {
    id: 'act2_fortress_hall',
    depth: 1,
    act: 'act2',
    branch: 'surface2',
    title: 'Act 2: Главный зал крепости',
    text: 'Ты входишь в главный зал. Потолок обрушен, но стены держатся. В центре — старый трон, на нём — скелет в ржавых доспехах. Бывший лорд крепости.\n\nВ дальнем конце зала — два прохода. Левый ведёт вниз, в подвалы. Правый — завален, но если расчистить, можно пройти.\n\nГде-то внизу слышен плеск воды. Подземное озеро.',
    ambient: 'cave',
    choices: [
      { text: '👇 Спуститься в подвалы', next: 'act2_fortress_cellar', duration: 4000, action: 'walk' },
      { text: '🪓 Расчистить правый проход (нужна кирка)', next: 'act2_fortress_collapse', duration: 8000, action: 'mine', requires: { minPickaxe: 'iron' } },
      { text: '🔍 Осмотреть скелет лорда', next: 'act2_fortress_lord', duration: 3000, action: 'observe', requires: { notFlag: 'searched_lord' } },
      { text: '← Выйти из крепости', next: 'act2_fortress', duration: 3000, action: 'walk' }
    ]
  },

  act2_fortress_lord: {
    id: 'act2_fortress_lord',
    depth: 1,
    act: 'act2',
    branch: 'surface2',
    title: 'Act 2: Скелет лорда',
    text: 'Ты ощупываешь скелет. Ржавые доспехи, истлевший плащ. В руках — меч, давно превратившийся в труху. Но на шее — амулет. Каменный, с символом переплетённых змей. Тот же, что на Вратах Испытаний.\n\nЛорд крепости был одним из Строителей? Или их последователем? Амулет тёплый. Ты забираешь его.',
    ambient: 'cave',
    onEnter: { items: { vault_loot: 2 }, flags: ['searched_lord', 'got_lord_amulet'] },
    choices: [
      { text: '← Вернуться в зал', next: 'act2_fortress_hall', duration: 2000, action: 'walk' }
    ]
  },

  act2_fortress_collapse: {
    id: 'act2_fortress_collapse',
    depth: 1,
    act: 'act2',
    branch: 'surface2',
    title: 'Act 2: Расчищенный проход',
    text: 'Ты долго работаешь киркой. Камни падают, пыль стоит столбом. Но проход расчищен.\n\nЗа ним — маленькая комната. В центре — сундук. Настоящий, не разрушенный. В нём — обсидиан! Три куска. Тот самый, что нужен для портала.\n\nСтарейшина был прав: в крепости хранился обсидиан.',
    ambient: 'cave',
    onEnter: { items: { obsidian: 3 }, flags: ['got_fortress_obsidian'] },
    choices: [
      { text: '← Вернуться в зал', next: 'act2_fortress_hall', duration: 2000, action: 'walk' }
    ]
  },

  act2_fortress_cellar: {
    id: 'act2_fortress_cellar',
    depth: 2,
    act: 'act2',
    branch: 'surface2',
    title: 'Act 2: Подвалы крепости',
    text: 'Подвалы — холодные, сырые. Вода капает с потолка. Ты идёшь по узким коридорам, мимо старых бочек и гниющих ящиков.\n\nКоридор приводит к большой двери. Деревянной, окованной железом. За ней — звук воды. Много воды. Подземное озеро.\n\nНо дверь заперта. На ней — замок. Сложный, с четырьмя ключами. Где их искать?',
    ambient: 'cave',
    choices: [
      { text: '🔓 Попробовать открыть (нужны 4 ключа)', next: 'act2_lake_entry', duration: 3000, action: 'observe', requires: { flag: 'got_lake_keys' } },
      { text: '🔍 Осмотреть подвалы', next: 'act2_cellar_search', duration: 5000, action: 'observe', requires: { notFlag: 'searched_cellar' } },
      { text: '← Вернуться в зал', next: 'act2_fortress_hall', duration: 4000, action: 'walk' }
    ]
  },

  act2_cellar_search: {
    id: 'act2_cellar_search',
    depth: 2,
    act: 'act2',
    branch: 'surface2',
    title: 'Act 2: Поиск в подвалах',
    text: 'Ты обыскиваешь подвалы. В одной из комнат — старый сундук с двумя ключами. В другой — скелет с третьим ключом в руке. Четвёртый ключ — за камнем, который нужно отодвинуть.\n\nТеперь у тебя все четыре. Дверь к подземному озеру открыта.',
    ambient: 'cave',
    onEnter: { flags: ['searched_cellar', 'got_lake_keys'] },
    choices: [
      { text: '🔓 Открыть дверь к озеру', next: 'act2_lake_entry', duration: 3000, action: 'walk' },
      { text: '← Вернуться в зал', next: 'act2_fortress_hall', duration: 4000, action: 'walk' }
    ]
  },

  act2_lake_entry: {
    id: 'act2_lake_entry',
    depth: 3,
    act: 'act2',
    branch: 'surface2',
    title: 'Act 2: Подземное озеро',
    text: 'Дверь открывается. За ней — огромное озеро, освещённое синими кристаллами в стенах. Вода — прозрачная, холодная. В центре озера — остров. На острове — каменный столб, как в склепе Строителей.\n\nЭто то самое место. Здесь можно активировать портал, если у тебя есть обсидиан и булава. Или — просто отдохнуть у воды, восстановив силы.',
    ambient: 'water',
    isHub: true,
    choices: [
      { text: '💧 Попить из озера (+40 HP)', next: '@self', duration: 5000, action: 'observe', requires: { notFlag: 'drank_lake' }, effects: { health: 40, flags: ['drank_lake'] } },
      { text: '🚣 Плыть к острову', next: 'act2_lake_island', duration: 6000, action: 'walk' },
      { text: '🔮 Активировать портал (нужен обсидиан + булава)', next: 'act2_portal_ritual', duration: 8000, action: 'observe', requires: { items: { obsidian: 4 }, flag: 'got_mace' } },
      { text: '← Вернуться в подвалы', next: 'act2_fortress_cellar', duration: 4000, action: 'walk' }
    ]
  },

  act2_lake_island: {
    id: 'act2_lake_island',
    depth: 3,
    act: 'act2',
    branch: 'surface2',
    title: 'Act 2: Остров на озере',
    text: 'Ты плывёшь к острову. Вода холодная, но ты справляешься. На острове — каменный столб с чашей. В чаше — звезда Нужера. Настоящая, не заготовка. Она светится мягким фиолетовым светом.\n\nЭто то, что нужно для Act 3. Звезда Нужера — ключ к силе Нижнего мира. Без неё портал будет просто дверью. С ней — дорогой домой.',
    ambient: 'water',
    onEnter: { items: { nether_star: 1 }, flags: ['got_nether_star'] },
    choices: [
      { text: '← Вернуться к берегу', next: 'act2_lake_entry', duration: 6000, action: 'walk' }
    ]
  },

  act2_portal_ritual: {
    id: 'act2_portal_ritual',
    depth: 3,
    act: 'act2',
    branch: 'surface2',
    title: 'Act 2: Ритуал портала',
    text: 'Ты кладёшь обсидиан в чашу на острове. Булава в руке гудит. Синие кристаллы в стенах вспыхивают ярче.\n\nОгонь от булавы касается обсидиана. Вспышка. Чаша поднимается в воздух, вращается. Обсидиан плавится, формирует рамку. Внутри рамки — фиолетовое мерцание.\n\nПортал открыт. Но не здесь — на холме. Этот ритуал активировал тот, главный портал. Иди к холму.',
    ambient: 'nether',
    onEnter: { flags: ['portal_built', 'learned_nether_recipe'], items: { obsidian: -4 } },
    choices: [
      { text: '← Вернуться к берегу', next: 'act2_lake_entry', duration: 6000, action: 'walk' },
      { text: '🌄 Идти к холму', next: 'act2_hill', duration: 8000, action: 'walk' }
    ]
  },

  // ===== Странный путник =====
  act2_stranger: {
    id: 'act2_stranger',
    depth: 0,
    act: 'act2',
    branch: 'surface2',
    title: 'Act 2: Странный путник',
    text: 'В углу трактира сидит фигура в капюшоне. Не слепая — глаза горят синим. Это не человек. Это — Строитель. Один из тех, кто остался.\n\n— Я ждал тебя. С тех пор как ты услышал звон в колодце. Мы — те, кто не ушёл в Нижний мир. Мы ждём, когда кто-то откроет портал и закончит то, что мы начали.\n\nУ меня есть для тебя дар. И тайна.',
    ambient: 'village',
    onEnter: { flags: ['met_stranger'] },
    choices: [
      { text: '🎁 Принять дар', next: 'act2_stranger_gift', duration: 3000, action: 'observe', requires: { notFlag: 'got_stranger_gift' } },
      { text: '📜 Рассказать тайну', next: 'act2_stranger_secret', duration: 5000, action: 'observe', requires: { notFlag: 'heard_stranger_secret' } },
      { text: '← Вернуться в трактир', next: 'act2_tavern_rumors', duration: 2000, action: 'walk' }
    ]
  },

  act2_stranger_gift: {
    id: 'act2_stranger_gift',
    depth: 0,
    act: 'act2',
    branch: 'surface2',
    title: 'Act 2: Дар Строителя',
    text: 'Путник протягивает тебе камень. Маленький, синий, мерцающий. Это — кристалл силы. Тот, кто носит его, восстанавливает здоровье быстрее.\n\n— Носи с собой. Когда будет тяжело — сожми в руке, и силы вернутся.\n\nКамень тёплый. Ты чувствуешь, как от него идёт спокойная, ровная сила.',
    ambient: 'village',
    onEnter: { items: { mushroom: 5 }, flags: ['got_stranger_gift'] },  // кристалл действует как 5 грибов
    choices: [
      { text: '← Вернуться к путнику', next: 'act2_stranger', duration: 2000, action: 'walk' }
    ]
  },

  act2_stranger_secret: {
    id: 'act2_stranger_secret',
    depth: 0,
    act: 'act2',
    branch: 'surface2',
    title: 'Act 2: Тайна Строителя',
    text: 'Путник наклоняется ближе.\n\n— Слушай. Нижний мир — не ад. Не преисподняя. Это — дом. Наш дом. Мы ушли туда не за силой, а за правдой. Там — ответы на все вопросы.\n\nНо Нижний мир не прощает слабых. Нужна звезда Нужера. Нужна булава. Нужен обсидиан. И — нужно желание узнать правду.\n\nТы готов? Когда откроешь портал — не будет пути назад. Но будет путь домой.',
    ambient: 'village',
    onEnter: { flags: ['heard_stranger_secret', 'learned_nether_recipe'] },
    choices: [
      { text: '← Вернуться к путнику', next: 'act2_stranger', duration: 2000, action: 'walk' }
    ]
  },

  // ============================================================
  //  ACT 3 · THE NETHER (v3.0) — полный Нижний мир
  //  Объём ≈ Act 1 + Act 2, ~35 сцен
  // ============================================================

  // ===== Вход в Ад =====
  nether_entry: {
    id: 'nether_entry',
    depth: 0,
    act: 'act3',
    branch: 'nether',
    title: 'Act 3: Нижний мир',
    text: 'Фиолетовое мерцание портала обволакивает тебя. На секунду — ничего. Ни звука, ни света, ни боли. Потом — удар. Жар. Запах серы. И гул, гул, гул, как будто ты внутри огромного горна.\n\nТы открываешь глаза. Но ты слепой — ты не открываешь глаза. Ты слышишь.\n\nИ слышишь многое. Треск лавы повсюду. Далёкий вой чего-то летающего. Шипение огня. И — крики. Не человеческие. Звериные, но мудрые. Пиглины. Они где-то рядом.\n\nНижний мир. Ты здесь. Это — дом Строителей. И теперь — твой дом тоже.',
    ambient: 'lava',
    onEnter: { flags: ['nether_entered', 'act3Unlocked'] },
    choices: [
      { text: '🌋 Осмотреться', next: 'nether_expanse', duration: 4000, action: 'observe' }
    ]
  },

  nether_expanse: {
    id: 'nether_expanse',
    depth: 0,
    act: 'act3',
    branch: 'nether',
    title: 'Act 3: Незеракские пустоши',
    text: 'Ты стоишь на краю огромной пещеры. Стены — из незерака, красного, шершавого, тёплого. Потолок высоко, но везде — сталактиты из светокамени, мерцающие жёлтым. Под ногами — то камень, то лава, то песок душ, который шепчет, когда наступаешь.\n\nТри пути. На востоке — далёкое зарево, как от огромного костра. На западе — звуки боя, крики пиглинов. На севере — тишина, но что-то древнее, тяжёлое.\n\nГде-то здесь, говорят, Адская крепость. И в ней — стержни ифритов. И черепа иссушителей. И — настоящая звезда Нужера.',
    ambient: 'lava',
    isHub: true,
    choices: [
      { text: '🔥 На восток (зарево)', next: 'nether_lava_sea', duration: 5000, action: 'walk' },
      { text: '⚔️ На запад (бой пиглинов)', next: 'nether_piglin_battle', duration: 5000, action: 'walk' },
      { text: '🌑 На север (тишина)', next: 'nether_soul_valley', duration: 5000, action: 'walk' },
      { text: '⛏️ Добыть незерак (5с)', next: 'nether_mine_netherrack', duration: 5000, action: 'mine', requires: { notFlag: 'mined_netherrack' } },
      { text: '✨ Добыть светокамень (5с)', next: 'nether_mine_glowstone', duration: 5000, action: 'mine', requires: { notFlag: 'mined_glowstone' } },
      { text: '🏰 Бастион пиглинов (руины)', next: 'nether_bastion', duration: 5000, action: 'walk' },
      { text: '🍄 Багровый лес', next: 'nether_crimson_forest', duration: 5000, action: 'walk' },
      { text: '🌋 Базальтовые дельты', next: 'nether_basalt_deltas', duration: 5000, action: 'walk' },
      { text: '🔮 Вернуться через портал', next: 'act2_village', duration: 5000, action: 'walk' }
    ]
  },

  // ===== Восток — Море лавы =====
  nether_lava_sea: {
    id: 'nether_lava_sea',
    depth: 1,
    act: 'act3',
    branch: 'nether',
    title: 'Act 3: Море лавы',
    text: 'Ты идёшь на восток. Зарево становится ярче, жар — сильнее. И вдруг — край. Перед тобой — море лавы. Бесконечное, бурлящее, оранжевое. Жар такой, что кожа стягивается.\n\nЧерез море ведёт мост. Узкий, из незерака, без перил. Где-то посередине — остров. На острове — крепость. Адская крепость. Та самая.\n\nНо над морем летают твари. Гасты. Огромные, белые, с щупальцами. Они плюются огнём. Если они заметят тебя на мосту — конец.',
    ambient: 'lava',
    choices: [
      { text: '🏃 Бежать по мосту быстро', next: 'nether_bridge_run', duration: 6000, action: 'walk' },
      { text: '🛡️ Идти осторожно с щитом (если есть броня)', next: 'nether_bridge_careful', duration: 8000, action: 'walk', requires: { minHealth: 40 } },
      { text: '🏹 Подстрелить гаста (если есть стрелы)', next: 'nether_shoot_ghast', duration: 5000, action: 'combat', requires: { items: { arrow: 1 } }, effects: { items: { arrow: -1 } } },
      { text: '← Вернуться к пустошам', next: 'nether_expanse', duration: 4000, action: 'walk' }
    ]
  },

  nether_bridge_run: {
    id: 'nether_bridge_run',
    depth: 1,
    act: 'act3',
    branch: 'nether',
    title: 'Act 3: Бег по мосту',
    text: 'Ты бросаешься по мосту. Гасты замечают тебя — слышишь их вой, потом шипение огненных шаров. Один проходит мимо — обжигает плечо. Второй попадает в мост позади — камень разлетается.\n\nТы бежишь, не оглядываясь. Ещё один шар — мимо. Ещё — в стену крепости. Ты успеваешь. Врываешься в ворота крепости. Гасты не могут преследовать — слишком велики для прохода.\n\nТы в Адской крепости. Жар внутри меньше, чем снаружи. Но здесь другие опасности.',
    ambient: 'lava',
    onEnter: { health: -20, flags: ['reached_nether_fortress'] },
    choices: [
      { text: '🏰 Войти в крепость', next: 'nether_fortress_hall', duration: 3000, action: 'walk' }
    ]
  },

  nether_bridge_careful: {
    id: 'nether_bridge_careful',
    depth: 1,
    act: 'act3',
    branch: 'nether',
    title: 'Act 3: Осторожный переход',
    text: 'Ты идёшь медленно, прижимаясь к стене моста. Гасты плюются, но ты успеваешь уклоняться. Броня поглощает часть жара. Один шар попадает в край моста — камень крошится, но держится.\n\nЧерез несколько минут ты у ворот крепости. Без серьёзных ран. Броня спасла.',
    ambient: 'lava',
    onEnter: { health: -10, flags: ['reached_nether_fortress'] },
    choices: [
      { text: '🏰 Войти в крепость', next: 'nether_fortress_hall', duration: 3000, action: 'walk' }
    ]
  },

  nether_shoot_ghast: {
    id: 'nether_shoot_ghast',
    depth: 1,
    act: 'act3',
    branch: 'nether',
    title: 'Act 3: Стрела в гаста',
    text: 'Ты натягиваешь тетиву на звук воя. Стрела улетает. Секунда — и гаст с воем падает в лаву. Один. Ещё два остаются, но теперь они осторожнее.\n\nТы используешь момент и перебегаешь мост. Один шар попадает в стену крепости рядом с тобой, но ты уже внутри.',
    ambient: 'lava',
    onEnter: { health: -10, flags: ['reached_nether_fortress', 'killed_ghast'] },
    choices: [
      { text: '🏰 Войти в крепость', next: 'nether_fortress_hall', duration: 3000, action: 'walk' }
    ]
  },

  // ===== Адская крепость =====
  nether_fortress_hall: {
    id: 'nether_fortress_hall',
    depth: 2,
    act: 'act3',
    branch: 'nether',
    title: 'Act 3: Адская крепость',
    text: 'Внутри крепости — лабиринт из незерака. Стены покрыты огненным мхом, который даёт свет. В коридорах слышны шаги — пиглины-стражи, бронированные, с алебардами.\n\nТри прохода. Один ведёт вниз — там жарче, слышен треск огня. Ифриты. Второй — вверх, к башням. Третий — в большой зал, где звенит цепь. Кто-то прикован.\n\nВ крепости есть всё, что нужно: стержни ифритов, черепа иссушителей, и — где-то — звезда Нужера. Но и опасности хватит.',
    ambient: 'lava',
    isHub: true,
    choices: [
      { text: '🔥 Вниз (спавнер ифритов)', next: 'nether_blaze_spawner', duration: 4000, action: 'walk' },
      { text: '⬆️ Наверх (башни)', next: 'nether_towers', duration: 4000, action: 'walk' },
      { text: '⛓️ В большой зал (пленник)', next: 'nether_prisoner', duration: 3000, action: 'walk' },
      { text: '🔍 Обыскать коридоры', next: 'nether_search_corridors', duration: 5000, action: 'observe', requires: { notFlag: 'searched_fortress' } },
      { text: '← Выйти из крепости', next: 'nether_lava_sea', duration: 3000, action: 'walk' }
    ]
  },

  nether_blaze_spawner: {
    id: 'nether_blaze_spawner',
    depth: 3,
    act: 'act3',
    branch: 'nether',
    title: 'Act 3: Спавнер ифритов',
    text: 'Ты спускаешься. Жар становится невыносимым. В центре комнаты — клетка из огня. Из неё вылетают ифриты: огненные существа, летающие, плюющиеся огнём. Их золотые стержни торчат из спин — это то, что тебе нужно.\n\nИфритов три. Они замечают тебя. Бой неизбежен.',
    ambient: 'lava',
    choices: [
      { text: '⚔️ Атаковать булавой', next: 'nether_blaze_fight', duration: 8000, action: 'combat' },
      { text: '🏹 Стрелять издалека (нужны стрелы)', next: 'nether_blaze_arrows', duration: 7000, action: 'combat', requires: { items: { arrow: 3 } }, effects: { items: { arrow: -3 } } },
      { text: '🏃 Убежать', next: 'nether_fortress_hall', duration: 3000, action: 'walk' }
    ]
  },

  nether_blaze_fight: {
    id: 'nether_blaze_fight',
    depth: 3,
    act: 'act3',
    branch: 'nether',
    title: 'Act 3: Бой с ифритами',
    text: 'Ты бросаешься на ифритов с булавой. Первый — удар, огненный шар в плечо, но ты добиваешь. Из спины выпадает стержень. Второй — ты уклоняешься от двух шаров, бьёшь сверху. Ещё стержень. Третий — самый злой, плюётся без остановки. Ты ловишь два шара, но последний удар булавой отправляет его в огненную клетку.\n\nТри стержня ифрита в твоих руках. Они тёплые, гудят. Это — топливо для глаз иссушителя. Но нужны ещё черепа.',
    ambient: 'lava',
    onEnter: { items: { blaze_rod: 3 }, health: -30, flags: ['got_blaze_rods'] },
    choices: [
      { text: '← Вернуться в крепость', next: 'nether_fortress_hall', duration: 3000, action: 'walk' }
    ]
  },

  nether_blaze_arrows: {
    id: 'nether_blaze_arrows',
    depth: 3,
    act: 'act3',
    branch: 'nether',
    title: 'Act 3: Стрелы в ифритов',
    text: 'Ты остаёшься в коридоре и стреляешь. Первый ифрит — две стрелы, падает. Второй — три стрелы, но успевает плюнуть огнём. Третий — одна стрела в слабое место, мгновенная смерть.\n\nТри стержня. Минимум урона — только один огненный шар зацепил тебя.',
    ambient: 'lava',
    onEnter: { items: { blaze_rod: 3 }, health: -15, flags: ['got_blaze_rods'] },
    choices: [
      { text: '← Вернуться в крепость', next: 'nether_fortress_hall', duration: 3000, action: 'walk' }
    ]
  },

  // ===== Башни =====
  nether_towers: {
    id: 'nether_towers',
    depth: 3,
    act: 'act3',
    branch: 'nether',
    title: 'Act 3: Башни крепости',
    text: 'Ты поднимаешься по лестнице из незерака. Башни — высокие, с узкими окнами. Отсюда виден весь Нижний мир: море лавы, пустоши, далёкие горы. И — на горизонте — что-то огромное, тёмное. Может, другая крепость?\n\nНа вершине башни — сундук. Старый, окованный незерактом. Внутри — что-то ценное.',
    ambient: 'lava',
    choices: [
      { text: '📦 Открыть сундук', next: 'nether_tower_chest', duration: 3000, action: 'observe', requires: { notFlag: 'opened_tower_chest' } },
      { text: '🔭 Осмотреть горизонт', next: 'nether_tower_view', duration: 4000, action: 'observe' },
      { text: '← Вернуться в крепость', next: 'nether_fortress_hall', duration: 3000, action: 'walk' }
    ]
  },

  nether_tower_chest: {
    id: 'nether_tower_chest',
    depth: 3,
    act: 'act3',
    branch: 'nether',
    title: 'Act 3: Сундук на башне',
    text: 'Сундук не заперт. Внутри — золото. Много золота. И — череп. Не человеческий. С тёмными глазницами, которые будто смотрят на тебя. Череп иссушителя.\n\nПервый из трёх, которые нужны. Ты забираешь его. Череп холодный, несмотря на жар. Он гудит, как будто в нём что-то живое.',
    ambient: 'lava',
    onEnter: { items: { gold: 10, wither_skull: 1 }, flags: ['opened_tower_chest', 'got_wither_skull_1'] },
    choices: [
      { text: '← Вернуться к лестнице', next: 'nether_towers', duration: 2000, action: 'walk' }
    ]
  },

  nether_tower_view: {
    id: 'nether_tower_view',
    depth: 3,
    act: 'act3',
    branch: 'nether',
    title: 'Act 3: Вид с башни',
    text: 'Ты смотришь (слушаешь) горизонт. На севере — долина душ, там, где ты ещё не был. На западе — руины чего-то огромного, может, вторая крепость. На юге — лес из огромных грибов, красных и коричневых.\n\nА прямо перед тобой, за морем лавы — остров. На острове — алтарь. Место для призыва. Место, где можно создать Иссушителя, если есть три черепа и песок душ.\n\nТы запоминаешь дорогу.',
    ambient: 'lava',
    onEnter: { flags: ['saw_altar'] },
    choices: [
      { text: '← Вернуться к лестнице', next: 'nether_towers', duration: 2000, action: 'walk' }
    ]
  },

  // ===== Пленник =====
  nether_prisoner: {
    id: 'nether_prisoner',
    depth: 3,
    act: 'act3',
    branch: 'nether',
    title: 'Act 3: Пленник',
    text: 'В большом зале, у стены — клетка. В ней — фигура. Не пиглин. Человек. Или — был человеком. Теперь — высохший, с синими глазами, как у Строителя.\n\n— Ты... ты пришёл. Я ждал. Сотни лет. Я — последний из Строителей, кто не ушёл дальше. Я остался, чтобы помочь тому, кто придёт после.\n\nУ меня есть для тебя дар. И — последний череп иссушителя. Но сначала — освободи меня.',
    ambient: 'lava',
    choices: [
      { text: '🔓 Сломать замок булавой', next: 'nether_free_builder', duration: 5000, action: 'combat', requires: { flag: 'got_mace' } },
      { text: '🔓 Сломать замок киркой', next: 'nether_free_builder', duration: 6000, action: 'mine' },
      { text: '← Вернуться в крепость', next: 'nether_fortress_hall', duration: 3000, action: 'walk' }
    ]
  },

  nether_free_builder: {
    id: 'nether_free_builder',
    depth: 3,
    act: 'act3',
    branch: 'nether',
    title: 'Act 3: Освобождённый Строитель',
    text: 'Замок разлетается. Строитель выходит, разминая ноги. Он смотрит (чувствует) тебя.\n\n— Спасибо. Вот — третий череп. И — дар.\n\nОн протягивает тебе камень. Маленький, фиолетовый, мерцающий. Это — осколок звезды Нужера. Не целая звезда, но часть силы.\n\n— Иссушитель — страж настоящей звезды. Победи его — и звезда твоя. Но он силён. Очень силён. Булава, броня, стержни ифритов — всё пригодится.\n\nСтроитель исчезает. Просто — исчезает. Ты остаёшься один. С тремя черепами и знанием, что делать дальше.',
    ambient: 'lava',
    onEnter: { items: { wither_skull: 2, nether_star: 1 }, flags: ['freed_builder', 'got_wither_skull_3', 'got_builder_shard'] },
    choices: [
      { text: '← Вернуться в крепость', next: 'nether_fortress_hall', duration: 3000, action: 'walk' }
    ]
  },

  // ===== Поиск в коридорах =====
  nether_search_corridors: {
    id: 'nether_search_corridors',
    depth: 2,
    act: 'act3',
    branch: 'nether',
    title: 'Act 3: Поиск в коридорах',
    text: 'Ты обыскиваешь коридоры крепости. В одной из комнат — второй череп иссушителя, на алтаре. В другой — сундук с золотом и стрелами. В третьей — хлеб (грибной суп, как делают пиглины), восстанавливающий силы.\n\nСтроители оставили здесь много. Или — пиглины собрали. Не важно. Твоя добыча.',
    ambient: 'lava',
    onEnter: { items: { wither_skull: 1, gold: 5, arrow: 10, mushroom: 3 }, flags: ['searched_fortress', 'got_wither_skull_2'] },
    choices: [
      { text: '← Вернуться в зал', next: 'nether_fortress_hall', duration: 3000, action: 'walk' }
    ]
  },

  // ===== Запад — Бой пиглинов =====
  nether_piglin_battle: {
    id: 'nether_piglin_battle',
    depth: 1,
    act: 'act3',
    branch: 'nether',
    title: 'Act 3: Битва пиглинов',
    text: 'На западе — поле боя. Две группы пиглинов дерутся между собой. Золотые и бронзовые. Золотые — богаче, но бронзовые — злее. Ты мог бы вмешаться, а мог бы подождать, пока они ослабят друг друга, и добить победителей.\n\nИли — просто обойти. Но в лагере победителей обычно есть добыча.',
    ambient: 'lava',
    choices: [
      { text: '⚔️ Атаковать всех', next: 'nether_piglin_fight_all', duration: 8000, action: 'combat' },
      { text: '🤝 Помочь золотым пиглинам', next: 'nether_piglin_help_gold', duration: 6000, action: 'combat' },
      { text: '⏳ Подождать и ограбить', next: 'nether_piglin_loot', duration: 10000, action: 'observe' },
      { text: '← Вернуться к пустошам', next: 'nether_expanse', duration: 4000, action: 'walk' }
    ]
  },

  nether_piglin_fight_all: {
    id: 'nether_piglin_fight_all',
    depth: 1,
    act: 'act3',
    branch: 'nether',
    title: 'Act 3: Резня',
    text: 'Ты бросаешься в бой. Пиглины заняты друг другом — ты успеваешь уложить троих, прежде чем они понимают, что происходит. Потом — хаос. Булава мелькает, пиглины падают. Когда последний падает — поле тихое.\n\nДобыча: золото, мясо, и — странный меч из незерита. Тяжёлый, острый, тёплый. Лучше булавы?',
    ambient: 'lava',
    onEnter: { items: { gold: 8, meat: 5 }, health: -25, flags: ['killed_piglins'] },
    choices: [
      { text: '← Вернуться к пустошам', next: 'nether_expanse', duration: 4000, action: 'walk' }
    ]
  },

  nether_piglin_help_gold: {
    id: 'nether_piglin_help_gold',
    depth: 1,
    act: 'act3',
    branch: 'nether',
    title: 'Act 3: Союз с золотыми',
    text: 'Ты бросаешься на помощь золотым пиглинам. С твоей помощью они побеждают. Их вождь — крупный, в золотой броне — кивает тебе.\n\n— Ты помог. Золото — твоё. И — мы расскажем, где алтарь Иссушителя. На острове за морем лавы. Иди через крепость.\n\nОн протягивает мешочек с золотом и кусок карты. На карте — путь к алтарю.',
    ambient: 'lava',
    onEnter: { items: { gold: 12 }, health: -10, flags: ['piglin_alliance'] },
    choices: [
      { text: '← Вернуться к пустошам', next: 'nether_expanse', duration: 4000, action: 'walk' }
    ]
  },

  nether_piglin_loot: {
    id: 'nether_piglin_loot',
    depth: 1,
    act: 'act3',
    branch: 'nether',
    title: 'Act 3: Грабёж',
    text: 'Ты ждёшь. Бой длится долго. Бронзовые пиглины побеждают, но их остаётся мало. Когда последний золотой падает — ты нападаешь.\n\nУставшие, раненые пиглины не могут сопротивляться. Через минуту — всё кончено. Добыча богатая: золото, оружие, и — хлеб. Но ты потратил много времени.',
    ambient: 'lava',
    onEnter: { items: { gold: 15, meat: 3, mushroom: 2 }, health: -15, flags: ['piglin_loot'] },
    choices: [
      { text: '← Вернуться к пустошам', next: 'nether_expanse', duration: 4000, action: 'walk' }
    ]
  },

  // ===== Север — Долина душ =====
  nether_soul_valley: {
    id: 'nether_soul_valley',
    depth: 1,
    act: 'act3',
    branch: 'nether',
    title: 'Act 3: Долина душ',
    text: 'На севере — другой мир. Вместо лавы — песок душ. Серый, мелкий, шепчущий. Каждый шаг — и под ногами кто-то шепчет. Души тех, кто умер и не нашёл покоя.\n\nВ центре долины — огромный скелет. Не человеческий, не звериный. Древний. Один из Строителей, что не вернулись. Из его рёбер растут деревья — огромные, багровые, с шипами.\n\nЗдесь — тихо. Но тяжело. Давит.',
    ambient: 'void',
    choices: [
      { text: '🦴 Осмотреть скелет Строителя', next: 'nether_skeleton', duration: 5000, action: 'observe', requires: { notFlag: 'examined_skeleton' } },
      { text: '🌳 Идти к багровым деревьям', next: 'nether_trees', duration: 4000, action: 'walk' },
      { text: '🟫 Добыть песок душ (5с)', next: 'nether_soul_sand', duration: 5000, action: 'mine', requires: { notFlag: 'mined_soul_sand' } },
      { text: '← Вернуться к пустошам', next: 'nether_expanse', duration: 4000, action: 'walk' }
    ]
  },

  nether_skeleton: {
    id: 'nether_skeleton',
    depth: 1,
    act: 'act3',
    branch: 'nether',
    title: 'Act 3: Скелет Строителя',
    text: 'Ты подходишь к скелету. Кости — огромные, каждая размером с тебя. Череп — с рогами, с синими кристаллами в глазницах. Этот Строитель был здесь давно. Может, первым, кто пришёл в Нижний мир.\n\nВ рёбрах — надпись. Старый язык, но ты узнаёшь символы: «Тот, кто победит Иссушителя, получит звезду. Тот, кто получит звезду, увидит правду. Тот, кто увидит правду, станет одним из нас.»\n\nСтановится понятно. Звезда Нужера — не просто сокровище. Это — путь. Путь стать Строителем.',
    ambient: 'void',
    onEnter: { flags: ['examined_skeleton', 'learned_truth'] },
    choices: [
      { text: '← Вернуться к долине', next: 'nether_soul_valley', duration: 3000, action: 'walk' }
    ]
  },

  nether_trees: {
    id: 'nether_trees',
    depth: 1,
    act: 'act3',
    branch: 'nether',
    title: 'Act 3: Багровый лес',
    text: 'Багровые деревья — странные. Стволы — как мышцы, красные, влажные. Ветви — с шипами, которые светятся. На ветвях — плоды. Светящиеся, пульсирующие.\n\nТы срываешь один. Тёплый, мягкий. Пахнет чем-то сладким. Это — слезогонка, плод Нижнего мира. Если съесть — восстанавливает силы, но горький на вкус.',
    ambient: 'void',
    onEnter: { items: { mushroom: 5 }, flags: ['found_crimson_trees'] },
    choices: [
      { text: '← Вернуться к долине', next: 'nether_soul_valley', duration: 3000, action: 'walk' }
    ]
  },

  nether_soul_sand: {
    id: 'nether_soul_sand',
    depth: 1,
    act: 'act3',
    branch: 'nether',
    title: 'Act 3: Песок душ',
    text: 'Ты набираешь песок душ в мешок. Он тяжёлый, будто каждый кусочек — это чья-то жизнь. Шепчет, когда касаешься.\n\nПесок душ нужен для алтаря Иссушителя. Три черепа + четыре песка = Иссушитель. Победишь его — получишь звезду.',
    ambient: 'void',
    onEnter: { items: { soul_sand: 4 }, flags: ['mined_soul_sand'] },
    choices: [
      { text: '← Вернуться к долине', next: 'nether_soul_valley', duration: 3000, action: 'walk' }
    ]
  },

  // ===== Добыча ресурсов =====
  nether_mine_netherrack: {
    id: 'nether_mine_netherrack',
    depth: 0,
    act: 'act3',
    branch: 'nether',
    title: 'Act 3: Незерак',
    text: 'Ты бьёшь киркой по стене. Незерак поддаётся легко — он хрупкий, но горячий. Куски падают, обжигая руки через обмотку. Через минуту у тебя пять кусков.\n\nНезерак — основной материал Нижнего мира. Из него здесь всё: стены, мосты, крепости. Можно строить, можно крафтить.',
    ambient: 'lava',
    onEnter: { items: { netherrack: 5 }, flags: ['mined_netherrack'] },
    choices: [
      { text: '← Вернуться к пустошам', next: 'nether_expanse', duration: 2000, action: 'walk' }
    ]
  },

  nether_mine_glowstone: {
    id: 'nether_mine_glowstone',
    depth: 0,
    act: 'act3',
    branch: 'nether',
    title: 'Act 3: Светокамень',
    text: 'Ты бьёшь по сталактиту светокамени. Он рассыпается на куски, жёлтые, тёплые, светящиеся. Четыре куска. Хватит, чтобы осветить целую комнату.\n\nСветокамень — единственный источник света в Нижнем мире, кроме огня. Полезный материал.',
    ambient: 'lava',
    onEnter: { items: { glowstone: 4 }, flags: ['mined_glowstone'] },
    choices: [
      { text: '← Вернуться к пустошам', next: 'nether_expanse', duration: 2000, action: 'walk' }
    ]
  },

  // ===== Алтарь Иссушителя =====
  nether_altar: {
    id: 'nether_altar',
    depth: 4,
    act: 'act3',
    branch: 'nether',
    title: 'Act 3: Алтарь Иссушителя',
    text: 'Ты стоишь на острове за морем лавы. На острове — алтарь из песка душ. Четыре блока, в форме T. Ты кладёшь три черепа иссушителя на верхние блоки.\n\nНебо (потолок) темнеет. Ветер усиливается. Из черепов вырывается чёрный дым, формируется в фигуру. Иссушитель.\n\nОгромный, чёрный, с тремя головами. Каждая — с тёмными глазами, которые смотрят на тебя. Он взревел — звук такой, что стены дрожат. Бой начался.',
    ambient: 'lava',
    onEnter: { flags: ['summoned_wither'], items: { wither_skull: -3, soul_sand: -4 } },
    choices: [
      { text: '⚔️ Атаковать Иссушителя', next: 'nether_wither_fight', duration: 10000, action: 'combat', requires: { flag: 'got_mace' } },
      { text: '🏹 Стрелять (нужны стрелы)', next: 'nether_wither_arrows', duration: 10000, action: 'combat', requires: { items: { arrow: 10 } }, effects: { items: { arrow: -10 } } }
    ]
  },

  nether_wither_fight: {
    id: 'nether_wither_fight',
    depth: 4,
    act: 'act3',
    branch: 'nether',
    title: 'Act 3: Бой с Иссушителем',
    text: 'Ты бросаешься на Иссушителя с булавой. Он плюётся чёрными черепами — каждый взрыв при ударе. Ты уклоняешься, бьёшь. Одна голова падает. Две остаются, но злятся — они плюются чаще.\n\nВторой череп попадает тебе в грудь. Боль. Но ты бьёшь снова. Вторая голова падает. Третья — последняя — визжит, плюётся без остановки. Ты ловишь два черепа, но последний удар булавой — и Иссушитель взрывается.\n\nИз его останков падает звезда. Настоящая звезда Нужера. Мерцающая, фиолетовая, тёплая. Ты берёшь её. Сила наполняет тебя.',
    ambient: 'lava',
    onEnter: { items: { nether_star: 1 }, health: -40, flags: ['killed_wither', 'got_real_nether_star', 'nether_complete'] },
    choices: [
      { text: '🏆 Финал', next: 'ending_nether_complete', duration: 5000, action: 'walk' }
    ]
  },

  nether_wither_arrows: {
    id: 'nether_wither_arrows',
    depth: 4,
    act: 'act3',
    branch: 'nether',
    title: 'Act 3: Стрелы в Иссушителя',
    text: 'Ты остаёшься на расстоянии и стреляешь. Стрелы попадают, но Иссушитель не сидит на месте — он летит к тебе. Черепа взрываются вокруг. Ты стреляешь, уклоняешься, стреляешь.\n\nОдна голова падает. Потом вторая. Третья — в ярости, скорость удваивается. Ты ловишь три черепа, но последняя стрела попадает в слабое место.\n\nИссушитель взрывается. Звезда падает. Ты берёшь её. Минимум урона — благодаря расстоянию.',
    ambient: 'lava',
    onEnter: { items: { nether_star: 1 }, health: -25, flags: ['killed_wither', 'got_real_nether_star', 'nether_complete'] },
    choices: [
      { text: '🏆 Финал', next: 'ending_nether_complete', duration: 5000, action: 'walk' }
    ]
  },

  // ===== Финал Act 3 =====
  ending_nether_complete: {
    id: 'ending_nether_complete',
    depth: 6,
    act: 'act3',
    branch: 'nether',
    title: 'Act 3: Звезда Нужера',
    text: 'Ты стоишь над останками Иссушителя. В руке — звезда Нужера. Она гудит, вибрирует, светится. Сила, которой нет имени.\n\nГолос — нет, мысль — в твоей голове. Голос Строителя, которого ты освободил:\n\n— Ты сделал это. Ты победил Иссушителя. Ты получил звезду. Теперь — выбор.\n\nЗвезда может дать тебе силу. Силу стать Строителем. Жить вечно, строить миры, знать правду.\n\nИли — вернуться домой. Слепым рудокопом, который спустился в шахту за алмазами, а покорил Ад.\n\nЧто выберешь?',
    ambient: 'nether',
    isEnding: 'victory',
    choices: [
      { text: '🌟 Стать Строителем', next: 'ending_become_builder', duration: 5000, action: 'observe' },
      { text: '🏠 Вернуться домой', next: 'ending_go_home', duration: 5000, action: 'walk' }
    ]
  },

  ending_become_builder: {
    id: 'ending_become_builder',
    depth: 6,
    act: 'act3',
    branch: 'nether',
    title: 'Act 3: Строитель',
    text: 'Ты поднимаешь звезду. Свет заливает тебя — изнутри и снаружи. Боль. Потом — покой.\n\nТы больше не слепой. Ты видишь. Не глазами — всем существом. Ты видишь Нижний мир: каждую трещину, каждую каплю лавы, каждую душу в песке. Ты видишь поверхность: деревню, шахту, лес, крепость. Ты видишь всё.\n\nТы — Строитель. Один из тех, кто строил миры. Теперь ты — один из нас.\n\nТы уходишь. Не в портал — просто исчезаешь. Туда, где ждут другие. Домой.\n\nЭто — конец. И — начало.\n\nСпасибо, что играл. BlindCraft: Эхо Глубин — пройдена.',
    ambient: 'nether',
    isEnding: 'victory',
    choices: [
      { text: 'Начать заново', next: 'start', duration: 2000, action: 'walk' }
    ]
  },

  ending_go_home: {
    id: 'ending_go_home',
    depth: 6,
    act: 'act3',
    branch: 'nether',
    title: 'Act 3: Домой',
    text: 'Ты кладёшь звезду в сумку. Не для силы. Не для бессмертия. Просто — как сувенир. Доказательство.\n\nТы возвращаешься к порталу. Фиолетовое мерцание обнимает тебя. Жар сменяется прохладой. Сера — лесом.\n\nТы выходишь на поверхность. Деревня. Знакомые шаги, запахи, голоса. Ты — дома.\n\nТы — слепой рудокоп. Ты был слепым всегда. Но ты спустился в шахту, прошёл Испытания, построил портал, покорил Нижний мир. И вернулся. Не с алмазами — со звездой.\n\nСтарейшина встречает тебя у ворот.\n\n— Я знал, что ты вернёшься. Расскажи, как там. В Аду.\n\nТы улыбаешься. И рассказываешь.\n\nBlindCraft: Эхо Глубин — пройдена. Спасибо, что играл.',
    ambient: 'surface',
    isEnding: 'victory',
    choices: [
      { text: 'Начать заново', next: 'start', duration: 2000, action: 'walk' },
      { text: '🔮 Искать конец (Act 4 тизер)', next: 'act4_intro', duration: 5000, action: 'walk' }
    ]
  },

  // ============================================================
  //  ACT 2 · РАСШИРЕНИЕ (v3.1) — +10 сцен
  // ============================================================
  act2_mineshaft: {
    id: 'act2_mineshaft',
    depth: 2,
    act: 'act2',
    branch: 'surface2',
    title: 'Act 2: Старая шахта',
    text: 'За деревней, в холме — старая шахта. Не та, из которой ты вышел. Другая. Заброшенная, обрушенная. Но старейшина говорил, что здесь есть железо и золото — те, кто не ушёл в большую шахту, копали здесь.\n\nТы нащупываешь вход. Прохладный воздух, запах ржавчины. Кирка в руке — можно добыть руду.',
    ambient: 'cave',
    choices: [
      { text: '⛏️ Добыть железо (8с)', next: 'act2_mineshaft_iron', duration: 8000, action: 'mine', requires: { minPickaxe: 'wood', notFlag: 'mineshaft_iron' } },
      { text: '⛏️ Добыть золото (8с)', next: 'act2_mineshaft_gold', duration: 8000, action: 'mine', requires: { minPickaxe: 'iron', notFlag: 'mineshaft_gold' } },
      { text: '🔍 Обыскать шахту', next: 'act2_mineshaft_search', duration: 5000, action: 'observe', requires: { notFlag: 'searched_mineshaft' } },
      { text: '← Вернуться в деревню', next: 'act2_village', duration: 4000, action: 'walk' }
    ]
  },

  act2_mineshaft_iron: {
    id: 'act2_mineshaft_iron',
    depth: 2,
    act: 'act2',
    branch: 'surface2',
    title: 'Act 2: Железная жила',
    text: 'Ты бьёшь киркой по ржавой жиле. Железо поддаётся — три куска. Старая шахта ещё помнит, как кормить рудокопов.',
    ambient: 'cave',
    onEnter: { items: { iron: 3 }, flags: ['mineshaft_iron'] },
    choices: [
      { text: '← Вернуться к шахте', next: 'act2_mineshaft', duration: 2000, action: 'walk' }
    ]
  },

  act2_mineshaft_gold: {
    id: 'act2_mineshaft_gold',
    depth: 2,
    act: 'act2',
    branch: 'surface2',
    title: 'Act 2: Золотая жила',
    text: 'Глубже в шахте — блеск. Золото. Много. Старые рудокопы не добрали — ушли в спешке. Твой. Пять самородков.',
    ambient: 'cave',
    onEnter: { items: { gold: 5 }, flags: ['mineshaft_gold'] },
    choices: [
      { text: '← Вернуться к шахте', next: 'act2_mineshaft', duration: 2000, action: 'walk' }
    ]
  },

  act2_mineshaft_search: {
    id: 'act2_mineshaft_search',
    depth: 2,
    act: 'act2',
    branch: 'surface2',
    title: 'Act 2: Находка в шахте',
    text: 'Ты обыскиваешь шахту. В углу — скелет рудокопа. В его руках — дневник. Последняя запись: «Видел тень. Не человек. Не зверь. Высокий. Чёрный. С фиолетовыми глазами. Исчез, когда я моргнул. Боюсь.»\n\nЭндермен. Здесь, на поверхности? Ты забираешь дневник. И — кусок обсидиана, который рудокоп прятал.',
    ambient: 'cave',
    onEnter: { items: { obsidian: 1 }, flags: ['searched_mineshaft', 'found_diary'] },
    choices: [
      { text: '← Вернуться к шахте', next: 'act2_mineshaft', duration: 2000, action: 'walk' }
    ]
  },

  act2_river: {
    id: 'act2_river',
    depth: 0,
    act: 'act2',
    branch: 'surface2',
    title: 'Act 2: Горная река',
    text: 'К востоку от деревни течёт река. Быстрая, холодная, из горных ручьёв. В ней можно ловить рыбу, мыть золото, или просто сидеть на берегу и слушать воду.\n\nСтарейшина говорил: если бросить в реку алмаз, она покажет будущее. Может, это сказки. А может — нет.',
    ambient: 'water',
    choices: [
      { text: '🎣 Рыбачить (4с, +мясо)', next: 'act2_river_fish', duration: 4000, action: 'mine', requires: { notFlag: 'river_fished' } },
      { text: '🪙 Мыть золото (6с)', next: 'act2_river_gold', duration: 6000, action: 'mine', requires: { notFlag: 'river_gold' } },
      { text: '💎 Бросить алмаз в реку', next: 'act2_river_vision', duration: 5000, action: 'observe', requires: { items: { diamond: 1 }, notFlag: 'river_vision' }, effects: { items: { diamond: -1 } } },
      { text: '← Вернуться в деревню', next: 'act2_village', duration: 4000, action: 'walk' }
    ]
  },

  act2_river_fish: {
    id: 'act2_river_fish',
    depth: 0,
    act: 'act2',
    branch: 'surface2',
    title: 'Act 2: Рыбалка',
    text: 'Ты сидишь на берегу, держишь импровизированную удочку. Через несколько минут — рывок. Рыба! Большая, серебристая. Ещё одна. Ещё.\n\nТри рыбы. Свежее мясо для ужина.',
    ambient: 'water',
    onEnter: { items: { meat: 3 }, flags: ['river_fished'] },
    choices: [
      { text: '← Вернуться к реке', next: 'act2_river', duration: 2000, action: 'walk' }
    ]
  },

  act2_river_gold: {
    id: 'act2_river_gold',
    depth: 0,
    act: 'act2',
    branch: 'surface2',
    title: 'Act 2: Золото в реке',
    text: 'Ты черпаешь riverную воду в таз и промываешь. Песок уходит, тяжёлое остаётся. Крупинки золота — три штуки. Мелочь, но приятно.',
    ambient: 'water',
    onEnter: { items: { gold: 3 }, flags: ['river_gold'] },
    choices: [
      { text: '← Вернуться к реке', next: 'act2_river', duration: 2000, action: 'walk' }
    ]
  },

  act2_river_vision: {
    id: 'act2_river_vision',
    depth: 0,
    act: 'act2',
    branch: 'surface2',
    title: 'Act 2: Видение',
    text: 'Алмаз падает в воду. Река останавливается. Время останавливается.\n\nТы видишь. Не глазами — река показывает. Огромная крепость из каменных кирпичей. Портал. Фиолетовый, как в Аду, но другой. Зелёный. За ним — тьма. И в тьме — глаза. Фиолетовые. Высокая фигура.\n\nЭндермен. И — дракон. Огромный, чёрный, с фиолетовыми глазами.\n\nВидение исчезает. Река течёт. Алмаза нет. Но ты знаешь — есть что-то за Адом. Что-то ещё.',
    ambient: 'water',
    onEnter: { flags: ['river_vision', 'saw_end_vision'] },
    choices: [
      { text: '← Вернуться к реке', next: 'act2_river', duration: 3000, action: 'walk' }
    ]
  },

  // Добавим выходы к новым локациям из деревни
  act2_village_extra: {
    id: 'act2_village_extra',
    depth: 0,
    act: 'act2',
    branch: 'surface2',
    title: 'Act 2: Деревня',
    text: 'Скрытая сцена для расширения деревни. Не используется напрямую.',
    ambient: 'village',
    choices: [
      { text: '← Назад', next: 'act2_village', duration: 1000, action: 'walk' }
    ]
  },

  // ============================================================
  //  ACT 3 · РАСШИРЕНИЕ (v3.1) — +10 сцен
  // ============================================================
  nether_bastion: {
    id: 'nether_bastion',
    depth: 2,
    act: 'act3',
    branch: 'nether',
    title: 'Act 3: Остатки бастиона',
    text: 'Среди незеракских пустошей — руины. Не Адская крепость, а что-то другое. Бастион пиглинов. Золотой, разрушенный, с чёрными камнями. Здесь жил пиглин-вождь, но его давно убили.\n\nВ руинах — сундуки. Золото, оружие, и — может быть — череп иссушителя.',
    ambient: 'lava',
    choices: [
      { text: '📦 Обыскать бастион', next: 'nether_bastion_loot', duration: 6000, action: 'observe', requires: { notFlag: 'searched_bastion' } },
      { text: '⚔️ Сразиться с пиглин-бруталом', next: 'nether_bastion_boss', duration: 8000, action: 'combat', requires: { notFlag: 'killed_brute' } },
      { text: '← Вернуться к пустошам', next: 'nether_expanse', duration: 4000, action: 'walk' }
    ]
  },

  nether_bastion_loot: {
    id: 'nether_bastion_loot',
    depth: 2,
    act: 'act3',
    branch: 'nether',
    title: 'Act 3: Добыча бастиона',
    text: 'Ты обыскиваешь сундуки. Золото — много. Стрелы. И — кусок светокамени. Но главное — в одном из сундуков, за двойным дном — череп. Иссушитель. Второй из трёх.\n\nКто-то уже собирал их. Но не успел. Теперь — твой.',
    ambient: 'lava',
    onEnter: { items: { gold: 15, arrow: 15, glowstone: 2, wither_skull: 1 }, flags: ['searched_bastion', 'got_wither_skull_bastion'] },
    choices: [
      { text: '← Вернуться к бастиону', next: 'nether_bastion', duration: 2000, action: 'walk' }
    ]
  },

  nether_bastion_boss: {
    id: 'nether_bastion_boss',
    depth: 2,
    act: 'act3',
    branch: 'nether',
    title: 'Act 3: Пиглин-брутал',
    text: 'Из руин выходит он. Пиглин-брутал. Огромный, в чёрной броне, с огромным топором. Он — последний защитник бастиона.\n\nТы бьёшь первым. Булава отскакивает от брони. Он замахивается — ты уклоняешься. Удар в спину — броня трещит. Ещё удар — он падает.\n\nИз его останков — золото и кусок незерита. Ценный материал.',
    ambient: 'lava',
    onEnter: { items: { gold: 10 }, health: -25, flags: ['killed_brute'] },
    choices: [
      { text: '← Вернуться к бастиону', next: 'nether_bastion', duration: 2000, action: 'walk' }
    ]
  },

  nether_crimson_forest: {
    id: 'nether_crimson_forest',
    depth: 1,
    act: 'act3',
    branch: 'nether',
    title: 'Act 3: Багровый лес',
    text: 'Огромная пещера, заполненная багровыми деревьями. Стволы — как мышцы, красные, пульсирующие. Под ногами — багровый нилий, мягкий, как мох. Здесь живут пиглины-мирные, которые не воюют, а торгуют.\n\nОдин из них подходит к тебе.\n\n— Золото? Меняем. У меня есть стержни ифритов. Много. Дорого.',
    ambient: 'lava',
    isHub: true,
    choices: [
      { text: '🤝 10 золота → 2 стержня ифрита', next: '@self', duration: 4000, action: 'trade', requires: { items: { gold: 10 } }, effects: { items: { gold: -10, blaze_rod: 2 } } },
      { text: '🤝 5 золота → 5 светокамней', next: '@self', duration: 4000, action: 'trade', requires: { items: { gold: 5 } }, effects: { items: { gold: -5, glowstone: 5 } } },
      { text: '🤝 3 мяса → 3 гриба', next: '@self', duration: 4000, action: 'trade', requires: { items: { meat: 3 } }, effects: { items: { meat: -3, mushroom: 3 } } },
      { text: '🍄 Собрать плоды (3с)', next: 'nether_crimson_harvest', duration: 3000, action: 'mine', requires: { notFlag: 'harvested_crimson' } },
      { text: '← Вернуться к пустошам', next: 'nether_expanse', duration: 5000, action: 'walk' }
    ]
  },

  nether_crimson_harvest: {
    id: 'nether_crimson_harvest',
    depth: 1,
    act: 'act3',
    branch: 'nether',
    title: 'Act 3: Урожай',
    text: 'Ты срываешь плоды с багровых деревьев. Сочные, тёплые, светящиеся. Пять штук. Пиглин смотрит, но не возражает — плодов много.',
    ambient: 'lava',
    onEnter: { items: { mushroom: 5 }, flags: ['harvested_crimson'] },
    choices: [
      { text: '← Вернуться к лесу', next: 'nether_crimson_forest', duration: 2000, action: 'walk' }
    ]
  },

  nether_basalt_deltas: {
    id: 'nether_basalt_deltas',
    depth: 1,
    act: 'act3',
    branch: 'nether',
    title: 'Act 3: Базальтовые дельты',
    text: 'Опасное место. Вулканическая активность — лава бьёт фонтанами, базальт падает с потолка. Жар невыносимый. Но здесь — магма-кубы, из которых можно получить крем magma. И — руда, которую нигде больше не найти.\n\nА ещё здесь, по слухам, встречаются древние обломки — чёрные камни с фиолетовыми прожилками. Из них получают незерит — самый прочный материал в мире. Крепче алмаза. Старейшина говорил: если принесёшь незерит кузнецу, он выкует тебе снаряжение, которое не пробить ни дракону, ни Иссушителю.',
    ambient: 'lava',
    choices: [
      { text: '⛏️ Добыть кварц (5с)', next: 'nether_basalt_quartz', duration: 5000, action: 'mine', requires: { notFlag: 'mined_quartz' } },
      { text: '⚔️ Охота на магма-куба', next: 'nether_basalt_magma', duration: 6000, action: 'combat', requires: { notFlag: 'killed_magma_cube' } },
      { text: '⛏️ Искать древние обломки (нужна алмазная+ кирка, 10с)', next: 'nether_ancient_debris', duration: 10000, action: 'mine', requires: { minPickaxe: 'diamond', notFlag: 'found_ancient_debris' } },
      { text: '← Вернуться к пустошам', next: 'nether_expanse', duration: 5000, action: 'walk' }
    ]
  },

  nether_ancient_debris: {
    id: 'nether_ancient_debris',
    depth: 1,
    act: 'act3',
    branch: 'nether',
    title: 'Act 3: Древние обломки',
    text: 'Ты бьёшь алмазной киркой по чёрному камню, глубоко в базальте. Снова и снова. Камень трещит, крошится. И наконец — прожилка. Фиолетовая, как глаза эндермена. Древние обломки.\n\nТы выковыриваешь кусок. Тяжёлый, чёрный, с фиолетовыми жилами. В печи из этого получится незеритовый слиток — материал, из которого Строители делали своё снаряжение.\n\nДва куска. Хватит на меч или на кирку. Или на броню — если найдёшь ещё.',
    ambient: 'lava',
    onEnter: { items: { netherite_ingot: 2 }, flags: ['found_ancient_debris'], health: -10 },
    choices: [
      { text: '← Вернуться к дельтам', next: 'nether_basalt_deltas', duration: 3000, action: 'walk' }
    ]
  },

  nether_basalt_quartz: {
    id: 'nether_basalt_quartz',
    depth: 1,
    act: 'act3',
    branch: 'nether',
    title: 'Act 3: Кварц',
    text: 'Ты бьёшь по белым прожилкам в базальте. Кварц — чистый, белый. Десять кусков. Полезен для крафта.',
    ambient: 'lava',
    onEnter: { items: { glowstone: 3 }, flags: ['mined_quartz'] }, // кварц как светящийся материал
    choices: [
      { text: '← Вернуться к дельтам', next: 'nether_basalt_deltas', duration: 2000, action: 'walk' }
    ]
  },

  nether_basalt_magma: {
    id: 'nether_basalt_magma',
    depth: 1,
    act: 'act3',
    branch: 'nether',
    title: 'Act 3: Магма-куб',
    text: 'Магма-куб — большой, из лавы, прыгает. Ты уклоняешься от прыжков, бьёшь булавой. Он делится на два — ты бьёшь снова. Ещё деление — ещё удар. Наконец, последние куски растворяются.\n\nИз них выпадает крем магмы. Горячий, скользкий. Полезен для крафта.',
    ambient: 'lava',
    onEnter: { items: { blaze_rod: 1 }, health: -15, flags: ['killed_magma_cube'] },
    choices: [
      { text: '← Вернуться к дельтам', next: 'nether_basalt_deltas', duration: 2000, action: 'walk' }
    ]
  },

  // ============================================================
  //  ACT 4 · ТИЗЕР — Крепость Края (v3.1)
  // ============================================================
  act4_intro: {
    id: 'act4_intro',
    depth: 0,
    act: 'act3',
    branch: 'nether',
    title: 'Act 4: Край — вступление',
    text: 'После победы над Иссушителем и получения звезды Нужера, ты чувствуешь: это не конец. Звезда пульсирует, тянет. Не в Нижний мир — туда, куда Строители не дошли.\n\nВ Край.\n\nТы возвращаешься на поверхность. В деревне старейшина говорит: «Край — это конец всего. Чтобы попасть туда, нужно око края. А чтобы сделать око — нужен эндермен. Они приходят ночью.»\n\nТы ждёшь ночи. И — они приходят.',
    ambient: 'surface',
    onEnter: { flags: ['act4_started'] },
    choices: [
      { text: '🌙 Ждать ночи', next: 'act4_night', duration: 5000, action: 'observe' }
    ]
  },

  act4_night: {
    id: 'act4_night',
    depth: 0,
    act: 'act3',
    branch: 'nether',
    title: 'Act 4: Ночь',
    text: 'Солнце садится. Темнота. И — они. Эндермены. Высокие, чёрные, с фиолетовыми глазами. Они появляются из ниоткуда, стоят, смотрят. Если смотришь в ответ — атакуют.\n\nТы слепой. Ты не смотришь. Но они чувствуют тебя. Один подходит. Ты бьёшь булавой. Он телепортируется — но ты слышишь звук. Бьёшь снова. Попадаешь. Он падает.\n\nЖемчуг края. Мягкий, фиолетовый, тёплый. Нужно много — минимум пять.',
    ambient: 'monster',
    choices: [
      { text: '⚔️ Охота на эндерменов', next: 'act4_hunt_endermen', duration: 8000, action: 'combat' },
      { text: '🏠 Укрыться в деревне', next: 'act2_village', duration: 3000, action: 'walk' }
    ]
  },

  act4_hunt_endermen: {
    id: 'act4_hunt_endermen',
    depth: 0,
    act: 'act3',
    branch: 'nether',
    title: 'Act 4: Охота',
    text: 'Ты охотишься. Эндермены телепортируются, но ты слышишь. Каждый телпорт — звук, как разрыв воздуха. Ты бьёшь по звуку. Пять эндерменов. Пять жемчужин.\n\nОдна из них — особенная. Крупнее, ярче. Старейшина говорил: из такой можно сделать око края, если добавить обсидиан и огонь.\n\nТы возвращаешься в деревню. Крафт.',
    ambient: 'monster',
    onEnter: { items: { nether_star: 5 }, flags: ['got_ender_pearls'] }, // используем nether_star как жемчуг
    choices: [
      { text: '🔮 Скрафтить око края', next: 'act4_craft_eye', duration: 5000, action: 'craft' }
    ]
  },

  act4_craft_eye: {
    id: 'act4_craft_eye',
    depth: 0,
    act: 'act3',
    branch: 'nether',
    title: 'Act 4: Око края',
    text: 'Ты садишься у костра. Жемчуг края, обсидиан, огонь. Старейшина показывает, как. Ты соединяешь — вспышка фиолетового света.\n\nОко края. Круглое, зелёное, пульсирующее. Оно показывает направление — туда, где крепость края. Далеко, глубоко, в другом мире.\n\nТы бросаешь око в воздух. Оно летит — и падает, указывая путь. Юго-восток. Через лес, через горы, в пустыню. Там — крепость. Там — портал в Край.',
    ambient: 'surface',
    onEnter: { flags: ['crafted_eye'] },
    choices: [
      { text: '🧭 Идти за оком', next: 'act4_find_stronghold', duration: 8000, action: 'walk' }
    ]
  },

  act4_find_stronghold: {
    id: 'act4_find_stronghold',
    depth: 0,
    act: 'act3',
    branch: 'nether',
    title: 'Act 4: Крепость края',
    text: 'Ты идёшь за оком. Через лес, через горы, в пустыню. Око падает у каменного пола, скрытого песком. Ты копаешь — и находишь каменные кирпичи. Крепость края. Под землёй.\n\nТы спускаешься. Лабиринт из каменных кирпичей. Тут — libraries, зальные комнаты, и — где-то — портал. Портал в Край.\n\nОко ведёт тебя. Ты находишь зал. В центре — рамка портала. Пустая.',
    ambient: 'cave',
    choices: [
      { text: '🔮 Активировать портал', next: 'act4_portal_error', duration: 5000, action: 'observe' }
    ]
  },

  act4_portal_error: {
    id: 'act4_portal_error',
    depth: 0,
    act: 'act3',
    branch: 'nether',
    title: 'Act 4: Портал открыт',
    text: 'Ты кладёшь око края в рамку. Портал загорается — зелёный, мерцающий, как звезда. Ты делаешь шаг...\n\n...и на этот раз портал держит. Зелёный свет обволакивает тебя. Мир исчезает. Остаются только звёзды и тьма. И — шёпот. Тысячи голосов. Эндермены.\n\nТы в Краю. В конце всего. Act 4 начинается.',
    ambient: 'cave',
    isEnding: 'victory',
    choices: [
      { text: '🌌 Шагнуть в портал (Act 4)', next: 'end_entry', duration: 5000, action: 'walk' },
      { text: '🏠 Вернуться в деревню', next: 'act2_village', duration: 8000, action: 'walk' },
      { text: 'Начать заново', next: 'start', duration: 2000, action: 'walk' }
    ]
  }
}

export const DEATH_SCENES: Record<string, Scene> = {
  death_generic: {
    id: 'death_generic',
    depth: 0,
    branch: 'end',
    title: 'Темнота',
    text: 'Силы покидают тебя. Ноги подкашиваются. Ты падаешь на холодный камень и больше не встаёшь.\n\nГде-то далеко, наверху, есть солнце. Ты не увидишь его никогда. Но ты хотя бы попробовал. Многие даже не пытались.\n\nТемнота принимает тебя. Она всегда была тебе другом.',
    ambient: 'void',
    isEnding: 'death',
    choices: [
      { text: 'Начать заново', next: 'start', duration: 2000, action: 'walk' }
    ]
  }
}

export function getScene(id: string): Scene {
  return SCENES[id] || END_SCENES[id] || DEATH_SCENES[id] || SCENES.start
}

// Все сцены для дерева сюжета (включая death)
export const ALL_SCENES: Record<string, Scene> = { ...SCENES, ...END_SCENES, ...DEATH_SCENES }
