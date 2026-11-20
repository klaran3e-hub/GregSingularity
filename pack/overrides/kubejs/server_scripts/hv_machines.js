ServerEvents.recipes(event => {
  const ks = name => 'kubejs:' + name
  const gt = name => 'gtceu:' + name
  const mv = name => gt('mv_' + name)
  const hv = name => gt('hv_' + name)

  const pnc = name => 'pneumaticcraft:' + name
  const prefix = 'zero_shift:hv/'
  const stainless = gt('stainless_steel_plate')
  const liner = ks('fired_refractory_liner')
  const seal = ks('chemical_grade_seal')
  const shield = ks('hv_arc_shield')
  const contact = ks('hv_switch_contact')
  const winding = ks('hv_winding_pack')
  const precision = 'gtceu:lv_robot_arm'
  const arm = 'gtceu:mv_robot_arm'
  const control = 'gtceu:basic_electronic_circuit'
  const heavy = 'gtceu:steel_frame'
  const frame = ks('pressed_steel_frame')
  const interfaceBlock = pnc('pressure_chamber_interface')
  const reinforcedTube = pnc('reinforced_pressure_tube')
  const regulator = pnc('regulator_tube_module')
  const circuit = gt('advanced_integrated_circuit')
  const cable = gt('gold_single_cable')
  const casing = hv('machine_casing')
  const hull = hv('machine_hull')
  const motor = hv('electric_motor')
  const pump = hv('electric_pump')
  const piston = hv('electric_piston')
  const conveyor = hv('conveyor_module')
  const robot = hv('robot_arm')
  const emitter = hv('emitter')
  const sensor = hv('sensor')
  const coil = hv('voltage_coil')
  const lubricant = gt('lubricant')
  const distilled = gt('distilled_water')
  const diesel = gt('diesel')
  const solder = gt('soldering_alloy')
  const acid = gt('sulfuric_acid')

  function replace(output, id, items, ticks, power, fluid, amount, count) {
    event.remove({ output: output })
    const recipe = event.recipes.gtceu.assembler(prefix + id)
    items.forEach(item => recipe.itemInputs(item))
    const result = output === hv('power_unit') ? Item.of(output, '{MaxCharge:1800000L}') : Item.of(output, count || 1)
    recipe.inputFluids(Fluid.of(fluid, amount)).itemOutputs(result)
      .duration(ticks).EUt(power)
  }

  function upgrade(id, items, ticks, fluid, amount, power) {
    replace(hv(id), id, items, ticks, power, fluid, amount)
  }

  // Make the liquid solder for the first energy hatch on the existing MV chemical line.
  event.recipes.gtceu.mixer(prefix + 'prepare_soldering_alloy')
    .itemInputs('6x ' + ks('tin_solder_preform'), '3x ' + gt('lead_dust'), gt('antimony_dust'), ks('strainer_mesh'))
    .outputFluids(Fluid.of(solder, 1440)).duration(760).EUt(96)

  // The first generator and assembler must still be buildable on the existing 128 EU supply.
  upgrade('machine_casing', [
    '8x ' + stainless, '2x ' + liner, '2x ' + shield, '2x ' + frame, '2x ' + seal,
    heavy, '2x ' + pnc('pressure_chamber_wall'), ks('mv_impregnated_insulation')
  ], 1080, lubricant, 500, 112)
  upgrade('machine_hull', [
    casing, mv('machine_hull'), ks('received_refractory_crate'), '4x ' + cable,
    '2x ' + contact, '2x ' + seal, 'gtceu:copper_single_cable', reinforcedTube, '2x ' + ks('mv_impregnated_insulation')
  ], 1220, ks('mv_dielectric_oil'), 650, 112)
  upgrade('electric_motor', [
    mv('electric_motor'), '2x ' + winding, '3x ' + stainless, '2x ' + cable, seal, circuit,
    'gtceu:mv_voltage_coil', precision
  ], 1080, lubricant, 450, 112)
  upgrade('electric_piston', [
    mv('electric_piston'), motor, '2x ' + ks('balanced_rail_axle'), '2x ' + stainless, seal,
    '2x ' + contact, 'gtceu:lv_electric_piston', interfaceBlock
  ], 1000, lubricant, 450, 112)
  upgrade('electric_pump', [
    mv('electric_pump'), motor, '2x ' + seal, shield, '2x ' + stainless, '2x ' + cable,
    'gtceu:lv_electric_pump', '2x ' + reinforcedTube
  ], 1040, distilled, 650, 112)
  upgrade('conveyor_module', [
    mv('conveyor_module'), '2x ' + motor, '2x ' + ks('balanced_rail_axle'), '2x ' + gt('polyethylene_plate'),
    '2x ' + stainless, 'gtceu:lv_conveyor_module', 'kubejs:woven_drive_belt', seal
  ], 1040, lubricant, 500, 112)
  upgrade('robot_arm', [
    mv('robot_arm'), motor, piston, '2x ' + winding, circuit, '2x ' + stainless, seal, arm
  ], 1140, lubricant, 600, 112)
  upgrade('emitter', [
    mv('emitter'), '2x ' + contact, circuit, shield, '2x ' + stainless, '2x ' + cable, control,
    'gtceu:tin_quadruple_cable'
  ], 940, solder, 400, 112)
  upgrade('sensor', [
    mv('sensor'), '2x ' + ks('signal_relay'), circuit, shield, '2x ' + stainless, '2x ' + cable,
    pnc('pressure_gauge_module'), 'gtceu:lv_sensor'
  ], 960, solder, 420, 112)
  upgrade('assembler', [
    mv('assembler'), hull, '2x ' + robot, conveyor, '3x ' + circuit, '2x ' + shield, '4x ' + cable,
    arm, heavy
  ], 1820, lubricant, 1200, 120)
  upgrade('combustion', [
    mv('combustion'), hull, '2x ' + motor, '2x ' + pump, '2x ' + shield, '2x ' + circuit, '4x ' + cable,
    pnc('liquid_compressor'), ks('process_commissioning_kit')
  ], 1940, diesel, 1400, 120)
  upgrade('energy_input_hatch', [
    mv('energy_input_hatch'), hull, '2x ' + winding, '2x ' + contact, shield, '4x ' + cable,
    'gtceu:copper_quadruple_cable', control
  ], 1140, solder, 550, 112)
  upgrade('energy_output_hatch', [
    mv('energy_output_hatch'), hull, '2x ' + winding, '2x ' + contact, shield, '4x ' + cable,
    'gtceu:copper_quadruple_cable', control
  ], 1140, solder, 550, 112)

  // Each machine retains the previous machine and uses tooling suited to its process.
  function workshop(id, part, tooling, support, ticks, fluid, amount) {
    upgrade(id, [mv(id), hull, '2x ' + part, '2x ' + circuit, '2x ' + stainless, '2x ' + cable, seal,
      tooling, support], ticks, fluid, amount, 384)
  }
  const fabrication = [
    ['bender', piston, 'kubejs:forging_saddle', 'gtceu:plate_casting_mold'],
    ['compressor', piston, 'kubejs:forging_saddle', pnc('safety_tube_module')],
    ['cutter', piston, 'kubejs:saw_blade', 'kubejs:pressed_steel_frame'],
    ['extruder', piston, gt('stainless_steel_gear'), 'gtceu:rod_extruder_mold'],
    ['forge_hammer', piston, 'kubejs:forging_saddle', 'gtceu:steel_frame'],
    ['forming_press', piston, 'kubejs:forging_saddle', 'gtceu:gear_casting_mold'],
    ['lathe', piston, 'kubejs:saw_blade', 'gtceu:rod_extruder_mold'],
    ['wiremill', piston, 'gtceu:good_electronic_circuit', 'gtceu:wire_extruder_mold'],
    ['macerator', piston, 'gtceu:lp_steam_macerator', 'kubejs:pressed_steel_frame'],
    ['miner', piston, 'kubejs:grinding_runner', ks('drill_seal_head')],
    ['block_breaker', piston, 'kubejs:grinding_runner', pnc('safety_tube_module')],
    ['rock_crusher', piston, 'gtceu:lp_steam_macerator', ks('drill_seal_head')],
    ['sifter', motor, 'kubejs:hearth_bellows', ks('strainer_mesh')],
    ['mixer', motor, 'kubejs:turned_spindle', 'kubejs:pressed_steel_frame'],
    ['alloy_smelter', shield, pnc('heat_pipe'), heavy],
    ['arc_furnace', shield, 'kubejs:heater_ribbon', pnc('heat_sink')],
    ['electric_furnace', shield, 'kubejs:heater_ribbon', pnc('heat_pipe')],
    ['muffler_hatch', motor, 'kubejs:hearth_bellows', liner]
  ]
  fabrication.forEach(([id, part, tooling, support], index) => {
    workshop(id, part, tooling, support, 1320 + index * 25, lubricant, 800)
  })
  const wetProcess = [
    ['air_scrubber', pump, 'kubejs:hearth_bellows', ks('strainer_mesh')],
    ['autoclave', pump, interfaceBlock, regulator],
    ['brewery', pump, 'gtceu:bronze_small_fluid_pipe', pnc('small_tank')],
    ['canner', pump, 'kubejs:hand_pump_barrel', 'gtceu:steel_small_fluid_pipe'],
    ['chemical_bath', pump, ks('heat_exchange_core'), pnc('small_tank')],
    ['chemical_reactor', pump, 'gtceu:lv_electric_pump', regulator],
    ['distillery', pump, ks('refinery_tray'), pnc('refinery_output')],
    ['electrolyzer', pump, 'gtceu:mv_voltage_coil', pnc('heat_sink')],
    ['extractor', pump, 'kubejs:hand_pump_barrel', interfaceBlock],
    ['fermenter', pump, 'gtceu:bronze_drum', pnc('small_tank')],
    ['fisher', conveyor, 'kubejs:woven_drive_belt', 'gtceu:treated_wood_planks'],
    ['fluid_heater', pump, 'kubejs:heater_ribbon', pnc('heat_pipe')],
    ['fluid_solidifier', pump, 'gtceu:bronze_small_fluid_pipe', 'gtceu:plate_casting_mold'],
    ['gas_collector', pump, 'kubejs:hearth_bellows', regulator],
    ['ore_washer', pump, ks('strainer_mesh'), 'gtceu:lv_electric_pump'],
    ['pump', pump, 'gtceu:lv_electric_pump', 'gtceu:lv_electric_pump'],
    ['centrifuge', motor, ks('balanced_turbine_rotor'), 'gtceu:good_electronic_circuit'],
    ['thermal_centrifuge', motor, ks('heat_exchange_core'), pnc('vortex_tube')]
  ]
  wetProcess.forEach(([id, part, tooling, support], index) => {
    workshop(id, part, tooling, support, 1460 + index * 30, distilled, 1000)
  })
  const storage = [
    ['buffer', conveyor, 'kubejs:forging_saddle', 'kubejs:woven_drive_belt'],
    ['fluid_passthrough_hatch', pump, 'kubejs:hand_pump_barrel', regulator],
    ['fluid_regulator', pump, regulator, reinforcedTube],
    ['hermetic_casing', shield, pnc('pressure_chamber_wall'), reinforcedTube],
    ['input_bus', conveyor, 'gtceu:lv_conveyor_module', 'kubejs:woven_drive_belt'],
    ['input_hatch', pump, 'kubejs:hand_pump_barrel', 'gtceu:steel_small_fluid_pipe'],
    ['item_collector', conveyor, 'gtceu:tin_normal_item_pipe', sensor],
    ['item_passthrough_hatch', conveyor, 'gtceu:tin_normal_restrictive_item_pipe', 'kubejs:woven_drive_belt'],
    ['output_bus', conveyor, 'gtceu:tin_normal_restrictive_item_pipe', 'kubejs:woven_drive_belt'],
    ['output_hatch', pump, 'kubejs:hand_pump_barrel', reinforcedTube],
    ['packer', conveyor, 'gtceu:tin_normal_item_pipe', 'kubejs:woven_drive_belt'],
    ['super_chest', conveyor, 'gtceu:mv_sensor', hv('buffer')],
    ['super_tank', pump, 'gtceu:bronze_drum', gt('stainless_steel_drum')]
  ]
  storage.forEach(([id, part, tooling, support], index) => {
    workshop(id, part, tooling, support, 1260 + index * 35, lubricant, 850)
  })
  const electronics = [
    ['circuit_assembler', emitter, arm, coil],
    ['electromagnetic_separator', emitter, 'gtceu:mv_voltage_coil', sensor],
    ['laser_engraver', emitter, ks('glass_tube_blank'), 'gtceu:copper_quadruple_cable'],
    ['polarizer', emitter, coil, 'gtceu:mv_voltage_coil'],
    ['scanner', sensor, 'gtceu:lv_sensor', pnc('pressure_gauge_module')],
    ['solar_panel', sensor, 'gtceu:mv_battery_buffer_4x', coil],
    ['world_accelerator', emitter, hv('field_generator'), pnc('charging_module')]
  ]
  electronics.forEach(([id, part, tooling, support], index) => {
    workshop(id, part, tooling, support, 1540 + index * 35, solder, 700)
  })

  upgrade('field_generator', [
    mv('field_generator'), '4x ' + winding, '2x ' + emitter, '2x ' + circuit, shield, '4x ' + cable,
    'gtceu:mv_voltage_coil', pnc('charging_module')
  ], 1800, solder, 1000, 384)
  upgrade('bedrock_ore_miner', [
    mv('bedrock_ore_miner'), hull, hv('miner'), hv('macerator'), '2x ' + robot,
    '2x ' + ks('drill_seal_head'), '4x ' + circuit, '4x ' + cable, heavy
  ], 2100, lubricant, 1600, 480)
  upgrade('fluid_drilling_rig', [
    mv('fluid_drilling_rig'), hull, '2x ' + pump, '2x ' + ks('drill_seal_head'), '2x ' + 'gtceu:lv_electric_pump',
    hv('input_hatch'), '4x ' + circuit, '4x ' + cable, '2x ' + reinforcedTube
  ], 2000, lubricant, 1450, 480)
  upgrade('steam_turbine', [
    mv('steam_turbine'), hull, '2x ' + motor, '2x ' + ks('balanced_turbine_rotor'), '2x ' + winding,
    'gtceu:good_electronic_circuit', '2x ' + ks('heat_exchange_core'), '4x ' + cable, '2x ' + reinforcedTube
  ], 1800, lubricant, 1300, 384)
  upgrade('gas_turbine', [
    mv('gas_turbine'), hull, '2x ' + motor, hv('gas_collector'), hv('rotor_holder'), '2x ' + ks('heat_exchange_core'),
    '2x ' + circuit, '4x ' + cable, regulator
  ], 1880, lubricant, 1350, 384)
  upgrade('rotor_holder', [
    mv('steam_turbine'), hull, '2x ' + motor, '2x ' + ks('balanced_rail_axle'), shield,
    '4x ' + stainless, 'gtceu:good_electronic_circuit', gt('stainless_steel_gearbox')
  ], 1640, lubricant, 1200, 384)
  upgrade('item_magnet', [
    mv('item_collector'), motor, '2x ' + winding, circuit, '2x ' + shield, '2x ' + cable,
    sensor, 'kubejs:woven_drive_belt'
  ], 1320, solder, 560, 384)

  upgrade('voltage_coil', [
    mv('voltage_coil'), '2x ' + winding, '4x ' + gt('gold_single_wire'), '2x ' + contact, shield,
    'gtceu:mv_voltage_coil', precision
  ], 960, solder, 650, 384)
  upgrade('diode', [
    mv('diode'), coil, '2x ' + gt('gold_single_wire'), '2x ' + contact, circuit, shield, control, seal
  ], 1020, solder, 550, 384)
  upgrade('battery_hull', [
    mv('battery_hull'), '4x ' + gt('battery_alloy_plate'), '2x ' + stainless, '2x ' + contact,
    '2x ' + seal, shield, 'kubejs:pressed_steel_frame'
  ], 1140, distilled, 700, 384)
  ;['sodium', 'cadmium', 'lithium'].forEach(chemistry => {
    const id = chemistry + '_battery'
    upgrade(id, [mv(id), hv('battery_hull'), '8x ' + gt(chemistry + '_dust'), '4x ' + gt('carbon_dust'),
      '2x ' + contact, coil, '2x ' + seal], 1560, acid, 900, 384)
  })
  const buffers = [[4, mv('battery_buffer_4x'), 'quadruple'], [8, '2x ' + hv('battery_buffer_4x'), 'octal'],
    [16, '2x ' + hv('battery_buffer_8x'), 'hex']]
  buffers.forEach(([cells, donor, width]) => {
    upgrade('battery_buffer_' + cells + 'x', [donor, hull, '4x ' + hv('battery_hull'), '2x ' + coil,
      '2x ' + gt('gold_' + width + '_cable'), 'gtceu:mv_battery_buffer_4x', '2x ' + shield, '2x ' + seal],
    1540 + 60 * cells, distilled, 650 + 50 * cells, 384)
  })
  upgrade('charger_4x', [
    mv('charger_4x'), hv('battery_buffer_4x'), '2x ' + coil, hull, '2x ' + circuit,
    pnc('charging_station'), 'gtceu:gold_single_cable', '2x ' + cable
  ], 1620, solder, 1000, 384)
  upgrade('power_unit', [
    mv('power_unit'), motor, hv('lithium_battery'), hv('battery_hull'), '2x ' + stainless,
    '2x ' + cable, '2x ' + seal, arm, shield
  ], 1480, lubricant, 950, 384)

  const gauges = ['single', 'double', 'quadruple', 'octal', 'hex']
  gauges.slice(1).forEach((width, index) => {
    const narrower = gt('gold_' + gauges[index])
    const wider = gt('gold_' + width)
    replace(wider + '_wire', 'draw_gold_' + width, ['2x ' + narrower + '_wire', '2x ' + contact,
      gt('gold_foil'), winding, gt('electrum_single_wire')], 580 + index * 150, 384, lubricant, 500 + index * 150)
    replace(wider + '_cable', 'insulate_gold_' + width, [wider + '_wire', '2x ' + narrower + '_cable',
      '2x ' + gt('polyethylene_plate'), '2x ' + seal, reinforcedTube],
    670 + index * 150, 384, lubricant, 600 + index * 150)
  })
  const transformers = [[1, mv('transformer_1a'), 'single'], [2, hv('transformer_1a'), 'double'],
    [4, hv('transformer_2a'), 'quadruple'], [16, hv('transformer_4a'), 'hex']]
  transformers.forEach(([amps, donor, width]) => {
    upgrade('transformer_' + amps + 'a', [donor, hull, '2x ' + coil, '2x ' + gt('gold_' + width + '_cable'),
      'kubejs:lunar_vacuum_seal', control, '2x ' + shield], 1270 + amps * 60, solder, 800 + amps * 40, 384)
  })
  const converters = [[1, 'transformer_1a', 'single'], [4, 'transformer_4a', 'quadruple'],
    [8, 'voltage_coil', 'octal'], [16, 'transformer_16a', 'hex']]
  converters.forEach(([amps, regulation, width]) => {
    const id = amps + 'a_energy_converter'
    upgrade(id, [mv(id), hull, '2x ' + winding, hv(regulation), '2x ' + shield, '2x ' + circuit,
      '2x ' + gt('gold_' + width + '_cable'), 'gtceu:gold_single_cable', pnc('charging_module')],
    1490 + amps * 60, solder, 850 + amps * 50, 384)
  })

  const fluidSizes = ['tiny', 'small', 'normal', 'large', 'huge', 'quadruple', 'nonuple']
  ;[['stainless_steel', 'aluminium'], ['gold', 'stainless_steel']].forEach(([material, previous], tier) => {
    const pipe = size => gt(material + '_' + size + '_fluid_pipe')
    fluidSizes.forEach((size, index) => {
      const prior = size === 'quadruple' ? 'normal' : fluidSizes[index - 1]
      const narrow = index === 0 ? gt(previous + '_tiny_fluid_pipe') : pipe(prior)
      const tooling = index > 4 ? hv('fluid_regulator') : 'gtceu:rod_extruder_mold'
      replace(pipe(size), material + '_' + size + '_fluid_pipe', [
        (index > 4 ? '4x ' : '2x ') + narrow, '3x ' + gt(material + '_plate'),
        '2x ' + seal, '2x ' + ks('iron_rivet'), reinforcedTube, tooling
      ], 720 + index * 135 + tier * 100, 384, lubricant, 600 + index * 150, index < 3 ? 2 : 1)
    })
  })
  const itemSizes = ['small', 'normal', 'large', 'huge']
  ;['electrum', 'rose_gold'].forEach(material => {
    const pipe = (size, restrictive) => gt(material + '_' + size + (restrictive ? '_restrictive' : '') + '_item_pipe')
    itemSizes.forEach((size, index) => {
      const narrow = index ? pipe(itemSizes[index - 1]) : gt('magnalium_small_item_pipe')
      replace(pipe(size), material + '_' + size + '_item_pipe', ['2x ' + narrow,
        '3x ' + gt(material + '_plate'), '2x ' + seal, conveyor, 'kubejs:woven_drive_belt', 'gtceu:lv_conveyor_module'],
      780 + index * 180, 384, lubricant, 650 + index * 150, index < 2 ? 2 : 1)
      replace(pipe(size, true), material + '_' + size + '_restrictive_item_pipe', [pipe(size),
        gt('magnalium_' + size + '_restrictive_item_pipe'), 'kubejs:woven_drive_belt', '2x ' + contact,
        '2x ' + seal, pnc('redstone_module')], 860 + index * 180, 384, lubricant, 750 + index * 150)
    })
  })
  replace(gt('stainless_steel_drum'), 'stainless_steel_drum', [gt('steel_drum'), '4x ' + stainless,
    gt('stainless_steel_normal_fluid_pipe'), '2x ' + seal, 'gtceu:steel_small_fluid_pipe', pnc('small_tank')],
  1240, 384, distilled, 800)
  replace(gt('stainless_steel_crate'), 'stainless_steel_crate', [gt('steel_crate'), '4x ' + stainless,
    gt('electrum_normal_item_pipe'), '2x ' + seal, 'gtceu:lv_conveyor_module', 'kubejs:woven_drive_belt'],
  1240, 384, lubricant, 800)
  replace(gt('stainless_steel_fluid_cell'), 'stainless_steel_fluid_cell', [gt('steel_fluid_cell'),
    '2x ' + stainless, reinforcedTube, seal, 'gtceu:steel_small_fluid_pipe'], 920, 384, distilled, 450)

  ;['steel', 'stainless_steel'].forEach(material => {
    const plate = gt(material + '_plate')
    replace(gt(material + '_gearbox'), material + '_gearbox', ['kubejs:gear_rim', '4x ' + plate,
      '2x ' + gt(material + '_gear'), '2x ' + ks('balanced_rail_axle'), precision, 'kubejs:pressed_steel_frame', seal],
    1320, 384, lubricant, 1000, 2)
    replace(gt(material + '_turbine_casing'), material + '_turbine_casing', [
      '4x ' + plate, gt(material + '_frame'), '2x ' + liner, shield, heavy, reinforcedTube
    ], 1140, 384, lubricant, 900, 2)
  })
  replace(gt('steam_large_turbine'), 'steam_large_turbine', [hv('steam_turbine'), hv('rotor_holder'),
    '4x ' + gt('steel_turbine_casing'), '2x ' + gt('steel_gearbox'), '2x ' + pump, '4x ' + circuit,
    'gtceu:steel_frame', 'gtceu:good_electronic_circuit', '4x ' + reinforcedTube],
  2300, 480, lubricant, 1800)
  event.remove({ id: 'gtceu:assembler/assemble_steel_turbine_blade' })
  const steelRotor = event.recipes.gtceu.assembler(prefix + 'balance_steam_rotor')
  ;['4x ' + gt('steel_turbine_blade'), '2x ' + ks('balanced_turbine_rotor'), '2x ' + ks('balanced_rail_axle'),
    '2x ' + gt('steel_rod'), sensor, pnc('turbine_rotor'), '2x ' + winding]
    .forEach(item => steelRotor.itemInputs(item))
  steelRotor.inputFluids(Fluid.of(lubricant, 1400))
    .itemOutputs(Item.of(gt('turbine_rotor'), '{"GT.PartStats":{Material:"gtceu:steel"}}')).duration(1940).EUt(480)

  event.remove({ output: 'gtceu:steel_quadruple_wire' })
  const spool = ks('hv_steel_coil_preform')
  replace(spool, 'ie_steel_coil_preform', ['4x ' + gt('steel_single_wire'), '2x ' + winding,
    '2x ' + stainless, precision, '2x ' + seal], 980, 384, lubricant, 700)
  event.recipes.gtceu.wiremill(prefix + 'wind_steel_bundle')
      .itemInputs(spool)
      .itemOutputs('gtceu:steel_quadruple_wire').duration(200).EUt(384)
  // Retain PneumaticCraft's compressor upgrade serializer so it transfers stored air and upgrades.
  ;[['air_compressor', 'advanced_air_compressor'], ['liquid_compressor', 'advanced_liquid_compressor']]
    .forEach(([previous, output]) => {
      event.remove({ id: pnc(output) })
      event.custom({
        type: pnc('compressor_upgrade_crafting'), category: 'misc',
        pattern: ['RGR', 'AWA', 'SCS'],
        key: {
          R: { item: reinforcedTube }, G: { item: regulator }, A: { item: 'gtceu:hv_voltage_coil' },
          W: { item: coil }, S: { item: shield }, C: { item: pnc(previous) }
        },
        result: { item: pnc(output) }
      }).id(prefix + output)
    })
  replace(pnc('flux_compressor'), 'flux_compressor', [pnc('advanced_air_compressor'), 'gtceu:hv_battery_buffer_4x',
    'gtceu:gold_single_cable', '2x ' + coil, '2x ' + pnc('turbine_rotor'), '2x ' + circuit,
    '2x ' + shield, '4x ' + reinforcedTube], 1720, 384, distilled, 1200)
  replace(pnc('electrostatic_compressor'), 'electrostatic_compressor', [pnc('advanced_air_compressor'),
    'minecraft:lightning_rod', 'gtceu:gold_single_cable', '2x ' + coil, '2x ' + shield, '2x ' + pnc('turbine_rotor'),
    '2x ' + circuit, '4x ' + reinforcedTube], 1720, 384, distilled, 1200)
  replace(pnc('solar_compressor'), 'solar_compressor', [pnc('advanced_air_compressor'), hv('solar_panel'),
    '3x ' + pnc('solar_cell'), 'gtceu:hv_battery_buffer_4x', '2x ' + shield, '2x ' + circuit, '4x ' + reinforcedTube],
  1720, 384, distilled, 1200)
})
