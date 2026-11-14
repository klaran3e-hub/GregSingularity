StartupEvents.registry('fluid', event => {
  event.create('washed_crude')
    .stillTexture('kubejs:block/washed_crude_still')
    .flowingTexture('kubejs:block/washed_crude_flow')
    .noBlock()
    .noBucket()
    .viscosity(1800)

  const fluids = [
    ['end_atmosphere', 200], ['vacuum_shield_gas', 100],
    ['chilled_vacuum_coolant', 1100], ['warm_vacuum_coolant', 850],
    ['tungsten_leach_solution', 1350], ['spent_tungsten_leach', 1700],
    ['iv_photoresist', 2250], ['spent_iv_photoresist', 2600],
    ['niobium_leach_solution', 1550], ['spent_niobium_leach', 1900],
    ['spent_fusion_helium', 150],
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
