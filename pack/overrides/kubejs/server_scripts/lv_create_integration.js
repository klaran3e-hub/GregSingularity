ServerEvents.tags('fluid', event => {
  event.remove('create:bottomless/allow', 'minecraft:lava')
})

ServerEvents.recipes(event => {
  const create = name => 'create:' + name
  const gt = name => 'gtceu:' + name
  const ks = name => 'kubejs:' + name
  const ie = name => 'immersiveengineering:' + name
  const prefix = 'zero_shift:lv_create/'
  const frame = ks('pressed_steel_frame')
  const steel = gt('steel_plate')
  const insulation = ks('pressed_insulation')
  const circuit = gt('basic_electronic_circuit')
  const cable = gt('tin_single_cable')
  const bushing = ks('shaft_bushing')
  const rivet = ks('iron_rivet')

  function assemble(name, count, materials, ticks, eut) {
    const recipe = event.recipes.gtceu.assembler(prefix + name)
    materials.forEach(material => recipe.itemInputs(material))
    recipe.itemOutputs(count + 'x ' + create(name)).duration(ticks).EUt(eut)
  }

  const superseded = [
    'crafting/kinetics/gantry_shaft', 'crafting/kinetics/gantry_carriage',
    'crafting/kinetics/hose_pulley', 'crafting/kinetics/deployer',
    'sequenced_assembly/precision_mechanism', 'crafting/kinetics/rotation_speed_controller',
    'crafting/kinetics/chain_conveyor', 'crafting/logistics/redstone_contact'
  ]
  superseded.forEach(id => event.remove({ id: create(id) }))

  assemble('gantry_shaft', 2, [frame, '2x ' + create('shaft'), '2x ' + steel, bushing, cable], 460, 24)
  assemble('gantry_carriage', 1, [frame, create('depot'), create('gearbox'), gt('lv_conveyor_module'),
    '2x ' + bushing, '2x ' + insulation], 740, 28)
  assemble('chain_conveyor', 1, [frame, '2x ' + create('encased_chain_drive'), create('large_cogwheel'),
    gt('lv_conveyor_module'), '2x ' + steel, '2x ' + bushing], 700, 28)
  assemble('redstone_contact', 2, [ie('rs_engineering'), '2x ' + ks('copper_contact_strip'),
    '2x ' + insulation, '2x ' + cable, '2x ' + steel], 420, 24)

  assemble('hose_pulley', 1, [frame, create('copper_casing'), create('mechanical_pump'),
    gt('lv_electric_pump'), '2x ' + gt('bronze_small_fluid_pipe'), '2x ' + insulation, circuit], 860, 28)
  assemble('deployer', 1, [frame, create('mechanical_piston'), gt('lv_electric_piston'),
    ie('rs_engineering'), '2x ' + ks('copper_contact_strip'), circuit], 960, 28)

  const incomplete = { item: create('incomplete_precision_mechanism') }
  const deploymentSteps = [create('cogwheel'), insulation, circuit].map(part => ({
    type: create('deploying'),
    ingredients: [incomplete, { item: part }],
    results: [incomplete]
  }))
  event.custom({
    type: create('sequenced_assembly'),
    ingredient: { item: frame },
    transitionalItem: incomplete,
    sequence: deploymentSteps.concat([{ type: create('pressing'), ingredients: [incomplete], results: [incomplete] }]),
    loops: 2,
    results: [{ item: create('precision_mechanism') }]
  }).id(prefix + 'calibrate_precision_mechanism')
  assemble('rotation_speed_controller', 1, [frame, create('gearbox'), create('precision_mechanism'),
    gt('lv_electric_motor'), '2x ' + cable, '2x ' + rivet], 1040, 28)
})
