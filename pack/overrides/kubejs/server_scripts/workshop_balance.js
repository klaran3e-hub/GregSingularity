ServerEvents.recipes(event => {
  const copper = 'minecraft:copper_ingot'
  const strap = 'kubejs:copper_strap'
  const handle = 'kubejs:tool_handle'
  const binding = 'kubejs:tool_binding'
  const tools = {
    pickaxe: ['CCC', 'SHS', ' B '],
    axe: ['CC ', 'CHS', ' B '],
    sword: [' C ', 'SCS', 'BH '],
    hoe: ['CC ', 'SH ', ' B '],
    shovel: [' C ', 'SHS', ' B '],
    mining_hammer: ['CCC', 'CSC', 'SHB']
  }
  Object.entries(tools).forEach(([name, pattern]) => {
    const keys = { C: copper, S: strap, H: handle, B: binding }
    event.shaped('kubejs:copper_' + name, pattern, keys).id('zero_shift:copper_tools/' + name)
  })

  event.remove({ id: 'gtceu:macerator/macerate_wheat' })
  const crops = [
    ['wheat', '8x minecraft:wheat', 4],
    ['sugar_cane', '16x minecraft:sugar_cane', 8],
    ['kelp', '16x minecraft:kelp', 6],
    ['industrial_hemp', '8x immersiveengineering:hemp_fiber', 12]
  ]
  crops.forEach(([name, input, count]) => {
    event.recipes.gtceu.macerator('zero_shift:plant_fibre/' + name)
      .itemInputs(input).itemOutputs(Item.of('kubejs:plant_fibre', count)).duration(200).EUt(4)
  })
  event.recipes.gtceu.chemical_bath('zero_shift:plant_fibre/wash_batch')
    .itemInputs('8x kubejs:plant_fibre').inputFluids(Fluid.of('minecraft:water', 1000))
    .itemOutputs('8x kubejs:washed_fibre').duration(160).EUt(16)
})
