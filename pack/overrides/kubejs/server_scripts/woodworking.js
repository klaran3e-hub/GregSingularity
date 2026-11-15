ServerEvents.recipes(event => {
  const knife = 'gtceu:flint_knife'
  const joint = 'kubejs:wooden_joint'
  const peg = 'kubejs:wooden_peg'
  const hinge = 'kubejs:iron_hinge'
  const binding = 'kubejs:tool_binding'
  const woods = ['oak', 'spruce', 'birch', 'jungle', 'acacia', 'dark_oak', 'mangrove', 'cherry', 'bamboo', 'crimson', 'warped']

  function replace(item, count, pattern, keys) {
    event.remove({ output: 'minecraft:' + item })
    return event.shaped(count + 'x minecraft:' + item, pattern, keys).id('zero_shift:wood/' + item)
  }

  event.shaped(joint, ['PKP', 'GBF', 'PKP'], {
    P: '#minecraft:planks', K: peg, G: knife, B: binding, F: 'kubejs:fibre_cord'
  }).id('zero_shift:wood/joint').damageIngredient(knife)
  event.shaped(hinge, ['PRP', ' S ', ' H '], {
    P: 'kubejs:hand_forged_plate', R: 'kubejs:iron_rivet', S: 'kubejs:copper_strap', H: 'gtceu:flint_hammer'
  }).id('zero_shift:wood/hinge').damageIngredient('gtceu:flint_hammer')
  replace('bamboo_block', 1, ['BBB', 'BFB', 'BBB'], { B: 'minecraft:bamboo', F: binding })

  woods.forEach(wood => {
    const planks = 'minecraft:' + wood + '_planks'
    const slab = 'minecraft:' + wood + '_slab'
    replace(wood + '_slab', 1, ['PPP', ' J '], { P: planks, J: peg })
    replace(wood + '_stairs', 2, ['P J', 'PPJ', 'PPP'], { P: planks, J: joint })
    replace(wood + '_fence', 2, ['PJP', 'HSH', 'PJP'], { P: planks, J: joint, H: peg, S: 'minecraft:stick' })
    replace(wood + '_fence_gate', 1, ['JPJ', 'HPH', 'S S'], { J: joint, P: planks, H: hinge, S: 'minecraft:stick' })
    replace(wood + '_door', 1, ['PPJ', 'HPH', 'PPJ'], { P: planks, J: joint, H: hinge })
    replace(wood + '_trapdoor', 1, ['PPP', 'HJH', 'PPP'], { P: planks, J: joint, H: hinge })
    replace(wood + '_pressure_plate', 1, ['SSS', 'PBP'], { S: slab, P: peg, B: binding })
    replace(wood + '_button', 1, ['KS', 'P '], { K: knife, S: slab, P: peg }).damageIngredient(knife)
    replace(wood + '_sign', 1, ['PPJ', 'PPJ', ' S '], { P: planks, J: joint, S: 'minecraft:stick' })
    replace(wood + '_hanging_sign', 1, ['C C', 'JSJ', 'PPP'], {
      C: 'minecraft:chain', J: joint, S: 'minecraft:' + wood + '_sign', P: planks
    })

    if (wood === 'crimson' || wood === 'warped') return
    const boat = wood === 'bamboo' ? 'bamboo_raft' : wood + '_boat'
    const chestBoat = wood === 'bamboo' ? 'bamboo_chest_raft' : wood + '_chest_boat'
    replace(boat, 1, ['JHJ', 'PBP', 'PPP'], {
      J: joint, H: 'kubejs:tool_handle', P: planks, B: binding
    })
    replace(chestBoat, 1, ['JHJ', 'BCB', ' B '], {
      J: joint, H: hinge, B: 'minecraft:' + boat, C: 'minecraft:chest'
    })
  })
  replace('bamboo_mosaic', 1, ['SS', 'JP'], { S: 'minecraft:bamboo_slab', J: joint, P: peg })
  replace('bamboo_mosaic_slab', 1, ['MMM', ' P '], { M: 'minecraft:bamboo_mosaic', P: peg })
  replace('bamboo_mosaic_stairs', 2, ['M J', 'MMJ', 'MMM'], { M: 'minecraft:bamboo_mosaic', J: joint })
})
