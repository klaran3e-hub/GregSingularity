ServerEvents.recipes(event => {
  const ks = id => 'kubejs:' + id
  const gt = id => 'gtceu:' + id
  const prefix = 'zero_shift:iv_electronics/'
  const cleanrooms = Java.loadClass('com.gregtechceu.gtceu.api.machine.multiblock.CleanroomType')
  const sterile = cleanrooms.STERILE_CLEANROOM
  const gasket = ks('vacuum_gasket')
  const platinum = gt('platinum_plate')
  const wafer = ks('ev_calibrated_wafer')
  const die = ks('iv_clean_die')
  const packagePart = ks('iv_sealed_processor')
  const backplane = ks('iv_clock_backplane')
  const resist = ks('iv_photoresist')
  const waste = ks('spent_iv_photoresist')
  const shield = ks('vacuum_shield_gas')
  const fuel = gt('cetane_boosted_diesel')
  const catalyst = ks('iv_fuel_catalyst')
  const spentCatalyst = ks('iv_spent_fuel_catalyst')
  const firstCircuit = gt('micro_processor_mainframe')
  const ie = id => 'immersiveengineering:' + id
  const create = id => 'create:' + id
  const pnc = id => 'pneumaticcraft:' + id

  ;['micro_processor_mainframe', 'nano_processor', 'nano_processor_computer', 'quantum_processor_assembly', 'crystal_processor'].forEach(id => {
    event.remove({ output: gt(id) })
  })
  event.remove({ mod: 'gtceu', output: Fluid.of(fuel, 1) })
  event.remove({ output: gt('mv_field_generator') })

  function machine(type, id, items, output, ticks, power) {
    const recipe = event.recipes.gtceu[type](prefix + id)
    items.forEach(item => recipe.itemInputs(item))
    return recipe.itemOutputs(output).duration(ticks).EUt(power || 1920)
  }

  machine('assembler', 'wind_mv_field_generator', [
    gt('mv_emitter'), '2x ' + gt('mv_machine_casing'), '2x ' + gt('good_electronic_circuit'),
    '2x ' + ks('signal_relay'), '2x ' + ks('hv_switch_contact'), '4x ' + gt('copper_single_cable')
  ], gt('mv_field_generator'), 940, 120).inputFluids(Fluid.of(gt('lubricant'), 350))

  machine('assembler', 'assemble_fuel_catalyst', [
    '2x ' + platinum, '2x ' + ks('activated_carrier'), '2x ' + ks('iv_leach_filter'),
    gt('tungsten_plate'), gasket, ks('refinery_tray'), pnc('reinforced_pressure_tube')
  ], '2x ' + catalyst, 1660).inputFluids(Fluid.of(gt('lubricant'), 850))
  machine('chemical_reactor', 'refine_iv_diesel', [catalyst], spentCatalyst, 1460)
    .inputFluids(Fluid.of(gt('diesel'), 1800)).inputFluids(Fluid.of(gt('light_fuel'), 450))
    .inputFluids(Fluid.of(gt('oxygen'), 350)).outputFluids(Fluid.of(fuel, 2000))
  machine('chemical_reactor', 'regenerate_fuel_catalyst', [
    spentCatalyst, ks('activated_carrier')
  ], catalyst, 980, 1536).inputFluids(Fluid.of(gt('hydrogen'), 450))

  machine('assembler', 'pack_resist_ampoule', [
    ks('sample_ampoule'), '2x ' + ks('paraffin_cake'), ks('chorus_dielectric_film'),
    '2x ' + platinum, gasket, gt('electrum_single_wire')
  ], ks('iv_photoresist_ampoule'), 1320, 1536).inputFluids(Fluid.of(gt('distilled_water'), 600))
  event.recipes.gtceu.chemical_reactor(prefix + 'prepare_photoresist')
    .itemInputs(ks('iv_photoresist_ampoule')).inputFluids(Fluid.of(gt('naphtha'), 750))
    .inputFluids(Fluid.of(shield, 250)).outputFluids(Fluid.of(resist, 1000))
    .duration(920).EUt(1536)
  event.recipes.gtceu.chemical_reactor(prefix + 'restore_photoresist')
    .itemInputs(ks('iv_leach_filter')).inputFluids(Fluid.of(waste, 1000))
    .outputFluids(Fluid.of(resist, 750)).itemOutputs(ks('ore_tailings')).duration(940).EUt(1536)
  machine('assembler', 'prepare_sterile_mask', [
    ks('ev_etching_mask'), ks('ev_commissioning_report'), '2x ' + ks('me_optical_link'),
    '2x ' + platinum, gt('cleanroom_glass'), '2x ' + gasket,
    create('precision_mechanism'), ie('connector_hv')
  ], ks('iv_sterile_mask'), 2180).inputFluids(Fluid.of(shield, 700))
  machine('chemical_bath', 'coat_iv_wafer', [wafer], ks('iv_masked_wafer'), 760, 1536)
    .inputFluids(Fluid.of(resist, 250))
  machine('laser_engraver', 'expose_iv_wafer', [ks('iv_masked_wafer')], ks('iv_exposed_wafer'), 1480)
    .notConsumable(Item.of(ks('iv_sterile_mask'))).cleanroom(sterile)
  machine('chemical_bath', 'strip_iv_wafer', [ks('iv_exposed_wafer')], die, 990)
    .inputFluids(Fluid.of(gt('distilled_water'), 500)).outputFluids(Fluid.of(waste, 250))
  event.custom({
    type: 'pneumaticcraft:pressure_chamber',
    inputs: [
      { item: die }, { item: ks('ev_control_module') }, { item: gasket },
      { item: pnc('ingot_iron_compressed') }, { item: pnc('reinforced_pressure_tube') },
      { item: 'immersiveengineering:insulating_glass' }
    ],
    pressure: 4.85,
    results: [{ item: packagePart }]
  }).id(prefix + 'seal_iv_processor')
  machine('circuit_assembler', 'first_iv_mainframe', [
    '4x ' + packagePart, '6x ' + gt('micro_processor_computer'), '4x ' + platinum,
    '4x ' + ks('ev_phase_relay'), '2x ' + ks('iv_busbar_blank'), '8x ' + ks('tin_solder_preform')
  ], firstCircuit, 5360).cleanroom(sterile).inputFluids(Fluid.of(shield, 1700))

  machine('circuit_assembler', 'etch_nano_processor', [
    gt('advanced_integrated_circuit'), '2x ' + wafer, '2x ' + ks('ev_control_module'),
    '2x ' + ks('ceramic_hv_substrate'), '2x ' + gt('titanium_plate'), '2x ' + ks('tin_solder_preform')
  ], gt('nano_processor'), 1560, 1536).cleanroom(cleanrooms.CLEANROOM).inputFluids(Fluid.of(shield, 350))

  machine('circuit_assembler', 'assemble_clock_backplane', [
    firstCircuit, '2x ' + packagePart, '2x ' + ks('me_optical_link'),
    '2x ' + ks('iv_switch_stack'), '2x ' + platinum, '4x ' + ks('tin_solder_preform')
  ], backplane, 1880, 6144).cleanroom(sterile).inputFluids(Fluid.of(shield, 650))
  const circuits = [
    ['nano_processor_computer', gt('nano_processor_assembly'), platinum, 6144],
    ['quantum_processor_assembly', gt('quantum_processor'), ks('me_optical_link'), 6656],
    ['crystal_processor', gt('quantum_processor_assembly'), ks('ender_optical_insert'), 7360]
  ]
  circuits.forEach(([id, predecessor, coupling, power]) => {
    machine('circuit_assembler', id, [
      '2x ' + predecessor, '2x ' + packagePart, backplane, '2x ' + coupling,
      '2x ' + die, '4x ' + ks('tin_solder_preform')
    ], gt(id), 2300, power).cleanroom(sterile).inputFluids(Fluid.of(shield, 750))
  })
})
