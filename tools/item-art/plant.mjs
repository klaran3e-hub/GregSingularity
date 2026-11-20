export default function drawPlant({ item, poly, rect, ellipse, line, px, cuboid }) {
  const bolts = (points, color = 'silver') => {
    points.forEach(([x, y]) => {
      rect(x, y, 2, 2, 'edge')
      px(x, y, color)
    })
  }

  // A loose pile with angular fragments at its foot. Pressed material uses a solid face instead.
  function pile(base, mid, light, chips) {
    poly([[2, 24], [5, 20], [9, 17], [11, 12], [16, 10], [20, 13], [23, 17], [27, 18], [29, 24], [24, 28], [9, 28]], base)
    poly([[5, 23], [10, 18], [13, 13], [17, 12], [20, 15], [23, 19], [28, 23], [20, 25], [13, 24]], mid, null)
    poly([[10, 19], [15, 13], [17, 13], [18, 16], [14, 18]], light, null)
    chips.forEach(([x, y, color, size = 1]) => {
      if (size === 1) px(x, y, color)
      else poly([[x, y], [x + size - 1, y - 1], [x + size, y + 1], [x + 1, y + 2]], color, null)
    })
  }

  function brick(top, front, side) {
    cuboid(3, 13, 17, 10, 5, front, top, side)
    line(6, 12, 17, 12, 'cream')
    line(20, 19, 28, 15, top)
    px(6, 20, side)
    px(8, 22, side)
    px(22, 19, 'edge')
  }

  function hotBar(top, near, far, stripe) {
    cuboid(3, 15, 19, 8, 4, near, top, far)
    line(5, 14, 20, 14, stripe)
    line(22, 18, 28, 15, 'orange')
    px(6, 7, 'orange')
    px(7, 5, 'red')
    px(24, 24, 'orange')
  }

  function seal(shoulder, material, inner, tabbed = false) {
    ellipse(3, 6, 26, 20, 'edge')
    ellipse(3, 4, 26, 20, material)
    ellipse(6, 6, 20, 14, shoulder, null)
    ellipse(8, 8, 16, 10, inner, 'edge')
    ellipse(9, 9, 14, 8, 'clear', null)
    line(10, 5, 21, 5, shoulder)
    line(12, 22, 20, 22, inner)
    if (tabbed) {
      rect(3, 14, 6, 4, shoulder, 'edge')
      rect(23, 14, 6, 4, shoulder, 'edge')
      px(5, 16, 'edge')
      px(26, 16, 'edge')
    }
  }

  item('fireclay_charge', () => {
    pile('#765749', 'clay', '#c79c78', [[7, 23, 'cream', 2], [13, 20, '#876756', 2], [18, 17, 'cream'], [21, 22, '#8b6254', 2], [25, 26, 'clay'], [12, 25, 'cream']])
  })
  item('coke_brick_blank', () => {
    brick('#b38175', '#946153', '#7d5148')
    line(8, 14, 23, 8, '#89574e')
    line(11, 16, 26, 10, '#89574e')
    px(17, 22, '#593c38')
  })
  item('refractory_brick_blank', () => {
    brick('#ccb58d', '#b29972', '#9f7a59')
    poly([[8, 12], [12, 10], [15, 12], [11, 14]], '#7b6551', null)
    poly([[17, 8], [21, 7], [24, 9], [20, 11]], '#7b6551', null)
    line(12, 24, 21, 20, '#ba9875')
  })
  item('coking_charge', () => {
    pile('#24272c', '#42464a', '#66696b', [[4, 24, 'dark', 3], [11, 23, '#65605b', 3], [16, 19, '#1d2026', 3], [19, 15, '#8e7c5b'], [22, 21, '#2c2932', 3], [26, 25, '#5e5144', 2], [9, 18, 'iron']])
  })
  item('lime_flux', () => {
    pile('#857d6b', '#d1c5a4', '#f2e6c7', [[6, 22, 'cream', 2], [12, 25, '#a09577', 2], [16, 19, 'white'], [21, 18, 'cream', 2], [25, 23, 'white', 2], [27, 27, '#d1c5a4'], [4, 28, '#d1c5a4']])
  })
  item('steel_furnace_charge', () => {
    pile('#433d3c', '#5b5550', 'iron', [[6, 22, 'black', 3], [10, 17, 'rust', 4], [13, 24, 'steel', 4], [19, 19, '#a87053', 4], [23, 24, 'dark', 4], [19, 26, 'bronze'], [16, 14, '#d7c3a0']])
  })
  item('steel_press_blank', () => {
    poly([[3, 13], [8, 8], [20, 4], [28, 9], [29, 15], [24, 21], [11, 27], [4, 23]], 'iron')
    poly([[4, 13], [9, 9], [20, 5], [27, 10], [23, 15], [12, 21], [7, 19]], 'steel')
    line(7, 14, 20, 7, 'silver')
    line(11, 21, 24, 15, 'dark')
    line(13, 16, 18, 14, '#6d7479')
    px(21, 10, 'silver')
    px(20, 12, 'iron')
  })
  item('pressed_steel_frame', () => {
    poly([[3, 10], [22, 3], [28, 8], [28, 22], [9, 29], [3, 24]], 'iron')
    poly([[3, 10], [22, 3], [28, 8], [9, 15]], 'silver')
    poly([[9, 15], [28, 8], [28, 22], [9, 29]], 'steel')
    poly([[12, 17], [24, 12], [24, 20], [12, 25]], 'edge', null)
    poly([[13, 17], [23, 13], [23, 20], [13, 24]], 'clear', null)
    line(12, 26, 24, 21, 'silver')
    bolts([[10, 16], [25, 10], [25, 20], [10, 25]])
  })
  item('iron_pressure_slug', () => {
    rect(7, 10, 18, 13, 'iron', 'edge')
    ellipse(7, 18, 18, 10, 'iron')
    rect(10, 11, 3, 13, 'steel')
    rect(20, 11, 3, 13, 'dark')
    ellipse(7, 5, 18, 10, 'steel')
    ellipse(10, 7, 12, 5, 'silver', null)
    line(10, 11, 18, 12, 'white')
    line(15, 24, 22, 23, 'steel')
  })
  item('furnace_lining_insert', () => {
    poly([[3, 10], [9, 7], [9, 19], [16, 23], [22, 19], [22, 7], [28, 10], [28, 22], [16, 29], [3, 22]], '#9f6348')
    poly([[3, 10], [9, 7], [12, 9], [12, 18], [16, 21], [19, 18], [19, 9], [22, 7], [28, 10], [24, 12], [24, 20], [16, 25], [7, 20], [7, 12]], '#cb9a70')
    line(9, 19, 16, 23, '#edbb82')
    line(16, 23, 22, 19, '#edbb82')
    line(4, 15, 7, 16, '#734937')
    line(24, 16, 28, 14, '#734937')
  })
  item('nickel_concentrate', () => {
    pile('#4d5852', '#819184', '#b2bca9', [[6, 23, '#9ba692', 2], [13, 19, '#b1b9a7'], [16, 23, '#586660', 3], [20, 17, 'silver'], [23, 21, '#abbda0', 2], [26, 25, '#6a7969'], [12, 26, '#9ea891']])
  })
  item('heater_alloy_charge', () => {
    pile('#674236', '#976451', '#bc835f', [[6, 22, 'copper', 3], [12, 18, '#8f9d90', 4], [16, 23, '#ad7560', 4], [19, 17, 'silver', 2], [24, 22, '#7d8980', 4], [12, 25, '#563d37'], [26, 25, '#e4aa7c']])
  })
  item('heater_ribbon', () => {
    poly([[2, 25], [2, 21], [10, 21], [10, 16], [5, 16], [5, 8], [12, 5], [26, 5], [29, 8], [29, 16], [25, 19], [19, 19], [19, 24], [16, 28], [6, 28]], 'copper')
    poly([[6, 9], [13, 6], [26, 6], [28, 8], [25, 11], [14, 11], [12, 13], [6, 12]], 'gold')
    poly([[13, 13], [15, 12], [24, 12], [24, 15], [15, 15], [15, 18], [12, 19], [12, 16]], 'clear', null)
    line(5, 23, 11, 23, '#e4a06e')
    line(15, 22, 15, 26, '#714230')
    line(26, 9, 26, 16, '#85513a')
  })
  item('washed_bauxite', () => {
    pile('#7a493b', '#ae6b53', '#d99a73', [[6, 22, '#d5a080', 3], [9, 25, '#9b5642'], [13, 18, '#8b5642', 3], [18, 15, 'cream'], [18, 22, '#be785d', 4], [24, 22, '#e0a781', 3], [25, 27, '#b57857']])
  })
  item('alumina_charge', () => {
    pile('#938578', '#d5c9b2', '#f4e6c6', [[4, 25, 'clay', 2], [9, 22, '#dca57c', 3], [14, 16, 'white'], [14, 24, '#a88d75', 2], [18, 20, '#e6d7be', 3], [23, 22, 'clay', 2], [26, 26, '#e4d5be']])
  })
  item('hot_aluminium_billet', () => hotBar('#ffd8a4', '#9b7763', '#a16c58', '#fff1cc'))
  item('pressure_gasket', () => seal('#8e785c', '#4a4744', '#27272a'))
  item('phenolic_preform', () => {
    poly([[3, 12], [21, 5], [29, 10], [29, 16], [11, 24], [3, 19]], '#a76d46')
    poly([[3, 12], [21, 5], [29, 10], [11, 18]], '#b78559')
    poly([[7, 12], [20, 7], [25, 10], [12, 16]], '#d59e62', '#8e5a3c')
    line(11, 20, 28, 13, 'copper')
    line(11, 22, 28, 15, 'gold')
    line(6, 16, 10, 18, '#d3c09c')
    bolts([[9, 11], [22, 9]])
  })
  item('sealed_mv_module', () => {
    poly([[3, 11], [21, 5], [28, 10], [28, 21], [10, 27], [3, 22]], 'iron')
    poly([[3, 11], [21, 5], [28, 10], [10, 17]], 'steel')
    poly([[9, 11], [20, 7], [24, 10], [13, 14]], '#3e5550')
    line(5, 15, 10, 19, 'black')
    line(10, 19, 28, 13, 'black')
    rect(13, 19, 4, 4, 'dark', 'edge')
    rect(20, 17, 4, 4, 'dark', 'edge')
    px(14, 20, 'gold')
    px(21, 18, 'gold')
    bolts([[5, 11], [24, 10], [10, 15]])
  })
  item('mv_rotor_core', () => {
    poly([[2, 18], [21, 8], [26, 10], [27, 14], [8, 24], [3, 23]], 'steel')
    poly([[8, 13], [17, 9], [22, 12], [23, 19], [15, 24], [8, 20]], 'iron')
    poly([[8, 13], [17, 9], [22, 12], [14, 16]], 'silver')
    line(10, 15, 17, 11, 'copper')
    line(12, 16, 19, 12, 'gold')
    line(14, 19, 21, 15, 'copper')
    line(15, 22, 22, 18, 'gold')
    line(24, 10, 28, 8, 'silver')
    line(4, 21, 8, 19, 'silver')
  })
  item('seismic_probe', () => {
    poly([[3, 25], [14, 14], [21, 20], [10, 29], [5, 29]], 'iron')
    poly([[4, 25], [15, 14], [17, 16], [7, 27], [4, 27]], 'silver', null)
    line(8, 27, 18, 17, '#808090', 2)
    poly([[10, 20], [15, 15], [21, 20], [16, 25]], 'dark')
    line(11, 20, 17, 23, 'bronze', 2)
    poly([[12, 13], [22, 3], [28, 8], [28, 13], [19, 22], [12, 17]], 'iron')
    poly([[12, 13], [22, 3], [28, 8], [18, 18]], 'steel')
    poly([[15, 12], [22, 5], [26, 8], [19, 15]], '#1f4c16')
    line(18, 12, 22, 8, '#9ecb95', 2)
    line(20, 18, 26, 12, 'dark', 2)
    line(14, 15, 17, 18, 'copper', 2)
  })
  item('drill_seal_head', () => {
    poly([[5, 8], [24, 8], [27, 13], [26, 17], [23, 18], [20, 26], [16, 29], [12, 27], [8, 19], [4, 17]], 'iron')
    ellipse(4, 5, 24, 13, 'steel')
    ellipse(9, 3, 14, 11, 'iron')
    ellipse(12, 4, 8, 5, 'dark')
    line(7, 15, 24, 14, 'black', 2)
    poly([[9, 19], [13, 16], [16, 23], [14, 27], [11, 24]], 'silver')
    poly([[16, 22], [20, 16], [24, 18], [21, 25], [17, 28]], 'steel')
    line(13, 19, 12, 23, 'white')
    line(21, 18, 19, 23, 'silver')
    bolts([[6, 11], [23, 10]])
  })
  item('strainer_mesh', () => {
    rect(4, 7, 24, 19, 'iron', 'edge')
    rect(4, 5, 24, 19, 'silver', 'edge')
    rect(7, 8, 18, 13, 'clear', 'dark')
    for (const x of [10, 13, 16, 19, 22]) line(x, 8, x, 20, 'steel')
    for (const y of [11, 14, 17]) line(8, y, 23, y, '#a6aca0')
    bolts([[5, 6], [25, 6], [5, 21], [25, 21]])
  })

  function cartridge(body, filter, ribs, dirty = false) {
    rect(7, 8, 18, 17, body, 'edge')
    ellipse(7, 20, 18, 8, body)
    rect(6, 9, 20, 4, 'steel', 'edge')
    ellipse(6, 5, 20, 8, 'silver')
    ellipse(12, 6, 8, 4, 'dark')
    rect(10, 13, 12, 10, filter, 'edge')
    for (let x = 11; x <= 21; x += 2) line(x, 14, x, 22, ribs)
    rect(7, 22, 18, 3, 'iron', 'edge')
    line(8, 24, 23, 24, body)
    if (dirty) {
      poly([[11, 13], [18, 13], [17, 17], [16, 17], [16, 21], [14, 23], [13, 18]], '#392b25', null)
      rect(23, 17, 2, 6, '#503522')
      px(14, 22, '#a87747')
    }
  }

  item('oil_wash_cartridge', () => cartridge('#718a7c', '#d4c493', '#a39773'))
  item('spent_oil_cartridge', () => cartridge('#685646', '#90775b', '#675440', true))
  item('drum_liner', () => {
    rect(6, 10, 20, 13, 'steel', 'edge')
    ellipse(6, 19, 20, 9, 'steel')
    rect(8, 11, 3, 13, 'silver')
    rect(21, 12, 3, 12, 'iron')
    ellipse(6, 5, 20, 11, 'silver')
    ellipse(9, 7, 14, 7, '#233134')
    line(9, 13, 22, 13, 'copper')
    rect(7, 18, 18, 2, 'dark')
    line(9, 22, 13, 23, '#b6bfc1')
  })
  item('refinery_tray', () => {
    ellipse(3, 10, 26, 16, 'iron')
    ellipse(3, 7, 26, 16, 'silver')
    ellipse(6, 9, 20, 12, 'steel', 'dark')
    for (const y of [11, 14, 17]) {
      for (const x of [9, 13, 17, 21]) rect(x, y, 2, 2, 'dark')
    }
    line(9, 9, 22, 9, 'white')
    line(9, 21, 22, 21, 'silver')
  })
  item('heat_exchange_core', () => {
    cuboid(8, 9, 16, 17, 3, 'dark', 'steel', 'iron')
    for (const x of [9, 13, 17, 21]) {
      rect(x, 13, 2, 8, 'silver')
      rect(x + 2, 13, 1, 8, '#808090')
      line(x + 1, 8, x + 5, 6, 'silver')
    }
    rect(7, 9, 17, 3, 'bronze')
    rect(7, 22, 17, 3, 'bronze')
    rect(2, 8, 6, 5, 'bronze', 'edge')
    rect(2, 21, 6, 5, 'bronze', 'edge')
    line(3, 9, 17, 9, 'copper', 2)
    line(3, 22, 17, 22, 'copper', 2)
    line(25, 15, 28, 13, 'steel')
    line(25, 20, 28, 18, 'steel')
  })
  item('cracking_catalyst', () => {
    for (const [x, y] of [[3, 17], [10, 20], [19, 17], [12, 11], [6, 11], [21, 11]]) {
      rect(x, y + 2, 7, 5, '#7c5d43', 'edge')
      ellipse(x, y + 3, 7, 6, '#9d7855')
      ellipse(x, y, 7, 6, '#c19b70')
      rect(x + 2, y + 2, 3, 2, '#604d3e')
      px(x + 2, y + 1, '#e4c095')
    }
  })
  item('activated_carrier', () => {
    poly([[3, 17], [6, 11], [11, 9], [18, 10], [25, 13], [28, 20], [22, 26], [9, 27]], '#545e44')
    poly([[5, 17], [10, 11], [17, 11], [24, 14], [26, 20], [20, 23], [10, 24]], '#89916a', null)
    for (const [x, y] of [[8, 16], [12, 13], [17, 14], [21, 16], [11, 20], [15, 18], [18, 21], [22, 20], [13, 23]]) {
      rect(x, y, 2, 2, '#46543f')
      px(x - 1, y - 1, '#b0b18b')
    }
  })

  // All seven ampoules use the same glass. The meniscus and headspace distinguish the contents.
  function vial(contents, meniscus, band, gas = false) {
    poly([[12, 3], [19, 3], [19, 9], [23, 13], [23, 25], [20, 29], [11, 29], [8, 25], [8, 13], [12, 9]], '#59757a')
    poly([[13, 8], [18, 8], [18, 10], [21, 14], [21, 24], [19, 27], [12, 27], [10, 24], [10, 14], [13, 10]], '#30494d', null)
    if (contents && !gas) {
      poly([[10, 18], [13, 17], [18, 17], [21, 18], [21, 24], [19, 27], [12, 27], [10, 24]], contents, null)
      line(11, 18, 20, 18, meniscus)
    }
    if (gas) {
      for (const [x, y, length] of [[12, 15, 4], [16, 18, 4], [13, 21, 4], [15, 23, 5]]) line(x, y, x + length, y, meniscus)
      px(18, 14, contents)
      px(13, 18, contents)
    }
    line(10, 15, 10, 24, '#c6e1df')
    line(12, 12, 13, 10, '#aecdcf')
    line(19, 26, 20, 24, '#94b8b7')
    px(12, 26, '#98bbba')
    rect(11, 3, 10, 5, 'silver', 'edge')
    rect(12, 7, 8, 3, band, 'edge')
    line(12, 4, 19, 4, 'white')
  }

  item('sample_ampoule', () => vial(null, null, 'steel'))
  item('washed_oil_sample', () => vial('#39312e', '#92745b', 'dark'))
  item('heavy_fuel_sample', () => vial('#663f2d', '#a4714a', 'rust'))
  item('light_fuel_sample', () => vial('#af873d', '#e1b962', 'gold'))
  item('naphtha_sample', () => vial('#c2b89c', '#eee4ba', 'cream'))
  item('refinery_gas_sample', () => vial('#669d9d', '#8dbdbe', 'teal', true))
  item('diesel_sample', () => vial('#c06b3c', '#efab61', 'copper'))
  item('paraffin_cake', () => {
    poly([[3, 16], [8, 11], [12, 10], [14, 7], [23, 7], [28, 12], [28, 18], [23, 24], [10, 26], [4, 22]], '#b89f70')
    poly([[4, 16], [8, 12], [13, 11], [15, 8], [22, 8], [27, 12], [24, 17], [19, 19], [9, 21]], '#e6d5a5', null)
    line(7, 16, 17, 12, '#fcf0c7')
    line(6, 22, 10, 24, '#d0bb8f')
    line(14, 22, 23, 20, '#d4bf92')
    px(20, 14, '#c0ac85')
  })
  item('polymer_seal_preform', () => seal('#cfac86', '#bc916d', '#ac7655', true))
  item('chemical_grade_seal', () => seal('#93a993', '#4f6e62', '#364740', true))
  item('process_commissioning_kit', () => {
    cuboid(3, 11, 22, 17, 2, '#4d6562', 'steel', 'dark')
    poly([[10, 6], [10, 4], [20, 4], [20, 7]], null, 'edge')
    line(11, 5, 19, 5, 'silver')
    rect(8, 16, 11, 7, 'paper', 'edge')
    line(10, 18, 17, 18, 'dark')
    line(10, 20, 15, 20, 'iron')
    rect(6, 12, 3, 4, 'bronze', 'edge')
    rect(19, 12, 3, 4, 'bronze', 'edge')
  })

  item('nether_transit_seal', () => {
    poly([[6, 7], [19, 3], [25, 6], [27, 10], [26, 26], [12, 29], [6, 26]], '#4d4a46')
    poly([[8, 8], [19, 5], [24, 8], [25, 11], [24, 24], [13, 27], [8, 25]], '#cbb894')
    line(12, 10, 20, 8, '#584d46')
    line(12, 13, 21, 11, '#584d46')
    line(12, 16, 17, 15, '#8d6f5b')
    line(20, 20, 23, 27, '#7f3831', 2)
    ellipse(14, 16, 10, 10, '#9d4b3a')
    ellipse(16, 18, 6, 6, '#b66c54', null)
    line(19, 19, 19, 22, '#e7a37c')
    px(18, 22, '#e7a37c')
  })
  item('basalt_grit', () => {
    pile('#303036', '#4e4d55', '#6d6a76', [[6, 23, '#5f5962', 3], [10, 19, '#302e36', 3], [14, 17, '#91818c'], [17, 22, '#55505b', 3], [21, 17, '#897a87'], [25, 23, '#34323c', 3], [12, 26, '#77707c']])
  })
  item('chromite_concentrate', () => {
    pile('#3a4538', '#626a48', '#8e9160', [[7, 22, '#afad73', 2], [12, 19, '#4b5842', 3], [15, 16, '#b3aa77'], [17, 24, '#ac9f64', 2], [22, 20, '#536044', 4], [26, 25, '#8f9764'], [13, 26, '#4b5640']])
  })
  item('refractory_mix', () => {
    pile('#58433d', '#8f6251', '#be8a68', [[6, 22, '#a77559', 2], [11, 19, 'dark', 3], [15, 17, 'cream'], [18, 21, '#9a7158', 3], [22, 19, '#5d4c47', 3], [24, 24, '#c19274', 3], [13, 26, 'terracotta']])
  })

  function liningSection(top, front, joint) {
    poly([[3, 12], [7, 7], [12, 4], [20, 4], [25, 7], [29, 12], [29, 20], [23, 23], [23, 16], [20, 13], [12, 13], [9, 16], [9, 23], [3, 20]], front)
    poly([[3, 12], [7, 7], [12, 4], [20, 4], [25, 7], [29, 12], [23, 16], [20, 12], [12, 12], [9, 16]], top)
    line(8, 8, 12, 13, joint)
    line(15, 5, 15, 11, joint)
    line(23, 6, 20, 12, joint)
    line(4, 14, 8, 17, '#e5bd91')
    line(24, 16, 28, 14, '#e5bd91')
  }

  item('refractory_cast', () => liningSection('#b29680', '#916f5b', '#76614f'))
  item('fired_refractory_liner', () => liningSection('#ce895d', '#a65843', '#733e33'))
  item('kanthal_charge', () => {
    pile('#5f4a3c', '#8e7258', '#a9a495', [[5, 22, '#91816f', 3], [10, 21, '#c8b291', 3], [14, 17, '#69665c', 3], [17, 24, 'bronze', 4], [21, 17, '#af8465'], [23, 23, '#b9b7a4', 3], [12, 26, '#67544a']])
  })
  item('hot_kanthal_billet', () => hotBar('#ffb468', '#ab6747', '#a14831', '#ffd990'))
  item('kanthal_winding', () => {
    ellipse(16, 8, 13, 16, '#895044')
    rect(8, 8, 15, 16, 'bronze', 'edge')
    for (const x of [12, 15, 18, 21]) line(x, 9, x, 22, '#d49b63')
    ellipse(3, 8, 13, 16, '#b8875c')
    ellipse(6, 12, 7, 8, 'clear', 'edge')
    line(20, 23, 25, 27, 'copper')
  })
  item('stainless_charge', () => {
    pile('#555553', '#848982', '#b9c0ae', [[7, 22, '#c2c1ac', 4], [11, 18, '#7f946d', 3], [14, 24, '#a9ada2', 4], [17, 17, 'silver', 3], [21, 21, '#667358', 4], [25, 24, '#adb3ac', 2], [12, 26, 'iron']])
  })
  item('hot_stainless_billet', () => hotBar('#ffc88e', '#847368', '#9b5438', '#ffdda4'))
  item('ceramic_hv_substrate', () => {
    cuboid(4, 18, 16, 4, 5, '#ad9173', '#ddd0b1', '#947a61')
    line(6, 17, 18, 17, 'cream')
    for (const [x, y] of [[10, 16], [14, 16], [18, 16], [14, 14], [18, 14], [22, 14]]) px(x, y, '#776b58')
  })
  item('hv_circuit_preform', () => {
    poly([[3, 16], [17, 5], [29, 12], [29, 16], [14, 28], [3, 21]], '#1f4c16')
    poly([[3, 16], [17, 5], [29, 12], [14, 24]], '#6b9862')
    line(5, 16, 17, 7, '#9ecb95', 2)
    poly([[10, 14], [17, 9], [22, 12], [15, 18]], 'dark')
    line(11, 14, 17, 10, 'iron', 2)
    for (const [x, y] of [[9, 17], [13, 19], [17, 20], [21, 17], [25, 14]]) {
      line(x, y, x + 1, y + 2, 'gold', 2)
    }
  })
  item('sealed_hv_module', () => {
    cuboid(4, 10, 20, 14, 3, '#68717a', '#879097', '#484e51')
    rect(8, 13, 12, 7, '#45544f', 'edge')
    line(10, 15, 17, 15, 'gold', 2)
    for (const x of [6, 10, 14, 18, 22]) rect(x, 23, 2, 4, 'bronze')
    bolts([[5, 11], [21, 11], [5, 21], [21, 21]])
  })
  item('gold_conductor_blank', () => {
    poly([[2, 19], [7, 15], [23, 5], [29, 7], [29, 13], [12, 24], [7, 26], [2, 23]], '#9b7544')
    poly([[2, 19], [23, 5], [29, 7], [8, 22]], '#d9ab62')
    poly([[8, 22], [29, 7], [29, 13], [12, 24], [8, 26]], '#ad7c42')
    line(5, 19, 23, 7, '#f4d389')
    line(9, 23, 27, 11, '#ddb279')
    line(18, 17, 20, 18, '#7f6037')
  })
  item('hv_steel_coil_preform', () => {
    ellipse(5, 9, 22, 18, '#44474d', '#292c32')
    ellipse(4, 5, 23, 17, '#828995', '#30343d')
    ellipse(8, 8, 15, 11, '#626977', '#bcc3ca')
    ellipse(12, 11, 7, 5, '#242632', '#33343c')
    line(21, 19, 26, 17, '#9b643e', 2)
    line(21, 20, 24, 24, '#ba8553', 2)
    line(7, 16, 7, 22, '#a9afb6')
  })

  item('hv_winding_pack', () => {
    rect(4, 5, 24, 23, 'iron', 'edge')
    rect(6, 7, 20, 19, '#ae7245', 'edge')
    rect(11, 10, 10, 13, 'clear', 'dark')
    for (const y of [9, 12, 15, 18, 21, 24]) {
      line(7, y, 10, y, 'gold'); line(21, y, 24, y, 'gold')
    }
    rect(3, 13, 5, 5, 'steel', 'edge')
    rect(24, 13, 5, 5, 'steel', 'edge')
  })
  item('hv_arc_shield', () => {
    cuboid(4, 7, 19, 20, 3, '#bcb099', '#e9d3aa', 'iron')
    for (const y of [13, 17, 21]) {
      line(8, y, 18, y, '#7b6454', 2)
      line(8, y + 1, 18, y + 1, '#e9d3aa')
    }
    bolts([[5, 8], [20, 8], [5, 24], [20, 24]])
  })
  item('hv_switch_contact', () => {
    cuboid(3, 16, 21, 6, 2, 'bronze', 'gold', '#70513a')
    ellipse(17, 11, 12, 9, '#a2a9a5')
    ellipse(17, 9, 12, 9, 'silver')
    line(20, 11, 25, 11, 'white')
    ellipse(5, 17, 4, 4, 'clear', 'edge')
  })
  item('hv_trial_charge', () => {
    pile('#4f5250', '#6e766f', '#9fa795', [[7, 22, '#b9a78e', 3], [11, 18, '#919e86', 4], [13, 24, '#526054', 3], [17, 16, '#ccb681'], [19, 22, '#bbc4b6', 4], [24, 25, '#9a8160', 3], [13, 26, '#8b7157']])
  })
  item('hot_hv_trial_billet', () => {
    hotBar('#ffc37d', '#a37654', '#9a5a3c', '#ffe9a6')
    line(13, 16, 22, 12, '#ffeeae')
    line(12, 15, 21, 11, '#b96e44')
  })
  item('hv_alloy_coupon', () => {
    poly([[3, 19], [8, 15], [13, 15], [19, 11], [21, 7], [27, 5], [29, 9], [28, 14], [23, 17], [20, 17], [14, 22], [12, 26], [6, 28], [3, 24]], 'steel')
    poly([[4, 19], [9, 16], [13, 16], [20, 11], [22, 8], [27, 6], [28, 9], [26, 12], [21, 15], [18, 15], [11, 21], [10, 23], [5, 24]], 'silver')
    line(10, 18, 20, 12, 'white')
    line(12, 20, 20, 15, '#717d81')
    line(15, 17, 16, 19, '#6c777a')
    px(7, 21, 'dark')
    px(24, 10, 'dark')
  })
  item('hv_commissioning_report', () => {
    poly([[6, 5], [23, 3], [27, 8], [26, 28], [7, 29], [4, 26], [4, 9]], '#766354')
    poly([[7, 7], [23, 5], [25, 8], [24, 26], [8, 27]], 'paper')
    rect(10, 3, 10, 4, 'steel', 'edge')
    line(12, 4, 18, 4, 'silver')
    line(10, 10, 22, 9, '#6e6455')
    line(10, 13, 21, 12, '#847666')
    line(10, 16, 21, 15, '#847666')
    line(10, 19, 16, 18, '#847666')
    ellipse(16, 18, 8, 7, '#a75840')
    line(18, 21, 20, 22, '#ead6a8')
    line(20, 22, 22, 19, '#ead6a8')
  })
}
