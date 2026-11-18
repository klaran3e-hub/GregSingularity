if (Platform.isLoaded('gtxfa')) {
  ServerEvents.recipes(event => {
    const stageVoltage = { hv: 480, ev: 1920, iv: 7680, luv: 30720, zpm: 122880, uv: 491520 }
    const permit = stage => Item.of('kubejs:' + stage + '_commissioning_report')
    // In GTXFA 0.2.64, only the flower module is read by the apiary.
    const inactiveModules = new Set([
      'cooler_module', 'dryer_module', 'heater_module', 'humidifier_module',
      'lifespan_long_module', 'lifespan_short_module', 'light_module',
      'mutation_module', 'production_module', 'sky_module'
    ])

    // Comb processing follows the pack's Forestry unlock at HV and the material's GT era.
    const stages = {
      hv: 'air aluminium antimony bismuth black_dye blue_dye brass bronze brown_dye carbon certus_quartz chlorine coal cobalt copper cupronickel cyan_dye diesel drilling_fluid electrum ethylene fluorine gallium glowstone gold gray_dye green_dye heavy_fuel hydrogen invar iron lead light_blue_dye light_fuel light_gray_dye lime_dye lubricant magenta_dye magnalium manganese naphtha nickel nitric_acid nitrogen oil oilsand orange_dye phosphor pink_dye polyethylene polyvinyl_chloride purple_dye quartz red_dye rose_gold rubber silver slime soldering_alloy stainless_steel steam steel sterling_silver sulfur sulfuric_acid tin tin_alloy water white_dye yellow_dye zinc',
      ev: 'chrome epoxy helium kanthal molybdenum neon nichrome platinum polytetrafluoroethylene silicone_rubber styrene_butadiene_rubber titanium tungsten vanadium',
      iv: 'hss_g indium iridium osmiridium osmium palladium polyphenylene_sulfide reinforced_epoxy rhodium ruthenium thorium tungsten_carbide uranium',
      luv: 'hss_s naquadah plutonium polybenzimidazole',
      zpm: 'naquadah_alloy',
      uv: 'naquadria neutronium'
    }
    const stageOf = {}
    Object.keys(stages).forEach(stage => {
      stages[stage].split(' ').forEach(name => { stageOf[name] = stage })
    })

    // Centrifuges have two item inputs and one fluid input. For solid-only products, use
    // a sample of the existing resource in the second item slot and gate by machine voltage.
    const solidSamples = {
      carbon: 'gtceu:carbon_dust',
      certus_quartz: 'ae2:certus_quartz_crystal',
      coal: 'minecraft:coal',
      phosphor: 'gtceu:phosphorus_dust',
      quartz: 'minecraft:quartz',
      slime: 'minecraft:slime_ball',
      sulfur: 'gtceu:sulfur_dust'
    }
    const wax = 'forestry:beeswax'
    const honeyDrop = 'forestry:honey_drop'
    const honeyFluid = 'forestry:honey'
    // Vendor names use underscores in two materials that GregTech registers without them.
    const materialId = id => id.replace('hss_g', 'hssg').replace('hss_s', 'hsss')
    const addonRecipes = []
    event.forEachRecipe({ mod: 'gtxfa' }, recipe => {
      addonRecipes.push({ id: String(recipe.id), data: JSON.parse(String(recipe.json)) })
    })

    // Forestry's resource-bearing alternatives use FE and lack GT machine/permit requirements.
    addonRecipes.forEach(source => {
      if (source.data.type === 'forestry:centrifuge' &&
          (source.data.products || []).every(product => product.item === wax || product.item === honeyDrop)) return
      event.remove({ id: source.id })
    })

    let combs = 0
    let machines = 0
    addonRecipes.forEach(source => {
      var data = source.data
      var path = source.id.slice('gtxfa:'.length)
      if (path.startsWith('gtceu_centrifuge/')) {
        var combId = path.slice('gtceu_centrifuge/'.length).replace(/_comb$/, '')
        var stage = stageOf[combId]
        var primaryFluids = (data.outputs.fluid || []).filter(output => output.content.value !== honeyFluid)
        if (!stage || primaryFluids.length > 1 || (primaryFluids.length === 0 && !solidSamples[combId])) {
          throw new Error('GTXFA comb missing an explicit resource gate: ' + source.id)
        }

        var recipe = event.recipes.gtceu.centrifuge(source.id)
          .duration(data.duration).EUt(stageVoltage[stage])
        data.inputs.item.forEach(input => recipe.itemInputs(Item.of(input.content.item, input.count || 1)))
        if (primaryFluids.length === 1) {
          recipe.notConsumable(permit(stage))
            .notConsumableFluid(Fluid.of(materialId(primaryFluids[0].content.value), 100))
        } else {
          recipe.notConsumable(Item.of(solidSamples[combId]))
        }
        ;(data.outputs.item || []).forEach(output => {
          var stack = Item.of(materialId(output.content.item), output.count || 1)
          if (output.chance === undefined || output.chance === 10000) {
            recipe.itemOutputs(stack)
          } else {
            recipe.chancedOutput(stack, output.chance, output.tierChanceBoost || 0)
          }
        })
        ;(data.outputs.fluid || []).forEach(output => {
          recipe.outputFluids(Fluid.of(materialId(output.content.value), output.amount || output.content.amount))
        })
        combs++
      } else if (data.type === 'minecraft:crafting_shaped') {
        var apiary = /^(lv|mv|hv|ev|iv|luv|zpm|uv)_electric_apiary$/.exec(path)
        if (!apiary && !path.endsWith('_module')) {
          throw new Error('Unexpected GTXFA crafting recipe: ' + source.id)
        }
        if (inactiveModules.has(path)) return
        var tier = apiary ? apiary[1] : 'ev'
        var stage = stageVoltage[tier] ? tier : 'hv'
        var counts = {}
        data.pattern.forEach(row => {
          Array.from(row).forEach(key => {
            if (key !== ' ') counts[key] = (counts[key] || 0) + 1
          })
        })
        var recipe = event.recipes.gtceu.assembler(source.id)
          .duration(apiary ? 2000 : 800).EUt(stageVoltage[stage])
          .notConsumable(permit(stage))
          .inputFluids(Fluid.of('gtceu:lubricant', apiary ? 900 : 250))
        Object.keys(counts).forEach(key => {
          var ingredient = data.key[key]
          var ref = ingredient.tag ? '#' + ingredient.tag : ingredient.item
          recipe.itemInputs(counts[key] + 'x ' + ref)
        })
        recipe.itemOutputs(Item.of(data.result.item, data.result.count || 1))
        machines++
      } else if (data.type === 'gtceu:assembler' || data.type === 'gtceu:circuit_assembler') {
        var recipeType = data.type.slice('gtceu:'.length)
        var recipe = event.recipes.gtceu[recipeType](source.id)
          .duration(data.duration).EUt(stageVoltage.hv).notConsumable(permit('hv'))
        data.inputs.item.forEach(input => {
          var ref = input.content.tag ? '#' + input.content.tag : input.content.item
          recipe.itemInputs((input.count || 1) + 'x ' + ref)
        })
        ;(data.inputs.fluid || []).forEach(input => {
          recipe.inputFluids(Fluid.of(input.content.value, input.amount || input.content.amount))
        })
        data.outputs.item.forEach(output => {
          recipe.itemOutputs(Item.of(materialId(output.content.item), output.count || 1))
        })
        machines++
      }
    })
    console.info('[GTIBD GTXFA] gated ' + combs + ' comb/refining recipes and ' + machines + ' apiary, module and tool recipes')
  })
}


