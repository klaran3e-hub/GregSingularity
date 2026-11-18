ServerEvents.recipes(event => {
  const gt = id => 'gtceu:' + id
  const part = id => 'kubejs:luv_' + id
  const prefix = 'zero_shift:luv_fusion/'
  const circuit = gt('nano_processor_mainframe')
  const quantum = gt('quantum_processor_computer')
  const plate = gt('rhodium_plated_palladium_plate')
  const cable = gt('niobium_titanium_single_cable')
  const clock = part('clock_matrix')
  const laminate = part('dielectric_laminate')
  const magnet = part('magnet_module')
  const specimen = part('fusion_specimen')
  const ignition = part('ignition_report')
  const coupon = part('load_coupon')
  const plasma = gt('helium_plasma')
  const exhaust = 'kubejs:spent_fusion_helium'
  const deuterium = gt('deuterium')
  const tritium = gt('tritium')
  const lubricant = gt('lubricant')
  const shield = 'kubejs:vacuum_shield_gas'
  const coolant = 'kubejs:chilled_vacuum_coolant'
  const winding = 'kubejs:luv_coil_winding'
  const tube = 'pneumaticcraft:advanced_pressure_tube'
  const regulator = 'pneumaticcraft:safety_tube_module'
  const hvRelay = 'immersiveengineering:connector_hv_relay'

  ;[deuterium, tritium].forEach(fluid => event.remove({ output: Fluid.of(fluid, 1) }))
  event.remove({ type: 'gtceu:fusion_reactor', output: Fluid.of(plasma, 1) })
  event.remove({ id: 'gtceu:plasma_generator/helium' })

  function machine(type, id, items, output, ticks, power) {
    const recipe = event.recipes.gtceu[type](prefix + id)
    items.forEach(item => recipe.itemInputs(item))
    if (output) recipe.itemOutputs(output)
    return recipe.duration(ticks).EUt(power)
  }
  function install(id, items, count, ticks, power, fluid, amount) {
    const output = gt(id)
    event.remove({ output: output })
    return machine('assembler', id, items, count + 'x ' + output, ticks, power)
      .inputFluids(Fluid.of(fluid, amount))
  }
  function research(recipe, sample, cwu, total, power) {
    recipe.stationResearch(builder => builder.researchStack(Item.of(sample))
      .dataStack(Item.of(gt('data_orb'))).CWUt(cwu, total).EUt(power))
  }

  machine('assembler', 'wind_magnet_module', [
    '4x gtceu:niobium_titanium_quadruple_cable', '4x gtceu:hssg_plate', '2x ' + part('busbar'),
    '2x ' + laminate, '2x kubejs:iv_cooling_jacket', '2x gtceu:iv_field_generator',
    '2x ' + winding, '2x ' + tube, '2x ' + hvRelay
  ], '2x ' + magnet, 3100, 24576).inputFluids(Fluid.of(coolant, 1800))
  install('superconducting_coil', [
    '2x ' + magnet, '4x ' + plate, '2x ' + clock, '2x gtceu:hssg_coil_block',
    '2x gtceu:luv_electric_pump', '4x kubejs:vacuum_gasket', '2x create:precision_mechanism', '2x ' + regulator
  ], 2, 3600, 27648, coolant, 2400)
  install('fusion_casing', [
    '2x gtceu:robust_machine_casing', '4x ' + plate, '4x ' + laminate,
    '4x gtceu:hssg_plate', '2x ' + magnet, '4x kubejs:vacuum_gasket',
    '2x immersiveengineering:steel_scaffolding_standard', '2x ' + tube
  ], 4, 3060, 24576, lubricant, 1800)
  install('fusion_glass', [
    '4x gtceu:laminated_glass', '4x gtceu:cleanroom_glass', '4x ' + laminate,
    '2x ' + part('optical_core'), '4x ' + plate, '4x kubejs:vacuum_gasket',
    '2x create:framed_glass', '2x pneumaticcraft:pressure_chamber_glass'
  ], 4, 2900, 24576, shield, 1700)
  install('neutron_reflector', [
    '4x ' + plate, '4x gtceu:tungsten_steel_plate', '2x kubejs:sintered_vacuum_tile',
    '2x ' + laminate, '2x kubejs:iv_arc_plate'
  ], 2, 3180, 26624, lubricant, 1650)
  machine('assembler', 'make_fusion_specimen', [
    '2x gtceu:neutron_reflector', '2x ' + magnet, '2x ' + clock, '4x ' + plate,
    '2x ' + quantum, '2x gtceu:luv_sensor', '2x ae2:cell_component_256k',
    '2x create:content_observer', '2x pneumaticcraft:pressure_gauge_module'
  ], specimen, 3600, 28672).inputFluids(Fluid.of(shield, 1750))

  event.remove({ output: gt('luv_fusion_reactor') })
  const reactor = machine('assembly_line', 'build_fusion_reactor', [
    gt('luv_machine_hull'), specimen, '8x gtceu:fusion_casing', '4x gtceu:superconducting_coil',
    '4x gtceu:luv_field_generator', '4x ' + quantum, '4x gtceu:luv_robot_arm', '4x ae2:256k_crafting_storage',
    '2x immersiveengineering:capacitor_hv'
  ], gt('luv_fusion_reactor'), 5200, 32000).inputFluids(Fluid.of(shield, 3200))
    .inputFluids(Fluid.of(lubricant, 3000)).inputFluids(Fluid.of(coolant, 3500))
  research(reactor, specimen, 8, 16000, 24576)

  machine('centrifuge', 'separate_deuterium', [], '', 1350, 16384)
    .notConsumable(Item.of(laminate, 2))
    .inputFluids(Fluid.of(gt('hydrogen'), 12000)).outputFluids(Fluid.of(deuterium, 2250))
  machine('centrifuge', 'enrich_tritium', [], '', 1100, 24576)
    .notConsumable(Item.of(gt('neutron_reflector'), 2))
    .inputFluids(Fluid.of(deuterium, 1250)).outputFluids(Fluid.of(tritium, 750))
  machine('fusion_reactor', 'ignite_helium_plasma', [], '', 240, 24576)
    .inputFluids(Fluid.of(deuterium, 1000)).inputFluids(Fluid.of(tritium, 750))
    .outputFluids(Fluid.of(plasma, 1000)).fusionStartEU(80000000)
  machine('plasma_generator', 'expand_helium_plasma', [], '', 40, -2048)
    .inputFluids(Fluid.of(plasma, 1)).outputFluids(Fluid.of(exhaust, 1))
  machine('distillery', 'recover_turbine_helium', [], '', 1580, 22528)
    .inputFluids(Fluid.of(exhaust, 1000)).outputFluids(Fluid.of(gt('helium'), 850))

  install('tungstensteel_turbine_casing', [
    '4x gtceu:robust_machine_casing', '4x gtceu:tungsten_steel_plate', '2x gtceu:hssg_plate',
    '2x ' + laminate, '4x kubejs:vacuum_gasket'
  ], 4, 2400, 7680, lubricant, 1400)
  install('rhodium_plated_palladium_rotor', [
    '4x gtceu:tungsten_steel_plate', '8x ' + plate, '2x gtceu:luv_electric_motor',
    '2x kubejs:balanced_rail_axle', '2x ' + part('busbar')
  ], 1, 3550, 27648, lubricant, 1950)
  event.remove({ id: 'gtceu:assembler/assemble_rhodium_plated_palladium_turbine_blade' })
  const rotor = Item.of(gt('turbine_rotor'), '{"GT.PartStats":{Material:"gtceu:rhodium_plated_palladium"}}')
  machine('assembler', 'balance_plasma_turbine_rotor', [
    '2x gtceu:rhodium_plated_palladium_rotor', '4x ' + plate, '2x kubejs:balanced_rail_axle',
    '2x ' + part('busbar'), '4x gtceu:hssg_plate', '2x gtceu:luv_sensor',
    '2x pneumaticcraft:turbine_rotor', '2x create:precision_mechanism'
  ], rotor, 4400, 29696).inputFluids(Fluid.of(lubricant, 2100))
  install('plasma_large_turbine', [
    gt('luv_machine_hull'), '4x gtceu:tungstensteel_turbine_casing', '2x gtceu:tungstensteel_gearbox',
    '2x gtceu:luv_rotor_holder', '4x ' + circuit, '4x ' + clock, '8x ' + cable,
    '2x ' + hvRelay, '2x ' + regulator
  ], 1, 4100, 29696, lubricant, 2400)

  machine('vacuum_freezer', 'test_plasma_coupon', [plate], '2x ' + part('plasma_coupon'), 2100, 28672)
    .inputFluids(Fluid.of(plasma, 500)).inputFluids(Fluid.of(coolant, 2400))
    .outputFluids(Fluid.of('kubejs:warm_vacuum_coolant', 2400))
  machine('assembler', 'record_first_ignition', [
    '8x ' + part('plasma_coupon'), '4x ' + clock, '4x gtceu:neutron_reflector',
    '2x gtceu:luv_sensor', '2x ' + quantum, '2x ae2:cell_component_256k',
    '2x create:content_observer', '2x pneumaticcraft:pressure_gauge_module'
  ], ignition, 3800, 29696)
    .notConsumable(rotor.weakNBT()).inputFluids(Fluid.of(exhaust, 1500))
  machine('assembler', 'apply_luv_load', [
    '4x ' + part('plasma_coupon'), '4x ' + magnet, '4x ' + plate, '4x ' + part('busbar'), '2x ' + circuit
  ], '4x ' + coupon, 3100, 30720).notConsumable(Item.of(ignition)).inputFluids(Fluid.of(plasma, 750))

  const report = machine('assembly_line', 'close_luv_shift', [
    '64x ' + coupon, '2x ' + ignition, '8x ' + magnet, '8x ' + clock, '8x gtceu:crystal_processor_assembly',
    '8x gtceu:wetware_processor', '4x gtceu:luv_field_generator', '4x ae2:256k_crafting_storage',
    '4x immersiveengineering:capacitor_hv'
  ], part('commissioning_report'), 12000, 32000).inputFluids(Fluid.of(plasma, 8000))
    .inputFluids(Fluid.of(shield, 7000)).inputFluids(Fluid.of(lubricant, 8000))
  research(report, ignition, 12, 72000, 28672)
})
