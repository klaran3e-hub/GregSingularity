ServerEvents.recipes(event => {
  const ks = id => 'kubejs:' + id
  const gt = id => 'gtceu:' + id
  const part = id => ks('luv_' + id)
  const prefix = 'zero_shift:luv_metallurgy/'
  const permit = ks('iv_commissioning_report')
  const shield = ks('vacuum_shield_gas')
  const argon = gt('argon')
  const cold = ks('chilled_vacuum_coolant')
  const warm = ks('warm_vacuum_coolant')
  const leach = ks('niobium_leach_solution')
  const spent = ks('spent_niobium_leach')
  const filter = ks('iv_leach_filter')
  const hss = gt('hssg_plate')
  const conductor = gt('niobium_titanium_plate')
  const wire = gt('niobium_titanium_single_wire')
  const cable = gt('niobium_titanium_single_cable')
  const tube = 'pneumaticcraft:advanced_pressure_tube'

  const grades = ['hssg', 'niobium_titanium', 'rhodium_plated_palladium']
  grades.forEach(grade => {
    ;[grade + '_ingot', 'hot_' + grade + '_ingot', grade + '_plate', grade + '_dust'].forEach(id => {
      event.remove({ output: gt(id) })
    })
  })
  ;['hssg_coil_block', 'niobium_titanium_single_wire', 'niobium_titanium_single_cable'].forEach(id => {
    event.remove({ output: gt(id) })
  })

  function machine(type, id, inputs, output, ticks, power) {
    const recipe = event.recipes.gtceu[type](prefix + id)
    inputs.forEach(input => recipe.itemInputs(input))
    if (output) recipe.itemOutputs(output)
    return recipe.duration(ticks).EUt(power)
  }

  function heatAndFinish(grade, charge, hot, temperature, gas, coolant, ticks) {
    machine('electric_blast_furnace', 'blast_' + grade, [part(charge), ks('fired_refractory_liner')],
      part(hot), ticks, 7680).blastFurnaceTemp(temperature).inputFluids(Fluid.of(argon, gas))
    machine('vacuum_freezer', 'quench_' + grade, [part(hot)], gt(grade + '_ingot'), ticks - 440, 7680)
      .inputFluids(Fluid.of(cold, coolant)).inputFluids(Fluid.of(shield, 600)).outputFluids(Fluid.of(warm, coolant))
    machine('bender', 'roll_' + grade, [gt(grade + '_ingot')], gt(grade + '_plate'), 1400, 6144)
    machine('macerator', 'mill_' + grade, [gt(grade + '_ingot')], gt(grade + '_dust'), 1550, 6144)
  }

  machine('mixer', 'prepare_hssg', [
    '4x gtceu:tungsten_steel_plate', '4x kubejs:chromite_concentrate', '4x gtceu:molybdenum_dust',
    '2x gtceu:vanadium_dust', '2x kubejs:fired_refractory_liner'
  ], '4x ' + part('hssg_charge'), 1900, 7360)
    .notConsumable(Item.of(permit)).inputFluids(Fluid.of(shield, 1200))
  heatAndFinish('hssg', 'hssg_charge', 'hot_hssg', 3850, 1600, 2600, 2480)
  machine('assembler', 'wind_hssg_coil', [
    '4x ' + hss, '2x kubejs:iv_coil_core', '2x kubejs:vacuum_treated_panel',
    '4x kubejs:iv_cable_jacket', '2x gtceu:iv_electric_motor',
    '2x gtceu:electrum_quadruple_cable', '2x gtceu:lv_robot_arm'
  ], '2x ' + part('coil_winding'), 1880, 7360).inputFluids(Fluid.of(gt('lubricant'), 1000))
  machine('assembler', 'upgrade_hssg_coil', [
    '2x gtceu:nichrome_coil_block', '2x ' + part('coil_winding'), '4x ' + hss,
    '4x kubejs:sintered_vacuum_tile', '4x kubejs:vacuum_gasket'
  ], '2x gtceu:hssg_coil_block', 2200, 7680).inputFluids(Fluid.of(gt('lubricant'), 1400))

  machine('centrifuge', 'concentrate_tantalite', ['4x gtceu:crushed_tantalite_ore'],
    '2x ' + part('tantalite_concentrate'), 2200, 6144)
    .notConsumable(Item.of(permit)).inputFluids(Fluid.of(shield, 750))
    .itemOutputs(ks('ore_tailings')).dimension('ad_astra:venus')
  machine('chemical_reactor', 'prepare_niobium_leach', [ks('lime_flux'), filter], '', 1750, 6144)
    .inputFluids(Fluid.of(ks('tungsten_leach_solution'), 1000)).inputFluids(Fluid.of(gt('distilled_water'), 600))
    .outputFluids(Fluid.of(leach, 1600))
  machine('chemical_reactor', 'digest_tantalite', ['2x ' + part('tantalite_concentrate'), filter],
    '2x ' + part('niobium_cake'), 2300, 7360)
    .inputFluids(Fluid.of(leach, 1200)).outputFluids(Fluid.of(spent, 1200))
  machine('chemical_reactor', 'restore_niobium_leach', [filter], ks('ore_tailings'), 1550, 6144)
    .inputFluids(Fluid.of(spent, 1200)).outputFluids(Fluid.of(leach, 900))
  machine('mixer', 'prepare_niobium_titanium', [
    '2x ' + part('niobium_cake'), '4x gtceu:titanium_plate', '2x gtceu:tungsten_dust', '2x kubejs:sintered_vacuum_tile'
  ], '4x ' + part('niobium_charge'), 2180, 7360).inputFluids(Fluid.of(shield, 850))
  heatAndFinish('niobium_titanium', 'niobium_charge', 'hot_conductor', 4700, 1600, 2400, 2500)

  machine('chemical_reactor', 'leach_platinum_residue', ['4x kubejs:iv_platinum_filter_cake', '2x ' + filter],
    '2x ' + part('pgm_sludge'), 2200, 7360)
    .inputFluids(Fluid.of(leach, 1500)).outputFluids(Fluid.of(spent, 1200))
    .itemOutputs('2x gtceu:palladium_dust')
  machine('thermal_centrifuge', 'purify_rhodium', [part('pgm_sludge')], part('rhodium_sponge'), 2400, 7680)
    .itemOutputs(ks('ore_tailings'))
  machine('mixer', 'prepare_plated_palladium', [
    '2x ' + part('rhodium_sponge'), '4x gtceu:palladium_dust', '2x gtceu:platinum_plate', '2x ' + hss
  ], '4x ' + part('palladium_charge'), 2240, 7680).inputFluids(Fluid.of(shield, 1600))
  heatAndFinish('rhodium_plated_palladium', 'palladium_charge', 'hot_palladium', 5100, 1800, 3000, 2880)

  machine('wiremill', 'draw_niobium_wire', [gt('niobium_titanium_ingot')], '4x ' + wire, 1920, 7360)
  machine('assembler', 'press_busbar', [
    '4x ' + conductor, '2x kubejs:iv_busbar_blank', '2x ' + part('dielectric_laminate'), '2x gtceu:platinum_plate',
    '2x gtceu:gold_quadruple_cable', '2x gtceu:lv_robot_arm'
  ], '4x ' + part('busbar'), 1940, 7360).inputFluids(Fluid.of(gt('lubricant'), 1250))
  machine('assembler', 'insulate_niobium_wire', [
    '4x ' + wire, '2x ' + part('busbar'), '4x ' + part('dielectric_laminate'), '2x kubejs:vacuum_gasket',
    '2x ' + tube
  ], '4x ' + cable, 2200, 7680).inputFluids(Fluid.of(gt('lubricant'), 1300))
  ;[['single', 'double', 2], ['double', 'quadruple', 4], ['quadruple', 'octal', 8], ['octal', 'hex', 16]]
    .forEach(([previous, width, cores]) => {
    const bundle = gt('niobium_titanium_' + width + '_cable')
    const uninsulated = gt('niobium_titanium_' + width + '_wire')
    event.remove({ output: bundle })
    event.remove({ output: uninsulated })
    machine('assembler', 'bind_' + width + '_wire', [
      '2x ' + gt('niobium_titanium_' + previous + '_wire'), cores / 2 + 'x ' + part('busbar'),
      '2x gtceu:steel_quadruple_wire'
    ], uninsulated, 1400 + 70 * cores, 7360).inputFluids(Fluid.of(gt('lubricant'), 640 + 80 * cores))
    machine('assembler', 'bind_' + width + '_cable', [
      cores + 'x ' + cable, uninsulated, cores + 'x ' + part('dielectric_laminate'), '2x ' + part('busbar'),
      '2x kubejs:vacuum_gasket', cores / 2 + 'x ' + tube
    ], bundle, 1700 + 85 * cores, 7680).circuit(cores)
      .inputFluids(Fluid.of(gt('lubricant'), 800 + 80 * cores))
  })

  const pipeSizes = ['tiny', 'small', 'normal', 'large', 'huge', 'quadruple', 'nonuple']
  pipeSizes.forEach((size, index) => {
    const id = 'niobium_titanium_' + size + '_fluid_pipe'
    event.remove({ output: gt(id) })
    machine('assembler', 'line_' + id, [
      '2x gtceu:tungsten_steel_' + size + '_fluid_pipe', '4x ' + conductor, '2x ' + part('dielectric_laminate'),
      '2x ' + tube, '2x gtceu:steel_small_fluid_pipe', '2x kubejs:vacuum_gasket'
    ], (index < 3 ? '2x ' : '') + gt(id), 1960 + index * 230, 7680)
      .inputFluids(Fluid.of(gt('lubricant'), 1000 + index * 250))
  })
})
