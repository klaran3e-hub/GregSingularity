if (Platform.isClientEnvironment()) {
  ForgeEvents.onEvent('net.minecraftforge.client.event.RenderTooltipEvent$GatherComponents', event => {
    event.getTooltipElements().removeIf(entry => {
      const text = entry.left().orElse(null)
      if (!text || typeof text.getContents !== 'function') return false
      const contents = text.getContents()
      if (typeof contents.getKey !== 'function' || typeof contents.getArgs !== 'function') return false
      const key = String(contents.getKey())
      if (key !== 'jei.tooltip.recipe.by' && key !== 'jei.tooltip.recipe.id') return false
      const arg = contents.getArgs()[0]
      if (arg == null) return false
      const source = String(typeof arg.getString === 'function' ? arg.getString() : arg).replace(/§./g, '').toLowerCase()
      return key.endsWith('.by') ? source.replace(/[^a-z]/g, '') === 'zeroshift' : source.startsWith('zero_shift:')
    })
  })
}
