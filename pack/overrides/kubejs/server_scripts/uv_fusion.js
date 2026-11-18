ServerEvents.recipes(event => {
  const gt = id => 'gtceu:' + id
  const part = id => 'kubejs:uv_' + id
  const tritanium = gt('tritanium_plate')
  const americium = gt('americium_plate')
  const shield = 'kubejs:vacuum_shield_gas'
  const cold = 'kubejs:chilled_vacuum_coolant'
  const warm = 'kubejs:warm_vacuum_coolant'
  const lubricant = gt('lubricant')
  const laminate = part('structural_laminate')
  const shunt = part('flux_shunt')
  const interlock = part('phase_interlock')
  const reserve = part('pulse_reserve')
  const standard = part('reactor_standard')
  const field = part('field_cassette')
  const capsule = part('naquadria_capsule')
  const coupon = part('neutronium_coupon')
  const coolantCassette = part('quench_cassette')
  const witness = part('grid_witness')
  const neutronium = gt('neutronium')
  const permit = 'kubejs:zpm_commissioning_report'

  function machine(type, id, items, output, ticks, power) {
    const recipe = event.recipes.gtceu[type]('zero_shift:uv_fusion/' + id)
    items.forEach(item => recipe.itemInputs(item))
    if (output) recipe.itemOutputs(output)
    return recipe.duration(ticks).EUt(power)
  }
  function research(recipe, sample, rate, total, power) {
    recipe.stationResearch(builder => builder.researchStack(Item.of(sample)).dataStack(Item.of(gt('data_orb')))
      .CWUt(rate, total).EUt(power))
  }

  ;['fusion_casing_mk3', 'uv_fusion_reactor', 'neutronium_plate', 'neutronium_ingot',
    'wetware_processor_computer', 'crystal_processor_mainframe', 'network_switch']
    .forEach(id => event.remove({ output: gt(id) }))

  // Keep sulfate recovery available once the Mk III has made the first Naquadria.
  event.remove({ id: gt('electric_blast_furnace/naquadria_sulfate_separation') })
  event.recipes.gtceu.electric_blast_furnace(gt('naquadria_sulfate_separation'))
    .itemInputs('6x gtceu:naquadria_sulfate_dust').notConsumable(Item.of(gt('naquadria_ingot')))
    .inputFluids(Fluid.of(gt('hydrogen'), 2000)).itemOutputs(gt('hot_naquadria_ingot'))
    .outputFluids(Fluid.of(gt('sulfuric_acid'), 1000)).blastFurnaceTemp(9000).duration(600).EUt(122880)

  machine('assembler', 'wind_field_cassette', [
    '4x gtceu:fusion_coil', '8x ' + tritanium, '4x ' + americium, '4x ' + laminate, '4x ' + shunt,
    '2x gtceu:zpm_field_generator', '4x gtceu:yttrium_barium_cuprate_quadruple_cable',
    '4x immersiveengineering:coil_hv', '2x create:rotation_speed_controller'
  ], '2x ' + field, 7000, 126976).inputFluids(Fluid.of(cold, 7200))
  machine('assembler', 'build_fusion_casing_mk3', [
    '4x gtceu:fusion_casing_mk2', '8x ' + tritanium, '6x ' + laminate, '2x ' + field, '4x ' + americium,
    '4x kubejs:zpm_neutron_laminate', '4x kubejs:iv_arc_plate',
    '4x pneumaticcraft:reinforced_pressure_tube', '4x immersiveengineering:sheetmetal_steel'
  ], '4x gtceu:fusion_casing_mk3', 6900, 126976).inputFluids(Fluid.of(lubricant, 6400))
  machine('assembler', 'calibrate_reactor_standard', [
    '4x ' + field, '4x ' + interlock, '4x ' + shunt, '4x gtceu:zpm_sensor', '4x gtceu:crystal_processor_computer',
    '4x gtceu:quantum_processor_mainframe', '4x ae2:cell_component_256k', '8x ' + tritanium
  ], standard, 7400, 126976).notConsumable(Item.of(permit)).inputFluids(Fluid.of(shield, 8200))
  machine('assembly_line', 'assemble_network_switch', [
    '4x gtceu:advanced_computer_casing', '4x gtceu:zpm_emitter', '4x gtceu:zpm_sensor',
    '4x gtceu:crystal_processor_computer', '4x gtceu:wetware_processor_assembly',
    '8x ' + interlock, '8x ' + laminate, '8x gtceu:normal_optical_pipe', '4x ae2:me_p2p_tunnel'
  ], gt('network_switch'), 7400, 126976)
    .inputFluids(Fluid.of(shield, 7200)).inputFluids(Fluid.of(cold, 7200))
  const reactor = machine('assembly_line', 'build_reactor_mk3', [
    gt('zpm_fusion_reactor'), gt('uv_machine_hull'), standard, '16x gtceu:fusion_casing_mk3',
    '12x gtceu:fusion_coil', '8x ' + field, '4x gtceu:uv_field_generator', '4x gtceu:uv_robot_arm',
    '4x gtceu:wetware_processor_assembly', '4x ae2:256k_crafting_storage'
  ], gt('uv_fusion_reactor'), 10000, 130048)
    .inputFluids(Fluid.of(cold, 9000)).inputFluids(Fluid.of(shield, 8000))
    .inputFluids(Fluid.of(lubricant, 7200)).inputFluids(Fluid.of(gt('americium'), 1440))
  research(reactor, standard, 48, 144000, 126976)

  machine('assembler', 'seal_naquadria_capsule', [
    '8x gtceu:enriched_naquadah_dust', '4x kubejs:zpm_end_heavy_concentrate', '4x ' + laminate,
    '4x ' + americium, '4x kubejs:zpm_shielded_cask', '4x ae2:engineering_processor'
  ], '2x ' + capsule, 6200, 122880).notConsumable(Item.of(permit))
    .inputFluids(Fluid.of(shield, 5400)).dimension('minecraft:the_end')
  machine('chemical_reactor', 'prepare_neutronium_feed', ['2x ' + capsule], '', 5800, 126976)
    .inputFluids(Fluid.of(gt('radon'), 3200)).inputFluids(Fluid.of(gt('deuterium'), 3600))
    .outputFluids(Fluid.of(part('neutronium_feed'), 1440)).dimension('minecraft:the_nether')
  machine('fusion_reactor', 'synthesize_neutronium', [], '', 1080, 262144)
    .inputFluids(Fluid.of(part('neutronium_feed'), 1440)).inputFluids(Fluid.of(gt('americium'), 1440))
    .outputFluids(Fluid.of(neutronium, 720)).fusionStartEU(600000000)
  machine('fusion_reactor', 'refine_naquadria', [], '', 920, 245760)
    .inputFluids(Fluid.of(part('neutronium_feed'), 1440)).inputFluids(Fluid.of(gt('enriched_naquadah'), 1440))
    .outputFluids(Fluid.of(gt('naquadria'), 576)).fusionStartEU(440000000)

  machine('assembler', 'build_quench_cassette', [
    '8x ' + tritanium, '4x ' + americium, '4x ' + laminate, '4x ' + field, '4x kubejs:iv_cooling_jacket',
    '2x gtceu:uv_electric_pump', '8x kubejs:vacuum_gasket',
    '2x pneumaticcraft:heat_sink', '2x immersiveengineering:fluid_pump'
  ], '2x ' + coolantCassette, 7300, 393216).inputFluids(Fluid.of(cold, 9200))
  machine('vacuum_freezer', 'test_neutronium_coupon', ['4x ' + tritanium], '4x ' + coupon, 6400, 393216)
    .inputFluids(Fluid.of(neutronium, 720))
    .inputFluids(Fluid.of(cold, 8400)).outputFluids(Fluid.of(warm, 8400))
  machine('vacuum_freezer', 'solidify_neutronium', [], '4x gtceu:neutronium_ingot', 6200, 442368)
    .notConsumable(Item.of(coolantCassette)).inputFluids(Fluid.of(neutronium, 720))
    .inputFluids(Fluid.of(cold, 9600)).outputFluids(Fluid.of(warm, 9600))
  machine('bender', 'roll_neutronium', ['2x gtceu:neutronium_ingot'], gt('neutronium_plate'), 4800, 458752)
    .notConsumable(Item.of(witness))
  machine('assembler', 'assemble_grid_witness', [
    '8x ' + coupon, '4x ' + interlock, '4x ' + reserve, '4x ' + shunt, '4x gtceu:uv_voltage_coil',
    '2x gtceu:uv_energy_output_hatch_4a', '4x ae2:cell_component_256k'
  ], '2x ' + witness, 7200, 458752).inputFluids(Fluid.of(lubricant, 8200))
  machine('assembler', 'reconcile_three_world_freight', [
    '8x ' + capsule, '8x ' + coupon, '4x kubejs:zpm_freight_certificate', '4x ' + witness,
    '4x ae2:quantum_link', '8x ae2:me_p2p_tunnel', '4x ae2:256k_crafting_storage'
  ], part('freight_manifest'), 7400, 491520).inputFluids(Fluid.of(shield, 8400)).dimension('minecraft:overworld')

  machine('assembly_line', 'upgrade_wetware_computer', [
    '4x gtceu:wetware_processor_assembly', '4x ' + coupon, '4x ' + interlock, '4x ' + americium, '4x ' + shunt,
    '4x ae2:cell_component_256k', '4x kubejs:luv_optical_core', '4x gtceu:neutronium_plate'
  ], '2x gtceu:wetware_processor_computer', 7400, 475136)
    .inputFluids(Fluid.of(shield, 7200)).inputFluids(Fluid.of(lubricant, 6800))
  machine('assembly_line', 'upgrade_crystal_mainframe', [
    '4x gtceu:crystal_processor_computer', '4x gtceu:quantum_processor_mainframe', '4x ' + coupon, '4x ' + interlock,
    '4x ' + witness, '4x ae2:256k_crafting_storage', '4x gtceu:neutronium_plate', '4x ' + tritanium
  ], '2x gtceu:crystal_processor_mainframe', 8000, 491520)
    .inputFluids(Fluid.of(shield, 8400)).inputFluids(Fluid.of(lubricant, 7200))
  machine('assembler', 'pack_neutronium_acceptance_crate', [
    '64x ' + coupon, '4x ' + coolantCassette, '4x ' + part('phase_interlock')
  ], part('neutronium_acceptance_crate'), 11600, 507904).inputFluids(Fluid.of(cold, 9600))
  const report = machine('assembly_line', 'close_uv_shift', [
    '64x ' + coupon, '2x ' + part('freight_manifest'), '8x ' + witness, '8x ' + reserve, '16x ' + interlock,
    '8x gtceu:wetware_processor_computer', '8x gtceu:crystal_processor_mainframe', '8x gtceu:uv_lapotronic_battery',
    '16x gtceu:neutronium_plate', '8x ae2:256k_crafting_storage', '8x ' + coolantCassette, '8x expatternprovider:ingredient_buffer', part('neutronium_acceptance_crate')
  ], part('commissioning_report'), 28800, 507904)
    .inputFluids(Fluid.of(neutronium, 8640)).inputFluids(Fluid.of(shield, 20000))
    .inputFluids(Fluid.of(cold, 24000)).inputFluids(Fluid.of(gt('cetane_boosted_diesel'), 20000))
    .dimension('minecraft:overworld')
  research(report, witness, 64, 480000, 393216)
})
