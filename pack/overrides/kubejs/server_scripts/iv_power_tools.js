ServerEvents.recipes(event => {
  const items = Java.loadClass('net.minecraftforge.registries.ForgeRegistries').ITEMS
  const Id = Java.loadClass('net.minecraft.resources.ResourceLocation')
  const parts = {
    drill: 'gtceu:iv_electric_piston',
    jackhammer: 'gtceu:iv_electric_piston',
    chainsaw: 'kubejs:iv_servo_core',
    wrench: 'gtceu:iv_robot_arm',
    screwdriver: 'kubejs:iv_switch_stack',
    wire_cutter: 'kubejs:iv_busbar_blank'
  }
  const pattern = /^gtceu:iv_(.+)_(drill|jackhammer|chainsaw|wrench|screwdriver|wire_cutter)$/
  const tools = []
  items.getKeys().forEach(key => {
    const output = String(key)
    const match = output.match(pattern)
    if (!match) return
    const suffix = match[1] + '_' + match[2]
    const predecessors = ['gtceu:ev_' + suffix, 'gtceu:ev_' + match[1] + '_drill', 'gtceu:hv_' + suffix]
    const donor = predecessors.find(id => items.containsKey(new Id(id)))
    if (!donor) {
      console.warn('No lower-tier tool for ' + output)
      return
    }
    tools.push({ output: output, suffix: suffix, family: match[2], donor: donor })
  })

  if (tools.length > 0) {
    event.remove(tools.map(tool => ({ output: tool.output })))
  }
  tools.forEach(tool => {
    const recipe = event.recipes.gtceu.assembler('zero_shift:iv_tools/' + tool.suffix)
    const components = [
      tool.donor, 'gtceu:iv_power_unit', parts[tool.family], 'gtceu:gold_single_cable',
      '4x gtceu:tungsten_steel_plate', '3x kubejs:vacuum_gasket', '2x gtceu:micro_processor_mainframe',
      'pneumaticcraft:regulator_tube_module'
    ]
    components.forEach(component => recipe.itemInputs(component))
    recipe.inputFluids(Fluid.of('gtceu:lubricant', 1400))
      .itemOutputs(Item.of(tool.output, '{MaxCharge:40960000L}')).duration(2960).EUt(6144)
  })
  console.info('GregSingularity Core IV power tools: ' + tools.length)
})
