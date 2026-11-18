if (Platform.isLoaded('gtxfa')) {
  StartupEvents.postInit(() => {
    const machines = Java.loadClass('com.gregtechceu.gtceu.api.registry.GTRegistries').MACHINES
    const InputTrait = Java.loadClass('com.gregtechceu.gtceu.api.machine.trait.ItemHandlerProxyTrait')
    const IO = Java.loadClass('com.gregtechceu.gtceu.api.capability.recipe.IO')
    const Location = Java.loadClass('net.minecraft.resources.ResourceLocation')
    const ItemStack = Java.loadClass('net.minecraft.world.item.ItemStack')
    const BeekeepingLogic = Java.loadClass('forestry.api.apiculture.IBeekeepingLogic')
    const CompoundTag = Java.loadClass('net.minecraft.nbt.CompoundTag')
    const ListTag = Java.loadClass('net.minecraft.nbt.ListTag')

    function checkHabitatAndOffspring(machine) {
      // GTXFA calls only doWork. Forestry completes a queen's life and flushes offspring in canWork.
      const field = machine.getClass().getDeclaredField('beekeepingLogic')
      field.setAccessible(true)
      const logic = field.get(machine)
      // Forestry stores blocked offspring in memory. GTXFA does not save that queue with the block.
      const queueField = logic.getClass().getDeclaredField('spawn')
      queueField.setAccessible(true)
      const queue = queueField.get(logic)
      const queueKey = 'gtibd_apiary_offspring'
      let restored = false
      function canWork() {
        const tile = machine.getHolder().self()
        const data = tile.getPersistentData()
        if (!restored) {
          data.getList(queueKey, 10).forEach(tag => queue.add(ItemStack.of(tag)))
          restored = true
        }
        const size = queue.size()
        const first = queue.peek()
        const firstCount = first == null ? 0 : first.getCount()
        const allowed = logic.canWork()
        if (size === queue.size() && (size === 0 ||
          (first.equals(queue.peek()) && firstCount === queue.peek().getCount()))) return allowed
        if (queue.isEmpty()) {
          data.remove(queueKey)
        } else {
          var saved = new ListTag()
          queue.forEach(stack => saved.add(stack.save(new CompoundTag())))
          data.put(queueKey, saved)
        }
        tile.setChanged()
        return allowed
      }
      field.set(machine, new BeekeepingLogic({
        canWork: canWork,
        doWork: () => { if (canWork()) logic.doWork() },
        clearCachedValues: () => logic.clearCachedValues(),
        setWorkThrottle: ticks => logic.setWorkThrottle(ticks),
        syncToClient: player => player == null ? logic.syncToClient() : logic.syncToClient(player),
        getBeeProgressPercent: () => logic.getBeeProgressPercent(),
        canDoBeeFX: () => logic.canDoBeeFX(),
        doBeeFX: () => logic.doBeeFX(),
        getFlowerPositions: () => logic.getFlowerPositions(),
        readData: buf => logic.readData(buf),
        writeData: buf => logic.writeData(buf),
        read: tag => logic.read(tag),
        write: tag => logic.write(tag)
      }))
    }

    // Wrap the registered factory so loaded and newly placed apiaries keep their native inventory and GUI.
    const tiers = ['lv', 'mv', 'hv', 'ev', 'iv', 'luv', 'zpm', 'uv']
    tiers.forEach(tier => {
      const definition = machines.get(new Location('gtxfa:' + tier + '_electric_apiary'))
      if (definition == null) return
      const factory = definition.getClass().getDeclaredField('machineSupplier')
      factory.setAccessible(true)
      const createMachine = factory.get(definition)
      definition.setMachineSupplier(holder => {
        const machine = createMachine.apply(holder)
        checkHabitatAndOffspring(machine)
        const bees = machine.importItems
        new InputTrait(machine, IO.IN).setProxy({
          getSlots: () => 2,
          getStackInSlot: slot => bees.getStackInSlot(slot),
          getSlotLimit: slot => slot === 0 ? 1 : bees.getSlotLimit(slot),
          isItemValid: (slot, stack) => bees.isItemValid(slot, stack),
          insertItem: (slot, stack, simulate) => {
            if (!bees.isItemValid(slot, stack)) return stack
            if (slot === 1) return bees.insertItemInternal(slot, stack, simulate)
            // Forestry replaces the entire first stack when this breeder becomes a queen.
            if (!bees.getStackInSlot(0).isEmpty()) return stack
            if (!bees.insertItemInternal(0, stack.copyWithCount(1), simulate).isEmpty()) return stack
            return stack.getCount() === 1 ? ItemStack.EMPTY : stack.copyWithCount(stack.getCount() - 1)
          },
          extractItem: () => ItemStack.EMPTY,
          // Only insertion may change this view. The original GUI owns breeder removal.
          setStackInSlot: () => {}
        })
        return machine
      })
    })
  })
}
