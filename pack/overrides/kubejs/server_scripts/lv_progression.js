ServerEvents.recipes(event => {
  const bronzeBlank = 'kubejs:stamped_bronze_blank'
  const pipe = 'gtceu:bronze_small_fluid_pipe'
  const seal = 'kubejs:sealed_boiler_joint'
  const rivet = 'kubejs:iron_rivet'
  const lining = 'kubejs:fired_lining'
  const ironPlate = 'gtceu:iron_plate'
  const gum = 'kubejs:insulating_gum'
  const tape = 'kubejs:pressed_insulation'
  const foil = 'kubejs:copper_contact_strip'
  const tinWire = 'gtceu:tin_single_wire'
  const tinCable = 'gtceu:tin_single_cable'
  const board = 'gtceu:resin_circuit_board'
  const printed = 'gtceu:resin_printed_circuit_board'
  const resistor = 'gtceu:resistor'
  const tube = 'gtceu:vacuum_tube'
  const solder = 'kubejs:tin_solder_preform'
  const iron = 'kubejs:bench_soldering_iron'
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
    P: 'gtceu:bronze_plate', S: seal, V: pipe, T: 'kubejs:packed_steam_valve',
    C: 'gtceu:bronze_machine_casing', B: bronzeBlank, F: 'kubejs:forging_saddle'
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
  shaped('impregnate_fibre', 'kubejs:impregnated_fibre', ['FFF', 'GCG'], {
    F: 'kubejs:washed_fibre', G: gum, C: 'kubejs:fibre_cord'
  })
  event.recipes.gtceu.compressor('zero_shift:lv/steam_press_insulation')
    .itemInputs('kubejs:impregnated_fibre')
    .itemOutputs('2x ' + tape)
    .duration(180)
    .EUt(4)

  shaped('cut_tin_blank', 'kubejs:tin_wire_blank', ['TCT', ' L '], {
    T: 'gtceu:tin_plate', C: 'kubejs:stone_chisel', L: lining
  }).damageIngredient('kubejs:stone_chisel')
  press('draw_tin_wire', 'kubejs:tin_wire_blank', tinWire, 4)
  shaped('wrap_tin_cable', tinCable, ['IWI', ' C '], {
    I: tape, W: tinWire, C: 'kubejs:fibre_cord'
  })
  press('roll_contact_strip', 'gtceu:copper_plate', foil, 2)

  shaped('coat_circuit_board', board, ['GPG', 'PLP', 'GPG'], {
    G: gum, P: '#minecraft:planks', L: lining
  })
  shaped('lay_copper_traces', 'kubejs:circuit_laminate', ['FFF', 'BPB', ' I '], {
    F: foil, B: gum, P: board, I: tape
  })
  press('press_circuit_laminate', 'kubejs:circuit_laminate', printed, 1)

  shaped('form_resistor_core', 'kubejs:carbon_resistor_core', ['CDC', 'DLD'], {
    C: 'gtceu:charcoal_dust', D: gum, L: lining
  })
  shaped('resistor', '2x ' + resistor, ['WFW', 'ICI'], {
    W: tinWire, F: foil, I: tape, C: 'kubejs:carbon_resistor_core'
  })
  shaped('glass_tube_blank', 'kubejs:glass_tube_blank', ['G G', 'GLG', ' F '], {
    G: 'minecraft:glass_pane', L: lining, F: foil
  })
  shaped('vacuum_tube', tube, [' I ', 'WGW', 'FLF'], {
    I: tape, W: tinWire, G: 'kubejs:glass_tube_blank', F: foil, L: lining
  })
  shaped('roll_solder_preform', '2x ' + solder, ['WFW', ' G '], {
    W: tinWire, F: foil, G: gum
  })
  shaped('soldering_iron', iron, [' FF', ' IF', 'H  '], {
    F: foil, I: tape, H: 'kubejs:tool_handle'
  })
  shaped('hand_solder_circuit', circuit, ['RTR', 'WPW', 'SIS'], {
    R: resistor, T: tube, W: tinWire, P: printed, S: solder, I: iron
  }).damageIngredient(iron)

  shaped('lv_machine_casing', 'gtceu:lv_machine_casing', ['PBP', 'BIB', 'PBP'], {
    P: ironPlate, B: bronzeBlank, I: tape
  })
  shaped('wind_stator', 'kubejs:wound_stator', ['FIF', 'PSP', 'FIF'], {
    F: foil, I: tape, P: ironPlate, S: 'kubejs:turned_spindle'
  })
  shaped('magnetize_armature', 'kubejs:magnetic_armature', ['RPR', 'BSB', 'RPR'], {
    R: 'minecraft:redstone', P: ironPlate, B: bronzeBlank, S: 'kubejs:turned_spindle'
  })
  shaped('lv_electric_motor', motor, ['PCP', 'SAR', 'PCP'], {
    P: ironPlate, C: tinCable, S: 'kubejs:wound_stator',
    A: 'kubejs:magnetic_armature', R: rivet
  })
  shaped('lv_conveyor_module', conveyor, ['BIB', 'SMS', 'PCP'], {
    B: 'kubejs:woven_drive_belt', I: tape, S: 'kubejs:turned_spindle',
    M: motor, P: ironPlate, C: tinCable
  })
  shaped('turbine_rotor_blank', 'kubejs:turbine_rotor_blank', ['BRB', 'RSR', 'BRB'], {
    B: bronzeBlank, R: rivet, S: 'kubejs:turned_spindle'
  })
  event.recipes.gtceu.forge_hammer('zero_shift:lv/balance_turbine_rotor')
    .itemInputs('kubejs:turbine_rotor_blank')
    .itemOutputs('kubejs:balanced_turbine_rotor')
    .duration(200)
    .EUt(4)
  shaped('lv_steam_turbine', 'gtceu:lv_steam_turbine', ['SRT', 'PHM', 'ICI'], {
    S: seal, R: 'kubejs:balanced_turbine_rotor', P: pipe, T: 'kubejs:packed_steam_valve',
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
