if (Platform.isLoaded('gtibdcrops')) {
  ServerEvents.recipes(event => {
    const crop = id => 'gtibdcrops:' + id
    const id = path => 'zero_shift:gregcrops/' + path
    const frame = 'kubejs:pressed_steel_frame'
    for (const name of ['crop_stick', 'crop_analyzer', 'weeding_trowel']) event.remove({ output: crop(name) })
    event.shaped('4x ' + crop('crop_stick'), ['SPS', ' F ', 'SJS'], {
      S:'minecraft:stick', P:'kubejs:wooden_peg', F:'kubejs:fibre_cord', J:frame
    }).keepIngredient(frame).id(id('crop_sticks'))
    event.shaped(crop('weeding_trowel'), [' PP',' LP','H  '], {
      P:'gtceu:iron_plate', L:'kubejs:tool_binding', H:'kubejs:tool_handle'
    }).id(id('weeding_trowel'))
    event.recipes.gtceu.assembler(id('crop_analyzer')).itemInputs('gtceu:lv_sensor', 'gtceu:basic_electronic_circuit',
      '2x minecraft:glass_pane','2x gtceu:tin_plate','2x kubejs:pressed_insulation')
      .inputFluids(Fluid.of('gtceu:soldering_alloy',144)).itemOutputs(crop('crop_analyzer')).duration(840).EUt(28)
    const tiers = ['lv','mv','hv','ev','iv','luv','zpm','uv']
    const voltages = [28,112,448,1792,7168,28672,114688,458752]
    tiers.forEach((tier,index) => {
      const manager = crop(tier + '_crop_manager')
      event.remove({output:manager})
      const machine = event.recipes.gtceu.assembler(id(tier + '_crop_manager'))
        .itemInputs('gtceu:' + tier + '_machine_hull','2x gtceu:' + tier + '_electric_motor',
          'gtceu:' + tier + '_sensor','2x gtceu:' + tier + '_conveyor_module','gtceu:' + tier + '_robot_arm',
          '#gtceu:circuits/' + tier,'4x ' + crop('crop_stick'))
      if (index) machine.itemInputs(crop(tiers[index-1] + '_crop_manager'))
      machine.inputFluids(Fluid.of(index ? 'gtceu:soldering_alloy' : 'gtceu:creosote',index ? 144 * index : 500))
        .itemOutputs(manager).duration(1000 + index * 200).EUt(voltages[index])
    })
    const minimumVoltage = {
      coppon:112, tine:112, ferru:112, plumbilia:112, argentia:112, aurelia:112, zinc:112, nickel:112,
      bauxite:448, manganese:448, mica:448, bobs_yer_uncle_ranks:448, oil_berry:112,
      ilmenite:1792, pitchblende:1792, uraninite:1792, thorium:1792, scheelite:1792,
      platinum:7168, iridium:28672, osmium:28672, naquadah:458752, uumberry:458752
    }
    const hydrated = []
    event.forEachRecipe({mod: 'gtibdcrops', id: /^gtibdcrops:gt\/(?:chemical|autoclave|extractor)\/crop_drop_/}, recipe => {
      hydrated.push({id: String(recipe.id), data: JSON.parse(String(recipe.json))})
    })
    const stack = entry => {
      const content = entry.content
      return Item.of((content.ingredient || content).item, content.count || 1)
    }
    const fluid = entry => Fluid.of(entry.content.value.fluid, entry.content.amount)
    hydrated.forEach(source => {
      const data = source.data
      const feed = data.inputs.item[0].content
      const name = String((feed.ingredient || feed).item).replace('gtibdcrops:crop_drop_', '')
      const energy = Math.max(data.tickInputs.eu[0].content, minimumVoltage[name] || 0)
      event.remove({id: source.id})
      const machine = event.recipes.gtceu[data.type.slice('gtceu:'.length)](source.id)
        .duration(data.duration).EUt(energy)
      data.inputs.item.forEach(entry => machine.itemInputs(stack(entry)))
      ;(data.inputs.fluid || []).forEach(entry => machine.inputFluids(fluid(entry)))
      ;(data.outputs.item || []).forEach(entry => machine.itemOutputs(stack(entry)))
      ;(data.outputs.fluid || []).forEach(entry => machine.outputFluids(fluid(entry)))
    })
  })
}
