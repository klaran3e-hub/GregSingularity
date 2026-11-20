export const questChapters = [
  ['start', 'Начало', ['workshop', 'kiln', 'kinetics'], 'bronze'],
  ['steam', 'Паровой век', ['steam'], 'boiler'],
  ['lv', 'LV', ['lv', 'industrial_supply', 'blast_furnace'], 'lv_circuit_batch'],
  ['mv', 'MV', ['mv', 'oilfield', 'petrochem', 'nether_foundry', 'yard'], 'mv_circuit_batch'],
  ['hv_foundry', 'HV', ['hv_foundry', 'end_expedition'], 'space_lunar_seal'],
  ['ev_power', 'EV', ['ev_vacuum', 'ev_cleanroom', 'ev_power'], 'ev_foundry_accepted'],
  ['iv_power', 'IV', ['iv_metallurgy', 'iv_microelectronics', 'iv_power', 'iv_assembly_line'], 'iv_commissioning'],
  ['luv_power', 'LuV', ['luv_alloys', 'luv_power', 'luv_computation', 'luv_fusion', 'luv_workshop'], 'luv_commissioning'],
  ['zpm_power', 'ZPM', ['zpm_europium', 'zpm_components', 'zpm_power', 'zpm_fusion', 'zpm_commissioning'], 'zpm_commissioning'],
  ['uv_power', 'UV', ['uv_materials', 'uv_power', 'uv_factory', 'uv_fusion', 'uv_commissioning'], 'uv_commissioning'],
  ['post_uv_operations', 'Эксплуатация после UV', ['post_uv_operations'], 'post_uv_operations_certificate'],
  ['post_uv_reclamation', 'Регенерация', ['post_uv_reclamation'], 'reclaim_reclamation_certificate'],
  ['post_uv_distribution', 'Распределённое производство', ['post_uv_distribution'], 'distribution_network_certificate'],
  ['final_operation', 'Главный завод', ['final_foundation', 'final_power', 'final_dispatch', 'final_metallurgy', 'final_polymers', 'final_logic', 'final_operation'], 'final_commissioning_report'],
  ['me_network', 'AE2', ['me_network', 'me_automation'], 'me_controller'],
  ['drawers', 'Складские ящики', ['drawers'], 'drawer_controller'],
  ['railway', 'Железная дорога', ['railway'], 'rail_accept_batch'],
  ['masonry', 'Камень и стекло', ['masonry'], 'stonecutter'],
  ['forestry', 'Forestry и Gendustry', ['forestry_farm', 'forestry_apiculture', 'forestry_industry', 'forestry_genetics'], 'forest_farm_drive'],
  ['woodworking', 'Деревообработка', [
    'timber_oak', 'timber_spruce', 'timber_birch', 'timber_jungle', 'timber_acacia', 'timber_dark_oak',
    'timber_mangrove', 'timber_cherry', 'timber_bamboo', 'timber_crimson', 'timber_warped'
  ], 'wood_oak_mill'],
  ['gregcrops', 'Агрокультуры GregCrops', ['gregcrops'], 'crop_stargatium'],
  ['gtxfa', 'Ресурсные пчёлы', ['gtxfa'], 'bee_hv_copper_run']
]

