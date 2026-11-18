ServerEvents.recipes(event => {
  const stampedBlank = 'kubejs:stamped_bronze_blank'
  const seal = 'kubejs:sealed_boiler_joint'
  const casing = 'gtceu:bronze_machine_casing'
  const plate = 'gtceu:bronze_plate'
  const pipe = 'gtceu:bronze_small_fluid_pipe'
  const lining = 'kubejs:fired_lining'
  const rivet = 'kubejs:iron_rivet'
  const hammer = 'gtceu:flint_hammer'
  const gt = name => 'gtceu:' + name
  const ks = name => 'kubejs:' + name
  const furnace = 'minecraft:furnace'
  const firebox = gt('bronze_firebox_casing')
  const boiler = gt('lp_steam_solid_boiler')
  const steel = gt('steel_plate')
  const steelFrame = ks('pressed_steel_frame')
  const bushing = ks('shaft_bushing')
  const plank = '#minecraft:planks'
  const joint = ks('wooden_joint')
  const lvCircuit = gt('basic_electronic_circuit')
  const press = 'create:mechanical_press'
  const pump = 'create:mechanical_pump'
  const bronzeDrum = gt('bronze_drum')

  function workshop(id, count, pattern, keys) {
    const output = gt(id)
    event.remove({ output: output })
    event.shaped(Item.of(output, count), pattern, keys).id('zero_shift:steam/' + id)
  }

  function assemble(id, count, inputs, ticks, water) {
    const output = gt(id)
    event.remove({ output: output })
    const recipe = event.recipes.gtceu.assembler('zero_shift:steam/' + id)
    inputs.forEach(input => recipe.itemInputs(input))
    recipe.inputFluids(Fluid.of('minecraft:water', water))
      .itemOutputs(Item.of(output, count)).duration(ticks).EUt(28)
  }

  // Bronze begins with the Create concentrate charge and remains the same furnace recipe on steam.
  event.remove({ id: 'immersiveengineering:alloysmelter/bronze' })
  event.remove({ id: 'immersiveengineering:arcfurnace/alloy_bronze' })
  event.remove({ id: 'forestry:smelter/bronze_from_ingots' })
  event.remove({ id: 'forestry:smelter/bronze_from_raw_materials' })
  event.remove({ type: gt('alloy_smelter'), output: gt('bronze_ingot') })
  event.remove({ type: gt('mixer'), output: gt('bronze_dust') })
  event.remove({ id: 'gtceu:shapeless/dust_bronze' })
  event.remove({ id: 'immersiveengineering:arcfurnace/dust_bronze' })

  event.custom({
    type: 'create:mixing',
    ingredients: [
      { item: 'kubejs:washed_copper_grit' }, { item: 'kubejs:washed_copper_grit' },
      { item: 'kubejs:washed_copper_grit' }, { item: 'kubejs:washed_tin_grit' },
      { item: 'minecraft:charcoal' }, { item: 'kubejs:fired_crucible' },
      { fluid: 'minecraft:water', amount: 500 }
    ],
    results: [{ item: 'kubejs:bronze_charge' }]
  }).id('zero_shift:create/bronze_charge')
  event.custom({
    type: 'minecraft:smelting', ingredient: { item: 'kubejs:bronze_charge' },
    result: 'gtceu:bronze_ingot', experience: 0.7, cookingtime: 2400
  }).id('zero_shift:gtceu/first_bronze')
  event.custom({
    type: 'create:compacting',
    ingredients: [{ item: plate }, { item: plate }, { fluid: 'minecraft:water', amount: 250 }],
    results: [{ item: stampedBlank }]
  }).id('zero_shift:create/stamped_bronze_blank')
  event.custom({
    type: 'create:compacting',
    ingredients: [
      { item: stampedBlank }, { item: stampedBlank }, { item: stampedBlank }, { item: stampedBlank },
      { item: lining }, { item: lining }, { item: 'kubejs:fibre_cord' }, { item: 'kubejs:fibre_cord' }, { item: rivet },
      { fluid: 'minecraft:water', amount: 500 }
    ],
    results: [{ item: seal }]
  }).id('zero_shift:gtceu/boiler_joint')

  const replaced = [
    casing, pipe, 'gtceu:bronze_firebox_casing', 'gtceu:lp_steam_solid_boiler',
    'gtceu:lp_steam_macerator', 'gtceu:lp_steam_forge_hammer', 'gtceu:lp_steam_extractor', 'gtceu:lv_machine_hull',
    'immersiveengineering:component_iron', 'immersiveengineering:component_steel'
  ]
  for (const output of replaced) event.remove({ output: output })

  event.shaped(casing, ['PSP', 'SFS', 'PSP'], {
    P: plate, S: stampedBlank, F: seal
  }).id('zero_shift:gtceu/bronze_machine_casing')
  event.shaped('gtceu:bronze_firebox_casing', ['PLP', 'FCF', 'PLP'], {
    P: plate, L: lining, F: 'minecraft:furnace', C: casing
  }).id('zero_shift:gtceu/bronze_firebox_casing')
  event.shaped('2x ' + pipe, ['PPP', 'BHR', 'PPP'], {
    P: plate, B: stampedBlank, H: hammer, R: rivet
  }).id('zero_shift:gtceu/small_bronze_fluid_pipe').damageIngredient(hammer)
  event.shaped('gtceu:lp_steam_solid_boiler', ['PSP', 'VCV', 'PFP'], {
    P: plate, S: seal, V: pipe, C: casing, F: 'gtceu:bronze_firebox_casing'
  }).id('zero_shift:gtceu/first_boiler')
  event.shaped('gtceu:lp_steam_macerator', ['SDS', 'BCB', 'PVP'], {
    S: stampedBlank, D: 'create:millstone', B: 'kubejs:shaft_bushing',
    C: casing, P: plate, V: pipe
  }).id('zero_shift:gtceu/steam_macerator')
  event.shaped('gtceu:lp_steam_forge_hammer', ['PHP', 'BCB', 'SVS'], {
    P: plate, H: 'create:mechanical_press', B: stampedBlank,
    C: casing, S: seal, V: pipe
  }).id('zero_shift:gtceu/steam_forge_hammer')
  event.shaped('gtceu:lp_steam_extractor', ['PSP', 'VCV', 'PFP'], {
    P: 'gtceu:copper_plate', S: seal, V: pipe, C: casing, F: 'create:encased_fan'
  }).id('zero_shift:gtceu/steam_extractor')

  workshop('lp_steam_furnace', 1, ['PBP', 'VFV', 'SCS'], {
    P: plate, B: stampedBlank, V: pipe, F: furnace, S: seal, C: firebox
  })
  workshop('lp_steam_alloy_smelter', 1, ['BCB', 'SFS', 'PVP'], {
    B: stampedBlank, C: 'kubejs:fired_crucible', S: seal, F: gt('lp_steam_furnace'), P: plate, V: pipe
  })

  workshop('wood_drum', 1, ['PJP', 'RBR', 'PSP'], {
    P: plank, J: joint, R: rivet, B: 'minecraft:barrel', S: gt('sticky_resin')
  })
  workshop('bronze_drum', 1, ['PSP', 'VBV', 'PRP'], {
    P: plate, S: seal, V: pipe, B: gt('wood_drum'), R: rivet
  })
  workshop('bronze_tiny_fluid_pipe', 2, ['PBP', ' R '], {
    P: plate, B: stampedBlank, R: rivet
  })
  workshop('bronze_normal_fluid_pipe', 1, [' P ', 'VSV', ' R '], {
    P: plate, V: pipe, S: seal, R: rivet
  })
  workshop('bronze_large_fluid_pipe', 1, [' P ', 'VSV', ' R '], {
    P: plate, V: gt('bronze_normal_fluid_pipe'), S: seal, R: rivet
  })
  workshop('bronze_huge_fluid_pipe', 1, [' P ', 'VSV', ' R '], {
    P: plate, V: gt('bronze_large_fluid_pipe'), S: seal, R: rivet
  })
  workshop('bronze_quadruple_fluid_pipe', 1, ['VPV', 'SRS', 'VPV'], {
    V: gt('bronze_normal_fluid_pipe'), P: plate, S: seal, R: rivet
  })
  workshop('bronze_nonuple_fluid_pipe', 1, ['VPV', 'SQS', 'VPV'], {
    V: gt('bronze_normal_fluid_pipe'), P: plate, S: seal, Q: gt('bronze_quadruple_fluid_pipe')
  })

  assemble('lp_steam_liquid_boiler', 1, [boiler, bronzeDrum, pump, '2x ' + pipe, '2x ' + seal, lvCircuit], 880, 500)
  assemble('lp_steam_solar_boiler', 1, [boiler, '4x minecraft:glass_pane', '4x ' + gt('copper_plate'),
    '2x ' + ks('copper_contact_strip'), '2x ' + seal, lvCircuit], 1060, 500)
  assemble('lp_steam_miner', 1, [gt('lp_steam_macerator'), '2x minecraft:iron_pickaxe', '2x ' + bushing,
    '2x ' + gt('lv_electric_motor'), '2x ' + pipe, lvCircuit], 1080, 500)
  assemble('lp_steam_rock_crusher', 1, [gt('lp_steam_forge_hammer'), gt('lp_steam_macerator'), '2x ' + bushing,
    '2x ' + gt('iron_plate'), '2x ' + seal, lvCircuit], 1020, 500)

  const upgrades = {
    solid_boiler: gt('steel_firebox_casing'),
    liquid_boiler: gt('lv_electric_pump'),
    solar_boiler: 'minecraft:glass_pane',
    furnace: lining,
    macerator: 'create:millstone',
    forge_hammer: press,
    extractor: pump,
    compressor: press,
    alloy_smelter: 'kubejs:fired_crucible',
    miner: gt('lv_electric_motor'),
    rock_crusher: 'minecraft:iron_pickaxe'
  }
  Object.entries(upgrades).forEach(([name, head]) => {
    assemble('hp_steam_' + name, 1, [gt('lp_steam_' + name), head, '4x ' + steel,
      steelFrame, '2x ' + seal, '2x ' + pipe], 1240, 750)
  })

  workshop('bronze_brick_casing', 2, ['PLP', 'LCL', 'PLP'], {
    P: plate, L: 'minecraft:bricks', C: casing
  })
  workshop('bronze_pipe_casing', 2, ['PVP', 'SCS', 'PVP'], {
    P: plate, V: pipe, S: stampedBlank, C: casing
  })
  assemble('steel_firebox_casing', 2, [firebox, '4x ' + steel, steelFrame, '2x ' + lining, '2x ' + rivet], 700, 500)
  assemble('steam_machine_casing', 2, [gt('bronze_brick_casing'), '4x ' + stampedBlank, '2x ' + seal,
    '2x ' + pipe, lvCircuit], 860, 500)
  assemble('steam_input_bus', 1, [gt('steam_machine_casing'), 'minecraft:hopper', '2x ' + joint,
    '2x ' + rivet, gt('lv_conveyor_module')], 900, 500)
  assemble('steam_output_bus', 1, [gt('steam_machine_casing'), 'minecraft:chest', '2x ' + joint,
    '2x ' + rivet, gt('lv_conveyor_module')], 900, 500)
  assemble('steam_input_hatch', 1, [gt('steam_machine_casing'), bronzeDrum, pump, '2x ' + pipe,
    '2x ' + seal], 900, 500)
  assemble('steam_grinder', 1, [gt('hp_steam_macerator'), '2x ' + gt('steam_machine_casing'), '2x create:millstone',
    '2x ' + gt('bronze_pipe_casing'), '2x ' + lvCircuit, '2x ' + seal], 1600, 1250)
  assemble('steam_oven', 1, [gt('hp_steam_furnace'), '2x ' + gt('steam_machine_casing'), '2x ' + firebox,
    '2x ' + gt('bronze_pipe_casing'), '2x ' + lvCircuit, '2x ' + seal], 1600, 1250)
  assemble('bronze_large_boiler', 1, [gt('hp_steam_solid_boiler'), '4x ' + firebox,
    '4x ' + gt('bronze_pipe_casing'), '2x ' + bronzeDrum, '2x ' + lvCircuit, steelFrame], 1850, 1500)
  assemble('steel_large_boiler', 1, [gt('bronze_large_boiler'), gt('hp_steam_liquid_boiler'),
    '4x ' + gt('steel_firebox_casing'), '4x ' + steel, '2x ' + steelFrame, '2x ' + lvCircuit], 2200, 2000)
  assemble('primitive_blast_furnace', 1, [gt('lp_steam_furnace'), '4x ' + gt('bronze_brick_casing'),
    '2x ' + firebox, '4x ' + lining, steelFrame, '2x ' + seal], 1500, 1250)

  workshop('wooden_multiblock_tank', 1, ['PJP', 'TDT', 'PSP'], {
    P: plank, J: joint, T: gt('wooden_tank_valve'), D: gt('wood_drum'), S: seal
  })
  workshop('wooden_tank_valve', 1, ['BJB', 'VSV', ' R '], {
    B: plank, J: joint, V: pipe, S: seal, R: rivet
  })
  assemble('bronze_multiblock_tank', 1, [gt('wooden_multiblock_tank'), '2x ' + bronzeDrum,
    '4x ' + casing, '2x ' + seal, gt('bronze_tank_valve')], 1240, 1000)
  assemble('bronze_tank_valve', 1, [gt('wooden_tank_valve'), pump, '2x ' + pipe,
    '2x ' + stampedBlank, '2x ' + seal], 900, 500)

  event.shaped('gtceu:lv_machine_hull', ['BRB', 'WCW', 'BRB'], {
    B: stampedBlank, R: rivet, W: 'gtceu:tin_single_cable', C: 'gtceu:lv_machine_casing'
  }).id('zero_shift:gtceu/lv_machine_hull')

  event.shaped('immersiveengineering:component_iron', ['PRP', 'BHB', 'PSP'], {
    P: 'gtceu:iron_plate', R: rivet, B: stampedBlank,
    H: 'gtceu:lv_machine_hull', S: 'create:gearbox'
  }).id('zero_shift:ie/component_iron')
  event.shaped('immersiveengineering:component_steel', ['PHP', 'BIB', 'PVP'], {
    P: 'gtceu:steel_plate', H: hammer, B: 'kubejs:shaft_bushing',
    I: 'immersiveengineering:component_iron', V: seal
  }).id('zero_shift:ie/component_steel').damageIngredient(hammer)
})
