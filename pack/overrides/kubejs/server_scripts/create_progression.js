ServerEvents.recipes(event => {
  function replace(output, count, pattern, keys) {
    event.remove({ output: 'create:' + output })
    return event.shaped(count + 'x create:' + output, pattern, keys).id('zero_shift:create/' + output)
  }

  function removeStock(ids) {
    ids.forEach(id => event.remove({ id: 'create:' + id }))
  }

  function process(operation, name, input, results, ticks) {
    const recipe = { type: 'create:' + operation, ingredients: [{ item: input }], results: results }
    if (ticks) recipe.processingTime = ticks
    event.custom(recipe).id('zero_shift:create/' + name)
  }

  const alloy = 'create:andesite_alloy'
  const shaft = 'create:shaft'
  const casing = 'create:andesite_casing'
  const copperCasing = 'create:copper_casing'
  const cogwheel = 'create:cogwheel'
  const pegs = 'kubejs:wooden_peg'
  const strap = 'kubejs:copper_strap'
  const joint = 'kubejs:wooden_joint'
  const handPlate = 'kubejs:hand_forged_plate'
  const bushing = 'kubejs:shaft_bushing'
  const rim = 'kubejs:gear_rim'
  const drill = 'kubejs:fire_drill'
  const hammer = 'gtceu:flint_hammer'
  const plank = '#minecraft:planks'
  const lining = 'kubejs:fired_lining'
  const binding = 'kubejs:tool_binding'
  const cord = 'kubejs:fibre_cord'
  const handle = 'kubejs:tool_handle'
  const rivet = 'kubejs:iron_rivet'
  const woven = 'kubejs:woven_drive_belt'
  const copperPlate = 'gtceu:copper_plate'
  const ironPlate = 'gtceu:iron_plate'
  const goldPlate = 'gtceu:gold_plate'
  const redstone = 'minecraft:redstone'
  const pipe = 'create:fluid_pipe'
  const wheel = 'create:water_wheel'
  const tailings = 'kubejs:ore_tailings'

  // The entire first drive is buildable from manual workshop outputs.
  removeStock(['mixing/andesite_alloy', 'mixing/andesite_alloy_from_zinc', 'cutting/andesite_alloy',
    'item_application/andesite_casing_from_log', 'item_application/andesite_casing_from_wood',
    'item_application/copper_casing_from_log', 'item_application/copper_casing_from_wood'])
  replace('andesite_alloy', 1, ['ALA', 'CCC', 'ARA'], {
    A: 'minecraft:andesite', L: lining, C: 'minecraft:copper_ingot', R: 'kubejs:sand_temper'
  })
  event.shapeless('9x ' + alloy, ['create:andesite_alloy_block']).id('zero_shift:create/unpack_andesite_alloy')
  replace('andesite_casing', 1, ['PAP', 'JWL', 'PAP'], {
    P: pegs, A: alloy, J: joint, W: '#forge:stripped_logs', L: lining
  })
  event.shaped(bushing, ['LCL', 'PHP', 'LCL'], {
    L: lining, C: strap, P: pegs, H: hammer
  }).id('zero_shift:create/shaft_bushing').damageIngredient(hammer)
  event.shaped(rim, ['APA', 'PBP', 'APA'], {
    A: alloy, P: pegs, B: 'kubejs:tool_binding'
  }).id('zero_shift:create/gear_rim')
  replace('shaft', 1, [' A ', 'BHB', ' A '], { A: alloy, B: bushing, H: 'kubejs:tool_handle' })
  replace('cogwheel', 1, ['PRP', 'RSR', 'PRP'], { P: pegs, R: rim, S: shaft })
  replace('large_cogwheel', 1, ['JPJ', 'PCP', 'JPJ'], { J: joint, P: plank, C: cogwheel })
  replace('hand_crank', 1, ['HBB', ' PA', ' S '], {
    H: 'kubejs:tool_handle', B: 'kubejs:tool_binding', P: pegs, A: alloy, S: shaft
  })
  event.shaped('kubejs:wheel_segment', ['PJP', 'PBP', 'PHP'], {
    P: plank, J: joint, B: 'kubejs:tool_binding', H: pegs
  }).id('zero_shift:create/wheel_segment')
  replace('water_wheel', 1, ['WJW', 'BSB', 'WJW'], {
    W: 'kubejs:wheel_segment', J: joint, B: bushing, S: shaft
  })
  replace('large_water_wheel', 1, ['SJS', 'JWJ', 'SJS'], {
    S: 'kubejs:wheel_segment', J: joint, W: wheel
  })
  replace('gearbox', 1, ['BCB', 'SKS', 'BCB'], { B: bushing, C: cogwheel, S: shaft, K: casing })
  replace('vertical_gearbox', 1, [' G '], { G: 'create:gearbox' })
  event.shapeless('create:gearbox', ['create:vertical_gearbox']).id('zero_shift:create/gearbox_to_horizontal')

  event.shaped('kubejs:saw_teeth', ['HPP', 'P R'], {
    H: hammer, P: handPlate, R: 'kubejs:iron_rivet'
  }).id('zero_shift:create/saw_teeth').damageIngredient(hammer)
  event.shaped('kubejs:saw_blade', ['TTT', 'IRI', 'TTT'], {
    T: 'kubejs:saw_teeth', I: handPlate, R: 'kubejs:iron_rivet'
  }).id('zero_shift:create/saw_blade')
  replace('mechanical_saw', 1, [' H ', 'BDB', 'SKS'], {
    H: 'kubejs:saw_blade', B: bushing, D: drill, S: shaft, K: casing
  }).damageIngredient(drill)
  replace('millstone', 1, ['LCL', 'KSK', 'LBL'], {
    L: 'kubejs:fired_lining', C: cogwheel, K: casing, S: 'minecraft:stone', B: bushing
  })
  replace('depot', 1, ['PJP', 'BKB'], { P: plank, J: joint, B: pegs, K: casing })
  replace('mechanical_press', 1, ['PSP', 'RCR', 'IHI'], {
    P: handPlate, S: shaft, R: 'kubejs:iron_rivet', C: casing, I: bushing, H: hammer
  }).damageIngredient(hammer)
  replace('basin', 1, ['PLP', 'PLC', 'RRR'], {
    P: handPlate, L: 'kubejs:fired_lining', C: strap, R: 'kubejs:iron_rivet'
  })
  replace('whisk', 1, [' B ', 'PSP', 'PRP'], {
    B: bushing, P: handPlate, S: shaft, R: 'kubejs:iron_rivet'
  })
  replace('mechanical_mixer', 1, ['BCB', 'PKP', ' W '], {
    B: bushing, C: cogwheel, P: handPlate, K: casing, W: 'create:whisk'
  })
  replace('encased_fan', 1, ['PSP', 'BKB', ' C '], {
    P: handPlate, S: shaft, B: bushing, K: casing, C: 'create:propeller'
  })
  replace('propeller', 1, [' I ', 'IBI', ' I '], { I: handPlate, B: bushing })
  event.shaped(woven, ['CBC', 'BBB', 'CBC'], {
    C: cord, B: binding
  }).id('zero_shift:create/woven_drive_belt')
  replace('belt_connector', 1, ['WCW', 'RSR', 'WCW'], {
    W: woven, C: cord, R: rivet, S: shaft
  })

  event.custom({
    type: 'create:mixing',
    ingredients: [
      { item: 'minecraft:andesite' }, { item: 'minecraft:andesite' },
      { item: 'minecraft:andesite' }, { item: 'minecraft:andesite' },
      { item: 'minecraft:copper_ingot' }, { item: 'minecraft:copper_ingot' }, { item: 'minecraft:copper_ingot' },
      { item: lining }, { item: 'kubejs:sand_temper' },
      { fluid: 'minecraft:water', amount: 250 }
    ],
    processingTime: 320,
    results: [{ item: alloy, count: 2 }]
  }).id('zero_shift:create/mix_andesite_alloy')

  replace('mechanical_bearing', 1, ['JSJ', 'BKB', 'PCP'], {
    J: joint, S: shaft, B: bushing, K: casing, P: ironPlate, C: cogwheel
  })
  replace('windmill_bearing', 1, ['JBJ', 'KWM', 'CRC'], {
    J: joint, B: bushing, K: 'create:gearbox', W: 'create:large_water_wheel',
    M: 'create:mechanical_bearing', C: cogwheel, R: rivet
  })
  replace('white_sail', 1, ['WWW', 'JFA', 'CPC'], {
    W: '#minecraft:wool', J: joint, F: woven, A: alloy, C: cord, P: pegs
  })
  replace('sail_frame', 1, [' S '], { S: 'create:white_sail' })
  event.shapeless('create:white_sail', ['create:sail_frame']).id('zero_shift:create/refit_sail')
  replace('mechanical_drill', 1, ['APA', 'BSB', 'RKR'], {
    A: alloy, P: ironPlate, B: bushing, S: shaft, R: rivet, K: casing
  })
  replace('mechanical_harvester', 1, ['TPT', 'BSB', 'RKR'], {
    T: 'kubejs:saw_teeth', P: ironPlate, B: bushing, S: shaft, R: rivet, K: casing
  })
  replace('mechanical_plough', 1, ['PPP', 'RKR', ' JS'], {
    P: ironPlate, R: rivet, K: casing, J: joint, S: shaft
  })
  replace('radial_chassis', 2, ['AJA', 'BLB', 'AJA'], {
    A: alloy, J: joint, B: pegs, L: '#minecraft:logs'
  })
  replace('linear_chassis', 2, ['AJA', 'LLL', 'AJA'], {
    A: alloy, J: joint, L: '#minecraft:logs'
  })
  replace('secondary_linear_chassis', 1, [' L '], { L: 'create:linear_chassis' })
  event.shapeless('create:linear_chassis', ['create:secondary_linear_chassis']).id('zero_shift:create/refit_chassis')
  replace('encased_chain_drive', 1, ['RWR', 'BKB', ' S '], {
    R: rivet, W: woven, B: bushing, K: casing, S: shaft
  })
  replace('clutch', 1, ['RPR', 'BKS', ' C '], {
    R: rivet, P: ironPlate, B: bushing, K: casing, S: shaft, C: redstone
  })
  replace('gearshift', 1, ['RPR', 'BKC', ' S '], {
    R: rivet, P: ironPlate, B: bushing, K: casing, C: cogwheel, S: redstone
  })
  replace('wrench', 1, ['GRG', 'RCR', ' H '], { G: goldPlate, R: rivet, C: cogwheel, H: handle })
  replace('goggles', 1, ['CRC', 'GPG', ' B '], {
    C: cord, R: rivet, G: 'minecraft:glass_pane', P: goldPlate, B: binding
  })
  replace('speedometer', 1, ['RGR', 'BCK', ' A '], {
    R: rivet, G: 'minecraft:glass_pane', B: bushing, C: 'minecraft:compass', K: casing, A: alloy
  })
  replace('stressometer', 1, [' S '], { S: 'create:speedometer' })
  event.shapeless('create:speedometer', ['create:stressometer']).id('zero_shift:create/refit_speedometer')

  replace('chute', 1, ['PRP', 'P P', ' B '], { P: ironPlate, R: rivet, B: bushing })
  replace('andesite_funnel', 1, ['ARA', 'PWP'], { A: alloy, R: rivet, P: copperPlate, W: woven })
  replace('andesite_tunnel', 1, ['AJA', 'PFP', 'RWR'], {
    A: alloy, J: joint, P: copperPlate, F: 'create:andesite_funnel', R: rivet, W: woven
  })
  replace('filter', 1, ['RWR', 'CPC'], {
    R: rivet, W: '#minecraft:wool', C: cord, P: copperPlate
  })
  replace('weighted_ejector', 1, ['RGR', 'BDB', ' C '], {
    R: rivet, G: goldPlate, B: bushing, D: 'create:depot', C: cogwheel
  })
  replace('rope_pulley', 1, ['CSC', 'BKB', 'PWP'], {
    C: cord, S: shaft, B: bushing, K: casing, P: ironPlate, W: '#minecraft:wool'
  })
  replace('piston_extension_pole', 2, ['PRP', 'BSB', 'PRP'], {
    P: plank, R: rivet, B: binding, S: shaft
  })
  replace('mechanical_piston', 1, ['JPS', 'BKB', 'RER'], {
    J: joint, P: ironPlate, S: shaft, B: bushing, K: casing, R: rivet, E: 'create:piston_extension_pole'
  })
  replace('sticky_mechanical_piston', 1, ['SRS', 'BPB', ' C '], {
    S: '#forge:slimeballs', R: rivet, B: binding, P: 'create:mechanical_piston', C: copperPlate
  })
  replace('copper_casing', 1, ['PSP', 'JKJ', 'PSP'], {
    P: copperPlate, S: strap, J: joint, K: casing
  })
  replace('fluid_pipe', 2, ['PCP', 'SAS', 'PCP'], { P: copperPlate, C: cord, S: strap, A: alloy })
  replace('mechanical_pump', 1, ['RPR', 'BCB', ' WS'], {
    R: rivet, P: pipe, B: bushing, C: cogwheel, W: woven, S: copperPlate
  })
  replace('fluid_valve', 1, [' R ', 'BPB', 'CHC'], {
    R: rivet, B: bushing, P: pipe, C: copperPlate, H: 'create:copper_valve_handle'
  })
  replace('fluid_tank', 1, ['PRP', 'LCL', 'PRP'], {
    P: copperPlate, R: rivet, L: lining, C: 'minecraft:barrel'
  })
  replace('copper_valve_handle', 1, ['PCP', 'RHR', ' A '], {
    P: copperPlate, C: strap, R: rivet, H: handle, A: alloy
  })
  replace('item_drain', 1, ['RIR', 'PCP', ' B '], {
    R: rivet, I: 'minecraft:iron_bars', P: pipe, C: copperCasing, B: bushing
  })
  replace('spout', 1, ['PRP', 'BCB', ' W '], { P: pipe, R: rivet, B: bushing, C: copperCasing, W: woven })
  replace('empty_blaze_burner', 1, ['IRI', 'LNL', 'ICI'], {
    I: ironPlate, R: rivet, L: lining, N: 'minecraft:netherrack', C: copperCasing
  })
  replace('steam_engine', 1, ['PGP', 'BMB', 'CTC'], {
    P: copperPlate, G: goldPlate, B: bushing, M: 'gtceu:lp_steam_solid_boiler',
    C: copperCasing, T: 'create:fluid_tank'
  })

  replace('mechanical_crafter', 1, ['ERE', 'PCP', 'BWB'], {
    E: 'create:electron_tube', R: rivet, P: 'gtceu:brass_plate', C: 'create:brass_casing',
    B: bushing, W: 'minecraft:crafting_table'
  })
  removeStock(['mechanical_crafting/crushing_wheel'])
  event.custom({
    type: 'create:mechanical_crafting',
    acceptMirrored: false,
    pattern: [' RPR ', 'RABAR', 'PBKBP', 'RABAR', ' RPR '],
    key: {
      R: { item: rivet }, P: { item: 'gtceu:steel_plate' }, A: { item: alloy },
      B: { item: bushing }, K: { item: 'create:millstone' }
    },
    result: { item: 'create:crushing_wheel', count: 1 }
  }).id('zero_shift:create/crushing_wheel')

  // Crushed stock is recovered through the same concentrate route as fresh ore.
  removeStock([
    'crushing/copper_ore', 'crushing/deepslate_copper_ore', 'crushing/raw_copper', 'crushing/raw_copper_block',
    'crushing/iron_ore', 'crushing/deepslate_iron_ore', 'crushing/raw_iron', 'crushing/raw_iron_block',
    'crushing/gold_ore', 'crushing/deepslate_gold_ore', 'crushing/raw_gold', 'crushing/raw_gold_block',
    'crushing/nether_gold_ore', 'crushing/tin_ore', 'crushing/raw_tin', 'crushing/raw_tin_block',
    'splashing/crushed_raw_copper', 'splashing/crushed_raw_iron', 'splashing/crushed_raw_gold',
    'crushing/tuff', 'crushing/tuff_recycling', 'crushing/crimsite', 'crushing/crimsite_recycling',
    'crushing/ochrum', 'crushing/ochrum_recycling', 'crushing/veridium', 'crushing/veridium_recycling',
    'crushing/gilded_blackstone', 'crushing/iron_horse_armor', 'crushing/golden_horse_armor',
    'splashing/gravel', 'splashing/red_sand', 'splashing/soul_sand',
    'haunting/soul_sand', 'haunting/soul_soil', 'haunting/blackstone',
    'milling/wheat', 'splashing/wheat_flour', 'mixing/dough_by_mixing'
  ])
  process('splashing', 'sift_gravel', 'minecraft:gravel', [{ item: 'minecraft:flint', chance: 0.15 }, { item: tailings }])
  process('splashing', 'sift_red_sand', 'minecraft:red_sand', [{ item: 'minecraft:dead_bush', chance: 0.05 }, { item: tailings }])
  process('splashing', 'sift_soul_sand', 'minecraft:soul_sand', [{ item: 'minecraft:quartz', chance: 0.125 }, { item: tailings }])
  process('splashing', 'wash_plant_fibre', 'kubejs:plant_fibre', [{ item: 'kubejs:washed_fibre' }])
  process('milling', 'mill_wheat', 'minecraft:wheat', [
    { item: 'create:wheat_flour' }, { item: 'minecraft:wheat_seeds', chance: 0.15 }
  ], 260)
  event.custom({
    type: 'create:mixing',
    ingredients: [{ tag: 'forge:flour/wheat' }, { tag: 'forge:flour/wheat' }, { fluid: 'minecraft:water', amount: 250 }],
    results: [{ item: 'create:dough', count: 2 }]
  }).id('zero_shift:create/mix_dough')

  const processedOres = ['copper', 'iron', 'tin', 'gold']
  processedOres.forEach(metal => {
    const tag = 'zero_shift:primitive_ores/' + metal
    const grit = 'kubejs:' + metal + '_grit'
    for (const operation of ['milling', 'crushing']) {
      event.remove({ type: 'create:' + operation, input: '#' + tag })
    }
    event.custom({
      type: 'create:milling', ingredients: [{ tag: tag }], processingTime: 320,
      results: [{ item: grit }]
    }).id('zero_shift:create/mill_' + metal)
    event.custom({
      type: 'create:splashing', ingredients: [{ item: grit }],
      results: [{ item: 'kubejs:washed_' + metal + '_grit' }, { item: tailings }]
    }).id('zero_shift:create/wash_' + metal)
    process('milling', 'recover_crushed_' + metal, 'create:crushed_raw_' + metal, [{ item: grit }], 320)
  })

  const firstPress = [
    ['minecraft:iron_ingot', 'gtceu:iron_plate'],
    ['minecraft:copper_ingot', 'gtceu:copper_plate'],
    ['minecraft:gold_ingot', 'gtceu:gold_plate'],
    ['gtceu:bronze_ingot', 'gtceu:bronze_plate'],
    ['gtceu:tin_ingot', 'gtceu:tin_plate']
  ]
  for (const [ingot, plate] of firstPress) {
    for (const type of ['minecraft:crafting_shaped', 'minecraft:crafting_shapeless', 'gtceu:shaped', 'gtceu:shapeless']) {
      event.remove({ output: plate, type: type })
    }
    event.remove({ input: ingot, type: 'create:pressing' })
    event.custom({
      type: 'create:pressing', ingredients: [{ item: ingot }], results: [{ item: plate }]
    }).id('zero_shift:create/press_' + ingot.split(':')[1])
  }
})
