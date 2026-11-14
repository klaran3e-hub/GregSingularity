const forestry = name => 'forestry:' + name
const gendustry = name => 'gendustry:' + name
const gt = name => 'gtceu:' + name
const mc = name => 'minecraft:' + name

function section(key, title, icon, rows) {
  return {
    key, title, icon,
    rows: rows.map(([id, label, item, count, dependencies, description]) =>
      ['forest_' + id, label, item, count, dependencies, description, true])
  }
}

export function forestrySections() {
  return [
    section('forestry_farm', 'Древесная ферма LV', forestry('farm_gearbox_brick'), [
      ['farm_masonry', 'Кирпич для лесного участка', mc('bricks'), 36, ['assembler', 'mortar', 'kiln'], 'Обожги кирпичи и собери кладку. На четыре секции фермы уходит четыре кирпичных блока, бронза и столярная обвязка.'],
      ['farm_plain', 'Секции корпуса фермы', forestry('farm_plain_brick'), 36, ['forest_farm_masonry', 'bronze_plate', 'joint', 'pressed_insulation'], 'Выпусти 36 секций в сборщике при 28 EU/t. Часть секций уйдёт на оснащение, остальные пойдут в корпус.'],
      ['farm_drive', 'Привод лесной фермы', forestry('farm_gearbox_brick'), 1, ['forest_farm_plain', 'motor', 'lv_hull', 'bushing'], 'Установи два двигателя LV и малые бронзовые шестерни в блок привода. Через него ферма принимает FE.'],
      ['farm_valve', 'Водяной ввод', forestry('farm_valve_brick'), 1, ['forest_farm_plain', 'bronze_pipe', 'motor'], 'Собери ввод из насоса LV и бронзовых труб. Подай обычную воду к боковой стороне.'],
      ['farm_hatch', 'Люк для подачи и выгрузки', forestry('farm_hatch_brick'), 1, ['forest_farm_plain', 'lv_conveyor', 'hinge'], 'Установи люк рядом с буфером. Через него можно подать саженцы и вывезти урожай.'],
      ['farm_control', 'Выключатель лесного участка', forestry('farm_control_brick'), 1, ['forest_farm_plain', 'lv_circuit_batch', 'copper_contacts'], 'Добавь блок управления. Сигнал сверху или снизу останавливает всю ферму, боковой сигнал останавливает соответствующий участок.'],
      ['farm_apatite', 'Апатит для удобрения', gt('apatite_gem'), 8, ['assembler', 'bronze_plate'], 'Найди жилу апатита GregTech в Верхнем мире и добудь восемь кристаллов.'],
      ['farm_ash', 'Зольный запас', gt('ash_dust'), 16, ['assembler', 'boiler', 'charcoal'], 'Сжигай древесный уголь в паровом котле и собирай золу из выхода. На цикл удобрения нужны четыре порции.'],
      ['farm_fertilizer', 'Первая партия удобрения', forestry('fertilizer_compound'), 32, ['forest_farm_ash', 'forest_farm_apatite'], 'Подай апатит, золу, песок и воду в сборщик LV. Часть удобрения уйдёт на перегной, остальное загрузи в ферму.'],
      ['farm_humus', 'Запас почвы для деревьев', forestry('humus'), 32, ['forest_farm_fertilizer'], 'Подай землю, листья, удобрение и воду в сборщик. Ферма также принимает обычную землю и готовит из неё почву на месте.'],
      ['farm_saplings', 'Саженцы на первые посадки', mc('oak_sapling'), 16, ['forest_farm_humus', 'wood_oak_logs'], 'Собери шестнадцать дубовых саженцев. При первом запуске оставь часть в резерве на случай пустого возврата.'],
      ['farm_arboretum', 'Компактная древесная ферма', forestry('arboretum_managed'), 1, ['forest_farm_drive', 'forest_farm_valve', 'forest_farm_hatch', 'forest_farm_saplings', 'lv_circuit_batch', 'panes'], 'Устрой основание из каменных кирпичей на два блока ниже фермы. Слой почвы будет на один блок ниже фермы. Подай FE, воду, удобрение, почву и саженцы.'],
      ['farm_power', 'Питание фермы от LV', gt('lv_1a_energy_converter'), 1, ['forest_farm_drive', 'ie_fe_converter'], 'Киянкой переключи преобразователь в EU → FE. Соедини выход с приводом многоблочной фермы или с компактной установкой.'],
      ['farm_plot', 'Площадка под посадку', mc('stone_bricks'), 32, ['forest_farm_control', 'forest_farm_valve', 'forest_farm_saplings', 'stone_bricks'], 'Собери башню 3×3×4 по руководству Forestry. Третий слой полностью сложи из секций корпуса. Каменная кладка вокруг башни служит основанием грядок.'],
      ['farm_stock', 'Древесина для лесопилки', mc('oak_log'), 64, ['forest_farm_plot', 'forest_farm_hatch', 'forest_farm_power', 'saw'], 'Подай воду, удобрение, почву и саженцы. Освободи выход для древесины, верни саженцы в посадочный отсек и передай брёвна на пилу Create.']
    ]),
    section('forestry_apiculture', 'Разведение пчёл', forestry('apiary'), [
      ['scoop', 'Сачок для диких ульев', forestry('scoop'), 1, ['hv_foundry_accepted', 'hv_assembler', 'end_pass'], 'Собери сачок перед полевым выездом. Им разбирают ульи Forestry, чтобы получить первых пчёл.'],
      ['founder_princesses', 'Маточный резерв пасеки', forestry('bee_princess_ge'), 2, ['forest_scoop'], 'Собери двух принцесс и оставь одну в резерве. Перед заселением сравни условия биома с требованиями пчелы.'],
      ['founder_drones', 'Трутни для первых скрещиваний', forestry('bee_drone_ge'), 4, ['forest_scoop'], 'Сохрани трутней разных линий в отдельных ячейках. Начни с пары, для которой можно обеспечить подходящие цветы и климат.'],
      ['first_combs', 'Медовые соты из диких ульев', forestry('bee_comb_honey'), 4, ['forest_scoop'], 'Проверь добычу из диких ульев. Оставь часть медовых сот под первый домик, остальные передай на разделение.'],
      ['first_house', 'Пчелиный домик для размножения', forestry('bee_house'), 1, ['forest_first_combs', 'forest_founder_princesses', 'forest_founder_drones'], 'Поставь домик рядом с подходящими цветами и с открытым небом. Используй его для первых семей, пока собираешь оснастку полноценной пасеки.'],
      ['first_queen', 'Первая матка пасеки', forestry('bee_queen_ge'), 1, ['forest_first_house'], 'Помести принцессу и подходящего трутня в домик. Когда появится матка, оставь ей условия для полного цикла и освободи выход.'],
      ['bee_chest', 'Раздельный архив линий', forestry('bee_chest'), 2, ['forest_first_queen'], 'Один пчелиный сундук оставь для основных семей, другой для племенного резерва. Запасных трутней храни отдельно от партии переработки.'],
      ['apiary', 'Пасека с рамками', forestry('apiary'), 1, ['forest_first_queen', 'forest_impregnated_casings'], 'У полноценной пасеки есть слоты для рамок. После заселения проверь условия работы в интерфейсе и подбери рамки под свой цикл.'],
      ['treated_frames', 'Рамки с масляной пропиткой', forestry('frame_impregnated'), 6, ['forest_apiary', 'forest_impregnated_sticks'], 'Возьми пропитанные заготовки у плотника Forestry. Готовые рамки складывай рядом с пасеками, чтобы их можно было менять по мере износа.'],
      ['field_analyzer', 'Переносная проверка признаков', forestry('portable_alyzer'), 1, ['forest_honey_drops', 'forest_carpenter'], 'Помести образец в портативный анализатор. Для проверки держи под рукой каплю мёда или медвяной росы.'],
      ['lab_analyzer', 'Стационарный анализатор питомника', forestry('analyzer'), 1, ['forest_field_analyzer', 'forest_centrifuge'], 'Поставь анализатор рядом с племенным архивом. Сравнивай оба набора признаков, прежде чем выделять родителей для новой линии.'],
      ['mature_honey_comb', 'Соты для непрерывной переработки', forestry('bee_comb_honey'), 32, ['forest_treated_frames', 'forest_lab_analyzer'], 'Собери партию сот от освоенных семей. Снимай выпуск до заполнения выхода пасеки и не смешивай соты с племенным материалом.']
    ]),
    section('forestry_industry', 'Соты, воск и большой улей', forestry('centrifuge'), [
      ['sturdy_housing', 'Усиленные корпуса для машин Forestry', forestry('sturdy_machine'), 2, ['hv_foundry_accepted', 'hv_assembler', 'ie_fe_converter'], 'Отложи корпуса для машин переработки. Проверь, что сеть GregTech через преобразователь даёт FE на сторону Forestry.'],
      ['squeezer', 'Отжим семян и медовых капель', forestry('squeezer'), 1, ['forest_sturdy_housing'], 'Подключи отжиматель к FE. На первом запуске выдели жидкостный буфер под масло, чтобы выход не переполнился.'],
      ['carpenter', 'Плотник для пропитки древесины', forestry('carpenter'), 1, ['forest_sturdy_housing', 'pressed_steel_frame'], 'Поставь плотник рядом с отжимателем. Отдельно приготовь подачу воды, масла и мёда под разные рецепты.'],
      ['seed_oil', 'Ведро семенного масла Forestry', forestry('bucket_seed_oil'), 1, ['forest_squeezer'], 'Отжимай семена до накопления масла и набери ведро из подходящей ёмкости. Остальное масло оставь на пропитку корпусов и заготовок.'],
      ['impregnated_sticks', 'Пропитанные заготовки рамок', forestry('impregnated_stick'), 16, ['forest_carpenter', 'forest_seed_oil'], 'Задай рецепт в сетке плотника. Для автосборки укажи в шаблоне 250 мБ семенного масла и отфильтруй шину импорта по готовым палочкам, иначе она заберёт масло из бака.'],
      ['farm_to_carpenter', 'Древесина фермы для корпусов пасек', forestry('impregnated_casing'), 8, ['forest_farm_stock', 'forest_impregnated_sticks', 'forest_seed_oil'], 'Передай брёвна с фермы в плотник Forestry. Пропитай восемь корпусов семенным маслом и оставь их в буфере рядом с будущими пасеками.'],
      ['impregnated_casings', 'Пропитанные корпуса будущих пасек', forestry('impregnated_casing'), 4, ['forest_carpenter', 'forest_seed_oil'], 'Часть партии отложи для пасек, остальное для большого улья. Храни корпуса отдельно от пропитанных палок.'],
      ['centrifuge', 'Разделение медовых сот', forestry('centrifuge'), 1, ['forest_sturdy_housing', 'forest_first_combs'], 'Поставь центрифугу Forestry и подключи FE. Медовые соты дают воск и могут дать капли мёда.'],
      ['honey_drops', 'Медовые капли для анализа', forestry('honey_drop'), 8, ['forest_centrifuge'], 'Из партии сот отложи восемь капель мёда для анализатора. Остальные капли можешь отжать в жидкий мёд.'],
      ['wax_batch', 'Восковой запас центрифуги', forestry('beeswax'), 24, ['forest_centrifuge', 'forest_apiary'], 'Накопи воск отдельно от капель. Оставь запас под душистую обшивку будущего улья.'],
      ['honey_bucket', 'Жидкий мёд для плотника', forestry('bucket_honey'), 1, ['forest_squeezer', 'forest_honey_drops'], 'Отожми капли мёда и набери ведро. Мёд подавай к плотнику по отдельной линии от семенного масла.'],
      ['silky_combs', 'Шёлковые соты селекционного участка', forestry('bee_comb_silky'), 8, ['forest_lab_analyzer', 'forest_treated_frames'], 'Найди линию с шёлковыми сотами по подсказкам Forestry и выдели ей отдельную пасеку. Держи готовые соты отдельно от обычных медовых.'],
      ['woven_silk', 'Тканый шёлк на фильтры улья', forestry('woven_silk'), 4, ['forest_silky_combs', 'forest_centrifuge', 'forest_carpenter'], 'Выдели прополис из шёлковых сот, затем получи из него волокно. На один цикл плотнику нужно 750 мБ дистиллированной воды. Для автосборки поставь фильтр по шёлку на выходной шине.'],
      ['scented_paneling', 'Душистая обшивка большого улья', forestry('scented_paneling'), 16, ['forest_wax_batch', 'forest_honey_bucket', 'forest_lab_analyzer'], 'Для обшивки подготовь древесину, воск, королевское желе, обычную пыльцу и жидкий мёд. Выдели обшивке собственный заказ плотника.'],
      ['alveary_blocks', 'Корпус большого улья 3×3×3', forestry('alveary_plain'), 27, ['forest_scented_paneling', 'forest_impregnated_casings'], 'Подготовь 27 блоков и накрой куб деревянными плитами. Сверь сборку с руководством Forestry, оставь сверху свободное пространство.'],
      ['alveary_sieve', 'Сито большого улья', forestry('alveary_sieve'), 1, ['forest_alveary_blocks', 'forest_woven_silk'], 'Поставь сито в допустимую ячейку нижних двух слоёв. Загрузи тканый шёлк, когда хочешь собирать пыльцу деревьев.']
    ]),
    section('forestry_genetics', 'Промышленные пасеки Gendustry', gendustry('industrial_apiary'), [
      ['gd_receptacle', 'Сосуды для лабораторных установок', gendustry('receptacle'), 4, ['forest_apiary', 'hv_foundry_accepted', 'hv_assembler'], 'Отложи сосуды для сборки промышленной пасеки и лабораторных машин. Готовые заготовки храни на отдельной полке.'],
      ['gd_power', 'Модули питания лаборатории', gendustry('power_module'), 4, ['forest_gd_receptacle', 'hv_generator'], 'Подготовь модули перед сборкой станков. На площадке заранее проверь выход преобразователя EU в FE.'],
      ['gd_genetics_processor', 'Процессоры управления лабораторией', gendustry('genetics_processor'), 4, ['forest_gd_power', 'me_controller', 'me_eng'], 'Отведи компоненты AE2 на отдельную партию электроники. Пригодные процессоры сохрани на сборку устройств, не смешивая с запасом сети.'],
      ['gd_environmental_processor', 'Блоки контроля среды', gendustry('environmental_processor'), 2, ['forest_gd_genetics_processor', 'forest_lab_analyzer'], 'Подготовь электронные блоки под климатическое оборудование. Условия конкретной семьи смотри в анализаторе Forestry.'],
      ['gd_industrial_apiary', 'Первая промышленная пасека', gendustry('industrial_apiary'), 1, ['forest_gd_power', 'forest_gd_receptacle', 'forest_apiary'], 'Подключи пасеку к FE и пересели подходящую семью. Вместо деревянных рамок у этой машины используются модули улучшения.'],
      ['gd_upgrade_frames', 'Оснастка модулей промышленной пасеки', gendustry('upgrade_frame'), 8, ['forest_gd_industrial_apiary', 'forest_gd_environmental_processor'], 'Отложи по комплекту рамок под климат, автоматизацию и производительность. Пустые рамки предназначены для изготовления модулей.'],
      ['gd_climate_control', 'Модуль климатического управления', gendustry('climate_control_module'), 2, ['forest_gd_upgrade_frames', 'forest_gd_environmental_processor'], 'Изготовь климатические модули как компоненты дальнейших улучшений. Сравни температуру и влажность биома с требованиями линии.'],
      ['gd_weatherproof', 'Всепогодное оснащение промышленной пасеки', gendustry('weatherproof_upgrade'), 1, ['forest_gd_climate_control', 'forest_gd_industrial_apiary'], 'Проверь в подсказке модуля допустимые условия работы. Испытай его на отдельной пасеке и следи за потреблением FE.'],
      ['gd_automation', 'Возврат потомства в рабочую пасеку', gendustry('automation_upgrade'), 1, ['forest_gd_upgrade_frames', 'forest_gd_industrial_apiary'], 'Проверь автоматический возврат потомства на стабильной линии. Племенной резерв держи в отдельном сундуке.'],
      ['gd_productivity', 'Улучшение производительности пасеки', gendustry('productivity_upgrade'), 2, ['forest_gd_upgrade_frames', 'forest_mature_honey_comb'], 'Добавляй модули постепенно. После каждого проверь подвод FE и место для продукции в выходе.'],
      ['gd_labware', 'Расходная посуда лаборатории', gendustry('labware'), 8, ['forest_gd_receptacle', 'forest_gd_genetics_processor'], 'Подготовь лабораторную посуду рядом с генетическими станками. Не расходуй запас, пока не выделил исходные образцы.'],
      ['gd_blank_samples', 'Пустые носители признаков', gendustry('blank_gene_sample'), 8, ['forest_gd_labware'], 'Сложи пустые носители в отдельный лоток. Готовые образцы подписывай по признаку и виду.'],
      ['gd_sampler', 'Пробоотборник Gendustry', gendustry('sampler'), 1, ['forest_gd_blank_samples', 'forest_gd_genetics_processor', 'forest_lab_analyzer'], 'Поставь пробоотборник и подай FE. Для первых проб используй избыточный материал и пустые носители.'],
      ['gd_samples', 'Первые образцы признаков пасеки', gendustry('gene_sample'), 4, ['forest_gd_sampler', 'forest_gd_labware'], 'Собери четыре заполненных носителя в пробоотборнике. Сверь подписи и храни исходных родителей отдельно от материала для отбора.'],
      ['gd_template', 'Первый заполненный генетический шаблон', gendustry('genetic_template'), 1, ['forest_gd_samples'], 'Подготовь пустой шаблон и соедини его с образцами одного типа в верстаке. Задание проверяет наличие шаблона, его полноту смотри в подсказке предмета.'],
      ['gd_dna_extractor', 'Экстрактор для переработки запаса', gendustry('dna_extractor'), 1, ['forest_gd_labware', 'forest_gd_power'], 'Подключи экстрактор к FE и выдели жидкостный выход. Перерабатывай излишки трутней из отдельного лотка.'],
      ['gd_dna_stock', 'Буфер жидкой ДНК', gendustry('bucket_liquid_dna'), 1, ['forest_gd_dna_extractor', 'forest_founder_drones'], 'Собери ведро из выходного потока экстрактора. Исходных пчёл для разведения оставь за пределами переработки.'],
      ['gd_mutagen_machine', 'Аппарат приготовления мутагена', gendustry('mutagen_producer'), 1, ['forest_gd_labware', 'forest_gd_power'], 'Отведи аппарату отдельную подачу FE и резервуар. Рецепты расходников сверяй в JEI.'],
      ['gd_mutagen_stock', 'Ведро реагента для мутатрона', gendustry('bucket_mutagen'), 1, ['forest_gd_mutagen_machine'], 'Собери жидкий реагент из выходного буфера. Красную пыль для аппарата держи отдельно от электроники.'],
      ['gd_protein_machine', 'Аппарат подготовки жидкого белка', gendustry('protein_liquefier'), 1, ['forest_gd_labware', 'forest_gd_power'], 'Поставь аппарат с самостоятельной выдачей. Сырьё для него подавай из отдельного склада, рецепты смотри в JEI.'],
      ['gd_protein_stock', 'Белковый запас для репликатора', gendustry('bucket_protein'), 1, ['forest_gd_protein_machine'], 'Наполни ведро из белкового буфера. Держи белок отдельно от жидкой ДНК и мутагена.'],
      ['gd_mutatron', 'Базовый мутатрон', gendustry('mutatron'), 1, ['forest_gd_mutagen_stock', 'forest_gd_genetics_processor', 'forest_gd_sampler'], 'Поставь мутатрон у племенного архива. Подбирай родителей по возможным мутациям, которые показывает мод.'],
      ['gd_advanced_mutatron', 'Выбор мутации на станции EV', gendustry('advanced_mutatron'), 1, ['forest_gd_mutatron', 'ev_foundry_accepted', 'ev_assembler'], 'В продвинутом мутатроне можно выбрать доступный результат для пары родителей. Перед запуском проверь запас реагента и FE.'],
      ['gd_transposer', 'Транспозер для резервных копий', gendustry('genetic_transposer'), 1, ['forest_gd_template', 'forest_gd_dna_stock'], 'Используй транспозер для копирования образцов и шаблонов. Рабочую копию храни отдельно от исходного архива.'],
      ['gd_imprinter', 'Импринтер для переноса шаблона', gendustry('imprinter'), 1, ['forest_gd_transposer', 'forest_gd_template'], 'Проверь полноту шаблона перед переносом признаков. Для первых опытов оставь родительскую семью в резерве.'],
      ['gd_replicator', 'Репликатор лаборатории EV', gendustry('replicator'), 1, ['forest_gd_imprinter', 'forest_gd_dna_stock', 'forest_gd_protein_stock', 'ev_foundry_accepted'], 'Подай жидкую ДНК и белок раздельно. Репликатору нужен полный шаблон, проверь список признаков в его подсказке.'],
      ['gd_elite_frames', 'Оснастка элитных модулей IV', gendustry('elite_upgrade_frame'), 4, ['forest_gd_advanced_mutatron', 'iv_commissioning'], 'Выпусти комплект элитных рамок после освоения IV. Храни их отдельно от обычных рамок и готовых модулей.'],
      ['gd_elite_fertility', 'Элитный модуль плодовитости', gendustry('fertility_elite_upgrade'), 1, ['forest_gd_elite_frames', 'forest_gd_replicator'], 'Подготовь модуль для племенной пасеки. Перед включением проверь, хватает ли ей питания и свободного места для потомства.']
    ])
  ]
}
