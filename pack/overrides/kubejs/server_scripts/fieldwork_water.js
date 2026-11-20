const fieldWaterSource = Java.loadClass('net.minecraft.world.level.material.Fluids').WATER
const fieldSoaking = {
  'kubejs:retting_bundle': 'kubejs:retted_bundle',
  'minecraft:clay_ball': 'kubejs:clay_slip_cake',
  'kubejs:coarse_flour': 'kubejs:camp_dough'
}
function rinseAtSite(event, pos, output, amount, tailings) {
  const player = event.player
  event.item.shrink(amount)
  player.give(Item.of(output, amount))
  if (tailings) player.give(Item.of('kubejs:ore_tailings', amount))
  player.swing(event.hand, true)
  global.fieldworkEffect(event.level, pos, 'wash', player)
  event.cancel()
}
Object.entries(fieldSoaking).forEach(([input, output]) => {
  ItemEvents.rightClicked(input, event => {
    if (event.level.isClientSide() || event.hand !== Java.loadClass('net.minecraft.world.InteractionHand').MAIN_HAND) return
    const hit = event.player.rayTrace(5, true)
    if (!hit || !hit.block || hit.block.id !== 'minecraft:water') return
    const limit = event.player.isShiftKeyDown() ? 4 : 1
    rinseAtSite(event, hit.block.pos, output, Math.min(event.item.count, limit), false)
  })
})
BlockEvents.rightClicked('kubejs:ore_washing_trough', event => {
  if (event.level.isClientSide() || event.hand !== Java.loadClass('net.minecraft.world.InteractionHand').MAIN_HAND) return
  const match = /^kubejs:(copper|tin|iron|gold)_grit$/.exec(String(event.item.id))
  if (!match) return
  const pos = event.block.pos
  const hasWater = [pos.north(), pos.south(), pos.east(), pos.west()].some(adjacent => {
    const fluid = event.level.getFluidState(adjacent)
    return fluid.isSource() && fieldWaterSource.equals(fluid.getType())
  })
  if (!hasWater) {
    event.player.tell(Text.translate('message.gtibd.fieldwork.dry_trough'))
    event.cancel()
    return
  }
  const limit = event.player.isShiftKeyDown() ? 8 : 1
  rinseAtSite(event, pos, 'kubejs:washed_' + match[1] + '_grit', Math.min(event.item.count, limit), true)
})
