ServerEvents.recipes(event => {
  const gt = id => 'gtceu:' + id
  const zpm = id => gt('zpm_' + id)
  const uv = id => gt('uv_' + id)
  const part = id => global.gsItemId('uv_' + id)
  const prefix = 'zero_shift:uv_machines/uv_'
  const plate = gt('tritanium_plate')
  const americium = gt('americium_plate')
  const winding = gt('vanadium_gallium_single_wire')
  const cable = gt('yttrium_barium_cuprate_single_cable')
  const quadCable = gt('yttrium_barium_cuprate_quadruple_cable')
  const hexCable = gt('yttrium_barium_cuprate_hex_cable')
  const zpmCircuit = gt('wetware_processor_assembly')
  const uvCircuit = gt('wetware_processor_computer')
  const laminate = part('structural_laminate')
  const shunt = part('flux_shunt')
  const interlock = part('phase_interlock')
  const reserve = part('pulse_reserve')
  const optics = 'gtceu:gregsingularity_luv_optical_core'
  const gasket = 'gtceu:gregsingularity_vacuum_gasket'
  const lubricant = gt('lubricant')
  const coolant = 'kubejs:chilled_vacuum_coolant'
  const shield = 'kubejs:vacuum_shield_gas'
  const hull = uv('machine_hull')
  const motor = uv('electric_motor')
  const piston = uv('electric_piston')
  const pump = uv('electric_pump')
  const conveyor = uv('conveyor_module')
  const robot = uv('robot_arm')
  const emitter = uv('emitter')
  const sensor = uv('sensor')
  const field = uv('field_generator')
  const voltageCoil = uv('voltage_coil')
  const materialData = Java.loadClass('com.gregtechceu.gtceu.api.data.chemical.material.ItemMaterialData')
  const materialKeys = Java.loadClass('java.util.Map').__javaObject__.getMethod('keySet', [])

  function clearPrevious(id) {
    const output = uv(id)
    event.remove({ output: output })
    // The stock composition would let pre-fusion machines recycle into fusion products.
    const item = Item.of(output).getItem()
    materialData.clearMaterialInfo(item)
    materialKeys.invoke(materialData.UNRESOLVED_ITEM_MATERIAL_INFO, []).removeIf(stack => stack.getItem().equals(item))
    event.remove({ id: gt('macerator/macerate_uv_' + id) })
    event.remove({ id: gt('arc_furnace/arc_uv_' + id) })
    event.remove({ id: gt('extractor/extract_uv_' + id) })
  }

  function upgrade(id, parts, ticks, power, fluid, volume) {
    clearPrevious(id)
    const output = uv(id)
    const recipe = event.recipes.gtceu.assembler(prefix + id)
    recipe.itemInputs('2x ' + zpm(id))
    parts.forEach(item => recipe.itemInputs(item))
    recipe.itemOutputs(output).duration(ticks).EUt(power)
      .inputFluids(Fluid.of(fluid === undefined ? lubricant : fluid, volume === undefined ? 5400 : volume))
  }

  // The first UV factory and its power interfaces are produced on ZPM.
  upgrade('machine_casing', ['12x ' + plate, '8x ' + americium, '6x ' + laminate,
    '4x gtceu:gregsingularity_zpm_neutron_laminate', '12x ' + gasket, '2x gtceu:steel_frame',
    '4x pneumaticcraft:reinforced_pressure_tube', 'ad_astra:gregsingularity_zpm_glacio_lamella'], 5900, 106496, coolant, 6000)
  clearPrevious('machine_hull')
  const hullLine = event.recipes.gtceu.assembly_line(prefix + 'machine_hull')
  const hullInputs = ['2x ' + zpm('machine_hull'), uv('machine_casing'), '4x ' + interlock,
    '6x ' + shunt, '12x ' + winding, '6x ' + zpmCircuit, '6x ' + laminate,
    'ad_astra:gregsingularity_zpm_europa_datum', '2x gtceu:gregsingularity_zpm_tempered_frame']
  hullInputs.forEach(stack => hullLine.itemInputs(stack))
  hullLine.inputFluids(Fluid.of(lubricant, 5400), Fluid.of(gt('soldering_alloy'), 2304),
    Fluid.of('kubejs:zpm_ceres_brine', 2000)).itemOutputs(hull).duration(7200).EUt(122880)
    .stationResearch(b => b.researchStack(Item.of('ad_astra:gregsingularity_zpm_europa_datum'))
      .dataStack(Item.of(gt('data_orb'))).CWUt(24, 48000).EUt(114688))
  upgrade('electric_motor', ['6x ' + shunt, '8x ' + plate, '6x ' + americium,
    '12x ' + winding, '4x ' + interlock, '6x ' + laminate], 5100, 114688)
  upgrade('electric_pump', ['2x ' + motor, '6x gtceu:gregsingularity_iv_cooling_jacket', '8x ' + plate,
    '6x ' + laminate, '6x ' + shunt, '12x ' + gasket], 5800, 114688, coolant, 6200)
  upgrade('electric_piston', ['2x ' + motor, '6x gtceu:gregsingularity_iv_servo_core', '8x ' + plate,
    '6x ' + americium, '6x ' + shunt, '6x ' + laminate], 5700, 114688)
  upgrade('conveyor_module', ['2x ' + motor, '6x ' + shunt, '8x ' + plate,
    '6x ' + laminate, '12x ' + winding, '4x ' + interlock], 5900, 118784)
  upgrade('robot_arm', ['2x ' + motor, '2x ' + piston, '6x ' + interlock, '6x ' + zpmCircuit,
    '8x ' + plate, '6x ' + shunt, '6x ' + laminate], 6700, 122880)
  upgrade('emitter', ['6x ' + optics, '6x ' + interlock, '6x ' + americium, '8x ' + plate,
    '10x ' + winding, '6x ae2:engineering_processor'], 5700, 114688, shield, 6000)
  upgrade('sensor', ['6x ' + optics, '6x ' + interlock, '6x ' + americium, '6x ' + laminate,
    '10x ' + winding, '6x ae2:cell_component_256k'], 5800, 114688, shield, 6200)
  upgrade('field_generator', ['2x ' + emitter, '8x ' + shunt, '6x ' + interlock, '6x ' + zpmCircuit,
    '8x ' + plate, '8x ' + laminate], 7300, 126976, coolant, 7600)
  upgrade('assembler', [hull, '2x ' + robot, '2x ' + conveyor, '6x ' + interlock,
    '6x ' + zpmCircuit, '12x ' + winding, '6x ' + laminate, '2x gtceu:mv_robot_arm'], 7700, 126976, lubricant, 7600)
  upgrade('circuit_assembler', [hull, '2x ' + emitter, '2x ' + sensor, '6x ' + interlock,
    '6x ' + zpmCircuit, '6x ' + optics, '6x ' + shunt], 7100, 126976, shield, 6800)
  upgrade('voltage_coil', ['10x ' + winding, '6x ' + shunt, '6x ' + americium,
    '4x ' + interlock, '6x ' + laminate], 5400, 118784, coolant, 5800)

  ;['input', 'output'].forEach(side => {
    const energy = 'energy_' + side + '_hatch'
    const fluid = side + '_hatch'
    const bus = side + '_bus'
    upgrade(energy, [hull, '2x ' + voltageCoil, '6x ' + shunt, '6x ' + interlock,
      '12x ' + winding, '6x ' + laminate], 5500, 122880)
    upgrade(energy + '_4a', ['2x ' + uv(energy), '4x ' + voltageCoil, '8x ' + shunt,
      '6x ' + interlock, '12x ' + winding, '8x ' + laminate], 6500, 126976, coolant, 6500)
    upgrade(energy + '_16a', ['4x ' + uv(energy + '_4a'), '8x ' + voltageCoil, '12x ' + shunt,
      '8x ' + interlock, '6x ' + hexCable, '12x ' + laminate], 7600, 393216, coolant, 8200)
    upgrade(fluid, [hull, '2x ' + pump, '6x gtceu:gregsingularity_iv_cooling_jacket',
      '8x ' + plate, '6x ' + laminate, '12x ' + gasket], 5700, 122880, coolant, 6400)
    upgrade(bus, [hull, '2x ' + conveyor, '6x ' + interlock, '8x ' + plate,
      '6x ' + laminate, '4x ae2:cell_component_256k'], 5700, 122880)
    ;[4, 9].forEach(ports => {
      const id = fluid + '_' + ports + 'x'
      upgrade(id, [ports + 'x ' + uv(fluid), '2x ' + pump, '8x ' + plate,
        '6x ' + interlock, '6x ' + laminate], 6300 + 170 * ports, 262144, coolant, 7200)
    })
    upgrade('dual_' + side + '_hatch', ['2x ' + uv(bus), '2x ' + uv(fluid), '2x ' + conveyor,
      '6x ' + interlock, '6x ' + laminate, '6x ae2:cell_component_256k'], 7100, 327680)
    const substation = 'substation_' + side + '_hatch_64a'
    upgrade(substation, ['4x ' + uv(energy + '_16a'), '4x ' + uv('transformer_16a'),
      '12x ' + shunt, '12x ' + hexCable, '6x ' + reserve, '10x ' + interlock],
    9200, 491520, coolant, 9000)
  })

  const families = [
    [pump, 'pneumaticcraft:regulator_tube_module', coolant, 7800, ['autoclave', 'brewery', 'canner', 'chemical_bath', 'distillery', 'electrolyzer',
      'extractor', 'fermenter', 'fluid_heater', 'fluid_passthrough_hatch', 'fluid_regulator',
      'fluid_solidifier', 'gas_collector', 'ore_washer']],
    [piston, 'gtceu:gregsingularity_zpm_die_cartridge', lubricant, 7600, ['bender', 'compressor', 'cutter', 'extruder', 'forge_hammer', 'forming_press',
      'lathe', 'macerator', 'rock_crusher', 'wiremill']],
    [motor, 'gtceu:good_electronic_circuit', lubricant, 8400, ['mixer', 'rotor_holder', 'sifter', 'thermal_centrifuge']],
    [shunt, 'gtceu:gregsingularity_heater_ribbon', shield, 8000, ['alloy_smelter', 'arc_furnace', 'electric_furnace', 'hermetic_casing', 'muffler_hatch']],
    [conveyor, 'gtceu:mv_sensor', lubricant, 6900, ['item_passthrough_hatch', 'packer']],
    [emitter, 'gtceu:hv_voltage_coil', gt('soldering_alloy'), 8200, ['electromagnetic_separator', 'laser_engraver', 'polarizer', 'world_accelerator']],
    [sensor, 'pneumaticcraft:pressure_gauge_module', gt('soldering_alloy'), 7600, ['scanner', 'solar_panel']]
  ]
  families.forEach(([component, tooling, fluid, volume, machines]) => {
    machines.forEach(id => {
      upgrade(id, [hull, '2x ' + component, '8x ' + plate, '6x ' + interlock,
        '6x ' + cable, '6x ' + laminate, '2x ' + tooling], 7300, 327680, fluid, volume)
    })
  })
  ;[['centrifuge', motor], ['chemical_reactor', pump]].forEach(([id, component]) => {
    upgrade(id, [hull, '2x ' + component, '6x ' + interlock, '6x ' + americium,
      '12x ' + winding, '6x ' + laminate], 6700, 126976, coolant, 6800)
  })

  ;[1, 2, 4, 16].forEach(amps => {
    const id = 'transformer_' + amps + 'a'
    const conductor = amps <= 4 ? winding : hexCable
    upgrade(id, [hull, (2 * amps) + 'x ' + voltageCoil, (3 * amps) + 'x ' + shunt,
      (3 * amps) + 'x ' + conductor, '6x ' + reserve, '6x ' + laminate],
    6000 + 180 * amps, amps <= 4 ? 126976 : 393216, coolant, 7200)
  })
  ;[[1, 'transformer_1a'], [4, 'transformer_4a'], [8, 'voltage_coil'], [16, 'transformer_16a']].forEach(([amps, core]) => {
    const id = amps + 'a_energy_converter'
    upgrade(id, [uv(core), hull, (3 * amps) + 'x ' + shunt, (3 * amps) + 'x ' + cable,
      '6x ' + interlock, '6x ' + reserve, '6x ' + laminate, '2x gtceu:gold_single_cable'],
    6600 + 170 * amps, 393216, coolant, 7400)
  })

  upgrade('battery_hull', ['4x ' + voltageCoil, '8x ' + americium, '12x ' + shunt,
    '6x ' + reserve, '8x ' + laminate], 5900, 126976, coolant, 6400)
  ;[4, 8, 16].forEach(slots => {
    const id = 'battery_buffer_' + slots + 'x'
    upgrade(id, [hull, slots + 'x ' + voltageCoil, slots + 'x ' + shunt,
      (slots * 2) + 'x ' + winding, '6x ' + reserve, '6x ' + laminate],
    6000 + 150 * slots, slots <= 4 ? 126976 : 327680, coolant, 7200)
  })
  ;['charger_4x', 'diode'].forEach(id => {
    upgrade(id, [hull, '6x ' + voltageCoil, '8x ' + shunt, '6x ' + reserve,
      '6x ' + cable, '6x ' + laminate], 6900, 327680, coolant, 7400)
  })
  upgrade('lapotronic_battery', [uv('battery_hull'), '12x ' + americium, '12x ' + shunt,
    '6x ' + interlock, '6x ' + reserve, '8x ' + laminate], 7000, 126976, coolant, 8000)
  upgrade('naquadria_battery', [uv('battery_hull'), '12x gtceu:naquadria_dust', '12x ' + shunt,
    '6x ' + interlock, '6x ' + reserve, '8x ' + laminate], 8200, 393216, coolant, 8600)

  ;[['source', emitter, 'energy_output_hatch_16a'], ['target', sensor, 'energy_input_hatch_16a']].forEach(([side, optical, hatch]) => {
    const low = '256a_laser_' + side + '_hatch'
    const middle = '1024a_laser_' + side + '_hatch'
    const high = '4096a_laser_' + side + '_hatch'
    upgrade(low, [uv(hatch), '2x ' + field, '4x ' + optical, '12x ' + optics,
      '8x ' + interlock, '8x ' + quadCable], 7300, 393216, shield, 7400)
    upgrade(middle, ['4x ' + uv(low), '4x ' + optical, '16x ' + optics, '12x ' + shunt,
      '10x ' + interlock, '4x ' + uvCircuit], 8500, 458752, shield, 8200)
    upgrade(high, ['4x ' + uv(middle), '4x ' + field, '20x ' + optics, '16x ' + interlock,
      '16x ' + shunt, '12x ' + hexCable, '8x ' + uvCircuit], 9600, 507904, shield, 9000)
  })

  upgrade('parallel_hatch', [hull, '4x ' + robot, '8x ' + interlock, '6x ' + uvCircuit,
    '6x ae2:pattern_provider', '6x ' + quadCable], 8000, 393216)
  upgrade('quantum_chest', [hull, '4x ' + conveyor, '8x ' + interlock, '6x ' + uvCircuit,
    '6x gtceu:gregsingularity_zpm_storage_backplane', '6x ae2:storage_bus'], 7600, 393216, shield, 7800)
  upgrade('quantum_tank', [hull, '4x ' + pump, '8x ' + laminate, '8x ' + interlock,
    '6x gtceu:gregsingularity_zpm_storage_backplane', '6x ae2:storage_bus'], 7700, 393216, coolant, 7800)
})
