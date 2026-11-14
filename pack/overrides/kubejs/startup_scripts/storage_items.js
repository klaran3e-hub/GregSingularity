StartupEvents.registry('item', event => {
  const items = [
    'drawer_runner_blank', 'drawer_slide', 'drawer_cartridge', 'drawer_selector',
    'me_isolation_shell', 'me_piezo_laminate', 'me_memory_foil', 'me_etched_foil',
    'me_pattern_laminate', 'me_optical_link', 'me_press_blank', 'rail_delivery_receipt'
  ]
  items.forEach(id => event.create(id).texture('kubejs:item/' + id))
})
