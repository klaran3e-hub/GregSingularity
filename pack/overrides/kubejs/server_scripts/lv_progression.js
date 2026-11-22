ServerEvents.recipes(event => {
  const bronzeBlank = 'gtceu:gregsingularity_stamped_bronze_blank'
  const pipe = 'gtceu:bronze_small_fluid_pipe'
  const seal = 'gtceu:gregsingularity_sealed_boiler_joint'
  const rivet = 'gtceu:gregsingularity_iron_rivet'
  const lining = 'gtceu:gregsingularity_fired_lining'
  const ironPlate = 'gtceu:iron_plate'
  const gum = 'gtceu:gregsingularity_insulating_gum'
  const tape = 'gtceu:gregsingularity_pressed_insulation'
  const foil = 'gtceu:gregsingularity_copper_contact_strip'
  const tinWire = 'gtceu:tin_single_wire'
  const tinCable = 'gtceu:tin_single_cable'
  const board = 'gtceu:resin_circuit_board'
  const printed = 'gtceu:resin_printed_circuit_board'
  const resistor = 'gtceu:resistor'
  const tube = 'gtceu:vacuum_tube'
  const solder = 'gtceu:gregsingularity_tin_solder_preform'
  const iron = 'gtceu:gregsingularity_bench_soldering_iron'
  const circuit = 'gtceu:basic_electronic_circuit'
  const motor = 'gtceu:lv_electric_motor'
  const hull = 'gtceu:lv_machine_hull'
  const conveyor = 'gtceu:lv_conveyor_module'

  const replaced = [
    'gtceu:lp_steam_compressor', tinWire, tinCable, board, printed, resistor, tube,
    circuit, 'gtceu:lv_machine_casing', motor, conveyor, 'gtceu:lv_steam_turbine', 'gtceu:lv_assembler'
  ]
  for (const output of replaced) event.remove({ output: output })
  // The extractor has one input slot; reserve sticky resin for the insulation route.
  event.remove({ id: 'gtceu:extractor/raw_rubber_from_resin' })
  event.remove({ type: 'gtceu:macerator', input: 'minecraft:charcoal', output: 'gtceu:charcoal_dust' })

  function shaped(id, output, pattern, keys) {
    return event.shaped(output, pattern, keys).id('zero_shift:lv/' + id)
  }

  function press(id, input, output, count) {
    global.fieldworkProcess(event, 'zero_shift:lv/' + id, 'forge_hammer', {
      ingredients: [{ item: input }],
      results: [{ item: output, count: count }]
    }, 4)
  }

  shaped('steam_compressor', 'gtceu:lp_steam_compressor', ['PSP', 'VCT', 'BFB'], {
    P: 'gtceu:bronze_plate', S: seal, V: pipe, T: 'gtceu:gregsingularity_packed_steam_valve',
    C: 'gtceu:bronze_machine_casing', B: bronzeBlank, F: 'gtceu:gregsingularity_forging_saddle'
  })

  event.recipes.gtceu.extractor('zero_shift:lv/steam_extract_resin')
    .itemInputs('gtceu:sticky_resin')
    .itemOutputs('2x ' + gum)
    .duration(160)
    .EUt(4)
  event.recipes.gtceu.macerator('zero_shift:lv/steam_grind_charcoal')
    .itemInputs('minecraft:charcoal')
    .itemOutputs('gtceu:charcoal_dust')
    .duration(160)
    .EUt(4)
  shaped('impregnate_fibre', 'gtceu:gregsingularity_impregnated_fibre', ['FFF', 'GCG'], {
    F: 'gtceu:gregsingularity_washed_fibre', G: gum, C: 'gtceu:gregsingularity_fibre_cord'
  })
  event.recipes.gtceu.compressor('zero_shift:lv/steam_press_insulation')
    .itemInputs('gtceu:gregsingularity_impregnated_fibre')
    .itemOutputs('2x ' + tape)
    .duration(180)
    .EUt(4)

  shaped('cut_tin_blank', 'gtceu:gregsingularity_tin_wire_blank', ['TCT', ' L '], {
    T: 'gtceu:tin_plate', C: 'gtceu:gregsingularity_stone_chisel', L: lining
  }).damageIngredient('gtceu:gregsingularity_stone_chisel')
  press('draw_tin_wire', 'gtceu:gregsingularity_tin_wire_blank', tinWire, 4)
  shaped('wrap_tin_cable', tinCable, ['IWI', ' C '], {
    I: tape, W: tinWire, C: 'gtceu:gregsingularity_fibre_cord'
  })
  press('roll_contact_strip', 'gtceu:copper_plate', foil, 2)

  shaped('coat_circuit_board', board, ['GPG', 'PLP', 'GPG'], {
    G: gum, P: '#minecraft:planks', L: lining
  })
  shaped('lay_copper_traces', 'gtceu:gregsingularity_circuit_laminate', ['FFF', 'BPB', ' I '], {
    F: foil, B: gum, P: board, I: tape
  })
  press('press_circuit_laminate', 'gtceu:gregsingularity_circuit_laminate', printed, 1)

  shaped('form_resistor_core', 'gtceu:gregsingularity_carbon_resistor_core', ['CDC', 'DLD'], {
    C: 'gtceu:charcoal_dust', D: gum, L: lining
  })
  shaped('resistor', '2x ' + resistor, ['WFW', 'ICI'], {
    W: tinWire, F: foil, I: tape, C: 'gtceu:gregsingularity_carbon_resistor_core'
  })
  shaped('glass_tube_blank', 'gtceu:gregsingularity_glass_tube_blank', ['G G', 'GLG', ' F '], {
    G: 'minecraft:glass_pane', L: lining, F: foil
  })
  shaped('vacuum_tube', tube, [' I ', 'WGW', 'FLF'], {
    I: tape, W: tinWire, G: 'gtceu:gregsingularity_glass_tube_blank', F: foil, L: lining
  })
  shaped('roll_solder_preform', '2x ' + solder, ['WFW', ' G '], {
    W: tinWire, F: foil, G: gum
  })
  shaped('soldering_iron', iron, [' FF', ' IF', 'H  '], {
    F: foil, I: tape, H: 'gtceu:gregsingularity_tool_handle'
  })
  shaped('hand_solder_circuit', circuit, ['RTR', 'WPW', 'SIS'], {
    R: resistor, T: tube, W: tinWire, P: printed, S: solder, I: iron
  }).damageIngredient(iron)

  shaped('lv_machine_casing', 'gtceu:lv_machine_casing', ['PBP', 'BIB', 'PBP'], {
    P: ironPlate, B: bronzeBlank, I: tape
  })
  shaped('wind_stator', 'gtceu:gregsingularity_wound_stator', ['FIF', 'PSP', 'FIF'], {
    F: foil, I: tape, P: ironPlate, S: 'gtceu:gregsingularity_turned_spindle'
  })
  shaped('magnetize_armature', 'gtceu:gregsingularity_magnetic_armature', ['RPR', 'BSB', 'RPR'], {
    R: 'minecraft:redstone', P: ironPlate, B: bronzeBlank, S: 'gtceu:gregsingularity_turned_spindle'
  })
  shaped('lv_electric_motor', motor, ['PCP', 'SAR', 'PCP'], {
    P: ironPlate, C: tinCable, S: 'gtceu:gregsingularity_wound_stator',
    A: 'gtceu:gregsingularity_magnetic_armature', R: rivet
  })
  shaped('lv_conveyor_module', conveyor, ['BIB', 'SMS', 'PCP'], {
    B: 'gtceu:gregsingularity_woven_drive_belt', I: tape, S: 'gtceu:gregsingularity_turned_spindle',
    M: motor, P: ironPlate, C: tinCable
  })
  shaped('turbine_rotor_blank', 'gtceu:gregsingularity_turbine_rotor_blank', ['BRB', 'RSR', 'BRB'], {
    B: bronzeBlank, R: rivet, S: 'gtceu:gregsingularity_turned_spindle'
  })
  event.recipes.gtceu.forge_hammer('zero_shift:lv/balance_turbine_rotor')
    .itemInputs('gtceu:gregsingularity_turbine_rotor_blank')
    .itemOutputs('gtceu:gregsingularity_balanced_turbine_rotor')
    .duration(200)
    .EUt(4)
  shaped('lv_steam_turbine', 'gtceu:lv_steam_turbine', ['SRT', 'PHM', 'ICI'], {
    S: seal, R: 'gtceu:gregsingularity_balanced_turbine_rotor', P: pipe, T: 'gtceu:gregsingularity_packed_steam_valve',
    H: hull, M: motor, I: 'gtceu:steel_plate', C: circuit
  })
  // GregTech small generators trim all fluid outputs during recipe execution.
  event.remove({ id: 'gtceu:steam_turbine/steam' })
  event.recipes.gtceu.steam_turbine('zero_shift:lv/steam_cycle')
    .inputFluids(Fluid.of('gtceu:steam', 640))
    .duration(10)
    .EUt(-32)
  shaped('lv_assembler', 'gtceu:lv_assembler', ['ICI', 'VHV', 'MCM'], {
    I: ironPlate, C: circuit, V: conveyor, H: hull, M: motor
  })
  event.recipes.gtceu.assembler('zero_shift:lv/series_circuit')
    .itemInputs('2x ' + printed, '4x ' + resistor, '2x ' + tube, '4x ' + tinWire,
      '2x ' + foil, '2x ' + tape)
    .inputFluids(Fluid.of('gtceu:tin', 144))
    .itemOutputs('2x ' + circuit)
    .duration(400)
    .EUt(16)
})