const primaryRoutes = {
  start: ['knife', 'bench', 'kiln', 'field_trough', 'field_bloomery', 'bronze'],
  steam: ['seal', 'bronze_pipe', 'field_bank', 'test_valve', 'boiler', 'steam_hammer', 'steam_mill', 'steam_alloy_smelter'],
  lv: ['turbine', 'assembler', 'lv_circuit_batch', 'first_coke', 'first_steel', 'pressed_steel_frame', 'ebf_controller', 'first_aluminium'],
  mv: ['pressure_gasket', 'first_mv_circuit', 'mv_circuit_batch', 'oil_drilling_rig', 'washed_oil_sample',
    'refinery_outputs', 'activated_carrier', 'process_commissioning', 'nether_kanthal_coils', 'yard_accept_batch'],
  hv_foundry: ['hv_ceramic_substrate', 'hv_circuit', 'hv_hull', 'hv_generator', 'hv_assembler',
    'hv_trial_billet', 'hv_foundry_accepted', 'end_pass', 'end_grit', 'end_separated_gas', 'end_dielectric',
    'space_frame', 'space_bench', 'space_rocket', 'space_moon', 'space_lunar_seal'],
  ev_power: ['vacuum_controller', 'vacuum_panel', 'cleanroom_controller', 'cleanroom_first_ev_circuit', 'ev_foundry_accepted'],
  iv_power: ['iv_tungstensteel_plate', 'iv_platinum_plate', 'iv_first_mainframe', 'iv_power_engine', 'iv_commissioning'],
  luv_power: ['luv_hssg_plate', 'luv_first_circuit', 'luv_research_station', 'luv_ignition_report', 'luv_commissioning'],
  zpm_power: ['zpm_europium_plates', 'zpm_assembler', 'zpm_buffer', 'zpm_mk2_controller', 'zpm_commissioning'],
  uv_power: ['uv_tritanium_plate', 'uv_energy_input', 'uv_assembler', 'uv_mk3_controller', 'uv_commissioning'],
  post_uv_operations: ['post_uv_operations_permit', 'post_uv_bus_diagnostic', 'post_uv_load_acceptance_record', 'post_uv_operations_certificate'],
  post_uv_reclamation: ['reclaim_membrane_frame', 'reclaim_separation_manifold', 'reclaim_permeate_sample', 'reclaim_recovered_collector', 'reclaim_reclamation_certificate'],
  post_uv_distribution: ['distribution_distribution_license', 'distribution_sealed_cell', 'distribution_nether_calibration', 'distribution_distribution_matrix', 'distribution_network_certificate'],
  final_operation: ['final_uv_permit', 'final_telemetry_unit', 'final_control_console', 'final_black_start_record',
    'final_outage_record', 'final_shift_record', 'final_concurrent_record', 'final_commissioning_report'],
  me_network: ['me_compass', 'me_inscriber', 'me_controller', 'me_provider', 'me_256k'],
  drawers: ['drawer_single', 'drawer_controller', 'drawer_slave', 'drawer_diamond'],
  railway: ['rail_first_track', 'rail_stations', 'rail_cargo_vault', 'rail_accept_batch'],
  masonry: ['chisel', 'stone_bricks', 'stonecutter', 'glass'],
  forestry: ['forest_farm_drive', 'forest_farm_arboretum', 'forest_scoop', 'forest_apiary', 'forest_lab_analyzer',
    'forest_gd_industrial_apiary', 'forest_gd_sampler', 'forest_gd_replicator'],
  woodworking: ['wood_oak_hand', 'wood_birch_hand', 'wood_dark_oak_hand', 'wood_cherry_hand', 'wood_bamboo_hand', 'wood_crimson_hand'],
  gregcrops: ['crop_stakes', 'crop_stickreed_seed', 'crop_harvester', 'crop_coppon', 'crop_steel', 'crop_diareed',
    'crop_quantaria', 'crop_stargatium'],
  gtxfa: ['bee_hv_apiary', 'bee_carbon_comb', 'bee_water_comb', 'bee_polyethylene_comb', 'bee_hv_copper_run',
    'bee_iv_carbide_comb', 'bee_naquadah_comb', 'bee_naquadah_alloy_comb', 'bee_uv_run']
}

const fullDependencyWebs = new Set([
  'steam', 'lv', 'mv', 'hv_foundry', 'ev_power', 'iv_power', 'luv_power', 'zpm_power', 'uv_power', 'post_uv_operations', 'post_uv_reclamation', 'post_uv_distribution', 'final_operation', 'me_network', 'gregcrops', 'gtxfa'
])

function keyHash(key) {
  let result = 2166136261
  for (const character of key) result = Math.imul(result ^ character.charCodeAt(0), 16777619)
  return (result >>> 0) / 4294967296
}

function dependenciesByDistance(node) {
  return [...node.parents].sort((a, b) => distance(node, a) - distance(node, b))
}

const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y)

