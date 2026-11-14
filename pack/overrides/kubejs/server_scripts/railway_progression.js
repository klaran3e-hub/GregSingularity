ServerEvents.recipes(event => {
  const ks = name => 'kubejs:' + name
  const gt = name => 'gtceu:' + name
  const create = name => 'create:' + name
  const ie = name => 'immersiveengineering:' + name
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
  const railCasing = create('railway_casing')

  const replacedCreate = [
    'track', 'track_station', 'track_signal', 'track_observer', 'railway_casing', 'controls', 'schedule',
    'steam_whistle', 'train_door', 'train_trapdoor', 'contraption_controls', 'super_glue',
    'item_vault', 'portable_storage_interface', 'controller_rail'
  ]
  const replacedVanilla = [
    'rail', 'powered_rail', 'detector_rail', 'activator_rail',
    'minecart', 'chest_minecart', 'hopper_minecart', 'furnace_minecart', 'tnt_minecart'
  ]
  replacedCreate.map(create).concat(replacedVanilla.map(id => 'minecraft:' + id))
    .forEach(output => event.remove({ output: output }))
  event.remove({ id: create('sequenced_assembly/track') })
  event.remove({ id: create('item_application/railway_casing') })

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
  function press(id, input, output, count) {
    event.custom({
      type: ie('metal_press'), energy: 14400, mold: ie('mold_plate'),
      input: { item: input }, result: { item: output, count: count }
    }).id(prefix + id)
  }

  shaped('rail_profile_blank', '2x ' + ks('rail_profile_blank'), ['SHS', 'PLP', 'SSS'], {
    S: steel, H: ks('hot_stainless_billet'), P: stainless, L: liner
  })
  press('roll_rail_profile', ks('rail_profile_blank'), rail, 2)
  assemble('impregnate_sleepers', [
    '4x minecraft:oak_planks', '2x ' + ks('impregnated_fibre'), '2x ' + ks('wooden_peg'), steel
  ], '4x ' + tie, 520, 300)
  shaped('rail_fastener_blank', ks('rail_fastener_blank'), ['SRS', ' B ', 'SRS'], {
    S: steel, R: ks('iron_rivet'), B: ks('steel_press_blank')
  })
  press('stamp_rail_fasteners', ks('rail_fastener_blank'), fastener, 8)
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

  assemble('track_sections', ['4x ' + rail, '4x ' + tie, '8x ' + fastener, '2x ' + liner], '16x ' + create('track'), 700, 450)
  assemble('railway_casing', [housing, '4x ' + stainless, '4x ' + fastener, '2x ' + liner],
    '2x ' + railCasing, 720, 300)
  assemble('track_station', [
    railCasing, '2x ' + relay, '2x ' + axle, '2x ' + mvCircuit, '2x ' + housing, '4x ' + fastener
  ], create('track_station'), 960, 300)
  assemble('track_signal', [
    railCasing, relay, '2x ' + ks('hv_switch_contact'), '2x ' + gt('copper_single_cable'),
    '2x minecraft:glass_pane', '2x ' + fastener
  ], create('track_signal'), 720, 150)
  assemble('track_observer', [
    railCasing, '2x ' + relay, ks('hv_arc_shield'), '2x ' + gt('copper_single_cable'),
    '2x minecraft:glass_pane', '2x ' + seal
  ], create('track_observer'), 760, 180)
  assemble('train_controls', [
    housing, '2x ' + relay, '2x ' + axle, '2x ' + mvMotor, '2x ' + mvCircuit,
    '2x ' + ks('hv_switch_contact'), '4x ' + fastener
  ], create('controls'), 1020, 350)
  assemble('train_schedule', [
    '4x minecraft:paper', '2x ' + ks('pressed_insulation'), relay, ks('copper_contact_strip'), '2x ' + seal
  ], create('schedule'), 420, 0)
  assemble('contraption_controls', [
    housing, relay, mvMotor, '2x ' + ks('hv_switch_contact'), '2x ' + seal
  ], create('contraption_controls'), 620, 150)
  assemble('steam_whistle', [
    railCasing, '2x ' + gt('bronze_plate'), '2x ' + gt('bronze_small_fluid_pipe'), seal, fastener
  ], create('steam_whistle'), 580, 120)
  assemble('train_door', [
    '4x ' + stainless, '2x ' + axle, '2x ' + ks('iron_hinge'), '2x ' + seal, gt('mv_electric_piston')
  ], '2x ' + create('train_door'), 580, 180)
  assemble('train_trapdoor', [
    '3x ' + stainless, '2x ' + fastener, '2x ' + ks('iron_hinge'), seal, gt('mv_electric_piston')
  ], '2x ' + create('train_trapdoor'), 560, 180)
  assemble('item_vault', [
    railCasing, '4x ' + steel, '4x ' + fastener, '2x ' + ks('pressed_steel_frame'), '2x ' + seal
  ], create('item_vault'), 680, 250)
  assemble('portable_storage_interface', [
    housing, '2x ' + relay, gt('mv_conveyor_module'), '2x ' + seal, '2x ' + axle, '4x ' + fastener
  ], create('portable_storage_interface'), 760, 250)
  assemble('super_glue', [
    '2x ' + ks('insulating_gum'), '2x ' + gt('polyethylene_plate'), ks('glass_tube_blank'),
    seal, ks('paraffin_cake')
  ], create('super_glue'), 520, 150)
  assemble('controller_rail', ['2x ' + rail, '2x ' + tie, relay, '4x ' + fastener], '4x ' + create('controller_rail'), 580, 150)

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
