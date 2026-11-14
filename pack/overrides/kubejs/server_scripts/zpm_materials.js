ServerEvents.recipes(event => {
  const gt = id => 'gtceu:' + id
  const part = id => 'kubejs:zpm_' + id
  const prefix = 'zero_shift:zpm_materials/'
  const permit = 'kubejs:luv_commissioning_report'
  const shield = 'kubejs:vacuum_shield_gas'
  const cold = 'kubejs:chilled_vacuum_coolant'
  const warm = 'kubejs:warm_vacuum_coolant'
  const alloy = gt('naquadah_alloy_plate')
  const europium = gt('europium_plate')
  const plasma = part('europium_plasma')
  const lubricant = gt('lubricant')
  const tube = 'pneumaticcraft:advanced_pressure_tube'
  const sterile = Java.loadClass('com.gregtechceu.gtceu.api.machine.multiblock.CleanroomType').STERILE_CLEANROOM

  function machine(type, id, items, output, ticks, power) {
    const recipe = event.recipes.gtceu[type](prefix + id)
    items.forEach(item => recipe.itemInputs(item))
    if (output) recipe.itemOutputs(output)
    return recipe.duration(ticks).EUt(power)
  }

  machine('centrifuge', 'sort_end_concentrate', [
    '8x kubejs:luv_tantalite_concentrate'
  ], '4x ' + part('end_heavy_concentrate'), 3400, 24576)
    .notConsumable(Item.of(permit)).inputFluids(Fluid.of(shield, 2200))
    .itemOutputs('4x kubejs:ore_tailings').dimension('minecraft:the_end')
  machine('chemical_reactor', 'precipitate_nether_salt', [
    '8x kubejs:chromite_concentrate'
  ], '4x ' + part('nether_isotope_salt'), 3200, 24576)
    .notConsumable(Item.of(permit)).inputFluids(Fluid.of(gt('chlorine'), 3400)).dimension('minecraft:the_nether')

  event.custom({
    type: 'pneumaticcraft:pressure_chamber',
    inputs: [
      { type: 'pneumaticcraft:stacked_item', item: part('end_heavy_concentrate'), count: 2 },
      { type: 'pneumaticcraft:stacked_item', item: part('nether_isotope_salt'), count: 2 },
      { type: 'pneumaticcraft:stacked_item', item: 'kubejs:luv_plasma_coupon', count: 4 },
      { type: 'pneumaticcraft:stacked_item', item: gt('neutron_reflector'), count: 2 },
      { type: 'pneumaticcraft:stacked_item', item: 'minecraft:quartz', count: 8 },
      { type: 'pneumaticcraft:stacked_item', item: 'kubejs:vacuum_gasket', count: 4 },
      { type: 'pneumaticcraft:stacked_item', item: tube, count: 2 }
    ],
    pressure: 4.9,
    results: [{ item: part('europium_target'), count: 2 }]
  }).id(prefix + 'compact_europium_target')
  machine('mixer', 'prepare_europium_feed', [
    '2x ' + part('europium_target'), '8x gtceu:neodymium_dust', '4x gtceu:naquadah_dust'
  ], '', 2700, 24576)
    .inputFluids(Fluid.of(gt('hydrogen'), 4200)).outputFluids(Fluid.of(part('europium_feed'), 1440))

  event.remove({ id: 'gtceu:fusion_reactor/neodymium_and_hydrogen_to_europium_plasma' })
  machine('fusion_reactor', 'synthesize_europium', [], '', 480, 28672)
    .inputFluids(Fluid.of(part('europium_feed'), 1440)).inputFluids(Fluid.of(gt('deuterium'), 3000))
    .outputFluids(Fluid.of(plasma, 720)).fusionStartEU(144000000)
  machine('vacuum_freezer', 'condense_europium', [], '4x gtceu:europium_ingot', 3900, 29696)
    .inputFluids(Fluid.of(plasma, 720)).inputFluids(Fluid.of(cold, 3200)).outputFluids(Fluid.of(warm, 3200))
  event.remove({ output: europium })
  machine('bender', 'roll_europium', ['2x gtceu:europium_ingot'], europium, 2000, 26624)
    .notConsumable(Item.of(permit))

  event.remove({ output: gt('naquadah_coil_block') })
  machine('assembler', 'wind_naquadah_coil', [
    '2x gtceu:hssg_coil_block', '8x gtceu:naquadah_plate', '4x kubejs:luv_magnet_module',
    '4x kubejs:luv_dielectric_laminate', '4x kubejs:iv_cooling_jacket', '4x kubejs:vacuum_gasket',
    '4x immersiveengineering:wirecoil_steel', '2x create:precision_mechanism'
  ], '2x gtceu:naquadah_coil_block', 4400, 30720)
    .notConsumable(Item.of(permit)).inputFluids(Fluid.of(cold, 3600))
  event.remove({ output: alloy })
  machine('assembler', 'press_naquadah_alloy', ['3x ' + gt('naquadah_alloy_ingot')], '2x ' + alloy, 2400, 28672)
    .notConsumable(Item.of(permit)).notConsumable(Item.of(gt('plate_extruder_mold')))
    .inputFluids(Fluid.of(lubricant, 1200))
  event.remove({ output: gt('vanadium_gallium_single_wire') })
  machine('wiremill', 'draw_vanadium_gallium_wire', ['2x gtceu:vanadium_gallium_ingot'],
    '3x gtceu:vanadium_gallium_single_wire', 2140, 28672)
    .notConsumable(Item.of(permit))
  event.remove({ output: gt('vanadium_gallium_single_cable') })
  machine('assembler', 'insulate_vanadium_gallium_wire', [
    '4x gtceu:vanadium_gallium_single_wire', '2x ' + part('neutron_laminate'),
    '2x kubejs:luv_dielectric_laminate', '2x kubejs:chemical_grade_seal'
  ], '4x gtceu:vanadium_gallium_single_cable', 2800, 28672)
    .inputFluids(Fluid.of(gt('silicone_rubber'), 576))
  ;[['single', 'double', 2], ['double', 'quadruple', 4], ['quadruple', 'octal', 8], ['octal', 'hex', 16]]
    .forEach(([previous, size, strands]) => {
    const wire = gt('vanadium_gallium_' + size + '_wire')
    const cable = gt('vanadium_gallium_' + size + '_cable')
    event.remove({ output: wire })
    event.remove({ output: cable })
    machine('assembler', 'bundle_vanadium_gallium_' + size, [
      '2x gtceu:vanadium_gallium_' + previous + '_wire', strands / 2 + 'x ' + part('neutron_laminate')
    ], wire, 1600 + strands * 100, 29696).inputFluids(Fluid.of(lubricant, strands * 180))
    machine('assembler', 'insulate_vanadium_gallium_' + size, [
      wire, strands / 2 + 'x kubejs:chemical_grade_seal', '2x ' + part('neutron_laminate')
    ], cable, 1800 + strands * 100, 30720).inputFluids(Fluid.of(gt('silicone_rubber'), strands * 144))
  })

  machine('assembler', 'lay_up_neutron_shield', [
    '4x ' + europium, '8x ' + alloy, '4x kubejs:luv_dielectric_laminate',
    '4x kubejs:sintered_vacuum_tile', '4x kubejs:vacuum_gasket', '4x immersiveengineering:insulating_glass',
    '4x pneumaticcraft:reinforced_pressure_tube'
  ], '4x ' + part('laminate_preform'), 3700, 29696).inputFluids(Fluid.of(shield, 2600))
  event.custom({
    type: 'create:pressing',
    ingredients: [{ item: part('laminate_preform') }],
    results: [{ item: part('neutron_laminate') }]
  }).id(prefix + 'press_neutron_laminate')
  machine('assembler', 'braze_flux_busbar', [
    '4x ' + europium, '6x ' + alloy, '4x kubejs:luv_busbar', '4x gtceu:vanadium_gallium_single_wire',
    '2x ' + part('neutron_laminate'), '4x kubejs:hv_switch_contact', '2x immersiveengineering:connector_hv_relay'
  ], '2x ' + part('flux_busbar'), 4000, 30720).inputFluids(Fluid.of(lubricant, 2800))
  machine('circuit_assembler', 'calibrate_phase_module', [
    '4x gtceu:wetware_processor', '4x gtceu:crystal_processor_assembly', '4x kubejs:luv_clock_matrix',
    '4x ae2:cell_component_256k', '2x ' + part('flux_busbar'), '2x ' + part('neutron_laminate')
  ], '2x ' + part('phase_module'), 4500, 32000).cleanroom(sterile).inputFluids(Fluid.of(shield, 3000))
  machine('assembler', 'wire_diesel_reserve', [
    gt('extreme_combustion_engine'), '2x gtceu:luv_transformer_4a', '4x kubejs:iv_grid_regulator',
    '4x ' + part('flux_busbar'), '4x ' + part('phase_module'), '4x ' + part('neutron_laminate'),
    '2x gtceu:luv_energy_output_hatch_4a', '2x immersiveengineering:capacitor_hv', '2x pneumaticcraft:advanced_liquid_compressor'
  ], '2x ' + part('reserve_switchgear'), 4600, 32000).inputFluids(Fluid.of(gt('cetane_boosted_diesel'), 6000))

  const pipeSizes = ['tiny', 'small', 'normal', 'large', 'huge', 'quadruple', 'nonuple']
  pipeSizes.forEach((size, index) => {
    const id = 'naquadah_' + size + '_fluid_pipe'
    event.remove({ output: gt(id) })
    machine('assembler', 'line_' + id, [
      '2x gtceu:niobium_titanium_' + size + '_fluid_pipe', '4x ' + alloy, '2x ' + part('neutron_laminate'),
      '2x ' + tube, '2x pneumaticcraft:heat_sink', '4x kubejs:vacuum_gasket'
    ], (index < 3 ? '2x ' : '') + gt(id), 3100 + index * 250, 30720).inputFluids(Fluid.of(cold, 2100 + index * 280))
  })
})
