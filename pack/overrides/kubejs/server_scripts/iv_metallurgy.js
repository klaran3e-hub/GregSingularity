ServerEvents.recipes(event => {
  const ks = id => 'kubejs:' + id
  const gt = id => 'gtceu:' + id
  const prefix = 'zero_shift:iv_metallurgy/'
  const water = gt('distilled_water')
  const shield = ks('vacuum_shield_gas')
  const argon = gt('argon')
  const gasket = ks('vacuum_gasket')
  const cold = ks('chilled_vacuum_coolant')
  const warm = ks('warm_vacuum_coolant')
  const leach = ks('tungsten_leach_solution')
  const spent = ks('spent_tungsten_leach')
  const filter = ks('iv_leach_filter')
  const plate = gt('tungsten_steel_plate')
  const wire = gt('tungsten_single_wire')
  const cable = gt('tungsten_single_cable')
  const ie = id => 'immersiveengineering:' + id
  const create = id => 'create:' + id
  const pnc = id => 'pneumaticcraft:' + id

  const retired = [
    'nichrome_ingot', 'hot_nichrome_ingot', 'nichrome_plate', 'nichrome_coil_block',
    'tungsten_dust', 'tungsten_ingot', 'hot_tungsten_ingot', 'tungsten_plate',
    'tungsten_steel_ingot', 'hot_tungsten_steel_ingot', 'tungsten_steel_plate',
    'platinum_ingot', 'hot_platinum_ingot', 'platinum_plate', 'tungsten_single_wire', 'tungsten_single_cable'
  ]
  retired.forEach(id => event.remove({ output: gt(id) }))

  function machine(type, id, items, output, ticks, power) {
    const recipe = event.recipes.gtceu[type](prefix + id)
    items.forEach(item => recipe.itemInputs(item))
    return recipe.itemOutputs(output).duration(ticks).EUt(power || 1536)
  }

  function quench(id, input, output, ticks, coolant, gas) {
    return machine('vacuum_freezer', id, [input], output, ticks)
      .inputFluids(Fluid.of(cold, coolant)).inputFluids(Fluid.of(argon, gas))
      .outputFluids(Fluid.of(warm, coolant))
  }

  machine('mixer', 'prepare_nichrome', [
    '5x ' + ks('nickel_concentrate'), '3x ' + ks('chromite_concentrate'),
    '2x ' + ks('sintered_vacuum_tile'), gt('aluminium_dust'), ie('slag')
  ], '4x ' + ks('iv_nichrome_charge'), 940).inputFluids(Fluid.of(water, 900))
  machine('electric_blast_furnace', 'blast_nichrome', [ks('iv_nichrome_charge')],
    ks('iv_hot_nichrome'), 1480).blastFurnaceTemp(2780).inputFluids(Fluid.of(argon, 450))
  quench('quench_nichrome', ks('iv_hot_nichrome'), gt('nichrome_ingot'), 760, 1000, 200)
  machine('bender', 'roll_nichrome', [gt('nichrome_ingot')], gt('nichrome_plate'), 640)
  machine('assembler', 'pack_coil_core', [
    '4x ' + gt('nichrome_plate'), '2x ' + ks('kanthal_winding'), '2x ' + ks('sintered_vacuum_tile'),
    '2x ' + ks('ev_traction_coil'), '2x ' + gasket, ie('coil_hv'), create('precision_mechanism')
  ], '2x ' + ks('iv_coil_core'), 1320).inputFluids(Fluid.of(gt('lubricant'), 900))
  machine('assembler', 'upgrade_nichrome_coil', [
    gt('kanthal_coil_block'), '2x ' + ks('iv_coil_core'), '2x ' + gt('nichrome_plate'),
    '2x ' + ks('vacuum_treated_panel'), '2x ' + gasket, ie('heavy_engineering'), pnc('heat_pipe')
  ], '2x ' + gt('nichrome_coil_block'), 1660, 1920).inputFluids(Fluid.of(gt('lubricant'), 1100))

  machine('centrifuge', 'sort_end_tungstate', [
    '3x ' + gt('crushed_tungstate_ore'), filter
  ], '2x ' + ks('end_tungstate_concentrate'), 1000).inputFluids(Fluid.of(shield, 400))
    .itemOutputs(ks('ore_tailings')).dimension('minecraft:the_end')

  machine('assembler', 'make_leach_filter', [
    '2x ' + ks('end_filter_blank'), '2x ' + ks('strainer_mesh'), ks('sintered_vacuum_tile'),
    ks('chorus_dielectric_film'), gasket, ks('refinery_tray'), pnc('reinforced_pressure_tube')
  ], '2x ' + filter, 1160).inputFluids(Fluid.of(water, 600))
  event.recipes.gtceu.chemical_reactor(prefix + 'prepare_leach_solution')
    .itemInputs(ks('lime_flux')).itemInputs(ks('cracking_catalyst'))
    .inputFluids(Fluid.of(water, 800)).inputFluids(Fluid.of(gt('refinery_gas'), 400))
    .outputFluids(Fluid.of(leach, 1200)).duration(780).EUt(1536)
  event.recipes.gtceu.chemical_reactor(prefix + 'restore_leach_solution')
    .itemInputs(filter).inputFluids(Fluid.of(spent, 1000))
    .outputFluids(Fluid.of(leach, 800)).itemOutputs(ks('ore_tailings')).duration(850).EUt(1536)
  machine('chemical_reactor', 'leach_tungsten', [
    '2x ' + ks('end_tungstate_concentrate'), '4x ' + gt('crushed_scheelite_ore')
  ], '2x ' + ks('iv_tungsten_cake'), 1100).inputFluids(Fluid.of(leach, 1000))
    .outputFluids(Fluid.of(spent, 1000))
  machine('thermal_centrifuge', 'dry_tungsten_cake', [
    ks('iv_tungsten_cake')
  ], '2x ' + gt('tungsten_dust'), 1160).itemOutputs(ks('ore_tailings'))
  machine('electric_blast_furnace', 'blast_tungsten', [gt('tungsten_dust'), ks('fired_refractory_liner')],
    ks('iv_hot_tungsten'), 1700, 1920).blastFurnaceTemp(3500).inputFluids(Fluid.of(argon, 750))
  quench('quench_tungsten', ks('iv_hot_tungsten'), gt('tungsten_ingot'), 1100, 1500, 250)
  machine('bender', 'roll_tungsten', [gt('tungsten_ingot')], gt('tungsten_plate'), 800)

  machine('mixer', 'prepare_tungstensteel', [
    '2x ' + gt('tungsten_ingot'), '2x ' + gt('steel_plate'), '2x ' + ks('fired_refractory_liner'),
    ks('hv_alloy_coupon')
  ], '2x ' + ks('iv_tungstensteel_charge'), 1100).inputFluids(Fluid.of(shield, 450))
  machine('electric_blast_furnace', 'blast_tungstensteel', [
    ks('iv_tungstensteel_charge'), ks('iv_leach_filter')
  ], ks('iv_hot_tungstensteel'), 2060, 1920).blastFurnaceTemp(3600).inputFluids(Fluid.of(argon, 1000))
  quench('quench_tungstensteel', ks('iv_hot_tungstensteel'), gt('tungsten_steel_ingot'), 1450, 2000, 350)
  machine('bender', 'roll_tungstensteel', [gt('tungsten_steel_ingot')], plate, 900, 1920)

  machine('chemical_reactor', 'wash_platinum', [
    '4x ' + gt('crushed_cooperite_ore'), '2x ' + filter
  ], '2x ' + ks('iv_platinum_filter_cake'), 1020).inputFluids(Fluid.of(leach, 1000))
    .outputFluids(Fluid.of(spent, 1000))
  machine('centrifuge', 'separate_platinum_sponge', [
    '2x ' + ks('iv_platinum_filter_cake'), gt('charcoal_dust')
  ], '2x ' + ks('iv_platinum_sponge'), 1180, 1920).itemOutputs(gt('palladium_dust'))
  machine('electric_blast_furnace', 'fire_platinum_sponge', [
    ks('iv_platinum_sponge'), ks('sintered_vacuum_tile')
  ], gt('platinum_ingot'), 1280, 1920).blastFurnaceTemp(3200).inputFluids(Fluid.of(argon, 500))
  machine('bender', 'roll_platinum', [gt('platinum_ingot')], gt('platinum_plate'), 780)

  machine('assembler', 'prepare_busbar', [
    '4x ' + gt('tungsten_plate'), '2x ' + gt('platinum_plate'),
    '2x ' + ks('ev_harness'), '2x ' + ks('sintered_vacuum_tile'), ie('wirecoil_steel'), pnc('heat_sink')
  ], '2x ' + ks('iv_busbar_blank'), 1450, 1920).inputFluids(Fluid.of(gt('lubricant'), 850))
  machine('wiremill', 'draw_iv_conductor', [ks('iv_busbar_blank')], '4x ' + wire, 1040)
  machine('assembler', 'laminate_cable_jacket', [
    '4x ' + ks('chorus_dielectric_film'), '2x ' + ks('sintered_vacuum_tile'),
    '2x ' + gt('polyethylene_plate'), '2x ' + gasket
  ], '4x ' + ks('iv_cable_jacket'), 920)
  machine('assembler', 'insulate_iv_cable', [
    '4x ' + wire, '4x ' + ks('iv_cable_jacket'), '2x ' + gasket
  ], '4x ' + cable, 1200, 1920).inputFluids(Fluid.of(gt('lubricant'), 550))
  const widths = [['double', 2], ['quadruple', 4], ['octal', 8], ['hex', 16]]
  widths.forEach(([name, size], index) => {
    const previous = index === 0 ? wire : gt('tungsten_' + widths[index - 1][0] + '_wire')
    const widerWire = gt('tungsten_' + name + '_wire')
    const result = gt('tungsten_' + name + '_cable')
    event.remove({ output: widerWire })
    machine('assembler', 'draw_' + name + '_wire', [
      '2x ' + previous, ks('iv_busbar_blank'), gt('electrum_single_wire'), '2x ' + gasket
    ], widerWire, 1200 + size * 50, 1920).inputFluids(Fluid.of(gt('lubricant'), 750))
    event.remove({ output: result })
    machine('assembler', 'bind_' + name + '_cable', [
      size + 'x ' + cable, size + 'x ' + ks('iv_cable_jacket'), '2x ' + ks('iv_busbar_blank'), gasket,
      widerWire, pnc('reinforced_pressure_tube')
    ], result, 1100 + size * 40, 1920).circuit(size)
  })
})
