StartupEvents.registry('item', event => {
  const parts = [
    'end_heavy_concentrate', 'nether_isotope_salt', 'europium_target', 'laminate_preform', 'neutron_laminate',
    'flux_busbar', 'phase_module', 'coil_cartridge', 'reactor_standard', 'isotope_capsule',
    'shielded_cask', 'irradiated_cask', 'hot_americium_coupon', 'americium_coupon',
    'reserve_switchgear', 'freight_certificate', 'americium_acceptance_crate', 'commissioning_report',
    'glacio_lamella', 'europa_membrane', 'europa_reticle', 'preload_frame', 'tempered_frame', 'europa_datum',
    'die_cartridge', 'storage_backplane'
  ]
  parts.forEach(name => {
    const id = 'zpm_' + name
    event.create(id).texture('kubejs:item/' + id)
  })
})
