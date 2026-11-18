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

    // These stock metalworking recipes can resolve their tagged output to GregTech.
    event.remove({ id: /^immersiveengineering:crafting\/(?:(?:raw_)?hammercrushing_.+|plate_.+_hammering)$/ })
    event.remove({ id: /^immersiveengineering:metalpress\/(?:plate|gear|rod|wire)_.+$/ })
    event.remove({ id: /^immersiveengineering:alloysmelter\/(?:brass|bronze|constantan|electrum|invar|rose_gold)$/ })
    event.remove({ id: /^immersiveengineering:arcfurnace\/(?:alloy|dust|ore|raw_ore|raw_block)_.+$/ })
    event.remove({ id: /^create:pressing\/compat\/immersiveengineering\/plate_(?:constantan|uranium)$/ })
    event.remove({ id: /^forestry:smelter(?:\/.*)?$/ })
    // Resource unification makes each pair resolve to the same fuel in the same boiler.
    for (const fuel of [
      'steam_boiler/immersiveengineering_creosote',
      'steam_boiler/immersiveengineering_dust_wood',
      'large_boiler/gtceu_creosote',
      'large_boiler/immersiveengineering_dust_wood'
    ]) event.remove({ id: gt(fuel) })

    if (active.has('immersiveengineering:dust_electrum')) {
      event.remove({ id: 'immersiveengineering:crafting/electrum_mix' })
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
