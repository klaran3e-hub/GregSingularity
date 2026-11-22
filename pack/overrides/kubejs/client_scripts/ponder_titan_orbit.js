if (typeof Ponder !== 'undefined') Ponder.registry(event => {
  const k = id => global.gsItemId('titan_' + id)
  const gt = id => 'gtceu:' + id
  const amber = [0.88, 0.48, 0.17], cold = [0.40, 0.80, 0.86], spent = [0.55, 0.57, 0.34]
  function show(scene, pos, id) {
    scene.world.setBlock(pos, id, false)
    scene.world.showSection(pos, Facing.DOWN)
  }
  function flow(scene, at, motion, tint) {
    const Dust = Java.loadClass('net.minecraft.core.particles.DustParticleOptions')
    const Vec = Java.loadClass('org.joml.Vector3f')
    const particles = new Dust(new Vec(tint[0], tint[1], tint[2]), 0.66)
    scene.effects.emitParticles(at, scene.effects.simpleParticleEmitter(particles, motion), 0.55, 62)
  }
  function explain(scene, at, text, item, sound) {
    scene['addInstruction(java.util.function.Consumer)'](playing => {
      const ui = Client.screen
      if (!Client.player || !ui || typeof ui.getActiveScene !== 'function' || !playing.equals(ui.getActiveScene())) return
      const sounds = Java.loadClass('net.minecraftforge.registries.ForgeRegistries').SOUND_EVENTS
      const Id = Java.loadClass('net.minecraft.resources.ResourceLocation')
      const cue = sounds.getValue(new Id('kubejs','fieldwork.' + sound))
      if (cue) Client.player.playSound(cue, 0.36, 1)
    })
    if (item) scene.showControls(54, at, PonderPointing.DOWN).withItem(item)
    scene.text(94, text, at).placeNearTarget().attachKeyFrame()
    scene.idle(104)
  }
  event.create([k('wick'), 'ad_astra:gregsingularity_zpm_europa_membrane', k('seam_core')])
    .scene('gtibd_titan_extraction', 'От ледовой мембраны до конденсата Титана', scene => {
      scene.showBasePlate()
      show(scene,[0,1,2],gt('zpm_chemical_bath'))
      flow(scene,[0.5,1.6,3.2],[0,0,-0.065],cold)
      explain(scene,[0.5,2,2.5],'Европа. Промой одну мембрану в 500 мБ чистого рассола Цереры. Вынь две сорбционные вставки.',k('wick'),'wash')
      show(scene,[2,1,2],k('seam_core'))
      show(scene,[3,1,2],gt('uv_chemical_reactor'))
      explain(scene,[2.5,2,2.5],'На Титане извлеки концентрат из восьми кернов. В реактор подай прокалённый концентрат, одну вставку и 500 мБ азота.','ad_astra:gregsingularity_mill_titan_assay','mill')
      show(scene,[4,1,2],'ae2:pattern_provider')
      flow(scene,[3.5,1.65,2.5],[0.08,0,0],amber)
      scene.world.createItemEntity([3.4,2.2,2.5],[0.035,0.08,0],Item.of(k('spent_wick')))
      explain(scene,[4.4,1.9,2.4],'Забери 1500 мБ конденсата и пропитанную вставку. На орбиту уходят оба выхода одного рецепта.',k('spent_wick'),'wash')
    })
  event.create([k('radiator_core'), 'gtceu:gregsingularity_uv_quench_cassette'])
    .scene('gtibd_titan_radiators', 'Перегонка на орбите и обратный груз', scene => {
      scene.showBasePlate()
      show(scene,[0,1,2],gt('uv_distillery'))
      flow(scene,[0.5,1.65,3.3],[0,0,-0.075],amber)
      explain(scene,[0.5,2,2.5],'Орбита Титана. Дистиллятор превращает 1500 мБ конденсата в литр охладителя. На поверхности этот рецепт не работает.',gt('uv_distillery'),'wash')
      show(scene,[2,1,2],gt('uv_chemical_bath'))
      flow(scene,[0.8,1.65,2.5],[0.09,0,0],cold)
      explain(scene,[2.5,2,2.5],'Отмерь половину литра в ванну с пропитанной вставкой. Другие 500 мБ оставь для продувочного цеха.',k('spent_wick'),'wash')
      scene.world.createItemEntity([2.6,2.2,2.5],[0.03,0.09,0],Item.of('2x '+k('radiator_core')))
      show(scene,[4,1,2],gt('zpm_chemical_reactor'))
      explain(scene,[3.5,2,2.5],'Забери оба радиатора. Два нужны для пары кассет закалки. На каждую варку 1440 мБ нейтрониевой подачи в Нижнем мире уходит ещё один.',k('radiator_core'),'ram')
      show(scene,[2,1,4],gt('uv_chemical_reactor'))
      flow(scene,[2.5,1.65,2.9],[0,0,0.08],spent)
      explain(scene,[2.5,2,4.5],'Верни 250 мБ маточного раствора на Титан. С пылью касситеритового песка и 250 мБ гелия он даёт ещё 500 мБ сырого конденсата.',gt('cassiterite_sand_dust'),'wash')
    })
  event.create([k('spent_wick'),'ae2:quantum_ring'])
    .scene('gtibd_titan_freight', 'Между терминалами двух космопортов', scene => {
      scene.showBasePlate()
      for (let y=1; y<=3; y++) {
        for (let x=1; x<=3; x++) if (x!==2 || y!==2) show(scene,[x,y,2],'ae2:quantum_ring')
        scene.idle(9)
      }
      show(scene,[2,2,2],'ae2:quantum_link')
      explain(scene,[2.5,2.5,2.5],'Собери такую раму в обоих портах. Восемь колец в одной плоскости, соединительная камера в центре. Питание подводится к середине стороны.','ae2:quantum_link','ram')
      show(scene,[0,2,2],'ae2:energy_cell')
      explain(scene,[1.5,2.5,2.5],'Подай питание с обеих сторон и поставь в камеры по одной сингулярности из одной пары. Оба чанка должны быть загружены.','ae2:quantum_entangled_singularity','mill')
      show(scene,[4,2,2],'ae2:pattern_provider')
      flow(scene,[1.15,2.35,2.2],[0.09,0,0],amber)
      explain(scene,[4.5,2.5,2.5],'Опиши в шаблоне реактора конденсат и вставку. В шаблоне ванны укажи радиаторы и обратку. Предметные и жидкостные ячейки должны иметь свободное место.','ae2:processing_pattern','wash')
      flow(scene,[3.8,2.65,2.2],[-0.10,0,0],cold)
      explain(scene,[2.5,2.5,2.5],'Закажи два радиатора из наземного терминала. Если порт обесточен или выгружен, восстанови связь, чтобы заказ смог вернуться.',k('radiator_core'),'ram')
    })
})
