// Scan the palettes of freshly generated chunks after Forge promotes them to LevelChunk.
const workshopChunkQueue = new (Java.loadClass('java.util.concurrent.ConcurrentLinkedQueue'))()

ForgeEvents.onEvent('net.minecraftforge.event.level.ChunkEvent$Load', event => {
  if (event.isNewChunk() && !event.getLevel().isClientSide()) workshopChunkQueue.add(event)
})

global.gtibdNewChunks = workshopChunkQueue
