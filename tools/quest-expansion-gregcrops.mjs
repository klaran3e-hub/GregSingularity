const crop = id => 'gtibdcrops:' + id
const gt = id => 'gtceu:' + id
const seed = crop('crop_seed_bag')
const drop = id => crop('crop_drop_' + id)
const reed = { owner: 'ic2', id: 'sticky_reed' }

export function gregCropsChapter() {
  const rows = [
    ['crop_stakes', 'Жерди на первой грядке', crop('crop_stick'), 8, ['pressed_steel_frame', 'peg', 'cord'],
      'Натяни шнур и закрепи палки нагелем на стальной раме. Рама остаётся на верстаке. Поставь жерди на вспаханную землю рядом с водой.'],
    ['crop_wheat', 'Пшеница на опытной делянке', 'minecraft:wheat_seeds', 4, ['crop_stakes'],
      'Высади семена пшеницы на одинарные жерди. Оставь соседнюю клетку для второго взрослого растения.'],
    ['crop_cuttings', 'Первый обмолот на жердях', 'minecraft:wheat', 4, ['crop_wheat'],
      'Дождись зрелого колоса и собери урожай правой кнопкой. Оставь пшеницу на жердях до следующей жатвы.'],
    ['crop_knife', 'Совок для прополки', crop('weeding_trowel'), 1, ['crop_wheat', 'iron_plate', 'binding', 'handle'],
      'Закрепи три железные пластины на рукояти. Вынимая совком сорняки, ты сохраняешь жерди для нового посева.'],
    ['crop_cane', 'Тростник для маточного ряда', 'minecraft:sugar_cane', 2, ['crop_stakes'],
      'Посади сахарный тростник на свободные одинарные жерди. У зрелых растений можно получить потомство.'],
    ['crop_cactus', 'Свободные жерди для скрещивания', crop('crop_stick'), 4, ['crop_cane', 'crop_wheat'],
      'Поставь вторую пару жердей в клетку между взрослыми растениями. Оставь пересечение свободным и пропалывай его до появления всхода.'],
    ['crop_stickreed_seed', 'Семена смолистого тростника', seed, 1, ['crop_cactus', 'crop_knife'],
      'Отбирай потомство на двойных жердях. Дождись зрелости нужного растения и выбей его, чтобы получить мешочек семян. Цвет и стадия помогут отличить липкий тростник от обычного.', reed],
    ['crop_analyzer', 'Анализатор семян LV', crop('crop_analyzer'), 1, ['crop_knife', 'lv_shop_sensor', 'assembler', 'lv_shop_extractor', 'tin_plate', 'panes'],
      'Подай в сборщик LV датчик, электронную схему, стеклянные панели, оловянные пластины и изоляцию. На пайку уйдёт 144 мБ припоя. Для анализа заряди прибор.'],
    ['crop_genes', 'Паспорт смолистого тростника', seed, 1, ['crop_stickreed_seed', 'crop_analyzer'],
      'Пропусти мешочек через анализатор четыре раза. Для последней ступени нужны 9000 EU. Сохрани полностью изученный образец для маточной грядки.', {...reed, scan: 4}],
    ['crop_harvester', 'Сборщик для участка 11×11', crop('lv_crop_manager'), 1, ['crop_stakes', 'crop_cuttings', 'lv_shop_sensor', 'lv_shop_robot', 'lv_creosote'],
      'В сборщике LV соедини корпус, приводы, датчик, манипулятор, схему и четыре жерди с 500 мБ креозота. Машину ставь в центре поля. Она достаёт на пять блоков по горизонтали и на два вверх и вниз.'],
    ['crop_discharge', 'Отвод первого урожая', 'minecraft:wheat', 24, ['crop_harvester', 'crop_cuttings', 'lv_shop_tin_pipe'],
      'Подключи к машине EU и воду. Поставь конвейер на предметную трубу и забери в сундук первую партию пшеницы.'],
    ['crop_latex', 'Смола со зрелого побега', gt('sticky_resin'), 3, ['crop_genes', 'crop_discharge'],
      'Дай липкому тростнику полностью созреть. На промежуточной стадии он даст стебли, на последней можно собрать липкую смолу.'],
    ['crop_resin', 'Запас смолы с опытной делянки', gt('sticky_resin'), 16, ['crop_latex', 'resin'],
      'Оставь ряд липкого тростника для регулярных сборов. Первую партию смолы отложи для изоляции.'],
    ['crop_flax', 'Льняная нить', 'minecraft:string', 8, ['crop_wheat', 'crop_knife', 'crop_discharge'],
      'Сохрани семена льна из селекционной грядки. Взрослые растения дают нить для ремесленных работ.'],
    ['crop_coppon', 'Медный хлопок для реактора MV', drop('coppon'), 4, ['crop_flax', 'crop_resin', 'mv_chemical_reactor'],
      'Собери медный хлопок. В химическом реакторе сверь рецепт для выбранной медной руды и подай дроблёную руду вместе с урожаем.'],
    ['crop_tine', 'Оловянный урожай', drop('tine'), 4, ['crop_stickreed_seed', 'crop_wheat', 'mv_chemical_reactor', 'tin_ingot'],
      'Отложи отдельно оловянный урожай и касситерит. Совместную переработку веди на линии MV.'],
    ['crop_ferru', 'Сбор ферру', drop('ferru'), 4, ['crop_coppon', 'crop_tine'],
      'Устрой грядку для ферру и собери зрелые плоды. Отправь их в линию очистки железной руды.'],
    ['crop_oilberries', 'Масло из нефтяных ягод', drop('oil_berry'), 8, ['crop_latex', 'washed_oil_sample', 'crop_manager_mv'],
      'Ягоды накапливай в предметном буфере. В экстракторе MV выдели из них жидкость и отведи её в отдельную ёмкость.'],
    ['crop_steel', 'Стальнолист для металлургического цеха', gt('steel_dust'), 4, ['crop_ferru', 'first_steel', 'hv_foundry_accepted'],
      'Выдели ряд для стальнолиста. Зрелые листья дают стальную пыль, иногда со сбором попадается готовый слиток.'],
    ['crop_bauxia', 'Бауксия для алюминиевой линии', drop('bauxite'), 4, ['crop_coppon', 'crop_tine', 'hv_foundry_accepted'],
      'Собери плоды бауксии. На линии HV выбери в JEI нужную бокситовую руду и приготовь партию к переработке.'],
    ['crop_titania', 'Ильменит с титановой грядки', drop('ilmenite'), 4, ['crop_steel', 'crop_bauxia', 'vacuum_titanium_ingot', 'ev_foundry_accepted'],
      'Подготовь подходящую опору под пашней и дождись созревания титании. На переработку ильменитового урожая выдели реактор EV.'],
    ['crop_platina', 'Платиновый урожай для реактора IV', drop('platinum'), 4, ['crop_titania', 'crop_ferru', 'iv_platinum_plate', 'iv_commissioning'],
      'Оставь семенной ряд платины. Часть плодов отправь на линию IV вместе с подходящей дроблёной рудой.'],
    ['crop_diareed', 'Алмазная пыль с тростника', gt('diamond_dust'), 4, ['crop_oilberries', 'crop_bauxia', 'iv_commissioning'],
      'Чтобы тростник созрел, подложи алмазную опору под грядку. Основной урожай пылевидный, иногда встречается целый алмаз.'],
    ['crop_quantaria', 'Иридиевые плоды квантарии', drop('iridium'), 4, ['crop_platina', 'crop_diareed', 'luv_commissioning'],
      'Высади квантарии на участке с иридиевым основанием. Собери четыре порции иридиевых плодов для переработки на LuV.'],
    ['crop_stargatium', 'Наквадах со старгатиума', drop('naquadah'), 4, ['crop_quantaria', 'crop_titania', 'crop_manager_uv'],
      'Подготовь наквадаховое основание. Вместе с обычным урожаем старгатиум изредка даёт наквадаховые плоды. Их переработка требует UV.']
  ]
  const tiers = ['mv', 'hv', 'ev', 'iv', 'luv', 'zpm', 'uv']
  const gates = ['mv_assembler', 'hv_foundry_accepted', 'ev_foundry_accepted', 'iv_commissioning',
    'luv_commissioning', 'zpm_commissioning', 'uv_casing']
  tiers.forEach((tier, i) => {
    const size = 15 + i * 4
    const prev = i ? 'crop_manager_' + tiers[i - 1] : 'crop_harvester'
    const voltage = tier === 'luv' ? 'LuV' : tier.toUpperCase()
    rows.push(['crop_manager_' + tier, 'Поле ' + size + '×' + size + ' на ' + voltage, crop(tier + '_crop_manager'),
      1, [prev, gates[i]], 'Перенеси предыдущий сборщик в сборочную машину ' + voltage +
      '. Добавь корпус и приводы этого напряжения. После установки оставь по ' + (size - 1) / 2 + ' блоков от машины до края поля.'])
  })
  return {
    key: 'gregcrops', title: 'Селекция GregCrops', icon: crop('lv_crop_manager'),
    rows: rows.map(([key, title, item, count, deps, description, tag]) =>
      [key, title, item, count, deps, description, true, tag]),
    rewards: {
      crop_stakes: {item: 'kubejs:wooden_peg', count: 2}, crop_wheat: {item: crop('crop_stick'), count: 2},
      crop_knife: {item: gt('iron_plate'), count: 1}, crop_genes: {item: crop('crop_stick'), count: 4},
      crop_harvester: {item: gt('steel_plate'), count: 2}, crop_discharge: {item: gt('tin_small_item_pipe'), count: 2}
    }
  }
}
