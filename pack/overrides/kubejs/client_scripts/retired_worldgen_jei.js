JEIEvents.hideItems(event => {
  // Forestry apatite veins and the recipes that consumed their ore blocks are disabled.
  event.hide('forestry:apatite_ore')
  event.hide('forestry:deepslate_apatite_ore')
  event.hide('pneumaticcraft:oil_bucket')
  for (const upgrade of ['air_conditioning', 'radiation_shielding', 'thaumcraft']) {
    event.hide('pneumaticcraft:' + upgrade + '_upgrade')
  }
  event.hide('gtceu:atomic_casing')
  event.hide('gtceu:industrial_steam_casing')
  if (!Java.loadClass('com.gregtechceu.gtceu.api.GTCEuAPI').isHighTier()) {
    ;['uev', 'uiv', 'uxv', 'opv', 'max'].forEach(tier => event.hide('gtceu:' + tier + '_machine_casing'))
  }
  ;['hssg', 'kanthal', 'nichrome', 'niobium_titanium', 'rhodium_plated_palladium', 'tungsten', 'tungsten_steel']
    .forEach(material => event.hide('gtceu:hot_' + material + '_ingot'))
})

JEIEvents.hideItems(event => {
  for (const kind of ['knife', 'axe', 'pickaxe']) event.hide(global.gsItemId('flint_' + kind))
})

JEIEvents.hideItems(event => event.hide('gtceu:gregsingularity_stone_hammer'))

JEIEvents.hideItems(event => {
  for (const tool of ['axe', 'hoe', 'pickaxe', 'shovel', 'sword']) {
    event.hide('forestry:bronze_' + tool)
  }
  for (const kit of ['axe_kit', 'hoe_kit', 'kit_pickaxe', 'kit_shovel', 'sword_kit']) event.hide('forestry:' + kit)
  for (const item of [
    'broken_axe', 'broken_hoe', 'broken_sword', 'broken_bronze_pickaxe', 'broken_bronze_shovel',
    'ashen_wax_block', 'crispy_honey_block', 'pulsating_dust'
  ]) event.hide('forestry:' + item)
  event.hide('forestry:smelter')
})

JEIEvents.hideItems(event => {
  global.gtibdMaterialAliases().forEach(entry => event.hide(entry.source))
})
