JEIEvents.hideItems(event => {
  // Forestry apatite veins and the recipes that consumed their ore blocks are disabled.
  event.hide('forestry:apatite_ore')
  event.hide('forestry:deepslate_apatite_ore')
})

JEIEvents.hideItems(event => {
  for (const kind of ['knife', 'axe', 'pickaxe']) event.hide('kubejs:flint_' + kind)
})

JEIEvents.hideItems(event => event.hide('kubejs:stone_hammer'))
