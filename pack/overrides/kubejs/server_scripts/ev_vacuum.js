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
  const getter = ks('ev_vacuum_getter')
  const spent = ks('ev_spent_getter')
  const rinse = ks('ev_clean_rinse')
  const slurry = ks('ev_rutile_slurry')
  const filtered = ks('ev_filtered_coolant')

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
    return machine('vacuum_freezer', id, [input, getter], output, ticks, 480).itemOutputs(spent)
      .inputFluids(Fluid.of(cold, 1000)).inputFluids(Fluid.of(shieldGas, 150))
      .outputFluids(Fluid.of(warm, 1000))
  }
  function compact(id, items, output, count, fluid, amount) {
    return global.fieldworkProcess(event, prefix + id, 'assembler', {
      ingredients: items.map(item => ({ item: item })).concat({ fluid: fluid, amount: amount }),
      results: [{ item: output, count: count }]
    }, 480)
  }

  assemble('vacuum_seal_preform', [
    '3x ' + gt('polyethylene_plate'), '2x ' + seal, '3x ' + grit, aluminium, ks('strainer_mesh'),
    'gtceu:electrum_quadruple_cable', 'gtceu:lv_robot_arm', ks('lunar_vacuum_seal')
  ], '2x ' + ks('vacuum_seal_preform'), 940).inputFluids(Fluid.of(lubricant, 420))
  pressure('press_vacuum_gasket', [ks('vacuum_seal_preform'), seal, pnc('ingot_iron_compressed'), pnc('reinforced_pressure_tube')],
    gasket, 2, 4.5)

  machine('mixer', 'mix_vacuum_ceramic', [
    '6x ' + grit, '3x ' + ks('refractory_mix'), '2x ' + ks('chromite_concentrate'), ks('pressed_insulation'), 'gtceu:dark_ash_dust'
  ], '4x ' + ks('vacuum_tile_mix'), 760, 384).inputFluids(Fluid.of(water, 600))
  event.recipes.gtceu.forming_press(prefix + 'press_vacuum_tile')
      .itemInputs(ks('vacuum_tile_mix')).notConsumable('gtceu:plate_casting_mold')
      .itemOutputs(ks('vacuum_tile_blank')).duration(240).EUt(480)
  machine('electric_blast_furnace', 'sinter_vacuum_tile', [ks('vacuum_tile_blank'), ks('fired_refractory_liner')], tile, 940, 480)
    .blastFurnaceTemp(2500).inputFluids(Fluid.of(shieldGas, 250))
  assemble('vacuum_pump_core', [
    '2x ' + gt('hv_electric_pump'), gt('hv_electric_motor'), '2x ' + tile, '2x ' + gasket,
    gt('stainless_steel_drum'), ks('hv_arc_shield'), '2x ' + hvCircuit, pnc('regulator_tube_module'), 'gtceu:lv_electric_pump'
  ], pumpCore, 1320).inputFluids(Fluid.of(lubricant, 620))
  assemble('frostproof_casing', [
    '6x ' + aluminium, '2x ' + tile, '2x ' + gasket, '2x ' + ks('pressed_steel_frame'), stainless,
    'gtceu:steel_frame', pnc('pressure_chamber_wall')
  ], '2x ' + gt('frostproof_machine_casing'), 880)
  assemble('vacuum_freezer', [
    gt('hv_machine_hull'), '2x ' + pumpCore, '4x ' + gt('frostproof_machine_casing'), '4x ' + hvCircuit,
    '4x ' + gasket, ks('received_refractory_crate'), '2x ' + ks('heat_exchange_core'),
    'gtceu:lv_sensor', pnc('pressure_gauge_module')
  ], gt('vacuum_freezer'), 2120).inputFluids(Fluid.of(lubricant, 950))

  event.recipes.gtceu.chemical_reactor(prefix + 'fill_coolant_loop')
    .itemInputs(ks('paraffin_cake')).itemInputs(ks('strainer_mesh'))
    .inputFluids(Fluid.of(water, 1000)).inputFluids(Fluid.of(shieldGas, 300))
     .outputFluids(Fluid.of(warm, 1000)).duration(760).EUt(384)
  event.recipes.gtceu.chemical_reactor(prefix + 'filter_return_coolant')
    .notConsumable(ks('strainer_mesh')).inputFluids(Fluid.of(warm, 1000)).inputFluids(Fluid.of(water, 100))
    .outputFluids(Fluid.of(filtered, 1000)).outputFluids(Fluid.of(gt('salt_water'), 100)).duration(360).EUt(384)
  event.custom({
    type: 'pneumaticcraft:thermo_plant', exothermic: false, pressure: 3.75,
    fluid_input: { type: 'pneumaticcraft:fluid', fluid: filtered, amount: 1000 },
    temperature: { max_temp: 275 }, fluid_output: { fluid: cold, amount: 1000 }
  }).id(prefix + 'recool_vacuum_loop')

  assemble('pack_vacuum_getter', [ks('strainer_mesh'), ks('activated_carrier'), stainless, gasket], getter, 560)
    .inputFluids(Fluid.of(lubricant, 120))
  machine('chemical_bath', 'regenerate_getter', [spent], getter, 420, 384)
    .inputFluids(Fluid.of(water, 250)).outputFluids(Fluid.of(gt('salt_water'), 100))

  event.recipes.gtceu.mixer(prefix + 'pulverize_ilmenite_slurry')
    .itemInputs('2x ' + gt('crushed_ilmenite_ore'), '2x ' + ks('washed_bauxite'), '2x ' + grit)
    .inputFluids(Fluid.of(water, 500)).outputFluids(Fluid.of(slurry, 1000)).duration(640).EUt(480)
  event.recipes.gtceu.centrifuge(prefix + 'separate_rutile_cake')
    .notConsumable(ks('strainer_mesh')).inputFluids(Fluid.of(slurry, 1000))
    .itemOutputs('2x ' + ks('ev_rutile_filter_cake')).outputFluids(Fluid.of(gt('salt_water'), 500)).duration(700).EUt(480)
  machine('chemical_reactor', 'purify_rutile', ['2x ' + ks('ev_rutile_filter_cake'), ks('lime_flux')],
    '2x ' + ks('purified_rutile'), 920, 480).inputFluids(Fluid.of(water, 250))
    .inputFluids(Fluid.of(shieldGas, 200)).itemOutputs(ks('ore_tailings'))
  machine('mixer', 'load_titanium_charge', [
    '3x ' + ks('purified_rutile'), '3x ' + gt('aluminium_ingot'), tile, ks('chromite_concentrate'), 'gtceu:dark_ash_dust'
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
  event.recipes.gtceu.forming_press(prefix + 'fold_filter_pleat')
    .itemInputs(ks('end_filter_blank'), ks('pressed_insulation')).notConsumable(gt('plate_casting_mold'))
    .itemOutputs('2x ' + ks('ev_filter_pleat')).duration(380).EUt(480)
  assemble('cleanroom_filter_pack', [
    '4x ' + ks('ev_filter_pleat'), tile, gasket, '2x ' + gt('polyethylene_plate'),
    ks('refinery_tray'), pnc('reinforced_pressure_tube')
  ], filterPack, 1040).inputFluids(Fluid.of(water, 400))
  assemble('filter_casing', ['2x ' + filterPack, panel, gt('plascrete'), '2x ' + stainless, gasket],
    '2x ' + gt('filter_casing'), 860)
  assemble('cleanroom', [
    gt('hv_machine_hull'), '2x ' + pumpCore, '4x ' + panel, '2x ' + gt('filter_casing'),
    '4x ' + hvCircuit, '4x ' + gasket, '2x ' + ks('hv_arc_shield'), 'gtceu:gold_single_cable', 'gtceu:lv_sensor'
  ], gt('cleanroom'), 2120).inputFluids(Fluid.of(lubricant, 850))

  assemble('laser_mask', [
    '2x minecraft:glass_pane', tile, ks('ceramic_hv_substrate'), ks('ender_optical_insert'), ks('gold_conductor_blank')
  ], ks('laser_mask'), 640)
  assemble('vacuum_wafer_preform', [
    panel, ks('ceramic_hv_substrate'), '2x ' + ks('chorus_dielectric_film'), gt('phenolic_printed_circuit_board'),
    '2x ' + ks('copper_contact_strip'), gt('electrum_single_wire'), gasket
  ], ks('vacuum_wafer_preform'), 1080).inputFluids(Fluid.of(lubricant, 400))
  vacuum('condition_wafer', ks('vacuum_wafer_preform'), ks('conditioned_wafer'), 620)
  event.recipes.gtceu.chemical_reactor(prefix + 'polish_clean_rinse')
    .notConsumable(filterPack).inputFluids(Fluid.of(water, 1000)).inputFluids(Fluid.of(shieldGas, 200))
    .outputFluids(Fluid.of(rinse, 1000)).duration(520).EUt(480)
  machine('chemical_bath', 'rinse_conditioned_wafer', [ks('conditioned_wafer')], ks('ev_rinsed_wafer'), 480, 480)
    .cleanroom(cleanroom).inputFluids(Fluid.of(rinse, 250)).outputFluids(Fluid.of(gt('salt_water'), 200))
  machine('laser_engraver', 'etch_cleanroom_wafer', [ks('ev_rinsed_wafer'), ks('laser_mask')],
    ks('etched_cleanroom_wafer'), 700, 480).cleanroom(cleanroom)
  machine('circuit_assembler', 'assemble_ev_logic', [
    ks('etched_cleanroom_wafer'), ks('sealed_hv_module'), ks('chorus_dielectric_film'),
    '2x ' + ks('copper_contact_strip'), '2x ' + ks('tin_solder_preform'), gasket
  ], ks('ev_logic_preform'), 900, 480).cleanroom(cleanroom).inputFluids(Fluid.of(shieldGas, 100))
  machine('laser_engraver', 'cut_alignment_coupon', [ks('etched_cleanroom_wafer'), titaniumPlate],
    ks('ev_alignment_coupon'), 840, 1920).cleanroom(cleanroom)
  machine('assembler', 'stamp_liner_preform', ['2x ' + titaniumPlate, gasket, ks('lunar_vacuum_seal'), ks('ev_alignment_coupon')],
    ks('ev_liner_preform'), 980, 1920).inputFluids(Fluid.of(lubricant, 300))
  pressure('seal_ev_control_module', [ks('ev_logic_preform'), gasket, pnc('ingot_iron_compressed'),
    pnc('reinforced_pressure_tube'), 'gtceu:gold_quadruple_cable', ks('lunar_vacuum_seal')], ks('ev_control_module'), 1, 4.6)
  machine('circuit_assembler', 'first_ev_circuit', [
    '2x ' + ks('ev_control_module'), '4x ' + ks('etched_cleanroom_wafer'), '4x ' + hvCircuit,
    '2x ' + ks('gold_conductor_blank'), '2x ' + titaniumPlate, '4x ' + ks('tin_solder_preform')
  ], gt('micro_processor_computer'), 2720, 480).cleanroom(cleanroom).inputFluids(Fluid.of(shieldGas, 400))
})
