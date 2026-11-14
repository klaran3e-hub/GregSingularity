StartupEvents.registry('item', event => {
  const materials = [
    'iv_nichrome_charge', 'iv_hot_nichrome', 'iv_coil_core', 'end_tungstate_concentrate',
    'iv_leach_filter', 'iv_tungsten_cake', 'iv_hot_tungsten', 'iv_tungstensteel_charge',
    'iv_hot_tungstensteel', 'iv_platinum_filter_cake', 'iv_platinum_sponge', 'iv_busbar_blank',
    'iv_cable_jacket', 'iv_fuel_catalyst', 'iv_spent_fuel_catalyst', 'iv_photoresist_ampoule',
    'iv_sterile_mask', 'iv_masked_wafer', 'iv_exposed_wafer', 'iv_clean_die', 'iv_sealed_processor',
    'iv_clock_backplane', 'iv_arc_plate', 'iv_servo_core', 'iv_switch_stack', 'iv_grid_regulator',
    'iv_cooling_jacket', 'iv_bulkhead', 'iv_reference_module', 'iv_calibration_rig', 'iv_stress_coupon',
    'iv_commissioning_report'
  ]
  materials.forEach(id => event.create(id).texture('kubejs:item/' + id))
})
