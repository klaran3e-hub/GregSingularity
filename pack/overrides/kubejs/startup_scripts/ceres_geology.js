StartupEvents.registry('block', event => {
  event.create('ceres_salt_lens').stoneSoundType().hardness(3.5).resistance(6)
    .requiresTool(true).textureAll('kubejs:block/ceres_salt_lens')
    .tagBlock('minecraft:mineable/pickaxe').tagBlock('minecraft:needs_stone_tool')
})
