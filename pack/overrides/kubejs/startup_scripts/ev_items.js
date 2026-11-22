StartupEvents.registry('item', event => {
  const materials = [
    'end_transit_permit', 'ender_optical_insert', 'endstone_grit', 'end_filter_blank',
    'end_sampling_filter', 'spent_end_filter', 'vacuum_seal_preform', 'vacuum_gasket',
    'vacuum_tile_mix', 'vacuum_tile_blank', 'sintered_vacuum_tile', 'vacuum_pump_core',
    'purified_rutile', 'titanium_reduction_charge', 'hot_titanium_billet', 'clean_panel_blank',
    'hot_clean_panel', 'vacuum_treated_panel', 'cleanroom_filter_pack', 'laser_mask',
    'vacuum_wafer_preform', 'conditioned_wafer', 'etched_cleanroom_wafer', 'chorus_dielectric_film',
    'ev_logic_preform', 'ev_control_module', 'ev_harness', 'ev_pressure_cage',
    'ev_traction_coil', 'ev_phase_relay', 'ev_engine_jacket', 'ev_etching_mask',
    'ev_calibrated_wafer', 'ev_commissioning_report'
  ]
  materials.forEach(id => {
    const item = event.create(global.gsItemId(id)).texture('kubejs:item/' + id)
    if (id === 'end_transit_permit') item.maxStackSize(1)
  })
})
