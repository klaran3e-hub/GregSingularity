if (typeof Ponder !== 'undefined') Ponder.registry(event => {
  const gt = id => 'gtceu:' + id
  const k = id => 'kubejs:zpm_' + id
  const blue = [0.37,0.74,0.78], grey = [0.55,0.55,0.36], orange = [0.98,0.45,0.20]
  function place(scene, pos, state) {
    scene.world.setBlock(pos, state, false)
    scene.world.showSection(pos, Facing.DOWN)
  }
  function stream(scene, from, motion, tint) {
    const Dust = Java.loadClass('net.minecraft.core.particles.DustParticleOptions')
    const V = Java.loadClass('org.joml.Vector3f')
    const particle = new Dust(new V(tint[0], tint[1], tint[2]), 0.60)
    scene.effects.emitParticles(from, scene.effects.simpleParticleEmitter(particle, motion), 0.42, 48)
  }
  function sound(scene, name) {
    scene['addInstruction(java.util.function.Consumer)'](playing => {
      const ui = Client.screen
      if (!Client.player || !ui || typeof ui.getActiveScene !== 'function' || !playing.equals(ui.getActiveScene())) return
      const Id = Java.loadClass('net.minecraft.resources.ResourceLocation')
      const sounds = Java.loadClass('net.minecraftforge.registries.ForgeRegistries').SOUND_EVENTS
      const effect = sounds.getValue(new Id('kubejs','fieldwork.' + name))
      if (effect) Client.player.playSound(effect, 0.38, 1)
    })
  }
  function explain(scene, at, text, item, effect) {
    if (item) scene.showControls(62, at, PonderPointing.DOWN).withItem(item)
    if (effect) sound(scene, effect)
    scene.text(100, text, at).placeNearTarget().attachKeyFrame()
    scene.idle(108)
  }
  function station(scene, x, id) {
    place(scene, [x,1,2], gt(id))
    return [x + 0.5, 2.0, 2.5]
  }
  event.create([k('die_cartridge'),k('storage_backplane'),gt('zpm_quantum_tank')])
    .scene('gtibd_zpm_cartridges','Оснастка станков и квантовых баков', scene => {
      scene.showBasePlate()
      const fixture = station(scene,0,'luv_assembler')
      explain(scene,fixture,'Каждое кузнечное седло упакуй с двумя листами сплава наквады и нейтронным ламинатом. Добавь 500 мБ смазки. Две готовые кассеты помещаются в один слот сборщика.',k('die_cartridge'),'ram')
      const tools = station(scene,1,'zpm_cutter')
      explain(scene,tools,'На отрезной станок, пресс и другие механические станки ZPM и UV подавай кассеты парами.',k('die_cartridge'),'mill')
      const circuit = station(scene,3,'zpm_circuit_assembler')
      explain(scene,circuit,'Два компонента памяти 256k, два пустых корпуса разных типов и фазовый модуль дают две платы. Подведи 576 мБ припоя.',k('storage_backplane'),'wash')
      const tank = station(scene,4,'zpm_quantum_tank')
      explain(scene,tank,'Для квантового бака ZPM собери четыре платы, четыре мембраны Европы и две пластинки Гласио. Добавь их к насосам и шинам хранения.',k('europa_membrane'),'ram')
    })
  event.create([k('europa_membrane'),k('glacio_lamella'),'kubejs:europa_rift_core'])
    .scene('gtibd_zpm_brine','Рассол для двух космопортов', scene => {
      scene.showBasePlate()
      const refinery = station(scene,0,'zpm_chemical_reactor')
      stream(scene,[0.5,1.8,1.1],[0,0,0.07],blue)
      explain(scene,refinery,'На Церере загрузи два концентрата и сапфировую пыль. Подай литр дистиллята и 250 мБ оптического теплоносителя. Отведи литр рассола и нагретую жидкость раздельно.','kubejs:luv_ceres_salt_concentrate','wash')
      const cutter = station(scene,2,'zpm_cutter')
      stream(scene,[1,1.8,2.5],[0.08,0,0],blue)
      explain(scene,cutter,'На Гласио закажи две пластинки. Отрезной станок расходует кристалл и пол-литра чистого рассола.',k('glacio_lamella'),'mill')
      const bath = station(scene,4,'zpm_chemical_bath')
      stream(scene,[4.5,1.7,1.2],[0,0,0.06],blue)
      explain(scene,bath,'На Европе промой прокалённый концентрат в 500 мБ рассола. В ME должны вернуться две мембраны и 500 мБ отработанного рассола.',k('europa_membrane'),'wash')
      stream(scene,[3.9,1.8,2.5],[-0.10,0,0],grey)
      explain(scene,refinery,'Вези обратку на Цереру. Добавь один солевой концентрат и 500 мБ дистиллята. Реактор заполнит литровый бак чистым рассолом.','kubejs:luv_ceres_salt_concentrate','wash')
    })
  event.create([k('preload_frame'),k('tempered_frame')])
    .scene('gtibd_zpm_frame','Испытание парных рам', scene => {
      scene.showBasePlate()
      const press = station(scene,0,'zpm_forming_press')
      explain(scene,press,'Штампуй две рамы из двух нейтронных ламинатов, четырёх листов сплава наквады и силовой шины.',k('preload_frame'),'ram')
      const chamber = station(scene,2,'vacuum_freezer')
      place(scene,[1,1,1],gt('zpm_input_hatch'));place(scene,[3,1,1],gt('zpm_input_hatch'))
      stream(scene,[1.6,1.8,1.7],[0.05,0,0.04],orange)
      stream(scene,[3.3,1.8,1.7],[-0.05,0,0.04],blue)
      explain(scene,chamber,'Обе рамы идут в одну партию. Раздели 360 мБ плазмы америция и 1000 мБ оптического теплоносителя по двум входным люкам.',k('preload_frame'),'wash')
      const output = [3.5,2,3.5]
      place(scene,[3,1,3],gt('zpm_output_hatch'))
      stream(scene,[2.6,1.7,2.9],[0.05,0,0.045],grey)
      explain(scene,output,'Импортируй две испытанные рамы и литр тёплого теплоносителя. Оба результата должны быть указаны в шаблоне ME.',k('tempered_frame'),'ram')
      const regen = station(scene,4,'zpm_chemical_reactor')
      explain(scene,regen,'Регенерируй теплоноситель с 250 мБ гелия. Кассету с Марса оставь в станке, в шаблон её включать не нужно.','kubejs:luv_cryo_cartridge','wash')
    })
  event.create([k('europa_reticle'),k('europa_datum'),'kubejs:europa_phase_ceramic'])
    .scene('gtibd_zpm_datum','От мембраны до записанной сферы', scene => {
      scene.showBasePlate()
      const press=station(scene,0,'zpm_forming_press')
      explain(scene,press,'На Европе запрессуй мембрану, пластинку Гласио, два оливина и два листа европия. Одного цикла хватает на две керамические пластины.','kubejs:europa_phase_ceramic','ram')
      const laser=station(scene,1,'zpm_laser_engraver')
      stream(scene,[1.5,2.9,2.5],[0,-0.08,0],blue)
      explain(scene,laser,'Закрепи венерианскую призму в гравёре на Европе. Каждая керамическая пластина становится оптической сеткой.',k('europa_reticle'),'mill')
      const bench=station(scene,3,'zpm_assembler')
      explain(scene,bench,'На один узел нужны испытанная рама, сетка, две пластинки, фазовый модуль, две пробы америция и 576 мБ припоя. Закажи два таких узла.',k('europa_datum'),'ram')
      const holder=station(scene,4,'object_holder')
      explain(scene,holder,'На станции исследуй первый узел с пустой сферой. Подключи HPCA на 24 CWU/t и питание ZPM. Для линии оставь второй узел.',gt('data_orb'),'mill')
    })
  event.create([gt('uv_machine_hull'),gt('uv_machine_casing'),k('europa_datum')])
    .scene('gtibd_zpm_uv_line','Первый корпус UV на сборочной линии', scene => {
      scene.scaleSceneView(0.58)
      scene.encapsulateBounds([10,4,3])
      scene.showBasePlate()
      const input = [gt('zpm_machine_hull'),gt('uv_machine_casing'),'kubejs:uv_phase_interlock',
        'kubejs:uv_flux_shunt',gt('vanadium_gallium_single_wire'),gt('wetware_processor_assembly'),
        'kubejs:uv_structural_laminate',k('europa_datum'),k('tempered_frame')]
      for (let x=0; x<10; x++) {
        place(scene,[x,1,2],gt(x===9?'ulv_output_bus':'ulv_input_bus'))
        place(scene,[x,2,2],gt('assembly_line_unit'))
        if(x===0)place(scene,[0,3,1],gt('assembly_line'))
        scene.idle(3)
      }
      for(let x=0;x<7;x++){scene.showControls(38,[x+0.5,1.7,2.1],PonderPointing.DOWN).withItem(input[x]);scene.idle(8)}
      explain(scene,[1.5,2.1,2.4],'Первые семь шин от контроллера принимают два корпуса ZPM, оболочку UV, четыре блокировки, шесть шунтов, двенадцать проволок, шесть сборок Wetware и шесть ламинатов.',null,'ram')
      for(let x=7;x<9;x++){scene.showControls(65,[x+0.5,1.7,2.0],PonderPointing.DOWN).withItem(input[x]);scene.idle(12)}
      explain(scene,[8.5,1.9,2.2],'На восьмую шину подай опорный узел с Европы, на девятую две испытанные рамы.',k('tempered_frame'),'ram')
      for(let x=0;x<=4;x+=2){place(scene,[x,1,3],gt('zpm_input_hatch'));stream(scene,[x+0.5,1.65,4.2],[0,0,-0.08],x===2?orange:blue)}
      explain(scene,[2.5,1.8,3.4],'Назначь отдельные выходы под 5400 мБ смазки, 2304 мБ припоя и 2000 мБ рассола. Для оболочки добавь в сеть отдельный шаблон сборщика ZPM.',gt('zpm_input_hatch'),'wash')
      place(scene,[1,3,1],gt('advanced_data_access_hatch'))
      explain(scene,[1.5,3.7,1.5],'Установи записанную сферу и запусти заказ. Через 7200 тактов выходная шина выдаст корпус UV.',gt('data_orb'),'ram')
      scene.world.createItemEntity([9.5,2,2.5],[0,0.06,0],Item.of(gt('uv_machine_hull')))
      scene.idle(40)
    })
})
