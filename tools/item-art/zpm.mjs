export default function drawZpmItems({ item, poly, rect, ellipse, line, cuboid }) {
  const part = (name, draw) => item('zpm_' + name, draw)
  const plum = '#574363'
  const mauve = '#ba8ad0'
  const graphite = '#44414e'

  part('end_heavy_concentrate', () => {
    poly([[3, 24], [7, 18], [10, 18], [12, 11], [19, 7], [24, 11], [25, 17], [29, 22], [27, 27], [7, 28]], 'dark', 'black')
    poly([[5, 23], [11, 19], [14, 13], [19, 9], [23, 13], [19, 19], [12, 24]], '#68646f')
    rect(16, 12, 4, 2, 'steel')
    rect(10, 20, 4, 2, mauve)
    rect(20, 21, 4, 2, 'iron')
    rect(24, 23, 2, 2, 'silver')
    line(9, 26, 24, 26, 'edge', 2)
  })

  part('nether_isotope_salt', () => {
    poly([[4, 22], [8, 15], [12, 17], [12, 10], [18, 5], [22, 8], [23, 15], [26, 13], [29, 20], [25, 26], [16, 28], [7, 27]], '#bd9477', 'walnut')
    poly([[8, 21], [10, 17], [15, 19], [17, 26], [8, 25]], 'paper')
    poly([[14, 12], [18, 7], [21, 10], [20, 19], [17, 21]], '#eedfc4')
    line(16, 11, 16, 17, 'cream', 2)
    poly([[20, 23], [26, 15], [27, 20], [24, 24]], '#d2ae90')
  })

  part('europium_target', () => {
    ellipse(4, 9, 24, 18, 'dark', 'black')
    ellipse(4, 5, 24, 18, 'silver')
    ellipse(8, 7, 16, 14, 'iron', 'dark')
    ellipse(10, 8, 12, 12, '#868299', 'steel')
    ellipse(13, 11, 6, 6, 'copper', 'bronze')
    line(8, 18, 11, 20, 'white', 2)
    line(14, 24, 24, 22, 'iron', 2)
  })

  part('laminate_preform', () => {
    cuboid(3, 21, 18, 6, 4, graphite, 'steel', 'dark')
    cuboid(3, 15, 18, 4, 4, 'iron', 'paper', 'clay')
    cuboid(3, 9, 18, 4, 4, 'steel', 'silver', 'iron')
    line(5, 22, 18, 22, 'silver', 2)
    line(6, 9, 19, 9, 'white', 2)
  })

  part('neutron_laminate', () => {
    cuboid(3, 17, 18, 10, 4, graphite, 'steel', 'dark')
    poly([[3, 17], [11, 13], [28, 13], [20, 17]], 'silver')
    poly([[6, 16], [13, 12], [25, 12], [19, 16]], '#e6dabb', 'iron')
    rect(4, 20, 16, 2, 'paper')
    rect(4, 24, 16, 2, 'steel')
    line(22, 20, 26, 18, 'iron', 2)
    line(22, 23, 26, 21, '#b6aa9a', 2)
  })

  part('flux_busbar', () => {
    poly([[3, 20], [20, 5], [28, 5], [29, 12], [12, 27], [4, 27]], 'dark')
    poly([[3, 20], [20, 5], [28, 5], [28, 9], [11, 24], [4, 24]], 'steel', 'dark')
    poly([[6, 19], [21, 7], [26, 7], [10, 21]], 'silver', null)
    rect(21, 7, 5, 4, 'bronze')
    rect(5, 19, 5, 5, 'bronze')
    rect(22, 7, 3, 2, 'copper')
    rect(6, 19, 3, 2, 'copper')
    line(12, 22, 24, 12, 'iron', 2)
  })

  part('phase_module', () => {
    cuboid(4, 11, 19, 14, 3, graphite, 'steel', 'dark')
    rect(6, 13, 14, 9, plum)
    rect(8, 15, 10, 5, 'black')
    line(8, 18, 10, 18, mauve, 2)
    line(10, 18, 12, 15, mauve, 2)
    line(12, 15, 17, 15, mauve, 2)
    for (const x of [6, 11, 16]) rect(x, 23, 3, 4, 'copper')
    rect(24, 15, 3, 3, 'teal')
  })

  part('coil_cartridge', () => {
    cuboid(3, 11, 20, 16, 3, 'dark', 'steel', graphite)
    rect(5, 13, 16, 10, 'black')
    for (const x of [6, 11, 16]) {
      rect(x, 14, 4, 8, 'bronze')
      rect(x, 14, 2, 6, 'copper')
      rect(x + 1, 14, 2, 2, 'orange')
    }
    rect(4, 24, 17, 2, 'iron')
    line(24, 22, 28, 20, 'silver', 2)
  })

  part('reactor_standard', () => {
    cuboid(3, 24, 20, 5, 3, graphite, 'steel', 'dark')
    rect(5, 9, 4, 16, 'iron', 'dark')
    rect(20, 9, 4, 16, 'iron', 'dark')
    rect(5, 7, 19, 5, 'silver', 'edge')
    ellipse(9, 11, 12, 13, 'bronze', 'dark')
    ellipse(12, 14, 6, 7, 'clear', 'black')
    rect(12, 12, 6, 3, mauve)
    rect(13, 24, 5, 3, 'copper')
  })

  part('isotope_capsule', () => {
    rect(10, 5, 12, 23, graphite)
    rect(11, 8, 10, 16, '#65717f', 'edge')
    rect(13, 9, 6, 13, plum, 'black')
    rect(14, 11, 4, 8, mauve)
    rect(14, 12, 2, 4, '#e2bde7')
    rect(9, 5, 14, 5, 'steel', 'edge')
    rect(9, 23, 14, 5, 'iron', 'edge')
    rect(10, 6, 10, 2, 'silver')
  })

  function cask(name, window, lamp) {
    part(name, () => {
      ellipse(6, 20, 20, 9, 'dark')
      rect(6, 8, 20, 17, 'iron', 'edge')
      rect(9, 10, 4, 13, 'steel')
      rect(21, 10, 4, 13, 'dark')
      ellipse(6, 3, 20, 11, 'steel')
      ellipse(10, 5, 12, 6, 'dark')
      rect(12, 6, 7, 3, 'silver')
      rect(6, 12, 20, 3, graphite)
      rect(6, 22, 20, 3, graphite)
      rect(12, 15, 10, 8, window, 'edge')
      rect(15, 17, 4, 4, lamp)
    })
  }

  cask('shielded_cask', '#82704d', '#d7af51')
  cask('irradiated_cask', plum, mauve)

  function coupon(name, surface, rim, shine, hole) {
    part(name, () => {
      poly([[3, 15], [15, 7], [28, 12], [28, 19], [16, 27], [4, 22]], rim)
      poly([[3, 15], [15, 7], [28, 12], [16, 20]], surface)
      line(5, 15, 15, 8, shine, 2)
      line(6, 16, 16, 21, shine, 2)
      for (const [x, y] of [[12, 13], [16, 10], [17, 16], [22, 13]]) rect(x, y, 3, 3, hole)
    })
  }

  coupon('hot_americium_coupon', '#e18465', '#993e42', 'orange', '#a7524a')
  coupon('americium_coupon', '#9691a2', '#5c5167', 'silver', '#3e3647')

  part('reserve_switchgear', () => {
    cuboid(3, 9, 21, 18, 3, graphite, 'steel', 'dark')
    rect(5, 12, 16, 12, 'iron')
    rect(7, 14, 4, 7, 'black')
    rect(13, 14, 5, 7, 'black')
    rect(8, 16, 2, 4, 'copper')
    rect(14, 16, 3, 3, 'gold')
    rect(16, 22, 4, 2, 'green')
    line(25, 17, 28, 15, 'silver', 2)
  })

  part('freight_certificate', () => {
    rect(6, 4, 21, 24, 'bronze', 'edge')
    rect(4, 6, 20, 21, 'paper', 'dark')
    rect(7, 9, 13, 3, 'teal')
    rect(7, 14, 8, 2, '#877661')
    rect(7, 18, 6, 2, '#877661')
    ellipse(15, 17, 10, 10, plum)
    ellipse(17, 19, 6, 6, 'teal', mauve)
  })

  part('commissioning_report', () => {
    rect(4, 5, 23, 23, graphite, 'black')
    rect(7, 6, 17, 20, 'paper')
    rect(11, 4, 8, 4, 'steel', 'iron')
    for (const y of [10, 14, 18]) rect(9, y, 11, 2, 'dark')
    poly([[16, 21], [20, 17], [26, 17], [29, 21], [26, 27], [20, 28]], plum, 'dark')
    line(19, 22, 22, 24, mauve, 2)
    line(22, 24, 26, 20, mauve, 2)
  })
}
