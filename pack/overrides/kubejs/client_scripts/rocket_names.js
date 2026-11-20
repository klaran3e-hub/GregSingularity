// Keep the Roman fleet numbers when Ad Astra and the pack both supply a display name.
function numberAdAstraRockets(event, russian) {
  const tiers = ['I', 'II', 'III', 'IV']
  tiers.forEach((roman, index) => {
    const suffix = '.ad_astra.tier_' + (index + 1) + '_rocket'
    const name = russian ? 'Ракета Tier ' + roman : 'Tier ' + roman + ' Rocket'
    event.add('ad_astra', 'item' + suffix, name)
    event.add('ad_astra', 'entity' + suffix, name)
  })
}

ClientEvents.lang('en_us', event => numberAdAstraRockets(event, false))
ClientEvents.lang('ru_ru', event => numberAdAstraRockets(event, true))
