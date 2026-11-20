ServerEvents.recipes(event => {
  const d = name => 'storagedrawers:' + name
  const gt = name => 'gtceu:' + name
  const ks = name => 'kubejs:' + name
  const prefix = 'zero_shift:drawers/'
  const rivet = ks('iron_rivet')
  const blank = ks('drawer_runner_blank')
  const slide = ks('drawer_slide')
  const carrier = ks('drawer_cartridge')
  const selector = ks('drawer_selector')
  const peg = ks('wooden_peg')
  const hinge = ks('iron_hinge')
  const frame = ks('pressed_steel_frame')
  const seal = ks('chemical_grade_seal')
  const lv = gt('basic_electronic_circuit')
  const mv = gt('good_electronic_circuit')
  const hv = gt('advanced_integrated_circuit')
  const template = d('upgrade_template')
  const oak = d('oak_full_drawers_1')

  for (const type of ['crafting_shaped', 'crafting_shapeless']) {
    event.remove({ mod: 'storagedrawers', type: 'minecraft:' + type })
  }

  function shaped(id, output, rows, keys) {
    event.shaped(output, rows, keys).id(prefix + id)
  }
  function assemble(id, items, power, ticks) {
    const recipe = event.recipes.gtceu.assembler(prefix + id)
    items.forEach(item => recipe.itemInputs(item))
    return recipe.itemOutputs(d(id)).EUt(power).duration(ticks)
  }

  shaped('runner_blank', blank, ['IRI', 'ABA', 'IRI'], {
    I: ks('hand_forged_plate'), R: rivet, A: ks('abrasive_paste'), B: ks('shaft_bushing')
  })
  global.fieldworkProcess(event, prefix + 'press_slides', 'forge_hammer', { ingredients: [{ item: blank }], results: [{ item: slide, count: 2 }]
  }, 4)
  shaped('cartridge', carrier, ['PSP', 'FCF', 'PHP'], {
    P: peg, S: slide, F: '#minecraft:planks', C: ks('fibre_cord'), H: hinge
  })

  const woods = ['oak', 'spruce', 'birch', 'jungle', 'acacia', 'dark_oak', 'mangrove', 'cherry', 'bamboo', 'crimson', 'warped']
  const layouts = [
    ['1', ['WSW', 'PCP', 'WHW']],
    ['2', ['WCW', 'SPS', 'WHW']],
    ['4', ['CWC', 'SPS', 'HWH']]
  ]
  woods.forEach(wood => {
    ;[['full', '_planks'], ['half', '_slab']].forEach(([size, panel]) => {
      layouts.forEach(([compartments, pattern]) => {
        const id = wood + '_' + size + '_drawers_' + compartments
        shaped(id, d(id), pattern, { W: 'minecraft:' + wood + panel, P: peg, S: slide, C: carrier, H: hinge })
      })
    })
    shaped(wood + '_trim', '2x ' + d(wood + '_trim'), ['WPW', 'RCR', 'WPW'], {
      W: 'minecraft:' + wood + '_planks', P: peg, R: rivet, C: ks('fibre_cord')
    })
  })

  shaped('upgrade_template', template, ['SPS', 'RCR', 'SPS'], { S: slide, P: peg, R: rivet, C: carrier })
  shaped('drawer_key', d('drawer_key'), [' GR', ' AS', 'P  '], {
    G: gt('brass_plate'), R: rivet, A: ks('abrasive_paste'), S: slide, P: ks('tool_handle')
  })
  shaped('framing_table', d('framing_table'), ['BWB', 'SCS', 'RFR'], {
    B: ks('saw_blade'), W: oak, S: slide, C: carrier, R: rivet, F: ks('workbench_frame')
  })
  assemble('detached_drawer', [oak, '2x ' + carrier, slide, template, hinge, gt('bronze_plate')], 24, 360)
  assemble('drawer_puller', [d('drawer_key'), '2x ' + slide, hinge, gt('lv_electric_motor'), gt('steel_plate')], 24, 340)
  const keys = [
    ['quantify_key', ks('copper_contact_strip')], ['shroud_key', ks('pressed_insulation')],
    ['priority_key', lv], ['suspend_key', gt('lv_conveyor_module')], ['connection_key', gt('lv_electric_motor')],
    ['personal_key', ks('sealed_mv_module')], ['keybutton_drawer', d('drawer_key')],
    ['keybutton_concealment', d('shroud_key')], ['keybutton_quantify', d('quantify_key')]
  ]
  keys.forEach(([id, part]) => assemble(id, [d('drawer_key'), template, part, '2x ' + rivet], 24, 270))

  event.recipes.gtceu.assembler(prefix + 'selector')
    .itemInputs('2x ' + mv, '2x ' + carrier, '2x ' + ks('copper_contact_strip'), frame, seal)
    .inputFluids(Fluid.of(gt('lubricant'), 180)).itemOutputs(selector).EUt(96).duration(580)
  assemble('controller', [selector, '2x ' + oak, '2x ' + frame, '2x ' + carrier, gt('mv_conveyor_module'), seal], 96, 900)
  assemble('controller_slave', [selector, oak, d('connection_key'), frame, gt('mv_conveyor_module'), seal], 96, 680)
  ;['full', 'half'].forEach(size => {
    const base = d('oak_' + size + '_drawers_2')
    const family = 'compacting_' + (size === 'half' ? 'half_' : '') + 'drawers_'
    assemble(family + '2', [base, selector, '2x ' + gt('mv_electric_piston'), frame, '2x ' + slide, seal], 96, 720)
    assemble(family + '3', [d(family + '2'), '2x ' + selector, '2x ' + gt('mv_electric_piston'), '2x ' + frame, '2x ' + seal], 120, 980)
  })

  const materials = [
    ['copper', gt('copper_plate'), 24, lv], ['iron', gt('iron_plate'), 24, lv],
    ['gold', gt('gold_plate'), 96, mv], ['emerald', 'minecraft:emerald', 96, mv],
    ['diamond', 'minecraft:diamond', 480, hv], ['obsidian', 'minecraft:obsidian', 480, hv],
    ['netherite', gt('titanium_plate'), 1920, ks('ev_commissioning_report')]
  ]
  let previous = template
  materials.forEach(([name, material, power, control]) => {
    const id = name + '_storage_upgrade'
    const reinforcement = name === 'netherite' ? 'minecraft:netherite_ingot' : frame
    assemble(id, [previous, '4x ' + material, '2x ' + carrier, control, reinforcement], power, 500 + power)
    previous = d(id)
  })
  const upgrades = [
    ['one_stack_upgrade', [carrier, slide, rivet], 24],
    ['redstone_upgrade', [lv, ks('copper_contact_strip'), 'minecraft:redstone'], 24],
    ['min_redstone_upgrade', [d('redstone_upgrade'), gt('lv_electric_motor'), slide], 24],
    ['max_redstone_upgrade', [d('redstone_upgrade'), gt('lv_conveyor_module'), slide], 24],
    ['fill_level_upgrade', [d('redstone_upgrade'), ks('glass_tube_blank'), lv], 24],
    ['illumination_upgrade', [d('fill_level_upgrade'), gt('vacuum_tube'), 'minecraft:glass_pane'], 24],
    ['portability_upgrade', [d('one_stack_upgrade'), gt('bronze_plate'), '2x ' + slide], 24],
    ['hopper_upgrade', ['minecraft:hopper', gt('lv_conveyor_module'), carrier], 24],
    ['balance_fill_upgrade', [d('fill_level_upgrade'), selector, gt('mv_conveyor_module')], 96],
    ['conversion_upgrade', [d('compacting_drawers_3'), selector, gt('mv_electric_piston')], 120],
    ['void_upgrade', [gt('hv_electric_piston'), '2x minecraft:obsidian', ks('hv_arc_shield')], 480],
    ['remote_upgrade', [d('controller_slave'), gt('hv_emitter'), hv], 480],
    ['remote_group_upgrade', [d('remote_upgrade'), '2x ' + selector, '2x ' + hv], 480]
  ]
  upgrades.forEach(([id, items, power]) => assemble(id, [template].concat(items, '2x ' + slide), power, 460 + power))

  ;[
    ['pull', 'conveyor_module'], ['push', 'electric_piston'], ['magnet', 'electric_motor']
  ].forEach(([functionName, drive]) => {
    const id = functionName + '_upgrade'
    assemble(id, [template, d('hopper_upgrade'), '2x ' + gt('lv_' + drive), ks('magnetic_armature'), slide], 28, 420)
    assemble(id + '_2', [d(id), selector, '2x ' + gt('mv_' + drive), frame, seal], 96, 640)
    assemble(id + '_3', [d(id + '_2'), '2x ' + hv, '2x ' + gt('hv_' + drive), ks('hv_arc_shield'), seal], 480, 880)
  })
})
