ServerEvents.recipes(event => {
  const id = name => 'zero_shift:fieldwork/' + name
  const k = name => global.gsItemId(name)
  const flint = 'minecraft:flint', gravel = 'minecraft:gravel', stick = 'minecraft:stick'
  const washed = k('washed_fibre'), cord = k('fibre_cord'), lining = k('fired_lining')
  const hammer = '#gtceu:tools/crafting_hammers', knife = '#gtceu:tools/crafting_knives'
  const mortar = '#gtceu:tools/crafting_mortars'
  const loose = (name, output, items) => event.shapeless(output, items).id(id(name))
  const shape = (name, output, grid, keys) => event.shaped(output, grid, keys).id(id(name))
  const hearth = (name, input, output, ticks) => event.custom({
    type: 'minecraft:campfire_cooking', ingredient: {item: input}, result: output,
    experience: 0, cookingtime: ticks
  }).id(id(name))
  const bronze = event.recipes.gtceu
  loose('score_flint', k('scored_flint_core'), [flint, flint, gravel])
  loose('strike_flake', k('flint_shard'), [k('scored_flint_core'), gravel])
  loose('lap_edge', k('lapped_edge'), [k('flint_shard'), '#minecraft:sand', washed])
  loose('tie_retting_bundle', k('retting_bundle'), [k('plant_fibre'), k('plant_fibre')])
  loose('comb_fibre', '2x ' + washed, [k('retted_bundle'), gravel])
  loose('comb_fibre_with_knife', '2x ' + washed, [k('retted_bundle'), knife]).damageIngredient(knife)
  shape('seat_first_blade', 'gtceu:flint_knife', ['EC', 'SW'], {E: k('lapped_edge'), C: cord, S: stick, W: washed})
  loose('notch_haft', k('haft_blank'), [stick, stick, knife]).damageIngredient(knife)
  loose('finish_haft', k('tool_handle'), [k('haft_blank'), washed, '#minecraft:sand', knife]).damageIngredient(knife)
  shape('pin_tenon', k('wedged_tenon'), ['SP', 'CB'], {S: k('rough_slat'), P: k('wooden_peg'), C: cord, B: k('haft_blank')})
  loose('mull_rough_flour', k('camp_dough'), [k('coarse_flour'), k('clay_water_bucket')]).replaceIngredient(k('clay_water_bucket'), k('clay_bucket'))
  hearth('biscuit', k('clay_slip_cake'), k('kiln_biscuit'), 400)
  loose('break_biscuit', '2x ' + k('chamotte'), [k('kiln_biscuit'), hammer]).damageIngredient(hammer)
  loose('mill_biscuit', '4x ' + k('chamotte'), [k('kiln_biscuit'), mortar]).damageIngredient(mortar)
  loose('ramming_mix', '3x ' + k('ramming_mix'), [k('chamotte'), k('sand_temper'), k('clay_slip_cake'), k('clay_slip_cake')])
  shape('form_tuyere', k('green_tuyere'), [' RR', 'RPR', 'RR '], {R: k('ramming_mix'), P: k('wooden_peg')})
  shape('form_mould', k('green_ingot_mould'), ['R R', 'RBR'], {R: k('ramming_mix'), B: k('kiln_biscuit')})
  for (const [raw, fired] of [['green_tuyere','fired_tuyere'], ['green_ingot_mould','ingot_mould']]) {
    event.smelting(k(fired), k(raw)).cookingTime(400).id(id('fire_' + fired))
  }
  shape('bellows', k('hearth_bellows'), ['SCS', 'BFB', 'PJP'], {
    S: k('rough_slat'), C: cord, B: k('tool_binding'), F: washed, P: k('wooden_peg'), J: k('wooden_joint')
  })
  shape('trough', k('ore_washing_trough'), ['S S', 'WCW', 'PJP'], {
    S: k('rough_slat'), W: k('wheel_segment'), C: cord, P: k('wooden_peg'), J: k('wooden_joint')
  })
  shape('slatted_section', '2x ' + k('wheel_segment'), ['SPS', 'SCS'], {
    S: k('rough_slat'), P: k('wooden_peg'), C: cord
  })
  loose('masonry_blocks', '6x ' + k('bloomery_masonry'), ['minecraft:terracotta', 'minecraft:terracotta', lining])
  loose('fired_shell', k('bloomery_shoulder'), [k('bloomery_masonry'), k('bloomery_masonry'), k('fired_tuyere')])
  loose('stack_rim', k('bloomery_stack'), [k('bloomery_masonry'), k('kiln_biscuit'), k('chamotte')])
  loose('tap_basin', k('bloomery_casting_basin'), [k('bloomery_masonry'), k('ingot_mould')])
  event.smelting('minecraft:terracotta','minecraft:clay').id('zero_shift:fieldwork/fire_masonry_clay').cookingTime(180)
  shape('field_bloomery', 'gtceu:field_bloomery', ['LTB', 'GFL', 'CCC'], {
    L: lining, T: k('fired_tuyere'), B: k('hearth_bellows'), G: k('kiln_grate'),
    F: 'minecraft:furnace', C: '#forge:cobblestone'
  })
  const crucible = k('fired_crucible')
  const cast = (name, loadedCrucible, fuel, mould, metal, ticks) => {
    return bronze.field_bloomery(id(name))
      .itemInputs(k(loadedCrucible), fuel).notConsumable(k(mould))
      .itemOutputs(crucible, metal).duration(ticks)
  }
  for (const [metal, output] of [['copper','minecraft:copper_ingot'],['iron',k('iron_bloom')],
    ['tin','gtceu:tin_ingot'],['gold','minecraft:gold_ingot']]) {
    cast('reduce_' + metal, metal + '_charge', '2x #zero_shift:bloomery_fuels', 'ingot_mould', output, 360)
  }
  shape('blend_bronze', k('bronze_charge'), ['C C', ' F ', ' A '], {
    C: k('washed_copper_grit'), F: k('fired_crucible'), A: k('washed_tin_grit')
  })
  bronze.field_bloomery(id('roast_alloy'))
    .itemInputs(k('bronze_charge'), '#zero_shift:bloomery_fuels').notConsumable('#zero_shift:bronze_roast_moulds')
    .itemOutputs(k('roasted_alloy_feed')).duration(200)
  cast('pour_bronze', 'roasted_alloy_feed', '2x #zero_shift:bloomery_fuels', 'ingot_mould', 'gtceu:bronze_ingot', 360)
  shape('reinforce_cast', k('bronze_mould_frame'), ['PCP','RMR',' P '], {
    P:'gtceu:bronze_plate', C:k('copper_strap'), R:k('iron_rivet'), M:k('ingot_mould')
  })
  cast('paired_bronze_cast', 'roasted_alloy_feed', '3x #zero_shift:bloomery_fuels', 'bronze_mould_frame', '2x gtceu:bronze_ingot', 440)
  shape('five_tubes', k('five_tube_register'), ['PTP','TTT','RTR'], {
    T:'gtceu:bronze_small_fluid_pipe', P:k('copper_strap'), R:k('iron_rivet')
  })
  shape('riveted_tube_bank', k('boiler_tube_bank'), ['PBP','RJR','PBP'], {
    P:k('stamped_bronze_blank'), B:k('five_tube_register'), R:k('iron_rivet'), J:k('sealed_boiler_joint')
  })
  shape('forging_saddle', k('forging_saddle'), ['SHS', 'CIC', 'LLL'], {
    S: 'minecraft:stone', H: hammer, C: k('copper_strap'), I: k('hand_forged_plate'), L: lining
  }).damageIngredient(hammer)
  for (const metal of ['tin', 'bronze']) {
    event.remove({id:'gtceu:forge_hammer/hammer_' + metal + '_to_plate'})
  }
  for (const [metal, ingot] of [['iron','minecraft:iron_ingot'],['copper','minecraft:copper_ingot'],['gold','minecraft:gold_ingot'],['tin','gtceu:tin_ingot'],['bronze','gtceu:bronze_ingot']]) {
    var plate = 'gtceu:' + metal + '_plate'
    shape('hand_plate_' + metal, plate, [' H ', 'II ', ' S '], {H: hammer, I: ingot, S: k('forging_saddle')})
      .damageIngredient(hammer).keepIngredient(k('forging_saddle'))
    bronze.forge_hammer(id('steam_plate_' + metal)).itemInputs(ingot).itemOutputs(plate).duration(100).EUt(4)
  }
  shape('stamp_blank', k('stamped_bronze_blank'), [' H ', 'PP ', ' S '], {
    H: hammer, P: 'gtceu:bronze_plate', S: k('forging_saddle')
  }).damageIngredient(hammer).keepIngredient(k('forging_saddle'))
  shape('boiler_seal', k('sealed_boiler_joint'), ['BPB', 'FLF', 'BRB'], {
    B: k('stamped_bronze_blank'), P: lining, F: cord, L: lining, R: k('iron_rivet')
  })
  shape('bush', '2x ' + k('shaft_bushing'), ['LCL','PHP','LCL'], {
    L: lining, C: k('copper_strap'), P: k('wooden_peg'), H: hammer
  }).damageIngredient(hammer)
  shape('spindle', k('turned_spindle'), [' BH',' SJ','B  '], {
    B: k('shaft_bushing'), H: knife, S: k('tool_handle'), J: k('wedged_tenon')
  }).damageIngredient(knife)
  shape('runner', k('grinding_runner'), ['SSS','SBS','SGS'],{
    S: 'minecraft:stone', B: k('shaft_bushing'), G: k('turned_spindle')
  })
  shape('gear_rim', k('gear_rim'), ['PJP','BSB','PJP'], {
    P:'gtceu:bronze_plate', J:k('wooden_joint'), B:k('shaft_bushing'), S:k('turned_spindle')
  })
  shape('pump_barrel', k('hand_pump_barrel'), ['PCP','BSB','PJP'], {
    P:'gtceu:copper_plate', C:k('copper_strap'), B:k('shaft_bushing'), S:k('turned_spindle'), J:k('tool_binding')
  })
  shape('saw_teeth', k('saw_teeth'), ['HPP','P R'],{H:hammer,P:k('hand_forged_plate'),R:k('iron_rivet')}).damageIngredient(hammer)
  shape('saw_blade', k('saw_blade'), ['TTT','IRI','TTT'],{T:k('saw_teeth'),I:k('hand_forged_plate'),R:k('iron_rivet')})
  shape('weave_belt', k('woven_drive_belt'), ['CBC','BBB','CBC'],{C:cord,B:k('tool_binding')})
  bronze.alloy_smelter(id('steam_alloy_bronze')).itemInputs('3x minecraft:copper_ingot','gtceu:tin_ingot')
    .itemOutputs('4x gtceu:bronze_ingot').duration(240).EUt(8)
  bronze.macerator(id('bulk_chamotte')).itemInputs(k('kiln_biscuit')).itemOutputs('6x '+k('chamotte')).duration(80).EUt(4)
  bronze.compressor(id('steam_tenon')).itemInputs('2x ' + k('haft_blank')).itemOutputs(k('wedged_tenon')).duration(180).EUt(4)
  bronze.chemical_bath(id('levigate')).itemInputs('4x minecraft:clay_ball').inputFluids(Fluid.of('minecraft:water',250))
    .itemOutputs('4x '+k('clay_slip_cake')).duration(120).EUt(24)
  bronze.chemical_bath(id('retting')).itemInputs('4x '+k('retting_bundle')).inputFluids(Fluid.of('minecraft:water',250))
    .itemOutputs('4x '+k('retted_bundle')).duration(100).EUt(24)
  for (const metal of ['iron','copper','gold','tin']) {
    bronze.chemical_bath(id('wash_' + metal)).itemInputs('4x '+k(metal+'_grit')).inputFluids(Fluid.of('minecraft:water',250))
      .itemOutputs('4x '+k('washed_'+metal+'_grit'),'4x '+k('ore_tailings')).duration(160).EUt(24)
  }
})
