ServerEvents.recipes(event => {
  const ks = name => global.gsItemId(name)
  const gt = name => 'gtceu:' + name

  const prefix = 'zero_shift:hv_foundry/'
  const steel = gt('steel_plate')
  const frame = ks('pressed_steel_frame')
  const aluminium = gt('aluminium_ingot')
  const mvCircuit = gt('good_electronic_circuit')
  const mvHull = gt('mv_machine_hull')
  const mvMotor = gt('mv_electric_motor')
  const mvPump = gt('mv_electric_pump')
  const cable = gt('copper_single_cable')
  const seal = ks('chemical_grade_seal')
  const foil = ks('copper_contact_strip')
  const liner = ks('fired_refractory_liner')
  const kanthal = gt('kanthal_ingot')
  const stainless = gt('stainless_steel_ingot')
  const stainlessPlate = gt('stainless_steel_plate')
  const coolant = gt('distilled_water')
  const lubricant = gt('lubricant')
  const gasket = ks('pressure_gasket')
  const polymer = gt('polyethylene_plate')
  const goldBlank = ks('gold_conductor_blank')
  const goldWire = gt('gold_single_wire')
  const goldCable = gt('gold_single_cable')
  const winding = ks('hv_winding_pack')
  const arcShield = ks('hv_arc_shield')
  const ceramic = ks('ceramic_hv_substrate')
  const circuitPreform = ks('hv_circuit_preform')
  const sealedModule = ks('sealed_hv_module')
  const hvCircuit = gt('advanced_integrated_circuit')
  const pressedInsulation = ks('pressed_insulation')
  const electrumWire = gt('electrum_single_wire')
  const ieCoil = 'gtceu:mv_voltage_coil'
  const reinforcedTube = 'pneumaticcraft:reinforced_pressure_tube'
  const solder = ks('tin_solder_preform')

  const replacements = [
    gt('mv_macerator'), gt('mv_mixer'), gt('mv_wiremill'), gt('mv_lathe'), gt('mv_bender'),
    gt('mv_electric_piston'), gt('mv_conveyor_module'), gt('mv_robot_arm'), gt('mv_input_hatch'),
    kanthal, stainless, stainlessPlate, gt('kanthal_coil_block'),
    hvCircuit, goldWire, goldCable, gt('micro_processor_assembly')
  ]
  replacements.forEach(output => event.remove({ output: output }))
  event.remove({ type: gt('macerator'), input: 'minecraft:basalt' })
  event.remove({ type: gt('wiremill'), input: kanthal })
  event.remove({ type: gt('bender'), input: stainless })
  event.remove({ id: /^gtceu:.*(?:kanthal|stainless_steel).*(?:blast_furnace|alloy_blast_smelter)/ })
  event.remove({ id: /^gtceu:(?:electric_blast_furnace|alloy_blast_smelter)\/.*(?:kanthal|stainless_steel)/ })

  function machine(type, id, items, output, ticks, eut) {
    const recipe = event.recipes.gtceu[type](id.includes(':') ? id : prefix + id)
    items.forEach(item => recipe.itemInputs(item))
    return recipe.itemOutputs(output).duration(ticks).EUt(eut)
  }
  function assemble(id, items, output, ticks) {
    return machine('assembler', id, items, output, ticks, 96)
  }
  function press(id, input, output, count, energy) {
    return event.recipes.gtceu.forming_press(prefix + id)
      .itemInputs(input).notConsumable('gtceu:plate_casting_mold')
      .itemOutputs(Item.of(output, count)).duration(Math.ceil((energy || 14400) / 96)).EUt(96)
  }
  function fire(id, input, output, ticks) {
    return event.custom({
      type: 'minecraft:smelting', ingredient: { item: input },
      result: output, cookingtime: ticks, experience: 0.4
    }).id(prefix + id)
  }

  assemble('nether_transit_seal', [
    ks('process_commissioning_kit'), '4x ' + seal, '2x ' + mvCircuit, '4x ' + steel,
    '2x ' + ks('heat_exchange_core'), '2x ' + ks('furnace_lining_insert'),
    'gtceu:lv_robot_arm', '2x ' + frame
  ], ks('nether_transit_seal'), 1160).inputFluids(Fluid.of(lubricant, 500))

  const mvTools = [
    ['electric_piston', gt('lv_electric_motor'), mvMotor, ks('iron_pressure_slug')],
    ['conveyor_module', gt('lv_conveyor_module'), mvMotor, gt('polyethylene_plate')],
    ['macerator', gt('lp_steam_macerator'), mvMotor, ks('drill_seal_head')],
    ['mixer', 'gtceu:gregsingularity_turned_spindle', mvMotor, ks('heat_exchange_core')],
    ['wiremill', 'gtceu:gregsingularity_forging_saddle', mvMotor, ks('steel_press_blank')],
    ['lathe', 'gtceu:gregsingularity_saw_blade', gt('mv_electric_piston'), ks('drill_seal_head')],
    ['bender', gt('lp_steam_forge_hammer'), gt('mv_electric_piston'), 'gtceu:plate_casting_mold']
  ]
  mvTools.forEach(([id, previous, drive, workingPart]) => {
    assemble('mv_' + id, [mvHull, previous, '2x ' + drive, workingPart, '2x ' + mvCircuit, '2x ' + frame,
      '2x ' + cable, 'gtceu:lv_robot_arm', '2x ' + gasket], gt('mv_' + id), 820)
      .inputFluids(Fluid.of(id === 'electric_piston' ? gt('creosote') : lubricant, 400))
  })
  assemble('mv_input_hatch', [mvHull, mvPump, gt('steel_machine_casing'), '2x ' + seal, '2x ' + cable,
    '2x pneumaticcraft:pressure_tube', 'gtceu:gregsingularity_hand_pump_barrel', '2x ' + frame], gt('mv_input_hatch'), 660)
    .inputFluids(Fluid.of(lubricant, 300))
  assemble('mv_robot_arm', [
    '2x ' + mvMotor, gt('mv_electric_piston'), gt('mv_conveyor_module'),
    '2x ' + mvCircuit, '2x ' + frame, '2x ' + cable, '2x ' + seal, 'gtceu:lv_robot_arm',
    '2x ' + 'gtceu:gregsingularity_pressed_steel_frame'
  ], gt('mv_robot_arm'), 880).inputFluids(Fluid.of(lubricant, 450))

  event.remove({ id: 'gtceu:macerator/macerate_basalt' })
  machine('macerator', 'crush_nether_basalt', ['4x minecraft:basalt'], '2x ' + ks('basalt_grit'), 340, 96)
    .dimension('minecraft:the_nether')
  machine('chemical_bath', 'wash_chromite', ['6x ' + ks('basalt_grit')], ks('chromite_concentrate'), 580, 96)
    .inputFluids(Fluid.of(coolant, 800)).itemOutputs(ks('ore_tailings'))
  machine('mixer', 'mix_refractory', ['3x ' + ks('basalt_grit'), '2x minecraft:soul_sand',
    '2x ' + ks('fireclay_charge'), '2x ' + ks('clay_mortar'), '2x ' + ks('furnace_lining_insert')],
    '4x ' + ks('refractory_mix'), 560, 96).inputFluids(Fluid.of(coolant, 650))
  press('press_refractory', ks('refractory_mix'), ks('refractory_cast'), 1, 19200)
  fire('fire_refractory', ks('refractory_cast'), liner, 920)

  machine('mixer', 'mix_kanthal', ['3x ' + gt('steel_ingot'), '2x ' + aluminium,
    '2x ' + ks('chromite_concentrate'), '2x ' + liner, gt('charcoal_dust')],
    '2x ' + ks('kanthal_charge'), 640, 96).inputFluids(Fluid.of(coolant, 500))
  machine('electric_blast_furnace', 'blast_kanthal', [ks('kanthal_charge')], ks('hot_kanthal_billet'), 1200, 112)
    .blastFurnaceTemp(1750).inputFluids(Fluid.of(gt('oxygen'), 200))
  machine('chemical_bath', 'quench_kanthal', [ks('hot_kanthal_billet')], kanthal, 420, 96)
    .inputFluids(Fluid.of(coolant, 500))
  machine('wiremill', 'draw_kanthal', [kanthal], '2x ' + ks('kanthal_winding'), 420, 96)
  assemble('kanthal_coils', [
    '6x ' + ks('kanthal_winding'), ks('hot_kanthal_billet'), gt('cupronickel_coil_block'), '3x ' + liner,
    '2x ' + frame, '2x ' + seal, 'gtceu:lv_voltage_coil'
  ], '2x ' + gt('kanthal_coil_block'), 880).inputFluids(Fluid.of(lubricant, 450))

  machine('mixer', 'mix_stainless', [
    '4x ' + gt('steel_ingot'), '3x ' + ks('nickel_concentrate'), '3x ' + ks('chromite_concentrate'),
    '2x ' + liner, gt('charcoal_dust')
  ], '4x ' + ks('stainless_charge'), 760, 96).inputFluids(Fluid.of(coolant, 600))
  machine('electric_blast_furnace', 'blast_stainless', [ks('stainless_charge')], ks('hot_stainless_billet'), 1400, 120)
    .blastFurnaceTemp(2450).inputFluids(Fluid.of(gt('oxygen'), 400))
  machine('chemical_bath', 'quench_stainless', [ks('hot_stainless_billet')], stainless, 480, 96)
    .inputFluids(Fluid.of(coolant, 650))
  machine('bender', 'roll_stainless_plate', [stainless], stainlessPlate, 480, 96)

  press('press_hv_substrate', liner, ceramic, 1, 24000)
  global.fieldworkProcess(event, prefix + 'hv_circuit_preform', 'assembler', { processingTime: 240,
    ingredients: [
      ceramic, gt('phenolic_printed_circuit_board'), mvCircuit, mvCircuit,
      ks('kanthal_winding'), ks('kanthal_winding'), foil, electrumWire, seal
    ].map(item => ({ item: item })),
    results: [{ item: circuitPreform }]
  }, 96)
  event.custom({
    type: 'pneumaticcraft:pressure_chamber', pressure: 4.5,
    inputs: [circuitPreform, seal, gasket, polymer, reinforcedTube, 'gtceu:copper_single_cable'].map(item => ({ item: item })),
    results: [{ item: sealedModule }]
  }).id(prefix + 'seal_hv_circuit')
  machine('circuit_assembler', 'first_hv_circuit', [
    '2x ' + sealedModule, '4x ' + mvCircuit, '4x ' + gt('resistor'), '4x ' + solder,
    '2x ' + goldBlank, '2x ' + stainlessPlate
  ], hvCircuit, 2880, 120).inputFluids(Fluid.of(lubricant, 600))
  machine('circuit_assembler', 'series_hv_circuit', [
    '4x ' + sealedModule, '4x ' + mvCircuit, '4x ' + gt('resistor'), '6x ' + solder,
    '4x ' + ks('hv_switch_contact'), '2x ' + arcShield
  ], '2x ' + hvCircuit, 3600, 480).inputFluids(Fluid.of(lubricant, 1100))
  machine('circuit_assembler', 'microprocessor_assembly', [
    hvCircuit, sealedModule, '2x ' + ks('hv_switch_contact'), '2x ' + gt('diode'), '2x ' + solder, ceramic
  ], gt('micro_processor_assembly'), 1520, 480).inputFluids(Fluid.of(lubricant, 500))

  global.fieldworkProcess(event, prefix + 'gold_conductor_blank', 'assembler', { processingTime: 180,
    ingredients: ['minecraft:gold_ingot', 'minecraft:gold_ingot', foil, foil, electrumWire, ceramic, pressedInsulation, gasket]
      .map(item => ({ item: item })).concat({ fluid: lubricant, amount: 150 }),
    results: [{ item: goldBlank }]
  }, 96)
  machine('wiremill', 'draw_hv_gold_wire', [goldBlank], '2x ' + goldWire, 560, 96)
  machine('assembler', 'insulate_hv_gold_cable', [
    '4x ' + goldWire, '2x ' + polymer, '2x ' + pressedInsulation, '2x ' + seal, reinforcedTube
  ], '4x ' + goldCable, 720, 120).inputFluids(Fluid.of(lubricant, 350))
  machine('assembler', 'hv_winding_pack', [
    '4x ' + goldWire, '4x ' + ks('kanthal_winding'), '2x ' + stainlessPlate,
    '2x ' + pressedInsulation, '2x ' + seal, ieCoil
  ], '2x ' + winding, 920, 120).inputFluids(Fluid.of(lubricant, 450))
  machine('assembler', 'hv_arc_shield', [
    '4x ' + liner, '4x ' + stainlessPlate, ks('hot_stainless_billet'), '2x ' + ceramic, '2x ' + foil,
    '2x ' + frame, '2x pneumaticcraft:ingot_iron_compressed'
  ], '2x ' + arcShield, 840, 120).inputFluids(Fluid.of(coolant, 500))
  machine('lathe', 'turn_hv_switch_contacts', [goldBlank], '2x ' + ks('hv_switch_contact'), 620, 96)

  machine('mixer', 'zero_shift:hv/charge_for_trial', [
    '6x ' + stainless, '3x ' + ks('chromite_concentrate'), '3x ' + ks('nickel_concentrate'),
    '2x ' + liner, '2x ' + 'gtceu:dark_ash_dust', gt('charcoal_dust')
  ], '4x ' + ks('hv_trial_charge'), 1200, 384).inputFluids(Fluid.of(coolant, 750))
  machine('electric_blast_furnace', 'zero_shift:hv/trial_cast', [
    ks('hv_trial_charge')
  ], ks('hot_hv_trial_billet'), 1800, 480).blastFurnaceTemp(2550).inputFluids(Fluid.of(gt('oxygen'), 1200))
  machine('chemical_bath', 'zero_shift:hv/trial_quench', [
    ks('hot_hv_trial_billet')
  ], ks('hv_alloy_coupon'), 800, 384).inputFluids(Fluid.of(coolant, 1000))
  machine('assembler', 'zero_shift:hv/close_hv_shift', [
    '16x ' + ks('hv_alloy_coupon'), '2x ' + ks('received_refractory_crate'), '3x ' + hvCircuit,
    '2x ' + ks('signal_relay'), '2x ' + arcShield, '4x ' + stainlessPlate, 'gtceu:lv_sensor', ieCoil,
    'pneumaticcraft:regulator_tube_module'
  ], ks('hv_commissioning_report'), 2400, 480).inputFluids(Fluid.of(coolant, 1500))
})
