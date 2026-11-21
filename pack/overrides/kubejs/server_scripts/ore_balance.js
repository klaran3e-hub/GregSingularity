ServerEvents.recipes(event => {
  const protectedIngots = [
    'gtceu:aluminium_ingot', 'gtceu:bronze_ingot', 'gtceu:steel_ingot', 'gtceu:platinum_ingot',
    'gtceu:uranium_ingot', 'gtceu:uranium_235_ingot',
    'gtceu:neutronium_ingot', 'gtceu:tritanium_ingot', 'minecraft:netherite_ingot'
  ]
  const crushedTag = /^forge:crushed_ores\//
  const processedTag = /^forge:(?:purified_ores|refined_ores|dusts|impure_dusts|pure_dusts)\//

  // Start from GregTech's smeltable materials, and move only processed forms to its machines.
  event.forEachRecipe({ type: 'minecraft:smelting', id: /^gtceu:smelting\//, output: '#forge:ingots' }, recipe => {
    const data = JSON.parse(String(recipe.json))
    const tag = data.ingredient && data.ingredient.tag
    const ingot = typeof data.result === 'string' ? data.result : data.result.item
    if (!tag || protectedIngots.includes(ingot)) return
    const crushed = crushedTag.test(tag)
    if (!crushed && !processedTag.test(tag)) return

    // A normal macerator returns two crushed pieces per raw ore.
    event.recipes.gtceu.electric_furnace('zero_shift:steam_metallurgy/' + tag.slice('forge:'.length))
      .itemInputs((crushed ? '2x #' : '#') + tag)
      .itemOutputs(Item.of(ingot, data.result.count || 1))
      .duration(160).EUt(4)
  })

  for (const isotope of ['uranium', 'uranium_235']) {
    event.remove({ id: 'gtceu:arc_furnace/arc_' + isotope + '_dust' })
    event.remove({ id: 'gtceu:extractor/extract_' + isotope + '_dust' })
    event.remove({ id: 'gtceu:alloy_smelter/alloy_smelt_' + isotope + '_dust_to_block' })
    event.recipes.gtceu.electric_furnace('zero_shift:ore_balance/refine_' + isotope)
      .itemInputs('gtceu:' + isotope + '_dust')
      .itemOutputs('gtceu:' + isotope + '_ingot')
      .duration(480).EUt(120)
  }

  for (const type of ['minecraft:smelting', 'minecraft:blasting']) {
    event.remove({ type: type, output: '#forge:ingots', not: { mod: 'zero_shift' } })
    for (const input of ['#forge:ores', '#forge:raw_materials', '#forge:crushed_ores']) {
      event.remove({ type: type, input: input, output: '#forge:nuggets' })
    }
  }

  // GT also names its raw ore furnace recipes "to_ingot" when they make clean dust or a gem.
  // Keep ordinary coal, redstone and vanilla gems available before the first steam machines.
  event.remove({
    id: /^gtceu:(?:smelting|blasting)\/smelt_[a-z0-9_]+_ore_to_ingot$/,
    output: /^gtceu:[a-z0-9_]+_(?:dust|gem)$/
  })

  // GregTech can omit this recycling recipe on a cold start. Keep its original ID for saved patterns.
  const reservoirRecycling = 'gtceu:arc_furnace/arc_reservoir_hatch'
  event.remove({ id: reservoirRecycling })
  event.recipes.gtceu.arc_furnace('gtceu:arc_reservoir_hatch')
    .category(GTRecipeCategories.ARC_FURNACE_RECYCLING)
    .itemInputs('gtceu:reservoir_hatch')
    .inputFluids('#forge:oxygen 2599')
    .itemOutputs('gtceu:stainless_steel_block', 'gtceu:steel_block', '8x gtceu:electrum_ingot', '7x gtceu:wrought_iron_ingot')
    .duration(2599).EUt(30)

  event.remove({ id: 'pneumaticcraft:pressure_chamber/coal_to_diamond' })
})
