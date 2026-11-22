ServerEvents.recipes(event => {
  const forestry = name => 'forestry:' + name
  const gt = name => 'gtceu:' + name
  const ks = name => global.gsItemId(name)
  const prefix = 'zero_shift:forestry/farm/'
  const circuit = gt('basic_electronic_circuit')
  const hull = gt('lv_machine_hull')
  const motor = gt('lv_electric_motor')
  const joint = ks('wooden_joint')
  const insulation = ks('pressed_insulation')

  function assemble(id, count, inputs, ticks, water) {
    const recipe = event.recipes.gtceu.assembler(prefix + id)
    inputs.forEach(input => recipe.itemInputs(input))
    recipe.itemOutputs(Item.of(forestry(id), count)).duration(ticks).EUt(28)
    recipe.inputFluids(Fluid.of('minecraft:water', water))
  }

  const facades = {
    brick: 'bricks',
    brick_chiseled: 'chiseled_stone_bricks',
    brick_nether: 'nether_bricks',
    cracked_stone_brick: 'cracked_stone_bricks',
    cut_sandstone: 'cut_sandstone',
    mossy_stone_brick: 'mossy_stone_bricks',
    quartz: 'quartz_block',
    quartz_chiseled: 'chiseled_quartz_block',
    quartz_lines: 'quartz_pillar',
    sandstone_chiseled: 'chiseled_sandstone',
    stone_brick: 'stone_bricks'
  }

  Object.entries(facades).forEach(([facade, masonry]) => {
    const plain = forestry('farm_plain_' + facade)
    event.remove({ id: plain })
    assemble('farm_plain_' + facade, 4, ['4x minecraft:' + masonry, '4x ' + gt('bronze_plate'),
      '4x #minecraft:wooden_slabs', '4x ' + joint, '2x ' + insulation], 360, 250)

    const fittings = {
      gearbox: [hull, '2x ' + motor, '2x ' + gt('small_bronze_gear'), '2x ' + ks('shaft_bushing')],
      valve: [gt('lv_electric_pump'), '2x ' + gt('bronze_small_fluid_pipe'), '2x ' + insulation],
      hatch: [gt('lv_conveyor_module'), '2x ' + ks('iron_hinge'), '2x ' + gt('iron_plate')],
      control: [circuit, '2x ' + ks('copper_contact_strip'), '2x minecraft:redstone', '2x ' + insulation]
    }
    Object.entries(fittings).forEach(([kind, inputs]) => {
      const id = 'farm_' + kind + '_' + facade
      event.remove({ id: forestry(id) })
      assemble(id, 1, [plain].concat(inputs), 560, 500)
    })
  })

  event.remove({ id: forestry('arboretum_managed') })
  assemble('arboretum_managed', 1, [hull, '2x ' + circuit, '2x ' + motor, forestry('farm_gearbox_brick'),
    forestry('farm_hatch_brick'), forestry('farm_valve_brick'), '4x minecraft:glass_pane', '4x ' + joint], 1800, 1500)

  for (const name of ['fertilizer_apatite', 'fertilizer_ash', 'humus_compost', 'humus_fertilizer', 'carpenter/humus']) {
    event.remove({ id: forestry(name) })
  }
  assemble('fertilizer_compound', 8, ['2x #forge:gems/apatite', '4x #forge:dusts/ash',
    '4x #minecraft:sand'], 240, 500)
  assemble('humus', 8, ['8x minecraft:dirt', '2x ' + forestry('fertilizer_compound'),
    '2x #minecraft:leaves'], 240, 500)
})
