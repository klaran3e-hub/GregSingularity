ServerEvents.genericLootTables(event => {
  const chestTables = [
    'abandoned_mineshaft', 'buried_treasure', 'desert_pyramid', 'igloo_chest',
    'jungle_temple', 'pillager_outpost', 'ruined_portal', 'shipwreck_treasure', 'shipwreck_supply', 'shipwreck_map',
    'simple_dungeon', 'spawn_bonus_chest', 'stronghold_corridor', 'stronghold_crossing',
    'underwater_ruin_big', 'underwater_ruin_small', 'woodland_mansion',
    'village/village_armorer', 'village/village_butcher', 'village/village_cartographer',
    'village/village_desert_house', 'village/village_fisher', 'village/village_fletcher',
    'village/village_mason', 'village/village_plains_house', 'village/village_shepherd',
    'village/village_savanna_house', 'village/village_snowy_house', 'village/village_taiga_house',
    'village/village_temple', 'village/village_toolsmith', 'village/village_weaponsmith'
  ].map(name => 'minecraft:chests/' + name)
  const otherTables = [
    'minecraft:archaeology/ocean_ruin_cold', 'minecraft:archaeology/ocean_ruin_warm',
    'minecraft:archaeology/trail_ruins_common', 'minecraft:entities/drowned',
    'minecraft:entities/husk', 'minecraft:entities/iron_golem', 'minecraft:entities/zombie',
    'minecraft:entities/zombie_villager', 'minecraft:gameplay/hero_of_the_village/toolsmith_gift',
    'minecraft:gameplay/hero_of_the_village/weaponsmith_gift', 'immersiveengineering:chests/engineers_house'
  ]
  const replacements = {
    'minecraft:iron_ingot': 'minecraft:raw_iron',
    'minecraft:gold_ingot': 'minecraft:raw_gold',
    'minecraft:copper_ingot': 'minecraft:raw_copper',
    'minecraft:iron_nugget': 'minecraft:raw_iron',
    'minecraft:gold_nugget': 'minecraft:raw_gold',
    'minecraft:gold_block': 'minecraft:raw_gold_block',
    'minecraft:barrel': 'kubejs:rough_slat',
    'minecraft:bucket': 'minecraft:raw_iron',
    'minecraft:furnace': 'minecraft:clay_ball',
    'minecraft:blast_furnace': 'minecraft:clay_ball',
    'minecraft:smoker': 'minecraft:clay_ball',
    'minecraft:crafting_table': 'kubejs:rough_slat',
    'minecraft:campfire': 'minecraft:charcoal',
    'minecraft:soul_campfire': 'minecraft:charcoal',
    'minecraft:iron_block': 'minecraft:raw_iron_block',
    'minecraft:water_bucket': 'minecraft:raw_iron',
    'minecraft:lava_bucket': 'minecraft:raw_iron',
    'minecraft:flint_and_steel': 'minecraft:flint'
  }
  const engineersHouse = {
    'immersiveengineering:coal_coke': 'minecraft:coal',
    'immersiveengineering:ingot_aluminum': 'gtceu:raw_bauxite',
    'immersiveengineering:stick_aluminum': 'gtceu:raw_bauxite',
    'immersiveengineering:stick_steel': 'minecraft:raw_iron',
    'immersiveengineering:component_iron': 'kubejs:iron_rivet',
    'immersiveengineering:component_steel': 'minecraft:raw_iron'
  }

  function replaceEntry(entry, tableReplacements) {
    if (!entry.has('name') || String(entry.get('type').getAsString()) !== 'minecraft:item') return
    const name = String(entry.get('name').getAsString())
    const gear = /^minecraft:(wooden|stone|iron|golden)_(axe|pickaxe|shovel|hoe|sword|helmet|chestplate|leggings|boots)$/.exec(name)
    if (gear) {
      const material = gear[1]
      const replacement = material === 'iron' ? 'minecraft:raw_iron'
        : material === 'golden' ? 'minecraft:raw_gold' : 'minecraft:flint'
      entry.addProperty('name', replacement)
      entry.remove('functions')
      return
    }
    const replacement = tableReplacements[name] || replacements[name] ||
      (/^minecraft:[a-z_]+_planks$/.test(name) ? 'kubejs:rough_slat' : null)
    if (!replacement) return
    // Retain the original roll, weight and conditions. Nugget stacks become one piece of raw ore.
    if (name.endsWith('_nugget') || name.endsWith('_planks')) entry.remove('functions')
    entry.addProperty('name', replacement)
  }

  // Modify the loaded table so other rewards, probabilities and mod additions survive.
  // The generic loot event sets the type to generic, so retain each original context.
  function revise(id, type) {
    const tableReplacements = id === 'immersiveengineering:chests/engineers_house' ? engineersHouse : {}
    event.modify(id, table => {
      table.type = 'minecraft:' + type
      for (var index = 0; index < table.pools.size(); index++) {
        var entries = table.pools.get(index).getAsJsonObject().getAsJsonArray('entries')
        if (!entries) continue
        for (var entryIndex = 0; entryIndex < entries.size(); entryIndex++) {
          replaceEntry(entries.get(entryIndex).getAsJsonObject(), tableReplacements)
        }
      }
    })
  }

  chestTables.forEach(id => revise(id, 'chest'))
  otherTables.forEach(id => {
    const type = id.includes(':archaeology/') ? 'archaeology'
      : id.includes(':entities/') ? 'entity'
        : id.includes(':gameplay/') ? 'gift' : 'chest'
    revise(id, type)
  })
})
