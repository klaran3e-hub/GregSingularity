ServerEvents.recipes(event => {
  const ks = id => global.gsItemId(id)
  const gt = id => 'gtceu:' + id
  const iv = id => gt('iv_' + id)
  const ev = id => gt('ev_' + id)

  const pnc = id => 'pneumaticcraft:' + id
  const prefix = 'zero_shift:iv_machines/'
  const plate = gt('tungsten_steel_plate')
  const platinum = gt('platinum_plate')
  const cable = gt('tungsten_single_cable')
  const gasket = ks('vacuum_gasket')
  const bulkhead = ks('iv_bulkhead')
  const arcPlate = ks('iv_arc_plate')
  const servo = ks('iv_servo_core')
  const switchStack = ks('iv_switch_stack')
  const regulator = ks('iv_grid_regulator')
  const jacket = ks('iv_cooling_jacket')
  const circuit = gt('micro_processor_mainframe')
  const fuel = gt('cetane_boosted_diesel')
  const hull = iv('machine_hull')
  const casing = iv('machine_casing')
  const motor = iv('electric_motor')
  const pump = iv('electric_pump')
  const piston = iv('electric_piston')
  const conveyor = iv('conveyor_module')
  const robot = iv('robot_arm')
  const emitter = iv('emitter')
  const sensor = iv('sensor')
  const robust = gt('robust_machine_casing')
  const gearbox = gt('tungstensteel_gearbox')
  const intake = gt('extreme_engine_intake_casing')
  const arm = 'gtceu:mv_robot_arm'
  const gauge = pnc('pressure_gauge_module')
  const ieCoil = 'gtceu:hv_voltage_coil'
  const iePump = 'gtceu:lv_electric_pump'
  const tube = pnc('reinforced_pressure_tube')

  function assemble(id, output, items, ticks, power, liquid, amount) {
    const recipe = event.recipes.gtceu.assembler(prefix + id)
    items.forEach(item => recipe.itemInputs(item))
    const result = output === iv('power_unit') ? Item.of(output, '{MaxCharge:40960000L}') : output
    return recipe.itemOutputs(result).duration(ticks).EUt(power)
      .inputFluids(Fluid.of(liquid || gt('lubricant'), amount || (power > 2048 ? 950 : 700)))
  }

  function install(id, output, items, ticks, power, liquid, amount) {
    event.remove({ output: output.replace(/^\d+x /, '') })
    return assemble(id, output, items, ticks, power, liquid, amount)
  }

  function tier(id, items, ticks, power) {
    return install(id, iv(id), items, ticks, power)
  }

  assemble('laminate_bulkhead', '2x ' + bulkhead, [
    '4x ' + plate, '2x ' + ks('vacuum_treated_panel'), ks('ev_pressure_cage'),
    '2x ' + ks('iv_cable_jacket'), '2x ' + gasket, 'gtceu:steel_frame', pnc('pressure_chamber_wall')
  ], 1640, 1920)
  event.recipes.gtceu.forming_press(prefix + 'stamp_arc_plate')
      .itemInputs(bulkhead).notConsumable('gtceu:plate_casting_mold')
      .itemOutputs(Item.of(arcPlate, 2)).duration(360).EUt(1920)
  assemble('wind_servo_core', '2x ' + servo, [
    ev('electric_motor'), '2x ' + ks('ev_traction_coil'), '2x ' + plate,
    '2x ' + ks('balanced_rail_axle'), '2x ' + cable, '2x ' + gasket, 'gtceu:good_electronic_circuit', ieCoil
  ], 1620, 1920)
  assemble('assemble_switch_stack', '2x ' + switchStack, [
    '2x ' + ks('ev_phase_relay'), '2x ' + platinum, arcPlate, ks('me_optical_link'),
    '2x ' + cable, circuit, gauge, 'gtceu:gold_quadruple_cable'
  ], 1820, 1920)
  assemble('assemble_grid_regulator', regulator, [
    '2x ' + switchStack, '2x ' + ev('emitter'), '2x ' + platinum,
    '2x ' + ks('iv_busbar_blank'), circuit, '2x ' + cable, 'gtceu:lv_sensor', 'gtceu:hv_battery_buffer_4x'
  ], 1980, 1920)
  assemble('assemble_cooling_jacket', jacket, [
    '2x ' + ks('ev_engine_jacket'), '2x ' + ev('electric_pump'), '4x ' + plate,
    '2x ' + arcPlate, '4x ' + gasket, ks('vacuum_pump_core'), iePump, pnc('heat_sink')
  ], 1960, 1920)

  tier('machine_casing', [
    ev('machine_casing'), '4x ' + plate, '2x ' + bulkhead, '2x ' + arcPlate, '4x ' + gasket,
    'gtceu:steel_frame', gauge, 'ad_astra:gregsingularity_martian_pressure_liner'
  ], 1820, 1920)
  tier('machine_hull', [
    ev('machine_hull'), casing, '2x ' + switchStack, '2x ' + arcPlate, '4x ' + cable, '2x ' + circuit,
    '2x ' + 'gtceu:gold_single_cable', tube, ks('martian_pressure_liner')
  ], 2120, 1920)
  tier('electric_motor', [
    ev('electric_motor'), '2x ' + servo, '2x ' + plate, '2x ' + cable, circuit, '2x ' + gasket,
    '2x ' + ieCoil, 'gtceu:lv_robot_arm'
  ], 1680, 1920)
  tier('electric_pump', [
    ev('electric_pump'), motor, jacket, '2x ' + plate, '2x ' + cable, '2x ' + gasket,
    iePump, pnc('regulator_tube_module')
  ], 1840, 1920)
  tier('electric_piston', [
    ev('electric_piston'), motor, servo, '2x ' + plate, '2x ' + ks('balanced_rail_axle'), arcPlate,
    pnc('pressure_chamber_interface'), 'gtceu:lv_electric_piston'
  ], 1760, 1920)
  tier('conveyor_module', [
    ev('conveyor_module'), '2x ' + motor, '2x ' + plate, '2x ' + ks('iv_cable_jacket'),
    '2x ' + ks('balanced_rail_axle'), cable, 'gtceu:tin_normal_item_pipe', 'gtceu:gregsingularity_woven_drive_belt'
  ], 1820, 1920)
  tier('robot_arm', [
    ev('robot_arm'), motor, piston, '2x ' + servo, switchStack, '2x ' + circuit, '2x ' + plate, arm, gauge
  ], 1980, 1920)
  tier('emitter', [
    ev('emitter'), '2x ' + switchStack, '2x ' + ks('me_optical_link'), circuit, arcPlate, '2x ' + cable
  ], 1660, 1920)
  tier('sensor', [
    ev('sensor'), switchStack, '2x ' + ks('ender_optical_insert'), '2x ' + platinum, circuit, '2x ' + cable
  ], 1620, 1920)
  tier('field_generator', [
    ev('field_generator'), '2x ' + emitter, '2x ' + regulator, '4x ' + servo,
    '4x ' + plate, '2x ' + circuit
  ], 2420, 6656)
  tier('assembler', [
    ev('assembler'), hull, '2x ' + robot, '2x ' + conveyor, '2x ' + regulator,
    '4x ' + circuit, '4x ' + cable, '2x ' + arcPlate, arm
  ], 2800, 1920)

  const energyHatches = ['energy_input_hatch', 'energy_output_hatch']
  energyHatches.forEach(id => {
    tier(id, ['2x ' + ev(id), hull, '2x ' + regulator, '2x ' + switchStack,
      '4x ' + cable, '2x ' + arcPlate], 1920, 1920)
    tier(id + '_4a', ['2x ' + iv(id), ev(id + '_4a'), '2x ' + regulator,
      '4x ' + gt('tungsten_quadruple_cable'), '2x ' + circuit, '2x ' + arcPlate], 2180, 6144)
    tier(id + '_16a', ['2x ' + iv(id + '_4a'), ev(id + '_16a'), '4x ' + regulator,
      '4x ' + gt('tungsten_hex_cable'), '4x ' + circuit, '4x ' + arcPlate], 2800, 7680)
  })
  const fluidHatches = ['input_hatch', 'output_hatch']
  fluidHatches.forEach(id => {
    tier(id, [ev(id), hull, '2x ' + pump, jacket, '4x ' + gasket, '2x ' + circuit], 1640, 1920)
    ;[4, 9].forEach(ports => {
      const upgrade = id + '_' + ports + 'x'
      tier(upgrade, [ev(upgrade), ports + 'x ' + iv(id), '2x ' + pump, '2x ' + jacket,
        '4x ' + gasket, '2x ' + circuit], 1900 + ports * 65, 6144)
    })
  })

  install('engine_robust_casing', '2x ' + robust, [
    gt('stable_machine_casing'), '6x ' + plate, '2x ' + bulkhead, '2x ' + arcPlate, '2x ' + gasket
  ], 1500, 1920)
  install('engine_gearbox', gearbox, [
    gt('titanium_gearbox'), '2x ' + servo, '4x ' + plate, motor, '2x ' + ks('balanced_rail_axle')
  ], 1700, 1920)
  install('engine_intake', '2x ' + intake, [
    '2x ' + gt('engine_intake_casing'), jacket, '2x ' + gt('sterilizing_filter_casing'),
    '2x ' + pump, '2x ' + arcPlate, '2x ' + gasket
  ], 1780, 1920)
  install('extreme_combustion_engine', gt('extreme_combustion_engine'), [
    gt('large_combustion_engine'), hull, '2x ' + gearbox, '2x ' + jacket, '4x ' + circuit,
    '2x ' + regulator, '4x ' + cable, '4x ' + arcPlate, pnc('advanced_liquid_compressor')
  ], 3600, 1920, fuel, 4000)

  const devices = [
    [pump, ['autoclave', 'brewery', 'canner', 'chemical_bath', 'chemical_reactor', 'distillery',
      'electrolyzer', 'extractor', 'fermenter', 'fisher', 'fluid_heater', 'fluid_passthrough_hatch',
      'fluid_regulator', 'fluid_solidifier', 'gas_collector', 'ore_washer']],
    [piston, ['bender', 'compressor', 'cutter', 'extruder', 'forge_hammer', 'forming_press',
      'lathe', 'macerator', 'rock_crusher', 'wiremill']],
    [motor, ['centrifuge', 'mixer', 'rotor_holder', 'sifter', 'thermal_centrifuge']],
    [arcPlate, ['alloy_smelter', 'arc_furnace', 'electric_furnace', 'hermetic_casing', 'muffler_hatch']],
    [conveyor, ['input_bus', 'item_passthrough_hatch', 'output_bus', 'packer']],
    [emitter, ['circuit_assembler', 'electromagnetic_separator', 'laser_engraver', 'polarizer', 'world_accelerator']],
    [sensor, ['scanner', 'solar_panel']],
    [regulator, ['battery_hull', 'charger_4x', 'diode', 'voltage_coil',
      'battery_buffer_4x', 'battery_buffer_8x', 'battery_buffer_16x']]
  ]
  const stationEquipment = [
    [iePump, pnc('regulator_tube_module')],
    ['gtceu:gregsingularity_forging_saddle', 'gtceu:plate_casting_mold'],
    ['gtceu:good_electronic_circuit', ieCoil],
    ['gtceu:steel_frame', pnc('heat_sink')],
    ['gtceu:tin_normal_item_pipe', 'gtceu:gregsingularity_woven_drive_belt'],
    ['gtceu:lv_sensor', 'gtceu:gold_quadruple_cable'],
    [gauge, 'gtceu:gold_single_cable'],
    [ieCoil, 'gtceu:hv_battery_buffer_4x']
  ]
  devices.forEach(([part, family], group) => {
    const [tool, support] = stationEquipment[group]
    family.forEach((id, index) => {
      tier(id, [ev(id), hull, '2x ' + part, '2x ' + circuit, '2x ' + plate,
        '2x ' + cable, '2x ' + gasket, tool, support], 2370 + index * 40, 6144)
    })
  })

  ;[1, 2, 4, 16].forEach(amps => {
    const id = 'transformer_' + amps + 'a'
    ;['arc_furnace/arc_', 'macerator/macerate_', 'extractor/extract_'].forEach(recycler => {
      event.remove({ id: gt(recycler + 'iv_' + id) })
    })
    tier(id, [ev(id), hull, '2x ' + regulator, '2x ' + circuit, '2x ' + plate,
      '4x ' + cable, '2x gtceu:niobium_titanium_single_cable', 'ad_astra:gregsingularity_venus_thermal_screen'], 2360 + 80 * amps, 7680)
      .notConsumable(Item.of(ks('iv_commissioning_report')))
  })

  ;[[1, 'transformer_1a'], [4, 'transformer_4a'], [8, 'voltage_coil'], [16, 'transformer_16a']].forEach(([amps, core]) => {
    const id = amps + 'a_energy_converter'
    tier(id, [ev(id), iv(core), hull, amps + 'x ' + switchStack, '2x ' + regulator,
      '2x ' + circuit, amps + 'x ' + cable], 1740 + 60 * amps, 6656)
  })
  ;['input', 'output'].forEach(direction => {
    const id = 'substation_' + direction + '_hatch_64a'
    tier(id, [ev(id), '4x ' + iv('energy_' + direction + '_hatch_16a'),
      '2x ' + iv('transformer_16a'), '4x ' + regulator, '4x ' + gt('tungsten_hex_cable'),
      '4x ' + circuit], 3140, 7680)
  })
  ;[['source', emitter, 'energy_output_hatch_16a'], ['target', sensor, 'energy_input_hatch_16a']].forEach(([side, optic, hatch]) => {
    const base = '256a_laser_' + side + '_hatch'
    const middle = '1024a_laser_' + side + '_hatch'
    const top = '4096a_laser_' + side + '_hatch'
    tier(base, [iv(hatch), '2x ' + optic, '4x ' + ks('me_optical_link'), '2x ' + regulator,
      '2x ' + iv('field_generator'), '4x ' + circuit], 2760, 7360)
    tier(middle, ['4x ' + iv(base), '4x ' + optic, '4x ' + regulator, '4x ' + arcPlate, '4x ' + circuit], 3250, 7680)
    tier(top, ['4x ' + iv(middle), '4x ' + iv('field_generator'), '8x ' + regulator,
      '8x ' + arcPlate, '8x ' + circuit], 4000, 8000)
  })

  tier('parallel_hatch', ['2x ' + robot, hull, '2x ' + ks('iv_clock_backplane'), '4x ' + circuit,
    '4x ' + cable, '2x ' + arcPlate], 2600, 7360)
  tier('quantum_chest', [ev('super_chest'), hull, '2x ' + conveyor, '2x ' + ks('iv_clock_backplane'),
    '2x ae2:cell_component_64k', '4x ' + circuit], 2750, 7360)
  tier('quantum_tank', [ev('super_tank'), hull, '2x ' + pump, '2x ' + jacket,
    '2x ae2:fluid_storage_cell_64k', '4x ' + circuit], 2820, 7360)
  tier('large_miner', [ev('large_miner'), hull, '2x ' + piston, '2x ' + pump, '4x ' + robust,
    '4x ' + circuit, '4x ' + cable], 3020, 7360)
  tier('lapotronic_battery', ['4x ' + ev('lapotronic_battery'), iv('battery_hull'),
    '2x ' + regulator, '2x ' + arcPlate, '2x ' + switchStack, '4x ' + plate], 2480, 6656)
  tier('vanadium_battery', [ev('vanadium_battery'), iv('battery_hull'), '4x ' + gt('vanadium_dust'),
    '2x ' + regulator, '2x ' + jacket, '2x ' + plate], 2320, 6656)
  tier('power_unit', [ev('power_unit'), motor, iv('vanadium_battery'), '2x ' + plate,
    '2x ' + arcPlate, regulator, '2x ' + cable, arm, gauge], 2620, 6656)

  const fluidSizes = ['tiny', 'small', 'normal', 'large', 'huge', 'quadruple', 'nonuple']
  fluidSizes.forEach((size, index) => {
    const previous = index === 0 ? gt('titanium_tiny_fluid_pipe')
      : gt('tungsten_steel_' + (size === 'quadruple' ? 'normal' : fluidSizes[index - 1]) + '_fluid_pipe')
    const id = 'tungsten_steel_' + size + '_fluid_pipe'
    const die = size === 'quadruple' ? 'gtceu:wire_extruder_mold' : 'gtceu:rod_extruder_mold'
    install(id, (index < 3 ? '2x ' : '') + gt(id), [
      '2x ' + previous, '3x ' + plate, '2x ' + gasket, tube, die, arcPlate
    ], 1360 + index * 170, 6144)
  })
  const itemSizes = ['small', 'normal', 'large', 'huge']
  itemSizes.forEach((size, index) => {
    const pipe = gt('platinum_' + size + '_item_pipe')
    const previous = index === 0 ? gt('electrum_small_item_pipe') : gt('platinum_' + itemSizes[index - 1] + '_item_pipe')
    install('platinum_' + size + '_item_pipe', (index < 2 ? '2x ' : '') + pipe, [
      '2x ' + previous, '2x ' + platinum, conveyor, 'gtceu:lv_conveyor_module', 'gtceu:gregsingularity_woven_drive_belt', gasket
    ], 1440 + index * 190, 6144)
    install('platinum_' + size + '_restrictive_item_pipe', gt('platinum_' + size + '_restrictive_item_pipe'), [
      pipe, gt('electrum_' + size + '_restrictive_item_pipe'), 'gtceu:gregsingularity_woven_drive_belt', gauge, regulator, arcPlate
    ], 1480 + index * 190, 6144)
  })
})
