JEIEvents.hideItems(event => {
  // Forestry apatite veins and the recipes that consumed their ore blocks are disabled.
  event.hide('forestry:apatite_ore')
  event.hide('forestry:deepslate_apatite_ore')
})

JEIEvents.hideItems(event => {
  for (const kind of ['knife', 'axe', 'pickaxe']) event.hide('kubejs:flint_' + kind)
})

JEIEvents.hideItems(event => event.hide('kubejs:stone_hammer'))

JEIEvents.hideItems(event => {
  for (const tool of ['axe', 'hoe', 'pickaxe', 'shovel', 'sword']) event.hide('forestry:bronze_' + tool)
  for (const kit of ['axe_kit', 'hoe_kit', 'kit_pickaxe', 'kit_shovel', 'sword_kit']) event.hide('forestry:' + kit)
  event.hide('immersiveengineering:hoe_steel')
})

JEIEvents.hideItems(event => {
  global.gtibdMaterialAliases().forEach(entry => event.hide(entry.source))
})
