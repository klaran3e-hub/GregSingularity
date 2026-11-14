ServerEvents.recipes(event => {
  const gt = id => 'gtceu:' + id
  const part = id => 'kubejs:uv_' + id
  const permit = 'kubejs:zpm_commissioning_report'
  const shield = 'kubejs:vacuum_shield_gas'
  const cold = 'kubejs:chilled_vacuum_coolant'
  const warm = 'kubejs:warm_vacuum_coolant'
  const tritanium = gt('tritanium_plate')
  const americium = gt('americium_plate')
  const lubricant = gt('lubricant')
  const laminate = part('structural_laminate')
  const shunt = part('flux_shunt')
  const sterile = Java.loadClass('com.gregtechceu.gtceu.api.machine.multiblock.CleanroomType').STERILE_CLEANROOM

  function machine(type, id, items, output, ticks, power) {
    const recipe = event.recipes.gtceu[type]('zero_shift:uv_materials/' + id)
    items.forEach(item => recipe.itemInputs(item))
    if (output) recipe.itemOutputs(output)
    return recipe.duration(ticks).EUt(power)
  }

  ;['gallium_and_radon_to_duranium_plasma', 'titanium_and_duranium_to_tritanium_plasma',
    'americium_and_naquadria_to_neutronium_plasma', 'enriched_naquadah_and_radon_to_naquadria_plasma']
    .forEach(id => event.remove({ id: gt('fusion_reactor/' + id) }))
  ;['tritanium_ingot', 'hot_tritanium_ingot', 'tritanium_plate', 'americium_plate'].forEach(id => {
    event.remove({ output: gt(id) })
  })

  event.custom({
    type: 'pneumaticcraft:pressure_chamber',
    inputs: [
      { type: 'pneumaticcraft:stacked_item', item: 'kubejs:zpm_americium_coupon', count: 4 },
      { type: 'pneumaticcraft:stacked_item', item: 'kubejs:zpm_neutron_laminate', count: 4 },
      { type: 'pneumaticcraft:stacked_item', item: gt('gallium_dust'), count: 8 },
      { type: 'pneumaticcraft:stacked_item', item: 'kubejs:chemical_grade_seal', count: 4 }
    ],
    pressure: 4.9,
    results: [{ item: part('duranium_target'), count: 2 }]
  }).id('zero_shift:uv_materials/compact_duranium_target')
  machine('mixer', 'prepare_duranium_feed', ['2x ' + part('duranium_target'), '8x gtceu:naquadah_alloy_plate'],
    '', 4800, 106496).notConsumable(Item.of(permit))
    .inputFluids(Fluid.of(shield, 4800)).inputFluids(Fluid.of(gt('argon'), 2400))
    .outputFluids(Fluid.of(part('duranium_feed'), 1440))
  machine('fusion_reactor', 'synthesize_duranium', [], '', 800, 90112)
    .inputFluids(Fluid.of(part('duranium_feed'), 1440)).inputFluids(Fluid.of(gt('radon'), 2400))
    .outputFluids(Fluid.of(gt('duranium'), 1152)).fusionStartEU(260000000)
  machine('fusion_reactor', 'synthesize_tritanium', [], '', 960, 110592)
    .inputFluids(Fluid.of(gt('duranium'), 1152)).inputFluids(Fluid.of(gt('titanium'), 2304))
    .outputFluids(Fluid.of(gt('tritanium'), 1152)).fusionStartEU(280000000)
  machine('vacuum_freezer', 'cast_tritanium_preform', [], '4x ' + part('tritanium_preform'), 5100, 110592)
    .inputFluids(Fluid.of(gt('tritanium'), 1152)).inputFluids(Fluid.of(cold, 6400)).outputFluids(Fluid.of(warm, 6400))
  machine('vacuum_freezer', 'anneal_tritanium', ['4x ' + part('tritanium_preform')], '8x gtceu:tritanium_ingot', 5600, 118784)
    .inputFluids(Fluid.of(cold, 7200)).outputFluids(Fluid.of(warm, 7200))
  machine('bender', 'roll_tritanium', ['2x gtceu:tritanium_ingot'], tritanium, 3900, 106496)
    .notConsumable(Item.of(permit))
  machine('bender', 'roll_americium', ['2x gtceu:americium_ingot'], americium, 3800, 106496)
    .notConsumable(Item.of(permit))
  machine('vacuum_freezer', 'condense_liquid_americium', [], '', 3900, 98304)
    .notConsumable(Item.of(permit)).inputFluids(Fluid.of(gt('americium_plasma'), 720))
    .inputFluids(Fluid.of(cold, 5200))
    .outputFluids(Fluid.of(gt('americium'), 720))

  machine('assembler', 'lay_up_structural_laminate', [
    '8x ' + tritanium, '4x ' + americium, '8x kubejs:zpm_neutron_laminate',
    '4x gtceu:laminated_glass', '8x kubejs:sintered_vacuum_tile', '4x kubejs:iv_bulkhead',
    '2x immersiveengineering:coil_hv', '2x pneumaticcraft:reinforced_pressure_tube'
  ], '4x ' + part('laminate_preform'), 6100, 122880).inputFluids(Fluid.of(shield, 6400))
  event.custom({
    type: 'create:compacting', heatRequirement: 'heated', processingTime: 300,
    ingredients: [{ item: part('laminate_preform') }, { item: 'kubejs:vacuum_gasket' }, { fluid: shield, amount: 450 }],
    results: [{ item: laminate }]
  }).id('zero_shift:uv_materials/press_structural_laminate')
  machine('assembler', 'braze_flux_shunt', [
    '6x ' + tritanium, '4x ' + americium, '4x kubejs:zpm_flux_busbar',
    '4x ' + laminate, '8x gtceu:vanadium_gallium_quadruple_cable', '4x kubejs:hv_switch_contact',
    '2x immersiveengineering:connector_hv_relay'
  ], '2x ' + shunt, 6200, 122880).inputFluids(Fluid.of(gt('soldering_alloy'), 5600))
  machine('circuit_assembler', 'calibrate_phase_interlock', [
    '4x gtceu:wetware_processor_assembly', '4x gtceu:crystal_processor_computer',
    '4x kubejs:zpm_phase_module', '4x ae2:cell_component_256k', '2x ' + laminate, '2x ' + shunt
  ], '2x ' + part('phase_interlock'), 6300, 126976).cleanroom(sterile).inputFluids(Fluid.of(shield, 6400))
  machine('assembler', 'assemble_pulse_reserve', [
    '4x gtceu:zpm_lapotronic_battery', '4x kubejs:zpm_reserve_switchgear', '4x ' + part('phase_interlock'),
    '4x ' + shunt, '4x ' + laminate, '2x gtceu:zpm_energy_output_hatch_4a'
  ], '2x ' + part('pulse_reserve'), 6600, 126976).inputFluids(Fluid.of(cold, 6800))

  const cuprate = 'yttrium_barium_cuprate_'
  const widths = [['single', 1], ['double', 2], ['quadruple', 4], ['octal', 8], ['hex', 16]]
  widths.forEach(([size, strands], index) => {
    const wire = gt(cuprate + size + '_wire')
    const cable = gt(cuprate + size + '_cable')
    event.remove({ output: wire })
    event.remove({ output: cable })
    if (index === 0) {
      machine('wiremill', 'draw_cuprate_wire', ['2x gtceu:yttrium_barium_cuprate_ingot'],
        '3x ' + wire, 4200, 106496).notConsumable(Item.of(permit))
    } else {
      const previous = gt(cuprate + widths[index - 1][0] + '_wire')
      machine('assembler', 'bundle_cuprate_' + size, ['2x ' + previous, strands + 'x ' + laminate],
        wire, 3200 + strands * 120, 114688).inputFluids(Fluid.of(lubricant, strands * 224))
    }
    machine('assembler', 'insulate_cuprate_' + size, [wire, '2x ' + laminate, '2x kubejs:chemical_grade_seal'],
      cable, 3600 + strands * 120, 122880).inputFluids(Fluid.of(gt('silicone_rubber'), 576 + strands * 144))
  })
})
