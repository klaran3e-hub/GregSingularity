ServerEvents.recipes(event => {
  event.remove({ output: 'gtceu:tin_normal_item_pipe' })
  event.recipes.gtceu.assembler('zero_shift:yard/tin_item_pipe')
    .itemInputs('2x gtceu:tin_small_item_pipe', '3x gtceu:tin_plate', '2x kubejs:iron_rivet',
      '2x kubejs:pressed_insulation', 'gtceu:treated_wood_planks')
    .inputFluids(Fluid.of('minecraft:water', 250))
    .itemOutputs('2x gtceu:tin_normal_item_pipe').duration(420).EUt(24)

  event.recipes.gtceu.assembler('zero_shift:yard/inspect_refractory_crates')
    .itemInputs('4x kubejs:sealed_refractory_crate', '2x kubejs:chemical_grade_seal', '4x minecraft:paper',
      'gtceu:copper_single_cable', '2x gtceu:electrum_quadruple_cable')
    .inputFluids(Fluid.of('gtceu:distilled_water', 1000))
    .itemOutputs('3x kubejs:received_refractory_crate').duration(1400).EUt(96)
})
