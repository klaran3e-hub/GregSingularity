StartupEvents.registry('item', event => {
  const stock = ['scored_flint_core', 'retting_bundle', 'retted_bundle', 'haft_blank', 'lapped_edge',
    'wedged_tenon', 'clay_slip_cake', 'kiln_biscuit', 'chamotte', 'ramming_mix', 'green_tuyere',
    'fired_tuyere', 'green_ingot_mould', 'ingot_mould', 'hearth_bellows', 'grinding_runner',
    'forging_saddle', 'turned_spindle', 'hand_pump_barrel', 'coarse_flour', 'camp_dough', 'roasted_alloy_feed', 'bronze_mould_frame', 'five_tube_register', 'boiler_tube_bank']
  stock.forEach(id => {
    const item = event.create(global.gsItemId(id)).texture('kubejs:item/' + id)
    if (id === 'forging_saddle') item.maxStackSize(1)
  })
})
StartupEvents.registry('block', event => {
  const FieldBloomeryParts = Java.loadClass('gtibd.addon.FieldBloomery')
  for (const id of ['bloomery_masonry', 'bloomery_shoulder', 'bloomery_stack', 'bloomery_casting_basin']) {
    var part = event.create(global.gsItemId(id)).stoneSoundType().hardness(1.8).model('kubejs:block/fieldwork/' + id).tagBlock('minecraft:mineable/pickaxe')
    part.property(FieldBloomeryParts.ASSEMBLED)
      .defaultState(state => state.set(FieldBloomeryParts.ASSEMBLED, false))
    part.blockstateJson = FieldBloomeryParts.partBlockstate(id)
    if (id !== 'bloomery_masonry') part.notSolid().fullBlock(false).opaque(false).viewBlocking(false)
    if (id === 'bloomery_casting_basin') {
      part.box(0,0,0,16,2,16).box(1,2,1,15,3,15)
        .box(1,3,1,15,6,3).box(1,3,13,15,6,15).box(1,3,3,3,6,13).box(13,3,3,15,6,13)
    }
  }
  event.create(global.gsItemId('ore_washing_trough')).woodSoundType().hardness(2)
    .box(0, 0, 0, 16, 10, 16).notSolid().fullBlock(false)
    .model('kubejs:block/fieldwork/ore_washing_trough').tagBlock('minecraft:mineable/axe')
})
StartupEvents.registry('sound_event', event => {
  ;['knap', 'lash', 'cut', 'ram', 'wash', 'strike', 'fire', 'mill'].forEach(id => event.create('kubejs:fieldwork.' + id))
})
