ServerEvents.recipes(event => {
  const ad = name => 'ad_astra:' + name
  const gt = name => 'gtceu:' + name
  const k = name => 'kubejs:' + name
  const oil = k('mv_dielectric_oil')
  const lube = gt('lubricant')
  const solder = gt('soldering_alloy')
  const steel = gt('stainless_steel_plate')
  const seal = k('chemical_grade_seal')
  const winding = k('kanthal_winding')
  const frame = k('pressed_steel_frame')
  const gasket = k('lunar_vacuum_seal')
  const martian = k('martian_pressure_liner')
  const screen = k('venus_thermal_screen')
  const crystal = k('glacio_reference_crystal')
  const prefix = 'zero_shift:space/'
  function process(type, id, items, fluid, amount, result, ticks, eu) {
    const recipe = event.recipes.gtceu[type](prefix + id)
    items.forEach(item => recipe.itemInputs(item))
    if (fluid) recipe.inputFluids(Fluid.of(fluid, amount))
    return recipe.itemOutputs(result).duration(ticks).EUt(eu)
  }
  function part(name, items, fluid, amount, ticks, eu, count) {
    const output = ad(name)
    event.remove({output:output})
    return process('assembler', name, items, fluid, amount, Item.of(output,count || 1), ticks, eu || 480)
  }

  event.remove({id:ad('alloying/steel_ingot_from_alloying_iron_ingot_and_coals')})
  ;['steel_ingot','steel_nugget','steel_block','steel_rod','iron_rod','iron_plate','steel_plate'].forEach(name=>event.remove({output:ad(name)}))
  event.replaceInput({mod:'ad_astra'},ad('steel_rod'),gt('steel_rod'))
  event.replaceInput({mod:'ad_astra'},ad('iron_rod'),gt('iron_rod'))
  const auxiliary=[
    ['coal_generator',gt('hv_machine_casing'),gt('hv_electric_motor')],
    ['compressor',gt('hv_compressor'),gt('hv_electric_piston')],
    ['etrionic_blast_furnace',gt('hv_machine_casing'),gt('kanthal_coil_block')],
    ['water_pump',gt('hv_electric_pump'),gt('hv_machine_casing')],
    ['energizer',gt('hv_machine_hull'),gt('hv_electric_motor')],
    ['solar_panel',gt('hv_machine_hull'),gt('advanced_integrated_circuit')]
  ]
  auxiliary.forEach(([name,body,drive])=>part(name,[body,drive,'2x '+steel,winding,k('hv_arc_shield')],oil,400,840))
  const frameRecipe = ad('engine_frame')
  event.remove({output:frameRecipe})
  process('forming_press','nether_engine_frame',['4x ' + steel,'2x ' + winding,k('hot_kanthal_billet'),k('hv_arc_shield')],null,0,frameRecipe,640,384)
    .dimension('minecraft:the_nether')
  part('rocket_fin',['2x '+steel,k('fired_refractory_liner'),winding,frame],lube,200,360,384,2)
  part('rocket_nose_cone',['4x '+steel,'2x '+k('ceramic_hv_substrate'),k('hv_switch_contact'),k('fired_refractory_liner')],solder,288,660)
  part('gas_tank',['2x '+steel,gt('steel_small_fluid_pipe'),'2x '+seal,k('drum_liner')],lube,250,420,384)
  part('large_gas_tank',['2x '+ad('gas_tank'),gt('stainless_steel_drum'),'2x '+seal,k('hv_arc_shield')],lube,500,580)
  part('oxygen_gear',[ad('gas_tank'),gt('hv_electric_pump'),gt('steel_small_fluid_pipe'),seal,k('mv_impregnated_insulation')],oil,250,580)
  part('oxygen_loader',[gt('hv_machine_casing'),ad('oxygen_gear'),ad('gas_tank'),gt('hv_electric_pump'),gt('advanced_integrated_circuit'),gt('gold_single_cable')],oil,500,920)
  part('steel_tank',[ad('gas_tank'),'4x '+steel,'2x '+winding,ad('engine_frame'),'2x '+seal],lube,450,620)
  part('steel_engine',[ad('engine_frame'),gt('hv_electric_motor'),gt('hv_electric_pump'),'4x '+winding,'2x '+steel,k('hv_switch_contact')],oil,650,1180)
  part('launch_pad',['2x '+gt('hv_machine_casing'),'4x '+frame,'4x '+steel,'2x '+k('hv_arc_shield'),gt('gold_single_cable')],solder,576,930)
  part('nasa_workbench',[gt('hv_machine_hull'),gt('hv_robot_arm'),'2x '+gt('advanced_integrated_circuit'),ad('engine_frame'),'4x '+steel,k('mv_impregnated_insulation')],oil,750,1320)
  event.custom({type:ad('space_station_recipe'),dimension:ad('earth_orbit'),structure:ad('space_station'),
    ingredients:[[steel,32],[frame,12],[ad('gas_tank'),8],[k('hv_arc_shield'),4]].map(row=>({ingredient:{item:row[0]},count:row[1]}))
  }).id(prefix+'earth_orbit_station')
  const suits = [['space_helmet',ad('gas_tank'),'minecraft:glass_pane'],['space_suit',ad('oxygen_gear'),ad('gas_tank')],
    ['space_pants',ad('gas_tank'),gt('steel_ring')],['space_boots',k('fired_refractory_liner'),gt('steel_spring')]]
  suits.forEach(([name,tool,lining]) => part(name,[tool,lining,'2x '+steel,'2x '+k('mv_impregnated_insulation'),'2x '+seal],oil,250,520,384))
  part('oxygen_distributor',[gt('hv_machine_hull'),ad('oxygen_loader'),ad('large_gas_tank'),'2x '+ad('desh_plate'),gasket,gt('hv_electric_pump')],oil,600,900)
  part('fuel_refinery',[gt('hv_distillery'),gt('hv_electric_pump'),k('heat_exchange_core'),'2x '+k('refinery_tray'),seal],lube,600,1050)

  event.remove({type:ad('refining')})
  event.remove({id:ad('oxygen_loading/oxygen_from_oxygen_loading_water')})
  event.recipes.gtceu.chemical_reactor(prefix+'flight_fuel')
    .itemInputs(k('cracking_catalyst')).inputFluids(Fluid.of(gt('diesel'),1000),Fluid.of(gt('refinery_gas'),250))
    .itemOutputs(k('activated_carrier')).outputFluids(Fluid.of(k('stabilized_flight_blend'),1000)).duration(540).EUt(384)
  event.custom({type:ad('oxygen_loading'),input:{ingredient:{tag:'zero_shift:flight_oxygen'},millibuckets:10},
    result:{fluid:ad('oxygen'),millibuckets:10},cookingtime:1,energy:30}).id(prefix+'load_flight_oxygen')
  event.recipes.gtceu.canner(prefix+'breathable_oxygen')
    .notConsumable(k('strainer_mesh')).inputFluids(Fluid.of(gt('oxygen'),1000))
    .outputFluids(Fluid.of(ad('oxygen'),1000)).duration(240).EUt(384)
  event.custom({type:ad('refining'),input:{ingredient:{tag:'zero_shift:flight_blend'},millibuckets:5},
    result:{fluid:ad('fuel'),millibuckets:5},cookingtime:1,energy:30}).id(prefix+'refine_flight_blend')
  event.recipes.gtceu.distillery(prefix+'distill_flight_blend').notConsumable(ad('fuel_refinery'))
    .inputFluids(Fluid.of(k('stabilized_flight_blend'),1000)).outputFluids(Fluid.of(ad('fuel'),1000)).duration(400).EUt(384)
  part('cryo_freezer',[gt('ev_machine_casing'),ad('fuel_refinery'),gasket,'2x '+gt('titanium_plate'),gt('ev_electric_pump')],oil,650,1000,1920)
  ;['ice','packed_ice','blue_ice'].forEach(ice=>event.remove({id:ad('cryo_freezing/cryo_fuel_from_cryo_freezing_'+ice)}))
  event.recipes.gtceu.chemical_reactor(prefix+'cryo_fuel')
    .itemInputs(ad('ice_shard')).inputFluids(Fluid.of(ad('fuel'),1000),Fluid.of(k('chilled_vacuum_coolant'),200))
    .outputFluids(Fluid.of(ad('cryo_fuel'),1000),Fluid.of(k('warm_vacuum_coolant'),200)).duration(600).EUt(1920)

  const metals = [['desh','moon',480,1750],['ostrum','mars',1920,2450],['calorite','venus',7680,2700]]
  metals.forEach(([metal,world,eu,temperature]) => {
    for (const raw of ['raw_'+metal, 'raw_'+metal+'_block', world+'_'+metal+'_ore', 'deepslate_'+metal+'_ore']) {
      for (const form of ['ingot','nugget','plate']) event.remove({input:ad(raw),output:ad(metal+'_'+form)})
    }
    event.remove({mod:'ad_astra',output:ad(metal+'_ingot'),type:'minecraft:smelting'})
    event.remove({mod:'ad_astra',output:ad(metal+'_ingot'),type:'minecraft:blasting'})
    event.remove({output:ad(metal+'_plate')})
    process('electric_blast_furnace','smelt_'+metal,[k('mill_'+world+'_assay'),k('lime_flux')],gt('argon'),100,'2x '+ad(metal+'_ingot'),620,eu).blastFurnaceTemp(temperature)
    process('bender','roll_'+metal,[ad(metal+'_ingot')],null,0,ad(metal+'_plate'),310,eu)
  })
  process('assembler','lunar_vacuum_seal',[k('mill_moon_assay'),gt('raw_bauxite'),'2x '+steel,winding,k('pressure_gasket')],oil,250,'2x '+gasket,640,384).dimension(ad('moon'))
  for (const [piece, lining] of [['helmet',gt('cleanroom_glass')],['suit',ad('oxygen_gear')],['pants',gt('titanium_ring')],['boots',k('sintered_vacuum_tile')]]) {
    part('netherite_space_'+piece, [ad('space_'+piece),'2x '+ad('ostrum_plate'),gt('titanium_plate'),
      'minecraft:netherite_ingot',lining,k('vacuum_gasket')],k('ev_clean_rinse'),250,800,1920)
  }
  process('chemical_bath','mercury_thermal_insert',[k('mill_mercury_assay')],
    k('chilled_vacuum_coolant'),500,k('ev_mercury_thermal_insert'),900,1920)
    .outputFluids(Fluid.of(k('warm_vacuum_coolant'),500)).dimension(ad('mercury'))
  process('assembler','martian_pressure_liner',[k('mill_mars_assay'),gt('raw_scheelite'),'2x '+ad('ostrum_plate'),k('ev_liner_preform'),k('ev_mercury_thermal_insert')],k('ev_clean_rinse'),500,'2x '+martian,820,1920).dimension(ad('mars'))
  process('chemical_bath','wash_martian_grain',[k('mill_mars_assay')],k('tungsten_leach_solution'),500,
    '2x '+k('iv_mars_refractory_grain'),760,6144)
    .outputFluids(Fluid.of(k('spent_tungsten_leach'),500)).dimension(ad('mars'))
  process('assembler','venus_thermal_screen',[k('iv_venus_panel_blank'),k('mill_venus_assay'),k('iv_mars_refractory_grain'),
    '2x '+k('sintered_vacuum_tile'),winding],solder,576,'2x '+screen,1000,7680).dimension(ad('venus'))
  process('assembler','glacio_reference_crystal',[k('luv_glacio_seed'),k('luv_venus_timing_prism'),k('luv_plasma_coupon'),
    gt('raw_naquadah'),'4x '+ad('ice_shard'),k('luv_ceres_salt_concentrate')],k('luv_optical_coolant'),750,'2x '+crystal,1260,30720)
    .notConsumable(k('luv_cryo_cartridge')).dimension(ad('glacio'))

  const rockets = [
    ['steel','hv',480,ad('engine_frame'),null,[gt('hv_machine_casing'),gt('hv_machine_casing'),frame,frame,k('fired_refractory_liner'),k('fired_refractory_liner')]],
    ['desh','ev',1920,gasket,'steel',[]],['ostrum','iv',7680,martian,'desh',[]],['calorite','luv',30720,screen,'ostrum',[]]
  ]
  rockets.forEach(([metal,tier,eu,local,previous,skin],index) => {
    if (previous) {
      part(metal+'_tank',[ad(previous+'_tank'),'4x '+ad(metal+'_plate'),local,gt(tier+'_electric_pump'),seal],lube,650,820,eu)
      part(metal+'_engine',[ad(previous+'_engine'),ad('engine_frame'),'4x '+ad(metal+'_plate'),local,gt(tier+'_electric_motor'),gt(tier+'_electric_pump')],oil,850,1220,eu)
      var plate=ad(metal+'_plate'); skin=[ad('tier_'+index+'_rocket'),local,plate,plate,plate,plate]
    }
    const name='tier_'+(index+1)+'_rocket', fin=ad('rocket_fin'),tank=ad(metal+'_tank'),engine=ad(metal+'_engine')
    const parts=[ad('rocket_nose_cone')].concat(skin,[fin,tank,tank,fin,fin,engine,fin])
    event.remove({output:ad(name)})
    event.remove({id:ad('nasa_workbench/'+name+'_from_nasa_workbench')})
    event.custom({type:ad('nasa_workbench'),ingredients:parts.map(item=>({item:item})),result:{id:ad(name),count:1}}).id(prefix+'nasa_'+name)
    const counts={};parts.forEach(id=>counts[id]=(counts[id]||0)+1)
    process('assembler','automate_'+name,Object.keys(counts).map(id=>Item.of(id,counts[id])),solder,576*(index+1),ad(name),1380+240*index,eu)
      .notConsumable(ad('nasa_workbench'))
  })
})
