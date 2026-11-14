StartupEvents.registry('item', event => {
  const parts = [
    'control_console', 'start_key', 'backup_module', 'overworld_dispatch',
    'nether_dispatch', 'end_dispatch', 'steel_lot', 'polymer_lot',
    'logic_lot', 'black_start_record', 'outage_record', 'shift_record', 'concurrent_record', 'repeat_load_record',
    'heavy_backplane', 'breaker_core', 'reserve_bus', 'control_relay',
    'telemetry_unit', 'test_load', 'emergency_rectifier', 'isolated_bus',
    'control_rack', 'warehouse_seal', 'reinforced_billet', 'polymer_preform',
    'optics_panel', 'serial_blank', 'serial_steel', 'serial_polymer',
    'serial_logic', 'commissioning_report'
  ]
  parts.forEach(name => {
    const id = 'final_' + name
    event.create(id).texture('kubejs:item/' + id)
  })
})
