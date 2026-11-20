export function connectLvWorkshop(chapters) {
  const chapter = chapters.find(section => section.key === 'lv')
  const rows = new Map(chapters.flatMap(section => section.rows.map(row => [row[0], row])))
  const gt = name => 'gtceu:' + name
  const part = name => 'kubejs:' + name

  function revise(key, dependencies, text) {
    const row = rows.get(key)
    if (!row) throw Error('Missing LV workshop quest ' + key)
    row[4] = dependencies
    row[5] = text
  }

  chapter.rows.push(
    ['lv_terminal_pair', 'Два вывода на керамике', part('lv_terminal_block'), 2,
      ['copper_contacts', 'lining', 'rivets', 'pressed_insulation'],
      'Уложи по медной полосе с каждой стороны футеровки. Снизу подложи изоляцию, сверху поставь две заклёпки. По одному такому клеммнику нужно на каждую сторону корпуса LV.'],
    ['lv_tin_wire_run', 'Волочение олова в шесть нитей', gt('tin_single_wire'), 6,
      ['tin_wire_blank', 'lv_shop_wiremill'],
      'Та же размеченная заготовка даёт четыре провода под паровым молотом и шесть на волочильном станке LV. Одна протяжка занимает 8 секунд.', true],
    ['lv_cable_serving', 'Креозотовая пропитка кабеля', gt('tin_single_cable'), 4,
      ['tin_cable', 'lv_tin_wire_run', 'assembler', 'lv_creosote'],
      'Загрузи четыре оловянных провода, шесть полос изоляции и два шнура. Подай 125 мБ креозота в сборщик. За 10 секунд получишь четыре кабеля.', true],
    ['lv_winding_foil', 'Фольга для медной обмотки', gt('copper_foil'), 4,
      ['copper_plate', 'lv_shop_bender'],
      'Прокатай медную пластину в гибочном станке LV с интегральной схемой в режиме 1. Накопи четыре листа фольги. Контактные полосы отложи отдельно для клеммников и мостиков.'],
    ['lv_fine_winding', 'Провод для катушки', gt('fine_copper_wire'), 8,
      ['lv_winding_foil', 'lv_shop_wiremill'],
      'Волочильный станок тянет две тонкие медные проволоки из каждого листа фольги. Восемь проволок хватит на обмотки двух статоров.'],
    ['lv_parallel_stators', 'Намотка пары статоров', part('wound_stator'), 2,
      ['lv_fine_winding', 'lv_stator', 'assembler', 'lv_creosote'],
      'На два вала возьми четыре железные пластины, восемь тонких проволок и две полосы изоляции. Подай 125 мБ креозота в сборщик для пропитки обмоток.', true],
    ['lv_liquid_solder_sample', 'Проба расплавленного припоя', part('tin_solder_preform'), 1,
      ['lv_solder', 'lv_shop_extractor'],
      'Электрический экстрактор даёт по 72 мБ расплавленного олова с заготовки. Для пробы передай 144 мБ через экран задач FTB Quests. Олово уйдёт в пробу. Остальную партию направь на пайку.', true, undefined,
      {fluid: gt('tin'), amount: 144}],
    ['lv_terminal_series', 'Клеммники для серии корпусов', part('lv_terminal_block'), 4,
      ['lv_terminal_pair', 'lv_shop_extractor', 'lv_solder', 'assembler'],
      'На четыре клеммника загрузи четыре футеровки, шесть контактных полос, четыре заклёпки и четыре полосы изоляции. Сборщик запаяет соединения, израсходовав 144 мБ олова.', true],
    ['lv_contact_bridge', 'Подвижный медный мостик', part('lv_contact_bridge'), 1,
      ['copper_contacts', 'lv_shop_bender'],
      'Сложи две контактные полосы в гибочный станок. За 9 секунд он выдаст мостик. В контакторе эта деталь замыкает два вывода.'],
    ['lv_line_contactor', 'Коммутация силовой линии', part('lv_line_contactor'), 1,
      ['lv_terminal_pair', 'lv_contact_bridge', 'lv_fine_winding', 'lv_armature', 'lv_shop_circuit_assembler', 'lv_shop_extractor', 'lv_solder'],
      'В монтажный станок положи два клеммника, мостик, четыре тонкие проволоки, якорь, схему LV и изоляцию. На пайку уходит 144 мБ олова. Первый контактор отложи на энерговвод электродомны.'],
    ['lv_precision_mount', 'Четыре схемы за одну пайку', gt('basic_electronic_circuit'), 4,
      ['lv_shop_circuit_assembler', 'lv_fine_winding', 'lv_shop_extractor', 'lv_printed_board', 'lv_vacuum_tube', 'lv_resistors'],
      'На монтажном станке одна порция олова в 144 мБ обслуживает четыре платы. Подай восемь резисторов, четыре лампы, восемь тонких проволок, четыре контактные полосы и две полосы изоляции.', true]
  )

  revise('lv_hull', ['lv_casing', 'tin_cable', 'blank', 'lv_terminal_pair'],
    'Поставь клеммники над и под оболочкой LV. По бокам подключи по оловянному кабелю, четыре угла закрой штампованными бронзовыми заготовками.')
  revise('assembler', ['turbine', 'lv_conveyor', 'lv_hand_circuit', 'lv_hull'],
    'Подключи сборщик к выходу турбины. Для первой электрической пайки понадобится расплавленное олово. Пока строишь насос и экстрактор, недостающие схемы можно паять вручную.')
  revise('lv_shop_wiremill', ['assembler', 'lv_hull', 'motor', 'pressed_steel_frame', 'bushing', 'belt_blank'],
    'Собери волочильный станок с электродвигателем, двумя втулками и приводным ремнём. На нём можно тянуть силовые провода и тонкую проволоку для обмоток.')
  revise('lv_shop_bender', ['assembler', 'lv_hull', 'lv_shop_piston', 'pressed_steel_frame', 'steel_plate', 'field_saddle'],
    'Поставь поршень и кузнечную оснастку в корпус LV. Гибочный станок нужен для фольги, контактных мостиков и первого алюминиевого листа.')
  revise('lv_shop_circuit_assembler', ['assembler', 'lv_shop_robot', 'copper_contacts', 'lv_hand_circuit', 'pressed_steel_frame'],
    'Собери монтажный станок из манипулятора, контактных полос, схем и корпуса LV. Подведи олово к жидкостному входу. На нём собираются силовые контакторы и партии схем.')
  revise('lv_circuit_batch', ['assembler', 'lv_shop_extractor', 'lv_solder', 'lv_resistors', 'lv_vacuum_tube', 'lv_printed_board', 'pressed_insulation'],
    'Для двух схем положи в сборщик две печатные платы, четыре резистора, две лампы, четыре оловянных провода, две контактные полосы и две полосы изоляции. На цикл нужно 144 мБ олова. Накопи 16 схем.')
  const converter = rows.get('ie_fe_converter')
  converter[1] = 'Выход FE от турбины LV'
  revise('ie_fe_converter', converter[4],
    'Для оборудования с питанием FE переключи преобразователь киянкой в режим EU → FE. Подведи кабель LV к входу. Формовочный пресс GregTech подключается к кабелю LV напрямую.')
  const pressPistons = rows.get('ie_press_piston')
  pressPistons[1] = 'Два поршня для формовочного пресса'
  pressPistons[2] = gt('lv_electric_piston')
  pressPistons[3] = 2
  revise('ie_press_piston', ['lv_shop_piston'],
    'Собери два электрических поршня LV. Первый установи при переделке парового компрессора. Второй понадобится вместе с готовым компрессором при сборке формовочного пресса GregTech.')
  revise('ie_press_body', [...rows.get('ie_press_body')[4], 'ie_press_piston', 'lv_shop_compressor'],
    'В сборщик подай компрессор LV, ещё один электрический поршень и кузнечную оснастку вместе с деталями корпуса. Готовый формовочный пресс подключи к линии LV. Для прессованного железа поставь в станок пластинчатую матрицу.')
  revise('foundry_frame_batch', ['pressed_steel_frame', 'ebf_casings'],
    'После первых жаростойких кожухов подготовь запас из 32 штампованных рам. Они пойдут на кожухи и люки следующей электродомны.')
  revise('early_industrial_supply_coal_batch', ['coking_charge', 'turbine'],
    'После пуска турбины отложи 24 куска угля на восемь коксовых загрузок. Каждой загрузке нужны ещё две порции древесноугольной пыли и изоляционная масса.')
  revise('early_industrial_supply_coke_hearth', ['first_coke', 'early_industrial_supply_coal_batch'],
    'Собери в общей сложности 50 блоков кладки для двух коксовых печей. Подготовь по отдельному контроллеру и оставь место для отвода креозота.')
  revise('early_industrial_supply_flux_batch', ['steel_charge', 'lv_shop_macerator'],
    'Измельчи кальцит в электрической дробилке. Отложи двенадцать порций известкового флюса для примитивной домны, чтобы партия стали на электрический цех шла без перерыва.')
  revise('early_industrial_supply_creosote', ['lv_creosote', 'lv_cable_serving'],
    'Отбери из коксовой печи четыре ведра креозота. Из одного ведра сборщик пропитает восемь партий по четыре оловянных кабеля.')
  for (const [key, text] of [
    ['ebf_energy', 'Поставь контактор в основание энерговвода. Разверни лицевую грань энерговвода к оловянному кабелю или прямо к выходу турбины. Первой плавке нужно 28 EU/t.'],
    ['mv_casing', 'На оболочку MV нужны четыре алюминиевые пластины, четыре стальные рамы, два вкладыша футеровки, уплотнение и контактор LV. Подай в сборщик 400 мБ воды.'],
    ['lv_shop_buffer', 'Поставь контактор в буфер на четыре аккумулятора. Заряди батареи от турбины и разверни выход буфера к линии станков.']
  ]) {
    const row = rows.get(key)
    revise(key, [...new Set([...row[4], 'lv_line_contactor'])], text)
  }
  Object.assign(chapter.rewards ??= {}, {
    lv_terminal_pair: {item: part('copper_contact_strip'), count: 1},
    lv_contact_bridge: {item: part('copper_contact_strip'), count: 2},
    lv_line_contactor: {item: part('pressed_insulation'), count: 2},
    lv_liquid_solder_sample: {item: gt('tin_single_wire'), count: 1}
  })
}
