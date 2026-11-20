const mc = id => 'minecraft:' + id
const kube = id => 'kubejs:' + id
const gt = id => 'gtceu:' + id
const me = id => 'ae2:' + id
const coke = 'gtceu:coke_gem'
const alloy = 'kubejs:rough_slat'
const stack = (item, count) => ({ item, count })

const startingRewards = {
  gravel: stack(mc('stick'), 2),
  sticks: stack(kube('plant_fibre'), 2),
  fibre: stack(mc('gravel'), 2)
}

const milestones = {
  knife: stack(mc('stick'), 3),
  bench: stack(kube('washed_fibre'), 3),
  axe: stack(kube('wooden_peg'), 3),
  kiln: stack(kube('sand_temper'), 3),
  iron: stack(mc('charcoal'), 4),
  wheel: stack(alloy, 2),
  saw: stack(kube('wooden_peg'), 4),
  press: stack(kube('copper_strap'), 2),
  drawer_controller: stack(gt('iron_plate'), 3),
  boiler: stack(gt('bronze_ingot'), 4),
  turbine: stack(gt('bronze_plate'), 4),
  assembler: stack(gt('tin_single_wire'), 4),
  first_steel: stack(coke, 4),
  pressed_steel_frame: stack(gt('iron_plate'), 2),
  ebf_controller: stack(gt('steel_plate'), 4),
  first_aluminium: stack(gt('steel_plate'), 3),
  first_mv_circuit: stack(gt('aluminium_plate'), 3),
  mv_turbine: stack(gt('copper_single_wire'), 4),
  oil_drilling_rig: stack(gt('steel_plate'), 4),
  washed_oil_sample: stack(kube('strainer_mesh'), 2),
  refinery_outputs: stack(kube('refinery_tray'), 2),
  first_polyethylene: stack(gt('aluminium_plate'), 3),
  diesel_sample: stack(kube('sample_ampoule'), 2),
  process_commissioning: stack(kube('pressure_gasket'), 4),
  nether_transit: stack(gt('polyethylene_plate'), 3),
  nether_kanthal_coils: stack(gt('steel_plate'), 4),
  me_controller: stack(me('quartz_fiber'), 4),
  yard_accept_batch: stack(gt('stainless_steel_plate'), 3),
  rail_accept_batch: stack(gt('steel_plate'), 4),
  hv_circuit: stack(kube('ceramic_hv_substrate'), 2),
  hv_assembler: stack(gt('gold_single_cable'), 4),
  hv_trial_billet: stack(kube('fired_refractory_liner'), 2),
  hv_foundry_accepted: stack(gt('stainless_steel_plate'), 4),
  end_pass: stack(gt('polyethylene_plate'), 4),
  end_separated_gas: stack(kube('end_filter_blank'), 2),
  vacuum_controller: stack(gt('stainless_steel_plate'), 4),
  vacuum_titanium_plate: stack(gt('polyethylene_plate'), 4),
  cleanroom_first_ev_circuit: stack(gt('titanium_plate'), 3),
  ev_foundry_accepted: stack(gt('titanium_plate'), 4),
  me_provider: stack(me('quartz_fiber'), 4),
  iv_nichrome_coils: stack(gt('titanium_plate'), 4),
  iv_first_mainframe: stack(gt('platinum_plate'), 2),
  iv_power_engine: stack(gt('tungsten_steel_plate'), 4),
  iv_commissioning: stack(gt('tungsten_steel_plate'), 4),
  luv_palladium_plate: stack(gt('hssg_plate'), 2),
  luv_first_circuit: stack(gt('niobium_titanium_plate'), 3),
  luv_research_station: stack(gt('tungsten_steel_plate'), 4),
  luv_ignition_report: stack(gt('hssg_plate'), 3),
  luv_commissioning: stack(gt('niobium_titanium_plate'), 4),
  zpm_europium_plates: stack(gt('niobium_titanium_plate'), 3),
  zpm_mk2_controller: stack(gt('vanadium_gallium_single_wire'), 3),
  zpm_commissioning: stack(gt('vanadium_gallium_single_wire'), 4),
  uv_mk3_controller: stack(gt('yttrium_barium_cuprate_single_wire'), 3),
  uv_commissioning: stack(gt('tritanium_plate'), 4),
  final_backup_module: stack(gt('yttrium_barium_cuprate_single_wire'), 4),
  final_black_start_record: stack(gt('yttrium_barium_cuprate_single_wire'), 3),
  final_outage_record: stack(gt('tungsten_steel_plate'), 4),
  final_shift_record: stack(gt('polyethylene_plate'), 4),
  final_commissioning_report: stack(gt('tritanium_plate'), 6)
}

