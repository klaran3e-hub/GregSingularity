const worldgenBlocks = Java.loadClass('net.minecraftforge.registries.ForgeRegistries').BLOCKS
const WorldgenBlockId = Java.loadClass('net.minecraft.resources.ResourceLocation')
const WorldgenBlockPos = Java.loadClass('net.minecraft.core.BlockPos')
const workshopReplacementNames = {
  crafting_table: 'oak_wood',
  furnace: 'chiseled_stone_bricks',
  blast_furnace: 'polished_andesite',
  smoker: 'brown_terracotta',
  stonecutter: 'smooth_stone',
  smithing_table: 'polished_deepslate',
  grindstone: 'polished_diorite',
  cartography_table: 'stripped_oak_wood',
  fletching_table: 'stripped_birch_wood',
  loom: 'white_terracotta',
  barrel: 'stripped_spruce_wood',
  composter: 'spruce_wood',
  cauldron: 'gray_terracotta',
  water_cauldron: 'gray_terracotta',
  lava_cauldron: 'gray_terracotta',
  powder_snow_cauldron: 'gray_terracotta',
  brewing_stand: 'yellow_terracotta',
  anvil: 'polished_blackstone',
  chipped_anvil: 'polished_blackstone',
  damaged_anvil: 'polished_blackstone',
  campfire: 'cobblestone_wall',
  soul_campfire: 'blackstone_wall',
  'forestry:escritoire': 'stripped_birch_wood',
  'immersiveengineering:circuit_table': 'yellow_terracotta',
  'immersiveengineering:turntable': 'polished_andesite',
  'immersiveengineering:workbench': 'stripped_dark_oak_wood'
}
const workshopReplacementStates = new (Java.loadClass('java.util.HashMap'))()

Object.entries(workshopReplacementNames).forEach(([from, to]) => {
  const originalId = new WorldgenBlockId(from)
  if (!worldgenBlocks.containsKey(originalId)) return
  const original = worldgenBlocks.getValue(originalId)
  const decorative = worldgenBlocks.getValue(new WorldgenBlockId('minecraft:' + to))
  workshopReplacementStates.put(original, decorative.defaultBlockState())
})

function replaceGeneratedWorkstations(level, chunk, origin) {
  const sections = chunk.getSections()
  const minY = chunk.getMinBuildHeight()
  for (let index = 0; index < sections.length; index++) {
    var section = sections[index]
    if (!section.maybeHas(state => workshopReplacementStates.containsKey(state.getBlock()))) continue
    for (let y = 0; y < 16; y++) {
      for (let z = 0; z < 16; z++) {
        for (let x = 0; x < 16; x++) {
          var replacement = workshopReplacementStates.get(section.getBlockState(x, y, z).getBlock())
          if (replacement !== null) {
            var pos = new WorldgenBlockPos(origin.getMinBlockX() + x, minY + 16 * index + y, origin.getMinBlockZ() + z)
            level.setBlock(pos, replacement, 2)
          }
        }
      }
    }
  }
}

ServerEvents.tick(() => {
  const queue = global.gtibdNewChunks
  for (let scanned = 0; scanned < 48; scanned++) {
    var generated = queue.poll()
    if (generated === null) return
    var chunk = generated.getChunk()
    var level = generated.getLevel()
    var origin = chunk.getPos()
    if (level.hasChunk(origin.x, origin.z)) replaceGeneratedWorkstations(level, chunk, origin)
  }
})
