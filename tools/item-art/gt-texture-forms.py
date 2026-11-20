"""Assign a real GTCEu model or sprite to each GTIBD material."""
import re

# Model keys use the layers and their order from the installed GregTech JAR.
EXACT = {
 'boiler_tube_bank':'glass_tube','final_serial_polymer':'carbon_fiber_plate','final_serial_steel':'plate_dense',
 'five_tube_register':'vacuum_tube','heater_ribbon':'wire_fine','heat_exchange_core':'rotor',
 'hv_arc_shield':'plate_dense','iv_servo_core':'iv_electric_piston','lapped_edge':'tool_head_buzz_saw',
 'luv_annealed_mount':'ring','mv_impregnated_insulation':'basic_tape','refinery_tray':'fluid_filter',
 'titan_wick':'item_filter','titan_spent_wick':'item_filter','titan_radiator_core':'rotor',
 'plant_fibre':'bio_chaff','washed_fibre':'bio_chaff','impregnated_fibre':'carbon_fibers',
 'fibre_cord':'carbon_fibers','retting_bundle':'carbon_fiber_mesh','retted_bundle':'carbon_fiber_mesh',
 'camp_dough':'plant_ball','green_tuyere':'glass_tube','fired_tuyere':'glass_tube','glass_tube_blank':'glass_tube',
 'clay_mortar':'tool:mortar','fire_drill':'tool:screwdriver','stone_hammer':'tool:hammer',
 'stone_chisel':'tool:file','seismic_probe':'prospector.lv','bench_soldering_iron':'tool:screwdriver',
 'saw_teeth':'gem_chipped','saw_blade':'tool_head_buzz_saw','flint_shard':'flint:gem_chipped',
 'scored_flint_core':'flint:gem','axe_head':'head:axe','pick_head':'head:pickaxe',
 'tool_handle':'head:handle','haft_blank':'head:handle','clay_bucket_water_surface':'mask',
 'tool_binding':'basic_tape','wooden_peg':'wood:bolt','wooden_joint':'wood:rod','rough_slat':'wood:plate',
 'wedged_tenon':'wood:bolt','treated_sleeper':'wood:plate','workbench_top':'wood:plate_dense',
 'workbench_frame':'empty_wooden_form','green_ingot_mould':'ingot_wooden_form','ingot_mould':'ingot_casting_mold',
 'bronze_mould_frame':'empty_wooden_form','wheel_segment':'turbine_blade','woven_drive_belt':'carbon_fiber_mesh',
 'coke_brick_blank':'coke_oven_brick','nether_brick_blank':'firebrick','refractory_brick_blank':'firebrick',
 'kiln_biscuit':'firebrick','fired_lining':'firebrick','fired_refractory_liner':'firebrick','wet_lining':'firebrick',
 'furnace_lining_insert':'firebrick','kiln_grate':'carbon_fiber_mesh','iron_bloom':'raw_ore',
 'fired_crucible':'ceramic:crucible','unfired_crucible':'ceramic:crucible','insulating_gum':'sticky_resin',
 'hearth_bellows':'lv_electric_pump','turbine_rotor_blank':'rotor','balanced_turbine_rotor':'rotor',
 'magnetic_armature':'lv_electric_motor','wound_stator':'lv_voltage_coil','shaft_bushing':'ring',
 'strainer_mesh':'carbon_fiber_mesh','hammer_die':'plate_casting_mold','forging_saddle':'block_casting_mold',
 'singularity_pair_capsule':'quantum_eye','laser_mask':'data_stick','carbon_resistor_core':'resistor',
 'pneumatic_seal':'rubber_ring','impregnated_insulation':'basic_tape','pressed_insulation':'carbon_fiber_mesh',
 'lunar_vacuum_seal':'ring','martian_pressure_liner':'plate_double','venus_thermal_screen':'plate_dense',
 'glacio_reference_crystal':'quartz:gem','europa_phase_ceramic':'plate','titan_load_standard':'weight',
 'survey_drive':'power_thruster','courier_drive':'advanced_power_thruster','freighter_drive':'advanced_power_thruster',
 'luv_venus_timing_prism':'gem_vertical:gem','luv_prism_blank':'quartz:gem_flawed',
 'zpm_europa_reticle':'lens','zpm_glacio_lamella':'foil','zpm_europa_membrane':'fluid_filter',
 'zpm_europa_datum':'data_module','zpm_tempered_frame':'empty_wooden_form','zpm_preload_frame':'empty_wooden_form',
 'luv_cryo_cartridge':'fluid_filter','uv_quench_cassette':'fluid_filter','zpm_storage_backplane':'wetware_printed_circuit_board',
 'ev_mercury_thermal_insert':'plate_dense','iv_venus_panel_blank':'plate_double','luv_glacio_seed':'quartz:gem_chipped',
 'final_start_key':'data_stick','final_control_console':'portable_scanner','reclaim_separation_manifold':'lv_fluid_regulator',
 'post_uv_logistics_clock':'sensor','distribution_load_fingerprint':'data_orb','uv_neutronium_coupon':'plate',
}
GROUPS=[
 (r'^(copper_(axe|hoe|pickaxe|shovel|sword|mini[n]?g_hammer)|flint_(axe|knife|pickaxe))$','toolname'),
 (r'^washed_.*grit$|^washed_bauxite$','crushed_purified'),(r'_grit$','crushed'),(r'purified_rutile|_concentrate$','crushed_refined'),
 (r'crystal|prism','gem_vertical:gem'),(r'optical_blank|optic.*insert|optical_core|optics_panel|waveguide|optical_link|reference_optic','lens'),
 (r'filter_cake|tungsten_cake|niobium_cake|slip_cake|paraffin_cake','dust_pure'),
 (r'wafer_preform|conditioned_wafer|rinsed_wafer|calibrated_wafer|masked_wafer|exposed_wafer|cleanroom_wafer','silicon_wafer'),
 (r'wafer','cpu_wafer'),(r'resistor','resistor'),(r'processor_package|sealed_processor|serial_logic','quantum_processor'),
 (r'control_module|reference_module|sealed_(hv|mv)_module|phase_module|phase_interlock|logic_preform|hv_grid|regulator','basic_integrated_circuit'),
 (r'empty.*cell|sealed_cell|isotope_capsule|naquadria_capsule|sampling_capsule|ampoule|_sample$','glass_tube'),
 (r'storage_backplane|backplane|socket|bus_diagnostic|clock_matrix|rectifier|control_rack|telemetry_unit|calibration_rig','multilayer_fiber_reinforced_printed_circuit_board'),
 (r'harness|busbar|flux_shunt|contact_bridge|contact_strip|isolated_bus|reserve_bus|bus_diagnostic','foil'),
 (r'film|foil|mask|membrane|filter|coalescer|getter|adsorbent|coated_mesh','fluid_filter'),
 (r'coil|winding|packing|spool|coil_cartridge|coil_core','coil'),
 (r'report|permit|license|certificate|manifest|pressure_record|receipt|waybill|_record$|dispatch$','data_stick'),
 (r'witness|reactor_standard|calibration|commissioning_kit|matrix|control_key','data_orb'),
 (r'charge|sludge|mix$|_feed$|catalyst|ore_tailings|flux$|temper$|abrasive_paste|chamotte|coarse_flour|glass_batch|specimen|ash|isotope_salt|sponge|carrier','dust_impure'),
 (r'hot_|^hot','ingot_hot'),(r'billet|slug|ingot|tritanium_preform|target|conductor_blank|iron_bloom|reinforced_billet','ingot'),
 (r'turbine_rotor|rotor_core|drill_seal','rotor'),(r'gear|grinding_runner|drawer_selector','gear'),
 (r'rod|axle|shaft|spindle|runner_blank|drawer_slide|rail_profile|indexed_rail|rolled_rail','rod_long'),
 (r'hinge|rivet|fastener|contact|strap|strip|rail_joint','bolt'),
 (r'gasket|_seal$|joint|sealing|bushing|mould_frame|packing|seal_preform|isolation_shell','ring'),
 (r'wire|cord','wire_fine'),(r'cooling_jacket|housing|bulkhead|pressure_cage|cask|barrel|pump_core|cartridge|cassette|kit|isolation_module|pulse_reserve|backup_module','battery'),
 (r'die$|die_cartridge|die_blank|fixture|mould|mold|press_blank|press_form','plate_casting_mold'),
 (r'switch|relay|breaker|contactor|contact_bridge|terminal_block','relay'),
 (r'polymer_lot|_lot$|crate|cargo_skeleton','crate'),
 (r'laminate|board|substrate|logic|etched_collector|recovered_collector|concurrent_record','phenolic_circuit_board'),
 (r'plate|coupon|panel|lamella|flat|tile|preform|_blank$|blank_|jacket|liner|rubber|ceramic|membrane_frame|cast$|liner|_frame$','plate'),
 (r'grain|load$|skeleton|lot$|steel_lot','dust_pure'),
 (r'^distribution_|_module$|stator|datum|counter|control|valve','lv_fluid_regulator')
]
MATERIALS={'copper':'D7885F','bronze':'C19B63','gold':'EACA70','tin':'C0C9CE','iron':'B9BCB8','steel':'99ADBA',
 'stainless':'AABFD0','titanium':'B29CC9','tungsten':'7589A5','americium':'B5BA76','neutronium':'85879B',
 'naquad':'639887','palladium':'CED5DB','rhodium':'D3BCC9','platinum':'DFD395','niobium':'99A6CE','europium':'A5D2CD',
 'rubber':'6B716D','clay':'B39380','flint':'89959E','wood':'C09969','fibre':'B3A071','oil':'A78F52',
 'refractory':'C58669','coke':'877F80','fireclay':'BE8B76','nether':'AE7869','end_':'A6A884','glass':'B4D3D8',
 'optical':'93B5D3','steam':'BD9E67','salt':'C5BEB2','cobalt':'7997CD','kanthal':'AC875A','circuit':'77AB8F',
 'calorite':'CF786D','mars':'BA826B','venus':'D69764','glacio':'96C9D4','europa':'80B5AC','ceres':'B1A0CD','titan_':'C19565'}
