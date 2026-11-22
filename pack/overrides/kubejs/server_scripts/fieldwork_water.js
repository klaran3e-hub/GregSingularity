const fieldWaterSource = Java.loadClass('net.minecraft.world.level.material.Fluids').WATER
const FieldTagPrefixItem = Java.loadClass('com.gregtechceu.gtceu.api.item.TagPrefixItem')
const FieldMaterialItems = Java.loadClass('com.gregtechceu.gtceu.common.data.GTMaterialItems')
const FieldChemicalHelper = Java.loadClass('com.gregtechceu.gtceu.api.data.chemical.ChemicalHelper')
const FieldMainHand = Java.loadClass('net.minecraft.world.InteractionHand').MAIN_HAND

function gtWashOutput(stack, amount) {
  const item = stack.getItem()
  if (!(item instanceof FieldTagPrefixItem)) return null
  const purified = FieldMaterialItems.purifyMap.get(item.tagPrefix)
  if (!purified) return null
  const output = FieldChemicalHelper.get(purified, item.material, amount)
  return output.isEmpty() ? null : output
}

BlockEvents.rightClicked('minecraft:water_cauldron', event => {
  if (!gtWashOutput(event.item, 1)) return
  event.cancel()
  if (!event.level.isClientSide()) event.player.tell(Text.translate('message.gtibd.fieldwork.use_trough'))
})

const fieldSoaking = {
  'gtceu:gregsingularity_retting_bundle': 'gtceu:gregsingularity_retted_bundle',
  'minecraft:clay_ball': 'gtceu:gregsingularity_clay_slip_cake',
  'gtceu:gregsingularity_coarse_flour': 'gtceu:gregsingularity_camp_dough'
}
function rinseAtSite(event, pos, output, amount, tailings) {
  const player = event.player
  event.item.shrink(amount)
  player.give(output)
  if (tailings) player.give(Item.of('gtceu:gregsingularity_ore_tailings', amount))
  player.swing(event.hand, true)
  global.fieldworkEffect(event.level, pos, 'wash', player)
  event.cancel()
}
Object.entries(fieldSoaking).forEach(([input, output]) => {
  ItemEvents.rightClicked(input, event => {
    if (event.level.isClientSide() || event.hand !== FieldMainHand) return
    const hit = event.player.rayTrace(5, true)
    if (!hit || !hit.block || hit.block.id !== 'minecraft:water') return
    const limit = event.player.isShiftKeyDown() ? 4 : 1
    const amount = Math.min(event.item.count, limit)
    rinseAtSite(event, hit.block.pos, Item.of(output, amount), amount, false)
  })
})
BlockEvents.rightClicked('gtceu:gregsingularity_ore_washing_trough', event => {
  if (event.level.isClientSide() || event.hand !== FieldMainHand) return
  const metal = ['copper', 'tin', 'iron', 'gold'].find(name => global.gsItemId(name + '_grit') === String(event.item.id))
  const limit = event.player.isShiftKeyDown() ? 8 : 1
  const amount = Math.min(event.item.count, limit)
  const output = metal ? Item.of(global.gsItemId('washed_' + metal + '_grit'), amount) : gtWashOutput(event.item, amount)
  if (!output) return
  const pos = event.block.pos
  const hasWater = [pos.north(), pos.south(), pos.east(), pos.west()].some(adjacent => {
    const fluid = event.level.getFluidState(adjacent)
    return fluid.isSource() && fieldWaterSource.equals(fluid.getType())
  })
  if (!hasWater) {
    event.player.tell(Text.translate('message.gtibd.fieldwork.dry_trough'))
    event.cancel()
    return
  }
  rinseAtSite(event, pos, output, amount, Boolean(metal))
})
