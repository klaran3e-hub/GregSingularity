ServerEvents.recipes(event => {
  const a = name => 'ae2:' + name
  const gt = name => 'gtceu:' + name
  const ks = name => 'kubejs:' + name
  const prefix = 'zero_shift:me/'
  const shell = ks('me_isolation_shell')
  const laminate = ks('me_piezo_laminate')
  const foil = ks('me_memory_foil')
  const etched = ks('me_etched_foil')
  const pattern = ks('me_pattern_laminate')
  const link = ks('me_optical_link')
  const oilPaper = ks('mv_impregnated_insulation')
  const dielectric = ks('mv_dielectric_oil')
  const seal = ks('chemical_grade_seal')
  const steel = gt('steel_plate')
  const frame = ks('pressed_steel_frame')
  const polymer = gt('polyethylene_plate')
  const circuit = gt('good_electronic_circuit')
  const silicon = gt('silicon_ingot')
  const certus = a('certus_quartz_crystal')
  const fluix = a('fluix_crystal')
  const fiber = a('quartz_fiber')
  const solder = ks('tin_solder_preform')
  const contact = ks('copper_contact_strip')
  const water = gt('distilled_water')
  const logic = a('logic_processor')
  const calc = a('calculation_processor')
  const eng = a('engineering_processor')
  const basic = a('fluix_glass_cable')
  const formation = a('formation_core')
  const annihilation = a('annihilation_core')
  const copper = gt('copper_single_cable')

  const retiredTypes = ['minecraft:crafting_shaped', 'minecraft:crafting_shapeless', 'minecraft:smithing_transform',
    'minecraft:stonecutting', 'minecraft:blasting', 'minecraft:smelting', 'ae2:inscriber', 'ae2:charger', 'ae2:transform']
  retiredTypes.forEach(type => event.remove({ mod: 'ae2', type: type }))
  const critical = ['charger', 'inscriber', 'energy_acceptor', 'cable_energy_acceptor', 'controller', 'drive',
    'chest', 'terminal', 'crafting_terminal', 'storage_bus', 'import_bus', 'export_bus', 'fluix_crystal',
    'fluix_glass_cable', 'logic_processor', 'calculation_processor', 'engineering_processor',
    'item_storage_cell_1k', 'cell_component_1k', 'molecular_assembler', 'pattern_provider', 'silicon']
  critical.forEach(id => event.remove({ output: a(id) }))
  event.remove({ output: silicon })
  event.replaceInput({ input: a('silicon') }, a('silicon'), silicon)
  event.remove({ output: gt('mv_1a_energy_converter') })
  event.remove({ output: gt('mv_circuit_assembler') })

  function machine(type, id, items, output, ticks, power) {
    const recipe = event.recipes.gtceu[type](prefix + id)
    items.forEach(item => recipe.itemInputs(item))
    return recipe.itemOutputs(output).EUt(power).duration(ticks)
  }
  function assemble(id, items, output, ticks, power) {
    return machine('assembler', id, items, output, ticks || 620, power || 96)
  }
  function build(id, items, power, ticks) {
    return assemble(id, items, a(id), ticks, power)
  }
  function inscribe(id, plate, press, output) {
    event.custom({ type: 'ae2:inscriber', mode: 'inscribe',
      ingredients: { middle: { item: plate }, top: { item: press } }, result: { item: output }
    }).id(prefix + id)
  }
  function charge(id, input, output) {
    event.custom({ type: 'ae2:charger', ingredient: { item: input }, result: { item: output } }).id(prefix + id)
  }

  event.shaped(a('guide'), ['PC', 'BP'], { P: 'minecraft:paper', C: certus, B: 'minecraft:book' }).id(prefix + 'guide')
  build('meteorite_compass', ['minecraft:compass', gt('basic_electronic_circuit'), ks('magnetic_armature'), contact, seal], 28, 460)
  assemble('isolation_shell', [gt('mv_machine_casing'), '2x ' + frame, '2x ' + polymer, seal, '2x ' + steel, oilPaper], shell, 600, 96)
  assemble('mv_power_converter', [gt('lv_1a_energy_converter'), gt('mv_machine_hull'), '2x ' + circuit,
    '2x ' + copper, gt('mv_electric_motor'), shell, '2x ' + seal], gt('mv_1a_energy_converter'), 860, 120)
  assemble('mv_circuit_assembler', [gt('lv_circuit_assembler'), gt('mv_machine_hull'), '2x ' + circuit,
    '2x ' + gt('mv_conveyor_module'), ks('sealed_mv_module'), '2x ' + contact, '2x ' + seal], gt('mv_circuit_assembler'), 820, 120)
  build('charger', [shell, gt('mv_electric_motor'), circuit, '2x ' + certus, '2x ' + copper, contact], 96, 620)
  charge('charge_certus', certus, a('charged_certus_quartz_crystal'))
  machine('mixer', 'grow_fluix', [a('charged_certus_quartz_crystal'), '2x ' + gt('quartzite_gem'),
    '2x minecraft:redstone', seal], '2x ' + fluix, 560, 96).inputFluids(Fluid.of(water, 500))
  machine('electric_blast_furnace', 'reduce_silicon', ['2x ' + gt('quartzite_dust'), '2x minecraft:charcoal',
    ks('furnace_lining_insert'), gt('calcite_dust')], silicon, 1000, 96)
    .blastFurnaceTemp(1750).inputFluids(Fluid.of(gt('hydrogen'), 250))
  assemble('quartz_fiber', ['2x ' + certus, '2x minecraft:glass_pane', polymer, ks('strainer_mesh')], '4x ' + fiber, 460, 96)
  event.custom({
    type: 'pneumaticcraft:pressure_chamber', inputs: [{ item: fiber }, { item: seal }, { item: fluix }, { item: polymer }],
    pressure: 4.1, results: [{ item: laminate, count: 2 }]
  }).id(prefix + 'press_piezo_laminate')
  assemble('memory_foil', ['2x ' + silicon, '2x ' + contact, '2x ' + laminate, gt('gold_plate'), oilPaper, polymer], foil, 680, 96)
    .inputFluids(Fluid.of(dielectric, 125))
  build('inscriber', [shell, '2x ' + gt('mv_electric_piston'), circuit, '2x ' + laminate, seal, '2x ' + fiber], 120, 900)
  assemble('press_blank', ['2x ' + steel, frame, ks('abrasive_paste'), gt('aluminium_plate')], ks('me_press_blank'), 480, 96)
  const prints = [
    ['silicon', 'printed_silicon', silicon],
    ['logic_processor', 'printed_logic_processor', foil],
    ['calculation_processor', 'printed_calculation_processor', foil],
    ['engineering_processor', 'printed_engineering_processor', etched]
  ]
  assemble('engineering_foil', [foil, '2x ' + certus, gt('phenolic_printed_circuit_board'), '2x ' + contact, solder, oilPaper], etched, 740, 120)
    .inputFluids(Fluid.of(dielectric, 125))
  prints.forEach(([name, print, input]) => {
    const press = a(name + '_press')
    inscribe('print_' + name, input, press, a(print))
    inscribe('copy_' + name + '_press', ks('me_press_blank'), press, press)
  })
  for (const [id, auxiliary, ticks] of [['logic', contact, 580], ['calculation', certus, 720], ['engineering', laminate, 920]]) {
    machine('circuit_assembler', id + '_processor', [a('printed_' + id + '_processor'), a('printed_silicon'),
      '2x ' + solder, circuit, auxiliary, 'minecraft:redstone'], a(id + '_processor'), ticks, 120)
  }
  machine('macerator', 'certus_dust', [certus], a('certus_quartz_dust'), 260, 96)
  machine('macerator', 'fluix_dust', [fluix], a('fluix_dust'), 320, 96)
  machine('macerator', 'sky_dust', [a('sky_stone_block')], a('sky_dust'), 320, 96)
  machine('chemical_bath', 'ender_dust', [gt('ender_pearl_dust')], a('ender_dust'), 460, 120)
    .inputFluids(Fluid.of(gt('distilled_water'), 250))

  build('formation_core', [logic, '2x ' + laminate, '2x ' + certus, contact, solder], 96, 580)
  build('annihilation_core', [logic, '2x ' + laminate, '2x ' + gt('quartzite_gem'), contact, solder], 96, 580)
  build('energy_acceptor', [shell, '2x ' + circuit, '2x ' + laminate, '2x ' + copper, frame, seal], 120, 900)
  build('energy_cell', [shell, calc, '2x ' + laminate, '2x ' + gt('mv_sodium_battery'), '2x ' + polymer], 120, 920)
  build('dense_energy_cell', ['4x ' + a('energy_cell'), '2x ' + pattern, eng, gt('hv_machine_hull'), seal], 480, 1320)
  build('controller', [shell, '2x ' + eng, '2x ' + calc, '4x ' + laminate,
    '4x ' + a('sky_stone_block'), '2x ' + copper, '2x ' + seal], 120, 1240)
  build('drive', [shell, eng, '2x ' + logic, '2x ' + formation, '2x ' + gt('mv_conveyor_module'), '2x ' + seal], 120, 1120)
  build('chest', [shell, a('terminal'), eng, formation, '2x ' + laminate, seal], 120, 880)
  build('cell_workbench', [shell, calc, '2x ' + foil, gt('mv_electric_piston'), fiber, seal], 120, 920)
  build('cable_energy_acceptor', [a('energy_acceptor'), basic, polymer, '2x ' + contact], 96, 440)
  build('cable_anchor', [ks('drawer_slide'), '2x ' + contact, '2x ' + steel, polymer], 96, 400)

  assemble('glass_cable', ['2x ' + fiber, '2x ' + fluix, laminate, polymer], '4x ' + basic, 520, 96)
  assemble('covered_cable', ['4x ' + basic, '2x ' + polymer, seal, '2x ' + ks('pressed_insulation')], '4x ' + a('fluix_covered_cable'), 560, 96)
  assemble('smart_cable', ['4x ' + a('fluix_covered_cable'), calc, pattern, '2x ' + contact], '4x ' + a('fluix_smart_cable'), 600, 384)
  assemble('dense_covered_cable', ['4x ' + a('fluix_covered_cable'), '2x ' + pattern, gt('hv_machine_casing'), seal], a('fluix_covered_dense_cable'), 760, 480)
  assemble('dense_smart_cable', [a('fluix_covered_dense_cable'), '2x ' + a('fluix_smart_cable'), link, eng], a('fluix_smart_dense_cable'), 880, 1536)

  const colors = ['white', 'orange', 'magenta', 'light_blue', 'yellow', 'lime', 'pink', 'gray', 'light_gray',
    'cyan', 'purple', 'blue', 'brown', 'green', 'red', 'black']
  for (const family of ['glass', 'covered', 'smart', 'covered_dense', 'smart_dense']) {
    colors.forEach(color => {
      const id = color + '_' + family + '_cable'
      build(id, [a('fluix_' + family + '_cable'), 'minecraft:' + color + '_dye', polymer], 96, 240)
        .inputFluids(Fluid.of(water, 50))
    })
  }
  build('terminal', ['2x ' + a('monitor'), logic, calc, formation, basic, foil], 120, 860)
  build('crafting_terminal', [a('terminal'), eng, '2x ' + foil, 'minecraft:crafting_table', seal], 120, 920)
  build('monitor', ['2x minecraft:glass_pane', laminate, contact, logic, polymer], 96, 520)
  build('dark_monitor', [a('monitor'), 'minecraft:black_dye', polymer, fiber], 96, 320)
  build('semi_dark_monitor', [a('monitor'), 'minecraft:gray_dye', polymer, fiber], 96, 320)
  build('storage_monitor', [a('terminal'), calc, '2x ' + fiber, contact], 120, 660)
  build('conversion_monitor', [a('storage_monitor'), a('import_bus'), a('export_bus'), calc, seal], 120, 780)
  build('import_bus', [annihilation, gt('mv_conveyor_module'), logic, basic, seal], 120, 820)
  build('export_bus', [formation, gt('mv_conveyor_module'), logic, basic, seal], 120, 820)
  build('storage_bus', [formation, annihilation, ks('drawer_selector'), '2x ' + basic, eng, seal], 120, 900)
  build('interface', [shell, formation, annihilation, calc, gt('mv_conveyor_module'), seal], 120, 850)
  build('cable_interface', [a('interface'), basic, contact, polymer], 96, 420)

  build('item_cell_housing', [shell, '2x ' + laminate, '2x ' + steel, seal, fiber], 96, 540)
  build('fluid_cell_housing', [a('item_cell_housing'), gt('mv_electric_pump'), '2x ' + seal, gt('bronze_small_fluid_pipe')], 120, 720)
  const cells = [
    ['1k', 120, logic, foil], ['4k', 120, calc, laminate],
    ['16k', 480, eng, pattern], ['64k', 1536, eng, link], ['256k', 1920, gt('micro_processor_computer'), ks('ev_calibrated_wafer')]
  ]
  let previous = a('item_cell_housing')
  const storageKinds = ['item', 'fluid']
  cells.forEach(([size, power, processor, part]) => {
    const component = a('cell_component_' + size)
    build('cell_component_' + size, ['3x ' + previous, '2x ' + processor, '2x ' + part, foil, solder], power, 620 + power)
    previous = component
    storageKinds.forEach(kind => {
      const storage = kind + '_storage_cell_' + size
      build(storage, [component, a(kind + '_cell_housing'), '2x ' + seal, laminate], power, 520 + power)
      build('portable_' + kind + '_cell_' + size, [a(storage), a('energy_cell'), a('terminal'), shell, seal], power, 680 + power)
    })
    build(size + '_crafting_storage', [a('crafting_unit'), component, '2x ' + pattern, processor, seal], size === '1k' ? 120 : Math.max(480, power), 840 + power)
  })
  build('view_cell', [a('item_cell_housing'), logic, laminate, '2x minecraft:glass_pane'], 120, 560)

  assemble('pattern_laminate', ['2x ' + foil, '2x ' + oilPaper, eng,
    gt('phenolic_printed_circuit_board'), circuit, '2x ' + seal], pattern, 980, 120)
    .inputFluids(Fluid.of(dielectric, 250))
  machine('circuit_assembler', 'align_optical_link', [pattern, '2x ' + ks('conditioned_wafer'), '2x ' + gt('titanium_plate'),
    gt('micro_processor_computer'), '2x ' + fiber], link, 1000, 1536)
    .cleanroom(Java.loadClass('com.gregtechceu.gtceu.api.machine.multiblock.CleanroomType').CLEANROOM)

  build('blank_pattern', [pattern, foil, '2x ' + polymer, contact], 112, 640)
  build('pattern_provider', [a('interface'), '2x ' + pattern, '2x ' + eng, gt('mv_robot_arm'), '2x ' + seal, oilPaper], 120, 1160)
  build('cable_pattern_provider', [a('pattern_provider'), a('fluix_smart_cable'), contact, polymer], 384, 540)
  build('crafting_unit', [shell, '2x ' + pattern, '2x ' + calc, '2x ' + logic, gt('mv_machine_casing'), seal, oilPaper], 120, 1040)
  build('crafting_accelerator', [a('crafting_unit'), '2x ' + eng, '2x ' + pattern, gt('hv_emitter'), seal], 480, 980)
  build('crafting_monitor', [a('crafting_unit'), a('storage_monitor'), '2x ' + pattern, calc, seal], 480, 800)
  build('molecular_assembler', [shell, a('inscriber'), '2x ' + pattern, '2x ' + formation, '2x ' + annihilation,
    gt('mv_robot_arm'), '2x ' + seal, oilPaper], 120, 1360)
  build('pattern_encoding_terminal', [a('crafting_terminal'), a('blank_pattern'), pattern, eng, seal], 120, 900)
  build('pattern_access_terminal', [a('terminal'), a('pattern_provider'), pattern, eng, seal], 480, 840)

  build('crank', [ks('shaft_bushing'), ks('tool_handle'), ks('drawer_slide'), steel, certus], 96, 400)
  build('growth_accelerator', [a('charger'), '2x ' + calc, '2x ' + basic, laminate, polymer], 120, 900)
  build('vibration_chamber', [a('energy_acceptor'), gt('hv_combustion'), '2x ' + eng, pattern, seal], 480, 1160)
  build('crystal_resonance_generator', [a('vibration_chamber'), '2x ' + link, '4x ' + a('fluix_block'), gt('ev_machine_hull')], 1920, 1400)
  build('condenser', [shell, '2x ' + eng, '2x ' + annihilation, pattern, gt('hv_electric_pump'), seal], 480, 1180)
  build('io_port', [a('drive'), '2x ' + calc, '2x ' + gt('hv_conveyor_module'), pattern, seal], 480, 1120)
  build('annihilation_plane', [a('import_bus'), '2x ' + annihilation, gt('hv_electric_piston'), pattern, seal], 480, 980)
  build('formation_plane', [a('export_bus'), '2x ' + formation, gt('hv_robot_arm'), pattern, seal], 480, 980)
  build('level_emitter', [a('storage_monitor'), gt('mv_sensor'), '2x ' + contact, logic, seal], 120, 720)
  build('energy_level_emitter', [a('level_emitter'), a('energy_cell'), '2x ' + contact, calc], 120, 700)
  build('toggle_bus', [a('level_emitter'), basic, gt('mv_electric_piston'), logic, polymer], 120, 580)
  build('inverted_toggle_bus', [a('toggle_bus'), a('inverter_card'), calc, contact], 120, 580)
  build('me_p2p_tunnel', [a('interface'), '2x ' + a('fluix_smart_cable'), gt('hv_sensor'), '2x ' + pattern, eng], 480, 1040)

  build('basic_card', [foil, '2x ' + logic, polymer, contact], 120, 580)
  build('advanced_card', [a('basic_card'), '2x ' + eng, '2x ' + pattern, polymer], 480, 840)
  const cards = [
    ['redstone', 'minecraft:redstone', 120], ['inverter', gt('resistor'), 120],
    ['capacity', a('cell_component_1k'), 120], ['fuzzy', calc, 120],
    ['equal_distribution', gt('mv_conveyor_module'), 120], ['energy', a('energy_cell'), 120],
    ['speed', gt('hv_electric_motor'), 384], ['crafting', a('blank_pattern'), 480],
    ['void', a('condenser'), 480]
  ]
  cards.forEach(([name, part, power]) => {
    build(name + '_card', [a(power > 120 ? 'advanced_card' : 'basic_card'), part, foil, polymer, solder], power, 480 + power)
  })

  build('fluix_pearl', ['minecraft:ender_pearl', '2x ' + fluix, '2x ' + laminate, seal], 120, 760)
  build('wireless_receiver', [a('fluix_pearl'), pattern, gt('hv_emitter'), eng, fiber], 480, 920)
  build('wireless_access_point', [a('wireless_receiver'), a('interface'), gt('hv_sensor'), '2x ' + pattern, seal], 480, 1160)
  build('wireless_booster', [a('wireless_receiver'), '2x ' + laminate, '2x ' + fluix, polymer], 480, 680)
  build('wireless_terminal', [a('terminal'), a('wireless_receiver'), a('energy_cell'), pattern, seal], 480, 1050)
  build('wireless_crafting_terminal', [a('wireless_terminal'), a('crafting_terminal'), link, eng, seal], 1536, 1340)

  build('quantum_ring', ['2x ' + link, a('me_p2p_tunnel'), '2x ' + gt('titanium_plate'),
    '2x ' + a('fluix_smart_dense_cable'), gt('ev_machine_casing'), seal], 1920, 1600)
  build('quantum_link', ['2x ' + link, a('quantum_ring'), '2x ' + gt('micro_processor_computer'),
    a('dense_energy_cell'), ks('ev_calibrated_wafer')], 1920, 1760)
  const capsule = ks('singularity_pair_capsule')
  const entangled = a('quantum_entangled_singularity')
  machine('mixer', 'entangle_singularity', [a('singularity'), a('ender_dust'), '2x ' + link,
    ks('ev_calibrated_wafer')], capsule, 1560, 1920)
    .inputFluids(Fluid.of(ks('vacuum_shield_gas'), 800))
  // AE2 assigns one fresh frequency to both items when its transform recipe completes.
  event.custom({ type: 'ae2:transform', circumstance: { type: 'fluid', tag: 'minecraft:water' },
    ingredients: [{ item: capsule }], result: { item: entangled, count: 2 }
  }).id(prefix + 'link_singularity_pair')
  // Previously the mixer returned two plain AE2 items. A bound item carries a frequency tag.
  const unbound = { type: 'forge:nbt', item: entangled }
  event.shapeless(capsule, [unbound, unbound]).id(prefix + 'recover_unbound_singularities')

  let spatialBase = a('cell_component_64k')
  ;['2', '16', '128'].forEach(size => {
    const spatialComponent = a('spatial_cell_component_' + size)
    build('spatial_cell_component_' + size, ['2x ' + spatialBase, '2x ' + link,
      gt('micro_processor_computer'), ks('ev_calibrated_wafer'), seal], 1920, 1480)
    build('spatial_storage_cell_' + size, [spatialComponent, a('item_cell_housing'), '2x ' + link,
      '2x ' + gt('titanium_plate'), seal], 1920, 1260)
    spatialBase = spatialComponent
  })
  build('spatial_io_port', [a('io_port'), '2x ' + link, '2x ' + gt('ev_robot_arm'),
    gt('ev_machine_hull'), ks('ev_commissioning_report')], 1920, 1720)
  build('spatial_pylon', [a('fluix_smart_dense_cable'), '2x ' + link, '2x ' + gt('titanium_plate'), polymer, seal], 1920, 1100)
  build('spatial_anchor', [a('spatial_io_port'), a('dense_energy_cell'), '2x ' + link,
    '2x ' + gt('ev_emitter'), ks('ev_commissioning_report')], 1920, 1920)

  build('quartz_block', ['6x ' + certus, '2x ' + ks('abrasive_paste'), '2x ' + steel], 96, 540)
  build('fluix_block', ['6x ' + fluix, '2x ' + laminate, polymer], 96, 660)
  machine('electric_blast_furnace', 'vitrify_sky_stone', [a('sky_stone_block'), ks('refractory_mix'),
    ks('abrasive_paste')], a('smooth_sky_stone_block'), 480, 96).blastFurnaceTemp(1700)
  const shapes = [
    ['quartz_bricks', 'quartz_block', ks('refractory_mix')], ['quartz_pillar', 'quartz_block', ks('shaft_bushing')],
    ['cut_quartz_block', 'quartz_block', ks('saw_blade')], ['chiseled_quartz_block', 'cut_quartz_block', ks('iron_rivet')],
    ['smooth_quartz_block', 'quartz_block', ks('pressed_insulation')],
    ['sky_stone_brick', 'smooth_sky_stone_block', ks('refractory_mix')], ['sky_stone_small_brick', 'sky_stone_brick', ks('fired_lining')]
  ]
  shapes.forEach(([id, base, part]) => build(id, ['2x ' + a(base), ks('abrasive_paste'), part], 96, 420))
  const masonry = [
    ['quartz', 'quartz_block'], ['quartz_brick', 'quartz_bricks'], ['quartz_pillar', 'quartz_pillar'],
    ['cut_quartz', 'cut_quartz_block'], ['chiseled_quartz', 'chiseled_quartz_block'], ['smooth_quartz', 'smooth_quartz_block'],
    ['fluix', 'fluix_block'], ['sky_stone', 'sky_stone_block'], ['smooth_sky_stone', 'smooth_sky_stone_block'],
    ['sky_stone_brick', 'sky_stone_brick'], ['sky_stone_small_brick', 'sky_stone_small_brick']
  ]
  masonry.forEach(([name, base]) => {
    for (const [shape, count, part] of [['slab', 2, ks('abrasive_paste')], ['stairs', 3, ks('iron_rivet')], ['wall', 4, ks('refractory_mix')]]) {
      assemble(name + '_' + shape, [count + 'x ' + a(base), '2x ' + part, steel], '2x ' + a(name + '_' + shape), 360, 96)
    }
  })
  build('quartz_glass', ['4x minecraft:glass_pane', '2x ' + a('certus_quartz_dust'), laminate, polymer], 96, 620)
  build('quartz_vibrant_glass', ['2x ' + a('quartz_glass'), '2x minecraft:glowstone_dust', calc, polymer], 120, 680)
  build('quartz_fixture', [a('quartz_vibrant_glass'), '2x ' + contact, '2x ' + polymer], 96, 480)
  build('light_detector', [a('quartz_fixture'), gt('mv_sensor'), logic, contact], 120, 620)
  build('sky_stone_chest', ['4x ' + a('sky_stone_block'), 'minecraft:chest', '2x ' + ks('drawer_slide'), '2x ' + steel], 96, 720)
  build('smooth_sky_stone_chest', [a('sky_stone_chest'), '4x ' + a('smooth_sky_stone_block'), polymer, seal], 96, 640)
  build('sky_stone_tank', ['4x ' + a('smooth_sky_stone_block'), gt('steel_drum'), '2x ' + seal, a('quartz_glass')], 120, 720)
  build('not_so_mysterious_cube', ['6x ' + a('sky_stone_block'), a('quartz_block'), laminate, frame], 96, 640)

  for (const [input, output] of [['damaged', 'chipped'], ['chipped', 'flawed']]) {
    machine('mixer', 'restore_' + output + '_budding_quartz', [a(input + '_budding_quartz'),
      '2x ' + certus, laminate], a(output + '_budding_quartz'), 680, 120).inputFluids(Fluid.of(water, 750))
  }
  colors.forEach(color => {
    assemble(color + '_paint_ball', ['minecraft:' + color + '_dye', a('matter_ball'), polymer, ks('paraffin_cake')],
      '2x ' + a(color + '_paint_ball'), 320, 384)
    assemble(color + '_lumen_paint_ball', ['2x ' + a(color + '_paint_ball'), '2x minecraft:glowstone_dust', polymer],
      '2x ' + a(color + '_lumen_paint_ball'), 320, 384)
  })
  build('fluix_upgrade_smithing_template', ['2x ' + laminate, '2x ' + foil, a('fluix_block'),
    ks('ceramic_hv_substrate'), eng], 120, 900)
  const quartzTools = [
    ['axe', 4, gt('steel_bolt')],
    ['hoe', 3, gt('steel_screw')],
    ['pickaxe', 4, gt('steel_rod')],
    ['shovel', 2, gt('steel_ring')],
    ['sword', 3, gt('long_steel_rod')],
    ['cutting_knife', 2, gt('steel_foil')],
    ['wrench', 3, gt('steel_gear')]
  ]
  for (const [family, mineral] of [['certus_quartz', certus], ['nether_quartz', 'minecraft:quartz']]) {
    quartzTools.forEach(([tool, quantity, fitting]) => {
      build(family + '_' + tool, [quantity + 'x ' + mineral, '2x ' + steel, '2x ' + ks('tool_handle'), laminate, seal, fitting], 96, 560)
    })
  }
  for (const tool of ['axe', 'hoe', 'pickaxe', 'shovel', 'sword']) {
    event.custom({ type: 'minecraft:smithing_transform', template: { item: a('fluix_upgrade_smithing_template') },
      base: { item: a('certus_quartz_' + tool) }, addition: { item: a('fluix_block') }, result: { item: a('fluix_' + tool) }
    }).id(prefix + 'fluix_' + tool)
  }
  build('tiny_tnt', ['2x minecraft:gunpowder', '2x ' + a('certus_quartz_dust'), '2x minecraft:paper', seal], 96, 540)
  build('memory_card', [foil, calc, polymer, '2x ' + contact], 120, 620)
  build('network_tool', [a('certus_quartz_wrench'), a('memory_card'), a('energy_cell'), calc, polymer], 120, 760)
  build('charged_staff', [a('certus_quartz_sword'), a('energy_cell'), '2x ' + pattern, a('formation_core')], 480, 1100)
  build('matter_cannon', [a('charged_staff'), a('condenser'), '2x ' + pattern, eng, seal], 480, 1380)
  build('color_applicator', [a('network_tool'), a('item_storage_cell_1k'), a('energy_cell'), a('matter_ball'), seal], 480, 1040)
  build('entropy_manipulator', [a('matter_cannon'), a('dense_energy_cell'), '2x ' + link, gt('ev_electric_pump'),
    ks('ev_commissioning_report')], 1920, 1600)
})
