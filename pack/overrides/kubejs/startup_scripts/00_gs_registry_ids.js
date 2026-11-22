// priority: 1000
const GsRegistryMigration = Java.loadClass('gtibd.addon.RegistryMigration')
global.gsRegistryId = id => String(GsRegistryMigration.destination(String(id)))
global.gsItemId = path => global.gsRegistryId('kubejs:' + path)
