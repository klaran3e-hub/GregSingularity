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
    ['ad_astra:moon', 1, 'kubejs:moon_desh_breccia', 'kubejs:lunar_vacuum_seal'],
    ['ad_astra:mars', 2, 'kubejs:mars_ostrum_breccia', 'kubejs:iv_mars_refractory_grain'],
    ['ad_astra:mercury', 2, 'kubejs:mercury_vitreous_lode', 'kubejs:ev_mercury_thermal_insert'],
    ['ad_astra:venus', 3, 'kubejs:venus_calorite_lode', 'kubejs:venus_thermal_screen'],
    ['ad_astra:glacio', 4, 'kubejs:glacio_cryolite_lens', 'kubejs:glacio_reference_crystal'],
    ['zero_shift:ceres', 5, 'kubejs:ceres_salt_lens', 'kubejs:survey_drive'],
    ['zero_shift:europa', 6, 'kubejs:europa_rift_core', 'kubejs:zpm_europa_reticle'],
    ['zero_shift:titan', 7, 'kubejs:titan_seam_core', 'kubejs:titan_radiator_core']
  ]
  planets.forEach(([dimension, tier, surfaceIcon, orbitIcon]) => {
    mark(dimension, tier, surfaceIcon)
    mark(dimension + '_orbit', tier, orbitIcon)
  })
})
