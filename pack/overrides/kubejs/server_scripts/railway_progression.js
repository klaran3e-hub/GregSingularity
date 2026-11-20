ServerEvents.recipes(event => {
  const ks = name => 'kubejs:' + name
  const gt = name => 'gtceu:' + name

  const prefix = 'zero_shift:railway/'
  const steel = gt('steel_plate')
  const stainless = gt('stainless_steel_plate')
  const liner = ks('fired_refractory_liner')
  const seal = ks('chemical_grade_seal')
  const relay = ks('signal_relay')
  const housing = ks('traction_housing')
  const axle = ks('balanced_rail_axle')
  const rail = ks('rolled_rail')
  const tie = ks('treated_sleeper')
  const fastener = ks('rail_fastener')
  const mvCircuit = gt('good_electronic_circuit')
  const mvMotor = gt('mv_electric_motor')
  const replacedVanilla = [
    'rail', 'powered_rail', 'detector_rail', 'activator_rail',
    'minecart', 'chest_minecart', 'hopper_minecart', 'furnace_minecart', 'tnt_minecart'
  ]
  replacedVanilla.forEach(id => event.remove({ output: 'minecraft:' + id }))

  function machine(type, id, items, output, ticks) {
    const recipe = event.recipes.gtceu[type](prefix + id)
    items.forEach(item => recipe.itemInputs(item))
    return recipe.itemOutputs(output).duration(ticks).EUt(96)
  }
  function assemble(id, items, output, ticks, oil) {
    const recipe = machine('assembler', id, items, output, ticks)
    if (oil) recipe.inputFluids(Fluid.of(gt('lubricant'), oil))
    return recipe
  }
  function shaped(id, output, rows, keys) {
    return event.shaped(output, rows, keys).id(prefix + id)
  }

  shaped('rail_profile_blank', '2x ' + ks('rail_profile_blank'), ['SHS', 'PLP', 'SSS'], {
    S: steel, H: ks('hot_stainless_billet'), P: stainless, L: liner
  })
  event.recipes.gtceu.bender(prefix + 'roll_rail_profile').itemInputs(ks('rail_profile_blank'))
    .itemOutputs(Item.of(rail, 2)).duration(240).EUt(120)
  assemble('impregnate_sleepers', [
    '4x minecraft:oak_planks', '2x ' + ks('impregnated_fibre'), '2x ' + ks('wooden_peg'), steel
  ], '4x ' + tie, 520, 300)
  shaped('rail_fastener_blank', ks('rail_fastener_blank'), ['SRS', ' B ', 'SRS'], {
    S: steel, R: ks('iron_rivet'), B: ks('steel_press_blank')
  })
  event.recipes.gtceu.forming_press(prefix + 'stamp_rail_fasteners')
    .itemInputs(ks('rail_fastener_blank')).notConsumable('gtceu:plate_casting_mold')
    .itemOutputs(Item.of(fastener, 8)).duration(240).EUt(120)
  shaped('axle_blank', ks('axle_blank'), ['SPS', 'RFR', 'SPS'], {
    S: steel, P: stainless, R: ks('iron_rivet'), F: ks('pressed_steel_frame')
  })
  machine('lathe', 'balance_train_axle', [ks('axle_blank')], axle, 540)
  assemble('traction_housing', [
    '2x ' + axle, '4x ' + stainless, '2x ' + ks('pressed_steel_frame'), '2x ' + seal, liner
  ], housing, 660, 250)
  assemble('signal_relay', [
    mvCircuit, '2x ' + ks('copper_contact_strip'), '2x ' + ks('hv_switch_contact'), '2x ' + liner,
    '2x ' + gt('copper_single_cable'), seal
  ], relay, 620, 100)

  shaped('minecart_rails', '8x minecraft:rail', ['RSR', 'FTF', 'RSR'], {
    R: rail, S: steel, F: fastener, T: tie
  })
  const poweredRails = [
    ['powered_rail', gt('gold_single_cable')],
    ['detector_rail', 'minecraft:stone_pressure_plate'],
    ['activator_rail', ks('hv_switch_contact')]
  ]
  poweredRails.forEach(([id, switchingPart]) => {
    assemble(id, ['4x minecraft:rail', relay, switchingPart, '4x ' + fastener, '2x ' + tie],
      '4x minecraft:' + id, 540, 150)
  })
  assemble('minecart', [housing, '2x ' + axle, '4x ' + steel, '4x ' + fastener, '2x ' + ks('pressed_steel_frame')],
    'minecraft:minecart', 600, 180)
  const carts = [
    ['chest_minecart', 'minecraft:chest'],
    ['hopper_minecart', 'minecraft:hopper'],
    ['furnace_minecart', 'minecraft:furnace'],
    ['tnt_minecart', 'minecraft:tnt']
  ]
  carts.forEach(([id, load]) => {
    assemble(id, ['minecraft:minecart', load, '2x ' + ks('pressed_steel_frame'), '4x ' + fastener,
      '2x ' + seal], 'minecraft:' + id, 540, 150)
  })

  assemble('seal_refractory_crates', [
    '8x ' + liner, '4x ' + ks('impregnated_fibre'), '2x ' + stainless,
    '2x ' + ks('pressed_steel_frame'), '2x ' + seal
  ], '4x ' + ks('sealed_refractory_crate'), 740, 250)
  shaped('rail_waybill', ks('rail_waybill'), ['PCP', 'ISI', ' F '], {
    P: 'minecraft:paper', C: ks('copper_contact_strip'), I: ks('pressed_insulation'), S: seal, F: fastener
  })
})
