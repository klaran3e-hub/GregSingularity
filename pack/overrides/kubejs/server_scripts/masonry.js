ServerEvents.recipes(event => {
  const chisel = 'kubejs:stone_chisel'
  const abrasive = 'kubejs:abrasive_paste'
  const mortar = 'kubejs:clay_mortar'
  const hammer = 'kubejs:stone_hammer'

  event.shaped(chisel, [' FS', ' BF', 'H  '], {
    F: 'kubejs:flint_shard', S: 'minecraft:flint', B: 'kubejs:tool_binding', H: 'kubejs:tool_handle'
  }).id('zero_shift:masonry/stone_chisel')
  event.shapeless(abrasive, ['minecraft:gravel', '#minecraft:sand', 'kubejs:washed_fibre', hammer])
    .id('zero_shift:masonry/abrasive').damageIngredient(hammer)
  event.shaped('2x ' + mortar, ['CC', 'SA'], {
    C: 'minecraft:clay_ball', S: 'kubejs:sand_temper', A: abrasive
  }).id('zero_shift:masonry/mortar')
  event.remove({ output: 'minecraft:stonecutter' })
  event.shaped('minecraft:stonecutter', [' T ', 'PVP', 'BBB'], {
    T: 'kubejs:saw_blade', P: 'gtceu:iron_plate', V: 'kubejs:shaft_bushing', B: 'minecraft:stone_bricks'
  }).id('zero_shift:masonry/stonecutter')

  const families = [
    ['stone', 'stone', 's'], ['cobblestone', 'cobblestone', 'sw'], ['mossy_cobblestone', 'mossy_cobblestone', 'sw'],
    ['stone_bricks', 'stone_brick', 'sw'], ['mossy_stone_bricks', 'mossy_stone_brick', 'sw'],
    ['andesite', 'andesite', 'sw'], ['diorite', 'diorite', 'sw'], ['granite', 'granite', 'sw'],
    ['polished_andesite', 'polished_andesite', 's'], ['polished_diorite', 'polished_diorite', 's'],
    ['polished_granite', 'polished_granite', 's'], ['bricks', 'brick', 'sw'],
    ['sandstone', 'sandstone', 'sw'], ['red_sandstone', 'red_sandstone', 'sw'],
    ['smooth_sandstone', 'smooth_sandstone', 's'], ['smooth_red_sandstone', 'smooth_red_sandstone', 's'],
    ['cut_sandstone', 'cut_sandstone', ''], ['cut_red_sandstone', 'cut_red_sandstone', ''],
    ['cobbled_deepslate', 'cobbled_deepslate', 'sw'], ['polished_deepslate', 'polished_deepslate', 'sw'],
    ['deepslate_bricks', 'deepslate_brick', 'sw'], ['deepslate_tiles', 'deepslate_tile', 'sw'],
    ['prismarine', 'prismarine', 'sw'], ['prismarine_bricks', 'prismarine_brick', 's'],
    ['dark_prismarine', 'dark_prismarine', 's'], ['quartz_block', 'quartz', 's'], ['smooth_quartz', 'smooth_quartz', 's'],
  ]

  families.forEach(([block, family, forms]) => {
    const material = 'minecraft:' + block
    const variants = [
      ['slab', ['SSS', ' AC'], abrasive, 1, 2]
    ]
    if (forms.includes('s')) variants.push(['stairs', ['S A', 'SSC', 'SSS'], abrasive, 1, 1])
    if (forms.includes('w')) variants.push(['wall', ['SSS', 'SAS', ' C '], mortar, 2, 1])
    variants.forEach(([variant, pattern, additive, handYield, machineYield]) => {
      const id = family + '_' + variant
      event.remove({ output: 'minecraft:' + id })
      event.shaped(handYield + 'x minecraft:' + id, pattern, { S: material, A: additive, C: chisel })
        .id('zero_shift:masonry/hand_' + id).damageIngredient(chisel)
      event.stonecutting(machineYield + 'x minecraft:' + id, material).id('zero_shift:masonry/cut_' + id)
    })
  })

  event.remove({ output: 'minecraft:stone_bricks' })
  event.shaped('minecraft:stone_bricks', ['SSS', 'MCM', 'SSS'], {
    S: 'minecraft:stone', M: mortar, C: chisel
  }).id('zero_shift:masonry/stone_bricks').damageIngredient(chisel)
  event.remove({ output: 'minecraft:bricks' })
  event.shaped('minecraft:bricks', ['BMB', 'MBM', 'BMB'], {
    B: 'minecraft:brick', M: mortar
  }).id('zero_shift:masonry/bricks')

  event.remove({ output: 'minecraft:glass' })
  event.shaped('kubejs:glass_batch', ['SSS', 'ALA', ' T '], {
    S: '#minecraft:sand', A: abrasive, L: 'kubejs:fired_lining', T: 'minecraft:charcoal'
  }).id('zero_shift:masonry/glass_batch')
  event.custom({
    type: 'minecraft:smelting', ingredient: { item: 'kubejs:glass_batch' },
    result: 'minecraft:glass', cookingtime: 600, experience: 0.15
  }).id('zero_shift:masonry/fired_glass')
  event.remove({ output: 'minecraft:glass_pane' })
  event.shaped('2x minecraft:glass_pane', ['GGG', 'GCG', ' A '], {
    G: 'minecraft:glass', C: chisel, A: abrasive
  }).id('zero_shift:masonry/glass_pane').damageIngredient(chisel)
})