function createGraph(chapter, sections, milestone) {
  const nodes = new Map()
  for (const section of sections) {
    for (const row of section.rows) {
      const [key, , , , , , optional] = row
      nodes.set(key, { row, section: section.key, optional, parents: [], children: [] })
    }
  }
  for (const node of nodes.values()) {
    for (const key of node.row[4]) {
      const parent = nodes.get(key)
      if (!parent) continue
      node.parents.push(parent)
      parent.children.push(node)
    }
  }

  const hubs = (primaryRoutes[chapter] ?? []).flatMap(key => nodes.has(key) ? [nodes.get(key)] : [])
  const goal = nodes.get(milestone)
  if (!hubs.includes(goal)) hubs.push(goal)
  function rank(node) {
    node.rank ??= Math.max(0, ...node.parents.map(parent => rank(parent) + 1))
    return node.rank
  }
  nodes.forEach(rank)
  const useRanks = chapter !== 'woodworking'
  const maxRank = Math.max(...[...nodes.values()].map(node => node.rank))
  const spacing = Math.max(7.1, Math.sqrt(nodes.size) * 0.74)
  const rankSpacing = Math.max(1.58, Math.min(2.7, Math.sqrt(nodes.size) * 4.6 / maxRank))
  for (const [index, hub] of hubs.entries()) {
    const x = useRanks ? (hub.rank - maxRank / 2) * rankSpacing : (index - (hubs.length - 1) / 2) * spacing
    const sameRank = hubs.filter(candidate => candidate.rank === hub.rank)
    const y = useRanks && sameRank.length > 1
      ? (sameRank.indexOf(hub) - (sameRank.length - 1) / 2) * 3
      : Math.sin(index * 1.45) * 2.5
    Object.assign(hub, { x, y, anchorX: x, anchorY: y, hub: true, size: hub === goal ? 1.9 : 1.55, useRanks })
  }
  // Assign a preferred area by shortest dependency distance, across every
  // authored section. External-only tasks stay near their local consumers.
  const queue = [...hubs]
  hubs.forEach(hub => { hub.hubDistance = 0 })
  for (let index = 0; index < queue.length; index++) {
    const node = queue[index]
    for (const neighbor of [...node.parents, ...node.children]) {
      if (neighbor.hubDistance !== undefined) continue
      neighbor.hubDistance = node.hubDistance + 1
      neighbor.anchorX = node.anchorX
      neighbor.anchorY = node.anchorY
      queue.push(neighbor)
    }
  }
  const linked = [...nodes.values()]
  for (const [index, node] of linked.entries()) {
    if (node.hub) continue
    const angle = keyHash(node.row[0]) * Math.PI * 2
    const spread = 2.2 + Math.min(node.hubDistance ?? 2, 5) * 1.23
    const fallback = hubs[index % hubs.length]
    node.anchorX ??= fallback.x
    node.anchorY ??= fallback.y
    if (useRanks) {
      node.anchorX = (node.rank - maxRank / 2) * rankSpacing
      node.anchorY += Math.sin(angle) * (node.optional ? 2.8 : 1.6)
    }
    node.x = node.anchorX + Math.cos(angle) * (useRanks ? 0.27 : spread)
    node.y = node.anchorY + Math.sin(angle) * spread * 0.85
    node.size = node.optional ? 0.91 : 1.09
    node.useRanks = useRanks
  }
  return linked
}

function relax(nodes) {
  const iterations = 230
  const indexes = new Map(nodes.map((node, index) => [node, index]))
  for (let iteration = 0; iteration < iterations; iteration++) {
    const step = 0.16 - 0.13 * iteration / iterations
    const forces = nodes.map(node => ({
      x: (node.anchorX - node.x) * 0.055, y: (node.anchorY - node.y) * 0.075
    }))
    for (const [i, node] of nodes.entries()) {
      for (let j = i + 1; j < nodes.length; j++) {
        const other = nodes[j]
        const dx = other.x - node.x || 0.001
        const dy = other.y - node.y || 0.001
        const squared = dx * dx + dy * dy
        if (squared > 144) continue
        const minGap = (node.size + other.size) / 2 + 0.58
        const length = Math.sqrt(squared)
        const force = 2.65 / Math.max(squared, 0.5) + Math.max(0, minGap - length) * 9
        forces[i].x -= dx / length * force
        forces[i].y -= dy / length * force
        forces[j].x += dx / length * force
        forces[j].y += dy / length * force
      }
      for (const parent of node.parents) {
        const dx = parent.x - node.x
        const dy = parent.y - node.y
        const length = Math.hypot(dx, dy)
        if (length < 0.01) continue
        const stretch = Math.max(0, length - (node.optional ? 1.85 : 2.35))
        const force = Math.min(1.7, stretch * 0.22)
        const fx = dx / length * force
        const fy = dy / length * force
        const j = indexes.get(parent)
        forces[i].x += fx
        forces[i].y += fy
        forces[j].x -= fx
        forces[j].y -= fy
      }
    }
    for (const [index, node] of nodes.entries()) {
      if (node.hub) continue
      const x = node.x + step * forces[index].x
      node.x = node.useRanks ? Math.min(node.anchorX + 0.34, Math.max(node.anchorX - 0.34, x)) : x
      node.y += step * forces[index].y
    }
  }
}

