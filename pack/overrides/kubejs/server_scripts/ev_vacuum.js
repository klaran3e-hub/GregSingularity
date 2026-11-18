ServerEvents.recipes(event => {
  const ks = name => 'kubejs:' + name
  const gt = name => 'gtceu:' + name
  const prefix = 'zero_shift:vacuum/'
  const cleanroom = Java.loadClass('com.gregtechceu.gtceu.api.machine.multiblock.CleanroomType').CLEANROOM
  const grit = ks('endstone_grit')
  const seal = ks('chemical_grade_seal')
  const gasket = ks('vacuum_gasket')
  const tile = ks('sintered_vacuum_tile')
  const panel = ks('vacuum_treated_panel')
  const pumpCore = ks('vacuum_pump_core')
  const filterPack = ks('cleanroom_filter_pack')
  const stainless = gt('stainless_steel_plate')
  const aluminium = gt('aluminium_plate')
  const titanium = gt('titanium_ingot')
  const hotTitanium = gt('hot_titanium_ingot')
  const titaniumPlate = gt('titanium_plate')
  const hvCircuit = gt('advanced_integrated_circuit')
  const cold = ks('chilled_vacuum_coolant')
  const warm = ks('warm_vacuum_coolant')
  const shieldGas = ks('vacuum_shield_gas')
  const water = gt('distilled_water')
  const ie = name => 'immersiveengineering:' + name
  const create = name => 'create:' + name
  const pnc = name => 'pneumaticcraft:' + name
  const lubricant = gt('lubricant')

  const replacements = [
    gt('vacuum_freezer'), gt('frostproof_machine_casing'), gt('cleanroom'), gt('cleanroom_glass'),
    gt('filter_casing'), gt('sterilizing_filter_casing'), gt('plascrete'),
    titanium, titaniumPlate, gt('micro_processor_computer'), gt('nano_processor_assembly'), gt('quantum_processor')
  ]
  replacements.forEach(output => event.remove({ output: output }))
  event.remove({ id: /^gtceu:(?:electric_blast_furnace|alloy_blast_smelter|vacuum_freezer)\/.*(?:^|[\/_])titanium(?:_ingot)?$/ })

  function machine(type, id, items, output, ticks, power) {
    const recipe = event.recipes.gtceu[type](prefix + id)
    items.forEach(item => recipe.itemInputs(item))
    return recipe.itemOutputs(output).duration(ticks).EUt(power)
  }
  function assemble(id, items, output, ticks) {
    return machine('assembler', id, items, output, ticks, 480)
  }
  function pressure(id, items, output, count, bar) {
    return event.custom({
      type: 'pneumaticcraft:pressure_chamber',
      inputs: items.map(item => ({ item: item })),
      pressure: bar,
      results: [{ item: output, count: count }]
    }).id(prefix + id)
  }
  function vacuum(id, input, output, ticks) {
    return machine('vacuum_freezer', id, [input], output, ticks, 480)
      .inputFluids(Fluid.of(cold, 1000)).inputFluids(Fluid.of(shieldGas, 150))
      .outputFluids(Fluid.of(warm, 1000))
  }
  function compact(id, items, output, count, fluid, amount) {
    return event.custom({
      type: create('compacting'), heatRequirement: 'heated',
      ingredients: items.map(item => ({ item: item })).concat({ fluid: fluid, amount: amount }),
      results: [{ item: output, count: count }]
    }).id(prefix + id)
  }

  assemble('vacuum_seal_preform', [
    '3x ' + gt('polyethylene_plate'), '2x ' + seal, '3x ' + grit, aluminium, ks('strainer_mesh'),
    ie('wirecoil_electrum_ins'), create('precision_mechanism')
  ], '2x ' + ks('vacuum_seal_preform'), 940).inputFluids(Fluid.of(lubricant, 420))
  pressure('press_vacuum_gasket', [ks('vacuum_seal_preform'), seal, pnc('ingot_iron_compressed'), pnc('reinforced_pressure_tube')],
    gasket, 2, 4.5)

  machine('mixer', 'mix_vacuum_ceramic', [
    '6x ' + grit, '3x ' + ks('refractory_mix'), '2x ' + ks('chromite_concentrate'), ks('pressed_insulation'), ie('slag')
  ], '4x ' + ks('vacuum_tile_mix'), 760, 384).inputFluids(Fluid.of(water, 600))
  event.custom({
    type: ie('metal_press'), energy: 36000, mold: ie('mold_plate'),
    input: { item: ks('vacuum_tile_mix') }, result: { item: ks('vacuum_tile_blank') }
  }).id(prefix + 'press_vacuum_tile')
  machine('electric_blast_furnace', 'sinter_vacuum_tile', [ks('vacuum_tile_blank'), ks('fired_refractory_liner')], tile, 940, 480)
    .blastFurnaceTemp(2500).inputFluids(Fluid.of(shieldGas, 250))
  assemble('vacuum_pump_core', [
    '2x ' + gt('hv_electric_pump'), gt('hv_electric_motor'), '2x ' + tile, '2x ' + gasket,
    gt('stainless_steel_drum'), ks('hv_arc_shield'), '2x ' + hvCircuit, pnc('regulator_tube_module'), ie('fluid_pump')
  ], pumpCore, 1320).inputFluids(Fluid.of(lubricant, 620))
  assemble('frostproof_casing', [
    '6x ' + aluminium, '2x ' + tile, '2x ' + gasket, '2x ' + ks('pressed_steel_frame'), stainless,
    ie('heavy_engineering'), pnc('pressure_chamber_wall')
  ], '2x ' + gt('frostproof_machine_casing'), 880)
  assemble('vacuum_freezer', [
    gt('hv_machine_hull'), '2x ' + pumpCore, '4x ' + gt('frostproof_machine_casing'), '4x ' + hvCircuit,
    '4x ' + gasket, ks('received_refractory_crate'), '2x ' + ks('heat_exchange_core'),
    create('content_observer'), pnc('pressure_gauge_module')
  ], gt('vacuum_freezer'), 2120).inputFluids(Fluid.of(lubricant, 950))

  event.recipes.gtceu.chemical_reactor(prefix + 'fill_coolant_loop')
    .itemInputs(ks('paraffin_cake')).itemInputs(ks('strainer_mesh'))
    .inputFluids(Fluid.of(water, 1000)).inputFluids(Fluid.of(shieldGas, 300))
     .outputFluids(Fluid.of(warm, 1000)).duration(760).EUt(384)
  event.custom({
    type: 'pneumaticcraft:thermo_plant', exothermic: false, pressure: 3.25,
    fluid_input: { type: 'pneumaticcraft:fluid', fluid: warm, amount: 1000 },
    temperature: { max_temp: 278 }, fluid_output: { fluid: cold, amount: 1000 }
  }).id(prefix + 'recool_vacuum_loop')

  machine('chemical_reactor', 'purify_rutile', ['2x ' + ks('washed_bauxite'), '2x ' + grit],
    ks('purified_rutile'), 920, 480).inputFluids(Fluid.of(water, 500))
    .inputFluids(Fluid.of(shieldGas, 200)).itemOutputs(ks('ore_tailings'))
  machine('mixer', 'load_titanium_charge', [
    '3x ' + ks('purified_rutile'), '3x ' + gt('aluminium_ingot'), tile, ks('chromite_concentrate'), ie('slag')
  ], '2x ' + ks('titanium_reduction_charge'), 920, 480).inputFluids(Fluid.of(water, 450))
  machine('electric_blast_furnace', 'blast_titanium', [ks('titanium_reduction_charge')],
    ks('hot_titanium_billet'), 1200, 480).blastFurnaceTemp(2700).inputFluids(Fluid.of(gt('argon'), 400))
  vacuum('quench_titanium', ks('hot_titanium_billet'), titanium, 940)

  // The native routes expand production after the pack's first titanium ingot.
  function titaniumBlast(id, heat, ticks) {
    event.remove({ id: gt('electric_blast_furnace/' + id) })
    return event.recipes.gtceu.electric_blast_furnace(gt(id))
      .itemOutputs(hotTitanium).duration(ticks).EUt(480).blastFurnaceTemp(heat)
  }
  titaniumBlast('blast_titanium_gas', 1941, 1005)
    .itemInputs(gt('titanium_dust')).circuit(2).notConsumable(titanium)
    .inputFluids(Fluid.of(gt('helium'), 100))
  titaniumBlast('titanium_from_tetrachloride', 2141, 800)
    .itemInputs('2x ' + gt('magnesium_dust')).notConsumable(titanium)
    .inputFluids(Fluid.of(gt('titanium_tetrachloride'), 1000))
    .itemOutputs('6x ' + gt('magnesium_chloride_dust'))
  titaniumBlast('titanium_trifluoride_separation', 1941, 900)
    .itemInputs('4x ' + gt('titanium_trifluoride_dust')).notConsumable(titanium)
    .inputFluids(Fluid.of(gt('hydrogen'), 3000))
    .outputFluids(Fluid.of(gt('hydrofluoric_acid'), 3000))
  machine('chemical_reactor', 'cool_hot_titanium', [hotTitanium], titanium, 940, 1920)
    .notConsumable(titanium)
    .inputFluids(Fluid.of(cold, 1000)).inputFluids(Fluid.of(shieldGas, 150))
    .outputFluids(Fluid.of(warm, 1000))

  machine('bender', 'roll_titanium_plate', [titanium], titaniumPlate, 620, 480)

  compact('clean_panel_blank', [
    tile, tile, gt('polyethylene_plate'), gt('polyethylene_plate'), stainless, stainless, gasket,
    ks('pressed_insulation'), gt('electrum_single_wire')
  ], ks('clean_panel_blank'), 2, shieldGas, 180)
  machine('electric_blast_furnace', 'fire_clean_panel', [ks('clean_panel_blank')], ks('hot_clean_panel'),
    680, 480).blastFurnaceTemp(2480).inputFluids(Fluid.of(shieldGas, 200))
  vacuum('quench_clean_panel', ks('hot_clean_panel'), panel, 480)

  assemble('plascrete', ['2x ' + panel, '2x ' + tile, gasket, '2x ' + ks('pressed_steel_frame')],
    '4x ' + gt('plascrete'), 780)
  assemble('cleanroom_glass', ['4x minecraft:glass_pane', panel, '2x ' + gasket, tile],
    '2x ' + gt('cleanroom_glass'), 700)
  assemble('cleanroom_filter_pack', [
    '2x ' + ks('end_filter_blank'), '2x ' + ks('pressed_insulation'), tile, gasket, '2x ' + gt('polyethylene_plate'),
    ks('refinery_tray'), pnc('reinforced_pressure_tube')
  ], filterPack, 1040)
  assemble('filter_casing', ['2x ' + filterPack, panel, gt('plascrete'), '2x ' + stainless, gasket],
    '2x ' + gt('filter_casing'), 860)
  assemble('cleanroom', [
    gt('hv_machine_hull'), '2x ' + pumpCore, '4x ' + panel, '2x ' + gt('filter_casing'),
    '4x ' + hvCircuit, '4x ' + gasket, '2x ' + ks('hv_arc_shield'), ie('connector_hv'), create('content_observer')
  ], gt('cleanroom'), 2120).inputFluids(Fluid.of(lubricant, 850))

  assemble('laser_mask', [
    '2x minecraft:glass_pane', tile, ks('ceramic_hv_substrate'), ks('ender_optical_insert'), ks('gold_conductor_blank')
  ], ks('laser_mask'), 640)
  assemble('vacuum_wafer_preform', [
    panel, ks('ceramic_hv_substrate'), '2x ' + ks('chorus_dielectric_film'), gt('phenolic_printed_circuit_board'),
    '2x ' + ks('copper_contact_strip'), gt('electrum_single_wire'), gasket
  ], ks('vacuum_wafer_preform'), 1080).inputFluids(Fluid.of(lubricant, 400))
  vacuum('condition_wafer', ks('vacuum_wafer_preform'), ks('conditioned_wafer'), 620)
  machine('laser_engraver', 'etch_cleanroom_wafer', [ks('conditioned_wafer'), ks('laser_mask')],
    ks('etched_cleanroom_wafer'), 700, 480).cleanroom(cleanroom)
  machine('circuit_assembler', 'assemble_ev_logic', [
    ks('etched_cleanroom_wafer'), ks('sealed_hv_module'), ks('chorus_dielectric_film'),
    '2x ' + ks('copper_contact_strip'), '2x ' + ks('tin_solder_preform'), gasket
  ], ks('ev_logic_preform'), 900, 480).cleanroom(cleanroom).inputFluids(Fluid.of(shieldGas, 100))
  pressure('seal_ev_control_module', [ks('ev_logic_preform'), gasket, pnc('ingot_iron_compressed'),
    pnc('reinforced_pressure_tube'), ie('connector_hv_relay')], ks('ev_control_module'), 1, 4.6)
  machine('circuit_assembler', 'first_ev_circuit', [
    '2x ' + ks('ev_control_module'), '4x ' + ks('etched_cleanroom_wafer'), '4x ' + hvCircuit,
    '2x ' + ks('gold_conductor_blank'), '2x ' + titaniumPlate, '4x ' + ks('tin_solder_preform')
  ], gt('micro_processor_computer'), 2720, 480).cleanroom(cleanroom).inputFluids(Fluid.of(shieldGas, 400))
})
