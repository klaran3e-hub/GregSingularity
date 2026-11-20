const titles = {
  gravel: 'Ручной разбор гравия',
  slat: 'Щепные планки для настила',
  chest: 'Сундук без клея',
  barrel: 'Бочка на обвязке',
  ladder: 'Лестница к рудной жиле',
  lining: 'Обжиг футеровки на костре',
  crucible: 'Обожжённый тигель',
  gold_charge: 'Золотая шихта',
  tin_charge: 'Шихта для плавки олова',
  drawer_double: 'Ящик на два отделения',
  drawer_quad: 'Ящик на четыре отделения',
  drawer_half: 'Ящик половинной глубины',
  drawer_trim: 'Обвязка складских ящиков',
  drawer_upgrade_base: 'Рамка складского улучшения',
  drawer_compact_2: 'Ящик на две степени упаковки',
  drawer_compact_3: 'Ящик на три степени упаковки',
  drawer_gold: 'Золотое расширение склада',
  drawer_emerald: 'Изумрудное расширение склада',
  drawer_diamond: 'Алмазное расширение склада HV',
  drawer_netherite: 'Незеритовое расширение склада EV',
  bronze_casing: 'Бронзовый корпус для пара',
  case_reserve: 'Ремонтный запас паровых корпусов',
  pipe_reserve: 'Ремонтный запас паровых труб',
  blank_reserve: 'Партия штампованных заготовок LV',
  insulating_gum: 'Паровая вытяжка связующего',
  tin_cable: 'Изолированный оловянный кабель',
  lv_circuit_laminate: 'Слои платы LV',
  lv_hull: 'Первый корпус машины LV',
  lv_conveyor: 'Конвейер подачи LV',
  assembler: 'Сборщик для серийной работы LV',
  lv_circuit_batch: 'Партия из 16 схем LV',
  foundry_coal: 'Каменный уголь для коксования',
  ebf_energy: 'Энерговвод LV для домны',
  ebf_input: 'Предметный ввод домны',
  ebf_output: 'Предметный вывод домны',
  hot_aluminium_billet: 'Первая плавка алюминия при 1700 К',
  mv_copper_cable: 'Медный кабель MV',
  mv_turbine: 'Паровая турбина MV',
  mv_chemical_reactor: 'Химический реактор MV',
  oil_energy_hatch: 'Энерговвод буровой MV',
  recovered_salt: 'Соль из отработанного рассола',
  activated_carrier: 'Активированная насадка для крекинга',
  polyethylene_batch: 'Серия полиэтиленовых листов',
  nether_chromite: 'Промывка хромитового концентрата',
  nether_kanthal_charge: 'Шихта для первой плавки кантала',
  nether_kanthal_winding: 'Канталовые обмотки из слитка',
  nether_stainless_charge: 'Шихта для нержавеющей стали',
  nether_hot_stainless: 'Плавка нержавеющей стали при 2450 К',
  me_press_logic: 'Логическая матрица',
  me_press_calc: 'Вычислительная матрица',
  me_shell: 'Экранированный корпус ME',
  me_converter: 'Преобразователь питания ME от MV',
  me_charger: 'Зарядник для сертиуса',
  me_laminate: 'Опрессовка пьезоламината',
  me_inscriber: 'Инскрайбер для матриц',
  yard_fluid_pipe: 'Жидкостная обвязка приёмки',
  yard_sealed_batch: 'Упаковка огнеупоров',
  rail_profile: 'Прокат рельсового профиля',
  rail_sleepers: 'Пропитка шпал',
  hv_sealed_module: 'Опрессовка модуля HV при 4,5 бар',
  hv_gold_cable: 'Золотой кабель HV',
  hv_trial_billet: 'Пробная плавка при 2550 К',
  hv_ancient_scrap: 'Извлечение древнего сплава',
  end_first_eye: 'Стабилизация ока Эндера',
  end_portal_eyes: 'Запас очей для поиска крепости',
  end_field_macerator: 'Резак для эндерняка',
  end_sample_filter: 'Заправка газовой кассеты',
  end_separated_gas: 'Разделение первой газовой пробы',
  end_popped_chorus: 'Сушка хоруса под защитным газом',
  vacuum_gasket: 'Опрессовка вакуумных уплотнений',
  vacuum_fluid_inputs: 'Два жидкостных ввода камеры',
  vacuum_loop_buffers: 'Горячий и холодный буферы',
  vacuum_rutile: 'Промывка рутилового концентрата',
  vacuum_titanium_charge: 'Загрузка титановой шихты',
  vacuum_panel_hot: 'Обжиг панели под защитным газом',
  cleanroom_controller: 'Контроллер чистой комнаты',
  cleanroom_power_feed: 'Кабельный ввод чистой комнаты',
  cleanroom_logic_preform: 'Заготовка логического модуля EV',
  ev_aluminium_cable: 'Алюминиевая магистраль EV',
  ev_wide_cable: 'Кабель EV на четыре ампера',
  ev_engine_energy_out: 'Энерговывод двигателя EV',
  ev_foundry_accepted: 'Приёмка чистого производства',
  ev_end_crystal: 'Эндерный кристалл для оснастки',
  me_covered: 'Изолированные кабели ME',
  me_wireless: 'Беспроводной терминал ME',
  iv_tungstate_concentrate: 'Марсианский вольфраматный концентрат',
  iv_tungsten_cake: 'Выщелачивание вольфрамата',
  iv_tungsten_dust: 'Сушка вольфрамового осадка',
  iv_hot_tungstensteel: 'Плавка вольфрамовой стали при 3600 К',
  iv_platinum_cake: 'Очистка платинового осадка',
  iv_masked_wafer: 'Нанесение фоторезиста',
  iv_clean_die: 'Проявление кристалла',
  iv_cable: 'Вольфрамовая магистраль IV',
  iv_quad_cable: 'Магистраль IV на четыре ампера',
  iv_motor: 'Двигатель IV',
  iv_engine_fluid: 'Два жидкостных контура двигателя',
  iv_four_amp_input: 'Энерговвод IV на четыре ампера',
  iv_line_fluid_hatches: 'Три жидкостных ввода линии IV',
  luv_niobium_charge: 'Шихта проводникового сплава',
  luv_niobium_plate: 'Закалка ниобий-титанового листа',
  luv_cable: 'Ниобий-титановая магистраль LuV',
  luv_cable_4a: 'Магистраль LuV на четыре ампера',
  luv_hatch_1a: 'Энерговвод LuV на один ампер',
  luv_hatch_4a: 'Энерговвод LuV для HPCA',
  luv_fusion_input: 'Два жидкостных ввода Mk I',
  luv_fusion_output: 'Вывод горячей плазмы Mk I',
  luv_bulk_storage: 'Лапотронные блоки LuV',
  zpm_mk1_capacity: 'Энерговводы для заряда Mk I',
  zpm_voltage_coil: 'Катушки напряжения ZPM',
  zpm_battery: 'Лапотронные блоки ZPM',
  zpm_mk2_input: 'Два жидкостных ввода Mk II',
  zpm_mk2_output: 'Вывод тяжёлой плазмы Mk II',
  zpm_hpca_32: 'Сфера данных для приёмки ZPM',
  uv_voltage_coil: 'Катушки напряжения UV',
  uv_lapotronic_battery: 'Лапотронные блоки UV',
  uv_line_fluid_hatches: 'Четыре жидкостных ввода ZPM',
  uv_mk3_input: 'Два жидкостных ввода Mk III',
  uv_mk3_output: 'Вывод жидкого нейтрония Mk III',
  uv_hpca_64: 'Вычислительная сеть на 64 CWU/t',
  final_cc_computer: 'Промышленный компьютер диспетчера',
  final_cc_modem: 'Проводные модемы диспетчерской',
  final_cc_cable: 'Кабель диспетчерской сети',
  final_cc_monitor: 'Мониторы диспетчерской',
  final_line_fluids: 'Четыре жидкостных ввода UV',
  final_steel_dispatch_seal: 'Серийная маркировка стали',
  final_polymer_dispatch_seal: 'Серийная маркировка полимера',
  final_logic_dispatch_seal: 'Серийная маркировка электроники',
  final_controlled_shop: 'Привязка трёх производственных линий',
  final_isolation_check: 'Проверка развязки накопителей',
  final_black_start_record: 'Протокол холодного пуска',
  final_outage_record: 'Протокол работы от резерва',
  final_shift_record: 'Протокол приёмочной смены',
  stonecutter: 'Станок для резки камня'
}

