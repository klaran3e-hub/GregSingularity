const gt = id => 'gtceu:' + id
const uv = id => gt('uv_' + id)
const ks = id => 'kubejs:' + id
const ae = id => 'ae2:' + id
const ext = id => 'expatternprovider:' + id
const factory = id => ks('final_' + id)

export function expandUvFinal(chapters) {
  const append = (key, rows) => chapters.find(chapter => chapter.key === key).rows.push(...rows.map(row => [...row, true]))

  append('uv_materials', [
    ['uv_argon_buffer', 'Аргон на смесь дюрания', gt('argon_bucket'), 3, ['uv_duranium_mixer', 'hv_end_argon'], 'Накопи минимум 2400 мБ аргона на цикл. Подай его в смеситель отдельным вводом от защитного газа.'],
    ['uv_hot_basin', 'Чаша для силового ламината', 'create:basin', 1, ['uv_laminate_preform', 'hv_blaze_burner'], 'Подведи к нагретой чаше защитный газ и положи в буфер уплотнения. Поставь отдельный выход для готовых листов.'],
    ['uv_laminate_run', 'Ламинат для корпусов и катушек', ks('uv_structural_laminate'), 24, ['uv_hot_basin', 'uv_structural_laminate'], 'На каждый проход пресса отведи 450 мБ защитного газа. Раздели готовую партию между кожухами, шунтами и магистралью.'],
    ['uv_plate_relay_supply', 'четырёхжильные кабели для партии шунтов', 'gtceu:gold_quadruple_cable', 8, ['uv_laminate_run', 'hv_shop_ie_relay'], 'Подготовь восемь реле. Паяй шунты в отдельном сборщике с жидким припоем.'],
    ['uv_tritanium_cold_loop', 'Две ёмкости тританового контура', gt('stainless_steel_drum'), 2, ['uv_tritanium_ingot', 'hv_shop_stainless_drum'], 'Раздели холодный и нагретый теплоносители. Для вакуумного литья и отжига держи разные шаблоны и общий возврат на охладитель.']
  ])
  append('uv_power', [
    ['uv_bus_supply', 'Выдача в две силовые ветки', uv('energy_output_hatch_4a'), 2, ['uv_energy_output_4a', 'uv_pulse_reserve'], 'Выдели выходы для основной и аварийной шин. Проверяй допустимый ток на каждом участке, включая диоды и переходники.'],
    ['uv_bank_four', 'Буфер линии на четыре элемента', uv('battery_buffer_4x'), 1, ['uv_lapotronic_battery', 'uv_bus_supply'], 'Собери буфер. Для накопления и выдачи используй переносные батареи, подходящие к этому напряжению.'],
    ['uv_transformer_four', 'Трансформатор UV на четыре пакета', uv('transformer_4a'), 1, ['uv_voltage_coil', 'uv_bus_supply'], 'Отдельно пометь стороны ZPM, UV и следующие ступени сети по подсказке блока. Не подключай оборудование к выходу без проверки режима.'],
    ['uv_backup_controller', 'Проверка отключаемого ввода', gt('machine_controller_cover'), 2, ['uv_bank_four', 'uv_transformer_four'], 'Поставь крышки управления на две ветки. Проверь отключение каждой под небольшой нагрузкой, сохрани доступ к разрыву зарядной линии.']
  ])
  append('uv_factory', [
    ['uv_dual_process_input', 'Совмещённый ввод для технологического цеха', uv('dual_input_hatch'), 1, ['uv_assembler', 'uv_pump', 'uv_conveyor'], 'Проверь предметный и жидкостный входы на совместимом многоблоке. Для сборочной линии используй отдельные упорядоченные вводы.'],
    ['uv_quench_buffer_return', 'Возврат теплоносителя после партии', uv('output_hatch'), 2, ['uv_mk3_output', 'uv_tritanium_cold_loop'], 'Установи выдачу в горячий буфер. Не подключай к нему экспорт из холодного бака.'],
    ['uv_factory_mixer', 'Смеситель закалочного цеха', uv('mixer'), 1, ['uv_assembler', 'uv_motor', 'uv_quench_cassette'], 'Собери смеситель с регулятором скорости Create. Поставь фильтры отдельно для воды, охлаждающей жидкости и готовой смеси.'],
    ['uv_factory_reactor', 'Реактор двух жидкостей', uv('chemical_reactor'), 1, ['uv_assembler', 'uv_pump', 'uv_dual_process_input'], 'Проверь два входа разными реагентами. Подключи отдельную выдачу для жидкости, которая возвращается на обработку.'],
    ['uv_factory_circuit_assembler', 'Стерильный сборщик UV', uv('circuit_assembler'), 1, ['uv_assembler', 'uv_emitter', 'uv_phase_interlock'], 'Сохрани место в стерильной комнате. На вход подведи защитный газ из закрытого бака и предметы по шаблону обработки.']
  ])
  append('uv_fusion', [
    ['uv_fusion_stock_hatches', 'Запас жидкостных люков кольца', uv('input_hatch'), 4, ['uv_mk3_input', 'uv_quench_buffer_return'], 'Оставь рабочие вводы для подачи и америция. Для другого процесса с другими жидкостями выдели чистую пару входов.'],
    ['uv_ring_control_cable', 'Кабель для кольца и вакуумной линии', gt('yttrium_barium_cuprate_quadruple_cable'), 16, ['uv_mk3_power', 'uv_cuprate_trunk'], 'Разведи линии зарядки кольца и питания вакуумной камеры. При запуске проверь свободную ёмкость выхода.'],
    ['uv_reactor_inputs_buffer', 'Независимые буферы на подачу Mk III', gt('stainless_steel_drum'), 4, ['uv_fusion_stock_hatches', 'uv_ring_control_cable'], 'Отдельно храни америций, подачу, наквадах и жидкий продукт. Перед заменой режима полностью освободи старые вводы.']
  ])
  append('uv_commissioning', [
    ['uv_me_cold_storage', 'Ячейка для большого запаса теплоносителя', ae('fluid_storage_cell_256k'), 1, ['uv_neutronium_coupon', 'me_fluid_cell', 'me_256k'], 'Закрепи холодный теплоноситель за отдельной ячейкой. Ограничь свободное место в других жидкостных ячейках, чтобы не смешивать запасы.'],
    ['uv_freight_manifest_reserve', 'Резерв накладных и контрольных узлов', ks('uv_freight_manifest'), 4, ['uv_freight_manifest', 'uv_grid_witness'], 'Подготовь отдельную партию для пульта главного завода. Накладные текущей приёмки оставь у сборочной линии.'],
    ['uv_report_gas_stock', 'Жидкостные буферы сертификации', uv('input_hatch'), 4, ['uv_neutronium_batch', 'uv_line_fluid_hatches', 'uv_me_cold_storage'], 'Проверь объёмы нейтрония, защитного газа, теплоносителя и дизеля. Разведи порядок подачи на независимые входы.']
  ])
  append('final_power', [
    ['final_return_buffer_setup', 'Три бочки для выдачи партий', 'minecraft:barrel', 3, ['final_controlled_shop'], 'Поставь бочку под каждым из трёх испытательных станков. Пульт перенесёт туда учтённые партии. Держи автоматический вывод предметов станков выключенным.'],
    ['final_me_lot_import', 'Возврат партий в сеть ME', ae('import_bus'), 3, ['final_return_buffer_setup', 'final_logic_provider'], 'Поставь шины импорта на бочки. Выдели в ME место для продукции, чтобы бочка не заполнялась во время смены.'],
    ['final_power_test_buses', 'Контроль выдачи на трёх станках', uv('diode'), 4, ['final_main_switch', 'uv_backup_controller', 'final_me_lot_import'], 'Разведи питание сборщика, реактора и чистовой линии. Перед холодным пуском отключи зарядку резерва и проверь отсутствие обратного тока.']
  ])
  append('final_dispatch', [
    ['final_cargo_stock_cells', 'Выделенные ячейки для трёх поставок', ae('item_storage_cell_16k'), 3, ['final_shipping_kit', 'me_16k'], 'Закрепи за каждой ячейкой накладные одной площадки. Держи в буфере исходные грузы, материалы и жидкость для нужного измерения.'],
    ['final_transit_liquid_buffers', 'Выездная тара для реагентов', gt('stainless_steel_drum'), 6, ['final_cargo_stock_cells', 'final_end_dispatch', 'hv_shop_stainless_drum'], 'Подготовь по паре ёмкостей на площадку. Выдели отдельно смазку, дизель и защитный газ, и пометь обратку.']
  ])
  append('final_polymers', [
    ['final_polymer_mix_provider', 'Шаблон с полиэтиленом и закалочной смесью', ae('pattern_provider'), 1, ['final_polymer_reactor', 'me_provider', 'final_quench_loop'], 'В шаблоне укажи 6400 мБ полиэтилена, 3200 мБ смеси и предметные входы. Импортируй партии из бочки. Включи автовывод жидкости в отдельный бак и отведи обратку на охладитель.']
  ])
  append('final_operation', [
    ['final_input_buffer', 'Буфер смешанного заказа для линии', ext('ingredient_buffer'), 1, ['final_report_buses', 'final_report_research', 'me_ingredient_buffer'], 'Поставь буфер у поставщика шаблонов. Отведи из него пятнадцать предметных и четыре жидкостных выхода по порядку JEI. Вместе с шиной хранения это двадцать каналов отдельной сети.'],
    ['final_fluid_filters', 'Фильтры четырёх жидкостных входов', ae('export_bus'), 4, ['final_input_buffer', 'final_line_fluids'], 'Для каждого люка задай одну жидкость. После заказа проверь, что остаток реагента не занимает вход следующего шаблона.'],
    ['final_report_import', 'Возврат протокола в сеть', ae('import_bus'), 1, ['final_fluid_filters', 'final_report_buses'], 'Подключи импорт к выходной шине сборочной линии. В режиме обработки шаблон должен ожидать готовый протокол, а не одну из его оснасток.']
  ])
}
