const copperHammer = 'gtceu:gregsingularity_copper_mining_hammer'
let copperHammerBreakingNeighbors = false

BlockEvents.broken(event => {
  if (copperHammerBreakingNeighbors) return

  let player = event.player
  let tool = player.mainHandItem
  let center = event.block
  if (player.isShiftKeyDown() || String(tool.id) !== copperHammer) return
  if (!center.hasTag('minecraft:mineable/pickaxe') || !player.hasCorrectToolForDrops(center.blockState)) return

  let hit = player.rayTrace(player.getBlockReach(), false)
  if (!hit.block || !hit.block.pos.equals(center.pos) || !hit.facing) return

  let face = hit.facing.name()
  let offsets = face === 'UP' || face === 'DOWN' ? [[1, 0, 0], [0, 0, 1]]
    : face === 'EAST' || face === 'WEST' ? [[0, 1, 0], [0, 0, 1]]
    : [[1, 0, 0], [0, 1, 0]]
  let originalState = center.blockState

  // Wait for the central block to break so a cancelled break cannot trigger the surrounding plane.
  event.server.scheduleInTicks(1, () => {
    if (!player.isAlive() || !player.level.equals(center.level)) return
    if (center.offset(0, 0, 0).blockState.equals(originalState)) return

    let gameMode = player.gameMode
    copperHammerBreakingNeighbors = true
    try {
      for (let a = -1; a <= 1; a++) {
        for (let b = -1; b <= 1; b++) {
          if (a === 0 && b === 0) continue
          if (!player.mainHandItem.equals(tool) || player.mainHandItem.isEmpty()) return

          let neighbor = center.offset(
            a * offsets[0][0] + b * offsets[1][0],
            a * offsets[0][1] + b * offsets[1][1],
            a * offsets[0][2] + b * offsets[1][2]
          )
          if (!neighbor.hasTag('minecraft:mineable/pickaxe') || neighbor.entity) continue
          if (!player.hasCorrectToolForDrops(neighbor.blockState)) continue
          gameMode.destroyBlock(neighbor.pos)
        }
      }
    } finally {
      copperHammerBreakingNeighbors = false
    }
  })
})
