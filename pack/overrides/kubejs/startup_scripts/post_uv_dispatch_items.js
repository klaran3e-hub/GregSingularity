StartupEvents.registry('item', event => {
  const parts = [
    'distribution_license', 'cargo_skeleton', 'sealed_cell', 'surface_feed',
    'nether_feed', 'end_feed', 'surface_calibration', 'nether_calibration',
    'end_calibration', 'surface_pressure_record', 'nether_pressure_record',
    'end_pressure_record', 'distribution_matrix', 'load_fingerprint', 'network_certificate'
  ]
  parts.forEach(name => {
    const id = 'distribution_' + name
    event.create(id).texture('kubejs:item/' + id)
  })
})
