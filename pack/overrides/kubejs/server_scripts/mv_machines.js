ServerEvents.recipes(event => {
  const gt = name => 'gtceu:' + name
  const mv = name => gt('mv_' + name)
  const lv = name => gt('lv_' + name)
  const ks = name => 'kubejs:' + name

  const pnc = name => 'pneumaticcraft:' + name
  const prefix = 'zero_shift:mv_equipment/'

  const hull = mv('machine_hull')
  const motor = mv('electric_motor')
  const pump = mv('electric_pump')
  const piston = mv('electric_piston')
  const conveyor = mv('conveyor_module')
  const emitter = mv('emitter')
  const sensor = mv('sensor')
  const coil = mv('voltage_coil')
  const circuit = gt('good_electronic_circuit')
  const cable = gt('copper_single_cable')
  const wire = gt('copper_single_wire')
  const steel = gt('steel_plate')
  const aluminium = gt('aluminium_plate')
  const gasket = ks('pressure_gasket')
  const frame = ks('pressed_steel_frame')
  const liner = ks('furnace_lining_insert')
  const contact = ks('copper_contact_strip')
  const rivet = ks('iron_rivet')
  const tape = ks('pressed_insulation')
  const bushing = ks('shaft_bushing')
  const precision = 'gtceu:lv_robot_arm'
  const control = 'gtceu:basic_electronic_circuit'
  const steelComponent = 'kubejs:pressed_steel_frame'
  const heavyEngineering = 'gtceu:steel_frame'
  const pressureTube = pnc('pressure_tube')
  const pressureGauge = pnc('pressure_gauge')
  const safety = pnc('safety_tube_module')
  const regulator = pnc('regulator_tube_module')
  const distilled = gt('distilled_water')
  const lubricant = gt('lubricant')
  const water = 'minecraft:water'
  const polymer = gt('polyethylene_plate')
  const chemicalSeal = ks('chemical_grade_seal')

  function replace(output, inputs, ticks, fluid, amount, count, data) {
    event.remove({ output: output })
    const name = output.slice(output.indexOf(':') + 1)
    const recipe = event.recipes.gtceu.assembler(prefix + name)
    inputs.forEach(input => recipe.itemInputs(input))
    recipe.inputFluids(Fluid.of(fluid, amount))
    const result = data ? Item.of(output, data) : Item.of(output, count || 1)
    recipe.itemOutputs(result).duration(ticks).EUt(96)
  }
  function install(name, items, ticks, fluid, amount) {
    replace(mv(name), items.concat([hull, '2x ' + circuit, '2x ' + cable, '2x ' + gasket]),
      ticks, fluid, amount)
  }

  // The instruments can be built during the first steam-powered shift.
  replace(coil, [lv('voltage_coil'), '4x ' + wire, '2x ' + ks('wound_stator'), '2x ' + contact,
    '2x ' + tape, steelComponent, gasket], 620, water, 350)
  replace(emitter, [lv('emitter'), coil, '2x ' + contact, '2x ' + aluminium, circuit,
    precision, control, gasket], 790, water, 400)
  replace(sensor, [lv('sensor'), coil, pressureGauge, '2x ' + ks('glass_tube_blank'),
    '2x ' + contact, circuit, control, gasket], 820, water, 450)

  // The first upgrades leave the refinery free to provide distilled water and lubricant later.
  const machineShop = [
    ['electric_furnace', lv('electric_furnace'), coil, '2x ' + liner, steelComponent],
    ['alloy_smelter', gt('lp_steam_alloy_smelter'), coil, '2x ' + liner, heavyEngineering],
    ['forge_hammer', lv('forge_hammer'), piston, 'kubejs:forging_saddle', 'gtceu:plate_casting_mold'],
    ['compressor', lv('compressor'), piston, safety, '2x ' + steelComponent],
    ['extractor', lv('extractor'), pump, 'kubejs:hand_pump_barrel', pnc('pressure_chamber_valve')],
    ['forming_press', lv('forming_press'), piston, 'gtceu:gear_casting_mold', '2x ' + precision],
    ['cutter', lv('cutter'), piston, 'kubejs:saw_blade', '2x ' + ks('saw_teeth')],
    ['extruder', lv('extruder'), piston, 'gtceu:rod_extruder_mold', '2x ' + gt('double_steel_plate')],
    ['scanner', lv('scanner'), sensor, 'minecraft:compass', precision],
    ['laser_engraver', lv('laser_engraver'), emitter, '2x ' + ks('glass_tube_blank'), control],
    ['polarizer', lv('polarizer'), coil, '2x ' + ks('magnetic_armature'), precision],
    ['arc_furnace', lv('arc_furnace'), coil, '2x ' + liner, heavyEngineering],
    ['electromagnetic_separator', lv('electromagnetic_separator'), mv('polarizer'), sensor, '2x ' + tape],
    ['packer', lv('packer'), conveyor, 'kubejs:forging_saddle', 'kubejs:woven_drive_belt'],
    ['sifter', lv('sifter'), motor, 'kubejs:hearth_bellows', '2x ' + ks('strainer_mesh')],
    ['rock_crusher', lv('rock_crusher'), piston, 'kubejs:grinding_runner', '2x ' + steelComponent],
    ['block_breaker', lv('block_breaker'), piston, 'kubejs:grinding_runner', '2x ' + bushing],
    ['miner', lv('miner'), piston, 'gtceu:lv_electric_piston', ks('drill_seal_head')]
  ]
  machineShop.forEach(([name, previous, drive, tooling, housing], index) => {
    install(name, [previous, drive, tooling, housing], 880 + index * 25, water, 650)
  })
  install('bedrock_ore_miner', [mv('miner'), mv('macerator'), '2x ' + mv('robot_arm'),
    '2x ' + ks('drill_seal_head'), heavyEngineering], 1700, lubricant, 1100)

  const wetProcess = [
    ['ore_washer', lv('ore_washer'), pump, '2x ' + ks('strainer_mesh'), pnc('small_tank')],
    ['centrifuge', lv('centrifuge'), '2x ' + motor, '2x ' + ks('balanced_turbine_rotor'), precision],
    ['thermal_centrifuge', lv('thermal_centrifuge'), mv('centrifuge'), '2x ' + liner, ks('heat_exchange_core')],
    ['fluid_heater', lv('fluid_heater'), coil, '2x ' + ks('heater_ribbon'), ks('heat_exchange_core')],
    ['autoclave', lv('autoclave'), pump, pnc('pressure_chamber_valve'), pnc('pressure_chamber_interface')],
    ['fluid_solidifier', lv('fluid_solidifier'), pump, 'gtceu:bronze_small_fluid_pipe', 'gtceu:plate_casting_mold'],
    ['canner', lv('canner'), pump, 'kubejs:hand_pump_barrel', pnc('small_tank')],
    ['gas_collector', lv('gas_collector'), pump, 'kubejs:hearth_bellows', pressureGauge],
    ['air_scrubber', lv('air_scrubber'), mv('gas_collector'), '2x ' + ks('strainer_mesh'), safety],
    ['brewery', lv('brewery'), pump, 'gtceu:bronze_small_fluid_pipe', '2x ' + ks('glass_tube_blank')],
    ['fermenter', lv('fermenter'), mv('brewery'), 'gtceu:bronze_drum', pnc('small_tank')]
  ]
  wetProcess.forEach(([name, previous, drive, tooling, housing], index) => {
    install(name, [previous, drive, tooling, housing], 900 + index * 35, distilled, 500)
  })

  replace(mv('fluid_regulator'), [lv('fluid_regulator'), pump, regulator, '2x ' + pressureTube,
    circuit, '2x ' + gasket, aluminium], 860, water, 450)
  install('pump', [lv('pump'), pump, mv('fluid_regulator'), 'gtceu:lv_electric_pump'], 980, distilled, 550)
  install('input_bus', [lv('input_bus'), lv('conveyor_module'), 'minecraft:hopper', precision],
    840, water, 500)
  install('output_bus', [lv('output_bus'), lv('conveyor_module'), 'minecraft:hopper', precision],
    840, water, 500)
  install('energy_output_hatch', [lv('energy_output_hatch'), coil, control, '2x ' + contact],
    960, water, 550)
  install('muffler_hatch', [lv('muffler_hatch'), motor, 'kubejs:hearth_bellows', '2x ' + liner],
    920, distilled, 600)
  install('hermetic_casing', [lv('hermetic_casing'), mv('machine_casing'), '2x ' + steelComponent, chemicalSeal],
    980, lubricant, 550)
  install('item_passthrough_hatch', [mv('input_bus'), mv('output_bus'), conveyor, 'kubejs:woven_drive_belt'],
    1080, lubricant, 650)
  install('fluid_passthrough_hatch', [mv('input_hatch'), mv('output_hatch'), mv('fluid_regulator'), chemicalSeal],
    1120, lubricant, 650)
  install('fisher', [lv('fisher'), conveyor, 'kubejs:woven_drive_belt', '2x ' + bushing], 980, distilled, 550)
  install('item_collector', [lv('item_collector'), conveyor, sensor, 'gtceu:lv_conveyor_module'],
    980, lubricant, 550)
  install('buffer', [lv('buffer'), conveyor, 'kubejs:forging_saddle', 'kubejs:woven_drive_belt'], 950, lubricant, 550)
  install('super_chest', [lv('super_chest'), mv('buffer'), conveyor, 'gtceu:mv_sensor'],
    1160, lubricant, 600)
  install('super_tank', [lv('super_tank'), gt('steel_drum'), pump, pnc('reinforced_pressure_tube')],
    1180, lubricant, 650)
  install('world_accelerator', [lv('world_accelerator'), emitter, sensor, mv('field_generator')],
    1680, lubricant, 1000)
  install('gas_turbine', [lv('gas_turbine'), mv('steam_turbine'), mv('gas_collector'),
    '2x ' + ks('balanced_turbine_rotor'), ks('heat_exchange_core')], 1540, lubricant, 950)

  replace(mv('battery_hull'), [lv('battery_hull'), '2x ' + gt('battery_alloy_plate'), '2x ' + aluminium,
    '2x ' + contact, '2x ' + tape, circuit, gasket], 800, water, 500)
  ;['sodium', 'lithium', 'cadmium'].forEach(metal => {
    replace(mv(metal + '_battery'), [mv('battery_hull'), lv(metal + '_battery'), '4x ' + gt(metal + '_dust'),
      '2x ' + gt('carbon_dust'), '2x ' + tape, contact, gasket], 900, distilled, 500)
  })
  replace(mv('battery_buffer_4x'), [lv('battery_buffer_4x'), hull, '4x ' + mv('battery_hull'), coil,
    '2x ' + circuit, '2x ' + gt('copper_quadruple_cable'), '2x ' + contact, '2x ' + gasket], 1160, distilled, 650)
  replace(mv('battery_buffer_8x'), ['2x ' + mv('battery_buffer_4x'), '2x ' + coil, '2x ' + circuit,
    '2x ' + gt('copper_octal_cable'), '2x ' + polymer, '2x ' + chemicalSeal, heavyEngineering],
    1460, lubricant, 850)
  replace(mv('battery_buffer_16x'), ['2x ' + mv('battery_buffer_8x'), '4x ' + coil, '4x ' + circuit,
    '2x ' + gt('copper_hex_cable'), '4x ' + polymer, '4x ' + chemicalSeal, '2x ' + heavyEngineering],
    1840, lubricant, 1100)
  install('charger_4x', [lv('charger_4x'), mv('battery_buffer_4x'), '2x ' + coil,
    pnc('charging_station'), '2x ' + contact], 1280, distilled, 600)

  // A newly made tool inherits the 360 kEU capacity of its specified sodium cell.
  const charge = '{MaxCharge:360000L}'
  replace(mv('power_unit'), [lv('power_unit'), motor, mv('sodium_battery'), '2x ' + polymer,
    '2x ' + chemicalSeal, '2x ' + cable, frame, precision], 1180, lubricant, 700, 1, charge)
  replace(mv('diode'), [lv('diode'), coil, '2x ' + wire, '2x ' + contact, circuit, control, gasket],
    680, water, 450)
  replace(mv('solar_panel'), [lv('solar_panel'), emitter, '2x ' + mv('battery_hull'), '2x ' + gt('silicon_plate'),
    '4x minecraft:glass_pane', '2x ' + contact, '2x ' + circuit, '2x ' + polymer, chemicalSeal],
    1340, lubricant, 850)

  const widths = ['single', 'double', 'quadruple', 'octal', 'hex']
  const annealed = gt('annealed_copper_single_wire')
  replace(annealed, ['2x ' + gt('annealed_copper_plate'), '2x ' + wire, contact, 'kubejs:turned_spindle', steelComponent],
    460, distilled, 350, 2)
  replace(gt('annealed_copper_single_cable'), ['2x ' + annealed, '2x ' + tape, polymer, chemicalSeal,
    '2x ' + ks('fibre_cord')], 540, lubricant, 350, 2)
  ;['copper', 'annealed_copper'].forEach(material => {
    widths.slice(1).forEach((width, index) => {
      const smaller = gt(material + '_' + widths[index])
      const wider = gt(material + '_' + width)
      const coolant = index > 1 ? lubricant : water
      const insulator = index > 1 ? polymer : tape
      const seal = index > 1 ? chemicalSeal : gasket
      replace(wider + '_wire', ['2x ' + smaller + '_wire', '2x ' + contact, gt(material + '_foil'),
        steelComponent], 390 + index * 100, coolant, 350 + index * 100)
      replace(wider + '_cable', [wider + '_wire', '2x ' + smaller + '_cable', '2x ' + insulator,
        '2x ' + ks('fibre_cord'), seal], 470 + index * 140, coolant, 400 + index * 150)
    })
  })

  const transformers = [
    [1, lv('transformer_1a'), 'single'],
    [2, mv('transformer_1a'), 'double'],
    [4, mv('transformer_2a'), 'quadruple'],
    [16, mv('transformer_4a'), 'hex']
  ]
  transformers.forEach(([amps, previous, width]) => {
    install('transformer_' + amps + 'a', [previous, '2x ' + coil, '2x ' + gt('copper_' + width + '_wire'),
      control, steelComponent], 850 + amps * 55, amps > 4 ? lubricant : water, 550 + amps * 25)
  })
  ;[[4, 1, 'quadruple'], [8, 4, 'octal'], [16, 8, 'hex']].forEach(([amps, prior, width]) => {
    install(amps + 'a_energy_converter', [mv(prior + 'a_energy_converter'), '2x ' + coil,
      '2x ' + gt('copper_' + width + '_cable'), '2x ' + heavyEngineering, precision],
      1100 + amps * 55, lubricant, 650 + amps * 25)
  })

  const pipeSizes = ['tiny', 'small', 'normal', 'large', 'huge', 'quadruple', 'nonuple']
  const stock = ['bronze', 'steel']
  ;['steel', 'aluminium'].forEach((material, tier) => {
    const item = size => gt(material + '_' + size + '_fluid_pipe')
    pipeSizes.forEach((size, index) => {
      const prior = size === 'quadruple' ? 'normal' : pipeSizes[index - 1]
      const narrow = index === 0 ? gt(stock[tier] + '_tiny_fluid_pipe') : item(prior)
      const seal = tier > 0 || index > 2 ? chemicalSeal : gasket
      const coolant = tier > 0 || index > 2 ? lubricant : water
      const insert = index > 4 ? pnc('reinforced_pressure_tube') : pressureTube
      replace(item(size), [(index > 4 ? '4x ' : '2x ') + narrow, '3x ' + gt(material + '_plate'),
        '2x ' + seal, '2x ' + rivet, insert, 'gtceu:rod_extruder_mold'], 480 + index * 120 + tier * 100,
        coolant, 350 + index * 100, index < 3 ? 2 : 1)
    })
  })

  const itemSizes = ['small', 'normal', 'large', 'huge']
  itemSizes.forEach((size, index) => {
    const pipe = gt('magnalium_' + size + '_item_pipe')
    const narrow = index === 0 ? gt('tin_small_item_pipe') : gt('magnalium_' + itemSizes[index - 1] + '_item_pipe')
    replace(pipe, ['2x ' + narrow, '3x ' + gt('magnalium_plate'), '2x ' + rivet, '2x ' + tape,
      conveyor, steelComponent], 520 + index * 120, lubricant, 350 + index * 100, index < 2 ? 2 : 1)
    replace(gt('magnalium_' + size + '_restrictive_item_pipe'), [
      pipe, gt('tin_' + size + '_restrictive_item_pipe'), 'kubejs:woven_drive_belt', '2x ' + contact,
      polymer, chemicalSeal
    ], 620 + index * 120, lubricant, 450 + index * 100)
  })

  const items = Java.loadClass('net.minecraftforge.registries.ForgeRegistries').ITEMS
  const Id = Java.loadClass('net.minecraft.resources.ResourceLocation')
  items.getKeys().forEach(key => {
    const output = String(key)
    const match = /^gtceu:mv_(.+)_drill$/.exec(output)
    if (!match) return
    const head = match[1] === 'netherite' ? 'minecraft:netherite_ingot' : gt(match[1] + '_drill_head')
    if (!items.containsKey(new Id(head))) return
    replace(output, [head, mv('power_unit'), piston, '2x ' + polymer, '2x ' + chemicalSeal,
      '2x ' + steel, '2x ' + rivet, precision], 1320, lubricant, 850, 1, charge)
  })
})
