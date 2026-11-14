StartupEvents.registry('item', event => {
  const parts = [
    'operations_permit', 'bus_diagnostic', 'reserve_load_matrix',
    'coolant_isolation_module', 'logistics_clock',
    'load_acceptance_record', 'supply_sync_record', 'reserve_bleed_record', 'operations_certificate'
  ]
  parts.forEach(name => {
    const id = 'post_uv_' + name
    event.create(id).texture('kubejs:item/' + id)
  })
})