function crosses(first, second) {
  const { from: a, to: b } = first
  const { from: c, to: d } = second
  if (a === c || a === d || b === c || b === d) return false
  const side = (p, q, r) => (q.x - p.x) * (r.y - p.y) - (q.y - p.y) * (r.x - p.x)
  return side(a, b, c) * side(a, b, d) < -0.0001 && side(c, d, a) * side(c, d, b) < -0.0001
}

function clearOfNodes({ from, to }, nodes) {
  const dx = to.x - from.x
  const dy = to.y - from.y
  const squared = dx * dx + dy * dy
  return nodes.every(node => {
    if (node === from || node === to) return true
    const at = ((node.x - from.x) * dx + (node.y - from.y) * dy) / squared
    if (at <= 0 || at >= 1) return true
    const off = Math.hypot(node.x - from.x - dx * at, node.y - from.y - dy * at)
    return off > node.size / 2 + 0.18
  })
}

function detour(edge, nodes, shown) {
  const { from, to } = edge
  const dx = to.x - from.x
  const dy = to.y - from.y
  const length = Math.hypot(dx, dy)
  for (const offset of [0, 1.3, -1.3, 2.4, -2.4, 3.6, -3.6, 5.1, -5.1]) {
    const bend = {
      x: (from.x + to.x) / 2 - dy / length * offset,
      y: (from.y + to.y) / 2 + dx / length * offset
    }
    const parts = offset ? [{ from, to: bend }, { from: bend, to }] : [edge]
    if (parts.every(line => clearOfNodes(line, nodes) && !shown.some(other => crosses(line, other)))) return parts
  }
  return []
}

export function webLayout(chapter, sections, milestone) {
  const nodes = createGraph(chapter, sections, milestone)
  relax(nodes)
  const edges = nodes.flatMap(to => dependenciesByDistance(to).map(from => ({ from, to, length: distance(from, to) })))
  edges.sort((a, b) => a.length - b.length)
  const shown = []
  const connected = new Set()
  const used = new Set()
  const components = new Map(nodes.map(node => [node, node]))
  function component(node) {
    const next = components.get(node)
    if (next === node) return node
    const root = component(next)
    components.set(node, root)
    return root
  }
  for (const edge of edges) {
    const fromGroup = component(edge.from)
    const toGroup = component(edge.to)
    if (fromGroup === toGroup) continue
    const parts = detour(edge, nodes, shown)
    if (!parts.length) continue
    const main = !edge.to.optional && !edge.from.optional
    shown.push(...parts.map(part => ({ ...part, main })))
    connected.add(edge.from)
    connected.add(edge.to)
    used.add(edge)
    components.set(fromGroup, toGroup)
  }
  for (const node of nodes) {
    if (connected.has(node)) continue
    const candidates = edges.filter(edge => edge.to === node || edge.from === node)
    for (const edge of candidates) {
      const parts = detour(edge, nodes, shown)
      if (!parts.length) continue
      shown.push(...parts.map(part => ({ ...part, main: false })))
      connected.add(edge.from)
      connected.add(edge.to)
      break
    }
  }
  for (const edge of edges) {
    if (used.has(edge) || edge.to.optional || edge.length > 7.4) continue
    if (!clearOfNodes(edge, nodes) || shown.some(other => crosses(edge, other))) continue
    shown.push({ ...edge, main: true })
    connected.add(edge.from)
    connected.add(edge.to)
  }
  if (fullDependencyWebs.has(chapter)) {
    for (const node of nodes) {
      if (connected.has(node)) continue
      const neighbors = [...node.parents, ...node.children].sort((a, b) => distance(node, a) - distance(node, b))
      for (const neighbor of neighbors) {
        const location = nearbySlot(node, neighbor, nodes, shown)
        if (!location) continue
        node.x = location.x
        node.y = location.y
        shown.push({ from: neighbor, to: node, main: false })
        connected.add(node)
        connected.add(neighbor)
        break
      }
      if (connected.has(node) || !neighbors.length) continue
      for (const neighbor of neighbors) {
        const parts = routeAroundNodes(neighbor, node, nodes)
        if (!parts.length) continue
        shown.push(...parts.map(part => ({ ...part, main: false })))
        connected.add(node)
        connected.add(neighbor)
        break
      }
    }
  }
  return {
    entries: nodes.map(({ row, section, x, y, size }) => ({ row, section, x, y, size, shape: 'circle' })),
    lines: shown,
    unconnected: fullDependencyWebs.has(chapter) ? nodes.filter(node => !connected.has(node)).map(node => node.row[0]) : [],
    connected: connected.size,
    localNodes: nodes.filter(node => node.parents.length || node.children.length).length
  }
}

