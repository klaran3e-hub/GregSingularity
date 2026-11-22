;(function () {
  if (typeof Ponder === 'undefined') return
  const label = [2.5,2.1,2.5]
  function sound(scene, family) {
    scene['addInstruction(java.util.function.Consumer)'](playing => {
      var ui = Client.screen
      if (!ui || typeof ui.getActiveScene !== 'function' || !playing.equals(ui.getActiveScene()) || !Client.player) return
      var events = Java.loadClass('net.minecraftforge.registries.ForgeRegistries').SOUND_EVENTS
      var Id = Java.loadClass('net.minecraft.resources.ResourceLocation')
      Client.player.playSound(events.getValue(new Id('kubejs', 'fieldwork.' + family)), 0.45, 1)
    })
  }
  function showBlock(scene,pos,block) {
    scene.world.setBlock(pos,block,false)
    scene.world.showSection(pos,Facing.DOWN)
  }
  function instruction(scene,ticks,text,pos) {
    scene.text(ticks,text,pos||label).attachKeyFrame()
    scene.idle(ticks+8)
  }
  function pass(scene,inputs,output,text,at) {
    const p=at||label
    const inputsOnTable=inputs.map((item,i)=>({
      display:scene.world.createItemEntity([p[0]-.8+i*.46,p[1]+.13,p[2]],[.025,.08,0],Item.of(item)),
      reusable:/^gtceu:flint_(knife|hammer|mortar)$/.test(item) || ['ingot_mould', 'bronze_mould_frame', 'forging_saddle'].some(name => global.gsItemId(name) === item)
    }))
    scene.idle(20)
    inputsOnTable.filter(entry=>!entry.reusable).forEach(entry=>scene.world.removeEntity(entry.display))
    var family = /washed|retted|dough/.test(output) ? 'wash' : /ingot|roasted|biscuit|bread/.test(output) ? 'fire' : /flint|lapped/.test(output) ? 'knap' : /flour|chamotte/.test(output) ? 'mill' : /fibre|bundle/.test(output) ? 'lash' : /plate|bank|register/.test(output) ? 'strike' : 'cut'
    sound(scene, family)
    const result=scene.world.createItemEntity(p,[.025,.095,0],Item.of(output))
    instruction(scene,62,text,p)
    scene.world.removeEntity(result)
    inputsOnTable.filter(entry=>entry.reusable).forEach(entry=>scene.world.removeEntity(entry.display))
  }
  function demo(block,steps) {
    return scene=>{
      scene.showBasePlate()
      showBlock(scene,[2,1,2],block)
      steps.forEach(step=>{
        if(step[3])showBlock(scene,[2,1,2],step[3])
        pass(scene,step[0],step[1],step[2])
      })
    }
  }
  function washing(scene){
    scene.showBasePlate()
    showBlock(scene,[2,1,2],'gtceu:gregsingularity_ore_washing_trough')
    instruction(scene,62,'У сухого жёлоба руда останется в руке.')
    showBlock(scene,[1,1,2],'minecraft:water')
    scene.showControls(65,label,PonderPointing.DOWN).rightClick().whileSneaking().withItem('gtceu:gregsingularity_copper_grit')
    const feed=scene.world.createItemEntity([1.9,2.1,2.5],[.09,.05,0],Item.of('gtceu:gregsingularity_copper_grit'))
    scene.idle(16);scene.world.removeEntity(feed)
    sound(scene,'wash')
    const concentrate=scene.world.createItemEntity([2.2,2.1,2.3],[-.035,.09,0],Item.of('gtceu:gregsingularity_washed_copper_grit'))
    const tailings=scene.world.createItemEntity([2.8,2.1,2.7],[.035,.09,0],Item.of('gtceu:gregsingularity_ore_tailings'))
    instruction(scene,96,'Крупка даёт концентрат и хвосты одновременно. Shift + ПКМ промывает до восьми порций.',label)
    scene.world.removeEntity(concentrate);scene.world.removeEntity(tailings)
  }
  function bloomery(scene) {
    const tiles={C:'minecraft:cobblestone',M:'gtceu:gregsingularity_bloomery_masonry',S:'gtceu:gregsingularity_bloomery_shoulder',R:'gtceu:gregsingularity_bloomery_stack',A:'gtceu:gregsingularity_bloomery_casting_basin',K:'gtceu:field_bloomery'}
    const layers=[['CCC','MMM',' M ','   ','   '],['CCC','M M','M M',' S ',' R '],['CCC','MKM',' M ','   ','   '],['CCC',' A ','   ','   ','   ']]
    scene.showBasePlate()
    scene.scaleSceneView(0.78)
    for(var y=0;y<5;y++){
      layers.forEach((rows,z)=>{
        rows[y].split('').forEach((key,x)=>{
          if(key!==' ')showBlock(scene,[x+1,y+1,3-z],key==='K'?Block.id(tiles.K).with('facing','north'):tiles[key])
        })
        if(rows[y].trim()){ sound(scene,'ram'); scene.idle(5) }
      })
      if(y===0)instruction(scene,62,'Сложи сплошное основание из двенадцати блоков булыжника.',[2.5,1.1,2])
      if(y===1){
        scene.showControls(72,[2.5,2.4,1],PonderPointing.DOWN).withItem('gtceu:field_bloomery')
        instruction(scene,94,'Разверни топочное окно к чаше. За контроллером оставь воздух.',[2.5,2.5,1.1])
      }
      if(y===2)instruction(scene,68,'Следующие четыре блока кладки обступают пустую камеру с четырёх сторон.',[2.5,3.2,2.5])
      if(y===4)instruction(scene,60,'Над камерой поставь переход шахты и венец. Щёлкни правой кнопкой по топочному окну собранного горна.',[2.5,5,2.5])
    }
    fireAndPour(scene)
  }
  function fireAndPour(scene) {
    const particles = Java.loadClass('net.minecraft.core.particles.ParticleTypes')
    const Dust = Java.loadClass('net.minecraft.core.particles.DustParticleOptions')
    const Vec = Java.loadClass('org.joml.Vector3f')
    const bronze = new Dust(new Vec(1.0, 0.43, 0.12), 0.65)
    const mouth = [2.5, 2.45, 0.98]
    const basin = [2.5, 2.42, 0.52]
    const emit = (pos, particle, motion, rate, ticks) =>
      scene.effects.emitParticles(pos, scene.effects.simpleParticleEmitter(particle, motion), rate, ticks)
    const token = (pos, item) => scene.world.createItemEntity(pos, [0, 0.065, 0], Item.of(item))
    const clear = tokens => tokens.forEach(t => scene.world.removeEntity(t))

    scene.showControls(62, mouth, PonderPointing.DOWN).rightClick().withItem('gtceu:gregsingularity_bronze_charge')
    const raw = [token([2.16, 2.8, 0.8], 'gtceu:gregsingularity_bronze_charge'), token([2.83, 2.8, 0.8], 'minecraft:charcoal'), token([3.1, 2.8, 0.8], 'gtceu:gregsingularity_ingot_mould')]
    instruction(scene, 60, 'Загрузи тигель с шихтой, один уголь и изложницу в три входных слота. Прокаливание длится 10 секунд.', mouth)
    clear(raw)
    sound(scene, 'fire')
    emit([2.5, 6.02, 2.5], particles.SMOKE, [0, 0.055, 0], 0.35, 54)
    emit(mouth, particles.SMALL_FLAME, [0, 0.025, 0], 0.3, 36)
    const roasted = token([2.5, 2.58, 0.7], 'gtceu:gregsingularity_roasted_alloy_feed')
    instruction(scene, 62, 'Забери тигель с прокалённой шихтой из третьего выхода. Переложи её обратно во вход.', mouth)
    clear([roasted])

    scene.showControls(64, mouth, PonderPointing.DOWN).withItem('gtceu:gregsingularity_ingot_mould')
    const mould = token([3.00, 2.7, 0.60], 'gtceu:gregsingularity_ingot_mould')
    const fuel = token([2.16, 2.7, 0.82], '2x minecraft:charcoal')
    instruction(scene, 64, 'Оставь изложницу на месте и добавь два угля. Плавка займёт 18 секунд.', mouth)
    clear([fuel])
    sound(scene, 'fire')
    emit(mouth, particles.SMALL_FLAME, [0, 0.025, 0], 0.35, 30)
    emit([2.5, 6.02, 2.5], particles.SMOKE, [0, 0.055, 0], 0.28, 32)
    for (const z of [0.93, 0.78, 0.63]) {
      emit([2.5, 2.3, z], bronze, [0, -0.016, -0.04], 1, 18)
      scene.idle(4)
    }
    const ingot = token(basin, 'gtceu:bronze_ingot')
    const crucible = token([2.87, 2.43, 0.62], 'gtceu:gregsingularity_fired_crucible')
    instruction(scene, 69, 'Забери бронзовый слиток и пустой тигель из отдельных выходов. Изложница остаётся в горне.', basin)
    clear([mould, ingot, crucible])
  }
  Ponder.registry(event=>{
    const section=(items,id,title,callback)=>event.create(items).scene('gtibd_field_'+id,title,callback)
    section(['minecraft:flint','gtceu:gregsingularity_flint_shard','gtceu:gregsingularity_scored_flint_core','gtceu:gregsingularity_lapped_edge','gtceu:flint_knife'],'flint','Первый нож',demo('minecraft:gravel',[
      [['2x minecraft:flint','minecraft:gravel'],'gtceu:gregsingularity_scored_flint_core','Надсеки два кремня гравием. Ещё одним ударом по ядрищу сними скол и притри кромку песком и промытым волокном.'],
      [['gtceu:gregsingularity_lapped_edge','gtceu:gregsingularity_fibre_cord','minecraft:stick','gtceu:gregsingularity_washed_fibre'],'gtceu:flint_knife','Уложи кромку и шнур над палкой и промытым волокном в сетке 2×2.']]))
    section(['gtceu:gregsingularity_plant_fibre','gtceu:gregsingularity_retting_bundle','gtceu:gregsingularity_retted_bundle','gtceu:gregsingularity_washed_fibre','gtceu:gregsingularity_fibre_cord'],'fibre','От стебля до шнура',demo('minecraft:water',[
      [['2x gtceu:gregsingularity_plant_fibre'],'gtceu:gregsingularity_retting_bundle','Свяжи два стебля. Нажми связкой по воде, чтобы размочить волокна.'],
      [['gtceu:gregsingularity_retted_bundle','minecraft:gravel'],'2x gtceu:gregsingularity_washed_fibre','Разотри мокрую связку гравием. Четырёх промытых волокон хватит на один шнур.']]))
    section(['gtceu:gregsingularity_rough_slat','gtceu:gregsingularity_wooden_peg','gtceu:gregsingularity_haft_blank','gtceu:gregsingularity_wedged_tenon','minecraft:crafting_table'],'bench','Верстак в карманной сетке',demo('minecraft:oak_log',[
      [['minecraft:stick','gtceu:flint_knife'],'2x gtceu:gregsingularity_wooden_peg','Из палки вырежи два колышка. Три палки под ножом дают щепную планку.'],
      [['gtceu:gregsingularity_workbench_top','gtceu:gregsingularity_wedged_tenon','gtceu:gregsingularity_workbench_frame','gtceu:gregsingularity_tool_binding'],'minecraft:crafting_table','Собери раму, настил, столярный шип и обвязку. Соедини их в сетке 2×2.']]))
    section(['gtceu:gregsingularity_clay_slip_cake','gtceu:gregsingularity_kiln_biscuit','gtceu:gregsingularity_chamotte','gtceu:gregsingularity_ramming_mix','gtceu:gregsingularity_fired_tuyere','gtceu:gregsingularity_ingot_mould'],'ceramics','Глина и шамот',demo('minecraft:campfire',[
      [['gtceu:gregsingularity_clay_slip_cake'],'gtceu:gregsingularity_kiln_biscuit','Промой комок глины в воде и положи лепёшку на костёр.'],
      [['gtceu:gregsingularity_kiln_biscuit','gtceu:flint_hammer'],'2x gtceu:gregsingularity_chamotte','Раздроби обожжённый черепок. Из набивной массы слепи фурму и изложницу, затем обожги их в печи.']]))
    section(['gtceu:gregsingularity_ore_washing_trough','gtceu:gregsingularity_ore_tailings','gtceu:gregsingularity_copper_grit','gtceu:gregsingularity_tin_grit','gtceu:gregsingularity_iron_grit','gtceu:gregsingularity_gold_grit'],'wash','Руда и течение воды',washing)
    section(['gtceu:field_bloomery','gtceu:gregsingularity_bloomery_masonry','gtceu:gregsingularity_bloomery_shoulder','gtceu:gregsingularity_bloomery_stack','gtceu:gregsingularity_bloomery_casting_basin','gtceu:gregsingularity_hearth_bellows','gtceu:gregsingularity_bronze_charge'],'shaft','Кладка полевого горна',bloomery)
    section(['gtceu:gregsingularity_roasted_alloy_feed','gtceu:gregsingularity_bronze_mould_frame'],'cast','Второй способ литья',demo('gtceu:field_bloomery',[
      [['gtceu:gregsingularity_bronze_charge','minecraft:charcoal','gtceu:gregsingularity_ingot_mould'],'gtceu:gregsingularity_roasted_alloy_feed','Прокали шихту отдельным циклом. Для второй операции выбери обычную или усиленную изложницу.'],
      [['gtceu:gregsingularity_roasted_alloy_feed','gtceu:gregsingularity_bronze_mould_frame','3x minecraft:charcoal'],'2x gtceu:bronze_ingot','Три угля и парная изложница дают два слитка из одной прокалённой шихты.']]))
    section(['gtceu:gregsingularity_forging_saddle','gtceu:gregsingularity_stamped_bronze_blank','gtceu:lp_steam_forge_hammer'],'plate','Ковка вручную и под паром',demo('minecraft:crafting_table',[
      [['2x gtceu:bronze_ingot','gtceu:flint_hammer','gtceu:gregsingularity_forging_saddle'],'gtceu:bronze_plate','На подкладке два слитка дают одну пластину. Молот изнашивается, подкладка остаётся.'],
      [['gtceu:bronze_ingot'],'gtceu:bronze_plate','Подведи пар к паровому молоту. Загрузи один слиток и забери одну пластину.','gtceu:lp_steam_forge_hammer']]))
    section(['gtceu:gregsingularity_turned_spindle','gtceu:gregsingularity_grinding_runner','gtceu:gregsingularity_hand_pump_barrel','gtceu:gregsingularity_five_tube_register','gtceu:gregsingularity_boiler_tube_bank','gtceu:lp_steam_solid_boiler'],'boiler','Сборка теплообменника',demo('minecraft:crafting_table',[
      [['5x gtceu:bronze_small_fluid_pipe','2x gtceu:gregsingularity_copper_strap','2x gtceu:gregsingularity_iron_rivet'],'gtceu:gregsingularity_five_tube_register','Закрепи пять малых труб полосами меди и заклёпками.'],
      [['2x gtceu:gregsingularity_five_tube_register','4x gtceu:gregsingularity_stamped_bronze_blank','2x gtceu:gregsingularity_iron_rivet','gtceu:gregsingularity_sealed_boiler_joint'],'gtceu:gregsingularity_boiler_tube_bank','Два регистра образуют один пакет. На котёл нужны два готовых трубных пакета, двадцать малых труб и клапан с набивкой в общей сложности.']]))
    section(['gtceu:gregsingularity_coarse_flour','gtceu:gregsingularity_camp_dough'],'food','Хлеб на костре',demo('minecraft:campfire',[
      [['3x minecraft:wheat','gtceu:flint_mortar'],'2x gtceu:gregsingularity_coarse_flour','Разотри три пшеницы в ступке. Получишь две порции муки.'],
      [['gtceu:gregsingularity_coarse_flour'],'gtceu:gregsingularity_camp_dough','Нажми мукой по воде, чтобы замесить тесто. Удерживай Shift для четырёх порций.','minecraft:water'],
      [['gtceu:gregsingularity_camp_dough'],'minecraft:bread','Положи тесто на свободное место у костра и забери готовую буханку.','minecraft:campfire']]))
    event.create(['gtceu:lp_steam_forge_hammer','gtceu:lp_steam_compressor','gtceu:gregsingularity_packed_steam_valve']).scene('gtibd_valve_tooling','Золотники и набивка на пару',steamTooling)
    event.create(['gtceu:lv_machine_hull', 'gtceu:gregsingularity_lv_terminal_block']).scene('gtibd_lv_terminals', 'От клеммника до первой сети', lvTerminals)
    event.create(['gtceu:lv_extractor', 'gtceu:lv_assembler', 'gtceu:gregsingularity_tin_solder_preform']).scene('gtibd_lv_solder_line', 'Олово для серийной пайки', lvSolder)
    event.create(['gtceu:lv_circuit_assembler', 'gtceu:gregsingularity_lv_contact_bridge', 'gtceu:gregsingularity_lv_line_contactor']).scene('gtibd_lv_contactor', 'Как собрать силовой контактор', lvContactor)
    event.create(['gtceu:lv_forming_press','gtceu:gregsingularity_iron_pressure_slug']).scene('gtibd_forming_press','Серийная формовка в GregTech',formingPress)
    event.create(['gtceu:coke_oven','gtceu:primitive_blast_furnace','gtceu:gregsingularity_steel_furnace_charge']).scene('gtibd_first_steel','Кокс и первая сталь',firstSteel)
  })
  function lvTerminals(scene) {
    const bench = [1,1,2], end = [3.5,1.8,2.5]
    scene.showBasePlate()
    showBlock(scene,bench,'minecraft:crafting_table')
    scene.showControls(60,[1.5,2.25,2.5],PonderPointing.DOWN).withItem('gtceu:gregsingularity_lv_terminal_block')
    sound(scene,'strike')
    instruction(scene,70,'Приклепай две медные полосы к футеровке и подложи изоляцию. Для корпуса собери два клеммника.',[1.5,1.9,2.5])
    showBlock(scene,[3,1,2],Block.id('gtceu:lv_machine_hull').with('facing','south'))
    scene.showControls(65,end,PonderPointing.DOWN).withItem('gtceu:tin_single_cable')
    instruction(scene,70,'На верстаке поставь клеммники над и под оболочкой. Кабели ложатся по бокам, бронзовые заготовки по углам.',end)
    scene.world.hideSection(bench,Facing.UP)
    scene.idle(18)
    showBlock(scene,bench,Block.id('gtceu:lv_steam_turbine').with('facing','east'))
    showBlock(scene,[2,1,2],'gtceu:tin_single_cable')
    scene.world.modifyBlockEntityNBT([2,1,2], nbt=>nbt.putInt('connections',48))
    showBlock(scene,[3,1,2],Block.id('gtceu:lv_assembler').with('facing','south'))
    scene.showControls(60,[1.5,2.2,2.5],PonderPointing.DOWN).withItem('gtceu:bronze_small_fluid_pipe')
    instruction(scene,85,'Подай пар сбоку. Передняя грань турбины выдаёт 32 вольта. Разверни её к оловянному кабелю и поставь сборщик у другого конца.',[2.5,1.6,2.6])
  }

  function lvSolder(scene) {
    scene.showBasePlate()
    showBlock(scene,[1,1,2],Block.id('gtceu:lv_extractor').with('facing','south'))
    scene.showControls(60,[1.5,2.15,2.5],PonderPointing.DOWN).withItem('gtceu:gregsingularity_tin_solder_preform')
    sound(scene,'fire')
    instruction(scene,72,'Электрический экстрактор плавит заготовку припоя за 5 секунд. Каждая даёт 72 мБ олова. Проведи два цикла.',[1.5,1.6,2.5])
    showBlock(scene,[2,1,2],'gtceu:steel_small_fluid_pipe')
    scene.world.modifyBlockEntityNBT([2,1,2],nbt=>nbt.putInt('connections',48))
    showBlock(scene,[3,1,2],Block.id('gtceu:lv_assembler').with('facing','south'))
    instruction(scene,83,'Подключи жидкостный выход экстрактора стальной трубой ко входу сборщика. Включи автоэкспорт жидкости и проверь, что в приёмнике 144 мБ олова.',[2.5,1.7,2.5])
    scene.showControls(65,[3.5,2.1,2.5],PonderPointing.DOWN).withItem('gtceu:resin_printed_circuit_board')
    instruction(scene,72,'Загрузи две платы с лампами, резисторами, проводами, контактами и изоляцией. Через 20 секунд забери две схемы.',[3.5,1.6,2.5])
    showBlock(scene,[3,1,2],Block.id('gtceu:lv_circuit_assembler').with('facing','south'))
    scene.showControls(65,[3.5,2.15,2.5],PonderPointing.DOWN).withItem('gtceu:basic_electronic_circuit')
    instruction(scene,72,'Монтажный станок расходует те же 144 мБ на четыре схемы. Ему нужны четыре платы и тонкая медная проволока.',[3.5,1.6,2.5])
  }

  function lvContactor(scene) {
    scene.showBasePlate()
    const end = [2.5,1.7,3.5]
    showBlock(scene,[1,1,1],Block.id('gtceu:lv_wiremill').with('facing','south'))
    scene.showControls(65,[1.5,2.1,1.5],PonderPointing.DOWN).withItem('gtceu:copper_foil')
    sound(scene,'mill')
    instruction(scene,64,'Протяни медную фольгу в волочильном станке. На катушку контактора нужны четыре тонкие проволоки.',[1.5,1.7,1.5])
    showBlock(scene,[3,1,1],Block.id('gtceu:lv_bender').with('facing','south'))
    scene.showControls(65,[3.5,2.1,1.5],PonderPointing.DOWN).withItem('gtceu:gregsingularity_lv_contact_bridge')
    sound(scene,'strike')
    instruction(scene,64,'Две медные контактные полосы в гибочном станке дают один мостик. Он замкнёт пару клемм в силовой цепи.',[3.5,1.7,1.5])
    showBlock(scene,[2,1,3],Block.id('gtceu:lv_circuit_assembler').with('facing','south'))
    scene.showControls(75,end,PonderPointing.DOWN).withItem('gtceu:gregsingularity_lv_line_contactor')
    instruction(scene,86,'На монтажном станке соедини мостик, два клеммника, обмотку, якорь, схему LV и изоляцию. Добавь 144 мБ олова. Через 18 секунд контактор готов.',end)
    showBlock(scene,[4,1,3],Block.id('gtceu:lv_energy_input_hatch').with('facing','south'))
    instruction(scene,70,'Первый контактор ставится в энерговвод электродомны. Следующий понадобится для оболочки MV.',[4.5,1.6,3.5])
  }

  function steamTooling(scene) {
    const hammer = [1,1,2], compressor = [3,1,2]
    scene.showBasePlate()
    showBlock(scene,hammer,Block.id('gtceu:lp_steam_forge_hammer').with('facing','south'))
    showBlock(scene,compressor,Block.id('gtceu:lp_steam_compressor').with('facing','south'))
    scene.idle(15)
    instruction(scene,67,'Первый клапан собери на верстаке. Когда заработает котёл, паровой молот и компрессор ускорят следующие партии.',[2.5,1.6,2.5])
    pass(scene,['gtceu:gregsingularity_valve_spindle_blank'],'2x gtceu:gregsingularity_bronze_valve_spindle',
      'Молот выдаёт два золотника из одной заготовки. Вручную из той же заготовки получается один.',[1.5,1.8,3.2])
    pass(scene,['2x gtceu:gregsingularity_tool_binding'],'4x gtceu:gregsingularity_braided_valve_packing',
      'Две инструментальные обвязки в компрессоре дают четыре кольца набивки.',[3.5,1.8,3.2])
    scene.showControls(50,[2.5,2.4,3.2],PonderPointing.DOWN).withItem('gtceu:flint_hammer')
    pass(scene,['gtceu:gregsingularity_unseated_steam_valve','gtceu:gregsingularity_braided_valve_packing'],'gtceu:gregsingularity_packed_steam_valve',
      'Поставь кольцо в корпус и закрой крышку молотом GregTech. Готовый клапан подходит к котлу и паровым станкам.',[2.5,1.6,3.3])
  }
  function formingPress(scene) {
    scene.showBasePlate()
    showBlock(scene,[2,1,2],Block.id('gtceu:lv_forming_press').with('facing','south'))
    showBlock(scene,[1,1,2],'gtceu:lv_machine_hull')
    const die = scene.world.createItemEntity([1.85,1.9,3.25],[0,.025,0],Item.of('gtceu:plate_casting_mold'))
    instruction(scene,70,'Подай EU на формовочный пресс LV. Поставь пластинчатую матрицу во второй входной слот.',[2.5,1.5,2.8])
    for(let i=0;i<2;i++){
      const input=scene.world.createItemEntity([2.6,1.8,3.2],[0,.05,0],Item.of('gtceu:gregsingularity_iron_pressure_slug'))
      scene.idle(18)
      sound(scene,'strike')
      scene.world.removeEntity(input)
      const product=scene.world.createItemEntity([3.05,1.8,3.2],[0,.08,0],Item.of('pneumaticcraft:ingot_iron_compressed',2))
      instruction(scene,55,i===0?'Загрузи железную заготовку. За 12 секунд получишь два слитка прессованного железа.':'Подай следующую заготовку и забери ещё два слитка. Матрица остаётся во входном слоте.',[2.8,1.8,3.2])
      scene.world.removeEntity(product)
    }
    scene.world.removeEntity(die)
  }
  function firstSteel(scene) {
    const front = [2.5, 2.5, 3.95]
    const furnace = [1, 1, 1, 3, 4, 3]
    function course(y, brick, controller) {
      for (let z = 1; z <= 3; z++) {
        for (let x = 1; x <= 3; x++) {
          if (y > 1 && x === 2 && z === 2 && (controller === 'gtceu:primitive_blast_furnace' || y === 2)) continue
          const block = x === 2 && z === 3 && y === 2 ? Block.id(controller).with('facing', 'south') : brick
          scene.world.setBlock([x,y,z], block, false)
        }
      }
      scene.world.showSection([1,y,1,3,y,3], Facing.DOWN)
      sound(scene,'strike')
      scene.idle(12)
    }
    scene.showBasePlate()
    scene.scaleSceneView(0.8)
    course(1,'gtceu:coke_oven_bricks','gtceu:coke_oven')
    course(2,'gtceu:coke_oven_bricks','gtceu:coke_oven')
    instruction(scene,65,'Поставь контроллер в центре передней стенки. Клетка за ним остаётся пустой.',front)
    course(3,'gtceu:coke_oven_bricks','gtceu:coke_oven')
    scene.showControls(45,front,PonderPointing.DOWN).rightClick().withItem('gtceu:gregsingularity_coking_charge')
    sound(scene,'fire')
    instruction(scene,75,'Закрой камеру верхним слоем. За две минуты из шихты выйдут два кокса и 750 мБ креозота.',front)
    scene.world.hideSection(furnace,Facing.UP)
    scene.idle(20)
    scene.world.setBlocks(furnace,'minecraft:air',false)
    for(let y=1;y<=3;y++)course(y,'gtceu:firebricks','gtceu:primitive_blast_furnace')
    instruction(scene,65,'Домна выше коксовой печи. Над центром основания оставь шахту по всей высоте.',[2.5,3.5,2.5])
    course(4,'gtceu:firebricks','gtceu:primitive_blast_furnace')
    scene.showControls(50,front,PonderPointing.DOWN).withItem('gtceu:gregsingularity_steel_furnace_charge')
    instruction(scene,63,'Загрузи стальную шихту и два куска кокса. Домна работает без электричества.',front)
    sound(scene,'fire')
    const billet=scene.world.createItemEntity([2.5,1.8,4.1],[0,.08,0],Item.of('gtceu:steel_ingot'))
    const ashes=scene.world.createItemEntity([3.0,1.8,4.1],[0,.06,0],Item.of('gtceu:dark_ash_dust'))
    instruction(scene,70,'Через 110 секунд забери сталь и тёмную золу. Первые две пластины для турбины прокатай на паровом молоте.',[2.5,1.8,4.1])
    scene.world.removeEntity(billet)
    scene.world.removeEntity(ashes)
  }

})()
