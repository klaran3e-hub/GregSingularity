const worldgenBlocks = Java.loadClass('net.minecraftforge.registries.ForgeRegistries').BLOCKS
const WorldgenBlockId = Java.loadClass('net.minecraft.resources.ResourceLocation')
const WorldgenPredicates = Java.loadClass('com.google.common.base.Predicates')
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
  gold_block: 'raw_gold_block',
  'forestry:escritoire': 'stripped_birch_wood',
}
const workshopReplacementStates = new (Java.loadClass('java.util.HashMap'))()

Object.entries(workshopReplacementNames).forEach(([from, to]) => {
  const originalId = new WorldgenBlockId(from)
  if (!worldgenBlocks.containsKey(originalId)) return
  const original = worldgenBlocks.getValue(originalId)
  const decorative = worldgenBlocks.getValue(new WorldgenBlockId('minecraft:' + to))
  const replacement = decorative.defaultBlockState()
  original.getStateDefinition().getPossibleStates().forEach(state => {
    workshopReplacementStates.put(state, replacement)
  })
})

// Both palette checks and the block search stay in Java; only matches call back into KubeJS.
const isGeneratedWorkstation = WorldgenPredicates.in(workshopReplacementStates.keySet())

function replaceGeneratedWorkstations(level, chunk) {
  chunk.findBlocks(isGeneratedWorkstation, (pos, state) => {
    // The search reuses one mutable position. Pass an immutable copy to block updates.
    level.setBlock(pos.immutable(), workshopReplacementStates.get(state), 2)
  })
}

ServerEvents.tick(() => {
  const queue = global.gtibdNewChunks
  for (let scanned = 0; scanned < 48; scanned++) {
    var generated = queue.poll()
    if (generated === null) return
    var chunk = generated.getChunk()
    var level = generated.getLevel()
    var origin = chunk.getPos()
    if (level.hasChunk(origin.x, origin.z)) replaceGeneratedWorkstations(level, chunk)
  }
})
