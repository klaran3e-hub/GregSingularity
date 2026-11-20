if (typeof Ponder !== 'undefined') Ponder.registry(event=>{
  const k=id=>'kubejs:'+id,gt=id=>'gtceu:'+id,a=id=>'ad_astra:'+id,ship=id=>'gtibd_core:'+id
  function block(scene,pos,state){scene.world.setBlock(pos,state,false);scene.world.showSection(pos,Facing.DOWN)}
  function cue(scene,name){
    scene['addInstruction(java.util.function.Consumer)'](playing=>{
      const ui=Client.screen
      if(!Client.player||!ui||typeof ui.getActiveScene!=='function'||!playing.equals(ui.getActiveScene()))return
      const sounds=Java.loadClass('net.minecraftforge.registries.ForgeRegistries').SOUND_EVENTS
      const Id=Java.loadClass('net.minecraft.resources.ResourceLocation'),s=sounds.getValue(new Id('kubejs','fieldwork.'+name))
      if(s)Client.player.playSound(s,0.38,1)
    })
  }
  function step(scene,row){
    const [x,z,state,item,note,sound]=row
    const pos=[x,1,z],point=[x+.5,1.8,z+.5]
    block(scene,pos,state);scene.idle(12)
    if(item){scene.showControls(55,point,PonderPointing.DOWN).withItem(item);scene.world.createItemEntity([x+.5,2.3,z+.5],[0,.035,0],Item.of(item))}
    cue(scene,sound)
    scene.text(84,note,point).placeNearTarget().attachKeyFrame();scene.idle(92)
  }
  function story(items,key,title,steps) {
    event.create(items).scene(key,title,scene=>{scene.showBasePlate();steps.forEach(row=>step(scene,row))})
  }
  story([k('luv_annealed_mount'),k('luv_venus_timing_prism'),k('luv_cryo_cartridge')],
    'gtibd_outer_optics','От меркурианской оправы до призмы',[
      [0,2,gt('luv_forming_press'),k('luv_prism_blank'),'Пресс даёт две оправы из кварцита, листа калорита и меркурианской породы.','ram'],
      [1,2,gt('luv_arc_furnace'),k('luv_annealed_mount'),'На Меркурии подай в дуговую печь одну оправу и 250 мБ кислорода.','mill'],
      [2,2,gt('luv_laser_engraver'),k('luv_venus_timing_prism'),'На Венере оставь базовую пластину IV в гравёре. Одна оправа даёт две призмы.','ram'],
      [4,2,gt('luv_assembler'),k('luv_cryo_cartridge'),'Марс поставляет фильтрующую кассету. Она работает в контуре охлаждения и в сборщике кристаллов.','wash']])
  story([k('luv_witness_blank'),k('luv_plasma_coupon'),k('luv_glacio_seed')],
    'gtibd_outer_plasma','Замкнутый контур испытаний',[
      [0,2,gt('luv_mixer'),k('ev_filter_pleat'),'Смешай фильтр и кварцитовую пыль с 750 мБ холодного теплоносителя и 250 мБ гелия.','wash'],
      [1,2,gt('luv_forming_press'),k('luv_witness_blank'),'Оставь форму пластины в прессе. Загрузи родированные листы и нейтронный отражатель.','ram'],
      [2,2,gt('vacuum_freezer'),k('luv_plasma_coupon'),'В два люка камеры подай 500 мБ плазмы Mk I и 1000 мБ оптического теплоносителя. Шиной импорта забери обе пластины.','wash'],
      [4,2,gt('luv_chemical_reactor'),k('luv_cryo_cartridge'),'Для литра обратки нужно 250 мБ гелия. Марсианская кассета остаётся в реакторе.','wash']])
  const routes=[
    ['surveyor','Церера',gt('luv_chemical_reactor'),k('survey_drive'),k('ceres_salt_lens'),k('luv_ceres_salt_concentrate'),gt('luv_chemical_reactor'),
      'Собери ракету Tier V из ракеты Tier IV. Привези с Гласио затравки, с Венеры синхропризмы.','Выбери Цереру. Геодезическое топливо готовит реактор LuV, в нём остаётся кассета с Марса.','Под корой найди соль и сапфир. В реакторе на Церере оставь сапфир и выщелочи линзу в 400 мБ дистиллята. Два концентрата вези на Гласио.'],
    ['courier','Европа',gt('zpm_mixer'),k('courier_drive'),k('europa_rift_core'),k('europa_phase_ceramic'),gt('zpm_forming_press'),
      'Для ракеты Tier VI разбери ракету Tier V на сборочной линии ZPM. Положи кристаллы с Гласио и концентрат с Цереры.','Ракета Tier VI принимает перелётную среду «Европа». В смеситель идут литр геодезического топлива, концентрат и 250 мБ гелиевой плазмы.','Промой прокалённый концентрат Европы в рассоле Цереры. Способ сборки керамики смотри у мембраны. Для пресса привези пластинку с Гласио и два листа европия.'],
    ['freighter','Титан',gt('uv_chemical_reactor'),k('freighter_drive'),k('titan_seam_core'),k('titan_load_standard'),gt('uv_assembler'),
      'На первую шину поставь ракету Tier VI. Для ракеты Tier VII нужны грузовой привод, две пластины с Европы и обшивка из тритания.','Топливная матрица делается на UV из перелётной среды и защитного газа. Оставь керамику Европы в реакторе.','Прокали концентрат Титана и добавь пыль касситеритового песка. Из них сборщик с 750 мБ топливной матрицы даст два эталона для приёмки UV.']]
  routes.forEach(route=>{
    var id=route[0],plant=route[2],drive=route[3],ore=route[4],result=route[5],work=route[6],captions=route.slice(7)
    story([ship(id),drive,ore,result],'gtibd_route_'+id,'Рейс на '+({surveyor:'Цереру',courier:'Европу',freighter:'Титан'}[id]),[
      [0,1,gt('assembly_line'),drive,captions[0],'ram'],[1,3,plant,ship(id),captions[1],'wash'],
      [2,1,ore,ore,'После посадки разверни питание и выгрузи станок. Керны залегают между Y 20 и 62.','mill'],
      [4,2,work,result,captions[2],'ram']])
  })
  story([k('glacio_reference_crystal'),gt('zpm_machine_hull')],'gtibd_outer_hull','Кристалл, сфера и корпус ZPM',[
    [0,2,gt('luv_assembler'),k('glacio_reference_crystal'),'На Гласио соедини затравку, призму, плазменную пластину, соль, накваду и лёд с 750 мБ оптического теплоносителя. Кассету оставь в станке.','wash'],
    [1,2,gt('object_holder'),gt('data_orb'),'На исследовательской станции положи кристалл и пустую сферу в держатель. Подключи HPCA на 12 CWU/t. Ограничь разгон станции уровнем LuV и выдели ей линию 32768 EU/t.','mill'],
    [2,2,gt('advanced_data_access_hatch'),gt('data_orb'),'Вставь записанную сферу в люк данных. Ещё два кристалла уйдут в оболочку и сам корпус.','ram'],
    [3,2,'expatternprovider:ingredient_buffer',gt('luv_input_hatch'),'Шаблон ME подаёт три жидкости раздельно. Нужны 3000 мБ смазки, 1728 мБ припоя и 1250 мБ оптического теплоносителя.','wash'],
    [4,2,gt('ulv_output_bus'),gt('zpm_machine_hull'),'Разложи девять предметов от входа линии к выходу. Кристалл занимает восьмое место, плазменная пластина девятое. Готовый корпус верни в ME.','ram']])
})
