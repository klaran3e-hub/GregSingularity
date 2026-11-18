;(function () {
  if (typeof Ponder === 'undefined') return
  const boiler = 'gtceu:lp_steam_solid_boiler'
  const pipe = 'gtceu:bronze_small_fluid_pipe'
  const drum = 'gtceu:bronze_drum'
  const turbine = 'gtceu:lv_steam_turbine'
  const assembler = 'gtceu:lv_assembler'

  function firstSteamCircuit(scene) {
    scene.showBasePlate()
    scene.world.setBlocks([0, 1, 2, 1, 1, 2], 'minecraft:stone_bricks', false)
    scene.world.showSection([0, 1, 2, 1, 1, 2], Facing.DOWN)
    scene.world.setBlock([0, 2, 2], Block.id(boiler).with('facing', 'north'), false)
    scene.world.showSection([0, 2, 2], Facing.DOWN)
    scene.idle(20)

    scene.text(80, 'Заполни холодный котёл водой. Топливо положи после заполнения.', [0.5, 2.5, 2.5]).attachKeyFrame()
    scene.showControls(55, [0.5, 3, 2.5], 'down').withItem('minecraft:water_bucket')
    scene.idle(90)

    scene.world.setBlock([1, 2, 2], pipe, false)
    scene.world.setBlock([2, 2, 2], drum, false)
    // Bits 4 and 5 connect the pipe west to the boiler and east to the drum.
    scene.world.modifyBlockEntityNBT([1, 2, 2], nbt => nbt.putInt('connections', 48))
    scene.world.showSection([1, 2, 2, 2, 2, 2], Facing.DOWN)
    scene.text(100, 'Соедини бок котла с бронзовым барабаном. Подожди, пока барабан накопит пар.', [1.5, 2.5, 2.5]).attachKeyFrame()
    scene.idle(110)

    scene.world.setBlock([2, 1, 2], Block.id(turbine).with('facing', 'east'), false)
    scene.world.showSection([2, 1, 2], Facing.UP)
    scene.text(90, 'Поставь турбину под барабаном. Выход пара у барабана снизу.', [2.5, 2, 2.5]).attachKeyFrame()
    scene.idle(100)

    scene.world.setBlock([3, 1, 2], Block.id(assembler).with('facing', 'south'), false)
    scene.world.showSection([3, 1, 2], Facing.WEST)
    scene.text(90, 'Поставь сборщик или кабель LV у передней грани турбины.', [3, 1.5, 2.5]).attachKeyFrame()
    scene.idle(100)

    scene.text(90, 'Нажми ПКМ по барабану деревянной киянкой GregTech без Shift. Она включает выдачу пара.', [2.5, 2.5, 2.5]).attachKeyFrame()
    scene.showControls(60, [2.5, 3, 2.5], 'down').rightClick().withItem('gtceu:wood_mallet')
    scene.idle(100)

    scene.text(110, 'Одного котла хватит на короткий запуск с запасом пара. Для непрерывной работы турбины нужно минимум 11 таких котлов.', [2.5, 1.5, 2.5]).attachKeyFrame()
    scene.idle(120)
  }

  Ponder.registry(event => {
    event.create(boiler).scene('gtibd_steam_boiler', 'Первый паровой контур', firstSteamCircuit)
    event.create(drum).scene('gtibd_steam_drum', 'Первый паровой контур', firstSteamCircuit)
    event.create(turbine).scene('gtibd_steam_turbine', 'Первый паровой контур', firstSteamCircuit)
  })
})()
