StartupEvents.registry('item', event => {
  for (const id of ['mv_coalescer', 'mv_saturated_coalescer', 'mv_impregnated_insulation']) {
    event.create(id).texture('kubejs:item/' + id)
  }
})
