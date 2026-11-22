ServerEvents.recipes(event => {
  const knife = '#gtceu:tools/crafting_knives'
  const hammer = '#gtceu:tools/crafting_hammers'
  const drill = 'gtceu:gregsingularity_fire_drill'
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
  shapeless('fibre_from_saplings', 'gtceu:gregsingularity_plant_fibre', ['#minecraft:saplings', '#minecraft:saplings', 'minecraft:gravel'])
  shapeless('fibre_from_reeds', 'gtceu:gregsingularity_plant_fibre', ['minecraft:sugar_cane', 'minecraft:sugar_cane'])
  shaped('sort_gravel', 'minecraft:flint', ['GG', 'GG'], { G: 'minecraft:gravel' })
  for (const [id, plant] of [['cane', 'minecraft:sugar_cane'], ['wheat', 'minecraft:wheat'], ['kelp', 'minecraft:kelp']]) {
    shapeless('fibre_from_' + id, '2x gtceu:gregsingularity_plant_fibre', [plant, plant, knife]).damageIngredient(knife)
  }
  shaped('braid_cord', 'gtceu:gregsingularity_fibre_cord', ['WW', 'WW'], { W: 'gtceu:gregsingularity_washed_fibre' })
  shapeless('tool_binding', 'gtceu:gregsingularity_tool_binding', ['gtceu:gregsingularity_fibre_cord', 'gtceu:gregsingularity_fibre_cord', 'gtceu:gregsingularity_washed_fibre'])
  shapeless('twisted_string', 'minecraft:string', ['gtceu:gregsingularity_fibre_cord', 'gtceu:gregsingularity_washed_fibre', knife]).damageIngredient(knife)
  shapeless('split_slat', 'gtceu:gregsingularity_rough_slat', ['minecraft:stick', 'minecraft:stick', 'minecraft:stick', knife]).damageIngredient(knife)
  shapeless('carve_peg', '2x gtceu:gregsingularity_wooden_peg', ['minecraft:stick', knife]).damageIngredient(knife)
  shaped('workbench_frame', 'gtceu:gregsingularity_workbench_frame', ['HP', 'BH'], {
    H: 'gtceu:gregsingularity_tool_handle', P: 'gtceu:gregsingularity_wooden_peg', B: 'gtceu:gregsingularity_tool_binding'
  })
  shaped('workbench_top', 'gtceu:gregsingularity_workbench_top', ['SS', 'SB'], {
    S: 'gtceu:gregsingularity_rough_slat', B: 'gtceu:gregsingularity_tool_binding'
  })
  shaped('workbench', 'minecraft:crafting_table', ['TP', 'FB'], {
    T: 'gtceu:gregsingularity_workbench_top', P: 'gtceu:gregsingularity_wedged_tenon', F: 'gtceu:gregsingularity_workbench_frame', B: 'gtceu:gregsingularity_tool_binding'
  })

  shaped('pick_head', 'gtceu:gregsingularity_pick_head', ['FFF', ' G '], { F: 'gtceu:gregsingularity_lapped_edge', G: 'minecraft:gravel' })
  shaped('axe_head', 'gtceu:gregsingularity_axe_head', ['FF', 'FG'], { F: 'gtceu:gregsingularity_lapped_edge', G: 'minecraft:gravel' })
  for (const kind of ['pickaxe', 'axe']) {
    shaped('haft_flint_' + kind, 'gtceu:flint_' + kind, ['BHB', ' P ', ' S '], {
      B: 'gtceu:gregsingularity_tool_binding', H: kind === 'pickaxe' ? 'gtceu:gregsingularity_pick_head' : 'gtceu:gregsingularity_axe_head',
      P: 'gtceu:gregsingularity_wooden_peg', S: 'gtceu:gregsingularity_tool_handle'
    })
  }
  shaped('haft_flint_saw', 'gtceu:flint_saw', ['FFF', 'BHP', ' S '], {
    F: 'gtceu:gregsingularity_flint_shard', B: 'gtceu:gregsingularity_tool_binding', H: 'gtceu:gregsingularity_tool_handle',
    P: 'gtceu:gregsingularity_wooden_peg', S: 'minecraft:stick'
  })
  for (const [kind, pattern] of [
    ['shovel', [' F ', 'BPB', ' H ']],
    ['hoe', ['FF ', 'BP ', ' H ']],
    ['sword', [' F ', 'FBF', 'PH ']]
  ]) {
    var toolParts = { F: 'gtceu:gregsingularity_flint_shard', B: 'gtceu:gregsingularity_tool_binding', P: 'gtceu:gregsingularity_wooden_peg', H: 'gtceu:gregsingularity_tool_handle' }
    shaped('haft_flint_' + kind, 'gtceu:flint_' + kind, pattern, toolParts)
  }
  shaped('flint_mortar', 'gtceu:flint_mortar', ['FHF', 'CPC', 'CCC'], {
    F: 'gtceu:gregsingularity_flint_shard', H: 'gtceu:gregsingularity_tool_handle', C: '#forge:cobblestone', P: 'gtceu:gregsingularity_wooden_peg'
  })
  shaped('stone_hammer', 'gtceu:flint_hammer', ['FCF', 'CBC', ' H '], {
    F: 'gtceu:gregsingularity_flint_shard', C: '#forge:cobblestone', B: 'gtceu:gregsingularity_tool_binding', H: 'gtceu:gregsingularity_tool_handle'
  })
  shaped('stone_hoe', 'minecraft:stone_hoe', ['FCB', ' PH', ' H '], {
    F: 'gtceu:gregsingularity_flint_shard', C: '#forge:cobblestone', B: 'gtceu:gregsingularity_tool_binding',
    P: 'gtceu:gregsingularity_wooden_peg', H: 'gtceu:gregsingularity_tool_handle'
  })
  shaped('fire_drill', drill, [' P ', 'BHB', ' S '], {
    P: 'gtceu:gregsingularity_wooden_peg', B: 'gtceu:gregsingularity_fibre_cord', H: 'gtceu:gregsingularity_tool_handle', S: 'gtceu:gregsingularity_rough_slat'
  })

  function woodRecipes(id, planks, logs) {
    shapeless('hand_split_' + id, '2x ' + planks, [logs, knife]).damageIngredient(knife)
    shapeless('hand_saw_' + id, '3x ' + planks, [logs, '#gtceu:tools/crafting_saws']).damageIngredient('#gtceu:tools/crafting_saws')
    event.recipes.gtceu.cutter('zero_shift:timber/cut_' + id)
      .itemInputs(logs).inputFluids(Fluid.of('minecraft:water', 50))
      .itemOutputs(Item.of(planks, 6)).duration(120).EUt(24)
  }
  Object.entries(woods).forEach(([wood, logs]) => {
    const planks = 'minecraft:' + wood + '_planks'
    event.remove({ output: planks })
    woodRecipes(wood, planks, logs)
  })
  function fitSlab(planks, slab, stockId) {
    event.remove({ id: stockId })
    event.shaped(slab, ['PPP', ' J '], { P: planks, J: 'gtceu:gregsingularity_wooden_peg' }).id(stockId)
  }
  event.remove({ output: 'gtceu:rubber_planks' })
  woodRecipes('rubber', 'gtceu:rubber_planks', '#gtceu:rubber_logs')
  fitSlab('gtceu:rubber_planks', 'gtceu:rubber_slab', 'gtceu:shaped/rubber_slab')
  fitSlab('gtceu:treated_wood_planks', 'gtceu:treated_wood_slab', 'gtceu:shaped/treated_slab')
  ;['driftwood', 'river'].forEach(wood => {
    const planks = 'upgrade_aquatic:' + wood + '_planks'
    if (!Item.exists(planks)) return
    const slab = 'upgrade_aquatic:' + wood + '_slab'
    event.remove({ output: planks })
    woodRecipes(wood, planks, '#upgrade_aquatic:' + wood + '_logs')
    fitSlab(planks, slab, slab)
  })
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
    const slab = 'forestry:' + wood + '_slab'
    fitSlab(planks, slab, slab)
  })
  const fireproofVanillaWood = ['acacia', 'birch', 'cherry', 'dark_oak', 'jungle', 'oak', 'spruce']
  forestryWood.concat(fireproofVanillaWood).forEach(wood => {
    const planks = 'forestry:' + wood + '_fireproof_planks'
    event.remove({ id: planks })
    woodRecipes('forestry_fireproof_' + wood, planks, '#forestry:fireproof_' + wood + '_logs')
    const slab = 'forestry:' + wood + '_fireproof_slab'
    fitSlab(planks, slab, slab)
  })
  shapeless('split_sticks', '2x minecraft:stick', ['#minecraft:planks', knife]).damageIngredient(knife)
  shaped('chest', 'minecraft:chest', ['PPP', 'BHB', 'PPP'], {
    P: '#minecraft:planks', B: 'gtceu:gregsingularity_tool_binding', H: 'gtceu:gregsingularity_wooden_peg'
  })
  shaped('barrel', 'minecraft:barrel', ['SPS', 'BCB', 'SPS'], {
    S: '#minecraft:wooden_slabs', P: '#minecraft:planks', B: 'gtceu:gregsingularity_tool_binding', C: 'minecraft:chest'
  })
  shaped('ladder', '2x minecraft:ladder', ['SBS', 'SPS', 'SBS'], {
    S: 'minecraft:stick', B: 'gtceu:gregsingularity_fibre_cord', P: 'gtceu:gregsingularity_wooden_peg'
  })
  shaped('bowl', 'minecraft:bowl', ['S S', ' S '], { S: 'gtceu:gregsingularity_rough_slat' })
  shapeless('wick_torch', '2x minecraft:torch', ['#minecraft:coals', 'minecraft:stick', 'gtceu:gregsingularity_washed_fibre'])
  shaped('campfire', 'minecraft:campfire', [' D ', 'STS', 'LLL'], {
    D: drill, S: 'minecraft:stick', T: 'gtceu:gregsingularity_plant_fibre', L: '#minecraft:logs_that_burn'
  }).damageIngredient(drill)

  shapeless('hand_grind_wheat', 'gtceu:gregsingularity_coarse_flour', [
    'minecraft:wheat', 'minecraft:wheat', 'minecraft:wheat', hammer
  ]).damageIngredient(hammer)
  shapeless('hand_grind_wheat_mortar', '2x gtceu:gregsingularity_coarse_flour', [
    'minecraft:wheat', 'minecraft:wheat', 'minecraft:wheat', '#gtceu:tools/crafting_mortars'
  ]).damageIngredient('#gtceu:tools/crafting_mortars')
  firing('hearth_bread', 'campfire_cooking', 'gtceu:gregsingularity_camp_dough', 'minecraft:bread', 900, 0.1)
  firing('kiln_bread', 'smelting', 'gtceu:gregsingularity_camp_dough', 'minecraft:bread', 360, 0.1)
  firing('smoker_bread', 'smoking', 'gtceu:gregsingularity_camp_dough', 'minecraft:bread', 180, 0.1)

  shapeless('temper_sand', '2x gtceu:gregsingularity_sand_temper', ['#minecraft:sand', 'minecraft:gravel', hammer]).damageIngredient(hammer)
  shaped('wet_lining', '2x gtceu:gregsingularity_wet_lining', ['CC', 'SF'], {
    C: 'gtceu:gregsingularity_ramming_mix', S: 'gtceu:gregsingularity_sand_temper', F: 'gtceu:gregsingularity_washed_fibre'
  })
  shaped('unfired_clay_bucket', 'gtceu:gregsingularity_unfired_clay_bucket', ['C C', 'CSC', ' C '], {
    C: 'gtceu:gregsingularity_clay_slip_cake', S: 'gtceu:gregsingularity_sand_temper'
  })
  firing('pit_fire_clay_bucket', 'campfire_cooking', 'gtceu:gregsingularity_unfired_clay_bucket', 'gtceu:gregsingularity_clay_bucket', 1600, 0)
  firing('kiln_fire_clay_bucket', 'smelting', 'gtceu:gregsingularity_unfired_clay_bucket', 'gtceu:gregsingularity_clay_bucket', 620, 0.1)
  firing('pit_fire_lining', 'campfire_cooking', 'gtceu:gregsingularity_wet_lining', 'gtceu:gregsingularity_fired_lining', 1800, 0)
  firing('kiln_fire_lining', 'smelting', 'gtceu:gregsingularity_wet_lining', 'gtceu:gregsingularity_fired_lining', 700, 0.1)
  firing('blast_fire_lining', 'blasting', 'gtceu:gregsingularity_wet_lining', 'gtceu:gregsingularity_fired_lining', 350, 0.1)
  // GregTech's electric furnace already imports the smelting recipe above.
  event.recipes.gtceu.alloy_smelter('zero_shift:batch_fired_lining')
    .itemInputs('4x gtceu:gregsingularity_wet_lining')
    .notConsumable('gtceu:gregsingularity_kiln_grate')
    .itemOutputs('4x gtceu:gregsingularity_fired_lining')
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
  shaped('kiln_grate', 'gtceu:gregsingularity_kiln_grate', ['CCC', 'LHL', 'CCC'], {
    C: '#forge:cobblestone', L: 'gtceu:gregsingularity_fired_lining', H: hammer
  }).damageIngredient(hammer)
  shaped('lined_furnace', 'minecraft:furnace', ['CLC', 'LGL', 'CLC'], {
    C: '#forge:cobblestone', L: 'gtceu:gregsingularity_fired_lining', G: 'gtceu:gregsingularity_kiln_grate'
  })
  firing('kiln_brick', 'smelting', 'minecraft:clay_ball', 'minecraft:brick', 340, 0.15)
  shaped('unfired_crucible', 'gtceu:gregsingularity_unfired_crucible', ['C C', 'CSC'], {
    C: 'gtceu:gregsingularity_ramming_mix', S: 'gtceu:gregsingularity_sand_temper'
  })
  firing('kiln_crucible', 'smelting', 'gtceu:gregsingularity_unfired_crucible', 'gtceu:gregsingularity_fired_crucible', 560, 0.2)

  for (const metal of ['copper', 'iron', 'tin', 'gold']) {
    shaped('crush_' + metal, global.gsItemId(metal + '_grit'), ['RH'], {
      R: '#zero_shift:primitive_ores/' + metal, H: hammer
    }).damageIngredient(hammer)
  }
  shaped('copper_charge', 'gtceu:gregsingularity_copper_charge', ['W W', ' C ', ' T '], {
    W: 'gtceu:gregsingularity_washed_copper_grit', C: 'gtceu:gregsingularity_fired_crucible', T: 'minecraft:charcoal'
  })
  for (const metal of ['tin', 'gold']) {
    shaped(metal + '_charge', global.gsItemId(metal + '_charge'), ['W W', ' C ', 'T T'], {
      W: global.gsItemId('washed_' + metal + '_grit'), T: 'minecraft:charcoal',
      C: 'gtceu:gregsingularity_fired_crucible'
    })
  }
  shapeless('hammer_copper_strap', 'gtceu:gregsingularity_copper_strap', ['minecraft:copper_ingot', hammer]).damageIngredient(hammer)
  shaped('iron_charge', 'gtceu:gregsingularity_iron_charge', ['W W', 'TCT'], {
    W: 'gtceu:gregsingularity_washed_iron_grit', T: 'minecraft:charcoal', C: 'gtceu:gregsingularity_fired_crucible'
  })
  shaped('forge_bloom', 'minecraft:iron_ingot', ['H', 'B', 'C'], {
    H: hammer, B: 'gtceu:gregsingularity_iron_bloom', C: 'minecraft:charcoal'
  }).damageIngredient(hammer)
  shapeless('forge_rivet', '2x gtceu:gregsingularity_iron_rivet', ['minecraft:iron_ingot', hammer]).damageIngredient(hammer)
  shaped('hand_forge_iron_plate', 'gtceu:gregsingularity_hand_forged_plate', ['H', 'I', 'I'], {
    H: hammer, I: 'minecraft:iron_ingot'
  }).damageIngredient(hammer)

  const plate = 'gtceu:iron_plate'
  const toolKeys = { P: plate, R: 'gtceu:gregsingularity_iron_rivet', B: 'gtceu:gregsingularity_tool_binding', H: 'gtceu:gregsingularity_tool_handle' }
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
      P: plate, R: 'gtceu:gregsingularity_iron_rivet', B: 'gtceu:gregsingularity_tool_binding'
    })
  }
  shaped('bucket', 'minecraft:bucket', ['PRP', ' P '], { P: plate, R: 'gtceu:gregsingularity_iron_rivet' })
  shaped('shears', 'minecraft:shears', [' P', 'PR', 'BH'], toolKeys)
  shaped('shield', 'minecraft:shield', ['CRC', 'PBP', 'CPC'], {
    C: '#minecraft:planks', R: 'gtceu:gregsingularity_iron_rivet', P: plate, B: 'gtceu:gregsingularity_tool_handle'
  })
  shaped('hopper', 'minecraft:hopper', ['P P', 'PCP', 'RPR'], {
    P: plate, C: 'minecraft:chest', R: 'gtceu:gregsingularity_iron_rivet'
  })
  shaped('iron_door', '2x minecraft:iron_door', ['PR', 'PP', 'PR'], { P: plate, R: 'gtceu:gregsingularity_iron_rivet' })
  shaped('iron_trapdoor', 'minecraft:iron_trapdoor', ['PRP', 'PRP'], { P: plate, R: 'gtceu:gregsingularity_iron_rivet' })
  event.remove({ output: 'minecraft:chain' })
  shaped('chain', 'minecraft:chain', [' R ', 'PHP', ' R '], {
    R: 'gtceu:gregsingularity_iron_rivet', P: plate, H: hammer
  }).damageIngredient(hammer)
  shaped('blast_furnace', 'minecraft:blast_furnace', ['PRP', 'PFP', 'LLL'], {
    P: plate, R: 'gtceu:gregsingularity_iron_rivet', F: 'minecraft:furnace', L: 'gtceu:gregsingularity_fired_lining'
  })
  shaped('smoker', 'minecraft:smoker', ['LPL', 'PFP', 'LPL'], {
    L: '#minecraft:logs_that_burn', P: 'gtceu:gregsingularity_fired_lining', F: 'minecraft:furnace'
  })
})
