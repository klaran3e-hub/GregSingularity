ServerEvents.recipes(event => {
  const ks = name => global.gsItemId(name)
  const gt = name => 'gtceu:' + name

  const pnc = name => 'pneumaticcraft:' + name
  const prefix = 'zero_shift:end/'
  const stainless = gt('stainless_steel_plate')
  const hvCircuit = gt('advanced_integrated_circuit')
  const seal = ks('chemical_grade_seal')
  const grit = ks('endstone_grit')
  const mesh = ks('end_filter_blank')
  const filter = ks('end_sampling_filter')
  const spent = ks('spent_end_filter')
  const coolant = gt('distilled_water')
  const lubricant = gt('lubricant')
  const atmosphere = ks('end_atmosphere')
  const shielding = ks('vacuum_shield_gas')
  const optic = ks('ender_optical_insert')
  const ceramic = ks('ceramic_hv_substrate')
  const endStone = 'minecraft:end_stone'
  const poppedChorus = 'minecraft:popped_chorus_fruit'

  function machine(type, id, items, output, ticks, power) {
    const recipe = event.recipes.gtceu[type](prefix + id)
    items.forEach(item => recipe.itemInputs(item))
    if (output) recipe.itemOutputs(output)
    return recipe.duration(ticks).EUt(power)
  }
  function assemble(id, items, output, ticks) {
    return machine('assembler', id, items, output, ticks, 480)
  }
  function compact(id, items, output, count) {
    return global.fieldworkProcess(event, prefix + id, 'assembler', {
      ingredients: items.map(item => ({ item: item })),
      results: [{ item: output, count: count }]
    }, 120)
  }
  function pressure(id, items, output, bar) {
    return event.custom({
      type: pnc('pressure_chamber'), pressure: bar,
      inputs: items.map(item => ({ item: item })),
      results: [{ item: output }]
    }).id(prefix + id)
  }

  assemble('end_transit_permit', [
    ks('hv_commissioning_report'), '2x ' + gt('hv_sensor'), '2x ' + ks('hv_arc_shield'),
    '6x ' + stainless, '2x ' + hvCircuit, '2x ' + seal, ks('received_refractory_crate'),
    '2x ' + 'gtceu:electrum_quadruple_cable', ks('sealed_hv_module')
  ], ks('end_transit_permit'), 1820).inputFluids(Fluid.of(lubricant, 750))

  event.remove({ output: 'minecraft:ender_eye' })
  compact('ender_optical_insert', [
    'minecraft:ender_pearl', 'minecraft:ender_pearl', 'minecraft:glass_pane', 'minecraft:glass_pane',
    ceramic, ks('gold_conductor_blank'), ks('hv_switch_contact'), ks('pressed_insulation')
  ], optic, 2)
  pressure('stabilize_eye', [optic, 'minecraft:blaze_powder', seal, gt('gold_single_wire')],
    'minecraft:ender_eye', 4.55)

  event.remove({ type: gt('macerator'), input: endStone })
  event.remove({ id: gt('macerator/macerate_end_stone') })
  // GTCEu generates material recycling after the regular recipe event.
  const materialData = Java.loadClass('com.gregtechceu.gtceu.api.data.chemical.material.ItemMaterialData')
  materialData.clearMaterialInfo(Item.of(endStone).getItem())
  machine('cutter', 'cut_end_stone', ['4x ' + endStone], '2x ' + grit, 760, 384)
    .inputFluids(Fluid.of(lubricant, 300)).dimension('minecraft:the_end')
  machine('macerator', 'mill_end_concentrate', ['2x ' + grit], gt('endstone_dust'), 600, 384)

  compact('end_filter_blank', [
    ks('strainer_mesh'), ks('strainer_mesh'), stainless, stainless, ks('refinery_tray'),
    ks('copper_contact_strip'), ks('pressed_insulation'), ks('hv_switch_contact')
  ], mesh, 2)
  pressure('end_sampling_filter', [mesh, ks('activated_carrier'), ks('paraffin_cake'), seal, pnc('ingot_iron_compressed')],
    filter, 4.25)
  machine('gas_collector', 'sample_end_atmosphere', [filter], null, 660, 384)
    .outputFluids(Fluid.of(atmosphere, 1200)).dimension('minecraft:the_end')
  machine('centrifuge', 'split_end_atmosphere', [mesh, '2x ' + grit], spent, 920, 480)
    .inputFluids(Fluid.of(atmosphere, 1200))
    .outputFluids(Fluid.of(shielding, 800))
    .outputFluids(Fluid.of(gt('argon'), 400))
  machine('chemical_bath', 'wash_end_filter', [spent], mesh, 620, 384)
    .inputFluids(Fluid.of(coolant, 600)).itemOutputs(ks('ore_tailings'))

  event.remove({ output: poppedChorus })
  event.custom({
    type: pnc('thermo_plant'), exothermic: false, pressure: 4,
    item_input: { type: pnc('stacked_item'), item: 'minecraft:chorus_fruit', count: 3 },
    fluid_input: { type: pnc('fluid'), fluid: shielding, amount: 160 },
    temperature: { min_temp: 423 },
    item_output: { item: poppedChorus, count: 2 }
  }).id(prefix + 'dry_chorus_fruit')
  machine('chemical_bath', 'extract_chorus_dielectric', ['3x ' + poppedChorus],
    ks('chorus_dielectric_film'), 760, 384).inputFluids(Fluid.of(coolant, 650))
})
