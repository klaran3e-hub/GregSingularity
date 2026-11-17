ServerEvents.recipes(event => {
  const knife = 'gtceu:flint_knife'
  const hammer = 'gtceu:flint_hammer'
  const drill = 'kubejs:fire_drill'
  const flintTools = ['knife', 'axe', 'pickaxe', 'saw', 'shovel', 'hoe', 'sword', 'mortar', 'hammer']
  flintTools.forEach(tool => event.remove({ output: 'gtceu:flint_' + tool }))
  const woods = {
    oak: '#minecraft:oak_logs',
    spruce: '#minecraft:spruce_logs',
    birch: '#minecraft:birch_logs',
    jungle: '#minecraft:jungle_logs',
    acacia: '#minecraft:acacia_logs',
    dark_oak: '#minecraft:dark_oak_logs',
    mangrove: '#minecraft:mangrove_logs',
    cherry: '#minecraft:cherry_logs',
    crimson: '#minecraft:crimson_stems',
    warped: '#minecraft:warped_stems',
    bamboo: '#minecraft:bamboo_blocks'
  }

  const replaced = [
    'stick', 'string', 'crafting_table', 'chest', 'barrel', 'torch', 'campfire',
    'furnace', 'blast_furnace', 'smoker', 'charcoal', 'brick', 'ladder', 'bowl',
    'bucket', 'shears', 'shield', 'hopper', 'iron_door', 'iron_trapdoor',
    'bread'
  ]
  for (const kind of ['pickaxe', 'axe', 'shovel', 'hoe', 'sword']) {
    replaced.push('wooden_' + kind, 'stone_' + kind, 'iron_' + kind)
  }
  for (const kind of ['helmet', 'chestplate', 'leggings', 'boots']) {
    replaced.push('iron_' + kind)
  }
  for (const id of replaced) {
    event.remove({ output: 'minecraft:' + id })
  }
  function shaped(id, output, pattern, keys) {
    return event.shaped(output, pattern, keys).id('zero_shift:' + id)
  }

  function shapeless(id, output, ingredients) {
    return event.shapeless(output, ingredients).id('zero_shift:' + id)
  }

  function firing(id, type, input, output, ticks, experience) {
    event.custom({
      type: 'minecraft:' + type,
      ingredient: { item: input },
      result: output,
      experience: experience,
      cookingtime: ticks
    }).id('zero_shift:' + id)
  }

  // Everything before the workbench fits the inventory's 2×2 grid.
  shapeless('stick_from_saplings', 'minecraft:stick', ['#minecraft:saplings', '#minecraft:saplings'])
  shapeless('stick_from_bamboo', 'minecraft:stick', ['minecraft:bamboo', 'minecraft:bamboo'])
  shapeless('fibre_from_saplings', 'kubejs:plant_fibre', ['#minecraft:saplings', '#minecraft:saplings', 'minecraft:gravel'])
  shapeless('fibre_from_reeds', 'kubejs:plant_fibre', ['minecraft:sugar_cane', 'minecraft:sugar_cane'])
  shaped('sort_gravel', 'minecraft:flint', ['GG', 'GG'], { G: 'minecraft:gravel' })
  shapeless('knap_flint', 'kubejs:flint_shard', ['minecraft:flint', 'minecraft:flint', 'minecraft:gravel'])
  shaped('flint_knife', knife, ['FS', 'TB'], {
    F: 'kubejs:flint_shard', S: 'minecraft:stick', T: 'minecraft:flint', B: 'kubejs:plant_fibre'
  })
  for (const [id, plant] of [['cane', 'minecraft:sugar_cane'], ['wheat', 'minecraft:wheat'], ['kelp', 'minecraft:kelp']]) {
    shapeless('fibre_from_' + id, '2x kubejs:plant_fibre', [plant, plant, knife]).damageIngredient(knife)
  }
  shaped('braid_cord', 'kubejs:fibre_cord', ['WW', 'WW'], { W: 'kubejs:washed_fibre' })
  shapeless('tool_binding', 'kubejs:tool_binding', ['kubejs:fibre_cord', 'kubejs:fibre_cord', 'kubejs:washed_fibre'])
  shapeless('twisted_string', 'minecraft:string', ['kubejs:fibre_cord', 'kubejs:washed_fibre', knife]).damageIngredient(knife)
  shapeless('carve_handle', 'kubejs:tool_handle', ['minecraft:stick', 'minecraft:stick', knife]).damageIngredient(knife)
  shapeless('split_slat', 'kubejs:rough_slat', ['minecraft:stick', 'minecraft:stick', 'minecraft:stick', knife]).damageIngredient(knife)
  shapeless('carve_peg', '2x kubejs:wooden_peg', ['minecraft:stick', knife]).damageIngredient(knife)
  shaped('workbench_frame', 'kubejs:workbench_frame', ['HP', 'BH'], {
    H: 'kubejs:tool_handle', P: 'kubejs:wooden_peg', B: 'kubejs:tool_binding'
  })
  shaped('workbench_top', 'kubejs:workbench_top', ['SS', 'SB'], {
    S: 'kubejs:rough_slat', B: 'kubejs:tool_binding'
  })
  shaped('workbench', 'minecraft:crafting_table', ['TP', 'FB'], {
    T: 'kubejs:workbench_top', P: 'kubejs:wooden_peg', F: 'kubejs:workbench_frame', B: 'kubejs:tool_binding'
  })

  shaped('pick_head', 'kubejs:pick_head', ['FFF', ' G '], { F: 'kubejs:flint_shard', G: 'minecraft:gravel' })
  shaped('axe_head', 'kubejs:axe_head', ['FF', 'FG'], { F: 'kubejs:flint_shard', G: 'minecraft:gravel' })
  for (const kind of ['pickaxe', 'axe']) {
    shaped('haft_flint_' + kind, 'gtceu:flint_' + kind, ['BHB', ' P ', ' S '], {
      B: 'kubejs:tool_binding', H: kind === 'pickaxe' ? 'kubejs:pick_head' : 'kubejs:axe_head',
      P: 'kubejs:wooden_peg', S: 'kubejs:tool_handle'
    })
  }
  shaped('haft_flint_saw', 'gtceu:flint_saw', ['FFF', 'BHP', ' S '], {
    F: 'kubejs:flint_shard', B: 'kubejs:tool_binding', H: 'kubejs:tool_handle',
    P: 'kubejs:wooden_peg', S: 'minecraft:stick'
  })
  for (const [kind, pattern] of [
    ['shovel', [' F ', 'BPB', ' H ']],
    ['hoe', ['FF ', 'BP ', ' H ']],
    ['sword', [' F ', 'FBF', 'PH ']]
  ]) {
    var toolParts = { F: 'kubejs:flint_shard', B: 'kubejs:tool_binding', P: 'kubejs:wooden_peg', H: 'kubejs:tool_handle' }
    shaped('haft_flint_' + kind, 'gtceu:flint_' + kind, pattern, toolParts)
  }
  shaped('flint_mortar', 'gtceu:flint_mortar', ['FHF', 'CPC', 'CCC'], {
    F: 'kubejs:flint_shard', H: 'kubejs:tool_handle', C: '#forge:cobblestone', P: 'kubejs:wooden_peg'
  })
  shaped('stone_hammer', hammer, ['FCF', 'CBC', ' H '], {
    F: 'kubejs:flint_shard', C: '#forge:cobblestone', B: 'kubejs:tool_binding', H: 'kubejs:tool_handle'
  })
  shaped('stone_hoe', 'minecraft:stone_hoe', ['FCB', ' PH', ' H '], {
    F: 'kubejs:flint_shard', C: '#forge:cobblestone', B: 'kubejs:tool_binding',
    P: 'kubejs:wooden_peg', H: 'kubejs:tool_handle'
  })
  shaped('fire_drill', drill, [' P ', 'BHB', ' S '], {
    P: 'kubejs:wooden_peg', B: 'kubejs:fibre_cord', H: 'kubejs:tool_handle', S: 'kubejs:rough_slat'
  })

  function woodRecipes(id, planks, logs) {
    shapeless('hand_split_' + id, '2x ' + planks, [logs, knife]).damageIngredient(knife)
    shapeless('hand_saw_' + id, '3x ' + planks, [logs, 'gtceu:flint_saw']).damageIngredient('gtceu:flint_saw')
    event.custom({
      type: 'create:cutting',
      ingredients: [{ tag: logs.substring(1) }],
      processingTime: 160,
      results: [{ item: planks, count: 4 }]
    }).id('zero_shift:create/saw_planks_' + id)
  }
  Object.entries(woods).forEach(([wood, logs]) => {
    const planks = 'minecraft:' + wood + '_planks'
    event.remove({ output: planks })
    woodRecipes(wood, planks, logs)
  })
  event.remove({ output: 'gtceu:rubber_planks' })
  woodRecipes('rubber', 'gtceu:rubber_planks', '#gtceu:rubber_logs')
  if (Item.exists('upgrade_aquatic:driftwood_planks')) {
    event.remove({ output: 'upgrade_aquatic:driftwood_planks' })
    woodRecipes('driftwood', 'upgrade_aquatic:driftwood_planks', '#upgrade_aquatic:driftwood_logs')
  }
  const forestryWood = [
    'acacia_desert', 'balsa', 'baobab', 'beech', 'chestnut', 'citrus', 'cocobolo', 'coconut',
    'dogwood', 'ebony', 'elm', 'feijoa', 'fir', 'giganteum', 'ginkgo', 'greenheart',
    'hill_cherry', 'ipe', 'jacaranda', 'kapok', 'kauri', 'larch', 'lime', 'macrocarpa',
    'mahoe', 'mahogany', 'maple', 'olive', 'orange', 'padauk', 'palm', 'papaya',
    'pear', 'pewen', 'pine', 'plum', 'poplar', 'sequoia', 'teak', 'walnut',
    'wenge', 'willow', 'zebrawood'
  ]
  forestryWood.forEach(wood => {
    const planks = 'forestry:' + wood + '_planks'
    event.remove({ id: planks })
    woodRecipes('forestry_' + wood, planks, '#forestry:' + wood + '_logs')
  })
  shapeless('split_sticks', '2x minecraft:stick', ['#minecraft:planks', knife]).damageIngredient(knife)
  shaped('chest', 'minecraft:chest', ['PPP', 'BHB', 'PPP'], {
    P: '#minecraft:planks', B: 'kubejs:tool_binding', H: 'kubejs:wooden_peg'
  })
  shaped('barrel', 'minecraft:barrel', ['SPS', 'BCB', 'SPS'], {
    S: '#minecraft:wooden_slabs', P: '#minecraft:planks', B: 'kubejs:tool_binding', C: 'minecraft:chest'
  })
  shaped('ladder', '2x minecraft:ladder', ['SBS', 'SPS', 'SBS'], {
    S: 'minecraft:stick', B: 'kubejs:fibre_cord', P: 'kubejs:wooden_peg'
  })
  shaped('bowl', 'minecraft:bowl', ['S S', ' S '], { S: 'kubejs:rough_slat' })
  shapeless('wick_torch', '2x minecraft:torch', ['#minecraft:coals', 'minecraft:stick', 'kubejs:washed_fibre'])
  shaped('campfire', 'minecraft:campfire', [' D ', 'STS', 'LLL'], {
    D: drill, S: 'minecraft:stick', T: 'kubejs:plant_fibre', L: '#minecraft:logs_that_burn'
  }).damageIngredient(drill)

  event.remove({ id: 'create:crafting/appliances/dough' })
  shapeless('hand_grind_wheat', 'create:wheat_flour', [
    'minecraft:wheat', 'minecraft:wheat', 'minecraft:wheat', hammer
  ]).damageIngredient(hammer)
  shapeless('hand_grind_wheat_mortar', '2x create:wheat_flour', [
    'minecraft:wheat', 'minecraft:wheat', 'minecraft:wheat', 'gtceu:flint_mortar'
  ]).damageIngredient('gtceu:flint_mortar')
  firing('hearth_bread', 'campfire_cooking', 'create:dough', 'minecraft:bread', 900, 0.1)
  firing('kiln_bread', 'smelting', 'create:dough', 'minecraft:bread', 360, 0.1)
  firing('smoker_bread', 'smoking', 'create:dough', 'minecraft:bread', 180, 0.1)

  shapeless('temper_sand', '2x kubejs:sand_temper', ['#minecraft:sand', 'minecraft:gravel', hammer]).damageIngredient(hammer)
  shaped('wet_lining', 'kubejs:wet_lining', ['CC', 'SF'], {
    C: 'minecraft:clay_ball', S: 'kubejs:sand_temper', F: 'kubejs:washed_fibre'
  })
  shaped('unfired_clay_bucket', 'kubejs:unfired_clay_bucket', ['C C', 'CSC', ' C '], {
    C: 'minecraft:clay_ball', S: 'kubejs:sand_temper'
  })
  firing('pit_fire_clay_bucket', 'campfire_cooking', 'kubejs:unfired_clay_bucket', 'kubejs:clay_bucket', 1600, 0)
  firing('kiln_fire_clay_bucket', 'smelting', 'kubejs:unfired_clay_bucket', 'kubejs:clay_bucket', 620, 0.1)
  firing('pit_fire_lining', 'campfire_cooking', 'kubejs:wet_lining', 'kubejs:fired_lining', 1800, 0)
  firing('kiln_fire_lining', 'smelting', 'kubejs:wet_lining', 'kubejs:fired_lining', 700, 0.1)
  firing('blast_fire_lining', 'blasting', 'kubejs:wet_lining', 'kubejs:fired_lining', 350, 0.1)
  event.recipes.gtceu.electric_furnace('zero_shift:gtceu/furnace/industrial_fired_lining')
    .itemInputs('kubejs:wet_lining')
    .itemOutputs('kubejs:fired_lining')
    .duration(1800)
    .EUt(16)
  event.recipes.gtceu.electric_furnace('zero_shift:gtceu/furnace/batch_fired_lining')
    .itemInputs('4x kubejs:wet_lining')
    .itemOutputs('4x kubejs:fired_lining')
    .duration(1800)
    .EUt(30)
  for (const wood of Object.keys(woods)) {
    if (['crimson', 'warped', 'bamboo'].includes(wood)) continue
    for (const [type, time] of [['campfire_cooking', 800], ['smelting', 360]]) {
      event.custom({
        type: 'minecraft:' + type, ingredient: { tag: 'minecraft:' + wood + '_logs' },
        result: 'minecraft:charcoal', experience: 0.15, cookingtime: time
      }).id('zero_shift:charcoal_' + wood + '/' + type)
    }
  }
  shaped('kiln_grate', 'kubejs:kiln_grate', ['CCC', 'LHL', 'CCC'], {
    C: '#forge:cobblestone', L: 'kubejs:fired_lining', H: hammer
  }).damageIngredient(hammer)
  shaped('lined_furnace', 'minecraft:furnace', ['CLC', 'LGL', 'CLC'], {
    C: '#forge:cobblestone', L: 'kubejs:fired_lining', G: 'kubejs:kiln_grate'
  })
  firing('kiln_brick', 'smelting', 'minecraft:clay_ball', 'minecraft:brick', 340, 0.15)
  shaped('unfired_crucible', 'kubejs:unfired_crucible', ['C C', 'CSC'], {
    C: 'minecraft:clay_ball', S: 'kubejs:sand_temper'
  })
  firing('kiln_crucible', 'smelting', 'kubejs:unfired_crucible', 'kubejs:fired_crucible', 560, 0.2)

  for (const metal of ['copper', 'iron', 'tin', 'gold']) {
    shaped('crush_' + metal, 'kubejs:' + metal + '_grit', ['RR', 'RH'], {
      R: '#zero_shift:primitive_ores/' + metal, H: hammer
    }).damageIngredient(hammer)
  }
  shaped('copper_charge', 'kubejs:copper_charge', ['WWW', 'WCW', ' T '], {
    W: 'kubejs:washed_copper_grit', C: 'kubejs:fired_crucible', T: 'minecraft:charcoal'
  })
  firing('kiln_copper', 'smelting', 'kubejs:copper_charge', 'minecraft:copper_ingot', 800, 0.7)
  for (const [metal, ingot] of [['tin', 'gtceu:tin_ingot'], ['gold', 'minecraft:gold_ingot']]) {
    shaped(metal + '_charge', 'kubejs:' + metal + '_charge', ['WWW', 'TCT', ' L '], {
      W: 'kubejs:washed_' + metal + '_grit', T: 'minecraft:charcoal',
      C: 'kubejs:fired_crucible', L: 'kubejs:fired_lining'
    })
    firing('kiln_' + metal, 'smelting', 'kubejs:' + metal + '_charge', ingot, 1000, 0.7)
  }
  shapeless('hammer_copper_strap', 'kubejs:copper_strap', ['minecraft:copper_ingot', hammer]).damageIngredient(hammer)
  shaped('iron_charge', 'kubejs:iron_charge', ['WWW', 'TCT', 'LSL'], {
    W: 'kubejs:washed_iron_grit', T: 'minecraft:charcoal', C: 'kubejs:fired_crucible',
    L: 'kubejs:fired_lining', S: 'kubejs:copper_strap'
  })
  firing('kiln_bloom', 'smelting', 'kubejs:iron_charge', 'kubejs:iron_bloom', 1200, 0.7)
  shaped('forge_bloom', 'minecraft:iron_ingot', ['H', 'B', 'C'], {
    H: hammer, B: 'kubejs:iron_bloom', C: 'minecraft:charcoal'
  }).damageIngredient(hammer)
  shapeless('forge_rivet', '2x kubejs:iron_rivet', ['minecraft:iron_ingot', hammer]).damageIngredient(hammer)
  shaped('hand_forge_iron_plate', 'kubejs:hand_forged_plate', ['H', 'I', 'I'], {
    H: hammer, I: 'minecraft:iron_ingot'
  }).damageIngredient(hammer)

  const plate = 'gtceu:iron_plate'
  const toolKeys = { P: plate, R: 'kubejs:iron_rivet', B: 'kubejs:tool_binding', H: 'kubejs:tool_handle' }
  const tools = {
    pickaxe: ['PPP', 'RHR', ' B '],
    axe: ['PP ', 'PHR', ' B '],
    shovel: [' P ', 'RHR', ' B '],
    hoe: ['PP ', 'RHR', ' B '],
    sword: [' P ', 'RPR', 'BHB']
  }
  for (const [kind, pattern] of Object.entries(tools)) {
    shaped('iron_' + kind, 'minecraft:iron_' + kind, pattern, toolKeys)
  }
  const armour = {
    helmet: ['PPP', 'RBR', 'P P'],
    chestplate: ['PRP', 'PBP', 'PRP'],
    leggings: ['PRP', 'PBP', 'P P'],
    boots: ['P P', 'RBR', 'P P']
  }
  for (const [kind, pattern] of Object.entries(armour)) {
    shaped('iron_' + kind, 'minecraft:iron_' + kind, pattern, {
      P: plate, R: 'kubejs:iron_rivet', B: 'kubejs:tool_binding'
    })
  }
  shaped('bucket', 'minecraft:bucket', ['PRP', ' P '], { P: plate, R: 'kubejs:iron_rivet' })
  shaped('shears', 'minecraft:shears', [' P', 'PR', 'BH'], toolKeys)
  shaped('shield', 'minecraft:shield', ['CRC', 'PBP', 'CPC'], {
    C: '#minecraft:planks', R: 'kubejs:iron_rivet', P: plate, B: 'kubejs:tool_handle'
  })
  shaped('hopper', 'minecraft:hopper', ['P P', 'PCP', 'RPR'], {
    P: plate, C: 'minecraft:chest', R: 'kubejs:iron_rivet'
  })
  shaped('iron_door', '2x minecraft:iron_door', ['PR', 'PP', 'PR'], { P: plate, R: 'kubejs:iron_rivet' })
  shaped('iron_trapdoor', 'minecraft:iron_trapdoor', ['PRP', 'PRP'], { P: plate, R: 'kubejs:iron_rivet' })
  event.remove({ output: 'minecraft:chain' })
  shaped('chain', 'minecraft:chain', [' R ', 'PHP', ' R '], {
    R: 'kubejs:iron_rivet', P: plate, H: hammer
  }).damageIngredient(hammer)
  shaped('blast_furnace', 'minecraft:blast_furnace', ['PRP', 'PFP', 'LLL'], {
    P: plate, R: 'kubejs:iron_rivet', F: 'minecraft:furnace', L: 'kubejs:fired_lining'
  })
  shaped('smoker', 'minecraft:smoker', ['LPL', 'PFP', 'LPL'], {
    L: '#minecraft:logs_that_burn', P: 'kubejs:fired_lining', F: 'minecraft:furnace'
  })
})
