;(function () {
  const Villager = Java.loadClass('net.minecraft.world.entity.npc.Villager')
  const MerchantOffer = Java.loadClass('net.minecraft.world.item.trading.MerchantOffer')
  const professions = Java.loadClass('net.minecraftforge.registries.ForgeRegistries').VILLAGER_PROFESSIONS
  const components = new Set([
    'hammer', 'wirecutter', 'component_iron', 'component_steel', 'waterwheel_segment',
    'drillhead_iron', 'drillhead_steel', 'sawblade', 'wirecoil_copper', 'wirecoil_electrum',
    'wirecoil_steel', 'electron_tube', 'component_electronic', 'circuit_board', 'steel_scaffolding_standard'
  ].map(name => 'immersiveengineering:' + name))
  const vanillaEquipment = {
    'minecraft:armorer': /^minecraft:(?:iron|chainmail|diamond)_(?:helmet|chestplate|leggings|boots)$/,
    'minecraft:toolsmith': /^minecraft:(?:iron|diamond)_(?:axe|hoe|pickaxe|shovel)$/,
    'minecraft:weaponsmith': /^minecraft:(?:iron|diamond)_(?:axe|sword)$/
  }

  // The merchant may have saved its offers before the pack was updated.
  ForgeEvents.onEvent('net.minecraftforge.event.entity.player.PlayerInteractEvent$EntityInteract', event => {
    var villager = event.getTarget()
    if (event.getLevel().isClientSide() || !(villager instanceof Villager)) return
    var data = villager.getVillagerData()
    var profession = String(professions.getKey(data.getProfession()))
    if (profession.startsWith('immersiveengineering:')) {
      villager.getOffers().removeIf(offer => components.has(String(offer.getResult().id)))
    } else if (vanillaEquipment[profession]) {
      var offers = villager.getOffers()
      offers.removeIf(offer => vanillaEquipment[profession].test(String(offer.getResult().id)))
      if (offers.isEmpty() && data.getLevel() === 1 &&
          (profession === 'minecraft:armorer' || profession === 'minecraft:weaponsmith')) {
        // Both professions can roll only equipment. Restore their normal novice coal trade.
        offers.add(new MerchantOffer(Item.of('minecraft:coal', 15), Item.of('minecraft:emerald'), 16, 2, 0.05))
      }
    }
  })
})()
