;(function () {
  if (typeof Ponder === 'undefined') return

  function showBlock(scene, pos, block) {
    scene.world.setBlock(pos, block, false)
    scene.world.showSection(pos, Facing.DOWN)
  }

  function instruction(scene, duration, text, pos) {
    scene.text(duration, text, pos).attachKeyFrame()
    scene.idle(duration + 8)
  }

  function rotation(scene, pos, speed) {
    scene.world.modifyBlockEntityNBT(pos, nbt => nbt.putFloat('Speed', speed))
  }

  function handWashing(scene) {
    const water = [2.5, 1.9, 2.5]
    const shore = [2.5, 2.15, 3.55]

    scene.showBasePlate()
    scene.world.setBlocks([1, 1, 1, 3, 1, 3], 'minecraft:stone', false)
    scene.world.setBlock([2, 1, 2], 'minecraft:water', false)
    scene.world.showSection([1, 1, 1, 3, 1, 3], Facing.DOWN)
    scene.idle(12)

    scene.showControls(85, water, PonderPointing.DOWN).rightClick().withItem('kubejs:plant_fibre')
    instruction(scene, 95, 'Возьми растительное волокно в руку. Наведи курсор прямо на воду и нажми ПКМ.', water)

    scene.showControls(90, water, PonderPointing.DOWN).rightClick().whileSneaking().withItem('kubejs:copper_grit')
    instruction(scene, 105, 'Руду промывай так же. С зажатым Shift за один раз промоешь до четырёх порций.', water)

    const concentrate = scene.world.createItemEntity(shore, [-0.06, 0.1, 0.04], Item.of('kubejs:washed_copper_grit'))
    const tailings = scene.world.createItemEntity([3.18, 2.15, 3.55], [0.03, 0.1, 0.04], Item.of('kubejs:ore_tailings'))
    instruction(scene, 100, 'Концентрат пойдёт в шихту. Хвосты от промывки руды сохрани для шамотной массы.', shore)
    scene.world.removeEntity(concentrate)
    scene.world.removeEntity(tailings)
  }

  function firstPlate(scene) {
    const wheel = [0, 3, 2]
    const shaft = [1, 3, 2]
    const press = [2, 3, 2]
    const depot = [2, 1, 2]
    const feed = [2.5, 1.94, 2.5]

    scene.showBasePlate()
    showBlock(scene, [0, 4, 3], 'minecraft:water')
    showBlock(scene, [0, 3, 3], Block.id('minecraft:water').with('level', '8'))
    showBlock(scene, wheel, Block.id('create:water_wheel').with('facing', 'east'))
    rotation(scene, wheel, 8)
    showBlock(scene, shaft, Block.id('create:shaft').with('axis', 'x'))
    rotation(scene, shaft, 8)
    showBlock(scene, press, Block.id('create:mechanical_press').with('facing', 'east'))
    rotation(scene, press, 8)
    instruction(scene, 110, 'Направь поток воды на лопасти малого колеса. Соедини ось колеса с боковым валом пресса.', [1.5, 3.5, 2.5])

    showBlock(scene, depot, 'create:depot')
    scene.showControls(85, feed, PonderPointing.DOWN).rightClick().withItem('minecraft:iron_ingot')
    instruction(scene, 105, 'Поставь депо под прессом. Между ними оставь один блок воздуха. Выложи на депо железный слиток.', feed)

    const ingot = scene.world.createItemEntity(feed, [0, 0, 0], Item.of('minecraft:iron_ingot'))
    scene.world.modifyBlockEntityNBT(press, nbt => {
      nbt.putBoolean('Running', true)
      nbt.putInt('Ticks', 0)
    })
    scene.idle(28)
    scene.world.removeEntity(ingot)
    scene.world.modifyBlockEntityNBT(press, nbt => nbt.putBoolean('Running', false))
    const plate = scene.world.createItemEntity(feed, [0, 0.08, 0], Item.of('gtceu:iron_plate'))
    instruction(scene, 105, 'Из слитка выйдет одна железная пластина GregTech. Для меди используй то же депо и тот же привод.', feed)
    scene.world.removeEntity(plate)
  }

  function mixerDrive(scene) {
    const wheel = [0, 1, 0]
    const gearbox = [1, 1, 0]
    const largeY = Block.id('create:large_cogwheel').with('axis', 'y')
    const smallY = Block.id('create:cogwheel').with('axis', 'y')

    scene.showBasePlate()
    showBlock(scene, [0, 2, 1], 'minecraft:water')
    showBlock(scene, [0, 1, 1], Block.id('minecraft:water').with('level', '8'))
    showBlock(scene, wheel, Block.id('create:water_wheel').with('facing', 'east'))
    rotation(scene, wheel, 8)
    showBlock(scene, gearbox, Block.id('create:gearbox').with('axis', 'z'))
    rotation(scene, gearbox, 8)
    instruction(scene, 110, 'Малое колесо даёт 8 об/мин. Поставь вертикальный редуктор так, чтобы вал от колеса входил сбоку, а привод выходил вверх.', [1.5, 1.7, 0.5])

    showBlock(scene, [1, 2, 0], largeY)
    rotation(scene, [1, 2, 0], 8)
    showBlock(scene, [2, 2, 1], smallY)
    rotation(scene, [2, 2, 1], -16)
    instruction(scene, 105, 'Над редуктором поставь большую шестерню. На том же уровне, по диагонали, поставь малую. На малой будет 16 об/мин.', [2.5, 2.7, 1.5])

    showBlock(scene, [2, 3, 1], largeY)
    rotation(scene, [2, 3, 1], -16)
    showBlock(scene, [3, 3, 2], smallY)
    rotation(scene, [3, 3, 2], 32)
    instruction(scene, 105, 'Поставь вторую большую прямо над малой. Повтори диагональную пару на новом уровне. Получишь 32 об/мин.', [3.5, 3.7, 2.5])

    showBlock(scene, [4, 3, 2], 'create:mechanical_mixer')
    rotation(scene, [4, 3, 2], -32)
    showBlock(scene, [4, 1, 2], 'create:basin')
    instruction(scene, 115, 'Поставь смеситель сбоку от второй малой шестерни. Под ним оставь блок воздуха, затем поставь чашу. Проверь обороты и нагрузку.', [4.5, 2.35, 2.5])
  }

  function firstSteel(scene) {
    const structure = [1, 1, 1, 3, 3, 3]
    const front = [2.5, 2.5, 4.02]
    const supply = [1.25, 1.6, 4.35]

    scene.showBasePlate()
    scene.world.setBlocks(structure, 'immersiveengineering:cokebrick', false)
    scene.world.showSection(structure, Facing.DOWN)
    scene.showControls(95, front, PonderPointing.DOWN).rightClick().withItem('immersiveengineering:hammer')
    instruction(scene, 115, 'Сложи полный куб из 27 коксовых кирпичей. Нажми инженерным молотом по центру передней стенки.', front)

    scene.showControls(90, front, PonderPointing.DOWN).rightClick().withItem('kubejs:coking_charge')
    instruction(scene, 105, 'Загрузи шихту для коксования. За цикл печь выдаст два куска кокса и 750 мБ креозота.', front)
    scene.showControls(70, supply, PonderPointing.DOWN).withItem('immersiveengineering:creosote_bucket')
    instruction(scene, 90, 'Забирай креозот в вёдра или откачивай насосом, чтобы бак не переполнялся.', supply)

    scene.world.hideSection(structure, Facing.UP)
    scene.idle(12)
    scene.world.setBlocks(structure, 'immersiveengineering:blastbrick', false)
    scene.world.showSection(structure, Facing.DOWN)
    scene.showControls(90, front, PonderPointing.DOWN).rightClick().withItem('immersiveengineering:hammer')
    instruction(scene, 105, 'Рядом собери такой же куб из доменного кирпича и активируй его тем же молотом.', front)

    scene.showControls(90, front, PonderPointing.DOWN).withItem('kubejs:steel_furnace_charge')
    instruction(scene, 120, 'Подай тигель стальной шихты в рабочий слот, а кокс в топливный. Забирай слитки GregTech и шлак, чтобы освободить выходы.', front)
  }

  Ponder.registry(event => {
    event.create(['kubejs:plant_fibre', 'kubejs:copper_grit']).scene('gtibd_hand_washing', 'Ручная промывка', handWashing)
    event.create('create:mechanical_press').scene('gtibd_first_plate', 'Первая пластина на прессе', firstPlate)
    event.create('create:mechanical_mixer').scene('gtibd_mixer_drive', 'Привод смесителя на 32 об/мин', mixerDrive)
    event.create(['immersiveengineering:cokebrick', 'immersiveengineering:blastbrick']).scene('gtibd_first_steel', 'Кокс и первая сталь', firstSteel)
  })
})()
