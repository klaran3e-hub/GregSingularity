if (Platform.isLoaded('gtxfa')) {
  ForestryEvents.apiculture(event => {
    const ForgeRegistries = Java.loadClass('net.minecraftforge.registries.ForgeRegistries')
    const ResourceLocation = Java.loadClass('net.minecraft.resources.ResourceLocation')
    const bossDrops = ['minecraft:nether_star', 'minecraft:echo_shard']

    event.modifySpecies(new ResourceLocation('gtxfa', 'exodus'), species => {
      // Forestry 2.11.2 invokes createSpeciesFactory() directly and exposes no product removal API.
      const builderClass = species.getClass()
      let removed = 0
      ;['products', 'specialties'].forEach(name => {
        const field = builderClass.getDeclaredField(name)
        field.setAccessible(true)
        const entries = field.get(species)
        const before = entries.size()
        entries.removeIf(product => bossDrops.includes(String(ForgeRegistries.ITEMS.getKey(product.item()))))
        removed += before - entries.size()
      })
      console.info('[GTIBD_BEE_GATE] Removed ' + removed + ' direct boss drops from gtxfa:exodus')
    })
  })
}
