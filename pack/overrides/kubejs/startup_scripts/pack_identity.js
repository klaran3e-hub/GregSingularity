Platform.mods.kubejs.name = 'GregSingularity Core'

// Keep the original workshop tab for existing saves and items supplied by other scripts.
const gsTabSections = {
  tools: {
    icon: 'kubejs:copper_mining_hammer',
    items: [
      'axe_head bench_soldering_iron bronze_mould_frame clay_mortar copper_axe copper_hoe',
      'copper_mining_hammer copper_pickaxe copper_shovel copper_sword fire_drill flint_shard',
      'green_ingot_mould haft_blank ingot_mould lapped_edge pick_head saw_blade saw_teeth',
      'scored_flint_core stone_chisel tool_binding tool_handle iv_clean_die iv_index_fixture'
    ].join(' ').split(' ')
  },
  industry: {
    icon: 'kubejs:packed_steam_valve',
    items: [
      'abrasive_paste alumina_charge balanced_turbine_rotor basalt_grit boiler_tube_bank',
      'braided_valve_packing bronze_valve_spindle chorus_dielectric_film chromite_concentrate',
      'clean_panel_blank cleanroom_filter_pack copper_strap drill_seal_head drum_liner',
      'end_tungstate_concentrate endstone_grit fired_refractory_liner five_tube_register',
      'forging_saddle furnace_lining_insert gear_rim glass_batch glass_tube_blank grinding_runner',
      'hand_forged_plate hand_pump_barrel heat_exchange_core heater_alloy_charge heater_ribbon',
      'hot_aluminium_billet hot_clean_panel hot_hv_trial_billet hot_kanthal_billet',
      'hot_stainless_billet hot_titanium_billet impregnated_fibre insulating_gum iron_hinge',
      'iron_pressure_slug iron_rivet kanthal_charge kanthal_winding magnetic_armature',
      'nether_brick_blank nickel_concentrate packed_steam_valve pressed_insulation',
      'pressed_steel_frame pressure_gasket process_commissioning_kit purified_rutile',
      'refractory_cast sealed_boiler_joint shaft_bushing singularity_pair_capsule',
      'sintered_vacuum_tile stainless_charge stamped_bronze_blank steel_furnace_charge',
      'steel_press_blank titanium_reduction_charge traction_housing turbine_rotor_blank',
      'turned_spindle unseated_steam_valve vacuum_gasket vacuum_pump_core vacuum_tile_blank',
      'vacuum_tile_mix vacuum_treated_panel valve_spindle_blank washed_bauxite wound_stator',
      'woven_drive_belt mv_rotor_core hv_alloy_coupon hv_arc_shield hv_commissioning_report',
      'hv_steel_coil_preform hv_trial_charge hv_winding_pack ev_alignment_coupon',
      'ev_commissioning_report ev_engine_jacket ev_etching_mask ev_filter_pleat ev_harness',
      'ev_liner_preform ev_pressure_cage ev_traction_coil iv_arc_plate iv_bonded_billet',
      'iv_bulkhead iv_cable_jacket iv_calibration_rig iv_coil_core iv_commissioning_report',
      'iv_cooling_jacket iv_hot_nichrome iv_hot_tungsten iv_hot_tungstensteel iv_indexed_rail',
      'iv_layered_billet iv_line_datum iv_nichrome_charge iv_platinum_sponge iv_servo_core',
      'iv_stress_coupon iv_tungsten_cake iv_tungstensteel_charge luv_annealed_mount',
      'luv_coil_winding luv_commissioning_report luv_cryo_cartridge luv_fusion_specimen',
      'luv_hot_conductor luv_hot_hssg luv_hot_palladium luv_hssg_charge luv_ignition_report',
      'luv_load_coupon luv_niobium_cake luv_niobium_charge luv_palladium_charge luv_pgm_sludge',
      'luv_plasma_coupon luv_rhodium_sponge luv_rotor_spindle luv_tantalite_concentrate',
      'luv_witness_blank zpm_americium_acceptance_crate zpm_americium_coupon',
      'zpm_commissioning_report zpm_die_cartridge zpm_end_heavy_concentrate zpm_europium_target',
      'zpm_hot_americium_coupon zpm_irradiated_cask zpm_isotope_capsule zpm_nether_isotope_salt',
      'zpm_phase_module zpm_preload_frame zpm_reactor_standard zpm_shielded_cask',
      'zpm_tempered_frame uv_commissioning_report uv_duranium_target uv_field_cassette',
      'uv_flux_shunt uv_grid_witness uv_naquadria_capsule uv_neutronium_acceptance_crate',
      'uv_neutronium_coupon uv_phase_interlock uv_pulse_reserve uv_quench_cassette',
      'uv_reactor_standard uv_tritanium_preform'
    ].join(' ').split(' ')
  },
  electronics: {
    icon: 'kubejs:zpm_storage_backplane',
    items: [
      'carbon_resistor_core ceramic_hv_substrate circuit_laminate conditioned_wafer',
      'copper_contact_strip ender_optical_insert etched_cleanroom_wafer gold_conductor_blank',
      'laser_mask me_etched_foil me_isolation_shell me_memory_foil me_optical_link',
      'me_pattern_laminate me_piezo_laminate me_press_blank sealed_hv_module sealed_mv_module',
      'signal_relay tin_solder_preform tin_wire_blank vacuum_seal_preform vacuum_wafer_preform',
      'lv_contact_bridge lv_line_contactor lv_terminal_block hv_circuit_preform hv_switch_contact',
      'ev_calibrated_wafer ev_control_module ev_logic_preform ev_phase_relay ev_rinsed_wafer',
      'iv_busbar_blank iv_clock_backplane iv_exposed_wafer iv_grid_regulator iv_masked_wafer',
      'iv_reference_module iv_sealed_processor iv_switch_stack luv_busbar luv_clock_matrix',
      'luv_dielectric_laminate luv_magnet_module luv_optical_blank luv_optical_core',
      'luv_polished_waveguide luv_prism_blank luv_processor_package zpm_flux_busbar',
      'zpm_laminate_preform zpm_neutron_laminate zpm_reserve_switchgear zpm_storage_backplane',
      'uv_laminate_preform uv_structural_laminate'
    ].join(' ').split(' ')
  },
  chemistry: {
    icon: 'kubejs:mv_coalescer',
    items: [
      'activated_carrier chemical_grade_seal cracking_catalyst diesel_sample end_filter_blank',
      'end_sampling_filter heavy_fuel_sample light_fuel_sample naphtha_sample oil_wash_cartridge',
      'paraffin_cake phenolic_preform polymer_seal_preform refinery_gas_sample refinery_tray',
      'sample_ampoule seismic_probe spent_end_filter spent_oil_cartridge strainer_mesh',
      'washed_oil_sample mv_coalescer mv_impregnated_insulation mv_saturated_coalescer',
      'ev_rutile_filter_cake ev_spent_getter ev_vacuum_getter iv_fuel_catalyst iv_leach_filter',
      'iv_photoresist_ampoule iv_platinum_filter_cake iv_spent_fuel_catalyst iv_sterile_mask',
      'zpm_coil_cartridge'
    ].join(' ').split(' ')
  },
  space: {
    icon: 'gtibd_core:surveyor',
    items: [
      'ceres_salt_lens courier_drive europa_phase_ceramic europa_rift_core freighter_drive',
      'glacio_cryolite_lens glacio_reference_crystal lunar_vacuum_seal mars_ostrum_breccia',
      'martian_pressure_liner mercury_vitreous_lode mill_ceres_assay mill_ceres_crystal',
      'mill_ceres_grit mill_ceres_heavy mill_ceres_washed mill_europa_assay mill_europa_crystal',
      'mill_europa_grit mill_europa_heavy mill_europa_washed mill_glacio_assay mill_glacio_crystal',
      'mill_glacio_grit mill_glacio_heavy mill_glacio_washed mill_mars_assay mill_mars_crystal',
      'mill_mars_grit mill_mars_heavy mill_mars_washed mill_mercury_assay mill_mercury_crystal',
      'mill_mercury_grit mill_mercury_heavy mill_mercury_washed mill_moon_assay mill_moon_crystal',
      'mill_moon_grit mill_moon_heavy mill_moon_washed mill_titan_assay mill_titan_crystal',
      'mill_titan_grit mill_titan_heavy mill_titan_washed mill_venus_assay mill_venus_crystal',
      'mill_venus_grit mill_venus_heavy mill_venus_washed moon_desh_breccia survey_drive',
      'titan_load_standard titan_radiator_core titan_seam_core titan_spent_wick titan_wick',
      'venus_calorite_lode venus_thermal_screen ev_mercury_thermal_insert iv_mars_refractory_grain',
      'iv_venus_panel_blank luv_ceres_salt_concentrate luv_glacio_seed luv_venus_timing_prism',
      'zpm_europa_datum zpm_europa_membrane zpm_europa_reticle zpm_glacio_lamella'
    ].join(' ').split(' ')
  },
  logistics: {
    icon: 'kubejs:rail_waybill',
    items: [
      'axle_blank balanced_rail_axle distribution_cargo_skeleton drawer_cartridge',
      'drawer_runner_blank drawer_selector drawer_slide end_transit_permit nether_transit_seal',
      'netherite_upgrade_charge rail_delivery_receipt rail_fastener rail_fastener_blank',
      'rail_profile_blank rail_waybill received_refractory_crate rolled_rail',
      'sealed_refractory_crate treated_sleeper zpm_freight_certificate uv_freight_manifest'
    ].join(' ').split(' ')
  },
  factory: {
    icon: 'kubejs:final_start_key',
    items: [
      'distribution_distribution_license distribution_distribution_matrix',
      'distribution_end_calibration distribution_end_feed distribution_end_pressure_record',
      'distribution_load_fingerprint distribution_nether_calibration distribution_nether_feed',
      'distribution_nether_pressure_record distribution_network_certificate',
      'distribution_sealed_cell distribution_surface_calibration distribution_surface_feed',
      'distribution_surface_pressure_record reclaim_etched_collector reclaim_loop_witness',
      'reclaim_membrane_cartridge reclaim_membrane_frame reclaim_purge_adsorbent',
      'reclaim_reclamation_certificate reclaim_recovered_collector reclaim_separation_manifold',
      'reclaim_sintered_membrane post_uv_bus_diagnostic post_uv_coolant_isolation_module',
      'post_uv_load_acceptance_record post_uv_logistics_clock post_uv_operations_certificate',
      'post_uv_operations_permit post_uv_reserve_bleed_record post_uv_reserve_load_matrix',
      'post_uv_supply_sync_record final_backup_module final_black_start_record final_breaker_core',
      'final_commissioning_report final_concurrent_record final_control_console final_control_rack',
      'final_control_relay final_emergency_rectifier final_end_dispatch final_heavy_backplane',
      'final_isolated_bus final_logic_lot final_nether_dispatch final_optics_panel',
      'final_outage_record final_overworld_dispatch final_polymer_lot final_polymer_preform',
      'final_reinforced_billet final_repeat_load_record final_reserve_bus final_serial_blank',
      'final_serial_logic final_serial_polymer final_serial_steel final_shift_record',
      'final_start_key final_steel_lot final_telemetry_unit final_test_load final_warehouse_seal'
    ].join(' ').split(' ')
  }
}

