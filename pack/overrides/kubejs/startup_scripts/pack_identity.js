Platform.mods.kubejs.name = 'GregSingularity Core'

StartupEvents.modifyCreativeTab('kubejs:tab', event => {
  event.displayName = Text.of('GregSingularity Core')
  for (const tool of ['flint_knife', 'flint_axe', 'flint_pickaxe', 'stone_hammer']) event.remove('kubejs:' + tool)
})
