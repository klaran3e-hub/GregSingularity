StartupEvents.registry('item', event => {
  for (const id of ['lunar_vacuum_seal', 'martian_pressure_liner', 'venus_thermal_screen', 'glacio_reference_crystal']) {
    event.create(id).texture('kubejs:item/' + id)
  }
})
