if (typeof Ponder !== 'undefined') {
  Ponder.registry(event => {
    const k = id => global.gsItemId(id), gt = id => 'gtceu:'+id, ad = id => 'ad_astra:'+id
    function block(scene,x,y,z,id) {
      const pos=[x,y,z]
      scene.world.setBlock(pos,id,false)
      scene.world.showSection(pos,Facing.DOWN)
    }
    function station(scene,x,id,y,z) {
      block(scene,x,y||1,z||2,Block.id(gt(id)).with('facing','south'))
      scene.idle(10)
    }
    function step(scene,pos,caption,item,cue) {
      if(item)scene.showControls(55,pos,PonderPointing.DOWN).withItem(item)
      if(cue)scene['addInstruction(java.util.function.Consumer)'](playing=>{
        const ui=Client.screen
        if(!Client.player||!ui||typeof ui.getActiveScene!=='function'||!playing.equals(ui.getActiveScene()))return
        const sounds=Java.loadClass('net.minecraftforge.registries.ForgeRegistries').SOUND_EVENTS
        const Id=Java.loadClass('net.minecraft.resources.ResourceLocation')
        const sample=sounds.getValue(new Id('kubejs','fieldwork.'+cue))
        if(sample)Client.player.playSound(sample,0.4,1)
      })
      scene.text(84,caption,pos).placeNearTarget().attachKeyFrame()
      scene.idle(93)
    }
    function output(scene,x,y,z,id) {
      scene.world.createItemEntity([x,y,z],[0,0.03,0],Item.of(id))
    }
    function pipe(scene,x,y,z) {block(scene,x,y,z,gt('steel_small_fluid_pipe'))}
    function shell(scene) {
      // A cutaway of the first three aisles. The row behind the assembly units is shown last.
      for(let x=1;x<=3;x++){
        block(scene,x,1,1,gt('solid_machine_casing'))
        block(scene,x,1,2,gt('ulv_input_bus'))
        block(scene,x,1,3,x===2?gt('solid_machine_casing'):gt('hv_input_hatch'))
      }
      scene.idle(24)
      for(let x=1;x<=3;x++){
        block(scene,x,2,2,gt('assembly_line_unit'));block(scene,x,2,3,gt('laminated_glass'))
        block(scene,x,3,2,gt('assembly_line_casing'));block(scene,x,3,3,gt('assembly_line_grating'))
        block(scene,x,4,2,x===2?gt('iv_energy_input_hatch_4a'):gt('solid_machine_casing'))
      }
      scene.idle(20)
      block(scene,1,3,1,Block.id(gt('assembly_line')).with('facing','north'))
      block(scene,2,3,1,Block.id(gt('basic_data_access_hatch')).with('facing','north'))
    }
    event.create([k('iv_bonded_billet'),k('iv_layered_billet'),k('iv_tungstensteel_charge')])
      .scene('gtibd_iv_laminations','Пакет вольфрамовой стали',scene=>{
        scene.showBasePlate();station(scene,0,'ev_forming_press')
        step(scene,[0.5,1.8,2.5],'Форма остаётся в прессе EV. На пакет нужны два листа вольфрама и два листа стали.',gt('plate_casting_mold'),'ram')
        station(scene,1,'ev_mixer');station(scene,2,'ev_chemical_bath')
        output(scene,2.6,2.1,2.6,k('iv_bonded_billet'))
        step(scene,[2.5,1.8,2.5],'Марсианский концентрат, флюс, угольная пыль и 600 мБ дистиллята дают литр связующего. Ванна расходует 500 мБ на пакет и возвращает 250 мБ отработанного раствора.',k('iv_bonded_billet'),'wash')
        station(scene,3,'ev_mixer');step(scene,[3.5,1.8,2.5],'Пакет, две футеровки, образец HV и 450 мБ защитного газа дают две порции шихты. В домне на 3600 К каждая порция требует фильтр и 1000 мБ аргона.',k('iv_tungstensteel_charge'),'mill')
        step(scene,[3.5,2.2,2.5],'Вакуумная камера принимает горячую заготовку, картридж, 2000 мБ холодной жидкости и 350 мБ аргона. Верни картридж в промывку, обратку в охладитель.',k('ev_vacuum_getter'))
      })
    event.create([k('iv_index_fixture'),k('iv_line_datum'),gt('assembly_line')])
      .scene('gtibd_iv_alignment','Секции, шины и юстировка линии',scene=>{
        scene.showBasePlate();shell(scene)
        step(scene,[1.4,1.6,2.3],'Разрез первых трёх секций. Продли ряд до девяти предметных шин. После них поставь отдельную секцию выдачи. Боковые люки займут жидкости.',gt('ulv_input_bus'),'ram')
        step(scene,[2.4,3.6,1.3],'Просканируй эталон с флешкой. Вставь запись в люк данных. Подай юстировочное приспособление на девятую шину, 1800 мБ смазки и 1000 мБ защитного газа в люки.',k('iv_index_fixture'))
        station(scene,4,'iv_laser_engraver',1,3);output(scene,4.5,2.2,3.5,k('iv_line_datum'))
        step(scene,[4.5,2,3.5],'В гравёре оставь готовый стенд. На каждом листе вольфрамовой стали он будет размечать базу для следующей партии экранов.',k('iv_line_datum'),'mill')
      })
    event.create([k('iv_mars_refractory_grain'),k('iv_venus_panel_blank')])
      .scene('gtibd_iv_mars_cargo','Из марсианской породы в теплозащитную панель',scene=>{
        scene.showBasePlate();for(let x=0;x<5;x++)block(scene,x,1,2,ad('mars_stone'))
        station(scene,0,'iv_chemical_bath',2,2);pipe(scene,1,2,2)
        step(scene,[0.5,2.9,2.5],'Химическая ванна IV на Марсе. Прокалённый концентрат Марса и 500 мБ вольфрамового раствора дают два огнеупорных зерна. Отведи 500 мБ отработанного раствора.',k('iv_mars_refractory_grain'),'wash')
        station(scene,2,'iv_mixer',2,2)
        step(scene,[2.5,2.9,2.5],'Отдай два зерна в смеситель вместе с огнеупорной смесью, угольной пылью и 750 мБ дистиллята. Ещё одно целое зерно отправь прямо на Венеру.',k('iv_mars_refractory_grain'),'mill')
        block(scene,4,2,2,gt('assembly_line_unit'));output(scene,4.5,3.2,2.5,k('iv_venus_panel_blank'))
        step(scene,[4.5,2.9,2.5],'Загрузи на шесть шин листы, вкладыш, направляющие, дугозащиту, базовую пластину и панель. Подай 576 мБ припоя, 1000 мБ суспензии и 400 мБ газа. Забери пару заготовок.',k('iv_venus_panel_blank'),'ram')
      })
    event.create([k('venus_thermal_screen'),k('luv_tantalite_concentrate')])
      .scene('gtibd_iv_venus','Горячая посадка и венерианский цех',scene=>{
        scene.showBasePlate();for(let x=0;x<5;x++)block(scene,x,1,2,ad('venus_stone'))
        output(scene,0.5,2.2,2.5,ad('tier_3_rocket'))
        step(scene,[0.5,2.5,2.5],'На рейс нужен третий класс ракеты, криотопливо, кислород и термостойкий скафандр. В посылку положи зерно с Марса и заготовки с заводской линии.',ad('tier_3_rocket'))
        station(scene,2,'iv_assembler',2,2);output(scene,2.5,3.2,2.5,k('venus_thermal_screen'))
        step(scene,[2.5,2.8,2.5],'Венерианский сборщик IV соединяет заготовку, калорит, марсианское зерно, две плитки и канталовую обмотку с 576 мБ припоя. Получится пара экранов.',k('venus_thermal_screen'),'ram')
        block(scene,3,1,2,gt('tantalite_ore'));station(scene,4,'iv_centrifuge',2,2)
        step(scene,[4.5,2.9,2.5],'В венерианской породе ищи танталит на Y 12–58. На месте подай в центрифугу четыре дроблёных руды и 750 мБ защитного газа. Протокол IV остаётся внутри.',k('luv_tantalite_concentrate'),'mill')
      })
    event.create([gt('luv_machine_hull'),gt('luv_machine_casing')])
      .scene('gtibd_iv_hull','Первый корпус LuV по заказу ME',scene=>{
        scene.showBasePlate();block(scene,0,1,1,'ae2:pattern_provider');station(scene,1,'iv_assembler',1,1)
        step(scene,[1.5,1.8,1.5],'Первый шаблон относится к сборщику IV. Один экран и 1450 мБ смазки входят в оболочку. Забирай её шиной импорта в основную сеть.',gt('luv_machine_casing'),'ram')
        block(scene,0,1,3,'expatternprovider:ex_pattern_provider');block(scene,1,1,3,'expatternprovider:ingredient_buffer')
        step(scene,[1.5,1.8,3.5],'Второй шаблон размести у буфера ингредиентов. Отдельной подсетью с фильтрами разведи восемь предметов от контроллера к выдаче. Последняя шина получает второй экран.',k('venus_thermal_screen'))
        for(let x=2;x<=4;x++){block(scene,x,1,3,gt('hv_input_hatch'));scene.idle(12)}
        step(scene,[3,1.9,3.5],'Для корпуса подай в первый люк 1450 мБ смазки, во второй 864 мБ припоя, в третий 800 мБ суспензии. Один заказ ME сначала выдаст оболочку, затем передаст её на линию.',gt('iv_input_hatch'),'wash')
        output(scene,4.5,2.3,3.5,gt('luv_machine_hull'))
        step(scene,[4.5,2.3,3.5],'Линия на 7680 EU/t работает 140 секунд. Верни готовый корпус в сеть через выходную шину. Пара мейнфреймов для него потребовала ещё один экран.',gt('luv_machine_hull'),'ram')
      })
  })
}
