if (Platform.isLoaded('forestry')) {
  ;(function () {
    const registries = Java.loadClass('net.minecraftforge.registries.ForgeRegistries')
    const Villager = Java.loadClass('net.minecraft.world.entity.npc.Villager')
    const VillagerTrades = Java.loadClass('net.minecraftforge.event.village.VillagerTradesEvent')
    const ForestryLogTrade = Java.loadClass('forestry.core.registration.VillagerTrade$GiveItemForLogAndEmerald')

    function isBeekeeper(profession) {
      return String(registries.VILLAGER_PROFESSIONS.getKey(profession)) === 'forestry:beekeeper'
    }

    function isApiary(item) {
      return String(registries.ITEMS.getKey(item)) === 'forestry:apiary'
    }

    // The merchant may have saved its offers before the pack was updated.
    ForgeEvents.onEvent('net.minecraftforge.event.entity.player.PlayerInteractEvent$EntityInteract', event => {
      const villager = event.getTarget()
      if (event.getLevel().isClientSide() || !(villager instanceof Villager)) return
      if (!isBeekeeper(villager.getVillagerData().getProfession())) return
      villager.getOffers().removeIf(offer => isApiary(offer.getResult().getItem()))
    })

    function removeNativeListing(event) {
      if (!isBeekeeper(event.getType())) return
      // Rhino's native map wrapper accesses Forge's integer-keyed lists by level.
      const offers = event.getTrades()[3]
      if (offers != null) {
        offers.removeIf(offer => offer instanceof ForestryLogTrade && isApiary(offer.sellingItem()))
      }
    }

    // Forestry adds its own listings at normal priority.
    if (!global.gtibdForestryTradeFilterRegistered) {
      ForgeEvents.eventBus().addListener(
        Java.loadClass('net.minecraftforge.eventbus.api.EventPriority').LOWEST,
        false, VillagerTrades, removeNativeListing)
      global.gtibdForestryTradeFilterRegistered = true
    }
  })()
}
