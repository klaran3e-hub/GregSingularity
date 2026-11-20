;(function () {

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

    event.remove({ id: /^forestry:smelter(?:\/.*)?$/ })
    if (active.has('pneumaticcraft:copper_nugget')) {
      event.remove({ id: 'pneumaticcraft:copper_ingot_from_nugget' })
    }
    for (const { source, target, count } of aliases) {
      event.shapeless(Item.of(target, count), [source])
        .id('zero_shift:recover_resource/' + source.replace(':', '/'))
    }
  })
})()
