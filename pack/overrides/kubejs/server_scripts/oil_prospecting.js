const BedrockFluidData = Java.loadClass('com.gregtechceu.gtceu.api.data.worldgen.bedrockfluid.BedrockFluidVeinSavedData')
const OilFluidRegistry = Java.loadClass('net.minecraftforge.registries.ForgeRegistries').FLUIDS

ItemEvents.rightClicked('kubejs:seismic_probe', event => {
  const level = event.level
  if (level.isClientSide()) return

  const pos = event.player.blockPosition()
  const chunkX = pos.getX() >> 4
  const chunkZ = pos.getZ() >> 4
  const veins = BedrockFluidData.getOrCreate(level)
  const fluid = veins.getFluidInChunk(chunkX, chunkZ)
  const key = fluid == null ? '' : String(OilFluidRegistry.getKey(fluid))
  const isOil = ['gtceu:oil', 'gtceu:oil_light', 'gtceu:oil_medium', 'gtceu:oil_heavy'].includes(key)
  const remaining = isOil ? veins.getOperationsRemaining(chunkX, chunkZ) : 0
  if (isOil && remaining > 0) {
    event.player.tell(Text.translate('message.zero_shift.oil_found', chunkX, chunkZ, key, remaining))
  } else {
    event.player.tell(Text.translate('message.zero_shift.oil_absent', chunkX, chunkZ))
  }

  const tool = event.item
  const item = tool.getItem()
  if (!event.player.isCreative()) {
    const nextDamage = tool.getDamageValue() + 1
    if (nextDamage >= tool.getMaxDamage()) tool.shrink(1)
    else tool.setDamageValue(nextDamage)
  }
  event.player.getCooldowns().addCooldown(item, 20)
  event.cancel()
})
