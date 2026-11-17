ServerEvents.recipes(event => {
  const protectedIngots = [
    'gtceu:aluminium_ingot', 'gtceu:steel_ingot', 'gtceu:platinum_ingot',
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

  for (const type of ['minecraft:smelting', 'minecraft:blasting']) {
    event.remove({ type: type, output: '#forge:ingots', not: { mod: 'zero_shift' } })
    for (const input of ['#forge:ores', '#forge:raw_materials', '#forge:crushed_ores']) {
      event.remove({ type: type, input: input, output: '#forge:nuggets' })
    }
  }

  // Bulk washing runs on rotation before steam and returns a full ingot in nuggets.
  event.remove({ id: /^create:splashing\/(?:immersiveengineering\/)?crushed_raw_.+$/ })
})
