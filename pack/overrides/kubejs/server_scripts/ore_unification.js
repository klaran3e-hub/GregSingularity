ServerEvents.highPriorityData(event => {
  const disabled = {
    create: ['zinc_ore', 'striated_ores_overworld', 'striated_ores_nether'],
    immersiveengineering: ['bauxite', 'deep_nickel', 'lead', 'mineral_veins', 'nickel', 'silver', 'uranium'],
    pneumaticcraft: ['oil_lake_surface', 'oil_lake_underground']
  }
  for (const [mod, features] of Object.entries(disabled)) {
    for (const feature of features) {
      event.addJson(mod + ':forge/biome_modifier/' + feature, { type: 'forge:none' })
    }
  }

  const duplicateOreFeatures = {
    overworld: [
      'coal_upper', 'coal_lower', 'copper', 'copper_large', 'iron_upper', 'iron_middle', 'iron_small',
      'gold', 'gold_extra', 'gold_lower', 'diamond', 'diamond_large', 'diamond_buried', 'emerald',
      'lapis', 'lapis_buried', 'redstone', 'redstone_lower'
    ],
    nether: ['gold_deltas', 'gold_nether', 'quartz_deltas', 'quartz_nether']
  }
  for (const [dimension, ores] of Object.entries(duplicateOreFeatures)) {
    event.addJson('zero_shift:forge/biome_modifier/remove_duplicate_' + dimension + '_ores', {
      type: 'forge:remove_features',
      biomes: '#minecraft:is_' + dimension,
      features: ores.map(ore => 'minecraft:ore_' + ore),
      steps: ['underground_ores']
    })
  }

  // GTCEu disables the separate large vanilla noise veins by default.
  const oilTag = { replace: false, values: ['#zero_shift:raw_oil'] }
  event.addJson('forge:tags/fluids/crude_oil', oilTag)
})

GTCEuServerEvents.oreVeins(event => {
  const Materials = Java.loadClass('com.gregtechceu.gtceu.common.data.GTMaterials')
  const Pattern = Java.loadClass('com.gregtechceu.gtceu.api.data.worldgen.GTLayerPattern')
  const LayeredVein = Java.loadClass('com.gregtechceu.gtceu.api.data.worldgen.generator.veins.LayeredVeinGenerator')
  const ArrayList = Java.loadClass('java.util.ArrayList')
  const List = Java.loadClass('java.util.List')
  const Placement = Java.loadClass('com.gregtechceu.gtceu.api.data.worldgen.generator.indicators.SurfaceIndicatorGenerator$IndicatorPlacement')
  event.modify('gtceu:certus_quartz', vein => {
    const pattern = Pattern.builder(vein.layer().getTarget())
      .layer(layer => layer.weight(3).mat(Materials.Quartzite).size(2, 4))
      .layer(layer => layer.weight(1).mat(Materials.Barite).size(1, 1))
      .build()
    vein.veinGenerator(new LayeredVein(List.of(pattern)))
    vein.indicatorGenerators(new ArrayList())
    vein.surfaceIndicatorGenerator(indicator => indicator.surfaceRock(Materials.Quartzite).placement(Placement.BELOW))
  })
})

ServerEvents.tags('item', event => {
  event.add('zero_shift:primitive_ores/copper', [
    '#forge:raw_materials/copper', '#forge:raw_materials/chalcopyrite', '#forge:raw_materials/malachite'
  ])
  event.add('zero_shift:primitive_ores/iron', [
    '#forge:raw_materials/iron', '#forge:raw_materials/goethite', '#forge:raw_materials/hematite',
    '#forge:raw_materials/yellow_limonite', '#forge:raw_materials/magnetite'
  ])
  event.add('zero_shift:primitive_ores/tin', [
    '#forge:raw_materials/tin', '#forge:raw_materials/cassiterite', '#forge:raw_materials/cassiterite_sand'
  ])
  event.add('zero_shift:primitive_ores/gold', '#forge:raw_materials/gold')
})

ServerEvents.recipes(event => {
  const canonical = {
    'create:copper_sheet': 'gtceu:copper_plate',
    'create:iron_sheet': 'gtceu:iron_plate',
    'create:golden_sheet': 'gtceu:gold_plate',
    'create:brass_sheet': 'gtceu:brass_plate',
    'create:brass_ingot': 'gtceu:brass_ingot',
    'create:zinc_ingot': 'gtceu:zinc_ingot',
    'create:zinc_nugget': 'gtceu:zinc_nugget',
    'immersiveengineering:plate_copper': 'gtceu:copper_plate',
    'immersiveengineering:plate_iron': 'gtceu:iron_plate',
    'immersiveengineering:plate_gold': 'gtceu:gold_plate',
    'immersiveengineering:plate_steel': 'gtceu:steel_plate',
    'immersiveengineering:ingot_steel': 'gtceu:steel_ingot',
    'immersiveengineering:ingot_lead': 'gtceu:lead_ingot',
    'immersiveengineering:ingot_silver': 'gtceu:silver_ingot',
    'immersiveengineering:ingot_nickel': 'gtceu:nickel_ingot',
    'immersiveengineering:ingot_aluminum': 'gtceu:aluminium_ingot',
    'immersiveengineering:ingot_uranium': 'gtceu:uranium_ingot',
    'immersiveengineering:ingot_electrum': 'gtceu:electrum_ingot'
  }
  for (const [duplicate, common] of Object.entries(canonical)) {
    event.replaceInput({ input: duplicate }, duplicate, common)
    event.remove({ output: duplicate })
  }
})
