const legacyFlintTools = {
  'kubejs:flint_knife': 'gtceu:flint_knife',
  'kubejs:flint_axe': 'gtceu:flint_axe',
  'kubejs:flint_pickaxe': 'gtceu:flint_pickaxe',
  'kubejs:stone_hammer': 'gtceu:flint_hammer'
}
const FlintEnchantments = Java.loadClass('net.minecraft.world.item.enchantment.EnchantmentHelper')

function upgradeLegacyFlintTool(inventory, slot) {
  const old = inventory.getStackInSlot(slot)
  const replacement = legacyFlintTools[old.id]
  if (!replacement) return
  const tool = Item.of(replacement)
  tool.setDamageValue(Math.min(tool.getMaxDamage() - 1, Math.floor(old.getDamageValue() * tool.getMaxDamage() / old.getMaxDamage())))
  if (old.hasCustomHoverName()) tool.setHoverName(old.getHoverName())
  FlintEnchantments.setEnchantments(FlintEnchantments.getEnchantments(old), tool)
  inventory.setStackInSlot(slot, tool)
}

PlayerEvents.loggedIn(event => {
  const player = event.player
  const inventory = player.inventory
  for (let slot = 0; slot < inventory.slots; slot++) upgradeLegacyFlintTool(inventory, slot)
  if (player.persistentData.getBoolean('gtibdReceivedQuestBook')) return
  if (inventory.count('ftbquests:book') === 0) player.give('ftbquests:book')
  player.persistentData.putBoolean('gtibdReceivedQuestBook', true)
})

PlayerEvents.inventoryChanged(event => {
  if (!legacyFlintTools[event.item.id]) return
  const inventory = event.player.inventory
  if (event.slot >= 0 && event.slot < inventory.slots) upgradeLegacyFlintTool(inventory, event.slot)
})
