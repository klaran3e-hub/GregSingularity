const provisionColors = [
  'white', 'orange', 'magenta', 'light_blue', 'yellow', 'lime', 'pink', 'gray',
  'light_gray', 'cyan', 'purple', 'blue', 'brown', 'green', 'red', 'black'
]
const dyeableFamilies = ['wool', 'carpet', 'bed']
const otherColors = (color, family) => 'zero_shift:provisions/dyeable_' + color + '_' + family
const paperLetters = 'zero_shift:provisions/recyclable_letters'

ServerEvents.tags('item', event => {
  provisionColors.forEach(color => {
    dyeableFamilies.forEach(family => {
      const alternatives = provisionColors.filter(other => other !== color)
      event.add(otherColors(color, family), alternatives.map(other => 'minecraft:' + other + '_' + family))
    })
  })
  event.add(paperLetters, ['fresh', 'stamped', 'opened', 'emptied'].map(state => 'forestry:letter_empty_' + state))
})

ServerEvents.recipes(event => {
  const mc = name => 'minecraft:' + name
  const part = name => 'kubejs:' + name
  const prefix = 'zero_shift:provisions/'
  const fibre = part('washed_fibre')
  const cord = part('fibre_cord')
  const peg = part('wooden_peg')
  const joint = part('wooden_joint')
  const temper = part('sand_temper')
  const slat = part('rough_slat')
  const strap = part('copper_strap')
  const binding = part('tool_binding')
  const dough = 'create:dough'
  const planks = '#minecraft:planks'
  const water = mc('water')
  const stockRecipes = []

  function clear(names) {
    names.forEach(name => stockRecipes.push({ output: mc(name) }))
  }
  function craft(name, output, inputs) {
    event.shapeless(output, inputs).id(prefix + name)
  }
  function shaped(name, output, pattern, ingredients) {
    event.shaped(output, pattern, ingredients).id(prefix + name)
  }
  function item(id) {
    return id.startsWith('#') ? { tag: id.slice(1) } : { item: id }
  }
  function basin(operation, name, inputs, fluid, amount, output, count, ticks) {
    event.custom({
      type: 'create:' + operation,
      ingredients: inputs.map(item).concat({ fluid: fluid, amount: amount }),
      results: [{ item: output, count: count }],
      processingTime: ticks
    }).id(prefix + name)
  }

  const cooked = [
    ['beef', 'cooked_beef', 0.35], ['chicken', 'cooked_chicken', 0.35],
    ['cod', 'cooked_cod', 0.35], ['mutton', 'cooked_mutton', 0.35],
    ['porkchop', 'cooked_porkchop', 0.35], ['rabbit', 'cooked_rabbit', 0.35],
    ['salmon', 'cooked_salmon', 0.35], ['potato', 'baked_potato', 0.35],
    ['kelp', 'dried_kelp', 0.1]
  ]
  const cooking = [['smelting', 360], ['smoking', 200], ['campfire_cooking', 900]]
  cooked.forEach(([source, output, experience]) => {
    cooking.forEach(([type, ticks]) => {
      stockRecipes.push({ type: mc(type), output: mc(output) })
      event.custom({
        type: mc(type), category: 'food', ingredient: { item: mc(source) },
        result: mc(output), cookingtime: ticks, experience: experience
      }).id(prefix + output + '/' + type)
    })
  })

  clear(['cake', 'cookie', 'pumpkin_pie', 'mushroom_stew', 'beetroot_soup', 'rabbit_stew',
    'golden_apple', 'golden_carrot', 'glistering_melon_slice', 'fermented_spider_eye', 'sugar'])
  const sugar = mc('sugar')
  const cane = mc('sugar_cane')
  craft('filter_cane_sugar', sugar, [cane, cane, fibre])
  craft('filter_honey_sugar', '2x ' + sugar, [mc('honey_bottle'), fibre, fibre])
  event.remove({ id: 'create:milling/sugar_cane' })
  basin('mixing', 'wash_sugar_crystals', [cane, cane, cane, cane, fibre], water, 200, sugar, 3, 260)

  shaped('layer_cake', mc('cake'), [' M ', 'SES', 'DDD'], {
    M: mc('milk_bucket'), S: sugar, E: mc('egg'), D: dough
  })
  basin('mixing', 'batter_from_milk', [dough, dough, dough, sugar, sugar, mc('egg')],
    mc('milk'), 1000, mc('cake'), 1, 360)
  shaped('cocoa_cookies', '4x ' + mc('cookie'), ['DSD', 'CBC'], {
    D: dough, S: sugar, C: mc('cocoa_beans'), B: mc('baked_potato')
  })
  craft('fill_pumpkin_pie', mc('pumpkin_pie'), [mc('pumpkin'), sugar, sugar, mc('egg'), dough])
  craft('mushroom_stew', mc('mushroom_stew'), [
    mc('brown_mushroom'), mc('red_mushroom'), mc('brown_mushroom'), mc('red_mushroom'), mc('bowl')
  ])
  shaped('beetroot_soup', mc('beetroot_soup'), ['RRR', 'RPR', 'RBR'], {
    R: mc('beetroot'), P: mc('baked_potato'), B: mc('bowl')
  })
  craft('rabbit_stew', mc('rabbit_stew'), [
    mc('cooked_rabbit'), mc('baked_potato'), mc('carrot'), mc('beetroot'), mc('mushroom_stew')
  ])
  shaped('golden_apple', mc('golden_apple'), ['PGP', 'NAN', 'PSP'], {
    P: 'gtceu:gold_plate', G: mc('gold_block'), N: mc('gold_nugget'), A: mc('apple'), S: sugar
  })
  ;[['carrot', 'golden_carrot', mc('gold_ingot')],
    ['melon_slice', 'glistering_melon_slice', 'gtceu:gold_plate']].forEach(([source, output, sheet]) => {
    shaped(output, mc(output), ['NGN', 'GXG', 'NSN'], {
      N: mc('gold_nugget'), G: sheet, X: mc(source), S: sugar
    })
  })
  craft('ferment_spider_eye', mc('fermented_spider_eye'), [
    mc('spider_eye'), mc('brown_mushroom'), mc('brown_mushroom'), sugar, sugar, mc('dried_kelp')
  ])

  event.remove({ id: 'minecraft:wheat' })
  event.remove({ id: 'minecraft:dried_kelp' })
  event.remove({ id: 'gtceu:shapeless/hay_block_to_hay' })
  event.remove({ id: 'gtceu:forge_hammer/wheat_from_hay_block' })
  event.remove({ id: 'gtceu:packer/wheat' })
  event.remove({ id: 'gtceu:macerator/macerate_hay_block' })
  clear(['hay_block', 'dried_kelp_block', 'melon_seeds', 'pumpkin_seeds', 'bone_meal', 'bone_block'])
  function bundle(source, output, count) {
    const block = mc(output)
    const crop = mc(source)
    shaped('tie_' + output, block, ['CCC', 'TCT', 'CCC'], { C: crop, T: cord })
    craft('unpack_' + output, count + 'x ' + crop, [block])
  }
  bundle('wheat', 'hay_block', 7)
  bundle('dried_kelp', 'dried_kelp_block', 7)
  craft('select_melon_seeds', mc('melon_seeds'), [mc('melon_slice'), mc('melon_slice'), fibre])
  craft('select_pumpkin_seeds', '2x ' + mc('pumpkin_seeds'), [mc('pumpkin'), fibre])
  basin('mixing', 'clean_melon_seeds', [mc('melon_slice'), mc('melon_slice'), fibre],
    water, 250, mc('melon_seeds'), 2, 180)
  basin('mixing', 'clean_pumpkin_seeds', [mc('pumpkin'), fibre], water, 250, mc('pumpkin_seeds'), 3, 180)
  craft('sift_bone_powder', '2x ' + mc('bone_meal'), [mc('bone'), temper])
  shaped('bind_bone_block', mc('bone_block'), ['MMM', 'MCM', 'MMM'], {
    M: mc('bone_meal'), C: mc('clay_ball')
  })
  craft('unpack_bone_block', '8x ' + mc('bone_meal'), [mc('bone_block')])
  basin('compacting', 'press_bone_powder', [mc('bone'), mc('bone'), temper],
    water, 100, mc('bone_meal'), 5, 200)

  clear(['paper', 'book', 'writable_book', 'leather'])
  shaped('lay_paper_sheet', mc('paper'), ['RRR', 'FSF'], { R: cane, F: fibre, S: mc('string') })
  basin('compacting', 'press_reed_pulp', [cane, cane, cane, cane, fibre, fibre],
    water, 250, mc('paper'), 3, 220)
  basin('compacting', 'press_wood_pulp', ['#forge:dusts/wood', '#forge:dusts/wood',
    '#forge:dusts/wood', '#forge:dusts/wood', fibre, fibre], water, 500, mc('paper'), 2, 260)
  shaped('stitch_book', mc('book'), ['PPP', 'CFC', ' L '], {
    P: mc('paper'), C: cord, F: fibre, L: mc('leather')
  })
  craft('prepare_inked_book', mc('writable_book'), [mc('book'), mc('ink_sac'), mc('feather'), mc('paper'), cord])
  shaped('stitch_rabbit_hides', mc('leather'), ['HH', 'HH', 'CF'], {
    H: mc('rabbit_hide'), C: cord, F: fibre
  })
  basin('mixing', 'treat_rabbit_hides', [mc('rabbit_hide'), mc('rabbit_hide'),
    mc('rabbit_hide'), mc('rabbit_hide'), temper, fibre], water, 500, mc('leather'), 1, 240)
  // Recover paper already paid for in filters and letters.
  craft('recover_filter_paper', mc('paper'), ['pneumaticcraft:tag_filter', fibre])
  const letter = '#' + paperLetters
  craft('recover_letter_paper', mc('paper'), [letter, letter, letter, fibre])
  ;['diamond', 'golden', 'iron', 'leather'].forEach(material => {
    const armor = material + '_horse_armor'
    event.remove({ id: 'create:crushing/' + armor })
    basin('mixing', 'recover_' + armor + '_lining', [mc(armor), temper], water, 250, mc('leather'), 1, 200)
  })
  event.remove({ id: 'create:milling/saddle' })
  basin('mixing', 'recover_saddle_lining', [mc('saddle'), temper], water, 250, mc('leather'), 1, 200)

  clear(['honey_block', 'honey_bottle', 'honeycomb_block', 'beehive'])
  const honey = mc('honey_bottle')
  const honeycomb = mc('honeycomb')
  const honeyBlock = mc('honey_block')
  const bottle = mc('glass_bottle')
  craft('bind_bottled_honey', honeyBlock, [honey, honey, honey, honey, honeycomb])
  craft('bottle_stored_honey', '4x ' + honey, [honeyBlock, bottle, bottle, bottle, bottle, fibre])
  shaped('press_wax_block', mc('honeycomb_block'), ['HHH', 'HFH', 'HHH'], { H: honeycomb, F: fibre })
  shaped('frame_hive', mc('beehive'), ['PCP', 'HHH', 'PFP'], {
    P: planks, H: honeycomb, C: strap, F: fibre
  })
  basin('compacting', 'press_fluid_honey', [honeycomb, fibre], 'create:honey', 1000, honeyBlock, 1, 220)
  event.custom({
    type: 'create:filling', ingredients: [{ item: bottle }, { fluid: 'create:honey', amount: 300 }],
    results: [{ item: honey }]
  }).id(prefix + 'fill_honey_bottle')

  craft('bottle_forestry_honey', honey, [bottle, 'forestry:honey_drop', 'forestry:honey_drop',
    'forestry:honey_drop', fibre])

  const dye = color => mc(color + '_dye')
  clear(provisionColors.map(color => color + '_dye'))
  const pigments = {
    white: ['bone_meal', 'lily_of_the_valley'],
    orange: ['orange_tulip', 'torchflower'],
    magenta: ['allium', 'lilac'],
    light_blue: ['blue_orchid'],
    yellow: ['dandelion', 'sunflower'],
    lime: ['sea_pickle'],
    pink: ['pink_tulip', 'peony', 'pink_petals'],
    light_gray: ['azure_bluet', 'oxeye_daisy', 'white_tulip'],
    cyan: ['pitcher_plant'],
    blue: ['lapis_lazuli', 'cornflower'],
    brown: ['cocoa_beans'],
    green: ['cactus'],
    red: ['poppy', 'red_tulip', 'rose_bush', 'beetroot'],
    black: ['ink_sac', 'wither_rose', 'charcoal']
  }
  const tall = ['lilac', 'sunflower', 'peony', 'rose_bush', 'pitcher_plant']
  Object.entries(pigments).forEach(([color, sources]) => {
    sources.forEach(source => {
      event.remove({ id: 'create:milling/' + source })
      const raw = mc(source)
      const yieldCount = tall.includes(source) ? 2 : 1
      craft('grind_' + source, yieldCount + 'x ' + dye(color), [raw, temper, fibre])
      basin('mixing', 'extract_' + source, [raw, raw, temper], water, 100, dye(color), yieldCount * 2, 180)
    })
  })
  event.remove({ id: /^immersiveengineering:(?:crusher\/(?:black|blue|white)_dye|crafting\/lead_white|smelting\/lead_red)$/ })
  event.remove({ id: 'pneumaticcraft:assembly/red_dye' })
  event.remove({ id: 'create:milling/bone' })
  event.remove({ id: 'create:milling/calcite' })
  event.remove({ id: 'create:milling/coal' })
  event.remove({ id: 'create:milling/fern' })
  event.remove({ id: 'create:milling/large_fern' })
  basin('mixing', 'sift_beet_seeds', [mc('beetroot'), mc('beetroot'), fibre], water, 100, mc('beetroot_seeds'), 1, 180)
  ;[['fern', 1], ['large_fern', 2]].forEach(([source, count]) => {
    basin('mixing', 'sort_' + source + '_seeds', [mc(source), mc(source), fibre], water, 100, mc('wheat_seeds'), count, 180)
  })
  const blends = {
    orange: ['red', 'yellow'], magenta: ['purple', 'pink'], light_blue: ['blue', 'white'],
    lime: ['green', 'white'], pink: ['red', 'white'], gray: ['black', 'white'],
    light_gray: ['gray', 'white'], cyan: ['blue', 'green'], purple: ['blue', 'red']
  }
  Object.entries(blends).forEach(([color, sources]) => {
    const ingredients = sources.map(dye)
    craft('blend_' + color, dye(color), ingredients.concat(fibre))
    basin('mixing', 'disperse_' + color, ingredients.concat(temper), water, 100, dye(color), 2, 180)
  })

  clear(['loom'])
  shaped('frame_loom', mc('loom'), ['BSB', 'CWC', 'PJP'], {
    B: binding, S: slat, C: cord, W: mc('string'), P: planks, J: joint
  })
  ;dyeableFamilies.concat('banner').forEach(family => clear(provisionColors.map(color => color + '_' + family)))
  shaped('weave_blank_wool', mc('white_wool'), ['SFS', 'SCS', 'SFS'], {
    S: mc('string'), F: fibre, C: cord
  })
  provisionColors.forEach(color => {
    const wool = mc(color + '_wool')
    const bed = mc(color + '_bed')
    const carpet = mc(color + '_carpet')
    const banner = mc(color + '_banner')
    const otherWool = '#' + otherColors(color, 'wool')
    craft('dye_' + color + '_wool', wool, [otherWool, dye(color), fibre])
    basin('mixing', 'dye_batch_' + color + '_wool', [otherWool, otherWool,
      otherWool, otherWool, dye(color), fibre], water, 250, wool, 4, 240)
    shaped('cut_' + color + '_carpet', '2x ' + carpet, ['WFW'], { W: wool, F: fibre })
    craft('dye_' + color + '_carpet', carpet, ['#' + otherColors(color, 'carpet'), dye(color), fibre])
    shaped('frame_' + color + '_bed', bed, ['WWW', 'PPP', 'NCN'], { W: wool, P: planks, N: peg, C: cord })
    craft('dye_' + color + '_bed', bed, ['#' + otherColors(color, 'bed'), dye(color), dye(color), fibre])
    shaped('stitch_' + color + '_banner', banner, ['WWW', 'WWW', 'CSC'], {
      W: wool, C: cord, S: mc('stick')
    })
  })

  // KubeJS filters only the original recipe map, so the replacements remain intact.
  event.remove(stockRecipes)
})