// Each pool uses materials from its own recipes and the previous production steps.
// The resolver only selects a material once a prerequisite task has checked it.
const chapterMaterials = {
  post_uv_operations: [gt('tritanium_plate'), gt('tungsten_steel_plate'), me('quartz_fiber')],
  post_uv_reclamation: [gt('tritanium_plate'), gt('polytetrafluoroethylene_plate'), me('quartz_fiber')],
  post_uv_distribution: [gt('tritanium_plate'), gt('polytetrafluoroethylene_plate'), me('quartz_fiber')],
  workshop: [mc('stick'), mc('gravel'), mc('flint'), kube('plant_fibre'), kube('washed_fibre'), kube('wooden_peg')],
  kiln: [mc('clay_ball'), mc('charcoal'), kube('sand_temper'), kube('washed_fibre'), kube('fired_lining'), kube('iron_rivet')],
  kinetics: [alloy, kube('copper_strap'), kube('wooden_peg'), kube('iron_rivet'), kube('shaft_bushing'), mc('charcoal')],
  drawers: [kube('wooden_peg'), kube('wooden_joint'), kube('iron_rivet'), gt('iron_plate'), gt('copper_plate'), gt('bronze_plate')],
  steam: [gt('bronze_ingot'), gt('bronze_plate'), kube('stamped_bronze_blank'), mc('charcoal'), kube('fired_lining')],
  lv: [gt('sticky_resin'), kube('impregnated_fibre'), gt('tin_plate'), gt('tin_single_wire'), gt('copper_plate'), gt('bronze_plate'), gt('charcoal_dust')],
  industrial_supply: [mc('coal'), coke, mc('calcite'), gt('iron_plate'), gt('steel_ingot'), gt('steel_plate')],
  blast_furnace: [gt('steel_ingot'), gt('steel_plate'), gt('crushed_nickel_ore'), gt('crushed_bauxite_ore'), coke, gt('aluminium_ingot')],
  mv: [gt('aluminium_plate'), gt('copper_plate'), gt('copper_single_wire'), gt('steel_plate'), gt('tin_plate'), gt('sticky_resin')],
  oilfield: [gt('steel_plate'), gt('aluminium_plate'), gt('copper_plate'), gt('copper_single_wire'), gt('salt_dust'), gt('iron_plate')],
  petrochem: [gt('polyethylene_plate'), gt('salt_dust'), gt('aluminium_plate'), gt('copper_plate'), gt('steel_plate')],
  nether_foundry: [gt('polyethylene_plate'), gt('steel_plate'), gt('aluminium_plate'), gt('kanthal_ingot'), gt('stainless_steel_ingot')],
  me_network: [me('quartz_fiber'), gt('silicon_ingot'), me('fluix_crystal'), me('certus_quartz_crystal'), gt('polyethylene_plate'), gt('aluminium_plate')],
  yard: [gt('steel_plate'), gt('stainless_steel_plate'), gt('bronze_plate'), gt('tin_single_wire'), gt('copper_plate')],
  railway: [gt('steel_plate'), gt('stainless_steel_plate'), gt('bronze_plate'), gt('iron_plate'), gt('copper_plate')],
  hv_foundry: [gt('stainless_steel_plate'), gt('polyethylene_plate'), gt('gold_single_wire'), gt('aluminium_plate'), gt('steel_plate')],
  end_expedition: [gt('stainless_steel_plate'), gt('polyethylene_plate'), gt('copper_plate'), gt('steel_plate'), gt('aluminium_plate')],
  ev_vacuum: [gt('stainless_steel_plate'), gt('polyethylene_plate'), gt('aluminium_plate'), gt('titanium_ingot'), gt('titanium_plate')],
  ev_cleanroom: [gt('titanium_plate'), gt('polyethylene_plate'), gt('stainless_steel_plate'), gt('gold_single_wire'), gt('aluminium_plate')],
  ev_power: [gt('titanium_plate'), gt('aluminium_single_wire'), gt('aluminium_plate'), gt('stainless_steel_plate'), gt('polyethylene_plate')],
  me_automation: [me('quartz_fiber'), gt('silicon_ingot'), me('fluix_crystal'), me('certus_quartz_crystal'), gt('polyethylene_plate')],
  iv_metallurgy: [gt('titanium_plate'), gt('nichrome_plate'), gt('tungsten_dust'), gt('tungsten_plate'), gt('stainless_steel_plate')],
  iv_microelectronics: [gt('platinum_plate'), gt('titanium_plate'), gt('silicon_ingot'), gt('polyethylene_plate'), gt('aluminium_single_wire')],
  iv_power: [gt('tungsten_plate'), gt('tungsten_single_wire'), gt('tungsten_steel_plate'), gt('titanium_plate'), gt('polyethylene_plate')],
  iv_assembly_line: [gt('tungsten_steel_plate'), gt('tungsten_single_wire'), gt('platinum_plate'), gt('titanium_plate'), me('quartz_fiber')],
  luv_alloys: [gt('tungsten_steel_plate'), gt('tungsten_plate'), gt('molybdenum_dust'), gt('hssg_plate'), gt('titanium_plate')],
  luv_power: [gt('niobium_titanium_plate'), gt('niobium_titanium_single_wire'), gt('hssg_plate'), gt('tungsten_steel_plate'), gt('platinum_plate')],
  luv_computation: [gt('niobium_titanium_single_wire'), gt('tungsten_steel_plate'), gt('platinum_plate'), gt('polyethylene_plate'), me('quartz_fiber')],
  luv_fusion: [gt('hssg_plate'), gt('niobium_titanium_plate'), gt('niobium_titanium_single_wire'), gt('tungsten_steel_plate'), gt('titanium_plate')],
  luv_workshop: [gt('tungsten_steel_plate'), gt('hssg_plate'), gt('titanium_plate'), gt('niobium_titanium_single_wire'), gt('polyethylene_plate')],
  zpm_europium: [gt('hssg_plate'), gt('niobium_titanium_plate'), gt('tungsten_steel_plate'), gt('molybdenum_dust'), gt('niobium_titanium_single_wire')],
  zpm_components: [gt('niobium_titanium_plate'), gt('niobium_titanium_single_wire'), gt('tungsten_steel_plate'), gt('hssg_plate'), gt('naquadah_alloy_plate')],
  zpm_power: [gt('vanadium_gallium_single_wire'), gt('niobium_titanium_single_wire'), gt('tungsten_steel_plate'), gt('hssg_plate'), gt('naquadah_alloy_plate')],
  zpm_fusion: [gt('vanadium_gallium_single_wire'), gt('niobium_titanium_plate'), gt('hssg_plate'), gt('tungsten_steel_plate'), gt('naquadah_alloy_plate')],
  zpm_commissioning: [gt('vanadium_gallium_single_wire'), gt('niobium_titanium_plate'), gt('tungsten_steel_plate'), me('quartz_fiber'), gt('polyethylene_plate')],
  uv_materials: [gt('vanadium_gallium_single_wire'), gt('niobium_titanium_plate'), gt('tungsten_steel_plate'), gt('hssg_plate'), gt('naquadah_alloy_plate')],
  uv_power: [gt('yttrium_barium_cuprate_single_wire'), gt('vanadium_gallium_single_wire'), gt('niobium_titanium_single_wire'), gt('tungsten_steel_plate'), gt('hssg_plate')],
  uv_factory: [gt('tritanium_plate'), gt('yttrium_barium_cuprate_single_wire'), gt('vanadium_gallium_single_wire'), gt('hssg_plate'), gt('tungsten_steel_plate')],
  uv_fusion: [gt('yttrium_barium_cuprate_single_wire'), gt('vanadium_gallium_single_wire'), gt('niobium_titanium_plate'), gt('hssg_plate'), gt('naquadah_alloy_plate')],
  uv_commissioning: [gt('tritanium_plate'), gt('yttrium_barium_cuprate_single_wire'), gt('tungsten_steel_plate'), gt('polyethylene_plate'), me('quartz_fiber')],
  final_foundation: [gt('tritanium_plate'), gt('yttrium_barium_cuprate_single_wire'), gt('tungsten_steel_plate'), gt('polyethylene_plate'), me('quartz_fiber')],
  final_power: [gt('yttrium_barium_cuprate_single_wire'), gt('vanadium_gallium_single_wire'), gt('tungsten_steel_plate'), gt('tritanium_plate'), gt('niobium_titanium_single_wire')],
  final_dispatch: [gt('tungsten_steel_plate'), gt('stainless_steel_plate'), gt('polyethylene_plate'), gt('hssg_plate'), gt('niobium_titanium_plate')],
  final_metallurgy: [gt('tungsten_steel_plate'), gt('hssg_plate'), gt('tritanium_plate'), gt('titanium_plate'), gt('stainless_steel_plate')],
  final_polymers: [gt('polyethylene_plate'), gt('stainless_steel_plate'), gt('aluminium_plate'), gt('titanium_plate'), gt('tungsten_steel_plate')],
  final_logic: [me('quartz_fiber'), gt('silicon_ingot'), gt('platinum_plate'), gt('yttrium_barium_cuprate_single_wire'), gt('polyethylene_plate')],
  final_operation: [gt('yttrium_barium_cuprate_single_wire'), gt('tungsten_steel_plate'), gt('polyethylene_plate'), gt('tritanium_plate'), me('quartz_fiber')],
  masonry: [mc('clay_ball'), kube('abrasive_paste'), kube('clay_mortar'), kube('sand_temper'), mc('charcoal'), kube('washed_fibre')],
  forestry_farm: [gt('bronze_plate'), gt('tin_plate'), gt('copper_plate'), gt('iron_plate')],
  forestry_apiculture: [gt('stainless_steel_plate'), gt('polyethylene_plate'), gt('aluminium_plate'), gt('copper_plate')],
  forestry_industry: [gt('steel_plate'), gt('copper_plate'), gt('polyethylene_plate'), gt('stainless_steel_plate')],
  forestry_genetics: [gt('stainless_steel_plate'), gt('aluminium_plate'), me('quartz_fiber'), gt('polyethylene_plate')],
  gregcrops: ['gtibdcrops:crop_stick', mc('wheat_seeds'), kube('wooden_peg'), kube('fibre_cord'), gt('iron_plate'), gt('tin_plate')],
  gtxfa: ['forestry:beeswax', 'forestry:honey_drop', gt('copper_plate'), gt('stainless_steel_plate'), gt('polyethylene_plate')]
}

