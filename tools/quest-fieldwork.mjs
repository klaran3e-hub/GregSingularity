const removed = {
  "alloy": "field_tenon",
  "casing": "field_tenon",
  "shaft": "field_spindle",
  "crank": "field_spindle",
  "cogwheel": "rim",
  "large_cogwheel": "rim",
  "gearbox": "rim",
  "vertical_gearbox": "rim",
  "early_kinetics_turns": "rim",
  "early_kinetics_coarse_pulleys": "rim",
  "wheel": "field_trough",
  "large_wheel": "field_trough",
  "early_kinetics_air_wash": "field_trough",
  "create_bearing": "bushing",
  "early_kinetics_shaft_bank": "bushing",
  "fan": "field_bellows",
  "create_windmill": "field_bellows",
  "create_sails": "field_bellows",
  "saw": "saw_blade",
  "millstone": "field_runner",
  "depot": "field_saddle",
  "press": "field_saddle",
  "basin": "field_saddle",
  "early_kinetics_wood_line": "field_saddle",
  "whisk": "field_spindle",
  "mixer": "field_bloomery",
  "create_alloy_batch": "field_bloomery",
  "belt": "belt_blank",
  "create_funnel": "belt_blank",
  "early_kinetics_belt_spares": "belt_blank",
  "create_water_line": "bronze_pipe",
  "create_water_pump": "field_pump",
  "create_water_buffer": "steam_bronze_drum",
  "lv_create_gantry_rail": "lv_shop_piston",
  "lv_create_gantry_carriage": "lv_shop_piston",
  "lv_create_chain": "lv_conveyor",
  "lv_create_hose": "lv_shop_pump",
  "lv_create_speed_control": "lv_shop_sensor",
  "lv_create_deployer": "motor",
  "lv_create_precision": "motor",
  "lv_create_redstone": "copper_contacts",
  "rail_casing": "rail_traction_housing",
  "rail_controls": "rail_traction_housing",
  "rail_glue": "rail_service_cart",
  "rail_cargo_vault": "rail_service_cart",
  "rail_doors": "rail_service_cart",
  "early_railway_wagon_storage": "rail_service_cart",
  "rail_schedule": "rail_stations",
  "rail_signals": "rail_stations",
  "rail_observers": "rail_stations",
  "rail_transfer": "rail_stations",
  "early_railway_rail_terminal": "rail_stations",
  "early_railway_extra_signals": "rail_stations",
  "early_railway_transfer_pair": "rail_stations",
  "early_railway_rail_observing": "rail_stations"
}
const revisions = {
  "shard": {
    "title": "Удар по ядрищу",
    "desc": "Ударь по надсечённому кремню гравием. Полученный скол пригодится для кромки.",
    "deps": [
      "field_score"
    ]
  },
  "washed": {
    "title": "Вычесать волокно",
    "desc": "Разотри вымоченную связку гравием. Из каждой выходят два промытых волокна.",
    "deps": [
      "field_retted",
      "gravel"
    ]
  },
  "knife": {
    "title": "Кремнёвый нож GregTech",
    "desc": "Привяжи притёртую кромку к палке шнуром и промытым волокном. Все четыре детали помещаются в инвентаре.",
    "deps": [
      "field_lap",
      "cord",
      "sticks"
    ]
  },
  "handle": {
    "title": "Подгонка рукояти",
    "desc": "Пройдись ножом по заготовке с песком и промытым волокном. Гладкая рукоять пойдёт в раму верстака и инструменты.",
    "deps": [
      "field_haft",
      "washed"
    ]
  },
  "bench": {
    "title": "Первый настоящий верстак",
    "desc": "Соедини столешницу, шип, деревянную раму и вязаное крепление в сетке 2×2.",
    "deps": [
      "frame",
      "bench_top",
      "field_tenon",
      "binding"
    ]
  },
  "axe_head": {
    "title": "Широкая кромка топора",
    "desc": "Подгони три притёртые кромки гравием. Дальше понадобятся рукоять и обвязка.",
    "deps": [
      "bench",
      "field_lap"
    ]
  },
  "pick_head": {
    "title": "Острие первой кирки",
    "desc": "Сложи три притёртые кромки в ряд и подложи гравий под середину.",
    "deps": [
      "bench",
      "field_lap"
    ]
  },
  "wet_lining": {
    "title": "Сырая футеровка",
    "desc": "Две порции набивной массы, отощитель и промытое волокно дают две заготовки футеровки.",
    "deps": [
      "field_mix",
      "temper",
      "washed"
    ]
  },
  "raw_crucible": {
    "title": "Тигель перед обжигом",
    "desc": "Утрамбуй набивную массу вокруг отощителя. Такой тигель выдержит прокалку шихты.",
    "deps": [
      "field_mix",
      "temper",
      "kiln"
    ]
  },
  "copper_grit": {
    "title": "Медь под молотом",
    "desc": "Раздроби три единицы сырой меди, малахита или халькопирита молотом. Получишь одну порцию медной крупки.",
    "deps": [
      "hammer",
      "torches"
    ]
  },
  "copper_washed": {
    "title": "Первые зёрна меди",
    "desc": "Промой медную крупку в жёлобе у источника воды. Три порции концентрата понадобятся для бронзы.",
    "deps": [
      "field_trough",
      "copper_grit"
    ]
  },
  "iron_washed": {
    "title": "Железо после промывки",
    "desc": "Пропусти железную крупку через жёлоб. Сохрани хвосты для огнеупорных материалов.",
    "deps": [
      "field_trough",
      "iron_grit"
    ]
  },
  "gold_washed": {
    "title": "Тяжёлый золотой остаток",
    "desc": "Нажми золотой крупкой по жёлобу с водой. Полученный концентрат идёт в отдельную шихту.",
    "deps": [
      "field_trough",
      "gold_grit"
    ]
  },
  "tin_grit": {
    "title": "Первое оловянное сырьё",
    "desc": "Добывай олово, касситерит или касситеритовый песок. Три единицы сырья под молотом дают одну порцию крупки.",
    "deps": [
      "hammer",
      "torches"
    ]
  },
  "tin_washed": {
    "title": "Олово для бронзовой плавки",
    "desc": "Промой оловянную крупку. Для первой бронзовой шихты хватит одного концентрата.",
    "deps": [
      "field_trough",
      "tin_grit"
    ]
  },
  "tin_ingot": {
    "title": "Отдельная плавка олова",
    "desc": "Восстанови оловянную шихту в горне с двумя углями и рабочей изложницей.",
    "deps": [
      "field_bloomery",
      "tin_charge",
      "field_mould"
    ]
  },
  "copper": {
    "title": "Отдельная плавка меди",
    "desc": "Загрузи медную шихту, два древесных угля и обожжённую изложницу. Слиток пригодится для медной полосы.",
    "deps": [
      "field_bloomery",
      "copper_charge",
      "field_mould"
    ]
  },
  "bloom": {
    "title": "Крица из полевого горна",
    "desc": "Восстанови железную шихту в подготовленном горне. Полученную крицу предстоит проковать.",
    "deps": [
      "field_bloomery",
      "iron_charge",
      "field_mould"
    ]
  },
  "gold_ingot": {
    "title": "Отливка золота",
    "desc": "Восстанови золотую шихту в горне. Забери золотой слиток, а изложницу оставь на следующую партию.",
    "deps": [
      "field_bloomery",
      "gold_charge",
      "field_mould"
    ]
  },
  "bronze_charge": {
    "title": "Медно-оловянная шихта",
    "desc": "Набери три медных и один оловянный концентрат, две порции шамота и обожжённый тигель.",
    "deps": [
      "field_chamotte",
      "copper_washed",
      "tin_washed",
      "crucible"
    ]
  },
  "bronze": {
    "title": "Первый слиток бронзы",
    "desc": "Переложи прокалённую шихту в горн с одной рабочей изложницей и двумя древесными углями. За 18 секунд выйдет слиток GregTech.",
    "deps": [
      "field_roast",
      "field_mould"
    ]
  },
  "segment": {
    "title": "Реечное дно для промывки",
    "desc": "Скрепи четыре рейки шнуром и нагелем. Из двух секций соберёшь дно промывочного жёлоба.",
    "deps": [
      "slat",
      "peg",
      "cord"
    ]
  },
  "iron_plate": {
    "title": "Железный лист на подкладке",
    "desc": "На подкладке прокуй молотом два железных слитка в одну пластину GregTech.",
    "deps": [
      "field_saddle",
      "iron"
    ]
  },
  "copper_plate": {
    "title": "Медная пластина вручную",
    "desc": "Положи два слитка меди на ковочную подкладку и раскатай молотом в одну пластину.",
    "deps": [
      "field_saddle",
      "copper"
    ]
  },
  "bronze_plate": {
    "title": "Кованая бронзовая пластина",
    "desc": "Прокуй на многоразовой подкладке два бронзовых слитка. Паровой молот позже сократит расход вдвое.",
    "deps": [
      "bronze",
      "field_saddle"
    ]
  },
  "blank": {
    "title": "Заготовка котельного листа",
    "desc": "Уложи две бронзовые пластины на подкладку и прокуй молотом. Лист нужен трубным узлам и корпусам.",
    "deps": [
      "bronze_plate",
      "field_saddle"
    ]
  },
  "rim": {
    "title": "Обод с опорами",
    "desc": "Собери обод из бронзовых пластин, соединений, втулок и шпинделя.",
    "deps": [
      "field_spindle",
      "bronze_plate",
      "joint"
    ]
  },
  "boiler": {
    "title": "Первый пар в коллекторе",
    "desc": "Установи два десяти-трубных пакета в корпус с топкой. Перед розжигом подведи воду.",
    "deps": [
      "firebox",
      "field_bank",
      "bronze_casing"
    ]
  },
  "steam_mill": {
    "title": "Первое машинное дробление",
    "desc": "Установи каменный бегун и втулки в бронзовый корпус дробилки. Подведи пар от котла.",
    "deps": [
      "boiler",
      "field_runner"
    ]
  },
  "steam_hammer": {
    "title": "Пар за ковочным бойком",
    "desc": "Встрой ковочную подкладку в станок. На паре один слиток даёт целую пластину.",
    "deps": [
      "boiler",
      "field_saddle"
    ]
  },
  "steam_extractor": {
    "title": "Первый паровой экстрактор",
    "desc": "Вложи кузнечные мехи в медно-бронзовый узел экстрактора. Освободи выход и подключи пар.",
    "deps": [
      "boiler",
      "field_bellows",
      "copper_plate",
      "seal"
    ]
  },
  "steam_compressor": {
    "title": "Рабочая камера компрессора",
    "desc": "Установи подкладку в бронзовый корпус с трубами, штампованными заготовками и уплотнением.",
    "deps": [
      "boiler",
      "field_saddle",
      "seal"
    ]
  },
  "early_flour": {
    "title": "Первый помол зерна",
    "desc": "Молот размалывает пшеницу в муку грубого помола. Ступка выдаёт вдвое больше муки с той же партии.",
    "deps": null,
    "item": "kubejs:coarse_flour"
  },
  "early_dough": {
    "title": "Замес на берегу",
    "desc": "Нажми мукой по воде или замеси её с глиняным ведром воды. Готовое тесто можно испечь на костре.",
    "deps": null,
    "item": "kubejs:camp_dough"
  },
  "rail_first_track": {
    "title": "Путь из прокатного рельса",
    "desc": "Собери восемь секций пути из катаного рельса, шпалы и крепежа.",
    "deps": [
      "rail_profile",
      "rail_sleepers",
      "rail_fasteners"
    ],
    "item": "minecraft:rail",
    "count": 8
  },
  "rail_bulk_track": {
    "title": "Основание грузовой линии",
    "desc": "Заготовь 64 секции обычного рельса для длинного перегона.",
    "deps": [
      "rail_first_track"
    ],
    "item": "minecraft:rail",
    "count": 64
  },
  "rail_stations": {
    "title": "Два рельса-датчика",
    "desc": "Уложи рельс-датчик в пункте отправления и ещё один у получателя. Расстояние между ними должно быть не меньше 192 блоков.",
    "deps": [
      "rail_first_track",
      "rail_signal_relay"
    ],
    "item": "minecraft:detector_rail",
    "count": 2
  },
  "early_railway_rail_passing": {
    "title": "Разъезд для вагонеток",
    "desc": "Продли линию и оставь место для второй вагонетки с сундуком.",
    "deps": [
      "rail_bulk_track"
    ],
    "item": "minecraft:rail",
    "count": 64
  },
  "rail_dispatch_form": {
    "title": "Накладная на вагонетку",
    "desc": "Останови вагонетку с восемью опломбированными ящиками на рельсе-датчике. Нажми по рельсу накладной.",
    "deps": [
      "rail_stations",
      "rail_sealed_batch",
      "rail_service_cart"
    ]
  },
  "rail_accept_batch": {
    "title": "Приёмка вагонетки",
    "desc": "Доставь ту же вагонетку с восемью ящиками на другой рельс-датчик за 192 блока. Предъяви ту же накладную.",
    "deps": [
      "rail_dispatch_form"
    ]
  },
  "rail_traction_housing": {
    "title": "Ходовая рама вагонетки",
    "desc": "Соедини две оси с листами, каркасами и жаростойким вкладышем. Рама входит в рецепт вагонетки.",
    "deps": null
  },
  "mv_filter_basin": {
    "title": "Нефтепромысел / обожжённый тигель",
    "desc": "Образцы с промысла держи в керамических тиглях до обработки.",
    "deps": null,
    "item": "kubejs:fired_crucible",
    "count": 1
  },
  "mv_sample_spout": {
    "title": "Нефтепромысел / малая бронзовая труба",
    "desc": "Собери запас малых жидкостных труб для линии отбора проб.",
    "deps": null,
    "item": "gtceu:bronze_small_fluid_pipe",
    "count": 1
  },
  "mv_oil_pumps": {
    "title": "Нефтепромысел / цилиндр насоса",
    "desc": "Подготовь сменные цилиндры насосов для скважины.",
    "deps": null,
    "item": "kubejs:hand_pump_barrel",
    "count": 4
  },
  "mv_oil_inspection": {
    "title": "Нефтепромысел / малая бронзовая труба для испытаний",
    "desc": "Подготовь малые бронзовые трубы для проверки герметичности участка.",
    "deps": null,
    "item": "gtceu:bronze_small_fluid_pipe",
    "count": 8
  },
  "mv_create_brass_funnel": {
    "title": "Грузовой двор / конвейер LV",
    "desc": "Конвейерный модуль перегружает предметы через крышку механизма.",
    "deps": null,
    "item": "gtceu:lv_conveyor_module",
    "count": 2
  },
  "mv_create_brass_tunnel": {
    "title": "Грузовой двор / оловянная предметная труба",
    "desc": "Предметные трубы из олова соединяют входы и выходы станков.",
    "deps": null,
    "item": "gtceu:tin_normal_item_pipe",
    "count": 2
  },
  "mv_create_smart_chute": {
    "title": "Грузовой двор / ограничительная труба",
    "desc": "Ограничительная секция даёт грузам запасной путь.",
    "deps": null,
    "item": "gtceu:tin_normal_restrictive_item_pipe",
    "count": 1
  },
  "mv_create_observer": {
    "title": "Грузовой двор / датчик LV",
    "desc": "Подготовь датчик для контроля выдачи со склада.",
    "deps": null,
    "item": "gtceu:lv_sensor",
    "count": 1
  },
  "mv_create_stockpile": {
    "title": "Грузовой двор / датчик MV",
    "desc": "Датчик следующего уровня пригодится при расширении сортировочного узла.",
    "deps": null,
    "item": "gtceu:mv_sensor",
    "count": 1
  },
  "hv_pressing_basin": {
    "title": "Литейная HV / обожжённый тигель",
    "desc": "Держи чистый тигель для отдельной пробы расплава.",
    "deps": null,
    "item": "kubejs:fired_crucible",
    "count": 1
  },
  "hv_blaze_burner": {
    "title": "Литейная HV / электропечь HV",
    "desc": "Подготовь электрическую печь для параллельной термообработки на HV.",
    "deps": null,
    "item": "gtceu:hv_electric_furnace",
    "count": 1
  },
  "hv_create_arm": {
    "title": "Литейная HV / манипулятор MV",
    "desc": "Манипулятор класса MV обслуживает предметную линию литейной.",
    "deps": null,
    "item": "gtceu:mv_robot_arm",
    "count": 1
  },
  "hv_shop_hose": {
    "title": "Литейная HV / насос LV",
    "desc": "Насос LV пригодится на вспомогательной жидкостной линии.",
    "deps": null,
    "item": "gtceu:lv_electric_pump",
    "count": 2
  },
  "hv_end_spout": {
    "title": "Снабжение экспедиции / малая бронзовая труба",
    "desc": "Проложи короткую линию для подачи жидкости в экспедиционном лагере.",
    "deps": null,
    "item": "gtceu:bronze_small_fluid_pipe",
    "count": 2
  },
  "ev_vacuum_heated_basin": {
    "title": "Вакуумный участок / электропечь HV",
    "desc": "Перед вакуумной обработкой выдели отдельную электрическую печь.",
    "deps": null,
    "item": "gtceu:hv_electric_furnace",
    "count": 2
  },
  "luv_hssg_drive_stock": {
    "title": "Участок сплавов LuV / манипулятор LV",
    "desc": "Держи манипулятор для подачи заготовок легированных сталей.",
    "deps": null,
    "item": "gtceu:lv_robot_arm",
    "count": 8
  },
  "luv_optics_press_buffer": {
    "title": "Энергосеть LuV / конвейер LV",
    "desc": "Конвейер подаёт оптические заготовки в обработку.",
    "deps": null,
    "item": "gtceu:lv_conveyor_module",
    "count": 2
  },
  "luv_ignition_observers": {
    "title": "Термоядерный цех / датчик LV",
    "desc": "Назначь датчик на контроль входного потока термоядерного участка.",
    "deps": null,
    "item": "gtceu:lv_sensor",
    "count": 4
  },
  "zpm_freight_control_stock": {
    "title": "Диспетчерская ZPM / датчик LV",
    "desc": "Собери резерв датчиков для диспетчерской.",
    "deps": null,
    "item": "gtceu:lv_sensor",
    "count": 4
  },
  "uv_hot_basin": {
    "title": "Материалы UV / обожжённый тигель",
    "desc": "Подготовь тигель для лабораторной пробы жаростойкой шихты.",
    "deps": null,
    "item": "kubejs:fired_crucible",
    "count": 1
  },
  "final_spare_press": {
    "title": "Ремонтный цех / ковочная подкладка",
    "desc": "Отложи запасную ковочную подкладку на случай ремонта оснастки.",
    "deps": null,
    "item": "kubejs:forging_saddle",
    "count": 2
  },
  "final_rail_terminal": {
    "title": "Отдалённый склад / рельс-датчик",
    "desc": "Рельс-датчик отметит место разгрузки поездной партии.",
    "deps": null,
    "item": "minecraft:detector_rail",
    "count": 2
  },
  "post_uv_reserve_rotary_control": {
    "title": "Аварийное питание / схема MV",
    "desc": "Схема MV входит в регулятор резервной линии.",
    "deps": null,
    "item": "gtceu:good_electronic_circuit",
    "count": 4
  },
  "early_workshop_joiner_joints": {
    "title": "Соединения для деревянной оснастки",
    "desc": "Для операции «Соединения для деревянной оснастки» понадобятся «доски подходящей породы», «Деревянный нагель», «нож GregTech». Подготовь комплект по рецепту.",
    "deps": null,
    "item": "kubejs:wooden_joint",
    "count": 12
  },
  "early_kiln_strap_bin": {
    "title": "Кованые ленты для печных узлов",
    "desc": "Для операции «Кованые ленты для печных узлов» понадобятся «медный слиток», «крафтовый молот GregTech». Подготовь комплект по рецепту.",
    "deps": null,
    "item": "kubejs:copper_strap",
    "count": 8
  },
  "drawer_slides": {
    "title": "Прокат направляющих",
    "desc": "Для операции «Прокат направляющих» подготовь рабочее место в паровом или электрическом молоте. В состав загрузки входят «Заготовка направляющих ящика».",
    "deps": null,
    "item": "kubejs:drawer_slide",
    "count": 4
  },
  "tin_plate": {
    "title": "Оловянный лист",
    "desc": "Для операции «Оловянный лист» подготовь рабочее место в паровом или электрическом молоте. В состав загрузки входят «оловянный слиток».",
    "deps": null,
    "item": "gtceu:tin_plate",
    "count": 2
  },
  "tin_wire": {
    "title": "Оловянная проволока",
    "desc": "Для операции «Оловянная проволока» подготовь рабочее место в паровом или электрическом молоте. В состав загрузки входят «Оловянная заготовка для проволоки».",
    "deps": null,
    "item": "gtceu:tin_single_wire",
    "count": 4
  },
  "copper_contacts": {
    "title": "Медные контакты",
    "desc": "Для операции «Медные контакты» подготовь рабочее место в паровом или электрическом молоте. В состав загрузки входят «медная пластина».",
    "deps": null,
    "item": "kubejs:copper_contact_strip",
    "count": 2
  },
  "lv_printed_board": {
    "title": "Опрессованная плата",
    "desc": "Для операции «Опрессованная плата» подготовь рабочее место в паровом или электрическом молоте. В состав загрузки входят «Набор слоёв платы».",
    "deps": null,
    "item": "gtceu:resin_printed_circuit_board",
    "count": 1
  },
  "early_lv_board_bank": {
    "title": "Смоляные платы для ручной пайки",
    "desc": "Для операции «Смоляные платы для ручной пайки» подготовь рабочее место в паровом или электрическом молоте. В состав загрузки входят «Набор слоёв платы».",
    "deps": null,
    "item": "gtceu:resin_printed_circuit_board",
    "count": 8
  },
  "early_lv_lv_bender": {
    "title": "Листогиб для простых корпусов LV",
    "desc": "Для операции «Листогиб для простых корпусов LV» подготовь рабочее место в сборщике GregTech. В состав загрузки входят «корпус LV», «Штампованная стальная рама», «Уплотнённое котельное соединение».",
    "deps": null,
    "item": "gtceu:lv_bender",
    "count": 1
  },
  "lv_shop_piston": {
    "title": "Первый электропоршень",
    "desc": "Для операции «Первый электропоршень» подготовь рабочее место в сборщике GregTech. В состав загрузки входят «Точёный шпиндель», «Футерованная втулка», «железная пластина».",
    "deps": null,
    "item": "gtceu:lv_electric_piston",
    "count": 1
  },
  "lv_shop_pump": {
    "title": "Насос с механической ступенью",
    "desc": "Для операции «Насос с механической ступенью» подготовь рабочее место в сборщике GregTech. В состав загрузки входят «Цилиндр насоса», «бронзовая пластина», «Прессованная изоляция».",
    "deps": null,
    "item": "gtceu:lv_electric_pump",
    "count": 1
  },
  "lv_shop_macerator": {
    "title": "Электрическое дробление руд",
    "desc": "Для операции «Электрическое дробление руд» подготовь рабочее место в сборщике GregTech. В состав загрузки входят «корпус LV», «Жернов-бегунок», «железная пластина».",
    "deps": null,
    "item": "gtceu:lv_macerator",
    "count": 1
  },
  "lv_shop_hammer": {
    "title": "Молот с электрическим приводом",
    "desc": "Для операции «Молот с электрическим приводом» подготовь рабочее место в сборщике GregTech. В состав загрузки входят «крафтовый молот GregTech», «корпус LV», «Ковочная подкладка».",
    "deps": null,
    "item": "gtceu:lv_forge_hammer",
    "count": 1
  },
  "lv_shop_extractor": {
    "title": "Экстракция с регулируемой подачей",
    "desc": "Для операции «Экстракция с регулируемой подачей» подготовь рабочее место в сборщике GregTech. В состав загрузки входят «корпус LV», «Венец шестерни», «железная пластина».",
    "deps": null,
    "item": "gtceu:lv_extractor",
    "count": 1
  },
  "lv_shop_tin_pipe": {
    "title": "Тонкая предметная магистраль",
    "desc": "Для операции «Тонкая предметная магистраль» подготовь рабочее место в сборщике GregTech. В состав загрузки входят «оловянная пластина», «Железная заклёпка», «Прессованная изоляция».",
    "deps": null,
    "item": "gtceu:tin_small_item_pipe",
    "count": 8
  },
  "ie_iron": {
    "title": "Стык трёх производств",
    "desc": "Для операции «Стык трёх производств» понадобятся «железная пластина», «Железная заклёпка», «Штампованная бронзовая заготовка». Подготовь комплект по рецепту.",
    "deps": null,
    "item": "gtceu:iron_gear",
    "count": 1
  },
  "coke_brick_blank": {
    "title": "Прессование сырца",
    "desc": "Для операции «Прессование сырца» подготовь рабочее место в паровом или электрическом молоте. В состав загрузки входят «Шамотная масса».",
    "deps": null,
    "item": "kubejs:coke_brick_blank",
    "count": 8
  },
  "coking_charge": {
    "title": "Шихта для коксования",
    "desc": "Для операции «Шихта для коксования» понадобятся «Смола для изоляции», «крафтовый молот GregTech». Подготовь комплект по рецепту.",
    "deps": null,
    "item": "kubejs:coking_charge",
    "count": 2
  },
  "lv_creosote": {
    "title": "Отвод креозота",
    "desc": "Забери креозот из коксовой печи через жидкостный выход. Освобождай внутренний бак между партиями.",
    "deps": null,
    "item": "gtceu:creosote_bucket",
    "count": 1
  },
  "lime_flux": {
    "title": "Размол известкового флюса",
    "desc": "Для операции «Размол известкового флюса» подготовь рабочее место в дробилке GregTech. Назначь вход и освободи выход для следующей партии.",
    "deps": null,
    "item": "kubejs:lime_flux",
    "count": 8
  },
  "steel_plate": {
    "title": "Первые стальные листы",
    "desc": "Для операции «Первые стальные листы» подготовь рабочее место в паровом или электрическом молоте. В состав загрузки входят «Кованая стальная заготовка».",
    "deps": null,
    "item": "gtceu:steel_plate",
    "count": 4
  },
  "lv_gt_coke_controller": {
    "title": "Коксовая печь GregTech",
    "desc": "Для операции «Коксовая печь GregTech» подготовь рабочее место в сборщике GregTech. В состав загрузки входят «Штампованная стальная рама», «Шамотный вкладыш».",
    "deps": null,
    "item": "gtceu:coke_oven",
    "count": 1
  },
  "furnace_lining_insert": {
    "title": "Съёмная футеровка",
    "desc": "Для операции «Съёмная футеровка» подготовь рабочее место в смесителе GregTech. В состав загрузки входят «Обожжённая футеровка», «Глиняный раствор».",
    "deps": null,
    "item": "kubejs:furnace_lining_insert",
    "count": 2
  },
  "nickel_concentrate": {
    "title": "Промывка никеля",
    "desc": "Для операции «Промывка никеля» подготовь рабочее место в химической ванне. Назначь вход и освободи выход для следующей партии.",
    "deps": null,
    "item": "kubejs:nickel_concentrate",
    "count": 2
  },
  "first_aluminium": {
    "title": "Охлаждение алюминиевой болванки",
    "desc": "Собери комплект для операции «Охлаждение алюминиевой болванки». Рецепт можно открыть прямо с предмета задания.",
    "deps": null,
    "item": "gtceu:aluminium_ingot",
    "count": 1
  },
  "lv_shop_sensor": {
    "title": "Датчик контроля LV",
    "desc": "Для операции «Датчик контроля LV» подготовь рабочее место в сборщике GregTech. В состав загрузки входят «Медная контактная лента», «Штампованная стальная рама», «Тканая основа ремня».",
    "deps": null,
    "item": "gtceu:lv_sensor",
    "count": 1
  },
  "lv_shop_bender": {
    "title": "Листогиб на штампованной раме",
    "desc": "Для операции «Листогиб на штампованной раме» подготовь рабочее место в сборщике GregTech. В состав загрузки входят «корпус LV», «Штампованная стальная рама», «Уплотнённое котельное соединение».",
    "deps": null,
    "item": "gtceu:lv_bender",
    "count": 1
  },
  "lv_shop_lathe": {
    "title": "Токарный станок для стальных осей",
    "desc": "Для операции «Токарный станок для стальных осей» подготовь рабочее место в сборщике GregTech. В состав загрузки входят «корпус LV», «Штампованная стальная рама», «Уплотнённое котельное соединение».",
    "deps": null,
    "item": "gtceu:lv_lathe",
    "count": 1
  },
  "lv_shop_cutter": {
    "title": "Резка деталей на LV",
    "desc": "Для операции «Резка деталей на LV» подготовь рабочее место в сборщике GregTech. В состав загрузки входят «корпус LV», «Штампованная стальная рама», «Уплотнённое котельное соединение».",
    "deps": null,
    "item": "gtceu:lv_cutter",
    "count": 1
  },
  "lv_shop_ore_washer": {
    "title": "Промывочная машина с насосом LV",
    "desc": "Для операции «Промывочная машина с насосом LV» подготовь рабочее место в сборщике GregTech. В состав загрузки входят «корпус LV», «Штампованная стальная рама», «Уплотнённое котельное соединение».",
    "deps": null,
    "item": "gtceu:lv_ore_washer",
    "count": 1
  },
  "lv_shop_bath": {
    "title": "Ванна для промывки реагентами",
    "desc": "Для операции «Ванна для промывки реагентами» подготовь рабочее место в сборщике GregTech. В состав загрузки входят «корпус LV», «Штампованная стальная рама», «Уплотнённое котельное соединение».",
    "deps": null,
    "item": "gtceu:lv_chemical_bath",
    "count": 1
  },
  "lv_shop_mixer": {
    "title": "Смеситель под электрический привод",
    "desc": "Для операции «Смеситель под электрический привод» подготовь рабочее место в сборщике GregTech. В состав загрузки входят «корпус LV», «Штампованная стальная рама», «Уплотнённое котельное соединение».",
    "deps": null,
    "item": "gtceu:lv_mixer",
    "count": 1
  },
  "lv_shop_electrolyzer": {
    "title": "Разделение растворов на LV",
    "desc": "Для операции «Разделение растворов на LV» подготовь рабочее место в сборщике GregTech. В состав загрузки входят «корпус LV», «Штампованная стальная рама», «Уплотнённое котельное соединение».",
    "deps": null,
    "item": "gtceu:lv_electrolyzer",
    "count": 1
  },
  "lv_shop_fluid_heater": {
    "title": "Нагрев жидкости в отдельном контуре",
    "desc": "Для операции «Нагрев жидкости в отдельном контуре» подготовь рабочее место в сборщике GregTech. В состав загрузки входят «корпус LV», «Штампованная стальная рама», «Уплотнённое котельное соединение».",
    "deps": null,
    "item": "gtceu:lv_fluid_heater",
    "count": 1
  },
  "lv_shop_fluid_regulator": {
    "title": "Регулировка расхода жидкости",
    "desc": "Для операции «Регулировка расхода жидкости» подготовь рабочее место в сборщике GregTech. В состав загрузки входят «Венец шестерни», «Прессованная изоляция», «Штампованная стальная рама».",
    "deps": null,
    "item": "gtceu:lv_fluid_regulator",
    "count": 1
  },
  "lv_shop_liquid_inlet": {
    "title": "Жидкостный ввод домны LV",
    "desc": "Для операции «Жидкостный ввод домны LV» подготовь рабочее место в сборщике GregTech. В состав загрузки входят «корпус LV», «Уплотнённое котельное соединение», «Штампованная стальная рама».",
    "deps": null,
    "item": "gtceu:lv_input_hatch",
    "count": 1
  },
  "air_compressor": {
    "title": "Компрессор пневматического цеха",
    "desc": "Для операции «Компрессор пневматического цеха» подготовь рабочее место в сборщике GregTech. В состав загрузки входят «Уплотнённое котельное соединение».",
    "deps": null,
    "item": "pneumaticcraft:air_compressor",
    "count": 1
  },
  "mv_copper_wire": {
    "title": "Протяжка медной проволоки",
    "desc": "Собери комплект для операции «Протяжка медной проволоки». Рецепт можно открыть прямо с предмета задания.",
    "deps": null,
    "item": "gtceu:copper_single_wire",
    "count": 4
  },
  "mv_assembler": {
    "title": "Сборщик для серийной работы MV",
    "desc": "Для операции «Сборщик для серийной работы MV» подготовь рабочее место в сборщике GregTech. В состав загрузки входят «корпус MV», «Штампованная стальная рама», «Обжатое уплотнение».",
    "deps": null,
    "item": "gtceu:mv_assembler",
    "count": 1
  },
  "mv_pump": {
    "title": "Герметичный насос MV",
    "desc": "Для операции «Герметичный насос MV» подготовь рабочее место в сборщике GregTech. В состав загрузки входят «Обжатое уплотнение», «Выверенный ротор турбины», «Цилиндр насоса».",
    "deps": null,
    "item": "gtceu:mv_electric_pump",
    "count": 1
  },
  "mv_pressure_gauge": {
    "title": "Манометр перед первым пуском",
    "desc": "Для операции «Манометр перед первым пуском» подготовь рабочее место в сборщике GregTech. В состав загрузки входят «Медная контактная лента», «Стеклянная колба», «Уплотнённое котельное соединение».",
    "deps": null,
    "item": "pneumaticcraft:pressure_gauge",
    "count": 1
  },
  "mv_pressure_regulator": {
    "title": "Регулятор воздушной линии",
    "desc": "Для операции «Регулятор воздушной линии» подготовь рабочее место в сборщике GregTech. Назначь вход и освободи выход для следующей партии.",
    "deps": null,
    "item": "pneumaticcraft:regulator_tube_module",
    "count": 1
  },
  "mv_voltage_coil": {
    "title": "Медная обмотка управления",
    "desc": "Для операции «Медная обмотка управления» подготовь рабочее место в сборщике GregTech. В состав загрузки входят «Статор с обмоткой», «Медная контактная лента», «Прессованная изоляция».",
    "deps": null,
    "item": "gtceu:mv_voltage_coil",
    "count": 4
  },
  "mv_machine_cutter": {
    "title": "Резка с подачей смазки",
    "desc": "Для операции «Резка с подачей смазки» подготовь рабочее место в сборщике GregTech. В состав загрузки входят «Сборное полотно пилы», «Кованые зубья пилы», «корпус MV».",
    "deps": null,
    "item": "gtceu:mv_cutter",
    "count": 1
  },
  "mv_machine_fluid_solidifier": {
    "title": "Литьё в сменную форму",
    "desc": "Для операции «Литьё в сменную форму» подготовь рабочее место в сборщике GregTech. В состав загрузки входят «корпус MV», «Обжатое уплотнение».",
    "deps": null,
    "item": "gtceu:mv_fluid_solidifier",
    "count": 1
  },
  "mv_work_emitter": {
    "title": "Передатчик сигнала MV",
    "desc": "Для операции «Передатчик сигнала MV» подготовь рабочее место в сборщике GregTech. В состав загрузки входят «Медная контактная лента», «Обжатое уплотнение».",
    "deps": null,
    "item": "gtceu:mv_emitter",
    "count": 1
  },
  "strainer_mesh": {
    "title": "Фильтровальная сетка",
    "desc": "Для операции «Фильтровальная сетка» подготовь рабочее место в формовочном прессе. В состав загрузки входят «Медная контактная лента», «Прессованная изоляция», «стальная пластина».",
    "deps": null,
    "item": "kubejs:strainer_mesh",
    "count": 4
  },
  "sample_ampoules": {
    "title": "Пустые ампулы",
    "desc": "Для операции «Пустые ампулы» понадобятся «Стеклянная колба», «Обжатое уплотнение», «Медная контактная лента». Подготовь комплект по рецепту.",
    "deps": null,
    "item": "kubejs:sample_ampoule",
    "count": 4
  },
  "washed_oil_sample": {
    "title": "Промывка первой партии",
    "desc": "Для операции «Промывка первой партии» подготовь рабочее место в наполнителе. В состав загрузки входят «Пробоотборная ампула».",
    "deps": null,
    "item": "kubejs:washed_oil_sample",
    "count": 1
  },
  "refinery_exchanger": {
    "title": "Сердечник теплообменника",
    "desc": "Для операции «Сердечник теплообменника» подготовь рабочее место в сборщике GregTech. В состав загрузки входят «Тарелка колонны», «Лента нагревателя», «Штампованная стальная рама».",
    "deps": null,
    "item": "kubejs:heat_exchange_core",
    "count": 5
  },
  "fraction_drums": {
    "title": "Раздельные ёмкости",
    "desc": "Для операции «Раздельные ёмкости» понадобятся «стальная пластина», «Кованая стальная заготовка», «Штампованная стальная рама». Подготовь комплект по рецепту.",
    "deps": null,
    "item": "gtceu:steel_drum",
    "count": 4
  },
  "mv_ie_fluid_pump": {
    "title": "Насос буровой",
    "desc": "Для операции «Насос буровой» подготовь рабочее место в сборщике GregTech. В состав загрузки входят «Цилиндр насоса», «Обжатое уплотнение».",
    "deps": null,
    "item": "gtceu:lv_electric_pump",
    "count": 1
  },
  "diesel_sample": {
    "title": "Первая партия дизеля",
    "desc": "Для операции «Первая партия дизеля» подготовь рабочее место в наполнителе. В состав загрузки входят «Пробоотборная ампула».",
    "deps": null,
    "item": "kubejs:diesel_sample",
    "count": 1
  },
  "nether_transit": {
    "title": "Допуск к порталу",
    "desc": "Для операции «Допуск к порталу» подготовь рабочее место в сборщике GregTech. В состав загрузки входят «Наладочный комплект химцеха», «Химстойкое уплотнение», «стальная пластина».",
    "deps": null,
    "item": "kubejs:nether_transit_seal",
    "count": 1
  },
  "nether_mv_mixer": {
    "title": "Смеситель тяжёлой шихты",
    "desc": "Для операции «Смеситель тяжёлой шихты» подготовь рабочее место в сборщике GregTech. В состав загрузки входят «корпус MV», «Точёный шпиндель», «Сердечник теплообменника».",
    "deps": null,
    "item": "gtceu:mv_mixer",
    "count": 1
  },
  "nether_mv_wiremill": {
    "title": "Волочильный стан MV",
    "desc": "Для операции «Волочильный стан MV» подготовь рабочее место в сборщике GregTech. В состав загрузки входят «корпус MV», «Ковочная подкладка», «Кованая стальная заготовка».",
    "deps": null,
    "item": "gtceu:mv_wiremill",
    "count": 1
  },
  "nether_mv_lathe": {
    "title": "Токарный станок MV",
    "desc": "Для операции «Токарный станок MV» подготовь рабочее место в сборщике GregTech. В состав загрузки входят «корпус MV», «Сборное полотно пилы», «Герметичный буровой узел».",
    "deps": null,
    "item": "gtceu:mv_lathe",
    "count": 1
  },
  "mv_nether_brick_blank": {
    "title": "Сырец для нижней кладки",
    "desc": "Для операции «Сырец для нижней кладки» подготовь рабочее место в смесителе GregTech. В состав загрузки входят «Глиняный раствор», «Базальтовый концентрат», «Шамотная масса».",
    "deps": null,
    "item": "kubejs:nether_brick_blank",
    "count": 4
  },
  "rail_gold_blank": {
    "title": "Заготовка для контактов",
    "desc": "Для операции «Заготовка для контактов» подготовь рабочее место в сборщике GregTech. В состав загрузки входят «золотой слиток», «Медная контактная лента», «Керамическая подложка HV».",
    "deps": null,
    "item": "kubejs:gold_conductor_blank",
    "count": 1
  },
  "hv_circuit_preform": {
    "title": "Заготовка модуля HV",
    "desc": "Для операции «Заготовка модуля HV» подготовь рабочее место в сборщике GregTech. В состав загрузки входят «Керамическая подложка HV», «Канталовая намотка», «Медная контактная лента».",
    "deps": null,
    "item": "kubejs:hv_circuit_preform",
    "count": 1
  },
  "hv_motor": {
    "title": "Электродвигатель HV",
    "desc": "Для операции «Электродвигатель HV» подготовь рабочее место в сборщике GregTech. В состав загрузки входят «Пакет обмоток HV», «Химстойкое уплотнение».",
    "deps": null,
    "item": "gtceu:hv_electric_motor",
    "count": 1
  },
  "hv_piston": {
    "title": "Силовой поршень HV",
    "desc": "Для операции «Силовой поршень HV» подготовь рабочее место в сборщике GregTech. В состав загрузки входят «Выверенная приводная ось», «Химстойкое уплотнение», «Точёный контакт HV».",
    "deps": null,
    "item": "gtceu:hv_electric_piston",
    "count": 1
  },
  "hv_conveyor": {
    "title": "Транспортёр HV",
    "desc": "Для операции «Транспортёр HV» подготовь рабочее место в сборщике GregTech. В состав загрузки входят «Выверенная приводная ось», «Химстойкое уплотнение».",
    "deps": null,
    "item": "gtceu:hv_conveyor_module",
    "count": 1
  },
  "hv_robot": {
    "title": "Сборочный манипулятор HV",
    "desc": "Для операции «Сборочный манипулятор HV» подготовь рабочее место в сборщике GregTech. В состав загрузки входят «Пакет обмоток HV», «Химстойкое уплотнение».",
    "deps": null,
    "item": "gtceu:hv_robot_arm",
    "count": 2
  },
  "hv_assembler": {
    "title": "Сборщик для серийной работы HV",
    "desc": "Для операции «Сборщик для серийной работы HV» подготовь рабочее место в сборщике GregTech. В состав загрузки входят «корпус HV», «Дугогасительная пластина HV».",
    "deps": null,
    "item": "gtceu:hv_assembler",
    "count": 1
  },
  "hv_foundry_accepted": {
    "title": "Приёмка металлургической смены",
    "desc": "Для операции «Приёмка металлургической смены» подготовь рабочее место в сборщике GregTech. В состав загрузки входят «Калиброванный образец сплава HV», «Принятый ящик огнеупоров», «Сигнальное реле».",
    "deps": null,
    "item": "kubejs:hv_commissioning_report",
    "count": 1
  },
  "hv_tool_drive": {
    "title": "Силовой блок электроинструмента",
    "desc": "Для операции «Силовой блок электроинструмента» подготовь рабочее место в сборщике GregTech. В состав загрузки входят «Химстойкое уплотнение», «Дугогасительная пластина HV».",
    "deps": null,
    "item": "gtceu:hv_power_unit",
    "count": 1
  },
  "hv_electric_drill": {
    "title": "Бур с новой передачей",
    "desc": "Для операции «Бур с новой передачей» подготовь рабочее место в сборщике GregTech. В состав загрузки входят «Жернов-бегунок», «Химстойкое уплотнение».",
    "deps": null,
    "item": "gtceu:hv_bronze_drill",
    "count": 1
  },
  "hv_mv_robot_donor": {
    "title": "Манипулятор для механической руки",
    "desc": "Для операции «Манипулятор для механической руки» подготовь рабочее место в сборщике GregTech. В состав загрузки входят «Химстойкое уплотнение», «Выверенная приводная ось».",
    "deps": null,
    "item": "gtceu:mv_robot_arm",
    "count": 1
  },
  "hv_shop_ie_coil_wire": {
    "title": "Мотки стального провода",
    "desc": "Собери комплект для операции «Мотки стального провода». Рецепт можно открыть прямо с предмета задания.",
    "deps": null,
    "item": "gtceu:steel_quadruple_wire",
    "count": 4
  },
  "hv_shop_item_pipe": {
    "title": "Электрумовая магистраль цеха",
    "desc": "Для операции «Электрумовая магистраль цеха» подготовь рабочее место в сборщике GregTech. В состав загрузки входят «Химстойкое уплотнение».",
    "deps": null,
    "item": "gtceu:electrum_normal_item_pipe",
    "count": 8
  },
  "hv_shop_turbine_gearbox": {
    "title": "Редукторы паровой турбины",
    "desc": "Для операции «Редукторы паровой турбины» подготовь рабочее место в сборщике GregTech. В состав загрузки входят «Венец шестерни», «стальная пластина», «Выверенная приводная ось».",
    "deps": null,
    "item": "gtceu:steel_gearbox",
    "count": 4
  },
  "end_optic": {
    "title": "Оптическая вставка",
    "desc": "Для операции «Оптическая вставка» подготовь рабочее место в сборщике GregTech. В состав загрузки входят «Керамическая подложка HV», «Заготовка золотого проводника», «Точёный контакт HV».",
    "deps": null,
    "item": "kubejs:ender_optical_insert",
    "count": 2
  },
  "end_filter_mesh": {
    "title": "Сетка газовой кассеты",
    "desc": "Для операции «Сетка газовой кассеты» подготовь рабочее место в химической ванне. В состав загрузки входят «Отработанная газовая кассета».",
    "deps": null,
    "item": "kubejs:end_filter_blank",
    "count": 4
  },
  "end_brick_supply": {
    "title": "Кладка из эндерняка",
    "desc": "Для операции «Кладка из эндерняка» подготовь рабочее место в сборщике GregTech. В состав загрузки входят «Концентрат эндерняка», «Глиняный раствор», «Спечённая вакуумная плитка».",
    "deps": null,
    "item": "minecraft:end_stone_bricks",
    "count": 4
  },
  "end_field_cache": {
    "title": "Сундук для второй площадки",
    "desc": "Для операции «Сундук для второй площадки» подготовь рабочее место в сборщике GregTech. В состав загрузки входят «Вакуумное уплотнение», «Спечённая вакуумная плитка», «Точёный контакт HV».",
    "deps": null,
    "item": "minecraft:ender_chest",
    "count": 1
  },
  "end_shell_storage": {
    "title": "Герметичный шалкеровый ящик",
    "desc": "Для операции «Герметичный шалкеровый ящик» подготовь рабочее место в сборщике GregTech. В состав загрузки входят «Спечённая вакуумная плитка», «Вакуумное уплотнение», «Диэлектрическая плёнка хоруса».",
    "deps": null,
    "item": "minecraft:shulker_box",
    "count": 1
  },
  "vacuum_panel_blank": {
    "title": "Заготовка чистовой панели",
    "desc": "Для операции «Заготовка чистовой панели» подготовь рабочее место в сборщике GregTech. В состав загрузки входят «Спечённая вакуумная плитка», «Вакуумное уплотнение», «Прессованная изоляция».",
    "deps": null,
    "item": "kubejs:clean_panel_blank",
    "count": 4
  },
  "iv_power_assembler": {
    "title": "Первый сборщик IV",
    "desc": "Для операции «Первый сборщик IV» подготовь рабочее место в сборщике GregTech. В состав загрузки входят «Регулятор сети IV», «Штампованная дугозащитная плита IV».",
    "deps": null,
    "item": "gtceu:iv_assembler",
    "count": 1
  },
  "luv_waveguide": {
    "title": "Калибровка волновода прессом GregTech",
    "desc": "Для операции «Калибровка волновода прессом GregTech» подготовь рабочее место в формовочном прессе. В состав загрузки входят «Заготовка волновода LuV».",
    "deps": null,
    "item": "kubejs:luv_polished_waveguide",
    "count": 4
  },
  "luv_hpca_vent_stock": {
    "title": "Сменная вентиляция HPCA",
    "desc": "Для операции «Сменная вентиляция HPCA» подготовь рабочее место в сборщике GregTech. В состав загрузки входят «Рубашка охлаждения IV», «Кузнечные мехи».",
    "deps": null,
    "item": "gtceu:computer_heat_vent",
    "count": 16
  },
  "zpm_coil_winding_stock": {
    "title": "Стальные катушки на обмотку домны",
    "desc": "Собери комплект для операции «Стальные катушки на обмотку домны». Рецепт можно открыть прямо с предмета задания.",
    "deps": null,
    "item": "gtceu:steel_quadruple_wire",
    "count": 32
  },
  "zpm_neutron_laminate": {
    "title": "Нейтронная облицовка",
    "desc": "Для операции «Нейтронная облицовка» подготовь рабочее место в формовочном прессе. В состав загрузки входят «Пакет слоёв нейтронозащиты ZPM».",
    "deps": null,
    "item": "kubejs:zpm_neutron_laminate",
    "count": 8
  },
  "zpm_laminate_stock": {
    "title": "Вторая партия нейтронозащиты",
    "desc": "Для операции «Вторая партия нейтронозащиты» подготовь рабочее место в формовочном прессе. В состав загрузки входят «Пакет слоёв нейтронозащиты ZPM».",
    "deps": null,
    "item": "kubejs:zpm_neutron_laminate",
    "count": 16
  },
  "zpm_feed_spare_arms": {
    "title": "Два манипулятора на линию",
    "desc": "Для операции «Два манипулятора на линию» подготовь рабочее место в сборщике GregTech. В состав загрузки входят «Модуль фазовой синхронизации ZPM», «Силовая шина ZPM», «Нейтронозащитный ламинат ZPM».",
    "deps": null,
    "item": "gtceu:zpm_robot_arm",
    "count": 2
  },
  "late_zpm_press_feed": {
    "title": "Заготовки для нейтронного пресса",
    "desc": "Для операции «Заготовки для нейтронного пресса» подготовь рабочее место в сборщике GregTech. В состав загрузки входят «Многослойный диэлектрик LuV», «Спечённая вакуумная плитка», «Вакуумное уплотнение».",
    "deps": null,
    "item": "kubejs:zpm_laminate_preform",
    "count": 16
  },
  "uv_structural_laminate": {
    "title": "Уплотнение на прессе GregTech",
    "desc": "Для операции «Уплотнение на прессе GregTech» подготовь рабочее место в сборщике GregTech. В состав загрузки входят «Пакет слоёв силовой обшивки UV», «Вакуумное уплотнение».",
    "deps": null,
    "item": "kubejs:uv_structural_laminate",
    "count": 8
  },
  "late_uv_press_queue": {
    "title": "Пакеты перед штамповкой ламината UV",
    "desc": "Для операции «Пакеты перед штамповкой ламината UV» подготовь рабочее место в сборщике GregTech. В состав загрузки входят «Нейтронозащитный ламинат ZPM», «Спечённая вакуумная плитка», «Многослойная бронепанель IV».",
    "deps": null,
    "item": "kubejs:uv_laminate_preform",
    "count": 16
  },
  "uv_assembler": {
    "title": "Первый сборщик UV",
    "desc": "Для операции «Первый сборщик UV» подготовь рабочее место в сборщике GregTech. В состав загрузки входят «Блок фазовой защиты UV», «Силовой ламинат UV».",
    "deps": null,
    "item": "gtceu:uv_assembler",
    "count": 1
  },
  "uv_factory_mixer": {
    "title": "Смеситель закалочного цеха",
    "desc": "Для операции «Смеситель закалочного цеха» подготовь рабочее место в сборщике GregTech. В состав загрузки входят «Блок фазовой защиты UV», «Силовой ламинат UV».",
    "deps": null,
    "item": "gtceu:uv_mixer",
    "count": 1
  },
  "uv_field_cassette": {
    "title": "Кассеты обмоток Mk III",
    "desc": "Для операции «Кассеты обмоток Mk III» подготовь рабочее место в сборщике GregTech. В состав загрузки входят «Силовой ламинат UV», «Силовой шунт UV».",
    "deps": null,
    "item": "kubejs:uv_field_cassette",
    "count": 8
  },
  "final_laminate_stock": {
    "title": "Запас силового ламината",
    "desc": "Для операции «Запас силового ламината» подготовь рабочее место в сборщике GregTech. В состав загрузки входят «Пакет слоёв силовой обшивки UV», «Вакуумное уплотнение».",
    "deps": null,
    "item": "kubejs:uv_structural_laminate",
    "count": 32
  },
  "post_uv_logistics_clock": {
    "title": "Эталон времени грузовой сети",
    "desc": "Для операции «Эталон времени грузовой сети» подготовь рабочее место в сборщике GregTech. В состав загрузки входят «Допуск к эксплуатации», «Грузовая накладная комплекса UV», «Межпространственная грузовая накладная».",
    "deps": null,
    "item": "kubejs:post_uv_logistics_clock",
    "count": 4
  },
  "reclaim_press_form": {
    "title": "Форма для рам мембран",
    "desc": "Для операции «Форма для рам мембран» понадобятся «стальная пластина», «Кованая стальная заготовка», «Футерованная втулка». Подготовь комплект по рецепту.",
    "deps": null,
    "item": "gtceu:plate_casting_mold",
    "count": 1
  },
  "reclaim_membrane_frame": {
    "title": "Рама фильтрующей мембраны",
    "desc": "Для операции «Рама фильтрующей мембраны» подготовь рабочее место в формовочном прессе. В состав загрузки входят «Усиленная монтажная панель».",
    "deps": null,
    "item": "kubejs:reclaim_membrane_frame",
    "count": 8
  },
  "forest_farm_stock": {
    "title": "Древесина для лесопилки",
    "desc": "Для операции «Древесина для лесопилки» подготовь рабочее место в центрифуге. Назначь вход и освободи выход для следующей партии.",
    "deps": null,
    "item": "minecraft:oak_log",
    "count": 64
  }
}
const additions = {
  "workshop": [
    [
      "field_score",
      "Надрез на кремне",
      "kubejs:scored_flint_core",
      1,
      [
        "flint",
        "gravel"
      ],
      "Надсеки гравием два кремня. С такого ядрища можно снять острый скол.",
      false
    ],
    [
      "field_bundle",
      "Связка на вымочку",
      "kubejs:retting_bundle",
      1,
      [
        "fibre"
      ],
      "Свяжи два стебля в пучок. Такими связками удобнее работать у воды.",
      false
    ],
    [
      "field_retted",
      "Вымоченные стебли",
      "kubejs:retted_bundle",
      1,
      [
        "field_bundle"
      ],
      "Возьми связку в руку и нажми по воде. С зажатым Shift можно вымочить до четырёх связок.",
      false
    ],
    [
      "field_lap",
      "Кромка под песком",
      "kubejs:lapped_edge",
      1,
      [
        "shard",
        "washed"
      ],
      "Притри кремнёвый скол песком и промытым волокном. Теперь он годится на лезвие.",
      false
    ],
    [
      "field_haft",
      "Зарубка под обвязку",
      "kubejs:haft_blank",
      1,
      [
        "knife",
        "sticks"
      ],
      "Ножом заруби две палки. Эту заготовку можно пустить на рукоять или столярный шип.",
      false
    ],
    [
      "field_tenon",
      "Расклиненный шип",
      "kubejs:wedged_tenon",
      1,
      [
        "field_haft",
        "slat",
        "peg",
        "cord"
      ],
      "Подгони рейку, нагель и заготовку рукояти. Стяни соединение шнуром для верстака.",
      false
    ]
  ],
  "kiln": [
    [
      "field_slip",
      "Отмучивание глины",
      "kubejs:clay_slip_cake",
      2,
      [
        "clay"
      ],
      "Промой глиняные комки в воде. Несколько лепёшек отложи сырыми для замеса.",
      false
    ],
    [
      "field_biscuit",
      "Черепок для шамота",
      "kubejs:kiln_biscuit",
      1,
      [
        "field_slip",
        "campfire"
      ],
      "Обожги на костре одну глиняную лепёшку. Её можно раздробить в наполнитель.",
      false
    ],
    [
      "field_chamotte",
      "Зерно шамота",
      "kubejs:chamotte",
      2,
      [
        "field_biscuit",
        "hammer"
      ],
      "Молот даёт две порции шамота с черепка. Кремнёвая ступка даёт четыре.",
      false
    ],
    [
      "field_mix",
      "Набивка огнеупора",
      "kubejs:ramming_mix",
      3,
      [
        "field_chamotte",
        "temper",
        "field_slip"
      ],
      "Замеси шамот, отощитель и две глиняные лепёшки. Из трёх порций массы можно формовать детали.",
      false
    ],
    [
      "field_green_tuyere",
      "Канал для дутья",
      "kubejs:green_tuyere",
      1,
      [
        "field_mix",
        "peg"
      ],
      "Обложи деревянный нагель набивной массой. Он задаст канал фурмы.",
      false
    ],
    [
      "field_tuyere",
      "Обжиг фурмы",
      "kubejs:fired_tuyere",
      1,
      [
        "field_green_tuyere",
        "kiln"
      ],
      "Обожги сырую фурму в печи. Для контроллера и перехода шахты понадобятся две.",
      false
    ],
    [
      "field_green_mould",
      "Отпечаток под слиток",
      "kubejs:green_ingot_mould",
      1,
      [
        "field_mix",
        "field_biscuit"
      ],
      "Обожжённый черепок удержит стенки сырой изложницы. Обложи его четырьмя порциями набивной массы.",
      false
    ],
    [
      "field_mould",
      "Две изложницы",
      "kubejs:ingot_mould",
      2,
      [
        "field_green_mould",
        "kiln"
      ],
      "Обожги две формы. Одну заберёт рецепт литейной чаши, вторую поставишь в горн.",
      false
    ],
    [
      "field_bellows",
      "Мехи у топки",
      "kubejs:hearth_bellows",
      1,
      [
        "joint",
        "binding",
        "slat",
        "cord"
      ],
      "Собери мехи из реек, нагелей, обвязки и волокна. Фурма соединит их с топкой.",
      false
    ],
    [
      "field_masonry",
      "Огнеупорная кладка горна",
      "kubejs:bloomery_masonry",
      11,
      [
        "lining",
        "kiln"
      ],
      "Обожги блоки глины в терракоту. Две терракоты и футеровка дают шесть блоков кладки. Ещё часть уйдёт на фасонные детали.",
      false
    ],
    [
      "field_shoulder",
      "Переход на узкую шахту",
      "kubejs:bloomery_shoulder",
      1,
      [
        "field_masonry",
        "field_tuyere"
      ],
      "Соедини два блока кладки с обожжённой фурмой. Переход ставится над пустым центром камеры.",
      false
    ],
    [
      "field_crown",
      "Верхний венец",
      "kubejs:bloomery_stack",
      1,
      [
        "field_masonry",
        "field_chamotte",
        "field_biscuit"
      ],
      "Собери венец из кладки, черепка и шамота. Он завершает шахту на пятом слое.",
      false
    ],
    [
      "field_basin",
      "Чаша у выпускного носка",
      "kubejs:bloomery_casting_basin",
      1,
      [
        "field_masonry",
        "field_mould"
      ],
      "Закрепи одну обожжённую изложницу на основании. Установи чашу перед топочным окном.",
      false
    ],
    [
      "field_bloomery",
      "Сборка шахтного горна",
      "gtceu:field_bloomery",
      1,
      [
        "field_shoulder",
        "field_crown",
        "field_basin",
        "field_bellows",
        "kiln",
        "grate"
      ],
      "Собери горн 3×4 высотой в пять блоков. Контроллер смотрит на чашу. Удерживай W на контроллере для послойного показа.",
      false
    ]
  ],
  "kinetics": [
    [
      "field_trough",
      "Промывочный жёлоб у воды",
      "kubejs:ore_washing_trough",
      1,
      [
        "segment",
        "joint",
        "cord"
      ],
      "Поставь жёлоб боком к источнику воды. ПКМ промывает одну крупку, Shift + ПКМ до восьми. Хвосты пригодятся в огнеупорах.",
      false
    ],
    [
      "field_spindle",
      "Шпиндель на двух втулках",
      "kubejs:turned_spindle",
      1,
      [
        "bushing",
        "field_tenon",
        "handle"
      ],
      "Подгони рукоять и расклиненный шип. Две втулки будут опорами вала.",
      false
    ],
    [
      "field_runner",
      "Камень для бегуна",
      "kubejs:grinding_runner",
      1,
      [
        "field_spindle",
        "bushing",
        "kiln"
      ],
      "Собери жернов на шпинделе. Он станет рабочей деталью паровой дробилки.",
      false
    ],
    [
      "field_saddle",
      "Подкладка для ручной ковки",
      "kubejs:forging_saddle",
      1,
      [
        "hand_plate",
        "strap",
        "lining",
        "hammer"
      ],
      "Собери упор из камня, полос, футеровки и кованой заготовки. Подкладка остаётся в сетке при ручной ковке пластин.",
      false
    ],
    [
      "field_pump",
      "Цилиндр ручного насоса",
      "kubejs:hand_pump_barrel",
      1,
      [
        "field_spindle",
        "copper_plate",
        "bushing"
      ],
      "Стяни медные пластины вокруг шпинделя и втулок. Цилиндр понадобится для насосных узлов.",
      true
    ],
    [
      "field_roast",
      "Прокалка бронзовой шихты",
      "kubejs:roasted_alloy_feed",
      1,
      [
        "bronze_charge",
        "field_bloomery",
        "charcoal"
      ],
      "Подай шихту и один древесный уголь в горн. Прокалка занимает десять секунд.",
      false
    ],
    [
      "field_paired",
      "Вторая полость изложницы",
      "kubejs:bronze_mould_frame",
      1,
      [
        "bronze_plate",
        "strap",
        "rivets",
        "field_mould"
      ],
      "Усиль обожжённую форму бронзовыми пластинами. Три угля и прокалённая шихта теперь дают два слитка.",
      true
    ]
  ],
  "steam": [
    [
      "field_register",
      "Пять труб на стяжках",
      "kubejs:five_tube_register",
      1,
      [
        "bronze_pipe",
        "strap",
        "rivets"
      ],
      "Подготовь пять малых бронзовых труб. Стяни их медными полосами и заклёпками.",
      false
    ],
    [
      "field_bank",
      "Пакет котельных труб",
      "kubejs:boiler_tube_bank",
      2,
      [
        "field_register",
        "seal",
        "blank"
      ],
      "На один пакет идут два пятитрубных регистра. Подготовь два пакета на котёл, всего двадцать малых труб.",
      false
    ]
  ]
}
export function applyFieldworkQuests(chapters) {
  function anchor(key) {
    while (Object.hasOwn(removed,key)) key=removed[key]
    return key
  }
  for(const chapter of chapters) {
    if(chapter.key==='kinetics') {chapter.title='Горн и ручная ковка';chapter.icon='gtceu:field_bloomery'}
    chapter.rows=chapter.rows.filter(row=>!Object.hasOwn(removed,row[0]))
    chapter.rows.push(...(additions[chapter.key]||[]))
    for(const row of chapter.rows) {
      const update=revisions[row[0]]
      if(update) {
        row[1]=update.title
        if(update.item)row[2]=update.item
        if(update.count)row[3]=update.count
        if(update.deps)row[4]=update.deps
        row[5]=update.desc
      }
      row[4]=[...new Set(row[4].map(anchor))].filter(id=>id!==row[0])
    }
  }
  const steam = chapters.find(chapter => chapter.key === 'steam')
  steam.title = 'Паровой век'
  steam.rows.push(
    ['test_packing', 'Набивка для сальника', 'kubejs:braided_valve_packing', 1,
      ['cord', 'washed'], 'Сплети кольцо из шнура и трёх порций промытого волокна. Кольцо уплотняет шток клапана под крышкой корпуса.'],
    ['test_spindle_blank', 'Припуск на золотник', 'kubejs:valve_spindle_blank', 1,
      ['bronze', 'strap'], 'Собери заготовку из двух слитков бронзы и медной полосы. Пока молот работает от руки, одной заготовки хватает на один золотник.'],
    ['test_spindle', 'Притирка золотника', 'kubejs:bronze_valve_spindle', 1,
      ['test_spindle_blank', 'field_saddle'], 'Положи заготовку на ковочную подкладку с песком и пройди молотом. Подкладку можно использовать снова.'],
    ['test_valve_body', 'Клапан в сборе', 'kubejs:unseated_steam_valve', 1,
      ['test_spindle', 'bronze_pipe', 'bushing'], 'Поставь золотник между двумя малыми трубами. Втулка направляет шток, пластины и заклёпка стягивают корпус.'],
    ['test_valve', 'Уплотнение парового клапана', 'kubejs:packed_steam_valve', 1,
      ['test_valve_body', 'test_packing', 'hammer'], 'Уложи плетёное кольцо в корпус клапана и осади крышку молотом. Собери один клапан для котла, затем по одному для каждого парового станка.'],
    ['steam_spindle_pair', 'Два золотника за ход молота', 'kubejs:bronze_valve_spindle', 2,
      ['steam_hammer', 'test_spindle_blank'], 'Подай заготовку в паровой молот. За один ход он даст пару золотников. Заготовки на расширение мастерской расходуются вдвое экономнее.', true],
    ['steam_packing_series', 'Набивка на четыре клапана', 'kubejs:braided_valve_packing', 4,
      ['steam_compressor', 'test_packing'], 'Положи две инструментальные обвязки в компрессор. Одной партии хватит на четыре клапана.', true],
    ['steam_crushed_feed', 'Дроблёная медь для печи', 'gtceu:crushed_copper_ore', 2,
      ['steam_mill'], 'Переработай сырую медь в паровой дробилке. Собери два куска дроблёной руды и подай их в паровую печь.']
  )
  for (const row of steam.rows) {
    if (row[0] === 'boiler') {
      row[4] = ['firebox', 'field_bank', 'test_valve']
      row[5] = 'Собери топку, корпус, два трубных пакета и клапан с набивкой с четырьмя бронзовыми пластинами. Заполни холодный котёл водой и только потом дай топливо.'
    }
    if (['steam_mill', 'steam_hammer', 'steam_compressor', 'steam_extractor', 'steam_furnace', 'steam_alloy_smelter'].includes(row[0])) {
      row[4].push('test_valve')
    }
    if (row[0] === 'steam_ore_batch') row[4].push('steam_crushed_feed')
    if (row[0] === 'blank_reserve') row[4] = ['blank', 'steam_hammer', 'bronze_casing']
    if (row[0] === 'early_steam_tin_lines') row[4] = ['tin_ingot', 'steam_hammer']
  }
  const turbine = chapters.find(chapter => chapter.key === 'lv').rows.find(row => row[0] === 'turbine')
  turbine[4].push('test_valve')
  turbine[5] = 'Установи выверенный ротор и клапан с набивкой на корпус LV. Передняя грань турбины выдаёт электричество. Подведи к ней кабель или поставь рядом сборщик.'
}
