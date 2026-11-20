ServerEvents.recipes(event => {
  const gt = id => 'gtceu:' + id
  const part = id => 'kubejs:post_uv_' + id
  const uv = id => 'kubejs:uv_' + id
  const shield = 'kubejs:vacuum_shield_gas'
  const cold = 'kubejs:chilled_vacuum_coolant'
  const warm = 'kubejs:warm_vacuum_coolant'
  const permit = part('operations_permit')
  const diagnostic = part('bus_diagnostic')
  const reserve = part('reserve_load_matrix')
  const isolation = part('coolant_isolation_module')
  const clock = part('logistics_clock')
  const loadRecord = part('load_acceptance_record')
  const supplyRecord = part('supply_sync_record')
  const bleedRecord = part('reserve_bleed_record')
  const sterile = Java.loadClass('com.gregtechceu.gtceu.api.machine.multiblock.CleanroomType').STERILE_CLEANROOM

  function machine(type, id, inputs, output, ticks, power) {
    const recipe = event.recipes.gtceu[type]('zero_shift:post_uv_operations/' + id)
    inputs.forEach(input => recipe.itemInputs(input))
    return recipe.itemOutputs(output).duration(ticks).EUt(power)
  }

  machine('assembly_line', 'operations_permit', [
    uv('commissioning_report'), '4x ' + uv('grid_witness'), '4x ' + uv('freight_manifest'),
    '4x gtceu:data_orb', '4x gtceu:wetware_processor_computer', '8x gtceu:neutronium_plate',
    '4x ae2:256k_crafting_storage', '4x ' + uv('phase_interlock')
  ], '16x ' + permit, 14000, 507904)
    .inputFluids(Fluid.of(shield, 12000))
    .inputFluids(Fluid.of(cold, 12000))
    .dimension('minecraft:overworld')

  machine('circuit_assembler', 'bus_diagnostic', [
    '2x ' + permit, '4x gtceu:uv_sensor', '4x ' + uv('grid_witness'),
    '4x gtceu:crystal_processor_mainframe', '4x gtceu:hv_voltage_coil',
    '4x ae2:me_p2p_tunnel'
  ], '4x ' + diagnostic, 9800, 475136)
    .cleanroom(sterile)
    .inputFluids(Fluid.of(shield, 10000))

  machine('assembler', 'reserve_load_matrix', [
    '2x ' + permit, '4x gtceu:uv_naquadria_battery', '4x gtceu:uv_transformer_4a',
    '8x ' + uv('pulse_reserve'), '8x ' + uv('flux_shunt'), '8x kubejs:zpm_reserve_switchgear',
    '8x gtceu:yttrium_barium_cuprate_hex_cable', '4x gtceu:good_electronic_circuit',
    '8x pneumaticcraft:reinforced_pressure_tube'
  ], '4x ' + reserve, 10600, 491520)
    .inputFluids(Fluid.of(gt('lubricant'), 12000))

  machine('chemical_reactor', 'coolant_isolation_module', [
    '2x ' + permit, '4x ' + uv('quench_cassette')
  ], '4x ' + isolation, 10800, 491520)
    .inputFluids(Fluid.of(cold, 12000))
    .inputFluids(Fluid.of(gt('silicone_rubber'), 2304))
    .outputFluids(Fluid.of(warm, 12000))
    .dimension('minecraft:the_nether')

  machine('assembler', 'logistics_clock', [
    '2x ' + permit, '4x ' + uv('freight_manifest'), '4x kubejs:zpm_freight_certificate',
    '4x gtceu:uv_emitter', '4x gtceu:mv_sensor', '4x ae2:quantum_link',
    '4x ae2:pattern_provider', '8x kubejs:zpm_end_heavy_concentrate',
    '4x pneumaticcraft:regulator_tube_module'
  ], '4x ' + clock, 11600, 491520)
    .inputFluids(Fluid.of(shield, 11000))
    .dimension('minecraft:the_end')

  machine('assembly_line', 'load_acceptance_record', [
    '4x ' + diagnostic, '4x ' + reserve, '2x ' + isolation,
    '4x gtceu:uv_energy_input_hatch_16a', '4x gtceu:uv_energy_output_hatch_16a',
    '8x gtceu:neutronium_plate', '4x gtceu:data_orb', '4x ' + uv('phase_interlock')
  ], '2x ' + loadRecord, 16000, 507904)
    .inputFluids(Fluid.of(cold, 14000))
    .inputFluids(Fluid.of(shield, 12000))
    .inputFluids(Fluid.of(gt('cetane_boosted_diesel'), 14000))
    .dimension('minecraft:overworld')

  machine('assembly_line', 'supply_sync_record', [
    '4x ' + diagnostic, '4x ' + clock, '8x ' + uv('naquadria_capsule'), '8x kubejs:zpm_nether_isotope_salt',
    '4x ' + uv('freight_manifest'), '4x gtceu:network_switch', '4x gtceu:data_orb',
    '4x ae2:256k_crafting_storage', '4x ae2:quantum_link'
  ], '2x ' + supplyRecord, 16400, 507904)
    .inputFluids(Fluid.of(shield, 14000))
    .inputFluids(Fluid.of(gt('lubricant'), 14000))
    .inputFluids(Fluid.of(gt('cetane_boosted_diesel'), 12000))
    .dimension('minecraft:overworld')

  machine('chemical_reactor', 'reserve_bleed_record', [
    '4x ' + reserve, '4x ' + isolation
  ], '2x ' + bleedRecord, 16400, 491520)
    .inputFluids(Fluid.of(cold, 16000))
    .inputFluids(Fluid.of(shield, 12000))
    .inputFluids(Fluid.of(gt('silicone_rubber'), 2304))
    .outputFluids(Fluid.of(warm, 16000))
    .dimension('minecraft:overworld')

  const certificate = machine('assembly_line', 'operations_certificate', [
    '2x ' + loadRecord, '2x ' + supplyRecord, '4x ' + bleedRecord, '2x ' + isolation,
    '4x gtceu:wetware_processor_computer', '4x gtceu:crystal_processor_mainframe',
    '8x gtceu:neutronium_plate', '4x ' + uv('grid_witness'),
    '4x ae2:256k_crafting_storage', '8x ' + uv('structural_laminate')
  ], part('operations_certificate'), 18000, 507904)
    .inputFluids(Fluid.of(gt('neutronium'), 4320))
    .inputFluids(Fluid.of(shield, 16000))
    .inputFluids(Fluid.of(cold, 16000))
    .inputFluids(Fluid.of(gt('cetane_boosted_diesel'), 14000))
    .dimension('minecraft:overworld')
  certificate.stationResearch(builder => builder.researchStack(Item.of(supplyRecord))
    .dataStack(Item.of(gt('data_orb'))).CWUt(64, 320000).EUt(393216))
})
