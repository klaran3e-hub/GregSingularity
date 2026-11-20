const gt = id => 'gtceu:' + id
const ev = id => gt('ev_' + id)
const iv = id => gt('iv_' + id)
const ks = id => 'kubejs:' + id
const pnc = id => 'pneumaticcraft:' + id
const create = id => 'create:' + id
const me = id => 'ae2:' + id

export function expandEvIv(chapters) {
  const rows = key => chapters.find(chapter => chapter.key === key).rows
  const optional = tasks => tasks.map(task => [...task, true])

  rows('ev_vacuum').push(...optional([
    ['ev_return_drums', 'Раздельные баки теплоносителя', gt('stainless_steel_drum'), 3, ['vacuum_loop_buffers', 'vacuum_pump_core'], 'Поставь отдельные баки под горячую обратку, охлаждённый поток и защитный газ. Для холодной линии проверь допустимую температуру каждого участка.'],
    ['ev_return_dosers', 'Дозаторы вакуумного контура', gt('hv_fluid_regulator'), 3, ['ev_return_drums', 'vacuum_controller'], 'Веди газ к отдельному входу. Настрой дозаторы холодной подачи и обратки так, чтобы нагретый теплоноситель успевал уходить из камеры.'],
    ['ev_vacuum_thermal_post', 'Резервный охладитель возврата', pnc('thermopneumatic_processing_plant'), 2, ['ev_return_dosers', 'vacuum_titanium_ingot'], 'Разведи охлаждение на две установки. Держи холодную сторону при 275 К или ниже. Подавай отфильтрованный теплоноситель при давлении от 3,75 бар.'],
    ['ev_vacuum_plate_spares', 'Керамика на ремонт вакуумного поста', ks('sintered_vacuum_tile'), 12, ['vacuum_panel', 'vacuum_casings'], 'Подготовь запас из двенадцати плиток. Для их обжига оставь отдельный выход защитного газа, чтобы он не просаживал контур закалки.'],
    ['ev_vacuum_press_feed', 'Подача сырой плитки под формовочный пресс', 'kubejs:woven_drive_belt', 8, ['vacuum_tile_blank', 'ev_vacuum_plate_spares'], 'Подай керамическую заготовку конвейером в формовочный пресс. Сортируй плитку после штамповки отдельно от горячего выхода домны.'],
    ['ev_vacuum_heated_basin', 'Чаша для горячей формовки панелей', create('blaze_burner'), 2, ['vacuum_panel_blank', 'ev_return_drums'], 'Подведи защитный газ к чаше и поставь под ней горелку. На две заготовки требуется 180 мБ газа. Вторую горелку держи у запасного поста.'],
    ['ev_vacuum_extra_rutile', 'Запас рутила на сменную плавку', ks('purified_rutile'), 18, ['vacuum_titanium_charge', 'ev_vacuum_press_feed'], 'Отложи рутил на шесть загрузок смесителя. Держи отдельные запасы промытого боксита и дистиллята у реактора.'],
    ['ev_vacuum_panel_cell', 'Ячейка для возврата теплоносителя', me('fluid_storage_cell_16k'), 1, ['ev_return_dosers', 'vacuum_panel', 'me_16k'], 'Подключи жидкостную ячейку и выдели отсек только под горячий возврат. Холодную жидкость храни отдельно, чтобы фильтр выдачи не блокировал охладитель.']
  ]))

  rows('ev_cleanroom').push(...optional([
    ['ev_room_filter_reserve', 'Пакеты на смену потолочных фильтров', ks('cleanroom_filter_pack'), 16, ['cleanroom_filters', 'ev_vacuum_plate_spares'], 'Отложи пакеты под запасные фильтры. К каждой партии подготовь сетки Энда, формовочные матрицы, вакуумную плитку и усиленную трубу.'],
    ['ev_room_ceiling_stock', 'Комплект фильтров на вторую комнату', gt('filter_casing'), 8, ['ev_room_filter_reserve', 'cleanroom_controller'], 'Выдели восемь потолочных блоков на запасной отсек. Не вынимай рабочий комплект во время обработки подложек.'],
    ['ev_room_dual_feed', 'Раздельная выдача двух подложек', me('import_bus'), 2, ['cleanroom_wafer_etched', 'cleanroom_circuit_machine', 'me_import'], 'Настрой один импорт на гравёр, второй на сборщик. К каждому подключи собственную промежуточную выдачу.'],
    ['ev_room_fe_reserve', 'Резервная шина питания чистого поста', 'gtceu:hv_battery_buffer_4x', 2, ['cleanroom_power_feed', 'cleanroom_first_ev_circuit', 'hv_shop_ie_capacitor'], 'Выдели накопитель в формовочный пресс и отдельный на автоматику чистого участка. Подвод питания станков GregTech оставь на EU.'],
    ['ev_room_second_laser', 'Два поста гравировки', gt('hv_laser_engraver'), 2, ['ev_room_dual_feed', 'cleanroom_wafer_series'], 'Раздели запас масок между двумя гравёрами. Подложки подавай по отдельности и собери выдачу в один фильтрованный буфер.'],
    ['ev_room_logic_rack', 'Пакет плат под опрессовку', ks('ev_logic_preform'), 12, ['ev_room_second_laser', 'cleanroom_ev_module'], 'Подготовь двенадцать заготовок и по одной усиленной трубке на каждую. Раздели вход и выход камеры, чтобы кассеты не вернулись на подачу.']
  ]))

  rows('ev_power').push(...optional([
    ['ev_double_wire_stock', 'Двойная алюминиевая жила', gt('aluminium_double_wire'), 4, ['ev_aluminium_wire', 'ev_busbar_blank'], 'Соедини по две одиночные жилы с шинной заготовкой, контактами и электрумовой проволокой.'],
    ['ev_four_wire_stock', 'Четыре алюминиевые жилы', gt('aluminium_quadruple_wire'), 4, ['ev_double_wire_stock', 'ev_traction_coil'], 'Подготовь четырёхжильный провод. Его используют вместе с одинарными кабелями при сборке толстой магистрали.'],
    ['ev_titanium_fluid_line', 'Титановая магистраль возврата', gt('titanium_normal_fluid_pipe'), 8, ['ev_engine', 'ev_assembler', 'ev_return_dosers'], 'Собери трубу начиная со стального предшественника. Отдели возврат теплоносителя от веток смазки и дизеля.'],
    ['ev_liquid_air_backup', 'Два топливных компрессора', pnc('advanced_liquid_compressor'), 2, ['ev_engine', 'hv_shop_liquid_compressor'], 'Один модернизированный компрессор расходуется в большом двигателе. Второй подготовь для независимого питания воздушной линии.'],
    ['ev_ev_booster_hatch', 'Дополнительный силовой ввод EV', ev('energy_input_hatch_4a'), 1, ['ev_engine', 'ev_assembler', 'ev_wide_cable'], 'Разведи энерговвод и выход по разным сторонам. Четырёхамперная шина нужна для отдельной линии станков.'],
    ['ev_station_battery', 'Лапотронный накопитель резерва', ev('lapotronic_battery'), 2, ['ev_ev_booster_hatch', 'ev_phase_relay'], 'Собери два накопителя из литиевых батарей HV. Заряд держи на отдельном посту до развёртывания палладиевой подстанции.'],
    ['ev_vanadium_drive', 'Силовой блок с ванадиевой батареей', ev('power_unit'), 1, ['ev_engine', 'ev_motor', 'ev_assembler'], 'Установи ванадиевую батарею EV, мотор, реле, механическую руку и пневматический манометр. Подай 1000 мБ смазки.'],
    ['ev_air_scrubber', 'Фильтрация отсека подготовки', ev('air_scrubber'), 1, ['ev_engine', 'ev_assembler', 'ev_room_ceiling_stock'], 'Собери фильтрующий пост из машины HV, двух насосов, регулятора и электронасоса LV. Оставь место под выдачу кассет.']
  ]))

  rows('iv_metallurgy').push(...optional([
    ['iv_leach_return_tanks', 'Баки подачи и возврата раствора', gt('stainless_steel_drum'), 3, ['iv_tungsten_cake', 'iv_platinum_cake'], 'Разведи свежий раствор, отработанный раствор и дистиллят. На восстановление отправляй только жидкость со второго выхода реактора.'],
    ['iv_leach_aux_pumps', 'Регуляторы выщелачивания', ev('fluid_regulator'), 2, ['iv_leach_return_tanks', 'iv_reactor_ev'], 'Установи один регулятор на общий ввод и второй на восстановление. На каждые 1000 мБ отработанного раствора возвращаются 800 мБ рабочего.'],
    ['iv_furnace_ev_input', 'Отдельный энерговвод для нихрома', ev('energy_input_hatch'), 1, ['iv_nichrome_charge', 'ev_engine'], 'Поставь ввод EV на канталовую домну. При напряжении EV её рабочий предел на кантале составляет 2900 К.'],
    ['iv_dual_vacuum_outputs', 'Раздельная выдача слитков и обратки', gt('hv_output_hatch'), 2, ['iv_tungsten_plate', 'iv_tungstensteel_plate', 'ev_return_dosers'], 'Подключи независимые линии возврата от двух вакуумных камер. Не объединяй холодный подвод с горячим выходом.'],
    ['iv_sinter_gas_inventory', 'Запас аргона для платиновой серии', gt('argon_bucket'), 2, ['iv_platinum_sponge', 'iv_dual_vacuum_outputs'], 'Подготовь запас аргона для спекания губки. На каждую плавку уходит 500 мБ. Тару под газ оставь у отдельного люка.']
  ]))

  rows('iv_microelectronics').push(...optional([
    ['iv_room_resist_tank', 'Подача фоторезиста по собственной линии', gt('titanium_normal_fluid_pipe'), 12, ['iv_masked_wafer', 'ev_titanium_fluid_line'], 'Выдели чистую трубу под фоторезист. Отдельным отводом возвращай отработанную жидкость из проявителя на восстановление.'],
    ['iv_room_mask_rack', 'Резерв масок для стерильного гравёра', ks('iv_sterile_mask'), 2, ['iv_exposed_wafer', 'iv_room_resist_tank'], 'Первую маску оставь в гравёре. Вторую держи на посту для запуска параллельной линии.'],
    ['iv_room_oxygen_safe', 'Пневматическая магистраль опрессовки', pnc('reinforced_pressure_tube'), 20, ['iv_sealed_processor', 'iv_room_mask_rack'], 'Раздели линию первого цеха и стерильный участок. Следи за 4,85 бар в камере и проверяй предохранитель перед загрузкой.'],
    ['iv_room_first_processor_run', 'Контрольная серия мейнфреймов', gt('micro_processor_mainframe'), 4, ['iv_first_mainframe', 'iv_room_oxygen_safe'], 'На выпуск подай четыре герметичных пакета, шесть схем EV и 1700 мБ защитного газа. Перед серией освободи выход сборщика.'],
    ['iv_room_processed_optics', 'Склад оптики для плат синхронизации', ks('me_optical_link'), 12, ['iv_clock_backplane', 'iv_room_first_processor_run'], 'Разложи оптику между серийным сборщиком, передатчиками и линией данных. Готовые платы синхронизации отправляй в отдельный буфер.']
  ]))

  rows('iv_power').push(...optional([
    ['iv_platinum_item_feed', 'Платиновый трубопровод предметной подачи', gt('platinum_normal_item_pipe'), 8, ['iv_power_engine', 'iv_power_assembler', 'iv_platinum_plate', 'iv_conveyor'], 'Собери магистраль от тонкой электрумовой трубы. У мест подачи оставь доступ к воронкам и фильтрам.'],
    ['iv_wolfram_fluid_feed', 'Вольфрамовая трасса реагентов', gt('tungsten_steel_normal_fluid_pipe'), 8, ['iv_power_engine', 'iv_power_assembler', 'ev_titanium_fluid_line', 'iv_arc_plate'], 'Используй титановую трубу как основу. Разведи смазку, газ и топливо по отдельным трассам.'],
    ['iv_four_wire_stock', 'Четырёхжильный вольфрамовый провод', gt('tungsten_quadruple_wire'), 4, ['iv_wire', 'iv_busbar_blank', 'iv_cable_jacket'], 'Собери последовательно двойную и четырёхжильную версии. На изоляцию широкой линии отложи вакуумные прокладки и пневмотрубы.'],
    ['iv_driver_ready', 'Ванадиевый силовой блок IV', iv('power_unit'), 1, ['iv_vanadium_pack', 'iv_motor', 'iv_power_assembler', 'ev_vanadium_drive'], 'Подготовь питание инструмента из батареи, силового блока EV и мотора IV. Добавь механическую руку, манометр и дугозащиту.'],
    ['iv_engine_buffer_station', 'Магистраль подачи улучшенного дизеля', iv('input_hatch_4x'), 1, ['iv_power_engine', 'iv_wolfram_fluid_feed', 'iv_fuel_cycle'], 'Используй многокамерный ввод на отдельном технологическом аппарате. На сборочной линии оставь одиночные входы с фиксированным порядком.']
  ]))

  rows('iv_assembly_line').push(...optional([
    ['iv_line_buffer_crates', 'Промежуточный склад линии', gt('stainless_steel_crate'), 8, ['iv_line_controller', 'iv_platinum_item_feed'], 'Поставь ящики у секций для ручного запуска и наладки. Для автозаказа поставь общий буфер ингредиентов со своей сетью выдачи.'],
    ['iv_line_order_buffer', 'Буфер одного автозаказа', 'expatternprovider:ingredient_buffer', 1, ['iv_line_buffer_crates', 'me_ingredient_buffer'], 'Разверни поставщик главной ME-сети к буферу ExtendedAE. В шаблон обработки внеси все предметы, жидкости и результат. Подключи к буферу с другой стороны шину хранения отдельной ME-сети в режиме извлечения.'],
    ['iv_line_export_filters', 'Восемь шин с индивидуальными фильтрами', me('export_bus'), 8, ['iv_line_order_buffer', 'me_export'], 'Поставь отдельную экспортную шину подсети напротив каждого входа ULV. У каждой один фильтр по своей позиции рецепта из JEI. Держи шаблон на отдельном маршруте, если другой заказ меняет позиции.'],
    ['iv_line_me_fluid_order', 'Три позиции для жидкостей IV', gt('stainless_steel_drum'), 3, ['iv_line_fluid_hatches', 'iv_wolfram_fluid_feed', 'iv_line_order_buffer'], 'Выдели ещё три экспортные шины подсети для одиночных люков. Для протокола первым идёт смазка, вторым защитный газ, третьим улучшенный дизель. Баки пригодятся для ручной проверки подачи.'],
    ['iv_line_subnet_channels', 'Питание отдельной сети выдачи', me('controller'), 1, ['iv_line_export_filters', 'iv_line_me_fluid_order', 'me_controller'], 'Отдельному контроллеру нужны двенадцать каналов. Шина хранения занимает один, экспорт на входы занимает одиннадцать. На магистрали поставь плотный кабель и разведи отводы обычным.'],
    ['iv_line_return_item', 'Возврат результата заказа в ME', me('import_bus'), 2, ['iv_line_subnet_channels', 'iv_calibration_rig', 'me_import'], 'Поставь импорт главной сети на выходную шину линии. Подсеть только распределяет заказ. Второй импорт оставь для контрольных образцов, которые делает сборщик IV.'],
    ['iv_line_research_copy', 'Запас носителей для смены заказа', gt('data_stick'), 4, ['iv_reference_module', 'iv_line_return_item'], 'Храни пустые носители отдельно от записанных. После сканирования переноси запись в люк данных и оставляй исходный эталон для подачи в первую секцию.'],
    ['iv_line_double_commission', 'Протоколы для двух участков', ks('iv_commissioning_report'), 2, ['iv_commissioning', 'iv_line_me_fluid_order', 'iv_line_research_copy'], 'На каждый заказ подготовь 6000 мБ смазки, 4800 мБ защитного газа и 12 000 мБ улучшенного дизеля. Перед запуском второго проверь остатки в буферах.']
  ]))
}
