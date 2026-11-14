export default function drawFinalItems({ item, poly, rect, ellipse, line, cuboid }) {
  const part = (name, draw) => item('final_' + name, draw)
  const graphite = '#41424e'
  const navy = '#26394c'
  const brass = '#c99b57'
  const pale = '#efcc83'
  const jade = '#7ab679'
  const cyan = '#74b8ca'
  const purple = '#ad8ac4'
  const ember = '#db7763'

  function page(x, y, width, height, backing, seal) {
    rect(x, y, width, height, backing, 'black')
    rect(x + 2, y + 2, width - 4, height - 4, 'paper')
    rect(x + 4, y + 4, width - 8, 4, seal)
    line(x + 4, y + 11, x + width - 6, y + 11, 'iron', 2)
    line(x + 4, y + 15, x + width - 8, y + 15, 'iron', 2)
  }

  function caseBody(front, top, side) {
    cuboid(3, 12, 20, 15, 3, front, top, side)
    rect(6, 14, 14, 10, 'black')
    rect(4, 25, 18, 2, 'edge')
    line(24, 15, 27, 13, 'steel', 2)
  }

  part('repeat_load_record', () => {
    page(5, 4, 22, 25, graphite, cyan)
    rect(8, 14, 16, 11, navy, 'black')
    line(10, 18, 22, 18, jade, 2)
    line(10, 22, 22, 22, ember, 2)
    rect(13, 15, 2, 2, 'cream')
    rect(18, 23, 3, 2, 'cream')
  })

  part('concurrent_record', () => {
    page(5, 4, 22, 25, graphite, pale)
    rect(8, 15, 16, 10, navy, 'black')
    line(10, 22, 14, 17, jade, 2)
    line(14, 17, 18, 22, cyan, 2)
    line(18, 22, 22, 17, ember, 2)
  })

  part('control_console', () => {
    poly([[3, 15], [7, 7], [24, 7], [28, 13], [28, 23], [24, 27], [3, 26]], graphite, 'black')
    poly([[4, 15], [8, 8], [24, 8], [25, 16]], 'silver')
    poly([[8, 13], [11, 9], [22, 9], [23, 14]], navy)
    line(13, 12, 18, 12, cyan, 2)
    rect(6, 18, 18, 5, 'black')
    rect(8, 19, 4, 3, jade)
    rect(14, 19, 4, 3, brass)
    rect(20, 19, 2, 3, ember)
    rect(7, 25, 15, 2, 'dark')
  })

  part('start_key', () => {
    poly([[3, 24], [16, 12], [21, 15], [15, 20], [15, 23], [12, 23], [12, 26], [8, 26], [6, 29], [3, 28]], 'steel', 'black')
    line(6, 25, 18, 14, 'silver', 2)
    ellipse(15, 3, 14, 14, brass, 'walnut')
    ellipse(17, 5, 10, 10, pale, 'bronze')
    ellipse(20, 8, 4, 4, graphite, 'dark')
    line(18, 7, 21, 5, 'cream', 2)
  })

  part('backup_module', () => {
    cuboid(4, 9, 18, 19, 3, graphite, 'steel', 'dark')
    rect(7, 5, 4, 6, 'copper', 'bronze')
    rect(15, 5, 4, 6, 'copper', 'bronze')
    rect(6, 12, 14, 12, navy)
    poly([[14, 12], [9, 19], [13, 19], [11, 24], [18, 17], [14, 17]], pale, null)
    line(7, 25, 19, 25, jade, 2)
    line(23, 19, 27, 17, 'steel', 2)
  })

  part('overworld_dispatch', () => {
    page(5, 5, 21, 23, graphite, jade)
    rect(5, 4, 5, 7, 'steel', 'dark')
    rect(9, 21, 8, 3, '#567e55')
    rect(18, 18, 8, 8, jade, 'dark')
    line(20, 23, 24, 21, 'cream', 2)
  })

  part('nether_dispatch', () => {
    page(5, 6, 20, 21, '#693b38', ember)
    poly([[19, 4], [28, 4], [28, 15], [24, 13], [19, 15]], '#9e5146', 'rust')
    rect(9, 20, 9, 3, '#a87960')
    ellipse(17, 18, 9, 9, ember, 'rust')
    rect(21, 20, 2, 5, pale)
  })

  part('end_dispatch', () => {
    page(7, 5, 19, 23, '#564267', purple)
    poly([[7, 5], [3, 10], [3, 24], [7, 26]], '#837192', 'dark')
    poly([[21, 17], [27, 21], [21, 27], [15, 22]], purple, '#554263')
    rect(19, 20, 4, 4, 'cream')
  })

  part('steel_lot', () => {
    cuboid(3, 11, 20, 16, 3, 'iron', 'silver', graphite)
    rect(6, 13, 14, 10, 'dark')
    rect(8, 15, 10, 2, 'silver')
    rect(8, 19, 10, 2, 'steel')
    rect(5, 24, 5, 3, 'dark')
    rect(17, 24, 5, 3, 'dark')
    line(24, 22, 27, 20, 'silver', 2)
  })

  part('polymer_lot', () => {
    cuboid(5, 9, 17, 19, 3, '#887044', pale, 'wood')
    rect(7, 11, 13, 14, 'cream')
    rect(7, 14, 13, 8, '#587e65')
    rect(12, 14, 4, 8, jade)
    line(8, 23, 19, 23, 'straw', 2)
    rect(7, 7, 4, 3, 'bronze')
    rect(15, 7, 4, 3, 'bronze')
  })

  part('logic_lot', () => {
    caseBody(navy, 'steel', graphite)
    rect(8, 16, 10, 6, '#3f8179')
    rect(11, 17, 4, 4, 'glass')
    rect(4, 10, 4, 4, 'copper', 'dark')
    rect(18, 10, 4, 4, 'copper', 'dark')
    line(7, 25, 18, 25, purple, 2)
  })

  part('black_start_record', () => {
    page(6, 5, 19, 23, 'black', brass)
    poly([[17, 17], [12, 22], [16, 22], [13, 26], [22, 20], [18, 20]], '#89622b', null)
    rect(6, 6, 4, 21, 'dark')
  })

  part('outage_record', () => {
    page(4, 6, 23, 22, '#6d4345', ember)
    line(9, 21, 13, 21, 'red', 2)
    line(13, 21, 16, 24, 'red', 2)
    line(16, 24, 20, 24, 'red', 2)
    line(20, 24, 23, 18, 'red', 2)
  })

  part('shift_record', () => {
    page(7, 4, 19, 23, navy, cyan)
    rect(4, 7, 6, 21, '#526983', 'dark')
    rect(17, 20, 8, 5, '#3f7c68')
    line(18, 23, 22, 21, 'cream', 2)
    line(8, 26, 24, 26, 'steel', 2)
  })

  part('heavy_backplane', () => {
    cuboid(3, 11, 21, 16, 2, graphite, 'steel', 'dark')
    rect(6, 13, 15, 11, '#355754')
    rect(7, 14, 3, 8, brass)
    rect(12, 14, 3, 8, brass)
    rect(17, 14, 3, 8, brass)
    line(6, 24, 21, 24, 'silver', 2)
    rect(4, 8, 5, 4, 'silver', 'dark')
    rect(17, 8, 5, 4, 'silver', 'dark')
  })

  part('breaker_core', () => {
    cuboid(5, 7, 17, 21, 3, graphite, 'silver', 'dark')
    rect(7, 10, 13, 14, 'black')
    rect(10, 6, 7, 5, brass, 'bronze')
    rect(10, 23, 7, 4, 'copper', 'bronze')
    poly([[8, 17], [17, 11], [20, 14], [11, 21]], 'silver', 'dark')
    rect(17, 14, 3, 3, ember)
  })

  part('reserve_bus', () => {
    poly([[3, 19], [20, 7], [27, 8], [28, 15], [11, 26], [3, 25]], 'bronze', 'walnut')
    poly([[4, 19], [20, 7], [27, 8], [11, 21]], pale)
    line(7, 21, 24, 10, 'copper', 2)
    rect(6, 20, 4, 4, 'dark')
    rect(21, 10, 4, 4, 'dark')
    line(12, 24, 26, 14, brass, 2)
  })

  part('control_relay', () => {
    cuboid(6, 7, 15, 18, 3, navy, 'silver', graphite)
    rect(8, 10, 11, 10, '#4c837c')
    line(9, 17, 17, 11, 'glass', 2)
    rect(10, 15, 6, 4, brass)
    rect(8, 23, 3, 6, 'copper', 'bronze')
    rect(14, 23, 3, 6, 'copper', 'bronze')
    rect(18, 23, 3, 4, 'steel')
  })

  part('telemetry_unit', () => {
    cuboid(4, 12, 19, 15, 3, graphite, 'steel', navy)
    rect(6, 14, 15, 8, 'black')
    line(8, 19, 11, 16, cyan, 2)
    line(11, 16, 14, 19, cyan, 2)
    line(14, 19, 19, 16, jade, 2)
    line(19, 10, 24, 4, 'silver', 2)
    rect(23, 3, 4, 4, pale, 'dark')
    line(8, 24, 17, 24, 'silver', 2)
  })

  part('test_load', () => {
    cuboid(3, 11, 22, 15, 2, graphite, 'iron', 'dark')
    rect(5, 13, 18, 10, 'black')
    for (const x of [7, 12, 17]) {
      rect(x, 13, 3, 10, 'bronze')
      line(x, 14, x, 21, 'copper', 2)
    }
    rect(4, 24, 6, 4, 'steel', 'dark')
    rect(17, 24, 6, 4, 'steel', 'dark')
    line(6, 10, 23, 10, pale, 2)
  })

  part('emergency_rectifier', () => {
    caseBody('#625148', brass, 'dark')
    poly([[8, 15], [8, 23], [15, 19]], pale, null)
    line(17, 15, 17, 23, pale, 2)
    rect(24, 18, 4, 4, ember, 'rust')
    rect(5, 8, 4, 4, 'copper', 'bronze')
    rect(15, 8, 4, 4, 'copper', 'bronze')
  })

  part('isolated_bus', () => {
    poly([[3, 17], [18, 7], [27, 7], [29, 15], [15, 25], [5, 27], [3, 23]], navy)
    poly([[4, 18], [18, 8], [27, 8], [14, 19]], 'silver')
    line(7, 20, 24, 10, brass, 2)
    line(7, 23, 24, 13, cyan, 2)
    rect(4, 20, 4, 5, 'steel', 'edge')
    rect(23, 10, 5, 4, 'steel', 'edge')
  })

  part('control_rack', () => {
    cuboid(6, 7, 17, 21, 2, graphite, 'steel', 'dark')
    rect(8, 9, 13, 16, 'black')
    for (const y of [10, 15, 20]) {
      rect(9, y, 11, 4, 'iron')
      rect(10, y, 3, 3, jade)
      rect(15, y, 4, 2, 'silver')
    }
    rect(7, 26, 3, 3, 'black')
    rect(19, 26, 3, 3, 'black')
  })

  part('warehouse_seal', () => {
    ellipse(5, 5, 22, 22, 'bronze', 'walnut')
    ellipse(6, 4, 20, 20, brass, 'bronze')
    ellipse(10, 8, 12, 12, pale, 'bronze')
    rect(13, 11, 6, 6, '#67543a', 'bronze')
    rect(14, 12, 4, 3, 'cream')
    poly([[18, 22], [23, 21], [28, 27], [23, 28]], '#8f5941', 'rust')
  })

  part('reinforced_billet', () => {
    poly([[3, 16], [11, 9], [23, 6], [29, 11], [29, 19], [21, 26], [9, 28], [3, 24]], graphite, 'black')
    poly([[4, 16], [12, 10], [23, 7], [28, 11], [19, 17], [9, 21]], 'steel')
    line(10, 24, 25, 18, 'silver', 2)
    line(10, 13, 17, 19, brass, 3)
    line(18, 9, 24, 15, brass, 3)
  })

  part('polymer_preform', () => {
    poly([[3, 14], [13, 7], [26, 8], [28, 17], [19, 25], [5, 24]], '#4e7162', 'dark')
    poly([[4, 14], [13, 8], [26, 9], [18, 16], [7, 18]], '#a9c48b')
    line(6, 20, 19, 21, jade, 2)
    line(20, 19, 26, 14, '#a9c48b', 2)
    rect(11, 11, 7, 3, 'cream')
  })

  part('optics_panel', () => {
    poly([[3, 13], [12, 6], [28, 8], [28, 17], [19, 25], [3, 22]], graphite)
    poly([[4, 13], [13, 7], [27, 9], [18, 16]], 'silver')
    poly([[7, 13], [13, 9], [24, 10], [17, 14]], '#356f8d', null)
    line(9, 13, 18, 10, 'glass', 2)
    rect(7, 17, 9, 3, cyan)
    line(19, 20, 25, 15, 'steel', 2)
    rect(22, 17, 3, 3, brass)
  })

  part('serial_blank', () => {
    poly([[4, 16], [12, 9], [28, 9], [28, 17], [19, 24], [4, 24]], 'iron', 'black')
    poly([[5, 16], [13, 10], [27, 10], [19, 16]], 'silver')
    ellipse(7, 17, 6, 5, graphite, 'dark')
    line(15, 20, 23, 15, 'steel', 2)
  })

  part('serial_steel', () => {
    poly([[4, 17], [12, 10], [28, 10], [28, 17], [19, 24], [4, 24]], graphite)
    poly([[5, 17], [13, 11], [27, 11], [18, 17]], 'silver')
    rect(7, 18, 5, 4, brass)
    for (const x of [15, 19, 23]) rect(x, 13, 2, 3, 'iron')
    line(13, 21, 23, 16, 'steel', 2)
  })

  part('serial_polymer', () => {
    poly([[4, 12], [14, 7], [26, 10], [27, 18], [17, 25], [5, 23]], '#527761', 'dark')
    poly([[5, 12], [14, 8], [25, 10], [16, 16]], jade)
    rect(6, 16, 8, 4, 'cream')
    line(19, 21, 25, 16, pale, 2)
    rect(10, 17, 4, 3, 'bronze')
  })

  part('serial_logic', () => {
    cuboid(4, 11, 20, 14, 2, navy, 'steel', graphite)
    rect(7, 13, 14, 8, '#547579')
    rect(10, 14, 6, 6, purple)
    rect(17, 14, 3, 3, cyan)
    for (const x of [6, 11, 16, 21]) rect(x, 22, 2, 4, brass)
  })

  part('commissioning_report', () => {
    cuboid(5, 8, 18, 20, 3, navy, 'steel', graphite)
    rect(8, 9, 13, 16, 'cream')
    rect(10, 11, 9, 4, brass)
    line(10, 17, 18, 17, 'iron', 2)
    line(10, 20, 15, 20, 'iron', 2)
    ellipse(16, 19, 10, 9, brass, 'bronze')
    line(18, 23, 22, 21, 'cream', 2)
    rect(5, 8, 3, 20, '#52443b')
    rect(5, 12, 3, 3, pale)
    rect(5, 22, 3, 3, pale)
  })
}
