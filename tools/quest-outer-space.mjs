import { connectPlanetaryMills } from './quest-planetary-mills.mjs'
import { connectTitanWorks } from './quest-titan-orbit.mjs'
import { connectEuropaWorks } from './quest-zpm-europa.mjs'

export function connectOuterSpace(chapters) {
  const sections=new Map(chapters.map(ch=>[ch.key,ch]))
  const rows=new Map(chapters.flatMap(ch=>ch.rows.map(row=>[row[0],row])))
  const k=id=>'kubejs:'+id,gt=id=>'gtceu:'+id,ad=id=>'ad_astra:'+id,ship=id=>'gtibd_core:'+id
  const flight='luv_power',lab='luv_computation',ring='luv_fusion',zpm='zpm_components',uv='uv_power'
  function add(section,key,title,icon,n,deps,text,task) {
    const row=[key,title,icon,n,deps,text,false,undefined,task]
    sections.get(section).rows.push(row);rows.set(key,row)
  }
  function join(key,deps,text) {
    const r=rows.get(key);if(!r)throw Error('Missing orbital quest '+key)
    r[4]=[...new Set([...r[4],...deps])];if(text)r[5]=text
  }
  const fluid=(id,amount)=>({fluid:id,amount})
  const land=id=>({dimension:'zero_shift:'+id})
  add('ev_power','space_t2_blend','Заправка второй ступени',gt('ev_chemical_reactor'),1,['space_lunar_seal'],
    'Оставь лунное уплотнение в химическом реакторе EV. Литр обычного ракетного топлива и 250 мБ холодного теплоносителя дадут литр перелётного топлива. Обратку забери отдельной трубой.',fluid(k('lunar_transfer_fuel'),1000))
  join('space_mars_land',['space_t2_blend'])
  join('ev_mercury_land',['space_t2_blend'])
  add(flight,'luv_t4_gel','Гель для калоритовых баков',gt('luv_chemical_reactor'),1,['space_venus_part','luv_hull'],
    'Подай в химический реактор LuV литр криотоплива и 250 мБ электроизоляционного масла. Закрепи экран с Венеры во входном слоте. Залей в четвёртую ракету полученный калоритовый гель.',fluid(k('calorite_flight_gel'),1000))
  join('space_glacio_land',['luv_t4_gel'],'Возьми кислород, тёплый скафандр и калоритовый гель для обратного вылета. На поверхности Гласио найди лёд и местную породу для затравок.')
  add(lab,'luv_mount_blank','Парная заготовка оправы',k('luv_prism_blank'),2,['luv_hull','space_venus_part','ev_mercury_land'],
    'В формовочный пресс положи два кварцита, лист калорита и два куска меркурианской породы. Обе заготовки возьми на Меркурий.')
  add(lab,'luv_mercury_optics','Отжиг на Меркурии',k('luv_annealed_mount'),1,['luv_mount_blank'],
    'Поставь дуговую печь LuV на поверхности Меркурия. На оправу нужно 250 мБ кислорода. Отожжённую деталь отправь к венерианскому гравёру.')
  add(lab,'luv_venus_prism','Совмещение оптических осей',k('luv_venus_timing_prism'),2,['luv_mercury_optics','iv_cut_datum','space_venus_part'],
    'Оставь базовую пластину IV в лазерном гравёре на Венере. За одну оправу получишь две призмы. Призмы нужны вычислителям HPCA и мастерской на Гласио.')
  join('luv_computation_parts',['luv_venus_prism'],'На каждый вычислительный компонент уходит одна синхропризма с Венеры. Три рабочих компонента дадут 12 CWU/t. Внутри массива установи также шесть радиаторов.')
  add(flight,'luv_mars_cartridge','Сменная кассета с Марса',k('luv_cryo_cartridge'),1,['iv_mars_grain','luv_hull'],
    'В марсианском сборщике соедини два зерна огнеупора, складчатый фильтр, два листа ниобий-титана и прокладку. Подай 288 мБ припоя. Кассета остаётся в станке во время обработки.')
  add(lab,'luv_optical_mix','Первичная заправка оптического контура',gt('luv_mixer'),1,['luv_hull','ev_getter_regen'],
    'Смешай кварцитовую пыль и складчатый фильтр с 750 мБ холодного теплоносителя и 250 мБ гелия. На выходе получится литр оптического теплоносителя.',fluid(k('luv_optical_coolant'),1000))
  add(ring,'luv_turned_spindle','Шпиндель турбинного ротора',k('luv_rotor_spindle'),2,['luv_hull','luv_palladium_plate'],
    'Обточи в токарном станке LuV два слитка HSS-G на шпиндель. Подготовь запас для обеих заготовок ротора и для последней балансировки.')
  join('luv_turbine_rotor',['luv_turned_spindle'],'Сделай две заготовки ротора из палладиевых листов и отдельных шпинделей. Для окончательной балансировки подай в сборщик ещё два шпинделя, датчики, листы и 2100 мБ смазки.')
  add(ring,'luv_witness_blanks','Пара пластин для испытаний',k('luv_witness_blank'),2,['luv_reflector','luv_palladium_plate'],
    'Оставь форму пластины в формовочном прессе. Из двух листов родированного палладия и нейтронного отражателя получишь две заготовки.')
  join('luv_plasma_coupon',['luv_witness_blanks','luv_optical_mix'],'Подай заготовку, 500 мБ гелиевой плазмы из Mk I и 1000 мБ оптического теплоносителя в вакуумную камеру с энерговводом LuV. Забери две контрольные пластины и весь литр нагретой жидкости.')
  add(lab,'luv_optical_return','Возврат нагретого теплоносителя',gt('luv_chemical_reactor'),1,['luv_mars_cartridge','luv_plasma_coupon'],
    'В реакторе оставь марсианскую кассету. Подведи два жидкостных входа для литра обратки и 250 мБ гелия. Литр охлаждённого теплоносителя верни в сеть ME.',fluid(k('luv_warm_optical_coolant'),1000))
  add(flight,'luv_glacio_seed','Лёд для затравочной ванны',k('luv_glacio_seed'),2,['space_glacio_land','luv_optical_mix'],
    'Промой четыре куска местной породы в химической ванне на Гласио. За литр оптического теплоносителя получишь две затравки и литр обратки.')
  add(flight,'survey_drive','Двигатель геодезической ракеты',k('survey_drive'),1,['luv_glacio_seed','luv_venus_prism','luv_hull'],
    'На сборочной линии LuV соедини корпус, насосы, моторы, датчики, генераторы поля и 16 пластин HSS-G. Загрузи две затравки Гласио и синхропризму Венеры и четыре прокладки. Подай 2000 мБ смазки, 2592 мБ припоя и 1000 мБ геодезического топлива.')
  add(flight,'survey_fuel','Топливо для ракеты Tier V',gt('luv_chemical_reactor'),1,['luv_t4_gel','luv_mars_cartridge','luv_optical_mix'],
    'Оставь кассету с Марса в химреакторе. На литр геодезического топлива нужны литр калоритового геля и 500 мБ оптического теплоносителя. Верни нагретую жидкость в оборот.',fluid(k('survey_propellant'),1000))
  add(flight,'survey_rocket','Ракета Tier V',ship('surveyor'),1,['survey_drive','survey_fuel','space_glacio_rocket'],
    'На верстаке NASA установи ракету Tier IV, новый двигатель, носовой обтекатель, четыре калоритовых бака и четыре стабилизатора. В оставшиеся три гнезда поставь две затравки Гласио и синхропризму Венеры. Заправь готовую ракету перед вылетом.')
  add(flight,'ceres_land','Посадка в соляных впадинах',k('ceres_salt_lens'),1,['survey_rocket'],
    'Выбери Цереру на карте Солнечной системы. Под тёмной корой залегают светлые соляные линзы. На базу понадобятся химический реактор LuV, дистиллированная вода и питание.',land('ceres'))
  add(flight,'ceres_face','Соль под корой Цереры',k('ceres_salt_lens'),1,['ceres_land'],
    'Между Y 20 и 62 ищи в глубинном сланце светлые прожилки. Добудь линзу киркой. В соседних залежах возьми сапфир для оснастки реактора.')
  add(flight,'ceres_assay','Концентрат для выращивания кристаллов',k('luv_ceres_salt_concentrate'),2,['ceres_face'],
    'Оставь сапфир в химическом реакторе на Церере. Линза и 400 мБ дистиллята дадут два концентрата. Погрузи их для отправки на Гласио.')
  join('space_glacio_part',['ceres_assay','luv_glacio_seed','luv_mars_cartridge','luv_plasma_coupon','luv_venus_prism'],
    'Оставь марсианскую кассету в сборщике на Гласио. Добавь затравку, призму, плазменную пластину, сырую накваду, четыре ледяных осколка и солевой концентрат. На два кристалла нужно 750 мБ оптического теплоносителя.')
  add(lab,'luv_crystal_orb','Запись кристалла на сферу',gt('data_orb'),1,['space_glacio_part','luv_research_station','luv_orbs'],
    'В держатель станции положи кристалл с Гласио и пустую сферу данных. Исследование потребует 12 CWU/t, 24000 CWU и 28672 EU/t. Выставь предел разгона LuV, выдели станции одну линию 32768 EU/t и подай питание на HPCA отдельно. Перенеси записанную сферу в продвинутый люк сборочной линии.')
  add(zpm,'zpm_crystal_stock','Резерв кристаллов для корпуса',k('glacio_reference_crystal'),4,['space_glacio_part','luv_optical_return'],
    'Сделай две партии. Одна нужна для исследования, две штуки нужны на оболочку и корпус, последняя пригодится для повышающего трансформатора.')
  join('zpm_casing',['zpm_crystal_stock'],'В сборщик LuV подай две оболочки LuV, листы европия и сплава наквады, нейтронный ламинат, переборки, прокладки, рамы и один кристалл. Подведи 3600 мБ холодного вакуумного теплоносителя.')
  add(zpm,'zpm_hull_pattern','Три бака и девять предметных шин',gt('luv_input_hatch'),3,['zpm_casing','luv_crystal_orb','iv_hull_pattern'],
    'Задай отдельный шаблон на оболочку. В шаблон корпуса внеси 3000 мБ смазки, 1728 мБ припоя и 1250 мБ оптического теплоносителя. Сферу данных держи в люке постоянно.')
  join('zpm_hull',['zpm_hull_pattern'],'От контроллера по порядку подай два корпуса LuV, оболочку ZPM, четыре фазовых модуля, четыре шины, восемь проволок, четыре Wetware, четыре ламината, кристалл и плазменную пластину. Линия потребляет 30720 EU/t в течение 250 секунд.')
  join('zpm_upshift',['space_glacio_part'],'При сборке трансформатора LuV установи кристалл с Гласио. Переключи готовый трансформатор отвёрткой на повышение. На входе четыре пакета LuV, на выходе один пакет ZPM.')
  add(zpm,'courier_drive','Двигатель ледовой экспедиции',k('courier_drive'),1,['zpm_hull','zpm_assembler','ceres_assay','space_glacio_part'],
    'На сборочной линии ZPM соедини корпус, насосы, моторы, датчики, генераторы поля и 16 пластин наквадового сплава. Загрузи два эталонных кристалла Гласио и концентрат Цереры и четыре прокладки. Подай 3000 мБ смазки, 4320 мБ припоя и 2000 мБ перелётной среды «Европа».')
  add(zpm,'courier_fuel','Заправка ракеты Tier VI',gt('zpm_mixer'),1,['zpm_hull','survey_fuel','ceres_assay','luv_plasma_coupon'],
    'Солевой концентрат, литр геодезического топлива и 250 мБ гелиевой плазмы образуют литр перелётной среды. Разведи производство и топливный склад разными жидкостными каналами.',fluid(k('europa_transfer_medium'),1000))
  add(zpm,'courier_rocket','Ракета Tier VI',ship('courier'),1,['courier_drive','courier_fuel','survey_rocket'],
    'На верстаке NASA установи ракету Tier V, новый двигатель, носовой обтекатель, четыре калоритовых бака и четыре стабилизатора. В оставшиеся три гнезда поставь два эталонных кристалла Гласио и концентрат Цереры. Заправь готовую ракету перед вылетом.')
  add(zpm,'europa_land','Посадка над ледовым разломом',k('europa_rift_core'),1,['courier_rocket'],
    'Выбери Европу в Солнечной системе. Для работы под ледовой корой выгрузи формовочный пресс ZPM и энерговвод. Подготовь запас перелётной среды для возвращения.',land('europa'))
  add(zpm,'europa_face','Керн из ледового разлома',k('europa_rift_core'),1,['europa_land'],
    'Ищи прожилки керна между Y 20 и 62, оливиновую руду между Y 12 и 52. Для керна нужна железная кирка или лучше.')
  add(zpm,'europa_ceramic','Фазовая керамика Европы',k('europa_phase_ceramic'),2,['europa_face','space_glacio_part','zpm_casing'],
    'Пресс на Европе принимает промытую мембрану, пластинку Гласио, два оливина и два листа европия.')
  join('uv_upshift',['europa_ceramic'],'В сборщике ZPM установи фазовую керамику с Европы в трансформатор. Переключи его отвёрткой на повышение и подведи четыре пакета ZPM, чтобы получить один пакет UV.')
  join('uv_hull',['europa_ceramic'])
  add(uv,'freighter_drive','Привод тяжёлого грузового корабля',k('freighter_drive'),1,['uv_hull','uv_assembler','europa_ceramic'],
    'На сборочной линии UV соедини корпус, насосы, моторы, датчики, генераторы поля и 16 пластин тритания. Загрузи две фазовые керамики Европы и фазовую блокировку и четыре прокладки. Подай 4000 мБ смазки, 6048 мБ припоя и 3000 мБ топливной матрицы «Титан».')
  add(uv,'freighter_fuel','Топливная матрица дальнего рейса',gt('uv_chemical_reactor'),1,['europa_ceramic','courier_fuel','uv_hull'],
    'Закрепи фазовую керамику в химреакторе UV. На литр топливной матрицы подай литр среды «Европа» и 750 мБ защитного газа.',fluid(k('titan_flight_matrix'),1000))
  add(uv,'freighter_rocket','Ракета Tier VII',ship('freighter'),1,['freighter_drive','freighter_fuel','courier_rocket'],
    'На верстаке NASA установи ракету Tier VI, новый двигатель, носовой обтекатель, четыре калоритовых бака и четыре стабилизатора. В оставшиеся три гнезда поставь две фазовые керамики Европы и фазовую блокировку. Заправь готовую ракету перед вылетом.')
  add(uv,'titan_land','Посадка у дюн Титана',k('titan_seam_core'),1,['freighter_rocket'],
    'Возьми сборщик UV, тританий, керамику Европы и запас топливной матрицы. Выбери Титан, спустись на поверхность и подготовь место для грузовой площадки.',land('titan'))
  add(uv,'titan_face','Касситерит под дюнами',k('titan_seam_core'),1,['titan_land'],
    'Под дюнами на Y 20–62 добудь керн. Для первой партии эталонов подготовь также четыре порции пыли касситеритового песка из местной жилы.')
  add(uv,'titan_standard','Нагрузочный эталон с Титана',k('titan_load_standard'),2,['titan_face','europa_ceramic','freighter_fuel'],
    'В сборщике на Титане соедини керн, пыль касситеритового песка, керамику Европы, два листа тритания и блокировку UV. Подай 750 мБ топливной матрицы. Оба эталона нужны для приёмки UV.')
  join('uv_commissioning',['titan_standard'])
  connectEuropaWorks({add, join, sections})
  connectTitanWorks({add, join, sections})
  connectPlanetaryMills({add, join})
  for(const [section,ids] of [[flight,['ceres_face','survey_rocket']],[zpm,['europa_face','courier_rocket']],[uv,['titan_face','freighter_rocket']]]){
    const rewards=sections.get(section).rewards??={}
    for(const key of ids)rewards[key]={item:k('vacuum_gasket'),count:2}
  }
}
