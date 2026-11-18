ServerEvents.recipes(event => {
  if (!Item.exists('chisel:iron_chisel')) return

  const prefix = 'zero_shift:decoration/'
  const ironChisel = 'chisel:iron_chisel'
  const diamondChisel = 'chisel:diamond_chisel'
  const electricChisel = 'chisel:hitech_chisel'
  const autoChisel = 'chisel:auto_chisel'
  const rivet = 'kubejs:iron_rivet'
  const binding = 'kubejs:tool_binding'

  const originalRecipes = [ironChisel, diamondChisel, electricChisel, autoChisel]
  originalRecipes.forEach(id => event.remove({ id: id }))

  event.shaped(ironChisel, [' PP', ' BR', 'H  '], {
    P: 'gtceu:iron_plate', B: binding,
    R: rivet, H: 'kubejs:tool_handle'
  }).id(prefix + 'iron_chisel')

  event.shaped(diamondChisel, [' SD', ' PR', 'C  '], {
    S: 'gtceu:steel_plate', D: 'minecraft:diamond', P: 'kubejs:shaft_bushing',
    R: rivet, C: ironChisel
  }).id(prefix + 'diamond_chisel')

  event.recipes.gtceu.assembler(prefix + 'auto_chisel')
    .itemInputs(ironChisel, 'kubejs:pressed_steel_frame', 'gtceu:lv_electric_motor',
      'create:mechanical_saw', 'gtceu:basic_electronic_circuit', '2x kubejs:shaft_bushing')
    .itemOutputs(autoChisel).duration(720).EUt(28)

  event.recipes.gtceu.assembler(prefix + 'hitech_chisel')
    .itemInputs(diamondChisel, 'gtceu:mv_electric_motor', 'gtceu:good_electronic_circuit',
      '2x kubejs:pressed_insulation', '2x gtceu:aluminium_plate')
    .itemOutputs(electricChisel).duration(840).EUt(96)
})
