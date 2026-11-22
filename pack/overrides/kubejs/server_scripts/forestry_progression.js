ServerEvents.recipes(event => {
  const forestry = id => 'forestry:' + id
  const gendustry = id => 'gendustry:' + id
  const gt = id => 'gtceu:' + id
  const ks = id => 'kubejs:' + id
  const mc = id => 'minecraft:' + id
  const prefix = 'zero_shift:forestry/'

  const hvPermit = ks('hv_commissioning_report')
  const evPermit = ks('ev_commissioning_report')
  const ivPermit = ks('iv_commissioning_report')
  const seal = ks('chemical_grade_seal')
  const frame = ks('pressed_steel_frame')
  const glass = mc('glass_pane')
  const plate = gt('stainless_steel_plate')
  const bronze = gt('bronze_plate')
  const tin = gt('tin_plate')
  const motor = gt('hv_electric_motor')
  const pump = gt('hv_electric_pump')
  const piston = gt('hv_electric_piston')
  const circuit = gt('advanced_integrated_circuit')
  const oil = forestry('seed_oil')
  const honey = forestry('honey')
  const water = gt('distilled_water')
  const lubricant = gt('lubricant')
  const housing = forestry('sturdy_machine')
  const casing = forestry('impregnated_casing')
  const sticks = forestry('impregnated_stick')
  const wax = forestry('beeswax')
  const jelly = forestry('royal_jelly')
  const pollen = forestry('pollen_cluster_normal')

  function assemble(output, count, materials, ticks, eut, fluid, amount, permits) {
    const recipe = event.recipes.gtceu.assembler(prefix + output.replace(':', '/'))
    materials.forEach(material => recipe.itemInputs(material))
    ;(permits || [hvPermit]).forEach(permit => recipe.notConsumable(Item.of(permit)))
    recipe.itemOutputs(Item.of(output, count)).duration(ticks).EUt(eut)
    recipe.inputFluids(Fluid.of(fluid, amount))
  }

  function buildForestry(id, count, items, ticks, fluid, amount) {
    const output = forestry(id)
    event.remove({ output: output })
    assemble(output, count, items, ticks, 480, fluid || lubricant, amount || 900)
  }

  function buildGendustry(id, count, items, ticks, tier, fluid, amount) {
    const options = {
      hv: [480, [hvPermit]],
      ev: [1920, [hvPermit, evPermit]],
      iv: [7680, [hvPermit, ivPermit]]
    }[tier || 'hv']
    event.remove({ id: gendustry(id) })
    assemble(gendustry(id), count, items, ticks, options[0], fluid || lubricant, amount || 1400, options[1])
  }

  function carpenter(id, item, count, pattern, ingredients, fluid, amount, time) {
    const key = {}
    for (const [letter, ingredient] of Object.entries(ingredients)) {
      key[letter] = ingredient[0] === '#' ? { tag: ingredient.slice(1) } : { item: ingredient }
    }
    const recipe = {
      type: 'minecraft:crafting_shaped', category: 'misc', key: key, pattern: pattern,
      result: { item: item, count: count }
    }
    event.remove({ id: forestry('carpenter/' + id) })
    event.custom({
      type: forestry('carpenter'), box: [], liquid: { FluidName: fluid, Amount: amount },
      recipe: recipe, time: time
    }).id(prefix + 'carpenter/' + id)
  }

  function unpackCanonical(source, crate, target) {
    event.remove({ id: forestry('carpenter/crates/unpack/forestry/' + source) })
    event.custom({
      type: forestry('carpenter'), box: [], time: 40,
      recipe: {
        type: 'minecraft:crafting_shapeless', category: 'misc',
        ingredients: [{ item: forestry('crated_' + crate) }],
        result: { item: target, count: 9 }
      }
    }).id(prefix + 'unpack/' + source)
  }

  // Existing stacks, storage blocks and crates can be reclaimed as GregTech materials.
  const canonical = {
    ingot_tin: gt('tin_ingot'), tin_nugget: gt('tin_nugget'), ingot_bronze: gt('bronze_ingot'),
    apatite: gt('apatite_gem')
  }
  for (const [name, output] of Object.entries(canonical)) {
    event.replaceInput({ input: forestry(name) }, forestry(name), output)
    event.remove({ output: forestry(name) })
    event.shapeless(output, [forestry(name)]).id(prefix + 'recover/' + name)
  }
  for (const [name, output] of [['tin', gt('tin_ingot')], ['bronze', gt('bronze_ingot')]]) {
    event.shapeless('9x ' + output, [forestry('resource_storage_' + name)]).id(prefix + 'recover/block_' + name)
    unpackCanonical('ingot_' + name, name, output)
  }
  event.shapeless('9x ' + gt('apatite_gem'), [forestry('resource_storage_apatite')]).id(prefix + 'recover/block_apatite')
  unpackCanonical('apatite', 'apatite', gt('apatite_gem'))
  // Forestry gear IDs remain valid for old recipes and inventories.

  buildForestry('sturdy_machine', 2, ['8x ' + bronze, '4x ' + plate, '2x ' + frame,
    '2x ' + ks('hv_arc_shield'), '2x ' + seal, circuit], 1920, lubricant, 1600)
  // Hand-built equipment for collecting wild bees and breeding the first colonies.
  function early(id, pattern, ingredients) {
    const output = forestry(id)
    event.remove({ output: output })
    event.shaped(output, pattern, ingredients).id(prefix + 'early/' + id)
  }

  early('scoop', ['CWC', 'CFC', ' H '], {
    C: ks('fibre_cord'), W: '#minecraft:wool', F: ks('washed_fibre'), H: ks('tool_handle')
  })
  early('bee_house', ['SSS', 'PCP', 'JPJ'], {
    S: '#minecraft:wooden_slabs', P: '#minecraft:planks', C: '#forestry:combs', J: ks('wooden_joint')
  })
  early('apiary', ['SFS', 'JBJ', 'SFS'], {
    S: '#minecraft:wooden_slabs', F: forestry('frame_untreated'), J: ks('wooden_joint'), B: forestry('bee_house')
  })
  early('frame_untreated', ['PHP', 'C C', 'PHP'], {
    P: mc('stick'), H: ks('rough_slat'), C: ks('fibre_cord')
  })
  buildForestry('bee_chest', 1, [mc('chest'), '2x #forestry:combs', '4x ' + glass,
    '2x ' + ks('iron_hinge'), '2x ' + seal], 980, lubricant, 700)
  buildForestry('frame_impregnated', 2, ['8x ' + sticks, '4x ' + mc('string'),
    '2x ' + ks('wooden_joint'), '2x ' + seal], 860, oil, 450)
  buildForestry('analyzer', 1, [forestry('portable_alyzer'), housing, '4x ' + tin,
    '2x ' + gt('iron_gear'), '2x ' + gt('hv_sensor'), '2x ae2:logic_processor', circuit], 2360, water, 1250)
  buildForestry('genetic_filter', 1, [housing, '2x ' + gt('bronze_gear'), '4x ' + glass,
    '2x ' + ks('strainer_mesh'), '2x ae2:calculation_processor', gt('hv_conveyor_module')], 1780)

  const forestryMachines = [
    ['squeezer', ['4x ' + tin, '2x ' + pump, '2x ' + ks('strainer_mesh')]],
    ['carpenter', ['4x ' + gt('copper_plate'), '2x ' + piston, '2x ' + ks('wooden_joint')]],
    ['centrifuge', ['4x ' + bronze, '2x ' + motor, '2x ' + ks('balanced_rail_axle')]],
    ['fermenter', ['4x ' + plate, '2x ' + pump, '2x ' + gt('copper_gear')]],
    ['still', ['4x ' + gt('copper_plate'), '2x ' + pump, '2x ' + gt('iron_gear')]],
    ['moistener', ['4x ' + bronze, '2x ' + pump, '2x ' + gt('bronze_gear')]],
    ['bottler', ['4x ' + tin, '2x ' + gt('hv_conveyor_module'), '2x ' + pump]],
    ['fabricator', ['4x ' + gt('gold_plate'), '2x ' + piston, '2x ' + ks('fired_refractory_liner')]],
    ['rainmaker', ['4x ' + tin, '2x ' + gt('hv_emitter'), '2x ' + gt('tin_gear')]]
  ]
  forestryMachines.forEach(([id, items]) => buildForestry(id, 1,
    [housing, circuit, '4x ' + glass, '2x ' + seal].concat(items), 2520, lubricant, 1800))

  const engines = [
    ['engine_clockwork', ['4x ' + gt('copper_plate'), '2x ' + gt('copper_gear'), mc('clock')]],
    ['engine_peat', ['4x ' + gt('copper_plate'), '2x ' + gt('copper_gear'), '2x ' + ks('fired_refractory_liner')]],
    ['engine_biogas', ['4x ' + bronze, '2x ' + gt('bronze_gear'), '2x ' + pump]],
    ['engine_combustion', ['4x ' + plate, '2x ' + pump, '2x ' + ks('hv_winding_pack')]],
    ['engine_solar', ['4x ' + tin, '2x ' + gt('tin_gear'), '2x ' + gt('hv_emitter')]]
  ]
  engines.forEach(([id, items]) => buildForestry(id, 1,
    [housing, circuit, '2x ' + piston, '4x ' + glass].concat(items), 2760, lubricant, 2100))

  buildForestry('alveary_plain', 1, ['8x ' + forestry('scented_paneling'), casing,
    '2x ' + ks('wooden_joint'), '2x ' + seal, '2x ' + bronze], 1800, honey, 650)
  const alvearyParts = [
    ['fan', ['2x ' + forestry('electron_tube_gold'), motor, '4x ' + gt('iron_plate')]],
    ['heater', ['2x ' + forestry('electron_tube_gold'), '2x ' + ks('fired_refractory_liner'), gt('hv_voltage_coil')]],
    ['hygro', ['4x ' + glass, '2x ' + pump, '2x ' + seal]],
    ['sieve', ['3x ' + forestry('woven_silk'), '2x ' + ks('strainer_mesh'), '4x ' + gt('iron_plate')]],
    ['stabiliser', ['4x ' + mc('quartz'), '2x ' + gt('hv_sensor'), '2x ae2:logic_processor']],
    ['swarmer', ['2x ' + forestry('electron_tube_diamond'), '4x ' + gt('gold_plate'), '2x ' + jelly]]
  ]
  alvearyParts.forEach(([id, items]) => buildForestry('alveary_' + id, 1,
    [forestry('alveary_plain'), '2x ' + plate, circuit].concat(items), 2200, honey, 1000))

  carpenter('impregnated_stick', sticks, 2, ['LJL', 'LBL'], {
    L: '#minecraft:logs', J: ks('wooden_joint'), B: ks('tool_binding')
  }, oil, 250, 140)
  carpenter('impregnated_casing', casing, 1, ['LJL', 'S S', 'LJL'], {
    L: '#minecraft:logs', J: ks('wooden_joint'), S: sticks
  }, oil, 650, 200)
  carpenter('portable_analyzer', forestry('portable_alyzer'), 1, ['TGT', 'DCD', 'RBR'], {
    T: tin, G: glass, D: gt('hv_sensor'), C: circuit, R: 'ae2:quartz_fiber', B: seal
  }, water, 2000, 260)
  carpenter('escritoire', forestry('escritoire'), 1, ['J P', 'LCL', 'R R'], {
    J: ks('wooden_joint'), P: forestry('portable_alyzer'), L: '#minecraft:planks', C: casing, R: ks('wooden_peg')
  }, oil, 1000, 200)
  carpenter('woven_silk', forestry('woven_silk'), 1, ['SSS', 'SBJ'], {
    S: forestry('silk_wisp'), B: ks('tool_binding'), J: ks('fibre_cord')
  }, water, 750, 140)
  carpenter('scented_paneling', forestry('scented_paneling'), 2, ['WJW', 'PCP', 'WFW'], {
    W: wax, J: jelly, P: '#minecraft:planks', C: pollen, F: ks('wooden_joint')
  }, honey, 1250, 200)

  const receptacle = gendustry('receptacle')
  const power = gendustry('power_module')
  const genetics = gendustry('genetics_processor')
  const environmental = gendustry('environmental_processor')
  const climate = gendustry('climate_control_module')
  const upgrade = gendustry('upgrade_frame')
  const elite = gendustry('elite_upgrade_frame')
  const labware = gendustry('labware')
  const blankSample = gendustry('blank_gene_sample')
  const engineer = 'ae2:engineering_processor'
  const calc = 'ae2:calculation_processor'
  const optical = ks('me_piezo_laminate')
  const hvCable = gt('gold_single_cable')

  buildGendustry('receptacle', 2, ['4x ' + bronze, '4x ' + glass,
    '2x ' + gt('gold_plate'), '2x ' + ks('hv_switch_contact'), '2x ' + seal, '2x ' + ks('copper_contact_strip')], 1540)
  buildGendustry('power_module', 2, ['4x ' + gt('gold_plate'), '4x ' + hvCable,
    '2x ' + piston, '2x ' + circuit, '2x ' + ks('hv_winding_pack'), '2x ' + seal], 1920, 'hv', lubricant, 1800)
  buildGendustry('genetics_processor', 2, ['2x ' + circuit, '2x ' + engineer,
    '4x ' + ks('ender_optical_insert'), '2x ' + optical, '2x ' + gt('hv_sensor'), '2x ' + receptacle], 2250, 'hv', water, 2100)
  buildGendustry('environmental_processor', 2, ['2x ' + genetics, '2x ' + calc,
    '2x ' + gt('hv_emitter'), '4x ' + gt('gold_plate'), '2x ' + ks('vacuum_gasket'), '2x ' + seal], 2360, 'hv', water, 2300)
  buildGendustry('climate_control_module', 2, ['2x ' + environmental, '2x ' + power,
    '4x ' + bronze, '2x ' + gt('bronze_gear'), '2x ' + pump, '2x ' + gt('hv_sensor')], 2420, 'hv', water, 2500)
  buildGendustry('labware', 4, ['4x ' + glass, '2x ' + mc('diamond'), '2x ' + receptacle,
    '2x ' + ks('vacuum_gasket'), '2x ' + seal], 1420, 'hv', water, 1200)
  buildGendustry('blank_gene_sample', 4, ['4x ' + tin, '4x ' + mc('redstone'), '2x ' + labware,
    '2x ae2:quartz_fiber', '2x ' + seal], 1360, 'hv', water, 1350)
  buildGendustry('blank_genetic_template', 2, ['4x ' + blankSample, '2x ' + calc,
    '2x ' + mc('diamond'), '2x ' + plate, '2x ' + optical], 1900, 'hv', water, 1650)
  buildGendustry('pollen_kit', 2, ['4x ' + labware, '4x ' + mc('string'), '4x ' + mc('paper'),
    '2x ' + ks('strainer_mesh'), '2x ' + seal], 1450, 'hv', water, 1100)

  const laboratory = [
    ['industrial_apiary', [forestry('apiary'), '4x ' + receptacle, '2x ' + piston, '2x ' + environmental]],
    ['dna_extractor', ['4x ' + receptacle, '2x ' + pump, '2x ' + genetics, '2x ' + ks('strainer_mesh')]],
    ['mutagen_producer', [mc('cauldron'), '2x ' + pump, '2x ' + environmental, '4x ' + ks('hv_arc_shield')]],
    ['protein_liquefier', [mc('hopper'), '2x ' + motor, '2x ' + piston, '2x ' + pump]],
    ['sampler', ['4x ' + receptacle, '2x ' + genetics, '2x ' + gt('hv_sensor'), '2x ' + engineer]],
    ['mutatron', ['4x ' + receptacle, '2x ' + genetics, '2x ' + gt('hv_emitter'), '2x ' + ks('vacuum_gasket')]],
    ['genetic_transposer', ['4x ' + receptacle, '2x ' + genetics, '2x ' + calc, '2x ' + optical]],
    ['imprinter', ['4x ' + receptacle, '2x ' + genetics, '2x ' + gt('hv_robot_arm'), '2x ' + engineer]]
  ]
  laboratory.forEach(([id, items]) => buildGendustry(id, 1,
    [housing, '2x ' + power, '4x ' + plate, '2x ' + seal].concat(items), 3300, 'hv', lubricant, 2600))
  buildGendustry('advanced_mutatron', 1, [gendustry('mutatron'), '4x ' + genetics, '4x ' + power,
    '4x ' + gt('titanium_plate'), '2x ' + gt('ev_sensor'), '2x ' + ks('ev_phase_relay'), '2x ae2:cell_component_64k'],
    4400, 'ev', ks('vacuum_shield_gas'), 3900)
  buildGendustry('replicator', 1, [gendustry('imprinter'), gendustry('dna_extractor'), '4x ' + genetics,
    '4x ' + gt('titanium_plate'), '2x ' + gt('ev_electric_pump'), '2x ' + gt('ev_robot_arm'), '2x ae2:cell_component_64k'],
    4800, 'ev', ks('vacuum_shield_gas'), 4200)

  buildGendustry('upgrade_frame', 2, ['4x ' + plate, '4x ' + bronze, '2x ' + gt('bronze_gear'),
    '2x ' + ks('hv_switch_contact'), '2x ' + seal, '2x ' + ks('iron_rivet')], 1620)
  const standardUpgrades = [
    ['automation', [mc('comparator'), gt('hv_conveyor_module'), '2x ' + engineer]],
    ['cooler', [climate, '4x ' + mc('ice'), '2x ' + pump]],
    ['dryer', [climate, '4x ' + mc('dead_bush'), '2x ' + ks('fired_refractory_liner')]],
    ['heater', [climate, '4x ' + mc('blaze_powder'), '2x ' + gt('hv_voltage_coil')]],
    ['humidifier', [climate, '2x ' + pump, '2x ' + ks('vacuum_gasket')]],
    ['immutable', [genetics, '2x ' + mc('redstone_torch'), '2x ' + ks('ender_optical_insert')]],
    ['lifespan', ['2x ' + mc('wither_rose'), '2x ' + environmental, '2x ' + gt('hv_sensor')]],
    ['lighting', ['4x ' + mc('glowstone'), '2x ' + gt('hv_emitter'), '2x ' + optical]],
    ['nether', ['2x ' + mc('crimson_nylium'), '2x ' + mc('warped_nylium'), '2x ' + mc('soul_sand'), climate]],
    ['pollination', ['4x #minecraft:small_flowers', '2x ' + gt('hv_emitter'), '2x ' + pollen]],
    ['productivity', ['2x ' + jelly, '2x ' + calc, '2x ' + gt('hv_conveyor_module')]],
    ['scrubber', ['4x ' + forestry('silk_wisp'), '2x ' + ks('strainer_mesh'), '2x ' + pump]],
    ['sieve', ['4x ' + forestry('silk_wisp'), '2x ' + forestry('woven_silk'), '2x ' + ks('strainer_mesh')]],
    ['sky', ['4x ' + glass, '2x ' + gt('hv_emitter'), '2x ' + environmental]],
    ['stabilizer', ['2x ' + genetics, '2x ' + gt('hv_sensor'), '2x ' + mc('quartz')]],
    ['territory', ['4x ' + mc('grass_block'), '2x ' + gt('hv_emitter'), '2x ' + environmental]],
    ['weatherproof', ['4x ' + wax, '2x ' + climate, '2x ' + ks('vacuum_gasket')]]
  ]
  standardUpgrades.forEach(([id, items]) => buildGendustry(id + '_upgrade', 1,
    [upgrade, '2x ' + plate, '2x ' + seal].concat(items), 1950, 'hv', lubricant, 1850))

  buildGendustry('elite_upgrade_frame', 2, ['4x ' + upgrade, '4x ' + gt('tungsten_steel_plate'),
    '2x ' + power, '2x ' + ks('iv_grid_regulator'), '2x ' + gt('micro_processor_mainframe'), '2x ' + mc('ghast_tear')],
    4200, 'iv', ks('vacuum_shield_gas'), 4000)
  const eliteUpgrades = [
    ['activity_simulator', [gendustry('lighting_upgrade'), gendustry('sky_upgrade'), gendustry('weatherproof_upgrade')]],
    ['fertility', [gendustry('bucket_liquid_dna'), gendustry('bucket_protein'), '2x ' + genetics]],
    ['mutation', [gendustry('bucket_liquid_dna'), gendustry('bucket_mutagen'), '2x ' + genetics]],
    ['productivity', [gendustry('productivity_upgrade'), '4x ' + pollen, '4x ' + jelly]],
    ['territory', [gendustry('territory_upgrade'), '4x ' + mc('grass_block'), '2x ' + gt('iv_emitter')]],
    ['youth', [gendustry('lifespan_upgrade'), '4x ' + mc('ghast_tear'), '2x ' + gt('iv_sensor')]]
  ]
  eliteUpgrades.forEach(([id, items]) => buildGendustry(id + '_elite_upgrade', 1,
    [elite, '2x ' + ks('iv_switch_stack'), '2x ' + gt('micro_processor_mainframe')].concat(items),
    3800, 'iv', ks('vacuum_shield_gas'), 3400))
})
