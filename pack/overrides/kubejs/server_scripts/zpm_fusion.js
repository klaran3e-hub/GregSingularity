ServerEvents.recipes(event => {
  const gt = id => 'gtceu:' + id
  const part = id => 'kubejs:zpm_' + id
  const prefix = 'zero_shift:zpm_fusion/'
  const alloy = gt('naquadah_alloy_plate')
  const europium = gt('europium_plate')
  const permit = 'kubejs:luv_commissioning_report'
  const shield = 'kubejs:vacuum_shield_gas'
  const cold = 'kubejs:chilled_vacuum_coolant'
  const warm = 'kubejs:warm_vacuum_coolant'
  const lubricant = gt('lubricant')
  const plasma = gt('americium_plasma')
  const laminate = part('neutron_laminate')
  const busbar = part('flux_busbar')
  const phase = part('phase_module')
  const standard = part('reactor_standard')
  const coil = part('coil_cartridge')
  const cask = part('shielded_cask')
  const irradiated = part('irradiated_cask')
  const coupon = part('americium_coupon')
  const tube = 'pneumaticcraft:advanced_pressure_tube'
  const gauge = 'pneumaticcraft:pressure_gauge_module'
  const relay = 'gtceu:gold_quadruple_cable'

  function machine(type, id, items, output, ticks, power) {
    const recipe = event.recipes.gtceu[type](prefix + id)
    items.forEach(item => recipe.itemInputs(item))
    if (output) recipe.itemOutputs(output)
    return recipe.duration(ticks).EUt(power)
  }
  function research(recipe, sample, cwu, total, power) {
    recipe.stationResearch(builder => builder.researchStack(Item.of(sample))
      .dataStack(Item.of(gt('data_orb'))).CWUt(cwu, total).EUt(power))
  }

  ;['fusion_casing_mk2', 'fusion_coil', 'zpm_fusion_reactor', 'wetware_processor_assembly',
    'crystal_processor_computer', 'quantum_processor_mainframe']
    .forEach(id => event.remove({ output: gt(id) }))
  event.remove({ type: 'gtceu:fusion_reactor', output: Fluid.of(plasma, 1) })
  event.remove({ id: 'gtceu:fusion_reactor/lutenium_and_chromium_to_americium_plasma' })
  event.remove({ id: 'gtceu:fusion_reactor/plutonium_241_and_hydrogen_gas_to_americium_plasma' })
  event.remove({ id: 'gtceu:plasma_generator/americium' })

  machine('assembler', 'wind_coil_cartridge', [
    '4x kubejs:luv_magnet_module', '8x ' + alloy, '4x ' + europium, '4x ' + laminate,
    '4x ' + busbar, '2x gtceu:zpm_electric_pump', '4x kubejs:vacuum_gasket', '4x ' + tube, '2x ' + relay
  ], '2x ' + coil, 4800, 32000).inputFluids(Fluid.of(cold, 4000))
  machine('assembler', 'build_fusion_coil', [
    '2x gtceu:superconducting_coil', '2x ' + coil, '4x ' + phase, '8x ' + alloy,
    '4x ' + europium, '4x ' + laminate, '2x gtceu:zpm_sensor',
    '2x gtceu:lv_robot_arm', '2x pneumaticcraft:safety_tube_module'
  ], '2x gtceu:fusion_coil', 5400, 32000).inputFluids(Fluid.of(cold, 5200))
  machine('assembler', 'build_fusion_casing', [
    '4x gtceu:fusion_casing', '8x ' + alloy, '4x ' + laminate, '4x ' + busbar,
    '2x ' + coil, '4x kubejs:iv_arc_plate', '4x kubejs:vacuum_gasket',
    '4x gtceu:steel_frame', '4x ' + tube
  ], '4x gtceu:fusion_casing_mk2', 5200, 32000).inputFluids(Fluid.of(lubricant, 4200))
  machine('assembler', 'make_reactor_standard', [
    '4x ' + coil, '4x ' + phase, '4x gtceu:neutron_reflector', '4x gtceu:zpm_sensor',
    '4x ae2:cell_component_256k', '4x kubejs:luv_clock_matrix', '8x ' + alloy, '2x ' + gauge
  ], standard, 5400, 32000).notConsumable(Item.of(permit)).inputFluids(Fluid.of(shield, 4600))
  const reactor = machine('assembly_line', 'build_reactor_mk2', [
    gt('luv_fusion_reactor'), gt('zpm_machine_hull'), standard, '12x gtceu:fusion_casing_mk2',
    '8x gtceu:fusion_coil', '4x gtceu:zpm_field_generator', '8x ' + phase,
    '4x gtceu:zpm_robot_arm', '4x ae2:256k_crafting_storage'
  ], gt('zpm_fusion_reactor'), 7400, 32000)
    .inputFluids(Fluid.of(shield, 4800)).inputFluids(Fluid.of(cold, 5800)).inputFluids(Fluid.of(lubricant, 5000))
  research(reactor, standard, 24, 72000, 30720)

  machine('assembler', 'seal_isotope_capsule', [
    '4x ' + part('end_heavy_concentrate'), '4x ' + part('nether_isotope_salt'),
    '4x gtceu:neutron_reflector', '4x ' + laminate, '4x ' + europium, '4x kubejs:vacuum_gasket',
    '2x ' + tube, '2x pneumaticcraft:pressure_chamber_glass'
  ], '2x ' + part('isotope_capsule'), 4600, 61440).inputFluids(Fluid.of(shield, 3800))
  machine('chemical_reactor', 'prepare_americium_feed', ['2x ' + part('isotope_capsule')], '', 4400, 65536)
    .inputFluids(Fluid.of(gt('lutetium'), 1440)).inputFluids(Fluid.of(gt('deuterium'), 2400))
    .outputFluids(Fluid.of(part('americium_feed'), 1440))
  machine('fusion_reactor', 'synthesize_americium', [], '', 720, 65536)
    .inputFluids(Fluid.of(part('americium_feed'), 1440)).inputFluids(Fluid.of(gt('chromium'), 1440))
    .outputFluids(Fluid.of(plasma, 720)).fusionStartEU(240000000)

  machine('assembler', 'assemble_shielded_cask', [
    '8x ' + alloy, '4x ' + laminate, '4x ' + europium, '4x ' + phase,
    '4x gtceu:neutron_reflector', '4x kubejs:iv_cooling_jacket', '8x kubejs:vacuum_gasket',
    '2x pneumaticcraft:heat_sink', '2x ' + gauge
  ], '2x ' + cask, 5400, 73728).inputFluids(Fluid.of(lubricant, 4400))
  machine('vacuum_freezer', 'irradiate_cask', [cask], irradiated, 4800, 81920)
    .inputFluids(Fluid.of(plasma, 720)).inputFluids(Fluid.of(cold, 4800)).outputFluids(Fluid.of(warm, 4800))
  machine('centrifuge', 'unload_americium_cask', [irradiated, '4x ' + europium],
    '4x ' + part('hot_americium_coupon'), 5200, 88064)
    .inputFluids(Fluid.of(shield, 3200)).itemOutputs(cask)
  machine('vacuum_freezer', 'quench_americium_coupon', ['4x ' + part('hot_americium_coupon')],
    '4x ' + coupon, 5100, 98304).inputFluids(Fluid.of(cold, 4800)).outputFluids(Fluid.of(warm, 4800))
  machine('vacuum_freezer', 'condense_americium', [], '4x gtceu:americium_ingot', 4400, 90112)
    .inputFluids(Fluid.of(plasma, 720)).inputFluids(Fluid.of(cold, 4000)).outputFluids(Fluid.of(warm, 4000))

  machine('assembly_line', 'upgrade_wetware_assembly', [
    '4x gtceu:wetware_processor', '4x ' + phase, '4x ' + coupon, '4x ' + europium,
    '4x ' + laminate, '4x ae2:cell_component_256k', '4x kubejs:luv_optical_core'
  ], '2x gtceu:wetware_processor_assembly', 5400, 98304)
    .inputFluids(Fluid.of(shield, 3800)).inputFluids(Fluid.of(lubricant, 3400))
  machine('assembly_line', 'upgrade_crystal_computer', [
    '4x gtceu:crystal_processor_assembly', '4x ' + phase, '4x ' + coupon, '4x ' + alloy,
    '4x ' + busbar, '4x ae2:engineering_processor', '2x ae2:256k_crafting_storage'
  ], '2x gtceu:crystal_processor_computer', 5600, 104448)
    .inputFluids(Fluid.of(shield, 4200)).inputFluids(Fluid.of(lubricant, 3600))
  machine('assembly_line', 'upgrade_quantum_mainframe', [
    '4x gtceu:quantum_processor_computer', '4x ' + phase, '4x ' + coupon, '4x ' + europium,
    '4x ' + laminate, '4x ae2:cell_component_256k', '4x ae2:me_p2p_tunnel'
  ], '2x gtceu:quantum_processor_mainframe', 5800, 110592)
    .inputFluids(Fluid.of(shield, 4200)).inputFluids(Fluid.of(lubricant, 4000))

  machine('assembler', 'certify_cross_dimension_freight', [
    '12x ' + part('end_heavy_concentrate'), '12x ' + part('nether_isotope_salt'), '4x ' + phase,
    '2x ae2:quantum_link', '4x ae2:me_p2p_tunnel', '4x ae2:cell_component_256k',
    '4x ' + coupon, '2x ' + cask, part('europa_reticle')
  ], part('freight_certificate'), 6300, 106496).inputFluids(Fluid.of(shield, 5200))
    .dimension('minecraft:overworld')
  machine('assembler', 'pack_americium_acceptance_crate', [
    '32x ' + coupon, '4x ' + cask, '4x ' + part('flux_busbar')
  ], part('americium_acceptance_crate'), 7800, 126976).inputFluids(Fluid.of(shield, 6200))
  const report = machine('assembly_line', 'close_zpm_shift', [
    '64x ' + coupon, '2x ' + part('freight_certificate'), '4x ' + part('reserve_switchgear'),
    '8x gtceu:wetware_processor_assembly', '8x gtceu:crystal_processor_computer',
    '8x gtceu:quantum_processor_mainframe', '8x ae2:256k_crafting_storage', '16x ' + phase,
    '4x gtceu:zpm_lapotronic_battery', '8x ' + part('flux_busbar'), '4x ' + part('tempered_frame'), part('americium_acceptance_crate')
  ], part('commissioning_report'), 19200, 126976)
    .inputFluids(Fluid.of(plasma, 7200)).inputFluids(Fluid.of(shield, 12000))
    .inputFluids(Fluid.of(gt('cetane_boosted_diesel'), 16000)).dimension('minecraft:overworld')
  research(report, irradiated, 32, 192000, 98304)
})
