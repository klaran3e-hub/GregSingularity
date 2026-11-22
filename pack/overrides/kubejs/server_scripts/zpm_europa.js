ServerEvents.recipes(event => {
  const gt = id => 'gtceu:' + id
  const zpm = id => global.gsItemId('zpm_' + id)
  const line = (type, id) => event.recipes.gtceu[type]('zero_shift:zpm_europa/' + id)
  const brine = zpm('ceres_brine')
  const spent = zpm('spent_brine')
  const cold = 'kubejs:luv_optical_coolant'
  const warm = 'kubejs:luv_warm_optical_coolant'
  const ceres = 'zero_shift:ceres'
  const europa = 'zero_shift:europa'

  line('assembler', 'mount_die_cartridge').itemInputs('gtceu:gregsingularity_forging_saddle',
    '2x ' + gt('naquadah_alloy_plate'), zpm('neutron_laminate'))
    .inputFluids(Fluid.of(gt('lubricant'), 500)).itemOutputs(zpm('die_cartridge'))
    .duration(780).EUt(30720)
  line('circuit_assembler', 'solder_storage_backplane').itemInputs('2x ae2:cell_component_256k',
    'ae2:item_cell_housing', 'ae2:fluid_cell_housing', zpm('phase_module'))
    .inputFluids(Fluid.of(gt('soldering_alloy'), 576)).itemOutputs('2x ' + zpm('storage_backplane'))
    .duration(960).EUt(98304)

  line('chemical_reactor', 'clarify_brine')
    .itemInputs('2x ad_astra:gregsingularity_luv_ceres_salt_concentrate', gt('sapphire_dust'))
    .inputFluids(Fluid.of(gt('distilled_water'), 1000), Fluid.of(cold, 250))
    .outputFluids(Fluid.of(brine, 1000), Fluid.of(warm, 250))
    .dimension(ceres).duration(1060).EUt(81920)
  line('chemical_reactor', 'recover_brine').itemInputs('ad_astra:gregsingularity_luv_ceres_salt_concentrate')
    .inputFluids(Fluid.of(spent, 500), Fluid.of(gt('distilled_water'), 500))
    .outputFluids(Fluid.of(brine, 1000)).dimension(ceres).duration(700).EUt(73728)
  line('cutter', 'slice_glacio_lamella').itemInputs('ad_astra:gregsingularity_glacio_reference_crystal')
    .inputFluids(Fluid.of(brine, 500)).itemOutputs('2x ' + zpm('glacio_lamella'))
    .dimension('ad_astra:glacio').duration(980).EUt(90112)
  line('chemical_bath', 'wash_europa_membrane').itemInputs('ad_astra:gregsingularity_mill_europa_assay')
    .inputFluids(Fluid.of(brine, 500)).itemOutputs('2x ' + zpm('europa_membrane'))
    .outputFluids(Fluid.of(spent, 500)).dimension(europa).duration(1120).EUt(98304)
  line('laser_engraver', 'etch_europa_reticle').itemInputs('ad_astra:gregsingularity_europa_phase_ceramic')
    .notConsumable('ad_astra:gregsingularity_luv_venus_timing_prism').itemOutputs(zpm('europa_reticle'))
    .dimension(europa).duration(1360).EUt(114688)

  line('forming_press', 'press_frame').itemInputs('2x ' + zpm('neutron_laminate'),
    '4x ' + gt('naquadah_alloy_plate'), zpm('flux_busbar'))
    .itemOutputs('2x ' + zpm('preload_frame')).duration(1100).EUt(98304)
  line('vacuum_freezer', 'temper_frame').itemInputs('2x ' + zpm('preload_frame'))
    .inputFluids(Fluid.of(gt('americium_plasma'), 360), Fluid.of(cold, 1000))
    .itemOutputs('2x ' + zpm('tempered_frame')).outputFluids(Fluid.of(warm, 1000))
    .duration(1800).EUt(114688)
  line('assembler', 'assemble_europa_datum').itemInputs(zpm('tempered_frame'),
    zpm('europa_reticle'), '2x ' + zpm('glacio_lamella'), zpm('phase_module'),
    '2x ' + zpm('americium_coupon')).inputFluids(Fluid.of(gt('soldering_alloy'), 576))
    .itemOutputs(zpm('europa_datum')).dimension(europa).duration(1660).EUt(122880)
})
