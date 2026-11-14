;(function () {
  const permit = 'kubejs:hv_commissioning_report'
  const permitKey = 'GTIBDForestryPermit'
  const controlled = [
    'forestry:apiary', 'forestry:bee_house', 'forestry:bee_chest', 'forestry:analyzer',
    'forestry:carpenter', 'forestry:centrifuge', 'forestry:squeezer', 'forestry:fermenter',
    'forestry:bottler', 'forestry:moistener', 'forestry:fabricator', 'forestry:rainmaker',
    'forestry:alveary_plain', 'forestry:alveary_fan', 'forestry:alveary_heater',
    'forestry:alveary_hygro', 'forestry:alveary_sieve', 'forestry:alveary_stabiliser', 'forestry:alveary_swarmer'
  ]

  function permits(player) {
    if (player.persistentData.getBoolean(permitKey)) return true
    const inventory = player.getInventory()
    for (let index = 0; index < inventory.getContainerSize(); index++) {
      if (inventory.getItem(index).id === permit) {
        player.persistentData.putBoolean(permitKey, true)
        return true
      }
    }
    return false
  }

  function check(event) {
    if (event.level.isClientSide() || permits(event.player)) return
    event.player.tell(Text.of('Для работы с оборудованием Forestry принеси протокол приёмки HV.'))
    event.cancel()
  }

  controlled.forEach(id => BlockEvents.rightClicked(id, check))
  BlockEvents.broken(event => {
    if (String(event.block.id).startsWith('forestry:beehive_')) check(event)
  })
})()
