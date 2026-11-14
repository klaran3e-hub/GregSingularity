const gt = id => 'gtceu:' + id
const ks = id => 'kubejs:' + id
const me = id => 'ae2:' + id
const ie = id => 'immersiveengineering:' + id
const pnc = id => 'pneumaticcraft:' + id
const create = id => 'create:' + id

export function expandLuVZpm(chapters) {
  const rows = key => chapters.find(chapter => chapter.key === key).rows
  const add = (key, tasks) => rows(key).push(...tasks.map(task => [...task, true]))
  const describe = (key, quest, description) => {
    rows(key).find(row => row[0] === quest)[5] = description
  }

  describe('luv_power', 'luv_package', 'Опрессуй ядро с модулем IV, диэлектриком, инженерным процессором, прокладкой и продвинутой трубой. На ветке камеры поставь клапан на 4,92 бар. Рабочий минимум рецепта 4,9 бар.')
  describe('luv_fusion', 'luv_fusion_reactor', 'Удлини линию до девяти предметных входов и выходной секции. В девятый вход поставь два накопителя IE высокого напряжения. Вставь записанную сферу, подай газ, смазку и теплоноситель. Цикл идёт при 32000 EU/t. Само кольцо строй по JEI.')
  describe('luv_fusion', 'luv_commissioning', 'Исследуй протокол зажигания с чистой сферой при 12 CWU/t и 36000 CWU. Вставь запись в линию LuV на девять входов. Последние два накопителя IE подай отдельно от памяти AE2. Нужны 4000 мБ плазмы, 3500 мБ защитного газа и 4000 мБ смазки. Цикл идёт пять минут при 32000 EU/t.')
  describe('zpm_europium', 'zpm_europium_target', 'При 4,9 бар опрессуй по две порции соли и концентрата, восемь кварца, четыре пробы LuV, два отражателя, четыре прокладки и две продвинутые трубы. Получишь две мишени. Ветку камеры держи за клапаном на 4,92 бар.')

  add('luv_alloys', [
    ['luv_alloy_return_control', 'Два холодных поста для трёх сплавов', gt('iv_input_hatch'), 4, ['luv_hssg_plate', 'luv_niobium_hot', 'iv_dual_vacuum_outputs'], 'На каждом посту разведи защитный газ и холодную жидкость по двум люкам. На выходе слиток и тёплая обратка идут в разные буферы.'],
    ['luv_hssg_drive_stock', 'Оснастка для намотки HSS-G', create('precision_mechanism'), 8, ['luv_hssg_plate', 'luv_hssg_winding'], 'Отложи механизмы Create и восемь изолированных катушек IE на четыре партии обмоток. Старые блоки нихрома подавай отдельной линией.'],
    ['luv_end_tailing_sort', 'Отделение хвостов на танталите', ks('ore_tailings'), 16, ['luv_tantalite_concentrate', 'luv_end_buffer'], 'Выведи хвосты центрифуги в отдельный ящик. Две партии концентрата уходят на выщелачивание, часть запаса оставь в Энде для следующей линии.'],
    ['luv_end_buffer', 'Склад у центрифуги в Энде', gt('stainless_steel_crate'), 3, ['luv_centrifuge_iv', 'luv_tantalite_ore'], 'Разнеси дроблёнку, концентрат и хвосты по отдельным ящикам. Подвод защитного газа держи у станка.'],
    ['luv_leach_recycle', 'Отдельная выдача регенерированного раствора', gt('iv_fluid_regulator'), 2, ['luv_niobium_cake', 'luv_pgm_sludge', 'iv_leach_return_tanks'], 'Подай на восстановление 1200 мБ отработанной жидкости. Вернувшиеся 900 мБ смешивай с новой порцией только после фильтрации.'],
    ['luv_palladium_reserve', 'Палладий на оптику и реактор', gt('rhodium_plated_palladium_plate'), 32, ['luv_palladium_plate', 'luv_alloy_return_control', 'luv_leach_recycle'], 'Собери резерв листов отдельно от выдачи на обмотки. На каждую горячую болванку подай 1800 мБ аргона, на охлаждение 3000 мБ холодной жидкости.']
  ])

  add('luv_power', [
    ['luv_niobium_bare_bundle', 'Четыре голые жилы', gt('niobium_titanium_quadruple_wire'), 4, ['luv_wire', 'luv_busbar'], 'Сначала собери двойной провод, затем по два двойных в четырёхжильный. Для сборщика нужны стальные катушки IE и смазка.'],
    ['luv_niobium_pipe_route', 'Ниобий-титановый трубопровод', gt('niobium_titanium_normal_fluid_pipe'), 12, ['luv_niobium_plate', 'luv_laminate', 'iv_wolfram_fluid_feed'], 'Футеруй вольфрамовые трубы IV с диэлектриком и продвинутой пневмотрубой. Отметь отдельные трассы газа и теплоносителя.'],
    ['luv_niobium_hex', 'Шестнадцатижильная магистраль', gt('niobium_titanium_hex_cable'), 4, ['luv_cable_4a', 'luv_niobium_bare_bundle', 'luv_transformer_bank'], 'Раздели голую скрутку и изоляцию. Для кабеля на 16 пакетов нужны шестнадцать одиночных кабелей и собственная голая скрутка.'],
    ['luv_optics_press_buffer', 'Подача оптики под пресс', create('brass_funnel'), 2, ['luv_waveguide', 'luv_niobium_pipe_route'], 'Первую воронку настрой на оптические заготовки, вторую на готовые волноводы. Не пускай их в общую выдачу прокатного стола.'],
    ['luv_chamber_safety', 'Клапан на ветке герметизации', pnc('safety_tube_module'), 1, ['luv_package', 'pressure_interfaces'], 'Поставь обычную трубу с клапаном на ветке камеры. Он открывается после 4,92 бар. На усиленной трубе штатная уставка 19,9 бар, там нужен настроенный клапан или регулятор.'],
    ['luv_hatch_16a', 'Силовой ввод расширенной серверной', gt('luv_energy_input_hatch_16a'), 1, ['luv_hatch_4a', 'luv_niobium_hex', 'luv_assembler'], 'Собери ввод на четырёх люках LuV 4A. Перед подключением проверь запас генерации и пропускную способность магистрали.']
  ])

  add('luv_computation', [
    ['luv_hpca_vent_stock', 'Сменная вентиляция HPCA', gt('computer_heat_vent'), 16, ['luv_vents', 'luv_palladium_reserve'], 'На четыре вентиляционных блока приготовь два вентилятора Create и два радиатора PneumaticCraft. Часть блоков уйдёт на сборку пассивных модулей.'],
    ['luv_hpca_optical_loop', 'Резерв оптоволокна', gt('normal_optical_pipe'), 24, ['luv_computation_send', 'luv_computation_receive', 'luv_advanced_casing'], 'Соедини передатчик массива и приёмник станции. Держи запас трубы для второй станции и не прокладывай её вплотную к незапитанному ответвлению.'],
    ['luv_hpca_coolant_tank', 'Буфер активного охлаждения', gt('luv_input_hatch'), 1, ['luv_cooling_active', 'luv_fusion_input', 'luv_niobium_pipe_route'], 'Подай штатный теплоноситель HPCA в разрешённый JEI вход. Подключи охлаждение до того, как поставишь усиленные вычислители под нагрузку.'],
    ['luv_research_orb_reserve', 'Носители на две независимые линии', gt('data_orb'), 8, ['luv_orbs', 'luv_advanced_data', 'luv_hpca_optical_loop'], 'Пустые и записанные сферы держи в разных контейнерах. Для реактора и приёмки используй отдельные записи.'],
    ['luv_station_power_isolation', 'Отдельное питание исследовательской станции', gt('luv_diode'), 1, ['luv_research_station', 'luv_hatch_16a'], 'Выдели станцию на отдельную ветвь после диода. При просадке серверной исследование можно запускать от резервного ввода.']
  ])

  add('luv_fusion', [
    ['luv_fusion_capacitor_order', 'Накопители для девятой позиции', ie('capacitor_hv'), 4, ['luv_specimen', 'luv_fusion_casing', 'hv_shop_ie_capacitor'], 'Два накопителя отложи под контроллер и два под протокол. На сборочной линии это отдельный вход после вычислительной памяти.'],
    ['luv_fusion_extra_item_bus', 'Девятая предметная шина', gt('ulv_input_bus'), 9, ['iv_line_input_buses', 'luv_fusion_capacitor_order'], 'Добавь девятую входную секцию перед выходом. Одиночная шина ULV принимает один тип детали, поэтому разведи позиции по JEI.'],
    ['luv_isotope_divider', 'Изоляция двух изотопных потоков', gt('luv_fluid_regulator'), 2, ['luv_fuel_separation', 'luv_niobium_pipe_route'], 'На 2250 мБ дейтерия отведи 1250 мБ в обогащение и 1000 мБ прямо в кольцо. Тритий выводи в отдельный дозатор.'],
    ['luv_exhaust_reserve', 'Резерв отработанного гелия', gt('luv_output_hatch'), 2, ['luv_turbine', 'luv_isotope_divider'], 'Дай турбине принять плазму и разгрузи энерговывод. Отложи 1500 мБ отработанного газа на протокол и только потом пускай остаток на рекуперацию.'],
    ['luv_ignition_observers', 'Комплект датчиков на протокол', create('content_observer'), 4, ['luv_ignition_report', 'luv_specimen'], 'Для каждой записи подай по два наблюдателя Create и два манометра PneumaticCraft. Второй комплект отложи под усиленные модули HPCA.'],
    ['luv_power_trial_archive', 'Серия плазменных проб на две смены', ks('luv_plasma_coupon'), 24, ['luv_load_coupons', 'luv_exhaust_reserve', 'luv_hpca_coolant_tank'], 'Разложи пробы на контроль турбины, изготовление Wetware и европиевые мишени. На одну закалку уходит 500 мБ плазмы и 2400 мБ холодной жидкости.']
  ])

  add('luv_workshop', [
    ['luv_bulk_optical_batch', 'Оптические ядра на склад', ks('luv_optical_core'), 16, ['luv_bulk_parallel', 'luv_optics_press_buffer', 'luv_optical_core'], 'Закрепи за серийным выпуском своё депо и лазерный пост. Переноси оптическую маску только после остановки обеих машин.'],
    ['luv_bulk_stock_cells', 'Ячейки под руду и реагенты', me('item_storage_cell_256k'), 2, ['luv_bulk_chest', 'luv_bulk_tank', 'luv_bulk_stock_bus'], 'Одну ячейку выдели на полуфабрикаты, вторую на готовую оптику. Жидкости направь в отдельную жидкостную ячейку.'],
    ['luv_bulk_stock_bus', 'Шины буферного цеха', me('storage_bus'), 3, ['luv_bulk_bender', 'luv_bulk_wiremill', 'me_storage_bus'], 'Назначь отдельные шины на листы, проволоку и горячую обратку. Укажи в фильтрах, что сеть может брать из каждого буфера.']
  ])

  add('zpm_europium', [
    ['zpm_end_field_bins', 'Полевая партия тяжёлой фракции', ks('zpm_end_heavy_concentrate'), 24, ['zpm_end_heavy_concentrate', 'luv_end_tailing_sort'], 'Оставь запас дроблёнки у станции в Энде. Часть тяжёлой фракции уйдёт в мишени, часть в изотопные капсулы и грузовую сверку.'],
    ['zpm_nether_chlorine_feed', 'Хлорная ветка Нижнего мира', gt('luv_fluid_regulator'), 2, ['zpm_nether_isotope_salt', 'luv_niobium_pipe_route'], 'Поставь отдельные дозаторы хлора и защитного газа. На одну варку соли подай 3400 мБ хлора.'],
    ['zpm_mk1_throughput', 'Дозировка европиевого топлива', gt('luv_input_hatch'), 2, ['zpm_mk1_capacity', 'zpm_europium_mixer', 'luv_isotope_divider'], 'Поставь два люка под 1440 мБ европиевой подачи и 3000 мБ дейтерия. Переключай питание между кольцами только после остановки подачи.'],
    ['zpm_europium_batch', 'Три партии для силовой обвязки', gt('europium_ingot'), 12, ['zpm_europium_ingots', 'zpm_mk1_throughput', 'zpm_nether_chlorine_feed'], 'Выполни три плавки. Подготовь 9600 мБ холодной жидкости на закалку и ёмкость для полного объёма обратки.'],
    ['zpm_coil_winding_stock', 'Стальные катушки на обмотку домны', ie('wirecoil_steel'), 32, ['zpm_naquadah_heating', 'luv_hssg_drive_stock'], 'На восемь партий наквадаховых катушек отложи 32 стальных катушки IE и 16 механизмов Create. Готовые блоки ставь комплектом.']
  ])

  add('zpm_components', [
    ['zpm_laminate_stock', 'Вторая партия нейтронозащиты', ks('zpm_neutron_laminate'), 16, ['zpm_neutron_laminate', 'zpm_europium_batch'], 'На четыре партии подготовь по 16 блоков стекла IE и усиленных труб PneumaticCraft. Пресс Create принимает заготовки по одной.'],
    ['zpm_heavy_coolant_route', 'Наквадаховая трасса охлаждения', gt('naquadah_normal_fluid_pipe'), 12, ['zpm_laminate_stock', 'luv_niobium_pipe_route', 'zpm_naquadah_plates'], 'Используй ниобий-титановую трубу как основу. Отдельно заготовь трубы на горячую обратку и рабочие жидкости.'],
    ['zpm_pump_pressure_spares', 'Комплект регуляторов на насосы', pnc('advanced_pressure_tube'), 16, ['zpm_pump', 'zpm_heavy_coolant_route'], 'Подготовь шестнадцать труб и восемь предохранительных модулей на четыре насоса ZPM. Два насоса оставь на катушки реактора.'],
    ['zpm_feed_spare_arms', 'Два манипулятора на линию', gt('zpm_robot_arm'), 2, ['zpm_robot', 'zpm_conveyor', 'zpm_pump_pressure_spares'], 'К двум рукам ZPM отложи ещё четыре механические руки Create для следующей партии. Не снимай приводы с работающих конвейеров.']
  ])

  add('zpm_power', [
    ['zpm_bare_hex_bundle', 'Шестнадцать жил ZPM', gt('vanadium_gallium_hex_wire'), 2, ['zpm_vanadium_wire', 'zpm_cable', 'zpm_laminate_stock'], 'Собери провод последовательно из двойных, четырёхжильных и восьмижильных заготовок. Кабель изолируй отдельным циклом.'],
    ['zpm_bare_backup_fuel', 'Пневмопуск дизельного резерва', pnc('advanced_liquid_compressor'), 2, ['zpm_reserve_switchgear', 'iv_engine_buffer_station'], 'Два модернизированных компрессора нужны на партию из двух щитов. Следующую пару оставь у дизельного резерва для расширения.'],
    ['zpm_diode_cutoff', 'Отсечка резервного питания', gt('zpm_diode'), 1, ['zpm_buffer', 'zpm_bare_hex_bundle'], 'Разведи основную и резервную ветки и поставь диод на выдаче. Проверь направления питания до подключения нагрузочного участка.'],
    ['zpm_16a_inlet', 'Силовой ввод на шестнадцать пакетов', gt('zpm_energy_input_hatch_16a'), 1, ['zpm_power_4a', 'zpm_bare_hex_bundle', 'zpm_diode_cutoff'], 'Проверь, что новый ввод питается кабелем на 16 пакетов ZPM. Для постоянной работы одного аккумуляторного резерва недостаточно.']
  ])

  add('zpm_fusion', [
    ['zpm_mk2_coil_stock', 'Катушки на кольцо и контроллер', gt('fusion_coil'), 24, ['zpm_mk2_coils', 'zpm_pump_pressure_spares'], 'Отдели восемь катушек на контроллер. Остаток держи для сборки структуры, полный расход проверь в схеме JEI.'],
    ['zpm_mk2_computation_spares', 'Резерв вычислительных компонентов', gt('hpca_advanced_computation_component'), 3, ['zpm_hpca_24', 'luv_research_orb_reserve'], 'Две платы обслуживают исследования Mk II. Третью держи на случай ремонта массива. Следи за подачей теплоносителя на активные блоки.'],
    ['zpm_mk2_feed_return', 'Жидкостный тракт тяжёлой плазмы', gt('zpm_output_hatch'), 2, ['zpm_mk2_output', 'zpm_heavy_coolant_route', 'zpm_shielded_cask'], 'Один люк направь на плазменный буфер Mk II, второй на возврат теплоносителя вакуумной камеры. Проверь допустимость горячего потока в каждой трубе.'],
    ['zpm_cask_sorted_return', 'Раздельная выдача пустой и облучённой тары', me('import_bus'), 2, ['zpm_hot_americium_coupon', 'zpm_mk2_feed_return', 'me_import'], 'Выдачу центрифуги направь в ME. Отфильтруй возвращаемую тару и отложи один облучённый контейнер для записи.'],
    ['zpm_cask_cooling_stock', 'Буфер теплоносителя на выемке', gt('zpm_input_hatch'), 2, ['zpm_cask_sorted_return', 'zpm_americium_coupon', 'zpm_heavy_coolant_route'], 'Выдели вводы на облучение и закалку. Оба цикла требуют по 4800 мБ холодной жидкости, обратка идёт в общий охладитель.']
  ])

  add('zpm_commissioning', [
    ['zpm_freight_control_stock', 'Комплект датчиков для грузовой сверки', create('content_observer'), 4, ['zpm_freight_link', 'zpm_cask_sorted_return'], 'На сертификат понадобятся четыре наблюдателя. Проверь, что резерв из Энда и Нижнего мира хранится отдельно от сырья для мишеней.'],
    ['zpm_bulk_ame_reserved', 'Архив дополнительных америциевых проб', ks('zpm_americium_coupon'), 16, ['zpm_americium_coupon', 'zpm_cask_cooling_stock'], 'Отложи 16 образцов сверх приёмочной партии. Кристаллические, квантовые и Wetware сборки забирают по четыре пробы за цикл.'],
    ['zpm_final_distinct_fluids', 'Три люка протокола ZPM', gt('zpm_input_hatch'), 3, ['zpm_hpca_32', 'zpm_mk2_feed_return', 'luv_fusion_extra_item_bus'], 'Заполни люки в порядке JEI. Подай 3600 мБ плазмы, 6000 мБ защитного газа и 8000 мБ улучшенного дизеля. Каждый люк должен принимать одну жидкость.'],
    ['zpm_final_return_archive', 'Выдача протокола в сеть', me('import_bus'), 1, ['zpm_commissioning', 'zpm_final_distinct_fluids', 'zpm_freight_control_stock'], 'Поставь импорт на выходную шину. После испытания убери записанную сферу в архив и освободи позиции линии перед следующим заказом.']
  ])
}
