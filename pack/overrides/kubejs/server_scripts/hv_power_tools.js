ServerEvents.recipes(event => {
  const items = Java.loadClass('net.minecraftforge.registries.ForgeRegistries').ITEMS
  const Id = Java.loadClass('net.minecraft.resources.ResourceLocation')
  const toolFamilies = {
    drill: ['gtceu:hv_electric_piston', 'kubejs:grinding_runner'],
    chainsaw: ['kubejs:balanced_rail_axle', 'kubejs:saw_blade'],
    wrench: ['gtceu:hv_robot_arm', 'gtceu:mv_robot_arm'],
    screwdriver: ['kubejs:hv_switch_contact', 'gtceu:rod_extruder_mold'],
    wire_cutter: ['kubejs:hv_arc_shield', 'gtceu:wire_extruder_mold']
  }
  const hvTool = /^gtceu:hv_(.+)_(drill|chainsaw|wrench|screwdriver|wire_cutter)$/
  const tools = []

  items.getKeys().forEach(key => {
    const output = String(key)
    const match = output.match(hvTool)
    if (!match) return
    const material = match[1]
    const family = match[2]
    const suffix = material + '_' + family
    const previous = 'gtceu:' + (family === 'drill' ? 'mv_' : 'lv_') + suffix
    const older = 'gtceu:lv_' + suffix
    const donor = items.containsKey(new Id(previous)) ? previous : older
    if (!items.containsKey(new Id(donor))) {
      console.warn('No lower-tier tool for ' + output)
      return
    }
    tools.push({ output: output, suffix: suffix, family: family, donor: donor })
  })

  if (tools.length > 0) {
    event.remove(tools.map(tool => ({ output: tool.output })))
  }
  tools.forEach(tool => {
    const recipe = event.recipes.gtceu.assembler('zero_shift:hv_tools/' + tool.suffix)
    const components = [tool.donor, 'gtceu:hv_power_unit'].concat(toolFamilies[tool.family], [
      '2x gtceu:stainless_steel_plate', '2x kubejs:chemical_grade_seal',
      'gtceu:advanced_integrated_circuit', '2x pneumaticcraft:reinforced_pressure_tube'
    ])
    components.forEach(component => recipe.itemInputs(component))
    recipe.inputFluids(Fluid.of('gtceu:lubricant', 850))
      .itemOutputs(Item.of(tool.output, '{MaxCharge:1800000L}')).duration(1760).EUt(384)
  })
  console.info('GregSingularity Core HV power tools: ' + tools.length)
})
