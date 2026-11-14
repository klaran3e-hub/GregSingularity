ServerEvents.recipes(event => {
  const gt = id => 'gtceu:' + id
  const part = id => 'kubejs:reclaim_' + id
  const id = name => 'zero_shift:post_uv_reclamation/' + name
  const water = gt('distilled_water')
  const acid = gt('hydrochloric_acid')
  const clean = part('electrolyte')
  const spent = part('spent_electrolyte')
  const permeate = part('permeate')
  const recovered = part('recovered_electrolyte')
  const brine = part('brine')
  const depletedBrine = part('depleted_brine')
  const recoveredAcid = part('recovered_acid')
  const shield = 'kubejs:vacuum_shield_gas'
  const cold = 'kubejs:chilled_vacuum_coolant'
  const frame = part('membrane_frame')
  const membrane = part('sintered_membrane')
  const cartridge = part('membrane_cartridge')
  const manifold = part('separation_manifold')
  const etched = part('etched_collector')
  const adsorbent = part('purge_adsorbent')
  const collector = part('recovered_collector')
  const witness = part('loop_witness')
  const certificate = part('reclamation_certificate')
  const operations = 'kubejs:post_uv_operations_certificate'

  function machine(type, name, duration, voltage) {
    return event.recipes.gtceu[type](id(name)).duration(duration).EUt(voltage)
  }

  event.custom({
    type: 'create:pressing',
    ingredients: [{ item: 'kubejs:final_heavy_backplane' }],
    results: [{ item: frame }]
  }).id(id('press_membrane_frame'))

  machine('autoclave', 'sinter_membranes', 9600, 458752)
    .itemInputs('8x ' + frame, '8x kubejs:uv_structural_laminate')
    .inputFluids(Fluid.of(water, 12800))
    .itemOutputs('4x ' + membrane)

  event.custom({
    type: 'pneumaticcraft:pressure_chamber',
    pressure: 4.9,
    inputs: [
      { type: 'pneumaticcraft:stacked_item', item: membrane, count: 4 },
      { type: 'pneumaticcraft:stacked_item', item: gt('polytetrafluoroethylene_plate'), count: 16 },
      { type: 'pneumaticcraft:stacked_item', item: 'pneumaticcraft:pressure_chamber_glass', count: 8 },
      { type: 'pneumaticcraft:stacked_item', item: 'kubejs:chemical_grade_seal', count: 8 }
    ],
    results: [{ item: cartridge, count: 2 }]
  }).id(id('seal_membrane_cartridges'))

  machine('assembler', 'build_separation_manifold', 14400, 507904)
    .itemInputs('2x ' + cartridge, '8x gtceu:tritanium_plate', '4x expatternprovider:ex_pattern_provider',
      '4x gtceu:uv_electric_pump', '8x immersiveengineering:heavy_engineering', '8x kubejs:final_telemetry_unit')
    .notConsumable(Item.of(operations))
    .inputFluids(Fluid.of(shield, 12800))
    .itemOutputs(manifold)

  machine('mixer', 'mix_virgin_electrolyte', 7600, 458752)
    .itemInputs('16x gtceu:boron_dust', '24x gtceu:calcium_dust', '8x kubejs:uv_quench_cassette')
    .notConsumable(Item.of(manifold))
    .inputFluids(Fluid.of(water, 6400), Fluid.of(acid, 1600))
    .outputFluids(Fluid.of(clean, 8000))

  machine('chemical_reactor', 'etch_collectors', 9800, 491520)
    .itemInputs('8x gtceu:naquadah_alloy_plate')
    .notConsumable(Item.of(manifold))
    .inputFluids(Fluid.of(clean, 8000))
    .itemOutputs('8x ' + etched)
    .outputFluids(Fluid.of(spent, 8000))

  machine('centrifuge', 'separate_spent_electrolyte', 11200, 507904)
    .notConsumable(Item.of(cartridge))
    .inputFluids(Fluid.of(spent, 8000))
    .outputFluids(Fluid.of(permeate, 6000), Fluid.of(brine, 2000))

  machine('chemical_reactor', 'cure_purge_adsorbent', 9200, 475136)
    .itemInputs('16x gtceu:carbon_dust', '8x gtceu:boron_dust')
    .inputFluids(Fluid.of(brine, 2000))
    .itemOutputs('4x ' + adsorbent)
    .outputFluids(Fluid.of(depletedBrine, 1600))

  // The first acid batch comes from virgin etching; later batches can also use spent electrolyte returned by polishing.
  machine('electrolyzer', 'electrolyze_depleted_brine', 10400, 491520)
    .itemInputs('8x gtceu:salt_dust')
    .notConsumable(Item.of(manifold))
    .inputFluids(Fluid.of(depletedBrine, 1600))
    .outputFluids(Fluid.of(recoveredAcid, 1200))

  machine('mixer', 'restore_electrolyte', 9800, 491520)
    .itemInputs('4x kubejs:uv_quench_cassette')
    .inputFluids(Fluid.of(permeate, 6000), Fluid.of(recoveredAcid, 1000))
    .outputFluids(Fluid.of(recovered, 7000))

  machine('chemical_reactor', 'polish_collectors', 12800, 507904)
    .itemInputs('8x ' + etched)
    .notConsumable(Item.of(manifold))
    .inputFluids(Fluid.of(recovered, 7000), Fluid.of(shield, 8000))
    .itemOutputs('8x ' + collector)
    .outputFluids(Fluid.of(spent, 7000))

  machine('assembly_line', 'record_reclamation_loop', 21400, 507904)
    .itemInputs('16x ' + collector, '8x ' + adsorbent, '8x ' + cartridge, '8x kubejs:final_serial_logic',
      '8x gtceu:uv_sensor', '8x ae2:cell_component_256k', '4x expatternprovider:precise_storage_bus',
      '8x gtceu:neutronium_plate')
    .inputFluids(Fluid.of(recovered, 12000), Fluid.of(clean, 14000), Fluid.of(shield, 20000))
    .itemOutputs('2x ' + witness)

  const final = machine('assembly_line', 'certify_reclamation', 28000, 507904)
    .itemInputs('8x ' + witness, '4x ' + manifold, '16x ' + adsorbent, '16x ' + collector,
      '16x gtceu:wetware_processor_computer', '8x ae2:256k_crafting_storage', '8x kubejs:final_warehouse_seal',
      '8x gtceu:uv_fluid_regulator', '16x gtceu:neutronium_plate')
    .inputFluids(Fluid.of(clean, 28000), Fluid.of(recovered, 24000), Fluid.of(brine, 16000), Fluid.of(cold, 32000))
    .itemOutputs(certificate)

  final.stationResearch(builder => builder.researchStack(Item.of(witness))
    .dataStack(Item.of(gt('data_orb'))).CWUt(64, 1152000).EUt(507904))
})
