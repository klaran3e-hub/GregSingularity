ServerEvents.recipes(event => {
  const k = name => 'kubejs:' + name
  const g = name => 'gtceu:' + name
  const id = name => 'zero_shift:lv_workshop/' + name
  const recipes = event.recipes.gtceu
  const terminal = k('lv_terminal_block')
  const bridge = k('lv_contact_bridge')
  const contact = k('copper_contact_strip')
  const insulation = k('pressed_insulation')
  const lining = k('fired_lining')
  const rivet = k('iron_rivet')
  const cord = k('fibre_cord')
  const fineWire = g('fine_copper_wire')
  const tin = amount => Fluid.of(g('tin'), amount)

  event.shaped(terminal, ['R R', 'CLC', ' I '], {
    R: rivet, C: contact, L: lining, I: insulation
  }).id(id('hand_fit_terminals'))

  recipes.wiremill(id('draw_tin_batch')).itemInputs(k('tin_wire_blank'))
    .itemOutputs('6x ' + g('tin_single_wire')).duration(160).EUt(24)
  recipes.assembler(id('serve_tin_cables'))
    .itemInputs('4x ' + g('tin_single_wire'), '6x ' + insulation, '2x ' + cord)
    .inputFluids(Fluid.of(g('creosote'), 125)).itemOutputs('4x ' + g('tin_single_cable')).duration(200).EUt(16)
  recipes.wiremill(id('draw_winding_wire')).itemInputs(g('copper_foil'))
    .itemOutputs('2x ' + fineWire).duration(100).EUt(16)
  recipes.assembler(id('wind_stators'))
    .itemInputs('8x ' + fineWire, '2x ' + k('turned_spindle'), '4x ' + g('iron_plate'), '2x ' + insulation)
    .inputFluids(Fluid.of(g('creosote'), 125)).itemOutputs('2x ' + k('wound_stator')).duration(240).EUt(24)

  recipes.extractor(id('melt_solder_preform')).itemInputs(k('tin_solder_preform'))
    .outputFluids(tin(72)).duration(100).EUt(16)
  recipes.assembler(id('fit_terminal_batch'))
    .itemInputs('4x ' + lining, '6x ' + contact, '4x ' + rivet, '4x ' + insulation)
    .inputFluids(tin(144)).itemOutputs('4x ' + terminal).duration(240).EUt(24)
  recipes.bender(id('fold_contact_bridge')).itemInputs('2x ' + contact)
    .itemOutputs(bridge).duration(180).EUt(24)
  recipes.circuit_assembler(id('wire_line_contactor'))
    .itemInputs('2x ' + terminal, bridge, '4x ' + fineWire, k('magnetic_armature'),
      g('basic_electronic_circuit'), insulation)
    .inputFluids(tin(144)).itemOutputs(k('lv_line_contactor')).duration(360).EUt(28)
  recipes.circuit_assembler(id('mount_four_circuits'))
    .itemInputs('4x ' + g('resin_printed_circuit_board'), '8x ' + g('resistor'), '4x ' + g('vacuum_tube'),
      '8x ' + fineWire, '4x ' + contact, '2x ' + insulation)
    .inputFluids(tin(144)).itemOutputs('4x ' + g('basic_electronic_circuit')).duration(360).EUt(28)
})
