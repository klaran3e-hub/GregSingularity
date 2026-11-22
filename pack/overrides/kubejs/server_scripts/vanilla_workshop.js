ServerEvents.recipes(event => {
  const mc = id => 'minecraft:' + id
  const gt = id => 'gtceu:' + id
  const ks = id => global.gsItemId(id)
  const prefix = 'zero_shift:vanilla_workshop/'
  const iron = gt('iron_plate')
  const steel = gt('steel_plate')
  const copper = gt('copper_plate')
  const rivet = ks('iron_rivet')
  const hinge = ks('iron_hinge')
  const joint = ks('wooden_joint')
  const binding = ks('tool_binding')
  const fibre = ks('fibre_cord')
  const handle = ks('tool_handle')
  const contact = ks('copper_contact_strip')
  const liner = ks('fired_lining')
  const glass = mc('glass_pane')
  const dust = mc('redstone')
  const planks = '#minecraft:planks'
  const stockRecipes = []

  event.recipes.gtceu.cutter(prefix + 'slice_whole_melon')
    .itemInputs(mc('melon')).inputFluids(Fluid.of(mc('water'), 100))
    .itemOutputs('9x minecraft:melon_slice').duration(160).EUt(16)

  function shape(id, count, pattern, keys) {
    stockRecipes.push({ output: mc(id) })
    event.shaped(count + 'x ' + mc(id), pattern, keys).id(prefix + id)
  }
  function assemble(id, ingredients, count, time, power, fluid, amount) {
    stockRecipes.push({ output: mc(id) })
    const recipe = event.recipes.gtceu.assembler(prefix + id)
    ingredients.forEach(ingredient => recipe.itemInputs(ingredient))
    recipe.itemOutputs(count + 'x ' + mc(id)).duration(time).EUt(power)
    if (fluid) recipe.inputFluids(Fluid.of(fluid, amount))
  }
  function process(type, id, ingredients, count, time, heated) {
    const machine = type === 'mixing' ? 'mixer' : type === 'cutting' ? 'cutter' : 'assembler'
    global.fieldworkProcess(event, prefix + id, machine, {
      ingredients: ingredients, results: [{item: mc(id), count: count}], processingTime: time || 160
    }, heated ? 28 : 24)
  }
  function repeated(item, count) {
    const ingredients = []
    for (let index = 0; index < count; index++) ingredients.push({ item: item })
    return ingredients
  }

  shape('lever', 1, [' H ', 'JRS', ' C '], {
    H: handle, J: joint, R: contact, S: rivet, C: '#forge:cobblestone'
  })
  shape('redstone_torch', 1, [' R ', 'FCF', ' H '], {
    R: dust, F: ks('washed_fibre'), C: contact, H: mc('stick')
  })
  shape('stone_button', 1, ['CS', ' R'], { C: mc('stone'), S: ks('wooden_peg'), R: contact })
  for (const [id, base] of [
    ['stone_pressure_plate', mc('stone')],
    ['light_weighted_pressure_plate', gt('gold_plate')], ['heavy_weighted_pressure_plate', iron]
  ]) {
    shape(id, 1, ['PPP', 'CRC'], { P: base, C: contact, R: rivet })
  }
  shape('repeater', 1, ['TRT', 'CLC', 'SSS'], {
    T: mc('redstone_torch'), R: dust, C: contact, L: liner, S: mc('stone')
  })
  shape('comparator', 1, ['QTQ', 'TRT', 'SCS'], {
    Q: mc('quartz'), T: mc('redstone_torch'), R: mc('repeater'), S: mc('stone'), C: contact
  })
  shape('observer', 1, ['SLS', 'CRC', 'SQS'], {
    S: mc('stone'), L: glass, C: contact, R: mc('repeater'), Q: mc('quartz')
  })
  shape('sticky_piston', 1, ['SPS', ' B '], {
    S: mc('slime_ball'), P: mc('piston'), B: binding
  })
  shape('dropper', 1, ['SPS', 'SCS', 'RHR'], {
    S: '#forge:cobblestone', P: planks, C: hinge, R: contact, H: dust
  })
  shape('dispenser', 1, ['SIS', 'BDB', 'RHR'], {
    S: '#forge:cobblestone', I: iron, B: fibre, D: mc('dropper'), R: contact, H: mc('bow')
  })
  shape('tripwire_hook', 2, [' H ', 'RSC', ' P '], {
    H: hinge, R: rivet, S: mc('stick'), C: contact, P: planks
  })
  shape('trapped_chest', 1, [' R ', 'CHP', ' B '], {
    R: contact, C: mc('chest'), H: mc('tripwire_hook'), P: hinge, B: binding
  })
  shape('target', 1, ['FRF', 'RHR', 'FRF'], {
    F: fibre, R: dust, H: mc('hay_block')
  })
  shape('daylight_detector', 1, ['GGG', 'QCQ', 'JRJ'], {
    G: glass, Q: mc('quartz'), C: mc('comparator'), J: joint, R: contact
  })
  shape('lightning_rod', 1, [' C ', 'CSC', ' R '], {
    C: copper, S: ks('copper_strap'), R: rivet
  })
  shape('note_block', 1, ['PJP', 'JRC', 'PJP'], {
    P: planks, J: joint, R: dust, C: contact
  })
  shape('jukebox', 1, ['PJP', 'INI', 'PDP'], {
    P: planks, J: joint, I: iron, N: mc('note_block'), D: mc('diamond')
  })
  shape('compass', 1, [' C ', 'PMP', ' R '], {
    C: glass, P: iron, M: ks('magnetic_armature'), R: dust
  })
  shape('clock', 1, [' G ', 'GCG', 'RPG'], {
    G: gt('gold_plate'), C: mc('compass'), R: dust, P: glass
  })
  assemble('recovery_compass', [mc('compass'), '8x ' + mc('echo_shard'), '2x ' + glass,
    '2x ' + ks('magnetic_armature'), gt('basic_electronic_circuit')], 1, 780, 28)
  shape('spyglass', 1, [' A ', 'CPC', ' B '], {
    A: mc('amethyst_shard'), C: copper, P: glass, B: binding
  })
  shape('map', 1, ['PPP', 'PCP', 'PBP'], {
    P: mc('paper'), C: mc('compass'), B: binding
  })
  shape('fishing_rod', 1, ['  S', ' JF', 'HFC'], {
    S: mc('stick'), J: joint, F: fibre, H: handle, C: rivet
  })
  shape('carrot_on_a_stick', 1, ['R ', 'BC'], {
    R: mc('fishing_rod'), B: binding, C: mc('carrot')
  })
  shape('warped_fungus_on_a_stick', 1, ['R ', 'BC'], {
    R: mc('fishing_rod'), B: binding, C: mc('warped_fungus')
  })
  shape('bow', 1, [' JS', 'H S', ' JS'], {
    J: joint, S: mc('string'), H: handle
  })
  shape('crossbow', 1, ['SJS', 'BHB', 'RPR'], {
    S: fibre, J: joint, B: mc('stick'), H: mc('tripwire_hook'), R: rivet, P: mc('bow')
  })
  shape('arrow', 2, ['F', 'B', 'P'], {
    F: mc('flint'), B: mc('stick'), P: mc('feather')
  })
  shape('spectral_arrow', 2, [' G ', 'GAG', ' CG'], {
    G: mc('glowstone_dust'), A: mc('arrow'), C: contact
  })
  shape('bookshelf', 1, ['PJP', 'BBB', 'PJP'], {
    P: planks, J: joint, B: mc('book')
  })
  shape('chiseled_bookshelf', 1, ['SJS', 'BHB', 'SJS'], {
    S: '#minecraft:wooden_slabs', J: joint, B: planks, H: hinge
  })
  shape('lectern', 1, ['SJS', ' P ', 'BHB'], {
    S: '#minecraft:wooden_slabs', J: joint, P: mc('bookshelf'), B: planks, H: hinge
  })
  shape('cartography_table', 1, ['PMP', 'JHJ', 'BBB'], {
    P: mc('paper'), M: mc('map'), J: joint, H: hinge, B: planks
  })
  shape('smithing_table', 1, ['ISI', 'RHR', 'BJB'], {
    I: iron, S: steel, R: rivet, H: hinge, B: planks, J: joint
  })
  shape('fletching_table', 1, ['FSF', 'JHJ', 'BBB'], {
    F: mc('flint'), S: fibre, J: joint, H: hinge, B: planks
  })
  shape('grindstone', 1, ['JHJ', 'SAS', 'PBP'], {
    J: joint, H: hinge, S: mc('stone_slab'), A: ks('abrasive_paste'), P: planks, B: binding
  })
  shape('anvil', 1, ['III', 'RHR', 'SSS'], {
    I: mc('iron_block'), R: rivet, H: ks('hand_forged_plate'), S: steel
  })
  shape('enchanting_table', 1, ['GBG', 'DOD', 'OLO'], {
    G: gt('gold_plate'), B: mc('book'), D: mc('diamond'), O: mc('obsidian'), L: liner
  })
  shape('cauldron', 1, ['I I', 'RBR', 'ILI'], {
    I: iron, R: rivet, B: mc('bucket'), L: liner
  })
  shape('item_frame', 1, ['SJS', 'BLB', 'SJS'], {
    S: mc('stick'), J: joint, B: binding, L: mc('leather')
  })
  shape('glow_item_frame', 1, [' I ', 'GFG'], {
    I: mc('item_frame'), G: mc('glow_ink_sac'), F: fibre
  })
  shape('painting', 1, ['SJS', 'BWB', 'SJS'], {
    S: mc('stick'), J: joint, B: binding, W: '#minecraft:wool'
  })
  shape('armor_stand', 1, ['SHS', ' S ', 'JBP'], {
    S: mc('stick'), H: handle, J: joint, B: mc('smooth_stone_slab'), P: ks('wooden_peg')
  })

  const tools = [
    ['sword', [' P ', 'RPR', ' H ']], ['pickaxe', ['PPP', 'RHR', ' B ']],
    ['axe', ['PP ', 'PR ', ' HB']], ['shovel', [' P ', 'RHR', ' B ']],
    ['hoe', ['PP ', ' RH', ' B ']]
  ]
  const armor = [
    ['helmet', ['PPP', 'PBP', 'R R']], ['chestplate', ['P P', 'PBP', 'PRP']],
    ['leggings', ['PRP', 'PBP', 'P P']], ['boots', ['P P', 'R R', 'PBP']]
  ]
  for (const [tier, material, fastening] of [
    ['golden', gt('gold_plate'), rivet], ['diamond', mc('diamond'), ks('steel_press_blank')]
  ]) {
    tools.forEach(([part, pattern]) => {
      const keys = { P: material, R: fastening, H: handle }
      if (part !== 'sword') keys.B = binding
      shape(tier + '_' + part, 1, pattern, keys)
    })
    armor.forEach(([part, pattern]) => {
      shape(tier + '_' + part, 1, pattern, { P: material, R: fastening, B: mc('leather') })
    })
  }
  armor.forEach(([part, pattern]) => {
    shape('leather_' + part, 1, pattern, { P: mc('leather'), R: fibre, B: binding })
  })
  shape('turtle_helmet', 1, ['SSS', 'SBS', 'R R'], {
    S: mc('scute'), B: mc('leather_helmet'), R: fibre
  })

  shape('brush', 1, [' F ', 'BCB', ' H '], {
    F: mc('feather'), B: binding, C: copper, H: handle
  })
  shape('lead', 1, ['SSF', 'SBC', ' FS'], {
    S: mc('string'), F: fibre, B: mc('slime_ball'), C: binding
  })
  event.remove({ id: 'gtceu:assembler/lead' })
  shape('composter', 1, ['S S', 'SJS', 'SHS'], {
    S: '#minecraft:wooden_slabs', J: joint, H: ks('wooden_peg')
  })
  event.remove({ id: 'gtceu:assembler/composter' })
  shape('calibrated_sculk_sensor', 1, [' A ', 'ASA', 'CRC'], {
    A: mc('amethyst_shard'), S: mc('sculk_sensor'), C: contact, R: mc('comparator')
  })
  assemble('conduit', ['8x ' + mc('nautilus_shell'), mc('heart_of_the_sea'),
    '4x ' + mc('prismarine_crystals'), '2x ' + ks('chemical_grade_seal')], 1, 640, 96, 'gtceu:distilled_water', 1000)
  event.remove({ id: 'gtceu:assembler/conduit' })
  assemble('beacon', ['5x ' + mc('glass'), '3x ' + mc('obsidian'), mc('nether_star'),
    '4x ' + gt('titanium_plate'), '2x ' + gt('quantum_processor')], 1, 1600, 1280, 'gtceu:polyethylene', 576)
  assemble('music_disc_5', ['9x ' + mc('disc_fragment_5'), '2x ' + gt('polyethylene_plate'),
    gt('steel_ring')], 1, 640, 96, 'gtceu:lubricant', 250)

  for (const [id, input] of [
    ['raw_copper_block', 'raw_copper'], ['raw_iron_block', 'raw_iron'],
    ['raw_gold_block', 'raw_gold'], ['slime_block', 'slime_ball'],
    ['melon', 'melon_slice'], ['nether_wart_block', 'nether_wart']
  ]) {
    event.remove({ id: mc(id) })
    process('compacting', id, repeated(mc(input), 9), 1, 160)
  }
  for (const material of ['raw_copper', 'raw_iron', 'raw_gold', 'slime_ball']) {
    var block = material === 'slime_ball' ? 'slime_block' : material + '_block'
    event.remove({ id: mc(material) })
    process('cutting', material, [{ item: mc(block) }], 9, 120)
  }
  event.remove({ id: mc('coarse_dirt') })
  process('mixing', 'coarse_dirt', ['dirt', 'dirt', 'gravel', 'gravel'].map(id => ({ item: mc(id) })).concat([
    { item: ks('plant_fibre') }, { fluid: mc('water'), amount: 125 }
  ]), 2, 160)
  const pot = mc('decorated_pot')
  const brick = mc('brick')
  const potSides = [1, 3, 5, 7]
  const PotRecipe = Java.loadClass('net.minecraft.world.item.crafting.DecoratedPotRecipe')
  const PotDecorations = Java.loadClass('net.minecraft.world.level.block.entity.DecoratedPotBlockEntity$Decorations')
  event.remove({ id: pot })
  event.remove({ id: mc('decorated_pot_simple') })
  process('compacting', 'decorated_pot', repeated(brick, 4).concat([
    { item: ks('fired_lining') }, { fluid: mc('water'), amount: 250 }
  ]), 1, 260, true)
  // Choose the recipe by the first sherd in vanilla's side order.
  // Earlier slots take bricks, so the four routes never overlap.
  potSides.forEach((_, firstSherd) => {
    const slots = [' ', ' ', ' ', ' ', 'P', ' ', ' ', ' ', ' ']
    potSides.forEach((side, index) => {
      slots[side] = index < firstSherd ? 'B' : index === firstSherd ? 'S' : 'I'
    })
    const keys = { P: { type: 'forge:nbt', item: pot }, S: '#minecraft:decorated_pot_sherds' }
    if (firstSherd > 0) keys.B = brick
    if (firstSherd < potSides.length - 1) keys.I = '#minecraft:decorated_pot_ingredients'
    const pattern = [slots.slice(0, 3).join(''), slots.slice(3, 6).join(''), slots.slice(6).join('')]
    event.shaped(pot, pattern, keys).noMirror().modifyResult(grid => {
      const sides = potSides.map(slot => {
        const stack = grid.get(slot)
        return typeof stack.getItem === 'function' ? stack.getItem() : stack.m_41720_()
      })
      const decorations = new PotDecorations(sides[0], sides[1], sides[2], sides[3])
      return typeof PotRecipe.createDecoratedPotItem === 'function'
        ? PotRecipe.createDecoratedPotItem(decorations)
        : PotRecipe.m_284234_(decorations)
    }).id(prefix + 'decorated_pot_side_' + firstSherd)
  })
  shape('fire_charge', 1, [' C ', 'BGB', ' P '], {
    C: mc('charcoal'), B: mc('blaze_powder'), G: mc('gunpowder'), P: mc('paper')
  })
  event.remove({ id: 'gtceu:mixer/fire_charge' })

  // Preserve old-world ore blocks by feeding them into the canonical GT routes.
  for (const [output, ore] of [
    ['coal', 'coal'], ['diamond', 'diamond'], ['emerald', 'emerald'],
    ['lapis_lazuli', 'lapis'], ['redstone', 'redstone']
  ]) {
    for (const rock of ['', 'deepslate_']) {
      var vanillaOre = rock + ore + '_ore'
      for (const furnace of ['smelting', 'blasting']) {
        event.remove({ id: mc(output + '_from_' + furnace + '_' + vanillaOre) })
      }
      event.recipes.gtceu.chemical_bath(prefix + 'wash_' + vanillaOre)
        .itemInputs(mc(vanillaOre)).inputFluids(Fluid.of('gtceu:distilled_water', 250))
        .itemOutputs(gt(vanillaOre)).duration(240).EUt(24)
    }
  }
  event.remove({ id: mc('quartz') })
  event.remove({ id: mc('quartz_from_blasting') })
  event.recipes.gtceu.chemical_bath(prefix + 'wash_nether_quartz_ore')
    .itemInputs(mc('nether_quartz_ore')).inputFluids(Fluid.of('gtceu:distilled_water', 250))
    .itemOutputs(gt('nether_quartz_ore')).duration(240).EUt(24)

  for (const [id, stencil] of [
    ['creeper', 'creeper_head'], ['flower', 'oxeye_daisy'],
    ['mojang', 'enchanted_golden_apple'], ['skull', 'wither_skeleton_skull']
  ]) {
    shape(id + '_banner_pattern', 1, ['PIP', 'CSC', ' P '], {
      P: mc('paper'), I: mc('ink_sac'), C: '#minecraft:wool', S: mc(stencil)
    })
  }
  for (const [name, backing] of [
    ['coast', 'cobblestone'], ['dune', 'sandstone'], ['eye', 'end_stone'], ['host', 'terracotta'],
    ['raiser', 'terracotta'], ['rib', 'netherrack'], ['sentry', 'cobblestone'], ['shaper', 'terracotta'],
    ['silence', 'cobbled_deepslate'], ['snout', 'blackstone'], ['spire', 'purpur_block'],
    ['tide', 'prismarine'], ['vex', 'cobblestone'], ['ward', 'cobbled_deepslate'],
    ['wayfinder', 'terracotta'], ['wild', 'mossy_cobblestone']
  ]) {
    var id = name + '_armor_trim_smithing_template'
    event.remove({ id: mc(id) })
    event.recipes.gtceu.assembler(prefix + id)
      .itemInputs(mc(id), '7x ' + mc('diamond'), mc(backing), '2x ' + steel)
      .inputFluids(Fluid.of('gtceu:lubricant', 250))
      .itemOutputs('2x ' + mc(id)).duration(420).EUt(96)
  }
  for (const [wood, log, block] of [
    ['oak', 'log', 'wood'], ['spruce', 'log', 'wood'], ['birch', 'log', 'wood'],
    ['jungle', 'log', 'wood'], ['acacia', 'log', 'wood'], ['dark_oak', 'log', 'wood'],
    ['mangrove', 'log', 'wood'], ['cherry', 'log', 'wood'],
    ['crimson', 'stem', 'hyphae'], ['warped', 'stem', 'hyphae']
  ]) {
    for (const finish of ['', 'stripped_']) {
      shape(finish + wood + '_' + block, 2, ['LJL', 'LBL'], {
        L: mc(finish + wood + '_' + log), J: joint, B: binding
      })
    }
  }

  // KubeJS filters only the original recipe map, so the replacements remain intact.
  event.remove(stockRecipes)
})
