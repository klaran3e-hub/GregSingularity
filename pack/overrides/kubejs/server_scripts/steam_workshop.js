ServerEvents.recipes(event => {
  const k = name => global.gsItemId(name)
  const g = name => 'gtceu:' + name
  const id = name => 'zero_shift:steam_workshop/' + name
  const shaped = (name, output, rows, keys) => event.shaped(output, rows, keys).id(id(name))
  const pipe = g('bronze_small_fluid_pipe'), plate = g('bronze_plate')
  const packing = k('braided_valve_packing'), blank = k('valve_spindle_blank')
  const spindle = k('bronze_valve_spindle'), body = k('unseated_steam_valve')
  const hammer = '#gtceu:tools/crafting_hammers', saddle = k('forging_saddle')
  const recipes = event.recipes.gtceu

  shaped('turning_stock', blank, [' B', ' B', 'C '], {B: g('bronze_ingot'), C: k('copper_strap')})
  shaped('lap_spindle', spindle, [' H ', 'GCG', ' S '], {
    H: hammer, G: '#minecraft:sand', C: blank, S: saddle
  }).damageIngredient(hammer).keepIngredient(saddle)
  recipes.forge_hammer(id('swage_spindles')).itemInputs(blank)
    .itemOutputs('2x ' + spindle).duration(140).EUt(4)
  shaped('braid_packing', packing, ['FFF', ' C '], {F: k('washed_fibre'), C: k('fibre_cord')})
  recipes.compressor(id('press_packing')).itemInputs('2x ' + k('tool_binding'))
    .itemOutputs('4x ' + packing).duration(160).EUt(4)
  shaped('fit_valve', body, [' B ', 'VSV', 'PRP'], {
    B: k('shaft_bushing'), V: pipe, S: spindle, P: plate, R: k('iron_rivet')
  })
  event.shapeless(k('packed_steam_valve'), [body, packing, '#gtceu:tools/crafting_hammers'])
    .damageIngredient('#gtceu:tools/crafting_hammers').id(id('pack_valve'))
})
