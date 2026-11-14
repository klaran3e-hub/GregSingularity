StartupEvents.registry('item', event => {
  const parts = [
    'membrane_frame', 'sintered_membrane', 'membrane_cartridge', 'separation_manifold',
    'etched_collector', 'purge_adsorbent', 'recovered_collector', 'loop_witness',
    'reclamation_certificate'
  ]

  parts.forEach(name => {
    const id = 'reclaim_' + name
    event.create(id).texture('kubejs:item/' + id)
  })
})

StartupEvents.registry('fluid', event => {
  const fluids = [
    ['electrolyte', 1350],
    ['spent_electrolyte', 1900],
    ['permeate', 1150],
    ['recovered_electrolyte', 1250],
    ['brine', 2300],
    ['depleted_brine', 2050],
    ['recovered_acid', 1100]
  ]

  fluids.forEach(([name, viscosity]) => {
    const id = 'reclaim_' + name
    event.create(id)
      .stillTexture('kubejs:block/' + id + '_still')
      .flowingTexture('kubejs:block/' + id + '_flow')
      .noBlock()
      .noBucket()
      .viscosity(viscosity)
  })
})
