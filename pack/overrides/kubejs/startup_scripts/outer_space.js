StartupEvents.registry('item', event => {
  for(const id of ['survey_drive','courier_drive','freighter_drive','europa_phase_ceramic','titan_load_standard',
    'titan_wick','titan_spent_wick','titan_radiator_core'])
    event.create(global.gsItemId(id)).texture('kubejs:item/'+id)
})
StartupEvents.registry('block', event => {
  for(const id of ['europa_rift_core','titan_seam_core'])
    event.create(global.gsItemId(id)).stoneSoundType().hardness(3.5).resistance(6).requiresTool(true)
      .textureAll('kubejs:block/'+id).tagBlock('minecraft:mineable/pickaxe').tagBlock('minecraft:needs_iron_tool')
})
