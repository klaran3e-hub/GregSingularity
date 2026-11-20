ServerEvents.recipes(event => {
  const wire = 'gtceu:electrum_single_wire'
  event.remove({ id: /^gtceu:wiremill\/mill_electrum_wire(?:_(?:2|4|8|16|fine))?$/ })
  event.remove({ id: 'gtceu:extruder/extrude_electrum_wire' })
  event.recipes.gtceu.wiremill('zero_shift:mv_wireworks/draw_electrum_wire')
    .itemInputs('gtceu:electrum_ingot').itemOutputs('2x ' + wire).duration(200).EUt(24)
})
