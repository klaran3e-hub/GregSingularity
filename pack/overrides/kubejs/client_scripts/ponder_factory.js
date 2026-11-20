Ponder.registry(event => {
  event.create(['kubejs:final_control_console', 'kubejs:final_start_key'])
    .scene('gtibd_factory_cold_start', 'Холодный пуск завода', scene => {
      const primary = [0, 1, 0]
      const reserve = [4, 1, 0]
      const primaryLamp = [0, 1, 1]
      const reserveLamp = [4, 1, 1]
      const lines = [
        [0, 'gtceu:uv_assembler'],
        [2, 'gtceu:uv_chemical_reactor'],
        [4, 'gtceu:uv_circuit_assembler']
      ]

      scene.showBasePlate()
      for (const position of [primary, reserve]) {
        scene.world.setBlock(position, 'gtceu:uv_battery_buffer_4x', false)
        scene.world.showSection(position, Facing.DOWN)
      }
      scene.idle(12)
      scene.text(100, 'На площадке в обычном мире поставь два накопителя UV 4×. Пультом через Shift + ПКМ первым привяжи основной.', [0.5, 2, 0.5]).attachKeyFrame()
      scene.idle(105)
      scene.text(90, 'Вторым привяжи резерв. Разведи питание так, чтобы каждый источник можно было включать отдельно.', [4.5, 2, 0.5])
      scene.idle(95)

      for (const [x, machine] of lines) {
        scene.world.setBlock([x, 1, 3], 'minecraft:barrel', false)
        scene.world.setBlock([x, 2, 3], machine, false)
        scene.world.showSection([x, 1, 3, x, 2, 3], Facing.DOWN)
        scene.idle(8)
      }
      scene.text(105, 'Пультом через Shift + ПКМ привяжи три станка UV. Все станки держи в пределах 48 блоков от основного накопителя.', [2.5, 3, 3.5]).attachKeyFrame()
      scene.idle(110)
      scene.text(85, 'Отключи автовывод предметов. Оставь бочки под станками и подключай импорт ME к бочкам.', [2.5, 1.5, 3.5])
      scene.idle(90)

      scene.world.setBlock(primaryLamp, 'minecraft:red_concrete', false)
      scene.world.setBlock(reserveLamp, 'minecraft:red_concrete', false)
      scene.world.showSection(primaryLamp, Facing.DOWN)
      scene.world.showSection(reserveLamp, Facing.DOWN)
      scene.text(100, 'Выключи оба накопителя. Основной и буферы станков опустоши, в резерве оставь минимум 3 млрд EU. Освободи выходные слоты.', [2.5, 2, 1.5]).attachKeyFrame()
      scene.idle(105)
      scene.text(105, 'Возьми модуль резерва и по 16 накладных из каждого измерения. Ключом нажми Shift + ПКМ по основному накопителю.', [0.5, 2, 0.5])
      scene.idle(110)

      scene.world.setBlock(reserveLamp, 'minecraft:lime_concrete', true)
      scene.text(95, 'Включи только резерв и запусти три линии. Для просмотра условий и выдачи протоколов нажми пультом по основному накопителю.', [4.5, 2, 0.5]).attachKeyFrame()
      scene.idle(100)
    })
})
