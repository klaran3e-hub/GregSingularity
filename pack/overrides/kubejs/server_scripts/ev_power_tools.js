ServerEvents.recipes(event => {
  const items = Java.loadClass('net.minecraftforge.registries.ForgeRegistries').ITEMS
  const Id = Java.loadClass('net.minecraft.resources.ResourceLocation')
  const families = {
    drill: 'gtceu:ev_electric_piston',
    jackhammer: 'gtceu:ev_electric_piston',
    chainsaw: 'kubejs:ev_traction_coil',
    wrench: 'gtceu:ev_robot_arm',
    screwdriver: 'kubejs:ev_phase_relay',
    wire_cutter: 'kubejs:ev_harness'
  }
  const pattern = /^gtceu:ev_(.+)_(drill|jackhammer|chainsaw|wrench|screwdriver|wire_cutter)$/
  let count = 0
  items.getKeys().forEach(key => {
    const output = String(key)
    const match = output.match(pattern)
    if (!match) return
    const material = match[1]
    const family = match[2]
    const suffix = material + '_' + family
    const predecessors = ['gtceu:hv_' + suffix, 'gtceu:hv_' + material + '_drill', 'gtceu:lv_' + suffix]
    const donor = predecessors.find(id => items.containsKey(new Id(id)))
    if (!donor) {
      console.warn('No lower-tier tool for ' + output)
      return
    }
    event.remove({ output: output })
    const recipe = event.recipes.gtceu.assembler('zero_shift:ev_tools/' + suffix)
    const components = [
      donor, 'gtceu:ev_power_unit', families[family], 'immersiveengineering:connector_hv',
      '4x gtceu:titanium_plate', '3x kubejs:vacuum_gasket', '2x gtceu:micro_processor_computer',
      'pneumaticcraft:reinforced_pressure_tube'
    ]
    components.forEach(component => recipe.itemInputs(component))
    recipe.inputFluids(Fluid.of('gtceu:lubricant', 1150))
      .itemOutputs(Item.of(output, '{MaxCharge:10240000L}')).duration(2180).EUt(1536)
    count++
  })
  console.info('GTIBD Addon EV power tools: ' + count)
})
