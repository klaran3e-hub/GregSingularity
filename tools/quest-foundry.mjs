// The keys also identify existing quest progress in player saves.
export function connectFoundryQuests(chapters) {
  const steam = chapters.find(chapter => chapter.key === 'steam')
  const byKey = new Map(chapters.flatMap(chapter => chapter.rows.map(row => [row[0], row])))
  const patch = (key, changes) => {
    const row = byKey.get(key)
    if (!row) throw new Error('Unknown foundry quest ' + key)
    const {title, item, count, deps, description} = changes
    if (title) row[1] = title
    if (item) row[2] = item
    if (count) row[3] = count
    if (deps) row[4] = deps
    if (description) row[5] = description
  }
  const metallurgy = new Set([
    'resin', 'insulating_gum', 'lv_charcoal_powder', 'fireclay_charge', 'coke_brick_blank', 'coke_bricks',
    'foundry_coal', 'coking_charge', 'lv_gt_coke_controller', 'lv_creosote', 'first_coke', 'coke_buffer',
    'calcite', 'lime_flux', 'refractory_brick_blank', 'blast_bricks', 'steel_charge', 'first_steel',
    'foundry_slag', 'steel_press_blank', 'steel_plate', 'pressed_steel_frame'
  ])
  for (const chapter of chapters) {
    if (chapter === steam) continue
    const moved = chapter.rows.filter(row => metallurgy.has(row[0]))
    steam.rows.push(...moved)
    chapter.rows = chapter.rows.filter(row => !metallurgy.has(row[0]))
  }
  steam.rows.push(['steam_pbf_controller', 'Домна на коксе', 'gtceu:primitive_blast_furnace', 1,
    ['blast_bricks', 'steam_furnace', 'field_tuyere', 'seal', 'crucible'],
    'Собери контроллер из паровой печи, огнеупорной кладки, двух фурм, тигля и котельного стыка. Поставь его на втором слое спереди. За ним оставь топочную шахту.'])
  patch('fireclay_charge', {deps:['lining','tailings','temper','steam_hammer']})
  patch('coke_brick_blank', {deps:['fireclay_charge','steam_hammer'], description:'Положи шамотную массу в паровой молот. За один ход получишь два кирпича-сырца.'})
  patch('coke_bricks', {count:25, deps:['coke_brick_blank','kiln'], description:'Обожги сырец, затем сложи по четыре кирпича в блок кладки. На стенки первой печи отложи 25 блоков. Ещё четыре понадобятся в рецепте контроллера.'})
  patch('lv_gt_coke_controller', {title:'Камера коксования', deps:['coke_bricks','steam_furnace','crucible','bronze_plate'],
    description:'Сложи полую печь 3×3×3 из 25 блоков кладки и контроллера. Контроллер ставится в центре передней стенки. Камеру в центре оставь пустой.'})
  patch('coking_charge', {deps:['foundry_coal','lv_charcoal_powder','insulating_gum','hammer'],
    description:'На верстаке уплотни молотом три куска угля, две порции древесноугольной пыли и изоляционную массу.'})
  patch('first_coke', {deps:['coking_charge','lv_gt_coke_controller'],description:'Загрузи шихту в коксовую печь. Через две минуты выгрузи два куска кокса и 750 мБ креозота. Для четырёх кусков проведи два цикла.'})
  patch('lv_creosote',{deps:['first_coke','bronze_pipe'],description:'Накопи креозот за два цикла, забери ведро. Под постоянный отвод жидкости выдели люк коксовой печи и резервуар.'})
  patch('calcite',{deps:['steam_mill']})
  patch('lime_flux',{deps:['calcite','steam_mill','first_coke'],description:'Раздроби блок кальцита в пыль GregTech. Повторный проход пыли даёт две порции флюса, а отдельная загрузка сырого кальцита одну.'})
  patch('blast_bricks',{title:'Кладка шахты домны',count:32,deps:['refractory_brick_blank','kiln'],
    description:'Обожги огнеупорные кирпичи и собирай их по четыре. На стенки домны 3×3 высотой в четыре блока нужны 32 блока кладки. Ещё четыре отложи на контроллер.'})
  patch('steel_charge',{deps:['bloom','iron','lime_flux','first_coke','crucible','lv_charcoal_powder']})
  patch('first_steel',{deps:['steel_charge','steam_pbf_controller'],description:'На одну стальную шихту положи в домну два куска кокса. Через 110 секунд забери слиток стали и тёмную золу.'})
  patch('foundry_slag',{title:'Тёмная зола из топки',description:'Доменная плавка оставляет тёмную золу во втором выходном слоте. Сохрани её для футеровочных вставок электрической печи.'})
  patch('steel_plate',{title:'Прокат первой стали',deps:['steel_press_blank','steam_hammer'],
    description:'Пропусти кованую стальную заготовку через паровой молот. Из одной выходят две пластины. Первая пара пойдёт в турбину LV.'})
  patch('pressed_steel_frame',{title:'Штамповка стальной рамы',deps:['steel_press_blank','steam_compressor'],
    description:'Положи кованую стальную заготовку в паровой компрессор. Полученную раму используй для промышленной оснастки и жердей GregCrops.'})
  patch('turbine',{deps:[...new Set([...byKey.get('turbine')[4],'steel_plate'])],
    description:'Две стальные пластины крепят ротор и паровой клапан к корпусу LV. Подай пар со стороны входа, электрический выход соедини кабелем со сборщиком.'})
  patch('ie_iron',{title:'Железная шестерня для привода',description:'Подготовь шестерню из железа GregTech для привода станка. Доступные способы изготовления показаны в JEI.'})
  patch('ie_hammer',{title:'Железный молот для ремонтного поста',item:'gtceu:iron_hammer',description:'Собери железный молот GregTech. Оставь его на ремонтном верстаке для следующей серии заготовок.'})
  patch('ie_steel',{title:'Штампованные рамы для сборки',deps:['pressed_steel_frame','ie_iron'],description:'Заготовь стальные рамы в паровом компрессоре. Они нужны сборщику для новых корпусов.'})
  patch('ie_scaffolding',{title:'Стальная рама станка',description:'Изготовь раму GregTech из стальных прутков. Отложи её для силовой части цеха.'})
  patch('ie_conveyor',{title:'Запас тканых приводных ремней',description:'Собери тканый приводной ремень по рецепту мастерской. Следующую партию держи у конвейерного поста.'})
  patch('ie_redstone_control',{title:'Сменная схема управления',description:'Приготовь запасную базовую электронную схему для подключения следующего станка.'})
  patch('ie_press_body',{title:'Формовочный пресс LV',item:'gtceu:lv_forming_press',deps:['ie_steel','lv_hull','ie_redstone_control','ie_press_mold'],
    description:'Установи формовочный пресс GregTech и подведи EU. Положи пластинчатую матрицу рядом с входом заготовок.'})
  patch('ie_press_mold',{title:'Матрица для формовочного пресса',description:'Собери форму из стальных пластин, втулок и кованой заготовки. В серийных рецептах пресса она остаётся в станке.'})
  patch('pressed_iron',{deps:[...new Set([...byKey.get('pressed_iron')[4],'ie_press_body'])],description:'Соедини заготовку с пластинчатой матрицей в формовочном прессе LV. Через 12 секунд получишь два слитка прессованного железа.'})
  patch('lv_treated_wood',{description:'Подай четыре доски, столярное соединение и 750 мБ креозота в смеситель GregTech. Забери четыре пропитанные доски.'})
  patch('lv_ie_pipe',{title:'Стальная труба для креозота',description:'Собери малую стальную трубу GregTech. Проложи отдельную линию от люка коксовой печи до ёмкости.'})
  patch('lv_ie_reinforced',{title:'Жаростойкий кожух электрической домны',description:'Соедини стальные пластины, рамы, стыки и футеровку. Кожухи пойдут на стенки электрической домны.'})
  patch('lv_ie_heater',{title:'Лента сопротивления из сплава',description:'В плавильне сплавов LV переработай шихту нагревателя в четыре полосы. Отложи их на намотку катушки.'})
  patch('lv_ie_preheater',{title:'Медно-никелевая обмотка домны',description:'Закрепи нагревательные ленты, вставки и изоляцию на стальной раме. Готовые блоки образуют кольцо вокруг шахты.'})
  patch('lv_gt_coke_bricks',{title:'Кладка для расширения коксового цеха',description:'Заготовь ещё одну партию кладки из обожжённых коксовых кирпичей. Часть зарезервируй для люка.'})
  patch('lv_gt_coke_port',{description:'Поставь люк вместо одного из блоков кладки. Соедини отвод с отдельной ёмкостью для креозота.'})
  patch('aluminium_plate',{description:'Подай охлаждённый алюминиевый слиток в гибочный станок LV. Через 12 секунд забери готовую пластину.'})
  patch('me_refinery_catalyst',{title:'Автокрафт дизеля в химическом реакторе',deps:['me_recipe_return','process_commissioning','mv_chemical_reactor'],
    description:'Оставь носитель катализатора в реакторе MV. Запиши жидкостный шаблон на 1000 мБ обработанной лёгкой фракции и 500 мБ газа. Верни в ME 1200 мБ дизеля.'})
  patch('mv_ie_refinery',{title:'Отдельный реактор под дизель',item:'gtceu:mv_chemical_reactor',deps:['mv_chemical_reactor','refinery_outputs'],
    description:'Выдели реактор MV для смешивания лёгкой фракции с газом. Подключи независимые подводы жидкостей и выдели место для многоразового носителя.'})
  patch('mv_ie_fluid_pump',{title:'Подающий насос буровой',description:'Поставь электронасос LV на жидкостную линию GregTech. Направь сырую нефть в приёмный бак.'})
  patch('mv_ie_electrum_wire',{title:'Электрум через волочильный стан',description:'Загрузи электрум в волочильный станок. Полученную проволоку отложи для четырёхжильных кабелей.'})
  const cables = [
    ['rail_profile','Прокат рельсового профиля','Положи заготовку профиля в гибочный станок MV. За 12 секунд выйдут два рельсовых профиля.'],
    ['early_railway_rail_steel','Профили на длинный участок пути','Прокатай двадцать четыре профиля на гибочном станке MV. Отложи их для сборки пути вместе с крепежом.'],
    ['early_industrial_supply_fe_converter','Два выхода питания FE','Подай EU на преобразователи. Одну выходную линию FE выдели под пневматическое оборудование, вторую оставь для следующего потребителя.'],
    ['hv_ceramic_substrate','Формовка керамической подложки','Отштампуй обожжённый вкладыш в формовочном прессе MV с матрицей пластины. На одну подложку уйдёт 250 тиков при 96 EU/t.'],
    ['distribution_cargo_skeleton','Рама транспортной ячейки','Согни четыре силовые панели в гибочном станке UV. За 30 секунд он выдаст четыре транспортные рамы. Плоские рамы мембран штампуются отдельно в формовочном прессе.'],
    ['mv_ie_connector','Медный кабель на выход MV','Соедини медным кабелем выход MV с первой машиной того же напряжения.'],
    ['mv_ie_wire','Четыре жилы из электрума','Собери четырёхжильный провод из электрума. Следующая партия уйдёт под изоляцию.'],
    ['mv_ie_insulated_wire','Изоляция четырёх электрумовых жил','Закрой четырёхжильный провод изоляцией и отложи готовый кабель для сборщика.'],
    ['mv_ie_relay','Медная линия для нескольких потребителей','Отведи четырёхжильный медный кабель от распределительной точки MV к станкам.'],
    ['mv_ie_capacitor','Буфер четырёх батарей MV','Подключи буфер к сети MV и установи совместимые батареи. Проверь направление выдачи EU.'],
    ['mv_ie_transformer','Понижение MV до LV','Установи трансформатор MV. Вход и выход подключи кабелями соответствующего напряжения.'],
    ['hv_shop_ie_connector','Золотой кабель к станку HV','Изолируй золотой провод и проложи линию от распределительного устройства HV.'],
    ['hv_shop_ie_relay','Четырёхжильная линия на участке HV','Соедини машины с общей распределительной точкой четырёхжильным золотым кабелем.'],
    ['hv_shop_ie_winding','Высоковольтная катушка для сборщика','Подготовь катушку напряжения HV. Она понадобится при сборке следующей партии силовых модулей.'],
    ['hv_shop_ie_capacitor','Батарейный буфер участка HV','Установи буфер на четыре батареи. Подключи его к сети HV со стороны входа и проверь сторону выдачи.'],
    ['hv_shop_ie_transformer','Понижающий трансформатор HV','Прими высокое напряжение со стороны входа. Противоположную сторону выведи на сеть MV.'],
    ['hv_ie_field_coil','Катушки напряжения для приёмки','Подготовь катушки напряжения MV для силовых пакетов и приёмки цеха.'],
    ['ev_room_fe_reserve','Аккумуляторный запас чистой зоны','Установи батарейный буфер HV. Проверь питание обслуживающей линии при отключённом основном вводе.'],
    ['final_press_tools','Форма для штамповки переборок','Поставь форму пластины в формовочный пресс достаточного напряжения. На время серии освободи выход для силовых панелей.'],
    ['final_heavy_backplane','Штампованная силовая панель','Загрузи четыре ламината UV и форму в пресс. На выдаче появится одна панель за 25 секунд при 122880 EU/t.'],
    ['iv_arc_plate','Штамповка дугозащитной плиты','Подай бронепанель в формовочный пресс вместе с матрицей пластин. На две плиты нужен цикл 18 секунд при 1920 EU/t.'],
    ['hv_shop_converter','Преобразование EU для механизмов FE','Направь HV на вход преобразователя. Вывод FE подведи к пневматическому оборудованию с электрическим приводом.'],
    ['early_industrial_supply_slag_bin','Тёмная зола после серии плавок','Отложи двенадцать порций тёмной золы для футеровки. Под второй выход домны поставь отдельный сундук.'],
    ['early_industrial_supply_press_tools','Две сменные матрицы пресса','Одну матрицу установи в формовочный пресс, вторую оставь в инструментальном сундуке.'],
    ['early_industrial_supply_coke_hearth','Кладка для второй камеры коксования','На две печи потребуется пятьдесят блоков внешней кладки. Контроллеры подготовь отдельно.']
  ]
  for (const [key, title, description] of cables) patch(key,{title, description})
  patch('early_industrial_supply_coke_hearth',{count:50})
}
