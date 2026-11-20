export function connectIvVenus(chapters) {
  const sections=new Map(chapters.map(s=>[s.key,s]))
  const rows=new Map(chapters.flatMap(s=>s.rows.map(row=>[row[0],row])))
  const k=id=>'kubejs:'+id, gt=id=>'gtceu:'+id, ad=id=>'ad_astra:'+id
  const metallurgy='iv_metallurgy', line='iv_assembly_line', space='iv_power', ores='luv_alloys', power='luv_power'
  function add(section,key,title,icon,count,deps,description,task) {
    const row=[key,title,icon,count,deps,description,false,undefined,task]
    sections.get(section).rows.push(row)
    rows.set(key,row)
  }
  function revise(key,deps,text,title) {
    const row=rows.get(key)
    if(!row)throw Error('Missing IV quest '+key)
    for(const dep of deps)if(!row[4].includes(dep))row[4].push(dep)
    row[5]=text
    if(title)row[1]=title
  }
  add(metallurgy,'iv_binder_sample','Связующее из вольфрамата',gt('ev_mixer'),1,['iv_tungstate_concentrate','iv_mixer_ev'],
    'В смеситель EV подай порцию марсианского концентрата, известковый флюс, угольную пыль и 600 мБ дистиллята. Выхода в 1000 мБ хватит на два пакета.',{fluid:k('iv_bonding_slurry'),amount:25})
  add(metallurgy,'iv_billet_press','Два листа каждого металла',k('iv_layered_billet'),2,['iv_tungsten_plate','iv_mixer_ev'],
    'Оставь форму пластины в формовочном прессе EV. На каждый пакет нужны два вольфрамовых и два стальных листа.')
  add(metallurgy,'iv_billet_bath','Пропитка пакета',k('iv_bonded_billet'),2,['iv_binder_sample','iv_billet_press'],
    'Химическая ванна EV пропитывает один пакет в 500 мБ связующего. За два цикла забери оба пакета и 500 мБ отработанного раствора.')
  revise('iv_tungstensteel_charge',['iv_billet_bath'],'Смешай пропитанный пакет, две обожжённые футеровки и контрольный образец HV с 450 мБ защитного газа. Два таких замеса дадут четыре порции шихты.')
  revise('iv_tungstensteel_plate',['ev_getter_load'],'Охлади горячую заготовку в вакуумной камере с картриджем, 2000 мБ холодного теплоносителя и 350 мБ аргона. Извлеки слиток, картридж и 2000 мБ обратки. Прокатай слиток в лист на EV.')
  add(metallurgy,'iv_quench_return','Оборот картриджей доменного цеха',k('ev_spent_getter'),2,['iv_tungstensteel_plate','ev_getter_regen'],
    'Подключи предметный импорт к выгрузке камеры, жидкостный к выходу обратки. Отправь использованные картриджи в промывку вместе с картриджами титановой линии.')
  add(line,'iv_indexed_guides','Шаг сборочной секции',k('iv_indexed_rail'),4,['iv_tungstensteel_plate','iv_arc_plate','iv_power_assembler'],
    'Положи в формовочный пресс IV два листа вольфрамовой стали и одну дугозащитную пластину. За один ход пресса под формой пластины получится пара направляющих.')
  revise('iv_line_grating',['iv_indexed_guides'],'Закрепи направляющую на стальном кожухе. Добавь переборки, вольфрамостальные листы, прокладки, ремень и конвейер LV. За цикл получатся четыре решётки.')
  revise('iv_line_unit',['iv_indexed_guides'],'Установи манипулятор IV, конвейер IV и направляющую на управляющий кожух. Потребуются плата синхронизации, оптика, манипулятор MV, пневмоинтерфейс и вольфрамосталь.')
  add(line,'iv_index_fixture','Юстировка сборочной линии',k('iv_index_fixture'),1,['iv_indexed_guides','ev_alignment_master','iv_clock_backplane','iv_servo_core'],
    'В сборщике IV соедини две направляющие, датчик IV, сердечник сервопривода, оптический узел, плату синхронизации и калибровочную пластину EV. Подай 288 мБ припоя.')
  rows.get('iv_line_input_buses')[3]=9
  revise('iv_line_input_buses',[],'Поставь девять входных шин ULV подряд. После них поставь секцию с выходной шиной. Для первого мейнфрейма LuV добавишь десятую входную секцию.','Девять предметных входов')
  revise('iv_line_controller',[],'Собери девять входных секций и секцию выдачи. Три независимых входных люка оставь для жидкостей. Подключи энерговвод IV сверху.')
  revise('iv_line_fluid_hatches',[],'Выдели три боковых входа для жидкостей. Указывай очередность в шаблоне конкретного рецепта. Перед сменой продукта освобождай баки от остатков другой жидкости.')
  revise('iv_calibration_rig',['iv_index_fixture'],'Просканируй эталон с чистой флешкой 60 секунд. Помести запись в люк данных. На девятую шину подай юстировочное приспособление. Подключи 1800 мБ смазки и 1000 мБ защитного газа.')
  add(line,'iv_cut_datum','Перенос базы на сталь',k('iv_line_datum'),1,['iv_calibration_rig','iv_tungstensteel_plate'],
    'Оставь проверенный стенд в лазерном гравёре IV, рядом положи лист вольфрамовой стали. Гравёр перенесёт метки и вернёт стенд для следующей партии.')
  add(space,'iv_mars_wash_feed','Сырьё марсианской промывки',ad('mars_cobblestone'),12,['space_mars_part','iv_power_assembler'],
    'Разбей двенадцать блоков марсианского камня без шёлкового касания. Установи химическую ванну IV на поверхности Марса и обеспечь 6144 EU/t.')
  add(space,'iv_mars_grain','Огнеупорное зерно с Марса',k('iv_mars_refractory_grain'),6,['iv_mars_wash_feed','iv_leach_filter'],
    'На четыре булыжника подай 500 мБ вольфрамового раствора. Ванна отдаст два зерна и 500 мБ отработанного раствора. Организуй вывоз зерна для суспензии и для венерианского сборщика.')
  add(space,'iv_mars_wash_return','Обратный рейс раствора',gt('steel_drum'),1,['iv_mars_grain','iv_billet_bath'],
    'Отведи отработанный раствор в отдельный бак. Подключи выход ванны к жидкостному импорту ME. Добавляй свежий раствор в запас промывочного участка.',{fluid:k('spent_tungsten_leach'),amount:25})
  add(line,'iv_ceramic_batch','Керамическая суспензия',gt('iv_mixer'),1,['iv_mars_grain','iv_power_assembler'],
    'Смешай два зерна, две порции огнеупорной смеси, угольную пыль и 750 мБ дистиллята. Из первого литра получишь пару заготовок экрана. Второй замес оставь для корпуса LuV.',{fluid:k('iv_ceramic_suspension'),amount:25})
  add(line,'iv_panel_liquids','Три люка участка ламинации',gt('hv_input_hatch'),3,['iv_ceramic_batch','iv_line_fluid_hatches'],
    'От контроллера к выдаче отведи первый жидкостный вход под 576 мБ припоя, второй под 1000 мБ суспензии, третий под 400 мБ защитного газа. Удобно задать фильтры на шинах экспорта ME.')
  add(line,'iv_laminated_blank','Ламинация теплозащитной заготовки',k('iv_venus_panel_blank'),2,['iv_panel_liquids','iv_cut_datum','space_mars_part','iv_indexed_guides'],
    'На шины по порядку положи четыре листа вольфрамовой стали, марсианский вкладыш, две направляющие, дугозащиту, базовую пластину и вакуумную панель. За цикл линия выдаст две заготовки.')
  add(space,'iv_venus_manifest','Груз для сборщика на Венере',k('iv_venus_panel_blank'),2,['iv_laminated_blank','space_venus_rocket','iv_mars_grain'],
    'Погрузи обе заготовки, два зерна с Марса, четыре спечённые плитки и две канталовые обмотки. Для двух циклов возьми 1152 мБ припоя, сборщик IV, источник питания и кислород.')
  add(space,'iv_venus_calorite','Калорит для обшивки',ad('raw_calorite'),2,['space_venus_land'],
    'На Венере добудь два сырых калорита. Оставь их в рудном виде для сборщика теплозащиты.')
  revise('space_venus_part',['iv_venus_manifest','iv_venus_calorite'],'В сборщик IV на Венере подай одну ламинированную заготовку, сырой калорит, марсианское зерно, две спечённые плитки, канталовую обмотку и 576 мБ припоя. Из одной загрузки выйдут два экрана.')
  add(space,'iv_screen_freight','Поставка экранов на завод',k('venus_thermal_screen'),4,['space_venus_part'],
    'Две партии дают четыре экрана. По одному уйдёт на пару первых мейнфреймов, оболочку и сам корпус LuV. Четвёртый оставь для повышающего трансформатора.')
  add(ores,'iv_venus_ore_face','Венерианский забой танталита',gt('raw_tantalite'),4,['space_venus_land','iv_commissioning'],
    'Ищи танталит в венерианской породе на высоте от 12 до 58 блоков. Возьми кирку и оставь у дробилки запас на несколько загрузок центрифуги.')
  revise('luv_mill_iv',['iv_venus_ore_face'],'Дроби танталит в машине IV. Механическую подготовку можно выполнить на любой базе, но центрифуга с этим сырьём работает на Венере.')
  revise('luv_centrifuge_iv',['space_venus_land'],'Установи центрифугу IV на Венере. Подведи питание и защитный газ, положи протокол приёмки IV в предметный вход.')
  revise('luv_tantalite_ore',['iv_venus_ore_face'],'Отложи шестнадцать порций дроблёного танталита для четырёх циклов на Венере.')
  revise('luv_tantalite_concentrate',[],'За четыре порции дроблёнки и 750 мБ защитного газа получишь два концентрата и хвосты. Протокол IV остаётся в венерианской центрифуге.')
  add(power,'iv_luv_tenth_bus','Десятая позиция для электроники',gt('ulv_input_bus'),10,['iv_line_input_buses','iv_commissioning'],
    'Удлини входную сторону линии до десяти шин. Поставь выход за последней секцией. Подай экран на десятую позицию рецепта первого мейнфрейма.')
  revise('luv_first_circuit',['iv_luv_tenth_bus','space_venus_part'],'Вложи венерианский экран в десятую входную позицию. Для двух мейнфреймов подай 5000 мБ смазки, 4200 мБ защитного газа и 6400 мБ улучшенного дизеля. Линия работает 400 секунд.')
  revise('luv_casing',['space_venus_part'],'В сборщик IV положи оболочку IV, шесть родированных палладиевых пластин, четыре HSS-G, два ламината, две дугозащиты, четыре прокладки, две рамы и экран с Венеры. Подай 1450 мБ смазки. В русском JEI этот полуфабрикат называется «Корпус машины (LuV)».')
  add(power,'iv_hull_pattern','Шаблон корпуса с тремя жидкостями',gt('iv_input_hatch'),3,['luv_casing','iv_panel_liquids','luv_cable','luv_first_circuit'],
    'Закодируй шаблон обработки на один корпус. Для оболочки заведи отдельный шаблон сборщика IV. Выдели линии подачи 1450 мБ смазки, 864 мБ припоя и 800 мБ керамической суспензии.')
  revise('luv_hull',['iv_hull_pattern'],'На восемь шин от контроллера подай корпус IV, оболочку LuV, две матрицы, две шины питания, четыре кабеля, два мейнфрейма, четыре ламината и венерианский экран. Подключи три жидкости. На выход поставь шину импорта ME. Готовый корпус в русском JEI называется «Оболочка машины (LuV)».')
  revise('luv_transformer_iv',['space_venus_part'],'Для повышения напряжения установи венерианский экран в трансформатор IV. Протокол приёмки остаётся в сборщике как оснастка.')
  Object.assign(sections.get(line).rewards??={}, {iv_cut_datum:{item:gt('steel_plate'),count:2},iv_laminated_blank:{item:k('vacuum_gasket'),count:2}})
}
