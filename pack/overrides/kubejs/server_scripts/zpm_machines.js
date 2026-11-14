ServerEvents.recipes(event => {
  const gt = id => 'gtceu:' + id
  const luv = id => gt('luv_' + id)
  const zpm = id => gt('zpm_' + id)
  const prefix = 'zero_shift:zpm_machines/zpm_'
  const plate = gt('naquadah_alloy_plate')
  const europium = gt('europium_plate')
  const wire = gt('vanadium_gallium_single_wire')
  const cable = gt('vanadium_gallium_single_cable')
  const quadCable = gt('vanadium_gallium_quadruple_cable')
  const hexCable = gt('vanadium_gallium_hex_cable')
  const wetware = gt('wetware_processor')
  const timing = 'kubejs:zpm_phase_module'
  const laminate = 'kubejs:zpm_neutron_laminate'
  const busbar = 'kubejs:zpm_flux_busbar'
  const switchgear = 'kubejs:zpm_reserve_switchgear'
  const optics = 'kubejs:luv_optical_core'
  const lubricant = gt('lubricant')
  const coolant = 'kubejs:chilled_vacuum_coolant'
  const shield = 'kubejs:vacuum_shield_gas'
  const gasket = 'kubejs:vacuum_gasket'
  const hull = zpm('machine_hull')
  const motor = zpm('electric_motor')
  const piston = zpm('electric_piston')
  const pump = zpm('electric_pump')
  const conveyor = zpm('conveyor_module')
  const robot = zpm('robot_arm')
  const emitter = zpm('emitter')
  const sensor = zpm('sensor')
  const field = zpm('field_generator')
  const voltageCoil = zpm('voltage_coil')
  const tube = 'pneumaticcraft:advanced_pressure_tube'
  const gauge = 'pneumaticcraft:pressure_gauge_module'
  const relay = 'immersiveengineering:connector_hv_relay'
  const safety = 'pneumaticcraft:safety_tube_module'

  function tier(id, items, ticks, power, fluid, volume) {
    const output = zpm(id)
    event.remove({ output: output })
    const recipe = event.recipes.gtceu.assembler(prefix + id)
    items.forEach(item => recipe.itemInputs(item))
    return recipe.itemOutputs(output).duration(ticks).EUt(power)
      .inputFluids(Fluid.of(fluid === undefined ? lubricant : fluid, volume === undefined ? 3600 : volume))
  }

  // Manufacture the first ZPM tools and power interfaces with one LuV packet.
  tier('machine_casing', ['2x ' + luv('machine_casing'), '8x ' + plate, '4x ' + europium,
    '4x ' + laminate, '4x kubejs:iv_bulkhead', '8x ' + gasket, '4x immersiveengineering:steel_scaffolding_standard'], 4100, 28672, coolant)
  tier('machine_hull', ['2x ' + luv('machine_hull'), zpm('machine_casing'), '4x ' + timing,
    '4x ' + busbar, '8x ' + wire, '4x ' + wetware, '4x ' + laminate], 4800, 30720)
  tier('electric_motor', ['2x ' + luv('electric_motor'), '4x ' + busbar, '6x ' + plate,
    '4x ' + europium, '8x ' + wire, '2x ' + timing, '4x ' + laminate, '4x immersiveengineering:wirecoil_steel'], 3800, 28672)
  tier('electric_pump', ['2x ' + luv('electric_pump'), '2x ' + motor, '4x kubejs:iv_cooling_jacket',
    '6x ' + plate, '4x ' + laminate, '4x ' + busbar, '8x ' + gasket, '4x ' + tube, '2x ' + safety], 4200, 29696, coolant)
  tier('electric_piston', ['2x ' + luv('electric_piston'), '2x ' + motor, '4x kubejs:iv_servo_core',
    '6x ' + plate, '4x ' + europium, '4x ' + busbar, '4x ' + laminate], 4200, 29696)
  tier('conveyor_module', ['2x ' + luv('conveyor_module'), '2x ' + motor, '4x ' + busbar,
    '6x ' + plate, '4x ' + laminate, '6x ' + wire, '2x ' + timing,
    '4x create:smart_chute', '4x immersiveengineering:conveyor_basic'], 4300, 29696)
  tier('robot_arm', ['2x ' + luv('robot_arm'), '2x ' + motor, '2x ' + piston, '4x ' + timing,
    '4x ' + wetware, '6x ' + plate, '4x ' + busbar, '4x ' + laminate, '2x create:mechanical_arm'], 4850, 30720)
  tier('emitter', ['2x ' + luv('emitter'), '4x ' + optics, '4x ' + timing, '4x ' + europium,
    '4x ' + plate, '6x ' + wire, '4x ae2:engineering_processor'], 4300, 29696, shield)
  tier('sensor', ['2x ' + luv('sensor'), '4x ' + optics, '4x ' + timing, '4x ' + europium,
    '4x ' + laminate, '6x ' + wire, '4x ae2:cell_component_64k', '2x ' + gauge], 4300, 29696, shield)
  tier('field_generator', ['2x ' + luv('field_generator'), '2x ' + emitter, '6x ' + busbar,
    '4x ' + timing, '4x ' + wetware, '6x ' + plate, '6x ' + laminate, '4x ' + relay, '2x ' + safety], 5700, 32000, coolant, 4800)
  tier('assembler', ['2x ' + luv('assembler'), hull, '2x ' + robot, '2x ' + conveyor,
    '4x ' + timing, '4x ' + wetware, '8x ' + wire, '4x ' + laminate], 5200, 32000)
  tier('circuit_assembler', ['2x ' + luv('circuit_assembler'), hull, '2x ' + emitter, '2x ' + sensor,
    '4x ' + timing, '4x ' + wetware, '4x ' + optics, '4x ' + busbar], 5300, 32000, shield)
  tier('voltage_coil', ['2x ' + luv('voltage_coil'), '6x ' + wire, '4x ' + busbar,
    '4x ' + europium, '2x ' + timing, '4x ' + laminate], 3900, 29696, coolant)

  ;['input', 'output'].forEach(side => {
    const energy = 'energy_' + side + '_hatch'
    const fluid = side + '_hatch'
    const bus = side + '_bus'
    tier(energy, ['2x ' + luv(energy), hull, '2x ' + voltageCoil, '4x ' + busbar,
      '4x ' + timing, '8x ' + wire, '4x ' + laminate, '4x ' + relay, '2x ' + safety], 4000, 30720)
    tier(energy + '_4a', ['2x ' + luv(energy + '_4a'), '2x ' + zpm(energy), '4x ' + voltageCoil,
      '6x ' + busbar, '4x ' + timing, '8x ' + wire, '6x ' + laminate], 4800, 32000, coolant)
    tier(energy + '_16a', ['2x ' + luv(energy + '_16a'), '4x ' + zpm(energy + '_4a'), '6x ' + voltageCoil,
      '8x ' + busbar, '6x ' + timing, '4x ' + hexCable, '8x ' + laminate], 5800, 98304, coolant, 6400)
    tier(fluid, ['2x ' + luv(fluid), hull, '2x ' + pump, '4x kubejs:iv_cooling_jacket',
      '6x ' + plate, '4x ' + laminate, '8x ' + gasket, '4x ' + tube, '2x ' + gauge], 4300, 30720, coolant)
    tier(bus, ['2x ' + luv(bus), hull, '2x ' + conveyor, '4x ' + timing,
      '4x ' + plate, '4x ' + laminate, '2x ae2:cell_component_256k'], 4300, 30720)
    ;[4, 9].forEach(ports => {
      const id = fluid + '_' + ports + 'x'
      tier(id, ['2x ' + luv(id), ports + 'x ' + zpm(fluid), '2x ' + pump,
        '6x ' + plate, '4x ' + timing, '4x ' + laminate], 4700 + 160 * ports, 65536, coolant, 4800)
    })
    tier('dual_' + side + '_hatch', ['2x ' + luv('dual_' + side + '_hatch'),
      '2x ' + zpm(bus), '2x ' + zpm(fluid), '2x ' + conveyor, '4x ' + timing,
      '4x ' + laminate, '4x ae2:cell_component_256k'], 5400, 81920)
    const substation = 'substation_' + side + '_hatch_64a'
    tier(substation, ['2x ' + luv(substation), '4x ' + zpm(energy + '_16a'),
      '4x ' + zpm('transformer_16a'), '8x ' + busbar, '8x ' + hexCable,
      '4x ' + switchgear, '8x ' + timing], 7500, 122880, coolant, 7200)
  })

  const families = [
    [pump, tube, gauge, ['autoclave', 'brewery', 'canner', 'chemical_bath', 'distillery', 'electrolyzer',
      'extractor', 'fermenter', 'fluid_heater', 'fluid_passthrough_hatch', 'fluid_regulator',
      'fluid_solidifier', 'gas_collector', 'ore_washer']],
    [piston, 'create:mechanical_press', safety, ['bender', 'compressor', 'cutter', 'extruder', 'forge_hammer', 'forming_press',
      'lathe', 'macerator', 'rock_crusher', 'wiremill']],
    [motor, 'create:rotation_speed_controller', safety, ['mixer', 'rotor_holder', 'sifter', 'thermal_centrifuge']],
    [busbar, relay, safety, ['alloy_smelter', 'arc_furnace', 'electric_furnace', 'hermetic_casing', 'muffler_hatch']],
    [conveyor, 'create:smart_chute', 'immersiveengineering:conveyor_basic', ['item_passthrough_hatch', 'packer']],
    [emitter, 'create:content_observer', relay, ['electromagnetic_separator', 'laser_engraver', 'polarizer', 'world_accelerator']],
    [sensor, 'create:content_observer', gauge, ['scanner', 'solar_panel']]
  ]
  families.forEach(([component, interfacePart, controlPart, machines]) => {
    machines.forEach(id => {
      tier(id, ['2x ' + luv(id), hull, '2x ' + component, '6x ' + plate, '4x ' + timing,
        '4x ' + cable, '4x ' + laminate, '2x ' + interfacePart, '2x ' + controlPart], 5000, 81920)
    })
  })
  ;[['centrifuge', motor], ['chemical_reactor', pump]].forEach(([id, component]) => {
    tier(id, ['2x ' + luv(id), hull, '2x ' + component, '4x ' + timing, '4x ' + europium,
      '8x ' + wire, '4x ' + laminate, '2x ' + tube, '2x ' + gauge], 5000, 32000, coolant)
  })

  ;[1, 2, 4, 16].forEach(amps => {
    const id = 'transformer_' + amps + 'a'
    const conductor = amps <= 4 ? wire : hexCable
    tier(id, ['2x ' + luv(id), hull, (2 * amps) + 'x ' + voltageCoil, (2 * amps) + 'x ' + busbar,
      (2 * amps) + 'x ' + conductor, '4x ' + switchgear, '4x ' + laminate],
    4500 + 170 * amps, amps <= 4 ? 32000 : 98304, coolant, 4800)
  })
  ;[[1, 'transformer_1a'], [4, 'transformer_4a'], [8, 'voltage_coil'], [16, 'transformer_16a']].forEach(([amps, core]) => {
    const id = amps + 'a_energy_converter'
    tier(id, ['2x ' + luv(id), zpm(core), hull, (2 * amps) + 'x ' + busbar,
      (2 * amps) + 'x ' + cable, '4x ' + timing, '4x ' + switchgear, '4x ' + laminate],
    4900 + 160 * amps, 98304, coolant, 4800)
  })

  tier('battery_hull', ['2x ' + luv('battery_hull'), '4x ' + voltageCoil, '6x ' + europium,
    '8x ' + busbar, '4x ' + switchgear, '6x ' + laminate], 4400, 32000, coolant)
  ;[4, 8, 16].forEach(slots => {
    const id = 'battery_buffer_' + slots + 'x'
    tier(id, ['2x ' + luv(id), hull, slots + 'x ' + voltageCoil, slots + 'x ' + busbar,
      slots + 'x ' + wire, '4x ' + switchgear, '4x ' + laminate],
    4400 + 150 * slots, slots <= 4 ? 32000 : 81920, coolant, 4800)
  })
  ;['charger_4x', 'diode'].forEach(id => {
    tier(id, ['2x ' + luv(id), hull, '4x ' + voltageCoil, '6x ' + busbar, '4x ' + switchgear,
      '4x ' + cable, '4x ' + laminate], 5200, 81920, coolant)
  })
  tier('lapotronic_battery', ['4x ' + luv('lapotronic_battery'), zpm('battery_hull'), '8x ' + europium,
    '8x ' + busbar, '4x ' + timing, '4x ' + switchgear, '6x ' + laminate], 5300, 32000, coolant, 5200)
  tier('naquadria_battery', ['4x ' + luv('vanadium_battery'), zpm('battery_hull'), '8x gtceu:naquadria_dust',
    '8x ' + busbar, '4x ' + timing, '4x ' + switchgear, '6x ' + laminate], 6600, 98304, coolant, 6000)

  ;[['source', emitter, 'energy_output_hatch_16a'], ['target', sensor, 'energy_input_hatch_16a']].forEach(([side, optical, hatch]) => {
    const low = '256a_laser_' + side + '_hatch'
    const middle = '1024a_laser_' + side + '_hatch'
    const high = '4096a_laser_' + side + '_hatch'
    tier(low, ['2x ' + luv(low), zpm(hatch), '2x ' + field, '4x ' + optical, '8x ' + optics,
      '6x ' + timing, '6x ' + quadCable], 5700, 98304, shield, 4800)
    tier(middle, ['2x ' + luv(middle), '4x ' + zpm(low), '4x ' + optical, '12x ' + optics,
      '8x ' + busbar, '8x ' + timing], 6800, 114688, shield, 5600)
    tier(high, ['2x ' + luv(high), '4x ' + zpm(middle), '4x ' + field, '16x ' + optics,
      '12x ' + timing, '12x ' + busbar, '8x ' + hexCable], 7800, 122880, shield, 6800)
  })

  tier('parallel_hatch', ['2x ' + luv('parallel_hatch'), hull, '4x ' + robot, '6x ' + timing,
    '4x ' + wetware, '4x ae2:pattern_provider', '4x ' + quadCable], 6100, 98304)
  tier('quantum_chest', ['2x ' + luv('quantum_chest'), hull, '4x ' + conveyor, '6x ' + timing,
    '4x ' + wetware, '4x ae2:item_storage_cell_256k', '4x ae2:storage_bus'], 5800, 98304, shield)
  tier('quantum_tank', ['2x ' + luv('quantum_tank'), hull, '4x ' + pump, '6x ' + laminate,
    '4x ' + timing, '4x ae2:fluid_storage_cell_256k', '4x ae2:storage_bus'], 5900, 98304, coolant)
})
