const ClayBucketClip = Java.loadClass('net.minecraft.world.level.ClipContext')
const clayBucketBlockMode = Java.loadClass('net.minecraft.world.level.ClipContext$Block').OUTLINE
const clayBucketFluidMode = Java.loadClass('net.minecraft.world.level.ClipContext$Fluid')

function clipClayBucket(event, fluidMode) {
  const player = event.player
  const eye = player.getEyePosition()
  const end = eye.add(player.getLookAngle().scale(5))
  return event.level.clip(new ClayBucketClip(eye, end, clayBucketBlockMode, fluidMode, player))
}

function swapClayBucket(event, id) {
  if (!event.player.isCreative()) event.item.shrink(1)
  if (!event.player.isCreative() || event.player.inventory.count(id) === 0) event.player.give(id)
  event.cancel()
}

ItemEvents.rightClicked('kubejs:clay_bucket', event => {
  const player = event.player
  if (!player.getAbilities().mayBuild) return
  const hit = clipClayBucket(event, clayBucketFluidMode.SOURCE_ONLY)
  if (String(hit.getType()) !== 'BLOCK') return
  const source = event.level.getBlock(hit.getBlockPos())
  if (source.id !== 'minecraft:water' || !source.blockState.fluidState.isSource()) return
  if (!event.level.mayInteract(player, source.pos) || !player.mayUseItemAt(source.pos, hit.getDirection(), event.item)) return
  if (!player.isCreative()) source.set('minecraft:air')
  swapClayBucket(event, 'kubejs:clay_water_bucket')
})

ItemEvents.rightClicked('kubejs:clay_water_bucket', event => {
  const player = event.player
  if (!player.getAbilities().mayBuild) return
  const hit = clipClayBucket(event, clayBucketFluidMode.NONE)
  if (String(hit.getType()) !== 'BLOCK' || String(event.level.dimension) === 'minecraft:the_nether') return
  const clicked = event.level.getBlock(hit.getBlockPos())
  const side = hit.getDirection()
  const target = clicked.offset(side)
  if (!target.blockState.isAir() || !event.level.mayInteract(player, clicked.pos) || !player.mayUseItemAt(target.pos, side, event.item)) return
  target.set('minecraft:water')
  swapClayBucket(event, 'kubejs:clay_bucket')
})
