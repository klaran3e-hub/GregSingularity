ServerEvents.recipes(event => {
  const p = id => 'kubejs:distribution_' + id
  const gt = id => 'gtceu:' + id
  const shield = 'kubejs:vacuum_shield_gas'
  const cold = 'kubejs:chilled_vacuum_coolant'
  const warm = 'kubejs:warm_vacuum_coolant'
  const lubricant = gt('lubricant')
  const recovered = 'kubejs:reclaim_recovered_electrolyte'
  const spent = 'kubejs:reclaim_spent_electrolyte'
  const surface = 'minecraft:overworld'
  const sterile = Java.loadClass('com.gregtechceu.gtceu.api.machine.multiblock.CleanroomType').STERILE_CLEANROOM

  function run(type, id, items, output, seconds, power, fluids) {
    const recipe = event.recipes.gtceu[type]('zero_shift/post_uv_distribution/' + id)
    items.forEach(item => recipe.itemInputs(item))
    fluids.forEach(([fluid, amount]) => recipe.inputFluids(Fluid.of(fluid, amount)))
    return recipe.itemOutputs(output).duration(seconds * 20).EUt(power)
  }

  run('assembly_line', 'distribution_license', [
    'kubejs:reclaim_reclamation_certificate', 'kubejs:post_uv_operations_certificate',
    '8x kubejs:uv_freight_manifest', '8x kubejs:final_heavy_backplane', '8x ae2:quantum_link',
    '16x gtceu:uv_sensor', '8x gtceu:wetware_processor_computer'
  ], '4x ' + p('distribution_license'), 840, 507904,
  [[shield, 18000], [recovered, 24000], [lubricant, 18000]]).dimension(surface)

  event.custom({
    type: 'immersiveengineering:metal_press',
    energy: 320000,
    mold: 'immersiveengineering:mold_plate',
    input: { base_ingredient: { item: 'kubejs:final_heavy_backplane' }, count: 4 },
    result: { item: p('cargo_skeleton'), count: 4 }
  }).id('zero_shift:post_uv_distribution/cargo_skeleton')

  event.custom({
    type: 'pneumaticcraft:pressure_chamber', pressure: 4.9,
    inputs: [
      { type: 'pneumaticcraft:stacked_item', item: p('cargo_skeleton'), count: 4 },
      { type: 'pneumaticcraft:stacked_item', item: 'kubejs:chemical_grade_seal', count: 8 },
      { type: 'pneumaticcraft:stacked_item', item: 'gtceu:polytetrafluoroethylene_plate', count: 8 }
    ],
    results: [{ item: p('sealed_cell'), count: 4 }]
  }).id('zero_shift:post_uv_distribution/sealed_cell')

  const depots = [
    ['surface', surface, 'kubejs:uv_neutronium_coupon', 'gtceu:tritanium_plate', lubricant],
    ['nether', 'minecraft:the_nether', 'kubejs:zpm_nether_isotope_salt', 'gtceu:kanthal_plate', gt('cetane_boosted_diesel')],
    ['end', 'minecraft:the_end', 'kubejs:zpm_end_heavy_concentrate', 'kubejs:uv_naquadria_capsule', shield]
  ]
  depots.forEach(([site, dimension, mineral, backing, fluid]) => {
    run('assembler', site + '_feed', [
      '4x ' + p('sealed_cell'), '16x ' + mineral, '8x ' + backing, '4x ae2:engineering_processor',
      '8x kubejs:reclaim_recovered_collector', '8x kubejs:post_uv_logistics_clock'
    ], '8x ' + p(site + '_feed'), 540, 491520, [[fluid, 16000]])
      .notConsumable(Item.of(p('distribution_license'))).dimension(dimension)

    run('assembly_line', site + '_calibration', [
      '32x ' + p(site + '_feed'), '8x kubejs:post_uv_bus_diagnostic',
      '8x gtceu:uv_electric_pump', '8x kubejs:reclaim_purge_adsorbent',
      '4x ae2:me_p2p_tunnel', '4x kubejs:uv_phase_interlock'
    ], '4x ' + p(site + '_calibration'), 960, 507904,
    [[fluid, 24000], [recovered, 18000]]).dimension(dimension)

    run('chemical_reactor', site + '_pressure_record', [
      '8x ' + p(site + '_feed'), '2x kubejs:post_uv_coolant_isolation_module'
    ], '4x ' + p(site + '_pressure_record'), 720, 491520,
    [[fluid, 16000], [recovered, 14000], [cold, 16000]])
      .outputFluids(Fluid.of(warm, 16000))
      .outputFluids(Fluid.of(spent, 12000))
      .dimension(dimension)
  })

  run('assembly_line', 'distribution_matrix', [
    '16x ' + p('surface_calibration'), '16x ' + p('nether_calibration'), '16x ' + p('end_calibration'),
    '8x ' + p('surface_pressure_record'), '8x ' + p('nether_pressure_record'), '8x ' + p('end_pressure_record'),
    '8x ae2:256k_crafting_storage', '8x ae2:quantum_link', '8x gtceu:network_switch',
    '8x kubejs:post_uv_supply_sync_record', '8x kubejs:reclaim_recovered_collector',
    '8x gtceu:uv_energy_input_hatch_16a', '8x gtceu:uv_energy_output_hatch_16a'
  ], '4x ' + p('distribution_matrix'), 2100, 507904,
  [[cold, 32000], [shield, 24000], [recovered, 24000], [lubricant, 20000]]).dimension(surface)

  run('circuit_assembler', 'load_fingerprint', [
    '4x ' + p('distribution_matrix'), '8x ae2:engineering_processor', '8x gtceu:crystal_processor_mainframe',
    '16x gtceu:uv_sensor', '8x kubejs:uv_grid_witness', '8x kubejs:reclaim_loop_witness'
  ], '4x ' + p('load_fingerprint'), 1200, 507904, [[shield, 16000]]).cleanroom(sterile)

  run('assembly_line', 'network_certificate', [
    '4x ' + p('load_fingerprint'), p('distribution_license'), '16x kubejs:uv_neutronium_coupon',
    '8x gtceu:wetware_processor_computer', '8x gtceu:neutronium_plate',
    '4x ae2:quantum_link', '4x gtceu:uv_lapotronic_battery'
  ], '2x ' + p('network_certificate'), 2700, 507904,
  [[gt('neutronium'), 5760], [cold, 32000], [recovered, 32000], [shield, 28000]])
    .dimension(surface)
    .stationResearch(builder => builder.researchStack(Item.of(p('load_fingerprint')))
      .dataStack(Item.of(gt('data_orb'))).CWUt(64, 576000).EUt(458752))
})
