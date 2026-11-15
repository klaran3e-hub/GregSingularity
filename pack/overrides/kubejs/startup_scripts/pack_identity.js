Platform.mods.kubejs.name = 'GTIBD Addon'

StartupEvents.modifyCreativeTab('kubejs:tab', event => {
  event.displayName = Text.of('GTIBD Addon')
  for (const tool of ['flint_knife', 'flint_axe', 'flint_pickaxe', 'stone_hammer']) event.remove('kubejs:' + tool)
})
