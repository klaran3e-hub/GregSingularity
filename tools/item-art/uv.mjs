export default function drawUvItems({ item, poly, rect, ellipse, line, cuboid }) {
  const part = (name, draw) => item('uv_' + name, draw)
  const navy = '#293f58'
  const slate = '#4b6980'
  const cyan = '#68b8c5'
  const jade = '#38764c'
  const lime = '#a0d16a'

  part('duranium_target', () => {
    ellipse(5, 11, 22, 16, 'iron', 'black')
    ellipse(5, 6, 22, 16, 'silver')
    ellipse(8, 8, 16, 12, slate, 'dark')
    ellipse(11, 9, 10, 9, cyan, navy)
    rect(14, 11, 4, 4, 'glass')
    line(8, 15, 10, 18, 'white', 2)
    line(11, 23, 22, 22, 'steel', 2)
  })

  part('tritanium_preform', () => {
    poly([[4, 19], [9, 12], [21, 6], [27, 8], [29, 16], [24, 23], [12, 28], [5, 25]], '#873c42', 'edge')
    poly([[4, 19], [9, 12], [21, 6], [27, 8], [25, 15], [12, 22]], '#e38b5c')
    poly([[8, 16], [19, 9], [24, 9], [22, 13], [12, 19]], '#ffe4a5', null)
    line(12, 23, 24, 17, 'red', 2)
    line(10, 25, 19, 23, '#c55b49', 2)
  })

  part('laminate_preform', () => {
    cuboid(4, 19, 18, 8, 3, 'iron', 'steel', 'dark')
    cuboid(5, 14, 15, 6, 4, '#917b66', 'paper', 'wood')
    cuboid(3, 9, 17, 5, 4, slate, cyan, navy)
    rect(6, 11, 12, 2, 'glass')
    rect(8, 21, 4, 4, 'dark')
    rect(14, 21, 4, 4, 'silver')
  })

  part('structural_laminate', () => {
    poly([[3, 13], [13, 6], [28, 10], [28, 17], [18, 25], [3, 21]], slate, 'dark')
    poly([[3, 13], [13, 6], [28, 10], [18, 18]], 'silver')
    poly([[7, 13], [14, 9], [24, 11], [17, 15]], navy, null)
    line(8, 13, 16, 10, cyan, 2)
    line(5, 17, 17, 20, 'white', 2)
    line(19, 21, 26, 15, 'steel', 2)
  })

  part('flux_shunt', () => {
    poly([[4, 16], [20, 5], [28, 8], [28, 17], [23, 20], [23, 13], [10, 22], [10, 28], [4, 26]], navy)
    poly([[4, 16], [20, 5], [28, 8], [12, 20]], 'silver')
    line(7, 17, 22, 7, 'white', 2)
    poly([[10, 22], [23, 13], [25, 15], [13, 24]], 'bronze')
    rect(5, 22, 4, 4, 'copper')
    rect(24, 14, 4, 4, 'copper')
  })

  part('phase_interlock', () => {
    cuboid(5, 9, 18, 17, 3, navy, 'silver', slate)
    rect(7, 11, 14, 9, 'black')
    rect(8, 13, 4, 4, lime)
    rect(16, 13, 4, 4, 'orange')
    rect(8, 21, 5, 3, 'steel')
    rect(16, 21, 4, 3, 'steel')
    line(24, 15, 27, 13, cyan, 2)
  })

  part('pulse_reserve', () => {
    cuboid(5, 8, 17, 21, 3, slate, 'silver', navy)
    rect(8, 4, 4, 5, 'copper', 'dark')
    rect(16, 4, 4, 5, 'copper', 'dark')
    rect(7, 11, 13, 13, navy)
    poly([[15, 11], [10, 18], [13, 18], [11, 23], [18, 16], [15, 16]], cyan, null)
    rect(7, 25, 13, 2, 'steel')
    line(23, 14, 26, 12, 'steel', 2)
  })

  part('field_cassette', () => {
    cuboid(3, 12, 20, 15, 3, navy, 'steel', slate)
    ellipse(6, 12, 15, 13, 'bronze', 'dark')
    ellipse(8, 13, 11, 10, 'copper', 'orange')
    ellipse(10, 15, 7, 6, 'black', 'dark')
    rect(3, 16, 4, 5, 'silver')
    rect(20, 16, 4, 5, 'silver')
    rect(25, 15, 3, 4, cyan)
  })

  part('reactor_standard', () => {
    poly([[8, 5], [24, 5], [28, 10], [28, 22], [24, 27], [8, 27], [4, 22], [4, 10]], slate, 'edge')
    rect(12, 3, 8, 4, 'silver')
    rect(12, 26, 8, 3, 'iron')
    ellipse(8, 8, 16, 16, 'silver', navy)
    ellipse(11, 11, 10, 10, 'black', slate)
    rect(14, 10, 3, 12, cyan)
    rect(10, 14, 12, 3, cyan)
    rect(14, 14, 3, 3, 'white')
  })

  part('naquadria_capsule', () => {
    poly([[7, 18], [20, 5], [25, 5], [28, 8], [28, 13], [15, 26], [8, 25], [5, 22]], navy, 'edge')
    poly([[9, 18], [20, 8], [25, 10], [24, 14], [13, 24], [9, 22]], jade)
    line(11, 19, 22, 9, lime, 3)
    poly([[5, 19], [8, 16], [15, 23], [12, 27], [7, 27], [4, 24]], 'iron')
    poly([[19, 5], [23, 3], [28, 7], [29, 11], [25, 15], [19, 10]], 'steel')
    line(23, 5, 27, 8, 'silver', 2)
  })

  part('neutronium_coupon', () => {
    poly([[4, 12], [15, 6], [28, 12], [28, 21], [17, 27], [4, 22]], '#777c9c')
    poly([[4, 12], [15, 6], [28, 12], [17, 19]], 'white')
    line(6, 17, 17, 23, 'silver', 2)
    line(19, 22, 25, 18, 'steel', 2)
    rect(13, 10, 4, 3, slate)
    rect(19, 12, 4, 3, slate)
    rect(11, 14, 4, 3, slate)
  })

  part('quench_cassette', () => {
    cuboid(3, 14, 21, 13, 2, slate, 'steel', navy)
    rect(5, 8, 5, 7, 'silver', 'dark')
    rect(17, 8, 5, 7, 'silver', 'dark')
    rect(5, 16, 17, 9, navy)
    for (const x of [6, 10, 14, 18]) rect(x, 17, 2, 7, 'glass')
    rect(24, 20, 4, 4, cyan)
  })

  part('grid_witness', () => {
    poly([[4, 13], [13, 13], [13, 4], [20, 4], [20, 13], [28, 13], [28, 20], [20, 20], [20, 28], [13, 28], [13, 20], [4, 20]], navy)
    rect(6, 15, 5, 3, 'copper')
    rect(22, 15, 5, 3, 'copper')
    rect(15, 6, 3, 5, 'copper')
    rect(15, 22, 3, 5, 'copper')
    rect(11, 11, 11, 11, slate, 'steel')
    ellipse(13, 13, 7, 7, cyan, navy)
    rect(15, 14, 3, 3, 'white')
  })

  part('freight_manifest', () => {
    rect(5, 5, 22, 24, 'wood', 'edge')
    rect(7, 8, 18, 19, 'paper')
    rect(10, 3, 12, 6, 'steel', 'dark')
    rect(9, 11, 13, 3, slate)
    for (const y of [17, 21]) {
      rect(9, y, 3, 2, jade)
      rect(14, y, 8, 2, '#897c69')
    }
    rect(21, 24, 4, 3, cyan)
  })

  part('commissioning_report', () => {
    poly([[4, 8], [20, 8], [25, 4], [28, 5], [28, 24], [22, 29], [4, 29]], navy, 'edge')
    rect(6, 9, 14, 17, 'paper')
    poly([[20, 9], [26, 6], [26, 22], [20, 26]], '#b6aa9a', null)
    rect(6, 9, 3, 17, slate)
    for (const y of [12, 16, 20]) rect(10, y, 8, 2, '#807365')
    ellipse(14, 17, 11, 10, jade, navy)
    line(17, 21, 19, 23, lime, 2)
    line(19, 23, 22, 19, lime, 2)
  })
}
