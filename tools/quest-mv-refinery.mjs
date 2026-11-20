export function connectMvRefinery(chapters) {
  const book = new Map(chapters.map(section => [section.key, section]))
  const rows = new Map(chapters.flatMap(section => section.rows.map(row => [row[0], row])))
  const k = name => 'kubejs:' + name
  const g = name => 'gtceu:' + name
  const ae = name => 'ae2:' + name
  function revise(key, deps, text) {
    const row = rows.get(key)
    if (!row) throw Error('Missing MV quest ' + key)
    row[4] = deps
    row[5] = text
  }
  function addTasks(section, tasks) {
    book.get(section).rows.push(...tasks)
  }
  function sample(key, title, icon, fluid, amount, deps, text) {
    return [key,title,icon,1,deps,text,true,undefined,{fluid,amount}]
  }
  addTasks('oilfield', [
    ['mv_oil_forming_press','Первый пресс для нефтяного цеха',g('mv_forming_press'),1,
      ['nether_mv_piston','ie_press_body','mv_assembler'],
      'Собери формовочный пресс MV из пресса LV, поршня, зубчатой матрицы и двух манипуляторов LV. Сборщик расходует 650 мБ воды. В установленном прессе замени оснастку на матрицу пластины для тарелок колонны.'],
    ['mv_coalescer','Патрон для отделения воды',k('mv_coalescer'),1,
      ['oil_wash_cartridge','drum_liner','mv_assembler','lv_shop_extractor','mv_chemical_reactor'],
      'Помести две сетки во вкладыш барабана. Добавь футеровочную вставку, медные контактные полосы и уплотнение. Сборщик запаяет патрон со 144 мБ олова.'],
    sample('mv_desalted_sample','Отбор после обессоливания',k('oil_wash_cartridge'),k('desalted_crude'),100,
      ['oil_drilling_rig','water_distillery','mv_chemical_reactor','oil_wash_cartridge'],
      'В реактор MV подай 1000 мБ сырой нефти, 250 мБ дистиллята и промывочный картридж. Выходы под нефть и рассол раздели. Для пробы передай 100 мБ обессоленной нефти в экран задач.'),
    ['mv_spent_coalescer','Первая осушка под давлением',k('mv_saturated_coalescer'),1,
      ['mv_coalescer','thermopneumatic_plants','oil_drilling_rig','water_distillery'],
      'Подай в термопневматическую установку патрон и 800 мБ обессоленной нефти. При 3,25 бар и 398 К она выдаст насыщенный патрон и 750 мБ промытой нефти. Перекачай жидкость в бак колонны.'],
    ['mv_filter_rotation','Два патрона в обороте',k('mv_coalescer'),2,
      ['mv_spent_coalescer','mv_chemical_bath'],
      'Собери второй патрон, пока первый моется в химической ванне MV. Ванна расходует 200 мБ дистиллята и выдаёт чистый патрон и 150 мБ рассола. Один патрон можно мыть, пока другой осушает нефть.',true]
  ])
  addTasks('petrochem', [
    sample('mv_conditioned_cut','Проба после гидроочистки',k('cracking_catalyst'),g('lightly_hydro_cracked_light_fuel'),100,
      ['light_fraction_sample','mv_electrolyzer','cracking_catalyst'],
      'На 500 мБ лёгкого топлива подай 100 мБ водорода и катализатор. Отведи серу с предметного выхода реактора. Для анализа передай в экран задач 100 мБ очищенного топлива.'),
    sample('mv_dielectric_sample','Проба электроизоляционного масла',k('paraffin_cake'),k('mv_dielectric_oil'),125,
      ['paraffin_cake','light_fraction_sample','mv_electrolyzer','cracking_catalyst'],
      'Соедини один парафиновый осадок, 200 мБ смазки и 400 мБ гидроочищенного лёгкого топлива в реакторе MV. Один цикл даёт 500 мБ масла. На контроль сдай 125 мБ через экран задач.'),
    ['mv_impregnation','Пропитка электрической изоляции',k('mv_impregnated_insulation'),1,
      ['paraffin_cake','light_fraction_sample','mv_electrolyzer','cracking_catalyst','thermopneumatic_plants','pressed_insulation'],
      'Подай в установку 250 мБ электроизоляционного масла и полосу прессованной изоляции. При 333 К и 4 бар забери пакет. Он нужен для первого корпуса ME и для изоляции оборудования HV.'],
    ['mv_hv_insulation_stock','Изоляция для одного корпуса HV',k('mv_impregnated_insulation'),3,
      ['mv_impregnation','chemical_grade_seal'],
      'Отложи три пакета. Один расходуется на наружную оболочку HV, ещё два на сборку корпуса. Оставь в отдельном баке 650 мБ электроизоляционного масла.',true]
  ])
  addTasks('me_automation', [
    ['me_mv_automation_parts','Первый комплект подачи в станок',ae('pattern_provider'),1,
      ['me_provider','me_encode','me_cpu_storage','me_fluid_cell','me_import'],
      'Установи поставщик вплотную к термопневматической установке. В приводе должны стоять предметная и жидкостная ячейки. Подключи шину импорта к доступной стороне выдачи.'],
    ['me_mv_oil_order','Два пакета по заказу ME',k('mv_impregnated_insulation'),2,
      ['me_mv_automation_parts','mv_impregnation'],
      'В терминале кодирования выбери шаблон обработки. Укажи одну полосу и 250 мБ масла на пакет. Закажи два пакета. Проверь списание 500 мБ и возврат обоих предметов в ME.'],
    sample('me_mv_fluid_return','Отбор с жидкостной ячейки',k('mv_coalescer'),k('washed_crude'),150,
      ['me_mv_automation_parts','mv_spent_coalescer'],
      'Закодируй осушку с обоими выходами. При заказе 750 мБ промытой нефти в ME должны вернуться жидкость и насыщенный патрон. Из этой партии сдай 150 мБ в экран задач.'),
    ['me_mv_multioutput','Разводка четырёх фракций',ae('import_bus'),4,
      ['me_mv_automation_parts','refinery_outputs','refinery_gas_sample'],
      'На каждый выход колонны поставь шину импорта. На 100 мБ промытой нефти запиши в шаблон 25 мБ тяжёлого топлива первым выходом, затем 25 мБ лёгкого, 30 мБ нафты и 20 мБ газа. Закажи тяжёлое топливо и проверь все четыре остатка в терминале.',true]
  ])

  revise('nether_mv_piston',['mv_assembler','mv_motor','iron_pressure_slug','lv_creosote'],
    'В сборщик MV подай корпус, привод, железную заготовку, схемы, кабель и уплотнения. Для первого поршня нужны 400 мБ креозота из коксовой печи. Он откроет формовочный пресс до первой нефти.')
  revise('refinery_tray',['mv_oil_forming_press','drum_liner','ie_press_mold'],
    'В формовочный пресс MV положи вкладыш барабана и матрицу пластины. За 12 секунд получишь две тарелки. Матрица остаётся в станке.')
  revise('early_mv_mv_reactors',['mv_chemical_reactor','paraffin_cake','mv_impregnation'],
    'После первой пропитки выдели второй химреактор. Оставь тяжёлую фракцию на линии смазки, а водород и лёгкое топливо отправь на отдельную гидроочистку.')
  revise('washed_oil_sample',['mv_spent_coalescer','sample_ampoules','mv_sample_spout'],
    'Наполни пробную ампулу 100 мБ промытой нефти после осушки. На вход перегонной колонны подавай нефть из этого же бака.')
  revise('me_shell',['mv_impregnation','mv_assembler','chemical_grade_seal','first_polyethylene'],
    'В сборщике MV соедини оболочку MV, две стальные рамы, два листа полиэтилена, уплотнение, две стальные пластины и пакет промасленной изоляции.')
  revise('me_silicon',['ebf_controller','oil_energy_hatch','mv_electrolyzer','furnace_lining_insert'],
    'На медно-никелевых катушках нужен энерговвод MV. Подай 250 мБ водорода, две пыли кварцита, два древесных угля, футеровочную вставку и пыль кальцита. При 1750 К и 96 EU/t за 50 секунд получится слиток кремния.')
  revise('me_foil',['me_laminate','me_silicon','mv_impregnation','copper_contacts'],
    'На фольгу памяти нужны два слитка кремния, две контактные полосы, два пьезоламината, золотая пластина, полимер и пакет изоляции. Сборщик MV расходует 125 мБ электроизоляционного масла.')
  revise('me_engineering_foil',['me_foil','printed_phenolic','me_certus','mv_impregnation'],
    'В сборщик MV положи фольгу памяти, два сертиуса, фенольную плату, две контактные полосы, припой и промасленную изоляцию. Подай 125 мБ масла. Полученная фольга идёт под инженерную матрицу.')
  revise('me_fluid_cell',['me_1k','mv_pump','chemical_grade_seal'],
    'К предметному корпусу добавь насос MV, два уплотнения и малую бронзовую трубу. Установи компонент 1k в жидкостной корпус и вставь ячейку в привод ME.')
  revise('me_pattern_laminate',['me_eng','me_foil','mv_impregnation','printed_phenolic','mv_circuit_batch'],
    'В сборщик MV положи две фольги памяти, два пакета изоляции, инженерный процессор, фенольную плату, схему MV и два уплотнения. Добавь 250 мБ масла.')
  revise('me_provider',['me_interface','me_blank_pattern','me_eng','mv_impregnation','mv_refinery_robot'],
    'Соедини интерфейс, две основы шаблона, два инженерных процессора, манипулятор MV, уплотнения и пакет изоляции. Поставь поставщик к входу станка.')
  revise('me_cpu',['me_pattern_laminate','me_calc','me_logic','mv_casing','mv_impregnation'],
    'На вычислительный блок нужны две основы шаблона, по два вычислительных и логических процессора, корпус ME, оболочка MV, уплотнение и промасленная изоляция.')
  revise('me_molecular',['me_provider','me_inscriber','mv_refinery_robot'],
    'Собери молекулярный сборщик на MV. Вложи инскрайбер, основы шаблонов, ядра формирования и уничтожения, манипулятор MV, уплотнения и пакет изоляции. Подключи его к поставщику для верстачных рецептов.')
  revise('me_recipe_return',['me_mv_automation_parts','mv_spent_coalescer'],
    'Первым выходом шаблона промывки укажи 800 мБ обессоленной нефти. Добавь 400 мБ рассола и отработанный картридж. Дай шине импорта забрать все три продукта и свяжи бак обессоленной нефти с осушкой.')
  revise('me_refinery_catalyst',['me_recipe_return','process_commissioning'],
    'Установи активированный носитель в реактор GregTech и оставь его в предметном слоте. Поставщик подаёт 1000 мБ очищенного лёгкого топлива и 500 мБ нефтяного газа. Отведи в ME 1200 мБ дизеля.')
  addTasks('mv', [
    ['mv_refinery_robot','Манипулятор для монтажной линии ME',g('mv_robot_arm'),1,
      ['nether_mv_piston','nether_mv_conveyor','chemical_grade_seal','mv_motor','mv_circuit_batch'],
      'В сборщике MV поставь поршень, конвейер и два мотора на стальные рамы. Добавь схемы, кабели, уплотнения и манипулятор LV. На цикл уходит 450 мБ смазки.']
  ])
  revise('hv_casing',[...rows.get('hv_casing')[4],'mv_impregnation'],
    'В сборщике MV соедини восемь нержавеющих пластин, два огнеупора, два дугозащитных экрана, рамы, уплотнения, две стенки пневмокамеры и пакет изоляции. Подай 500 мБ смазки.')
  revise('hv_hull',[...rows.get('hv_hull')[4],'mv_impregnation'],
    'Соедини оболочку HV, корпус MV, принятый ящик огнеупоров, золотые кабели, контакты, уплотнения, медный кабель, усиленную пневмотрубу и два пакета изоляции. На сборку расходуется 650 мБ электроизоляционного масла.')
  Object.assign(book.get('oilfield').rewards ??= {}, {
    mv_coalescer:{item:k('copper_contact_strip'),count:2},mv_filter_rotation:{item:g('tin_single_wire'),count:2}
  })
  Object.assign(book.get('petrochem').rewards ??= {}, {mv_impregnation:{item:k('pressed_insulation'),count:1}})
}
