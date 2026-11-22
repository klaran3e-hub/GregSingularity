if (typeof Ponder !== 'undefined') {
  Ponder.registry(event => {
    function show(scene,pos,id) {
      scene.world.setBlock(pos,id,false)
      scene.world.showSection(pos,Facing.DOWN)
      scene.idle(8)
    }
    function stage(scene,pos,caption,item,sound) {
      if(item)scene.showControls(55,pos,PonderPointing.DOWN).withItem(item)
      if(sound)scene['addInstruction(java.util.function.Consumer)'](playing=>{
        const screen=Client.screen
        if(!screen||typeof screen.getActiveScene!=='function'||!playing.equals(screen.getActiveScene())||!Client.player)return
        const events=Java.loadClass('net.minecraftforge.registries.ForgeRegistries').SOUND_EVENTS
        const Id=Java.loadClass('net.minecraft.resources.ResourceLocation')
        Client.player.playSound(events.getValue(new Id('kubejs','fieldwork.'+sound)),0.4,1)
      })
      scene.text(84,caption,pos).placeNearTarget().attachKeyFrame()
      scene.idle(94)
    }
    function machine(id){return Block.id('gtceu:'+id).with('facing','south')}
    event.create(['ad_astra:engine_frame','ad_astra:steel_engine','gtceu:hv_forming_press'])
      .scene('gtibd_nether_rocket_press','Рама маршевого двигателя',scene=>{
        scene.showBasePlate()
        show(scene,[1,1,2],'minecraft:basalt');show(scene,[2,1,2],'minecraft:netherrack')
        show(scene,[1,2,2],machine('hv_combustion'));show(scene,[2,2,2],machine('hv_forming_press'))
        stage(scene,[2.4,2.6,2.5],'Установи пресс HV в Нижнем мире. Подай питание и четыре нержавеющие пластины.','gtceu:stainless_steel_plate','mill')
        stage(scene,[2.5,2.7,2.5],'Положи горячую заготовку, две канталовые обмотки и дугозащитный экран. Через 32 секунды забери раму.','gtceu:gregsingularity_hot_kanthal_billet','ram')
        show(scene,[3,2,2],machine('hv_assembler'))
        stage(scene,[3.5,2.6,2.5],'Сохрани по отдельной раме для двигателя, каждого бака и стола NASA. Добавь к двигателю насос, мотор и электроизоляционное масло.','ad_astra:engine_frame')
      })
    event.create(['ad_astra:fuel_refinery','ad_astra:fuel_bucket','ae2:pattern_provider'])
      .scene('gtibd_orbital_fluid_order','Заказ ракетного топлива из ME',scene=>{
        scene.showBasePlate()
        show(scene,[0,1,2],'ae2:drive');show(scene,[1,1,2],'ae2:pattern_provider')
        show(scene,[2,1,2],machine('hv_chemical_reactor'))
        stage(scene,[2.5,1.8,2.5],'В обработке укажи дизель 1000 мБ, нефтяной газ 250 мБ и катализатор. На выходах смеси 1000 мБ и один активированный носитель.','gtceu:gregsingularity_cracking_catalyst','wash')
        show(scene,[3,1,2],machine('hv_distillery'))
        stage(scene,[3.4,1.7,2.5],'Оставь топливную установку в дистилляторе как оснастку. Второй шаблон принимает 1000 мБ смеси и возвращает столько же топлива.','ad_astra:fuel_refinery','mill')
        show(scene,[4,1,2],'gtceu:steel_drum')
        stage(scene,[4.4,1.7,2.5],'Подключи шины импорта к выдаче и закажи топливо в терминале. Отдельный бак сохрани для обратного полёта.','ae2:import_bus')
      })
    event.create(['ad_astra:nasa_workbench','ad_astra:tier_1_rocket','ad_astra:launch_pad'])
      .scene('gtibd_orbital_launch','Стапель и первая экспедиция',scene=>{
        scene.showBasePlate()
        show(scene,[1,1,2],'minecraft:smooth_stone_slab')
        scene.world.createItemEntity([1.5,1.65,2.5],[0,0,0],Item.of('ad_astra:nasa_workbench'))
        stage(scene,[1.5,1.8,2.5],'В центральные шесть ячеек уложи по рядам две оболочки HV, две штампованные рамы и два огнеупора. Сверху поставь нос.','ad_astra:rocket_nose_cone','ram')
        stage(scene,[1.5,2,2.5],'По бокам поставь четыре стабилизатора, в середине два бака, внизу двигатель. Получившуюся ракету перенеси на площадку.','ad_astra:steel_engine','mill')
        show(scene,[3,1,2],'minecraft:polished_blackstone_slab')
        scene.world.createItemEntity([3.5,1.65,2.5],[0,0,0],Item.of('ad_astra:launch_pad'))
        stage(scene,[3.5,1.6,2.5],'Заправь ракету и нагрудник, возьми запас на возвращение. Для лунного цеха нужны сборщик HV, питание и 250 мБ масла на партию.','ad_astra:tier_1_rocket')
      })
    event.create(['ad_astra:gregsingularity_lunar_vacuum_seal','gtceu:ev_machine_casing','gtceu:ev_machine_hull'])
      .scene('gtibd_lunar_vacuum_seal','Первый корпус EV через Луну',scene=>{
        scene.showBasePlate()
        show(scene,[1,1,2],'ad_astra:moon_stone');show(scene,[2,1,2],'ad_astra:moon_desh_ore');show(scene,[3,1,2],'gtceu:bauxite_ore')
        stage(scene,[2.5,1.7,2.5],'На лунной поверхности добудь дешеносную брекчию, сырой деш и боксит. Бокситовые залежи ищи между Y 12 и 58.','ad_astra:raw_desh')
        show(scene,[2,2,2],machine('hv_assembler'));show(scene,[1,2,2],machine('hv_combustion'))
        stage(scene,[2.5,2.7,2.5],'Положи руду, две нержавеющие пластины, канталовую обмотку и прокладку в сборщик HV. Подай 250 мБ масла. На Луне за цикл получишь два уплотнения.','ad_astra:gregsingularity_lunar_vacuum_seal','ram')
        show(scene,[4,1,2],'gtceu:ev_machine_casing')
        stage(scene,[4.5,1.7,2.5],'Доставь серию на Землю. Уплотнение уйдёт в оболочку EV, ещё одно в корпус. Запас потребуется для вакуумного цеха и управляющих модулей.','gtceu:ev_machine_hull')
      })
    event.create(['ad_astra:gregsingularity_martian_pressure_liner','ad_astra:gregsingularity_venus_thermal_screen','ad_astra:gregsingularity_glacio_reference_crystal'])
      .scene('gtibd_outer_planet_returns','Поставки с дальних баз',scene=>{
        scene.showBasePlate()
        show(scene,[1,1,2],'ad_astra:mars_stone');show(scene,[1,2,2],machine('ev_assembler'))
        stage(scene,[1.5,2.7,2.5],'Марс. Соедини термовставку, титановую заготовку, острумовые пластины, прокалённый концентрат Марса и шеелит. Подай 500 мБ чистой жидкости и забери два вкладыша.','ad_astra:gregsingularity_martian_pressure_liner','ram')
        show(scene,[2,1,2],'ad_astra:venus_stone');show(scene,[2,2,2],machine('iv_assembler'))
        stage(scene,[2.5,2.7,2.5],'Венера. Сборщик IV спаивает заготовку с калоритом, марсианским зерном, двумя плитками и канталовой обмоткой. Экраны нужны для LuV.','ad_astra:gregsingularity_venus_thermal_screen','mill')
        show(scene,[3,1,2],'ad_astra:glacio_stone');show(scene,[3,2,2],machine('luv_assembler'))
        stage(scene,[3.5,2.7,2.5],'На Гласио нужны затравка, призма, плазменный образец, наквада, лёд и концентрат Цереры. В сборщике оставь кассету с Марса. На два кристалла подай 750 мБ оптического теплоносителя.','ad_astra:gregsingularity_glacio_reference_crystal','wash')
      })
    event.create(['ad_astra:space_suit','gtceu:raw_chalcopyrite','ad_astra:steel_tank'])
      .scene('gtibd_orbital_asteroid_mining','Рудные астероиды на орбите Земли',scene=>{
        scene.showBasePlate()
        show(scene,[1,2,2],'minecraft:tuff');show(scene,[2,2,2],'minecraft:andesite');show(scene,[3,2,2],'minecraft:stone')
        stage(scene,[2.5,2.7,2.5],'С орбитальной станции отправляйся к отдельным каменным телам. Возьми кислород, инструмент и свободную грузовую ячейку.','ad_astra:space_helmet')
        scene.world.hideSection([2,2,2],Facing.UP);scene.idle(14)
        show(scene,[2,2,2],'gtceu:chalcopyrite_ore');show(scene,[2,2,3],'gtceu:iron_ore')
        stage(scene,[2.5,2.7,2.5],'Сними породу у выхода жилы. Пояс повторяет составы месторождений обычного мира. В одном теле соседствуют руды одной семьи.','gtceu:raw_chalcopyrite','ram')
        show(scene,[4,1,2],'minecraft:barrel')
        stage(scene,[4.5,1.7,2.5],'Перевези сырьё к дробилкам. Для лунного уплотнения нужны прокалённый лунный концентрат и сборщик на Луне.','minecraft:raw_iron')
      })
  })
}
