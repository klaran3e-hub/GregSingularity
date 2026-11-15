;['grass', 'tall_grass', 'fern', 'large_fern', 'dead_bush'].forEach(plant => {
  BlockEvents.broken('minecraft:' + plant, event => {
    if (!event.player.isCreative() && Math.random() < 0.35) event.block.popItem('kubejs:plant_fibre')
  })
})

BlockEvents.broken(event => {
  if (event.player.isCreative()) return
  const id = String(event.block.id)
  const moddedTimber = /^(gtceu:(stripped_)?rubber_(log|wood|planks|slab|stairs)|forestry:.*_planks)$/.test(id)
  const isTimber = moddedTimber || event.block.hasTag('minecraft:logs') || event.block.hasTag('minecraft:bamboo_blocks') ||
    event.block.hasTag('minecraft:planks') || event.block.hasTag('minecraft:wooden_slabs') ||
    event.block.hasTag('minecraft:wooden_stairs')
  if (!isTimber) return
  const tool = event.player.mainHandItem
  if (tool.hasTag('minecraft:axes') || tool.hasTag('forge:tools/axes')) return
  event.player.tell(Text.translate('message.zero_shift.axe_required'))
  event.cancel()
})

const washedMaterials = {
  'kubejs:plant_fibre': 'kubejs:washed_fibre',
  'kubejs:copper_grit': 'kubejs:washed_copper_grit',
  'kubejs:iron_grit': 'kubejs:washed_iron_grit',
  'kubejs:tin_grit': 'kubejs:washed_tin_grit',
  'kubejs:gold_grit': 'kubejs:washed_gold_grit',
  'create:wheat_flour': 'create:dough'
}

Object.entries(washedMaterials).forEach(([raw, washed]) => {
  ItemEvents.rightClicked(raw, event => {
    const hit = event.player.rayTrace(5, true)
    if (!hit.block || hit.block.id !== 'minecraft:water') return
    const amount = Math.min(event.item.count, event.player.isShiftKeyDown() ? 4 : 1)
    event.item.shrink(amount)
    event.player.give(Item.of(washed, amount))
    if (raw.endsWith('_grit')) event.player.give(Item.of('kubejs:ore_tailings', amount))
    event.cancel()
  })
})
