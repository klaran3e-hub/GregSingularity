const FreightCart = Java.loadClass('net.minecraft.world.entity.vehicle.MinecartChest')
const FreightBounds = Java.loadClass('net.minecraft.world.phys.AABB')
const FreightUuid = Java.loadClass('java.util.UUID')
const freightCargo = 'gtceu:gregsingularity_sealed_refractory_crate'
const freightKey = 'GTIBDShipment'
const freightBatch = 8
function cargoSeal(stack) {
  return stack.nbt ? String(stack.nbt.getString(freightKey)) : ''
}
function manifestSlots(cart, seal) {
  let needed = freightBatch
  const slots = []
  for (let i = 0; i < cart.getContainerSize() && needed > 0; i++) {
    var stack = cart.getItem(i)
    if (String(stack.id) !== freightCargo || (seal && cargoSeal(stack) !== seal)) continue
    var amount = Math.min(needed, stack.count)
    slots.push([i,amount])
    needed -= amount
  }
  return needed === 0 ? slots : null
}
function releaseCart(cart) {
  for (let i = 0; i < cart.getContainerSize(); i++) {
    var stack = cart.getItem(i)
    if (String(stack.id) === freightCargo && cargoSeal(stack)) stack.removeTagKey(freightKey)
  }
  cart.persistentData.remove('GTIBDWaybill')
  cart.setChanged()
}
// Only a dispatched, loaded cart needs its seal checked. Unloading pauses checks until the cart returns.
const activeFreightChecks = new Map()
function watchFreight(cart) {
  if (!cart.persistentData.contains('GTIBDWaybill') || cart.level.isClientSide()) return
  const key = String(cart.uuid)
  if (activeFreightChecks.get(key) === cart) return
  activeFreightChecks.set(key, cart)
  const poll = () => {
    if (activeFreightChecks.get(key) !== cart) return
    if (cart.isRemoved() || !cart.persistentData.contains('GTIBDWaybill')) {
      activeFreightChecks.delete(key)
      return
    }
    const route = cart.persistentData.getCompound('GTIBDWaybill')
    if (!manifestSlots(cart, String(route.getString('seal')))) {
      activeFreightChecks.delete(key)
      releaseCart(cart)
      return
    }
    cart.level.server.scheduleInTicks(10, poll)
  }
  cart.level.server.scheduleInTicks(10, poll)
}
EntityEvents.spawned('minecraft:chest_minecart', event => watchFreight(event.entity))
PlayerEvents.inventoryChanged(freightCargo, event => {
  if (cargoSeal(event.item)) {
    event.item.removeTagKey(freightKey)
    event.player.getInventory().setChanged()
  }
})
BlockEvents.rightClicked('minecraft:detector_rail', event => {
  if (event.level.isClientSide() || String(event.item.id) !== 'gtceu:gregsingularity_rail_waybill') return
  event.cancel()
  const player = event.player, pos = event.block.pos, waybill = event.item
  const tell = key => player.tell(Text.translate('message.zero_shift.rail_' + key))
  if (String(event.level.dimension) !== 'minecraft:overworld') return tell('overworld_only')
  const carts = event.level.getEntitiesOfClass(FreightCart, new FreightBounds(pos).inflate(0,0.75,0))
  if (carts.size() !== 1) return tell('train_required')
  const cart = carts.get(0), data = cart.persistentData, form = waybill.getOrCreateTag()
  const route = data.getCompound('GTIBDWaybill'), uuid = String(cart.uuid)
  const seal = String(route.getString('seal')), owner = String(player.uuid)
  if (!seal || String(form.getString(freightKey)) !== seal) {
    if (seal && !(player.isShiftKeyDown() && String(route.getString('owner')) === owner &&
      pos.x === route.getInt('x') && pos.z === route.getInt('z'))) return tell('already_dispatched')
    const slots = manifestSlots(cart, '')
    if (!slots) return tell('cargo_required')
    if (seal) releaseCart(cart)
    const fresh = String(FreightUuid.randomUUID())
    slots.forEach(pair => cart.getItem(pair[0]).getOrCreateTag().putString(freightKey,fresh))
    route.putString('seal',fresh)
    route.putString('owner',owner)
    route.putInt('x',pos.x)
    route.putInt('z',pos.z)
    data.put('GTIBDWaybill',route)
    watchFreight(cart)
    form.putString(freightKey,fresh)
    form.putString('ZeroShiftTrain',uuid)
    cart.setChanged()
    player.getInventory().setChanged()
    return tell('dispatched')
  }
  if (String(form.getString('ZeroShiftTrain')) !== uuid) return tell('different_train')
  const dx = pos.x-route.getInt('x'), dz = pos.z-route.getInt('z')
  if (dx*dx+dz*dz < 192*192) return tell('station_too_close')
  const slots = manifestSlots(cart,seal)
  if (!slots) {releaseCart(cart); return tell('cargo_required')}
  slots.forEach(pair => cart.removeItem(pair[0],pair[1]))
  releaseCart(cart)
  waybill.shrink(1)
  player.give(Item.of('gtceu:gregsingularity_received_refractory_crate',freightBatch))
  player.give('gtceu:gregsingularity_rail_delivery_receipt')
  tell('accepted')
})
