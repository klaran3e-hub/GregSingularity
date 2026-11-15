ItemEvents.tooltip(event => {
  for (const item of ['plant_fibre', 'copper_grit', 'iron_grit', 'tin_grit', 'gold_grit']) {
    event.add('kubejs:' + item, Text.translate('tooltip.zero_shift.wash'))
  }
  event.add('kubejs:wet_lining', Text.translate('tooltip.zero_shift.lining'))
  event.add('create:wheat_flour', Text.translate('tooltip.zero_shift.knead'))
  event.add('gtceu:flint_knife', Text.translate('tooltip.zero_shift.knife'))
})
