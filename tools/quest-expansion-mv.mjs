const gt = id => 'gtceu:' + id
const mv = id => gt('mv_' + id)
const create = id => 'create:' + id
const ie = id => 'immersiveengineering:' + id
const pnc = id => 'pneumaticcraft:' + id
const kube = id => 'kubejs:' + id

export function expandMv(chapters) {
  const section = key => chapters.find(chapter => chapter.key === key).rows
  const add = (key, rows) => section(key).push(...rows.map(row => [...row, true]))

  section('mv').push(
    ['mv_pressure_gear', 'Шестерня компрессора', pnc('compressed_iron_gear'), 1, ['pressed_iron', 'ie_steel', 'bushing'], 'В сборщике соедини стальную шестерню с прессованным железом, заклёпками и втулками.'],
    ['mv_pressure_stone', 'Камень для основания', pnc('reinforced_stone'), 4, ['pressed_iron', 'pressed_steel_frame', 'furnace_lining_insert'], 'Усиль обычный камень прессованным железом, футеровкой и рамой IE.'],
    ['mv_pressure_stone_base', 'Основание компрессора', pnc('stone_base'), 1, ['mv_pressure_stone', 'pressure_tubes'], 'Поставь две усиленные секции на раму. Добавь воздушную трубу, заклёпки и уплотнение.']
  )
  add('mv', [
    ['mv_pressure_gauge', 'Манометр перед первым пуском', pnc('pressure_gauge'), 1, ['pressed_iron', 'lv_shop_sensor', 'lv_glass_blank'], 'Собери манометр с датчиком LV, стеклянной колбой и тахометром Create. Проверь показания перед первой опрессовкой.'],
    ['mv_safety_module', 'Защита воздушной линии', pnc('safety_tube_module'), 1, ['mv_pressure_gauge', 'pressure_tubes', 'lv_shop_fluid_regulator'], 'Собери предохранительный модуль с жидкостным регулятором LV. Вставь модуль в трубу и следи за давлением при долгой работе компрессора.'],
    ['mv_gauge_module', 'Показания рядом с камерой', pnc('pressure_gauge_module'), 1, ['mv_pressure_gauge', 'pressure_valve'], 'Установи измерительный модуль на трубу у камеры. Сверь давление на входе с настройкой для очередной заготовки.'],
    ['mv_pressure_regulator', 'Регулятор воздушной линии', pnc('regulator_tube_module'), 1, ['mv_safety_module', 'pressure_tubes', 'lv_create_precision', 'lv_shop_coil'], 'Собери регулятор из предохранительного модуля, трубы, механизма Create и обмоток LV. Подготовь ещё один для холодного поста.'],
    ['mv_charging_station', 'Зарядная стойка PneumaticCraft', pnc('charging_station'), 1, ['mv_pressure_gauge', 'mv_assembler', 'air_compressor'], 'Подведи воздух к стойке и проверь зарядку переносной канистры. Поставь стойку рядом с постом обслуживания.'],
    ['mv_charging_module', 'Зарядка от бокового отвода', pnc('charging_module'), 1, ['mv_charging_station', 'mv_pressure_regulator'], 'Установи зарядный модуль на доступный отвод трубы. Сверь давление на общей линии после подключения.'],
    ['mv_air_reserve', 'Воздух между загрузками', pnc('air_canister'), 1, ['mv_pressure_gauge', 'pressure_gasket', 'air_compressor'], 'Собери канистру с манометром и уплотнением. Держи запас воздуха у камеры.'],
    ['mv_voltage_coil', 'Медная обмотка управления', mv('voltage_coil'), 4, ['mv_assembler', 'mv_copper_wire', 'mv_circuit_batch'], 'Подготовь обмотки для измерительных блоков и оборудования. Для массового выпуска выведи контактные полосы с пресса Create прямо в буфер.'],
    ['mv_double_wire', 'Пара медных проводников', gt('copper_double_wire'), 4, ['mv_copper_wire', 'mv_assembler', 'mv_voltage_coil'], 'Собери сдвоенный провод. Оставь часть под обмотки и протяжку более широкой линии.'],
    ['mv_double_cable', 'Медная разводка на два ампера', gt('copper_double_cable'), 4, ['mv_double_wire', 'mv_copper_cable', 'pressure_gasket'], 'Подготовь двойные кабели для линии с двумя потребителями. Проверь ток у турбины и потери до дальнего станка.'],
    ['mv_quadruple_wire', 'Пучок медной проволоки', gt('copper_quadruple_wire'), 4, ['mv_double_wire', 'mv_voltage_coil'], 'Собери провода следующего сечения для общего фидера. Оставь один комплект в запасе на буровую.'],
    ['mv_quadruple_cable', 'Фидер из четырёх жил', gt('copper_quadruple_cable'), 4, ['mv_quadruple_wire', 'mv_double_cable', 'pressure_gasket'], 'Подготовь кабель для корпуса буфера и его выходной линии. Нагрузку распределяй по коротким отводам.'],
    ['mv_battery_hull', 'Кассеты под аккумуляторы', mv('battery_hull'), 4, ['mv_voltage_coil', 'mv_hull', 'lv_shop_battery_hull'], 'Собери четыре корпуса. Отдельную партию оставь под запасные батареи, чтобы обслуживать буфер без остановки линии.'],
    ['mv_sodium_battery', 'Натриевый запас на 128 EU', mv('sodium_battery'), 4, ['mv_battery_hull', 'lv_shop_battery', 'water_distillery'], 'Заполни корпуса натриевой смесью. На сборку подай дистиллят. Заряди четыре элемента перед подключением буфера.'],
    ['mv_battery_buffer', 'Буфер на четыре аккумулятора', mv('battery_buffer_4x'), 1, ['mv_sodium_battery', 'mv_quadruple_cable'], 'Вставь элементы в буфер и разверни выход к шине. Для испытания отключи турбину и оставь один потребитель.'],
    ['mv_item_input', 'Вход твёрдого сырья', mv('input_bus'), 1, ['mv_assembler', 'mv_hull', 'lv_conveyor', 'lv_create_precision'], 'Подведи конвейер к входной шине домны. Отдельно загружай шихту и проверяй, что горячие слитки остаются на выходе.'],
    ['mv_item_output', 'Выдача горячих заготовок', mv('output_bus'), 1, ['mv_item_input', 'mv_circuit_batch'], 'Поставь выходную шину на доступную грань домны. Направь болванки на охлаждение по выделенному маршруту.'],
    ['mv_energy_output', 'Силовой выход мультиблока', mv('energy_output_hatch'), 1, ['oil_energy_hatch', 'mv_quadruple_cable'], 'Подготовь выход для мультиблока, который вырабатывает EU. Разворачивай кабель к буферу, если генератор и потребители стоят в разных цехах.'],
    ['mv_machine_furnace', 'Электропечь на 128 EU', mv('electric_furnace'), 1, ['mv_assembler', 'lv_shop_furnace', 'mv_voltage_coil'], 'Поставь электропечь у склада проката. Освободи выход от обычных материалов перед серией огнеупоров.'],
    ['mv_machine_hammer', 'Штамповка с поршнем MV', mv('forge_hammer'), 1, ['mv_assembler', 'lv_shop_hammer', 'nether_mv_piston'], 'Подготовь молот для штамповки. Подведи заготовки от склада по предметной линии.'],
    ['mv_machine_compressor', 'Прессование от сети MV', mv('compressor'), 1, ['mv_assembler', 'lv_shop_compressor', 'nether_mv_piston'], 'Установи компрессор GregTech на линии твёрдых заготовок. У камеры PneumaticCraft остаётся своя воздушная сеть.'],
    ['mv_machine_extractor', 'Экстракция с насосом MV', mv('extractor'), 1, ['mv_pump', 'lv_shop_extractor', 'water_distillery'], 'Поставь экстрактор у ёмкостей с реагентами. Пустой выход облегчит смену продукта.'],
    ['mv_machine_centrifuge', 'Раздельная выгрузка из центрифуги', mv('centrifuge'), 1, ['mv_assembler', 'lv_balanced_rotor', 'mv_motor'], 'Отведи продукты в отдельные ячейки. Оставь свободный выход для побочных фракций.'],
    ['mv_machine_sifter', 'Просев дроблёной породы', mv('sifter'), 1, ['mv_assembler', 'strainer_mesh', 'nether_mv_macerator'], 'Подай продукт дробилки в просеиватель. Поставь фильтр перед складом концентратов.'],
    ['mv_machine_cutter', 'Резка с подачей смазки', mv('cutter'), 1, ['mv_assembler', 'saw', 'nether_mv_piston'], 'Установи пилу Create, запасные зубья и поршень MV. При резке подай жидкость, указанную в выбранном рецепте.'],
    ['mv_machine_fluid_solidifier', 'Литьё в сменную форму', mv('fluid_solidifier'), 1, ['mv_pump', 'mv_sample_spout', 'ie_press_mold'], 'Собери формовщик с носиком Create, насосом и матрицей IE. На рабочей линии проверь, что выход принимает отливку.'],
    ['mv_machine_pack', 'Упаковка деталей по партиям', mv('packer'), 1, ['nether_mv_conveyor', 'mv_assembler'], 'Поставь упаковщик между складом и сборочным участком. Оставь место под возврат материалов с выходной стороны.'],
    ['mv_work_sensor', 'Датчик с медной обмоткой', mv('sensor'), 1, ['mv_voltage_coil', 'mv_circuit_batch', 'mv_pressure_gauge', 'lv_shop_sensor'], 'Собери датчик MV с катушкой, манометром и двумя стеклянными колбами. Отложи второй экземпляр под схемы управления.'],
    ['mv_work_emitter', 'Передатчик сигнала MV', mv('emitter'), 1, ['mv_voltage_coil', 'mv_circuit_batch', 'lv_shop_emitter', 'lv_create_precision'], 'Перенеси эмиттер LV на новую обмотку, добавь схему MV, механику Create и блок управления IE. Храни передатчики рядом с датчиками и схемами.'],
    ['mv_work_power_unit', 'Силовой блок ручного инструмента', mv('power_unit'), 1, ['mv_sodium_battery', 'chemical_grade_seal', 'mv_motor', 'paraffin_cake'], 'Собери новый силовой блок на натриевой батарее. Перед работой заряди его в заряднике GregTech.'],
    ['mv_work_drill', 'Электробур с редуктором MV', mv('steel_drill'), 1, ['mv_work_power_unit', 'nether_mv_piston', 'drill_seal_head'], 'Перенеси стальную головку на силовой блок MV. Оставь сменный комплект деталей у зарядника.']
  ])

  section('oilfield').push(
    ['mv_ie_fluid_pump', 'Насос буровой IE', ie('fluid_pump'), 1, ['mv_pump', 'lv_ie_pipe', 'create_water_pump', 'ie_steel'], 'Собери насос из насоса MV, четырёх труб IE, насоса Create и уплотнений. Один уйдёт в контроллер буровой.'],
    ['mv_filter_basin', 'Чаша для прессования фильтра', create('basin'), 1, ['press', 'mixer', 'copper_contacts'], 'Установи чашу под прессом Create. При подаче смеси оставь свободным выход для готовых сеток.'],
    ['mv_sample_spout', 'Розлив проб через носик Create', create('spout'), 1, ['sample_ampoules', 'mv_pump', 'create_water_pump'], 'Поставь носик над депо или лентой. Подключи ёмкость с выбранной фракцией и поставь пустую ампулу под носик.'],
    ['mv_oil_pumps', 'Подача из четырёх буферов', create('mechanical_pump'), 4, ['fraction_drums', 'mv_sample_spout'], 'Поставь по насосу на отдельную линию. Перед отбором проверь направление вращения и промой линию после смены жидкости.', true],
    ['mv_oil_inspection', 'Жидкость в смотровом участке', create('fluid_pipe'), 8, ['mv_sample_spout', 'oil_drum', 'yard_fluid_pipe'], 'Подготовь восемь труб Create. Оставь видимый участок между бочкой и носиком, чтобы заметить остатки предыдущей пробы.', true]
  )

  add('petrochem', [
    ['mv_steam_service', 'Турбина для промывки', mv('steam_turbine'), 2, ['washed_oil_sample', 'mv_battery_buffer'], 'Выдели вторую турбину под промывку и электролиз. Сделай отдельный паровой отвод со своим запасом пара.'],
    ['mv_reactor_pair', 'Реакторы для разных фракций', mv('chemical_reactor'), 2, ['activated_carrier', 'paraffin_cake', 'mv_chemical_reactor'], 'Выдели отдельные реакторы под полимер и смазку. Сохрани ещё одно место для линии дизеля.'],
    ['mv_distillate_bath', 'Ванна под отработанные кассеты', mv('chemical_bath'), 2, ['spent_oil_cartridge', 'washed_oil_sample'], 'Оставь отдельную ванну для кассет. В соседней ванне держи чистый дистиллят для охлаждения слитков.'],
    ['mv_vortex_redundancy', 'Независимые горячий и холодный отводы', pnc('vortex_tube'), 4, ['thermopneumatic_plants', 'vortex_tube'], 'Подготовь по две вихревые трубы на горячий и холодный посты. На свободных сторонах установи теплоотводы.'],
    ['mv_sink_stock', 'Теплоотводы вокруг холодной установки', pnc('heat_sink'), 8, ['mv_vortex_redundancy', 'first_polyethylene'], 'Оставь вокруг радиаторов открытое место. Под нагрузкой проверь температуру холодной установки ещё раз.'],
    ['mv_hot_tube_run', 'Отдельная воздушная ветка к крекингу', pnc('reinforced_pressure_tube'), 12, ['activated_carrier', 'reinforced_process_tube'], 'Подведи воздух к горячей установке отдельными трубками. Сверь давление во время подачи нафты.'],
    ['mv_thermal_compressor', 'Сжатый воздух от перепада температур', pnc('thermal_compressor'), 1, ['chemical_grade_seal', 'heat_pipes', 'refinery_exchanger', 'reinforced_process_tube'], 'Собери тепловой компрессор для резервной ветки. Разведи горячую и холодную стороны по отдельным теплоотводам.'],
    ['mv_pnc_etching_tank', 'Ванна для пневматических плат', pnc('etching_tank'), 1, ['first_pnc_board', 'pressure_glass', 'mv_ie_fluid_pump'], 'Собери травильную ванну из бака, стекла, уплотнений, полимера и тарелки. Подведи трубу IE для кислоты.'],
    ['mv_pnc_etching_acid', 'Кислота для травления', pnc('etching_acid_bucket'), 1, ['first_polyethylene', 'mv_electrolyzer', 'mv_chemical_reactor'], 'Подай в реактор полиэтилен, соль, 500 мБ дистиллята и 500 мБ серной кислоты. Отбери 1000 мБ травильной кислоты.'],
    ['mv_pnc_fluid_mixer', 'Пневматический смеситель жидкостей', pnc('fluid_mixer'), 1, ['mv_ie_fluid_pump', 'chemical_grade_seal', 'refinery_exchanger'], 'Собери смеситель с двумя баками, теплообменником и насосом IE. Разведи входы растительного масла и этанола.'],
    ['mv_pnc_glycerol', 'Глицерин из растительного сырья', pnc('glycerol'), 2, ['mv_pnc_fluid_mixer', 'liquid_process_compressor'], 'Подай масло и этанол по разным входам при 3,5 бар. Забери глицерин и освободи выход для биодизеля.'],
    ['mv_seal_replacement', 'Запас уплотнений у топливного блока', kube('chemical_grade_seal'), 8, ['chemical_grade_seal', 'liquid_process_compressor'], 'Опрессуй сменные уплотнения и оставь их у компрессора. Проверь подачу дизеля из выделенной ёмкости.'],
    ['mv_feed_ampoules', 'Тара под сменный отбор проб', kube('sample_ampoule'), 12, ['mv_sample_spout', 'process_commissioning'], 'Подготовь двенадцать пустых ампул для отбора с двух смен. Держи полные ампулы рядом с этикетками каждой фракции.'],
    ['mv_chemical_receipts', 'Комплекты на повторный пуск', kube('process_commissioning_kit'), 3, ['process_commissioning', 'mv_reactor_pair', 'mv_feed_ampoules'], 'Подготовь три комплекта из новых проб. Один оставь на резервную машину, остальные отложи для поставок в следующие цеха.']
  ])
  section('petrochem').push(
    ['mv_ie_refinery', 'Собрать топливный блок IE', ie('light_engineering'), 2, ['mv_assembler', 'mv_ie_connector', 'refinery_exchanger', 'activated_carrier'], 'Подготовь лёгкие блоки для НПЗ и собери установку по руководству IE. Подведи FE и разведи входы лёгкой фракции и газа. В слот катализатора поставь активированный носитель.']
  )

  add('nether_foundry', [
    ['mv_nether_chest', 'Отдельная выдача полевой дробилки', mv('output_bus'), 2, ['mv_item_output', 'nether_mv_macerator'], 'Подготовь выходные шины для двух горячих линий. На полевой дробилке выдели отдельный буфер под базальт.'],
    ['mv_refractory_fuel', 'Резерв топлива полевой плавки', gt('steel_drum'), 4, ['nether_field_power', 'diesel_sample', 'mv_battery_buffer'], 'Наполни выездные бочки дизелем, оставив место под возврат пустой тары. Заряженный буфер поможет пережить смену бочек.'],
    ['mv_nether_brick_blank', 'Сырец для нижней кладки', kube('nether_brick_blank'), 4, ['nether_grit', 'mixer', 'water_distillery'], 'Замешай сырец в чаше Create. Подведи дистиллят и подготовь свободную полку для заготовок перед обжигом.'],
    ['mv_stainless_recovery', 'Две ванны для горячих болванок', mv('chemical_bath'), 2, ['nether_hot_stainless', 'mv_distillate_bath'], 'Выдели ванну под нержавейку и вторую под кантал. В обе подведи дистиллят из чистой линии.'],
    ['mv_foundry_input_reserve', 'Дополнительный ввод для домны', mv('input_hatch'), 2, ['nether_furnace_inlet', 'mv_item_input'], 'Сделай запасной жидкостный вход. Кислород подведи к рабочему люку отдельной трубой.'],
    ['mv_stainless_buffer', 'Прокат для цеха приёмки', gt('stainless_steel_plate'), 24, ['nether_stainless_plates', 'mv_stainless_recovery'], 'Прокатай двадцать четыре листа. Раздели партию между ящиками, контактным постом и запасом на HV.']
  ])

  section('yard').push(
    ['mv_steel_fluid_line', 'Стальная труба для цеха', gt('steel_small_fluid_pipe'), 8, ['mv_assembler', 'pressure_tubes', 'yard_fluid_pipe'], 'Собери стальную магистраль с бронзовой основой, пневмотрубками и уплотнением. Оставь разборный участок перед входом в аппарат.', true],
    ['mv_ie_lv_coil', 'Обмотка IE для кантала', ie('coil_lv'), 1, ['mv_copper_wire', 'ie_steel'], 'Подготовь обмотку низкого напряжения IE. По одной обмотке уходит на каждую пару канталовых катушек.'],
    ['mv_ie_electrum_wire', 'Прессование электрумовой проволоки', gt('electrum_single_wire'), 8, ['pressed_steel_frame', 'mv_assembler'], 'Поставь проволочную матрицу в тяжёлый пресс IE и загрузи слитки электрума. Проволока нужна для разъёмов и мотков.'],
    ['mv_ie_connector', 'Разъём на стороне FE', ie('connector_mv'), 1, ['mv_assembler', 'ie_fe_converter', 'mv_ie_electrum_wire'], 'Собери разъём из двух клемм LV, электрумовой проволоки, керамики, прессованного железа и прокладок.'],
    ['mv_ie_wire', 'Электрумовая линия IE', ie('wirecoil_electrum'), 2, ['mv_ie_electrum_wire', 'paraffin_cake', 'lv_treated_wood'], 'Собери мотки из проволоки, прессованного железа, медной полосы и пропитанной древесины. Подай смазку.'],
    ['mv_ie_insulated_wire', 'Изолированные мотки на приёмку', ie('wirecoil_electrum_ins'), 2, ['mv_ie_wire', 'mv_ie_connector', 'first_polyethylene'], 'Изолируй электрумовые мотки полиэтиленом. Отложи пару и разъём для контроля поставки огнеупоров.'],
    ['mv_ie_relay', 'Промежуточное реле IE', ie('connector_mv_relay'), 2, ['mv_ie_connector', 'mv_ie_wire'], 'Поставь реле на повороте трассы. Проверь, что конечный разъём подключён к стороне FE преобразователя.', true],
    ['mv_ie_capacitor', 'Резерв FE у тяжёлого пресса', ie('capacitor_mv'), 1, ['mv_ie_insulated_wire', 'mv_battery_buffer', 'pressed_steel_frame'], 'Установи конденсатор перед прессом. Настрой сторону входа со стороны преобразователя и сторону выдачи к прессу.', true],
    ['mv_ie_transformer', 'Переход между сетями IE', ie('transformer'), 1, ['mv_ie_relay', 'mv_ie_capacitor', 'mv_voltage_coil'], 'Соедини линии IE через трансформатор. Разведи клеммы разных напряжений по сторонам, указанным в руководстве IE.', true],
    ['mv_create_brass_funnel', 'Латунная воронка на выгрузку', create('brass_funnel'), 2, ['lv_create_precision', 'mv_assembler', 'chemical_grade_seal'], 'Поставь фильтр на выход ленты. Отдели пустые ампулы от готовых проб и кассет.', true],
    ['mv_create_brass_tunnel', 'Развилка для кассет', create('brass_tunnel'), 2, ['mv_create_brass_funnel', 'oil_wash_cartridge', 'spent_oil_cartridge'], 'Настрой один отвод под чистые кассеты, другой под отработанные. Проверь разделение на небольшой партии.', true],
    ['mv_create_smart_chute', 'Фильтруемый жёлоб у ванны', create('smart_chute'), 1, ['mv_create_brass_funnel', 'mv_distillate_bath'], 'Установи жёлоб над входом ванны. В фильтр положи отработанную кассету и проверь направление подачи.', true],
    ['mv_create_observer', 'Датчик партии на ленте', create('content_observer'), 1, ['mv_create_brass_tunnel', 'mv_work_sensor', 'lv_create_redstone'], 'Установи наблюдатель рядом с лентой. Настрой фильтр на готовую кассету, чтобы сигнал появлялся при её проходе.', true],
    ['mv_create_stockpile', 'Сигнал о заполнении буфера', create('stockpile_switch'), 1, ['mv_create_observer', 'mv_create_smart_chute', 'fraction_drums'], 'Поставь датчик на складской буфер и задай верхний и нижний пороги. Проверь сигнал при заполнении и опустошении.', true],
    ['mv_yard_spares', 'Вторая партия огнеупоров на HV', kube('received_refractory_crate'), 6, ['yard_accept_batch', 'mv_stainless_buffer'], 'Прогони две партии через входной контроль. Оставь шесть принятых ящиков на первые корпуса и горячий участок HV.', true]
  )
}
