export function connectEuropaWorks({ add, join, sections }) {
  const parts = 'zpm_components', ring = 'zpm_fusion', freight = 'zpm_commissioning', uv = 'uv_power'
  const k = id => 'kubejs:zpm_' + id
  const gt = id => 'gtceu:' + id
  const fluid = (id, amount) => ({ fluid: id, amount })

  add(parts, 'zpm_die_cartridge', 'Кассета для тяжёлого штампа', k('die_cartridge'), 2,
    ['zpm_neutron_laminate', 'zpm_naquadah_plates'],
    'В сборщике LuV закрепи одно кузнечное седло между двумя листами сплава наквады, добавь нейтронный ламинат и 500 мБ смазки. На механический станок ZPM или UV идут две готовые кассеты.')
  add(parts, 'zpm_storage_backplane', 'Платы для квантовых хранилищ', k('storage_backplane'), 2,
    ['zpm_circuit_assembler', 'zpm_phase_module'],
    'Подай в сборщик схем два компонента памяти 256k, пустые корпуса предметной и жидкостной ячеек, фазовый модуль и 576 мБ припоя. Для квантового хранилища ZPM потребуется четыре платы, для UV шесть.')

  add(parts, 'europa_ceres_refinery', 'Химический пост на соляной линзе', gt('zpm_chemical_reactor'), 1,
    ['ceres_assay', 'zpm_hull', 'zpm_upshift'],
    'Доставь на Цереру химический реактор ZPM. Для первой варки нужны два солевых концентрата и сапфировая пыль. Разведи два входа и оба выхода по разным бакам.')
  add(parts, 'europa_ceres_brine', 'Первый бак чистого рассола', gt('zpm_input_hatch'), 1,
    ['europa_ceres_refinery', 'luv_optical_return'],
    'Влей 1000 мБ дистиллированной воды и 250 мБ оптического теплоносителя. Реактор выдаст литр рассола и все 250 мБ нагретого теплоносителя.', fluid(k('ceres_brine'), 1000))
  add(parts, 'europa_glacio_cutter', 'Алмазный диск в порту Гласио', gt('zpm_cutter'), 1,
    ['europa_ceres_brine', 'space_glacio_part', 'zpm_die_cartridge'],
    'Установи отрезной станок ZPM на Гласио. В поставщик шаблонов внеси местный эталонный кристалл и 500 мБ рассола с Цереры.')
  add(parts, 'europa_glacio_lamella', 'Тонкий срез кристалла', k('glacio_lamella'), 2,
    ['europa_glacio_cutter'],
    'С одного кристалла выходят две пластинки. Часть отправь на Европу для пресса и сборщика, оставь одну возле сборщика оболочек UV.')
  add(parts, 'europa_wash_station', 'Ванна у ледового разлома', gt('zpm_chemical_bath'), 1,
    ['europa_face', 'europa_ceres_brine'],
    'На Европе поставь химическую ванну ZPM. На один керн подай 500 мБ рассола, выведи предметы и отработанную жидкость в сеть.')
  add(parts, 'europa_ice_membrane', 'Мембраны из ледового керна', k('europa_membrane'), 2,
    ['europa_wash_station'],
    'Забери две мембраны из ванны. В прессе одна мембрана расходуется на две керамические пластины. Эти же мембраны пригодятся для квантовых баков.')
  add(parts, 'europa_return_brine', 'Обратный груз на Цереру', gt('zpm_output_hatch'), 1,
    ['europa_ice_membrane', 'europa_ceres_refinery'],
    'Отправь с Европы 500 мБ отработанного рассола. Реактор на Церере восстановит литр чистого рассола за один солевой концентрат и 500 мБ дистиллята.', fluid(k('spent_brine'), 500))
  join('europa_ceramic', ['europa_glacio_lamella', 'europa_ice_membrane'],
    'В формовочный пресс на Европе положи одну мембрану, одну пластинку Гласио, два оливина и два листа европия. Из двух готовых керамических пластин можно изготовить сетки для двух опорных узлов.')
  add(parts, 'europa_reticle', 'Риски под лучом', k('europa_reticle'), 1,
    ['europa_ceramic', 'luv_mercury_optics'],
    'Закрепи венерианскую синхропризму в лазерном гравёре ZPM на Европе. С каждой керамической пластины снимается одна оптическая сетка. Призма остаётся в гравёре.')

  add(ring, 'europa_support_blank', 'Штамп для нагруженной рамы', k('preload_frame'), 2,
    ['zpm_neutron_laminate', 'zpm_flux_busbar', 'zpm_hull'],
    'На пресс ZPM подай два нейтронных ламината, четыре листа сплава наквады и одну силовую шину. Обе заготовки идут в вакуумную камеру одним комплектом.')
  add(ring, 'europa_frame_feed', 'Плазма для испытания под нагрузкой', gt('zpm_input_hatch'), 1,
    ['europa_support_blank', 'zpm_irradiated_cask'],
    'Отведи от кольца Mk II отдельный бак плазмы америция. Одно испытание двух рам расходует 360 мБ. Для испытательной камеры достаточно питания ZPM.', fluid(gt('americium_plasma'), 360))
  add(ring, 'europa_tested_frame', 'Рама после термоцикла', k('tempered_frame'), 2,
    ['europa_frame_feed', 'luv_optical_return'],
    'В вакуумную камеру положи обе заготовки. На отдельные входы подай 360 мБ плазмы и 1000 мБ оптического теплоносителя. Забери две рамы и литр нагретой жидкости.')
  add(ring, 'europa_coolant_return', 'Возврат теплоносителя с испытаний', gt('zpm_output_hatch'), 1,
    ['europa_tested_frame'],
    'Шина импорта должна принять литр нагретого оптического теплоносителя. Отправь его в химреактор с марсианской кассетой и 250 мБ гелия для следующего термоцикла.', fluid('kubejs:luv_warm_optical_coolant', 1000))
  add(freight, 'europa_reference_pair', 'Два узла с одной базы', k('europa_datum'), 2,
    ['europa_reticle', 'europa_tested_frame', 'zpm_americium_coupon'],
    'На каждый узел сборщику на Европе нужны испытанная рама, сетка, две пластинки Гласио, фазовый модуль, две пробы америция и 576 мБ припоя. На завод верни два узла. Один будет израсходован при исследовании.')
  join('zpm_freight_certificate', ['europa_reticle'],
    'В обычный мир свези тяжёлый концентрат Энда и соль Нижнего мира. К приборам проверки груза добавь оптическую сетку с Европы, пробы и экранированную тару. Подай 5200 мБ защитного газа.')
  join('zpm_commissioning', ['europa_tested_frame'],
    'На приёмочную линию подай тару с пробами, два свидетельства перевозки, четыре испытанные рамы и силовое оборудование. В отдельные люки идут 7200 мБ плазмы америция, 12000 мБ защитного газа и 16000 мБ цетанового дизеля.')
  add(freight, 'europa_hull_research', 'Исследование опоры корпуса UV', gt('data_orb'), 1,
    ['europa_reference_pair', 'zpm_hpca_24'],
    'В держатель исследовательской станции вставь один опорный узел и пустую сферу. Подключи HPCA на 24 CWU/t и 114688 EU/t с пределом разгона ZPM. После 48000 CWU перенеси записанную сферу в люк данных сборочной линии.')
  add(uv, 'europa_shell_delivery', 'Пластинка на последний кожух', k('glacio_lamella'), 1,
    ['europa_glacio_lamella', 'zpm_commissioning'],
    'Оставь пластинку Гласио на главном заводе. Для шаблона оболочки UV подведи к сборщику ZPM 6000 мБ холодного вакуумного теплоносителя.')
  join('uv_casing', ['europa_shell_delivery'],
    'Подай два кожуха ZPM, тританий, америций, оба ламината, прокладки, рамы, армированные трубы и пластинку Гласио. Готовую оболочку верни в ME, чтобы шаблон первого корпуса мог заказать её сам.')
  add(uv, 'europa_hull_ports', 'Три отдельных жидкостных входа UV', gt('zpm_input_hatch'), 3,
    ['europa_hull_research', 'uv_casing', 'zpm_hull_pattern'],
    'В шаблон корпуса внеси 5400 мБ смазки, 2304 мБ припоя и 2000 мБ чистого рассола. Каждую жидкость направь в отдельный люк. Сфера с исследованием остаётся в люке данных.')
  add(uv, 'europa_hull_stack', 'Комплект на девять шин', k('tempered_frame'), 2,
    ['europa_hull_ports', 'uv_phase_interlock', 'europa_reference_pair'],
    'От контроллера разложи два корпуса ZPM, оболочку UV, четыре фазовые блокировки, шесть шунтов, двенадцать проволок, шесть сборок Wetware, шесть ламинатов, второй опорный узел и две испытанные рамы.')
  join('uv_hull', ['europa_hull_stack'],
    'Закажи корпус UV в ME. Оболочку сначала изготовит сборщик ZPM. Затем сборочная линия отработает 7200 тактов при 122880 EU/t. Импортируй готовый корпус из выходной шины.')
  add(parts, 'europa_tank_liner', 'Мембраны для квантового бака', gt('zpm_quantum_tank'), 1,
    ['europa_ice_membrane', 'europa_glacio_lamella', 'zpm_pump', 'zpm_storage_backplane'],
    'На квантовый бак ZPM дополнительно идут четыре мембраны Европы и две пластинки Гласио. Бак удобно поставить под чистый рассол у космопорта.')
  add(parts, 'europa_parallel_optics', 'Оптика параллельного люка', gt('zpm_parallel_hatch'), 1,
    ['europa_reticle', 'zpm_robot'],
    'В сборщик параллельного люка положи две оптические сетки Европы. Такие же пары используются в лазерных люках ZPM на 4096 А.')

  for (const [section, key] of [[parts, 'europa_return_brine'], [ring, 'europa_coolant_return'], [uv, 'europa_hull_ports']]) {
    const chapter = sections.get(section)
    chapter.rewards ??= {}
    chapter.rewards[key] = { item: 'kubejs:vacuum_gasket', count: 2 }
  }
}
