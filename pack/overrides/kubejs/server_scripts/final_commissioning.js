;(function () {
  const rootKey = 'GTIBDFinalShift'
  const bindingKey = 'GTIBDFinalBinding'
  const prefix = 'kubejs:final_'
  const bankId = 'gtceu:uv_battery_buffer_4x'
  const concurrentOutput = 24000000
  const reserveStart = 3000000000
  const coldCargo = 16
  const reserveOutage = 9000000000
  const minimumOutput = 4194304
  const meterTolerance = 2097152
  const settleSeconds = 5
  const maxArchiveWait = 8
  const roles = ['primary', 'reserve', 'steel', 'polymer', 'logic']
  const production = ['steel', 'polymer', 'logic']
  const cargo = ['overworld_dispatch', 'nether_dispatch', 'end_dispatch']
  const blocks = {
    primary: bankId,
    reserve: bankId,
    steel: 'gtceu:uv_assembler',
    polymer: 'gtceu:uv_chemical_reactor',
    logic: 'gtceu:uv_circuit_assembler'
  }
  const recipes = {
    steel: 'zero_shift:assembler/final_factory/release_steel_lot',
    polymer: 'zero_shift:chemical_reactor/final_factory/release_polymer_lot',
    logic: 'zero_shift:circuit_assembler/final_factory/release_logic_lot'
  }
  const phases = {
    black_start: { seconds: 120, lots: 0, next: 'normal_one', record: 'black_start_record', emergency: true },
    normal_one: { seconds: 2400, lots: 32, next: 'outage' },
    outage: { seconds: 300, lots: 8, next: 'normal_two', record: 'outage_record', emergency: true },
    normal_two: { seconds: 1140, lots: 24, next: 'outage_repeat' },
    outage_repeat: { seconds: 300, lots: 8, next: 'normal_three', emergency: true },
    normal_three: { seconds: 1140, lots: 24, next: 'concurrent', record: 'shift_record' },
    concurrent: { seconds: 120, lots: 4, next: 'concurrent_repeat', record: 'concurrent_record', overlap: true },
    concurrent_repeat: { seconds: 120, lots: 4, next: 'complete', record: 'repeat_load_record', overlap: true }
  }
  const names = {
    primary: 'основной накопитель', reserve: 'резервный накопитель',
    steel: 'линия стали', polymer: 'линия полимера', logic: 'линия электроники',
    black_start: 'Холодный пуск', normal_one: 'Работа от основной сети',
    outage: 'Первый провал питания', normal_two: 'Первое восстановление питания',
    outage_repeat: 'Повторный провал питания', normal_three: 'Второе восстановление питания',
    concurrent: 'Совместная нагрузка трёх линий', concurrent_repeat: 'Повторная совместная нагрузка',
    complete: 'Смена принята'
  }
  const MetaMachine = Java.loadClass('com.gregtechceu.gtceu.api.machine.MetaMachine')
  const GTCapabilityHelper = Java.loadClass('com.gregtechceu.gtceu.api.capability.GTCapabilityHelper')
  const ItemHandlerHelper = Java.loadClass('net.minecraftforge.items.ItemHandlerHelper')
  const Direction = Java.loadClass('net.minecraft.core.Direction')
  const BlockPos = Java.loadClass('net.minecraft.core.BlockPos')
  const CompoundTag = Java.loadClass('net.minecraft.nbt.CompoundTag')
  const UUID = Java.loadClass('java.util.UUID')
  const FakePlayer = Java.loadClass('net.minecraftforge.common.util.FakePlayer')
  const clock = String(UUID.randomUUID())
  let ticks = 0

  function tell(player, message) {
    player.tell(Text.of('[GTIBD] ' + message))
  }
  function stateOf(player) {
    return player.persistentData.getCompound(rootKey)
  }
  function store(player, state) {
    player.persistentData.put(rootKey, state)
  }
  function position(state, role) {
    const point = state.getCompound(role)
    return new BlockPos(point.getInt('x'), point.getInt('y'), point.getInt('z'))
  }
  function token(state, role) {
    return String(state.getCompound(role).getString('token'))
  }
  function readSite(level, state) {
    const site = {}
    site.archives = {}
    for (let index = 0; index < roles.length; index++) {
      let role = roles[index]
      if (!state.contains(role)) return { reason: 'Привяжи ' + names[role] + '.' }
      let pos = position(state, role)
      if (!level.hasChunkAt(pos)) return { reason: 'Ожидание загруженных чанков.' }
      let machine = MetaMachine.getMachine(level, pos)
      if (machine == null || String(machine.getDefinition().getId()) !== blocks[role] ||
          String(level.getBlockEntity(pos).getPersistentData().getString(bindingKey)) !== token(state, role)) {
        return { reason: 'Потеряна привязка: ' + names[role] + '. Сбрось смену и привяжи новый блок.' }
      }
      site[role] = machine
      if (production.includes(role)) {
        let archive = pos.below()
        if (String(level.getBlock(archive).id) !== 'minecraft:barrel') {
          return { reason: 'Поставь бочку под станком: ' + names[role] + '.' }
        }
        let storage = GTCapabilityHelper.getItemHandler(level, archive, Direction.UP)
        if (storage == null) return { reason: 'Недоступна выдача: ' + names[role] + '.' }
        site.archives[role] = storage
      }
    }
    return site
  }
  function clickedPrimary(state, pos) {
    return state.contains('primary') && position(state, 'primary').equals(pos)
  }
  function bind(event, state) {
    const player = event.player
    if (state.getString('phase')) {
      tell(player, 'Для перепривязки сначала сбрось текущую смену.')
      return
    }
    const pos = event.block.getPos()
    const id = String(event.block.id)
    let role = roles.find(name => blocks[name] === id)
    if (role === 'primary' && state.contains('primary') && !clickedPrimary(state, pos)) role = 'reserve'
    if (role !== 'primary' && (!state.contains('primary') || position(state, 'primary').distSqr(pos) > 2304)) {
      tell(player, 'Сначала привяжи основной накопитель. Остальные блоки должны быть в пределах 48 блоков.')
      return
    }
    const holder = event.block.getEntity()
    if (holder == null || MetaMachine.getMachine(event.level, pos) == null) return
    const persistent = holder.getPersistentData()
    let marker = String(persistent.getString(bindingKey))
    if (!marker) {
      marker = String(UUID.randomUUID())
      persistent.putString(bindingKey, marker)
      holder.setChanged()
    }
    const entry = new CompoundTag()
    entry.putInt('x', pos.getX())
    entry.putInt('y', pos.getY())
    entry.putInt('z', pos.getZ())
    entry.putString('token', marker)
    state.put(role, entry)
    store(player, state)
    tell(player, 'Привязан ' + names[role] + ' [' + pos.getX() + ', ' + pos.getY() + ', ' + pos.getZ() + '].')
  }
  function countIn(inventory, id) {
    let count = 0
    for (let slot = 0; slot < inventory.getContainerSize(); slot++) {
      let stack = inventory.getItem(slot)
      if (stack.id === id) count += stack.getCount()
    }
    return count
  }
  function consume(inventory, id, amount) {
    for (let slot = 0; slot < inventory.getContainerSize() && amount > 0; slot++) {
      let stack = inventory.getItem(slot)
      if (stack.id !== id) continue
      let take = Math.min(amount, stack.getCount())
      stack.shrink(take)
      amount -= take
    }
    inventory.setChanged()
  }
  function emptyExports(machine) {
    const output = machine.exportItems
    for (let slot = 0; slot < output.getSlots(); slot++) {
      if (!output.getStackInSlot(slot).isEmpty()) return false
    }
    return true
  }
  function machinesReady(site) {
    return production.every(role => !site[role].isAutoOutputItems())
  }
  function clearWindows(state) {
    state.putInt('stable', 0)
    const phase = phases[state.getString('phase')]
    if (phase && phase.overlap && state.getInt('elapsed') < phase.seconds) state.putInt('elapsed', 0)
    production.forEach(role => state.putBoolean(role + '_armed', false))
  }
  function beginPhase(state, phase) {
    state.putString('phase', phase)
    state.putString('ready', '')
    state.putInt('elapsed', 0)
    state.putInt('archiveWait', 0)
    clearWindows(state)
    production.forEach(role => {
      state.putInt(role + '_count', 0)
      state.putInt(role + '_recipe_progress', 0)
      state.putBoolean(role + '_seen', false)
    })
  }
  function arm(player, state, site) {
    if (!machinesReady(site)) {
      tell(player, 'Выключи автовывод предметов на трёх станках. Подключай импорт ME к бочкам под ними.')
      return
    }
    if (site.primary.isWorkingEnabled() || site.reserve.isWorkingEnabled() ||
        Number(site.primary.energyContainer.getEnergyStored()) !== 0 ||
        Number(site.reserve.energyContainer.getEnergyStored()) < reserveStart) {
      tell(player, 'Выключи оба накопителя. Основной должен быть пуст, резерв должен содержать от 3000000000 EU.')
      return
    }
    for (let index = 0; index < production.length; index++) {
      let role = production[index]
      let machine = site[role]
      if (Number(machine.energyContainer.getEnergyStored()) !== 0 ||
          machine.recipeLogic.isActive() || machine.recipeLogic.getProgress() > 0 || !emptyExports(machine)) {
        tell(player, 'Разряди буферы станков до нуля, останови старые циклы и освободи выходы.')
        return
      }
    }
    const inventory = player.getInventory()
    if (countIn(inventory, prefix + 'backup_module') < 1 ||
        cargo.some(id => countIn(inventory, prefix + id) < coldCargo)) {
      tell(player, 'Нужен модуль резерва и по шестнадцать грузовых партий из каждого измерения.')
      return
    }
    cargo.forEach(id => consume(inventory, prefix + id, coldCargo))
    beginPhase(state, 'black_start')
    state.putInt('claimed', 0)
    store(player, state)
    tell(player, 'Смена открыта. Включи только резерв и запусти три холодных линии.')
  }
  function claim(player, state) {
    const mask = state.getInt('earned') & ~state.getInt('claimed')
    const inventory = player.getInventory()
    const records = [['black_start_record', 1], ['outage_record', 2], ['shift_record', 4], ['concurrent_record', 8], ['repeat_load_record', 16]]
    for (let index = 0; index < records.length; index++) {
      let entry = records[index]
      if ((mask & entry[1]) === 0) continue
      if (!inventory.add(Item.of(prefix + entry[0]))) {
        tell(player, 'Для протокола нужно свободное место в инвентаре.')
        return
      }
      state.putInt('claimed', state.getInt('claimed') | entry[1])
      store(player, state)
    }
  }
  function status(player, state, site) {
    const phase = state.getString('phase')
    if (!phase) {
      tell(player, 'Привязано блоков: ' + roles.filter(role => state.contains(role)).length + '/5.')
      return
    }
    const spec = phases[phase]
    let summary = names[phase]
    if (spec) summary += ' · ' + state.getInt('elapsed') + '/' + spec.seconds + ' с · партии ' +
      production.map(role => state.getInt(role + '_count')).join('/') + ' из ' + spec.lots
    const ready = state.getString('ready')
    if (ready) summary += ' · ключом подтверди: ' + (names[ready] || ready)
    const reason = site.reason || state.getString('reason')
    if (reason) summary += ' · ' + reason
    if (!site.reason) summary += ' · резерв ' + site.reserve.energyContainer.getEnergyStored() + ' EU'
    tell(player, summary + '.')
  }

  function click(event) {
    if (event.level.isClientSide() || String(event.hand) !== 'MAIN_HAND' || event.player instanceof FakePlayer) return
    const id = event.item.id
    if (![prefix + 'control_console', prefix + 'start_key', prefix + 'backup_module'].includes(id)) return
    handleClick(event, id)
    event.cancel()
  }
  function handleClick(event, id) {
    const player = event.player
    if (String(event.level.dimension) !== 'minecraft:overworld') {
      tell(player, 'Пульт заводской смены работает в обычном мире.')
      return
    }
    const state = stateOf(player)
    const crouch = player.isShiftKeyDown()
    if (id === prefix + 'control_console' && crouch) {
      bind(event, state)
      return
    }
    if (!clickedPrimary(state, event.block.getPos())) {
      tell(player, 'Используй предмет на основном накопителе.')
      return
    }
    const phase = state.getString('phase')
    if (id === prefix + 'backup_module' && crouch) {
      if (phase === 'complete' && (state.getInt('earned') & ~state.getInt('claimed')) !== 0) {
        tell(player, 'Сначала получи все протоколы пультом. Затем можно открыть новую смену.')
        return
      }
      state.putString('phase', '')
      state.putString('ready', '')
      state.putString('reason', '')
      state.putInt('earned', 0)
      state.putInt('claimed', 0)
      clearWindows(state)
      store(player, state)
      tell(player, 'Смена сброшена. Привязки сохранены, принятые грузы использованы.')
      return
    }
    const site = readSite(event.level, state)
    if (id === prefix + 'control_console') {
      if (!crouch) claim(player, state)
      status(player, state, site)
      return
    }
    if (id !== prefix + 'start_key' || !crouch) return
    if (site.reason) {
      tell(player, site.reason)
      return
    }
    if (!phase) {
      arm(player, state, site)
      return
    }
    const earned = state.getInt('earned')
    let ready = state.getString('ready')
    if (phase === 'complete' && (earned & 4) !== 0 && (earned & 16) === 0) {
      ready = (earned & 8) === 0 ? 'concurrent' : 'concurrent_repeat'
    }
    if (!Object.prototype.hasOwnProperty.call(phases, ready)) {
      status(player, state, site)
      return
    }
    if (phases[ready].emergency && ready !== 'black_start' && Number(site.reserve.energyContainer.getEnergyStored()) < reserveOutage) {
      tell(player, 'Перед аварийной проверкой заряди резерв до 9000000000 EU.')
      return
    }
    if (phases[ready].overlap && (!archivesClear(site) || production.some(role =>
      site[role].recipeLogic.isActive() || site[role].recipeLogic.getProgress() > 0))) {
      tell(player, 'Останови три станка и освободи их выходы перед совместным испытанием.')
      return
    }
    beginPhase(state, ready)
    state.putString('reason', '')
    store(player, state)
    tell(player, names[ready] + '. Пульт засчитает секунды после переключения источника.')
  }
  function collect(state, role, machine, archive, required, accepted) {
    const handler = machine.exportItems
    const countKey = role + '_count'
    const pendingKey = role + '_pending'
    let observed = 0
    let pending = 0
    for (let slot = 0; slot < handler.getSlots(); slot++) {
      let stack = handler.getStackInSlot(slot)
      if (stack.id !== prefix + role + '_lot') continue
      let size = stack.getCount()
      observed += size
      let remainder = ItemHandlerHelper.insertItemStacked(archive, stack.copy(), true)
      let room = size - remainder.getCount()
      if (room > 0) {
        let take = handler.extractItemInternal(slot, room, false)
        let count = take.getCount()
        let overflow = ItemHandlerHelper.insertItemStacked(archive, take, false)
        if (!overflow.isEmpty()) handler.insertItemInternal(slot, overflow, false)
        size -= count - overflow.getCount()
      }
      pending += size
    }
    if (accepted) {
      let fresh = Math.max(0, observed - state.getInt(pendingKey))
      state.putInt(countKey, Math.min(required, state.getInt(countKey) + fresh))
    }
    state.putInt(pendingKey, pending)
  }
  function archivesClear(site) {
    return production.every(role => emptyExports(site[role]))
  }
  function countSecond(player, state, phase, site) {
    var primary = site.primary.energyContainer
    var reserve = site.reserve.energyContainer
    var spec = phases[phase]
    var emergency = spec.emergency
    var bank = emergency ? reserve : primary
    var exportsControlled = machinesReady(site)
    var valid = exportsControlled
    if (emergency) {
      valid = valid && !site.primary.isWorkingEnabled() && site.reserve.isWorkingEnabled() &&
        Number(primary.getInputPerSec()) === 0 && Number(primary.getOutputPerSec()) === 0 &&
        Number(reserve.getInputPerSec()) === 0 &&
        (phase !== 'black_start' || Number(primary.getEnergyStored()) === 0)
    } else {
      valid = valid && site.primary.isWorkingEnabled() && !site.reserve.isWorkingEnabled() &&
        Number(reserve.getOutputPerSec()) === 0
    }
    if (!valid) {
      clearWindows(state)
      if (exportsControlled) production.forEach(role => collect(state, role, site[role], site.archives[role], 0, false))
      state.putString('reason', 'Пауза. Проверь переключатели, входы и выдачу выбранного накопителя.')
      return
    }
    var machineInput = production.reduce((sum, role) => sum + Number(site[role].energyContainer.getInputPerSec()), 0)
    var simultaneous = spec.overlap
    var measured = Number(bank.getOutputPerSec()) >= Math.max(
      simultaneous ? concurrentOutput : minimumOutput, machineInput - meterTolerance)
    var previousStable = state.getInt('stable')
    var stable = measured ? Math.min(settleSeconds, previousStable + 1) : 0
    state.putInt('stable', stable)
    var eligible = stable === settleSeconds
    var activeLines = {}
    production.forEach(role => {
      var logic = site[role].recipeLogic
      var last = logic.getLastRecipe()
      activeLines[role] = logic.isWorking() && last != null && String(last.id) === recipes[role]
    })
    var together = eligible && production.every(role => activeLines[role])
    var elapsed = state.getInt('elapsed')
    if (simultaneous && elapsed < spec.seconds) {
      elapsed = together ? elapsed + 1 : 0
      state.putInt('elapsed', elapsed)
    }
    var reachedOverlap = simultaneous && elapsed >= spec.seconds
    var bankStillSupplies = Number(bank.getOutputPerSec()) >= Math.max(
      minimumOutput, machineInput - meterTolerance)
    var working = false
    for (var index = 0; index < production.length; index++) {
      var role = production[index]
      var machine = site[role]
      var active = activeLines[role]
      // The last completed batch can stop drawing EU before its export is sampled.
      var finished = previousStable === settleSeconds && !active
      var armed = state.getBoolean(role + '_armed')
      var progress = machine.recipeLogic.getProgress()
      var priorProgress = state.getInt(role + '_recipe_progress')
      var newCycle = active && progress < priorProgress
      var accepts = simultaneous
        ? armed && bankStillSupplies && (!active || newCycle)
        : armed && (eligible || finished)
      collect(state, role, machine, site.archives[role], spec.lots, accepts)
      state.putInt(role + '_recipe_progress', progress)
      if (eligible && active) {
        working = true
        state.putBoolean(role + '_seen', true)
      }
      state.putBoolean(role + '_armed', simultaneous
        ? active && ((together && reachedOverlap) || (armed && bankStillSupplies && !newCycle))
        : eligible && active)
    }
    if (working && !simultaneous) {
      elapsed = Math.min(spec.seconds, elapsed + 1)
      state.putInt('elapsed', elapsed)
    }
    var exportsCleared = archivesClear(site)
    if (!exportsCleared || elapsed < spec.seconds || production.some(role =>
      phase === 'black_start' ? !state.getBoolean(role + '_seen') : state.getInt(role + '_count') < spec.lots)) {
      var archiveWait = exportsCleared ? 0 : state.getInt('archiveWait') + 1
      state.putInt('archiveWait', Math.min(archiveWait, maxArchiveWait))
      state.putString('reason', archiveWait >= maxArchiveWait ? 'Проверь свободное место в бочках выдачи и выходы станков.' :
        !measured ? 'Пауза. Недостаточная выдача выбранного накопителя.' :
          !eligible ? 'Стабилизация показаний питания.' : simultaneous && !together && elapsed < spec.seconds ?
          'Все три линии должны работать одновременно без остановок.' : !working ? 'Жду работающую линию партии UV.' : '')
      return
    }

    var award = { black_start_record: 1, outage_record: 2, shift_record: 4, concurrent_record: 8, repeat_load_record: 16 }
    state.putString('reason', '')
    if (spec.record) state.putInt('earned', state.getInt('earned') | award[spec.record])
    if (spec.next === 'complete') {
      state.putString('phase', 'complete')
      tell(player, 'Смена принята. Получи протокол правой кнопкой с пультом на основном накопителе.')
    } else {
      state.putString('ready', spec.next)
      tell(player, 'Этап принят. Подтверди следующий этап ключом на основном накопителе.')
    }
  }
  function sample(player, now) {
    if (player instanceof FakePlayer || !player.isAlive()) return
    const state = stateOf(player)
    const phase = state.getString('phase')
    if (!phases[phase] || state.getString('ready')) return
    if (String(state.getString('clock')) !== clock || now - Number(state.getLong('lastSample')) !== 20) {
      clearWindows(state)
      state.putString('clock', clock)
    }
    state.putLong('lastSample', now)
    const level = player.level
    const site = String(level.dimension) === 'minecraft:overworld' && state.contains('primary') &&
      player.getDistanceSq(position(state, 'primary')) <= 4096 ? readSite(level, state) : { reason: 'Пауза. Вернись к заводу.' }
    if (site.reason) {
      clearWindows(state)
      state.putString('reason', site.reason)
    } else {
      countSecond(player, state, phase, site)
    }
    store(player, state)
  }

  ;[bankId, blocks.steel, blocks.polymer, blocks.logic].forEach(id => BlockEvents.rightClicked(id, click))
  ServerEvents.tick(event => {
    ticks++
    if (ticks % 20 === 0) event.server.players.forEach(player => sample(player, ticks))
  })
})()
