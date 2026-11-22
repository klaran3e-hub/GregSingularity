GTCEuStartupEvents.registry('gtceu:dimension_marker', event => {
  function mark(dimension, tier, icon) {
    const name = dimension.split(':')[1]
    event.create(dimension)
      .tier(tier)
      .iconSupplier(() => Item.of(icon).getItem())
      .overrideName('dimension.gregsingularity.' + name)
  }

  mark('ad_astra:earth_orbit', 1, 'ad_astra:solar_panel')
  const planets = [
    ['ad_astra:moon', 1, 'ad_astra:gregsingularity_moon_desh_breccia', 'ad_astra:gregsingularity_lunar_vacuum_seal'],
    ['ad_astra:mars', 2, 'ad_astra:gregsingularity_mars_ostrum_breccia', 'ad_astra:gregsingularity_iv_mars_refractory_grain'],
    ['ad_astra:mercury', 2, 'ad_astra:gregsingularity_mercury_vitreous_lode', 'ad_astra:gregsingularity_ev_mercury_thermal_insert'],
    ['ad_astra:venus', 3, 'ad_astra:gregsingularity_venus_calorite_lode', 'ad_astra:gregsingularity_venus_thermal_screen'],
    ['ad_astra:glacio', 4, 'ad_astra:gregsingularity_glacio_cryolite_lens', 'ad_astra:gregsingularity_glacio_reference_crystal'],
    ['zero_shift:ceres', 5, 'ad_astra:gregsingularity_ceres_salt_lens', 'ad_astra:gregsingularity_survey_drive'],
    ['zero_shift:europa', 6, 'ad_astra:gregsingularity_europa_rift_core', 'ad_astra:gregsingularity_zpm_europa_reticle'],
    ['zero_shift:titan', 7, 'ad_astra:gregsingularity_titan_seam_core', 'ad_astra:gregsingularity_titan_radiator_core']
  ]
  planets.forEach(([dimension, tier, surfaceIcon, orbitIcon]) => {
    mark(dimension, tier, surfaceIcon)
    mark(dimension + '_orbit', tier, orbitIcon)
  })
})
