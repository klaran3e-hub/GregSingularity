const GsCreativeItems = Java.loadClass('gtibd.addon.RegistryMigration')
const gsCreativeTabs = [
  'gtceu:item', 'gtceu:tool', 'gtceu:machine', 'ad_astra:main',
  'ae2:main', 'storagedrawers:storagedrawers'
]
const gsRetiredWorkshopTools = ['flint_knife', 'flint_pickaxe', 'flint_axe', 'stone_hammer']
  .map(name => String(GsCreativeItems.destination('kubejs:' + name)))

const gsCreativeFuels = [
  'kubejs:lunar_transfer_fuel', 'kubejs:calorite_flight_gel', 'kubejs:survey_propellant',
  'kubejs:europa_transfer_medium', 'kubejs:titan_flight_matrix'
]

function gsFuelContainer(fluid) {
  if (fluid === 'ad_astra:fuel') return Item.of('ad_astra:fuel_bucket')
  if (fluid === 'ad_astra:cryo_fuel') return Item.of('ad_astra:cryo_fuel_bucket')
  const fluidUtil = Java.loadClass('net.minecraftforge.fluids.FluidUtil')
  const action = Java.loadClass('net.minecraftforge.fluids.capability.IFluidHandler$FluidAction')
  const cell = Item.of('gtceu:universal_fluid_cell').copy()
  const tank = fluidUtil.getFluidHandler(cell).orElse(null)
  if (tank && tank.fill(Fluid.of(fluid, 1000), action.EXECUTE) === 1000) return tank.getContainer().copy()
  return Item.empty
}

gsCreativeTabs.forEach(tab => {
  StartupEvents.modifyCreativeTab(tab, event => {
    const items = []
    GsCreativeItems.itemsInTab(tab).forEach(id => {
      if (gsRetiredWorkshopTools.includes(String(id))) return
      const stack = Item.of(id)
      if (!stack.isEmpty()) items.push(stack)
    })
    if (tab === 'ad_astra:main') {
      gsCreativeFuels.forEach(id => {
        const cell = gsFuelContainer(id)
        if (!cell.isEmpty()) items.push(cell)
      })
    }
    event.add(items)
  })
})

StartupEvents.modifyCreativeTab('kubejs:tab', event => {
  const moved = []
  gsCreativeTabs.forEach(tab => GsCreativeItems.itemsInTab(tab).forEach(id => moved.push(String(id))))
  event.remove(Ingredient.of(moved))
})