const timberMaterials = {
  oak: ['Дубовые брёвна', 'дуба'],
  spruce: ['Еловые брёвна', 'ели'],
  birch: ['Берёзовые брёвна', 'берёзы'],
  jungle: ['Тропические брёвна', 'тропического дерева'],
  acacia: ['Акациевые брёвна', 'акации'],
  dark_oak: ['Брёвна тёмного дуба', 'тёмного дуба'],
  mangrove: ['Мангровые брёвна', 'мангрового дерева'],
  cherry: ['Вишнёвые брёвна', 'вишни'],
  bamboo: ['Блоки бамбука', 'бамбука'],
  crimson: ['Багровые стебли', 'багрового стебля'],
  warped: ['Искажённые стебли', 'искажённого стебля']
}

export function timberQuestParts(chapterKey, questKey) {
  if (!chapterKey.startsWith('timber_')) return undefined
  const wood = chapterKey.slice('timber_'.length)
  const prefix = 'wood_' + wood + '_'
  const material = timberMaterials[wood]
  if (!material || !questKey.startsWith(prefix)) return undefined
  return [wood, questKey.slice(prefix.length), material[1]]
}

function timberTitle(wood, operation) {
  const material = timberMaterials[wood]
  if (!material) return undefined
  const [stock, source] = material
  switch (operation) {
    case 'logs': return stock
    case 'hand': return 'Ручная распиловка ' + source
    case 'mill': return 'Запас досок из ' + source
    case 'slabs': return 'Напольные плиты из ' + source
    case 'stairs': return 'Лестничные ступени из ' + source
    case 'fence': return 'Ограждение из ' + source
    case 'gate': return 'Шарнирная калитка из ' + source
    case 'door': return 'Двери на шарнирах из ' + source
    case 'hatch': return 'Служебные люки из ' + source
    case 'button': return 'Кнопки управления из ' + source
    case 'pressure': return 'Нажимные плиты из ' + source
    case 'sign': return 'Маркировочные таблички из ' + source
    case 'hanging': return 'Подвесные указатели из ' + source
    case 'boat': return wood === 'bamboo' ? 'Бамбуковый плот' : 'Лодка из ' + source
    case 'cargo': return wood === 'bamboo' ? 'Бамбуковый плот с сундуком' : 'Лодка с сундуком из ' + source
    default: return undefined
  }
}

