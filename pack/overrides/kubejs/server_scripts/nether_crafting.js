ServerEvents.recipes(event => {
  const ks = name => 'kubejs:' + name
  const gt = name => 'gtceu:' + name
  const mc = name => 'minecraft:' + name
  const create = name => 'create:' + name
  const prefix = 'zero_shift:nether/'
  const grit = ks('basalt_grit')
  const liner = ks('fired_refractory_liner')
  const stainless = gt('stainless_steel_plate')
  const steel = gt('steel_plate')
  const chisel = ks('stone_chisel')
  const mortar = ks('clay_mortar')
  const seal = ks('chemical_grade_seal')
  const distilled = gt('distilled_water')
  const lubricant = gt('lubricant')

  const masonry = [
    ['blackstone', 'blackstone'], ['polished_blackstone', 'polished_blackstone'],
    ['polished_blackstone_bricks', 'polished_blackstone_brick'],
    ['nether_bricks', 'nether_brick'], ['red_nether_bricks', 'red_nether_brick']
  ]
  const replacements = [
    'polished_basalt', 'smooth_basalt', 'polished_blackstone', 'polished_blackstone_bricks',
    'cracked_polished_blackstone_bricks', 'chiseled_polished_blackstone', 'polished_blackstone_button',
    'polished_blackstone_pressure_plate', 'nether_brick', 'nether_bricks', 'red_nether_bricks',
    'cracked_nether_bricks', 'chiseled_nether_bricks', 'nether_brick_fence',
    'flint_and_steel', 'glowstone', 'quartz_block', 'smooth_quartz', 'soul_torch', 'soul_lantern',
    'soul_campfire', 'blaze_powder', 'magma_cream', 'magma_block', 'brewing_stand', 'respawn_anchor',
    'lodestone', 'netherite_scrap', 'netherite_ingot', 'netherite_block', 'netherite_upgrade_smithing_template'
  ]
  replacements.forEach(id => event.remove({ output: mc(id) }))
  event.remove({ type: gt('thermal_centrifuge'), input: mc('ancient_debris') })

  function shaped(id, output, rows, keys) {
    return event.shaped(output, rows, keys).id(prefix + id)
  }
  function machine(type, id, items, output, ticks, eut) {
    const recipe = event.recipes.gtceu[type](prefix + id)
    items.forEach(item => recipe.itemInputs(item))
    return recipe.itemOutputs(output).duration(ticks).EUt(eut)
  }
  function assemble(id, items, output, ticks, eut) {
    return machine('assembler', id, items, output, ticks, eut || 96)
  }
  function fire(id, input, output, ticks) {
    return event.custom({
      type: mc('smelting'), ingredient: { item: input }, result: output, cookingtime: ticks, experience: 0.3
    }).id(prefix + id)
  }

  shaped('flint_and_steel', mc('flint_and_steel'), [' SF', 'PHS', ' B '], {
    F: mc('flint'), S: steel, P: ks('hand_forged_plate'), H: ks('iron_hinge'), B: ks('tool_binding')
  })
  event.custom({
    type: create('mixing'), processingTime: 520,
    ingredients: [mc('netherrack'), mc('netherrack'), mc('netherrack'), mc('netherrack'),
      mortar, mortar, grit, ks('fireclay_charge')].map(item => ({ item: item }))
      .concat({ fluid: distilled, amount: 500 }),
    results: [{ item: ks('nether_brick_blank'), count: 2 }]
  }).id(prefix + 'nether_brick_blank')
  fire('fire_nether_brick', ks('nether_brick_blank'), mc('nether_brick'), 640)
  assemble('lay_nether_bricks', ['4x ' + mc('nether_brick'), '2x ' + mortar, liner, seal],
    '2x ' + mc('nether_bricks'), 560).inputFluids(Fluid.of(distilled, 300))
  assemble('red_nether_bricks', ['2x ' + mc('nether_bricks'), '4x ' + mc('nether_wart'), '2x ' + mortar, liner, seal],
    '2x ' + mc('red_nether_bricks'), 620).inputFluids(Fluid.of(distilled, 450))
  assemble('polish_blackstone', ['4x ' + mc('blackstone'), '2x ' + ks('abrasive_paste'), grit, liner],
    '2x ' + mc('polished_blackstone'), 560).inputFluids(Fluid.of(lubricant, 250))
  assemble('blackstone_bricks', ['4x ' + mc('polished_blackstone'), '2x ' + mortar, liner, seal],
    '2x ' + mc('polished_blackstone_bricks'), 620).inputFluids(Fluid.of(distilled, 300))
  assemble('polished_basalt', ['4x ' + mc('basalt'), '2x ' + ks('abrasive_paste'), '2x ' + grit, liner],
    '2x ' + mc('polished_basalt'), 600).inputFluids(Fluid.of(lubricant, 300))
  fire('smooth_basalt', mc('polished_basalt'), mc('smooth_basalt'), 540)
  fire('crack_blackstone', mc('polished_blackstone_bricks'), mc('cracked_polished_blackstone_bricks'), 520)
  fire('crack_nether_bricks', mc('nether_bricks'), mc('cracked_nether_bricks'), 520)

  const forms = [['slab', 2, ks('abrasive_paste')], ['stairs', 3, ks('iron_hinge')], ['wall', 4, ks('refractory_mix')]]
  masonry.forEach(([block, family]) => {
    const material = mc(block)
    forms.forEach(([form, stock, binder]) => {
      const id = family + '_' + form
      event.remove({ output: mc(id) })
      assemble(id, [stock + 'x ' + material, '2x ' + binder, liner, mortar], '2x ' + mc(id), 420 + stock * 40)
        .inputFluids(Fluid.of(distilled, 100 * stock))
    })
  })
  for (const [id, block] of [
    ['chiseled_polished_blackstone', 'polished_blackstone'],
    ['chiseled_nether_bricks', 'nether_bricks']
  ]) {
    shaped(id, mc(id), ['ALA', 'SCS', 'ALA'], {
      A: ks('abrasive_paste'), L: liner, S: mc(block), C: chisel
    }).damageIngredient(chisel)
  }
  assemble('nether_brick_fence', ['4x ' + mc('nether_bricks'), '2x ' + mc('nether_brick'),
    '4x ' + ks('iron_rivet'), steel, liner, 'immersiveengineering:component_steel'],
    '2x ' + mc('nether_brick_fence'), 580).inputFluids(Fluid.of(distilled, 250))
  assemble('blackstone_button', ['2x ' + mc('polished_blackstone'), liner, create('redstone_contact'),
    'pneumaticcraft:ingot_iron_compressed', ks('pressure_gasket')], mc('polished_blackstone_button'), 560)
    .inputFluids(Fluid.of(lubricant, 150))
  assemble('blackstone_pressure_plate', ['3x ' + mc('polished_blackstone'), liner, '2x ' + create('redstone_contact'),
    gt('mv_sensor'), ks('pressure_gasket')], mc('polished_blackstone_pressure_plate'), 680)
    .inputFluids(Fluid.of(lubricant, 200))

  assemble('pack_glowstone', ['6x ' + mc('glowstone_dust'), liner, '2x ' + mc('glass_pane'), '2x ' + seal],
    mc('glowstone'), 580).inputFluids(Fluid.of(distilled, 200))
  assemble('press_quartz_block', ['6x ' + mc('quartz'), '2x ' + ks('abrasive_paste'), liner, mortar],
    mc('quartz_block'), 600).inputFluids(Fluid.of(distilled, 250))
  fire('smooth_quartz', mc('quartz_block'), mc('smooth_quartz'), 540)
  assemble('soul_torches', ['2x ' + mc('stick'), '2x ' + mc('soul_soil'), '2x ' + mc('charcoal'), grit, mortar],
    '2x ' + mc('soul_torch'), 480).inputFluids(Fluid.of(distilled, 200))
  shaped('soul_lantern', mc('soul_lantern'), ['ISI', 'GTG', 'ILI'], {
    I: ks('iron_rivet'), S: stainless, G: mc('glass_pane'), T: mc('soul_torch'), L: liner
  })
  shaped('soul_campfire', mc('soul_campfire'), ['SFS', 'LTL', 'BLB'], {
    S: mc('stick'), F: ks('fire_drill'), L: '#minecraft:logs_that_burn', T: mc('soul_soil'), B: liner
  }).damageIngredient(ks('fire_drill'))
  assemble('mill_blaze_powder', ['2x ' + mc('blaze_rod'), liner, '2x ' + ks('strainer_mesh'), seal],
    '2x ' + mc('blaze_powder'), 680).inputFluids(Fluid.of(distilled, 250))
  machine('mixer', 'magma_emulsion', [mc('blaze_powder'), mc('slime_ball'), grit],
    mc('magma_cream'), 540, 96).inputFluids(Fluid.of(lubricant, 250))
  assemble('magma_blocks', ['4x ' + mc('magma_cream'), '2x ' + grit, liner, mortar],
    '2x ' + mc('magma_block'), 600).inputFluids(Fluid.of(distilled, 300))
  assemble('brewing_stand', [mc('blaze_rod'), '2x ' + stainless, '2x ' + ks('glass_tube_blank'), '2x ' + seal,
    liner, create('spout')], mc('brewing_stand'), 760).inputFluids(Fluid.of(distilled, 500))
  assemble('respawn_anchor', ['6x ' + mc('crying_obsidian'), '3x ' + mc('glowstone'), '2x ' + liner,
    ks('hv_arc_shield'), gt('advanced_integrated_circuit')], mc('respawn_anchor'), 960, 384)
  assemble('lodestone', ['6x ' + mc('chiseled_stone_bricks'), '2x ' + stainless, mc('netherite_ingot'),
    ks('signal_relay'), '2x ' + liner], mc('lodestone'), 900, 384)

  machine('thermal_centrifuge', 'recover_ancient_scrap', [mc('ancient_debris')], mc('netherite_scrap'), 920, 384)
  assemble('netherite_ingot', ['6x ' + mc('netherite_scrap'), '4x ' + mc('gold_ingot'), ks('hv_alloy_coupon'),
    '2x ' + liner], mc('netherite_ingot'), 1040, 480)
  machine('compressor', 'compact_netherite', ['9x ' + mc('netherite_ingot')], mc('netherite_block'), 840, 384)
  machine('forge_hammer', 'split_netherite', [mc('netherite_block')], '9x ' + mc('netherite_ingot'), 840, 384)
  assemble('duplicate_upgrade_template', [mc('netherite_upgrade_smithing_template'), '7x minecraft:diamond',
    '2x ' + liner, ks('hv_alloy_coupon'), mc('netherrack')], '2x ' + mc('netherite_upgrade_smithing_template'), 920, 480)
  assemble('netherite_upgrade_charge', [mc('netherite_ingot'), '2x ' + ks('hv_alloy_coupon'), '2x ' + seal, liner],
    ks('netherite_upgrade_charge'), 940, 480)
  const gearPieces = ['helmet', 'chestplate', 'leggings', 'boots', 'sword', 'pickaxe', 'axe', 'shovel', 'hoe']
  gearPieces.forEach(gear => {
    event.remove({ output: mc('netherite_' + gear) })
    event.remove({ id: mc('netherite_' + gear + '_smithing') })
    event.custom({
      type: mc('smithing_transform'),
      template: { item: mc('netherite_upgrade_smithing_template') },
      base: { item: mc('diamond_' + gear) },
      addition: { item: ks('netherite_upgrade_charge') },
      result: { item: mc('netherite_' + gear) }
    }).id(prefix + 'upgrade_' + gear)
  })
})
