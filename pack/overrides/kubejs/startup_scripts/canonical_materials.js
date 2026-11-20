global.gtibdMaterialAliases = function () {
  const aliases = []
  const gt = name => 'gtceu:' + name

  function alias(source, target, materialTags, count, updateTags) {
    if (Item.exists(source) && Item.exists(target)) {
      aliases.push({ source: source, target: target, tags: materialTags || [], count: count || 1, updateTags: updateTags !== false })
    }
  }

  function materialTags(form, metal) {
    const tags = ['forge:' + form + '/' + metal, 'forge:' + form]
    if (metal === 'aluminum') tags.push('forge:' + form + '/aluminium')
    return tags
  }

  alias('pneumaticcraft:copper_nugget', gt('copper_nugget'), materialTags('nuggets', 'copper'))

  alias('forestry:raw_tin', gt('raw_tin'), materialTags('raw_materials', 'tin'))
  alias('forestry:raw_tin_block', gt('raw_tin_block'), materialTags('storage_blocks', 'raw_tin'))
  alias('forestry:tin_ore', gt('tin_ore'), materialTags('ores', 'tin'))
  alias('forestry:deepslate_tin_ore', gt('deepslate_tin_ore'), materialTags('ores', 'tin'))
  alias('forestry:silicon', gt('silicon_ingot'), ['forge:silicon'])
  alias('ae2:silicon', gt('silicon_ingot'), ['forge:silicon'])
  alias('forestry:resource_storage_silicon', gt('silicon_ingot'), [], 4)
  for (const metal of ['bronze', 'copper', 'iron', 'tin']) {
    alias('forestry:gear_' + metal, gt(metal + '_gear'), materialTags('gears', metal))
  }

  return aliases
}

GTCEuStartupEvents.materialModification(() => {
  const materials = Java.loadClass('com.gregtechceu.gtceu.common.data.GTMaterials')
  const flags = Java.loadClass('com.gregtechceu.gtceu.api.data.chemical.material.info.MaterialFlags')
  ;[materials.Copper, materials.Tin, materials.Bronze, materials.Iron].forEach(material => {
    if (!material.hasFlag(flags.GENERATE_GEAR)) material.addFlags(flags.GENERATE_GEAR)
  })
  ;[materials.Gold, materials.Copper, materials.Lead, materials.Silver, materials.Nickel, materials.Electrum, materials.Uranium238].forEach(material => {
    if (!material.hasFlag(flags.GENERATE_ROD)) material.addFlags(flags.GENERATE_ROD)
  })
})
