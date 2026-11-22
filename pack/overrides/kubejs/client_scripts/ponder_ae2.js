if (typeof Ponder !== 'undefined') {
  Ponder.registry(event => {
    event.create('ae2:pattern_provider').scene(
      'gtibd_ae2_fluid_order',
      'Промывка волокна по заказу ME',
      scene => {
        const provider = [1, 1, 2]
        const bath = [2, 1, 2]
        const output = [3, 1, 2]
        const providerLabel = [1.5, 2, 2.5]
        const bathLabel = [2.5, 2, 2.5]
        const outputLabel = [3.5, 2, 2.5]

        scene.showBasePlate()
        scene.world.setBlock(bath, 'gtceu:lv_chemical_bath', false)
        scene.world.showSection(bath, Facing.DOWN)
        scene.idle(20)
        scene.text(95, 'Подай питание LV на химическую ванну. Для промывки нужно 16 EU/t.', bathLabel)
          .attachKeyFrame()
        scene.idle(105)

        scene.world.setBlock(provider, 'ae2:pattern_provider', false)
        scene.world.showSection(provider, Facing.EAST)
        scene.idle(20)
        scene.text(115, 'Поставь поставщик шаблонов вплотную к ванне и подключи его к ME.', providerLabel)
          .attachKeyFrame()
        scene.idle(125)

        scene.text(145, 'Закодируй шаблон обработки. Вход: 8 единиц сырого волокна и 1000 мБ воды. Выход: 8 единиц промытого волокна.', providerLabel)
          .attachKeyFrame()
        scene.idle(155)
        scene.showControls(70, providerLabel, PonderPointing.DOWN).withItem('ae2:processing_pattern')
        scene.text(100, 'Вставь шаблон в поставщик. Храни волокно в предметной ячейке ME, а воду в жидкостной.', providerLabel)
        scene.idle(110)

        scene.world.setBlock(output, 'minecraft:barrel', false)
        scene.world.showSection(output, Facing.WEST)
        scene.idle(20)
        scene.text(145, 'Назначь сторону с бочкой выходом ванны. Включи автовывод предметов в интерфейсе станка.', outputLabel)
          .attachKeyFrame()
        scene.idle(155)
        scene.showControls(70, [4.5, 1.5, 2.5], PonderPointing.DOWN).withItem('ae2:import_bus')
        scene.text(130, 'Поставь шину импорта на свободную грань бочки. Подключи её к той же ME-сети и задай фильтр на промытое волокно.', outputLabel)
        scene.idle(140)

        scene.showControls(70, bathLabel, PonderPointing.DOWN).withItem('gtceu:gregsingularity_plant_fibre')
        scene.text(120, 'Закажи 8 единиц промытого волокна в терминале. Поставщик отправит волокно и воду в ванну.', bathLabel)
          .attachKeyFrame()
        scene.idle(115)
        const feed = scene.world.createItemEntity([1.65, 2.35, 2.5], [0.09, 0.06, 0], Item.of('gtceu:gregsingularity_plant_fibre', 8))
        scene.idle(15)
        scene.world.removeEntity(feed)

        const result = scene.world.createItemEntity([2.65, 2.35, 2.5], [0.09, 0.06, 0], Item.of('gtceu:gregsingularity_washed_fibre', 8))
        scene.idle(15)
        scene.world.removeEntity(result)
        scene.showControls(75, outputLabel, PonderPointing.DOWN).withItem('gtceu:gregsingularity_washed_fibre')
        scene.text(105, 'Шина вернёт готовую партию из бочки в ME. После этого заказ завершится.', outputLabel)
          .colored(PonderPalette.GREEN)
        scene.idle(115)
      }
    )
  })
}
