ServerEvents.recipes(event => {
  const gt = id => 'gtceu:' + id
  const part = id => 'kubejs:final_' + id
  const prefix = 'zero_shift:final_factory/'
  const permit = 'kubejs:uv_commissioning_report'
  const shield = 'kubejs:vacuum_shield_gas'
  const cold = 'kubejs:chilled_vacuum_coolant'
  const coolant = part('quench_mix')
  const returned = part('return_coolant')
  const lubricant = gt('lubricant')
  const diesel = gt('cetane_boosted_diesel')
  const neutronium = gt('neutronium_plate')
  const tritanium = gt('tritanium_plate')
  const wire = gt('yttrium_barium_cuprate_quadruple_cable')
  const wetware = gt('wetware_processor_computer')
  const sterile = Java.loadClass('com.gregtechceu.gtceu.api.machine.multiblock.CleanroomType').STERILE_CLEANROOM

  function machine(type, id, items, output, ticks, power) {
    const recipe = event.recipes.gtceu[type](prefix + id)
    items.forEach(item => recipe.itemInputs(item))
    if (output) recipe.itemOutputs(output)
    return recipe.duration(ticks).EUt(power)
  }
  function assembly(id, items, output, ticks, power, fluids) {
    const recipe = machine('assembly_line', id, items, output, ticks, power)
    fluids.forEach(([fluid, amount]) => recipe.inputFluids(Fluid.of(fluid, amount)))
    return recipe
  }
  function press(id, materials, output, count) {
    event.custom({
      type: 'pneumaticcraft:pressure_chamber', pressure: 4.9,
      inputs: materials.map(([item, amount]) => ({ type: 'pneumaticcraft:stacked_item', item: item, count: amount })),
      results: [{ item: part(output), count: count }]
    }).id(prefix + id)
  }

  event.recipes.gtceu.forming_press(prefix + 'stamp_backplane')
      .itemInputs('4x kubejs:uv_structural_laminate').notConsumable('gtceu:plate_casting_mold')
      .itemOutputs(part('heavy_backplane')).duration(500).EUt(122880)
  machine('assembler', 'assemble_breaker_core', [
    '4x ' + part('heavy_backplane'), '8x ' + tritanium, '4x ' + neutronium, '4x gtceu:uv_voltage_coil',
    '4x kubejs:uv_flux_shunt', '8x kubejs:hv_switch_contact', '4x gtceu:uv_electric_piston'
  ], '2x ' + part('breaker_core'), 6600, 425984).inputFluids(Fluid.of(lubricant, 7800))
  machine('assembler', 'braze_reserve_bus', [
    '4x ' + part('heavy_backplane'), '8x ' + wire, '8x kubejs:uv_flux_shunt', '4x ' + tritanium,
    '4x kubejs:zpm_reserve_switchgear', '4x gtceu:uv_diode', '4x ' + neutronium
  ], '2x ' + part('reserve_bus'), 7000, 442368).inputFluids(Fluid.of(shield, 8200))
  machine('circuit_assembler', 'calibrate_control_relay', [
    '4x ' + part('breaker_core'), '4x kubejs:uv_phase_interlock', '4x ' + wetware,
    '4x gtceu:crystal_processor_mainframe', '4x ae2:engineering_processor', '4x kubejs:luv_optical_core'
  ], '2x ' + part('control_relay'), 7400, 458752).cleanroom(sterile).inputFluids(Fluid.of(shield, 8600))

  // Advanced ComputerCraft equipment uses the same sterile fabrication chain as the plant console.
  ;[
    ['computer_advanced', 'computer_normal', 'uv_sensor', 'advanced_computer_casing'],
    ['monitor_advanced', 'monitor_normal', 'uv_emitter', 'cleanroom_glass'],
    ['wired_modem', null, 'uv_emitter', 'advanced_computer_casing'],
    ['cable', null, 'uv_voltage_coil', 'computer_casing']
  ].forEach(([id, previous, component, casing]) => {
    const output = 'computercraft:' + id
    event.remove({ output: output })
    const inputs = [
      '4x ' + part('heavy_backplane'), '4x ' + gt(component), '4x ' + gt(casing), '4x kubejs:luv_optical_core',
      '4x kubejs:uv_phase_interlock', '2x ae2:engineering_processor'
    ]
    if (previous) inputs.push('2x computercraft:' + previous)
    machine('assembler', 'build_cc_' + id, inputs, (id === 'cable' ? '16x ' : '1x ') + output, 5600, 393216)
      .notConsumable(Item.of(permit)).inputFluids(Fluid.of(shield, 6600))
  })
  machine('circuit_assembler', 'make_telemetry_unit', [
    '2x ' + part('control_relay'), '2x computercraft:computer_advanced', '4x computercraft:wired_modem',
    '8x computercraft:cable', '4x ae2:cell_component_256k', '4x gtceu:uv_sensor'
  ], '2x ' + part('telemetry_unit'), 7800, 475136).cleanroom(sterile).inputFluids(Fluid.of(shield, 9000))

  assembly('assemble_emergency_rectifier', [
    '4x ' + part('breaker_core'), '4x ' + part('reserve_bus'), '8x gtceu:uv_diode', '4x gtceu:uv_transformer_4a',
    '4x gtceu:uv_energy_output_hatch_4a', '4x ' + wetware, '4x kubejs:uv_pulse_reserve', '4x ' + neutronium
  ], '2x ' + part('emergency_rectifier'), 10600, 507904,
  [[lubricant, 10000], [shield, 9000], [cold, 12000], [diesel, 9000]])
  machine('assembler', 'isolate_reserve_bus', [
    '4x ' + part('reserve_bus'), '4x ' + part('breaker_core'), '2x ' + part('emergency_rectifier'),
    '8x kubejs:chemical_grade_seal', '4x gtceu:uv_transformer_4a', '4x ' + neutronium
  ], '2x ' + part('isolated_bus'), 7400, 475136).inputFluids(Fluid.of(lubricant, 9200))
  machine('assembler', 'assemble_control_rack', [
    '4x ' + part('heavy_backplane'), '4x ' + part('telemetry_unit'), '4x ' + part('control_relay'),
    '4x gtceu:advanced_computer_casing', '4x computercraft:monitor_advanced',
    '4x ae2:256k_crafting_storage', '4x gtceu:uv_sensor'
  ], '2x ' + part('control_rack'), 8200, 491520).inputFluids(Fluid.of(shield, 9800))
  machine('assembler', 'make_test_load', [
    '4x ' + part('isolated_bus'), '4x ' + part('control_relay'), '4x kubejs:uv_grid_witness',
    '4x gtceu:uv_voltage_coil', '4x gtceu:uv_electric_motor', '4x ' + neutronium
  ], '2x ' + part('test_load'), 7900, 491520).inputFluids(Fluid.of(cold, 10000))
  assembly('build_backup_module', [
    '4x ' + part('emergency_rectifier'), '4x ' + part('isolated_bus'), '4x ' + part('test_load'),
    '8x gtceu:uv_lapotronic_battery', '2x gtceu:uv_battery_buffer_4x', '4x kubejs:uv_pulse_reserve',
    '4x ' + part('control_relay'), '4x gtceu:extreme_combustion_engine', '4x ' + neutronium
  ], part('backup_module'), 12000, 507904, [[diesel, 12000], [lubricant, 10000], [cold, 12000], [shield, 9800]])
  assembly('build_control_console', [
    '4x ' + part('control_rack'), '4x ' + part('telemetry_unit'), '4x ' + part('test_load'),
    '4x ' + part('isolated_bus'), '4x gtceu:uv_circuit_assembler', '4x computercraft:computer_advanced',
    '4x ae2:256k_crafting_storage', '8x gtceu:crystal_processor_mainframe', '4x kubejs:uv_freight_manifest'
  ], part('control_console'), 12600, 507904, [[shield, 11000], [cold, 12400], [lubricant, 9800], [diesel, 9600]])
  machine('circuit_assembler', 'encode_start_key', [
    '2x ' + part('control_relay'), '2x ' + part('telemetry_unit'), '2x gtceu:data_orb',
    '4x kubejs:uv_phase_interlock', '4x ' + wetware, 'kubejs:distribution_network_certificate'
  ], '2x ' + part('start_key'), 8200, 491520)
    .cleanroom(sterile).inputFluids(Fluid.of(shield, 9800))

  press('seal_warehouse', [
    ['kubejs:vacuum_gasket', 8], ['kubejs:chemical_grade_seal', 8],
    ['kubejs:uv_structural_laminate', 4], ['ae2:engineering_processor', 4]
  ], 'warehouse_seal', 8)
  const dispatches = [
    ['overworld', ['16x gtceu:tungsten_steel_plate', '8x gtceu:naquadah_alloy_plate', '4x ' + neutronium], lubricant],
    ['the_nether', ['16x kubejs:zpm_nether_isotope_salt', '16x kubejs:refractory_mix', '8x gtceu:polytetrafluoroethylene_plate'], diesel],
    ['the_end', ['16x kubejs:zpm_end_heavy_concentrate', '8x kubejs:uv_naquadria_capsule', '8x kubejs:ender_optical_insert'], shield]
  ]
  dispatches.forEach(([dimension, cargo, fluid]) => {
    const site = dimension === 'overworld' ? dimension : dimension.slice(4)
    machine('assembler', 'certify_' + site + '_dispatch', cargo.concat([
      '4x ' + part('warehouse_seal'), '4x ' + part('telemetry_unit'),
      '2x ae2:quantum_link', '4x ae2:cell_component_256k'
    ]), '4x ' + part(site + '_dispatch'), 8600, 475136).notConsumable(Item.of(permit))
      .inputFluids(Fluid.of(fluid, 10240)).dimension('minecraft:' + dimension)
  })

  machine('mixer', 'blend_quench_mix', [
    '4x kubejs:uv_quench_cassette', '8x kubejs:lime_flux', '4x gtceu:boron_dust'
  ], '', 5200, 425984).inputFluids(Fluid.of(cold, 9600))
    .inputFluids(Fluid.of(gt('distilled_water'), 3200)).outputFluids(Fluid.of(coolant, 12800))
  event.custom({
    type: 'pneumaticcraft:thermo_plant', exothermic: false, pressure: 4.5,
    fluid_input: { type: 'pneumaticcraft:fluid', fluid: returned, amount: 4000 },
    temperature: { max_temp: 270 }, fluid_output: { fluid: coolant, amount: 3000 }
  }).id(prefix + 'recool_quench_mix')
  machine('vacuum_freezer', 'quench_reinforced_billet', ['8x gtceu:tungsten_steel_ingot'],
    '8x ' + part('reinforced_billet'), 6000, 442368)
    .inputFluids(Fluid.of(coolant, 6400)).inputFluids(Fluid.of(gt('neutronium'), 720))
    .outputFluids(Fluid.of(returned, 6400))
  press('mold_polymer_preform', [
    ['gtceu:polyethylene_plate', 16], ['gtceu:polytetrafluoroethylene_plate', 8],
    ['kubejs:uv_structural_laminate', 4], [part('warehouse_seal'), 4]
  ], 'polymer_preform', 8)
  machine('assembler', 'build_optics_panel', [
    '8x kubejs:luv_optical_core', '4x kubejs:uv_phase_interlock', '8x ae2:fluix_smart_dense_cable',
    '4x ' + part('heavy_backplane'), '4x ' + tritanium, '4x kubejs:uv_structural_laminate'
  ], '8x ' + part('optics_panel'), 6800, 458752).inputFluids(Fluid.of(shield, 9000))
  event.custom({
    type: 'ae2:inscriber', mode: 'inscribe',
    ingredients: { middle: { item: part('optics_panel') }, top: { item: 'ae2:engineering_processor_press' } },
    result: { item: part('serial_blank') }
  }).id(prefix + 'inscribe_serial_blank')
  machine('assembler', 'prepare_steel_serial', [
    '8x ' + part('reinforced_billet'), '4x ' + part('warehouse_seal'), '4x ' + part('overworld_dispatch'),
    '4x ' + part('breaker_core'), '4x ' + tritanium, '4x ' + part('heavy_backplane')
  ], '8x ' + part('serial_steel'), 6000, 442368).inputFluids(Fluid.of(lubricant, 8000))
  machine('assembler', 'prepare_polymer_serial', [
    '8x ' + part('polymer_preform'), '4x ' + part('warehouse_seal'), '4x ' + part('nether_dispatch'),
    '4x ' + part('isolated_bus'), '8x kubejs:chemical_grade_seal', '8x gtceu:polyethylene_plate'
  ], '8x ' + part('serial_polymer'), 6200, 458752).inputFluids(Fluid.of(gt('polyethylene'), 9600))
  machine('circuit_assembler', 'prepare_logic_serial', [
    '8x ' + part('serial_blank'), '4x ' + part('end_dispatch'), '4x ' + part('telemetry_unit'),
    '4x ' + wetware, '4x gtceu:crystal_processor_mainframe', '4x ae2:cell_component_256k'
  ], '8x ' + part('serial_logic'), 6400, 475136).cleanroom(sterile).inputFluids(Fluid.of(shield, 9200))
  machine('assembler', 'release_steel_lot', [
    '4x ' + part('serial_steel'), '4x ' + part('reinforced_billet'), '2x ' + part('warehouse_seal'),
    '2x ' + tritanium, '2x ' + part('overworld_dispatch')
  ], '4x ' + part('steel_lot'), 2800, 442368).inputFluids(Fluid.of(lubricant, 7200)).dimension('minecraft:overworld')
  machine('chemical_reactor', 'release_polymer_lot', [
    '4x ' + part('serial_polymer'), '2x ' + part('nether_dispatch')
  ], '4x ' + part('polymer_lot'), 2900, 458752).inputFluids(Fluid.of(gt('polyethylene'), 6400))
    .inputFluids(Fluid.of(coolant, 3200)).outputFluids(Fluid.of(returned, 3200)).dimension('minecraft:overworld')
  machine('circuit_assembler', 'release_logic_lot', [
    '4x ' + part('serial_logic'), '4x ' + part('serial_blank'), '2x ' + part('end_dispatch'),
    '2x ' + part('warehouse_seal'), '2x ae2:engineering_processor'
  ], '4x ' + part('logic_lot'), 3000, 475136).inputFluids(Fluid.of(shield, 7800))
    .cleanroom(sterile).dimension('minecraft:overworld')

  const report = assembly('issue_factory_commissioning_report', [
    part('shift_record'), part('black_start_record'), part('outage_record'), part('concurrent_record'), part('repeat_load_record'), '8x ' + part('test_load'),
    '8x ' + part('control_rack'), '8x ' + part('emergency_rectifier'), '16x kubejs:uv_neutronium_coupon',
    '8x gtceu:crystal_processor_mainframe', '8x ' + wetware, '8x ae2:256k_crafting_storage',
    '8x kubejs:uv_freight_manifest', '8x ' + part('reserve_bus'), 'kubejs:distribution_network_certificate'
  ], part('commissioning_report'), 36000, 507904,
  [[gt('neutronium'), 11520], [shield, 28000], [coolant, 32000], [diesel, 28000]]).dimension('minecraft:overworld')
  report.stationResearch(builder => builder.researchStack(Item.of(part('test_load'))).dataStack(Item.of(gt('data_orb')))
    .CWUt(64, 576000).EUt(458752))
})