function nearbySlot(node, neighbor, nodes, lines) {
  const angle = Math.atan2(node.y - neighbor.y, node.x - neighbor.x)
  const obstacles = nodes.filter(other => other !== node)
  let fallback
  for (const radius of [1.8, 2.2, 2.7, 3.3, 4, 4.8, 5.6, 6.8, 8, 10]) {
    for (let step = 0; step < 48; step++) {
      const offset = Math.ceil(step / 2) * (step % 2 ? 1 : -1) * Math.PI / 24
      const x = neighbor.x + Math.cos(angle + offset) * radius
      const y = neighbor.y + Math.sin(angle + offset) * radius
      const position = { x, y, size: node.size }
      if (obstacles.some(other => distance(position, other) < (position.size + other.size) / 2 + 0.44)) continue
      if (!lines.every(line => clearOfNodes(line, [position]))) continue
      const candidate = { from: neighbor, to: position }
      if (!clearOfNodes(candidate, obstacles)) continue
      const crossings = lines.filter(line => crosses(candidate, line)).length
      if (crossings === 0) return { x, y }
      if (!fallback || crossings < fallback.crossings) fallback = { x, y, crossings }
    }
  }
  return fallback
}

function routeAroundNodes(from, to, nodes) {
  const edge = { from, to }
  const direct = detour(edge, nodes, [])
  if (direct.length) return direct

  const points = endpoint => [0.9, 1.4, 2, 2.8, 4, 6, 9].flatMap(radius => Array.from({ length: 48 }, (_, index) => {
    const angle = index * Math.PI / 24
    return { x: endpoint.x + radius * Math.cos(angle), y: endpoint.y + radius * Math.sin(angle) }
  })).filter(point => nodes.every(node => distance(node, point) > node.size / 2 + 0.18))
  const starts = points(from).filter(point => clearOfNodes({ from, to: point }, nodes))
  const ends = points(to).filter(point => clearOfNodes({ from: point, to }, nodes))
  let best = []
  let shortest = Infinity
  for (const start of starts) {
    for (const end of ends) {
      const length = distance(from, start) + distance(start, end) + distance(end, to)
      const middle = { from: start, to: end }
      if (length >= shortest || !clearOfNodes(middle, nodes)) continue
      best = [{ from, to: start }, middle, { from: end, to }]
      shortest = length
    }
  }
  return best
}

export function drawWeb({ entries, lines }) {
  const resolution = 18
  const width = Math.ceil((2 * Math.max(...entries.map(node => Math.abs(node.x))) + 3) * resolution)
  const height = Math.ceil((2 * Math.max(...entries.map(node => Math.abs(node.y))) + 3) * resolution)
  const pixels = Buffer.alloc(width * height * 4)
  for (const { from, to, main } of lines) {
    const x = from.x * resolution + width / 2
    const y = from.y * resolution + height / 2
    const dx = (to.x - from.x) * resolution
    const dy = (to.y - from.y) * resolution
    const steps = Math.ceil(Math.hypot(dx, dy))
    const color = main ? [201, 150, 101, 178] : [185, 185, 201, 134]
    for (let step = 0; step <= steps; step++) {
      const px = Math.round(x + dx * step / steps)
      const py = Math.round(y + dy * step / steps)
      const offset = (py * width + px) * 4
      if (pixels[offset + 3] <= color[3]) pixels.set(color, offset)
      if (main && pixels[offset + 7] < 67) pixels.set([color[0], color[1], color[2], 67], offset + 4)
    }
  }
  // FTB lays out centers on button size plus spacing, but draws image
  // extents with the button size alone (1.5×zoom versus 1.75×zoom).
  return { width, height, pixels, scale: resolution * 6 / 7 }
}
