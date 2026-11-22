ServerEvents.recipes(event => {
  const ks = name => global.gsItemId(name)
  const mc = name => 'minecraft:' + name
  const gt = name => 'gtceu:' + name

  const prefix = 'zero_shift:end_crafting/'
  const grit = ks('endstone_grit')
  const tile = ks('sintered_vacuum_tile')
  const panel = ks('vacuum_treated_panel')
  const gasket = ks('vacuum_gasket')
  const shieldGas = ks('vacuum_shield_gas')
  const binder = ks('chorus_dielectric_film')
  const lubricant = gt('lubricant')
  const endBricks = mc('end_stone_bricks')
  const purpur = mc('purpur_block')
  const replacements = ['end_stone_bricks', 'purpur_block', 'purpur_pillar', 'end_rod', 'ender_chest', 'end_crystal']
  replacements.forEach(id => event.remove({ output: mc(id) }))
  event.remove({ id: mc('shulker_box') })

  function assemble(id, items, output, ticks, power) {
    const recipe = event.recipes.gtceu.assembler(prefix + id)
    items.forEach(item => recipe.itemInputs(item))
    return recipe.itemOutputs(output).duration(ticks).EUt(power || 480)
  }
  function compact(id, items, output, amount) {
    return global.fieldworkProcess(event, prefix + id, 'assembler', {
      ingredients: items.map(item => ({ item: item })).concat({ fluid: shieldGas, amount: amount }),
      results: [{ item: output, count: 2 }]
    }, 120)
  }

  compact('end_stone_bricks', [
    mc('end_stone'), mc('end_stone'), mc('end_stone'), mc('end_stone'),
    grit, grit, ks('clay_mortar'), ks('clay_mortar'), tile
  ], endBricks, 200)
  compact('press_purpur', [
    mc('popped_chorus_fruit'), mc('popped_chorus_fruit'), mc('popped_chorus_fruit'), mc('popped_chorus_fruit'),
    grit, grit, binder, tile, ks('pressed_insulation')
  ], purpur, 300)
  assemble('form_purpur_pillar', [
    '3x ' + purpur, '2x ' + tile, '2x ' + gasket, '2x ' + ks('rail_fastener'), 'gtceu:gregsingularity_pressed_steel_frame'
  ], '2x minecraft:purpur_pillar', 880).inputFluids(Fluid.of(lubricant, 300))
  const stoneForms = [
    ['end_stone_bricks', 'end_stone_brick', [
      ['slab', 2, ks('abrasive_paste')], ['stairs', 3, ks('rail_fastener')], ['wall', 4, ks('refractory_mix')]
    ]],
    ['purpur_block', 'purpur', [['slab', 2, ks('abrasive_paste')], ['stairs', 3, ks('hv_switch_contact')]]]
  ]
  stoneForms.forEach(([block, family, forms]) => {
    forms.forEach(([form, quantity, hardware]) => {
      const id = family + '_' + form
      event.remove({ output: mc(id) })
      assemble(id, [
        quantity + 'x ' + mc(block), '2x ' + hardware, tile, ks('pressed_steel_frame')
      ], '2x ' + mc(id), 520 + quantity * 60).inputFluids(Fluid.of(shieldGas, 100 * quantity))
    })
  })

  assemble('end_rods', [
    '2x minecraft:blaze_rod', '2x ' + binder, tile, '2x minecraft:glass_pane', '2x ' + gt('gold_single_wire'),
    ks('ender_optical_insert'), 'gtceu:tin_single_cable'
  ], '2x minecraft:end_rod', 840).inputFluids(Fluid.of(shieldGas, 180))
  assemble('ender_chest', [
    '8x minecraft:obsidian', '2x minecraft:ender_eye', gt('steel_drum'), '2x ' + gasket, '2x ' + tile,
    '2x ' + ks('hv_switch_contact'), 'gtceu:lv_sensor', 'gtceu:copper_single_cable'
  ], mc('ender_chest'), 1640).inputFluids(Fluid.of(shieldGas, 300))
  assemble('shulker_shell_box', [
    '2x minecraft:shulker_shell', mc('chest'), '2x ' + tile, '2x ' + gasket, '2x ' + binder,
    'gtceu:lv_conveyor_module', 'gtceu:treated_wood_planks', ks('balanced_rail_axle')
  ], mc('shulker_box'), 1660).inputFluids(Fluid.of(lubricant, 500))
  assemble('end_crystal', [
    '7x minecraft:glass', mc('ender_eye'), mc('ghast_tear'), '2x ' + gasket,
    ks('ev_calibrated_wafer'), ks('ev_phase_relay'), '2x ' + panel, ks('ender_optical_insert')
  ], mc('end_crystal'), 1840, 1536).inputFluids(Fluid.of(shieldGas, 500))
})
