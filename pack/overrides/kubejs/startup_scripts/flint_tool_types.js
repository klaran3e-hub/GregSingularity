GTCEuStartupEvents.materialModification(() => {
  const Materials = Java.loadClass('com.gregtechceu.gtceu.common.data.GTMaterials')
  const PropertyKey = Java.loadClass('com.gregtechceu.gtceu.api.data.chemical.material.properties.PropertyKey')
  const ToolType = Java.loadClass('com.gregtechceu.gtceu.api.item.tool.GTToolType')
  Materials.Flint.getProperty(PropertyKey.TOOL).addTypes(ToolType.SAW, ToolType.HARD_HAMMER)
})
