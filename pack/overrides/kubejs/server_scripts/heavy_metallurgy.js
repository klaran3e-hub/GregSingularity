ServerEvents.recipes(event => {
  const ks = name => global.gsItemId(name)
  const mc = name => 'minecraft:' + name
  const gt = name => 'gtceu:' + name

  const steel = gt('steel_ingot')
  const plate = gt('steel_plate')
  const coke = 'gtceu:coke_gem'
  const slag = 'gtceu:dark_ash_dust'
  const frame = ks('pressed_steel_frame')
  const lining = ks('furnace_lining_insert')
  const hammer = '#gtceu:tools/crafting_hammers'
  const rivet = ks('iron_rivet')
  const lvCircuit = gt('basic_electronic_circuit')
  const pressBlank = ks('steel_press_blank')
  const casing = gt('heatproof_machine_casing')
  const coil = gt('cupronickel_coil_block')
  const mold = 'gtceu:plate_casting_mold'
  const aluminium = gt('aluminium_ingot')
  const aluminiumPlate = gt('aluminium_plate')
  const fireclay = ks('fireclay_charge')
  const cokeBrick = 'gtceu:coke_oven_bricks'
  const blastBrick = 'gtceu:firebricks'
  const creosote = 'gtceu:creosote'
  const seam = ks('sealed_boiler_joint')
  const copperContact = ks('copper_contact_strip')
  const pipe = gt('bronze_small_fluid_pipe')
  const lvHull = gt('lv_machine_hull')
  const lvMotor = gt('lv_electric_motor')
  const compressedIron = 'pneumaticcraft:ingot_iron_compressed'

  const replacements = [cokeBrick, blastBrick, gt('coke_oven_brick'), gt('firebrick'), coke, gt('coke_block'), steel, plate, mold,
    mc('piston'), gt('wood_mallet'), gt('lv_1a_energy_converter'), gt('lv_alloy_smelter'),
    casing, coil, gt('electric_blast_furnace'), gt('lv_energy_input_hatch'), gt('lv_input_bus'),
    gt('lv_output_bus'), gt('lv_input_hatch'), gt('lv_output_hatch'), gt('maintenance_hatch'),
    gt('lv_muffler_hatch'), aluminium, aluminiumPlate, gt('coke_oven'), gt('coke_oven_hatch'),
    gt('primitive_blast_furnace'), gt('treated_wood_planks'), compressedIron]
  replacements.forEach(output => event.remove({ output: output }))
  for (const id of ['coke_oven/coal_to_coke', 'coke_oven/coal_to_coke_block']) event.remove({ id: gt(id) })
  event.remove({ type: gt('primitive_blast_furnace'), output: steel })
  event.remove({ id: /^gtceu:.*_energy_converter$/ })
  for (const name of ['explosion_crafting/compressed_iron_ingot', 'explosion_crafting/compressed_iron_block',
    'pressure_chamber/compressed_iron_ingot', 'pressure_chamber/compressed_iron_block']) {
    event.remove({ id: 'pneumaticcraft:' + name })
  }

  const prefix = 'zero_shift:foundry/'
  const shaped = (name, output, rows, keys) => event.shaped(output, rows, keys).id(prefix + name)
  const custom = (name, data) => event.custom(data).id(prefix + name)
  const heat = (name, input, output, ticks) => custom(name, {
    type: 'minecraft:smelting', ingredient: { item: input }, result: output, cookingtime: ticks, experience: 0.3
  })
  const mill = (name, input, output, count) => event.recipes.gtceu.macerator(prefix + name)
    .itemInputs(input).itemOutputs(Item.of(output, count)).duration(260).EUt(4)
  const pressing = (name, input, output, count) => event.recipes.gtceu.forge_hammer(prefix + name)
    .itemInputs(input).itemOutputs(Item.of(output, count)).duration(160).EUt(4)
  const wash = (name, input, output) => event.recipes.gtceu.chemical_bath(prefix + name)
    .itemInputs(input).inputFluids(Fluid.of('minecraft:water', 250))
    .itemOutputs(output, ks('ore_tailings')).duration(180).EUt(24)
  const metalPress = (name, input, output, count) => event.recipes.gtceu.forming_press(prefix + name)
    .itemInputs(input).notConsumable(mold).itemOutputs(Item.of(output, count)).duration(240).EUt(24)
  function assemble(name, output, inputs, ticks, power, water) {
    const recipe = event.recipes.gtceu.assembler(prefix + name)
    inputs.forEach(input => recipe.itemInputs(input))
    recipe.inputFluids(Fluid.of(mc('water'), water)).itemOutputs(output).duration(ticks).EUt(power)
  }

  shaped('fireclay_charge', '2x ' + fireclay, ['CLT', 'SLS', ' C '], {
    C: mc('clay_ball'), L: ks('fired_lining'), T: ks('ore_tailings'), S: ks('sand_temper')
  })
  pressing('press_coke_bricks', fireclay, ks('coke_brick_blank'), 2)
  heat('fire_coke_brick', ks('coke_brick_blank'), gt('coke_oven_brick'), 500)
  shaped('coke_brickwork', cokeBrick, ['BB', 'BB'], { B: gt('coke_oven_brick') })
  mill('mill_lime_flux', gt('calcite_dust'), ks('lime_flux'), 2)
  mill('mill_lime_flux_from_ore', gt('raw_calcite'), ks('lime_flux'), 1)
  shaped('refractory_brick_blank', '2x ' + ks('refractory_brick_blank'), ['CLC', 'PFP', ' S '], {
    C: ks('coke_brick_blank'), L: ks('lime_flux'), P: ks('clay_mortar'),
    F: ks('fired_lining'), S: ks('sand_temper')
  })
  heat('fire_blast_brick', ks('refractory_brick_blank'), gt('firebrick'), 700)
  shaped('blast_brickwork', blastBrick, ['BB', 'BB'], { B: gt('firebrick') })
  event.shapeless(ks('coking_charge'), [mc('coal'), mc('coal'), mc('coal'), gt('charcoal_dust'),
    gt('charcoal_dust'), ks('insulating_gum'), '#gtceu:tools/crafting_hammers'])
    .damageIngredient('#gtceu:tools/crafting_hammers').id(prefix + 'prepare_coking_charge')
  shaped('coke_oven_controller', gt('coke_oven'), ['BCB', 'RFR', 'BPB'], {
    B: cokeBrick, C: ks('fired_crucible'), R: rivet, F: gt('lp_steam_furnace'), P: gt('bronze_plate')
  })
  shaped('coke_oven_hatch', gt('coke_oven_hatch'), ['BVB', 'PSP', 'BRB'], {
    B: cokeBrick, V: ks('packed_steam_valve'), P: pipe, S: seam, R: rivet
  })
  event.recipes.gtceu.coke_oven(prefix + 'gt_coke_batch')
    .itemInputs(ks('coking_charge')).itemOutputs('2x ' + coke).outputFluids(Fluid.of(creosote, 750)).duration(2400)
  shaped('primitive_furnace_controller', gt('primitive_blast_furnace'), ['BCB', 'VFV', 'BRB'], {
    B: blastBrick, C: ks('fired_crucible'), V: ks('fired_tuyere'), F: gt('lp_steam_furnace'), R: ks('sealed_boiler_joint')
  })
  shaped('prepare_steel_charge', ks('steel_furnace_charge'), ['FLF', 'IBI', 'PCP'], {
    F: ks('lime_flux'), L: ks('fired_crucible'), I: mc('iron_ingot'), B: ks('iron_bloom'),
    P: gt('charcoal_dust'), C: coke
  })
  event.recipes.gtceu.primitive_blast_furnace(prefix + 'blast_steel')
    .itemInputs(ks('steel_furnace_charge'), '2x ' + coke).itemOutputs(steel, slag).duration(2200)
  shaped('forge_steel_blank', pressBlank, ['SHS', 'PRP'], {
    S: steel, H: hammer, P: gt('iron_plate'), R: rivet
  }).damageIngredient(hammer)
  pressing('roll_startup_steel_plate', pressBlank, plate, 2)

  shaped('press_piston', mc('piston'), ['PJP', 'SRS', 'ICI'], {
    P: '#minecraft:planks', J: ks('wooden_joint'), S: gt('iron_plate'), R: 'gtceu:gregsingularity_turned_spindle',
    I: ks('shaft_bushing'), C: mc('redstone')
  })
  shaped('machine_press_die', mold, ['PPP', 'PSP', 'IHI'], {
    P: plate, S: pressBlank, I: ks('shaft_bushing'), H: hammer
  }).damageIngredient(hammer)
  shaped('converter_mallet', gt('wood_mallet'), ['PJP', 'BHI', ' I '], {
    P: '#minecraft:planks', J: ks('wooden_joint'), B: ks('tool_binding'),
    H: ks('tool_handle'), I: ks('pressed_insulation')
  })
  shaped('lv_energy_converter', gt('lv_1a_energy_converter'), ['CPC', 'LHL', 'SRS'], {
    C: gt('tin_single_cable'), P: plate, L: lvCircuit, H: gt('lv_machine_hull'),
    S: 'gtceu:iron_gear', R: 'gtceu:basic_electronic_circuit'
  })
  event.recipes.gtceu.compressor(prefix + 'press_steel_frame').itemInputs(pressBlank)
    .itemOutputs(frame).duration(240).EUt(4)
  shaped('iron_pressure_slug', ks('iron_pressure_slug'), ['IPI', 'IHI', ' P '], {
    I: gt('iron_plate'), P: ks('fired_lining'), H: hammer
  }).damageIngredient(hammer)
  metalPress('press_compressed_iron', ks('iron_pressure_slug'), compressedIron, 2)

  global.fieldworkProcess(event, prefix + 'lining_insert', 'mixer', {
    ingredients: [
      { item: blastBrick }, { item: slag }, { item: ks('fired_lining') },
      { item: ks('clay_mortar') }, { fluid: creosote, amount: 250 }
    ],
    results: [{ item: lining, count: 2 }],
    processingTime: 160
  }, 24)
  global.fieldworkProcess(event, prefix + 'treat_wood', 'mixer', {
    ingredients: [
      { tag: 'minecraft:planks' }, { tag: 'minecraft:planks' },
      { tag: 'minecraft:planks' }, { tag: 'minecraft:planks' },
      { item: ks('wooden_joint') }, { fluid: creosote, amount: 750 }
    ],
    results: [{ item: 'gtceu:treated_wood_planks', count: 4 }],
    processingTime: 200
  }, 24)
  shaped('lv_alloy_smelter', gt('lv_alloy_smelter'), ['CLC', 'RHR', 'CMC'], {
    C: lvCircuit, L: lining, R: frame, H: gt('lv_machine_hull'), M: gt('lv_electric_motor')
  })
  wash('wash_nickel', gt('crushed_nickel_ore'), ks('nickel_concentrate'))
  shaped('heater_alloy_charge', ks('heater_alloy_charge'), ['NCP', 'PLN', ' C '], {
    N: ks('nickel_concentrate'), C: ks('copper_contact_strip'), P: gt('copper_plate'), L: ks('fired_crucible')
  })
  event.recipes.gtceu.alloy_smelter(prefix + 'smelt_heater_ribbon')
    .itemInputs(ks('heater_alloy_charge'))
    .itemOutputs('4x ' + ks('heater_ribbon')).duration(260).EUt(24)
  shaped('cupronickel_heating_coil', coil, ['RLR', 'FIF', 'RLR'], {
    R: ks('heater_ribbon'), L: lining, F: frame, I: ks('pressed_insulation')
  })
  shaped('heatproof_casings', '2x ' + casing, ['PFP', 'LIL', 'PFP'], {
    P: plate, F: frame, L: lining, I: ks('sealed_boiler_joint')
  })
  shaped('ebf_controller', gt('electric_blast_furnace'), ['CLC', 'FHF', 'CRC'], {
    C: lvCircuit, L: lining, F: frame, H: gt('lv_machine_hull'), R: 'gtceu:basic_electronic_circuit'
  })
  shaped('lv_energy_input_hatch', gt('lv_energy_input_hatch'), ['CFC', 'LHL', 'PIP'], {
    C: gt('tin_single_cable'), F: frame, L: lvCircuit, H: gt('lv_machine_hull'),
    P: plate, I: ks('lv_line_contactor')
  })
  shaped('lv_input_bus', gt('lv_input_bus'), ['PFP', 'VHV', 'RLR'], {
    P: plate, F: frame, V: gt('lv_conveyor_module'), H: gt('lv_machine_hull'), R: rivet, L: lining
  })
  shaped('lv_output_bus', gt('lv_output_bus'), ['RLR', 'VHV', 'PFP'], {
    P: plate, F: frame, V: gt('lv_conveyor_module'), H: gt('lv_machine_hull'), R: rivet, L: lining
  })
  shaped('maintenance_hatch', gt('maintenance_hatch'), ['PHP', 'FIF', 'CLC'], {
    P: plate, H: '#zero_shift:crafting_hammers', F: frame, I: gt('lv_machine_hull'), C: lvCircuit, L: lining
  }).damageIngredient('#zero_shift:crafting_hammers')
  shaped('lv_muffler_hatch', gt('lv_muffler_hatch'), ['PLP', 'FHF', 'BCB'], {
    P: plate, L: lining, F: frame, H: gt('lv_machine_hull'), B: gt('bronze_small_fluid_pipe'), C: 'gtceu:gregsingularity_hearth_bellows'
  })
  assemble('lv_input_hatch', gt('lv_input_hatch'),
    [lvHull, '2x ' + pipe, gt('bronze_drum'), '2x ' + seam, frame, 'gtceu:gregsingularity_hand_pump_barrel'], 560, 24, 250)
  assemble('lv_output_hatch', gt('lv_output_hatch'),
    [lvHull, '2x ' + pipe, gt('bronze_drum'), '2x ' + seam, frame, gt('lv_conveyor_module')], 560, 24, 250)
  wash('wash_bauxite', gt('crushed_bauxite_ore'), ks('washed_bauxite'))
  assemble('alumina_charge', ks('alumina_charge'), [
    '4x ' + ks('washed_bauxite'), ks('fired_crucible'), '2x ' + ks('lime_flux'), coke, lining
  ], 420, 24, 250)
  event.recipes.gtceu.electric_blast_furnace(prefix + 'reduce_alumina')
    .itemInputs(ks('alumina_charge'))
    .itemOutputs(ks('hot_aluminium_billet'), slag)
    .duration(1400).EUt(28).blastFurnaceTemp(1700)
  event.recipes.gtceu.chemical_bath(prefix + 'quench_aluminium')
    .itemInputs(ks('hot_aluminium_billet')).inputFluids(Fluid.of('minecraft:water', 250))
    .itemOutputs(aluminium).duration(200).EUt(24)
  event.recipes.gtceu.bender(prefix + 'roll_aluminium_plate').itemInputs(aluminium)
    .itemOutputs(aluminiumPlate).duration(240).EUt(24)

  ;[['steel', steel], ['aluminium', aluminium]].forEach(([material, ingot]) => {
    const nugget = gt(material + '_nugget')
    const block = gt(material + '_block')
    shaped('recover_' + material + '_nuggets', ingot, ['NNN', 'NNN', 'NNN'], { N: nugget })
    event.shapeless('9x ' + ingot, [block]).id(prefix + 'recover_' + material + '_block')
  })
  shaped('pack_coke', gt('coke_block'), ['CCC', 'CCC', 'CCC'], { C: coke })
  event.shapeless('9x ' + coke, [gt('coke_block')]).id(prefix + 'recover_coke_block')

})
