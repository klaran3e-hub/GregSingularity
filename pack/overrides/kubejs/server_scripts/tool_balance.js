ServerEvents.recipes(event => {
  const tools = ['axe', 'hoe', 'pickaxe', 'shovel', 'sword']
  for (const tool of tools) {
    event.remove({ id: 'forestry:bronze_' + tool })
    event.remove({ id: 'forestry:carpenter/kit_' + tool })
  }


  // Packaged Forestry tools can be opened without a crafting recipe.
  for (const kit of ['axe_kit', 'hoe_kit', 'kit_pickaxe', 'kit_shovel', 'sword_kit']) {
    event.remove({ id: 'forestry:' + kit })
  }
})

ServerEvents.genericLootTables(event => {
  const replacements = {
    'forestry:kit_pickaxe': 'minecraft:raw_iron',
    'forestry:kit_shovel': 'gtceu:raw_tin'
  }
  event.modify('forestry:chests/abandoned_mineshaft/factory', table => {
    table.type = 'minecraft:chest'
    for (let i = 0; i < table.pools.size(); i++) {
      var entries = table.pools.get(i).getAsJsonObject().getAsJsonArray('entries')
      if (!entries) continue
      for (let j = 0; j < entries.size(); j++) {
        var entry = entries.get(j).getAsJsonObject()
        if (!entry.has('name')) continue
        var replacement = replacements[String(entry.get('name').getAsString())]
        if (replacement) entry.addProperty('name', replacement)
      }
    }
  })
})
