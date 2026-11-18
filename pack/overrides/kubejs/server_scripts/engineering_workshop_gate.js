;(function () {
  const normalWorkbench = 'minecraft:crafting_table'
  const workshopKey = 'GTIBDWorkbenchObtained'

  PlayerEvents.inventoryChanged(normalWorkbench, event => {
    const data = event.player.persistentData
    if (!data.getBoolean(workshopKey)) data.putBoolean(workshopKey, true)
  })

  // A village generated before the block replacement can still contain its old table.
  BlockEvents.rightClicked('immersiveengineering:craftingtable', event => {
    const player = event.player
    if (event.level.isClientSide() || player.isCreative() || player.persistentData.getBoolean(workshopKey)) return
    if (player.inventory.count(normalWorkbench) > 0) {
      player.persistentData.putBoolean(workshopKey, true)
      return
    }
    event.cancel()
    player.tell(Text.of('Сначала собери обычный верстак.'))
  })
})()
