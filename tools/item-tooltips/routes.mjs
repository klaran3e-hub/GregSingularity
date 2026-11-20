import {readFileSync} from 'node:fs'
const read = p => JSON.parse(readFileSync(new URL(p,import.meta.url),'utf8'))
const machineNames = Object.fromEntries(`assembler|Сборщик|Assembler
circuit_assembler|Сборщик схем|Circuit assembler
assembly_line|Сборочная линия|Assembly line
canner|Упаковщик|Canning machine
chemical_reactor|Химический реактор|Chemical reactor
large_chemical_reactor|Большой химический реактор|Large chemical reactor
chemical_bath|Химическая ванна|Chemical bath
ore_washer|Рудомоечная машина|Ore washing plant
electromagnetic_separator|Электромагнитный сепаратор|Electromagnetic separator
centrifuge|Центрифуга|Centrifuge
thermal_centrifuge|Термоцентрифуга|Thermal centrifuge
electric_blast_furnace|Электрическая домна|Electric blast furnace
autoclave|Автоклав|Autoclave
macerator|Дробитель|Macerator
vacuum_freezer|Вакуумный морозильник|Vacuum freezer
laser_engraver|Лазерный гравёр|Laser engraver
extractor|Экстрактор|Extractor
mixer|Смеситель|Mixer
forming_press|Формовочный пресс|Forming press
compressor|Компрессор|Compressor
forge_hammer|Кузнечный молот|Forge hammer
bender|Листогиб|Bending machine
lathe|Токарный станок|Lathe
cutter|Резак|Cutting machine
arc_furnace|Дуговая печь|Arc furnace
wiremill|Проволочный стан|Wiremill
alloy_smelter|Плавильня сплавов|Alloy smelter
field_bloomery|Полевой горн|Field bloomery
sifter|Просеиватель|Sifting machine
fusion_reactor|Термоядерный реактор|Fusion reactor
gas_collector|Газосборник|Gas collector
distillery|Дистиллятор|Distillery
electrolyzer|Электролизёр|Electrolyzer
primitive_blast_furnace|Примитивная домна|Primitive blast furnace
coke_oven|Коксовая печь|Coke oven
plasma_generator|Плазменный генератор|Plasma generator`.split('\n').map(s=>{const [id,...names]=s.split('|');return [id,names]}))

export function addProcessDescriptions(item,defined,text) {
  for(const site of read('../planetary-mills.json')){
    const en=site.id[0].toUpperCase()+site.id.slice(1)
    const kind=['Обогащение · '+site.title+' · '+site.tier,'Ore processing · '+en+' · '+site.tier]
    const local=['Операция выполняется '+site.place+'.','Run this operation on '+en+'.']
    const part=step=>'kubejs:mill_'+site.id+'_'+step
    item(site.ore,kind,['Дробитель превращает '+site.count+' блоков руды в две порции дроблёнки.','Macerate '+site.count+' ore blocks for two portions of crushed ore.'],local)
    const wash=machineNames[site.wash],split=machineNames[site.split]
    item(part('grit'),kind,[wash[0]+' промывает две порции дроблёнки '+site.place+'.','Wash two portions on '+en+' using the '+wash[1].toLowerCase()+'.'],['Расход промывочной жидкости на загрузку · '+(250*site.count)+' мБ','Wash fluid per load · '+(250*site.count)+' mB'])
    item(part('washed'),kind,['После разделения остаются тяжёлый концентрат и пустая порода.','Separation yields heavy concentrate and gangue.'],[split[0]+' · '+site.title,split[1]+' · '+en])
    if(!defined.has(part('heavy')))item(part('heavy'),kind,['Выщелачивание в реакторе даёт 1 000 мБ раствора для автоклава.','Leach in a chemical reactor for 1,000 mB of crystallization liquor.'],[site.title+' · '+(125*site.count)+' мБ кислоты',en+' · '+(125*site.count)+' mB of acid'])
    item(part('crystal'),kind,['Прокали кристалл в электрической домне при '+site.heat+' К.','Calcine the crystal in an electric blast furnace at '+site.heat+' K.'],['На кристалл нужно '+(125*site.count)+' мБ аргона.','Each crystal uses '+(125*site.count)+' mB of argon.'])
  }
  const sectors={reclaim:['Регенерация · После UV','Reclamation · Post-UV'],distribution:['Снабжение · После UV','Distribution · Post-UV'],final:['Пусконаладка · После UV','Commissioning · Post-UV'],rail:['Железнодорожные грузы','Rail freight'],mill:['Планетарные материалы','Planetary materials']}
  for(const [id,recipe,type,product] of read('routes.json')){
    const stem=id.split(':')[1].split('_')[0]
    const tier=['lv','mv','hv','ev','iv','luv','zpm','uv'].includes(stem)?(stem==='luv'?'LuV':stem.toUpperCase()):null
    const machine=machineNames[type.split(':')[1]]
    if(type!=='null'&&!machine)throw Error('Missing machine name in '+recipe)
    const kind=tier?['Промышленная деталь · '+tier,'Industrial component · '+tier]:sectors[stem]||(id.startsWith('gtibdcrops:')?['Агрономия · GregCrops','Crop science · GregCrops']:['Промышленное производство','Industrial production'])
    item(id,kind,machine?['Следующая операция · '+machine[0],'Next operation · '+machine[1]]:['Используется для изготовления следующего изделия.','Used to make the following product.'],['На выходе · %s','Produces · %s'])
    const key='tooltip.gtibd_core.'+id.replace(':','.')+'.product'
    for(const locale of Object.keys(text))text[locale][key]=product
  }
}
