ServerEvents.recipes(event => {
  const gt = id => 'gtceu:' + id
  const part = id => 'kubejs:luv_' + id
  const prefix = 'zero_shift:luv_research/'
  const plate = gt('rhodium_plated_palladium_plate')
  const cable = gt('niobium_titanium_single_cable')
  const optics = part('optical_core')
  const clock = part('clock_matrix')
  const pack = part('processor_package')
  const laminate = part('dielectric_laminate')
  const casing = gt('computer_casing')
  const advanced = gt('advanced_computer_casing')
  const circuit = gt('nano_processor_mainframe')
  const quantum = gt('quantum_processor_computer')
  const cryo = 'kubejs:chilled_vacuum_coolant'
  const shield = 'kubejs:vacuum_shield_gas'
  const observer = 'create:content_observer'
  const gauge = 'pneumaticcraft:pressure_gauge_module'
  const relay = 'immersiveengineering:connector_hv_relay'
  const materialData = Java.loadClass('com.gregtechceu.gtceu.api.data.chemical.material.ItemMaterialData')
  const materialKeys = Java.loadClass('java.util.Map').__javaObject__.getMethod('keySet', [])

  function make(id, inputs, count, ticks, power, fluid) {
    const output = gt(id)
    if (id === 'data_orb') {
      // Preserve research records and the recipe for clearing a recorded orb.
      event.remove({ output: output, type: 'gtceu:assembler' })
      event.remove({ output: output, type: 'gtceu:circuit_assembler' })
    } else {
      event.remove({ output: output })
      // The stock recycling composition includes materials absent from these recipes.
      clearRecycling(Item.of(output).getItem())
      event.remove({ id: gt('macerator/macerate_' + id) })
      event.remove({ id: gt('arc_furnace/arc_' + id) })
      event.remove({ id: gt('extractor/extract_' + id) })
    }
    const recipe = event.recipes.gtceu.assembler(prefix + id)
    inputs.forEach(input => recipe.itemInputs(input))
    return recipe.itemOutputs(count + 'x ' + output).duration(ticks).EUt(power).inputFluids(Fluid.of(fluid, 1600))
  }
  function clearRecycling(item) {
    materialData.clearMaterialInfo(item)
    materialKeys.invoke(materialData.UNRESOLVED_ITEM_MATERIAL_INFO, []).removeIf(stack => stack.getItem().equals(item))
  }

  make('computer_casing', [
    gt('assembly_line_casing'), '4x ' + plate, '2x ' + laminate, '2x ' + part('busbar'),
    '2x gtceu:hssg_plate', '2x kubejs:iv_bulkhead', '2x immersiveengineering:steel_scaffolding_standard'
  ], 4, 2400, 7680, gt('lubricant'))
  make('advanced_computer_casing', [
    '2x ' + casing, '2x ' + optics, '2x ' + clock, '4x ' + plate, '4x gtceu:laminated_glass', circuit,
    '2x ' + observer, '2x ' + relay
  ], 2, 2700, 7680, shield)
  make('computer_heat_vent', [
    '2x ' + casing, '2x kubejs:iv_cooling_jacket', '4x gtceu:hssg_plate', '2x gtceu:iv_electric_motor',
    '2x gtceu:iv_electric_pump', '2x create:encased_fan', '2x pneumaticcraft:heat_sink'
  ], 4, 2500, 7680, cryo)
  make('normal_optical_pipe', [
    '2x ' + optics, '4x ' + laminate, '4x ae2:fluix_smart_dense_cable',
    '4x ' + cable, '4x gtceu:laminated_glass'
  ], 4, 2300, 7680, shield)
  make('data_orb', [
    '2x gtceu:data_stick', '2x ' + optics, '2x ' + pack, '2x ' + plate,
    '2x ae2:cell_component_256k', '2x ' + clock
  ], 2, 2860, 8000, shield)
  make('advanced_data_access_hatch', [
    '2x gtceu:basic_data_access_hatch', '2x gtceu:data_orb', advanced,
    '4x ' + optics, '4x ' + clock, '2x ' + quantum, '4x ' + cable
  ], 1, 3200, 26624, shield)

  ;[['receiver', 'sensor'], ['transmitter', 'emitter']].forEach(([side, device]) => {
    make('computation_' + side + '_hatch', [
      advanced, '2x ' + gt('luv_' + device), '4x ' + optics, '4x ' + clock,
      '4x gtceu:normal_optical_pipe', '2x ' + quantum, '2x ae2:me_p2p_tunnel'
    ], 1, 3250, 26624, shield)
  })
  make('object_holder', [
    advanced, gt('luv_robot_arm'), '2x gtceu:luv_sensor', '4x ' + optics,
    '2x ' + clock, '4x ' + plate, '4x kubejs:vacuum_gasket', '2x create:mechanical_arm', '2x ' + gauge
  ], 1, 3200, 24576, gt('lubricant'))
  make('research_station', [
    gt('luv_machine_hull'), '4x ' + advanced, gt('object_holder'), gt('advanced_data_access_hatch'),
    '4x ' + clock, '4x ' + quantum, '4x gtceu:luv_emitter', '4x ae2:me_p2p_tunnel', '2x ' + relay
  ], 1, 4700, 30720, shield)

  make('hpca_empty_component', [
    casing, '2x ' + laminate, '2x ' + plate, '2x gtceu:computer_heat_vent', '2x ' + cable
  ], 3, 2460, 7680, gt('lubricant'))
  make('hpca_computation_component', [
    gt('hpca_empty_component'), '4x ' + clock, '4x ' + pack, '2x ' + quantum,
    '4x ae2:cell_component_256k', '2x ' + optics
  ], 1, 3400, 28672, shield)
  make('hpca_heat_sink_component', [
    gt('hpca_empty_component'), '2x gtceu:computer_heat_vent', '4x gtceu:hssg_plate',
    '4x ' + plate, '2x kubejs:iv_cooling_jacket'
  ], 2, 2800, 22528, cryo)
  make('high_performance_computation_array', [
    gt('luv_machine_hull'), '4x ' + advanced, gt('hpca_computation_component'), '2x gtceu:hpca_heat_sink_component',
    '4x ' + quantum, '4x ' + optics, '2x ae2:256k_crafting_storage', '4x ' + cable,
    '2x immersiveengineering:capacitor_hv'
  ], 1, 4600, 30720, shield)
  make('hpca_advanced_computation_component', [
    '2x gtceu:hpca_computation_component', '4x gtceu:wetware_processor', '4x gtceu:crystal_processor_assembly',
    '4x ' + optics, '4x ae2:cell_component_256k', part('ignition_report')
  ], 1, 4500, 32000, shield)
  make('hpca_active_cooler_component', [
    '2x gtceu:hpca_heat_sink_component', '2x gtceu:luv_electric_pump', '4x kubejs:iv_cooling_jacket',
    '4x ' + plate, '4x ' + clock, '4x kubejs:vacuum_gasket',
    '2x pneumaticcraft:advanced_pressure_tube', '2x pneumaticcraft:heat_sink', '2x ' + gauge
  ], 1, 3520, 28672, cryo)
  make('hpca_bridge_component', [
    gt('hpca_empty_component'), gt('computation_receiver_hatch'), gt('computation_transmitter_hatch'),
    '4x ' + optics, '4x ' + clock, '2x ' + quantum, '2x ae2:me_p2p_tunnel'
  ], 1, 3900, 30720, shield)
})
