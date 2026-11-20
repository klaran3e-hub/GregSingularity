StartupEvents.registry('item', event => {
  for (const name of ['valve_spindle_blank', 'bronze_valve_spindle', 'braided_valve_packing',
    'unseated_steam_valve', 'packed_steam_valve']) {
    event.create(name).texture('kubejs:item/' + name)
  }
})