const gsFlintTools = ['knife', 'saw', 'hammer', 'mortar', 'axe', 'pickaxe', 'shovel', 'hoe', 'sword']
const gsRockets = [
  'ad_astra:tier_1_rocket', 'ad_astra:tier_2_rocket', 'ad_astra:tier_3_rocket', 'ad_astra:tier_4_rocket',
  'gtibd_core:surveyor', 'gtibd_core:courier', 'gtibd_core:freighter'
]
const gsFuels = [
  'ad_astra:fuel', 'kubejs:lunar_transfer_fuel', 'ad_astra:cryo_fuel', 'kubejs:calorite_flight_gel',
  'kubejs:survey_propellant', 'kubejs:europa_transfer_medium', 'kubejs:titan_flight_matrix'
]

function gsFuelContainer(fluid) {
  if (fluid === 'ad_astra:fuel') return Item.of('ad_astra:fuel_bucket')
  if (fluid === 'ad_astra:cryo_fuel') return Item.of('ad_astra:cryo_fuel_bucket')
  const fluidUtil = Java.loadClass('net.minecraftforge.fluids.FluidUtil')
  const action = Java.loadClass('net.minecraftforge.fluids.capability.IFluidHandler$FluidAction')
  const cell = Item.of('gtceu:universal_fluid_cell').copy()
  const tank = fluidUtil.getFluidHandler(cell).orElse(null)
  if (tank && tank.fill(Fluid.of(fluid, 1000), action.EXECUTE) === 1000) return tank.getContainer().copy()
  return Item.empty
}

