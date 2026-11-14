const DimensionTransitPlayer = Java.loadClass('net.minecraft.server.level.ServerPlayer')
const dimensionPermits = {
  'minecraft:the_nether': ['kubejs:nether_transit_seal', 'message.zero_shift.nether_transit_required'],
  'minecraft:the_end': ['kubejs:end_transit_permit', 'message.zero_shift.end_transit_required']
}

ForgeEvents.onEvent('net.minecraftforge.event.entity.EntityTravelToDimensionEvent', event => {
  const player = event.getEntity()
  if (!(player instanceof DimensionTransitPlayer) || player.isCreative() || player.isSpectator()) return
  const permit = dimensionPermits[String(event.getDimension().location())]
  if (!permit || player.getInventory().contains(Item.of(permit[0]))) return
  player.tell(Text.translate(permit[1]))
  event.setCanceled(true)
})
