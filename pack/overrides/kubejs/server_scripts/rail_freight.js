const freightCrate = 'kubejs:sealed_refractory_crate'
const freightBatchSize = 8
const freightDistance = 192
const freightSeal = 'GTIBDShipment'
const freightLedger = 'GTIBDRailDispatch'
const FreightUUID = Java.loadClass('java.util.UUID')
const FreightTag = Java.loadClass('net.minecraft.nbt.CompoundTag')
const FreightCreate = Java.loadClass('com.simibubi.create.Create')

// Cache only slot numbers. Reloading scripts or the world rebuilds the cache from the sealed cargo.
const freightSlots = new Map()

function crateSeal(stack) {
  const tag = stack.nbt
  return tag ? String(tag.getString(freightSeal)) : ''
}

function freightInventory(train, car) {
  const storage = train.carriages.get(car).storage
  if (!storage) return null
  try {
    return storage.getAllItems()
  } catch (error) {
    // Create allocates the cargo manager before the carriage inventories have been restored.
    if (String(error).includes('MountedStorageManager is uninitialized')) return null
    throw error
  }
}

function freightInventoriesReady(train) {
  for (let car = 0; car < train.carriages.size(); car++) {
    if (!freightInventory(train, car)) return false
  }
  return true
}

function locateFreight(train, seal) {
  const slots = []
  let needed = freightBatchSize
  for (let car = 0; car < train.carriages.size() && needed > 0; car++) {
    var inventory = freightInventory(train, car)
    if (!inventory) continue
    for (let slot = 0; slot < inventory.getSlots() && needed > 0; slot++) {
      var stack = inventory.getStackInSlot(slot)
      if (String(stack.id) !== freightCrate || (seal && crateSeal(stack) !== seal)) continue
      var amount = Math.min(needed, inventory.extractItem(slot, needed, true).getCount())
      if (!amount) continue
      slots.push({car: car, slot: slot, amount: amount})
      needed -= amount
    }
  }
  return needed === 0 ? slots : null
}

function markFreight(train, slots, seal) {
  slots.forEach(load => {
    const inventory = freightInventory(train, load.car)
    const marked = inventory.getStackInSlot(load.slot).copy()
    marked.getOrCreateTag().putString(freightSeal, seal)
    inventory.setStackInSlot(load.slot, marked)
  })
}

function clearFreightSeal(stack) {
  const copy = stack.copy()
  copy.removeTagKey(freightSeal)
  return copy
}

function freightOnBoard(train, seal) {
  const known = freightSlots.get(seal)
  if (known && known.every(load => {
    if (load.car >= train.carriages.size()) return false
    const inventory = freightInventory(train, load.car)
    if (!inventory || load.slot >= inventory.getSlots()) return false
    const stack = inventory.getStackInSlot(load.slot)
    return String(stack.id) === freightCrate && crateSeal(stack) === seal && stack.getCount() >= load.amount
  })) return true
  const found = locateFreight(train, seal)
  if (found) freightSlots.set(seal, found)
  return !!found
}

function closeFreight(ledger, id, train) {
  const seal = String(ledger.getCompound(id).getString(freightSeal))
  for (let car = 0; train && car < train.carriages.size(); car++) {
    var inventory = freightInventory(train, car)
    if (!inventory) continue
    for (let slot = 0; slot < inventory.getSlots(); slot++) {
      var stack = inventory.getStackInSlot(slot)
      if (String(stack.id) === freightCrate && crateSeal(stack) === seal) inventory.setStackInSlot(slot, clearFreightSeal(stack))
    }
  }
  freightSlots.delete(seal)
  ledger.remove(id)
}

function checkFreightInTransit(server, trains) {
  const data = server.persistentData
  if (!data.contains(freightLedger)) return
  const ledger = data.getCompound(freightLedger)
  // Create keeps mounted inventories on the train even when its entity leaves a loaded chunk.
  Array.from(ledger.getAllKeys().toArray()).forEach(key => {
    const id = String(key)
    const train = trains.get(FreightUUID.fromString(id))
    if ((!train && server.tickCount <= 200) || (train && !freightInventoriesReady(train))) return
    if (!train || !freightOnBoard(train, String(ledger.getCompound(id).getString(freightSeal)))) closeFreight(ledger, id, train)
  })
  if (ledger.isEmpty()) data.remove(freightLedger)
}

