if (Platform.isLoaded('ponderjs')) {
  Ponder.registry(event => {
    event.create('pneumaticcraft:refinery').scene('gtibd_mv_refinery', 'Нефтеперегонная колонна MV', scene => {
      const controller = [2, 1, 2]
      const heater = [2, 1, 3]
      const fractions = [
        '25 мБ тяжёлой фракции. Отправь её на производство смазки.',
        '25 мБ лёгкой фракции. Она пойдёт в линию дизеля.',
        '30 мБ нафты. Подай её на крекинг для получения этилена.',
        '20 мБ нефтяного газа. Он нужен на НПЗ IE вместе с обработанной лёгкой фракцией.'
      ]

      function showBlock(pos, block) {
        scene.world.setBlock(pos, block, false)
        scene.world.showSection(pos, Facing.DOWN)
      }

      scene.scaleSceneView(0.75)
      scene.showBasePlate()
      scene.encapsulateBounds([4, 5, 4])
      scene.idle(10)

      showBlock(controller, Block.id('pneumaticcraft:refinery').with('facing', 'south'))
      for (let y = 2; y <= 5; y++) {
        showBlock([2, y, 2], Block.id('pneumaticcraft:refinery_output').with('facing', 'south'))
        scene.idle(6)
      }
      scene.text(65, 'Поставь четыре выходных блока друг над другом над контроллером.', [2.5, 4.5, 2.5])
        .placeNearTarget().attachKeyFrame()
      scene.idle(72)

      showBlock([0, 1, 2], 'gtceu:steel_drum')
      showBlock([1, 1, 2], Block.id('create:mechanical_pump').with('facing', 'east'))
      scene.text(65, 'Подай сбоку в контроллер 100 мБ промытой нефти. Стрелка насоса смотрит на колонну.', [1.5, 1.5, 2.5])
        .colored(PonderPalette.INPUT).placeNearTarget().attachKeyFrame()
      scene.idle(72)

      showBlock(heater, Block.id('pneumaticcraft:vortex_tube').with('facing', 'south'))
      scene.text(75, 'Подай воздух в вихревую трубку и поверни её горячим концом к контроллеру. Цикл начинается от 403 К.', [2.5, 1.5, 3.5])
        .placeNearTarget().attachKeyFrame()
      scene.idle(82)

      fractions.forEach((description, index) => {
        const y = index + 2
        showBlock([3, y, 2], Block.id('create:mechanical_pump').with('facing', 'east'))
        showBlock([4, y, 2], 'gtceu:steel_drum')
        scene.text(65, description, [3.5, y + 0.5, 2.5])
          .colored(PonderPalette.OUTPUT).placeNearTarget().attachKeyFrame()
        scene.idle(72)
      })

      scene.text(95, 'Подай вращение к насосам. Держи каждый выход на отдельной линии: заполненный бак остановит перегонку.', [4.5, 3.5, 2.5])
        .placeNearTarget().attachKeyFrame()
      scene.idle(100)
    })
  })
}
