;(function () {
  const gt = name => 'gtceu:' + name
  const ie = name => 'immersiveengineering:' + name

  ServerEvents.tags('item', event => {
    const aliases = global.gtibdMaterialAliases()
    for (const { source, target, tags, updateTags } of aliases) {
      for (const tag of tags) {
        event.remove(tag, source)
        if (updateTags) event.add(tag, target)
      }
    }
  })

  ServerEvents.recipes(event => {
    const aliases = global.gtibdMaterialAliases()
    const active = new Set(aliases.map(entry => entry.source))
    for (const { source, target, count } of aliases) {
      if (count === 1) event.replaceInput({ input: source, not: { mod: 'zero_shift' } }, source, target)
      event.remove({ output: source, not: { mod: 'zero_shift' } })
    }

    // Stock outputs defined by tag can already resolve to GregTech after unification.
    if (active.has('immersiveengineering:dust_electrum')) {
      event.remove({ id: 'immersiveengineering:crafting/electrum_mix' })
    }
    for (const metal of ['aluminum', 'copper', 'electrum', 'lead', 'steel']) {
      if (active.has(ie('wire_' + metal))) event.remove({ id: ie('metalpress/wire_' + metal) })
    }
    if (active.has('forestry:silicon')) {
      event.remove({ id: /^forestry:smelter\/silicon_from_(?:coal|coke)$/ })
    }
    if (active.has('pneumaticcraft:copper_nugget')) {
      event.remove({ id: 'pneumaticcraft:copper_ingot_from_nugget' })
    }
    if (active.has('create:copper_nugget')) {
      event.remove({ id: 'create:crafting/materials/copper_ingot' })
    }
    if (active.has(ie('nugget_copper'))) {
      event.remove({ id: ie('crafting/nugget_copper_to_copper_ingot') })
    }

    if (active.has('create:powdered_obsidian')) {
      event.remove({ id: 'create:crushing/obsidian' })
      event.custom({
        type: 'create:crushing', processingTime: 500,
        ingredients: [{ item: 'minecraft:obsidian' }],
        results: [{ item: gt('obsidian_dust') }, { chance: 0.75, item: 'minecraft:obsidian' }]
      }).id('zero_shift:resources/crush_obsidian')
    }

    for (const { source, target, count } of aliases) {
      event.shapeless(Item.of(target, count), [source])
        .id('zero_shift:recover_resource/' + source.replace(':', '/'))
    }
  })
})()
