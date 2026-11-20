ServerEvents.recipes(event => {
  const gt = name => 'gtceu:' + name
  const lv = name => gt('lv_' + name)
  const ks = name => 'kubejs:' + name

  const mc = name => 'minecraft:' + name
  const prefix = 'zero_shift:lv_equipment/'

  const hull = lv('machine_hull')
  const motor = lv('electric_motor')
  const piston = lv('electric_piston')
  const pump = lv('electric_pump')
  const conveyor = lv('conveyor_module')
  const robot = lv('robot_arm')
  const emitter = lv('emitter')
  const sensor = lv('sensor')
  const coil = lv('voltage_coil')
  const contact = ks('copper_contact_strip')
  const insulation = ks('pressed_insulation')
  const blank = ks('stamped_bronze_blank')
  const seal = ks('sealed_boiler_joint')
  const frame = ks('pressed_steel_frame')
  const bushing = ks('shaft_bushing')
  const rivet = ks('iron_rivet')
  const plate = gt('iron_plate')
  const steel = gt('steel_plate')
  const bronze = gt('bronze_plate')
  const tin = gt('tin_plate')
  const cable = gt('tin_single_cable')
  const wire = gt('tin_single_wire')
  const circuit = gt('basic_electronic_circuit')
  const water = mc('water')
  const treatedWood = 'gtceu:treated_wood_planks'
  const steelComponent = 'kubejs:pressed_steel_frame'

  function replace(output, inputs, ticks, amount, power, count, data) {
    event.remove({ output: output })
    const id = output.slice(output.indexOf(':') + 1)
    const recipe = event.recipes.gtceu.assembler(prefix + id)
    inputs.forEach(input => recipe.itemInputs(input))
    recipe.inputFluids(Fluid.of(water, amount))
    const result = data ? Item.of(output, data) : Item.of(output, count || 1)
    recipe.itemOutputs(result).duration(ticks).EUt(power || 28)
  }

  replace(piston, [motor, '2x ' + 'kubejs:turned_spindle', '2x ' + bushing, '2x ' + plate, '2x ' + cable, blank, seal],
    420, 250, 24)
  replace(pump, [motor, 'kubejs:hand_pump_barrel', '2x ' + gt('bronze_small_fluid_pipe'), '2x ' + bronze,
    '2x ' + insulation, seal, cable], 480, 350, 24)
  replace(coil, ['4x ' + wire, '2x ' + ks('wound_stator'), '2x ' + contact, '2x ' + insulation, blank],
    440, 250, 24)
  replace(robot, [motor, piston, conveyor, '2x ' + steel, '2x ' + contact, circuit, frame], 680, 500)
  replace(lv('fluid_regulator'), [pump, 'kubejs:gear_rim', '2x ' + insulation, circuit, frame, seal],
    620, 450)
  replace(emitter, [coil, '2x ' + contact, '2x ' + gt('copper_plate'), circuit, frame, '2x ' + cable],
    600, 450)
  replace(sensor, [coil, '2x ' + contact, '2x minecraft:glass_pane', circuit, frame, 'kubejs:woven_drive_belt'],
    650, 450)
  replace(lv('field_generator'), ['2x ' + emitter, '2x ' + sensor, '2x ' + circuit, '2x ' + steel, frame,
    '4x ' + cable, '2x ' + insulation], 1180, 800)

  const steamUpgrades = [
    ['electric_furnace', 'furnace', motor, ks('fired_lining')],
    ['macerator', 'macerator', piston, 'kubejs:grinding_runner'],
    ['forge_hammer', 'forge_hammer', piston, 'kubejs:forging_saddle'],
    ['compressor', 'compressor', piston, 'kubejs:forging_saddle'],
    ['extractor', 'extractor', pump, 'kubejs:gear_rim']
  ]
  steamUpgrades.forEach(([name, old, actuator, tooling]) => {
    replace(lv(name), [gt('lp_steam_' + old), hull, actuator, tooling, circuit, '2x ' + plate, '2x ' + cable, seal],
      680, 500, 24)
  })

  function fitMachine(name, parts, ticks) {
    replace(lv(name), [hull, frame, '2x ' + circuit, '2x ' + cable, seal].concat(parts), ticks || 900, 600)
  }

  const manufacturing = [
    ['bender', [piston, '2x ' + steel, 'kubejs:forging_saddle']],
    ['forming_press', [piston, lv('compressor'), 'kubejs:forging_saddle']],
    ['wiremill', [motor, '2x ' + bushing, 'kubejs:woven_drive_belt']],
    ['lathe', [piston, 'kubejs:turned_spindle', '2x ' + gt('steel_rod')]],
    ['cutter', [piston, '2x ' + ks('saw_teeth'), 'kubejs:saw_blade']],
    ['extruder', [piston, '2x ' + steel, lv('forge_hammer')]],
    ['circuit_assembler', [robot, '2x ' + contact, 'gtceu:basic_electronic_circuit']],
    ['scanner', [sensor, 'minecraft:compass', '2x minecraft:glass_pane']],
    ['laser_engraver', [emitter, '2x ' + gt('gold_plate'), '2x minecraft:glass_pane']],
    ['polarizer', [coil, '2x ' + ks('magnetic_armature'), '2x ' + steel]],
    ['arc_furnace', [coil, steelComponent, '2x ' + ks('furnace_lining_insert')]],
    ['electromagnetic_separator', [coil, lv('polarizer'), '2x ' + insulation]],
    ['packer', [conveyor, 'minecraft:hopper', '2x ' + treatedWood]],
    ['sifter', [motor, '2x ' + ks('strainer_mesh'), 'minecraft:hopper']],
    ['rock_crusher', [piston, gt('lp_steam_rock_crusher'), '2x ' + steel]],
    ['block_breaker', [piston, 'kubejs:grinding_runner', '2x ' + bushing]],
    ['miner', [piston, gt('lp_steam_miner'), lv('macerator')]]
  ]
  manufacturing.forEach(([name, parts]) => fitMachine(name, parts))

  const processEquipment = [
    ['ore_washer', [pump, 'kubejs:hearth_bellows', '2x ' + ks('strainer_mesh')]],
    ['chemical_bath', [pump, 'kubejs:fired_crucible', '2x ' + ks('strainer_mesh')]],
    ['mixer', [motor, 'kubejs:turned_spindle', 'kubejs:fired_crucible']],
    ['centrifuge', [motor, '2x ' + gt('bronze_rotor'), '2x ' + bushing]],
    ['thermal_centrifuge', [lv('centrifuge'), coil, '2x ' + ks('furnace_lining_insert')]],
    ['electrolyzer', [emitter, '2x ' + contact, 'gtceu:bronze_drum']],
    ['fluid_heater', [coil, 'gtceu:bronze_small_fluid_pipe', '2x ' + ks('furnace_lining_insert')]],
    ['distillery', [pump, lv('fluid_heater'), 'gtceu:bronze_drum']],
    ['chemical_reactor', [pump, lv('mixer'), '2x ' + gt('bronze_small_fluid_pipe')]],
    ['autoclave', [pump, lv('compressor'), '2x ' + gt('double_steel_plate')]],
    ['fluid_solidifier', [pump, 'gtceu:bronze_small_fluid_pipe', '2x ' + bronze]],
    ['canner', [pump, 'kubejs:hand_pump_barrel', '2x ' + tin]],
    ['gas_collector', [pump, 'kubejs:hearth_bellows', 'gtceu:bronze_drum']],
    ['air_scrubber', [lv('gas_collector'), 'kubejs:woven_drive_belt', '2x ' + ks('strainer_mesh')]],
    ['brewery', [pump, 'gtceu:bronze_small_fluid_pipe', '2x minecraft:glass_bottle']],
    ['fermenter', [lv('brewery'), 'gtceu:bronze_drum', '2x ' + treatedWood]]
  ]
  processEquipment.forEach(([name, parts]) => fitMachine(name, parts))

  const logistics = [
    ['pump', [pump, 'gtceu:bronze_small_fluid_pipe', lv('fluid_regulator')]],
    ['fisher', [conveyor, '2x minecraft:fishing_rod', 'kubejs:woven_drive_belt']],
    ['world_accelerator', [emitter, sensor, lv('field_generator')]],
    ['item_collector', [conveyor, 'minecraft:hopper', 'kubejs:woven_drive_belt']],
    ['buffer', [conveyor, 'kubejs:forging_saddle', '2x ' + treatedWood]],
    ['super_chest', [lv('buffer'), '2x minecraft:chest', 'kubejs:woven_drive_belt']],
    ['super_tank', [pump, gt('bronze_drum'), '2x ' + gt('bronze_normal_fluid_pipe')]],
    ['item_passthrough_hatch', [conveyor, lv('input_bus'), lv('output_bus')]],
    ['fluid_passthrough_hatch', [pump, lv('input_hatch'), lv('output_hatch')]],
    ['hermetic_casing', [lv('machine_casing'), '2x ' + seal, '2x ' + insulation]],
    ['energy_output_hatch', [coil, lv('energy_input_hatch'), 'gtceu:basic_electronic_circuit']]
  ]
  logistics.forEach(([name, parts]) => fitMachine(name, parts, 740))

  fitMachine('combustion', [lv('steam_turbine'), pump, '2x ' + ks('furnace_lining_insert')], 1280)
  fitMachine('gas_turbine', [lv('steam_turbine'), lv('gas_collector'), '2x ' + gt('steel_rotor')], 1280)

  replace(lv('battery_hull'), ['2x ' + tin, '2x ' + insulation, '2x ' + contact, '2x ' + treatedWood, circuit, rivet],
    460, 350)
  const batteryMetals = ['sodium', 'lithium', 'cadmium']
  batteryMetals.forEach(material => {
    replace(lv(material + '_battery'), [lv('battery_hull'), '2x ' + gt(material + '_dust'), gt('carbon_dust'),
      '2x ' + insulation, contact, seal], 600, 450)
  })
  replace(lv('battery_buffer_4x'), [hull, '4x ' + lv('battery_hull'), coil, frame, '2x ' + circuit,
    '2x ' + cable, ks('lv_line_contactor')], 920, 600)
  replace(lv('battery_buffer_8x'), ['2x ' + lv('battery_buffer_4x'), coil, '2x ' + frame, '2x ' + circuit,
    '2x ' + gt('tin_double_cable'), '2x ' + contact], 1080, 800)
  replace(lv('battery_buffer_16x'), ['2x ' + lv('battery_buffer_8x'), '2x ' + coil, '2x ' + frame, '2x ' + circuit,
    '2x ' + gt('tin_quadruple_cable'), '4x ' + contact], 1300, 1000)
  fitMachine('charger_4x', [lv('battery_buffer_4x'), coil, '2x ' + contact], 960)
  replace(lv('power_unit'), [motor, lv('sodium_battery'), '2x ' + insulation, '2x ' + steel, '2x ' + cable, frame],
    740, 600, 28, 1, '{MaxCharge:80000L}')
  fitMachine('item_magnet', [lv('power_unit'), '2x ' + ks('magnetic_armature'), sensor], 800)
  replace(lv('diode'), [coil, '2x ' + wire, '2x ' + insulation, circuit, 'gtceu:basic_electronic_circuit', '2x ' + contact],
    560, 400)
  replace(lv('solar_panel'), [emitter, '2x ' + lv('battery_hull'), '4x minecraft:glass_pane', '2x ' + contact,
    '2x ' + treatedWood, '2x ' + circuit, frame], 1120, 750)

  const transformers = [
    [1, lv('1a_energy_converter'), cable],
    [2, lv('transformer_1a'), gt('tin_double_cable')],
    [4, lv('transformer_2a'), gt('tin_quadruple_cable')],
    [16, lv('transformer_4a'), gt('tin_hex_cable')]
  ]
  transformers.forEach(([amps, predecessor, lead]) => {
    replace(lv('transformer_' + amps + 'a'), [predecessor, hull, coil, '2x ' + circuit, '2x ' + lead,
      'gtceu:basic_electronic_circuit', frame], 820 + amps * 45, 550 + amps * 25)
  })
  ;[
    [4, lv('1a_energy_converter'), gt('tin_quadruple_cable')],
    [8, lv('4a_energy_converter'), gt('tin_octal_cable')],
    [16, lv('8a_energy_converter'), gt('tin_hex_cable')]
  ].forEach(([amps, predecessor, lead]) => {
    replace(lv(amps + 'a_energy_converter'), [predecessor, coil, '2x ' + lead, '2x ' + circuit, steelComponent, frame],
      840 + amps * 45, 600 + amps * 25)
  })

  const cableWidths = ['single', 'double', 'quadruple', 'octal', 'hex']
  const conductorMaterials = ['tin', 'nickel', 'cobalt']
  conductorMaterials.forEach(material => {
    const single = material + '_single'
    if (material !== 'tin') {
      replace(gt(single + '_wire'), ['2x ' + gt(material + '_plate'), '2x ' + contact, gt('tin_foil'),
        'kubejs:turned_spindle'], 340, 250, 24, 2)
      replace(gt(single + '_cable'), [gt(single + '_wire'), '2x ' + insulation, ks('fibre_cord'),
        '2x ' + contact], 380, 300)
    }
    cableWidths.slice(1).forEach((width, index) => {
      const narrower = material + '_' + cableWidths[index]
      const wider = material + '_' + width
      replace(gt(wider + '_wire'), ['2x ' + gt(narrower + '_wire'), '2x ' + contact, gt('tin_foil')],
        220 + index * 60, 150, 24)
      replace(gt(wider + '_cable'), [gt(wider + '_wire'), '2x ' + gt(narrower + '_cable'),
        '2x ' + insulation, '2x ' + ks('fibre_cord'), treatedWood], 300 + index * 80, 250)
    })
  })

  const pipeSizes = ['small', 'normal', 'large', 'huge']
  pipeSizes.forEach((size, index) => {
    const pipe = gt('tin_' + size + '_item_pipe')
    // The normal pipe already has its own recipe in yard logistics.
    if (size === 'small') {
      replace(pipe, ['2x ' + tin, '2x ' + rivet, insulation, 'minecraft:hopper', bushing], 300, 200, 24, 2)
    } else if (size !== 'normal') {
      const narrower = gt('tin_' + pipeSizes[index - 1] + '_item_pipe')
      replace(pipe, ['2x ' + narrower, '2x ' + tin, '2x ' + rivet, insulation, treatedWood], 380 + index * 60, 400)
    }
    replace(gt('tin_' + size + '_restrictive_item_pipe'), [pipe, 'kubejs:woven_drive_belt', '2x ' + contact, '2x ' + insulation,
      '2x ' + tin], 380 + index * 80, 350)
  })

  const toolHeads = {
    drill: ['drill_head', piston],
    chainsaw: ['chainsaw_head', 'kubejs:saw_blade'],
    wrench: ['wrench_tip', gt('small_steel_gear')],
    screwdriver: ['screwdriver_tip', coil],
    wire_cutter: ['wire_cutter_head', contact]
  }
  const items = Java.loadClass('net.minecraftforge.registries.ForgeRegistries').ITEMS
  const Id = Java.loadClass('net.minecraft.resources.ResourceLocation')
  items.getKeys().forEach(key => {
    const output = String(key)
    const match = /^gtceu:lv_(.+)_(drill|chainsaw|wrench|screwdriver|wire_cutter)$/.exec(output)
    if (!match) return
    const [headSuffix, mechanism] = toolHeads[match[2]]
    const head = match[1] === 'netherite'
      ? mc('netherite_ingot')
      : gt(match[1] + '_' + headSuffix)
    if (!items.containsKey(new Id(head))) return
    replace(output, [head, lv('power_unit'), mechanism, '2x ' + insulation, '2x ' + steel,
      '2x ' + rivet, frame], 950, 600, 28, 1, '{MaxCharge:80000L}')
  })
})
