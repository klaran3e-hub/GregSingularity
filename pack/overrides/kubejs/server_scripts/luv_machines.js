ServerEvents.recipes(event => {
  const gt = id => 'gtceu:' + id
  const iv = id => gt('iv_' + id)
  const luv = id => gt('luv_' + id)
  const prefix = 'zero_shift:luv_machines/'
  const plate = gt('rhodium_plated_palladium_plate')
  const cable = gt('niobium_titanium_single_cable')
  const clock = 'kubejs:luv_clock_matrix'
  const laminate = 'kubejs:luv_dielectric_laminate'
  const optic = 'kubejs:luv_optical_core'
  const busbar = 'kubejs:luv_busbar'
  const circuit = gt('nano_processor_mainframe')
  const casing = luv('machine_casing')
  const hull = luv('machine_hull')
  const motor = luv('electric_motor')
  const piston = luv('electric_piston')
  const pump = luv('electric_pump')
  const conveyor = luv('conveyor_module')
  const robot = luv('robot_arm')
  const emitter = luv('emitter')
  const sensor = luv('sensor')
  const field = luv('field_generator')
  const arm = 'create:mechanical_arm'
  const relay = 'immersiveengineering:connector_hv_relay'
  const tube = 'pneumaticcraft:advanced_pressure_tube'
  const gauge = 'pneumaticcraft:pressure_gauge_module'
  const safety = 'pneumaticcraft:safety_tube_module'

  function tier(id, items, ticks, power) {
    const output = luv(id)
    event.remove({ output: output })
    const recipe = event.recipes.gtceu.assembler(prefix + id)
    items.forEach(item => recipe.itemInputs(item))
    return recipe.itemOutputs(output).duration(ticks).EUt(power)
      .inputFluids(Fluid.of(gt('lubricant'), power > 8192 ? 2000 : 1450))
  }

  tier('machine_casing', [iv('machine_casing'), '6x ' + plate, '4x gtceu:hssg_plate', '2x ' + laminate,
    '2x kubejs:iv_arc_plate', '4x kubejs:vacuum_gasket', '2x immersiveengineering:steel_scaffolding_standard'], 2400, 7360)
  tier('machine_hull', [iv('machine_hull'), casing, '2x ' + clock, '2x ' + busbar,
    '4x ' + cable, '2x ' + circuit, '4x ' + laminate], 2600, 7680)
  tier('electric_motor', [iv('electric_motor'), '2x kubejs:iv_servo_core', '4x ' + plate,
    '2x ' + circuit, '4x ' + cable, '2x ' + busbar, '2x immersiveengineering:wirecoil_electrum_ins'], 2400, 7360)
  tier('electric_pump', [iv('electric_pump'), motor, '2x kubejs:iv_cooling_jacket',
    '4x ' + plate, '2x ' + laminate, '2x ' + cable, '4x kubejs:vacuum_gasket', tube, safety], 2480, 7360)
  tier('electric_piston', [iv('electric_piston'), motor, '2x kubejs:iv_servo_core', '4x ' + plate,
    '4x gtceu:hssg_plate', '2x ' + cable, '2x ' + laminate, '2x create:precision_mechanism', tube], 2480, 7360)
  tier('conveyor_module', [iv('conveyor_module'), '2x ' + motor, '2x ' + busbar,
    '4x ' + plate, '4x ' + laminate, '2x ' + cable, '2x create:brass_funnel', '2x immersiveengineering:conveyor_basic'], 2520, 7680)
  tier('robot_arm', [iv('robot_arm'), motor, piston, '2x ' + clock, '2x ' + circuit,
    '4x ' + plate, '2x ' + cable, arm, gauge], 2900, 7680)
  tier('emitter', [iv('emitter'), '2x ' + optic, '2x ' + clock, '2x ' + circuit,
    '4x ' + plate, '2x ' + cable], 2600, 7680)
  tier('sensor', [iv('sensor'), '2x ' + optic, '2x ' + circuit, '4x gtceu:platinum_plate',
    '4x ' + cable, '2x ' + laminate], 2600, 7680)
  tier('field_generator', [iv('field_generator'), '2x ' + emitter, '4x ' + busbar,
    '4x ' + circuit, '4x ' + clock, '4x ' + plate, '4x ' + laminate, '2x ' + relay, '2x ' + safety], 4020, 28672)
  tier('assembler', [iv('assembler'), hull, '2x ' + robot, '2x ' + conveyor,
    '4x ' + circuit, '4x ' + clock, '4x ' + cable, '4x ' + laminate, arm], 3300, 8000)
  tier('circuit_assembler', [iv('circuit_assembler'), hull, '2x ' + emitter, '2x ' + sensor,
    '4x ' + circuit, '4x ' + optic, '2x ' + busbar], 3420, 8000)

  ;['input', 'output'].forEach(side => {
    const energy = 'energy_' + side + '_hatch'
    const fluid = side + '_hatch'
    tier(energy, ['2x ' + iv(energy), hull, '2x ' + busbar, '2x ' + circuit,
      '4x ' + cable, '4x ' + laminate, '2x ' + relay, safety], 2700, 7680)
    tier(energy + '_4a', [iv(energy + '_4a'), '2x ' + luv(energy), '4x ' + busbar,
      '4x ' + gt('niobium_titanium_quadruple_cable'), '4x ' + clock, '4x ' + laminate], 3340, 8000)
    tier(energy + '_16a', [iv(energy + '_16a'), '4x ' + luv(energy + '_4a'), '8x ' + busbar,
      '4x ' + gt('niobium_titanium_hex_cable'), '8x ' + clock, '8x ' + laminate], 3900, 28672)
    tier(fluid, [iv(fluid), hull, '2x ' + pump, '2x kubejs:iv_cooling_jacket',
      '4x ' + plate, '4x kubejs:vacuum_gasket', '2x ' + tube, gauge], 2600, 7680)
    ;[4, 9].forEach(ports => {
      const id = fluid + '_' + ports + 'x'
      tier(id, [iv(id), ports + 'x ' + luv(fluid), '2x ' + pump,
        '4x ' + plate, '4x ' + laminate, '4x ' + circuit], 2500 + 130 * ports, 22528)
    })
    tier('dual_' + side + '_hatch', ['2x ' + iv(side + '_bus'), '2x ' + luv(fluid), hull,
      '2x ' + conveyor, '4x ' + plate, '4x ' + clock, '4x ae2:cell_component_64k'], 3400, 24576)
    tier('substation_' + side + '_hatch_64a', [iv('substation_' + side + '_hatch_64a'), '4x ' + luv(energy + '_16a'),
      '4x ' + luv('transformer_16a'), '8x ' + busbar, '8x ' + gt('niobium_titanium_hex_cable'), '8x ' + circuit], 4800, 31000)
  })

  const devices = [
    [pump, tube, gauge, ['autoclave', 'brewery', 'canner', 'chemical_bath', 'chemical_reactor', 'distillery', 'electrolyzer',
      'extractor', 'fermenter', 'fisher', 'fluid_heater', 'fluid_passthrough_hatch', 'fluid_regulator',
      'fluid_solidifier', 'gas_collector', 'ore_washer']],
    [piston, 'create:mechanical_press', safety, ['bender', 'compressor', 'cutter', 'extruder', 'forge_hammer', 'forming_press', 'lathe', 'macerator',
      'rock_crusher', 'wiremill']],
    [motor, 'create:rotation_speed_controller', safety, ['centrifuge', 'mixer', 'rotor_holder', 'sifter', 'thermal_centrifuge']],
    [busbar, relay, safety, ['alloy_smelter', 'arc_furnace', 'electric_furnace', 'hermetic_casing', 'muffler_hatch']],
    [conveyor, 'create:smart_chute', 'immersiveengineering:conveyor_basic', ['input_bus', 'item_passthrough_hatch', 'output_bus', 'packer']],
    [emitter, 'create:content_observer', relay, ['electromagnetic_separator', 'laser_engraver', 'polarizer', 'world_accelerator']],
    [sensor, 'create:content_observer', gauge, ['scanner', 'solar_panel']],
    [clock, relay, safety, ['battery_hull', 'charger_4x', 'diode', 'voltage_coil', 'battery_buffer_4x', 'battery_buffer_8x',
      'battery_buffer_16x', 'transformer_1a', 'transformer_2a', 'transformer_4a', 'transformer_16a']]
  ]
  devices.forEach(([component, interfacePart, controlPart, family]) => {
    family.forEach(id => {
      tier(id, [iv(id), hull, '2x ' + component, '4x ' + plate, '2x ' + circuit,
        '4x ' + cable, '4x ' + laminate, interfacePart, controlPart], 2850, 22528)
    })
  })

  ;[[1, 'transformer_1a'], [4, 'transformer_4a'], [8, 'voltage_coil'], [16, 'transformer_16a']].forEach(([amps, core]) => {
    const id = amps + 'a_energy_converter'
    tier(id, [iv(id), luv(core), hull, amps + 'x ' + busbar, amps + 'x ' + cable,
      '4x ' + clock, '4x ' + circuit], 2400 + 105 * amps, 28672)
  })
  ;[['source', emitter, 'energy_output_hatch_16a'], ['target', sensor, 'energy_input_hatch_16a']].forEach(([side, optics, hatch]) => {
    const low = '256a_laser_' + side + '_hatch'
    const middle = '1024a_laser_' + side + '_hatch'
    const high = '4096a_laser_' + side + '_hatch'
    tier(low, [iv(low), luv(hatch), '2x ' + field, '4x ' + optics, '8x ' + optic, '4x ' + clock, '4x ' + circuit], 3600, 28672)
    tier(middle, [iv(middle), '4x ' + luv(low), '4x ' + optics, '8x ' + optic, '8x ' + busbar, '8x ' + circuit], 4400, 30720)
    tier(high, [iv(high), '4x ' + luv(middle), '4x ' + field, '16x ' + optic, '16x ' + clock, '16x ' + circuit], 5200, 32000)
  })

  tier('parallel_hatch', [iv('parallel_hatch'), hull, '4x ' + robot, '4x ' + clock, '4x ' + circuit,
    '4x ae2:pattern_provider', '4x ' + cable], 3500, 27648)
  tier('quantum_chest', [iv('quantum_chest'), hull, '2x ' + conveyor, '4x ' + clock, '4x ' + circuit,
    '2x ae2:item_storage_cell_256k', '2x ae2:storage_bus'], 3500, 27648)
  tier('quantum_tank', [iv('quantum_tank'), hull, '2x ' + pump, '4x ' + laminate, '4x ' + circuit,
    '2x ae2:fluid_storage_cell_256k', '2x ae2:storage_bus'], 3580, 27648)
  tier('large_miner', [iv('large_miner'), hull, '4x ' + piston, '4x ' + pump, '8x gtceu:robust_machine_casing',
    '4x ' + circuit, '8x ' + cable, '4x ' + clock], 4080, 30720)
  tier('lapotronic_battery', ['4x ' + iv('lapotronic_battery'), luv('battery_hull'), '8x ' + plate,
    '4x ' + clock, '4x ' + circuit, '8x ' + busbar, '4x ' + laminate], 3800, 28672)
  tier('vanadium_battery', ['2x ' + iv('vanadium_battery'), luv('battery_hull'), '8x gtceu:vanadium_dust',
    '4x ' + busbar, '4x ' + plate, '4x ' + laminate, '2x ' + circuit], 3600, 27648)
})