ServerEvents.tick(event => {
  if (event.server.persistentData.contains(freightLedger)) checkFreightInTransit(event.server, FreightCreate.RAILWAYS.trains)
})

function clearCarriedFreight(inventory) {
  for (let slot = 0; slot < inventory.getContainerSize(); slot++) {
    var stack = inventory.getItem(slot)
    if (String(stack.id) === freightCrate && crateSeal(stack)) inventory.setItem(slot, clearFreightSeal(stack))
  }
  inventory.setChanged()
}

PlayerEvents.inventoryChanged(freightCrate, event => {
  if (crateSeal(event.item)) clearCarriedFreight(event.player.getInventory())
})

function handleFreightWaybill(event) {
  const waybill = event.item
  if (String(waybill.id) !== 'kubejs:rail_waybill' || event.level.isClientSide()) return
  event.cancel()
  const player = event.player
  const tell = key => player.tell(Text.translate('message.zero_shift.rail_' + key))
  if (String(event.level.dimension) !== 'minecraft:overworld') return tell('overworld_only')

  const stationBlock = event.block.getEntity()
  const station = stationBlock && stationBlock.getStation()
  const train = station && station.getPresentTrain()
  if (!train || !freightInventoriesReady(train)) return tell('train_required')

  const id = String(train.id)
  const pos = event.block.getPos()
  const tag = waybill.getOrCreateTag()
  const trainOnForm = String(tag.getString('ZeroShiftTrain'))
  const sealOnForm = String(tag.getString(freightSeal))
  const data = event.server.persistentData
  const ledger = data.getCompound(freightLedger)
  const current = ledger.getCompound(id)
  const active = String(current.getString(freightSeal))
  if (trainOnForm && trainOnForm !== id && sealOnForm && ledger.contains(trainOnForm) &&
      String(ledger.getCompound(trainOnForm).getString(freightSeal)) === sealOnForm) return tell('different_train')

  if (!active || active !== sealOnForm) {
    var reissue = active && player.isShiftKeyDown() && String(current.getString('Issuer')) === String(player.uuid) &&
      pos.getX() === current.getInt('X') && pos.getZ() === current.getInt('Z')
    if (active && !reissue) return tell('already_dispatched')
    var dispatchCargo = locateFreight(train, '')
    if (!dispatchCargo) return tell('cargo_required')
    var seal = String(FreightUUID.randomUUID())
    if (active) closeFreight(ledger, id, train)
    markFreight(train, dispatchCargo, seal)
    var route = new FreightTag()
    route.putString(freightSeal, seal)
    route.putString('Issuer', String(player.uuid))
    route.putInt('X', pos.getX())
    route.putInt('Z', pos.getZ())
    ledger.put(id, route)
    data.put(freightLedger, ledger)
    tag.putString('ZeroShiftTrain', id)
    tag.putString(freightSeal, seal)
    tag.remove('ZeroShiftOriginX')
    tag.remove('ZeroShiftOriginZ')
    freightSlots.set(seal, dispatchCargo)
    player.getInventory().setChanged()
    return tell('dispatched')
  }

  const dx = pos.getX() - current.getInt('X')
  const dz = pos.getZ() - current.getInt('Z')
  if (dx * dx + dz * dz < freightDistance * freightDistance) return tell('station_too_close')
  const cargo = locateFreight(train, active)
  if (!cargo) {
    closeFreight(ledger, id, train)
    return tell('cargo_required')
  }

  let unloaded = 0
  cargo.forEach(load => {
    const inventory = freightInventory(train, load.car)
    unloaded += inventory.extractItem(load.slot, load.amount, false).getCount()
  })
  closeFreight(ledger, id, train)
  if (unloaded !== freightBatchSize) {
    if (unloaded) player.give(Item.of(freightCrate, unloaded))
    return tell('cargo_required')
  }
  waybill.shrink(1)
  player.give(Item.of('kubejs:received_refractory_crate', freightBatchSize))
  player.give(Item.of('kubejs:rail_delivery_receipt'))
  tell('accepted')
}

BlockEvents.rightClicked('create:track_station', handleFreightWaybill)
