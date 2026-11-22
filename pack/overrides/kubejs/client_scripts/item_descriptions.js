ClientEvents.lang('ru_ru', event => event.add('computercraft', 'block.computercraft.cable', 'Кабель проводного модема'))
ClientEvents.lang('en_us', event => event.add('computercraft', 'block.computercraft.cable', 'Wired Modem Cable'))

// Keep the item's name first and preserve native tool statistics, crop scans and JEI/Ponder hints.
ItemEvents.tooltip(event => {
  const DescriptionsRegistry = Java.loadClass('gtibd.addon.RegistryMigration')
  const Language = Java.loadClass('net.minecraft.locale.Language')
  const Style = Java.loadClass('net.minecraft.ChatFormatting')
  const Registries = Java.loadClass('net.minecraftforge.registries.ForgeRegistries')
  const ResourceLocation = Java.loadClass('net.minecraft.resources.ResourceLocation')
  const productNames = new Map()
  let productLanguage = null
  const packItems = /^(?:(?:kubejs|gtibd_core|gtibdcrops):.+|[a-z0-9_]+:gregsingularity_.+|gtceu:field_bloomery|computercraft:cable)$/
  event.addAdvanced(packItems, (stack, advanced, lines) => {
    const key = 'tooltip.gtibd_core.' + String(DescriptionsRegistry.legacyId(String(stack.id))).replace(':', '.')
    const lang = Language.getInstance()
    if (!lang.has(key + '.use')) return
    lines.add(1, Text.translate(key + '.kind').withStyle(Style.DARK_AQUA))
    lines.add(2, Text.translate(key + '.use').withStyle(Style.GRAY))
    if (!lang.has(key + '.hint')) return
    let tip
    if (lang.has(key + '.product')) {
      if (productLanguage !== lang) {
        productNames.clear()
        productLanguage = lang
      }
      const id = global.gsRegistryId(lang.getOrDefault(key + '.product'))
      if (!productNames.has(id)) {
        const location = new ResourceLocation(id)
        let name = null
        if (Registries.ITEMS.containsKey(location)) name = Item.of(id).getHoverName()
        else if (Registries.FLUIDS.containsKey(location)) name = Registries.FLUIDS.getValue(location).getFluidType().getDescription()
        productNames.set(id, name)
      }
      const name = productNames.get(id)
      if (name) tip = Text.translate(key + '.hint', name)
    } else tip = Text.translate(key + '.hint')
    if (tip) lines.add(3, tip.withStyle(Style.GRAY))
  })
})
