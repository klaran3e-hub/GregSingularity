ServerEvents.recipes(event => {
  // The field forging saddle handles the first plates; GregTech machines handle the remaining forms.
  event.remove({ id: /^gtceu:shaped\/(?:plate_|foil_|[a-z0-9_]+_wire_single$)/ })
  event.remove({ id: /^gtceu:shapeless\/fine_wire_[a-z0-9_]+$/ })

  // The LV autoclave needs these before the stock MV bender recipe becomes available.
  event.recipes.gtceu.forming_press('zero_shift:lv_metallurgy/double_steel_plate')
    .itemInputs('2x gtceu:steel_plate').itemOutputs('gtceu:double_steel_plate')
    .duration(360).EUt(28)

  const obsoleteCompositions = [
    'lv_machine_casing', 'lv_machine_hull', 'lv_electric_furnace', 'lv_electric_piston', 'lv_voltage_coil',
    'mv_diode', 'mv_voltage_coil',
    'hv_alloy_smelter', 'hv_electric_furnace', 'hv_extruder', 'hv_fluid_drilling_rig', 'hv_thermal_centrifuge',
    'ev_alloy_smelter', 'ev_electric_furnace', 'ev_electrolyzer', 'ev_emitter',
    'ev_extruder', 'ev_fluid_drilling_rig', 'ev_laser_engraver', 'ev_scanner', 'ev_sensor', 'ev_thermal_centrifuge',
    'ev_voltage_coil', 'ev_world_accelerator',
    'ev_energy_input_hatch', 'ev_energy_input_hatch_4a', 'ev_energy_input_hatch_16a',
    'ev_energy_output_hatch', 'ev_energy_output_hatch_4a', 'ev_energy_output_hatch_16a',
    'ev_substation_input_hatch_64a', 'ev_substation_output_hatch_64a',
    'ev_transformer_1a', 'ev_transformer_2a', 'ev_transformer_4a', 'ev_transformer_16a',
    'iv_rotor_holder', 'iv_substation_input_hatch_64a', 'iv_substation_output_hatch_64a'
  ]
  const materialData = Java.loadClass('com.gregtechceu.gtceu.api.data.chemical.material.ItemMaterialData')
  const materialKeys = Java.loadClass('java.util.Map').__javaObject__.getMethod('keySet', [])
  const discardedItems = new (Java.loadClass('java.util.HashSet'))()
  // The custom grinder routes use these exact inputs. Keep the hay and polished basalt routes.
  ;['minecraft:basalt', 'minecraft:wheat'].forEach(id => {
    const rawMaterial = Item.of(id).getItem()
    discardedItems.add(rawMaterial)
    materialData.clearMaterialInfo(rawMaterial)
  })
  obsoleteCompositions.forEach(name => {
    const item = Item.of('gtceu:' + name).getItem()
    discardedItems.add(item)
    materialData.clearMaterialInfo(item)
    event.remove({ id: 'gtceu:arc_furnace/arc_' + name })
    event.remove({ id: 'gtceu:macerator/macerate_' + name })
    event.remove({ id: 'gtceu:extractor/extract_' + name })
  })
  // Native recycling is regenerated after this event from both resolved and pending material info.
  materialKeys.invoke(materialData.UNRESOLVED_ITEM_MATERIAL_INFO, [])
    .removeIf(stack => discardedItems.contains(stack.getItem()))
})
