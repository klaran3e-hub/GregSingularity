export function connectOrbitalWorks(chapters) {
  const sections = new Map(chapters.map(section => [section.key,section]))
  const rows = new Map(chapters.flatMap(section=>section.rows.map(row=>[row[0],row])))
  const ad=name=>'ad_astra:'+name, gt=name=>'gtceu:'+name, k=name=>'kubejs:'+name
  function add(section,key,title,item,quantity,deps,text,objective) {
    const row=[key,title,item,quantity,deps,text,false,undefined,objective]
    sections.get(section).rows.push(row)
    rows.set(key,row)
  }
  function requirePart(key,part) {
    const row=rows.get(key)
    if(!row)throw Error('Missing orbital dependency '+key)
    if(!row[4].includes(part))row[4].push(part)
  }
  const hv='hv_foundry'
  add(hv,'space_frame','Горячая посадка рамы двигателя',ad('engine_frame'),1,['hv_assembler','nether_hot_kanthal','nether_stainless_plates','hv_arc_shield'],
    'Установи формовочный пресс HV в Нижнем мире. На одну раму расходуются четыре нержавеющие пластины, две канталовые обмотки, горячая заготовка кантала и дугозащитный экран. Прессу нужно 384 EU/t.')
  add(hv,'space_fin','Четыре стабилизатора',ad('rocket_fin'),4,['nether_stainless_plates','nether_kanthal_winding','hv_assembler'],
    'Сборщик выпускает стабилизаторы парами. Возьми нержавеющие пластины, огнеупор, канталовую обмотку и штампованную раму. Для четырёх стабилизаторов понадобится 400 мБ смазки.')
  add(hv,'space_cone','Головной обтекатель',ad('rocket_nose_cone'),1,['hv_ceramic_substrate','hv_arc_shield','hv_assembler'],
    'Припаяй две керамические подложки и коммутационный контакт к четырём нержавеющим пластинам с огнеупорным вкладышем. На пайку уйдёт 288 мБ припоя.')
  add(hv,'space_gas','Баллон с проверенным уплотнением',ad('gas_tank'),1,['hv_assembler','chemical_grade_seal','nether_stainless_plates'],
    'Собери баллон из вкладыша барабана, малой стальной трубы, уплотнений и нержавейки. Такие баллоны нужны и для дыхательного аппарата, и для баков ракеты.')
  add(hv,'space_tanks','Пара маршевых баков',ad('steel_tank'),2,['space_gas','space_frame'],
    'На каждый из двух баков возьми отдельную раму из Нижнего мира. Поставь внутрь баллон, добавь обшивку, две обмотки и два химстойких уплотнения. Подай 450 мБ смазки на бак.')
  add(hv,'space_engine','Маршевый двигатель первой ступени',ad('steel_engine'),1,['space_frame','hv_motor','hv_pump'],
    'На отдельную горячештампованную раму установи мотор и насос HV. Добавь нержавеющие пластины, четыре обмотки и контакт. Сборщику нужны 650 мБ электроизоляционного масла.')
  add(hv,'space_pad','Стартовая площадка',ad('launch_pad'),1,['hv_casing','hv_arc_shield','nether_stainless_plates'],
    'Собери площадку и установи её на ровном месте. Оставь свободное место вокруг и над ней, чтобы поставить и запустить ракету.')
  add(hv,'space_bench','Сборочный стол NASA',ad('nasa_workbench'),1,['space_frame','hv_robot','hv_hull'],
    'На стол идут корпус HV, манипулятор, две схемы, рама двигателя, четыре нержавеющие пластины и изоляция. Один стол можно оставить в сборщике как постоянную оснастку для заказов ME.')
  add(hv,'space_loader','Заправка дыхательных баллонов',ad('oxygen_loader'),1,['space_gas','hv_pump','mv_impregnation'],
    'Подведи к загрузчику питание и кислород GregTech. Проверь запас в нагруднике перед стартом. Кислород для внешнего бака также можно подготовить в консервирующем механизме HV.')
  const suit=[['helmet','Гермошлем','space_helmet'],['suit','Скафандр с дыхательным аппаратом','space_suit'],['pants','Герметичные штаны','space_pants'],['boots','Огнеупорные ботинки','space_boots']]
  for(const [key,title,item] of suit)add(hv,'space_'+key,title,ad(item),1,['space_gas','mv_impregnation','hv_assembler'],
    ({helmet:'Соедини стекло и баллон с изоляцией, нержавейкой и уплотнениями. Проверь шлем перед выходом из посадочного модуля.',suit:'Установи дыхательный аппарат и резервный баллон в нагрудник. Заполни нагрудник в загрузчике кислорода и проверь запас в подсказке.',pants:'Закрепи баллон стальным кольцом. В сборщик нужны также нержавейка, изоляция, уплотнения и 250 мБ масла.',boots:'На подошвы идут огнеупорный вкладыш и стальная пружина. Добавь нержавейку, изоляцию и уплотнения. На посадку возьми полный комплект.'})[key])
  add(hv,'space_refinery','Ракетная заправочная станция',ad('fuel_refinery'),1,['hv_pump','hv_assembler','mv_dielectric_sample'],
    'Собери установку из дистиллятора HV, насоса, теплообменника, тарелок колонны и уплотнения. Поставь её у баков или оставь в дистилляторе HV как оснастку.')
  add(hv,'space_blend','Проба маршевой смеси',k('cracking_catalyst'),1,['space_refinery','cracking_catalyst'],
    'В химический реактор HV подай 1000 мБ дизеля, 250 мБ нефтяного газа и катализатор крекинга. Верни активированный носитель из предметного выхода. Отбери 25 мБ смеси в экран задач.',{fluid:k('stabilized_flight_blend'),amount:25})
  add(hv,'space_fuel','Топливо на два перелёта',ad('fuel_bucket'),1,['space_refinery','space_blend'],
    'Установка переводит смесь в ракетное топливо в отношении один к одному. На Земле заправь первую ракету и отложи отдельную заправку для возвращения. Для анализа передай 25 мБ.',{fluid:ad('fuel'),amount:25})
  add(hv,'space_rocket','Ракета Tier I',ad('tier_1_rocket'),1,['space_bench','space_tanks','space_engine','space_fin','space_cone'],
    'Поставь нос, четыре стабилизатора, два бака и двигатель в стол NASA. В шесть ячеек обшивки положи сверху вниз две оболочки HV, две штампованные рамы и два огнеупора. Порядок показывает JEI.')
  add(hv,'space_moon','Высадка на Луну',ad('moon_stone'),1,['space_rocket','space_pad','space_fuel','space_loader',...suit.map(([key])=>'space_'+key)],
    'Возьми сборщик HV, источник 512 EU/t, изоляционное масло, обмотки, уплотнения и нержавейку. Заправь ракету, выбери Луну и посади спускаемый аппарат. Задание сработает на поверхности.',{dimension:ad('moon')})
  add(hv,'space_desh','Деш из лунной породы',ad('raw_desh'),1,['space_moon'],'Добудь сырой деш. Для вакуумного уплотнения нужна сырая руда. Остальное сохрани для домны и ракеты второй ступени.')
  add(hv,'space_bauxite','Лунный боксит',gt('raw_bauxite'),1,['space_moon'],'Ищи боксит между Y 12 и 58. Рядом на тех же глубинах встречаются ильменит и алюминиевая руда. Одну сырую руду положи в сборщик на базе.')
  add(hv,'space_lunar_seal','Два лунных вакуумных уплотнения',k('lunar_vacuum_seal'),2,['space_desh','space_bauxite','hv_assembler','nether_kanthal_winding'],
    'В сборщик HV на поверхности Луны положи сырой деш, сырой боксит, две нержавеющие пластины, обмотку и прокладку. Подай 250 мБ электроизоляционного масла. Два уплотнения вернутся с первой партии. Для вакуумной линии и электроники понадобятся следующие.')
  add(hv,'space_lunar_supply','Запас для земного цеха EV',k('lunar_vacuum_seal'),8,['space_lunar_seal'],
    'За четыре цикла набери восемь уплотнений. Оставь сборщик и питание на Луне. На Земле уплотнения расходуются на заготовки прокладок, управляющие модули, оболочки и корпуса EV.')
  rows.get('space_lunar_supply')[6]=true
  const freight=[
    ['space_asteroid_station','Перевалочная станция на орбите','ad_astra:steel_tank',1,['space_rocket','space_loader','space_pad'],'Возьми на борт 32 нержавеющие пластины, 12 штампованных рам, восемь газовых баллонов и четыре дугозащитных экрана. На карте полётов построй станцию на орбите Земли.',{dimension:ad('earth_orbit')}],
    ['space_asteroid_land','Выход на рудный астероид','minecraft:tuff',1,['space_asteroid_station'],'Запасись кислородом. Ищи отдельные скальные тела примерно между Y 64 и 130. Подлети к поверхности и зайди внутрь месторождения. Квест проверит твоё положение.',{structure:'zero_shift:ore_asteroid'}],
    ['space_asteroid_copper','Трюм халькопирита',gt('raw_chalcopyrite'),32,['space_asteroid_land'],'Разработай медный или медно-оловянный астероид. В медном встречаются железо, пирит и медь, в медно-оловянном касситерит, цеолит и реальгар. Забери в трюм полстака халькопирита.'],
    ['space_asteroid_nickel','Никель с попутным кобальтом',gt('raw_nickel'),16,['space_asteroid_land'],'Ищи гарниерит и пентландит в каменной оболочке. В этих же слоях попадаются никель и кобальтин. Сложи отдельную партию для земной обогатительной линии.'],
    ['space_asteroid_cargo','Рейс с рудным грузом','gtceu:raw_bauxite',16,['space_asteroid_land','space_fuel'],'Боксит встречается на слюдяных астероидах с кианитом и поллуцитом. Заложи топливо на обратный путь и отвези руду на дробление. Для добычи на поясе подходит корабль первой ступени.'],
    ['space_me_fuel','Заказ заправки через ME',ad('fuel_bucket'),1,['space_fuel','space_refinery','space_blend','me_mv_automation_parts'],'Закодируй два шаблона обработки, подведи шину импорта к каждой машине. В дистилляторе оставь топливную установку. Закажи партию в терминале и передай 100 мБ в экран задач.',{fluid:ad('fuel'),amount:100}]
  ]
  for (const [key,title,item,count,deps,description,task] of freight) {
    add(hv,key,title,item,count,deps,description,task)
    rows.get(key)[6]=true
  }
  const planets=[
    ['ev_power','mars','Марса','ev_assembler','space_lunar_seal',2,'raw_ostrum','martian_pressure_liner','Марсианский напорный вкладыш','термовставку с Меркурия, титановую заготовку, две пластины острума, сырой острум и сырой шеелит','500 мБ чистой промывочной жидкости','iv_power_casing'],
    ['iv_power','venus','Венеры','iv_power_assembler','space_mars_part',3,'raw_calorite','venus_thermal_screen','Венерианский теплозащитный экран','ламинат теплозащиты, сырой калорит, марсианское огнеупорное зерно, две спечённые плитки и канталовую обмотку','576 мБ припоя','luv_casing'],
    ['luv_power','glacio','Гласио','luv_assembler','space_venus_part',4,'ice_shard','glacio_reference_crystal','Опорный кристалл Гласио','затравку, венерианскую призму, контрольную плазменную пластину, концентрат с Цереры, накваду и четыре ледяных осколка','750 мБ оптического теплоносителя','zpm_casing']
  ]
  const flightPlans={
    mars:['Высадка на Марсе','Установи двигатель и баки из деша, добавь лунное уплотнение и корпус ракеты первой ступени. Возьми на Марс сборщик EV, источник питания и бак чистой промывочной жидкости. На первой посадке добудь острум для теплозащиты.'],
    venus:['Высадка на Венере','Перестрой вторую ракету с обшивкой из острума и марсианским вкладышем. Третья ступень потребляет криотопливо. Морозильник Ad Astra принимает ледяные осколки. Для выхода на поверхность подготовь термостойкий скафандр.'],
    glacio:['Высадка на Гласио','Для четвёртой ступени нужны корпус третьей ракеты, калоритовые баки, новый двигатель и венерианский экран. Заправь четвёртую ракету калоритовым гелем. До вылета собери запас геля для возвращения.']
  }
  for(const [section,planet,from,stage,prior,tier,ore,component,label,inputs,fluid,next] of planets){
    const prefix='space_'+planet
    add(section,prefix+'_rocket','Ракета Tier '+['','I','II','III','IV'][tier],ad('tier_'+tier+'_rocket'),1,[stage,prior],
      flightPlans[planet][1])
    add(section,prefix+'_land',flightPlans[planet][0],ad(ore),1,[prefix+'_rocket'],'После посадки подготовь местный цех. Для производства детали «'+label.toLowerCase()+'» установи сборщик, подключи питание и подай '+fluid+'.',{dimension:ad(planet)})
    add(section,prefix+'_part',label,k(component),2,[prefix+'_land',prior],
      'На базе положи в сборщик '+inputs+'. Подай '+fluid+'. Привези готовую пару с '+from+' для оболочки следующего напряжения.')
    requirePart(next,prefix+'_part')
  }
  for(const target of ['vacuum_seal_preform','cleanroom_ev_module','ev_machine_casing','ev_hull'])requirePart(target,'space_lunar_seal')
  for(const [key,amount] of [['space_engine',2],['space_rocket',4],['space_lunar_seal',4]]) {
    const s=sections.get(hv);(s.rewards??={})[key]={item:k('copper_contact_strip'),count:amount}
  }
}
