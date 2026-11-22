StartupEvents.registry('item', event => {
  // GregTech flint has 64 uses and 4 mining speed. Its axe has 2 mining speed.
  const copperTools = [
    ['pickaxe', 'pickaxe', 4, 256, 'pickaxes'],
    ['axe', 'axe', 2, 256, 'axes'],
    ['sword', 'sword', 4, 256, 'swords'],
    ['hoe', 'hoe', 4, 256, 'hoes'],
    ['shovel', 'shovel', 4, 256, 'shovels'],
    ['mining_hammer', 'pickaxe', 4, 512, 'pickaxes']
  ]

  for (const [name, type, flintSpeed, durability, tag] of copperTools) {
    let tool = event.create(global.gsItemId('copper_' + name), type)
      .texture('kubejs:item/copper_' + name)
    tool.modifyTier(tier => {
      tier.setLevel(1)
      tier.setUses(durability)
      tier.setSpeed(flintSpeed * 1.5)
      tier.setAttackDamageBonus(1)
      tier.setEnchantmentValue(5)
      tier.setRepairIngredient(Ingredient.of('minecraft:copper_ingot'))
    })
    tool.tag('minecraft:' + tag)
    tool.tag('forge:tools/' + tag)
  }
})

// Vanilla swords hard-code block speed independently of the material's tool tier.
ForgeEvents.onEvent('net.minecraftforge.event.entity.player.PlayerEvent$BreakSpeed', event => {
  let sword = event.getEntity().mainHandItem
  if (String(sword.id) !== 'gtceu:gregsingularity_copper_sword') return

  let state = event.getState()
  let flintSword = Item.of('gtceu:flint_sword')
  let currentSpeed = sword.getDestroySpeed(state)
  let flintSpeed = flintSword.getDestroySpeed(state)
  let targetSpeed = flintSpeed > 1 ? flintSpeed * 1.5 : 1
  event.setNewSpeed(event.getNewSpeed() * targetSpeed / currentSpeed)
})