const costlyMaterials = new Set([
  kube('copper_strap'), kube('shaft_bushing'), kube('stamped_bronze_blank'),
  gt('steel_ingot'), gt('steel_plate'), gt('aluminium_ingot'), gt('aluminium_plate'),
  gt('kanthal_ingot'), gt('stainless_steel_ingot'), gt('stainless_steel_plate'),
  gt('titanium_ingot'), gt('titanium_plate'), gt('nichrome_plate'), gt('tungsten_plate'),
  gt('platinum_plate'), gt('tungsten_steel_plate'), gt('hssg_plate'),
  gt('niobium_titanium_plate'), gt('naquadah_alloy_plate'), gt('tritanium_plate')
])

const timberHardware = {
  logs: stack(kube('wooden_peg'), 2),
  slabs: stack(kube('wooden_peg'), 2),
  stairs: stack(kube('wooden_joint'), 1),
  fence: stack(kube('wooden_joint'), 1),
  gate: stack(kube('iron_rivet'), 1),
  door: stack(kube('iron_rivet'), 1),
  hatch: stack(kube('wooden_peg'), 2),
  button: stack(kube('wooden_peg'), 2),
  pressure: stack(kube('wooden_peg'), 2),
  hanging: stack(mc('iron_ingot'), 1),
  boat: stack(kube('tool_binding'), 1),
  cargo: stack(kube('wooden_joint'), 1)
}

