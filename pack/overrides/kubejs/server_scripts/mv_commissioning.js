ServerEvents.recipes(event => {
  const ks = name => 'kubejs:' + name
  const gt = name => 'gtceu:' + name
  const lv = name => gt('lv_' + name)
  const pnc = name => 'pneumaticcraft:' + name
  const ie = name => 'immersiveengineering:' + name
  const create = name => 'create:' + name
  const aluminium = gt('aluminium_plate')
  const frame = ks('pressed_steel_frame')
  const lining = ks('furnace_lining_insert')
  const gasket = ks('pressure_gasket')
  const tape = ks('pressed_insulation')
  const foil = ks('copper_contact_strip')
  const solder = ks('tin_solder_preform')
  const copper = gt('copper_single_wire')
  const cable = gt('copper_single_cable')
  const base = gt('phenolic_circuit_board')
  const board = gt('phenolic_printed_circuit_board')
  const lvCircuit = gt('basic_electronic_circuit')
  const mvCircuit = gt('good_electronic_circuit')
  const mvCasing = gt('mv_machine_casing')
  const mvHull = gt('mv_machine_hull')
  const mvMotor = gt('mv_electric_motor')
  const mvPump = gt('mv_electric_pump')
  const rivet = ks('iron_rivet')
  const compressedIron = pnc('ingot_iron_compressed')
  const wall = pnc('pressure_chamber_wall')
  const tube = pnc('pressure_tube')
  const gauge = pnc('pressure_gauge')
  const gaugeModule = pnc('pressure_gauge_module')
  const safety = pnc('safety_tube_module')
  const regulator = pnc('regulator_tube_module')
  const station = pnc('charging_station')
  const stoneBase = pnc('stone_base')
  const compressedGear = pnc('compressed_iron_gear')
  const precision = create('precision_mechanism')
  const steelComponent = ie('component_steel')
  const joint = ks('sealed_boiler_joint')
  const control = ie('rs_engineering')

  const replacements = [
    pnc('air_compressor'), pnc('manual_compressor'), gauge, gaugeModule, safety, regulator,
    station, pnc('charging_module'), pnc('redstone_module'), pnc('flow_detector_module'), compressedGear,
    stoneBase, pnc('reinforced_stone'), pnc('air_canister'), pnc('thermal_compressor'),
    wall, tube, pnc('pressure_chamber_glass'), pnc('pressure_chamber_valve'), pnc('pressure_chamber_interface'), base, board,
    mvCircuit, copper, cable, mvCasing, mvHull, mvMotor, mvPump, gt('mv_steam_turbine'),
    gt('mv_assembler'), gt('mv_chemical_reactor')
  ]
  replacements.forEach(output => event.remove({ output: output }))

  const prefix = 'zero_shift:mv/'
  const shaped = (name, output, rows, keys) =>
    event.shaped(output, rows, keys).id(name.includes(':') ? name : prefix + name)
  const custom = (name, data) => event.custom(data).id(prefix + name)
  const pressure = (name, inputs, output, count, bar) => custom(name, {
    type: pnc('pressure_chamber'),
    inputs: inputs.map(item => ({ item: item })),
    pressure: bar,
    results: [{ item: output, count: count }]
  })
  function assemble(name, inputs, output, ticks, eut, water) {
    const recipe = event.recipes.gtceu.assembler(prefix + name)
    inputs.forEach(input => recipe.itemInputs(input))
    if (water) recipe.inputFluids(Fluid.of('minecraft:water', water))
    recipe.itemOutputs(output).duration(ticks).EUt(eut)
  }

  shaped(tube, '4x ' + tube, ['IRI', 'PCP', 'IRI'], {
    I: compressedIron, R: rivet, P: tape, C: gt('bronze_small_fluid_pipe')
  })
  assemble('compressed_iron_gear', [
    '2x ' + compressedIron, gt('steel_gear'), '2x ' + rivet, '2x ' + ks('shaft_bushing'), steelComponent
  ], compressedGear, 480, 28, 250)
  assemble('reinforced_stone', [
    '4x minecraft:stone', '2x ' + compressedIron, '2x ' + lining, frame, '2x ' + joint
  ], '4x ' + pnc('reinforced_stone'), 420, 24, 250)
  assemble('stone_base', [
    '2x ' + pnc('reinforced_stone'), tube, frame, '2x ' + rivet, joint
  ], stoneBase, 420, 24, 200)
  // The first pressure line uses dry seals from LV, so it can make its own gaskets.
  assemble('air_compressor', [
    '4x ' + compressedIron, '2x ' + tube, lv('electric_piston'), lv('electric_furnace'), compressedGear,
    precision, '2x ' + steelComponent, '2x ' + joint, stoneBase
  ], pnc('air_compressor'), 920, 28, 500)
  assemble('manual_compressor', [
    '2x ' + compressedIron, tube, stoneBase, lv('electric_piston'), create('gearbox'), compressedGear, joint
  ], pnc('manual_compressor'), 680, 24, 250)
  assemble('pressure_gauge', [
    compressedIron, '2x ' + foil, lv('sensor'), create('speedometer'), ks('glass_tube_blank'), joint
  ], gauge, 520, 24, 150)
  assemble('pressure_gauge_module', [gauge, tube, control, lv('emitter'), foil, tape],
    gaugeModule, 640, 24, 200)
  assemble('safety_tube_module', [gauge, tube, create('copper_valve_handle'), lv('fluid_regulator'), '2x ' + joint],
    safety, 680, 28, 250)
  assemble('regulator_tube_module', [safety, tube, control, precision, '2x ' + lv('voltage_coil')],
    regulator, 800, 28, 350)
  assemble('redstone_module', [gaugeModule, '2x ' + control, create('redstone_contact'), tube, '2x ' + foil],
    pnc('redstone_module'), 680, 28, 250)
  assemble('flow_detector_module', [gaugeModule, lv('fluid_regulator'), create('speedometer'), tube, '2x ' + joint],
    pnc('flow_detector_module'), 760, 28, 250)
  shaped(wall, '4x ' + wall, ['IRI', 'FLF', 'IRI'], {
    I: compressedIron, R: rivet, F: frame, L: lining
  })
  shaped(pnc('pressure_chamber_glass'), '2x ' + pnc('pressure_chamber_glass'), ['GPG', 'WIW', 'GPG'], {
    G: 'minecraft:glass_pane', P: tape, W: wall, I: compressedIron
  })
  assemble('pressure_chamber_valve', [
    '2x ' + compressedIron, tube, wall, '2x ' + joint, steelComponent, safety, create('copper_valve_handle')
  ], pnc('pressure_chamber_valve'), 660, 28, 250)
  assemble('pressure_chamber_interface', [
    '2x ' + compressedIron, wall, tube, lv('conveyor_module'), lvCircuit, create('deployer'), frame, '2x ' + tape
  ], pnc('pressure_chamber_interface'), 780, 28, 350)
  pressure('laminate_gaskets', [tape, ks('insulating_gum'), foil, ks('fibre_cord')], gasket, 2, 2.75)
  assemble('charging_station', [
    '2x ' + tube, gauge, lv('electric_pump'), '2x ' + compressedIron, '2x ' + gasket, steelComponent, frame
  ], station, 880, 28, 300)
  assemble('charging_module', [station, tube, gaugeModule, control, '2x ' + gasket, precision],
    pnc('charging_module'), 760, 28, 250)
  assemble('air_canister', [
    '2x ' + compressedIron, '2x ' + tube, gauge, create('copper_valve_handle'), '2x ' + gasket, steelComponent
  ], pnc('air_canister'), 740, 28, 300)
  assemble('thermal_compressor', [
    pnc('air_compressor'), ks('heat_exchange_core'), '2x ' + pnc('heat_pipe'), regulator, '2x ' + pnc('reinforced_pressure_tube'),
    mvMotor, '2x ' + ks('chemical_grade_seal'), ie('heavy_engineering')
  ], pnc('thermal_compressor'), 1360, 96, 800)

  assemble('phenolic_base', [
    '4x minecraft:paper', '2x ' + ks('insulating_gum'), aluminium, lining, tape, '2x ' + foil
  ], base, 520, 24, 350)
  shaped('pack_phenolic_preform', ks('phenolic_preform'), ['FBF', 'PTP', 'GCG'], {
    F: foil, B: base, P: aluminium, T: tape, G: ks('insulating_gum'), C: gt('resin_printed_circuit_board')
  })
  pressure('seal_phenolic_module', [ks('phenolic_preform'), gasket, foil], ks('sealed_mv_module'), 1, 3.5)
  assemble('print_phenolic_board', [ks('sealed_mv_module'), '2x ' + foil, '2x ' + solder, lvCircuit, tape],
    board, 660, 28, 300)
  assemble('bootstrap_circuit', [
    '2x ' + board, '4x ' + lvCircuit, '4x ' + gt('resistor'), '2x ' + gt('vacuum_tube'),
    '4x ' + solder, '2x ' + aluminium, '2x ' + copper, '2x ' + gasket, '2x ' + gaugeModule
  ], mvCircuit, 1560, 28, 700)

  custom('draw_copper_wire', {
    type: 'create:pressing', ingredients: [{ item: foil }], results: [{ item: copper, count: 2 }]
  })
  assemble('insulate_mv_cable', ['2x ' + copper, gasket, '2x ' + tape, '2x ' + ks('fibre_cord'), foil],
    '2x ' + cable, 440, 28, 250)
  assemble('mv_machine_casing', ['4x ' + aluminium, '2x ' + frame, '2x ' + lining, gasket, '2x ' + steelComponent],
    mvCasing, 680, 28, 400)
  assemble('mv_machine_hull', [mvCasing, lv('machine_hull'), '2x ' + cable, '2x ' + gasket, '2x ' + rivet, control],
    mvHull, 760, 28, 450)
  assemble('motor_rotor_core', [
    lv('electric_motor'), ks('magnetic_armature'), '2x ' + foil, aluminium, frame, gasket, precision
  ], ks('mv_rotor_core'), 620, 28, 350)
  assemble('mv_electric_motor', [
    ks('mv_rotor_core'), '2x ' + aluminium, '2x ' + cable, mvCircuit, '2x ' + gasket, ks('wound_stator')
  ], mvMotor, 760, 28, 400)
  assemble('mv_steam_turbine', [
    lv('steam_turbine'), mvHull, '2x ' + mvMotor, '2x ' + mvCircuit, lv('electric_pump'),
    '2x ' + ks('balanced_turbine_rotor'), '2x ' + gasket, create('rotation_speed_controller'), steelComponent
  ], gt('mv_steam_turbine'), 1260, 28, 850)
  assemble('mv_assembler', [
    mvHull, lv('assembler'), '3x ' + mvCircuit, '2x ' + mvMotor, '2x ' + frame, '2x ' + cable,
    '2x ' + precision, '2x ' + steelComponent, '2x ' + gasket
  ], gt('mv_assembler'), 1180, 28, 800)
  assemble('series_circuit_mv', [
    '2x ' + board, '2x ' + lvCircuit, '2x ' + gt('resistor'), '2x ' + gasket,
    '2x ' + copper, '2x ' + solder, '4x ' + foil
  ], '2x ' + mvCircuit, 760, 96, 400)
  assemble('mv_electric_pump', [
    mvMotor, lv('electric_pump'), '2x ' + tube, '2x ' + gasket, '2x ' + cable, aluminium,
    ks('balanced_turbine_rotor'), create('mechanical_pump'), steelComponent
  ], mvPump, 780, 96, 450)
  assemble('mv_chemical_reactor', [
    mvHull, lv('chemical_reactor'), '2x ' + mvPump, '3x ' + mvCircuit, '2x ' + lining, '2x ' + gasket,
    pnc('pressure_chamber_valve'), regulator, ie('heavy_engineering')
  ], gt('mv_chemical_reactor'), 1180, 96, 650)
})
