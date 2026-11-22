ServerEvents.recipes(event => {
  const items = Java.loadClass('net.minecraftforge.registries.ForgeRegistries').ITEMS
  const Id = Java.loadClass('net.minecraft.resources.ResourceLocation')
  const families = {
    drill: 'gtceu:ev_electric_piston',
    jackhammer: 'gtceu:ev_electric_piston',
    chainsaw: 'gtceu:gregsingularity_ev_traction_coil',
    wrench: 'gtceu:ev_robot_arm',
    screwdriver: 'gtceu:gregsingularity_ev_phase_relay',
    wire_cutter: 'gtceu:gregsingularity_ev_harness'
  }
  const pattern = /^gtceu:ev_(.+)_(drill|jackhammer|chainsaw|wrench|screwdriver|wire_cutter)$/
  const tools = []
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
    tools.push({ output: output, suffix: suffix, family: family, donor: donor })
  })

  if (tools.length > 0) {
    event.remove(tools.map(tool => ({ output: tool.output })))
  }
  tools.forEach(tool => {
    const recipe = event.recipes.gtceu.assembler('zero_shift:ev_tools/' + tool.suffix)
    const components = [
      tool.donor, 'gtceu:ev_power_unit', families[tool.family], 'gtceu:gold_single_cable',
      '4x gtceu:titanium_plate', '3x gtceu:gregsingularity_vacuum_gasket', '2x gtceu:micro_processor_computer',
      'pneumaticcraft:reinforced_pressure_tube'
    ]
    components.forEach(component => recipe.itemInputs(component))
    recipe.inputFluids(Fluid.of('gtceu:lubricant', 1150))
      .itemOutputs(Item.of(tool.output, '{MaxCharge:10240000L}')).duration(2180).EUt(1536)
  })
  console.info('GregSingularity Core EV power tools: ' + tools.length)
})
