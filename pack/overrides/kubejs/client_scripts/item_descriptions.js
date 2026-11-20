// Keep the item's name first and preserve native tool statistics, crop scans and JEI/Ponder hints.
ItemEvents.tooltip(event => {
  const Language = Java.loadClass('net.minecraft.locale.Language')
  const Style = Java.loadClass('net.minecraft.ChatFormatting')
  const Registries = Java.loadClass('net.minecraftforge.registries.ForgeRegistries')
  const ResourceLocation = Java.loadClass('net.minecraft.resources.ResourceLocation')
  const packItems = /^(?:(?:kubejs|gtibd_core|gtibdcrops):.+|gtceu:field_bloomery)$/
  event.addAdvanced(packItems, (stack, advanced, lines) => {
    const key = 'tooltip.gtibd_core.' + String(stack.id).replace(':', '.')
    const lang = Language.getInstance()
    if (!lang.has(key + '.use')) return
    lines.add(1, Text.translate(key + '.kind').withStyle(Style.DARK_AQUA))
    lines.add(2, Text.translate(key + '.use').withStyle(Style.GRAY))
    if (!lang.has(key + '.hint')) return
    let tip
    if (lang.has(key + '.product')) {
      const id = lang.getOrDefault(key + '.product')
      const location = new ResourceLocation(id)
      if (Registries.ITEMS.containsKey(location)) tip = Text.translate(key + '.hint', Item.of(id).getHoverName())
      else if (Registries.FLUIDS.containsKey(location)) tip = Text.translate(key + '.hint', Registries.FLUIDS.getValue(location).getFluidType().getDescription())
    } else tip = Text.translate(key + '.hint')
    if (tip) lines.add(3, tip.withStyle(Style.GRAY))
  })
})
