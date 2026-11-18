if (Platform.isLoaded('gtibdcrops')) {
  ServerEvents.recipes(event => {
    const cropMod = 'gtibdcrops:'
    const prefix = 'zero_shift:gregcrops/'
    const voltage = [0, 28, 112, 448, 1792, 7168, 28672, 114688, 458752]
    const crops = Java.loadClass('gtibd.crops.CropCatalog').ALL

    event.remove({ id: /^gtibdcrops:standalone\// })

    event.shaped('4x ' + cropMod + 'crop_sticks', ['SPS', ' F ', 'S S'], {
      S: 'minecraft:stick', P: 'kubejs:wooden_peg', F: 'kubejs:fibre_cord'
    }).id(prefix + 'crop_sticks')
    event.shaped(cropMod + 'pruning_knife', [' PP', ' LP', 'H  '], {
      P: 'gtceu:iron_plate', L: 'kubejs:tool_binding', H: 'kubejs:tool_handle'
    }).id(prefix + 'pruning_knife')
    event.recipes.gtceu.assembler(prefix + 'crop_analyzer')
      .itemInputs('gtceu:lv_sensor', 'gtceu:basic_electronic_circuit', '2x minecraft:glass_pane',
        '2x gtceu:tin_plate', '2x kubejs:pressed_insulation')
      .inputFluids(Fluid.of('gtceu:soldering_alloy', 144))
      .itemOutputs(cropMod + 'crop_analyzer').duration(840).EUt(28)
    event.recipes.gtceu.assembler(prefix + 'lv_crop_harvester')
      .itemInputs('gtceu:lv_machine_hull', '2x gtceu:lv_electric_motor', 'gtceu:lv_sensor',
        '2x gtceu:lv_conveyor_module', 'gtceu:lv_robot_arm', '2x gtceu:basic_electronic_circuit',
        '4x gtceu:steel_plate', '4x ' + cropMod + 'crop_sticks')
      .inputFluids(Fluid.of('immersiveengineering:creosote', 500))
      .itemOutputs(cropMod + 'lv_crop_harvester').duration(1800).EUt(28)

    crops.forEach(crop => {
      const tier = Number(crop.tier())
      if (!tier) return
      const output = crop.output()
      const recipe = event.recipes.gtceu.centrifuge(prefix + 'extract/' + crop.id())
        .itemInputs('3x ' + cropMod + crop.id() + '_harvest')
        .notConsumable(Item.of(String(output.sampleItem())))
        .duration(240 + tier * 100).EUt(voltage[tier])
      if (output.fluid()) {
        const fluid = String(output.id())
        recipe.notConsumableFluid(Fluid.of(fluid, 1000))
        recipe.outputFluids(Fluid.of(fluid, Number(output.amount())))
      } else {
        recipe.itemOutputs(Item.of(String(output.id()), Number(output.amount())))
      }
    })
  })
}
