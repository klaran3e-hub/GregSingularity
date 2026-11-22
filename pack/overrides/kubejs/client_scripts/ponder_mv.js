if (typeof Ponder !== 'undefined') {
  Ponder.registry(event => {
    function block(scene, pos, id) {
      scene.world.setBlock(pos,id,false)
      scene.world.showSection(pos,Facing.DOWN)
    }
    function step(scene, pos, text, ticks) {
      scene.text(ticks,text,pos).placeNearTarget().attachKeyFrame()
      scene.idle(ticks + 8)
    }
    function input(scene, pos, item) {
      scene.showControls(65,pos,PonderPointing.DOWN).withItem(item)
    }
    function sound(scene, id) {
      scene['addInstruction(java.util.function.Consumer)'](playing => {
        const ui = Client.screen
        if (!ui || typeof ui.getActiveScene !== 'function' || !playing.equals(ui.getActiveScene()) || !Client.player) return
        const events = Java.loadClass('net.minecraftforge.registries.ForgeRegistries').SOUND_EVENTS
        const Id = Java.loadClass('net.minecraft.resources.ResourceLocation')
        Client.player.playSound(events.getValue(new Id('kubejs','fieldwork.' + id)),0.45,1)
      })
    }
    event.create(['gtceu:gregsingularity_mv_coalescer','gtceu:gregsingularity_mv_saturated_coalescer','pneumaticcraft:thermopneumatic_processing_plant'])
      .scene('gtibd_mv_dewatering','Осушка нефти и возврат патрона',scene => {
        scene.showBasePlate()
        block(scene,[0,1,2],'gtceu:steel_drum')
        block(scene,[1,1,2],Block.id('gtceu:mv_chemical_reactor').with('facing','south'))
        input(scene,[1.5,2.1,2.5],'gtceu:gregsingularity_oil_wash_cartridge')
        sound(scene,'wash')
        step(scene,[1.5,1.6,2.5],'На 1000 мБ сырой нефти подай 250 мБ дистиллята и промывочный картридж. Отдельно отведи 800 мБ обессоленной нефти и 400 мБ рассола.',83)
        block(scene,[2,1,2],'gtceu:steel_small_fluid_pipe')
        scene.world.modifyBlockEntityNBT([2,1,2], nbt => nbt.putInt('connections',48))
        block(scene,[3,1,2],'pneumaticcraft:thermopneumatic_processing_plant')
        input(scene,[3.5,2.1,2.5],'gtceu:gregsingularity_mv_coalescer')
        sound(scene,'fire')
        step(scene,[3.5,1.6,2.5],'При 398 К и давлении от 3,25 бар патрон отделит воду. Из 800 мБ обессоленной нефти на колонну пойдут 750 мБ промытой.',82)
        block(scene,[3,1,4],Block.id('gtceu:mv_chemical_bath').with('facing','south'))
        const used = scene.world.createItemEntity([3.5,2,2.7],[0,.04,.12],Item.of('gtceu:gregsingularity_mv_saturated_coalescer'))
        scene.idle(12)
        scene.world.removeEntity(used)
        input(scene,[3.5,2.1,4.5],'gtceu:gregsingularity_mv_coalescer')
        sound(scene,'wash')
        step(scene,[3.5,1.7,4.5],'В ванне промой насыщенный патрон 200 мБ дистиллята. Верни его на осушку, а 150 мБ рассола отведи в отдельный бак.',78)
      })
    event.create(['gtceu:gregsingularity_mv_impregnated_insulation','gtceu:mv_chemical_reactor'])
      .scene('gtibd_mv_dielectric','Масло для электрической изоляции',scene => {
        scene.showBasePlate()
        block(scene,[1,1,1],'gtceu:steel_drum')
        block(scene,[1,1,3],'gtceu:steel_drum')
        step(scene,[1.5,1.7,2],'Отложи 200 мБ смазки с тяжёлой фракции и 400 мБ лёгкого топлива после гидроочистки. На цикл нужен один парафиновый осадок.',75)
        block(scene,[2,1,2],Block.id('gtceu:mv_chemical_reactor').with('facing','south'))
        input(scene,[2.5,2.1,2.5],'gtceu:gregsingularity_paraffin_cake')
        sound(scene,'mill')
        step(scene,[2.5,1.6,2.5],'Разведи жидкости по двум входным бакам реактора MV. За 25 секунд в выходном баке накопится 500 мБ электроизоляционного масла.',73)
        block(scene,[4,1,2],'pneumaticcraft:thermopneumatic_processing_plant')
        input(scene,[4.5,2.1,2.5],'gtceu:gregsingularity_pressed_insulation')
        sound(scene,'ram')
        step(scene,[4.5,1.6,2.5],'На один пакет нужны 250 мБ масла и полоса прессованной изоляции. Держи 4 бар и не ниже 333 К. Сохрани пакет для корпуса ME или оболочки HV.',85)
      })
    event.create(['ae2:pattern_provider','ae2:fluid_storage_cell_1k'])
      .scene('gtibd_mv_fluid_order','Первый заказ жидкости в ME',scene => {
        scene.showBasePlate()
        block(scene,[0,1,2],'ae2:drive')
        block(scene,[1,1,2],'ae2:1k_crafting_storage')
        step(scene,[.8,1.7,2.5],'В привод поставь предметную и жидкостную ячейки. Рядом подключи вычислительное хранилище 1k. Для первого заказа достаточно сети MV.',78)
        block(scene,[2,1,2],'ae2:pattern_provider')
        block(scene,[3,1,2],'pneumaticcraft:thermopneumatic_processing_plant')
        input(scene,[2.5,2,2.5],'ae2:processing_pattern')
        step(scene,[2.5,1.6,2.5],'В терминале кодирования выбери обработку. Укажи 800 мБ обессоленной нефти и чистый патрон на входе, 750 мБ промытой нефти и насыщенный патрон на выходе.',97)
        input(scene,[3.5,2.2,2.5],'ae2:import_bus')
        sound(scene,'wash')
        step(scene,[3.5,1.6,2.5],'Поставщик подаёт оба входа в установку. Подключи шину импорта к выходу. Процессор завершит заказ после возврата результатов в ME.',85)
      })
    event.create(['gtceu:hv_machine_casing','gtceu:hv_machine_hull'])
      .scene('gtibd_mv_to_hv','Оболочка и корпус HV',scene => {
        scene.showBasePlate()
        block(scene,[1,1,2],Block.id('gtceu:mv_assembler').with('facing','south'))
        input(scene,[1.5,2.1,2.5],'gtceu:gregsingularity_mv_impregnated_insulation')
        sound(scene,'ram')
        step(scene,[1.5,1.6,2.5],'На оболочку HV заложи пакет промасленной изоляции, нержавеющие листы и дугозащиту. Сборщик MV расходует 500 мБ смазки.',75)
        block(scene,[3,1,2],'gtceu:steel_drum')
        input(scene,[1.5,2.1,2.5],'gtceu:hv_machine_casing')
        step(scene,[1.5,1.7,2.5],'Для корпуса смени жидкость на 650 мБ электроизоляционного масла. Заложи в оболочку два пакета, кабели, контакты и принятый ящик огнеупоров по JEI.',84)
        const hull = scene.world.createItemEntity([1.5,2.3,2.8],[.10,.06,0],Item.of('gtceu:hv_machine_hull'))
        sound(scene,'strike')
        scene.idle(12)
        scene.world.removeEntity(hull)
        block(scene,[2,1,3],'gtceu:hv_machine_hull')
        step(scene,[2.5,1.6,3.5],'Для генератора и сборщика HV нужны отдельные корпуса. Заправь первый генератор дизелем. Подключи к нему кабель своего напряжения.',72)
      })
  })
}
