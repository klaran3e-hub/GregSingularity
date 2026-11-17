global.gtibdMaterialAliases = function () {
  const aliases = []
  const gt = name => 'gtceu:' + name
  const ie = name => 'immersiveengineering:' + name

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

  for (const [form, metals] of [
    ['ingot', ['aluminum', 'electrum', 'lead', 'nickel', 'silver', 'steel', 'uranium']],
    ['dust', ['aluminum', 'copper', 'electrum', 'gold', 'iron', 'lead', 'nickel', 'saltpeter', 'silver', 'steel', 'sulfur', 'uranium', 'wood']],
    ['plate', ['aluminum', 'copper', 'electrum', 'gold', 'iron', 'lead', 'nickel', 'silver', 'steel', 'uranium']],
    ['nugget', ['aluminum', 'copper', 'electrum', 'lead', 'nickel', 'silver', 'steel', 'uranium']]
  ]) {
    for (const metal of metals) {
      var material = metal === 'aluminum' ? 'aluminium' : metal === 'uranium' ? 'uranium_238' : metal
      alias(ie(form + '_' + metal), gt(material + '_' + form), materialTags(form + 's', metal))
    }
  }

  for (const metal of ['aluminum', 'electrum', 'lead', 'nickel', 'silver', 'steel', 'uranium']) {
    var material = metal === 'aluminum' ? 'aluminium' : metal === 'uranium' ? 'uranium_238' : metal
    alias(ie('storage_' + metal), gt(material + '_block'), materialTags('storage_blocks', metal))
  }

  for (const [metal, ore] of [
    ['aluminum', 'bauxite'], ['lead', 'lead'], ['nickel', 'nickel'],
    ['silver', 'silver'], ['uranium', Item.exists(gt('raw_uranium')) ? 'uranium' : 'uraninite']
  ]) {
    // Legacy ores recover as ore or raw stock, so their refining requirements still apply.
    var sameMaterial = metal === ore
    alias(ie('raw_' + metal), gt('raw_' + ore), materialTags('raw_materials', metal), 1, sameMaterial)
    alias(ie('raw_block_' + metal), gt('raw_' + ore + '_block'),
      materialTags('storage_blocks', 'raw_' + metal), 1, sameMaterial)
    var oreTags = materialTags('ores', metal)
    alias(ie('ore_' + metal), gt(ore + '_ore'), oreTags, 1, sameMaterial)
    alias(ie('deepslate_ore_' + metal), gt('deepslate_' + ore + '_ore'), oreTags, 1, sameMaterial)
  }

  for (const metal of ['aluminum', 'iron', 'steel']) {
    var material = metal === 'aluminum' ? 'aluminium' : metal === 'uranium' ? 'uranium_238' : metal
    alias(ie('stick_' + metal), gt(material + '_rod'), materialTags('rods', metal).concat('forge:rods/all_metal'))
  }

  for (const metal of ['aluminum', 'copper', 'electrum', 'lead', 'steel']) {
    var material = metal === 'aluminum' ? 'aluminium' : metal === 'uranium' ? 'uranium_238' : metal
    alias(ie('wire_' + metal), gt(material + '_single_wire'), materialTags('wires', metal))
  }

  for (const metal of ['gold', 'copper', 'lead', 'silver', 'nickel', 'electrum', 'uranium']) {
    alias('immersiveposts:stick_' + metal, gt((metal === 'uranium' ? 'uranium_238' : metal) + '_rod'), materialTags('rods', metal).concat('forge:rods/all_metal'))
  }

  for (const metal of ['brass', 'zinc']) {
    for (const form of ['ingot', 'nugget', 'block']) {
      var family = form === 'block' ? 'storage_blocks' : form + 's'
      alias('create:' + metal + '_' + form, gt(metal + '_' + form), materialTags(family, metal))
    }
  }

  for (const [sheet, metal] of [['copper_sheet', 'copper'], ['iron_sheet', 'iron'], ['golden_sheet', 'gold'], ['brass_sheet', 'brass']]) {
    alias('create:' + sheet, gt(metal + '_plate'), materialTags('plates', metal))
  }
  alias('create:copper_nugget', gt('copper_nugget'), materialTags('nuggets', 'copper'))
  alias('pneumaticcraft:copper_nugget', gt('copper_nugget'), materialTags('nuggets', 'copper'))
  alias('create:raw_zinc', gt('raw_sphalerite'), materialTags('raw_materials', 'zinc'), 1, false)
  alias('create:raw_zinc_block', gt('raw_sphalerite_block'), materialTags('storage_blocks', 'raw_zinc'), 1, false)
  alias('create:zinc_ore', gt('sphalerite_ore'), materialTags('ores', 'zinc'), 1, false)
  alias('create:deepslate_zinc_ore', gt('deepslate_sphalerite_ore'), materialTags('ores', 'zinc'), 1, false)
  alias('create:powdered_obsidian', gt('obsidian_dust'), materialTags('dusts', 'obsidian'))

  const deposits = {
    aluminum: 'bauxite', quicksilver: 'cinnabar', zinc: 'sphalerite',
    uranium: Item.exists(gt('crushed_uranium_ore')) ? 'uranium' : 'uraninite'
  }
  for (const metal of ['aluminum', 'copper', 'gold', 'iron', 'lead', 'nickel', 'platinum', 'quicksilver', 'silver', 'tin', 'uranium', 'zinc']) {
    var ore = deposits[metal] || metal
    alias('create:crushed_raw_' + metal, gt('crushed_' + ore + '_ore'))
  }

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
