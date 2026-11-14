ServerEvents.recipes(event => {
  const ks = id => 'kubejs:' + id
  const gt = id => 'gtceu:' + id
  const part = id => ks('luv_' + id)
  const prefix = 'zero_shift:luv_electronics/'
  const sterile = Java.loadClass('com.gregtechceu.gtceu.api.machine.multiblock.CleanroomType').STERILE_CLEANROOM
  const shield = ks('vacuum_shield_gas')
  const plate = gt('rhodium_plated_palladium_plate')
  const ivCircuit = gt('micro_processor_mainframe')
  const luvCircuit = gt('nano_processor_mainframe')
  const clock = part('clock_matrix')
  const pack = part('processor_package')

  ;['nano_processor_mainframe', 'quantum_processor_computer', 'crystal_processor_assembly', 'wetware_processor']
    .forEach(id => event.remove({ output: gt(id) }))

  function machine(type, id, items, output, ticks, power) {
    const recipe = event.recipes.gtceu[type](prefix + id)
    items.forEach(item => recipe.itemInputs(item))
    return recipe.itemOutputs(output).duration(ticks).EUt(power)
  }

  machine('assembler', 'prepare_dielectric_stack', [
    '4x kubejs:iv_cable_jacket', '4x kubejs:chorus_dielectric_film', '4x kubejs:iv_bulkhead',
    '4x kubejs:sintered_vacuum_tile', '4x gtceu:platinum_plate', '2x kubejs:vacuum_gasket',
    '2x immersiveengineering:insulating_glass', '2x pneumaticcraft:reinforced_pressure_tube'
  ], '4x ' + part('dielectric_laminate'), 2140, 7360)
    .notConsumable(Item.of(ks('iv_commissioning_report'))).inputFluids(Fluid.of(gt('lubricant'), 1100))
  machine('assembler', 'prepare_optical_blank', [
    '4x gtceu:laminated_glass', '2x ae2:fluix_smart_dense_cable', '4x kubejs:ender_optical_insert',
    '2x ' + plate, '2x ' + part('dielectric_laminate'),
    '2x create:precision_mechanism', '2x immersiveengineering:insulating_glass'
  ], '2x ' + part('optical_blank'), 1880, 7360).inputFluids(Fluid.of(shield, 600))
  event.custom({
    type: 'create:pressing', ingredients: [{ item: part('optical_blank') }],
    results: [{ item: part('polished_waveguide') }]
  }).id(prefix + 'calibrate_waveguide_on_press')
  machine('laser_engraver', 'align_optical_core', [part('polished_waveguide')], part('optical_core'), 2200, 7360)
    .notConsumable(Item.of(ks('iv_sterile_mask'))).cleanroom(sterile)
  event.custom({
    type: 'pneumaticcraft:pressure_chamber',
    inputs: [
      { item: part('optical_core') }, { item: ks('iv_sealed_processor') },
      { item: part('dielectric_laminate') }, { item: 'ae2:engineering_processor' },
      { item: ks('vacuum_gasket') }, { item: 'pneumaticcraft:advanced_pressure_tube' }
    ],
    pressure: 4.9,
    results: [{ item: pack }]
  }).id(prefix + 'seal_optical_processor')
  machine('circuit_assembler', 'solder_clock_matrix', [
    '2x ' + pack, '2x kubejs:iv_clock_backplane', '2x ae2:cell_component_64k',
    '2x ' + part('busbar'), '2x ' + plate, '4x kubejs:tin_solder_preform'
  ], '2x ' + clock, 2250, 7680).cleanroom(sterile).inputFluids(Fluid.of(shield, 1050))
  machine('assembly_line', 'first_luv_mainframe', [
    '8x ' + pack, '4x ' + clock, '8x ' + ivCircuit, '8x gtceu:nano_processor_computer',
    '8x ' + plate, '8x gtceu:niobium_titanium_single_cable', '4x ae2:256k_crafting_storage',
    '4x ae2:me_p2p_tunnel', '4x expatternprovider:precise_storage_bus'
  ], '2x ' + luvCircuit, 8000, 8000)
    .inputFluids(Fluid.of(gt('lubricant'), 5000)).inputFluids(Fluid.of(shield, 4200))
    .inputFluids(Fluid.of(gt('cetane_boosted_diesel'), 6400))

  machine('circuit_assembler', 'quantum_computer', [
    '2x gtceu:quantum_processor_assembly', '2x ' + pack, clock, '2x ' + plate,
    '2x ae2:cell_component_256k', '4x kubejs:tin_solder_preform'
  ], gt('quantum_processor_computer'), 2700, 24768).cleanroom(sterile).inputFluids(Fluid.of(shield, 1300))
  machine('circuit_assembler', 'crystal_assembly', [
    '2x gtceu:crystal_processor', '2x ' + pack, clock, '2x ' + part('busbar'),
    '2x ae2:engineering_processor', '4x kubejs:tin_solder_preform'
  ], gt('crystal_processor_assembly'), 2920, 28672).cleanroom(sterile).inputFluids(Fluid.of(shield, 1400))
  machine('assembly_line', 'wetware_processor', [
    '2x gtceu:crystal_processor_assembly', '2x gtceu:quantum_processor_computer', '4x ' + pack,
    '2x ' + clock, '4x ' + plate, '4x ae2:engineering_processor', '2x ae2:cell_component_256k',
    '2x ' + part('plasma_coupon')
  ], '2x gtceu:wetware_processor', 4200, 30720)
    .inputFluids(Fluid.of(shield, 2200)).inputFluids(Fluid.of(gt('lubricant'), 2100))
})
