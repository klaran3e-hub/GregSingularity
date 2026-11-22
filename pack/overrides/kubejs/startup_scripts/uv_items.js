StartupEvents.registry('item', event => {
  const parts = [
    'duranium_target', 'tritanium_preform', 'laminate_preform', 'structural_laminate',
    'flux_shunt', 'phase_interlock', 'pulse_reserve', 'field_cassette', 'reactor_standard',
    'naquadria_capsule', 'neutronium_coupon', 'quench_cassette', 'grid_witness',
    'freight_manifest', 'neutronium_acceptance_crate', 'commissioning_report'
  ]
  parts.forEach(name => {
    const id = 'uv_' + name
    event.create(global.gsItemId(id)).texture('kubejs:item/' + id)
  })
})
