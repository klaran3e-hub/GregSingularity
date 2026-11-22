ServerEvents.recipes(event => {
  const part = name => global.gsItemId('titan_' + name)
  const surface = 'zero_shift:titan'
  const orbit = 'zero_shift:titan_orbit'
  const raw = part('raw_condensate')
  const coolant = part('orbital_coolant')
  const returns = part('return_liquor')
  function process(type, name, dimension, ticks, eu) {
    return event.recipes.gtceu[type]('zero_shift:titan_orbit/' + name)
      .dimension(dimension).duration(ticks).EUt(eu)
  }

  process('chemical_bath', 'impregnate_wicks', 'zero_shift:europa', 960, 122880)
    .itemInputs('ad_astra:gregsingularity_zpm_europa_membrane').inputFluids(Fluid.of('kubejs:zpm_ceres_brine', 500))
    .itemOutputs('2x ' + part('wick'))

  process('chemical_reactor', 'extract_condensate', surface, 1440, 393216)
    .itemInputs('ad_astra:gregsingularity_mill_titan_assay', part('wick')).inputFluids(Fluid.of('gtceu:nitrogen', 500))
    .outputFluids(Fluid.of(raw, 1500)).itemOutputs(part('spent_wick'))

  process('distillery', 'fractionate_condensate', orbit, 1120, 393216)
    .inputFluids(Fluid.of(raw, 1500)).outputFluids(Fluid.of(coolant, 1000))

  process('chemical_bath', 'grow_radiators', orbit, 1640, 458752)
    .itemInputs(part('spent_wick')).inputFluids(Fluid.of(coolant, 500))
    .itemOutputs('2x ' + part('radiator_core')).outputFluids(Fluid.of(returns, 250))

  // Returning a used bath reduces the next shipment of raw condensate. Every radiator still requires a mined core.
  process('chemical_reactor', 'recover_condensate', surface, 920, 393216)
    .itemInputs('gtceu:cassiterite_sand_dust').inputFluids(Fluid.of(returns, 250), Fluid.of('gtceu:helium', 250))
    .outputFluids(Fluid.of(raw, 500))
})
