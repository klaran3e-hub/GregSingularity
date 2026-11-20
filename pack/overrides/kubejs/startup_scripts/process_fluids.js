StartupEvents.registry('fluid', event => {
  event.create('washed_crude')
    .stillTexture('kubejs:block/washed_crude_still')
    .flowingTexture('kubejs:block/washed_crude_flow')
    .noBlock()
    .noBucket()
    .viscosity(1800)

  const fluids = [
    ['lunar_transfer_fuel', 925], ['calorite_flight_gel', 1300], ['survey_propellant', 1050],
    ['europa_transfer_medium', 1150], ['titan_flight_matrix', 1450], ['stabilized_flight_blend', 800], ['desalted_crude', 1550], ['mv_dielectric_oil', 900],
    ['end_atmosphere', 200], ['vacuum_shield_gas', 100],
    ['ev_rutile_slurry', 1750], ['ev_filtered_coolant', 950], ['ev_clean_rinse', 850],
    ['iv_bonding_slurry', 1750], ['iv_ceramic_suspension', 1900],
    ['chilled_vacuum_coolant', 1100], ['warm_vacuum_coolant', 850],
    ['tungsten_leach_solution', 1350], ['spent_tungsten_leach', 1700],
    ['iv_photoresist', 2250], ['spent_iv_photoresist', 2600],
    ['niobium_leach_solution', 1550], ['spent_niobium_leach', 1900],
    ['spent_fusion_helium', 150], ['luv_optical_coolant', 900], ['luv_warm_optical_coolant', 780],
    ['titan_raw_condensate', 1350], ['titan_orbital_coolant', 820], ['titan_return_liquor', 1460],
    ['zpm_ceres_brine', 1200], ['zpm_spent_brine', 1350],
    ['zpm_europium_feed', 2200], ['zpm_europium_plasma', 90], ['zpm_americium_feed', 3100],
    ['uv_duranium_feed', 2700], ['uv_neutronium_feed', 3400],
    ['final_quench_mix', 2100], ['final_return_coolant', 2600]
  ]
  fluids.forEach(([id, viscosity]) => {
    event.create(id)
      .stillTexture('kubejs:block/' + id + '_still')
      .flowingTexture('kubejs:block/' + id + '_flow')
      .noBlock()
      .noBucket()
      .viscosity(viscosity)
  })
})
