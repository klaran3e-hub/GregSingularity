import { createHash } from 'node:crypto'
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { png } from './png.mjs'
import { drawWeb, questChapters, webLayout } from './quest-layout.mjs'
import { expandEarly } from './quest-expansion-early.mjs'
import { expandLv } from './quest-expansion-lv.mjs'
import { expandMv } from './quest-expansion-mv.mjs'
import { expandHv } from './quest-expansion-hv.mjs'
import { expandEvIv } from './quest-expansion-ev-iv.mjs'
import { expandLuVZpm } from './quest-expansion-luv-zpm.mjs'
import { addPostUvChapters } from './quest-expansion-post-uv.mjs'
import { expandUvFinal } from './quest-expansion-uv-final.mjs'
import { expandLate } from './quest-expansion-late.mjs'
import { forestrySections } from './quest-expansion-forestry.mjs'
import { createQuestRewardResolver } from './quest-rewards.mjs'
import { auditQuestDescriptions, questDescription } from './quest-text.mjs'
import { auditQuestTitles, questTitle } from './quest-titles.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const output = join(root, 'pack', 'overrides', 'config', 'ftbquests', 'quests')
const ks = id => 'kubejs:' + id
const mc = id => 'minecraft:' + id
const create = id => 'create:' + id
const gt = id => 'gtceu:' + id
const ie = id => 'immersiveengineering:' + id
const pnc = id => 'pneumaticcraft:' + id
const drawers = id => 'storagedrawers:' + id
const me = id => 'ae2:' + id
const factory = id => ks('final_' + id)
const chapters = []
const researchTag = researchId => ({
  assembly_line_research: { research_id: researchId, research_type: 'gtceu:assembly_line' }
})
const taskTags = {
  luv_turbine_rotor: { 'GT.PartStats': { Material: 'gtceu:rhodium_plated_palladium' } },
  zpm_hpca_32: researchTag('1x_kubejs_zpm_irradiated_cask'),
  final_report_research: researchTag('1x_kubejs_final_test_load')
}

function chapter(key, title, icon, rows) {
  chapters.push({ key, title, icon, rows })
}

chapter('workshop', 'I. Ручная мастерская', ks('flint_knife'), [
  ['gravel', 'Пробы гравия', mc('gravel'), 4, [], 'Гравий разбирается руками. Четыре блока дают гарантированную порцию кремня.'],
  ['flint', 'Сортировка кремня', mc('flint'), 3, ['gravel'], 'Два кремня пойдут на раскол. Ещё один нужен для обуха ножа.'],
  ['sticks', 'Сухие ветви', mc('stick'), 4, [], 'Палки можно добыть из листвы, сухих кустов или собрать из двух саженцев.'],
  ['fibre', 'Волокно с берега', ks('plant_fibre'), 4, [], 'Рви траву, папоротник или сухие кусты. В сетке 2×2 волокно можно получить из двух стеблей тростника или из двух саженцев с гравием.'],
  ['shard', 'Раскол кремня', ks('flint_shard'), 1, ['flint'], 'Расколи два кремня на гравии. Это заготовка лезвия.'],
  ['knife', 'Первый нож', ks('flint_knife'), 1, ['shard', 'sticks', 'fibre'], 'Нож собирается в инвентаре. Держи запас лезвий, рукояти и нагели изнашивают инструмент.'],
  ['washed', 'Промывка волокна', ks('washed_fibre'), 4, ['fibre'], 'С волокном в руке наведи на воду. Для серийной промывки используй поток воздуха Create через воду.'],
  ['cord', 'Плетение шнура', ks('fibre_cord'), 2, ['washed'], 'На два шнура уйдёт восемь единиц промытого волокна.'],
  ['binding', 'Вязка креплений', ks('tool_binding'), 1, ['cord'], 'Два шнура и промытое волокно дают одно крепление. До верстака понадобятся три крепления.'],
  ['handle', 'Рукоять под хват', ks('tool_handle'), 1, ['knife'], 'Обработай две ветви ножом. Рукоять используется в инструментах и раме.'],
  ['slat', 'Щепной настил', ks('rough_slat'), 3, ['knife'], 'На каждую щепную планку идут три ветви. Из трёх планок будет настил.'],
  ['peg', 'Нагели вместо гвоздей', ks('wooden_peg'), 2, ['knife'], 'Одна ветвь даёт два нагеля. Часть уйдёт на верстак, остальные оставь для инструментов.'],
  ['frame', 'Рама верстака', ks('workbench_frame'), 1, ['handle', 'peg', 'binding'], 'Собери две рукояти на нагеле и вязаном креплении в сетке 2×2.'],
  ['bench_top', 'Настил верстака', ks('workbench_top'), 1, ['slat', 'binding'], 'Три планки и крепление складываются в инвентаре.'],
  ['bench', 'Первый верстак', mc('crafting_table'), 1, ['frame', 'bench_top'], 'Соедини раму, настил, нагель и крепление в сетке 2×2. Откроется сетка 3×3.'],
  ['axe_head', 'Головка для валки', ks('axe_head'), 1, ['bench', 'shard'], 'Собери головку топора из трёх кремнёвых осколков и одного гравия.'],
  ['pick_head', 'Навершие для камня', ks('pick_head'), 1, ['bench', 'shard'], 'Подбери три кремнёвых осколка и гравий.'],
  ['axe', 'Первый топор', ks('flint_axe'), 1, ['axe_head', 'binding', 'handle'], 'Рукоять фиксируется нагелем и двумя креплениями. Теперь можно валить деревья.'],
  ['pick', 'Первая кирка', ks('flint_pickaxe'), 1, ['pick_head', 'binding', 'handle'], 'Для камня и первых руд. Возьми сменный инструмент, если идёшь далеко.'],
  ['hammer', 'Каменный молот', ks('stone_hammer'), 1, ['pick', 'handle'], 'Нужен для дробления руды, ковки и приготовления отощителя.'],
  ['drill', 'Огневое сверло', ks('fire_drill'), 1, ['bench', 'cord', 'handle', 'slat', 'peg'], 'Собери сверло из нагеля, рукояти, планки и двух шнуров. Сверло входит в крафт костра и пилы.'],
  ['joint', 'Столярная вязка', ks('wooden_joint'), 1, ['axe', 'peg'], 'Расшивка досок, два нагеля и шнур. Из соединений собираются столярные изделия и приводы.'],
  ['chest', 'Ящик без клея', mc('chest'), 1, ['joint'], 'Сундук требует досок, нагеля и двух вязаных креплений.'],
  ['barrel', 'Бондарный запас', mc('barrel'), 1, ['chest'], 'На бочку уходят сундук, обвязка и плиты. Используй JEI для выбора породы.'],
  ['ladder', 'Спуск к жиле', mc('ladder'), 8, ['peg', 'cord'], 'Собери восемь секций лестницы перед разведкой под землёй.'],
  ['campfire', 'Костёр для обжига', mc('campfire'), 1, ['axe', 'drill'], 'Брёвна, ветви, сухое волокно и огневое сверло. Поставь костёр рядом с водой.']
])

chapter('kiln', 'II. Обжиг и металл вручную', mc('furnace'), [
  ['clay', 'Береговая глина', mc('clay_ball'), 16, ['pick'], 'Ищи глину на мелководье. Часть уйдёт в футеровку, часть в тигли.'],
  ['temper', 'Песчаный отощитель', ks('sand_temper'), 4, ['hammer'], 'Разотри песок и гравий молотом. Примесь нужна глине.'],
  ['wet_lining', 'Сырая футеровка', ks('wet_lining'), 2, ['clay', 'temper', 'washed'], 'Из двух комков глины, отощителя и промытого волокна выходит одна футеровка. Для пары повтори замес.'],
  ['lining', 'Обжиг на костре', ks('fired_lining'), 2, ['wet_lining', 'campfire'], 'Разложи сырые детали по углам костра. Один обжиг занимает 90 секунд. На колосник и первую печь нужны шесть обожжённых деталей.'],
  ['grate', 'Каменный колосник', ks('kiln_grate'), 1, ['lining', 'hammer'], 'Собери каменное основание с огнеупорными вставками.'],
  ['kiln', 'Футерованная печь', mc('furnace'), 1, ['grate'], 'Окружи колосник камнем и обожжённой футеровкой.'],
  ['charcoal', 'Углежжение', mc('charcoal'), 8, ['campfire'], 'Обожги обычные брёвна, например дуб или акацию. Одно бревно даёт один древесный уголь за 40 секунд на костре или 18 секунд в печи. Уголь нужен в шихте и в топке.'],
  ['early_hoe', 'Мотыга для первого поля', mc('stone_hoe'), 1, ['bench', 'shard', 'handle', 'peg', 'binding'], 'Собери мотыгу из камня, кремня и деревянной оснастки. Вспаши землю рядом с водой.', true],
  ['early_wheat', 'Зерно на первую муку', mc('wheat'), 6, ['early_hoe', 'hammer', 'campfire'], 'Выращивай пшеницу или разбери снопы из деревни. На одну порцию муки ручного помола идут три колоса.', true],
  ['early_flour', 'Ручной помол', create('wheat_flour'), 2, ['early_wheat'], 'Разотри зерно каменным молотом. Мельница Create позже облегчит помол.', true],
  ['early_dough', 'Замес у воды', create('dough'), 2, ['early_flour'], 'Возьми муку в руку и нажми ПКМ по воде. При зажатом Shift можно замесить до четырёх порций.', true],
  ['early_bread', 'Хлеб на костре', mc('bread'), 2, ['early_dough'], 'Разложи тесто на костре. Печь и коптильня выпекают быстрее.', true],
  ['torches', 'Свет на забое', mc('torch'), 16, ['charcoal', 'washed'], 'Фитиль из промытого волокна входит в каждую пару факелов.'],
  ['raw_crucible', 'Формовка тигля', ks('unfired_crucible'), 1, ['clay', 'temper', 'kiln'], 'Добавь отощитель, чтобы получить заготовку тигля.'],
  ['crucible', 'Тигель под плавку', ks('fired_crucible'), 1, ['raw_crucible'], 'Обожги сырой тигель в печи. Для каждой ранней плавки нужен новый тигель.'],
  ['copper_grit', 'Дробление меди', ks('copper_grit'), 1, ['hammer', 'torches'], 'Ищи медную жилу, халькопирит или малахит. Ручная операция потребляет три куска руды.'],
  ['copper_washed', 'Медный концентрат', ks('washed_copper_grit'), 1, ['copper_grit'], 'Промой дроблёную руду у воды и оставь место под хвосты.'],
  ['tailings', 'Склад хвостов', ks('ore_tailings'), 8, ['copper_washed'], 'Восемь промывок дадут восемь единиц хвостов. Приготовь отдельный отсек на складе.'],
  ['copper_charge', 'Загрузка медной шихты', ks('copper_charge'), 1, ['copper_washed', 'crucible', 'charcoal'], 'Пять единиц концентрата, уголь и тигель.'],
  ['copper', 'Первый медный слиток', mc('copper_ingot'), 1, ['copper_charge'], 'Ручной передел расходует пятнадцать кусков руды на слиток. Мельница сократит расход.'],
  ['strap', 'Медная лента', ks('copper_strap'), 1, ['copper', 'hammer'], 'Расплющи медь молотом. Лента нужна и для крицы, и для втулок.'],
  ['iron_grit', 'Дробление железа', ks('iron_grit'), 1, ['hammer', 'torches'], 'Ищи гётит, гематит, бурый железняк или магнетит.'],
  ['iron_washed', 'Железный концентрат', ks('washed_iron_grit'), 1, ['iron_grit'], 'Воду можно использовать и для железного концентрата. Хвосты складывай отдельно.'],
  ['iron_charge', 'Загрузка железной шихты', ks('iron_charge'), 1, ['iron_washed', 'strap', 'crucible'], 'Помимо концентрата и угля нужны футеровка и кованая медная лента.'],
  ['bloom', 'Выпуск крицы', ks('iron_bloom'), 1, ['iron_charge'], 'Обожги железную шихту в печи.'],
  ['iron', 'Ковка железа', mc('iron_ingot'), 1, ['bloom'], 'Прокуй крицу с углём и каменным молотом.'],
  ['rivets', 'Ручные заклёпки', ks('iron_rivet'), 2, ['iron'], 'Один слиток даёт две заклёпки. Запас потребуется почти для каждого первого станка.'],
  ['hand_plate', 'Пластина под молотом', ks('hand_forged_plate'), 1, ['iron'], 'Два слитка на грубую пластину. Стандартные пластины позже даёт пресс.'],
  ['hinge', 'Шарнир для створок', ks('iron_hinge'), 1, ['hand_plate', 'rivets', 'strap'], 'Две грубые пластины, медная лента, заклёпка и молот.'],
  ['gold_grit', 'Золото в магнетитовой жиле', ks('gold_grit'), 1, ['hammer', 'torches'], 'Дроби золотую руду. На мельнице расход руды ниже.', true],
  ['gold_washed', 'Промытое золото', ks('washed_gold_grit'), 3, ['gold_grit'], 'Подготовь три порции концентрата для одной загрузки.', true],
  ['gold_charge', 'Шихта под золото', ks('gold_charge'), 1, ['gold_washed', 'crucible', 'lining'], 'Собери шихту с углём и огнеупорной футеровкой.', true],
  ['gold_ingot', 'Первый золотой слиток', mc('gold_ingot'), 1, ['gold_charge'], 'Проведи обжиг. Подготовь слиток для дальнейшей обработки.', true]
])

chapter('kinetics', 'III. Кинетика Create', create('water_wheel'), [
  ['alloy', 'Андезитовый композит', create('andesite_alloy'), 1, ['copper', 'lining', 'temper'], 'Андезит, медь, керамика и отощитель. Этот композит собирается до любых машин GregTech.'],
  ['bushing', 'Втулка с футеровкой', ks('shaft_bushing'), 1, ['strap', 'lining', 'peg'], 'Ручная посадка керамики в медную ленту. На один привод пойдёт несколько втулок.'],
  ['shaft', 'Первая пара валов', create('shaft'), 2, ['alloy', 'bushing', 'handle'], 'Две втулки, две порции композита и обработанная рукоять дают один вал. Для пары повтори сборку.'],
  ['casing', 'Андезитовый корпус', create('andesite_casing'), 1, ['alloy', 'axe', 'joint', 'lining'], 'Обтеши бревно топором. На верстаке обложи его композитом, закрепи четырьмя нагелями и добавь футеровку и столярное соединение.'],
  ['rim', 'Венец с нагелями', ks('gear_rim'), 1, ['alloy', 'peg', 'binding'], 'Подготовь зубчатые венцы. На малую шестерню нужны четыре венца.'],
  ['cogwheel', 'Малая шестерня', create('cogwheel'), 1, ['rim', 'shaft'], 'Собери венцы на валу. Проверь зацепление, прежде чем собирать постоянный привод.'],
  ['large_cogwheel', 'Передаточное отношение', create('large_cogwheel'), 1, ['cogwheel', 'joint'], 'Малая шестерня, столярные соединения и доски дают большой венец.'],
  ['crank', 'Ручной привод', create('hand_crank'), 1, ['shaft', 'alloy'], 'Используй рукоятку для первых проб и для резервного вращения.'],
  ['segment', 'Секции водяного колеса', ks('wheel_segment'), 4, ['joint', 'peg'], 'На колесо нужно четыре одинаковых секции, соединения и втулки.'],
  ['wheel', 'Постоянное вращение', create('water_wheel'), 1, ['segment', 'shaft', 'bushing'], 'Установи колесо в текущей воде и подключи вал.'],
  ['large_wheel', 'Запас по нагрузке', create('large_water_wheel'), 1, ['wheel'], 'Большое колесо требует дополнительного обода из четырёх секций.'],
  ['create_bearing', 'Опора вращения', create('mechanical_bearing'), 1, ['iron_plate', 'casing', 'cogwheel'], 'Собери опору на валу со стандартными железными листами. Она понадобится для ветрового привода.', true],
  ['create_windmill', 'Ветровой привод', create('windmill_bearing'), 1, ['large_wheel', 'create_bearing', 'gearbox'], 'Установи узел на открытом месте. Закрепи минимум восемь парусов на вращающейся раме и запусти подшипник.', true],
  ['create_sails', 'Паруса для ротора', create('white_sail'), 8, ['create_windmill', 'belt_blank'], 'На каждый парус нужны шерсть, тканая основа и жёсткая рама. Разнеси паруса по лопастям, чтобы ротор было удобно расширять.', true],
  ['gearbox', 'Поворот оси', create('gearbox'), 1, ['cogwheel', 'casing', 'shaft'], 'Поставь редуктор там, где линия меняет направление.'],
  ['vertical_gearbox', 'Вертикальная передача', create('vertical_gearbox'), 1, ['gearbox'], 'Переориентируй готовый редуктор, когда меняешь плоскость привода.'],
  ['saw_teeth', 'Зубья для полотна', ks('saw_teeth'), 1, ['hand_plate', 'rivets'], 'Выкуй зубья на каменном молоте.'],
  ['saw_blade', 'Сборное полотно', ks('saw_blade'), 1, ['saw_teeth'], 'Шесть комплектов зубьев и крепёж собираются в полотно.'],
  ['saw', 'Пилорама', create('mechanical_saw'), 1, ['saw_blade', 'casing', 'wheel', 'drill'], 'Подведи вращение к пиле и поставь её режущей стороной вверх. Сделай ножом две доски из бревна и выставь одну из них в фильтре пилы. Затем брось бревно той же породы на полотно. Получишь четыре доски.'],
  ['millstone', 'Дробление на валу', create('millstone'), 1, ['cogwheel', 'casing', 'wheel'], 'Один кусок меди, железа или олова теперь даёт одну дроблёную порцию.'],
  ['depot', 'Подача под пресс', create('depot'), 1, ['casing', 'joint'], 'Депо удерживает заготовку под рабочей головкой пресса.'],
  ['press', 'Пресс с ручной подгонкой', create('mechanical_press'), 1, ['hand_plate', 'casing', 'depot', 'wheel'], 'Грубые пластины и втулки входят в пресс. Стандартный лист получится из одного слитка.'],
  ['iron_plate', 'Первый стандартный лист', gt('iron_plate'), 1, ['press', 'iron'], 'Пропусти железный слиток через пресс на депо. Это стандартная пластина для железных крафтов.'],
  ['iron_pickaxe', 'Железная кирка для глубокой добычи', mc('iron_pickaxe'), 1, ['iron_plate', 'rivets', 'handle', 'binding'], 'Собери кирку из трёх железных листов, двух заклёпок, рукояти и крепления. Возьми её к жиле редстоуна.'],
  ['copper_plate', 'Тонкая медь', gt('copper_plate'), 1, ['press', 'copper'], 'Используй тот же пресс для медного слитка.'],
  ['basin', 'Объём под смешивание', create('basin'), 1, ['hand_plate', 'lining', 'strap', 'rivets'], 'Для чаши нужны три грубые железные пластины, две обожжённые футеровки, медная лента и три заклёпки.'],
  ['whisk', 'Венчик с втулкой', create('whisk'), 1, ['shaft', 'hand_plate', 'rivets', 'bushing'], 'Собери венчик из четырёх грубых железных пластин, вала, втулки и заклёпки.'],
  ['mixer', 'Первое смешивание', create('mechanical_mixer'), 1, ['basin', 'whisk', 'large_cogwheel', 'wheel', 'casing'], 'Оставь один блок между чашей и смесителем. Две последовательные пары из большой ведущей и малой ведомой шестерён поднимут скорость малого водяного колеса с 8 до 32 об/мин.'],
  ['create_alloy_batch', 'Серийный замес композита', create('andesite_alloy'), 8, ['mixer', 'alloy', 'copper'], 'За цикл смеситель выдаёт две порции композита. Подай четыре андезита, три медных слитка, футеровку, отощитель и 250 мБ воды.', true],
  ['fan', 'Промывка потоком воздуха', create('encased_fan'), 1, ['hand_plate', 'casing', 'wheel'], 'Продувай дроблёную руду через воду. Концентрат и хвосты выходят вместе.'],
  ['belt_blank', 'Тканая основа ремня', ks('woven_drive_belt'), 4, ['binding'], 'Плетёные шнуры и крепления дают четыре основы для одного ремня.'],
  ['belt', 'Внутрицеховая подача', create('belt_connector'), 1, ['belt_blank', 'shaft', 'rivets'], 'Собери ремень из четырёх тканых основ, шнуров и заклёпок. Соедини два параллельных вала.'],
  ['create_funnel', 'Загрузка с ленты', create('andesite_funnel'), 2, ['belt', 'copper_plate', 'alloy'], 'Собери две воронки для ввода и вывода. Оставь место под сундуки и разведи сырьё и готовую продукцию.', true],
  ['create_water_line', 'Медные трубы', create('fluid_pipe'), 4, ['copper_plate', 'strap', 'alloy'], 'Собери медные трубы для подачи воды. Эти трубы используются в обвязке Create.', true],
  ['create_water_pump', 'Механический насос', create('mechanical_pump'), 1, ['create_water_line', 'belt_blank', 'cogwheel', 'wheel'], 'Подключи вал к насосу. Проверь направление потока и отведи воду в отдельный буфер.', true],
  ['create_water_buffer', 'Водяной буфер Create', create('fluid_tank'), 1, ['create_water_pump', 'lining', 'rivets'], 'Собери бак из бочки, листов и футеровки. Наполни его от насоса и оставь место под выход.', true],
  ['tin_grit', 'Добыча олова', ks('tin_grit'), 1, ['millstone'], 'Ищи оловянные руды и касситерит в жилах GregTech.'],
  ['tin_washed', 'Оловянный концентрат', ks('washed_tin_grit'), 1, ['tin_grit'], 'Промой олово вручную или на линии с вентилятором.'],
  ['tin_charge', 'Шихта под чистое олово', ks('tin_charge'), 1, ['tin_washed', 'crucible', 'lining', 'charcoal'], 'На отдельную плавку олова идут три концентрата, две порции древесного угля, тигель и футеровка.'],
  ['tin_ingot', 'Первое олово', gt('tin_ingot'), 1, ['tin_charge', 'kiln'], 'Оловянный слиток нужен для будущей электрической линии.'],
  ['bronze_charge', 'Шихта на бронзу', ks('bronze_charge'), 1, ['mixer', 'tin_washed', 'copper_washed', 'crucible'], 'Загрузи в чашу три медных концентрата, оловянный концентрат, уголь и тигель. Подай 500 мБ воды и включи смеситель.'],
  ['bronze', 'Первая бронза', gt('bronze_ingot'), 1, ['bronze_charge', 'kiln'], 'Обожги бронзовую шихту. Основной цикл первой печи занимает 120 секунд.'],
  ['bronze_plate', 'Первая бронзовая пластина', gt('bronze_plate'), 1, ['bronze', 'press'], 'Первым проходом пресса сформуй пластину.'],
  ['blank', 'Штамп под котёл', ks('stamped_bronze_blank'), 1, ['bronze_plate', 'basin', 'press'], 'Положи в чашу две бронзовые пластины, подай 250 мБ воды и уплотни прессом Create. Выход один штамп.']
])

chapter('drawers', 'Складские ящики', drawers('oak_full_drawers_1'), [
  ['drawer_runner_blank', 'Заготовка направляющих', ks('drawer_runner_blank'), 1, ['hand_plate', 'rivets', 'abrasive'], 'Собери четыре кованые пластины на втулке с заклёпками. Абразивом подгони поверхности.'],
  ['drawer_slides', 'Прокат направляющих', ks('drawer_slide'), 4, ['drawer_runner_blank', 'press'], 'Пресс Create выдаёт две направляющие за удар. Поставь рядом отдельное депо для заготовок.'],
  ['drawer_cartridge', 'Выдвижная кассета', ks('drawer_cartridge'), 2, ['drawer_slides', 'joint'], 'Соедини направляющую с досками, нагелями, кованой петлёй и шнуром.'],
  ['drawer_single', 'Первый складской ящик', drawers('oak_full_drawers_1'), 1, ['drawer_cartridge'], 'Вставь кассету в дубовую обшивку и добавь направляющую с петлёй. Такой ящик хранит один вид предметов.'],
  ['drawer_double', 'Два отделения', drawers('oak_full_drawers_2'), 1, ['drawer_single', 'drawer_slides'], 'Две направляющие делят корпус на два отделения с общим запасом места.'],
  ['drawer_quad', 'Четыре отделения', drawers('oak_full_drawers_4'), 1, ['drawer_double'], 'Две кассеты, две направляющие и две петли дают четыре отделения для мелких деталей.'],
  ['drawer_half', 'Полуглубина', drawers('oak_half_drawers_1'), 1, ['drawer_single'], 'Замени доски корпуса плитами. Поставь низкий ящик там, где нужен проход.'],
  ['drawer_trim', 'Складская обвязка', drawers('oak_trim'), 8, ['drawer_single', 'rivets'], 'Обвязка соединяет ящики без свободного гнезда хранения. За крафт выходят две секции.'],
  ['drawer_key', 'Ключ фиксации ячейки', drawers('drawer_key'), 1, ['drawer_single', 'drawer_slides'], 'Нажми ключом по заполненному ящику, чтобы закрепить тип предмета после опустошения.'],
  ['drawer_upgrade_base', 'Оснастка для расширения', drawers('upgrade_template'), 2, ['drawer_cartridge', 'drawer_slides'], 'На рамку улучшения уходят четыре направляющие, кассета и крепёж.'],
  ['drawer_frame_table', 'Стол облицовки', drawers('framing_table'), 1, ['drawer_single', 'saw', 'drawer_slides'], 'Для корпуса стола нужны ящик, две пилы в разобранном виде и направляющие. Используй штатный интерфейс стола, чтобы облицевать готовый ящик.'],
  ['drawer_copper', 'Медное расширение склада', drawers('copper_storage_upgrade'), 1, ['drawer_upgrade_base', 'assembler'], 'Сборщик LV потребляет медные листы, кассеты, схему и стальную раму.'],
  ['drawer_iron', 'Железное расширение склада', drawers('iron_storage_upgrade'), 1, ['drawer_copper', 'iron_plate'], 'Железное улучшение строится из медного. На второй ящик изготовь полный комплект заново.'],
  ['drawer_fill', 'Индикация заполнения', drawers('fill_level_upgrade'), 1, ['drawer_upgrade_base', 'lv_circuit_batch'], 'Через сигнальное улучшение подключи схему LV и стеклянную колбу.'],
  ['drawer_selector', 'Адресация складских ячеек', ks('drawer_selector'), 2, ['drawer_cartridge', 'mv_circuit_batch', 'chemical_grade_seal'], 'Сборщик MV соединяет две схемы, кассеты, контакты и раму. Подай 180 мБ смазки.'],
  ['drawer_controller', 'Контроллер общего склада', drawers('controller'), 1, ['drawer_selector', 'drawer_single', 'nether_mv_conveyor'], 'Из двух ящиков и селектора собери контроллер. Подключи к нему ряд ящиков и обвязку.'],
  ['drawer_slave', 'Второй вход в склад', drawers('controller_slave'), 1, ['drawer_controller', 'drawer_key'], 'На выносной порт уходит ещё один селектор, ящик, ключ подключения и конвейер.'],
  ['drawer_compact_2', 'Ящик для двух степеней упаковки', drawers('compacting_drawers_2'), 1, ['drawer_selector', 'drawer_double', 'nether_mv_piston'], 'Два поршня MV и селектор уплотняют уже разрешённые пары предметов с обратной распаковкой.'],
  ['drawer_compact_3', 'Третья степень упаковки', drawers('compacting_drawers_3'), 1, ['drawer_compact_2'], 'Два селектора, два поршня и две рамы расширяют предыдущий корпус. Сверь пары упаковки в JEI.'],
  ['drawer_push', 'Выдача в линию', drawers('push_upgrade'), 1, ['drawer_upgrade_base', 'assembler'], 'В сборщике установи два поршня LV на кассету с воронкой и магнитным якорем.'],
  ['drawer_pull', 'Автоматическая подача', drawers('pull_upgrade_2'), 1, ['drawer_selector', 'nether_mv_conveyor'], 'Сначала собери улучшение подачи LV. Затем добавь два конвейера MV, селектор и раму.'],
  ['drawer_gold', 'Золотое усиление', drawers('gold_storage_upgrade'), 1, ['drawer_iron', 'mv_assembler'], 'Добавь четыре золотых листа, две кассеты, схему MV и раму к железному улучшению.'],
  ['drawer_emerald', 'Изумрудное усиление', drawers('emerald_storage_upgrade'), 1, ['drawer_gold'], 'На золотой каркас уйдут четыре изумруда и новая пара кассет.'],
  ['drawer_diamond', 'Алмазное усиление HV', drawers('diamond_storage_upgrade'), 1, ['drawer_emerald', 'hv_assembler'], 'Добавь четыре алмаза и схему HV. Сборщик работает при 480 EU/t.'],
  ['drawer_void', 'Контроль переполнения HV', drawers('void_upgrade'), 1, ['drawer_upgrade_base', 'hv_piston'], 'Поршень, дугогаситель и обсидиан превращают стандартную рамку в сброс переполнения. Проверь настройки перед подачей дорогих деталей.', true],
  ['drawer_remote', 'Выносная связь HV', drawers('remote_upgrade'), 1, ['drawer_slave', 'hv_assembler'], 'Из порта, эмиттера и схемы собери привязку склада. Используй для удалённых стеллажей.', true],
  ['drawer_netherite', 'Титановая обвязка EV', drawers('netherite_storage_upgrade'), 1, ['drawer_diamond', 'ev_foundry_accepted'], 'Закончи обсидиановое усиление. В сборщике EV добавь незерит, титановые листы и протокол EV.', true]
])

chapter('steam', 'IV. От вращения к пару', gt('lp_steam_solid_boiler'), [
  ['seal', 'Герметичный стык', ks('sealed_boiler_joint'), 1, ['blank', 'lining', 'rivets', 'press', 'basin'], 'Уплотни в чаше четыре штампа, две футеровки, два шнура и заклёпку. Подай 500 мБ воды.'],
  ['bronze_casing', 'Корпус под пар', gt('bronze_machine_casing'), 1, ['seal', 'bronze_plate'], 'Детали после пресса и герметичный стык образуют корпус.'],
  ['firebox', 'Топочная камера', gt('bronze_firebox_casing'), 1, ['bronze_casing', 'kiln'], 'Топочная камера требует две футерованные печи.'],
  ['bronze_pipe', 'Паропровод', gt('bronze_small_fluid_pipe'), 12, ['bronze_plate', 'blank', 'rivets'], 'Шесть бронзовых пластин, штамп и заклёпка дают две трубы. Восемь труб уйдут на котёл и четыре станка. Остальные оставь на обвязку.'],
  ['boiler', 'Первый котёл GregTech', gt('lp_steam_solid_boiler'), 1, ['firebox', 'bronze_pipe', 'seal'], 'На сборку нужны две бронзовые трубы и отдельный герметичный стык. Заполни холодный котёл водой перед загрузкой топлива. Если котёл выкипел, дождись остывания перед новой подачей воды.'],
  ['steam_mill', 'Паровое дробление', gt('lp_steam_macerator'), 1, ['boiler', 'millstone'], 'Мельница Create входит в паровую дробилку. Кроме руды, она измельчает древесный уголь для первых резисторов.'],
  ['steam_hammer', 'Паровой молот', gt('lp_steam_forge_hammer'), 1, ['boiler', 'press'], 'Один пресс Create уйдёт в сборку. Оставь второй пресс в работе.'],
  ['steam_extractor', 'Паровой экстрактор', gt('lp_steam_extractor'), 1, ['boiler', 'fan', 'copper_plate', 'seal'], 'Добавь вентилятор Create, четыре медных листа и герметичный стык. Подключи пар и оставь выхлоп открытым. Экстрактор перерабатывает смолу для изоляции.'],
  ['steam_compressor', 'Паровой компрессор', gt('lp_steam_compressor'), 1, ['boiler', 'press', 'seal'], 'В компрессор входит пресс Create. Подготовь пар для прессования волокна.'],
  ['steam_wood_drum', 'Бочка для запаса воды', gt('wood_drum'), 1, ['boiler', 'joint', 'rivets', 'resin', 'barrel'], 'Закрепи деревянную бочку обвязкой из досок, заклёпок и липкой смолы. Потом она войдёт в бронзовый барабан.'],
  ['steam_bronze_drum', 'Буфер для пара', gt('bronze_drum'), 1, ['steam_wood_drum', 'bronze_pipe', 'seal', 'converter_mallet'], 'Подведи пар от котла к бронзовому барабану. Трубу на турбину подсоедини снизу. Накопи пар, затем нажми по барабану ПКМ деревянной киянкой GregTech без Shift, чтобы включить выдачу.'],
  ['steam_wide_pipe', 'Магистраль большего сечения', gt('bronze_normal_fluid_pipe'), 2, ['steam_bronze_drum'], 'Собери трубу большего сечения из двух малых труб, пластины, герметичного стыка и заклёпки.', true],
  ['steam_furnace', 'Печь на паре', gt('lp_steam_furnace'), 1, ['boiler', 'firebox', 'seal'], 'Собери отдельную паровую печь для обжига. Оставь выхлопную сторону открытой и проверь доступ к топке котла.', true],
  ['steam_alloy_smelter', 'Паровая печь сплавов', gt('lp_steam_alloy_smelter'), 1, ['steam_furnace', 'crucible', 'bronze_pipe'], 'Установи обожжённый тигель в усиленную паровую печь. Собери вторую печь, если нужна отдельная линия обжига.', true],
  ['case_reserve', 'Ремонтный резерв', gt('bronze_machine_casing'), 8, ['boiler'], 'Собери отдельный запас из восьми корпусов под восстановление линии.', true],
  ['pipe_reserve', 'Запас труб на разрыв', gt('bronze_small_fluid_pipe'), 32, ['boiler'], 'Держи на складе 32 трубы, чтобы не останавливать выпуск ради ремонта.', true],
  ['blank_reserve', 'Партия штампов LV', ks('stamped_bronze_blank'), 32, ['blank', 'lv_hull'], 'Накопи 32 штампа для следующих корпусов и тяжёлых компонентов.', true]
])

chapter('lv', 'V. Первое электричество', gt('basic_electronic_circuit'), [
  ['resin', 'Липкая смола', gt('sticky_resin'), 4, ['axe'], 'Найди каучуковое дерево и собери липкую смолу для пробной партии.'],
  ['insulating_gum', 'Паровая вытяжка', ks('insulating_gum'), 4, ['resin', 'steam_extractor'], 'Экстрактор превращает одну липкую смолу в две порции связующего.'],
  ['impregnated_fibre', 'Пропитка волокна', ks('impregnated_fibre'), 1, ['insulating_gum', 'cord'], 'Три волокна, две порции смолы и шнур дают одну заготовку изоляции.'],
  ['pressed_insulation', 'Прессование изоляции', ks('pressed_insulation'), 2, ['impregnated_fibre', 'steam_compressor'], 'Пропусти пропитанное волокно через паровой компрессор. Получишь две полосы изоляции.'],
  ['tin_plate', 'Лист из олова', gt('tin_plate'), 2, ['tin_ingot', 'press'], 'Сделай два оловянных листа на прессе Create.'],
  ['tin_wire_blank', 'Разметка оловянного листа', ks('tin_wire_blank'), 1, ['tin_plate', 'chisel'], 'Зубило надрезает листы. Керамическая вставка поддерживает заготовку.'],
  ['tin_wire', 'Оловянная проволока', gt('tin_single_wire'), 4, ['tin_wire_blank', 'press'], 'Пресс Create даёт четыре проволоки с размеченной заготовки.'],
  ['tin_cable', 'Изолированный провод', gt('tin_single_cable'), 4, ['pressed_insulation', 'tin_wire'], 'Две полосы прессованной изоляции и шнур на одну проволоку. Сделай запас для силовой линии.'],
  ['copper_contacts', 'Медные контакты', ks('copper_contact_strip'), 2, ['copper_plate', 'press'], 'Прокатай медную пластину в две контактные полосы на прессе Create.'],
  ['lv_resin_board', 'Основа печатной платы', gt('resin_circuit_board'), 1, ['insulating_gum', 'lining'], 'Проклей деревянную основу смолой и укрепи её керамической вставкой.'],
  ['lv_circuit_laminate', 'Слои платы', ks('circuit_laminate'), 1, ['lv_resin_board', 'copper_contacts', 'pressed_insulation'], 'Уложи медные дорожки на основу со смолой и изоляцией.'],
  ['lv_printed_board', 'Опрессованная плата', gt('resin_printed_circuit_board'), 1, ['lv_circuit_laminate', 'press'], 'Пресс Create соединяет слои. Оставь место на столе для монтажа деталей.'],
  ['lv_charcoal_powder', 'Порошок для резисторов', gt('charcoal_dust'), 2, ['steam_mill', 'charcoal'], 'Измельчи древесный уголь в паровой дробилке.'],
  ['lv_resistor_core', 'Угольный сердечник', ks('carbon_resistor_core'), 1, ['lv_charcoal_powder', 'insulating_gum'], 'Свяжи угольный порошок смолой и добавь керамику.'],
  ['lv_resistors', 'Два резистора', gt('resistor'), 2, ['lv_resistor_core', 'tin_wire', 'copper_contacts', 'pressed_insulation'], 'Установи оловянные выводы и обожми изоляцию.'],
  ['lv_glass_blank', 'Стеклянная колба', ks('glass_tube_blank'), 1, ['panes', 'copper_contacts'], 'Стеклянные панели идут в колбу с керамической опорой и медным контактом.'],
  ['lv_vacuum_tube', 'Вакуумная лампа', gt('vacuum_tube'), 1, ['lv_glass_blank', 'tin_wire', 'pressed_insulation'], 'Собери колбу, выводы, контактные полосы и изолирующую втулку.'],
  ['lv_solder', 'Оловянный припой', ks('tin_solder_preform'), 2, ['tin_wire', 'copper_contacts', 'insulating_gum'], 'Две проволоки, контактная лента и смола дают две заготовки припоя.'],
  ['lv_soldering_iron', 'Медный паяльник', ks('bench_soldering_iron'), 1, ['copper_contacts', 'pressed_insulation', 'handle'], 'Медное жало закрепи в изолированной рукояти. Паяльник изнашивается при монтаже.'],
  ['lv_hand_circuit', 'Первая схема LV', gt('basic_electronic_circuit'), 1, ['lv_printed_board', 'lv_resistors', 'lv_vacuum_tube', 'lv_solder', 'lv_soldering_iron'], 'Спаяй первую схему на верстаке. Ручная пайка расходует два припоя и даёт одну схему.'],
  ['lv_casing', 'Оболочка LV', gt('lv_machine_casing'), 1, ['iron_plate', 'blank', 'pressed_insulation'], 'Железные пластины, бронзовые штампы и изоляция держат форму оболочки.'],
  ['lv_hull', 'Корпус первого LV', gt('lv_machine_hull'), 1, ['lv_casing', 'tin_cable', 'blank'], 'Четыре штампованные заготовки, две заклёпки, два кабеля и оболочка LV.'],
  ['lv_stator', 'Обмотка статора', ks('wound_stator'), 1, ['copper_contacts', 'iron_plate', 'pressed_insulation'], 'Собери железное кольцо, медные полосы и изоляцию вокруг вала.'],
  ['lv_redstone_stock', 'Редстоун для первого двигателя', mc('redstone'), 4, ['iron_pickaxe', 'torches', 'kiln'], 'Найди жилу редстоуна GregTech и добудь руду железной киркой. Переплавь один кусок сырого редстоуна в печи, получишь пять единиц пыли.'],
  ['lv_armature', 'Намагничивание якоря', ks('magnetic_armature'), 1, ['shaft', 'iron_plate', 'blank', 'lv_redstone_stock'], 'Положи вал в центр. Добавь четыре порции редстоуна, два железных листа и две штампованные бронзовые заготовки.'],
  ['motor', 'Двигатель LV', gt('lv_electric_motor'), 1, ['lv_stator', 'lv_armature', 'tin_cable'], 'Статор, якорь, два кабеля и корпусные детали дают двигатель. Он нужен и в турбине, и в компрессоре PneumaticCraft.'],
  ['lv_conveyor', 'Подающий модуль', gt('lv_conveyor_module'), 2, ['motor', 'belt_blank', 'tin_cable'], 'Два подающих модуля нужны первому сборщику. Для каждого требуется отдельный двигатель.'],
  ['lv_rotor_blank', 'Сборка ротора', ks('turbine_rotor_blank'), 1, ['blank', 'rivets', 'shaft'], 'Закрепи бронзовые лопатки и заклёпки на оси.'],
  ['lv_balanced_rotor', 'Выверка ротора', ks('balanced_turbine_rotor'), 1, ['lv_rotor_blank', 'steam_hammer'], 'Подключи паровой молот к первому котлу и вывери ротор. Лопатки садятся под ударом перед сборкой турбины.'],
  ['turbine', 'Первая электрическая турбина', gt('lv_steam_turbine'), 1, ['lv_hull', 'boiler', 'steam_bronze_drum', 'lv_balanced_rotor', 'lv_hand_circuit', 'motor'], 'Подключи кабель LV или поставь сборщик у передней грани турбины. Она выдаёт 32 EU/t и расходует 640 мБ пара за 10 тиков. Котёл низкого давления на полном нагреве даёт до 60 мБ за то же время. Для коротких запусков копи пар в барабане. Для непрерывной работы нужна подача как минимум от 11 таких котлов.'],
  ['assembler', 'Серийная сборка', gt('lv_assembler'), 1, ['turbine', 'lv_conveyor', 'lv_hand_circuit', 'lv_hull'], 'Сборщик использует один припой на две схемы при 16 EU/t. Подай питание от турбины.'],
  ['lv_circuit_batch', 'Партия из 16 схем', gt('basic_electronic_circuit'), 16, ['assembler', 'copper_contacts', 'pressed_insulation'], 'На две схемы подай две печатные платы, четыре резистора, две лампы, четыре проволоки, по два припоя, контакта и изоляции. Нужны 250 мБ воды и 20 секунд при 16 EU/t.']
])

chapter('industrial_supply', 'VI. Кокс, сталь и тяжёлый пресс', ie('blastbrick'), [
  ['ie_iron', 'Стык трёх производств', ie('component_iron'), 1, ['lv_hull', 'gearbox', 'iron_plate'], 'Корпус GregTech, редуктор Create и стандартные железные пластины дают компонент Immersive Engineering.'],
  ['ie_hammer', 'Молот инженера', ie('hammer'), 1, ['ie_iron', 'hammer'], 'Прокуй железную голову с железным компонентом IE. Этим молотом собираются коксовая печь, домна IE и тяжёлый пресс.'],
  ['fireclay_charge', 'Шамотная масса', ks('fireclay_charge'), 4, ['lining', 'tailings', 'temper'], 'Вымеси глину с песчаным отощителем, толчёной футеровкой и рудными хвостами.'],
  ['coke_brick_blank', 'Прессование сырца', ks('coke_brick_blank'), 8, ['fireclay_charge', 'press'], 'Пресс Create даёт два сырца из порции массы. Часть отложи на доменный кирпич.'],
  ['coke_bricks', 'Кладка коксовой печи', ie('cokebrick'), 27, ['coke_brick_blank', 'ie_hammer', 'kiln'], 'Обожги сырцы и собери куб 3×3×3. Ударь инженерным молотом по центру передней грани. Оставь отвод под креозот.'],
  ['foundry_coal', 'Топливо из шахты', mc('coal'), 12, ['coke_bricks'], 'Найди угольную жилу. Древесный уголь понадобится в виде порошка, каменный пойдёт в шихту.'],
  ['coking_charge', 'Шихта для коксования', ks('coking_charge'), 2, ['foundry_coal', 'lv_charcoal_powder', 'insulating_gum', 'basin', 'press'], 'Поставь чашу под пресс Create. Уплотни три куска каменного угля, две порции древесноугольного порошка и связующее.'],
  ['first_coke', 'Первый кокс', ie('coal_coke'), 4, ['coking_charge', 'coke_bricks'], 'Цикл коксования занимает две минуты и даёт два куска кокса и 750 мБ креозота. Откачивай жидкость, чтобы печь продолжала работать.'],
  ['lv_creosote', 'Отвод креозота', ie('creosote_bucket'), 1, ['first_coke', 'create_water_pump'], 'Наполни ведро из коксовой печи. Для постоянной подачи выдели насос Create, отдельную трубу и ёмкость. Креозот пригодится при замесе футеровки.'],
  ['coke_buffer', 'Склад кокса', ie('coal_coke'), 32, ['first_coke'], 'Держи отдельные запасы кокса для шихты и топки. Партия пригодится при первом пуске стальной линии.', true],
  ['calcite', 'Кальцит на флюс', mc('calcite'), 8, ['millstone'], 'Проверь кольца аметистовых жеод и каменные горные склоны. Для флюса также подходит сырой кальцит GregTech.', true],
  ['lime_flux', 'Размол известкового флюса', ks('lime_flux'), 8, ['millstone', 'first_coke'], 'На мельнице Create блок кальцита даёт две порции флюса, а кусок сырого кальцита одну.'],
  ['refractory_brick_blank', 'Плотный доменный сырец', ks('refractory_brick_blank'), 8, ['coke_brick_blank', 'lime_flux', 'mortar'], 'Добавь известковый флюс, шамот и раствор. Обожги сырец при более длительном цикле.'],
  ['blast_bricks', 'Первая домна IE', ie('blastbrick'), 27, ['refractory_brick_blank', 'ie_hammer'], 'Сложи второй куб 3×3×3 и ударь инженерным молотом по центру передней грани. Это домна на коксе.'],
  ['steel_charge', 'Подготовка стальной шихты', ks('steel_furnace_charge'), 1, ['bloom', 'iron', 'lime_flux', 'first_coke', 'crucible'], 'Загрузи крицу, два слитка железа, угольный порошок, флюс и кокс в обожжённый тигель.'],
  ['first_steel', 'Первая стальная плавка', gt('steel_ingot'), 1, ['steel_charge', 'blast_bricks'], 'Один тигель шихты даёт один стальной слиток и шлак. На цикл уходит 110 секунд и почти два куска кокса в топке.'],
  ['foundry_slag', 'Приёмка доменного шлака', ie('slag'), 4, ['first_steel'], 'Отложи шлак для шамотных вкладышей. Следи, чтобы выходной слот домны не был забит.'],
  ['steel_press_blank', 'Ковка заготовки', ks('steel_press_blank'), 2, ['first_steel', 'rivets', 'iron_plate'], 'На одну заготовку идут два слитка, два железных листа и заклёпка. Каменный молот изнашивается.'],
  ['steel_plate', 'Первые стальные листы', gt('steel_plate'), 4, ['steel_press_blank', 'press'], 'Лёгкий пресс Create выдаёт две пластины из кованой заготовки. Они нужны, чтобы построить тяжёлый пресс.'],
  ['ie_steel', 'Тяжёлый стальной компонент', ie('component_steel'), 1, ['ie_iron', 'steel_plate', 'seal'], 'Железный компонент, стальные листы, втулки и котельное соединение обрабатываются на молоте.'],
  ['ie_scaffolding', 'Станина тяжёлого пресса', ie('steel_scaffolding_standard'), 2, ['steel_plate', 'shaft'], 'Собери стальные леса под станину. Для точной схемы открой инженерное руководство IE.'],
  ['ie_press_piston', 'Рабочий ход', mc('piston'), 1, ['iron_plate', 'bushing', 'shaft', 'joint'], 'Подготовь поршень с железным штоком и втулками. В прессе поршень смотрит вниз.'],
  ['ie_conveyor', 'Подача на матрицу', ie('conveyor_basic'), 2, ['lv_conveyor', 'steel_plate'], 'Один модуль GregTech и ремни дают три транспортёра. Два идут в пресс.'],
  ['ie_redstone_control', 'Управление ходом пресса', ie('rs_engineering'), 1, ['lv_hand_circuit', 'ie_iron', 'copper_contacts'], 'Собери блок управления с платой LV. Не оставляй на входе активный сигнал, если пресс остановился.'],
  ['ie_press_body', 'Тяжёлый силовой блок', ie('heavy_engineering'), 1, ['ie_steel', 'lv_hull', 'ie_redstone_control', 'gearbox'], 'Посади редукторы и стальной компонент IE на корпус GregTech. Это силовой блок пресса.'],
  ['ie_press_mold', 'Матрица под лист и раму', ie('mold_plate'), 1, ['steel_press_blank', 'steel_plate', 'bushing'], 'Собери матрицу. Она будет формовать рамы и железные заготовки в одном станке.'],
  ['converter_mallet', 'Деревянная киянка GregTech', gt('wood_mallet'), 1, ['joint', 'pressed_insulation'], 'Собери киянку из досок, деревянного соединения, вязаного крепления и изоляции. Киянкой можно включить вывод пара из барабана и переключить режим преобразователя.'],
  ['ie_fe_converter', 'Питание тяжёлого пресса', gt('lv_1a_energy_converter'), 1, ['turbine', 'ie_redstone_control', 'steel_plate', 'converter_mallet'], 'Киянкой GregTech переключи преобразователь в режим EU → FE. Подведи LV к входу, а сторону выхода FE соедини с энергетическим портом пресса.'],
  ['pressed_steel_frame', 'Первый удар тяжёлого пресса', ks('pressed_steel_frame'), 1, ['ie_press_body', 'ie_press_mold', 'ie_fe_converter', 'ie_conveyor', 'ie_scaffolding', 'ie_press_piston'], 'Собери пресс по руководству IE и активируй его молотом. Установи матрицу пластин и подай кованую заготовку. На одну раму уйдёт 6000 FE.'],
  ['foundry_frame_batch', 'Партия рам для горячего цеха', ks('pressed_steel_frame'), 32, ['pressed_steel_frame'], 'Оставь запас: на 16 нагревателей уйдут 32 рамы, а корпус и люки домны потребуют ещё.', true],
  ['ie_reserve', 'Склад тяжёлого цеха', ie('component_steel'), 8, ['ie_steel'], 'Отдельная партия под ремонт компрессорной станции.', true]
])

chapter('blast_furnace', 'VII. Электрическая домна', gt('electric_blast_furnace'), [
  ['furnace_lining_insert', 'Съёмная футеровка', ks('furnace_lining_insert'), 2, ['foundry_slag', 'blast_bricks', 'mortar', 'lv_creosote', 'mixer'], 'Смешай в чаше Create доменный кирпич, шлак, шамот и раствор с 250 мБ креозота. За цикл получишь два вкладыша.'],
  ['lv_alloy_smelter', 'Плавильня сплавов LV', gt('lv_alloy_smelter'), 1, ['pressed_steel_frame', 'furnace_lining_insert', 'motor', 'turbine'], 'Стальные рамы и шамотный вкладыш удерживают горячую часть. Плавильня работает от линии LV.'],
  ['crushed_nickel', 'Дробление никелевой руды', gt('crushed_nickel_ore'), 2, ['lv_shop_macerator'], 'Найди жилу никеля. Пропусти сырой никель через электрическую дробилку. Концентрат пойдёт в нагреватели домны.'],
  ['nickel_concentrate', 'Промывка никеля', ks('nickel_concentrate'), 2, ['crushed_nickel', 'fan'], 'Вентилятор Create с водой отделяет никелевый концентрат от хвостов.'],
  ['heater_alloy_charge', 'Тигель медно-никелевой шихты', ks('heater_alloy_charge'), 1, ['nickel_concentrate', 'copper_contacts', 'crucible'], 'Собери концентрат с листовой медью и контактными полосами в тигле.'],
  ['heater_ribbon', 'Лента нагревателя', ks('heater_ribbon'), 4, ['heater_alloy_charge', 'lv_alloy_smelter'], 'Один цикл плавильни LV при 24 EU/t даёт четыре ленты.'],
  ['ebf_coils', 'Два кольца нагревателей', gt('cupronickel_coil_block'), 16, ['heater_ribbon', 'pressed_steel_frame', 'furnace_lining_insert', 'pressed_insulation'], 'Намотай четыре ленты на каждый блок нагревателя. Нужны два яруса по восемь одинаковых катушек.'],
  ['ebf_casings', 'Теплостойкий кожух', gt('heatproof_machine_casing'), 12, ['pressed_steel_frame', 'furnace_lining_insert', 'steel_plate'], 'Запас на низ и крышу домны. Часть мест займут контроллер, люки и шины.'],
  ['ebf_energy', 'Ввод 32 EU', gt('lv_energy_input_hatch'), 1, ['ebf_casings', 'turbine', 'tin_cable'], 'Подведи питание LV к этому вводу. Первой плавке нужны 28 EU/t, поэтому делай кабель коротким.'],
  ['ebf_input', 'Приём шихты', gt('lv_input_bus'), 1, ['ebf_casings', 'lv_conveyor'], 'Установи входную шину вместо блока кожуха на нижнем или верхнем ярусе.'],
  ['ebf_output', 'Выдача болванок и шлака', gt('lv_output_bus'), 1, ['ebf_casings', 'lv_conveyor'], 'Выходная шина должна иметь свободное место для болванки и шлака.'],
  ['ebf_maintenance', 'Окно обслуживания', gt('maintenance_hatch'), 1, ['ebf_casings', 'ie_hammer'], 'Люк даст доступ к обслуживанию домны. Если контроллер показывает неисправности, устрани их до плавки.'],
  ['ebf_muffler', 'Отвод пыли и дыма', gt('lv_muffler_hatch'), 1, ['ebf_casings', 'fan'], 'Вентиляционный люк ставится по центру крыши. Оставь снаружи свободный выход.'],
  ['ebf_controller', 'Электрическая домна 3×4×3', gt('electric_blast_furnace'), 1, ['ebf_coils', 'ebf_energy', 'ebf_input', 'ebf_output', 'ebf_maintenance', 'ebf_muffler'], 'Контроллер в центре нижнего ряда. Два пустых внутри кольца из катушек, теплостойкие низ и крыша. Проверь схему структуры в интерфейсе GregTech.'],
  ['crushed_bauxite', 'Разведка боксита', gt('crushed_bauxite_ore'), 4, ['lv_shop_macerator'], 'Найди жилу боксита GregTech и пропусти сырой боксит через электрическую дробилку.'],
  ['washed_bauxite', 'Гравитационная промывка боксита', ks('washed_bauxite'), 4, ['crushed_bauxite', 'fan'], 'Промой дроблёный боксит вентилятором. Хвосты идут обратно на склад шамота.'],
  ['alumina_charge', 'Глинозёмная шихта', ks('alumina_charge'), 1, ['washed_bauxite', 'lime_flux', 'first_coke', 'furnace_lining_insert', 'assembler'], 'Подай в сборщик четыре концентрата, флюс, кокс, тигель, вкладыш и 250 мБ воды. Сборщик работает на 24 EU/t.'],
  ['hot_aluminium_billet', 'Первая плавка в 1700 K', ks('hot_aluminium_billet'), 1, ['ebf_controller', 'alumina_charge'], 'Пропусти шихту через электрическую домну: 28 EU/t, 70 секунд. На выходе горячая болванка и шлак.'],
  ['first_aluminium', 'Охлаждение болванки', gt('aluminium_ingot'), 1, ['hot_aluminium_billet', 'fan'], 'Вода с вентилятором Create охлаждает болванку. Забери алюминиевый слиток.'],
  ['aluminium_plate', 'Прокат алюминия', gt('aluminium_plate'), 4, ['first_aluminium', 'pressed_steel_frame', 'ie_press_mold'], 'Подай охлаждённый слиток на тяжёлый пресс IE с матрицей пластин. На лист уходит 6000 FE.'],
  ['aluminium_stock', 'Сменный запас алюминия', gt('aluminium_plate'), 16, ['aluminium_plate'], 'Отложи 16 пластин, прежде чем разбирать LV линию. Они уйдут на электронику и новые корпуса.', true]
])

chapter('mv', 'VIII. Среднее напряжение', gt('good_electronic_circuit'), [
  ['air_compressor', 'Пневматический передел', pnc('air_compressor'), 1, ['mv_pressure_stone_base', 'mv_pressure_gear', 'lv_create_precision', 'lv_shop_piston', 'lv_shop_furnace'], 'Собери компрессор на каменном основании. Добавь шестерню, механику Create, поршень, электропечь LV и воздушные трубы.'],
  ['iron_pressure_slug', 'Заготовка для плотного железа', ks('iron_pressure_slug'), 2, ['iron_plate', 'lining', 'hammer'], 'Набери четыре железных листа на огнеупорной опоре и прокуй их.'],
  ['pressed_iron', 'Железо без взрывов', pnc('ingot_iron_compressed'), 4, ['iron_pressure_slug', 'pressed_steel_frame'], 'Тяжёлый пресс IE с той же матрицей даёт два слитка с заготовки. Взрывные рецепты сжатого железа сняты.'],
  ['pressure_tubes', 'Разводка воздуха', pnc('pressure_tube'), 8, ['pressed_iron', 'bronze_pipe'], 'Собери две партии труб. Часть уйдёт в сам компрессор, остальные протяни от него к камере.'],
  ['pressure_walls', 'Стены камеры давления', pnc('pressure_chamber_wall'), 24, ['pressed_iron', 'pressed_steel_frame', 'furnace_lining_insert'], 'Собери оболочку камеры 3×3×3. Внутри оставь одну пустую клетку. Клапан и интерфейсы заменят часть стен.'],
  ['pressure_glass', 'Смотровые окна', pnc('pressure_chamber_glass'), 2, ['pressure_walls', 'panes', 'pressed_insulation'], 'Вставь стёкла и изоляцию в две секции стен. Через окна можно видеть, что осталось в камере.', true],
  ['pressure_valve', 'Клапан подачи воздуха', pnc('pressure_chamber_valve'), 1, ['air_compressor', 'pressure_walls', 'mv_safety_module'], 'Встрой клапан с предохранительным модулем в стенку камеры и подсоедини к нему линию воздуха.'],
  ['pressure_interfaces', 'Вход и выход кассет', pnc('pressure_chamber_interface'), 2, ['pressure_valve', 'lv_conveyor', 'panes'], 'Поверни один интерфейс внутрь для подачи, второй наружу для выгрузки. Для первой партии подойдёт ручная подача.'],
  ['pressure_gasket', 'Обжатые уплотнения', ks('pressure_gasket'), 2, ['pressure_interfaces', 'pressed_insulation', 'copper_contacts'], 'На 2,75 бар камера обжимает изоляцию со смолой и медью. Получишь два уплотнения.'],
  ['phenolic_base', 'Фенольная подложка', gt('phenolic_circuit_board'), 1, ['aluminium_plate', 'assembler', 'furnace_lining_insert'], 'Сборщик LV прессует бумагу и смолу на алюминиевой основе с огнеупорной оснасткой.'],
  ['phenolic_preform', 'Пакет слоёв под давление', ks('phenolic_preform'), 1, ['phenolic_base', 'lv_printed_board', 'pressed_insulation'], 'Наложи фенольную подложку на старую смоляную плату. Добавь алюминиевые пластины, контакты и изоляцию.'],
  ['sealed_mv_module', 'Герметичная кассета', ks('sealed_mv_module'), 1, ['phenolic_preform', 'pressure_gasket'], 'Подай заготовку и уплотнение в камеру при 3,5 бар. Кассета должна выйти через второй интерфейс.'],
  ['printed_phenolic', 'Печатная плата MV', gt('phenolic_printed_circuit_board'), 1, ['sealed_mv_module', 'lv_solder'], 'Установи медные выводы и припой в сборщике LV.'],
  ['first_mv_circuit', 'Первая схема среднего напряжения', gt('good_electronic_circuit'), 1, ['printed_phenolic', 'lv_circuit_batch', 'lv_vacuum_tube', 'mv_copper_wire', 'pressure_gasket', 'aluminium_plate', 'mv_gauge_module'], 'Подай в сборщик LV две платы, по четыре схемы LV, резистора и припоя, по две лампы, пластины, проволоки, уплотнения и модуля манометра. Добавь 700 мБ воды. Цикл занимает 78 секунд.'],
  ['mv_copper_wire', 'Протяжка медной проволоки', gt('copper_single_wire'), 4, ['copper_contacts', 'press'], 'Дожми контактные полосы на прессе Create. Каждая полоса даёт две проволоки.'],
  ['mv_copper_cable', 'Кабель на 128 EU', gt('copper_single_cable'), 4, ['mv_copper_wire', 'pressure_gasket'], 'Обожми медь уплотнениями, добавь изоляцию и шнур. Проложи отдельную линию для MV.'],
  ['mv_casing', 'Оболочка MV', gt('mv_machine_casing'), 1, ['aluminium_plate', 'pressed_steel_frame', 'pressure_gasket', 'ie_steel'], 'Сборщик LV соединяет четыре алюминиевых листа, две рамы, два вкладыша, уплотнение и два стальных компонента IE.'],
  ['mv_hull', 'Корпус MV', gt('mv_machine_hull'), 1, ['mv_casing', 'lv_hull', 'mv_copper_cable'], 'Собери оболочку, корпус LV, медный кабель и два уплотнения.'],
  ['mv_rotor_core', 'Сердечник двигателя', ks('mv_rotor_core'), 1, ['motor', 'lv_armature', 'aluminium_plate', 'pressure_gasket'], 'Подай двигатель LV, якорь, алюминий, контакты, раму и уплотнение в сборщик.'],
  ['mv_motor', 'Двигатель MV', gt('mv_electric_motor'), 1, ['mv_rotor_core', 'first_mv_circuit', 'mv_copper_cable'], 'Добавь схему MV, два алюминиевых листа, кабели и уплотнение.'],
  ['mv_turbine', 'Первый источник 128 EU', gt('mv_steam_turbine'), 1, ['mv_motor', 'mv_hull', 'lv_balanced_rotor', 'lv_create_speed_control', 'lv_shop_pump'], 'Перенеси запасную турбину LV на корпус MV. На цикл нужны два мотора и две схемы MV, насос LV, оснастка и 850 мБ воды. Оставь рабочую турбину LV коллектору старой линии.'],
  ['mv_assembler', 'Новая сборочная линия', gt('mv_assembler'), 1, ['mv_hull', 'mv_motor', 'first_mv_circuit', 'lv_create_precision'], 'На LV собери первую машину MV из запасного сборщика LV, корпуса, двух моторов, трёх новых схем и двух механизмов Create. Подай 800 мБ воды. Всего на сборщик и его моторы уйдёт пять схем MV начальной серии.'],
  ['mv_circuit_batch', 'Серия из 16 схем MV', gt('good_electronic_circuit'), 16, ['mv_assembler', 'mv_turbine'], 'В новом сборщике MV закладывай 400 мБ воды на партию. Базовый цикл занимает 38 секунд при 96 EU/t.'],
  ['mv_pump', 'Герметичный насос MV', gt('mv_electric_pump'), 1, ['mv_assembler', 'mv_motor', 'pressure_tubes', 'lv_balanced_rotor', 'lv_shop_pump', 'create_water_pump'], 'Соедини насосы LV и Create с двигателем MV, выверенным ротором и прокладками. Подай на сборку 96 EU/t.'],
  ['mv_chemical_reactor', 'Пуск химического цеха', gt('mv_chemical_reactor'), 1, ['mv_assembler', 'mv_pump', 'mv_circuit_batch', 'pressure_valve', 'mv_pressure_regulator'], 'Перенеси реактор LV на корпус MV. Установи два насоса, клапан, регулятор давления и тяжёлый блок IE. На сборку подай 96 EU/t.']
])

chapter('oilfield', 'IX. Скважины и нефтеперегонка', gt('mv_fluid_drilling_rig'), [
  ['oil_probe', 'Скважинный зонд', ks('seismic_probe'), 1, ['first_mv_circuit', 'sealed_mv_module', 'mv_copper_cable'], 'Возьми зонд в руку и нажми ПКМ. Он проверяет текущий чанк, показывает вид нефти и остаток ресурса. Прибор выдерживает 24 замера.'],
  ['oil_frames', 'Стальная вышка', gt('steel_frame'), 15, ['oil_probe', 'pressed_steel_frame', 'steel_plate', 'steel_press_blank'], 'После разведки подготовь 15 стальных каркасов для найденной залежи. Верх вышки держится на стойках, остальные места сверяй с шаблоном GregTech.'],
  ['oil_casings', 'Корпус буровой', gt('steel_machine_casing'), 13, ['mv_assembler', 'pressed_steel_frame', 'furnace_lining_insert'], 'Собери 13 корпусов. Четыре уйдут в контроллер, остальные образуют основание и центральный ствол.'],
  ['oil_energy_hatch', 'Подстанция скважины', gt('mv_energy_input_hatch'), 1, ['mv_hull', 'mv_turbine', 'ebf_energy'], 'Сборщик соединяет люк LV с корпусом, кабелями и схемами MV. Подключи к буровой 128 EU.'],
  ['oil_output_hatch', 'Приём нефти из скважины', gt('mv_output_hatch'), 1, ['mv_pump', 'mv_hull', 'oil_casings'], 'Сделай жидкостный выход MV. Отведи из него нефть в резервуар.'],
  ['drill_seal_head', 'Опрессовка бурового узла', ks('drill_seal_head'), 2, ['lv_balanced_rotor', 'pressed_steel_frame', 'pressed_iron', 'pressure_interfaces'], 'На 4 бар опрессуй ротор, раму, уплотнение и сжатое железо. Контроллеру нужны два узла.'],
  ['oil_drilling_rig', 'Пуск буровой', gt('mv_fluid_drilling_rig'), 1, ['oil_probe', 'oil_frames', 'oil_output_hatch', 'oil_energy_hatch', 'drill_seal_head', 'mv_ie_fluid_pump'], 'Добавь насос IE в контроллер. Поставь его в чанке с залежью и собери вышку 3×7×3 с энергетическим входом и жидкостным выходом.'],
  ['strainer_mesh', 'Фильтровальная сетка', ks('strainer_mesh'), 4, ['copper_contacts', 'lv_charcoal_powder', 'steel_plate', 'pressed_insulation', 'mv_filter_basin'], 'Загрузи в чашу под прессом Create контактные ленты, порошок, сталь и изоляцию. Сетки расходуются при очистке.'],
  ['oil_wash_cartridge', 'Промывочная кассета', ks('oil_wash_cartridge'), 2, ['strainer_mesh', 'lime_flux', 'pressure_gasket'], 'Собери сменную кассету с флюсом, двумя сетками и герметичными стыками.'],
  ['drum_liner', 'Вкладыш резервуара', ks('drum_liner'), 4, ['steel_plate', 'pressure_gasket', 'panes'], 'Проверь внутренний вкладыш и смотровое стекло. Подготовь вкладыши для бочек GregTech и баков PneumaticCraft.'],
  ['oil_drum', 'Буфер сырой нефти', gt('steel_drum'), 1, ['drum_liner', 'steel_press_blank', 'pressed_steel_frame'], 'Собери стальную бочку. Подключи её к выходному люку и подавай нефть на промывку по отдельной трубе.'],
  ['process_tank', 'Технологические баки', pnc('small_tank'), 4, ['drum_liner', 'pressed_iron', 'pressure_tubes'], 'Четыре бака понадобятся для дистиллятора, колонны и горячей линии. Баки собираются из вкладышей и прессованного железа.'],
  ['water_distillery', 'Водоподготовка MV', gt('mv_distillery'), 1, ['mv_assembler', 'mv_pump', 'process_tank', 'strainer_mesh'], 'На 96 EU/t дистиллятор превращает 1000 мБ воды и сетку в 800 мБ дистиллированной воды.'],
  ['sample_ampoules', 'Пустые ампулы', ks('sample_ampoule'), 4, ['lv_glass_blank', 'pressure_gasket', 'aluminium_plate'], 'Собери ампулы из стекла, алюминия и уплотнений. Для приёмки подай пустые ампулы под носик Create, по 100 мБ на пробу.'],
  ['washed_oil_sample', 'Промывка первой партии', ks('washed_oil_sample'), 1, ['oil_drilling_rig', 'oil_drum', 'oil_wash_cartridge', 'water_distillery', 'mv_sample_spout', 'mv_chemical_reactor'], 'Промой сырую нефть дистиллятом в реакторе с кассетой. Отведи промытую нефть в буфер, рассол в отдельную ёмкость и возьми пробу через носик Create.'],
  ['mv_chemical_bath', 'Ванна для промывки кассет', gt('mv_chemical_bath'), 1, ['water_distillery', 'process_tank', 'mv_pump'], 'Собери отдельную ванну с насосом, баком и фильтровальной сеткой.', true],
  ['spent_oil_cartridge', 'Запас восстановленных сеток', ks('strainer_mesh'), 4, ['washed_oil_sample', 'mv_chemical_bath'], 'Промой отработанную кассету в химической ванне с 200 мБ дистиллированной воды. Забери сетку и отведи 150 мБ рассола на переработку. Квест проверяет наличие четырёх готовых сеток.', true],
  ['recovered_salt', 'Разгрузка рассола', gt('salt_dust'), 4, ['washed_oil_sample', 'water_distillery'], 'Дистиллятор на 96 EU/t принимает рассол после промывки нефти или восстановления сеток. На 400 мБ получишь соль и 200 мБ воды, которую можно вернуть на очистку.', true],
  ['refinery_tray', 'Тарелки колонны', ks('refinery_tray'), 10, ['strainer_mesh', 'drum_liner', 'pressed_iron', 'ie_press_mold'], 'Установи форму пластины на тяжёлый пресс IE. Штампуй тарелки для ступеней колонны и теплообменников из подготовленных вкладышей.'],
  ['refinery_exchanger', 'Сердечник теплообменника', ks('heat_exchange_core'), 5, ['refinery_tray', 'heater_ribbon', 'mv_assembler', 'lv_create_precision', 'ie_steel'], 'Собери теплообменники из тарелок, алюминия, нагревателей, стальных компонентов IE и прецизионной механики Create.'],
  ['refinery_base', 'Основание колонны', pnc('refinery'), 1, ['refinery_exchanger', 'process_tank', 'mv_hull'], 'Подай промытую нефть в основание PneumaticCraft. Прогрей его хотя бы до 403 К, примерно 130 °C.'],
  ['refinery_outputs', 'Четыре ступени отбора', pnc('refinery_output'), 4, ['refinery_base', 'refinery_tray', 'process_tank'], 'Поставь четыре выхода один над другим над основанием. Подключи к каждой ступени свою ёмкость.'],
  ['fraction_drums', 'Раздельные ёмкости', gt('steel_drum'), 4, ['refinery_outputs', 'oil_drum'], 'Выдели четыре бочки под тяжёлую и лёгкую фракции, нафту и нефтяной газ. Подключи жидкостные трубы Create с насосами и проверь свободное место в буферах.'],
  ['heat_pipes', 'Тепловая магистраль', pnc('heat_pipe'), 4, ['refinery_tray', 'heater_ribbon', 'pressed_iron'], 'Тепловые трубы передают тепло между сторонами установок. Изолируй горячую линию от холодной.'],
  ['heat_sink', 'Отвод тепла', pnc('heat_sink'), 2, ['refinery_exchanger', 'aluminium_plate'], 'Радиатор на нерабочей стороне вихревой трубы помогает удерживать перепад температуры.'],
  ['vortex_tube', 'Вихревая труба', pnc('vortex_tube'), 2, ['heat_pipes', 'heat_sink', 'air_compressor'], 'Подай сжатый воздух. Одна сторона трубы нагревается, другая охлаждается. Выдели отдельные установки для горячего и холодного контуров.'],
  ['heavy_fraction_sample', 'Тяжёлая фракция', ks('heavy_fuel_sample'), 1, ['fraction_drums', 'washed_oil_sample', 'vortex_tube'], 'Из 100 мБ промытой нефти колонна даёт 25 мБ тяжёлой фракции. Оставь поток для смазки и парафинового осадка.'],
  ['light_fraction_sample', 'Лёгкая фракция', ks('light_fuel_sample'), 1, ['fraction_drums', 'washed_oil_sample', 'vortex_tube'], 'Лёгкая фракция занимает ещё 25 мБ. Сохрани её отдельно для дизельного реактора.'],
  ['naphtha_sample', 'Нафта', ks('naphtha_sample'), 1, ['fraction_drums', 'washed_oil_sample', 'vortex_tube'], 'Выход нафты составляет 30 мБ за цикл. В горячей установке она даёт этилен и активированный носитель.'],
  ['refinery_gas_sample', 'Нефтяной газ', ks('refinery_gas_sample'), 1, ['fraction_drums', 'washed_oil_sample', 'vortex_tube'], 'Отдельный газовый выход даёт 20 мБ. Не смешивай поток с нафтовой линией. Газ входит в дизельный рецепт.'],
  ['naphtha_reserve', 'Резерв проб нафты', ks('naphtha_sample'), 8, ['naphtha_sample'], 'Отбери восемь проб для проверки стабильности работы колонны. Остальную нафту оставь в технологическом буфере.', true]
])

chapter('petrochem', 'X. Полимеры и топливо', gt('polyethylene_plate'), [
  ['cracking_catalyst', 'Активирование катализатора', ks('cracking_catalyst'), 3, ['nickel_concentrate', 'strainer_mesh', 'water_distillery', 'lv_charcoal_powder'], 'Сборщик с дистиллированной водой готовит три порции из никелевого концентрата, угольного порошка, сетки и шамота.'],
  ['thermopneumatic_plants', 'Две термопневматические установки', pnc('thermopneumatic_processing_plant'), 2, ['refinery_exchanger', 'process_tank', 'vortex_tube', 'pressure_valve'], 'Выдели одну установку на нагрев нафты, вторую на холодное формование. Оставь независимые подводы воздуха и теплоотвод.'],
  ['activated_carrier', 'Крекинг нафты', ks('activated_carrier'), 1, ['thermopneumatic_plants', 'naphtha_sample', 'cracking_catalyst'], 'На 443 К и 3,5 бар установка расходует 400 мБ нафты и катализатор. Отведи 300 мБ этилена и забери активированный носитель.'],
  ['mv_electrolyzer', 'Электролиз чистой воды', gt('mv_electrolyzer'), 1, ['water_distillery', 'refinery_exchanger', 'mv_assembler'], 'Разложи 1000 мБ дистиллята на водород и кислород. У каждого выхода свой буфер.'],
  ['first_polyethylene', 'Первый лист полиэтилена', gt('polyethylene_plate'), 1, ['activated_carrier', 'mv_electrolyzer', 'mv_chemical_reactor'], 'Реактор при 96 EU/t объединяет этилен, кислород и носитель. Подай 288 мБ полимера в холодную установку при 2,5 бар и температуре не выше 283 К.'],
  ['polyethylene_batch', 'Серия листов', gt('polyethylene_plate'), 16, ['first_polyethylene', 'mv_sink_stock'], 'Выпусти 16 листов на химстойкие детали и пневматическую электронику. Следи, чтобы ёмкость этилена не переполнялась.', true],
  ['paraffin_cake', 'Смазка и парафиновый осадок', ks('paraffin_cake'), 2, ['heavy_fraction_sample', 'strainer_mesh', 'water_distillery'], 'В реактор подай тяжёлую фракцию, дистиллят и сетку. Раздельно выведи смазку и рассол, забери парафиновый осадок.'],
  ['diesel_sample', 'Первая партия дизеля', ks('diesel_sample'), 1, ['mv_ie_refinery', 'light_fraction_sample', 'refinery_gas_sample', 'mv_electrolyzer', 'cracking_catalyst', 'activated_carrier'], 'Обработай лёгкую фракцию водородом в реакторе GregTech. Подай продукт и нефтяной газ в НПЗ IE, установи активированный носитель. Отбери пробу через носик Create.'],
  ['polymer_seal_preform', 'Парафинированная заготовка', ks('polymer_seal_preform'), 1, ['first_polyethylene', 'paraffin_cake', 'pressure_gasket'], 'Сборщик принимает смазку и соединяет листы полиэтилена, парафин, прокладку и медную ленту.'],
  ['chemical_grade_seal', 'Химстойкие уплотнения', ks('chemical_grade_seal'), 2, ['polymer_seal_preform', 'pressure_interfaces', 'pressed_iron'], 'На 4 бар обожми заготовку вместе с железом и прокладкой. Два новых уплотнения пойдут в оборудование цеха.'],
  ['reinforced_process_tube', 'Трубки с полимерным покрытием', pnc('reinforced_pressure_tube'), 4, ['first_polyethylene', 'thermopneumatic_plants', 'pressure_tubes'], 'Термопневматическая установка наносит полиэтилен на трубку. Нужны 3,5 бар и минимум 393 К.', true],
  ['first_pnc_board', 'Заготовка пневматической платы', pnc('empty_pcb'), 1, ['chemical_grade_seal', 'printed_phenolic', 'first_polyethylene'], 'На 3,75 бар соедини полиэтилен, фенольную плату, контакты и химстойкое уплотнение. Это заготовка для следующего этапа электроники.', true],
  ['process_commissioning', 'Приёмка химического цеха', ks('process_commissioning_kit'), 1, ['heavy_fraction_sample', 'light_fraction_sample', 'naphtha_sample', 'refinery_gas_sample', 'diesel_sample', 'chemical_grade_seal'], 'Собери пробы всех четырёх фракций и дизеля, лист полиэтилена, схему, раму и уплотнение. Сделай отдельный комплект на каждую новую машину.'],
  ['mv_diesel_generator', 'Резерв на дизеле', gt('mv_combustion'), 1, ['process_commissioning', 'mv_motor', 'mv_pump', 'chemical_grade_seal'], 'Собери генератор MV и подай дизель из отдельной бочки. Он может поддержать химический цех при остановке подачи пара.'],
  ['liquid_process_compressor', 'Воздух на жидком топливе', pnc('liquid_compressor'), 1, ['process_commissioning', 'reinforced_process_tube', 'air_compressor', 'diesel_sample'], 'Собери топливный компрессор на усиленных трубках и испытанном комплекте. Подведи дизель и проверь давление под нагрузкой.']
])

chapter('nether_foundry', 'XI. Нижний мир и огнеупоры', ks('nether_transit_seal'), [
  ['nether_transit', 'Допуск к порталу', ks('nether_transit_seal'), 1, ['process_commissioning', 'mv_diesel_generator', 'lv_create_precision'], 'Подай наладочный комплект, теплообменник, две рамы IE, механику Create и 500 мБ смазки. Держи готовый пропуск в инвентаре при входе в Нижний мир.'],
  ['nether_igniter', 'Стальное огниво', mc('flint_and_steel'), 1, ['nether_transit', 'steel_plate'], 'Собери огниво с кованой пластиной, шарниром и креплением. Им можно зажечь портал. Пропуск нужен в том числе для старых порталов.'],
  ['nether_field_power', 'Электричество за порталом', gt('mv_combustion'), 1, ['nether_transit', 'mv_diesel_generator'], 'Подготовь дизельный генератор для Нижнего мира. Подвези топливо в бочке и подключи мацератор медным кабелем.'],
  ['nether_field_drum', 'Топливо для выезда', gt('steel_drum'), 2, ['nether_field_power', 'oil_drum'], 'Выдели одну бочку под выездное топливо, другую оставь в резерве для следующей партии.', true],
  ['nether_mv_piston', 'Уплотнённый поршень MV', gt('mv_electric_piston'), 1, ['mv_assembler', 'mv_motor', 'chemical_grade_seal'], 'Сборщик соединяет моторы, железную заготовку, корпус и схемы. Подай смазку.'],
  ['nether_mv_conveyor', 'Полимерная передача MV', gt('mv_conveyor_module'), 1, ['mv_assembler', 'mv_motor', 'first_polyethylene'], 'Модуль LV уходит в новый привод. Полиэтилен и смазка нужны для подвижных частей.', true],
  ['nether_mv_macerator', 'Мацератор полевого цеха', gt('mv_macerator'), 1, ['nether_field_power', 'mv_assembler', 'drill_seal_head'], 'Разбери запасной паровой мацератор на узел дробления и собери электрическую машину с уплотнённой головкой.'],
  ['nether_basalt', 'Партия базальта', mc('basalt'), 24, ['nether_transit', 'nether_igniter'], 'Найди базальт в Нижнем мире. Приготовь место для генератора и мацератора возле портала.'],
  ['nether_grit', 'Дробление в Нижнем мире', ks('basalt_grit'), 16, ['nether_basalt', 'nether_mv_macerator'], 'Этот рецепт работает только в Нижнем мире. Четыре блока базальта дают две порции концентрата при 96 EU/t.'],
  ['nether_chromite', 'Отмыть хромит', ks('chromite_concentrate'), 1, ['nether_grit', 'mv_chemical_bath', 'water_distillery'], 'Шесть порций базальтового концентрата и 800 мБ дистиллята дают промытый хромит. Хвосты отправь в отдельный буфер.'],
  ['nether_mv_mixer', 'Смеситель тяжёлой шихты', gt('mv_mixer'), 1, ['mv_assembler', 'mixer', 'paraffin_cake'], 'Используй смеситель Create, теплообменник, два мотора MV и смазку.'],
  ['nether_soul_sand', 'Песок душ для огнеупоров', mc('soul_sand'), 8, ['nether_transit'], 'Набери песок душ. Смеситель использует его вместе с базальтом и огнеупорной шихтой.'],
  ['nether_refractory_mix', 'Замес футеровки', ks('refractory_mix'), 4, ['nether_grit', 'nether_soul_sand', 'nether_mv_mixer'], 'В смеситель MV подай базальтовый концентрат, песок душ, огнеупорную шихту и дистиллят.'],
  ['nether_refractory_cast', 'Прессование огнеупоров', ks('refractory_cast'), 4, ['nether_refractory_mix', 'pressed_steel_frame'], 'На прессе Immersive Engineering поставь форму пластины. Каждую порцию смеси спрессуй отдельно.'],
  ['nether_refractory_liner', 'Партия обожжённых вкладышей', ks('fired_refractory_liner'), 8, ['nether_refractory_cast'], 'Обжиг одной заготовки занимает 46 секунд. Вкладыши расходуются на катушки, путь и грузовые ящики.'],
  ['nether_furnace_inlet', 'Кислородный ввод домны', gt('mv_input_hatch'), 1, ['nether_refractory_liner', 'mv_electrolyzer', 'oil_energy_hatch', 'pressure_tubes'], 'Собери жидкостный вход с клапаном Create, пневмотрубками и смазкой. Поставь его вместо блока кожуха домны и подключи кислород электролизёра.'],
  ['nether_kanthal_charge', 'Шихта для первой плавки', ks('kanthal_charge'), 2, ['nether_chromite', 'nether_refractory_liner', 'nether_mv_mixer', 'aluminium_plate'], 'Смешай сталь, алюминий, хромит и обожжённый вкладыш. Одна загрузка даёт две порции шихты.'],
  ['nether_hot_kanthal', 'Первая плавка кантала', ks('hot_kanthal_billet'), 1, ['nether_kanthal_charge', 'nether_furnace_inlet', 'ebf_controller'], 'Домна с медно-никелевыми катушками работает при 1750 К и 112 EU/t. Подай 200 мБ кислорода на порцию.'],
  ['nether_cold_kanthal', 'Охлаждение кантала', gt('kanthal_ingot'), 1, ['nether_hot_kanthal', 'mv_chemical_bath'], 'Пропусти горячую болванку через химическую ванну с 500 мБ дистиллированной воды.'],
  ['nether_mv_wiremill', 'Волочильный стан MV', gt('mv_wiremill'), 1, ['mv_assembler', 'press', 'paraffin_cake'], 'Пресс Create, стальная заготовка и два двигателя MV входят в стан. Перед запуском подай смазку.'],
  ['nether_kanthal_winding', 'Две намотки из слитка', ks('kanthal_winding'), 4, ['nether_cold_kanthal', 'nether_mv_wiremill'], 'Волочильный стан MV превращает один канталовый слиток в две намотки.'],
  ['nether_kanthal_coils', 'Два кольца канталовых катушек', gt('kanthal_coil_block'), 16, ['nether_kanthal_winding', 'nether_refractory_liner', 'ebf_coils', 'mv_ie_lv_coil'], 'На две катушки нужны шесть намоток, медно-никелевая катушка, горячая канталовая болванка, обмотка IE и 450 мБ смазки. Замени оба кольца домны.'],
  ['nether_stainless_charge', 'Шихта нержавеющей стали', ks('stainless_charge'), 4, ['nether_chromite', 'nickel_concentrate', 'nether_refractory_liner'], 'Загрузи в смеситель сталь, никелевый и хромитовый концентраты и огнеупор.'],
  ['nether_hot_stainless', 'Домна на 2450 К', ks('hot_stainless_billet'), 1, ['nether_stainless_charge', 'nether_kanthal_coils', 'nether_furnace_inlet'], 'Для плавки нужны канталовые катушки, 120 EU/t и 400 мБ кислорода. Поставь генератор рядом с входным люком, чтобы сохранить напряжение.'],
  ['nether_stainless_ingot', 'Закалённая нержавеющая сталь', gt('stainless_steel_ingot'), 1, ['nether_hot_stainless', 'mv_chemical_bath'], 'Охлади болванку в химической ванне с 650 мБ дистиллята.'],
  ['nether_mv_bender', 'Листогиб MV', gt('mv_bender'), 1, ['nether_mv_piston', 'mv_assembler', 'pressed_steel_frame'], 'Паровой молот, форма пресса и два поршня входят в новый станок. Собери его с подачей смазки.'],
  ['nether_stainless_plates', 'Первые листы нержавейки', gt('stainless_steel_plate'), 8, ['nether_stainless_ingot', 'nether_mv_bender'], 'Из каждого слитка листогиб делает один лист. Начни запас для рельсов и корпусов HV.'],
  ['nether_mv_lathe', 'Токарный станок MV', gt('mv_lathe'), 1, ['nether_mv_piston', 'mv_assembler', 'saw', 'drill_seal_head'], 'Сборщик принимает пилу Create, два поршня и уплотнённую головку. Этот станок точит контакты и оси.'],
  ['nether_brick_batch', 'Незерский кирпич', mc('nether_brick'), 8, ['mv_nether_brick_blank', 'nether_refractory_liner'], 'Обожги сырец. Готовый кирпич отправь на сборку кладки с огнеупорными вкладышами.', true],
  ['nether_blackstone_wall', 'Жаростойкие ограждения', mc('polished_blackstone_brick_wall'), 8, ['nether_grit', 'nether_refractory_liner'], 'Отполируй чернит, собери кирпичи и пропусти их через сборщик с огнеупорной смесью и вкладышами.', true]
])

chapter('me_network', 'MV. Цифровой склад', me('controller'), [
  ['me_compass', 'Метеоритный компас', me('meteorite_compass'), 1, ['assembler', 'chemical_grade_seal'], 'Сборщик LV соединяет компас, магнитный якорь, схему, полосу и уплотнение. Найди метеорит по направлению стрелки.'],
  ['me_certus', 'Сертиус из метеорита', me('certus_quartz_crystal'), 12, ['me_compass'], 'Собери зрелые кристаллы в метеорите. Оставь растущие блоки на месте и заготовь запас небесного камня.'],
  ['me_press_logic', 'Матрица логики', me('logic_processor_press'), 1, ['me_certus'], 'Из загадочного куба метеорита выпадают матрицы инскрайбера. Сохрани каждую.'],
  ['me_press_calc', 'Матрица вычислений', me('calculation_processor_press'), 1, ['me_certus'], 'Используй отдельную матрицу для вычислительных схем.'],
  ['me_press_engineer', 'Инженерная матрица', me('engineering_processor_press'), 1, ['me_certus'], 'Нужна для основы контроллера, ME-привода и складской шины.'],
  ['me_press_silicon', 'Кремниевая матрица', me('silicon_press'), 1, ['me_certus'], 'Кремниевый оттиск входит во все три процессора.'],
  ['me_shell', 'Экранировать корпус', ks('me_isolation_shell'), 2, ['mv_assembler', 'chemical_grade_seal', 'first_polyethylene'], 'Собери корпус MV на двух рамах с полиэтиленом, сталью и уплотнением.'],
  ['me_converter', 'Питать ME от сети MV', gt('mv_1a_energy_converter'), 1, ['me_shell', 'ie_fe_converter', 'mv_circuit_batch'], 'Перенеси преобразователь LV на корпус MV. Киянкой переключи EU → FE и подключи сторону выдачи к оборудованию AE2.'],
  ['me_charger', 'Зарядить сертиус', me('charger'), 1, ['me_certus', 'me_shell', 'me_converter'], 'Сборщик MV соединяет корпус, мотор, схему, кабели и кристаллы. Подай FE на зарядник.'],
  ['me_charged_certus', 'Партия заряженных кристаллов', me('charged_certus_quartz_crystal'), 4, ['me_charger'], 'Заряди четыре кристалла сертиуса. На первый запуск смесителя уйдёт один.'],
  ['me_fluix', 'Флюикс из смесителя MV', me('fluix_crystal'), 4, ['me_charged_certus', 'nether_mv_mixer', 'water_distillery'], 'Смешай заряженный сертиус, кварцит, редстоун и уплотнение с 500 мБ дистиллята. Выход — два кристалла флюикса.'],
  ['me_silicon', 'Восстановление кремния', gt('silicon_ingot'), 4, ['nether_kanthal_coils', 'water_distillery'], 'Для одной партии нужны две пыли кварцита, древесный уголь и футеровка. Домна работает при 2400 К и 96 EU/t.'],
  ['me_fiber', 'Кварцевое волокно', me('quartz_fiber'), 8, ['me_certus', 'me_shell'], 'Сборщик вытягивает волокно из сертиуса, стекла и полимера через фильтровальную сетку.'],
  ['me_laminate', 'Опрессовать пьезоламинат', ks('me_piezo_laminate'), 4, ['me_fluix', 'me_fiber', 'liquid_process_compressor'], 'Обожми волокно, флюикс, полимер и уплотнение при 4,1 бар в камере PneumaticCraft.'],
  ['me_foil', 'Фольга памяти', ks('me_memory_foil'), 4, ['me_laminate', 'me_silicon', 'rail_gold_blank'], 'Соедини кремний, ламинат, медные полосы, золото и полиэтилен в сборщике MV.'],
  ['me_inscriber', 'Поставить инскрайбер', me('inscriber'), 1, ['me_acceptor', 'me_laminate', 'nether_mv_piston'], 'Установи корпус с двумя поршнями и волокном. Подведи питание через сеть AE2.'],
  ['me_press_blank', 'Заготовка дубликата матрицы', ks('me_press_blank'), 1, ['me_inscriber'], 'Сошлифуй стальную заготовку с рамой и алюминием. В инскрайбере используй исходную матрицу для копирования.', true],
  ['me_silicon_print', 'Кремниевые оттиски', me('printed_silicon'), 4, ['me_inscriber', 'me_silicon', 'me_press_silicon'], 'Верхний слот держит матрицу, средний принимает очищенный кремний.'],
  ['me_logic_print', 'Логические оттиски', me('printed_logic_processor'), 2, ['me_inscriber', 'me_foil', 'me_press_logic'], 'Вставь матрицу логики и ламинированную фольгу.'],
  ['me_calc_print', 'Вычислительные оттиски', me('printed_calculation_processor'), 2, ['me_inscriber', 'me_foil', 'me_press_calc'], 'Та же фольга под другой матрицей даёт вычислительную дорожку.'],
  ['me_engineering_foil', 'Фольга инженерных схем', ks('me_etched_foil'), 2, ['me_foil', 'hv_ceramic_substrate'], 'Подложка делается прессом IE и доступна на MV. Добавь сертиус, контакты и припой.'],
  ['me_eng_print', 'Инженерные оттиски', me('printed_engineering_processor'), 2, ['me_inscriber', 'me_engineering_foil', 'me_press_engineer'], 'Инженерную фольгу оттисни под соответствующей матрицей.'],
  ['me_circuit_machine', 'Сборщик схем на MV', gt('mv_circuit_assembler'), 1, ['mv_assembler', 'nether_mv_conveyor', 'mv_circuit_batch'], 'Перенеси головку со сборщика схем LV. Добавь корпус MV, две схемы, два конвейера, герметичный модуль и контакты.'],
  ['me_logic', 'Логический процессор', me('logic_processor'), 4, ['me_logic_print', 'me_silicon_print', 'me_circuit_machine'], 'При 120 EU/t спаяй два оттиска, схему MV, контакт и редстоун.'],
  ['me_calc', 'Вычислительный процессор', me('calculation_processor'), 4, ['me_calc_print', 'me_silicon_print', 'me_circuit_machine'], 'Подай оттиски, сертиус, схему и припой в сборщик схем MV.'],
  ['me_eng', 'Инженерный процессор', me('engineering_processor'), 4, ['me_eng_print', 'me_silicon_print', 'me_circuit_machine'], 'Добавь ламинат и две заготовки припоя. Такой процессор уходит в привод, контроллер и шину хранения.'],
  ['me_acceptor', 'Ввод питания ME', me('energy_acceptor'), 1, ['me_converter', 'mv_circuit_batch', 'me_laminate'], 'Собери вход питания из корпуса, двух схем MV и ламината. Соедини выход FE преобразователя с тестовой сетью.'],
  ['me_glass_cable', 'Шина на восемь каналов', me('fluix_glass_cable'), 8, ['me_fiber', 'me_laminate'], 'Из двух волокон, двух кристаллов, полимера и ламината выходят четыре кабеля.'],
  ['me_controller', 'Контроллер сети ME', me('controller'), 1, ['me_acceptor', 'me_eng', 'me_calc', 'me_glass_cable'], 'Собери контроллер с двумя инженерными и двумя вычислительными процессорами, флюиксом в ламинате и небесным камнем.'],
  ['me_drive', 'ME-привод', me('drive'), 1, ['me_controller', 'me_eng', 'nether_mv_conveyor'], 'На привод поставь два конвейера MV, ядра формирования и три процессора.'],
  ['me_housing', 'Корпус ячейки ME', me('item_cell_housing'), 4, ['me_shell', 'me_laminate', 'me_fiber'], 'Один корпус нужен для готовой ячейки, ещё три уйдут в её компонент памяти.'],
  ['me_1k', 'Первая ячейка 1k', me('item_storage_cell_1k'), 1, ['me_housing', 'me_logic', 'me_drive'], 'Спаяй компонент из трёх корпусов и логических процессоров. Собери ячейку в четвёртом корпусе и вставь её в привод.'],
  ['me_terminal', 'Терминал хранения', me('terminal'), 1, ['me_acceptor', 'me_glass_cable', 'me_logic', 'me_calc'], 'Поставь два дисплея на процессоры, ядро и фольгу. Установи терминал сбоку кабеля.'],
  ['me_crafting_terminal', 'Терминал с верстаком', me('crafting_terminal'), 1, ['me_terminal', 'me_eng'], 'Перенеси терминал на верстак с инженерным процессором и двумя слоями фольги.'],
  ['me_import', 'Ввод предметов и жидкостей', me('import_bus'), 1, ['me_terminal', 'nether_mv_conveyor'], 'Подключи шину к выходному инвентарю машины или к баку. Для жидкости нужна свободная ячейка жидкости.'],
  ['me_export', 'Выдача на станки', me('export_bus'), 1, ['me_terminal', 'nether_mv_conveyor'], 'Подключи шину к буферу и задай фильтр того, что нужно подавать из сети.'],
  ['me_storage_bus', 'Складские ящики в ME', me('storage_bus'), 1, ['me_controller', 'drawer_controller', 'me_eng'], 'Шина подключается к контроллеру ящиков. Поставь приоритет, чтобы поступающие материалы сначала шли на стеллажи.'],
  ['me_fluid_cell', 'Ячейка для жидкостей', me('fluid_storage_cell_1k'), 1, ['me_1k', 'mv_pump', 'yard_fluid_pipe'], 'Переделай корпус под насос и уплотнения. Вставь ещё один компонент 1k и установи ячейку в привод. Подключи резервуар шиной импорта.'],
  ['me_4k', 'Серийная ячейка 4k', me('item_storage_cell_4k'), 1, ['me_1k', 'me_calc'], 'Собери три компонента 1k, два вычислительных процессора и новую оболочку.']
])

chapter('yard', 'XII. Приёмка и трубопроводы', ks('received_refractory_crate'), [
  ['yard_item_pipe', 'Оловянные предметные трубы', gt('tin_normal_item_pipe'), 8, ['assembler', 'rivets'], 'Сборщик LV сшивает оловянные листы заклёпками и изолирует стыки. На стороне склада поставь конвейер GregTech в режиме выдачи. Соедини трубы ключом.', true],
  ['yard_fluid_pipe', 'Обвязка приёмки', gt('bronze_small_fluid_pipe'), 16, ['bronze_pipe', 'mv_pump'], 'Веди дистиллят по отдельной трубе. Поставь насос на выходе бака и оставь доступ к стыкам. Огнеупоры поступают через предметный вход.', true],
  ['rail_fastener_blank', 'Заготовки креплений', ks('rail_fastener_blank'), 2, ['steel_press_blank', 'steel_plate'], 'Собери стальную заготовку с листами и заклёпками. Эта оснастка идёт на пресс.'],
  ['rail_fasteners', 'Партия креплений', ks('rail_fastener'), 16, ['rail_fastener_blank', 'pressed_steel_frame'], 'Штампуй крепления на прессе IE. За цикл выходят восемь штук.'],
  ['rail_axle_blank', 'Заготовка оси', ks('axle_blank'), 2, ['nether_stainless_plates', 'rail_fasteners'], 'Сложи заготовку из стали, нержавейки, рамы и заклёпок.'],
  ['rail_balanced_axle', 'Выверенная ось', ks('balanced_rail_axle'), 2, ['rail_axle_blank', 'nether_mv_lathe'], 'Обработай заготовку на токарном станке MV. Оси нужны поршням, транспортёрам и тяговым приводам.'],
  ['rail_gold_blank', 'Заготовка для контактов', ks('gold_conductor_blank'), 1, ['nether_refractory_liner', 'copper_contacts', 'mv_ie_electrum_wire'], 'Отштампуй керамику в IE. В чаше Create спрессуй её с золотом, электрумовой проволокой, контактами и изоляцией. Подай смазку.'],
  ['rail_switch_contacts', 'Точёные контакты реле', ks('hv_switch_contact'), 2, ['rail_gold_blank', 'nether_mv_lathe'], 'Токарный станок MV делает два контакта из золотой заготовки.'],
  ['rail_signal_relay', 'Сигнальное реле', ks('signal_relay'), 1, ['rail_switch_contacts', 'nether_refractory_liner', 'mv_circuit_batch'], 'Собери реле из точёных контактов, медных полос, кабеля, схемы MV и пары вкладышей.'],
  ['yard_sealed_batch', 'Упаковать огнеупоры', ks('sealed_refractory_crate'), 4, ['nether_refractory_liner', 'nether_stainless_plates', 'chemical_grade_seal'], 'Сборщик MV упаковывает восемь вкладышей в четыре ящика. Добавь пропитанное волокно, рамы, нержавейку и 250 мБ смазки.'],
  ['yard_accept_batch', 'Входной контроль огнеупоров', ks('received_refractory_crate'), 3, ['yard_sealed_batch', 'mv_assembler', 'mv_ie_insulated_wire'], 'Подай четыре ящика, разъём IE, два изолированных мотка, бумагу, уплотнение и 1000 мБ дистиллята в сборщик MV. Один ящик уходит на контроль. Три получат допуск к монтажу.']
])

chapter('railway', 'Дополнительно. Железная дорога', create('track_station'), [
  ['rail_profile_blank', 'Стальная заготовка пути', ks('rail_profile_blank'), 4, ['nether_stainless_plates', 'nether_refractory_liner'], 'Сохрани часть горячих болванок после домны. Собери заготовку из болванки, стальных и нержавеющих листов и огнеупора.'],
  ['rail_profile', 'Прокат на прессе IE', ks('rolled_rail'), 8, ['rail_profile_blank', 'pressed_steel_frame'], 'Поставь форму пластины и штампуй профили на тяжёлом прессе Immersive Engineering.'],
  ['rail_sleepers', 'Пропитать шпалы', ks('treated_sleeper'), 8, ['paraffin_cake', 'mv_assembler'], 'Подай дубовые доски, волокно, нагели, сталь и смазку в сборщик MV.'],
  ['rail_first_track', 'Первые секции пути', create('track'), 16, ['rail_profile', 'rail_sleepers', 'rail_fasteners'], 'Сборщик MV выпускает 16 секций из четырёх профилей, четырёх шпал, восьми креплений и двух вкладышей. Подай 450 мБ смазки.'],
  ['rail_bulk_track', 'Запас на прямой перегон', create('track'), 192, ['rail_first_track'], 'Для 192 прямых секций нужны 12 циклов сборщика. Повороты, уклоны и станции увеличивают расход пути.', true],
  ['rail_traction_housing', 'Тяговый корпус', ks('traction_housing'), 1, ['rail_balanced_axle', 'chemical_grade_seal'], 'Сборщик соединяет две оси с листами, рамами и жаростойким вкладышем. Корпус нужен станции и локомотиву.'],
  ['rail_casing', 'Коробка станционных механизмов', create('railway_casing'), 2, ['rail_traction_housing', 'rail_fasteners'], 'На тяговом корпусе собери два кожуха из листов нержавейки, креплений и вкладышей.'],
  ['rail_stations', 'Отправление и приёмка', create('track_station'), 2, ['rail_first_track', 'rail_casing', 'rail_signal_relay'], 'Размести станции вдоль одного связного пути. Расстояние между блоками станций по горизонтали должно составлять не менее 192 блоков.'],
  ['rail_controls', 'Управление составом', create('controls'), 1, ['rail_traction_housing', 'rail_signal_relay', 'mv_motor'], 'Собери пульт на тяговом корпусе с двумя реле, двумя моторами, осями и контактами.'],
  ['rail_glue', 'Клей для состава', create('super_glue'), 1, ['first_polyethylene', 'paraffin_cake', 'chemical_grade_seal'], 'Соедини смолу, полимер, парафин и уплотнение. Нанеси клей на блоки локомотива и вагона перед сборкой.'],
  ['rail_cargo_vault', 'Инвентарь вагона', create('item_vault'), 1, ['rail_casing', 'rail_glue'], 'Приклей хранилище к раме состава и собери поезд у станции. Груз должен лежать в хранилище самого поезда.'],
  ['rail_schedule', 'Расписание состава', create('schedule'), 1, ['rail_signal_relay', 'rail_stations'], 'Собери расписание. Для автоматического рейса назначь две остановки и положи расписание водителю.', true],
  ['rail_signals', 'Сигналы на маршруте', create('track_signal'), 2, ['rail_signal_relay', 'rail_stations'], 'Разметь участки пути перед встречным движением. Для первого рейса допустима одна линия и один состав.', true],
  ['rail_observers', 'Контроль прибытия', create('track_observer'), 1, ['rail_signal_relay', 'rail_stations'], 'Поставь наблюдатель на путь и выведи сигнал прибытия к приёмному складу.', true],
  ['rail_transfer', 'Стык разгрузки', create('portable_storage_interface'), 2, ['rail_cargo_vault', 'nether_mv_conveyor'], 'Один интерфейс едет в составе, второй стоит у приёмки. Ящики первой партии оставь в вагоне до предъявления накладной.', true],
  ['rail_doors', 'Двери грузового вагона', create('train_door'), 2, ['rail_balanced_axle', 'nether_mv_piston'], 'Собери двери из нержавейки, двух осей, шарниров и уплотнений.', true],
  ['rail_service_cart', 'Путевая вагонетка', mc('chest_minecart'), 1, ['rail_traction_housing', 'rail_first_track'], 'Тяговый корпус, оси и крепления нужны даже обычной вагонетке. Добавь сундук и уплотнения.', true],
  ['rail_sealed_batch', 'Восемь ящиков на рейс', ks('sealed_refractory_crate'), 8, ['rail_cargo_vault', 'yard_sealed_batch'], 'Два цикла сборщика упакуют 16 вкладышей. Загрузи восемь опломбированных ящиков в приклеенное хранилище.'],
  ['rail_dispatch_form', 'Накладная отправления', ks('rail_waybill'), 1, ['rail_stations', 'rail_controls', 'rail_sealed_batch'], 'Держа накладную, нажми ПКМ по станции, у которой стоит загруженный поезд. Накладная запомнит состав и координаты.'],
  ['rail_accept_batch', 'Принять первый груз', ks('rail_delivery_receipt'), 1, ['rail_dispatch_form', 'rail_cargo_vault', 'rail_glue'], 'Перевези состав на вторую станцию и предъяви накладную. Станция выдаст квитанцию и примет все восемь ящиков из вагона.'],
  ['rail_second_batch', 'Вторая смена поставок', ks('rail_delivery_receipt'), 2, ['rail_accept_batch'], 'Оформи новый бланк и отвези вторую партию. Запас пригодится при серийной сборке корпусов HV.', true]
])

chapter('hv_foundry', 'XIII. Высокое напряжение', gt('hv_machine_hull'), [
  ['hv_ceramic_substrate', 'Керамическая подложка', ks('ceramic_hv_substrate'), 1, ['nether_refractory_liner', 'pressed_steel_frame'], 'Пресс Immersive Engineering формует подложку из обожжённого вкладыша. На один цикл уходит 24 000 FE.'],
  ['hv_circuit_preform', 'Собрать модуль HV', ks('hv_circuit_preform'), 1, ['hv_blaze_burner', 'nether_kanthal_winding', 'printed_phenolic', 'chemical_grade_seal', 'mv_ie_electrum_wire'], 'Спрессуй в нагретой чаше Create керамику, фенольную плату, две схемы MV, две канталовые намотки, медь, электрум и уплотнение.'],
  ['hv_sealed_module', 'Опрессовать при 4,5 бар', ks('sealed_hv_module'), 1, ['hv_circuit_preform', 'liquid_process_compressor', 'first_polyethylene', 'reinforced_process_tube', 'mv_safety_module', 'mv_ie_connector'], 'Загрузи заготовку, полиэтилен, усиленную трубу, два уплотнения и соединитель MV от IE. Поставь предохранитель на воздушной линии и контролируй по манометру 4,5 бар.'],
  ['hv_circuit', 'Первая схема HV на MV', gt('advanced_integrated_circuit'), 1, ['hv_board_assembler', 'rail_gold_blank', 'nether_stainless_plates'], 'В сборщик схем MV загрузи два герметичных модуля, по четыре схемы MV, резистора и припоя, два золотых контакта и два листа нержавейки. Подай 600 мБ смазки. Базовый цикл 144 секунды.'],
  ['hv_gold_wire', 'Волочение золотого провода', gt('gold_single_wire'), 4, ['rail_gold_blank', 'nether_mv_wiremill'], 'Одна золотая заготовка даёт два провода в волочильном стане MV.'],
  ['hv_gold_cable', 'Кабель на 512 EU', gt('gold_single_cable'), 4, ['hv_gold_wire', 'first_polyethylene', 'chemical_grade_seal', 'reinforced_process_tube'], 'Подай четыре провода, полиэтилен, изоляцию, уплотнения, пневмотрубу и 350 мБ смазки. Держи первый ввод HV рядом с генератором.'],
  ['hv_winding', 'Пакет золотых и канталовых обмоток', ks('hv_winding_pack'), 2, ['hv_ie_field_coil', 'nether_kanthal_winding', 'nether_stainless_plates'], 'Сборщик MV соединяет провод и кантал с обмоткой IE. Подай 450 мБ смазки на пару пакетов.'],
  ['hv_arc_shield', 'Дугогашение', ks('hv_arc_shield'), 2, ['hv_ceramic_substrate', 'nether_stainless_plates', 'pressed_iron'], 'Добавь к керамике нержавейку, горячую болванку, футеровку, раму IE и прессованное железо. На пару деталей подай 500 мБ дистиллята.'],
  ['hv_casing', 'Оболочка HV', gt('hv_machine_casing'), 1, ['hv_arc_shield', 'nether_stainless_plates', 'pressure_walls'], 'Собери оболочку из нержавейки, огнеупоров, тяжёлого блока IE и стенки камеры PneumaticCraft.'],
  ['hv_hull', 'Корпус с принятыми огнеупорами', gt('hv_machine_hull'), 1, ['hv_casing', 'yard_accept_batch', 'hv_gold_cable', 'rail_switch_contacts', 'mv_ie_connector'], 'На один корпус расходуется ящик огнеупоров после входного контроля. Добавь корпус MV, разъём IE и усиленную пневмотрубу.'],
  ['hv_motor', 'Электродвигатель HV', gt('hv_electric_motor'), 1, ['hv_circuit', 'hv_winding', 'hv_gold_cable', 'lv_create_precision'], 'Установи пакеты обмоток вокруг двигателя MV. Добавь обмотку IE и прецизионный механизм Create.'],
  ['hv_piston', 'Силовой поршень HV', gt('hv_electric_piston'), 1, ['hv_motor', 'nether_mv_piston', 'rail_balanced_axle', 'pressure_interfaces'], 'Подготовь мотор, оси, механический поршень Create и интерфейс камеры. Перенеси рабочую часть старого поршня MV.'],
  ['hv_pump', 'Герметичный насос HV', gt('hv_electric_pump'), 2, ['hv_motor', 'mv_pump', 'hv_arc_shield', 'mv_ie_fluid_pump'], 'Соедини насосы MV и IE, двигатель и дугогаситель. Для герметизации добавь усиленную пневмотрубу и прокладки.'],
  ['hv_conveyor', 'Транспортёр HV', gt('hv_conveyor_module'), 1, ['hv_motor', 'nether_mv_conveyor', 'rail_balanced_axle', 'mv_create_brass_funnel'], 'Подготовь полимерную передачу, воронку Create и конвейер IE. Поставь их на старый модуль MV вместе с двигателями и осями.'],
  ['hv_robot', 'Сборочный манипулятор HV', gt('hv_robot_arm'), 2, ['hv_piston', 'hv_motor', 'hv_winding', 'hv_create_arm'], 'На каждый манипулятор нужны привод MV, рука Create, мотор, поршень, обмотки и схема.'],
  ['hv_generator', 'Первый дизельный генератор HV', gt('hv_combustion'), 1, ['hv_hull', 'hv_pump', 'hv_motor', 'mv_diesel_generator', 'liquid_process_compressor'], 'Подготовь жидкотопливный компрессор и наладочный комплект. На сборку подай 1400 мБ дизеля и 120 EU/t. Оставь отдельный генератор MV на прежней линии.'],
  ['hv_input_hatch', 'Ввод высокого напряжения', gt('hv_energy_input_hatch'), 1, ['hv_hull', 'oil_energy_hatch', 'hv_winding', 'mv_ie_relay', 'hv_solder_bucket'], 'Собери ввод с реле IE и 550 мБ припоя. Подключи домну через люк HV, а генератор поставь рядом. Испытательная плавка потребляет 480 EU/t.'],
  ['hv_assembler', 'Сборщик 512 EU', gt('hv_assembler'), 1, ['hv_hull', 'hv_robot', 'hv_conveyor', 'hv_generator', 'hv_create_arm'], 'Один сборщик MV и механическая рука Create уйдут в новую машину. На цикл подай 1200 мБ смазки и 120 EU/t. Оставь второй сборщик MV для комплектующих.'],
  ['hv_mixer', 'Смеситель испытательных шихт', gt('hv_mixer'), 1, ['hv_assembler', 'hv_generator', 'nether_mv_mixer'], 'На 384 EU/t собери смеситель HV из предыдущей машины, нового корпуса, двигателей, схем и кабеля.'],
  ['hv_quench', 'Ванна для испытательной плавки', gt('hv_chemical_bath'), 1, ['hv_assembler', 'hv_pump', 'mv_chemical_bath'], 'Запитай ванну на 512 EU и подключи буфер дистиллята. На каждый образец уйдёт 1000 мБ.'],
  ['hv_trial_charge', 'Загрузка на испытательную смену', ks('hv_trial_charge'), 16, ['hv_mixer', 'nether_chromite', 'nether_stainless_ingot', 'first_steel'], 'Смеситель HV готовит четыре порции из нержавейки, никеля, хромита, футеровки, шлака IE и угольного порошка. Подай 750 мБ дистиллята.'],
  ['hv_trial_billet', 'Испытание на 2550 К', ks('hot_hv_trial_billet'), 1, ['hv_trial_charge', 'hv_input_hatch', 'nether_kanthal_coils', 'hv_generator', 'mv_electrolyzer'], 'На одну болванку выдели 1200 мБ кислорода и 90 секунд работы при 480 EU/t. Используй канталовые катушки.'],
  ['hv_trial_coupon', 'Серия из 16 образцов', ks('hv_alloy_coupon'), 16, ['hv_trial_billet', 'hv_quench'], 'Проведи всю партию через домну и закалочную ванну. Собери 16 образцов для сдачи цеха.'],
  ['hv_foundry_accepted', 'Принять металлургическую смену', ks('hv_commissioning_report'), 1, ['hv_trial_coupon', 'hv_assembler', 'yard_accept_batch', 'rail_signal_relay', 'hv_arc_shield', 'mv_create_observer', 'hv_ie_field_coil', 'mv_pressure_regulator'], 'Загрузи 16 образцов, два принятых ящика, три схемы HV, два сигнальных реле, два дугогасителя и четыре листа нержавейки. Добавь наблюдатель Create, обмотку IE, регулятор PneumaticCraft и 1500 мБ дистиллята. Протокол нужен для пропуска в Энд.'],
  ['hv_bender', 'Серийный листогиб HV', gt('hv_bender'), 1, ['hv_assembler', 'hv_piston', 'nether_mv_bender'], 'Перенеси рабочий узел MV на новый корпус и два силовых поршня.', true],
  ['hv_macerator', 'Промышленное дробление HV', gt('hv_macerator'), 1, ['hv_assembler', 'hv_piston', 'nether_mv_macerator'], 'Используй запасной мацератор MV. Полевую машину оставь на линии снабжения базальтом.', true],
  ['hv_thermal_centrifuge', 'Термическое разделение HV', gt('hv_thermal_centrifuge'), 1, ['hv_assembler', 'hv_motor'], 'Установи два двигателя в новый корпус и добавь термоцентрифугу MV.', true],
  ['hv_ancient_scrap', 'Извлечь древний сплав', mc('netherite_scrap'), 6, ['hv_thermal_centrifuge', 'nether_transit'], 'Вместо простой плавки прогоняй древние обломки через термоцентрифугу при 384 EU/t.', true],
  ['hv_netherite', 'Первый незеритовый слиток', mc('netherite_ingot'), 1, ['hv_ancient_scrap', 'hv_trial_coupon'], 'Соедини шесть обломков с золотом, образцом сплава HV и огнеупорами при 480 EU/t.', true],
  ['hv_netherite_insert', 'Вставка для кузнечного стола', ks('netherite_upgrade_charge'), 1, ['hv_netherite', 'hv_trial_coupon'], 'Сборщик добавляет к слитку два испытательных образца и уплотнения. Кузнечному столу также нужен шаблон из бастиона.', true],
  ['hv_station_backup', 'Резервный источник HV', gt('hv_steam_turbine'), 1, ['hv_assembler', 'hv_motor', 'hv_generator'], 'Собери турбину на отдельной магистрали. Держи резерв, пока основной цех обслуживает дизельный генератор.', true],
  ['hv_tool_drive', 'Силовой блок электроинструмента', gt('hv_power_unit'), 1, ['hv_assembler', 'hv_motor', 'hv_tool_battery', 'hv_create_arm'], 'Установи мотор, литиевую батарею и механизм Create на старый привод. Подай 950 мБ смазки. Новый блок хранит до 1,8 млн EU.', true],
  ['hv_tool_battery', 'Литиевая батарея HV', gt('hv_lithium_battery'), 1, ['hv_shop_battery_hull', 'hv_shop_coil'], 'Перенеси литиевую батарею MV в новую кассету. Добавь литиевую и углеродную пыль, катушку, контакты и 900 мБ серной кислоты.', true],
  ['hv_electric_drill', 'Бур с новой передачей', gt('hv_bronze_drill'), 1, ['hv_tool_drive', 'hv_piston', 'hv_shop_charger'], 'Собери бур из бронзовой машины MV, нового силового блока, поршня и бура Create. Подай 850 мБ смазки, затем заряди инструмент.', true],
  ['hv_output_bus', 'Отдельная шина серийного выпуска', gt('hv_output_bus'), 1, ['hv_assembler', 'hv_conveyor'], 'Добавь выходную шину с двумя транспортёрами и отдельный буфер для следующей смены.', true],
  ['hv_reserve_anchor', 'Незерская точка восстановления', mc('respawn_anchor'), 1, ['hv_assembler', 'hv_arc_shield', 'hv_circuit', 'nether_transit'], 'Собери якорь из плачущего обсидиана, светокамня и огнеупоров. Для заряда привези дополнительный светокамень.', true]
])

chapter('end_expedition', 'XIV. Экспедиция в Энд', ks('end_transit_permit'), [
  ['end_pass', 'Промышленный допуск', ks('end_transit_permit'), 1, ['hv_foundry_accepted', 'hv_assembler', 'yard_accept_batch', 'early_hv_foundry_hv_sensors', 'hv_sealed_module', 'mv_ie_insulated_wire'], 'Подай протокол, датчики, дугогасители, принятые огнеупоры, герметичный модуль и изолированный моток IE. Держи пропуск в инвентаре при входе в Энд.'],
  ['end_optic', 'Оптическая вставка', ks('ender_optical_insert'), 2, ['hv_assembler', 'hv_ceramic_substrate', 'rail_gold_blank', 'hv_pressing_basin'], 'Спрессуй в чаше Create жемчуг, стекло, керамику IE, золотую заготовку, точёный контакт и изоляцию. Получишь две вставки.'],
  ['end_first_eye', 'Стабилизировать око', mc('ender_eye'), 1, ['end_optic', 'chemical_grade_seal', 'liquid_process_compressor', 'hv_gold_wire'], 'Подай вставку, огненный порошок, уплотнение и золотой провод в камеру PneumaticCraft. Требуется 4,55 бар.'],
  ['end_portal_eyes', 'Запас на поиск крепости', mc('ender_eye'), 16, ['end_first_eye'], 'Подготовь запас очей для поиска крепости и заполнения рамок. Для входа в уже активный портал тоже понадобится пропуск.', true],
  ['end_field_power', 'Выездная дизельная станция HV', gt('hv_combustion'), 1, ['end_pass', 'hv_generator'], 'Перевези генератор, дизель и кабель HV. Выдели площадку под резак, газосборник и ёмкость для вывоза смеси.'],
  ['end_field_drums', 'Три ёмкости для экспедиции', gt('steel_drum'), 3, ['end_field_power', 'oil_drum'], 'Оставь отдельные бочки под дизель, сырой газ и очищенную фракцию.', true],
  ['end_field_macerator', 'Резак для эндерняка', gt('hv_cutter'), 1, ['hv_assembler', 'hv_shop_cutter', 'end_field_power'], 'Привези резак HV в Энд. Подведи смазку и подключи коротким кабелем к генератору.'],
  ['end_stone_stock', 'Партия эндерняка', mc('end_stone'), 32, ['end_pass', 'end_first_eye'], 'Добывай эндерняк для первой партии. Сохрани часть блоков для кладки.'],
  ['end_grit', 'Распил эндерняка на месте', ks('endstone_grit'), 16, ['end_field_macerator', 'end_stone_stock', 'paraffin_cake'], 'Четыре блока эндерняка и 300 мБ смазки дают две порции концентрата при 384 EU/t. Резак выполняет эту операцию только в Энде.'],
  ['end_collector', 'Газосборник HV', gt('hv_gas_collector'), 1, ['end_field_power', 'hv_pump', 'hv_hull'], 'Перенеси газосборник MV на корпус HV и добавь насосы, схемы и кабель. Поставь машину в Энде.'],
  ['end_filter_mesh', 'Сетка газовой кассеты', ks('end_filter_blank'), 4, ['end_field_power', 'nether_stainless_plates', 'rail_switch_contacts', 'refinery_tray', 'hv_pressing_basin'], 'Спрессуй в чаше Create две сетки, нержавейку, тарелку IE, медную полосу, изоляцию и точёный контакт.'],
  ['end_sample_filter', 'Заправить газовую кассету', ks('end_sampling_filter'), 2, ['end_filter_mesh', 'activated_carrier', 'paraffin_cake', 'hv_sealed_module'], 'Обожми сетку с носителем, парафином, уплотнением и прессованным железом при 4,25 бар. Отправь готовую кассету в газосборник.'],
  ['end_centrifuge', 'Центрифуга для разделения газов', gt('hv_centrifuge'), 1, ['hv_assembler', 'hv_motor', 'hv_hull'], 'Собери машину HV из центрифуги MV, двух моторов и нового корпуса. Отведи два жидкостных выхода в отдельные буферы.'],
  ['end_separated_gas', 'Разделить первую газовую пробу', ks('spent_end_filter'), 1, ['end_collector', 'end_sample_filter', 'end_grit', 'end_centrifuge'], 'Газосборник в Энде даёт 1200 мБ сырой смеси на кассету. Добавь к смеси сетку и две порции концентрата. Центрифуга выдаст 800 мБ защитного газа, 400 мБ аргона и отработанный фильтр.'],
  ['end_recovered_filter', 'Возврат сетки', ks('end_filter_blank'), 4, ['end_separated_gas', 'hv_quench', 'water_distillery'], 'Промой каждый отработанный фильтр 600 мБ дистиллята. Забери сетки и отведи хвосты.', true],
  ['end_chorus_crop', 'Сырьё для диэлектрика', mc('chorus_fruit'), 16, ['end_pass', 'end_stone_stock'], 'Собери плоды хоруса. Для серийного снабжения разведи растения на эндерняке.', true],
  ['end_popped_chorus', 'Сушить хорус под газом', mc('popped_chorus_fruit'), 4, ['end_separated_gas', 'end_chorus_crop', 'thermopneumatic_plants'], 'Подай три плода и 160 мБ защитного газа в горячую установку PneumaticCraft при 423 К и 4 бар. На выходе два сушёных плода.'],
  ['end_dielectric', 'Диэлектрическая плёнка', ks('chorus_dielectric_film'), 2, ['end_popped_chorus', 'hv_quench'], 'Три порции сушёного хоруса промой в ванне HV с 650 мБ дистиллята. Плёнка нужна вакуумным подложкам.'],
  ['end_brick_supply', 'Кладка из эндерняка', mc('end_stone_bricks'), 4, ['end_grit', 'vacuum_tile', 'end_separated_gas'], 'В чаше Create спрессуй эндерняк, концентрат, плитку и раствор. Подай 200 мБ защитного газа. Плиты и ограждения проходят отдельную сборку.', true],
  ['end_purpur_supply', 'Пурпурный композит', mc('purpur_block'), 4, ['end_dielectric', 'vacuum_tile', 'hv_pressing_basin'], 'Отпрессуй сушёный хорус с диэлектриком, концентратом и керамикой. Подай 300 мБ защитного газа. Для колонн подготовь плитки, вакуумные уплотнения и стальной компонент IE.', true],
  ['end_rod_batch', 'Светильники экспедиции', mc('end_rod'), 4, ['end_dielectric', 'vacuum_tile'], 'Для стержней нужны огненные стержни, плёнка, стекло, керамика и золотая проволока. Подай защитный газ.', true],
  ['end_field_cache', 'Сундук для второй площадки', mc('ender_chest'), 1, ['end_first_eye', 'vacuum_tile', 'end_separated_gas', 'mv_create_observer'], 'Добавь к обсидиану два ока, вакуумную плитку, уплотнения, наблюдатель Create и разъём IE. Подай защитный газ.', true],
  ['end_shell_storage', 'Герметичный шалкеровый ящик', mc('shulker_box'), 1, ['end_pass', 'vacuum_tile', 'end_dielectric', 'mv_create_brass_funnel'], 'Собери ящик из панцирей, сундука, плитки, уплотнений, воронки Create, пропитанной древесины и оси. Подай смазку.', true]
])

chapter('ev_vacuum', 'XV. Вакуум и титан', gt('vacuum_freezer'), [
  ['vacuum_seal_preform', 'Вакуумная заготовка', ks('vacuum_seal_preform'), 2, ['end_grit', 'first_polyethylene', 'chemical_grade_seal'], 'Смешай полиэтилен, алюминий, эндерняк, сетку и химстойкие прокладки. Сборщик принимает смазку.'],
  ['vacuum_gasket', 'Опрессовать вакуумные уплотнения', ks('vacuum_gasket'), 4, ['vacuum_seal_preform', 'liquid_process_compressor', 'pressed_iron'], 'В камеру подай заготовку, химстойкое уплотнение и прессованное железо. Нужны 4,5 бар.'],
  ['vacuum_tile_mix', 'Эндерняковая шихта', ks('vacuum_tile_mix'), 4, ['end_grit', 'hv_mixer', 'nether_refractory_mix', 'nether_chromite'], 'Замеси концентрат, огнеупорную смесь, хромит и изоляцию в смесителе с дистиллятом.'],
  ['vacuum_tile_blank', 'Прессование керамики', ks('vacuum_tile_blank'), 4, ['vacuum_tile_mix', 'pressed_steel_frame'], 'Спрессуй каждую порцию на тяжёлом прессе Immersive Engineering с формой пластины.'],
  ['vacuum_tile', 'Спекание вакуумной плитки', ks('sintered_vacuum_tile'), 4, ['vacuum_tile_blank', 'end_separated_gas', 'hv_input_hatch'], 'Спекай плитку в домне при 2500 К и 480 EU/t. На порцию уходят 250 мБ защитного газа.'],
  ['vacuum_pump_core', 'Насосный блок', ks('vacuum_pump_core'), 2, ['vacuum_tile', 'vacuum_gasket', 'hv_pump'], 'На один блок идут два насоса HV, двигатель, бочка, уплотнения, керамика и защитные детали.'],
  ['vacuum_casings', 'Алюминиевые холодостойкие корпуса', gt('frostproof_machine_casing'), 20, ['vacuum_tile', 'vacuum_gasket', 'aluminium_plate'], 'Сборщик HV выпускает по два корпуса из алюминия, керамики, уплотнений, стальных рам и листа нержавейки.'],
  ['vacuum_item_input', 'Шина горячих заготовок', gt('hv_input_bus'), 1, ['hv_assembler', 'hv_conveyor'], 'Выдели входную шину под горячие изделия и заготовки. Для жидкостей потребуются отдельные люки.'],
  ['vacuum_item_output', 'Шина охлаждённых деталей', gt('hv_output_bus'), 1, ['hv_assembler', 'hv_conveyor'], 'Поставь отдельную выходную шину и оставь место для непрерывного охлаждения изделий.'],
  ['vacuum_fluid_inputs', 'Два входа для вакуума', gt('hv_input_hatch'), 2, ['hv_assembler', 'hv_pump', 'hv_hull'], 'К одному люку подведи холодный теплоноситель, к другому защитный газ.'],
  ['vacuum_fluid_output', 'Возврат нагретой жидкости', gt('hv_output_hatch'), 1, ['hv_assembler', 'hv_pump', 'oil_output_hatch'], 'Из выходного люка теплоноситель пойдёт в буфер перед охлаждением.'],
  ['vacuum_controller', 'Камера 3×3×3', gt('vacuum_freezer'), 1, ['vacuum_pump_core', 'vacuum_casings', 'vacuum_item_input', 'vacuum_item_output', 'vacuum_fluid_inputs', 'vacuum_fluid_output', 'ebf_maintenance'], 'Поставь контроллер в центр передней грани куба с пустым центром. Добавь энерговвод HV, обычный люк обслуживания, две предметные шины, два жидкостных входа и выход.'],
  ['vacuum_hv_reactor', 'Химический реактор HV', gt('hv_chemical_reactor'), 1, ['hv_assembler', 'hv_pump', 'mv_chemical_reactor'], 'Собери реактор HV из машины MV. Для первого заполнения контура используй парафин, сетку, дистиллят и защитный газ.'],
  ['vacuum_cooler', 'Охладитель PneumaticCraft', pnc('thermopneumatic_processing_plant'), 1, ['vacuum_hv_reactor', 'thermopneumatic_plants', 'liquid_process_compressor'], 'Охлади нагретый теплоноситель при 3,25 бар и температуре не выше 278 К. Из 1000 мБ возвращаются 1000 мБ холодной жидкости.'],
  ['vacuum_loop_buffers', 'Развести горячий и холодный буферы', gt('steel_drum'), 2, ['vacuum_cooler', 'vacuum_fluid_output'], 'Раздели две ёмкости. Подключи выход камеры к горячей, выход охладителя к холодной. Защитный газ поступает третьей линией.'],
  ['vacuum_rutile', 'Промыть рутиловый концентрат', ks('purified_rutile'), 2, ['vacuum_hv_reactor', 'end_separated_gas', 'washed_bauxite'], 'Реактор принимает промытый боксит, эндерняк, дистиллят и защитный газ. Отводи хвосты.'],
  ['vacuum_titanium_charge', 'Загрузить титановую шихту', ks('titanium_reduction_charge'), 2, ['vacuum_rutile', 'hv_mixer', 'vacuum_tile'], 'Смешай рутил, алюминий, хромит и спечённую плитку.'],
  ['vacuum_titanium_hot', 'Плавка титана под аргоном', ks('hot_titanium_billet'), 1, ['vacuum_titanium_charge', 'end_separated_gas', 'nether_kanthal_coils'], 'Домне нужны 2700 К, 480 EU/t и 400 мБ аргона на болванку. Часть горячих болванок отложи на силовые рамы.'],
  ['vacuum_titanium_ingot', 'Титан после вакуума', gt('titanium_ingot'), 1, ['vacuum_titanium_hot', 'vacuum_controller', 'vacuum_loop_buffers'], 'Камера расходует 1000 мБ холодного теплоносителя и 150 мБ защитного газа. На выходе слиток и 1000 мБ нагретой жидкости.'],
  ['vacuum_titanium_plate', 'Первая партия титановых листов', gt('titanium_plate'), 8, ['vacuum_titanium_ingot', 'hv_bender'], 'Прокатай титан на листогибе HV. Листы пойдут в EV-корпуса, схемы и двигатель.'],
  ['vacuum_panel_blank', 'Заготовка чистовой панели', ks('clean_panel_blank'), 4, ['vacuum_tile', 'vacuum_gasket', 'first_polyethylene', 'hv_blaze_burner', 'hv_shop_ie_wire'], 'Спрессуй плитку, полиэтилен, нержавейку, уплотнение и проволоку IE в нагретой чаше Create. Подай 180 мБ защитного газа.'],
  ['vacuum_panel_hot', 'Обжечь панель под защитным газом', ks('hot_clean_panel'), 2, ['vacuum_panel_blank', 'hv_input_hatch', 'end_separated_gas'], 'Обжиг при 2480 К требует 200 мБ защитного газа на панель.'],
  ['vacuum_panel', 'Панель из вакуумной камеры', ks('vacuum_treated_panel'), 4, ['vacuum_panel_hot', 'vacuum_controller', 'vacuum_loop_buffers'], 'Прогони горячие панели через камеру. Верни нагретый теплоноситель в PneumaticCraft.'],
  ['vacuum_panel_stock', 'Серия панелей для лаборатории', ks('vacuum_treated_panel'), 32, ['vacuum_panel'], 'Поддерживай расход газа и отвод теплоносителя, пока камера готовит панели для стен и фильтров.', true]
])

chapter('ev_cleanroom', 'XVI. Чистая комната', gt('cleanroom'), [
  ['cleanroom_wall', 'Пластикрит для оболочки', gt('plascrete'), 4, ['vacuum_panel', 'vacuum_tile', 'vacuum_gasket'], 'На четыре блока уходят две обработанные панели, две плитки, уплотнение и стальные рамы.'],
  ['cleanroom_shell_stock', 'Запас на оболочку 5×5×5', gt('plascrete'), 88, ['cleanroom_wall'], 'Заготовь стеновые блоки. Часть мест займут контроллер, фильтры, энерголюк, обслуживание, дверь и проводка.'],
  ['cleanroom_glass', 'Смотровое стекло', gt('cleanroom_glass'), 4, ['vacuum_panel', 'vacuum_gasket', 'cleanroom_wall'], 'Стекло собирается из оконных панелей и вакуумных деталей. Можно использовать его в стене чистой комнаты.', true],
  ['cleanroom_filter_pack', 'Фильтровальный пакет', ks('cleanroom_filter_pack'), 4, ['end_filter_mesh', 'vacuum_tile', 'vacuum_gasket'], 'Собери сетки, керамику, полиэтилен и уплотнение в сменный пакет.'],
  ['cleanroom_filters', 'Фильтры в потолок', gt('filter_casing'), 10, ['cleanroom_filter_pack', 'cleanroom_wall', 'vacuum_panel'], 'В комнате 5×5×5 заполни восемь ячеек потолка вокруг контроллера фильтрами. Два дополнительных фильтра расходуются на контроллер.'],
  ['cleanroom_controller', 'Собрать чистую комнату', gt('cleanroom'), 1, ['cleanroom_filters', 'cleanroom_shell_stock', 'vacuum_pump_core', 'hv_hull', 'ebf_maintenance'], 'Поставь контроллер по центру потолка и восемь фильтров вокруг. В стену поставь энерговвод и обычный люк обслуживания. Устрани неисправности, закрой дверь и дай комнате набрать чистоту.'],
  ['cleanroom_power_feed', 'Ввод кабеля для станков', gt('hv_machine_hull'), 1, ['cleanroom_controller', 'hv_gold_cable'], 'Пропусти питание станков через корпус HV или диод в стене. Генераторы оставь снаружи.'],
  ['cleanroom_laser', 'Лазерный гравёр HV', gt('hv_laser_engraver'), 1, ['cleanroom_controller', 'hv_assembler', 'hv_winding'], 'Размести гравёр внутри и запитай его на 512 EU. Перед гравировкой дай комнате набрать чистоту.'],
  ['cleanroom_laser_mask', 'Лазерная маска', ks('laser_mask'), 2, ['end_optic', 'vacuum_tile', 'hv_ceramic_substrate'], 'Для маски используй оптическую вставку, две стеклянные панели, керамическую подложку и золотую заготовку. Маска расходуется при гравировке.'],
  ['cleanroom_preform', 'Вакуумная заготовка подложки', ks('vacuum_wafer_preform'), 2, ['vacuum_panel', 'end_dielectric', 'printed_phenolic'], 'Положи плёнку хоруса, фенольную плату и медную полосу на керамическую панель.'],
  ['cleanroom_wafer_conditioned', 'Стабилизация подложки в вакууме', ks('conditioned_wafer'), 2, ['cleanroom_preform', 'vacuum_loop_buffers', 'vacuum_controller'], 'Подай в камеру заготовку, защитный газ и охлаждённую жидкость. Отведи нагретый теплоноситель обратно в контур.'],
  ['cleanroom_wafer_etched', 'Первая гравировка', ks('etched_cleanroom_wafer'), 1, ['cleanroom_wafer_conditioned', 'cleanroom_laser_mask', 'cleanroom_laser', 'cleanroom_power_feed'], 'Подложка и маска проходят гравёр при 480 EU/t. Цикл запускается в работающей чистой комнате.'],
  ['cleanroom_wafer_series', 'Серия подложек до сборки', ks('etched_cleanroom_wafer'), 16, ['cleanroom_wafer_etched'], 'Приготовь запас масок. Поддерживай чистоту и возвращай теплоноситель, пока гравёр делает серию.', true],
  ['cleanroom_circuit_machine', 'Сборщик схем HV', gt('hv_circuit_assembler'), 1, ['cleanroom_controller', 'hv_assembler', 'hv_circuit'], 'Поставь сборщик схем рядом с гравёром и проложи линию защитного газа.'],
  ['cleanroom_logic_preform', 'Сложить логику EV', ks('ev_logic_preform'), 1, ['cleanroom_wafer_etched', 'cleanroom_circuit_machine', 'hv_sealed_module', 'end_dielectric'], 'В чистой комнате соедини подложку, герметичный модуль HV, плёнку, контакты, припой и уплотнение. Подай 100 мБ газа.'],
  ['cleanroom_ev_module', 'Опрессовка модуля EV', ks('ev_control_module'), 1, ['cleanroom_logic_preform', 'vacuum_gasket', 'liquid_process_compressor', 'hv_shop_ie_relay', 'reinforced_process_tube'], 'Опрессуй модуль, уплотнение, прессованное железо, усиленную трубу и реле HV от IE при 4,6 бар в PneumaticCraft.'],
  ['cleanroom_first_ev_circuit', 'Первая схема EV на HV', gt('micro_processor_computer'), 1, ['cleanroom_ev_module', 'cleanroom_circuit_machine', 'vacuum_titanium_plate'], 'В чистой комнате подай два модуля, по четыре гравированные подложки и схемы HV, по два золотых контакта и титановых листа, четыре детали припоя и 400 мБ защитного газа. Базовый цикл 136 секунд.'],
  ['cleanroom_circuit_stock', 'Серийный запас схем EV', gt('micro_processor_computer'), 16, ['cleanroom_first_ev_circuit'], 'Нарасти выпуск подложек и модулей. Схемы расходуются на двигатель, кабельные вводы и станки.', true]
])

chapter('ev_power', 'XVII. Напряжение EV', gt('large_combustion_engine'), [
  ['ev_busbar_blank', 'Шинная заготовка', ks('ev_harness'), 2, ['vacuum_tile', 'vacuum_gasket', 'hv_winding'], 'Соедини алюминий, золотые заготовки, спечённую керамику, обмотку и уплотнения.'],
  ['ev_wiremill_hv', 'Волочильный стан HV', gt('hv_wiremill'), 1, ['hv_assembler', 'nether_mv_wiremill', 'hv_piston'], 'Перенеси волочильный узел MV на усиленный корпус и добавь силовые поршни.'],
  ['ev_aluminium_wire', 'Алюминиевый провод', gt('aluminium_single_wire'), 4, ['ev_busbar_blank', 'ev_wiremill_hv'], 'Стан HV выпускает по четыре провода из подготовленной заготовки.'],
  ['ev_aluminium_cable', 'Магистраль на 2048 EU', gt('aluminium_single_cable'), 4, ['ev_aluminium_wire', 'vacuum_gasket', 'first_polyethylene'], 'На изоляцию кабеля расходуются полиэтилен, вакуумные уплотнения и плитка.'],
  ['ev_wide_cable', 'Кабель на четыре ампера', gt('aluminium_quadruple_cable'), 1, ['ev_aluminium_cable', 'ev_busbar_blank'], 'В сборщике установи схему настройки 4. Толстая магистраль расходует четыре одинарных кабеля и четыре уплотнения.', true],
  ['ev_pressure_cage', 'Титановая силовая рама', ks('ev_pressure_cage'), 1, ['vacuum_titanium_plate', 'vacuum_titanium_hot', 'vacuum_panel'], 'Собери раму из двух горячих титановых болванок, листов, панелей, уплотнений и корпуса HV.'],
  ['ev_phase_relay', 'Реле с чистовой подложкой', ks('ev_phase_relay'), 1, ['cleanroom_ev_module', 'cleanroom_wafer_etched', 'cleanroom_circuit_machine'], 'В чистой комнате подай модуль, подложки, излучатель HV, контакты, титан и уплотнение. Нужны 250 мБ газа.'],
  ['ev_traction_coil', 'Силовая обмотка', ks('ev_traction_coil'), 2, ['ev_aluminium_wire', 'nether_kanthal_winding', 'hv_winding', 'vacuum_titanium_plate'], 'Намотай алюминий и кантал на пакет HV. Добавь титан, уплотнение и контакт.'],
  ['ev_engine_jacket', 'Рубашка охлаждения', ks('ev_engine_jacket'), 1, ['vacuum_panel', 'vacuum_pump_core', 'vacuum_titanium_plate'], 'Для рубашки нужны титан, панели, насосы, теплообменники и четыре вакуумных уплотнения.'],
  ['ev_machine_casing', 'Титановая оболочка', gt('ev_machine_casing'), 1, ['ev_pressure_cage', 'vacuum_panel', 'vacuum_titanium_plate'], 'Шесть титановых листов, рама, панели, оболочка HV и уплотнения собираются на HV.'],
  ['ev_hull', 'Корпус EV', gt('ev_machine_hull'), 1, ['ev_machine_casing', 'ev_phase_relay', 'ev_aluminium_cable', 'cleanroom_ev_module'], 'Собери оболочку с корпусом HV, двумя модулями, двумя реле, кабелем, титаном и уплотнениями.'],
  ['ev_motor', 'Двигатель EV', gt('ev_electric_motor'), 1, ['ev_traction_coil', 'cleanroom_first_ev_circuit', 'hv_motor'], 'Установи двигатель HV в новую обмотку с титановыми листами и вакуумными уплотнениями.'],
  ['ev_pump', 'Герметичный насос EV', gt('ev_electric_pump'), 2, ['ev_motor', 'hv_pump', 'vacuum_panel'], 'На каждый насос нужны насос HV, мотор EV, два листа титана, уплотнения, панель и кабель.'],
  ['ev_piston', 'Поршень EV', gt('ev_electric_piston'), 1, ['ev_motor', 'hv_piston', 'ev_pressure_cage'], 'Закрепи двигатель и старый поршень на выверенных осях в титановой раме.'],
  ['ev_conveyor', 'Передача EV', gt('ev_conveyor_module'), 1, ['ev_motor', 'hv_conveyor', 'end_dielectric'], 'Соедини старый модуль с двумя моторами, осями, титаном и диэлектриком.'],
  ['ev_robot', 'Манипулятор EV', gt('ev_robot_arm'), 2, ['ev_piston', 'ev_motor', 'hv_robot'], 'Для сборщика подготовь два манипулятора. Каждый требует предыдущую руку, мотор, поршень, обмотку и реле.'],
  ['ev_assembler', 'Сборщик EV', gt('ev_assembler'), 1, ['ev_hull', 'ev_robot', 'ev_conveyor', 'hv_assembler'], 'Собери машину EV при 480 EU/t. Один сборщик HV уходит в рецепт, поэтому оставь второй для старых деталей.'],
  ['ev_stable_casing', 'Стабильный титановый кожух', gt('stable_machine_casing'), 20, ['ev_pressure_cage', 'vacuum_panel', 'ev_hull'], 'Облицовка двигателя требует титана, панелей, уплотнений, рамы и стального корпуса. Выпускай партиями по два блока.'],
  ['ev_engine_gear', 'Титановый редуктор', gt('titanium_gearbox'), 4, ['ev_motor', 'vacuum_titanium_plate', 'rail_balanced_axle'], 'Сборщик принимает нержавеющий редуктор, два мотора, титан, оси и уплотнения. Часть редукторов уйдёт в контроллер.'],
  ['ev_engine_intake', 'Воздухозаборники двигателя', gt('engine_intake_casing'), 8, ['ev_engine_jacket', 'ev_pump', 'cleanroom_filters'], 'Установи фильтры и насос на рубашке с титаном и уплотнениями. За цикл выходят два воздухозаборника. Восемь блоков окружают контроллер.'],
  ['ev_engine_energy_out', 'Вывод 2048 EU', gt('ev_energy_output_hatch'), 1, ['ev_hull', 'ev_aluminium_cable', 'ev_phase_relay'], 'На выходной люк расходуется люк HV, корпус, обмотки, кабели и реле. Подведи к нему алюминиевую магистраль.'],
  ['ev_engine_fluid_in', 'Отдельные входы дизеля и смазки', gt('ev_input_hatch'), 2, ['ev_hull', 'ev_engine_jacket', 'ev_pump'], 'Поставь раздельные жидкостные входы на двигатель. Подведи дизель из нефтехимии и смазку из тяжёлой фракции.'],
  ['ev_engine', 'Большой дизельный двигатель', gt('large_combustion_engine'), 1, ['ev_stable_casing', 'ev_engine_gear', 'ev_engine_intake', 'ev_engine_energy_out', 'ev_engine_fluid_in', 'ebf_maintenance', 'ebf_muffler'], 'Два генератора HV входят в контроллер. Энерговыход ставится сзади. Установи люк обслуживания и глушитель по схеме JEI, подай дизель и смазку, оставь свободное пространство перед воздухозаборниками.'],
  ['ev_laser', 'Гравёр на напряжении EV', gt('ev_laser_engraver'), 1, ['ev_engine', 'ev_assembler', 'cleanroom_laser'], 'Собери гравёр из машины HV, излучателей EV и нового корпуса. Размести его в чистой комнате.'],
  ['ev_circuit_assembler', 'Линия чистовой сборки EV', gt('ev_circuit_assembler'), 1, ['ev_engine', 'ev_assembler', 'cleanroom_circuit_machine'], 'Установи сборщик схем EV в чистой комнате и подведи защитный газ.'],
  ['ev_calibration_mask', 'Калибровочная маска EV', ks('ev_etching_mask'), 2, ['ev_engine', 'ev_assembler', 'cleanroom_laser_mask', 'ev_phase_relay'], 'Подготовь маску из оптики, двух модулей EV, титана, реле и панелей. Сборщик работает при 1536 EU/t.'],
  ['ev_wafer_acceptance', 'Серия из 16 годных подложек', ks('ev_calibrated_wafer'), 16, ['ev_laser', 'ev_calibration_mask', 'cleanroom_wafer_etched'], 'Пропусти гравированные подложки через гравёр EV с калибровочными масками. Рецепт требует чистую комнату и 1536 EU/t.'],
  ['ev_foundry_accepted', 'Принять чистое производство', ks('ev_commissioning_report'), 1, ['ev_wafer_acceptance', 'ev_circuit_assembler', 'ev_engine'], 'Сдай 16 калиброванных подложек, схемы, модули, реле, панели и раму. Сборщик в чистой комнате работает при 1920 EU/t.'],
  ['ev_sterile_filters', 'Фильтры для следующей ступени', gt('sterilizing_filter_casing'), 2, ['ev_wafer_acceptance', 'cleanroom_filters', 'ev_assembler'], 'Дополни фильтры пакетами, панелями и калиброванной подложкой. Храни запас для стерильного передела.'],
  ['ev_end_crystal', 'Подготовить эндерный кристалл', mc('end_crystal'), 1, ['ev_wafer_acceptance', 'end_first_eye', 'ev_assembler'], 'К стеклу, оку и слезе гаста добавь вакуумные уплотнения, калиброванную подложку и реле. Подай защитный газ.', true],
  ['ev_drill', 'Бур EV', gt('ev_bronze_drill'), 1, ['ev_engine', 'ev_assembler', 'hv_electric_drill', 'ev_piston'], 'Сборка требует предыдущий бур, силовой блок EV, поршень, ванадиевую батарею, титан и новые схемы.', true]
])

chapter('me_automation', 'HV–EV. Автосборка ME', me('pattern_provider'), [
  ['me_pattern_laminate', 'Основа автоматического шаблона', ks('me_pattern_laminate'), 4, ['me_eng', 'hv_assembler', 'hv_circuit'], 'Ламинат соединяет фольгу, керамику, процессор, схему HV и нержавейку. Сборщик работает при 480 EU/t.'],
  ['me_covered', 'Изолированные кабели', me('fluix_covered_cable'), 8, ['me_glass_cable', 'first_polyethylene'], 'Четыре кварцевых кабеля обожми с полимером, изоляционными полосами и уплотнением.'],
  ['me_smart', 'Контроль каналов HV', me('fluix_smart_cable'), 8, ['me_covered', 'me_pattern_laminate'], 'Четыре изолированных кабеля получают вычислительный процессор и основу шаблона. Посмотри на деления при подключении шин.'],
  ['me_interface', 'Промежуточный инвентарь', me('interface'), 1, ['me_terminal', 'me_calc', 'nether_mv_conveyor'], 'Сборщик соединяет корпус, ядра, процессор, конвейер и уплотнение. Используй интерфейс для постоянного запаса на линии.'],
  ['me_blank_pattern', 'Заготовки шаблонов', me('blank_pattern'), 4, ['me_pattern_laminate', 'me_crafting_terminal'], 'На шаблон расходуются основа, фольга, контакт и полимер. Сделай отдельный под каждый рецепт.'],
  ['me_provider', 'Поставщик шаблонов', me('pattern_provider'), 1, ['me_interface', 'me_blank_pattern', 'hv_robot'], 'Подключи поставщик к машине. Закодируй фактические входы и выходы рецепта в режиме обработки.'],
  ['me_encode', 'Терминал кодирования', me('pattern_encoding_terminal'), 1, ['me_blank_pattern', 'me_crafting_terminal'], 'Поставь терминал на свободный канал. Закодируй простой рецепт и сохрани шаблон.'],
  ['me_molecular', 'Молекулярный сборщик', me('molecular_assembler'), 1, ['me_provider', 'me_inscriber'], 'К корпусу добавь инскрайбер, два ядра каждого вида и манипулятор HV. Соедини сборщик с поставщиком шаблонов.'],
  ['me_cpu', 'Корпус вычислительного кластера', me('crafting_unit'), 1, ['me_pattern_laminate', 'me_calc', 'hv_casing'], 'Пара процессоров каждого вида и корпус HV образуют вычислительную секцию.'],
  ['me_cpu_storage', 'Память автосборки 1k', me('1k_crafting_storage'), 1, ['me_cpu', 'me_1k'], 'Собери вычислительное хранилище на компоненте 1k. Поставь в кластер и проверь размер задания.'],
  ['me_mixed_job', 'Заказ на кабель со смазкой', gt('gold_single_cable'), 4, ['me_fluid_cell', 'me_provider', 'me_cpu_storage', 'me_encode'], 'Закодируй рецепт сборщика MV в режиме обработки. Впиши пять видов предметов и 350 мБ смазки. Подключи шину импорта к выдаче сборщика и закажи четыре золотых кабеля.'],
  ['me_recipe_return', 'Обратка химического реактора', me('import_bus'), 2, ['me_mixed_job', 'washed_oil_sample'], 'Отведи предметы и жидкости из химреактора на две шины. В шаблоне промывки укажи отработанный картридж, 800 мБ промытой нефти и 400 мБ солёной воды. Оставь под них место в сети.'],
  ['me_ingredient_buffer', 'Буфер предметов и жидкостей', 'expatternprovider:ingredient_buffer', 1, ['me_recipe_return', 'me_optical_link', 'ev_foundry_accepted'], 'Поставь поставщик шаблонов вплотную к буферу ExtendedAE. Выводы направь к входам станков с фильтрами по каждому виду сырья. На новом маршруте сначала выполни один заказ.'],
  ['me_line_distribution', 'Раздельные входы сборочной линии', gt('ulv_input_bus'), 8, ['me_ingredient_buffer', 'iv_line_controller'], 'Поставь предметные шины по порядку рецепта от контроллера. Из буфера отправляй в каждую шину один нужный предмет и в каждый жидкостный люк одну жидкость. Исследовательский носитель оставь в люке данных.'],
  ['me_pnc_process', 'Подача на термопневматическую установку', 'pneumaticcraft:thermopneumatic_processing_plant', 1, ['me_recipe_return', 'activated_carrier'], 'Подай катализатор и нафту одним шаблоном. На установке выдержи давление и температуру из JEI. Верни активированный носитель и этилен в сеть через выходные стороны.'],
  ['me_refinery_catalyst', 'Подача жидкостей на НПЗ', 'immersiveengineering:refinery', 1, ['me_recipe_return', 'process_commissioning'], 'Установи многоразовый носитель в НПЗ через его меню. В шаблон внеси только расходуемые жидкости. Подключи поставщик к одному из жидкостных входов и шину импорта к выходу дизеля.'],
  ['me_accel', 'Параллельная сборка', me('crafting_accelerator'), 1, ['me_cpu_storage', 'me_eng'], 'Поставь сопроцессор рядом с вычислительной секцией. Для нескольких шагов подготовь отдельные машины.'],
  ['me_16k', 'Память хранения 16k', me('item_storage_cell_16k'), 1, ['me_4k', 'me_pattern_laminate'], 'Три компонента 4k и два инженерных процессора проходят ещё одну сборку на HV.'],
  ['me_wireless', 'Терминал без кабеля', me('wireless_terminal'), 1, ['me_interface', 'me_pattern_laminate'], 'Собери приёмник из жемчуга, оптики и эмиттера. Для связи нужна отдельная точка доступа.'],
  ['me_p2p', 'Передача между секциями', me('me_p2p_tunnel'), 2, ['me_interface', 'me_smart', 'hv_assembler'], 'Собери два туннеля из интерфейсов, кабелей, датчиков и основ шаблона. Свяжи их картой памяти.'],
  ['me_optical_link', 'Сборка оптического узла', ks('me_optical_link'), 2, ['me_pattern_laminate', 'ev_circuit_assembler', 'vacuum_titanium_plate', 'cleanroom_controller'], 'Сборщик схем EV соединяет подложки и волокно в чистой комнате. Титан и процессор EV входят в каждый узел.'],
  ['me_64k', 'Память хранения 64k', me('item_storage_cell_64k'), 1, ['me_optical_link', 'me_16k', 'ev_assembler'], 'На компонент уходят три предыдущих модуля, инженерные процессоры и два оптических узла.'],
  ['me_256k', 'Серийная память 256k', me('item_storage_cell_256k'), 1, ['me_64k', 'ev_wafer_acceptance'], 'Компонент 256k требует три компонента 64k, схемы EV и калиброванные подложки.'],
  ['me_quantum', 'Квантовый мост EV', me('quantum_link'), 2, ['me_p2p', 'me_optical_link', 'ev_wafer_acceptance'], 'На мосты уйдут два готовых кольца и оптика. Пару сингулярностей свяжи в смесителе EV под защитным газом.', true],
  ['me_spatial', 'Пространственный порт', me('spatial_io_port'), 1, ['me_64k', 'ev_foundry_accepted'], 'Пересобери порт ввода-вывода на раме EV. Добавь оптику, манипуляторы и протокол. Пилоны и ячейки собираются отдельно.', true]
])

chapter('iv_metallurgy', 'XVIII. Вольфрам и платина', gt('nichrome_coil_block'), [
  ['iv_mixer_ev', 'Смеситель EV', gt('ev_mixer'), 1, ['ev_foundry_accepted', 'ev_assembler'], 'Перенеси узлы со смесителя HV на корпус EV. Этот станок готовит обе новые шихты.'],
  ['iv_centrifuge_ev', 'Центрифуга EV', gt('ev_centrifuge'), 2, ['iv_mixer_ev', 'ev_motor'], 'Собери две центрифуги. Одна останется в Энде, вторая отделит платиновую губку в основном цехе.'],
  ['iv_macerator_ev', 'Дробление руды в Энде', gt('ev_macerator'), 1, ['end_pass', 'ev_assembler', 'ev_piston'], 'Подготовь дробилку и генерацию EV для выездного передела. Руду добывай в жилах GregTech.'],
  ['iv_thermal_ev', 'Термоцентрифуга EV', gt('ev_thermal_centrifuge'), 1, ['iv_centrifuge_ev', 'ev_motor'], 'Установи отдельную горячую центрифугу для сушки осадка. Обычная центрифуга оставлена для сортировки и платины.'],
  ['iv_reactor_ev', 'Реактор EV', gt('ev_chemical_reactor'), 1, ['ev_assembler', 'ev_pump', 'hv_assembler'], 'Перенеси насос и реакционную часть на EV. Оставь отдельные ёмкости для рабочих и отработанных жидкостей.'],
  ['iv_bender_ev', 'Прокат на EV', gt('ev_bender'), 1, ['ev_piston', 'ev_assembler', 'hv_bender'], 'Собери отдельный листогиб. Он понадобится для нихрома, вольфрама, платины и вольфрамовой стали.'],
  ['iv_wiremill_ev', 'Тяга вольфрамового провода', gt('ev_wiremill'), 1, ['iv_bender_ev', 'ev_wiremill_hv'], 'Перенеси волочильный узел HV на корпус EV с силовыми поршнями.'],
  ['iv_nichrome_charge', 'Нихромовая шихта', ks('iv_nichrome_charge'), 4, ['iv_mixer_ev', 'nether_chromite', 'vacuum_tile'], 'Смешай никелевый и хромитовый концентраты с алюминиевой пылью и плиткой. Подай 900 мБ дистиллята.'],
  ['iv_hot_nichrome', 'Нихром на кантале', ks('iv_hot_nichrome'), 4, ['iv_nichrome_charge', 'nether_kanthal_coils', 'ev_engine'], 'В домне при 2780 К и 1536 EU/t подай 450 мБ аргона. Выведи горячие болванки к вакуумной камере.'],
  ['iv_nichrome_plate', 'Нихромовый лист', gt('nichrome_plate'), 8, ['iv_hot_nichrome', 'iv_bender_ev', 'vacuum_loop_buffers'], 'Закали болванку с 1000 мБ теплоносителя и 200 мБ аргона. Верни весь теплоноситель на охлаждение, слиток прокатай.'],
  ['iv_coil_core', 'Сердечник катушки', ks('iv_coil_core'), 4, ['iv_nichrome_plate', 'ev_traction_coil', 'nether_kanthal_winding'], 'Собери нихромовые пластины, канталовые обмотки и керамическую изоляцию. Подай смазку.'],
  ['iv_nichrome_coils', 'Два кольца по восемь катушек', gt('nichrome_coil_block'), 16, ['iv_coil_core', 'nether_kanthal_coils'], 'На два блока расходуется один канталовый, два сердечника, нихром, панели и уплотнения. Оснасти домну полным комплектом.'],
  ['iv_tungstate_ore', 'Вольфрамат', gt('crushed_tungstate_ore'), 9, ['iv_macerator_ev'], 'Найди в Энде вольфрамовую жилу и раздроби вольфрамат. Отложи шеелит отдельно.'],
  ['iv_scheelite_ore', 'Шеелит', gt('crushed_scheelite_ore'), 12, ['iv_macerator_ev'], 'Дроблёный шеелит пойдёт в реактор вместе с концентратом вольфрамата.'],
  ['iv_platinum_ore', 'Куперит', gt('crushed_cooperite_ore'), 12, ['iv_macerator_ev'], 'Куперит ищи в платиновой жиле Энда. Раздроби и отправь на отдельную линию.'],
  ['iv_leach_filter', 'Кассета тонкой очистки', ks('iv_leach_filter'), 4, ['iv_reactor_ev', 'end_recovered_filter', 'end_dielectric'], 'Собери кассеты из сеток, фильтров, керамики и плёнки хоруса. Кассеты расходуются на сортировку и возврат раствора.'],
  ['iv_tungstate_concentrate', 'Полевая центрифуга Энда', ks('end_tungstate_concentrate'), 4, ['iv_tungstate_ore', 'iv_leach_filter', 'iv_centrifuge_ev', 'end_separated_gas'], 'В Энде загрузи три дроблёных вольфрамата и кассету. Подай 400 мБ защитного газа. Центрифуга отдаст две порции концентрата и хвосты.'],
  ['iv_tungsten_cake', 'Выщелачивание', ks('iv_tungsten_cake'), 4, ['iv_tungstate_concentrate', 'iv_scheelite_ore', 'iv_reactor_ev'], 'Смешай дистиллят, нефтяной газ, флюс и катализатор для стартового раствора. Реактор принимает 1000 мБ раствора и оба концентрата, отработанный поток выводи отдельно.'],
  ['iv_tungsten_dust', 'Высушить вольфрамовый осадок', gt('tungsten_dust'), 8, ['iv_tungsten_cake', 'iv_thermal_ev'], 'Термоцентрифуга выдаёт две порции пыли и хвосты. Отфильтруй 1000 мБ отработанного раствора отдельным рецептом, чтобы вернуть 800 мБ рабочего.'],
  ['iv_hot_tungsten', 'Плавка вольфрама', ks('iv_hot_tungsten'), 4, ['iv_tungsten_dust', 'iv_nichrome_coils'], 'Подай футеровку и 750 мБ аргона. Домна работает при 3500 К и 1920 EU/t.'],
  ['iv_tungsten_plate', 'Вольфрам после закалки', gt('tungsten_plate'), 4, ['iv_hot_tungsten', 'iv_bender_ev', 'vacuum_controller'], 'На болванку подай 1500 мБ холодного теплоносителя и 250 мБ аргона. Слиток прокатай, весь теплоноситель верни в контур.'],
  ['iv_tungstensteel_charge', 'Шихта вольфрамовой стали', ks('iv_tungstensteel_charge'), 4, ['iv_tungsten_plate', 'hv_trial_coupon', 'iv_mixer_ev'], 'Возьми слитки вольфрама, стальные листы, футеровку и образец HV. Смеситель принимает 450 мБ защитного газа.'],
  ['iv_hot_tungstensteel', 'Плавка при 3600 К', ks('iv_hot_tungstensteel'), 4, ['iv_tungstensteel_charge', 'iv_nichrome_coils', 'iv_leach_filter'], 'Плавь шихту с фильтром и 1000 мБ аргона. Оставь вывод домны свободным для горячих болванок.'],
  ['iv_tungstensteel_plate', 'Сталь после вакуумной закалки', gt('tungsten_steel_plate'), 8, ['iv_hot_tungstensteel', 'vacuum_loop_buffers', 'iv_bender_ev'], 'Подай 2000 мБ холодного теплоносителя и 350 мБ аргона на болванку. Вольфрамовая сталь прокатывается при 1920 EU/t.'],
  ['iv_platinum_cake', 'Очистить платиновый осадок', ks('iv_platinum_filter_cake'), 4, ['iv_platinum_ore', 'iv_leach_filter', 'iv_reactor_ev'], 'На четыре порции дроблёного куперита подай два фильтра и 1000 мБ раствора. Отработанный раствор идёт в общий контур.'],
  ['iv_platinum_sponge', 'Платиновая губка и палладий', ks('iv_platinum_sponge'), 4, ['iv_platinum_cake', 'iv_centrifuge_ev'], 'Центрифуга принимает осадок и угольную пыль. Сохрани палладий для аккумуляторных секций подстанции.'],
  ['iv_platinum_plate', 'Платиновые контакты', gt('platinum_plate'), 8, ['iv_platinum_sponge', 'iv_nichrome_coils', 'iv_bender_ev'], 'Спеки губку с керамической плиткой и аргоном при 3200 К. Прокатай слитки для оптики, шин и катализаторов.']
])

chapter('iv_microelectronics', 'XIX. Стерильная фотолитография', ks('iv_sterile_mask'), [
  ['iv_sterile_room_filters', 'Стерильный потолок', gt('sterilizing_filter_casing'), 8, ['ev_sterile_filters', 'ev_foundry_accepted'], 'Построй вторую комнату 5×5×5. Контроллер ставится в центре потолка, вокруг него восемь стерилизующих фильтров.'],
  ['iv_sterile_laser', 'Гравёр в стерильной комнате', gt('ev_laser_engraver'), 1, ['iv_sterile_room_filters', 'ev_laser'], 'Поставь отдельный гравёр EV и подай питание через ввод. Обычный гравёр оставь для выпуска предыдущих подложек.'],
  ['iv_sterile_circuit_machine', 'Стерильная пайка', gt('ev_circuit_assembler'), 1, ['iv_sterile_room_filters', 'ev_circuit_assembler'], 'Подключи в стерильном отсеке сборщик схем EV с отдельной подачей защитного газа.'],
  ['iv_bath_ev', 'Ванна фотолитографии', gt('ev_chemical_bath'), 2, ['iv_reactor_ev', 'hv_quench'], 'Одну ванну оставь под фоторезист, вторую подключи к дистилляту и возврату отработанной жидкости.'],
  ['iv_photoresist_ampoule', 'Связующее фоторезиста', ks('iv_photoresist_ampoule'), 2, ['iv_platinum_plate', 'paraffin_cake', 'end_dielectric'], 'Соедини ампулу, парафин, плёнку, платину и уплотнение. В реакторе добавь 750 мБ нафты и 250 мБ защитного газа.'],
  ['iv_sterile_mask', 'Долговечная фотомаска', ks('iv_sterile_mask'), 1, ['ev_foundry_accepted', 'iv_sterile_laser', 'me_optical_link', 'iv_platinum_plate'], 'На сборку маски расходуется протокол EV, два оптических узла, стекло и платина. Гравёр сохраняет готовую маску.'],
  ['iv_masked_wafer', 'Нанести фоторезист', ks('iv_masked_wafer'), 4, ['iv_photoresist_ampoule', 'ev_wafer_acceptance', 'iv_bath_ev'], 'Покрой подложку EV в химической ванне. На каждую требуется 250 мБ фоторезиста.'],
  ['iv_exposed_wafer', 'Экспозиция при 1920 EU/t', ks('iv_exposed_wafer'), 4, ['iv_masked_wafer', 'iv_sterile_mask', 'iv_sterile_laser'], 'Загрузи подложку и фотомаску в гравёр. Дождись нужной чистоты в стерильной комнате.'],
  ['iv_clean_die', 'Проявить кристалл', ks('iv_clean_die'), 4, ['iv_exposed_wafer', 'iv_bath_ev'], 'Прояви подложку с 500 мБ дистиллята. Собирай отработанный фоторезист. Из 1000 мБ реактор возвращает 750 мБ рабочего раствора.'],
  ['iv_sealed_processor', 'Опрессовка процессора', ks('iv_sealed_processor'), 4, ['iv_clean_die', 'cleanroom_ev_module', 'liquid_process_compressor', 'reinforced_process_tube'], 'Добавь модуль EV, уплотнение, прессованное железо, усиленную трубу и теплоизоляционное стекло IE. Камера PneumaticCraft должна держать 4,85 бар.'],
  ['iv_first_mainframe', 'Первая схема IV на EV', gt('micro_processor_mainframe'), 1, ['iv_sealed_processor', 'iv_sterile_circuit_machine', 'iv_busbar_blank', 'cleanroom_first_ev_circuit', 'ev_phase_relay', 'iv_platinum_plate', 'lv_solder'], 'В стерильный сборщик схем подай четыре герметичных процессора, шесть компьютеров EV, четыре реле EV, четыре платиновых пластины, два шинных вкладыша, восемь заготовок припоя и 1700 мБ защитного газа.'],
  ['iv_nano_base', 'Нанопроцессор EV', gt('nano_processor'), 2, ['ev_wafer_acceptance', 'ev_circuit_assembler'], 'В обычной чистой комнате соедини схему HV, калиброванные подложки, модули, керамику и титан. Этот процессор идёт в следующую сборку.'],
  ['iv_nano_assembly_base', 'Наносборка EV', gt('nano_processor_assembly'), 2, ['iv_nano_base', 'ev_wafer_acceptance'], 'Один процессор, две подложки, реле и модуль EV дают две наносборки.'],
  ['iv_quantum_base', 'Квантовый процессор EV', gt('quantum_processor'), 2, ['iv_nano_assembly_base', 'ev_engine'], 'Добавь полевой генератор EV, две подложки, герметичный модуль, реле и титан. Выпусти запас для следующего передела.'],
  ['iv_sterile_circuit_iv', 'Сборщик схем IV', gt('iv_circuit_assembler'), 1, ['iv_power_assembler', 'iv_power_engine', 'iv_sterile_circuit_machine'], 'Установи корпус IV и два излучателя вместо старой машины. Для плат синхронизации размести этот станок в стерильной комнате.'],
  ['iv_clock_backplane', 'Плата синхронизации', ks('iv_clock_backplane'), 2, ['iv_sterile_circuit_iv', 'iv_first_mainframe', 'iv_switch_stack'], 'При 6144 EU/t соедини схему IV, оптику ME, силовые ключи, платину и два герметичных модуля.'],
  ['iv_nano_upgrade', 'Нанокомпьютер IV', gt('nano_processor_computer'), 2, ['iv_clock_backplane', 'iv_nano_assembly_base'], 'На компьютер уходят две наносборки, два герметичных модуля, кристаллы и плата синхронизации.', true],
  ['iv_quantum_upgrade', 'Квантовая сборка IV', gt('quantum_processor_assembly'), 4, ['iv_clock_backplane', 'iv_quantum_base'], 'Запусти стерильную сборку при 6656 EU/t. Два квантовых процессора EV, оптика и плата синхронизации входят в каждый модуль.'],
  ['iv_crystal_upgrade', 'Кристаллическая схема IV', gt('crystal_processor'), 2, ['iv_quantum_upgrade', 'end_optic'], 'Соедини две квантовые сборки с эндерной оптикой и двумя кристаллами. Цикл идёт при 7360 EU/t.', true]
])

chapter('iv_power', 'XX. Промышленная сеть IV', gt('extreme_combustion_engine'), [
  ['iv_busbar_blank', 'Вольфрамовая шинная заготовка', ks('iv_busbar_blank'), 4, ['iv_tungsten_plate', 'iv_platinum_plate', 'ev_busbar_blank'], 'Сборщик EV соединяет вольфрам, платину, шинную заготовку EV и керамику.'],
  ['iv_wire', 'Первый вольфрамовый провод', gt('tungsten_single_wire'), 8, ['iv_busbar_blank', 'iv_wiremill_ev'], 'Из одной заготовки выходят четыре жилы. Отдели участок волочения от изолированных запасов.'],
  ['iv_cable_jacket', 'Изоляция из плёнки хоруса', ks('iv_cable_jacket'), 8, ['end_dielectric', 'vacuum_tile', 'ev_assembler'], 'На четыре оболочки нужны плёнка хоруса, керамика, полиэтилен и вакуумные уплотнения.'],
  ['iv_cable', 'Магистраль 8192 EU', gt('tungsten_single_cable'), 8, ['iv_wire', 'iv_cable_jacket'], 'Изолируй провод в сборщике на EV. Первую магистраль проложи короткой, чтобы хватило напряжения для испытательного цикла на 8000 EU/t.'],
  ['iv_quad_cable', 'Магистраль на четыре ампера', gt('tungsten_quadruple_cable'), 4, ['iv_cable', 'iv_busbar_blank'], 'Для четырёх жил настрой схему 4. Магистрали на 8 и 16 ампер требуют пропорционально больше кабеля и оболочек.', true],
  ['iv_bulkhead', 'Многослойная броня', ks('iv_bulkhead'), 4, ['iv_tungstensteel_plate', 'iv_cable_jacket', 'ev_pressure_cage'], 'Пакет из стали, вакуумных панелей, рамы и диэлектрика собирается при 1920 EU/t.'],
  ['iv_arc_plate', 'Штамповка дугозащитной плиты', ks('iv_arc_plate'), 8, ['iv_bulkhead', 'pressed_steel_frame'], 'Поставь матрицу пластин на пресс IE. Одна бронепанель и 80 000 FE дают две плиты.'],
  ['iv_servo_core', 'Сердечник сервопривода', ks('iv_servo_core'), 4, ['iv_tungstensteel_plate', 'ev_motor', 'iv_cable'], 'Возьми мотор EV, две силовые обмотки, выверенные оси, кабель и вольфрамовую сталь.'],
  ['iv_switch_stack', 'Силовые ключи', ks('iv_switch_stack'), 4, ['iv_first_mainframe', 'iv_arc_plate', 'me_optical_link'], 'Пара реле EV, платина, оптика и новая схема дают два пакета ключей.'],
  ['iv_grid_regulator', 'Регулятор магистрали', ks('iv_grid_regulator'), 2, ['iv_switch_stack', 'ev_phase_relay', 'iv_busbar_blank'], 'Добавь два излучателя EV, две шинные заготовки, платину, кабель и схему IV. Регулятор нужен люкам, сборщику и двигателю.'],
  ['iv_cooling_jacket', 'Рубашка под два насоса', ks('iv_cooling_jacket'), 2, ['iv_arc_plate', 'ev_engine_jacket', 'ev_pump'], 'Вольфрамовая рубашка потребляет две титановые рубашки, два насоса, дугозащиту и уплотнения.'],
  ['iv_power_casing', 'Оболочка IV', gt('iv_machine_casing'), 1, ['iv_bulkhead', 'iv_arc_plate', 'ev_machine_casing'], 'Усиль оболочку EV вольфрамовыми листами, панелями и дугозащитой.'],
  ['iv_power_hull', 'Корпус IV на EV', gt('iv_machine_hull'), 1, ['iv_power_casing', 'iv_switch_stack', 'iv_cable', 'ev_hull'], 'К оболочке добавь корпус EV, ключи, дугозащиту, кабели и две схемы IV.'],
  ['iv_motor', 'Мотор IV', gt('iv_electric_motor'), 2, ['iv_servo_core', 'iv_cable', 'iv_first_mainframe'], 'Закрепи мотор EV и два сердечника в усиленном корпусе.'],
  ['iv_pump', 'Насос IV', gt('iv_electric_pump'), 2, ['iv_motor', 'iv_cooling_jacket', 'ev_pump'], 'Собери насос из старого привода, мотора, рубашки, двух листов и кабеля.'],
  ['iv_piston', 'Поршень IV', gt('iv_electric_piston'), 2, ['iv_motor', 'iv_arc_plate', 'ev_piston'], 'Добавь силовые оси, сердечник и дугозащиту к поршню EV.'],
  ['iv_conveyor', 'Передача IV', gt('iv_conveyor_module'), 2, ['iv_motor', 'iv_cable_jacket', 'ev_conveyor'], 'Для передачи нужны два мотора, две оси и две диэлектрические оболочки.'],
  ['iv_robot', 'Манипулятор IV', gt('iv_robot_arm'), 2, ['iv_piston', 'iv_motor', 'iv_switch_stack', 'ev_robot'], 'Переделай прежний манипулятор с новым поршнем, двумя сердечниками, схемами и ключами.'],
  ['iv_power_assembler', 'Первый сборщик IV', gt('iv_assembler'), 1, ['iv_robot', 'iv_conveyor', 'iv_power_hull', 'iv_grid_regulator', 'ev_assembler', 'iv_first_mainframe', 'iv_cable', 'iv_arc_plate'], 'Сделай запасной сборщик EV и загрузи его в работающий. Добавь корпус IV, по два манипулятора, конвейера и регулятора, четыре мейнфрейма, четыре вольфрамовых кабеля, две дугозащитные пластины и руку Create. Подай 700 мБ смазки при 1920 EU/t.'],
  ['iv_power_output', 'Энерговыход IV', gt('iv_energy_output_hatch'), 1, ['iv_power_hull', 'iv_grid_regulator', 'ev_engine_energy_out'], 'На люк расходуются два энерговыхода EV, новый корпус, регуляторы, ключи и кабели.'],
  ['iv_power_input', 'Энерговвод IV', gt('iv_energy_input_hatch'), 1, ['iv_power_hull', 'iv_grid_regulator'], 'Собери ввод аналогичной мощности для сборочной линии. Поставь снаружи короткую вольфрамовую магистраль.'],
  ['iv_engine_fluid', 'Два контура подачи', gt('iv_input_hatch'), 2, ['iv_pump', 'iv_power_hull', 'iv_cooling_jacket'], 'Выдели два входа под топливо и смазку. Для сборочной линии изготовь отдельные люки.'],
  ['iv_engine_shell', 'Двадцать вольфрамовых кожухов', gt('robust_machine_casing'), 20, ['iv_arc_plate', 'iv_bulkhead', 'ev_stable_casing'], 'Кожухи собираются партиями по два с предыдущим титановым блоком, листами и бронёй.'],
  ['iv_engine_gear', 'Вольфрамовые редукторы', gt('tungstensteel_gearbox'), 4, ['iv_servo_core', 'iv_motor', 'ev_engine_gear'], 'Два редуктора уйдут в контроллер, ещё два стоят внутри двигателя.'],
  ['iv_engine_intake', 'Восемь воздухозаборников', gt('extreme_engine_intake_casing'), 8, ['iv_cooling_jacket', 'iv_pump', 'iv_sterile_room_filters'], 'Усиль предыдущие воздухозаборники двумя насосами, рубашкой, фильтрами и дугозащитой.'],
  ['iv_fuel_catalyst', 'Катализатор нового дизеля', ks('iv_fuel_catalyst'), 2, ['iv_platinum_plate', 'iv_tungsten_plate', 'iv_reactor_ev'], 'Собери фильтры, платину, активированный носитель и уплотнение. Один катализатор расходуется на цикл, отработанный регенерируется водородом.'],
  ['iv_fuel_cycle', 'Пробный выпуск улучшенного дизеля', ks('iv_spent_fuel_catalyst'), 2, ['iv_fuel_catalyst', 'diesel_sample'], 'Подай 1800 мБ дизеля, 450 мБ лёгкой фракции и 350 мБ кислорода. Два цикла дают 4000 мБ для контроллера двигателя.'],
  ['iv_power_engine', 'Первый двигатель IV', gt('extreme_combustion_engine'), 1, ['iv_engine_shell', 'iv_engine_gear', 'iv_engine_intake', 'iv_power_output', 'iv_engine_fluid', 'iv_fuel_cycle', 'ebf_maintenance', 'ebf_muffler'], 'Сборщик EV потребляет запасной двигатель EV и 4000 мБ улучшенного дизеля. Собери структуру 3×3×4 по JEI. Подай топливо и смазку, оставь свободными воздухозаборники и выход глушителя.'],
  ['iv_four_amp_input', 'Распределение по четырём амперам', gt('iv_energy_input_hatch_4a'), 1, ['iv_power_engine', 'iv_power_assembler', 'iv_quad_cable'], 'Собери два ввода IV в один узел с регуляторами и четырёхжильной магистралью.', true],
  ['iv_vanadium_pack', 'Батарея под ток IV', gt('iv_vanadium_battery'), 1, ['iv_power_engine', 'iv_power_assembler'], 'Переделай ванадиевую батарею EV, корпус и рубашки. Добавь четыре порции ванадия и два регулятора.', true],
  ['iv_tool', 'Электробур IV', gt('iv_bronze_drill'), 1, ['iv_vanadium_pack', 'iv_piston', 'ev_drill'], 'Перенеси бур EV на силовой блок IV. Добавь поршень, батарею, вольфрамовую сталь и две схемы.', true]
])

chapter('iv_assembly_line', 'XXI. Сборочная линия IV', gt('assembly_line'), [
  ['iv_line_grating', 'Решётки сборочных секций', gt('assembly_line_grating'), 9, ['iv_power_engine', 'iv_power_assembler', 'iv_bulkhead'], 'Построй запас решёток партиями по четыре из стальных кожухов, брони, вольфрамовых пластин и уплотнений.'],
  ['iv_line_glass', 'Стекло для девяти секций', gt('laminated_glass'), 18, ['iv_line_grating', 'me_optical_link', 'iv_cable_jacket'], 'Два окна приходятся на секцию. Спрессуй стекло с оболочками, оптикой и уплотнениями.'],
  ['iv_line_control', 'Управляющие секции', gt('assembly_line_casing'), 9, ['iv_line_grating', 'iv_grid_regulator', 'iv_switch_stack'], 'Добавь в герметичный корпус два силовых ключа, регулятор, схему и дугозащиту. Выпускай по два блока.'],
  ['iv_line_unit', 'Девять сборочных узлов', gt('assembly_line_unit'), 9, ['iv_line_control', 'iv_clock_backplane', 'iv_robot'], 'В каждом цикле установи манипулятор и передачу IV, плату синхронизации и два оптических узла.'],
  ['iv_line_input_buses', 'Восемь позиций подачи', gt('ulv_input_bus'), 8, ['iv_line_grating'], 'Подготовь по одной штатной входной шине ULV на каждую позицию рецепта. Секции идут по направлению от первого входа к общей выдаче.'],
  ['iv_line_output_bus', 'Общая выдача изделий', gt('iv_output_bus'), 1, ['iv_power_engine', 'iv_conveyor'], 'Помести выходную шину в последнюю секцию вместо входной. Рядом оставь буфер готовой продукции.'],
  ['iv_line_fluid_hatches', 'Подача трёх жидкостей', gt('iv_input_hatch'), 3, ['iv_engine_fluid', 'iv_line_grating'], 'Выдели отдельные входы смазке, защитному газу и улучшенному дизелю. На схеме JEI они занимают боковые места нижнего ряда.'],
  ['iv_data_stick', 'Носитель исследований', gt('data_stick'), 2, ['iv_power_engine', 'iv_clean_die', 'me_foil'], 'Собери кристаллы, фольгу памяти и платину в диэлектрической оболочке. Оставь один носитель для сканирования.'],
  ['iv_data_access', 'Люк доступа к данным', gt('basic_data_access_hatch'), 1, ['iv_data_stick', 'iv_line_control', 'iv_clock_backplane'], 'Поставь люк в боковой позиции, разрешённой схемой JEI. Вставь в него носитель после сканирования.'],
  ['iv_line_64k', 'Память вычислительного задания', me('64k_crafting_storage'), 1, ['me_64k', 'me_cpu', 'me_provider'], 'На компоненте 64k собери вычислительную память AE2. Часть таких блоков уйдёт в стенд и протокол IV.'],
  ['iv_line_dense_me', 'Оптическая магистраль ME', me('fluix_smart_dense_cable'), 4, ['me_smart', 'me_optical_link'], 'Соедини оптику и плотный кабель на EV. Оставь две секции для контроллера линии.'],
  ['iv_line_controller', 'Контроллер сборочной линии', gt('assembly_line'), 1, ['iv_line_unit', 'iv_line_glass', 'iv_line_input_buses', 'iv_line_output_bus', 'iv_line_fluid_hatches', 'iv_data_access', 'iv_power_input', 'iv_line_dense_me', 'me_provider'], 'Собери линию из девяти секций по JEI. Восемь подают предметы, последняя выдаёт. На первом пуске подай 8192 EU на верхний энерговвод.'],
  ['iv_scanner', 'Сканер IV', gt('iv_scanner'), 1, ['iv_power_assembler', 'iv_power_engine', 'iv_data_stick'], 'Собери сканер на новом корпусе и подключи к IV. Исследование эталона потребляет 4096 EU/t.'],
  ['iv_reference_module', 'Два экземпляра эталона', ks('iv_reference_module'), 2, ['iv_scanner', 'iv_clock_backplane', 'iv_line_64k'], 'На эталон уходят два датчика, два излучателя, два компонента 64k, герметичные модули, сталь и регуляторы. Один оставь для сборочной линии.'],
  ['iv_calibration_rig', 'Стенд по записи сканера', ks('iv_calibration_rig'), 1, ['iv_reference_module', 'iv_line_controller', 'iv_data_access', 'iv_line_64k'], 'Просканируй эталон с чистым носителем 60 секунд. Вставь запись в люк. Разложи восемь предметных входов по порядку в JEI, подай 1800 мБ смазки и 1000 мБ защитного газа.'],
  ['iv_stress_coupons', 'Серия из 64 контрольных образцов', ks('iv_stress_coupon'), 64, ['iv_calibration_rig', 'iv_power_assembler', 'iv_fuel_cycle'], 'Сборщик IV использует стенд как оснастку. Один цикл при 7680 EU/t даёт четыре образца и расходует 2000 мБ улучшенного дизеля.'],
  ['iv_commissioning', 'Приёмка сети IV', ks('iv_commissioning_report'), 1, ['iv_stress_coupons', 'iv_quantum_upgrade', 'me_p2p', 'iv_line_64k'], 'На восьми шинах сдай 64 образца, стенд и силовую электронику. Подай 6000 мБ смазки, 4800 мБ защитного газа и 12 000 мБ дизеля. Базовый цикл восемь минут.'],
  ['iv_substation_cell', 'Палладиевый накопитель', gt('palladium_substation'), 2, ['iv_platinum_sponge', 'iv_power_engine', 'iv_vanadium_pack'], 'Собери палладиевые блоки на двух лапотронных батареях EV с регуляторами и платиновыми пластинами.', true],
  ['iv_substation', 'Отдельная подстанция', gt('power_substation'), 1, ['iv_substation_cell', 'iv_four_amp_input', 'iv_quad_cable'], 'Собери буфер по схеме JEI из бронекожухов и палладиевых блоков. Подведи независимые ввод и вывод, направь резерв к чистому производству.', true],
  ['iv_parallel_hatch', 'Параллельный технологический люк', gt('iv_parallel_hatch'), 1, ['iv_line_controller', 'iv_clock_backplane', 'iv_robot'], 'Запитай сборку при 7360 EU/t. Люк расходует две платы синхронизации, два манипулятора и четыре схемы IV.', true]
])

chapter('luv_alloys', 'XXII. Танталит и родированный палладий', gt('hssg_coil_block'), [
  ['luv_mill_iv', 'Дробилка для выездного участка IV', gt('iv_macerator'), 1, ['iv_commissioning', 'iv_macerator_ev'], 'Подготовь дробилку IV для выездного цеха. Для добычи танталита проверь карту жил GregTech в JEI.'],
  ['luv_centrifuge_iv', 'Полевая центрифуга IV', gt('iv_centrifuge'), 1, ['iv_commissioning', 'iv_centrifuge_ev'], 'Установи центрифугу в Энде. Защити подачу газа и кабель от эндерменов, привези двигатель IV и улучшенное топливо.'],
  ['luv_reactor_iv', 'Два реактора выщелачивания', gt('iv_chemical_reactor'), 2, ['iv_commissioning', 'iv_reactor_ev'], 'Выдели один реактор для переработки раствора, второй для танталита и платиновых осадков.'],
  ['luv_mixer_iv', 'Смеситель жаропрочных шихт', gt('iv_mixer'), 1, ['iv_commissioning', 'iv_mixer_ev'], 'Собери смеситель IV. Держи у него четыре буфера для концентратов, листов, порошков и плитки.'],
  ['luv_thermal_iv', 'Термическая очистка родия', gt('iv_thermal_centrifuge'), 1, ['iv_commissioning', 'iv_thermal_ev'], 'Оставь термоцентрифугу у линии обработки платинового осадка. Шлам и хвосты идут в разные буферы.'],
  ['luv_bender_iv', 'Прокат трёх сплавов', gt('iv_bender'), 1, ['iv_commissioning', 'iv_bender_ev'], 'Листогиб IV прокатывает все три сплава. Оставь запас слитков ниобий-титана для проволоки.'],
  ['luv_molybdenum', 'Молибденовая шихта', gt('molybdenum_dust'), 4, ['luv_mill_iv'], 'Найди молибденовую руду в списке жил JEI. Подготовь четыре порции пыли для первой загрузки быстрорежущей стали.'],
  ['luv_hssg_charge', 'Замес HSS-G', ks('luv_hssg_charge'), 4, ['luv_molybdenum', 'luv_mixer_iv', 'iv_tungstensteel_plate'], 'Установи протокол IV как оснастку. На четыре порции шихты расходуются сталь, хромит, молибден, ванадий, футеровка и 1200 мБ защитного газа.'],
  ['luv_hssg_hot', 'Плавка на нихроме при 3850 К', ks('luv_hot_hssg'), 1, ['luv_hssg_charge', 'iv_nichrome_coils', 'iv_power_input'], 'Подай питание IV в домну с нихромовыми катушками. На болванку уйдут одна порция шихты, футеровка и 1600 мБ аргона.'],
  ['luv_hssg_plate', 'Прокат быстрорежущей стали', gt('hssg_plate'), 8, ['luv_hssg_hot', 'luv_bender_iv', 'vacuum_loop_buffers'], 'Подними питание вакуумной камеры до IV. На болванку подавай 2600 мБ холодной жидкости и 600 мБ защитного газа. Весь теплоноситель возвращается на охлаждение.'],
  ['luv_hssg_winding', 'Жаростойкая обмотка HSS-G', ks('luv_coil_winding'), 16, ['luv_hssg_plate', 'iv_coil_core', 'iv_motor'], 'Выпусти обмотки партиями по две из пластин HSS-G, сердечников IV, панелей, оболочки кабеля и моторов.'],
  ['luv_hssg_coils', 'Два кольца катушек HSS-G', gt('hssg_coil_block'), 16, ['luv_hssg_winding', 'iv_nichrome_coils'], 'На два блока расходуются две старые катушки, две обмотки, четыре листа, плитка и прокладки. Полный комплект поднимает номинал домны до 5400 К.'],
  ['luv_tantalite_ore', 'Партия дроблёного танталита', gt('crushed_tantalite_ore'), 16, ['luv_mill_iv'], 'Привези дроблёный танталит в Энд. Для сортировки нужен сам Энд, руду можно добывать там, где она встречается в жилах.'],
  ['luv_tantalite_concentrate', 'Полевая сортировка танталита', ks('luv_tantalite_concentrate'), 8, ['luv_tantalite_ore', 'luv_centrifuge_iv', 'end_separated_gas'], 'В Энде отсортируй четыре порции дроблёнки с 750 мБ защитного газа. Протокол IV остаётся в центрифуге, а хвосты идут на отдельную выгрузку.'],
  ['luv_niobium_cake', 'Осадок ниобия', ks('luv_niobium_cake'), 8, ['luv_tantalite_concentrate', 'luv_reactor_iv', 'iv_leach_filter'], 'Разведи вольфрамовый раствор дистиллятом с флюсом и фильтром. Каждая обработка двух концентратов требует 1200 мБ. Регенерация возвращает 900 мБ, остаток восполняй.'],
  ['luv_niobium_charge', 'Подготовить проводниковый сплав', ks('luv_niobium_charge'), 8, ['luv_niobium_cake', 'luv_mixer_iv', 'iv_tungsten_dust'], 'Смешай ниобиевый осадок, листы титана, вольфрамовую пыль и вакуумную керамику. Подай 850 мБ защитного газа.'],
  ['luv_niobium_hot', 'Ниобий-титан при 4700 К', ks('luv_hot_conductor'), 4, ['luv_niobium_charge', 'luv_hssg_coils'], 'Плавь в домне на катушках HSS-G с 1600 мБ аргона и футеровкой на загрузку.'],
  ['luv_niobium_plate', 'Закалить проводник', gt('niobium_titanium_plate'), 8, ['luv_niobium_hot', 'luv_bender_iv', 'vacuum_loop_buffers'], 'Охлади болванки при 7680 EU/t. Камера возвращает 2400 мБ тёплого теплоносителя. Прокатай часть слитков в листы.'],
  ['luv_pgm_sludge', 'Повторная очистка платинового осадка', ks('luv_pgm_sludge'), 8, ['iv_platinum_cake', 'luv_niobium_cake'], 'На четыре осадка куперита расходуются два фильтра и 1500 мБ ниобиевого раствора. Отведи палладиевую пыль, шлам и отработанный раствор в отдельные буферы.'],
  ['luv_rhodium', 'Родиевая губка из шлама', ks('luv_rhodium_sponge'), 8, ['luv_pgm_sludge', 'luv_thermal_iv'], 'Высуши шлам в термоцентрифуге IV. Сохрани палладий от предыдущей операции для следующей шихты.'],
  ['luv_palladium_charge', 'Родированный палладий', ks('luv_palladium_charge'), 8, ['luv_rhodium', 'luv_mixer_iv', 'iv_platinum_plate'], 'Смешай родиевую губку, палладий, платиновые листы и HSS-G. Для цикла подготовь 1600 мБ защитного газа.'],
  ['luv_palladium_hot', 'Горячая болванка при 5100 К', ks('luv_hot_palladium'), 4, ['luv_palladium_charge', 'luv_hssg_coils'], 'Добавь футеровку и 1800 мБ аргона на болванку. Горячие детали разгружай в буфер вакуумной камеры.'],
  ['luv_palladium_plate', 'Листовой сплав для LuV', gt('rhodium_plated_palladium_plate'), 12, ['luv_palladium_hot', 'luv_bender_iv'], 'Закали болванку с 3000 мБ теплоносителя и 600 мБ защитного газа, затем прокатай. Для вычислителей и термоядерного кольца понадобится серийный цех.']
])

chapter('luv_power', 'XXIII. Выход на питание LuV', gt('iv_transformer_1a'), [
  ['luv_laminate', 'Изоляция высокого напряжения', ks('luv_dielectric_laminate'), 16, ['iv_commissioning', 'iv_line_glass', 'iv_cable_jacket'], 'Сборщик IV прессует диэлектрик из плёнки хоруса, керамики, брони, платиновых листов и уплотнений. Протокол IV остаётся оснасткой.'],
  ['luv_wiremill_iv', 'Волочильный станок IV', gt('iv_wiremill'), 1, ['luv_niobium_hot', 'iv_power_assembler'], 'Переоборудуй станок EV. На первом цикле один ниобиево-титановый слиток даёт четыре проволоки.'],
  ['luv_wire', 'Ниобиево-титановая проволока', gt('niobium_titanium_single_wire'), 16, ['luv_wiremill_iv', 'luv_niobium_plate'], 'Отведи слитки на станок и выпусти первую партию. Изоляция накладывается в отдельном сборщике.'],
  ['luv_busbar', 'Шины с платиновыми контактами', ks('luv_busbar'), 8, ['luv_niobium_plate', 'luv_laminate', 'iv_cable'], 'Перепрессуй вольфрамовые заготовки IV с новыми листами, диэлектриком и платиной. Одна партия даёт четыре шины.'],
  ['luv_cable', 'Магистраль на 32768 EU', gt('niobium_titanium_single_cable'), 16, ['luv_wire', 'luv_busbar'], 'Обожми четыре проволоки с шинами, диэлектриком и прокладками. Проводку IV используй до трансформатора, новую магистраль после него.'],
  ['luv_cable_4a', 'Четырёхжильная магистраль', gt('niobium_titanium_quadruple_cable'), 8, ['luv_cable'], 'Добавь диэлектрик, шины и уплотнения, выбери схему 4 на сборщике. Кабель нужен для HPCA и намотки магнитов.'],
  ['luv_transformer_iv', 'Пусковой трансформатор IV', gt('iv_transformer_1a'), 1, ['luv_laminate', 'luv_cable', 'iv_power_engine'], 'Переключи отвёрткой трансформатор IV в повышение. На входе нужны четыре пакета IV по 8192 EU, на выходе будет один пакет LuV на 32768 EU.'],
  ['luv_transformer_bank', 'Питание вычислительного массива', gt('iv_transformer_4a'), 1, ['luv_transformer_iv', 'luv_cable_4a'], 'Повышающий трансформатор 4A принимает до 16A IV. Спроектируй ввод LuV 4A и отдельную ветвь для исследовательской станции.'],
  ['luv_optical_blank', 'Оптическая заготовка', ks('luv_optical_blank'), 4, ['luv_palladium_plate', 'luv_laminate', 'iv_line_dense_me'], 'Собери многослойное стекло, плотный кабель ME, оптические вставки и листы родированного палладия в защитном газе.'],
  ['luv_waveguide', 'Калибровка под прессом Create', ks('luv_polished_waveguide'), 4, ['luv_optical_blank', 'press'], 'Заготовка проходит отдельный цикл механического пресса. Поставь фильтр на депо, чтобы оптика не смешивалась с обычным прокатом.'],
  ['luv_laser_iv', 'Гравёр для юстировки IV', gt('iv_laser_engraver'), 1, ['luv_waveguide', 'iv_sterile_laser', 'iv_power_assembler'], 'Поставь гравёр в стерильную комнату с питанием IV. Возьми действующую маску IV как оснастку.'],
  ['luv_optical_core', 'Юстированное оптическое ядро', ks('luv_optical_core'), 4, ['luv_laser_iv', 'iv_sterile_mask'], 'Выполни цикл юстировки при 7360 EU/t. Маска остаётся в гравёре. Следи за стерильностью при загрузке.'],
  ['luv_package', 'Герметизация на 4,9 бар', ks('luv_processor_package'), 4, ['luv_optical_core', 'iv_sealed_processor', 'me_eng'], 'Опрессуй ядро вместе с модулем IV, инженерным процессором AE2, диэлектриком и уплотнением. Для стабильного цикла держи камеру на 4,9 бар.'],
  ['luv_clock_matrix', 'Матрица синхронизации', ks('luv_clock_matrix'), 4, ['luv_package', 'luv_busbar', 'iv_sterile_circuit_iv', 'me_64k'], 'Стерильный сборщик схем IV объединяет два оптопроцессора, старые платы, память 64k и шины. Подай 1050 мБ защитного газа.'],
  ['luv_me_crafting', 'Вычислительная память 256k', me('256k_crafting_storage'), 2, ['me_256k', 'iv_line_64k'], 'Подготовь секции автосборки на компонентах 256k. Избегай смешивания этих блоков с обычными ячейками привода.'],
  ['luv_precise_bus_batch', 'Точные шины для линии LuV', 'expatternprovider:precise_storage_bus', 4, ['iv_commissioning', 'me_optical_link', 'iv_power_assembler'], 'Изготовь четыре точные шины ExtendedAE на IV. Используй протокол IV как оснастку и отложи шины на первый заказ LuV.'],
  ['luv_first_circuit', 'Первый мейнфрейм LuV', gt('nano_processor_mainframe'), 2, ['luv_clock_matrix', 'luv_me_crafting', 'luv_cable', 'iv_line_controller', 'iv_nano_upgrade', 'me_p2p', 'luv_precise_bus_batch'], 'На девять шин подай компоненты по JEI, включая четыре точные шины ExtendedAE. Для двух мейнфреймов нужны 5000 мБ смазки, 4200 мБ газа и 6400 мБ дизеля. Базовый цикл 400 секунд.'],
  ['luv_casing', 'Бронированная оболочка LuV', gt('luv_machine_casing'), 1, ['luv_first_circuit', 'luv_palladium_plate', 'luv_hssg_plate'], 'Усиль оболочку IV шестью палладиевыми и четырьмя листами HSS-G, диэлектриком и дугозащитой.'],
  ['luv_hull', 'Силовой корпус LuV', gt('luv_machine_hull'), 1, ['luv_casing', 'luv_first_circuit', 'luv_cable'], 'Установи в оболочку матрицы, шины и два мейнфрейма LuV. Повтори сборку для каждого нового станка.'],
  ['luv_motor', 'Двигатель LuV', gt('luv_electric_motor'), 1, ['luv_first_circuit', 'luv_cable', 'iv_motor'], 'Перемотай мотор IV. Для каждого нужны четыре палладиевых листа, две схемы и четыре кабеля.'],
  ['luv_pump', 'Насос с двойной рубашкой', gt('luv_electric_pump'), 1, ['luv_motor', 'iv_pump'], 'Добавь к насосу IV новый мотор, две охлаждающие рубашки, прокладки и защиту обмоток.'],
  ['luv_piston', 'Поршень LuV', gt('luv_electric_piston'), 1, ['luv_motor', 'iv_piston', 'luv_hssg_plate'], 'Добавь HSS-G, палладиевые листы и сердечники к поршню предыдущего уровня.'],
  ['luv_conveyor', 'Привод подачи LuV', gt('luv_conveyor_module'), 1, ['luv_motor', 'iv_conveyor', 'luv_busbar'], 'Два мотора приходятся на одну передачу. Подготовь отдельный запас для сборщика и складских машин.'],
  ['luv_robot', 'Манипулятор LuV', gt('luv_robot_arm'), 1, ['luv_piston', 'iv_robot', 'luv_clock_matrix'], 'Доукомплектуй руку IV мотором, поршнем, матрицами и кабелем. Для первого сборщика потребуются два таких манипулятора.'],
  ['luv_assembler', 'Первый сборщик LuV', gt('luv_assembler'), 1, ['luv_hull', 'luv_robot', 'luv_conveyor', 'luv_transformer_iv'], 'Собери на IV при 8000 EU/t. Подключи к выходу повышающего трансформатора кабелем из ниобий-титана.'],
  ['luv_emitter', 'Оптический излучатель LuV', gt('luv_emitter'), 1, ['luv_first_circuit', 'luv_optical_core', 'luv_clock_matrix'], 'Излучатели понадобятся для сборщика схем, оптической передачи вычислений и генераторов поля.'],
  ['luv_sensor', 'Датчик LuV', gt('luv_sensor'), 1, ['luv_first_circuit', 'luv_optical_core', 'iv_platinum_plate'], 'Собери датчик с двумя ядрами и двумя схемами. Отложи несколько штук для держателя и термоядерного эталона.'],
  ['luv_hatch_1a', 'Энерговвод 32768 EU', gt('luv_energy_input_hatch'), 1, ['luv_hull', 'luv_transformer_iv'], 'Собери люк на двух вводах IV. Используй его для сборочной линии и исследования, когда отдельной машине хватает одного пакета LuV.'],
  ['luv_hatch_4a', 'Энерговвод HPCA', gt('luv_energy_input_hatch_4a'), 1, ['luv_hatch_1a', 'luv_transformer_bank'], 'Два ввода LuV и четырёхжильная магистраль нужны для нового люка. Выдели ему отдельную линию питания.']
])

chapter('luv_computation', 'XXIV. Вычислительный цех', gt('research_station'), [
  ['luv_circuit_assembler', 'Стерильный сборщик схем LuV', gt('luv_circuit_assembler'), 1, ['luv_hull', 'luv_emitter', 'luv_sensor', 'iv_sterile_circuit_iv', 'luv_transformer_iv'], 'Собери станок на IV и установи в стерильной комнате с отдельным вводом LuV.'],
  ['luv_quantum', 'Квантовый компьютер LuV', gt('quantum_processor_computer'), 2, ['luv_circuit_assembler', 'luv_me_crafting', 'iv_quantum_upgrade'], 'Собери из двух квантовых сборок IV, двух оптопроцессоров, матрицы и двух компонентов памяти 256k. Цикл идёт при 24768 EU/t.'],
  ['luv_crystal', 'Кристаллическая сборка LuV', gt('crystal_processor_assembly'), 2, ['luv_circuit_assembler', 'luv_clock_matrix', 'me_eng'], 'Для сборки соедини кристаллические процессоры IV с оптопроцессорами и инженерными схемами AE2. Подай 1400 мБ защитного газа.'],
  ['luv_computer_casing', 'Сборочные кожухи серверной', gt('computer_casing'), 16, ['luv_palladium_plate', 'luv_busbar', 'iv_line_control'], 'Собирай партиями по четыре. Кожухи идут в обе структуры, расходуются на компоненты и улучшаются до управляющих блоков.'],
  ['luv_advanced_casing', 'Управляющие кожухи', gt('advanced_computer_casing'), 8, ['luv_computer_casing', 'luv_first_circuit', 'luv_optical_core'], 'Усиль кожухи оптикой, матрицами и многослойным стеклом. Партия даёт два блока.'],
  ['luv_vents', 'Вентиляция серверной', gt('computer_heat_vent'), 12, ['luv_computer_casing', 'luv_hssg_plate', 'iv_cooling_jacket'], 'Проверь раскладку HPCA в JEI. Вентиляционные блоки также расходуются на сборку радиаторов.'],
  ['luv_optical_pipe', 'Оптоволокно GregTech', gt('normal_optical_pipe'), 12, ['luv_optical_core', 'luv_cable', 'iv_line_dense_me'], 'Собери отдельную оптическую магистраль GregTech. Направь лицевые стороны люков к ней и проверь соединения ключом.'],
  ['luv_orbs', 'Незаписанные сферы данных', gt('data_orb'), 4, ['luv_me_crafting', 'luv_optical_core', 'iv_data_stick'], 'Первую сферу оставь для эталона поля, вторую для итоговой приёмки. При необходимости собери запас на повторные записи.'],
  ['luv_advanced_data', 'Люк чтения сфер на линии', gt('advanced_data_access_hatch'), 2, ['luv_orbs', 'luv_advanced_casing', 'luv_quantum'], 'Один продвинутый люк уходит в контроллер станции. Второй устанавливается в сборочную линию и принимает записанные сферы данных.'],
  ['luv_computation_send', 'Выход вычислительной мощности', gt('computation_transmitter_hatch'), 1, ['luv_optical_pipe', 'luv_emitter', 'luv_quantum'], 'Поставь передатчик на наружном кожухе HPCA и направь в сторону оптоволокна.'],
  ['luv_computation_receive', 'Ввод вычислительной мощности', gt('computation_receiver_hatch'), 1, ['luv_optical_pipe', 'luv_sensor', 'luv_quantum'], 'На станции нужен приёмный люк с подключением к передатчику HPCA. По нему поступают CWU.'],
  ['luv_empty_slots', 'Посадочные кассеты HPCA', gt('hpca_empty_component'), 9, ['luv_vents', 'luv_computer_casing'], 'Запас пустых модулей нужен для процессоров и радиаторов. Для испытания на 12 CWU/t заполни все девять мест рабочими блоками.'],
  ['luv_computation_parts', 'Три вычислительных компонента', gt('hpca_computation_component'), 3, ['luv_empty_slots', 'luv_quantum', 'luv_me_crafting'], 'Каждый вычислительный блок выдаёт 4 CWU/t и требует отвода двух единиц тепла. Три блока дадут 12 CWU/t.'],
  ['luv_cooler_parts', 'Шесть пассивных радиаторов', gt('hpca_heat_sink_component'), 6, ['luv_empty_slots', 'luv_vents', 'luv_palladium_plate'], 'Один пассивный блок отводит одну единицу тепла. Для трёх вычислительных блоков собери шесть радиаторов.'],
  ['luv_hpca', 'Вычислительный массив HPCA', gt('high_performance_computation_array'), 1, ['luv_computation_parts', 'luv_cooler_parts', 'luv_computation_send', 'luv_hatch_4a'], 'Собери структуру по JEI. Контроллер расходует один вычислитель и два радиатора при крафте. Подготовь для массива ещё три вычислителя и шесть радиаторов.'],
  ['luv_holder', 'Держатель образца и носителя', gt('object_holder'), 1, ['luv_robot', 'luv_sensor', 'luv_advanced_casing'], 'Разверни лицевую сторону держателя наружу. Поставь его в стенку напротив контроллера. В два слота вставляются образец и сфера.'],
  ['luv_research_station', 'Исследовательская станция', gt('research_station'), 1, ['luv_advanced_data', 'luv_holder', 'luv_computation_receive', 'luv_hpca', 'ebf_maintenance'], 'Построй станцию по схеме JEI. Разверни держатель образца наружу на стороне, противоположной контроллеру. Положи изоленту в сервисный люк, чтобы устранить стартовые неисправности. Подключи питание LuV и вычислительную линию от HPCA.'],
  ['luv_cooling_active', 'Активное охлаждение HPCA', gt('hpca_active_cooler_component'), 2, ['luv_cooler_parts', 'luv_pump'], 'Для усиленного массива понадобится отдельный контур штатного теплоносителя HPCA. Пассивный массив на 12 CWU/t работает с радиаторами.', true],
  ['luv_computation_bridge', 'Мост вычислительных массивов', gt('hpca_bridge_component'), 1, ['luv_hpca', 'luv_computation_receive'], 'Мост позволяет включить массив в общую вычислительную сеть. Подготовь его при расширении цеха.', true]
])

chapter('luv_fusion', 'XXV. Термоядерное кольцо Mk I', gt('luv_fusion_reactor'), [
  ['luv_field', 'Генераторы магнитного поля', gt('luv_field_generator'), 4, ['luv_assembler', 'luv_emitter', 'luv_clock_matrix'], 'На генератор нужны четыре мейнфрейма и две оптические головки LuV. Отложи четыре генератора для реактора.'],
  ['luv_magnets', 'Модули обмотки кольца', ks('luv_magnet_module'), 12, ['luv_assembler', 'luv_cable_4a', 'luv_hssg_plate'], 'Наматывай модули парами при 24576 EU/t с охлаждённой жидкостью, кабелем, генераторами поля IV и вакуумной изоляцией.'],
  ['luv_fusion_coils', 'Сверхпроводящие катушки Mk I', gt('superconducting_coil'), 4, ['luv_magnets', 'luv_pump', 'luv_hssg_coils'], 'Собери кольцевые катушки с двумя модулями, листами и охлаждающими насосами. Четыре катушки расходуются ещё на сам контроллер.'],
  ['luv_fusion_casing', 'Секции кожуха реактора', gt('fusion_casing'), 64, ['luv_magnets', 'iv_engine_shell', 'luv_palladium_plate'], 'Запусти серию кожухов партиями по четыре. При восьми энерговводах, двух жидкостных вводах, одном выходе и без стекла кольцо использует 116 кожухов. Учти ещё восемь на контроллер.'],
  ['luv_fusion_glass', 'Окна термоядерного кольца', gt('fusion_glass'), 16, ['luv_fusion_casing', 'luv_optical_core', 'iv_line_glass'], 'Окна можно ставить в разрешённых JEI местах кольца. Соедини оба сорта стекла с диэлектриком, оптикой и палладиевыми листами.', true],
  ['luv_reflector', 'Отражатели для стенда и топлива', gt('neutron_reflector'), 8, ['luv_magnets', 'luv_assembler', 'iv_arc_plate'], 'Набери отражатели из вольфрамовой стали и родированного палладия. Два оставь в центрифуге как оснастку для топливного цикла.'],
  ['luv_specimen', 'Эталон магнитного поля', ks('luv_fusion_specimen'), 1, ['luv_reflector', 'luv_quantum', 'luv_sensor', 'luv_research_station'], 'Собери эталон и изучи его на станции. Исследование требует 8 CWU/t, 16000 CWU и 24576 EU/t. Сфера с записью идёт в продвинутый люк линии.'],
  ['luv_fusion_power', 'Восемь энерговводов LuV', gt('luv_energy_input_hatch'), 8, ['luv_hatch_1a', 'luv_fusion_casing'], 'Каждый энерговвод добавляет 10 млн EU внутренней ёмкости Mk I. Для запуска нужны восемь вводов и заряд 80 млн EU.'],
  ['luv_fusion_input', 'Два ввода для топлива', gt('luv_input_hatch'), 2, ['luv_pump', 'luv_hull'], 'Отведи отдельный вход каждому топливному потоку. На цикл подавай 1000 мБ дейтерия и 750 мБ трития.'],
  ['luv_fusion_output', 'Выдача горячей плазмы', gt('luv_output_hatch'), 1, ['luv_fusion_input'], 'Для плазмы выдели собственный выходной люк. Подавай её в соседний буфер или прямо в жидкостный люк турбины. Проверь допустимую температуру труб.'],
  ['luv_fusion_reactor', 'Контроллер реактора Mk I', gt('luv_fusion_reactor'), 1, ['luv_specimen', 'luv_field', 'luv_fusion_casing', 'luv_fusion_coils', 'luv_fusion_power', 'luv_fusion_output'], 'Вставь исследованную сферу в линию и подай 32000 EU/t, газ, смазку и охлаждённую жидкость. После сборки контроллера построй кольцо 15×3×15 по JEI.'],
  ['luv_fuel_separation', 'Центрифуга изотопного цеха', gt('luv_centrifuge'), 2, ['luv_assembler', 'luv_centrifuge_iv', 'luv_reflector'], 'Первый станок с двумя диэлектриками даёт 2250 мБ дейтерия из водорода. Второй с двумя отражателями превращает 1250 мБ дейтерия в 750 мБ трития. Оставшиеся 1000 мБ идут в реактор, оснастка остаётся в станках.'],
  ['luv_plasma_coupon', 'Первая проба плазмы', ks('luv_plasma_coupon'), 2, ['luv_fusion_reactor', 'luv_fuel_separation', 'vacuum_loop_buffers'], 'Реактор тратит электричество и выдаёт 1000 мБ плазмы. Вакуумная камера LuV испытывает пластину с 500 мБ плазмы и возвращает теплоноситель.'],
  ['luv_turbine_casing', 'Кожухи плазменной турбины', gt('tungstensteel_turbine_casing'), 32, ['iv_engine_shell', 'luv_hssg_plate', 'luv_laminate'], 'Подготовь 32 кожуха, из них четыре уйдут в контроллер. Четыре редуктора раздели между контроллером и корпусом. Собери турбину 3×3×4 по JEI.'],
  ['luv_turbine_holders', 'Подшипники и держатели', gt('luv_rotor_holder'), 3, ['luv_assembler', 'luv_motor', 'luv_turbine_casing'], 'Два держателя расходуются в контроллере. Третий установи в корпус турбины и оставь свободное пространство перед его лицевой стороной.'],
  ['luv_turbine_rotor', 'Балансировка палладиевого ротора', gt('turbine_rotor'), 1, ['luv_palladium_plate', 'luv_turbine_holders', 'luv_sensor'], 'Для полноценного ротора сначала изготовь две роторные заготовки. Сбалансируй их на сборщике LuV с осями, листами и датчиками.'],
  ['luv_turbine_power', 'Вывод турбины', gt('luv_energy_output_hatch_4a'), 1, ['luv_hatch_4a', 'luv_cable_4a'], 'Собери вывод на несколько пакетов LuV для плазменного контура и сверь предел напряжения кабеля.'],
  ['luv_turbine', 'Большая плазменная турбина', gt('plasma_large_turbine'), 1, ['luv_turbine_casing', 'luv_turbine_holders', 'luv_turbine_rotor', 'luv_turbine_power', 'luv_plasma_coupon'], 'Подай плазму в собранную турбину. Сохрани газ с её выходного люка для протокола первого зажигания. Перед пуском разгрузи энерговывод.'],
  ['luv_ignition_report', 'Протокол первого зажигания', ks('luv_ignition_report'), 1, ['luv_turbine', 'luv_plasma_coupon', 'luv_quantum'], 'Сдай восемь испытанных пластин и 1500 мБ отработанного гелия из турбины. Оставь протокол для нагрузочных испытаний и второй записи.'],
  ['luv_wetware', 'Процессор Wetware', gt('wetware_processor'), 2, ['luv_plasma_coupon', 'luv_crystal', 'luv_quantum', 'luv_hatch_1a'], 'Переведи сборочную линию на LuV. Wetware требует кристаллические сборки, память, инженерные процессоры и две плазменные пробы.'],
  ['luv_load_coupons', 'Нагрузочная серия из 64 образцов', ks('luv_load_coupon'), 64, ['luv_ignition_report', 'luv_magnets', 'luv_busbar'], 'За цикл при 30720 EU/t сборщик испытывает четыре образца с 750 мБ плазмы. Протокол первого зажигания остаётся оснасткой.'],
  ['luv_commissioning', 'Приёмка сети LuV', ks('luv_commissioning_report'), 1, ['luv_load_coupons', 'luv_wetware', 'luv_research_station', 'luv_me_crafting'], 'Запиши протокол зажигания в сферу при 12 CWU/t и 72 000 CWU. Линии нужны ещё два протокола, 64 образца и три жидкости. Базовый цикл десять минут.'],
  ['luv_hpca_advanced', 'Усиленный процессор HPCA', gt('hpca_advanced_computation_component'), 1, ['luv_ignition_report', 'luv_wetware', 'luv_cooling_active'], 'Для расширения сети подготовь запасной протокол, Wetware и компоненты 256k. Усиленный модуль выдаёт 16 CWU/t и требует более мощного охлаждения.', true]
])

chapter('luv_workshop', 'XXVI. Серийный цех LuV', gt('luv_parallel_hatch'), [
  ['luv_bulk_mill', 'Линия дробления и сортировки', gt('luv_macerator'), 1, ['luv_assembler', 'luv_piston', 'luv_mill_iv'], 'Перенеси привод дробилки IV в новый корпус. Сразу выдели место для отдельных выходов рудных концентратов.', true],
  ['luv_bulk_wash', 'Промывка руды', gt('luv_ore_washer'), 1, ['luv_bulk_mill', 'luv_pump'], 'Поставь промыватель с постоянной подачей дистиллята и резервной линией для хвостов.', true],
  ['luv_bulk_thermal', 'Термоцентрифуга LuV', gt('luv_thermal_centrifuge'), 1, ['luv_bulk_wash', 'luv_thermal_iv'], 'Добавь горячий контур обработки рядом с промывателем. Разведи бункеры промытых руд и шлама.', true],
  ['luv_bulk_sifter', 'Грохот тяжёлой фракции', gt('luv_sifter'), 1, ['luv_bulk_thermal', 'luv_motor'], 'Подготовь просеиватель для цепочек, где нужна отдельная сортировка частиц.', true],
  ['luv_bulk_reactor', 'Поточная химия LuV', gt('luv_chemical_reactor'), 1, ['luv_reactor_iv', 'luv_assembler', 'luv_pump'], 'Отведи ему отдельный контур. Реактор и конвейеры имеют собственные рецепты модернизации с IV.', true],
  ['luv_bulk_distillery', 'Возврат гелия', gt('luv_distillery'), 1, ['luv_turbine', 'luv_bulk_reactor'], 'Дистиллятор при 22528 EU/t возвращает 850 мБ обычного гелия с 1000 мБ отработанного. Сначала оставь нужное количество газа для протокола.', true],
  ['luv_bulk_electrolyzer', 'Электролиз на отдельной линии', gt('luv_electrolyzer'), 1, ['luv_bulk_reactor', 'luv_pump'], 'Поставь электролизёр с раздельным отводом газов и предметов.', true],
  ['luv_bulk_bender', 'Промышленный прокат', gt('luv_bender'), 1, ['luv_bender_iv', 'luv_assembler', 'luv_piston'], 'Используй отдельный прокат для выпуска листов. Для разных металлов настрой отдельные шаблоны ME.', true],
  ['luv_bulk_wiremill', 'Волочение крупных партий', gt('luv_wiremill'), 1, ['luv_bulk_bender', 'luv_wiremill_iv'], 'Размести станок у участка кабеля. Листы и проволоку разгружай в раздельные буферы.', true],
  ['luv_bulk_extruder', 'Экструзия профилей', gt('luv_extruder'), 1, ['luv_bulk_bender', 'luv_piston'], 'Размести рядом хранилище матриц и контейнер на выдаче станка.', true],
  ['luv_bulk_bus', 'Сдвоенный предметно-жидкостный ввод', gt('luv_dual_input_hatch'), 1, ['luv_conveyor', 'luv_fusion_input', 'me_64k'], 'Собери общий ввод из двух жидкостных люков, шин IV и памяти AE2. Используй в структурах, где JEI допускает сдвоенные люки.', true],
  ['luv_bulk_multifluid', 'Четыре жидкости без смешивания', gt('luv_input_hatch_4x'), 1, ['luv_fusion_input', 'luv_bulk_reactor'], 'Подведи четыре фильтрованных линии к отдельным отсекам люка. Перед подачей проверь настройку каждой трубы.', true],
  ['luv_bulk_chest', 'Квантовый буфер предметов', gt('luv_quantum_chest'), 1, ['luv_assembler', 'luv_me_crafting', 'luv_conveyor'], 'Обнови сундук IV, используя ячейки 256k и шины хранения. Назначь отдельный буфер на массовую позицию.', true],
  ['luv_bulk_tank', 'Квантовый жидкостный буфер', gt('luv_quantum_tank'), 1, ['luv_assembler', 'luv_me_crafting', 'luv_pump'], 'Танк требует жидкостных ячеек 256k, насосов и усиленной изоляции. Отдельно проверь стороны ввода и выдачи.', true],
  ['luv_bulk_parallel', 'Параллельный люк LuV', gt('luv_parallel_hatch'), 1, ['luv_assembler', 'luv_robot', 'luv_clock_matrix', 'me_provider'], 'Поставь только в подходящую многоблочную машину. Проверь, что подача предметов, жидкости и электричества выдерживает параллельные циклы.', true],
  ['luv_bulk_storage', 'Лапотронная батарея LuV', gt('luv_lapotronic_battery'), 1, ['luv_hatch_4a', 'luv_busbar', 'luv_clock_matrix'], 'На одну батарею уходят четыре батареи IV, новый корпус, шины и матрицы. Подбери буфер по максимальному току.', true],
  ['luv_bulk_laser_source', 'Лазерный источник 256A', gt('luv_256a_laser_source_hatch'), 1, ['luv_field', 'luv_emitter', 'luv_cable_4a'], 'Подготовь подходящий вывод 16A и отдельный тракт для лазерной передачи. Для первого реактора достаточно обычных кабелей.', true],
  ['luv_bulk_laser_target', 'Лазерная цель 256A', gt('luv_256a_laser_target_hatch'), 1, ['luv_field', 'luv_sensor', 'luv_bulk_laser_source'], 'Подбери совместимый энерговвод и запитай отдельный участок производства. Сверь разрешённые места установки в JEI.', true]
])

chapter('zpm_europium', 'XXVII. Европиевая линия ZPM', ks('zpm_europium_target'), [
  ['zpm_end_centrifuge', 'Полевая центрифуга LuV', gt('luv_centrifuge'), 1, ['luv_commissioning', 'luv_fuel_separation', 'luv_tantalite_concentrate'], 'Выдели отдельную центрифугу LuV и завези её в Энд. Для новой сортировки нужны питание 24576 EU/t и запас редкоземельного сырья.'],
  ['zpm_end_heavy_concentrate', 'Тяжёлая фракция Энда', ks('zpm_end_heavy_concentrate'), 8, ['zpm_end_centrifuge'], 'Переработай восемь концентратов танталита с 2200 мБ защитного газа. Протокол LuV остаётся оснасткой. Хвосты выгружай отдельно.'],
  ['zpm_nether_plant', 'Реактор Нижнего мира', gt('luv_chemical_reactor'), 1, ['luv_commissioning', 'luv_bulk_reactor', 'nether_chromite'], 'Поставь реактор LuV в Нижнем мире. Подведи к нему хлор, питание 24576 EU/t и отдельную выдачу твёрдого продукта.'],
  ['zpm_nether_isotope_salt', 'Соль из Нижнего мира', ks('zpm_nether_isotope_salt'), 8, ['zpm_nether_plant'], 'Загрузи восемь концентратов хромита и 3400 мБ хлора. Протокол LuV остаётся в реакторе.'],
  ['zpm_europium_target', 'Мишени для кольца Mk I', ks('zpm_europium_target'), 4, ['zpm_end_heavy_concentrate', 'zpm_nether_isotope_salt', 'luv_plasma_coupon', 'pressure_interfaces'], 'Поддерживай 4,9 бар в камере PneumaticCraft. Опрессуй по две порции соли и концентрата, восемь порций кварца, четыре плазменных образца LuV, два отражателя и четыре прокладки. Один цикл даёт две мишени.'],
  ['zpm_europium_mixer', 'Смеситель топливной мишени', gt('luv_mixer'), 1, ['zpm_europium_target', 'luv_assembler'], 'Загрузи две мишени, восемь порций неодимовой и четыре порции наквадаховой пыли. Подай 4200 мБ водорода. Полученные 1440 мБ европиевой подачи отведи в отдельную ёмкость перед кольцом.'],
  ['zpm_mk1_capacity', 'Заряд Mk I до 144 млн EU', gt('luv_energy_input_hatch'), 15, ['luv_fusion_reactor', 'luv_hatch_1a', 'zpm_europium_mixer'], 'Установи 15 энерговводов LuV и дождись накопления 144 млн EU. На цикл нужны 1440 мБ европиевой подачи и 3000 мБ дейтерия. Собери 720 мБ плазмы в отдельный буфер.'],
  ['zpm_europium_ingots', 'Вакуумное охлаждение европия', gt('europium_ingot'), 4, ['zpm_mk1_capacity', 'luv_fuel_separation', 'vacuum_controller', 'vacuum_loop_buffers'], 'Запитай вакуумную камеру от LuV. Подай 720 мБ европиевой плазмы и 3200 мБ холодного теплоносителя. На выходе четыре слитка и нагретый теплоноситель для возврата в контур.'],
  ['zpm_europium_plates', 'Прокат первой партии европия', gt('europium_plate'), 4, ['zpm_europium_ingots', 'luv_bulk_bender'], 'Прокатай два охлаждённых слитка в один лист при 26624 EU/t. Держи протокол LuV в станке. Повтори плавку для корпусов, обмоток и вычислительных модулей ZPM.'],
  ['zpm_naquadah_heating', 'Катушки для плавки при 7200 К', gt('naquadah_coil_block'), 16, ['luv_commissioning', 'luv_hssg_coils', 'luv_assembler'], 'Собери серию наквадаховых катушек на оборудовании LuV. Замени оба ряда катушек в электрической домне и проверь температуру перед загрузкой сплава.'],
  ['zpm_naquadah_plates', 'Листы наквадахового сплава', gt('naquadah_alloy_plate'), 16, ['zpm_naquadah_heating', 'luv_assembler', 'vacuum_loop_buffers'], 'Выплавь сплав в электрической домне при 7200 К и охлади в вакууме. Сборщик LuV при 28672 EU/t превращает три охлаждённых слитка и 1200 мБ смазки в два листа. Пресс-форма для пластин и протокол LuV остаются в станке.'],
  ['zpm_vanadium_wire', 'Ванадий-галлиевая проволока', gt('vanadium_gallium_single_wire'), 16, ['luv_commissioning', 'luv_bulk_wiremill', 'luv_hssg_coils'], 'Подготовь ванадий-галлиевый сплав и волочи его на LuV. Голая проволока нужна на первый силовой корпус, катушки напряжения и первичное оборудование ZPM.']
])

chapter('zpm_components', 'XXVIII. Компоненты и станки ZPM', gt('zpm_assembler'), [
  ['zpm_laminate_preform', 'Пакеты под нейтронную облицовку', ks('zpm_laminate_preform'), 4, ['zpm_europium_plates', 'zpm_naquadah_plates', 'luv_assembler', 'luv_laminate'], 'Собери четыре заготовки из европия, наквадахового сплава, диэлектрика LuV, вакуумных плиток и прокладок. Подай 2600 мБ защитного газа на партию.'],
  ['zpm_neutron_laminate', 'Нейтронная облицовка', ks('zpm_neutron_laminate'), 8, ['zpm_laminate_preform', 'press'], 'Спрессуй каждую заготовку на механическом прессе Create. Отдели готовую облицовку от других листов фильтром на выдаче.'],
  ['zpm_flux_busbar', 'Шины силового контура', ks('zpm_flux_busbar'), 8, ['zpm_neutron_laminate', 'zpm_vanadium_wire', 'luv_busbar', 'luv_assembler'], 'Собери две шины при 30720 EU/t. Подай европиевые контакты, листы сплава, шины LuV, проволоку, облицовку и 2800 мБ смазки.'],
  ['zpm_phase_module', 'Стерильная фазовая сборка', ks('zpm_phase_module'), 8, ['zpm_neutron_laminate', 'zpm_flux_busbar', 'luv_wetware', 'luv_me_crafting', 'luv_circuit_assembler'], 'Установи сборщик схем LuV в стерильную комнату. Подай Wetware, кристаллические сборки, матрицы LuV, память 256k и 3000 мБ защитного газа на цикл.'],
  ['zpm_casing', 'Экранированная оболочка ZPM', gt('zpm_machine_casing'), 1, ['zpm_neutron_laminate', 'zpm_europium_plates', 'zpm_naquadah_plates', 'luv_assembler'], 'Усиль две оболочки LuV европием, листами сплава, бронёй IV и прокладками. Подай 3600 мБ холодного теплоносителя.'],
  ['zpm_hull', 'Силовой корпус ZPM', gt('zpm_machine_hull'), 1, ['zpm_casing', 'zpm_phase_module', 'zpm_flux_busbar', 'zpm_vanadium_wire'], 'Подай в сборщик LuV новую оболочку, фазовые модули, Wetware, шины и ванадий-галлиевую проволоку. На первый корпус нужно 3600 мБ смазки.'],
  ['zpm_motor', 'Перемотка моторов', gt('zpm_electric_motor'), 2, ['zpm_phase_module', 'zpm_flux_busbar', 'zpm_vanadium_wire', 'luv_motor'], 'Переработай два мотора LuV на один мотор ZPM. Проволоку и европиевые листы подавай раздельно, а готовые моторы отводи в буфер компонентов.'],
  ['zpm_pump', 'Насос с усиленным охлаждением', gt('zpm_electric_pump'), 2, ['zpm_motor', 'zpm_neutron_laminate', 'luv_pump'], 'Замени привод и добавь охлаждающие рубашки. На входе сборщика держи запас теплоносителя и вакуумных прокладок.'],
  ['zpm_piston', 'Усиленный поршень', gt('zpm_electric_piston'), 2, ['zpm_motor', 'zpm_naquadah_plates', 'luv_piston'], 'Установи новые моторы, сердечники IV, европиевые контакты и наквадаховые листы в корпус старого поршня.'],
  ['zpm_conveyor', 'Привод серийной подачи', gt('zpm_conveyor_module'), 2, ['zpm_motor', 'zpm_flux_busbar', 'luv_conveyor'], 'Подготовь две передачи для сборщика. Оставь резерв моторов, фазовых модулей и шин для предметных люков.'],
  ['zpm_robot', 'Манипуляторы для нового сборщика', gt('zpm_robot_arm'), 2, ['zpm_piston', 'zpm_phase_module', 'luv_robot'], 'Пересобери манипуляторы LuV на новых моторах и поршнях. Каждый готовый узел потребует отдельный комплект Wetware и фазовых модулей.'],
  ['zpm_assembler', 'Первый сборщик ZPM', gt('zpm_assembler'), 1, ['zpm_hull', 'zpm_robot', 'zpm_conveyor'], 'Подай два сборщика LuV, корпус, манипуляторы и передачи. Рецепт работает при 32000 EU/t. Готовому станку выдели магистраль ZPM.'],
  ['zpm_sensor', 'Датчик для поля и сборщика схем', gt('zpm_sensor'), 2, ['zpm_phase_module', 'zpm_europium_plates', 'luv_sensor'], 'Подготовь оптику LuV, память 64k и фазовые модули. Подай в сборщик защитный газ и проверь запас проволоки.'],
  ['zpm_emitter', 'Излучатель с европиевой секцией', gt('zpm_emitter'), 2, ['zpm_phase_module', 'zpm_flux_busbar', 'luv_emitter'], 'Загрузи оптические ядра и инженерные процессоры AE2. Веди излучатели на раздельную выдачу для генераторов поля и схем.'],
  ['zpm_circuit_assembler', 'Стерильный сборщик схем ZPM', gt('zpm_circuit_assembler'), 1, ['zpm_hull', 'zpm_sensor', 'zpm_emitter', 'luv_circuit_assembler'], 'Собери станок на LuV. Установи его в стерильной комнате с отдельным вводом ZPM и подготовь слоты для модулей и памяти.'],
  ['zpm_field', 'Генераторы поля Mk II', gt('zpm_field_generator'), 4, ['zpm_emitter', 'zpm_neutron_laminate', 'luv_field'], 'Собери генераторы с Wetware, фазовыми модулями и охлаждением. Оставь комплект для контроллера кольца.']
])

chapter('zpm_power', 'XXIX. Пуск и резерв ZPM', gt('zpm_battery_buffer_4x'), [
  ['zpm_cable', 'Изолированная магистраль ZPM', gt('vanadium_gallium_single_cable'), 16, ['zpm_vanadium_wire', 'zpm_neutron_laminate'], 'Обожми проволоку на сборщике LuV с двумя видами изоляции и химстойкими прокладками. Подай 576 мБ силиконовой резины на четыре кабеля.'],
  ['zpm_upshift', 'Повышение с LuV до ZPM', gt('luv_transformer_1a'), 1, ['zpm_cable', 'luv_assembler', 'iv_power_engine'], 'Переключи трансформатор LuV отвёрткой в режим повышения. Четыре пакета LuV по 32768 EU дают один пакет ZPM на 131072 EU. Проверь стороны ввода и вывода.'],
  ['zpm_voltage_coil', 'Катушки на 131072 EU', gt('zpm_voltage_coil'), 4, ['zpm_phase_module', 'zpm_vanadium_wire', 'zpm_flux_busbar'], 'Намотай катушки для люков и аккумуляторной аппаратуры. Добавь европиевые листы, облицовку и холодный теплоноситель.'],
  ['zpm_power_1a', 'Первый энерговвод ZPM', gt('zpm_energy_input_hatch'), 1, ['zpm_voltage_coil', 'zpm_hull', 'zpm_upshift'], 'Собери люк на двух вводах LuV. Размести его на сборочной линии или на выделенной установке, сверив напряжение с кабелем.'],
  ['zpm_power_4a', 'Магистральный ввод на четыре пакета', gt('zpm_energy_input_hatch_4a'), 1, ['zpm_power_1a', 'luv_hatch_4a', 'zpm_voltage_coil'], 'Собери многопакетный ввод на основе двух обычных ZPM. Перед подачей тока проверь пропускную способность кабеля и источника.'],
  ['zpm_reserve_switchgear', 'Щит резервной дизельной линии', ks('zpm_reserve_switchgear'), 2, ['zpm_flux_busbar', 'zpm_phase_module', 'iv_power_engine', 'iv_fuel_cycle'], 'На два щита уходит двигатель IV, два трансформатора LuV 4A и 6000 мБ улучшенного дизеля. Щиты расходуются при сборке аккумуляторов и буфера. Для приёмки отложи ещё два.'],
  ['zpm_battery', 'Партия лапотронных батарей', gt('zpm_lapotronic_battery'), 4, ['zpm_reserve_switchgear', 'zpm_voltage_coil', 'luv_bulk_storage'], 'Собери лапотронные блоки из комплектов LuV, новых корпусов, шин и листов европия. Отложи четыре блока для приёмки и выпуска накопителей.'],
  ['zpm_buffer', 'Резерв на четыре аккумулятора', gt('zpm_battery_buffer_4x'), 1, ['zpm_battery', 'zpm_upshift', 'zpm_power_1a'], 'Выдели батарейный блок под холодный пуск и аварийное питание. Проверь направление выдачи и заряд перед переключением нагрузки.']
])

chapter('zpm_fusion', 'XXX. Термоядерное кольцо Mk II', gt('zpm_fusion_reactor'), [
  ['zpm_coil_cartridge', 'Сменные кассеты катушек', ks('zpm_coil_cartridge'), 8, ['zpm_pump', 'zpm_flux_busbar', 'zpm_neutron_laminate', 'luv_magnets'], 'Собери кассеты из обмоток LuV, насосов и экранированных шин. Подавай 4000 мБ холодного теплоносителя на две кассеты.'],
  ['zpm_mk2_coils', 'Катушки кольца Mk II', gt('fusion_coil'), 8, ['zpm_coil_cartridge', 'luv_fusion_coils', 'zpm_sensor'], 'Из катушек Mk I, кассет и датчиков собери усиленные катушки. Восемь уйдут на контроллер. Полный расход на кольцо сверь в JEI.'],
  ['zpm_mk2_shell', 'Секции кожуха Mk II', gt('fusion_casing_mk2'), 64, ['zpm_coil_cartridge', 'luv_fusion_casing', 'zpm_neutron_laminate'], 'Выпускай кожухи сериями. Перед сборкой кольца проверь число секций с учётом энерговводов, жидкостных люков и блоков, ушедших в контроллер.'],
  ['zpm_mk2_input', 'Две линии подачи Mk II', gt('zpm_input_hatch'), 2, ['zpm_hull', 'zpm_pump'], 'Разведи тяжёлую изотопную подачу и жидкий хром по двум люкам. Поставь отдельные ёмкости перед кольцом для дозировки обоих компонентов.'],
  ['zpm_mk2_output', 'Выход тяжёлой плазмы', gt('zpm_output_hatch'), 1, ['zpm_mk2_input'], 'Отведи плазму в совместимый соседний буфер. Если используешь трубы, проверь допустимую температуру и возможность передачи плазмы.'],
  ['zpm_mk2_power', 'Двенадцать энерговводов Mk II', gt('zpm_energy_input_hatch'), 12, ['zpm_power_1a', 'zpm_mk2_shell', 'zpm_buffer'], 'Каждый энерговвод добавляет 20 млн EU ёмкости. Для холодного пуска на 240 млн EU установи двенадцать люков ZPM и заряди кольцо.'],
  ['zpm_hpca_24', 'Вычислительный запас для Mk II', gt('hpca_advanced_computation_component'), 2, ['luv_hpca_advanced', 'luv_cooling_active', 'luv_research_station', 'luv_commissioning'], 'Установи два усиленных вычислителя и активное охлаждение. Для HPCA подготовь ввод LuV 16A и источник, способный непрерывно отдавать не менее 200000 EU/t. Питай станцию отдельной линией. Под нагрузкой оптическая магистраль должна выдавать 24 CWU/t.'],
  ['zpm_reactor_standard', 'Эталон кольца на 24 CWU/t', ks('zpm_reactor_standard'), 1, ['zpm_hpca_24', 'zpm_coil_cartridge', 'zpm_phase_module', 'zpm_sensor', 'luv_reflector', 'luv_orbs'], 'Изучи эталон на исследовательской станции. Для записи на свободную сферу нужны 24 CWU/t, 72000 CWU суммарно и питание 30720 EU/t.'],
  ['zpm_mk2_controller', 'Контроллер кольца Mk II', gt('zpm_fusion_reactor'), 1, ['zpm_reactor_standard', 'zpm_mk2_coils', 'zpm_mk2_shell', 'zpm_mk2_power', 'zpm_mk2_output', 'zpm_field'], 'Удлини линию до девяти предметных входов и одной выходной секции. Вставь записанную сферу, подай три жидкости и запитай линию на LuV. Для контроллера расходуется отдельный Mk I, сохрани рабочее кольцо для европия.'],
  ['zpm_isotope_reactor', 'Химический реактор ZPM', gt('zpm_chemical_reactor'), 1, ['zpm_assembler', 'zpm_mk2_input', 'zpm_upshift'], 'Собери на оборудовании LuV из двух реакторов предыдущего уровня. Подключи отдельное питание ZPM и жидкостный выход к буферу перед Mk II.'],
  ['zpm_isotope_capsule', 'Капсулы с тяжёлым изотопом', ks('zpm_isotope_capsule'), 8, ['zpm_assembler', 'zpm_power_1a', 'zpm_end_heavy_concentrate', 'zpm_nether_isotope_salt', 'zpm_neutron_laminate', 'luv_reflector', 'vacuum_gasket'], 'На две капсулы подай по четыре порции концентрата и соли, четыре отражателя, четыре нейтронозащитных листа, четыре европиевых листа и четыре вакуумных уплотнения. Добавь две продвинутые трубы, два окна камеры PneumaticCraft и 3800 мБ защитного газа. Сборщик ZPM работает при 61440 EU/t.'],
  ['zpm_shielded_cask', 'Экранированная тара для облучения', ks('zpm_shielded_cask'), 4, ['zpm_mk2_controller', 'zpm_neutron_laminate', 'zpm_flux_busbar'], 'Подготовь сменные контейнеры и вакуумную камеру с вводом ZPM. Выдели под охлаждение отдельные вход и обратку.'],
  ['zpm_irradiated_cask', 'Первая партия америциевой плазмы', ks('zpm_irradiated_cask'), 2, ['zpm_shielded_cask', 'zpm_isotope_capsule', 'zpm_isotope_reactor', 'zpm_mk2_controller'], 'В реактор ZPM подай две капсулы, 1440 мБ лютеция и 2400 мБ дейтерия. Затем подай в Mk II полученные 1440 мБ изотопной подачи и 1440 мБ хрома. Выход цикла при 65536 EU/t составляет 720 мБ плазмы. Направь её в вакуумную камеру с экранированной тарой и 4800 мБ холодного теплоносителя.'],
  ['zpm_hot_americium_coupon', 'Выемка горячей пробы', ks('zpm_hot_americium_coupon'), 4, ['zpm_irradiated_cask', 'zpm_bulk_centrifuge'], 'Выгрузи четыре горячих образца в центрифуге ZPM. Подай четыре европиевых листа и 3200 мБ защитного газа. Тара возвращается. Сохрани отдельную облучённую кассету для итоговой записи.'],
  ['zpm_americium_coupon', 'Охлаждение образцов ZPM', ks('zpm_americium_coupon'), 48, ['zpm_hot_americium_coupon', 'vacuum_loop_buffers', 'zpm_power_1a'], 'Закали четыре горячих образца с 4800 мБ теплоносителя. Для приёмки отложи 48 пластин. Дополнительные образцы понадобятся для грузовой сверки и электроники.']
])

chapter('zpm_commissioning', 'XXXI. Приёмка сети ZPM', ks('zpm_commissioning_report'), [
  ['zpm_freight_link', 'Квантовые узлы для двух маршрутов', me('quantum_link'), 2, ['me_quantum', 'zpm_end_heavy_concentrate', 'zpm_nether_isotope_salt'], 'Подготовь компоненты AE2 для проверки грузов. Для автоматической доставки собери квантовые мосты по обе стороны маршрута, запитай их и оставь загруженными нужные чанки.'],
  ['zpm_freight_buffer', 'Жидкостный резерв приёмного цеха', gt('zpm_quantum_tank'), 1, ['zpm_assembler', 'zpm_freight_link', 'luv_bulk_tank'], 'Квантовый танк принимает жидкость после выгрузки в цехе. Для твёрдого груза можно поставить отдельный сундук и фильтровать партии шиной ME.', true],
  ['zpm_freight_certificate', 'Сверка образцов из трёх миров', ks('zpm_freight_certificate'), 1, ['zpm_freight_link', 'zpm_phase_module', 'zpm_americium_coupon'], 'В обычном мире сдай по 12 образцов из Энда и Нижнего мира, четыре охлаждённые пластины, две тары и узлы AE2. Груз можно привезти вручную, через мосты или подать со склада по трубам.'],
  ['zpm_bulk_centrifuge', 'Центрифуга для выемки образцов', gt('zpm_centrifuge'), 1, ['zpm_assembler', 'zpm_motor', 'zpm_upshift'], 'Выдели отдельный станок для поточного производства. Подключи сортировку на выдаче для горячих образцов и пустых контейнеров.'],
  ['zpm_wetware', 'Сборка Wetware ZPM', gt('wetware_processor_assembly'), 4, ['zpm_americium_coupon', 'zpm_power_1a', 'luv_wetware', 'luv_me_crafting'], 'Собери два комплекта на линии ZPM при 98304 EU/t. Добавь Wetware, охлаждённые образцы, фазовые модули и память 256k. Подай защитный газ и смазку.'],
  ['zpm_crystal', 'Кристаллический компьютер ZPM', gt('crystal_processor_computer'), 4, ['zpm_americium_coupon', 'zpm_power_1a', 'luv_crystal'], 'На линии ZPM собери кристаллические компьютеры при 104448 EU/t. Понадобятся кристаллические сборки, испытанные образцы, шины и секции памяти AE2.'],
  ['zpm_quantum', 'Квантовый мейнфрейм ZPM', gt('quantum_processor_mainframe'), 4, ['zpm_americium_coupon', 'zpm_power_1a', 'luv_quantum', 'iv_line_controller'], 'Собери на линии ZPM квантовые мейнфреймы при 110592 EU/t. Подготовь компьютеры LuV, европий, охлаждённые образцы и узлы P2P. Разведи входы по порядку из JEI.'],
  ['zpm_hpca_32', 'Сфера для итоговой записи', gt('data_orb'), 1, ['zpm_hpca_24', 'zpm_irradiated_cask', 'luv_advanced_data', 'zpm_power_1a'], 'Исследуй облучённую кассету на чистую сферу. Для записи нужны 98304 EU/t на станции ZPM, 32 CWU/t и суммарно 96000 CWU. Оставь HPCA отдельную линию с устойчивой подачей от 262144 EU/t и запасом охлаждения.'],
  ['zpm_americium_acceptance_crate', 'Контейнер на 32 резервные пробы', ks('zpm_americium_acceptance_crate'), 1, ['zpm_americium_coupon', 'zpm_shielded_cask', 'zpm_flux_busbar'], 'Сборщик ZPM опечатывает 32 пробы, четыре контейнера и четыре шины с 6200 мБ защитного газа. Упакованный комплект идёт на отдельную позицию линии.'],
  ['zpm_commissioning', 'Приёмка термоядерной сети ZPM', ks('zpm_commissioning_report'), 1, ['zpm_hpca_32', 'zpm_americium_acceptance_crate', 'zpm_freight_certificate', 'zpm_flux_busbar', 'hv_shop_ie_winding', 'zpm_reserve_switchgear', 'zpm_wetware', 'zpm_crystal', 'zpm_quantum', 'zpm_buffer'], 'Собери 96 проб, две накладные, четыре щита, четыре лапотронных блока, восемь шин и восемь катушек IE. Подай 64 пробы россыпью, ещё 32 запечатай в приёмочном контейнере. Подай 7200 мБ плазмы, 12 000 мБ газа и 16 000 мБ дизеля. Базовый цикл 16 минут, запись требует 192 000 CWU.']
])

chapter('uv_materials', 'XXXII. Дюраний и тританий', ks('uv_duranium_target'), [
  ['uv_duranium_target', 'Мишени из принятых проб', ks('uv_duranium_target'), 2, ['zpm_commissioning', 'zpm_americium_coupon', 'zpm_neutron_laminate', 'pressure_interfaces'], 'Опрессуй четыре америциевые пробы, четыре нейтронозащитных листа, восемь порций галлиевой пыли и четыре химстойких уплотнения. Камера PneumaticCraft при 4,9 бар выдаёт две мишени.'],
  ['uv_duranium_mixer', 'Дозировка подачи для дюрания', gt('zpm_mixer'), 1, ['uv_duranium_target', 'zpm_assembler', 'zpm_naquadah_plates'], 'В смесителе ZPM обработай две мишени и восемь листов сплава. Подай 4800 мБ защитного газа и 2400 мБ аргона при 106496 EU/t. На выходе 1440 мБ подачи. Протокол остаётся в станке.'],
  ['uv_mk2_capacity', 'Четырнадцать энерговводов для Mk II', gt('zpm_energy_input_hatch'), 14, ['uv_duranium_mixer', 'zpm_mk2_controller', 'zpm_buffer'], 'Каждый ввод ZPM прибавляет 20 млн EU внутренней ёмкости. Для дюрания хватит 13 люков и 260 млн EU. Поставь 14 для тритания и заряжай до 280 млн EU.'],
  ['uv_zpm_material_inputs', 'Буферы для четырёх исходных жидкостей', gt('zpm_input_hatch'), 2, ['uv_mk2_capacity', 'zpm_mk2_input', 'vacuum_loop_buffers'], 'На 1000 мБ радона большой химреактор расходует две порции пыли урана-238, восемь обычных слитков плутония и 10000 мБ воздуха. Плутоний выходит обратно в виде пыли. Подай в Mk II 1440 мБ подачи и 2400 мБ радона, затем смешай полученные 1152 мБ дюрания с 2304 мБ жидкого титана.'],
  ['uv_tritanium_preform', 'Вакуумное литьё тритания', ks('uv_tritanium_preform'), 4, ['uv_zpm_material_inputs', 'vacuum_controller'], 'Перелей 1152 мБ тритания в вакуумную камеру ZPM. Добавь 6400 мБ холодного теплоносителя. Получишь четыре горячие заготовки при 110592 EU/t и столько же нагретого теплоносителя.'],
  ['uv_tritanium_ingot', 'Отжиг тритановой партии', gt('tritanium_ingot'), 8, ['uv_tritanium_preform', 'vacuum_loop_buffers'], 'Снова используй вакуумную камеру. За один проход она принимает четыре заготовки и 7200 мБ холодного теплоносителя. Выход — восемь слитков при 118784 EU/t.'],
  ['uv_zpm_bender', 'Прокат для высокотемпературного цеха', gt('zpm_bender'), 1, ['uv_tritanium_ingot', 'zpm_assembler', 'zpm_power_1a'], 'Перенеси два прокатных станка LuV в узел ZPM. Подведи питание и оставь свободный слот под протокол приёмки ZPM.'],
  ['uv_tritanium_plate', 'Тритановые листы', gt('tritanium_plate'), 8, ['uv_tritanium_ingot', 'uv_zpm_bender'], 'Прокат при 106496 EU/t превращает два слитка в один лист. Для большой серии увеличь подачу титана и охлаждение обоих проходов.'],
  ['uv_americium_plate', 'Прокат америция', gt('americium_plate'), 4, ['uv_zpm_bender', 'zpm_irradiated_cask'], 'Сконденсируй 720 мБ плазмы в четыре америциевых слитка. Прокат двух слитков при 106496 EU/t даёт один лист. Протокол ZPM держи в станке как оснастку.'],
  ['uv_laminate_preform', 'Набор слоёв силовой обшивки', ks('uv_laminate_preform'), 4, ['uv_tritanium_plate', 'uv_americium_plate', 'zpm_neutron_laminate', 'hv_shop_ie_winding', 'reinforced_process_tube'], 'Добавь обмотки IE и пневмотрубки к листам тритания, америция, экранам, стеклу, плитке и переборкам. На четыре пакета подай 6400 мБ защитного газа.'],
  ['uv_structural_laminate', 'Уплотнение на прессе Create', ks('uv_structural_laminate'), 8, ['uv_hot_basin'], 'Спрессуй пакет с вакуумным уплотнением в нагретой чаше Create. На каждый лист подай 450 мБ защитного газа.'],
  ['uv_flux_shunt', 'Пайка силовых шунтов', ks('uv_flux_shunt'), 4, ['uv_structural_laminate', 'uv_americium_plate', 'zpm_flux_busbar', 'uv_plate_relay_supply', 'hv_solder_bucket'], 'Собери шунты из листов, шин, ламината, ванадий-галлиевого кабеля, контактов и реле IE. На два шунта подай 5600 мБ жидкого припоя.']
])

chapter('uv_power', 'XXXIII. Магистраль и резерв UV', gt('uv_energy_input_hatch'), [
  ['uv_cuprate_ingot', 'Иттриево-бариевый купрат', gt('yttrium_barium_cuprate_ingot'), 8, ['zpm_commissioning', 'uv_tritanium_plate', 'zpm_naquadah_heating'], 'Для купрата нужны иттрий, барий, медь и кислород. Выплавь шихту в электрической домне от IV при 4500 К и охлади слиток в вакуумной камере. Дозировку и газ для выбранного рецепта сверь в JEI.'],
  ['uv_zpm_wiremill', 'Волочение на ZPM', gt('zpm_wiremill'), 1, ['uv_cuprate_ingot', 'zpm_assembler', 'zpm_power_1a'], 'Обнови два станка LuV. Держи в волочильне протокол ZPM и подавай купрат по отдельному шаблону ME.'],
  ['uv_cuprate_wire', 'Купратная проволока UV', gt('yttrium_barium_cuprate_single_wire'), 12, ['uv_zpm_wiremill'], 'При 106496 EU/t из двух слитков выйдут три провода. Для проводов 2×, 4×, 8× и 16× последовательно объединяй по два провода предыдущего размера с ламинатом на сборщике.'],
  ['uv_cuprate_cable', 'Изоляция кабеля UV', gt('yttrium_barium_cuprate_single_cable'), 16, ['uv_cuprate_wire', 'uv_structural_laminate'], 'Покрой купратную проволоку силиконовой резиной, ламинатом и химстойкими уплотнениями. Кабель принимает пакеты по 524288 EU.'],
  ['uv_cuprate_trunk', 'Купратный кабель 4×', gt('yttrium_barium_cuprate_quadruple_cable'), 8, ['uv_cuprate_cable', 'uv_structural_laminate'], 'Сначала объедини провода 1× в 2×, затем 2× в 4×. Добавь изоляцию по рецепту сборщика. Оставь запас на кассеты обмоток Mk III.'],
  ['uv_upshift', 'Повышение с ZPM до UV', gt('zpm_transformer_1a'), 1, ['uv_cuprate_cable', 'zpm_power_4a', 'zpm_voltage_coil'], 'Переключи трансформатор ZPM отвёрткой. Четыре пакета ZPM по 131072 EU дают один пакет UV на 524288 EU. Подключай нагрузку к стороне повышенного напряжения.'],
  ['uv_phase_interlock', 'Стерильная сборка фазовой защиты', ks('uv_phase_interlock'), 4, ['uv_flux_shunt', 'uv_structural_laminate', 'zpm_circuit_assembler', 'zpm_wetware', 'zpm_crystal'], 'Установи в стерильной комнате сборщик схем ZPM. На два блока нужны по четыре сборки Wetware, кристаллических компьютера, фазовых модуля ZPM и компонента памяти 256k, а также по два ламината и шунта. Подай 6400 мБ защитного газа.'],
  ['uv_zpm_power_output', 'Четырёхпакетная выдача ZPM', gt('zpm_energy_output_hatch_4a'), 2, ['uv_upshift', 'zpm_power_4a', 'zpm_voltage_coil'], 'Подготовь две выходные секции ZPM на четыре пакета. Они расходуются на импульсные накопители. Перед подключением высокоточной нагрузки проверь ток источников.'],
  ['uv_pulse_reserve', 'Серия импульсных накопителей', ks('uv_pulse_reserve'), 4, ['uv_phase_interlock', 'uv_zpm_power_output', 'zpm_battery', 'zpm_reserve_switchgear'], 'На пару накопителей нужны четыре батареи ZPM, четыре резервных щита, четыре блока фазовой защиты, четыре шунта, четыре ламината и два энерговывода 4A. Подай 6800 мБ холодного теплоносителя.'],
  ['uv_voltage_coil', 'Катушки на 524288 EU', gt('uv_voltage_coil'), 4, ['uv_phase_interlock', 'uv_flux_shunt', 'uv_americium_plate'], 'Добавь ванадий-галлиевую проволоку, шунты и америциевые листы к двум катушкам ZPM. На сборщик подай 5800 мБ холодного теплоносителя.'],
  ['uv_energy_input', 'Первый энерговвод UV', gt('uv_energy_input_hatch'), 1, ['uv_voltage_coil', 'uv_hull', 'uv_upshift'], 'Из двух люков ZPM и нового корпуса собери ввод UV на ZPM. Подключи его к выделенной линии на 524288 EU за пакет.'],
  ['uv_energy_output', 'Первый энерговывод UV', gt('uv_energy_output_hatch'), 2, ['uv_energy_input', 'uv_voltage_coil'], 'Собери два вывода UV из четырёх штатных выходов ZPM. Сохрани их для четырёхпакетного энерговывода, который понадобится при испытании сети.'],
  ['uv_energy_output_4a', 'Четырёхпакетный энерговывод UV', gt('uv_energy_output_hatch_4a'), 2, ['uv_energy_output', 'uv_cuprate_trunk', 'uv_voltage_coil'], 'Подготовь два вывода 4A для контрольного узла. Один потребляет два обычных вывода UV и два вывода ZPM 4A. На сборщик подай 6500 мБ холодного теплоносителя.']
])

chapter('uv_factory', 'XXXIV. Сборочные цеха UV', gt('uv_assembler'), [
  ['uv_casing', 'Тритановые кожухи UV', gt('uv_machine_casing'), 4, ['uv_tritanium_plate', 'uv_americium_plate', 'uv_structural_laminate', 'zpm_casing'], 'Усиль два кожуха ZPM тританием, америцием, ламинатом, экранами, вакуумными уплотнениями, блоками IE и пневмотрубками. Подай 6000 мБ холодного теплоносителя.'],
  ['uv_hull', 'Первый силовой корпус UV', gt('uv_machine_hull'), 1, ['uv_casing', 'uv_phase_interlock', 'zpm_hull'], 'Подай два корпуса ZPM, кожух UV, четыре фазовых блока, шесть сборок Wetware, шунты, проволоку и ламинат. Сборщик работает при 122880 EU/t и расходует 5400 мБ смазки.'],
  ['uv_motor', 'Приводы для сборочного цеха', gt('uv_electric_motor'), 4, ['uv_phase_interlock', 'uv_flux_shunt', 'zpm_motor'], 'Мотор собирается из двух приводов ZPM, шунтов, тритания, америция, проволоки и ламината. Разведи выдачу на насосы, поршни и конвейеры.'],
  ['uv_pump', 'Насос для люков и охлаждения', gt('uv_electric_pump'), 2, ['uv_motor', 'uv_structural_laminate', 'zpm_pump'], 'Перебери два насоса ZPM с моторами UV, охлаждающими рубашками, ламинатом и прокладками. Подай 6200 мБ холодного теплоносителя.'],
  ['uv_piston', 'Тритановые поршни', gt('uv_electric_piston'), 2, ['uv_motor', 'uv_tritanium_plate', 'zpm_piston'], 'Собери поршни из двух ZPM-узлов, моторов UV и сердечников IV. Отведи часть партии под роботизированную подачу.'],
  ['uv_conveyor', 'Усиленная передача предметов', gt('uv_conveyor_module'), 2, ['uv_motor', 'uv_flux_shunt', 'zpm_conveyor'], 'Передача требует два конвейера ZPM, два мотора UV, шунты, листы, фазовые блоки и проволоку. Один комплект уйдёт на сборщик.'],
  ['uv_robot', 'Манипуляторы для линии Mk III', gt('uv_robot_arm'), 4, ['uv_piston', 'uv_phase_interlock', 'zpm_robot'], 'На один манипулятор подай два старых, два двигателя и два новых поршня. Четыре готовых манипулятора нужны контроллеру Mk III.'],
  ['uv_emitter', 'Излучатели с защитой фаз', gt('uv_emitter'), 2, ['uv_phase_interlock', 'uv_americium_plate', 'zpm_emitter'], 'На сборщике ZPM добавь оптические ядра LuV, америциевые листы и инженерные процессоры AE2. Отдельный вход принимает 6000 мБ защитного газа.'],
  ['uv_field', 'Генераторы поля для кольца', gt('uv_field_generator'), 4, ['uv_emitter', 'uv_flux_shunt', 'zpm_field'], 'Из двух генераторов ZPM, двух излучателей UV и силовой аппаратуры собери один генератор UV при 126976 EU/t. Оставь четыре для контроллера.'],
  ['uv_assembler', 'Первый сборщик UV', gt('uv_assembler'), 1, ['uv_hull', 'uv_robot', 'uv_conveyor', 'uv_energy_input', 'hv_create_arm'], 'Подай два сборщика ZPM, корпус, манипуляторы, конвейеры, фазу, Wetware и две руки Create. Для сборки подай 7600 мБ смазки при 126976 EU/t.'],
  ['uv_bender', 'Прокат для нейтрония', gt('uv_bender'), 1, ['uv_assembler', 'uv_piston', 'uv_cuprate_cable'], 'Поставь отдельный прокат UV и оставь слот для контрольного узла сети. Он понадобится как несгораемая оснастка при прокате нейтрониевых листов.'],
  ['uv_lapotronic_battery', 'Резервные батареи UV', gt('uv_lapotronic_battery'), 4, ['uv_assembler', 'uv_pulse_reserve', 'uv_voltage_coil', 'zpm_battery'], 'Собери корпуса и обнови батареи ZPM. Четыре готовые батареи отложи для итоговой приёмки. Отдельную партию используй в энергетическом буфере.'],
  ['uv_quantum_tank', 'Квантовый жидкостный склад UV', gt('uv_quantum_tank'), 1, ['uv_assembler', 'uv_pump', 'zpm_freight_buffer', 'uv_wetware'], 'Поставь квантовый танк на одной из линий подачи, если нужен объём под длительные серии. Для разных жидкостей используй раздельные резервуары.', true]
])

chapter('uv_fusion', 'XXXV. Термоядерное кольцо Mk III', gt('uv_fusion_reactor'), [
  ['uv_field_cassette', 'Кассеты обмоток Mk III', ks('uv_field_cassette'), 8, ['uv_cuprate_trunk', 'uv_flux_shunt', 'zpm_mk2_coils'], 'Для двух кассет добавь к катушкам Mk II и шунтам четыре обмотки высокого напряжения IE и два регулятора скорости Create. Подай 7200 мБ холодного теплоносителя.'],
  ['uv_mk3_casing', 'Секции кожуха Mk III', gt('fusion_casing_mk3'), 64, ['uv_field_cassette', 'uv_structural_laminate', 'zpm_mk2_shell'], 'Пересобери четыре кожуха Mk II с кассетами обмоток, тританием, ламинатом, стальной обшивкой и усиленными трубами PneumaticCraft. Отдельно отложи 16 секций для контроллера.'],
  ['uv_spare_mk2', 'Запасной контроллер Mk II', gt('zpm_fusion_reactor'), 2, ['uv_mk3_casing', 'zpm_mk2_controller', 'zpm_reactor_standard'], 'Собери второй контроллер Mk II с запасным эталоном и записанной сферой. Возьми оба контроллера в инвентарь, чтобы подтвердить запас. Один пойдёт на Mk III, второй верни в кольцо для америция и тритания.'],
  ['uv_hpca_48_coolers', 'Активное охлаждение массива на 48 CWU/t', gt('hpca_active_cooler_component'), 6, ['zpm_hpca_32', 'luv_cooling_active'], 'Для трёх усиленных процессоров поставь шесть активных охладителей. Веди штатный теплоноситель печатных плат в отдельный жидкостный вход HPCA с подачей 48 мБ за тик.'],
  ['uv_hpca_48', 'Расширение вычислительного массива', gt('hpca_advanced_computation_component'), 3, ['uv_hpca_48_coolers', 'uv_zpm_power_output', 'zpm_power_4a'], 'Три усиленных вычислителя и шесть активных охладителей занимают все девять мест HPCA. Запитай его от сети ZPM с вводом 4A и подачей от 415000 EU/t. Станции требуется отдельный энерговвод ZPM.'],
  ['uv_reactor_standard', 'Эталон для записи Mk III', ks('uv_reactor_standard'), 1, ['uv_field_cassette', 'uv_phase_interlock', 'uv_hpca_48', 'zpm_crystal', 'zpm_quantum', 'zpm_sensor'], 'Собери эталон из кассет, фазовой защиты, шунтов, датчиков ZPM и памяти 256k. Исследуй его с чистой сферой при 48 CWU/t, 144000 CWU и 126976 EU/t.'],
  ['uv_line_item_buses', 'Десять позиций подачи на линии', gt('ulv_input_bus'), 10, ['uv_reactor_standard', 'iv_line_controller', 'iv_line_input_buses'], 'Разверни сборочную линию на десять предметных секций и отдельную выдачу. Укажи порядок входов по JEI и установи продвинутый люк данных для сферы.'],
  ['uv_line_fluid_hatches', 'Четыре независимых жидкостных входа', gt('zpm_input_hatch'), 4, ['uv_line_item_buses', 'zpm_mk2_input'], 'Отведи по входу холодному теплоносителю, защитному газу, смазке и жидкому америцию. Для америция конденсируй 720 мБ плазмы с 5200 мБ холодного теплоносителя, держа протокол ZPM в камере.'],
  ['uv_mk3_controller', 'Контроллер кольца Mk III', gt('uv_fusion_reactor'), 1, ['uv_spare_mk2', 'uv_line_fluid_hatches', 'uv_hull', 'uv_field', 'uv_robot', 'luv_advanced_data'], 'Вставь записанную сферу. Подай 9000 мБ холодного теплоносителя, 8000 мБ защитного газа, 7200 мБ смазки и 1440 мБ америция. Десять входов сборочной линии работают 500 секунд при 130048 EU/t.'],
  ['uv_mk3_power', 'Пятнадцать энерговводов UV', gt('uv_energy_input_hatch'), 15, ['uv_mk3_controller', 'uv_energy_input', 'uv_upshift'], 'Для холодного пуска на 600 млн EU нужно 15 энерговводов UV по 40 млн EU. После зарядки оставь магистраль под напряжением. Кожухи Mk III используют штатные катушки Mk II.'],
  ['uv_mk3_input', 'Раздельная подача на кольцо', gt('uv_input_hatch'), 2, ['uv_pump', 'uv_hull', 'uv_mk3_controller'], 'Поставь два входных люка с отдельными буферами. Один принимает нейтрониевую подачу из Нижнего мира, второй — жидкий америций.'],
  ['uv_mk3_output', 'Жидкостная выдача нейтрония', gt('uv_output_hatch'), 1, ['uv_mk3_input', 'zpm_mk2_output'], 'Отведи выход в совместимый буфер перед вакуумной камерой. Если используешь трубы, сверь допустимую температуру с жидким нейтронием.'],
  ['uv_naquadria_battery', 'Первая переносная батарея UV', gt('uv_naquadria_battery'), 1, ['uv_mk3_power', 'uv_neutronium_coupon', 'uv_lapotronic_battery'], 'За проход Mk III из нейтрониевой подачи и обогащённого наквадаха выйдет 576 мБ наквадрии. Отлей её в четыре слитка и раздроби. Запаси 28 пыли на две переносные батареи ZPM и сборку батареи UV. На сборщике UV подай 8600 мБ холодного теплоносителя.'],
])

chapter('uv_commissioning', 'XXXVI. Приёмка сети UV', ks('uv_commissioning_report'), [
  ['uv_naquadria_capsule', 'Экранированные капсулы Энда', ks('uv_naquadria_capsule'), 8, ['uv_structural_laminate', 'uv_americium_plate', 'zpm_shielded_cask', 'zpm_end_heavy_concentrate'], 'Собери капсулы на ZPM только в Энде. На две нужны восемь порций обогащённой наквадаховой пыли, четыре концентрата, четыре ламината, четыре америциевых листа, четыре контейнера и четыре инженерных процессора AE2. Протокол ZPM остаётся в станке.'],
  ['uv_nether_feed_reactor', 'Реактор подготовки подачи в Нижнем мире', gt('zpm_chemical_reactor'), 1, ['uv_naquadria_capsule', 'zpm_isotope_reactor', 'zpm_power_1a'], 'В Нижнем мире подай две капсулы, 3200 мБ радона и 3600 мБ дейтерия. При 126976 EU/t получишь 1440 мБ нейтрониевой подачи. Подключи фильтрованный выход к транспортному буферу.'],
  ['uv_neutronium_coupon', 'Четыре пробы первого нейтрония', ks('uv_neutronium_coupon'), 4, ['uv_mk3_power', 'uv_mk3_output', 'uv_nether_feed_reactor', 'vacuum_controller'], 'Подай по 1440 мБ нейтрониевой подачи и америция в заряженное кольцо. При 262144 EU/t выйдут 720 мБ нейтрония. В вакуумной камере UV испытай четыре тритановых листа с этой порцией нейтрония и 8400 мБ холодного теплоносителя.'],
  ['uv_quench_cassette', 'Сменные кассеты вакуумного охлаждения', ks('uv_quench_cassette'), 2, ['uv_assembler', 'uv_pump', 'uv_field_cassette', 'vacuum_loop_buffers'], 'Две кассеты требуют насосов UV и IE, радиаторов PneumaticCraft, рубашек IV, ламината и кассет поля. Подай 9200 мБ холодного теплоносителя.'],
  ['uv_neutronium_ingot', 'Конденсация жидкого нейтрония', gt('neutronium_ingot'), 4, ['uv_neutronium_coupon', 'uv_quench_cassette'], 'Установи кассету в вакуумную камеру UV как оснастку. Из 720 мБ жидкого нейтрония и 9600 мБ холодного теплоносителя получишь четыре слитка при 442368 EU/t. Отводи нагретый теплоноситель.'],
  ['uv_grid_witness', 'Контрольные узлы силовой сети', ks('uv_grid_witness'), 4, ['uv_neutronium_coupon', 'uv_energy_output_4a', 'uv_pulse_reserve', 'uv_phase_interlock'], 'Восемь нейтрониевых проб, четыре фазовых блока, четыре накопителя, четыре шунта, четыре катушки и два вывода UV 4A идут на два контрольных узла. Добавь компоненты памяти 256k и 8200 мБ смазки.'],
  ['uv_neutronium_plate', 'Прокат нейтрониевых листов', gt('neutronium_plate'), 8, ['uv_neutronium_ingot', 'uv_grid_witness', 'uv_bender'], 'Загрузи два слитка и контрольный узел сети в прокат UV. Узел остаётся в станке. Понадобятся дополнительные листы для двух серий электроники.'],
  ['uv_freight_manifest', 'Сверка поставок в обычном мире', ks('uv_freight_manifest'), 1, ['uv_naquadria_capsule', 'uv_nether_feed_reactor', 'uv_grid_witness', 'zpm_freight_certificate', 'zpm_freight_link'], 'Сборщику UV в обычном мире нужны восемь капсул, восемь проб, четыре накладных ZPM, четыре контрольных узла, четыре квантовых узла AE2, восемь P2P-туннелей и четыре блока памяти 256k. Для маршрута можно использовать квантовый мост AE2 или отдельные грузовые буферы.'],
  ['uv_wetware', 'Компьютеры Wetware UV', gt('wetware_processor_computer'), 4, ['uv_neutronium_plate', 'uv_phase_interlock', 'zpm_wetware', 'uv_energy_input'], 'Для пары компьютеров подготовь четыре сборки Wetware, четыре нейтрониевые пробы и четыре листа нейтрония. Линия UV принимает 7200 мБ защитного газа и 6800 мБ смазки при 475136 EU/t.'],
  ['uv_crystal', 'Кристаллические мейнфреймы UV', gt('crystal_processor_mainframe'), 4, ['uv_neutronium_plate', 'uv_grid_witness', 'zpm_crystal', 'zpm_quantum'], 'Сборочная линия при 491520 EU/t принимает кристаллические компьютеры, квантовые мейнфреймы, испытанные пробы и листы, контрольные узлы и память AE2. На два мейнфрейма нужны 8400 мБ защитного газа и 7200 мБ смазки.'],
  ['uv_hpca_pair', 'Два отдельных вычислительных массива', gt('high_performance_computation_array'), 2, ['uv_hpca_48', 'uv_grid_witness', 'luv_hpca'], 'Два массива нужны для отвода тепла при 64 CWU/t. На каждый оставь отдельный передатчик, люк питания ZPM 4A, жидкостный вход и оптическую магистраль.'],
  ['uv_hpca_bridges', 'Мосты двух массивов', gt('hpca_bridge_component'), 2, ['uv_hpca_pair', 'luv_computation_bridge'], 'В каждом HPCA поставь один мост, два усиленных процессора, четыре активных охладителя и две пустые кассеты. Мост позволяет передавать мощность через сетевой коммутатор.'],
  ['uv_network_switch', 'Сетевой коммутатор GregTech', gt('network_switch'), 1, ['uv_hpca_bridges', 'uv_phase_interlock', 'zpm_sensor', 'zpm_emitter', 'luv_optical_pipe', 'zpm_power_1a'], 'Собери коммутатор на линии ZPM при 126976 EU/t. Подай по 7200 мБ защитного газа и холодного теплоносителя. Установи два приёмных вычислительных люка и один передающий. Коммутатор потребует 38 400 EU/t до поправки на обслуживание. Подай питание через отдельный энерговвод ZPM 1A или выше.'],
  ['uv_hpca_64_coolers', 'Охлаждение пары массивов', gt('hpca_active_cooler_component'), 8, ['uv_hpca_pair', 'luv_cooling_active'], 'Раздели восемь охладителей поровну. Веди в каждый массив по 32 мБ штатного теплоносителя печатных плат за тик. Для каждого HPCA предусмотрено около 277000 EU/t под полной нагрузкой.'],
  ['uv_hpca_64', 'Общая вычислительная сеть на 64 CWU/t', gt('hpca_advanced_computation_component'), 4, ['uv_network_switch', 'uv_hpca_64_coolers', 'uv_energy_input'], 'Установи по два усиленных процессора в каждом массиве. Соедини оба передатчика с приёмниками коммутатора, а его передатчик — с приёмником станции. Проверь 32 CWU/t с каждой стороны, затем включи станцию на отдельном питании UV.'],
  ['uv_neutronium_batch', 'Серия из 128 нейтрониевых проб', ks('uv_neutronium_coupon'), 128, ['uv_neutronium_coupon', 'uv_wetware', 'uv_crystal', 'uv_freight_manifest'], 'Подготовь 128 проб. На 32 штатных цикла испытаний уйдут 128 тритановых листов, 23 040 мБ нейтрония и 268 800 мБ холодного теплоносителя.'],
  ['uv_neutronium_acceptance_crate', 'Контейнер на 64 контрольные пробы', ks('uv_neutronium_acceptance_crate'), 1, ['uv_neutronium_batch', 'uv_quench_cassette', 'uv_phase_interlock'], 'Сборщик UV запечатывает 64 пробы, четыре охлаждающие кассеты и четыре фазовых блока с 9600 мБ холодного теплоносителя. Подай контейнер в отдельную шину.'],
  ['uv_commissioning', 'Приёмка комплекса UV', ks('uv_commissioning_report'), 1, ['uv_neutronium_acceptance_crate', 'uv_hpca_64', 'uv_lapotronic_battery', 'uv_pulse_reserve', 'uv_line_fluid_hatches', 'uv_quench_cassette', 'me_ingredient_buffer'], 'Исследуй контрольный узел при 64 CWU/t и 480 000 CWU. Подай 64 пробы и контейнер на 64 пробы в разные шины из 13. Отдельно подай накладные, электронику, кассеты и буферы ExtendedAE по JEI. Жидкости: 8640 мБ нейтрония, 20 000 мБ газа, 24 000 мБ теплоносителя и 20 000 мБ дизеля. Базовый цикл 24 минуты.']
])

chapter('final_foundation', 'XXXVII. Оснастка главного завода', factory('heavy_backplane'), [
  ['final_uv_permit', 'Допуск к главному заводу', ks('uv_commissioning_report'), 1, ['uv_commissioning'], 'Положи протокол приёмки UV в отдельный слот оснастки там, где его показывает JEI. Он подтверждает допуск к финальным переделам. Для работающей линии оставь отдельный экземпляр.'],
  ['final_press_tools', 'Тяжёлый пресс для переборок', ie('mold_plate'), 1, ['final_uv_permit', 'ie_press_mold', 'uv_structural_laminate'], 'Подготовь рабочий тяжёлый пресс Immersive Engineering с формой пластины, отдельной подачей FE и свободной выдачей. Сними с линии конкурирующие заказы на обычный прокат.'],
  ['final_neutronium_stock', 'Запас нейтрониевых листов', gt('neutronium_plate'), 32, ['final_uv_permit', 'uv_neutronium_plate', 'uv_mk3_power'], 'Отведи жидкий нейтроний в отдельный буфер, проведи закалку и прокат. Держи эти листы в отдельном складе от партии, отложенной на приёмку UV.'],
  ['final_laminate_stock', 'Запас силового ламината', ks('uv_structural_laminate'), 32, ['final_uv_permit', 'uv_structural_laminate', 'uv_hot_basin'], 'Готовь ламинат в нагретой чаше Create с защитным газом. Выдавай листы дозами на пресс IE и сборку аварийного оборудования.'],
  ['final_heavy_backplane', 'Штампованная силовая панель', factory('heavy_backplane'), 8, ['final_press_tools', 'final_laminate_stock'], 'Пресс IE расходует четыре ламината UV и 220000 FE на панель. Используй форму пластины, освобождай выдачу после каждого цикла.'],
  ['final_uv_workbench', 'Сборщик главного цеха', gt('uv_assembler'), 1, ['final_uv_permit', 'uv_assembler', 'uv_energy_input'], 'Подготовь сборщик UV с постоянной выдачей в раздельные буферы. Для силовых комплектующих и товарных партий отведи разные задания AE2.'],
  ['final_breaker_core', 'Сердечник силового выключателя', factory('breaker_core'), 4, ['final_heavy_backplane', 'final_neutronium_stock', 'final_uv_workbench'], 'На пару сердечников подай четыре панели, восемь тритановых и четыре нейтрониевых листа, по четыре катушки, шунта и поршня UV, восемь контактов HV и 7800 мБ смазки.'],
  ['final_cuprate_trunk', 'Запас магистрального купрата', gt('yttrium_barium_cuprate_quadruple_cable'), 16, ['final_uv_permit', 'uv_cuprate_trunk'], 'Подготовь провода и изоляцию для разводки UV. На пусковой части линии соблюдай предел пропуска пакетов каждого кабеля и ставь узлы там, где есть доступ для обслуживания.'],
  ['final_reserve_bus', 'Силовая шина резерва', factory('reserve_bus'), 4, ['final_breaker_core', 'final_cuprate_trunk', 'uv_flux_shunt'], 'На пару шин расходуются панели, кабели 4×, шунты, листы двух сплавов, диоды UV и щиты ZPM. Подай 8200 мБ защитного газа. Сохрани запас шин для итогового протокола.'],
  ['final_sterile_machine', 'Сборщик схем главного завода', gt('uv_circuit_assembler'), 1, ['final_uv_permit', 'uv_assembler', 'uv_wetware', 'zpm_circuit_assembler'], 'Поставь сборщик схем UV в действующей стерильной комнате. Проверь активность чистого контура, энерговвод и свободный слот выдачи.'],
  ['final_control_relay', 'Реле последовательного пуска', factory('control_relay'), 4, ['final_reserve_bus', 'final_sterile_machine', 'uv_phase_interlock'], 'Стерильный сборщик соединяет сердечники, фазовую защиту, Wetware, кристаллические мейнфреймы, инженерные процессоры AE2 и оптику LuV. Подай 8600 мБ защитного газа на два реле.'],
  ['final_cc_computer', 'Промышленный компьютер CC: Tweaked', 'computercraft:computer_advanced', 2, ['final_uv_workbench', 'final_heavy_backplane', 'final_uv_permit'], 'Установи два обычных компьютера в набор сырья вместе с силовыми панелями, датчиками UV, корпусами HPCA, фазовой защитой и оптикой LuV. Сборщик UV принимает 6600 мБ защитного газа. Протокол UV остаётся в станке.'],
  ['final_cc_modem', 'Проводные модемы CC: Tweaked', 'computercraft:wired_modem', 4, ['final_cc_computer', 'uv_emitter'], 'Собери модемы из панелей, излучателей UV, управляющих корпусов HPCA, фазовой защиты, оптики LuV и процессоров AE2. Для каждой штуки отведи один цикл сборщика UV.'],
  ['final_cc_cable', 'Диспетчерский кабель CC: Tweaked', 'computercraft:cable', 16, ['final_cc_computer', 'uv_voltage_coil'], 'Сборщик выпускает сразу шестнадцать кабелей. Подай панели, катушки UV, кожухи HPCA, фазовую защиту, процессоры и оптику.'],
  ['final_cc_monitor', 'Диспетчерские мониторы CC: Tweaked', 'computercraft:monitor_advanced', 4, ['final_cc_computer', 'uv_emitter'], 'На каждый монитор подай два обычных монитора, панели, излучатели, стекло чистого цеха, фазовую защиту и оптику. Мониторы расходуются при изготовлении стойки.'],
  ['final_telemetry_unit', 'Узел телеметрии', factory('telemetry_unit'), 4, ['final_control_relay', 'final_cc_computer', 'final_cc_modem', 'final_cc_cable', 'uv_grid_witness'], 'На два узла в стерильном сборщике подай два реле, два компьютера, четыре модема, восемь кабелей, память 256k и датчики UV. Нужны 9000 мБ защитного газа. Узлы расходуются на пульт и все три вида накладных.'],
  ['final_spare_press', 'Резервный пресс Create', create('mechanical_press'), 2, ['final_laminate_stock', 'press'], 'Оставь второй пресс на механической линии. Его удобно держать отдельным от основного потока ламината, чтобы без переналадки забирать пробные детали.', true]
])

chapter('final_power', 'XXXVIII. Независимый пусковой контур', factory('emergency_rectifier'), [
  ['final_line_inputs', 'Раздельные предметные секции', gt('ulv_input_bus'), 10, ['final_uv_permit', 'uv_line_item_buses', 'iv_line_controller'], 'Подготовь десять отдельных позиций для предметов и выходную секцию сборочной линии. В JEI сверь порядок каждой новой сборки, особенно однотипные шины, приборы и аккумуляторы.'],
  ['final_line_fluids', 'Четыре независимых жидкостных входа', gt('uv_input_hatch'), 4, ['final_line_inputs', 'uv_mk3_input', 'uv_pump'], 'Разведи жидкостные подводы по отдельным фильтрам. Перед каждой сборкой выгружай остатки предыдущих реагентов и сверяй по JEI объёмы и типы.'],
  ['final_emergency_rectifier', 'Аварийный выпрямитель', factory('emergency_rectifier'), 2, ['final_reserve_bus', 'final_telemetry_unit', 'final_line_fluids', 'uv_energy_output_4a'], 'На пару выпрямителей сборочная линия расходует сердечники, шины, диоды, трансформаторы, энерговыводы 4A, Wetware, накопители и нейтроний. Заполни четыре входа смазкой, защитным газом, холодным теплоносителем и улучшенным дизелем.'],
  ['final_isolated_bus', 'Изолированная аварийная секция', factory('isolated_bus'), 2, ['final_emergency_rectifier', 'final_breaker_core', 'final_cuprate_trunk'], 'Две секции собираются из четырёх шин, четырёх сердечников, двух выпрямителей, восьми химстойких уплотнений, четырёх трансформаторов 4A и четырёх листов нейтрония. На цикл нужно 9200 мБ смазки.'],
  ['final_cabinet_frame', 'Стойка управления', factory('control_rack'), 2, ['final_isolated_bus', 'final_telemetry_unit', 'final_cc_monitor', 'uv_grid_witness'], 'Четыре панели, узла телеметрии, реле, корпуса HPCA, монитора, блока памяти 256k и датчика дают две стойки. В сборщик подай 9800 мБ защитного газа.'],
  ['final_test_load', 'Калиброванная контрольная нагрузка', factory('test_load'), 2, ['final_cabinet_frame', 'final_breaker_core', 'uv_neutronium_coupon'], 'Два нагрузочных модуля требуют изолированных секций, реле, контрольных узлов UV, катушек, моторов и нейтрониевых листов. Подай 10000 мБ холодного теплоносителя. Отложи экземпляр для исследования.'],
  ['final_battery_stock', 'Лапотронные блоки резервного модуля', gt('uv_lapotronic_battery'), 8, ['final_uv_permit', 'uv_lapotronic_battery', 'uv_pulse_reserve'], 'Собери восемь лапотронных блоков для рецепта резервного модуля. Батарейные буферы заполняются отдельными переносными наквадриевыми батареями UV.'],
  ['final_portable_batteries', 'Переносные наквадриевые батареи', gt('uv_naquadria_battery'), 8, ['final_uv_permit', 'uv_naquadria_battery', 'final_battery_stock'], 'Подготовь два набора по четыре наквадриевых батареи UV. Один комплект запасает до 10,48576 млрд EU. Перед пуском держи основной комплект разряженным, а запасной заряди отдельно.'],
  ['final_battery_banks', 'Основной и резервный банки', gt('uv_battery_buffer_4x'), 4, ['final_battery_stock', 'final_portable_batteries', 'final_isolated_bus', 'uv_energy_input'], 'Собери четыре батарейных буфера UV 4×. Два входят в рецепт резервного модуля, а два других установи как основной и резервный банки. Оставь свободный доступ к обоим.'],
  ['final_main_switch', 'Выключатель основного банка', gt('machine_controller_cover'), 1, ['final_battery_banks', 'final_control_relay'], 'Установи крышку управления станком и проверь рычагом, какой сигнал отключает выдачу основного банка. Сохрани доступ к разрыву входной линии независимо от крышки.'],
  ['final_backup_module', 'Модуль аварийного питания', factory('backup_module'), 1, ['final_test_load', 'final_battery_banks', 'uv_pulse_reserve'], 'Для модуля выдели восемь батарей, два буфера UV 4×, четыре дизельных двигателя IV и силовые узлы. Подай 12000 мБ улучшенного дизеля, 10000 мБ смазки, 12000 мБ теплоносителя и 9800 мБ защитного газа.'],
  ['final_control_console', 'Пульт приёмочной смены', factory('control_console'), 1, ['final_backup_module', 'final_cabinet_frame', 'final_telemetry_unit', 'final_line_fluids'], 'Сборочная линия расходует стойки, телеметрию, нагрузки, шины, четыре сборщика схем UV, компьютеры, память 256k и восемь мейнфреймов. Подай защитный газ, холодный теплоноситель, смазку и улучшенный дизель.'],
  ['final_start_key', 'Ключ холодного пуска', factory('start_key'), 1, ['final_control_console', 'final_breaker_core', 'final_control_relay', 'luv_orbs', 'distribution_network_certificate'], 'Стерильный сборщик кодирует два ключа из реле, телеметрии, сфер данных, фазовых блоков, Wetware и сертификата распределённой сети. Подай 9800 мБ защитного газа.'],
  ['final_backup_diesel', 'Независимый дизельный источник', gt('extreme_combustion_engine'), 1, ['final_battery_banks', 'iv_power_engine', 'zpm_reserve_switchgear'], 'Дизельный двигатель IV годится для независимой зарядки через соответствующие трансформаторы. Сверь мощность всех звеньев и отдели зарядную линию от отключаемого ввода.', true],
  ['final_power_service', 'Обход обслуживания', gt('uv_diode'), 2, ['final_battery_banks', 'uv_voltage_coil'], 'Для развязки поставь диоды UV в направлении нужного потока и проверь допустимую силу тока. Разрыв основного ввода должен оставаться доступен оператору.', true]
])

chapter('final_dispatch', 'XXXIX. Отгрузки трёх измерений', factory('warehouse_seal'), [
  ['final_shipping_kit', 'Сборщики для трёх складов', gt('uv_assembler'), 3, ['final_uv_workbench', 'final_control_relay'], 'На каждом складе установи сборщик UV с отдельным входом жидкости. Протокол UV нужен во всех трёх сборщиках. Он остаётся после крафта, поэтому один экземпляр можно переносить между измерениями.'],
  ['final_seal_chamber', 'Камера складских пломб', pnc('pressure_chamber_interface'), 2, ['final_uv_permit', 'pressure_interfaces', 'liquid_process_compressor'], 'Оснастка складской пломбы проходит 4,9 бар в камере PneumaticCraft. На входе держи фильтры партии, на выходе — фильтр на готовую пломбу.'],
  ['final_warehouse_seal', 'Серия складских пломб', factory('warehouse_seal'), 24, ['final_seal_chamber', 'final_telemetry_unit'], 'Восемь пломб требуют восемь вакуумных прокладок, восемь химстойких уплотнений, четыре ламината UV и четыре инженерных процессора. Раздели выпуск между тремя складами и упаковкой готовых товаров.'],
  ['final_overworld_material', 'Склад металла обычного мира', gt('tungsten_steel_plate'), 32, ['final_shipping_kit', 'iv_tungstensteel_plate', 'zpm_naquadah_plates'], 'Подготовь отгрузочную площадку с отдельными запасами вольфрамовой стали, наквадахового сплава и нейтрония. Разведи расход на производство и поставки по отдельным каналам.'],
  ['final_overworld_dispatch', 'Накладные обычного мира', factory('overworld_dispatch'), 8, ['final_overworld_material', 'final_warehouse_seal', 'uv_freight_manifest'], 'На четыре накладные расходуются шестнадцать вольфрамовых листов, восемь наквадаховых, четыре нейтрониевых и 10240 мБ смазки. Добавь пломбы, телеметрию, узлы AE2 и память. Протокол UV остаётся в сборщике обычного мира.'],
  ['final_nether_material', 'Склад Нижнего мира', ks('zpm_nether_isotope_salt'), 16, ['final_shipping_kit', 'zpm_nether_isotope_salt', 'uv_nether_feed_reactor'], 'Подготовь локальный буфер реагентов в Нижнем мире. Храни соль отдельно от потока реактора подготовки подачи для Mk III.'],
  ['final_nether_dispatch', 'Накладные Нижнего мира', factory('nether_dispatch'), 8, ['final_nether_material', 'final_warehouse_seal', 'uv_freight_manifest'], 'Сборщик в Нижнем мире выдаёт четыре накладные за цикл. Подай по шестнадцать порций изотопной соли и огнеупорной смеси, восемь листов PTFE и 10240 мБ улучшенного дизеля. Пломбы, телеметрия и AE2 расходуются на месте.'],
  ['final_end_material', 'Склад тяжёлой фракции Энда', ks('zpm_end_heavy_concentrate'), 16, ['final_shipping_kit', 'zpm_end_heavy_concentrate', 'uv_naquadria_capsule'], 'Подготовь склад тяжёлого концентрата в Энде. Отведи готовые капсулы на отдельный порт, поскольку часть понадобится не реактору, а грузовой линии.'],
  ['final_end_dispatch', 'Накладные Энда', factory('end_dispatch'), 8, ['final_end_material', 'final_warehouse_seal', 'uv_freight_manifest'], 'Для четырёх накладных подай шестнадцать порций тяжёлого концентрата, восемь капсул UV, восемь оптических вставок и 10240 мБ защитного газа. Добавь стандартный комплект оформления, протокол UV держи в станке.'],
  ['final_quantum_transfer', 'Два квантовых маршрута', me('quantum_link'), 4, ['final_nether_dispatch', 'final_end_dispatch', 'zpm_freight_link'], 'Для автоматической доставки собери отдельный квантовый мост AE2 на каждом маршруте и запитай обе стороны. Проверь, что целевые буферы сохраняют независимость партий.', true],
  ['final_liquid_warehouse', 'Отдельные жидкостные склады', gt('uv_quantum_tank'), 2, ['final_nether_dispatch', 'final_end_dispatch', 'uv_quantum_tank'], 'Квантовые танки нужны при непрерывной подаче. Назначай каждой ёмкости только одну жидкость и проверяй пропускную способность труб.', true],
  ['final_rail_terminal', 'Подвоз по заводской ветке', create('track_station'), 2, ['final_overworld_dispatch', 'rail_stations'], 'Железная дорога может подвозить сырьё между складами обычного мира. Сборщик всё равно должен оформить накладную в нужном измерении. Поставь независимый приёмный буфер на станции.', true]
])

chapter('final_metallurgy', 'XL. Серийная металлургия', factory('reinforced_billet'), [
  ['final_steel_input', 'Слитки для серийной закалки', gt('tungsten_steel_ingot'), 32, ['final_overworld_dispatch', 'iv_tungstensteel_plate'], 'Выдели партию слитков вольфрамовой стали для вакуумной закалки усиленных болванок.'],
  ['final_alloy_input', 'Тритановые листы для грузовой партии', gt('tritanium_plate'), 32, ['final_steel_input', 'uv_tritanium_plate'], 'Прокатай тританий и отведи листы на отдельный склад. Часть расходуется при маркировке, часть — в сборщике готовой партии.'],
  ['final_vacuum_housing', 'Камера закалки серийных заготовок', gt('vacuum_freezer'), 1, ['final_neutronium_stock', 'final_alloy_input', 'vacuum_controller'], 'Выдели вакуумную камеру с вводом UV и обраткой теплоносителя. Сверь допустимое число предметных слотов и раздели горячие изделия и готовые заготовки.'],
  ['final_quench_mixer', 'Смеситель закалочной жидкости', gt('uv_mixer'), 1, ['final_vacuum_housing', 'uv_quench_cassette'], 'На 12800 мБ смеси подай четыре кассеты UV, восемь порций известкового флюса, четыре порции бора, 9600 мБ холодного теплоносителя и 3200 мБ дистиллята.'],
  ['final_quench_recooling', 'Охладитель обратного контура', pnc('thermopneumatic_processing_plant'), 1, ['final_quench_mixer', 'vacuum_cooler'], 'Термопневматическая установка возвращает 3000 мБ из 4000 мБ отработанной смеси. Держи не выше 270 К и давление 4,5 бар. Потери восполняй в смесителе UV.'],
  ['final_quench_loop', 'Раздельные ёмкости охлаждения', gt('tungsten_steel_drum'), 2, ['final_quench_mixer', 'final_quench_recooling', 'vacuum_loop_buffers'], 'Подготовь два буфера для свежей смеси и обратки. Отдельно подключи нейтроний к вакуумной камере.'],
  ['final_reinforced_billet', 'Партия усиленных болванок', factory('reinforced_billet'), 8, ['final_quench_loop', 'final_steel_input'], 'Вакуумная камера принимает восемь вольфрамовых слитков, 6400 мБ закалочной смеси и 720 мБ нейтрония. За 300 секунд выдаёт восемь болванок и возвращает 6400 мБ отработанной жидкости.'],
  ['final_steel_assembler', 'Сборщик стальных партий', gt('uv_assembler'), 1, ['final_reinforced_billet', 'final_uv_workbench', 'final_warehouse_seal'], 'Поставь сборщик UV в обычном мире. Выдели ему собственную выдачу. Она нужна при проверке свежих изделий и не должна смешиваться с запасом склада.'],
  ['final_steel_dispatch_seal', 'Маркировка стального заказа', factory('serial_steel'), 80, ['final_steel_assembler', 'final_overworld_dispatch', 'final_alloy_input'], 'На восемь стальных номеров подай восемь болванок, по четыре пломбы, накладные, сердечника, тритановых листа и панели. На десять циклов потребуется 80 000 мБ смазки.'],
  ['final_steel_stock_demo', 'Пробная партия стали', factory('steel_lot'), 4, ['final_steel_dispatch_seal'], 'Подай по четыре стальных номера и болванки, по две пломбы, тритановых листа и накладные, а также 7200 мБ смазки. Сборщик обычного мира выдаёт четыре партии. Держи пробу вне испытательного станка.', true],
  ['final_steel_filter', 'Раздельная выдача стали', me('storage_bus'), 1, ['final_steel_assembler', 'me_storage_bus'], 'Подключи отдельную шину хранения к складу стали. При испытании держи выход станка под контролем пульта и не подключай к нему склад старых партий.', true]
])

chapter('final_polymers', 'XLI. Полимерный цех', factory('polymer_preform'), [
  ['final_polyethylene_stock', 'Полиэтилен нефтехимического завода', gt('polyethylene_plate'), 64, ['final_nether_dispatch', 'polyethylene_batch'], 'Подними старый нефтехимический участок и накопи плиты полиэтилена. Выдели автономную ветку подачи сырья, чтобы фабрика не осталась без полимера во время переброски нагрузки.'],
  ['final_pressure_polymer', 'Опрессовка полимерного пакета', factory('polymer_preform'), 8, ['final_polyethylene_stock', 'final_seal_chamber', 'final_warehouse_seal'], 'В камере подай шестнадцать листов полиэтилена, восемь PTFE, четыре ламината UV и четыре пломбы. Восемь заготовок выходят при 4,9 бар.'],
  ['final_polymer_reactor', 'Реактор товарной полимеризации', gt('uv_chemical_reactor'), 1, ['final_pressure_polymer', 'final_uv_workbench', 'zpm_isotope_reactor'], 'Поставь реактор UV в обычном мире. Разведи жидкостные входы и оставь предметную выдачу свободной для готовой партии.'],
  ['final_polymer_feed', 'Дозировка реактивов', gt('stainless_steel_drum'), 3, ['final_polymer_reactor', 'vacuum_loop_buffers'], 'Поставь отдельные буферы для дозируемых жидкостей. Клапаны обратки и подачи проверяй на пустой машине, затем сверяй объёмы рецепта в JEI.'],
  ['final_polymer_dispatch_seal', 'Маркировка полимерного заказа', factory('serial_polymer'), 80, ['final_polymer_feed', 'final_nether_dispatch', 'final_isolated_bus'], 'На восемь номеров подай восемь заготовок, по четыре пломбы, накладные и изолированные секции, по восемь уплотнений и полиэтиленовых листов. На десять циклов потребуется 96 000 мБ жидкого полиэтилена.'],
  ['final_polymer_stock_demo', 'Пробная партия полимера', factory('polymer_lot'), 4, ['final_polymer_dispatch_seal'], 'В реактор обычного мира подай четыре полимерных номера, две накладные, 6400 мБ полиэтилена и 3200 мБ закалочной смеси. На выходе четыре партии и 3200 мБ обратки. Убери пробу до привязки станка к пульту.', true],
  ['final_polymer_pump', 'Резерв насосного узла', gt('uv_electric_pump'), 4, ['final_polymer_feed', 'uv_pump'], 'Держи отдельные насосы для реагентов и обратки. Для нового подключения оставь запас арматуры и свободное место между ёмкостями.', true]
])

chapter('final_logic', 'XLII. Стерильная электроника и маркировка', factory('serial_blank'), [
  ['final_logic_memory', 'Вычислительный склад 256k', me('256k_crafting_storage'), 4, ['final_end_dispatch', 'luv_me_crafting'], 'Собери восемь вычислительных хранилищ AE2 на 256k для итогового протокола. Компоненты ячеек для накладных и телеметрии подготовь отдельно.'],
  ['final_uv_processor_stock', 'Партия вычислителей UV', gt('wetware_processor_computer'), 8, ['final_logic_memory', 'uv_wetware', 'uv_crystal'], 'Раздели Wetware и кристаллические мейнфреймы на технологические буферы. Не допускай взаимной блокировки автозаказов с общими комплектующими.'],
  ['final_optics_panel', 'Оптическая панель серии', factory('optics_panel'), 8, ['final_uv_processor_stock', 'final_sterile_machine', 'luv_optical_core'], 'На восемь панелей подай восемь оптических ядер LuV, восемь плотных кабелей AE2, по четыре фазовых блока, силовые панели, тритановых листа и ламината. Нужно 9000 мБ защитного газа.'],
  ['final_marking_station', 'Инскрайбер серийной маркировки', me('inscriber'), 1, ['final_optics_panel', 'me_inscriber', 'me_press_engineer'], 'Подготовь отдельный инскрайбер. Инженерная матрица остаётся в верхнем слоте, оптическая панель подаётся в средний.'],
  ['final_serial_blank', 'Партия серийных заготовок', factory('serial_blank'), 160, ['final_marking_station'], 'Каждая панель даёт одну серийную заготовку. Подготовь 160 заготовок, половину для номеров и половину для сборки электронных партий.'],
  ['final_logic_dispatch_seal', 'Маркировка электронной партии', factory('serial_logic'), 80, ['final_serial_blank', 'final_end_dispatch', 'final_telemetry_unit'], 'На восемь номеров подай восемь заготовок, по четыре накладные, узла телеметрии, Wetware, кристаллических мейнфрейма и компонента памяти. На десять циклов потребуется 92 000 мБ защитного газа.'],
  ['final_logic_station', 'Выделенный стерильный станок', gt('uv_circuit_assembler'), 1, ['final_logic_dispatch_seal', 'final_sterile_machine'], 'На главной площадке оставь выделенный сборщик схем UV в стерильной комнате. Отведи свободную выдачу для свежих изделий при приёмочной смене.'],
  ['final_logic_stock_demo', 'Пробная партия электроники', factory('logic_lot'), 4, ['final_logic_station'], 'Стерильный сборщик обычного мира принимает по четыре номера и серийных заготовки, по две накладные, пломбы и процессора AE2, 7800 мБ защитного газа. Четыре пробные партии убери до испытания.', true],
  ['final_logic_provider', 'Поставщики шаблонов по цехам', me('pattern_provider'), 3, ['final_logic_station', 'me_provider', 'final_logic_memory'], 'Разнеси поставщиков по трём цехам. Подготавливай входы заранее. На выдаче во время испытания оставь доступ диспетчерской, чтобы не потерять свежую партию в общей сети.', true]
])

chapter('final_operation', 'XLIII. Холодный запуск и приёмка', factory('commissioning_report'), [
  ['final_overworld_supply', 'Рабочий запас накладных обычного мира', factory('overworld_dispatch'), 96, ['final_overworld_dispatch', 'final_steel_dispatch_seal'], 'После стальной маркировки отложи 16 накладных на пуск и 80 на основные фазы. Для двух совместных испытаний понадобятся ещё четыре накладные.'],
  ['final_nether_supply', 'Рабочий запас накладных Нижнего мира', factory('nether_dispatch'), 96, ['final_nether_dispatch', 'final_polymer_dispatch_seal'], 'Подготовь 96 накладных Нижнего мира. Держи отдельные партии для холодного пуска, реактора и двух совместных испытаний.'],
  ['final_end_supply', 'Рабочий запас накладных Энда', factory('end_dispatch'), 96, ['final_end_dispatch', 'final_logic_dispatch_seal'], 'Отложи 16 накладных Энда на пуск и восемь десятков для сборщика схем. Четыре накладные для повторных проверок подготовь сверх этого числа.'],
  ['final_controlled_shop', 'Три наблюдаемые производственные линии', factory('control_console'), 1, ['final_start_key', 'final_main_switch', 'final_steel_assembler', 'final_polymer_reactor', 'final_logic_station'], 'В обычном мире установи два батарейных буфера UV 4×, сборщик UV, химический реактор UV и стерильный сборщик схем UV в радиусе 48 блоков от основного банка. С пультом нажми Shift + ПКМ по каждому блоку для привязки. Обычная ПКМ показывает состояние. Выключи выдачу предметов станков и поставь бочки под выходы.'],
  ['final_isolation_check', 'Развязка линий и контроль зарядки', gt('uv_battery_buffer_4x'), 2, ['final_controlled_shop', 'final_portable_batteries', 'final_backup_module', 'final_return_buffer_setup'], 'Разведи вводы зарядки, выключи оба накопителя и разряди основной буфер и станки. Освободи выходы. В резерве должно быть не меньше 3 млрд EU, для полного запуска заряди четыре батареи.'],
  ['final_auxiliary_load', 'Зарядная нагрузка для проверки линии', gt('uv_charger_4x'), 1, ['final_isolation_check', 'final_portable_batteries'], 'При необходимости подключи к активной линии отдельное зарядное устройство и разряженные аккумуляторы. Для зачёта каждой секунды хотя бы один из трёх производственных станков должен потреблять энергию. Зарядное устройство только дополняет технологическую нагрузку.', true],
  ['final_shift_stock_steel', 'Запас на 40 циклов стали', factory('reinforced_billet'), 160, ['final_steel_dispatch_seal', 'final_overworld_supply', 'final_controlled_shop']],
  ['final_shift_stock_polymer', 'Запас на 40 циклов полимера', factory('serial_polymer'), 160, ['final_polymer_dispatch_seal', 'final_nether_supply', 'final_controlled_shop']],
  ['final_shift_stock_logic', 'Запас на 40 циклов электроники', factory('serial_logic'), 160, ['final_logic_dispatch_seal', 'final_end_supply', 'final_controlled_shop']],
  ['final_black_start_record', 'Холодный пуск без основного ввода', factory('black_start_record'), 1, ['final_isolation_check', 'final_shift_stock_steel', 'final_shift_stock_polymer', 'final_shift_stock_logic'], 'Ключом нажми Shift + ПКМ по основному буферу. Пульт спишет по 16 накладных из каждого измерения. Запусти только резерв. Засчитаются 120 секунд с отдачей резерва от 4 194 304 EU/с при работе приёмочных линий.'],
  ['final_outage_record', 'Смена источника под нагрузкой', factory('outage_record'), 1, ['final_black_start_record'], 'От основной сети выпусти по 32 изделия за 40 минут. Заряди резерв до 9 млрд EU, отключи основной ввод и зарядку резерва. Подтверди первый отказ ключом. На резерве выпусти по восемь изделий за пять минут.'],
  ['final_shift_record', 'Журнал непрерывной работы завода', factory('shift_record'), 1, ['final_outage_record'], 'После первого отказа проработай 19 минут от основного питания и выдай по 24 изделия. Снова заряди резерв до 9 млрд EU, повтори пятиминутный отказ с восемью изделиями и ещё 19 минут основной работы с 24 изделиями. Пульт выдаёт журнал после всех 90 минут.'],
  ['final_overlap_stock', 'Сырьё для совместной работы трёх линий', factory('serial_logic'), 8, ['final_shift_record', 'final_shift_stock_steel', 'final_shift_stock_polymer'], 'Выдели ещё по восемь стальных, полимерных и электронных номеров. На два цикла добавь по четыре накладные каждого вида, сырьё и соответствующую жидкость по JEI.'],
  ['final_concurrent_record', 'Протокол совместной нагрузки', factory('concurrent_record'), 1, ['final_overlap_stock', 'final_shift_record', 'final_isolation_check'], 'Останови станки, освободи выходы и подтверди испытание ключом. От основного накопителя запусти все три линии одновременно. Накопитель должен отдавать не менее 24 млн EU в секунду. После двух минут без остановок получи ещё по четыре изделия каждого вида и забери протокол пультом.'],
  ['final_repeat_load_record', 'Повторная приёмка трёх линий', factory('repeat_load_record'), 1, ['final_concurrent_record', 'final_overlap_stock'], 'После первого теста снова останови станки и освободи выходы. Подтверди перезапуск ключом. Требуются ещё 120 секунд совместной работы от основного накопителя и четыре новых изделия каждого вида.'],
  ['final_report_buses', 'Пятнадцать предметных секций приёмки', gt('ulv_input_bus'), 15, ['final_repeat_load_record', 'final_line_inputs', 'luv_advanced_data'], 'Разведи 15 предметных позиций и четыре жидкости по JEI. В отдельный люк поставь записанную сферу. Для сетевого сертификата оставь собственную шину.'],
  ['final_report_research', 'Исследование контрольной нагрузки', gt('data_orb'), 1, ['final_test_load', 'final_shift_record', 'uv_hpca_64', 'luv_orbs'], 'Подай контрольную нагрузку и чистую сферу. Станция требует 458 752 EU/t и 576 000 CWU при 64 CWU/t. Запас штатного охлаждения раздели между двумя HPCA.'],
  ['final_commissioning_report', 'Приёмка главного завода', factory('commissioning_report'), 1, ['final_report_buses', 'final_report_research', 'final_line_fluids'], 'В обычном мире вставь запись в продвинутый люк, загрузи пять протоколов, сертификат распределённой сети, оснастку, электронику UV и память AE2. Подай 11 520 мБ нейтрония, 28 000 мБ газа, 32 000 мБ закалочной смеси и 28 000 мБ дизеля. Базовый цикл 30 минут при 507 904 EU/t.']
])

chapter('masonry', 'Камень и стекло', ks('stone_chisel'), [
  ['chisel', 'Кремнёвое зубило', ks('stone_chisel'), 1, ['bench', 'shard', 'handle'], 'Собери отдельный инструмент для камня. Он изнашивается при ручной обработке.', true],
  ['abrasive', 'Подготовка абразива', ks('abrasive_paste'), 4, ['hammer', 'washed'], 'Разотри гравий и песок с промытым волокном.', true],
  ['mortar', 'Глиняный раствор', ks('clay_mortar'), 4, ['clay', 'abrasive', 'temper'], 'Раствор нужен для стен, кирпича и основания станка.', true],
  ['stone_slabs', 'Каменные плиты вручную', mc('stone_slab'), 4, ['chisel', 'abrasive', 'kiln'], 'Три камня с абразивом дают одну плиту. Подготовь четыре детали.', true],
  ['stone_bricks', 'Кладка под станину', mc('stone_bricks'), 3, ['chisel', 'mortar', 'kiln'], 'Отдельно обработай камни и собери кладку на глиняном растворе.', true],
  ['stone_wall', 'Каменная перегородка', mc('cobblestone_wall'), 8, ['mortar', 'chisel'], 'Сложи восемь секций на растворе. Запас пригодится при ограждении цеха.', true],
  ['stone_stairs', 'Каменный марш', mc('stone_brick_stairs'), 4, ['stone_bricks'], 'Сделай подъём к настилу и оставь ступени для доступа к станку.', true],
  ['stonecutter', 'Станок камнереза', mc('stonecutter'), 1, ['stone_bricks', 'saw_blade', 'iron_plate'], 'Собери камнерез из полотна, втулки и стандартных листов. Он даёт две плиты с блока.', true],
  ['stone_batch', 'Резка плит серией', mc('stone_slab'), 32, ['stonecutter', 'stone_slabs'], 'Подготовь запас из 32 плит для пола первого цеха.', true],
  ['glass_batch', 'Стекольная шихта', ks('glass_batch'), 5, ['kiln', 'abrasive', 'lining'], 'Смешай песок с абразивом, углём и огнеупорной добавкой.', true],
  ['glass', 'Отжиг стекла', mc('glass'), 5, ['glass_batch'], 'Обожги пять загрузок. Голый песок не плавится в готовый блок.', true],
  ['panes', 'Раскрой остекления', mc('glass_pane'), 2, ['glass', 'chisel'], 'На две панели идут четыре блока стекла, зубило и абразив.', true]
])

const timber = [
  ['oak', 'Дуб', 'oak_log'], ['spruce', 'Ель', 'spruce_log'], ['birch', 'Берёза', 'birch_log'],
  ['jungle', 'Дерево джунглей', 'jungle_log'], ['acacia', 'Акация', 'acacia_log'],
  ['dark_oak', 'Тёмный дуб', 'dark_oak_log'], ['mangrove', 'Мангр', 'mangrove_log'],
  ['cherry', 'Вишня', 'cherry_log'], ['bamboo', 'Бамбук', 'bamboo_block'],
  ['crimson', 'Багровый стебель', 'crimson_stem'], ['warped', 'Искажённый стебель', 'warped_stem']
]

for (const [wood, name, log] of timber) {
  const id = part => 'wood_' + wood + '_' + part
  const item = part => mc(wood + '_' + part)
  const rows = [
    [id('logs'), 'Партия заготовок', mc(log), 8, ['axe'], 'Подготовь восемь брёвен, стеблей или блоков бамбука.'],
    [id('hand'), 'Доски ручной работы', item('planks'), 8, [id('logs'), 'knife'], 'Нож даёт две доски с заготовки. Собери первую партию.'],
    [id('mill'), 'Склад пиломатериала', item('planks'), 64, [id('hand'), 'saw'], 'Пила выдаёт четыре доски с заготовки. Квест проверяет запас из 64 досок.'],
    [id('slabs'), 'Плиты для пола', item('slab'), 8, [id('hand')], 'На плиту идут три доски и нагель. Подготовь восемь плит.'],
    [id('stairs'), 'Ступени для лестничного марша', item('stairs'), 8, [id('hand'), 'joint'], 'Шесть досок и столярные соединения дают две ступени.'],
    [id('fence'), 'Ограждение площадки', item('fence'), 12, [id('hand'), 'joint'], 'Подготовь двенадцать секций ограждения.'],
    [id('gate'), 'Шарнирная калитка', item('fence_gate'), 2, [id('fence'), 'hinge'], 'На каждую калитку идут два кованых шарнира.'],
    [id('door'), 'Двери с железной навеской', item('door'), 2, [id('hand'), 'hinge'], 'Собери двери на шарнирах и столярных соединениях.'],
    [id('hatch'), 'Люки для обслуживания', item('trapdoor'), 2, [id('door')], 'Подготовь два люка с отдельной навеской.'],
    [id('button'), 'Кнопки управления', item('button'), 4, [id('slabs'), 'knife'], 'Подгони плиту ножом и посади кнопку на нагель.'],
    [id('pressure'), 'Нажимные плиты', item('pressure_plate'), 4, [id('slabs'), 'binding'], 'Три деревянные плиты, нагели и крепление дают один нажимной узел.'],
    [id('sign'), 'Таблички для маркировки', item('sign'), 4, [id('hand'), 'joint'], 'Разметь склад и рабочие станции четырьмя табличками.'],
    [id('hanging'), 'Подвесные указатели', item('hanging_sign'), 2, [id('sign'), 'iron'], 'Возьми железные цепи для подвеса указателей.']
  ]
  if (wood !== 'crimson' && wood !== 'warped') {
    rows.push(
      [id('boat'), 'Первая грузовая переправа', mc(wood === 'bamboo' ? 'bamboo_raft' : wood + '_boat'), 1, [id('hand'), 'joint'], 'Собери лодку или плот на вязаном креплении и столярных соединениях.'],
      [id('cargo'), 'Переправа со складом', mc(wood === 'bamboo' ? 'bamboo_chest_raft' : wood + '_chest_boat'), 1, [id('boat'), 'chest', 'hinge'], 'Навесь сундук на грузовую лодку или плот.']
    )
  }
  chapter('timber_' + wood, 'Лесопилка · ' + name, item('planks'), rows.map(row => [...row.slice(0, 6), true]))
}

const ids = new Set()
expandEarly(chapters)
expandLv(chapters)
expandMv(chapters)
expandHv(chapters)
expandEvIv(chapters)
expandLuVZpm(chapters)
expandUvFinal(chapters)
expandLate(chapters)
addPostUvChapters(chapter)
chapters.push(...forestrySections())
const unique = name => {
  const value = '4' + createHash('sha256').update('zero-shift:' + name).digest('hex').slice(0, 15).toUpperCase()
  if (ids.has(value)) throw new Error('Duplicate FTB id for ' + name)
  ids.add(value)
  return value
}

const quests = new Map()
for (const { rows } of chapters) {
  for (const [key, , item, count, deps] of rows) {
    if (quests.has(key)) throw new Error('Duplicate quest key ' + key)
    if (!/^[a-z0-9_]+:[a-z0-9_/]+$/.test(item) || !Number.isSafeInteger(count) || count < 1) throw new Error('Bad task ' + key)
    quests.set(key, { id: unique('quest/' + key), task: unique('task/' + key), deps })
  }
}
const visited = new Set()
function checkDependencies(key, trail = new Set()) {
  if (!quests.has(key)) throw new Error('Missing quest dependency ' + key)
  if (trail.has(key)) throw new Error('Circular quest dependency ' + key)
  if (visited.has(key)) return
  trail.add(key)
  for (const dep of quests.get(key).deps) checkDependencies(dep, trail)
  trail.delete(key)
  visited.add(key)
}
for (const key of quests.keys()) checkDependencies(key)

const q = JSON.stringify
const check = process.argv.includes('--check')
function writeGenerated(file, content) {
  if (check) {
    if (!readFileSync(file).equals(Buffer.from(content))) throw new Error('Outdated quest file ' + file)
  } else {
    mkdirSync(dirname(file), { recursive: true })
    writeFileSync(file, content)
  }
}
function outputFile(relative, lines) {
  writeGenerated(join(output, relative), lines.join('\n') + '\n')
}
const decimal = value => value.toFixed(3) + 'd'
const rewardFor = createQuestRewardResolver(chapters)
const titleAudit = auditQuestTitles(chapters)
const descriptionAudit = auditQuestDescriptions(chapters)
if (titleAudit.invalidTitles.length || titleAudit.duplicateQuestTitles.length ||
    titleAudit.duplicateChapterTitles.length || titleAudit.unusedOverrides.length) {
  throw new Error('Invalid quest titles ' + q(titleAudit))
}
if (descriptionAudit.invalidDescriptions.length || descriptionAudit.duplicateDescriptions.length || descriptionAudit.unusedOverrides.length) {
  throw new Error('Invalid quest descriptions ' + q(descriptionAudit))
}
const chaptersByKey = new Map(chapters.map(chapter => [chapter.key, chapter]))
const groupedSections = new Set()
const mainGroup = unique('chapter_group/main')
const branchesGroup = unique('chapter_group/branches')
const groupLines = [
  '{', '  chapter_groups: [',
  '    { id: ' + q(mainGroup) + ', title: "Основная прогрессия" }',
  '    { id: ' + q(branchesGroup) + ', title: "Отдельные ветки" }', '  ]', '}'
]
const mainChapterCount = questChapters.findIndex(([key]) => key === 'me_network')
const orderedChapters = questChapters.map(([key, title, sectionKeys, milestone], order) => {
  const sections = sectionKeys.map(sectionKey => {
    const section = chaptersByKey.get(sectionKey)
    if (!section || groupedSections.has(sectionKey)) throw new Error('Invalid quest section ' + sectionKey)
    groupedSections.add(sectionKey)
    return section
  })
  const milestoneRow = sections.flatMap(section => section.rows).find(row => row[0] === milestone)
  if (!milestoneRow) throw new Error('Missing chapter milestone ' + milestone)
  return { key, title, sections, order, group: order < mainChapterCount ? mainGroup : branchesGroup, icon: milestoneRow[2], milestone }
})
if (groupedSections.size !== chapters.length) throw new Error('Some quest sections have no chapter')
outputFile('chapter_groups.snbt', groupLines)

const chapterDir = join(output, 'chapters')
const chapterFiles = new Set(orderedChapters.map(chapter => chapter.key + '.snbt'))
for (const file of readdirSync(chapterDir)) {
  if (!file.endsWith('.snbt') || chapterFiles.has(file)) continue
  if (check || !chaptersByKey.has(file.slice(0, -5))) throw new Error('Unexpected quest chapter file ' + file)
  rmSync(join(chapterDir, file))
}

outputFile('data.snbt', [
  '{', '  title: "GregTech: Industrial Brain Damage"', '  version: 13', '  default_consume_items: false',
  '  default_reward_team: true', '  default_autoclaim_rewards: "disabled"',
  '  default_quest_disable_jei: false', '  detection_delay: 20', '  drop_loot_crates: false',
  '  show_lock_icons: true', '  icon: "create:water_wheel"', '}'
])

for (const { key, title, icon, sections, milestone, order, group } of orderedChapters) {
  const layout = webLayout(key, sections, milestone)
  if (layout.unconnected.length) {
    throw new Error('Missing dependency lines in ' + key + ': ' + layout.unconnected.join(', '))
  }
  const web = drawWeb(layout)
  const imagePath = 'textures/quests/web/' + key + '.png'
  writeGenerated(join(root, 'pack', 'overrides', 'kubejs', 'assets', 'kubejs', imagePath), png(web.width, web.height, web.pixels))
  const lines = [
    '{', '  default_hide_dependency_lines: true', '  default_quest_shape: ""',
    '  filename: ' + q(key), '  group: ' + q(group), '  icon: ' + q(icon), '  title: ' + q(title),
    '  id: ' + q(unique('chapter/' + key)), '  order_index: ' + order, '  quest_links: []',
    '  images: [{',
    '    image: ' + q('kubejs:' + imagePath),
    '    x: 0.0d', '    y: 0.0d', '    width: ' + decimal(web.width / web.scale), '    height: ' + decimal(web.height / web.scale),
    '    order: -1', '  }]', '  quests: ['
  ]
  for (const { row, section, x, y, shape, size } of layout.entries) {
    const [questKey, , item, count, deps, , optional] = row
    const { id, task } = quests.get(questKey)
    const reward = rewardFor(questKey)
    if (!/^[a-z0-9_]+:[a-z0-9_/]+$/.test(reward.item) || !Number.isInteger(reward.count) || reward.count < 1 || reward.count > 64) {
      throw new Error('Invalid reward for ' + questKey)
    }
    lines.push(
      '    {', '      id: ' + q(id), '      title: ' + q(questTitle(section, row)),
      '      description: [' + q(questDescription(section, row)) + ']',
      '      x: ' + decimal(x), '      y: ' + decimal(y), '      shape: ' + q(shape), '      size: ' + decimal(size)
    )
    if (deps.length) lines.push('      dependencies: ' + q(deps.map(dep => quests.get(dep).id)))
    if (optional) lines.push('      optional: true')
    lines.push('      tasks: [{', '        id: ' + q(task), '        type: "item"')
    const tag = taskTags[questKey]
    if (tag) {
      lines.push('        item: { id: ' + q(item) + ', Count: 1b, tag: ' + q(tag) + ' }',
        '        match_nbt: true', '        weak_nbt_match: true')
    } else {
      lines.push('        item: ' + q(item))
    }
    if (count > 1) lines.push('        count: ' + count + 'L')
    lines.push(
      '      }]', '      rewards: [{', '        id: ' + q(unique('reward/' + questKey)), '        type: "item"',
      '        item: ' + q(reward.item), '        count: ' + reward.count, '      }]', '    }'
    )
  }
  lines.push('  ]', '}')
  outputFile(join('chapters', key + '.snbt'), lines)
}

console.log(orderedChapters.length + ' chapters, ' + quests.size + ' quests and rewards')
