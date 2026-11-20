ServerEvents.recipes(event => {
  global.gtibdPlanetaryMills.forEach(site => {
    const part = form => 'kubejs:mill_' + site.id + '_' + form
    const route = (type, operation, ticks) => event.recipes.gtceu[type]('zero_shift:planetary_mill/' + site.id + '/' + operation)
      .duration(ticks).EUt(site.eu)
    const field = (type, operation, ticks) => route(type, operation, ticks).dimension(site.world)
    const size = site.count

    field('macerator', 'liberate', 140 * size)
      .itemInputs(size + 'x kubejs:' + site.ore).itemOutputs('2x ' + part('grit'))
    field(site.wash, 'wash', 160 * size)
      .itemInputs('2x ' + part('grit')).inputFluids(Fluid.of(site.water, 250 * size))
      .itemOutputs('2x ' + part('washed'))
    field(site.split, 'separate', 180 * size)
      .itemInputs('2x ' + part('washed')).itemOutputs(part('heavy'), site.gangue)
    field('chemical_reactor', 'leach', 220 * size)
      .itemInputs(part('heavy'), '2x ' + site.mineral).inputFluids(Fluid.of(site.solvent, 125 * size))
      .outputFluids(Fluid.of(part('liquor'), 1000))
    route('autoclave', 'crystallize', 240 * size)
      .itemInputs('gtceu:quartzite_gem').inputFluids(Fluid.of(part('liquor'), 1000)).itemOutputs(part('crystal'))
    route('electric_blast_furnace', 'calcine', 280 * size)
      .itemInputs(part('crystal')).inputFluids(Fluid.of('gtceu:argon', 125 * size))
      .itemOutputs(part('assay')).blastFurnaceTemp(site.heat)
  })
})
