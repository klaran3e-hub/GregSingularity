if (typeof Ponder !== 'undefined') Ponder.registry(event => {
  const names = {moon:'Луна',mercury:'Меркурий',mars:'Марс',venus:'Венера',glacio:'Гласио',ceres:'Церера',europa:'Европа',titan:'Титан'}
  const tiers = {384:'hv',1536:'ev',1792:'ev',7168:'iv',28672:'luv',114688:'zpm',458752:'uv'}
  const splitter = {centrifuge:'центрифугу',thermal_centrifuge:'термическую центрифугу',sifter:'грохот',electromagnetic_separator:'электромагнитный сепаратор'}
  function reveal(scene,pos,id) {scene.world.setBlock(pos,id,false);scene.world.showSection(pos,Facing.DOWN)}
  function caption(scene,pos,text,item,sound) {
    scene['addInstruction(java.util.function.Consumer)'](playing=>{
      const ui=Client.screen
      if(!Client.player || !ui || typeof ui.getActiveScene!=='function' || !playing.equals(ui.getActiveScene()))return
      const R=Java.loadClass('net.minecraftforge.registries.ForgeRegistries'),Id=Java.loadClass('net.minecraft.resources.ResourceLocation')
      const cue=R.SOUND_EVENTS.getValue(new Id('kubejs','fieldwork.'+sound))
      if(cue)Client.player.playSound(cue,0.36,1)
    })
    scene.showControls(50,pos,PonderPointing.DOWN).withItem(item)
    scene.text(78,text,pos).placeNearTarget().attachKeyFrame()
    scene.idle(86)
  }
  global.gtibdPlanetaryMills.forEach(site => {
    const k=form=>'kubejs:mill_'+site.id+'_'+form
    const gt=name=>'gtceu:'+tiers[site.eu]+'_'+name
    event.create(['kubejs:'+site.ore,k('grit'),k('washed'),k('heavy'),k('crystal'),k('assay')])
      .scene('gtibd_mill_'+site.id,names[site.id]+'. От жилы до концентрата',scene=>{
        scene.showBasePlate()
        reveal(scene,[0,1,1],'kubejs:'+site.ore);reveal(scene,[0,1,2],gt('macerator'))
        caption(scene,[0.5,2,2.5],names[site.id]+'. Добудь '+site.count+' блоков породы для одной партии. Раздроби их на месте и забери обе пробы.',k('grit'),'mill')
        reveal(scene,[1,1,2],gt(site.wash))
        caption(scene,[1.5,2,2.5],'Промой обе пробы. В шаблоне обработки укажи '+250*site.count+' мБ промывочной жидкости. Вид жидкости указан в JEI этого станка.',k('washed'),'wash')
        reveal(scene,[2,1,2],gt(site.split))
        caption(scene,[2.5,2,2.5],'Подай промытую пару в '+splitter[site.split]+'. Тяжёлую фракцию отправь в реактор, попутную пыль забери в хранилище.',k('heavy'),'mill')
        reveal(scene,[3,1,2],gt('chemical_reactor'))
        caption(scene,[3.5,2,2.5],'Раствори концентрат с двумя порциями второго компонента и '+125*site.count+' мБ реагента. Из полевого цеха можно вывезти литр раствора.',site.mineral,'wash')
        reveal(scene,[4,1,2],gt('autoclave'))
        caption(scene,[4.5,2,2.5],'В автоклав положи кварцит. Перекачай литр продуктивного раствора, затем вынь кристаллизат.',k('crystal'),'ram')
        reveal(scene,[4,1,3],'gtceu:electric_blast_furnace')
        scene.world.createItemEntity([4.5,2.1,3.5],[0,0.05,0],Item.of(k('assay')))
        caption(scene,[4.5,2,3.5],'Для домны нужны '+site.heat+' K и '+125*site.count+' мБ аргона. На выходе одна товарная порция для следующего передела.',k('assay'),'mill')
      })
  })
})
