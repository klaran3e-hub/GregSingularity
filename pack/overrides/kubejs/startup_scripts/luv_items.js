StartupEvents.registry('item', event => {
  const parts = [
    'tantalite_concentrate', 'niobium_cake', 'niobium_charge', 'hot_conductor',
    'hssg_charge', 'hot_hssg', 'coil_winding', 'pgm_sludge', 'rhodium_sponge',
    'palladium_charge', 'hot_palladium', 'dielectric_laminate', 'optical_blank',
    'polished_waveguide', 'optical_core', 'processor_package', 'clock_matrix',
    'busbar', 'magnet_module', 'fusion_specimen', 'plasma_coupon', 'ignition_report',
    'load_coupon', 'commissioning_report',
    'prism_blank', 'annealed_mount', 'venus_timing_prism', 'cryo_cartridge',
    'rotor_spindle', 'witness_blank', 'glacio_seed', 'ceres_salt_concentrate'
  ]
  parts.forEach(name => {
    const id = 'luv_' + name
    event.create(id).texture('kubejs:item/' + id)
  })
})