export function questTitle(chapterKey, [key, authoredTitle]) {
  if (Object.hasOwn(titles, key)) return titles[key]
  const parts = timberQuestParts(chapterKey, key)
  return parts ? timberTitle(parts[0], parts[1]) ?? authoredTitle : authoredTitle
}

function normalize(title) {
  return title.normalize('NFKC').toLocaleLowerCase('ru').replaceAll('ё', 'е').replace(/[\s\p{P}\p{S}]+/gu, ' ').trim()
}

function recordTitle(entries, invalidTitles, key, title) {
  if (typeof title !== 'string' || !normalize(title) || title !== title.trim() || /[—\r\n\t]|\s{2,}/u.test(title)) {
    invalidTitles.push({ key, title })
    return
  }
  const label = normalize(title)
  if (!entries.has(label)) entries.set(label, [])
  entries.get(label).push({ key, title })
}

function duplicates(entries) {
  return [...entries.values()].filter(group => group.length > 1)
}

export function auditQuestTitles(chapters) {
  const chapterTitles = new Map()
  const authoredQuestTitles = new Map()
  const editedQuestTitles = new Map()
  const invalidTitles = []
  const invalidAuthoredTitles = []
  const unusedOverrides = new Set(Object.keys(titles))
  let quests = 0
  let changed = 0
  let timberQuests = 0
  for (const { key, title, rows } of chapters) {
    recordTitle(chapterTitles, invalidTitles, key, title)
    for (const row of rows) {
      const [questKey, authoredTitle] = row
      const title = questTitle(key, row)
      quests++
      if (title !== authoredTitle) changed++
      if (key.startsWith('timber_')) timberQuests++
      unusedOverrides.delete(questKey)
      recordTitle(authoredQuestTitles, invalidAuthoredTitles, questKey, authoredTitle)
      recordTitle(editedQuestTitles, invalidTitles, questKey, title)
    }
  }
  return {
    chapters: chapters.length, quests, changed, timberQuests,
    duplicateChapterTitles: duplicates(chapterTitles),
    originalDuplicateQuestTitles: duplicates(authoredQuestTitles),
    duplicateQuestTitles: duplicates(editedQuestTitles),
    invalidTitles, invalidAuthoredTitles, unusedOverrides: [...unusedOverrides]
  }
}
