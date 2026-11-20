if (typeof Ponder !== 'undefined') {
  Ponder.registry(event => {
    const k = id => 'kubejs:'+id, gt = id => 'gtceu:'+id, ad = id => 'ad_astra:'+id
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
    event.create([k('ev_rutile_filter_cake'),k('purified_rutile'),k('titanium_reduction_charge')])
      .scene('gtibd_ev_rutile','От ильменита до титановой шихты',scene=>{
        scene.showBasePlate()
        station(scene,0,'hv_mixer')
        step(scene,[0.6,1.8,2.5],'Смеситель HV. Подай по две порции дроблёного ильменита, боксита после промывки и дроблёного эндерняка. Добавь 500 мБ дистиллята.',gt('crushed_ilmenite_ore'),'mill')
        station(scene,1,'hv_centrifuge');output(scene,1.5,2.2,2.5,k('ev_rutile_filter_cake'))
        step(scene,[1.5,1.8,2.5],'В центрифуге оставь сетку. Из 1000 мБ пульпы выйдут две порции осадка и 500 мБ солёной воды.',k('strainer_mesh'),'wash')
        station(scene,2,'hv_chemical_reactor');station(scene,3,'hv_mixer')
        step(scene,[2.5,1.8,2.5],'Реактор промывает осадок с флюсом, дистиллятом и защитным газом. Смешай готовый рутил с алюминием, керамикой, хромитом и тёмной золой.',k('purified_rutile'),'mill')
        output(scene,3.5,2.3,2.5,k('hot_titanium_billet'))
        step(scene,[3.5,2.2,2.5],'Шихту передай в домну на 2700 К. Подай 400 мБ аргона на одну горячую болванку.',k('hot_titanium_billet'))
      })
    event.create([k('ev_vacuum_getter'),k('ev_spent_getter'),gt('vacuum_freezer')])
      .scene('gtibd_ev_quench','Вакуумная камера в разрезе',scene=>{
        scene.showBasePlate()
        const parts={'1,1,0':'vacuum_freezer','0,1,1':'hv_input_bus','0,0,1':'hv_input_hatch','0,2,1':'hv_input_hatch',
          '0,1,2':'hv_energy_input_hatch','1,1,2':'maintenance_hatch','2,1,1':'hv_output_bus','2,2,1':'hv_output_hatch'}
        for(let y=0;y<3;y++){
          for(let x=0;x<3;x++)for(let z=0;z<3;z++){
            if(x===1&&y===1&&z===1)continue
            const id=parts[[x,y,z].join(',')]
            block(scene,x+1,y+1,z+1,id?Block.id(gt(id)).with('facing','north'):gt('frostproof_machine_casing'))
          }
          scene.idle(16)
          if(y===1)step(scene,[2.4,2.5,2.4],'Оставь центр пустым. На задней стенке установи питание HV и обслуживание, по бокам входную и выходную предметные шины.',gt('hv_input_bus'),'ram')
        }
        step(scene,[1.3,3.4,2.4],'Жидкостные входы раздельные. На болванку подай 1000 мБ холодного теплоносителя и 150 мБ защитного газа.',gt('hv_input_hatch'),'wash')
        step(scene,[1.3,2.6,2.5],'В предметную шину подай горячую деталь и чистый поглотительный картридж. Для подачи с одного шаблона ME разведи их из общего буфера.',k('ev_vacuum_getter'))
        output(scene,3.6,3.5,2.5,gt('titanium_ingot'))
        step(scene,[3.5,2.6,2.4],'Забери слиток и отработанный картридж через предметный выход. Через жидкостный вернутся 1000 мБ тёплого теплоносителя.',k('ev_spent_getter'),'ram')
      })
    event.create([gt('hv_chemical_reactor'),k('ev_filter_pleat'),gt('steel_drum')])
      .scene('gtibd_ev_coolant','Обратка, промывка и повторный заказ',scene=>{
        scene.showBasePlate()
        block(scene,0,1,2,'ae2:pattern_provider');station(scene,1,'hv_chemical_reactor')
        step(scene,[1.5,1.7,2.5],'Заправь контур тёплой жидкостью. Оставь сетку в реакторе. На 1000 мБ обратки подай 100 мБ дистиллята, верни очищенную жидкость и 100 мБ солёной воды.',k('strainer_mesh'),'wash')
        block(scene,2,1,2,'minecraft:smooth_stone_slab');output(scene,2.5,1.75,2.5,'pneumaticcraft:thermopneumatic_processing_plant')
        step(scene,[2.5,1.7,2.5],'Второй шаблон подаёт очищенный поток в термопневматическую установку. Для 1000 мБ холодной подачи держи не менее 3,75 бар и не более 275 К.','pneumaticcraft:thermopneumatic_processing_plant','mill')
        station(scene,3,'hv_chemical_bath')
        step(scene,[3.5,1.7,2.5],'В соседней ванне промой использованный поглотитель 250 мБ дистиллята. Получишь тот же картридж и 100 мБ солёной воды.',k('ev_spent_getter'),'wash')
        block(scene,4,1,2,gt('steel_drum'))
        step(scene,[4.5,1.7,2.5],'Отведи солёную воду. Держи запас холодной подачи и чистых картриджей в сети, а регенерацию веди отдельно от заказа болванки.','ae2:import_bus')
      })
    event.create([k('ev_rinsed_wafer'),k('ev_alignment_coupon'),gt('cleanroom')])
      .scene('gtibd_ev_cleanroom','От фильтров на крыше до калибровочной пластины',scene=>{
        scene.showBasePlate()
        for(let x=0;x<5;x++)for(let z=0;z<5;z++)block(scene,x,1,z,gt('plascrete'))
        for(let y=2;y<5;y++){
          for(let x=0;x<5;x++)for(let z=0;z<5;z++){
            if(x!==0&&x!==4&&z!==0&&z!==4)continue
            if(x===2&&z===4&&y<4){block(scene,x,y,z,Block.id('minecraft:iron_door').with('half',y===2?'lower':'upper'));continue}
            let id=x===0&&y===2&&z===2?'hv_energy_input_hatch':x===4&&y===2&&z===2?'maintenance_hatch':'plascrete'
            block(scene,x,y,z,gt(id))
          }
          scene.idle(9)
        }
        for(let x=0;x<5;x++)for(let z=0;z<5;z++)block(scene,x,5,z,gt(x===2&&z===2?'cleanroom':x>0&&x<4&&z>0&&z<4?'filter_casing':'plascrete'))
        step(scene,[2.5,5,2.5],'У оболочки 5×5×5 восемь потолочных фильтров вокруг контроллера. Подключи энерголюк, обслужи комнату, закрой дверь и дождись рабочей чистоты.',gt('filter_casing'),'ram')
        scene.world.hideSection([0,5,0,4,5,4],Facing.UP);scene.world.hideSection([0,2,0,4,4,4],Facing.UP);scene.idle(18)
        station(scene,1,'hv_chemical_bath',2,2);station(scene,2,'hv_laser_engraver',2,2)
        step(scene,[1.5,2.7,2.5],'Ванна внутри комнаты промывает подложку 250 мБ чистой жидкости. Отведи 200 мБ стока. Затем подай подложку и маску в гравёр HV.',k('ev_rinsed_wafer'),'wash')
        station(scene,3,'ev_laser_engraver',2,2);output(scene,3.5,3.2,2.5,k('ev_alignment_coupon'))
        step(scene,[3.4,2.7,2.5],'В гравёре EV совмести травлёную подложку и титановую пластину. Калибровочную пластину отправь в сборщик вместе с лунным уплотнением.',k('ev_alignment_coupon'),'mill')
      })
    event.create([k('ev_liner_preform'),k('ev_mercury_thermal_insert'),gt('iv_machine_hull')])
      .scene('gtibd_ev_two_planets','Два рейса для первого корпуса IV',scene=>{
        scene.showBasePlate()
        block(scene,0,1,2,ad('moon_stone'));block(scene,1,1,2,ad('mars_stone'));block(scene,2,1,2,ad('mercury_stone'));block(scene,3,1,2,ad('mars_stone'))
        step(scene,[0.6,1.7,2.5],'На Земле собери заготовку из лунного уплотнения, титана, прокладки и калибровочной пластины. Возьми ракету второй ступени.',k('ev_liner_preform'),'ram')
        step(scene,[1.5,1.7,2.5],'Первая посадка на Марс нужна для острума. Сделай термостойкий скафандр, возьми кислород, ванну и сборщик EV, а также запас топлива на возвращение.',ad('netherite_space_suit'))
        station(scene,2,'ev_chemical_bath',2);step(scene,[2.5,2.7,2.5],'На Меркурии ванна EV принимает прокалённый концентрат Меркурия и 500 мБ холодного теплоносителя. Забери термовставку и 500 мБ тёплой обратки.',k('ev_mercury_thermal_insert'),'wash')
        station(scene,3,'ev_assembler',2);step(scene,[3.4,2.7,2.5],'Вернись на Марс. Сборщик принимает вставку, титановую заготовку, две пластины острума, прокалённый концентрат Марса и шеелит. Добавь 500 мБ чистой жидкости. Пара вкладышей нужна одному корпусу.',k('martian_pressure_liner'),'ram')
        block(scene,4,1,2,'ae2:pattern_provider');output(scene,4.5,2.3,2.5,gt('iv_machine_hull'))
        step(scene,[4.4,1.7,2.5],'На базе закодируй оболочку и корпус двумя шаблонами. Каждый расходует один вкладыш и 700 мБ смазки. Закажи корпус в терминале.',gt('iv_machine_hull'))
      })
  })
}
