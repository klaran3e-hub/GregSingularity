ServerEvents.recipes(event => {
  const mc = id => 'minecraft:' + id
  const ks = id => 'kubejs:' + id
  const gt = id => 'gtceu:' + id
  const prefix = 'zero_shift:building/'
  const sand = ks('sand_temper')
  const mortar = ks('clay_mortar')
  const abrasive = ks('abrasive_paste')
  const lining = ks('fired_lining')
  const rivet = ks('iron_rivet')
  const plate = ks('hand_forged_plate')
  const binder = ks('tool_binding')
  const oil = gt('lubricant')
  const distilled = gt('distilled_water')
  const stockRecipes = []

  function replace(output) {
    stockRecipes.push({ output: mc(output) })
  }

  function shaped(output, count, pattern, keys) {
    event.shaped(count + 'x ' + mc(output), pattern, keys).id(prefix + output)
  }

  function wetProcess(type, id, solids, fluid, amount, output, count, time, heat) {
    const recipe = {
      type: 'create:' + type,
      ingredients: solids.map(item => ({ item: item })).concat({ fluid: fluid, amount: amount }),
      results: [{ item: mc(output), count: count }]
    }
    if (time) recipe.processingTime = time
    if (heat) recipe.heatRequirement = 'heated'
    event.custom(recipe).id(prefix + id)
  }

  function fire(output, input, ticks) {
    event.custom({
      type: 'minecraft:smelting', category: 'blocks', ingredient: { item: mc(input) },
      result: mc(output), cookingtime: ticks, experience: 0.15
    }).id(prefix + 'fire_' + output)
  }

  function assemble(output, count, items, ticks, eu, fluid, amount) {
    const recipe = event.recipes.gtceu.assembler(prefix + output)
    items.forEach(item => recipe.itemInputs(item))
    recipe.itemOutputs(count + 'x ' + mc(output)).duration(ticks).EUt(eu)
    if (fluid) recipe.inputFluids(Fluid.of(fluid, amount))
  }

  const colors = [
    'white', 'orange', 'magenta', 'light_blue', 'yellow', 'lime', 'pink', 'gray',
    'light_gray', 'cyan', 'purple', 'blue', 'brown', 'green', 'red', 'black'
  ]
  colors.forEach(color => {
    const dye = mc(color + '_dye')
    const powder = color + '_concrete_powder'
    const glass = color + '_stained_glass'
    const pane = color + '_stained_glass_pane'
    const terracotta = color + '_terracotta'
    const glaze = color + '_glazed_terracotta'
    const candle = color + '_candle'
    ;[powder, color + '_concrete', glass, pane, terracotta, glaze, candle].forEach(replace)

    // The powder carries the material cost even when a player hardens it against water.
    wetProcess('mixing', powder, [sand, sand, mortar, mortar, mc('gravel'), mc('gravel'), dye],
      mc('water'), 250, powder, 2, 280)
    wetProcess('filling', 'cure_' + color + '_concrete', [mc(powder)], mc('water'), 125,
      color + '_concrete', 1)
    wetProcess('compacting', glass, [mc('glass'), mc('glass'), dye, abrasive],
      mc('water'), 150, glass, 2, 180, true)
    shaped(pane, 2, [' G ', 'GFG', ' A '], { G: mc(glass), F: ks('copper_strap'), A: abrasive })

    shaped(terracotta, 4, ['TTT', 'ADA', ' T '], { T: mc('terracotta'), A: sand, D: dye })
    wetProcess('compacting', glaze, [mc(terracotta), dye, mc('quartz'), abrasive],
      distilled, 200, glaze, 1, 280, true)
    shaped(candle, 1, ['S ', 'CD', 'H '], {
      S: mc('string'), C: mc('candle'), D: dye, H: mc('honeycomb')
    })
  })

  replace('terracotta')
  fire('terracotta', 'clay', 480)
  replace('tinted_glass')
  wetProcess('compacting', 'tinted_glass', [
    mc('glass'), mc('glass'), mc('amethyst_shard'), mc('amethyst_shard'),
    mc('amethyst_shard'), mc('amethyst_shard'), abrasive
  ], distilled, 250, 'tinted_glass', 1, 360, true)

  replace('candle')
  shaped('candle', 1, [' C ', 'HSH', ' F '], {
    C: ks('fibre_cord'), H: mc('honeycomb'), S: mc('string'), F: ks('washed_fibre')
  })
  replace('lantern')
  shaped('lantern', 1, ['RCR', 'GTG', 'RPR'], {
    R: rivet, C: mc('chain'), G: mc('glass_pane'), T: mc('torch'), P: plate
  })
  replace('jack_o_lantern')
  shaped('jack_o_lantern', 1, [' S ', 'PCP', ' T '], {
    S: ks('copper_strap'), P: ks('wooden_peg'), C: mc('carved_pumpkin'), T: mc('lantern')
  })
  replace('sea_lantern')
  assemble('sea_lantern', 1, [
    '4x minecraft:prismarine_shard', '6x minecraft:prismarine_crystals',
    '2x minecraft:glass_pane', lining, ks('pressed_insulation')
  ], 760, 28, distilled, 350)
  replace('redstone_lamp')
  assemble('redstone_lamp', 1, [
    mc('glowstone'), '4x minecraft:redstone', '2x minecraft:glass_pane',
    gt('lv_emitter'), ks('pressed_insulation'), ks('copper_contact_strip')
  ], 720, 96, oil, 250)
  replace('flower_pot')
  shaped('flower_pot', 1, ['B B', ' M ', 'B B'], { B: mc('brick'), M: mortar })
  replace('scaffolding')
  event.remove({ id: 'gtceu:assembler/scaffolding' })
  shaped('scaffolding', 2, ['BFB', 'BJB', 'BPB'], {
    B: mc('bamboo'), F: ks('fibre_cord'), J: binder, P: ks('wooden_peg')
  })

  const castStone = [
    ['andesite', 'diorite', 'cobblestone'], ['diorite', 'cobblestone', 'quartz'],
    ['granite', 'diorite', 'quartz']
  ]
  castStone.forEach(([output, base, aggregate]) => {
    replace(output)
    shaped(output, 1, ['BSB', 'GAG', ' M '], {
      B: mc(base), G: mc(aggregate), S: sand, A: abrasive, M: mortar
    })
  })

  const stonePolish = [
    ['polished_andesite', 'andesite'], ['polished_diorite', 'diorite'],
    ['polished_granite', 'granite'], ['polished_deepslate', 'cobbled_deepslate'],
    ['cut_sandstone', 'sandstone'], ['cut_red_sandstone', 'red_sandstone']
  ]
  stonePolish.forEach(([output, input]) => {
    replace(output)
    wetProcess('compacting', output, [mc(input), mc(input), abrasive],
      mc('water'), 125, output, 1, 180)
  })
  const carved = [
    ['chiseled_stone_bricks', 'stone_bricks'], ['chiseled_deepslate', 'polished_deepslate'],
    ['chiseled_sandstone', 'cut_sandstone'], ['chiseled_red_sandstone', 'cut_red_sandstone'],
    ['chiseled_quartz_block', 'quartz_block'], ['quartz_pillar', 'quartz_block']
  ]
  carved.forEach(([output, input]) => {
    replace(output)
    shaped(output, 1, output === 'quartz_pillar' ? ['ASA', ' M ', 'ASA'] : [' S ', 'AMA', ' S '], {
      S: mc(input), A: abrasive, M: mortar
    })
  })
  const wallStock = [
    ['sandstone', 'sand', sand], ['red_sandstone', 'red_sand', sand],
    ['deepslate_bricks', 'polished_deepslate', mortar], ['deepslate_tiles', 'deepslate_bricks', abrasive],
    ['mud_bricks', 'packed_mud', mortar], ['dripstone_block', 'pointed_dripstone', sand],
    ['prismarine', 'prismarine_shard', mortar], ['prismarine_bricks', 'prismarine', abrasive],
    ['quartz_bricks', 'quartz_block', mortar]
  ]
  wallStock.forEach(([output, input, joint]) => {
    replace(output)
    shaped(output, 1, ['SSS', 'SJS', 'SSS'], { S: mc(input), J: joint })
  })
  replace('dark_prismarine')
  shaped('dark_prismarine', 1, ['PSP', 'DMD', 'PSP'], {
    P: mc('prismarine'), S: mc('prismarine_shard'), D: mc('black_dye'), M: mortar
  })
  replace('packed_mud')
  wetProcess('compacting', 'packed_mud', [mc('mud'), mc('mud'), ks('plant_fibre'), ks('plant_fibre'), sand],
    mc('water'), 125, 'packed_mud', 2, 220)
  replace('muddy_mangrove_roots')
  wetProcess('compacting', 'muddy_mangrove_roots', [mc('mangrove_roots'), mc('mud'), mortar],
    mc('water'), 125, 'muddy_mangrove_roots', 1, 180)
  const mudShapes = [
    ['slab', ['SSS', ' A '], 2],
    ['stairs', ['S A', 'SS ', 'SSS'], 2],
    ['wall', ['SSS', 'SAS'], 2]
  ]
  mudShapes.forEach(([shape, pattern, count]) => {
    const output = 'mud_brick_' + shape
    replace(output)
    shaped(output, count, pattern, { S: mc('mud_bricks'), A: mortar })
  })
  ;[['mossy_cobblestone', 'cobblestone'], ['mossy_stone_bricks', 'stone_bricks']].forEach(([output, input]) => {
    replace(output)
    ;['moss_block', 'vine'].forEach(cover => {
      wetProcess('compacting', output + '_with_' + cover, [mc(input), mc(input), mc(cover), mortar],
        mc('water'), 125, output, 2, 180)
    })
  })
  replace('moss_carpet')
  shaped('moss_carpet', 2, ['MM', 'FF'], { M: mc('moss_block'), F: ks('plant_fibre') })
  ;[
    ['stone', 'cobblestone'], ['deepslate', 'cobbled_deepslate'], ['sponge', 'wet_sponge'],
    ['smooth_stone', 'stone'], ['smooth_sandstone', 'sandstone'], ['smooth_red_sandstone', 'red_sandstone'],
    ['cracked_stone_bricks', 'stone_bricks'], ['cracked_deepslate_bricks', 'deepslate_bricks'],
    ['cracked_deepslate_tiles', 'deepslate_tiles']
  ].forEach(([output, input]) => {
    if (output === 'stone') {
      stockRecipes.push({ type: 'minecraft:smelting', output: mc(output) })
    } else {
      replace(output)
    }
    fire(output, input, 520)
  })
  replace('smooth_stone_slab')
  shaped('smooth_stone_slab', 2, ['SSS', ' A '], { S: mc('smooth_stone'), A: abrasive })

  replace('snow')
  shaped('snow', 2, ['SSS', ' F '], { S: mc('snow_block'), F: ks('plant_fibre') })
  replace('snow_block')
  shaped('snow_block', 1, ['SSS', 'SFS', ' S '], { S: mc('snowball'), F: ks('washed_fibre') })
  ;['packed_ice', 'blue_ice'].forEach(output => {
    replace(output)
    event.remove({ id: 'pneumaticcraft:pressure_chamber/' + output })
  })
  event.recipes.gtceu.compressor(prefix + 'packed_ice')
    .itemInputs('12x minecraft:ice').itemOutputs(mc('packed_ice')).duration(420).EUt(24)
  event.custom({
    type: 'pneumaticcraft:pressure_chamber',
    inputs: [{ type: 'pneumaticcraft:stacked_item', item: mc('packed_ice'), count: 16 }],
    pressure: 3.5,
    results: [{ item: mc('blue_ice') }]
  }).id(prefix + 'blue_ice')

  // Weathering remains a block mechanic. The stock ingot packing routes stay closed-loop.
  const copperUpkeep = { id: /^create:deploying\/[a-z_]+_from_(removing_wax|deoxidising)$/ }
  ;['', 'exposed_', 'weathered_', 'oxidized_'].forEach(age => {
    const block = age === '' ? 'copper_block' : age + 'copper'
    const cut = age + 'cut_copper'
    const waxedBlock = 'waxed_' + block
    const waxedCut = 'waxed_' + cut
    replace(waxedBlock)
    shaped(waxedBlock, 1, ['HBH', ' S '], { H: mc('honeycomb'), B: mc(block), S: binder })
    ;[[block, cut], [waxedBlock, waxedCut]].forEach(([source, panel]) => {
      const slab = panel + '_slab'
      const stairs = panel + '_stairs'
      ;[panel, slab, stairs].forEach(output => {
        stockRecipes.push({ output: mc(output), not: copperUpkeep })
      })
      wetProcess('compacting', panel, [mc(source), abrasive, ks('copper_strap')],
        mc('water'), 100, panel, 1, 240)
      shaped(slab, 2, ['CCC', ' A '], { C: mc(panel), A: abrasive })
      shaped(stairs, 2, ['C R', 'CC ', 'CCC'], { C: mc(panel), R: rivet })
    })
    const coated = [
      [cut, waxedCut], [cut + '_slab', waxedCut + '_slab'], [cut + '_stairs', waxedCut + '_stairs']
    ]
    coated.forEach(([input, output]) => {
      wetProcess('compacting', 'coat_' + output, [mc(input), mc('honeycomb'), binder],
        mc('water'), 125, output, 1, 180)
    })
  })

  // KubeJS filters only the original recipe map, so the replacements remain intact.
  event.remove(stockRecipes)
})
