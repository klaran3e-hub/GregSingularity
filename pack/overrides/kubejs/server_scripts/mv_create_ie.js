ServerEvents.recipes(event => {
  const ks = name => 'kubejs:' + name
  const gt = name => 'gtceu:' + name
  const create = name => 'create:' + name
  const ie = name => 'immersiveengineering:' + name
  const prefix = 'zero_shift:mv_create_ie/'
  const frame = ks('pressed_steel_frame')
  const seal = ks('chemical_grade_seal')
  const gasket = ks('pressure_gasket')
  const steel = gt('steel_plate')
  const brass = gt('brass_plate')
  const circuit = gt('good_electronic_circuit')
  const precision = create('precision_mechanism')
  const compressedIron = 'pneumaticcraft:ingot_iron_compressed'
  const connector = ie('connector_mv')
  const wire = gt('electrum_single_wire')
  const wireCoil = ie('wirecoil_electrum')
  const insulatedCoil = ie('wirecoil_electrum_ins')

  function assemble(id, items, output, count, ticks, fluid, amount) {
    event.remove({ output: output })
    const recipe = event.recipes.gtceu.assembler(prefix + id)
    items.forEach(item => recipe.itemInputs(item))
    recipe.inputFluids(Fluid.of(fluid, amount))
      .itemOutputs(count + 'x ' + output).duration(ticks).EUt(96)
  }

  const lubricant = gt('lubricant')
  const distilled = gt('distilled_water')
  const funnel = create('brass_funnel')
  const tunnel = create('brass_tunnel')
  const chute = create('smart_chute')
  const observer = create('content_observer')
  assemble('brass_funnel', ['2x ' + create('andesite_funnel'), '2x ' + brass, precision, frame, gasket],
    funnel, 2, 480, lubricant, 200)
  assemble('brass_tunnel', ['2x ' + create('andesite_tunnel'), '2x ' + funnel, '4x ' + brass,
    '2x ' + frame, '2x ' + gasket], tunnel, 2, 580, lubricant, 300)
  assemble('smart_chute', ['2x ' + create('chute'), funnel, gt('mv_electric_piston'), '2x ' + frame,
    '2x ' + seal], chute, 2, 640, lubricant, 350)
  assemble('content_observer', [create('redstone_contact'), 'minecraft:glass_pane', gt('mv_sensor'),
    precision, ie('component_steel'), seal], observer, 1, 680, distilled, 250)
  assemble('stockpile_switch', [observer, tunnel, create('redstone_link'), circuit, ie('component_steel'),
    gt('mv_electric_motor'), seal], create('stockpile_switch'), 1, 720, lubricant, 350)

  event.remove({ id: ie('metalpress/wire_electrum') })
  event.remove({ id: /^gtceu:wiremill\/mill_electrum_wire(?:_(?:2|4|8|16|fine))?$/ })
  event.remove({ id: gt('extruder/extrude_electrum_wire') })
  event.custom({
    type: ie('metal_press'), energy: 14400, mold: ie('mold_wire'),
    input: { item: gt('electrum_ingot') }, result: { item: wire, count: 2 }
  }).id(prefix + 'press_electrum_wire')
  assemble('electrum_wirecoil', ['4x ' + wire, '2x ' + compressedIron, ks('copper_contact_strip'),
    ie('treated_wood_horizontal')], wireCoil, 2, 540, lubricant, 250)
  assemble('insulated_electrum_wirecoil', ['2x ' + wireCoil, '2x ' + gt('polyethylene_plate'),
    '2x ' + ks('pressed_insulation'), '2x ' + gasket], insulatedCoil, 2, 620, distilled, 400)
  assemble('mv_connector', ['2x ' + ie('connector_lv'), '2x ' + wire, ks('fired_crucible'),
    compressedIron, '2x ' + gasket], connector, 2, 580, distilled, 400)
  assemble('mv_relay', ['2x ' + connector, wireCoil, '2x ' + brass, ie('component_steel'), seal],
    ie('connector_mv_relay'), 2, 620, distilled, 450)
  assemble('mv_coil', ['2x ' + insulatedCoil, gt('iron_rod'), precision, '2x ' + steel, seal],
    ie('coil_mv'), 1, 680, lubricant, 350)
  assemble('mv_capacitor', [ie('capacitor_lv'), '2x ' + insulatedCoil, connector, circuit,
    '2x ' + gt('nickel_plate'), '2x ' + frame, '2x ' + seal], ie('capacitor_mv'), 1, 760, gt('sulfuric_acid'), 1000)
  assemble('mv_transformer', [ie('connector_lv'), connector, ie('coil_mv'), precision, circuit,
    '2x ' + ie('component_steel'), '2x ' + seal], ie('transformer'), 1, 800, lubricant, 450)
})