TIERS={'lv':'B9C4CD','mv':'D3AC78','hv':'E2C453','ev':'B1A8BF','iv':'929BCC','luv':'D19CA9','zpm':'9FBEA1','uv':'99C8C6','post':'ADB9C1','reclaim':'93B3A2','distribution':'A0AFCA','final':'C4B0A0'}


# Select hardware by its role in the recipe, including components distinguishable at native scale.
HARDWARE = {
 'memory_module':'zpm_storage_backplane','power_backplane':'final_heavy_backplane',
 'heat_sink':'titan_radiator_core heat_exchange_core ev_mercury_thermal_insert',
 'sample_vial':'diesel_sample heavy_fuel_sample light_fuel_sample naphtha_sample refinery_gas_sample iv_photoresist_ampoule sample_ampoule washed_oil_sample zpm_isotope_capsule uv_naquadria_capsule distribution_sealed_cell',
 'crate':'received_refractory_crate sealed_refractory_crate uv_neutronium_acceptance_crate zpm_americium_acceptance_crate final_logic_lot final_polymer_lot final_steel_lot',
 'frame':'workbench_frame bronze_mould_frame zpm_preload_frame zpm_tempered_frame pressed_steel_frame distribution_cargo_skeleton ev_pressure_cage reclaim_membrane_frame',
 'terminal':'lv_terminal_block lv_line_contactor hv_switch_contact final_breaker_core final_control_relay iv_switch_stack signal_relay ev_phase_relay zpm_reserve_switchgear',
 'wire_harness':'ev_harness uv_flux_shunt',
 'rail':'rail_profile_blank rolled_rail iv_indexed_rail drawer_slide drawer_runner_blank',
 'manifold':'packed_steam_valve unseated_steam_valve reclaim_separation_manifold',
 'bellows':'hearth_bellows','fire_drill':'fire_drill',
 'tube_bank':'boiler_tube_bank five_tube_register',
 'screen':'final_control_rack final_telemetry_unit final_control_console iv_calibration_rig post_uv_bus_diagnostic post_uv_logistics_clock',
 'folded_filter':'ev_filter_pleat cleanroom_filter_pack iv_leach_filter mv_coalescer mv_saturated_coalescer end_sampling_filter spent_end_filter titan_wick titan_spent_wick',
 'cassette':'uv_quench_cassette uv_field_cassette luv_cryo_cartridge reclaim_membrane_cartridge',
 'cask':'hand_pump_barrel zpm_irradiated_cask zpm_shielded_cask',
}
for silhouette,names in HARDWARE.items():
    for name in names.split():EXACT[name]='hw:'+silhouette
