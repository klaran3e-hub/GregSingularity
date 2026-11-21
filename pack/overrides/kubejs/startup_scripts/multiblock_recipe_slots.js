StartupEvents.postInit(() => {
  const types = Java.loadClass('com.gregtechceu.gtceu.common.data.GTRecipeTypes')
  const items = Java.loadClass('com.gregtechceu.gtceu.api.capability.recipe.ItemRecipeCapability').CAP
  const io = Java.loadClass('com.gregtechceu.gtceu.api.capability.recipe.IO')

  // These multiblocks accept the extra stacks through their buses. JEI builds its slots from the recipe type limits.
  const blast = types.BLAST_RECIPES
  blast.setMaxSize(io.IN, items, Math.max(4, blast.getMaxInputs(items)))
  const freezer = types.VACUUM_RECIPES
  freezer.setMaxSize(io.IN, items, Math.max(2, freezer.getMaxInputs(items)))
  freezer.setMaxSize(io.OUT, items, Math.max(2, freezer.getMaxOutputs(items)))
})
