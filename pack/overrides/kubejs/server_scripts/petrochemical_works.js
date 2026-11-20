ServerEvents.tags('item', event => {
  event.remove('pneumaticcraft:plastic_sheets', 'pneumaticcraft:plastic')
  event.add('pneumaticcraft:plastic_sheets', 'gtceu:polyethylene_plate')
})

ServerEvents.tags('fluid', event => {
  event.add('forge:diesel', 'gtceu:diesel')
  event.add('zero_shift:petrochem/conditioned_light_fuel', 'gtceu:lightly_hydro_cracked_light_fuel')
  event.add('zero_shift:petrochem/refinery_gas', 'gtceu:refinery_gas')
})

ServerEvents.recipes(event => {
  const ks = name => 'kubejs:' + name
  const gt = name => 'gtceu:' + name
  const pnc = name => 'pneumaticcraft:' + name

  const prefix = 'zero_shift:petrochem/'
  const steel = gt('steel_plate')
  const aluminium = gt('aluminium_plate')
  const circuit = gt('good_electronic_circuit')
  const hull = gt('mv_machine_hull')
  const cable = gt('copper_single_cable')
  const motor = gt('mv_electric_motor')
  const pump = gt('mv_electric_pump')
  const frame = ks('pressed_steel_frame')
  const oldSeal = ks('pressure_gasket')
  const pressedIron = pnc('ingot_iron_compressed')
  const tube = pnc('pressure_tube')
  const tank = pnc('small_tank')
  const foil = ks('copper_contact_strip')
  const mesh = ks('strainer_mesh')
  const cartridge = ks('oil_wash_cartridge')
  const spent = ks('spent_oil_cartridge')
  const tray = ks('refinery_tray')
  const exchanger = ks('heat_exchange_core')
  const drillHead = ks('drill_seal_head')
  const ampoule = ks('sample_ampoule')
  const catalyst = ks('cracking_catalyst')
  const carrier = ks('activated_carrier')
  const wax = ks('paraffin_cake')
  const seal = ks('chemical_grade_seal')
  const kit = ks('process_commissioning_kit')
  const polymerPlate = gt('polyethylene_plate')
  const steelCasing = gt('steel_machine_casing')
  const steelFrame = gt('steel_frame')
  const cleanOil = ks('washed_crude')
  const distilled = gt('distilled_water')
  const brine = gt('salt_water')
  const diesel = gt('diesel')
  const lubricant = gt('lubricant')
  const ethylene = gt('ethylene')
  const polymer = gt('polyethylene')
  const naphtha = gt('naphtha')
  const lightFuel = gt('light_fuel')
  const heavyFuel = gt('heavy_fuel')
  const refineryGas = gt('refinery_gas')
  const conditionedFuel = gt('lightly_hydro_cracked_light_fuel')

  const replacedOutputs = [
    steelCasing, steelFrame, gt('steel_drum'), gt('mv_fluid_drilling_rig'), gt('mv_energy_input_hatch'),
    gt('mv_output_hatch'), gt('mv_distillery'), gt('mv_chemical_bath'), gt('mv_electrolyzer'), gt('mv_combustion'),
    tank, pnc('refinery'), pnc('refinery_output'), pnc('thermopneumatic_processing_plant'),
    pnc('vortex_tube'), pnc('heat_pipe'), pnc('heat_sink'), pnc('liquid_compressor'),
    pnc('reinforced_pressure_tube'), pnc('advanced_pressure_tube'), pnc('fluid_mixer'),
    pnc('empty_pcb'), pnc('etching_tank'), polymerPlate, pnc('plastic')
  ]
  replacedOutputs.forEach(output => event.remove({ output: output }))
  event.replaceInput({ input: pnc('plastic') }, pnc('plastic'), polymerPlate)

  const replacedPneumaticRecipes = [
    'refinery/oil_2', 'refinery/oil_3', 'refinery/oil_4',
    'thermo_plant/plastic_from_lpg', 'thermo_plant/plastic_from_biodiesel', 'heat_frame_cooling/plastic',
    'thermo_plant/lubricant_from_biodiesel', 'thermo_plant/lubricant_from_diesel',
    'thermo_plant/reinforced_pressure_tube', 'assembly/advanced_pressure_tube', 'fluid_mixer/biodiesel',
    'pressure_chamber/empty_pcb', 'pressure_chamber/etching_acid',
    'amadron/emerald_to_oil', 'amadron/oil_to_emerald', 'amadron/diesel_to_emerald',
    'pneumaticcraft_fuels/crude_oil'
  ]
  replacedPneumaticRecipes.forEach(id => event.remove({ id: pnc(id) }))

  const originalOilVariants = ['oil', 'oil_light', 'oil_medium', 'oil_heavy']
  const rawOilRecipes = [
    'distillery', 'distillation_tower', 'chemical_reactor', 'large_chemical_reactor', 'large_boiler', 'combustion_generator'
  ]
  rawOilRecipes.forEach(type => originalOilVariants.forEach(id =>
    event.remove({ type: gt(type), input: Fluid.of(gt(id), 1) })
  ))
  // Distilled water also comes from the pack's steam turbines. Only remove the stock water recipes.
  const canonicalFluids = [naphtha, lightFuel, heavyFuel, refineryGas, lubricant, polymer, diesel, conditionedFuel]
  canonicalFluids.forEach(id => event.remove({ mod: 'gtceu', output: Fluid.of(id, 1) }))
  const stockWaterRecipes = [
    'distillery/distill_water_small', 'distillation_tower/distill_water_large',
    'electrolyzer/distilled_water_electrolysis'
  ]
  stockWaterRecipes.forEach(id => event.remove({ id: gt(id) }))

  const shaped = (id, output, rows, keys) =>
    event.shaped(output, rows, keys).id(id.includes(':') ? id : prefix + id)
  const custom = (id, data) => event.custom(data).id(id.includes(':') ? id : prefix + id)
  function machine(type, id, spec) {
    const recipe = event.recipes.gtceu[type](prefix + id)
    if (spec.items) spec.items.forEach(item => recipe.itemInputs(item))
    if (spec.fluids) spec.fluids.forEach(([id, amount]) => recipe.inputFluids(Fluid.of(id, amount)))
    if (spec.outputs) spec.outputs.forEach(item => recipe.itemOutputs(item))
    if (spec.liquids) spec.liquids.forEach(([id, amount]) => recipe.outputFluids(Fluid.of(id, amount)))
    return recipe.duration(spec.ticks).EUt(spec.power === undefined ? 96 : spec.power)
  }
  const assembly = (id, items, output, ticks) =>
    machine('assembler', id, { items: items, outputs: [output], ticks: ticks })
  const pncFluid = (id, amount) => ({ type: pnc('fluid'), fluid: id, amount: amount })
  const fluidStack = (id, amount) => ({ fluid: id, amount: amount })
  const pressure = (id, items, output, count, bar) => custom(id, {
    type: pnc('pressure_chamber'),
    inputs: items.map(item => ({ item: item })),
    pressure: bar,
    results: [{ item: output, count: count }]
  })

  global.fieldworkProcess(event, prefix + 'strainer_mesh', 'forming_press', {
    ingredients: [foil, foil, gt('charcoal_dust'), ks('pressed_insulation'), steel].map(item => ({ item: item })),
    results: [{ item: mesh, count: 2 }]
  }, 28)
  shaped('seismic_probe', ks('seismic_probe'), ['FRF', 'CSP', 'ABA'], {
    F: foil, R: 'minecraft:redstone', C: circuit, S: ks('sealed_mv_module'),
    P: oldSeal, A: aluminium, B: cable
  })
  shaped('steel_frames', '2x ' + steelFrame, ['PRP', 'FSF', 'PRP'], {
    P: steel, R: ks('iron_rivet'), F: frame, S: ks('steel_press_blank')
  })
  assembly('structural_casings', ['4x ' + steel, '2x ' + frame, ks('furnace_lining_insert'), oldSeal], '2x ' + steelCasing, 380)
  assembly('mv_energy_input_hatch', [hull, gt('lv_energy_input_hatch'), '2x ' + circuit, '2x ' + cable, oldSeal], gt('mv_energy_input_hatch'), 360)
  assembly('mv_output_hatch', [hull, pump, steelCasing, '2x ' + cable, '2x ' + oldSeal], gt('mv_output_hatch'), 380)
  pressure('compress_drill_head', [ks('balanced_turbine_rotor'), frame, oldSeal, pressedIron], drillHead, 1, 4.0)
  assembly('fluid_drilling_rig', [
    hull, '2x ' + pump, 'gtceu:lv_electric_pump', '2x ' + drillHead, '4x ' + steelCasing, '2x ' + circuit, '2x ' + cable
  ], gt('mv_fluid_drilling_rig'), 960)

  shaped('drum_liner', ks('drum_liner'), ['PSP', 'FGF', 'PSP'], {
    P: steel, S: oldSeal, F: foil, G: 'minecraft:glass_pane'
  })
  shaped('steel_drum', gt('steel_drum'), ['SPS', 'FLF', 'SPS'], {
    S: steel, P: ks('steel_press_blank'), F: frame, L: ks('drum_liner')
  })
  shaped(tank, tank, ['SPS', 'FLF', 'ITI'], {
    S: pressedIron, P: oldSeal, F: 'minecraft:glass_pane', L: ks('drum_liner'),
    I: steel, T: tube
  })
  shaped('oil_wash_cartridge', cartridge, ['PMP', 'FLF', 'PMP'], {
    P: oldSeal, M: mesh, F: ks('pressed_insulation'), L: ks('lime_flux')
  })
  assembly('mv_distillery', [hull, pump, '2x ' + circuit, tank, '2x ' + mesh, frame], gt('mv_distillery'), 640)
  machine('distillery', 'clean_process_water', {
    items: [mesh], fluids: [['minecraft:water', 1000]], liquids: [[distilled, 800]], ticks: 360
  })

  machine('chemical_reactor', 'wash_crude', {
    items: [cartridge], fluids: [[distilled, 250]], outputs: [spent],
    liquids: [[ks('desalted_crude'), 800], [brine, 400]], ticks: 420
  }).inputFluids('#zero_shift:raw_oil 1000')
  const coalescer = ks('mv_coalescer')
  const saturated = ks('mv_saturated_coalescer')
  const dielectric = ks('mv_dielectric_oil')
  machine('assembler', 'pack_coalescer', {
    items: [ks('drum_liner'), '2x ' + mesh, ks('furnace_lining_insert'), '2x ' + foil, oldSeal],
    fluids: [[gt('tin'), 144]], outputs: [coalescer], ticks: 360
  })
  custom('dewater_crude', {
    type: pnc('thermo_plant'), exothermic: false, pressure: 3.25,
    temperature: { min_temp: 398 }, item_input: { item: coalescer },
    fluid_input: pncFluid(ks('desalted_crude'), 800),
    fluid_output: fluidStack(cleanOil, 750), item_output: { item: saturated }
  })
  machine('chemical_bath', 'regenerate_coalescer', {
    items: [saturated], fluids: [[distilled, 200]], outputs: [coalescer],
    liquids: [[brine, 150]], ticks: 320, power: 96
  })
  assembly('mv_chemical_bath', [hull, pump, tank, '2x ' + oldSeal, '2x ' + mesh, circuit], gt('mv_chemical_bath'), 480)
  machine('chemical_bath', 'rinse_wash_cartridge', {
    items: [spent], fluids: [[distilled, 200]], outputs: [mesh],
    liquids: [[brine, 150]], ticks: 280, power: 24
  })
  machine('distillery', 'recover_water_from_brine', {
    fluids: [[brine, 400]], outputs: [gt('salt_dust')], liquids: [['minecraft:water', 200]], ticks: 440
  })

  event.recipes.gtceu.forming_press(prefix + 'refinery_tray')
    .itemInputs(ks('drum_liner')).notConsumable('gtceu:plate_casting_mold')
    .itemOutputs(Item.of(tray, 2)).duration(240).EUt(96)
  assembly('heat_exchange_core', [
    '2x ' + tray, '2x ' + aluminium, '2x ' + ks('heater_ribbon'), frame,
    'gtceu:lv_robot_arm', 'kubejs:pressed_steel_frame', oldSeal
  ], exchanger, 620)
  shaped(pnc('refinery'), pnc('refinery'), ['PFP', 'CHT', 'BEB'], {
    P: pressedIron, F: frame, C: circuit, H: hull, T: tank, B: tray, E: exchanger
  })
  shaped(pnc('refinery_output'), pnc('refinery_output'), ['SPS', 'BTB', 'EFE'], {
    S: steel, P: oldSeal, B: tray, T: tank, E: exchanger, F: frame
  })
  shaped(pnc('heat_pipe'), '2x ' + pnc('heat_pipe'), ['PHP', 'ICI', 'PHP'], {
    P: pressedIron, H: ks('heater_ribbon'), I: ks('pressed_insulation'), C: tray
  })
  shaped(pnc('heat_sink'), pnc('heat_sink'), ['AHA', 'BEB', 'SIS'], {
    A: aluminium, H: ks('heater_ribbon'), B: foil, E: exchanger, S: steel, I: pressedIron
  })
  shaped(pnc('vortex_tube'), pnc('vortex_tube'), ['PHP', 'TET', 'ISI'], {
    P: pressedIron, H: ks('heater_ribbon'), T: tube, E: exchanger, I: oldSeal, S: pnc('heat_pipe')
  })
  shaped(pnc('thermopneumatic_processing_plant'), pnc('thermopneumatic_processing_plant'), ['PFP', 'TET', 'VHC'], {
    P: pressedIron, F: frame, T: tank, E: exchanger, V: pnc('pressure_chamber_valve'),
    H: hull, C: circuit
  })

  custom('refinery_four_fractions', {
    type: pnc('refinery'),
    input: pncFluid(cleanOil, 100),
    results: [
      fluidStack(heavyFuel, 25), fluidStack(lightFuel, 25), fluidStack(naphtha, 30), fluidStack(refineryGas, 20)
    ],
    temperature: { min_temp: 403 }
  })
  shaped('sample_ampoules', '2x ' + ampoule, ['GPG', 'FCF'], {
    G: ks('glass_tube_blank'), P: oldSeal, F: foil, C: aluminium
  })
  const samples = [
    [cleanOil, 'washed_oil_sample'], [heavyFuel, 'heavy_fuel_sample'], [lightFuel, 'light_fuel_sample'],
    [naphtha, 'naphtha_sample'], [refineryGas, 'refinery_gas_sample'], [diesel, 'diesel_sample']
  ]
  samples.forEach(([fluid, name]) => global.fieldworkProcess(event, prefix + name, 'canner', { ingredients: [{ item: ampoule }, fluidStack(fluid, 100)],
    results: [{ item: ks(name) }]
  }, 28))

  machine('assembler', 'activate_cracking_catalyst', {
    items: ['2x ' + ks('nickel_concentrate'), '2x ' + gt('charcoal_dust'), mesh, ks('furnace_lining_insert')],
    fluids: [[distilled, 200]], outputs: ['3x ' + catalyst], ticks: 280
  })
  custom('crack_naphtha', {
    type: pnc('thermo_plant'), exothermic: false,
    fluid_input: pncFluid(naphtha, 400), item_input: { item: catalyst },
    fluid_output: fluidStack(ethylene, 300), item_output: { item: carrier },
    temperature: { min_temp: 443 }, pressure: 3.5
  })
  assembly('mv_electrolyzer', [hull, '2x ' + circuit, exchanger, '2x ' + tray, '2x ' + cable, tank], gt('mv_electrolyzer'), 600)
  machine('electrolyzer', 'split_process_water', {
    fluids: [[distilled, 1000]], liquids: [[gt('hydrogen'), 2000], [gt('oxygen'), 1000]], ticks: 440
  })
  machine('chemical_reactor', 'polymerize_ethylene', {
    items: [carrier], fluids: [[ethylene, 300], [gt('oxygen'), 100]],
    liquids: [[polymer, 288]], ticks: 480
  })
  custom('form_polyethylene_plate', {
    type: pnc('thermo_plant'), exothermic: false, pressure: 2.5,
    fluid_input: pncFluid(polymer, 288), temperature: { max_temp: 283 },
    item_output: { item: polymerPlate }
  })
  machine('chemical_reactor', 'separate_heavy_fraction', {
    items: [mesh], fluids: [[heavyFuel, 500], [distilled, 200]],
    outputs: [wax], liquids: [[lubricant, 400], [brine, 200]], ticks: 460
  })
  machine('chemical_reactor', 'condition_light_fuel', {
    items: [catalyst], fluids: [[lightFuel, 500], [gt('hydrogen'), 100]],
    outputs: [gt('sulfur_dust')], liquids: [[conditionedFuel, 500]], ticks: 560
  })
  machine('chemical_reactor', 'finish_diesel', {
    fluids: [[conditionedFuel, 1000], [refineryGas, 500]], liquids: [[diesel, 1200]], ticks: 240
  }).notConsumable(carrier)

  machine('chemical_reactor', 'refine_dielectric_oil', {
    items: [wax], fluids: [[lubricant, 200], [conditionedFuel, 400]],
    liquids: [[dielectric, 500]], ticks: 500, power: 112
  })
  custom('impregnate_insulation', {
    type: pnc('thermo_plant'), exothermic: false, pressure: 4.0,
    temperature: { min_temp: 333 }, item_input: { item: ks('pressed_insulation') },
    fluid_input: pncFluid(dielectric, 250), item_output: { item: ks('mv_impregnated_insulation') }
  })

  machine('assembler', 'polymer_seal_preform', {
    items: ['2x ' + polymerPlate, oldSeal, wax, foil], fluids: [[lubricant, 150]],
    outputs: [ks('polymer_seal_preform')], ticks: 320
  })
  pressure('form_chemical_seals', [ks('polymer_seal_preform'), pressedIron, oldSeal], seal, 2, 4.0)
  pressure(pnc('pressure_chamber/empty_pcb'),
    [polymerPlate, gt('phenolic_printed_circuit_board'), foil, seal], pnc('empty_pcb'), 1, 3.75)
  machine('chemical_reactor', 'prepare_etching_acid', {
    items: ['2x ' + polymerPlate, gt('salt_dust')], fluids: [[distilled, 500], [gt('sulfuric_acid'), 500]],
    liquids: [[pnc('etching_acid'), 1000]], ticks: 620
  })
  assembly('etching_tank', [
    tank, '2x ' + pnc('pressure_chamber_glass'), '2x ' + seal, '2x ' + polymerPlate, 'gtceu:steel_small_fluid_pipe', tray
  ], pnc('etching_tank'), 480)
  assembly('pneumatic_fluid_mixer', [
    '2x ' + tank, '2x ' + seal, exchanger, pnc('turbine_rotor'), '2x ' + tube, 'gtceu:lv_electric_pump'
  ], pnc('fluid_mixer'), 680)
  custom(pnc('fluid_mixer/biodiesel'), {
    type: pnc('fluid_mixer'), input1: { type: pnc('fluid'), tag: 'forge:plantoil', amount: 100 },
    input2: { type: pnc('fluid'), tag: 'forge:ethanol', amount: 100 },
    fluid_output: fluidStack(pnc('biodiesel'), 150), item_output: { item: pnc('glycerol') },
    pressure: 3.5, time: 600
  })
  custom(pnc('thermo_plant/reinforced_pressure_tube'), {
    type: pnc('thermo_plant'), exothermic: false, pressure: 3.5,
    fluid_input: pncFluid(polymer, 144), item_input: { item: tube },
    item_output: { item: pnc('reinforced_pressure_tube'), count: 2 },
    temperature: { min_temp: 393 }
  })
  custom(pnc('assembly/advanced_pressure_tube'), {
    type: pnc('assembly_laser'), program: 'laser',
    input: { type: pnc('stacked_item'), item: pnc('reinforced_pressure_tube'), count: 12 },
    result: { item: pnc('advanced_pressure_tube'), count: 4 }
  })
  shaped('commissioning_kit', kit, ['HLN', 'GDS', 'PCF'], {
    H: ks('heavy_fuel_sample'), L: ks('light_fuel_sample'), N: ks('naphtha_sample'),
    G: ks('refinery_gas_sample'), D: ks('diesel_sample'), S: seal,
    P: polymerPlate, C: circuit, F: frame
  })
  assembly('mv_combustion_generator', [hull, '2x ' + motor, pump, '2x ' + seal, kit, '2x ' + cable], gt('mv_combustion'), 720)
  shaped(pnc('liquid_compressor'), pnc('liquid_compressor'), ['PBP', 'SCI', 'VKV'], {
    P: pnc('reinforced_pressure_tube'), B: tank, S: seal, C: pnc('air_compressor'),
    I: pressedIron, V: pnc('pressure_chamber_valve'), K: kit
  })
})