function gsTabContents(section) {
  const contents = []
  if (section === 'space') {
    gsRockets.forEach(id => contents.push(Item.of(id)))
    contents.push(Item.of('ad_astra:nasa_workbench'))
    // List the empty transport cell first so the creative display retains every filled variant.
    contents.push(Item.of('gtceu:universal_fluid_cell'))
    gsFuels.forEach(id => {
      const container = gsFuelContainer(id)
      if (!container.isEmpty()) contents.push(container)
    })
  } else if (section === 'tools') {
    gsFlintTools.forEach(tool => contents.push(Item.of('gtceu:flint_' + tool)))
  }
  gsTabSections[section].items.forEach(id => contents.push(Item.of('kubejs:' + id)))
  return contents
}

StartupEvents.registry('creative_mode_tab', event => {
  Object.keys(gsTabSections).forEach(section => {
    event.create('gtibd_core:' + section)
      .displayName(Text.translate('itemGroup.gregsingularity.' + section))
      .icon(() => Item.of(gsTabSections[section].icon))
      .content(() => gsTabContents(section))
  })
})

StartupEvents.modifyCreativeTab('kubejs:tab', event => {
  event.displayName = Text.translate('itemGroup.gregsingularity.workshop')
  event.setIcon(Item.of('gtceu:field_bloomery'))
  const moved = []
  Object.keys(gsTabSections).forEach(section => {
    gsTabSections[section].items.forEach(id => moved.push('kubejs:' + id))
  })
  event.remove(Ingredient.of(moved))
  event.add(['gtceu:field_bloomery'])
  event.remove(Ingredient.of(['kubejs:flint_knife', 'kubejs:flint_axe', 'kubejs:flint_pickaxe', 'kubejs:stone_hammer']))
})
