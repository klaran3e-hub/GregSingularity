if (Platform.isLoaded('gtxfa')) {
  JEIEvents.hideItems(event => {
    // The pinned GTXFA version registers these modules without applying their effects.
    const inactiveModules = [
      'cooler_module', 'dryer_module', 'heater_module', 'humidifier_module',
      'lifespan_long_module', 'lifespan_short_module', 'light_module',
      'mutation_module', 'production_module', 'sky_module'
    ]
    inactiveModules.forEach(module => event.hide('gtxfa:' + module))
  })
}
