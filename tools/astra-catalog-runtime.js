ServerEvents.recipes(event=>{
  gtibdAstraOriginalIds.forEach(id=>event.remove({id:'ad_astra:'+id}))
  var g=id=>'gtceu:'+id,k=id=>'kubejs:'+id,a=id=>'ad_astra:'+id
  gtibdAstraRoutes.forEach(([key,kind,ingredients,out,count])=>{
    var machine={equipment:'assembler',fixture:'assembler',cut:'cutter',saw:'cutter',packing:'packer',ore:'macerator',fire:'alloy_smelter'}[kind]
    var recipe=event.recipes.gtceu[machine]('zero_shift:astral_workshop/'+key)
    ingredients.forEach(([id,n])=>recipe.itemInputs(n===1?id:n+'x '+id))
    var high=/jet_suit|calorite|glacio/.test(key),martian=/ostrum|mars|permafrost/.test(key)
    var power=martian?1536:384,ticks=martian?420:260
    if(kind==='equipment'){
      var tier=high?'luv':martian?'iv':'hv'
      recipe.itemInputs(g(tier+'_electric_motor'),k('chemical_grade_seal'))
        .inputFluids(Fluid.of(g('soldering_alloy'),high?576:288))
      ticks=high?1350:700;power=high?24576:martian?6144:384
    }else if(kind==='fixture'){
      recipe.itemInputs(g('steel_screw')).inputFluids(Fluid.of(g('lubricant'),72))
    }else if(kind==='cut'||kind==='saw'){
      recipe.inputFluids(Fluid.of(g('lubricant'),kind==='saw'?40:72))
    }else if(kind==='packing'){recipe.circuit(1);power=120}
    else if(kind==='fire'){recipe.notConsumable(k('fired_refractory_liner'))}
    recipe.itemOutputs(Item.of(out,count)).duration(ticks).EUt(power)
  })
  if(Platform.isLoaded('patchouli')){
    event.recipes.gtceu.assembler('zero_shift:astral_workshop/astrodux')
      .itemInputs('minecraft:book','minecraft:blue_dye','gtceu:steel_plate','kubejs:hv_arc_shield')
      .inputFluids(Fluid.of(g('glue'),144)).itemOutputs(Item.of('patchouli:guide_book','{\u0022patchouli:book\u0022:\u0022ad_astra:astrodux\u0022}')).duration(360).EUt(384)
  }
  var stations=[['moon','hv','lunar_vacuum_seal'],['mars','ev','martian_pressure_liner'],
    ['mercury','ev','ev_mercury_thermal_insert'],['venus','iv','venus_thermal_screen'],['glacio','luv','luv_glacio_seed'],
    ['europa','zpm','europa_phase_ceramic'],['titan','uv','titan_load_standard']]
  stations.forEach(([planet,tier,cargo])=>{
    var mod=planet==='europa'||planet==='titan'?'zero_shift:':'ad_astra:'
    event.custom({type:'ad_astra:space_station_recipe',dimension:mod+planet+'_orbit',structure:a('space_station'),
      ingredients:[[g(tier+'_machine_casing'),4],[a('large_gas_tank'),8],[k(cargo),4],[k('vacuum_gasket'),12]]
        .map(([id,count])=>({ingredient:{item:id},count:count}))}).id('zero_shift:space/'+planet+'_station')
  })
})
