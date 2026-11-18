ServerEvents.recipes(event => {
  const ks = name => 'kubejs:' + name
  const mc = name => 'minecraft:' + name
  const gt = name => 'gtceu:' + name
  const ie = name => 'immersiveengineering:' + name
  const create = name => 'create:' + name
  const steel = gt('steel_ingot')
  const plate = gt('steel_plate')
  const coke = ie('coal_coke')
  const slag = ie('slag')
  const frame = ks('pressed_steel_frame')
  const lining = ks('furnace_lining_insert')
  const hammer = '#gtceu:tools/crafting_hammers'
  const rivet = ks('iron_rivet')
  const lvCircuit = gt('basic_electronic_circuit')
  const pressBlank = ks('steel_press_blank')
  const casing = gt('heatproof_machine_casing')
  const coil = gt('cupronickel_coil_block')
  const mold = ie('mold_plate')
  const aluminium = gt('aluminium_ingot')
  const aluminiumPlate = gt('aluminium_plate')
  const fireclay = ks('fireclay_charge')
  const cokeBrick = ie('cokebrick')
  const blastBrick = ie('blastbrick')
  const creosote = ie('creosote')
  const seam = ks('sealed_boiler_joint')
  const copperContact = ks('copper_contact_strip')
  const pipe = gt('bronze_small_fluid_pipe')
  const lvHull = gt('lv_machine_hull')
  const lvMotor = gt('lv_electric_motor')
  const compressedIron = 'pneumaticcraft:ingot_iron_compressed'

  const replacements = [
    ie('hammer'), cokeBrick, blastBrick, coke, gt('coke_gem'), gt('coke_block'), ie('coke'),
    steel, plate, ie('ingot_steel'), ie('plate_steel'), ie('conveyor_basic'), ie('rs_engineering'), ie('heavy_engineering'),
    ie('steel_scaffolding_standard'), mold, mc('piston'), gt('wood_mallet'), gt('lv_1a_energy_converter'),
    gt('lv_alloy_smelter'), casing, coil, gt('electric_blast_furnace'),
    gt('lv_energy_input_hatch'), gt('lv_input_bus'), gt('lv_output_bus'), gt('lv_input_hatch'), gt('lv_output_hatch'),
    gt('maintenance_hatch'), gt('lv_muffler_hatch'), aluminium, aluminiumPlate, ie('ingot_aluminum'), ie('plate_aluminum'),
    ie('blastbrick_reinforced'), ie('blastfurnace_preheater'), ie('furnace_heater'), ie('fluid_pipe'),
    gt('coke_oven'), gt('coke_oven_hatch'), gt('coke_oven_bricks'),
    compressedIron
  ]
  replacements.forEach(output => event.remove({ output: output }))
  const obsolete = [
    'immersiveengineering:crafting/treated_wood_horizontal',
    'create:filling/compat/immersiveengineering/treated_wood_in_spout',
    'immersiveengineering:cokeoven/coke', 'immersiveengineering:cokeoven/coke_block', 'immersiveengineering:cokeoven/charcoal',
    'immersiveengineering:blastfurnace/steel', 'immersiveengineering:blastfurnace/steel_block',
    'immersiveengineering:blastfurnace/fuel_charcoal', 'immersiveengineering:blastfurnace/fuel_charcoal_block',
    'immersiveengineering:arcfurnace/dust_steel', 'immersiveengineering:arcfurnace/steel',
    'immersiveengineering:arcfurnace/dust_aluminum', 'immersiveengineering:arcfurnace/ore_aluminum',
    'immersiveengineering:arcfurnace/raw_ore_aluminum', 'immersiveengineering:arcfurnace/raw_block_aluminum',
    'immersiveengineering:metalpress/plate_steel', 'immersiveengineering:metalpress/plate_aluminum',
    'gtceu:coke_oven/coal_to_coke', 'gtceu:coke_oven/coal_to_coke_block',
    'pneumaticcraft:explosion_crafting/compressed_iron_ingot',
    'pneumaticcraft:explosion_crafting/compressed_iron_block',
    'pneumaticcraft:pressure_chamber/compressed_iron_ingot',
    'pneumaticcraft:pressure_chamber/compressed_iron_block'
  ]
  obsolete.forEach(id => event.remove({ id: id }))
  event.remove({ id: /^gtceu:primitive_blast_furnace\/steel_from_/ })
  event.remove({ id: /^gtceu:.*_energy_converter$/ })
  event.remove({ type: 'create:milling', input: mc('calcite') })
  event.remove({ type: 'create:milling', input: gt('raw_calcite') })

  const prefix = 'zero_shift:foundry/'
  const shaped = (name, output, rows, keys) => event.shaped(output, rows, keys).id(prefix + name)
  const custom = (name, data) => event.custom(data).id(prefix + name)
  const heat = (name, input, output, ticks) => custom(name, {
    type: 'minecraft:smelting', ingredient: { item: input }, result: output, cookingtime: ticks, experience: 0.3
  })
  const createProcess = (name, type, input, results, ticks) => custom(name, {
    type: create(type), ingredients: [{ item: input }], results: results, processingTime: ticks
  })
  const pressing = (name, input, output, count) =>
    createProcess(name, 'pressing', input, [{ item: output, count: count }], 100)
  const milling = (name, input, output, count) =>
    createProcess(name, 'milling', input, [{ item: output, count: count }], 260)
  const wash = (name, input, output) =>
    createProcess(name, 'splashing', input, [{ item: output }, { item: ks('ore_tailings') }], 120)
  const metalPress = (name, input, output, count) => custom(name, {
    type: ie('metal_press'), energy: 6000, mold: mold, input: { item: input },
    result: { item: output, count: count }
  })
  function assemble(name, output, inputs, ticks, power, water) {
    const recipe = event.recipes.gtceu.assembler(prefix + name)
    inputs.forEach(input => recipe.itemInputs(input))
    recipe.inputFluids(Fluid.of(mc('water'), water)).itemOutputs(output).duration(ticks).EUt(power)
  }

  shaped('engineers_hammer', ie('hammer'), ['PIB', ' FH', '  W'], {
    P: gt('iron_plate'), I: ks('hand_forged_plate'), B: ks('tool_binding'),
    F: ie('component_iron'), H: hammer, W: ks('tool_handle')
  }).damageIngredient(hammer)
  shaped('fireclay_charge', '2x ' + fireclay, ['CLT', 'SLS', ' C '], {
    C: mc('clay_ball'), L: ks('fired_lining'), T: ks('ore_tailings'), S: ks('sand_temper')
  })
  pressing('press_coke_bricks', fireclay, ks('coke_brick_blank'), 2)
  heat('fire_coke_brick', ks('coke_brick_blank'), cokeBrick, 500)
  milling('mill_lime_flux', mc('calcite'), ks('lime_flux'), 2)
  milling('mill_lime_flux_from_ore', gt('raw_calcite'), ks('lime_flux'), 1)
  shaped('refractory_brick_blank', '2x ' + ks('refractory_brick_blank'), ['CLC', 'PFP', ' S '], {
    C: ks('coke_brick_blank'), L: ks('lime_flux'), P: ks('clay_mortar'),
    F: ks('fired_lining'), S: ks('sand_temper')
  })
  heat('fire_blast_brick', ks('refractory_brick_blank'), blastBrick, 700)
  custom('prepare_coking_charge', {
    type: create('compacting'),
    ingredients: [
      { item: mc('coal') }, { item: mc('coal') }, { item: mc('coal') },
      { item: gt('charcoal_dust') }, { item: gt('charcoal_dust') }, { item: ks('insulating_gum') }
    ],
    results: [{ item: ks('coking_charge') }],
    processingTime: 160
  })
  custom('coke_oven', {
    type: ie('coke_oven'), creosote: 750, time: 2400,
    input: { item: ks('coking_charge') }, result: { item: coke, count: 2 }
  })
  shaped('prepare_steel_charge', ks('steel_furnace_charge'), ['FLF', 'IBI', 'PCP'], {
    F: ks('lime_flux'), L: ks('fired_crucible'), I: mc('iron_ingot'), B: ks('iron_bloom'),
    P: gt('charcoal_dust'), C: coke
  })
  custom('blast_steel', {
    type: ie('blast_furnace'), time: 2200, input: { item: ks('steel_furnace_charge') },
    result: { item: steel }, slag: { item: slag }
  })
  event.recipes.gtceu.primitive_blast_furnace(prefix + 'blast_steel_backup')
    .itemInputs(ks('steel_furnace_charge'), '2x ' + coke).itemOutputs(steel, slag).duration(2600)
  shaped('forge_steel_blank', pressBlank, ['SHS', 'PRP'], {
    S: steel, H: hammer, P: gt('iron_plate'), R: rivet
  }).damageIngredient(hammer)
  pressing('roll_startup_steel_plate', pressBlank, plate, 2)

  shaped('steel_scaffolding', '2x ' + ie('steel_scaffolding_standard'), ['PRP', ' S ', 'P P'], {
    P: plate, R: rivet, S: create('shaft')
  })
  shaped('press_piston', mc('piston'), ['PJP', 'SRS', 'ICI'], {
    P: '#minecraft:planks', J: ks('wooden_joint'), S: gt('iron_plate'), R: create('shaft'),
    I: ks('shaft_bushing'), C: mc('redstone')
  })
  shaped('basic_conveyors', '3x ' + ie('conveyor_basic'), ['BMB', 'PRI'], {
    B: ks('woven_drive_belt'), M: gt('lv_conveyor_module'), P: plate, R: mc('redstone'), I: gt('iron_plate')
  })
  shaped('redstone_engineering', ie('rs_engineering'), ['PRP', 'RCR', 'BIB'], {
    P: gt('iron_plate'), R: mc('redstone'), C: lvCircuit, B: ks('copper_contact_strip'), I: ie('component_iron')
  })
  shaped('heavy_engineering', ie('heavy_engineering'), ['PSP', 'GIG', 'PCP'], {
    P: plate, S: ie('component_steel'), G: create('gearbox'), I: gt('lv_machine_hull'), C: lvCircuit
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
    S: ie('component_iron'), R: ie('rs_engineering')
  })
  metalPress('press_steel_frame', pressBlank, frame, 1)
  shaped('iron_pressure_slug', ks('iron_pressure_slug'), ['IPI', 'IHI', ' P '], {
    I: gt('iron_plate'), P: ks('fired_lining'), H: hammer
  }).damageIngredient(hammer)
  metalPress('press_compressed_iron', ks('iron_pressure_slug'), compressedIron, 2)

  shaped('creosote_pipe', '2x ' + ie('fluid_pipe'), ['PRP', 'VSV', 'PRP'], {
    P: gt('iron_plate'), R: rivet, V: pipe, S: seam
  })
  custom('lining_insert', {
    type: create('mixing'),
    ingredients: [
      { item: blastBrick }, { item: slag }, { item: ks('fired_lining') },
      { item: ks('clay_mortar') }, { fluid: creosote, amount: 250 }
    ],
    results: [{ item: lining, count: 2 }],
    processingTime: 160
  })
  custom('treat_wood', {
    type: create('mixing'),
    ingredients: [
      { tag: 'minecraft:planks' }, { tag: 'minecraft:planks' },
      { tag: 'minecraft:planks' }, { tag: 'minecraft:planks' },
      { item: ks('wooden_joint') }, { fluid: creosote, amount: 750 }
    ],
    results: [{ item: ie('treated_wood_horizontal'), count: 4 }],
    processingTime: 200
  })
  assemble('reinforce_blast_brick', '2x ' + ie('blastbrick_reinforced'),
    ['2x ' + blastBrick, '2x ' + plate, frame, lining], 480, 24, 250)
  assemble('furnace_heater', ie('furnace_heater'),
    [mc('furnace'), '2x ' + gt('copper_plate'), '2x ' + copperContact, lvCircuit, frame, lining], 620, 24, 250)
  assemble('blastfurnace_preheater', ie('blastfurnace_preheater'),
    [ie('furnace_heater'), '2x ' + ie('fluid_pipe'), '2x ' + plate, lvMotor, frame, lining], 720, 24, 250)
  assemble('coke_oven_bricks', '2x ' + gt('coke_oven_bricks'),
    ['2x ' + cokeBrick, '2x ' + gt('coke_oven_brick'), '2x ' + lining, '2x ' + rivet], 480, 24, 250)
  assemble('gt_coke_oven', gt('coke_oven'),
    ['4x ' + gt('coke_oven_bricks'), '2x ' + ie('blastbrick_reinforced'), frame, lvCircuit, lining], 780, 24, 250)
  assemble('gt_coke_oven_hatch', gt('coke_oven_hatch'),
    [gt('coke_oven_bricks'), '2x ' + ie('fluid_pipe'), gt('bronze_drum'), frame, lvCircuit], 640, 24, 250)
  event.recipes.gtceu.coke_oven(prefix + 'gt_coke_batch')
    .itemInputs(ks('coking_charge')).itemOutputs('2x ' + coke).outputFluids(Fluid.of(creosote, 750)).duration(2400)
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
    C: lvCircuit, L: lining, F: frame, H: gt('lv_machine_hull'), R: ie('rs_engineering')
  })
  shaped('lv_energy_input_hatch', gt('lv_energy_input_hatch'), ['CFC', 'LHL', 'PIP'], {
    C: gt('tin_single_cable'), F: frame, L: lvCircuit, H: gt('lv_machine_hull'),
    P: plate, I: ks('pressed_insulation')
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
    P: plate, L: lining, F: frame, H: gt('lv_machine_hull'), B: gt('bronze_small_fluid_pipe'), C: create('encased_fan')
  })
  assemble('lv_input_hatch', gt('lv_input_hatch'),
    [lvHull, '2x ' + pipe, gt('bronze_drum'), '2x ' + seam, frame, 'create:mechanical_pump'], 560, 24, 250)
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
  createProcess('quench_aluminium', 'splashing', ks('hot_aluminium_billet'), [{ item: aluminium }], 200)
  metalPress('roll_aluminium_plate', aluminium, aluminiumPlate, 1)

  // Legacy IE forms have their own conversions in canonical_resources.js.
  ;[['steel', steel], ['aluminium', aluminium]].forEach(([material, ingot]) => {
    const nugget = gt(material + '_nugget')
    const block = gt(material + '_block')
    shaped('recover_' + material + '_nuggets', ingot, ['NNN', 'NNN', 'NNN'], { N: nugget })
    event.shapeless('9x ' + ingot, [block]).id(prefix + 'recover_' + material + '_block')
  })
  shaped('pack_coke', gt('coke_block'), ['CCC', 'CCC', 'CCC'], { C: coke })
  event.shapeless('9x ' + coke, [gt('coke_block')]).id(prefix + 'recover_coke_block')
  event.shapeless('9x ' + coke, [ie('coke')]).id(prefix + 'recover_ie_coke_block')
  event.shapeless(coke, [gt('coke_gem')]).id(prefix + 'recover_coke_gem')
})
