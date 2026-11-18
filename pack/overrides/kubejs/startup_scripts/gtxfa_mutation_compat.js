if (Platform.isLoaded('gtxfa')) {
  ForestryEvents.apiculture(event => {
    const ResourceLocation = Java.loadClass('net.minecraft.resources.ResourceLocation')
    const ForestryBeeSpecies = Java.loadClass('forestry.api.apiculture.ForestryBeeSpecies')
    function registerCross(bee, first, secondId, chance) {
      const firstId = new ResourceLocation(first)
      event.modifySpecies(new ResourceLocation(bee), species => {
        species.addMutations(mutations => {
          if (mutations.get(firstId, secondId) == null) {
            mutations['add(net.minecraft.resources.ResourceLocation,net.minecraft.resources.ResourceLocation,float)'](
              firstId, secondId, chance)
          }
        })
      })
    }

    // Forestry requires distinct parent species in a mutation.
    registerCross('gtxfa:carbon', 'gtxfa:coal', new ResourceLocation('gtxfa:iron'), 0.08)
    registerCross('gtxfa:slime', 'gtxfa:water', ForestryBeeSpecies.MARSHY, 0.25)

    const Dimension = Java.loadClass('com.moojifiji.gtxfa.bees.mutations.MutationConditionDimension')
    const Altitude = Java.loadClass('com.moojifiji.gtxfa.bees.mutations.MutationConditionYLevel')
    const Time = Java.loadClass('com.moojifiji.gtxfa.bees.mutations.MutationConditionTime')
    event.modifySpecies(new ResourceLocation('gtxfa:naquadria'), species => {
      species.addMutations(mutations => {
        const mutation = mutations.get(
          new ResourceLocation('gtxfa:naquadah_alloy'), new ResourceLocation('gtxfa:naquadah'))
        if (mutation == null) throw new Error('GTXFA Naquadria parent pair is missing')
        // GTXFA 0.2.64 requires both dimensions at once. Forestry has no condition-removal API.
        const field = mutation.getClass().getDeclaredField('conditions')
        field.setAccessible(true)
        field.get(mutation).removeIf(condition =>
          condition instanceof Dimension || condition instanceof Altitude || condition instanceof Time)
        mutation.addMutationCondition(Dimension.end())
        mutation.addMutationCondition(new Altitude(128, true))
      })
    })
  })
}


