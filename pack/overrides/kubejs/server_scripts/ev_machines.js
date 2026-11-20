ServerEvents.recipes(event => {
  const ks = name => 'kubejs:' + name
  const gt = name => 'gtceu:' + name

  const pnc = name => 'pneumaticcraft:' + name
  const prefix = 'zero_shift:ev/'
  const cleanroom = Java.loadClass('com.gregtechceu.gtceu.api.machine.multiblock.CleanroomType').CLEANROOM
  const titanium = gt('titanium_plate')
  const tile = ks('sintered_vacuum_tile')
  const gasket = ks('vacuum_gasket')
  const shieldGas = ks('vacuum_shield_gas')
  const panel = ks('vacuum_treated_panel')
  const wafer = ks('etched_cleanroom_wafer')
  const module = ks('ev_control_module')
  const cage = ks('ev_pressure_cage')
  const coil = ks('ev_traction_coil')
  const relay = ks('ev_phase_relay')
  const jacket = ks('ev_engine_jacket')
  const harness = ks('ev_harness')
  const circuit = gt('micro_processor_computer')
  const casing = gt('ev_machine_casing')
  const hull = gt('ev_machine_hull')
  const motor = gt('ev_electric_motor')
  const pump = gt('ev_electric_pump')
  const piston = gt('ev_electric_piston')
  const conveyor = gt('ev_conveyor_module')
  const robot = gt('ev_robot_arm')
  const emitter = gt('ev_emitter')
  const sensor = gt('ev_sensor')
  const cable = gt('aluminium_single_cable')
  const stable = gt('stable_machine_casing')
  const gear = gt('titanium_gearbox')
  const intake = gt('engine_intake_casing')
  const press = 'kubejs:forging_saddle'
  const arm = 'gtceu:mv_robot_arm'
  const hvCoil = 'gtceu:hv_voltage_coil'
  const iePump = 'gtceu:lv_electric_pump'
  const gauge = pnc('pressure_gauge_module')
  const tube = pnc('reinforced_pressure_tube')

  function machine(type, id, items, output, ticks, power) {
    const recipe = event.recipes.gtceu[type](prefix + id)
    items.forEach(item => recipe.itemInputs(item))
    return recipe.itemOutputs(output).duration(ticks).EUt(power)
  }
  function assemble(id, items, output, ticks, power) {
    const rate = power || 480
    return machine('assembler', id, items, output, ticks, rate)
      .inputFluids(Fluid.of(gt('lubricant'), rate > 512 ? 700 : 400))
  }
  function install(id, items, output, ticks, power) {
    event.remove({ output: output.replace(/^\d+x /, '') })
    return assemble(id, items, output, ticks, power)
  }

  assemble('wire_harness_preform', [
    '6x ' + gt('aluminium_plate'), '2x ' + ks('gold_conductor_blank'), '2x ' + tile,
    '2x ' + gasket, ks('hv_winding_pack'), 'gtceu:electrum_quadruple_cable', tube
  ], '2x ' + harness, 1080)
  event.remove({ output: gt('aluminium_single_wire') })
  machine('wiremill', 'draw_ev_wire', [harness], '4x ' + gt('aluminium_single_wire'), 560, 384)
  event.remove({ output: cable })
  assemble('insulate_ev_cable', [
    '4x ' + gt('aluminium_single_wire'), '2x ' + gt('polyethylene_plate'), '2x ' + gasket, tile, tube
  ], '4x ' + cable, 840)
  const cableWidths = [['double', 2], ['quadruple', 4], ['octal', 8], ['hex', 16]]
  cableWidths.forEach(([width, strands], index) => {
    const smaller = gt('aluminium_' + (index === 0 ? 'single' : cableWidths[index - 1][0]) + '_wire')
    const wire = gt('aluminium_' + width + '_wire')
    install('draw_' + width + '_wire', ['2x ' + smaller, harness, '2x ' + ks('hv_switch_contact'), gt('electrum_single_wire')],
      wire, 820 + strands * 45)
    install('bind_' + width + '_cable', [
      strands + 'x ' + cable, strands + 'x ' + gasket, '2x ' + harness, tile, wire, tube
    ], gt('aluminium_' + width + '_cable'), 720 + strands * 30)
      .circuit(strands)
  })

  assemble('ev_pressure_cage', [
    '2x ' + ks('hot_titanium_billet'), '4x ' + titanium, '2x ' + panel, '2x ' + gasket, gt('hv_hermetic_casing'),
    'gtceu:steel_frame', pnc('pressure_chamber_wall')
  ], cage, 1260)
  assemble('ev_traction_coil', [
    '4x ' + gt('aluminium_single_wire'), '2x ' + ks('kanthal_winding'), '2x ' + ks('hv_winding_pack'),
    titanium, gasket, ks('hv_switch_contact'), hvCoil, 'gtceu:lv_robot_arm'
  ], coil, 1220)
  machine('circuit_assembler', 'ev_phase_relay', [
    module, '2x ' + wafer, gt('hv_emitter'), '2x ' + ks('hv_switch_contact'), titanium, gasket
  ], relay, 1080, 480).cleanroom(cleanroom).inputFluids(Fluid.of(shieldGas, 250))
  assemble('ev_engine_jacket', [
    '4x ' + titanium, '2x ' + panel, ks('vacuum_pump_core'), '4x ' + gasket,
    '2x ' + ks('heat_exchange_core'), gt('hv_electric_pump'), iePump, pnc('heat_sink')
  ], jacket, 1320)

  install('machine_casing', [
    '6x ' + titanium, cage, '2x ' + panel, gt('hv_machine_casing'), '4x ' + gasket,
    'gtceu:steel_frame', gauge, 'kubejs:lunar_vacuum_seal'
  ], casing, 1260)
  install('machine_hull', [
    casing, gt('hv_machine_hull'), '2x ' + module, '2x ' + cable,
    '2x ' + relay, '2x ' + gasket, '2x ' + titanium, 'kubejs:lunar_vacuum_seal', tube
  ], hull, 1640)
  install('electric_motor', [
    gt('hv_electric_motor'), '2x ' + coil, '2x ' + titanium, '2x ' + cable, '2x ' + gasket, circuit,
    'gtceu:good_electronic_circuit', hvCoil
  ], motor, 1300)
  install('electric_piston', [
    gt('hv_electric_piston'), motor, '2x ' + titanium, '2x ' + ks('balanced_rail_axle'), cage, gasket,
    'gtceu:lv_electric_piston', pnc('pressure_chamber_interface')
  ], piston, 1180)
  install('electric_pump', [
    gt('hv_electric_pump'), motor, '2x ' + titanium, '2x ' + gasket, panel, cable, iePump, tube
  ], pump, 1180)
  install('conveyor_module', [
    gt('hv_conveyor_module'), '2x ' + motor, '2x ' + ks('balanced_rail_axle'),
    '2x ' + titanium, '2x ' + ks('chorus_dielectric_film'), cable, 'gtceu:tin_normal_item_pipe', 'kubejs:woven_drive_belt'
  ], conveyor, 1260)
  install('robot_arm', [
    gt('hv_robot_arm'), motor, piston, coil, '2x ' + titanium, '2x ' + circuit, relay, arm, gauge
  ], robot, 1460)
  install('emitter', [
    gt('hv_emitter'), '2x ' + relay, circuit, panel, titanium, '2x ' + cable
  ], emitter, 1040)
  install('sensor', [
    gt('hv_sensor'), '2x ' + ks('ender_optical_insert'), relay, circuit, panel, '2x ' + cable
  ], sensor, 1040)
  install('field_generator', [
    gt('hv_field_generator'), '2x ' + emitter, '4x ' + coil, '2x ' + circuit, cage, '4x ' + cable
  ], gt('ev_field_generator'), 1920, 1536)
  install('assembler', [
    gt('hv_assembler'), hull, '2x ' + robot, conveyor, '3x ' + circuit, '2x ' + panel, '4x ' + cable,
    arm, 'gtceu:steel_frame'
  ], gt('ev_assembler'), 2240)

  const energyHatches = [['energy_input_hatch', 'hv_energy_input_hatch'], ['energy_output_hatch', 'hv_energy_output_hatch']]
  energyHatches.forEach(([id, previous]) => {
    install(id, [gt(previous), hull, '2x ' + coil, '2x ' + relay, '4x ' + cable, cage,
      'gtceu:gold_quadruple_cable', tube], gt('ev_' + id), 1620)
  })
  const fluidHatches = [['input_hatch', 'hv_input_hatch'], ['output_hatch', 'hv_output_hatch']]
  fluidHatches.forEach(([id, previous]) => {
    install(id, [gt(previous), hull, '2x ' + pump, jacket, '2x ' + gasket, '2x ' + circuit,
      iePump, pnc('regulator_tube_module')], gt('ev_' + id), 1450)
  })

  install('engine_stable_casing', [
    '6x ' + titanium, '2x ' + panel, '2x ' + gasket, gt('steel_machine_casing'), cage
  ], '2x ' + stable, 960)
  install('engine_gearbox', [
    gt('stainless_steel_gearbox'), '2x ' + motor, '4x ' + titanium, '2x ' + ks('balanced_rail_axle'), '2x ' + gasket
  ], gear, 1120)
  install('engine_intake', [
    jacket, '2x ' + titanium, '2x ' + gt('filter_casing'), pump, '2x ' + gasket,
    'kubejs:hearth_bellows', 'kubejs:pressed_steel_frame'
  ], '2x ' + intake, 1360)
  install('large_combustion_engine', [
    '2x ' + gt('hv_combustion'), hull, '2x ' + jacket, '2x ' + gear, '4x ' + circuit,
    '2x ' + pump, '4x ' + cable, '4x ' + gasket, pnc('advanced_liquid_compressor')
  ], gt('large_combustion_engine'), 2680)
  install('large_gas_turbine', [
    gt('hv_gas_turbine'), hull, '2x ' + gt('ev_rotor_holder'), '2x ' + motor, jacket,
    '4x ' + gt('stainless_steel_turbine_casing'), '4x ' + circuit, '4x ' + cable
  ], gt('gas_large_turbine'), 2000, 1536)
  install('large_chemical_reactor', [
    gt('ev_chemical_reactor'), hull, '2x ' + jacket, '2x ' + pump, '4x ' + circuit, '4x ' + titanium, '4x ' + gasket
  ], gt('large_chemical_reactor'), 1760, 1536)

  const devices = [
    [pump, ['air_scrubber', 'autoclave', 'brewery', 'canner', 'chemical_bath', 'chemical_reactor',
      'distillery', 'electrolyzer', 'extractor', 'fermenter', 'fisher', 'fluid_drilling_rig',
      'fluid_heater', 'fluid_passthrough_hatch', 'fluid_regulator', 'fluid_solidifier', 'gas_collector',
      'ore_washer', 'pump', 'super_tank']],
    [piston, ['block_breaker', 'bender', 'compressor', 'cutter', 'extruder', 'forge_hammer',
      'forming_press', 'lathe', 'macerator', 'bedrock_ore_miner', 'rock_crusher', 'wiremill']],
    [motor, ['centrifuge', 'mixer', 'rotor_holder', 'sifter', 'thermal_centrifuge']],
    [cage, ['alloy_smelter', 'arc_furnace', 'electric_furnace', 'hermetic_casing', 'muffler_hatch']],
    [conveyor, ['input_bus', 'item_collector', 'item_passthrough_hatch', 'output_bus', 'packer', 'super_chest']],
    [emitter, ['circuit_assembler', 'electromagnetic_separator', 'laser_engraver', 'polarizer', 'world_accelerator']],
    [sensor, ['scanner', 'solar_panel']],
    [coil, ['battery_hull', 'charger_4x', 'diode', 'voltage_coil',
      'battery_buffer_4x', 'battery_buffer_8x', 'battery_buffer_16x',
      'transformer_1a', 'transformer_2a', 'transformer_4a', 'transformer_16a']]
  ]
  const stationEquipment = [
    [iePump, pnc('regulator_tube_module')],
    [press, 'gtceu:plate_casting_mold'],
    ['gtceu:good_electronic_circuit', hvCoil],
    ['gtceu:steel_frame', pnc('heat_sink')],
    ['gtceu:tin_normal_item_pipe', 'kubejs:woven_drive_belt'],
    ['gtceu:lv_sensor', 'gtceu:gold_quadruple_cable'],
    [gauge, 'gtceu:gold_single_cable'],
    [hvCoil, 'gtceu:hv_battery_buffer_4x']
  ]
  devices.forEach(([part, families], group) => {
    const [tool, support] = stationEquipment[group]
    families.forEach((id, index) => {
      install(id, [gt('hv_' + id), hull, '2x ' + part, '2x ' + circuit, '2x ' + titanium,
        '2x ' + cable, '2x ' + gasket, tool, id.startsWith('transformer_') ? ks('martian_pressure_liner') : support], gt('ev_' + id), 1680 + index * 30, 1536)
    })
  })
  const pipeSizes = ['tiny', 'small', 'normal', 'large', 'huge', 'quadruple', 'nonuple']
  pipeSizes.forEach((size, index) => {
    const previous = index === 0 ? gt('stainless_steel_tiny_fluid_pipe')
      : gt('titanium_' + (size === 'quadruple' ? 'normal' : pipeSizes[index - 1]) + '_fluid_pipe')
    const id = 'titanium_' + size + '_fluid_pipe'
    const die = size === 'quadruple' ? 'gtceu:wire_extruder_mold' : 'gtceu:rod_extruder_mold'
    install(id, ['2x ' + previous, '3x ' + titanium, '2x ' + gasket, tube, die],
      (index < 3 ? '2x ' : '') + gt(id), 950 + index * 120, 1536)
  })

  const extraPower = [
    [4, 'energy_input_hatch'], [16, 'energy_input_hatch'],
    [4, 'energy_output_hatch'], [16, 'energy_output_hatch']
  ]
  extraPower.forEach(([amps, name]) => {
    const id = name + '_' + amps + 'a'
    const width = amps === 4 ? 'quadruple' : 'hex'
    install(id, ['2x ' + gt('ev_' + name), '2x ' + gt('aluminium_' + width + '_cable'),
      '2x ' + coil, '2x ' + relay, '2x ' + cage, '2x ' + circuit], gt('ev_' + id), 1560, 1536)
  })
  fluidHatches.forEach(([name]) => {
    const capacities = [[4, gt('ev_electric_pump')], [9, ks('ev_engine_jacket')]]
    capacities.forEach(([ports, upgrade]) => {
      const id = name + '_' + ports + 'x'
      install(id, [ports + 'x ' + gt('ev_' + name), '2x ' + upgrade, '2x ' + cage,
        '4x ' + gasket, '2x ' + circuit], gt('ev_' + id), 1460 + 50 * ports, 1536)
    })
  })
  const converters = [[1, 'ev_transformer_1a'], [4, 'ev_transformer_4a'], [8, 'ev_voltage_coil'], [16, 'ev_transformer_16a']]
  converters.forEach(([amps, regulation]) => {
    const id = amps + 'a_energy_converter'
    install(id, [gt('hv_' + id), gt(regulation), hull, amps + 'x ' + coil,
      '2x ' + relay, '2x ' + circuit, amps + 'x ' + cable], gt('ev_' + id), 1500 + 30 * amps, 1536)
  })
  const substations = [['input', 'energy_input_hatch_16a'], ['output', 'energy_output_hatch_16a']]
  substations.forEach(([name, previous]) => {
    const id = 'substation_' + name + '_hatch_64a'
    install(id, ['4x ' + gt('ev_' + previous), '2x ' + gt('ev_transformer_16a'),
      '4x ' + cage, '4x ' + gt('aluminium_hex_cable'), '4x ' + circuit, '2x ' + relay],
      gt('ev_' + id), 1920, 1536)
  })

  install('large_miner', [
    gt('hv_bedrock_ore_miner'), hull, '2x ' + piston, '2x ' + pump, '2x ' + cage,
    '4x ' + circuit, '4x ' + titanium, '4x ' + cable
  ], gt('ev_large_miner'), 2040, 1536)
  install('lapotronic_battery', [
    '4x ' + gt('hv_lithium_battery'), gt('ev_battery_hull'), '4x ' + coil,
    '2x ' + module, '2x ' + relay, '4x ' + titanium
  ], gt('ev_lapotronic_battery'), 1760, 1536)
  install('vanadium_battery', [
    gt('hv_lithium_battery'), gt('ev_battery_hull'), '4x ' + gt('vanadium_dust'),
    '2x ' + gasket, '2x ' + coil, '2x ' + titanium
  ], gt('ev_vanadium_battery'), 1640, 1536)
  event.remove({ output: gt('ev_power_unit') })
  const evDrive = event.recipes.gtceu.assembler(prefix + 'power_unit')
  ;[gt('hv_power_unit'), motor, gt('ev_vanadium_battery'), '2x ' + titanium, '2x ' + cable,
    '2x ' + gasket, relay, arm, gauge].forEach(item => evDrive.itemInputs(item))
  evDrive.inputFluids(Fluid.of(gt('lubricant'), 1000))
    .itemOutputs(Item.of(gt('ev_power_unit'), '{MaxCharge:10240000L}')).duration(2160).EUt(1536)

  assemble('ev_etching_mask', [ks('laser_mask'), '2x ' + module, '2x ' + titanium, relay, '2x ' + panel], ks('ev_etching_mask'), 1100, 1536)
  machine('laser_engraver', 'calibrate_ev_wafer', [wafer, ks('ev_etching_mask')], ks('ev_calibrated_wafer'), 1200, 1536)
    .cleanroom(cleanroom)
  machine('circuit_assembler', 'nano_ev_circuit', [
    gt('nano_processor'), '2x ' + ks('ev_calibrated_wafer'), module, relay, titanium, '2x ' + ks('tin_solder_preform')
  ], '2x ' + gt('nano_processor_assembly'), 1320, 1536).cleanroom(cleanroom).inputFluids(Fluid.of(shieldGas, 300))
  machine('circuit_assembler', 'quantum_ev_circuit', [
    gt('nano_processor_assembly'), gt('ev_field_generator'), '2x ' + ks('ev_calibrated_wafer'), module, relay, titanium
  ], '2x ' + gt('quantum_processor'), 1640, 1536).cleanroom(cleanroom).inputFluids(Fluid.of(shieldGas, 400))
  // Drop both stock compositions before GregTech generates the recycling recipes.
  const materialData = Java.loadClass('com.gregtechceu.gtceu.api.data.chemical.material.ItemMaterialData')
  const filterCasing = Item.of(gt('sterilizing_filter_casing')).getItem()
  materialData.clearMaterialInfo(filterCasing)
  // Call through Map to avoid Rhino looking up the method name as an ItemStack key.
  const keys = Java.loadClass('java.util.Map').__javaObject__.getMethod('keySet', [])
  keys.invoke(materialData.UNRESOLVED_ITEM_MATERIAL_INFO, []).removeIf(stack => stack.getItem().equals(filterCasing))
  event.remove({ id: gt('macerator/macerate_sterilizing_filter_casing') })
  event.remove({ id: gt('arc_furnace/arc_sterilizing_filter_casing') })
  event.remove({ id: gt('extractor/extract_sterilizing_filter_casing') })
  assemble('sterilizing_filter_casing', [
    '2x ' + gt('filter_casing'), '2x ' + ks('cleanroom_filter_pack'), ks('ev_calibrated_wafer'), '2x ' + panel, gasket
  ], '2x ' + gt('sterilizing_filter_casing'), 1360, 1536)
  machine('circuit_assembler', 'close_ev_shift', [
    '16x ' + ks('ev_calibrated_wafer'), '3x ' + circuit, '3x ' + module, '2x ' + relay, '3x ' + panel, cage
  ], ks('ev_commissioning_report'), 2600, 1920).cleanroom(cleanroom).inputFluids(Fluid.of(shieldGas, 850))
})