function timberReward(chapter, key, source) {
  const wood = chapter.slice('timber_'.length)
  const part = key.slice(('wood_' + wood + '_').length)
  return timberHardware[part] ?? stack(source, part === 'mill' ? 3 : 2)
}

function chooseMaterial(key, materials) {
  let hash = 0
  for (const character of key) hash = Math.imul(hash, 31) + character.charCodeAt(0)
  return materials[(hash >>> 0) % materials.length]
}

export function createQuestRewardResolver(chapters) {
  const quests = new Map()
  const timberSources = new Map()
  for (const { key: chapter, rows, rewards } of chapters) {
    for (const [key, , item, , deps, , optional] of rows) {
      quests.set(key, { chapter, item, deps, optional, reward: rewards?.[key] })
      if (chapter.startsWith('timber_') && key.endsWith('_logs')) timberSources.set(chapter, item)
    }
  }

  const prerequisiteItems = new Map()
  function collectPrerequisiteItems(key) {
    if (prerequisiteItems.has(key)) return prerequisiteItems.get(key)

    const items = new Set()
    for (const dependency of quests.get(key).deps) {
      items.add(quests.get(dependency).item)
      for (const item of collectPrerequisiteItems(dependency)) items.add(item)
    }
    prerequisiteItems.set(key, items)
    return items
  }

  return key => {
    const { chapter, item: taskItem, deps, optional, reward } = quests.get(key)
    if (deps.length === 0 && startingRewards[key]) return startingRewards[key]

    const available = collectPrerequisiteItems(key)
    const isAvailable = item => item !== taskItem && available.has(item)
    const explicit = timberSources.has(chapter)
      ? timberReward(chapter, key, timberSources.get(chapter))
      : reward ?? milestones[key]
    if (explicit) {
      if (!isAvailable(explicit.item)) throw new Error('Quest reward precedes its material: ' + key + ' / ' + explicit.item)
      return explicit
    }

    const materials = chapterMaterials[chapter].filter(isAvailable)
    const eligible = materials.length ? materials : chapterMaterials.workshop.filter(isAvailable)
    if (!eligible.length) throw new Error('No previously checked reward material for ' + key)

    const item = chooseMaterial(key, eligible)
    return stack(item, costlyMaterials.has(item) ? 1 : optional ? 2 : 3)
  }
}
