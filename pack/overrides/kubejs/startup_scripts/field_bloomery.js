GTCEuStartupEvents.registry('gtceu:recipe_type', event => {
  const ExistingSound = Java.loadClass('com.gregtechceu.gtceu.api.sound.ExistingSoundEntry')
  const Sound = Java.loadClass('net.minecraft.sounds.SoundEvent')
  const resource = Java.loadClass('net.minecraft.resources.ResourceLocation')
  const blocks = Java.loadClass('net.minecraft.sounds.SoundSource').BLOCKS
  const firing = new ExistingSound(Sound.createVariableRangeEvent(new resource('kubejs:fieldwork.fire')), blocks)
  event.create('field_bloomery').setSound(firing).category('primitive').setMaxIOSize(3, 3, 0, 0).setEUIO('none')
})

GTCEuStartupEvents.registry('gtceu:machine', event => {
  const registry = Java.loadClass('net.minecraftforge.registries.ForgeRegistries').BLOCKS
  const Id = Java.loadClass('net.minecraft.resources.ResourceLocation')
  const brick = id => Predicates.blocks(registry.getValue(new Id(global.gsItemId(id))))
  const props = Java.loadClass('com.gregtechceu.gtceu.api.machine.property.GTMachineModelProperties')
  const logic = Java.loadClass('com.gregtechceu.gtceu.api.machine.trait.RecipeLogic$Status')
  const FieldBloomery = Java.loadClass('gtibd.addon.FieldBloomery')
  FieldBloomery.configureModel(event.create('field_bloomery', 'primitive'))
    .machine(holder => new FieldBloomery(holder))
    .rotationState(RotationState.NON_Y_AXIS)
    .recipeType('gtceu:field_bloomery')
    .appearanceBlock(() => Blocks.TERRACOTTA)
    .pattern(definition => FactoryBlockPattern.start()
      .aisle('CCC', 'MMM', ' M ', '   ', '   ')
      .aisle('CCC', 'M M', 'M M', ' S ', ' R ')
      .aisle('CCC', 'MKM', ' M ', '   ', '   ')
      .aisle('CCC', ' A ', '   ', '   ', '   ')
      .where('K', Predicates.controller(Predicates.blocks(definition.get())))
      .where('C', Predicates.blocks(Blocks.COBBLESTONE))
      .where('M', brick('bloomery_masonry'))
      .where('S', brick('bloomery_shoulder'))
      .where('R', brick('bloomery_stack'))
      .where('A', brick('bloomery_casting_basin'))
      .where(' ', Predicates.air())
      .build())
    .modelProperty(props.RECIPE_LOGIC_STATUS, logic.IDLE)
    .model((context, provider, model) => {
      const File = Java.loadClass('net.minecraftforge.client.model.generators.ModelFile$UncheckedModelFile')
      const cold = new File['(java.lang.String)']('kubejs:block/field_bloomery_cold')
      const formed = new File['(java.lang.String)']('kubejs:block/field_bloomery_formed')
      const lit = new File['(java.lang.String)']('kubejs:block/field_bloomery_lit')
      model.forAllStatesModels(state => {
        if (String(state.getValue(props.IS_FORMED)) !== 'true') return cold
        return state.getValue(props.RECIPE_LOGIC_STATUS) === logic.WORKING ? lit : formed
      })
    })
})
