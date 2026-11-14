ServerEvents.recipes(event => {
  const ks = id => 'kubejs:' + id
  const gt = id => 'gtceu:' + id
  const ie = id => 'immersiveengineering:' + id
  const create = id => 'create:' + id
  const pnc = id => 'pneumaticcraft:' + id
  const prefix = 'zero_shift:iv_line/'
  const plate = gt('tungsten_steel_plate')
  const circuit = gt('micro_processor_mainframe')
  const backplane = ks('iv_clock_backplane')
  const regulator = ks('iv_grid_regulator')
  const switchStack = ks('iv_switch_stack')
  const arc = ks('iv_arc_plate')
  const bulkhead = ks('iv_bulkhead')
  const lubricant = gt('lubricant')
  const shield = ks('vacuum_shield_gas')
  const fuel = gt('cetane_boosted_diesel')
  const prototype = ks('iv_reference_module')
  const rig = ks('iv_calibration_rig')
  const coupon = ks('iv_stress_coupon')
  const stick = gt('data_stick')

  function machine(type, id, items, output, ticks, power) {
    const recipe = event.recipes.gtceu[type](prefix + id)
    items.forEach(item => recipe.itemInputs(item))
    return recipe.itemOutputs(output).duration(ticks).EUt(power)
  }
  function assemble(id, items, output, ticks, power) {
    return machine('assembler', id, items, output, ticks, power).inputFluids(Fluid.of(lubricant, 850))
  }
  function install(id, items, output, ticks, power) {
    event.remove({ output: output.replace(/^\d+x /, '') })
    return assemble(id, items, output, ticks, power)
  }

  install('grating', [
    gt('steel_machine_casing'), '2x ' + bulkhead, '3x ' + plate, '2x ' + ks('vacuum_gasket'),
    ie('conveyor_basic'), create('brass_funnel')
  ], '4x ' + gt('assembly_line_grating'), 1840, 6144)
  install('laminated_glass', [
    '4x ' + gt('cleanroom_glass'), '2x ' + ks('iv_cable_jacket'), '2x ' + ks('me_optical_link'),
    '2x ' + ks('vacuum_gasket'), '2x ' + pnc('pressure_chamber_glass'), ie('wire_electrum')
  ], '4x ' + gt('laminated_glass'), 1780, 6144)
  install('control_casing', [
    gt('iv_hermetic_casing'), '2x ' + switchStack, regulator, circuit, '2x ' + plate, '2x ' + arc,
    ie('heavy_engineering'), pnc('pressure_chamber_wall')
  ], '2x ' + gt('assembly_line_casing'), 2160, 6144)
  install('assembly_unit', [
    gt('assembly_line_casing'), gt('iv_robot_arm'), gt('iv_conveyor_module'), backplane,
    '2x ' + plate, '2x ' + ks('me_optical_link'), create('mechanical_arm'), pnc('pressure_chamber_interface')
  ], '2x ' + gt('assembly_line_unit'), 2560, 6656)
  install('data_stick', [
    '2x ' + ks('iv_clean_die'), '2x ' + ks('me_memory_foil'), ks('iv_cable_jacket'),
    '2x ' + gt('platinum_plate'), circuit, ie('wire_electrum'), pnc('pressure_gauge_module')
  ], '2x ' + stick, 1980, 6144)
  install('basic_data_access_hatch', [
    gt('ev_input_bus'), gt('iv_machine_hull'), '2x ' + stick, '2x ' + backplane,
    '2x ' + gt('iv_sensor'), '2x ' + arc, create('content_observer'), ie('connector_hv_relay')
  ], gt('basic_data_access_hatch'), 2920, 6656)
  install('assembly_line_controller', [
    gt('iv_machine_hull'), '2x ' + gt('assembly_line_unit'), '2x ' + gt('assembly_line_casing'),
    '4x ' + backplane, '2x ' + gt('iv_robot_arm'), '2x ' + regulator,
    '2x ae2:pattern_provider', '2x ae2:fluix_smart_dense_cable', '2x ' + pnc('pressure_chamber_interface')
  ], gt('assembly_line'), 3860, 7360)

  assemble('build_reference_module', [
    backplane, '2x ' + gt('iv_sensor'), '2x ' + gt('iv_emitter'), '4x ' + plate,
    '2x ' + regulator, '2x ' + circuit, '2x ae2:cell_component_64k', '2x ' + ks('iv_sealed_processor')
  ], prototype, 2800, 7360)
  const rigRecipe = machine('assembly_line', 'build_calibration_rig', [
    prototype, gt('iv_robot_arm'), '2x ' + gt('iv_sensor'), '2x ' + gt('iv_emitter'),
    '2x ' + switchStack, '2x ' + regulator, '4x ' + plate, 'ae2:64k_crafting_storage'
  ], rig, 3800, 7680).inputFluids(Fluid.of(lubricant, 1800)).inputFluids(Fluid.of(shield, 1000))
  rigRecipe['scannerResearch(java.util.function.UnaryOperator)'](builder =>
    builder.researchStack(Item.of(prototype)).dataStack(Item.of(stick)).duration(1200).EUt(4096))
  machine('assembler', 'test_iv_load_coupons', [
    '4x ' + plate, '3x ' + arc, '2x ' + switchStack, circuit, '2x ' + ks('iv_clean_die'),
    ie('coil_hv'), pnc('pressure_gauge_module')
  ], '4x ' + coupon, 2700, 7680)
    .notConsumable(Item.of(rig)).inputFluids(Fluid.of(fuel, 2000))
  machine('assembly_line', 'close_iv_shift', [
    '64x ' + coupon, rig, '10x ' + backplane, '10x ' + regulator, '4x ' + gt('iv_robot_arm'),
    '8x ' + gt('quantum_processor_assembly'), '2x ae2:64k_crafting_storage', '4x ae2:me_p2p_tunnel'
  ], ks('iv_commissioning_report'), 9600, 8000)
    .inputFluids(Fluid.of(lubricant, 6000)).inputFluids(Fluid.of(shield, 4800))
    .inputFluids(Fluid.of(fuel, 12000))

  install('palladium_substation_cell', [
    '4x ' + gt('palladium_dust'), '2x ' + gt('ev_lapotronic_battery'), '2x ' + regulator,
    '4x ' + gt('platinum_plate'), '2x ' + arc, '2x ' + bulkhead
  ], gt('palladium_substation'), 3000, 7360)
  install('power_substation', [
    gt('iv_machine_hull'), '2x ' + gt('palladium_substation'), '2x ' + gt('iv_energy_input_hatch_4a'),
    '2x ' + gt('iv_energy_output_hatch_4a'), '4x ' + regulator,
    '4x ' + gt('robust_machine_casing'), '4x ' + gt('tungsten_quadruple_cable')
  ], gt('power_substation'), 3780, 7680)
})
