const parts = [
  ['uv_neutronium_acceptance_crate', 'case', '#406268'],
  ['zpm_americium_acceptance_crate', 'case', '#75527c'],
  ['post_uv_reserve_bleed_record', 'paper', '#d47758'],
  ['distribution_surface_pressure_record', 'gauge', 'green'],
  ['distribution_nether_pressure_record', 'gauge', 'red'],
  ['distribution_end_pressure_record', 'gauge', 'violet'],
  ['post_uv_operations_permit', 'paper', 'bronze'],
  ['post_uv_bus_diagnostic', 'board', 'teal'],
  ['post_uv_reserve_load_matrix', 'power', 'copper'],
  ['post_uv_coolant_isolation_module', 'tube', 'blue'],
  ['post_uv_logistics_clock', 'dial', 'gold'],
  ['post_uv_load_acceptance_record', 'paper', 'red'],
  ['post_uv_supply_sync_record', 'paper', 'blue'],
  ['post_uv_operations_certificate', 'paper', 'gold'],
  ['reclaim_membrane_frame', 'frame', 'steel'],
  ['reclaim_sintered_membrane', 'mesh', 'cream'],
  ['reclaim_membrane_cartridge', 'tube', 'cream'],
  ['reclaim_separation_manifold', 'tube', 'teal'],
  ['reclaim_etched_collector', 'mesh', 'violet'],
  ['reclaim_purge_adsorbent', 'granules', 'copper'],
  ['reclaim_recovered_collector', 'mesh', 'teal'],
  ['reclaim_loop_witness', 'dial', 'teal'],
  ['reclaim_reclamation_certificate', 'paper', 'teal'],
  ['distribution_distribution_license', 'paper', 'violet'],
  ['distribution_cargo_skeleton', 'frame', 'bronze'],
  ['distribution_sealed_cell', 'case', 'steel'],
  ['distribution_surface_feed', 'case', 'green'],
  ['distribution_nether_feed', 'case', 'red'],
  ['distribution_end_feed', 'case', 'violet'],
  ['distribution_surface_calibration', 'dial', 'green'],
  ['distribution_nether_calibration', 'dial', 'red'],
  ['distribution_end_calibration', 'dial', 'violet'],
  ['distribution_distribution_matrix', 'power', 'violet'],
  ['distribution_load_fingerprint', 'board', 'gold'],
  ['distribution_network_certificate', 'paper', 'green']
]

export default function drawPostUv({ item, cuboid, rect, ellipse, line, poly }) {
  const outline = 'black'
  const edge = 'edge'
  const body = '#545665'
  const side = '#393946'
  const highlight = '#a1a8b9'

  const forms = {
    paper(accent) {
      poly([[5, 5], [22, 5], [27, 10], [27, 27], [5, 27]], side, outline)
      poly([[7, 7], [22, 7], [25, 10], [25, 25], [7, 25]], 'paper', edge)
      rect(8, 9, 14, 4, side)
      line(9, 10, 21, 10, accent, 2)
      line(10, 16, 19, 16, 'iron', 2)
      line(10, 20, 17, 20, 'iron', 2)
      ellipse(18, 18, 7, 7, accent, outline)
    },
    board(accent) {
      poly([[3, 9], [24, 5], [28, 10], [28, 24], [7, 28], [3, 24]], '#343e46', outline)
      line(5, 11, 24, 7, highlight, 2)
      rect(9, 11, 13, 13, edge, outline)
      rect(12, 14, 7, 7, accent, side)
      line(5, 18, 9, 18, 'gold', 2)
      line(22, 21, 26, 21, 'gold', 2)
      line(10, 25, 24, 23, highlight, 2)
    },
    power(accent) {
      cuboid(4, 10, 21, 16, 3, body, highlight, side)
      for (const x of [8, 14, 20]) {
        rect(x, 13, 4, 8, accent, outline)
        rect(x, 10, 4, 3, 'copper', side)
      }
      line(8, 24, 22, 24, 'gold', 2)
    },
    tube(accent) {
      rect(4, 16, 24, 8, side, outline)
      rect(6, 14, 5, 12, body, outline)
      rect(23, 14, 5, 12, body, outline)
      rect(10, 9, 13, 16, body, outline)
      rect(11, 13, 11, 8, accent, outline)
      line(12, 15, 19, 15, 'glass', 2)
      rect(13, 6, 6, 4, 'steel', outline)
    },
    dial(accent) {
      cuboid(5, 10, 20, 17, 2, body, highlight, side)
      ellipse(8, 11, 14, 14, outline, 'silver')
      ellipse(10, 13, 10, 10, accent, outline)
      line(14, 19, 17, 15, 'cream', 2)
      rect(21, 23, 3, 2, 'copper')
    },
    gauge(accent) {
      cuboid(5, 10, 19, 17, 2, body, highlight, side)
      rect(4, 14, 8, 9, 'bronze', outline)
      ellipse(9, 10, 14, 15, accent, outline)
      ellipse(11, 12, 10, 11, '#33353b', 'silver')
      line(15, 19, 18, 15, accent, 2)
      rect(14, 24, 7, 4, 'copper', outline)
    },
    frame(accent) {
      poly([[3, 12], [9, 6], [27, 6], [28, 21], [22, 27], [3, 27]], side, outline)
      rect(7, 10, 18, 14, accent, outline)
      rect(10, 13, 12, 8, 'clear', edge)
      rect(5, 12, 3, 3, 'silver', outline)
      rect(22, 19, 3, 3, 'silver', outline)
    },
    mesh(accent) {
      cuboid(5, 10, 20, 15, 2, side, highlight, body)
      rect(7, 12, 16, 10, accent, outline)
      for (const y of [14, 17, 20]) line(8, y, 22, y, 'silver', 1)
      for (const x of [10, 14, 18, 22]) line(x, 12, x, 21, edge, 1)
    },
    granules(accent) {
      poly([[6, 11], [13, 7], [23, 9], [27, 17], [22, 25], [9, 26], [4, 20]], side, outline)
      for (const [x, y] of [[8, 11], [14, 9], [20, 12], [7, 18], [13, 16], [20, 19], [13, 22]]) {
        ellipse(x, y, 6, 5, accent, 'walnut')
      }
    },
    case(accent) {
      cuboid(4, 11, 21, 15, 3, body, highlight, side)
      rect(7, 14, 15, 9, accent, outline)
      line(7, 14, 21, 14, 'silver', 2)
      rect(10, 10, 3, 14, side, outline)
      rect(17, 10, 3, 14, side, outline)
      rect(14, 18, 3, 4, 'cream')
    }
  }

  for (const [id, form, accent] of parts) item(id, () => forms[form](accent))
}