EXACT.update({
 'oil_wash_cartridge':'mask_filter','spent_oil_cartridge':'mask_filter','heat_exchange_core':'hw:tube_bank',
 'drill_seal_head':'dull:tool_head_drill','pressed_insulation':'carbon_fiber_plate',
 'chorus_dielectric_film':'foil','me_memory_foil':'foil','me_etched_foil':'foil','iv_sterile_mask':'mask_filter',
 'me_isolation_shell':'lv_battery_hull','rail_fastener':'screw','rail_fastener_blank':'bolt',
 'braided_valve_packing':'ring','tin_solder_preform':'rod','copper_strap':'foil','iron_hinge':'plate_double',
 'ev_etching_mask':'cpu_wafer','laser_mask':'cpu_wafer','refinery_tray':'carbon_fiber_mesh',
 'final_isolated_bus':'plate_double','final_reserve_bus':'plate_double','lv_contact_bridge':'foil',
 'iv_clock_backplane':'hw:clock_board','luv_clock_matrix':'nano_processor_assembly','zpm_phase_module':'quantum_processor_assembly',
 'uv_phase_interlock':'crystal_processor_assembly','sealed_mv_module':'good_integrated_circuit',
 'sealed_hv_module':'advanced_integrated_circuit','final_emergency_rectifier':'advanced_smd_diode',
 'iv_grid_regulator':'iv_field_generator','iv_reference_module':'nano_processor','luv_magnet_module':'luv_field_generator',
 'uv_reactor_standard':'plate_dense','zpm_reactor_standard':'plate_dense','end_filter_blank':'carbon_fiber_mesh',
 'vacuum_pump_core':'ev_electric_pump','process_commissioning_kit':'portable_scanner','final_test_load':'empty_wooden_form','iv_line_datum':'data_stick',
 'final_start_key':'machine_memory_card','me_press_blank':'plate_casting_mold','lug':'bolt',
 'zpm_die_cartridge':'plate_casting_mold','zpm_glacio_lamella':'foil','spent_iv_photoresist':'glass_tube'
})
WORKSHOP={
 'charge':'copper_charge iron_charge tin_charge gold_charge bronze_charge','pot':'fired_crucible unfired_crucible',
 'tuyere':'green_tuyere fired_tuyere','waveguide':'luv_optical_blank luv_polished_waveguide',
 'hinge':'iron_hinge','teeth':'saw_teeth','blade':'lapped_edge','wheel':'grinding_runner',
 'grate':'kiln_grate','charge_tray':'refinery_tray','barbus':'iv_busbar_blank luv_busbar zpm_flux_busbar final_isolated_bus final_reserve_bus',
 'solder_iron':'bench_soldering_iron','fibre':'plant_fibre washed_fibre retting_bundle retted_bundle',
 'clay_lump':'clay_mortar clay_slip_cake','mould':'green_ingot_mould ingot_mould',
 'plate_stack':'circuit_laminate uv_structural_laminate zpm_neutron_laminate iv_bonded_billet iv_layered_billet'
}
for silhouette,names in WORKSHOP.items():
    for name in names.split():EXACT[name]='shop:'+silhouette
EXACT.update({'iv_clean_die':'engraved_crystal_chip','nether_transit_seal':'hw:document','final_warehouse_seal':'copper_credit',
              'luv_fusion_specimen':'plate_dense','distribution_surface_feed':'hw:crate','distribution_nether_feed':'hw:crate','distribution_end_feed':'hw:crate'})
def form_for(name):
    if name in EXACT:return EXACT[name]
    if re.search(r'report|license|certificate|manifest|permit|waybill|receipt|dispatch$|_record$',name):return 'hw:document'
    for expr,form in GROUPS:
        if re.search(expr,name):
            if form=='toolname':return 'tool:'+name.split('_',1)[1]
            return form
    raise ValueError('Missing intentional GT prototype: '+name)


def color_for(name):
    for k,c in MATERIALS.items():
        if k in name:return c
    return TIERS.get(name.split('_')[0],'B1A99A')
