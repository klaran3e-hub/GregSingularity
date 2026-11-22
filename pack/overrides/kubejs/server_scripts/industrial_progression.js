ServerEvents.recipes(event => {
  const stampedBlank = 'gtceu:gregsingularity_stamped_bronze_blank'
  const seal = 'gtceu:gregsingularity_sealed_boiler_joint'
  const casing = 'gtceu:bronze_machine_casing'
  const plate = 'gtceu:bronze_plate'
  const pipe = 'gtceu:bronze_small_fluid_pipe'
  const lining = 'gtceu:gregsingularity_fired_lining'
  const rivet = 'gtceu:gregsingularity_iron_rivet'
  const hammer = '#gtceu:tools/crafting_hammers'
  const gt = name => 'gtceu:' + name
  const ks = name => global.gsItemId(name)
  const furnace = 'minecraft:furnace'
  const firebox = gt('bronze_firebox_casing')
  const boiler = gt('lp_steam_solid_boiler')
  const steel = gt('steel_plate')
  const steelFrame = ks('pressed_steel_frame')
  const bushing = ks('shaft_bushing')
  const plank = '#minecraft:planks'
  const joint = ks('wooden_joint')
  const lvCircuit = gt('basic_electronic_circuit')
  const press = 'gtceu:gregsingularity_forging_saddle'
  const pump = 'gtceu:gregsingularity_hand_pump_barrel'
  const bronzeDrum = gt('bronze_drum')
  const valve = ks('packed_steam_valve')

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

  // The field bloomery is the first source of bronze.
  event.remove({ id: 'forestry:smelter/bronze_from_ingots' })
  event.remove({ id: 'forestry:smelter/bronze_from_raw_materials' })
  event.remove({ type: gt('alloy_smelter'), output: gt('bronze_ingot') })
  event.remove({ type: gt('mixer'), output: gt('bronze_dust') })
  event.remove({ id: 'gtceu:shapeless/dust_bronze' })

  const replaced = [
    casing, pipe, 'gtceu:bronze_firebox_casing', 'gtceu:lp_steam_solid_boiler',
    'gtceu:lp_steam_macerator', 'gtceu:lp_steam_forge_hammer', 'gtceu:lp_steam_extractor', 'gtceu:lv_machine_hull'
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
    P: plate, S: valve, V: ks('boiler_tube_bank'), C: casing, F: firebox
  }).id('zero_shift:gtceu/first_boiler')
  event.shaped('gtceu:lp_steam_macerator', ['SDT', 'BCB', 'PVP'], {
    S: stampedBlank, D: 'gtceu:gregsingularity_grinding_runner', T: valve, B: 'gtceu:gregsingularity_shaft_bushing',
    C: casing, P: plate, V: pipe
  }).id('zero_shift:gtceu/steam_macerator')
  event.shaped('gtceu:lp_steam_forge_hammer', ['PHP', 'BCB', 'SVT'], {
    P: plate, H: 'gtceu:gregsingularity_forging_saddle', B: stampedBlank,
    C: casing, S: seal, V: pipe, T: valve
  }).id('zero_shift:gtceu/steam_forge_hammer')
  event.shaped('gtceu:lp_steam_extractor', ['PSP', 'VCT', 'PFP'], {
    P: 'gtceu:copper_plate', S: seal, V: pipe, T: valve, C: casing, F: 'gtceu:gregsingularity_hearth_bellows'
  }).id('zero_shift:gtceu/steam_extractor')

  workshop('lp_steam_furnace', 1, ['PBP', 'VFV', 'SCT'], {
    P: plate, B: stampedBlank, V: pipe, F: furnace, S: seal, C: firebox, T: valve
  })
  workshop('lp_steam_alloy_smelter', 1, ['BCB', 'SFT', 'PVP'], {
    B: stampedBlank, C: 'gtceu:gregsingularity_fired_crucible', S: seal, F: gt('lp_steam_furnace'), T: valve, P: plate, V: pipe
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
    macerator: 'gtceu:gregsingularity_grinding_runner',
    forge_hammer: press,
    extractor: pump,
    compressor: press,
    alloy_smelter: 'gtceu:gregsingularity_fired_crucible',
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
  assemble('steam_grinder', 1, [gt('hp_steam_macerator'), '2x ' + gt('steam_machine_casing'), '2x gtceu:gregsingularity_grinding_runner',
    '2x ' + gt('bronze_pipe_casing'), '2x ' + lvCircuit, '2x ' + seal], 1600, 1250)
  assemble('steam_oven', 1, [gt('hp_steam_furnace'), '2x ' + gt('steam_machine_casing'), '2x ' + firebox,
    '2x ' + gt('bronze_pipe_casing'), '2x ' + lvCircuit, '2x ' + seal], 1600, 1250)
  assemble('bronze_large_boiler', 1, [gt('hp_steam_solid_boiler'), '4x ' + firebox,
    '4x ' + gt('bronze_pipe_casing'), '2x ' + bronzeDrum, '2x ' + lvCircuit, steelFrame], 1850, 1500)
  assemble('steel_large_boiler', 1, [gt('bronze_large_boiler'), gt('hp_steam_liquid_boiler'),
    '4x ' + gt('steel_firebox_casing'), '4x ' + steel, '2x ' + steelFrame, '2x ' + lvCircuit], 2200, 2000)
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
    B: stampedBlank, R: 'gtceu:gregsingularity_lv_terminal_block', W: 'gtceu:tin_single_cable', C: 'gtceu:lv_machine_casing'
  }).id('zero_shift:gtceu/lv_machine_hull')


})
