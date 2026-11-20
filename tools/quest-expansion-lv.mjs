const gt = id => 'gtceu:' + id
const lv = id => gt('lv_' + id)
const create = id => 'create:' + id
export function expandLv(chapters) {
  const core = chapters.find(chapter => chapter.key === 'lv')
  const foundry = chapters.find(chapter => chapter.key === 'industrial_supply')
  const furnace = chapters.find(chapter => chapter.key === 'blast_furnace')
  const optional = rows => rows.map(row => [...row, true])

  core.rows.push(
    ['lv_shop_piston', 'Первый электропоршень', lv('electric_piston'), 1, ['assembler', 'motor', 'bushing', 'tin_cable'], 'Установи двигатель, два вала Create и две втулки. Подай 250 мБ воды на сборщик при 24 EU/t.'],
    ['lv_shop_pump', 'Насос с механической ступенью', lv('electric_pump'), 1, ['assembler', 'motor', 'create_water_pump', 'bronze_pipe'], 'Механический насос Create, двигатель LV и бронзовые трубы входят в электрический насос. Для сборки подай 350 мБ воды.'],
    ['lv_shop_macerator', 'Электрическое дробление руд', lv('macerator'), 1, ['lv_shop_piston', 'steam_mill', 'lv_hull', 'millstone'], 'Перенеси паровую дробилку на корпус LV. На усиленный привод идут поршень и мельница Create. Оставь паровую дробилку на угле, если нужен параллельный выпуск.'],
    ['lv_shop_coil', 'Обмотка управления LV', lv('voltage_coil'), 1, ['assembler', 'lv_stator', 'tin_wire', 'copper_contacts'], 'Соедини статоры, проволоку, контакты и изоляцию. В сборщик подай 250 мБ воды.'],
    ...optional([
      ['lv_shop_furnace', 'Обжиг от электрической сети', lv('electric_furnace'), 1, ['lv_hull', 'steam_furnace', 'motor', 'assembler'], 'Перенеси паровую печь в корпус LV и поставь электрический привод. Разведи вход топлива котла и выход готовой продукции.'],
      ['lv_shop_hammer', 'Молот с электрическим приводом', lv('forge_hammer'), 1, ['lv_shop_piston', 'steam_hammer', 'press'], 'Установи электрический поршень и пресс Create на старый паровой молот. Оставь второй пресс для плат и проката.'],
      ['lv_shop_compressor', 'Компрессор с предметной подачей', lv('compressor'), 1, ['lv_shop_piston', 'steam_compressor', 'depot'], 'Перенеси паровой компрессор на LV. Депо и поршень входят в сборку.'],
      ['lv_shop_extractor', 'Экстракция с регулируемой подачей', lv('extractor'), 1, ['lv_shop_pump', 'steam_extractor', 'copper_plate'], 'Поставь электрический насос и медный вентиль Create на корпус экстрактора.'],
      ['lv_shop_tin_pipe', 'Тонкая предметная магистраль', gt('tin_small_item_pipe'), 8, ['assembler', 'tin_plate', 'rivets', 'pressed_insulation'], 'Сборщик выдаёт по две трубы за цикл. Вход из жёлоба Create идёт на сборку. Для отправки из сундука установи конвейерную крышку.'],
      ['lv_shop_wide_wire', 'Двойная оловянная проволока', gt('tin_double_wire'), 4, ['lv_shop_tin_pipe', 'tin_wire', 'copper_contacts'], 'Соедини две одиночные проволоки с медными контактами и оловянной фольгой.'],
      ['lv_shop_wide_cable', 'Кабель на две линии', gt('tin_double_cable'), 4, ['lv_shop_wide_wire', 'lv_treated_wood', 'tin_cable'], 'Подготовь двойную проволоку, одиночные кабели, пропитанную древесину и изоляцию. Проверь допустимый ток кабеля перед разводкой.'],
      ['lv_shop_battery_hull', 'Корпуса аккумуляторов', lv('battery_hull'), 4, ['lv_treated_wood', 'lv_shop_coil', 'tin_plate'], 'Собери оловянные оболочки с контактами, изоляцией и пропитанной древесиной. Для буфера понадобятся ещё четыре корпуса помимо самих батарей.'],
      ['lv_shop_battery', 'Первый натриевый аккумулятор', lv('sodium_battery'), 1, ['lv_shop_battery_hull', 'lv_shop_electrolyzer'], 'Подготовь натриевую и углеродную пыль. Уплотни элементы в сборщике и оставь контакты под зарядку.'],
      ['lv_shop_buffer', 'Буфер питания на четыре батареи', lv('battery_buffer_4x'), 1, ['lv_shop_battery', 'pressed_steel_frame', 'lv_shop_coil'], 'Установи буфер между турбиной и сетью. Сначала заряди батареи. Сторону выдачи разверни к станкам.']
    ])
  )

  foundry.rows.push(
    ['lv_treated_wood', 'Пропитка древесины креозотом', 'gtceu:treated_wood_planks', 8, ['lv_creosote', 'saw', 'mixer', 'joint'], 'Подай в чашу четыре доски, столярное соединение и 750 мБ креозота. Смеситель выдаёт четыре пропитанные доски за цикл.'],
    ...optional([
      ['lv_ie_pipe', 'Отдельная линия для креозота', 'gtceu:steel_small_fluid_pipe', 4, ['lv_creosote', 'bronze_pipe', 'iron_plate'], 'Собери стальную трубу из малых бронзовых труб и железных листов. Веди креозот отдельно от воды и пара.'],
      ['lv_ie_reinforced', 'Усиленная кладка домны', 'gtceu:heatproof_machine_casing', 27, ['pressed_steel_frame', 'furnace_lining_insert', 'blast_bricks'], 'В сборщике LV усили кирпич сталью и штампованной рамой. Для второй домны подготовь 27 блоков.'],
      ['lv_ie_heater', 'Электрический нагреватель', 'kubejs:heater_ribbon', 1, ['lv_ie_reinforced', 'lv_circuit_batch', 'copper_contacts'], 'В сборщике установи нагреватель с медными контактами и съёмной футеровкой. Питай через преобразователь EU в FE.'],
      ['lv_ie_preheater', 'Подогрев воздуха домны', 'gtceu:cupronickel_coil_block', 2, ['lv_ie_heater', 'lv_ie_pipe', 'motor'], 'Подготовь два подогревателя. Подведи питание отдельно и поставь их по бокам усиленной домны.'],
      ['lv_gt_coke_bricks', 'Кладка второй коксовой печи', gt('coke_oven_bricks'), 24, ['lv_ie_reinforced', 'coke_bricks', 'furnace_lining_insert'], 'Возьми обожжённые кирпичи и GregTech, вставки и заклёпки. Собери кладку для печи GregTech.'],
      ['lv_gt_coke_port', 'Вывод креозота GregTech', gt('coke_oven_hatch'), 1, ['lv_gt_coke_bricks', 'lv_ie_pipe', 'steam_bronze_drum'], 'Встрой люк с трубами и барабаном. Подключи выход к своему баку с креозотом.'],
      ['lv_gt_coke_controller', 'Коксовая печь GregTech', gt('coke_oven'), 1, ['lv_gt_coke_port', 'lv_ie_reinforced', 'lv_circuit_batch'], 'Установи контроллер в стенку. Подавай уплотнённую в Create шихту и отводи кокс и креозот по отдельности.'],
      ['lv_create_redstone', 'Датчики хода Create', create('redstone_contact'), 2, ['pressed_steel_frame', 'ie_redstone_control', 'copper_contacts'], 'Сборщик выдаёт пару контактов. Один закрепи на движущейся части, другой на станине.'],
      ['lv_create_gantry_rail', 'Зубчатая рейка портала', create('gantry_shaft'), 8, ['pressed_steel_frame', 'steel_plate', 'shaft', 'tin_cable'], 'Собери рейку из стальных листов, валов, втулки и штампованной рамы. Сборщик выпускает две секции за цикл.'],
      ['lv_create_gantry_carriage', 'Каретка над рабочими постами', create('gantry_carriage'), 1, ['lv_create_gantry_rail', 'lv_conveyor', 'depot', 'gearbox'], 'Установи каретку на рейку. Направление движения зависит от вращения вала.'],
      ['lv_create_chain', 'Передача по цепному конвейеру', create('chain_conveyor'), 2, ['lv_create_gantry_carriage', 'lv_conveyor', 'large_cogwheel'], 'Соедини два корпуса цепного привода с рамой, сталью и конвейером LV. Используй пары станций для переноса ящиков.'],
      ['lv_create_hose', 'Выдвижной забор жидкости', create('hose_pulley'), 1, ['pressed_steel_frame', 'lv_shop_pump', 'create_water_pump', 'bronze_pipe'], 'Установи шланговый блок над ёмкостью. Подключи вращение и насос Create. Шланг может брать воду из большого водоёма.'],
      ['lv_create_deployer', 'Укладчик для точной сборки', create('deployer'), 3, ['pressed_steel_frame', 'lv_shop_piston', 'ie_redstone_control'], 'Соедини механический и электрический поршни на стальной раме. Для линии точной сборки пригодятся три укладчика.'],
      ['lv_create_precision', 'Калибровка прецизионного механизма', create('precision_mechanism'), 1, ['lv_create_deployer', 'lv_circuit_batch', 'press', 'cogwheel'], 'Положи стальную раму на ленту. Укладчики ставят шестерню, изоляцию и схему LV. После пресса повтори эти четыре операции.'],
      ['lv_create_speed_control', 'Точная скорость вала', create('rotation_speed_controller'), 1, ['lv_create_precision', 'motor', 'gearbox', 'lv_create_redstone'], 'Собери регулятор из механизма, двигателя и редуктора. Поставь большую шестерню сверху и выставь скорость для рабочего участка.']
    ])
  )

  furnace.rows.push(...optional([
    ['lv_shop_robot', 'Манипулятор для плат', lv('robot_arm'), 1, ['pressed_steel_frame', 'lv_shop_piston', 'lv_conveyor', 'lv_circuit_batch'], 'Сборщик соединяет поршень, двигатель и конвейер на стальной раме. Добавь сталь, контакты и 500 мБ воды.'],
    ['lv_shop_sensor', 'Датчик контроля LV', lv('sensor'), 1, ['lv_shop_coil', 'pressed_steel_frame', 'panes'], 'Собери датчик из катушки, контактных полос, стекла и фильтра Create.'],
    ['lv_shop_emitter', 'Эмиттер управления LV', lv('emitter'), 1, ['lv_shop_coil', 'pressed_steel_frame', 'copper_plate'], 'Собери излучатель на штампованной раме с медными листами и кабелем.'],
    ['lv_shop_bender', 'Листогиб на штампованной раме', lv('bender'), 1, ['lv_shop_piston', 'pressed_steel_frame', 'press'], 'Установи пресс Create, поршень и стальные листы. Питай от линии LV и оставь место для выгрузки.'],
    ['lv_shop_wiremill', 'Волочение проволоки LV', lv('wiremill'), 1, ['pressed_steel_frame', 'motor', 'belt', 'bushing'], 'Установи ремень и втулки на двигатель. Подавай заготовки по одной партии, пока проверяешь направление выдачи.'],
    ['lv_shop_lathe', 'Токарный станок для стальных осей', lv('lathe'), 1, ['pressed_steel_frame', 'lv_shop_piston', 'shaft', 'steel_plate'], 'Закрепи вал Create и стальные стержни. Подготовь отдельное место для длинных заготовок.'],
    ['lv_shop_cutter', 'Резка деталей на LV', lv('cutter'), 1, ['pressed_steel_frame', 'lv_shop_piston', 'saw', 'saw_teeth'], 'Вставь пилу Create и запасные зубья в электрический резак. Подведи жидкость для выбранного рецепта.'],
    ['lv_shop_circuit_assembler', 'Станок монтажа электроники', lv('circuit_assembler'), 1, ['lv_shop_robot', 'ie_redstone_control', 'copper_contacts'], 'Соедини манипулятор с базовой электронной схемой и контактами. Отведи ему отдельную ветку питания.'],
    ['lv_shop_strainer', 'Сменные сетки ранней промывки', 'kubejs:strainer_mesh', 4, ['lv_shop_pump', 'steel_plate', 'fan'], 'Собери сетки по JEI. Часть отложи на рудопромывочную машину и химическую ванну.'],
    ['lv_shop_ore_washer', 'Промывочная машина с насосом LV', lv('ore_washer'), 1, ['lv_shop_strainer', 'pressed_steel_frame', 'fan'], 'Соедини насос, вентилятор Create и сетки. Подведи воду и выдели отдельный выход для хвостов.'],
    ['lv_shop_bath', 'Ванна для промывки реагентами', lv('chemical_bath'), 1, ['lv_shop_strainer', 'pressed_steel_frame', 'basin'], 'Используй чашу Create, насос и две сетки. Проверь, какая жидкость нужна для выбранного материала.'],
    ['lv_shop_mixer', 'Смеситель под электрический привод', lv('mixer'), 1, ['pressed_steel_frame', 'mixer', 'basin', 'motor'], 'Перенеси чашу и смеситель Create на корпус LV. Сырьё и жидкость держи в разных буферах.'],
    ['lv_shop_centrifuge', 'Отделение примесей на центрифуге', lv('centrifuge'), 1, ['lv_shop_mixer', 'motor', 'bushing'], 'Установи два бронзовых ротора и втулки на отдельный мотор. Освободи выход для побочных продуктов.'],
    ['lv_shop_electrolyzer', 'Разделение растворов на LV', lv('electrolyzer'), 1, ['lv_shop_emitter', 'create_water_buffer', 'copper_contacts'], 'Соедини эмиттер, контакты и бак Create. Разведи выходы жидкостей по отдельным линиям.'],
    ['lv_shop_fluid_heater', 'Нагрев жидкости в отдельном контуре', lv('fluid_heater'), 1, ['lv_shop_coil', 'furnace_lining_insert', 'create_water_line'], 'Защити нагреватель шамотными вкладышами и поставь медную трубу Create.'],
    ['lv_shop_distillery', 'Малая перегонка LV', lv('distillery'), 1, ['lv_shop_fluid_heater', 'lv_shop_pump', 'create_water_buffer'], 'Установи нагреватель, насос и бак. Раздели вход и выход, чтобы отработанная жидкость не вернулась в подачу.'],
    ['lv_shop_reactor', 'Первый электрический реактор', lv('chemical_reactor'), 1, ['lv_shop_mixer', 'lv_shop_pump', 'bronze_pipe'], 'Подключи смеситель и насос на стальной раме. Оставь свободный выход под продукты реакции.'],
    ['lv_shop_autoclave', 'Камера обработки под давлением', lv('autoclave'), 1, ['lv_shop_compressor', 'lv_shop_pump', 'lv_shop_bender'], 'Усиль корпус двойными стальными листами. Подготовь отдельный запас жидкости для партии.'],
    ['lv_shop_fluid_regulator', 'Регулировка расхода жидкости', lv('fluid_regulator'), 1, ['lv_shop_pump', 'pressed_steel_frame', 'lv_circuit_batch'], 'Установи медную рукоятку Create, насос и уплотнение. Задай скорость подачи на стороне жидкостной трубы.'],
    ['lv_shop_tank', 'Герметичный накопитель LV', lv('super_tank'), 1, ['lv_shop_fluid_regulator', 'steam_bronze_drum', 'steam_wide_pipe'], 'Используй барабан и две трубы среднего сечения. Установи накопитель на общей линии перед несколькими потребителями.'],
    ['lv_shop_item_buffer', 'Сортировка перед подачей', lv('buffer'), 1, ['lv_treated_wood', 'lv_conveyor', 'depot', 'pressed_steel_frame'], 'Собери промежуточный буфер из конвейера, депо и пропитанных досок.'],
    ['lv_shop_chest', 'Буфер под серийную сборку', lv('super_chest'), 1, ['lv_shop_item_buffer', 'ie_conveyor', 'chest'], 'Подай в сборщик промежуточный буфер, два сундука и тканый ремень. Выдели отдельный накопитель под один материал.'],
    ['lv_shop_liquid_inlet', 'Жидкостный ввод домны LV', lv('input_hatch'), 1, ['ebf_controller', 'lv_shop_pump', 'steam_bronze_drum'], 'Собери жидкостный ввод с механическим насосом Create, барабаном и бронзовыми трубами.'],
    ['lv_shop_liquid_outlet', 'Жидкостная выдача домны LV', lv('output_hatch'), 1, ['lv_shop_liquid_inlet', 'lv_conveyor'], 'Поставь выходной люк на сторону с отдельным баком. В рецепте насос заменяет конвейерный модуль.']
  ]))
}
