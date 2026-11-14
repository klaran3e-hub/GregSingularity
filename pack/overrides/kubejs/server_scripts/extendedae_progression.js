ServerEvents.recipes(event => {
  if (!Platform.isLoaded('expatternprovider')) return

  const ext = name => 'expatternprovider:' + name
  const ae = name => 'ae2:' + name
  const gt = name => 'gtceu:' + name
  const ks = name => 'kubejs:' + name
  const prefix = 'zero_shift:extended_ae/'
  const link = ks('me_optical_link')
  const laminate = ks('me_pattern_laminate')
  const shield = ks('vacuum_shield_gas')
  const evPlate = gt('titanium_plate')
  const ivPlate = gt('tungsten_steel_plate')
  const evCircuit = gt('micro_processor_computer')
  const ivCircuit = gt('micro_processor_mainframe')
  const luvCircuit = gt('nano_processor_mainframe')
  const logic = ae('logic_processor')
  const calc = ae('calculation_processor')
  const eng = ae('engineering_processor')
  const smart = ae('fluix_smart_cable')
  const dense = ae('fluix_smart_dense_cable')
  const ev = { power: 1920, permit: ks('ev_commissioning_report') }
  const iv = { power: 7680, permit: ks('iv_commissioning_report') }
  const luv = { power: 30720, permit: ks('luv_commissioning_report') }

  event.remove({ mod: 'expatternprovider', type: 'minecraft:crafting_shaped' })
  event.remove({ mod: 'expatternprovider', type: 'minecraft:crafting_shapeless' })
  event.remove({ mod: 'expatternprovider', type: 'expatternprovider:circuit_cutter' })
  event.remove({ id: ext('cutter/accumulation') })
  event.remove({ output: ext('infinity_cell') })

  function assemble(tier, id, items, ticks, liquidAmount) {
    const recipe = event.recipes.gtceu.assembler(prefix + id)
    items.forEach(item => recipe.itemInputs(item))
    recipe.itemOutputs(ext(id)).EUt(tier.power).duration(ticks)
      .notConsumable(Item.of(tier.permit)).inputFluids(Fluid.of(shield, liquidAmount))
  }

  assemble(ev, 'ex_import_bus_part', ['2x ' + ae('import_bus'), ae('capacity_card'),
    '2x ' + evPlate, gt('ev_conveyor_module'), evCircuit, link], 1820, 750)
  assemble(ev, 'ex_export_bus_part', ['2x ' + ae('export_bus'), ae('capacity_card'),
    '2x ' + evPlate, gt('ev_conveyor_module'), evCircuit, link], 1820, 750)
  assemble(ev, 'io_bus_upgrade', ['2x ' + ae('speed_card'), ae('capacity_card'),
    '2x ' + evPlate, gt('ev_conveyor_module'), evCircuit, link], 1850, 750)

  assemble(ev, 'ex_interface', ['2x ' + ae('interface'), '2x ' + ae('capacity_card'),
    '4x ' + evPlate, gt('ev_robot_arm'), evCircuit, link], 2200, 950)
  assemble(ev, 'interface_upgrade', ['3x ' + ae('capacity_card'), '4x ' + evPlate,
    gt('ev_robot_arm'), evCircuit, link, '2x ' + laminate], 2220, 950)
  assemble(ev, 'ex_pattern_provider', ['2x ' + ae('pattern_provider'), '2x ' + ae('capacity_card'),
    '4x ' + evPlate, gt('ev_robot_arm'), evCircuit, link, '2x ' + laminate], 2420, 1000)
  assemble(ev, 'pattern_provider_upgrade', ['3x ' + ae('capacity_card'), '4x ' + evPlate,
    gt('ev_robot_arm'), evCircuit, link, '3x ' + laminate, ae('blank_pattern')], 2440, 1000)
  assemble(ev, 'ex_pattern_access_part', ['2x ' + ae('pattern_access_terminal'), ae('monitor'),
    '2x ' + evPlate, evCircuit, link, '2x ' + laminate], 2000, 750)
  assemble(ev, 'pattern_terminal_upgrade', ['2x ' + ae('monitor'), '2x ' + evPlate,
    evCircuit, link, '2x ' + laminate, eng], 2020, 750)
  assemble(ev, 'ex_crafting_terminal', [ae('crafting_terminal'), 'minecraft:anvil',
    'minecraft:smithing_table', 'minecraft:stonecutter', '2x ' + evPlate, evCircuit, link], 2050, 800)

  assemble(ev, 'ex_drive', ['2x ' + ae('drive'), '2x ' + ae('capacity_card'),
    gt('ev_machine_hull'), gt('ev_conveyor_module'), evCircuit, link], 2420, 1100)
  assemble(ev, 'drive_upgrade', ['3x ' + ae('capacity_card'), gt('ev_machine_hull'),
    gt('ev_conveyor_module'), evCircuit, link, '2x ' + eng], 2460, 1100)
  assemble(ev, 'ex_charger', ['2x ' + ae('charger'), ae('energy_cell'), gt('ev_machine_hull'),
    '2x ' + gt('ev_electric_motor'), evCircuit, link], 2220, 850)
  assemble(ev, 'ex_inscriber', ['2x ' + ae('inscriber'), gt('ev_machine_hull'),
    '2x ' + gt('ev_electric_piston'), '2x ' + evCircuit, link, '2x ' + laminate], 2440, 1050)
  assemble(ev, 'ingredient_buffer', ['2x ' + ae('cell_component_1k'), '4x ' + ae('quartz_glass'),
    '4x ' + evPlate, gt('ev_conveyor_module'), evCircuit, laminate], 1810, 750)
  assemble(ev, 'pattern_modifier', ['4x ' + ae('blank_pattern'), '2x ' + logic,
    ae('memory_card'), '2x ' + evPlate, evCircuit, link], 1800, 700)

  assemble(ev, 'active_formation_plane', [ae('formation_plane'), ext('ex_export_bus_part'),
    '2x ' + eng, evPlate, evCircuit, link], 2130, 850)
  assemble(ev, 'mod_export_bus', [ext('ex_export_bus_part'), ae('memory_card'),
    '2x ' + logic, gt('ev_sensor'), evCircuit, link], 2060, 850)
  assemble(ev, 'mod_storage_bus', [ae('storage_bus'), ae('memory_card'),
    '2x ' + logic, gt('ev_sensor'), evCircuit, link], 2060, 850)
  assemble(ev, 'tag_export_bus', [ext('mod_export_bus'), '2x ' + ae('fuzzy_card'),
    '2x ' + calc, gt('ev_sensor'), evCircuit, link], 2200, 950)
  assemble(ev, 'tag_storage_bus', [ext('mod_storage_bus'), '2x ' + ae('fuzzy_card'),
    '2x ' + calc, gt('ev_sensor'), evCircuit, link], 2200, 950)
  assemble(ev, 'threshold_level_emitter', ['2x ' + ae('level_emitter'), '2x ' + calc,
    '2x ' + gt('ev_sensor'), evCircuit, smart, link], 2060, 800)
  assemble(ev, 'threshold_export_bus', [ext('ex_export_bus_part'), ext('threshold_level_emitter'),
    '2x ' + ae('redstone_card'), evCircuit, link, laminate], 2350, 950)

  assemble(ev, 'wireless_tool', ['2x ' + ae('wireless_receiver'), ae('energy_cell'),
    '2x ' + evPlate, gt('ev_sensor'), evCircuit, link], 1870, 750)
  assemble(ev, 'crystal_fixer', [ae('charger'), '8x ' + ae('certus_quartz_crystal'),
    '4x ' + ae('fluix_crystal'), gt('ev_electric_piston'), evCircuit, evPlate], 1960, 800)
  assemble(ev, 'me_packing_tape', ['4x minecraft:paper', '4x minecraft:slime_ball',
    '4x ' + gt('polyethylene_plate'), '2x ' + ae('fluix_dust'), evPlate], 1200, 400)
  assemble(ev, 'fishbig', ['9x minecraft:pufferfish', '2x ' + gt('polyethylene_plate'),
    '2x ' + ae('fluix_dust'), evPlate], 1000, 250)

  assemble(iv, 'caner', [ext('ingredient_buffer'), ext('ex_import_bus_part'),
    ext('ex_export_bus_part'), gt('iv_machine_hull'), gt('iv_electric_pump'),
    '2x ' + ivCircuit, '2x ' + link], 3150, 1600)
  assemble(iv, 'circuit_cutter', [ext('ex_inscriber'), ae('calculation_processor_press'),
    ae('engineering_processor_press'), ae('logic_processor_press'), ae('silicon_press'),
    gt('iv_machine_hull'), '2x ' + gt('iv_electric_motor'), '2x ' + ivCircuit], 3700, 1800)
  assemble(iv, 'ex_io_port', ['2x ' + ae('io_port'), gt('iv_machine_hull'),
    '2x ' + gt('iv_conveyor_module'), '2x ' + ivCircuit, '2x ' + link, '4x ' + ivPlate], 3320, 1600)
  assemble(iv, 'ex_molecular_assembler', ['2x ' + ae('molecular_assembler'),
    ext('ex_pattern_provider'), gt('iv_machine_hull'), '2x ' + gt('iv_robot_arm'),
    '2x ' + ivCircuit, '2x ' + link, '4x ' + laminate], 3620, 1850)
  assemble(iv, 'oversize_interface', ['2x ' + ext('ex_interface'), ext('ingredient_buffer'),
    gt('iv_machine_hull'), '2x ' + gt('iv_robot_arm'), '2x ' + ivCircuit,
    '2x ' + link, '4x ' + ivPlate], 3750, 1950)
  assemble(iv, 'precise_export_bus', [ext('threshold_export_bus'), ext('tag_export_bus'),
    '2x ' + gt('iv_sensor'), ivCircuit, '2x ' + link, '4x ' + ivPlate], 3020, 1450)
  assemble(iv, 'precise_storage_bus', [ext('tag_storage_bus'), ext('threshold_level_emitter'),
    '2x ' + gt('iv_sensor'), ivCircuit, '2x ' + link, '4x ' + ivPlate], 3020, 1450)

  assemble(iv, 'wireless_advanced_tool', [ext('wireless_tool'), 'minecraft:nether_star',
    ae('dense_energy_cell'), gt('iv_sensor'), '2x ' + ivCircuit, '2x ' + link], 3350, 1550)
  assemble(iv, 'wireless_connect', ['2x ' + ae('wireless_receiver'), '2x ' + dense,
    gt('iv_emitter'), gt('iv_sensor'), '2x ' + ivCircuit, '2x ' + link, '4x ' + ivPlate], 3440, 1700)
  assemble(iv, 'wireless_ex_ct', [ext('ex_crafting_terminal'), '2x ' + ae('wireless_receiver'),
    ae('dense_energy_cell'), gt('iv_emitter'), ivCircuit, '2x ' + link], 3220, 1550)
  assemble(iv, 'wireless_ex_pat', [ext('ex_pattern_access_part'), '2x ' + ae('wireless_receiver'),
    ae('dense_energy_cell'), gt('iv_emitter'), ivCircuit, '2x ' + link], 3220, 1550)
  assemble(iv, 'wireless_hub', ['2x ' + ext('wireless_connect'), ae('quantum_link'),
    gt('iv_machine_hull'), '2x ' + gt('iv_emitter'), '2x ' + ivCircuit, '4x ' + dense], 3880, 2150)

  const frame = ext('assembler_matrix_frame')
  const wall = ext('assembler_matrix_wall')
  assemble(luv, 'assembler_matrix_frame', ['8x ' + gt('niobium_titanium_plate'),
    '4x ' + ae('quartz_vibrant_glass'), gt('luv_machine_casing'),
    luvCircuit, '2x ' + link, '4x ' + laminate], 4250, 2000)
  assemble(luv, 'assembler_matrix_glass', ['4x ' + ae('quartz_vibrant_glass'),
    '2x ' + ivPlate, '2x ' + dense, '2x ' + logic, '2x ' + laminate], 3100, 1250)
  assemble(luv, 'assembler_matrix_wall', [frame, '4x ' + ivPlate,
    '2x ' + dense, '2x ' + link, '2x ' + laminate], 3500, 1550)
  assemble(luv, 'assembler_matrix_crafter', [wall, '2x ' + ext('ex_molecular_assembler'),
    gt('luv_machine_hull'), '2x ' + gt('luv_robot_arm'), '2x ' + luvCircuit, '4x ' + link], 5600, 2500)
  assemble(luv, 'assembler_matrix_pattern', [wall, '2x ' + ext('ex_pattern_provider'),
    ae('pattern_encoding_terminal'), gt('luv_emitter'), '2x ' + luvCircuit, '4x ' + link], 5100, 2300)
  assemble(luv, 'assembler_matrix_speed', [wall, '2x ' + ae('crafting_accelerator'),
    '4x ' + ae('speed_card'), '2x ' + gt('luv_electric_motor'), '2x ' + luvCircuit, '4x ' + link], 5400, 2450)

  // A block and its cable part are the same paid device in different forms.
  ;['ex_interface', 'ex_pattern_provider', 'oversize_interface'].forEach(name => {
    const device = ext(name)
    const cablePart = ext(name + '_part')
    event.shapeless(cablePart, [device]).id(prefix + name + '_to_part')
    event.shapeless(device, [cablePart]).id(prefix + name + '_to_block')
  })

  // Preserve material recovery for silicon blocks from existing worlds.
  event.shapeless('9x ' + gt('silicon_ingot'), [ext('silicon_block')]).id(prefix + 'reclaim_silicon')

  // The cutter automates printing at a material cost above the MV inscriber.
  ;[
    ['calculation', ks('me_memory_foil'), 'printed_calculation_processor'],
    ['engineering', ks('me_etched_foil'), 'printed_engineering_processor'],
    ['logic', ks('me_piezo_laminate'), 'printed_logic_processor'],
    ['silicon', gt('silicon_ingot'), 'printed_silicon']
  ].forEach(([name, input, output]) => {
    event.custom({
      type: ext('circuit_cutter'),
      item_input: { amount: 2, ingredient: { item: input } },
      fluid_input: { amount: 400, ingredient: { fluid: gt('distilled_water') } },
      output: { item: ae(output) }
    }).id(prefix + 'cutter/' + name)
  })
})
