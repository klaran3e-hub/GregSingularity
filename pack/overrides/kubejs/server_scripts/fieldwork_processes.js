// priority: 100
// Merge repeated ingredients so one material uses one actual machine slot.
global.fieldworkProcess = (event, id, machine, spec, power) => {
  const recipe = event.recipes.gtceu[machine](id)
  const grouped = {}
  spec.ingredients.forEach(part => {
    if (part.fluid) {
      recipe.inputFluids(Fluid.of(part.fluid, part.amount))
    } else {
      const key = part.tag ? '#' + part.tag : part.item
      if (!key) throw Error('Missing item in ' + id)
      grouped[key] = (grouped[key] || 0) + (part.count || 1)
    }
  })
  Object.keys(grouped).forEach(key => recipe.itemInputs(grouped[key] + 'x ' + key))
  spec.results.forEach(part => recipe.itemOutputs(Item.of(part.item, part.count || 1)))
  return recipe.duration(spec.processingTime || 160).EUt(power)
}
