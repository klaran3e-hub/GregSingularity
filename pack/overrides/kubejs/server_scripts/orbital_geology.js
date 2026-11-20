GTCEuServerEvents.oreVeins(event => {
  const Id = Java.loadClass('net.minecraft.resources.ResourceLocation')
  const Layers = Java.loadClass('com.gregtechceu.gtceu.api.data.worldgen.WorldGenLayers')
  ;[['sapphire_vein','ceres',Layers.DEEPSLATE],['olivine_vein','europa',Layers.STONE],
    ['garnet_tin_vein','titan',Layers.STONE]].forEach(([vein,world,layer])=>{
    event.modify('gtceu:'+vein, definition => definition.dimensions(new Id('zero_shift',world))
      .layer(layer).biomes('#zero_shift:outer_deposits').heightRangeUniform(12,52))
  })
  ;['bauxite_vein_end','scheelite_vein','naquadah_vein'].forEach(id=>event.remove('gtceu:'+id))
})

ServerEvents.highPriorityData(event => {
  // The terrestrial oil supply comes from the GregTech drilling fields.
  event.addJson('ad_astra:tags/worldgen/biome/has_structure/oil_well',{replace:true,values:[]})
  event.addJson('zero_shift:tags/fluids/flight_blend',{replace:true,values:['kubejs:stabilized_flight_blend']})
  event.addJson('zero_shift:tags/fluids/flight_oxygen',{replace:true,values:['gtceu:oxygen']})
  const metals={steel_blocks:'steel_block',steel_ingots:'steel_ingot',steel_plates:'steel_plate',steel_nuggets:'steel_nugget',
    steel_rods:'steel_rod',iron_rods:'iron_rod',iron_plates:'iron_plate'}
  for(const [tag,id] of Object.entries(metals)) event.addJson('ad_astra:tags/items/'+tag,{replace:true,values:['gtceu:'+id]})
  const fuel = ['ad_astra:fuel','kubejs:lunar_transfer_fuel','ad_astra:cryo_fuel','kubejs:calorite_flight_gel']
  fuel.forEach((id,i)=>event.addJson('ad_astra:tags/fluids/tier_'+(i+1)+'_rocket_fuel',{replace:true,values:[id]}))
  event.addJson('ad_astra:tags/fluids/fuel',{replace:false,values:fuel.slice(1)})
  for(const [ship,id] of [['surveyor','survey_propellant'],['courier','europa_transfer_medium'],['freighter','titan_flight_matrix']])
    event.addJson('gtibd_core:tags/fluids/'+ship+'_fuel',{replace:true,values:['kubejs:'+id]})
})
