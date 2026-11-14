const freightCrate = 'kubejs:sealed_refractory_crate'
const freightBatchSize = 8
const freightDistance = 192

function findFreight(train) {
  const cargo = []
  let needed = freightBatchSize
  let inventory
  let amount
  for (let car = 0; car < train.carriages.size() && needed > 0; car++) {
    inventory = train.carriages.get(car).storage.getAllItems()
    if (!inventory) continue
    for (let slot = 0; slot < inventory.getSlots() && needed > 0; slot++) {
      if (inventory.getStackInSlot(slot).id !== freightCrate) continue
      amount = inventory.extractItem(slot, needed, true).getCount()
      if (amount === 0) continue
      cargo.push({ inventory: inventory, slot: slot, amount: amount })
      needed -= amount
    }
  }
  return needed === 0 ? cargo : null
}

BlockEvents.rightClicked('create:track_station', event => {
  const waybill = event.item
  if (waybill.id !== 'kubejs:rail_waybill' || event.level.isClientSide()) return
  event.cancel()
  const player = event.player
  const tell = key => player.tell(Text.translate('message.zero_shift.rail_' + key))
  if (String(event.level.dimension) !== 'minecraft:overworld') {
    tell('overworld_only')
    return
  }

  const stationBlock = event.block.getEntity()
  const station = stationBlock == null ? null : stationBlock.getStation()
  const train = station == null ? null : station.getPresentTrain()
  if (train == null) {
    tell('train_required')
    return
  }
  const pos = event.block.getPos()
  const trainId = String(train.id)
  const tag = waybill.getOrCreateTag()
  const dispatchedTrain = tag.getString('ZeroShiftTrain')
  if (dispatchedTrain && dispatchedTrain !== trainId) {
    tell('different_train')
    return
  }
  const dx = pos.getX() - tag.getInt('ZeroShiftOriginX')
  const dz = pos.getZ() - tag.getInt('ZeroShiftOriginZ')
  if (dispatchedTrain && dx * dx + dz * dz < freightDistance * freightDistance) {
    tell('station_too_close')
    return
  }

  const cargo = findFreight(train)
  if (!cargo) {
    tell('cargo_required')
    return
  }
  if (!dispatchedTrain) {
    tag.putString('ZeroShiftTrain', trainId)
    tag.putInt('ZeroShiftOriginX', pos.getX())
    tag.putInt('ZeroShiftOriginZ', pos.getZ())
    player.getInventory().setChanged()
    tell('dispatched')
    return
  }

  let unloaded = 0
  cargo.forEach(load => {
    unloaded += load.inventory.extractItem(load.slot, load.amount, false).getCount()
  })
  if (unloaded !== freightBatchSize) {
    if (unloaded > 0) player.give(Item.of(freightCrate, unloaded))
    tell('cargo_required')
    return
  }
  waybill.shrink(1)
  player.give(Item.of('kubejs:received_refractory_crate', freightBatchSize))
  player.give(Item.of('kubejs:rail_delivery_receipt'))
  tell('accepted')
})
