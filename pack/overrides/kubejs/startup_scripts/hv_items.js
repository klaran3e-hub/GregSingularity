StartupEvents.registry('item', event => {
  const materials = [
    'nether_transit_seal', 'basalt_grit', 'chromite_concentrate', 'refractory_mix',
    'refractory_cast', 'fired_refractory_liner', 'kanthal_charge', 'hot_kanthal_billet',
    'kanthal_winding', 'stainless_charge', 'hot_stainless_billet', 'ceramic_hv_substrate',
    'hv_circuit_preform', 'sealed_hv_module', 'gold_conductor_blank', 'hv_winding_pack',
    'hv_arc_shield', 'hv_switch_contact', 'hv_trial_charge', 'hot_hv_trial_billet',
    'hv_alloy_coupon', 'hv_commissioning_report', 'rail_profile_blank', 'rolled_rail',
    'treated_sleeper', 'rail_fastener_blank', 'rail_fastener', 'axle_blank', 'balanced_rail_axle',
    'traction_housing', 'signal_relay', 'rail_waybill', 'sealed_refractory_crate',
    'received_refractory_crate', 'nether_brick_blank', 'netherite_upgrade_charge'
  ]
  materials.forEach(id => {
    const item = event.create(id).texture('kubejs:item/' + id)
    if (id === 'rail_waybill' || id === 'nether_transit_seal') item.maxStackSize(1)
  })
})
