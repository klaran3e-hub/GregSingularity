StartupEvents.registry('item', event => {
  const parts = [
    'ev_rutile_filter_cake', 'ev_vacuum_getter', 'ev_spent_getter', 'ev_filter_pleat',
    'ev_rinsed_wafer', 'ev_alignment_coupon', 'ev_liner_preform', 'ev_mercury_thermal_insert'
  ]
  for (const id of parts) event.create(global.gsItemId(id)).texture('kubejs:item/' + id)
})
