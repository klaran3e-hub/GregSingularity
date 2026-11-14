export default function precision({ item, poly, rect, ellipse, line, px, cuboid: cabinet }) {
  function cylinder(x, y, diameter, length, surface, rim) {
    const radius = Math.floor(diameter / 2)
    ellipse(x + length, y, diameter, diameter, surface)
    poly([[x + radius, y], [x + radius + length, y], [x + radius + length, y + diameter - 1],
      [x + radius, y + diameter - 1]], surface)
    rect(x + radius, y + 2, length + 2, 3, rim)
    rect(x + radius, y + diameter - 4, length + 2, 2, 'dark')
    ellipse(x, y, diameter, diameter, rim)
    line(x + 4, y + 3, x + diameter - 5, y + 3, 'silver', 2)
  }

  function fragment(x, y, color, highlight) {
    poly([[x, y + 4], [x + 2, y], [x + 6, y + 1], [x + 7, y + 5], [x + 3, y + 7]], color)
    poly([[x + 1, y + 4], [x + 2, y + 1], [x + 5, y + 2], [x + 3, y + 5]], highlight, null)
  }

  function concentrate(id, pile, light, grains) {
    item(id, () => {
      poly([[3, 23], [7, 20], [9, 15], [14, 13], [18, 8], [23, 14], [24, 19], [28, 22], [26, 26], [16, 29], [5, 27]], pile)
      poly([[5, 23], [10, 20], [11, 16], [18, 10], [21, 15], [17, 20], [10, 24]], light, null)
      for (const [x, y, ink] of grains) {
        px(x, y, ink)
        px(x + 1, y + 1, ink)
      }
      line(15, 27, 24, 25, 'dark')
    })
  }

  function mixTray(id, colors) {
    item(id, () => {
      cabinet(3, 20, 20, 5, 3, 'steel', 'iron', 'dark')
      poly([[6, 19], [10, 17], [25, 17], [21, 19]], 'black', null)
      fragment(7, 11, colors[0], colors[1])
      fragment(13, 9, colors[2], colors[3])
      fragment(20, 11, colors[4], colors[5])
      line(5, 21, 20, 21, 'silver')
    })
  }

  function cake(id, face, edge, crust, holes) {
    item(id, () => {
      poly([[4, 12], [9, 7], [25, 8], [29, 14], [27, 23], [20, 26], [7, 24], [3, 20]], edge)
      poly([[4, 13], [9, 8], [24, 9], [28, 14], [25, 19], [17, 21], [6, 19]], face)
      line(7, 13, 11, 10, crust); line(11, 10, 19, 10, crust)
      for (const [x, y, w] of holes) ellipse(x, y, w, 3, edge, null)
      line(9, 23, 17, 24, crust)
    })
  }

  function billet(id, face, side, rim, mark) {
    item(id, () => {
      poly([[3, 16], [14, 8], [24, 8], [29, 12], [29, 18], [17, 25], [6, 24], [3, 21]], side)
      poly([[3, 16], [14, 8], [24, 8], [29, 12], [17, 20], [6, 20]], face)
      poly([[5, 16], [15, 9], [24, 9], [27, 12], [16, 18], [7, 18]], rim, null)
      line(7, 22, 16, 22, face, 2)
      line(18, 21, 26, 16, face, 2)
      const x = 10 + mark[0] % 6
      line(x, 16, x + 3, 14, face, 2)
    })
  }

  function report(id, stamp, trace) {
    item(id, () => {
      poly([[5, 5], [23, 5], [28, 10], [28, 26], [7, 29], [4, 26]], 'walnut')
      poly([[6, 3], [22, 3], [26, 8], [26, 24], [23, 27], [6, 27]], 'paper')
      poly([[21, 3], [26, 8], [21, 8]], 'cream')
      rect(8, 7, 10, 2, 'iron')
      if (trace) {
        line(8, 18, 11, 18, 'iron'); line(11, 18, 13, 12, stamp); line(13, 12, 16, 19, stamp)
        line(16, 19, 19, 15, stamp); line(19, 15, 23, 15, 'iron')
      } else {
        for (const [y, w] of [[12, 13], [15, 11], [18, 7], [22, 5]]) rect(8, y, w, 1, 'iron')
      }
      ellipse(17, 19, 8, 7, stamp)
      line(19, 22, 20, 23, 'cream'); line(20, 23, 23, 21, 'cream')
    })
  }

  mixTray('iv_nichrome_charge', ['iron', 'silver', 'dark', 'green', 'steel', 'white'])
  billet('iv_hot_nichrome', '#c16b55', '#744441', '#f5ad79', [14, 15, 19, 11])
  item('iv_coil_core', () => {
    ellipse(12, 7, 18, 18, 'steel')
    cylinder(3, 9, 14, 12, 'iron', 'steel')
    for (const y of [12, 15, 18, 21]) line(12, y, 23, y, 'black')
    ellipse(2, 7, 18, 18, 'silver')
    ellipse(6, 11, 10, 10, 'clear', 'dark')
    line(8, 8, 13, 8, 'white')
  })
  concentrate('end_tungstate_concentrate', '#685963', '#9c849c', [[12, 18, 'white'], [15, 22, 'silver'], [17, 16, 'violet'], [19, 11, 'cream'], [21, 20, 'gold'], [8, 23, 'steel'], [23, 23, 'paper']])
  item('iv_leach_filter', () => {
    poly([[11, 5], [20, 5], [24, 10], [24, 25], [20, 28], [10, 28], [7, 25], [7, 10]], 'iron')
    rect(11, 3, 10, 5, 'silver', 'edge')
    rect(8, 10, 15, 13, '#817756', 'dark')
    for (let x = 9; x <= 20; x += 3) {
      line(x, 11, x, 22, 'cream')
      line(x + 1, 12, x + 1, 22, 'walnut')
    }
    rect(9, 24, 13, 4, 'silver', 'edge')
    rect(13, 28, 6, 2, 'dark')
  })
  cake('iv_tungsten_cake', '#9b8970', '#554c43', '#c1b68a', [[7, 14, 3], [15, 12, 3], [19, 15, 4]])
  billet('iv_hot_tungsten', '#d19058', '#784c3a', '#ffdf96', [18, 11, 20, 14])
  mixTray('iv_tungstensteel_charge', ['dark', 'steel', 'iron', 'silver', 'clay', 'cream'])
  billet('iv_hot_tungstensteel', '#a65743', '#5a4144', '#f6b66a', [12, 17, 16, 18])
  cake('iv_platinum_filter_cake', '#aaabad', '#6e6c75', '#dfd9d1', [[8, 14, 4], [14, 15, 3], [21, 12, 3], [21, 16, 3]])
  item('iv_platinum_sponge', () => {
    poly([[3, 20], [5, 13], [10, 12], [13, 7], [19, 8], [21, 11], [25, 10], [28, 16], [27, 22], [20, 27], [9, 27]], '#7d8b8f')
    poly([[5, 17], [10, 13], [14, 8], [18, 10], [22, 14], [18, 20], [11, 21]], '#c7ced0', null)
    for (const [x, y, w] of [[7, 15, 3], [12, 12, 4], [15, 16, 4], [20, 13, 4], [21, 19, 4], [7, 22, 4], [14, 22, 3]]) {
      ellipse(x, y, w, 3, 'iron', null)
    }
  })
  item('iv_busbar_blank', () => {
    cabinet(3, 14, 22, 6, 2, 'steel', 'silver', 'iron')
    line(5, 15, 22, 15, 'white')
    rect(4, 16, 4, 3, 'bronze')
    rect(20, 16, 4, 3, 'bronze')
  })
  item('iv_cable_jacket', () => {
    cylinder(3, 8, 16, 11, '#4b535c', '#a1a084')
    for (const y of [13, 16, 19]) line(17, y, 26, y, 'dark')
    ellipse(7, 12, 8, 8, 'clear', 'iron')
    line(8, 9, 13, 9, 'silver')
  })

  function catalyst(id, mantle, face, bore, spent) {
    item(id, () => {
      cylinder(3, 8, 16, 11, mantle, face)
      line(18, 11, 24, 11, 'bronze')
      for (const [x, y] of [[8, 11], [12, 11], [6, 15], [10, 15], [14, 15], [8, 19], [12, 19]]) rect(x, y, 2, 2, bore)
      if (spent) { line(7, 11, 13, 17, 'black'); line(5, 19, 11, 21, 'black'); px(25, 19, 'dark') }
    })
  }
  catalyst('iv_fuel_catalyst', 'iron', 'gold', 'walnut', false)
  catalyst('iv_spent_fuel_catalyst', '#3f3a41', '#887563', 'black', true)
  item('iv_photoresist_ampoule', () => {
    rect(12, 3, 8, 4, 'steel', 'edge')
    poly([[12, 7], [19, 7], [20, 11], [23, 14], [23, 25], [20, 28], [11, 28], [8, 25], [8, 14], [12, 10]], 'glass')
    poly([[9, 17], [13, 15], [19, 17], [22, 16], [22, 25], [20, 27], [11, 27], [9, 25]], '#61465e', null)
    line(10, 14, 10, 23, 'white')
    rect(13, 20, 7, 4, 'paper', 'dark')
    line(14, 22, 18, 22, 'violet')
  })

  function maskPlate(id, frame, lens, cross) {
    item(id, () => {
      poly([[5, 4], [24, 4], [28, 8], [28, 26], [24, 29], [6, 29], [3, 26], [3, 8]], frame)
      rect(7, 8, 17, 17, lens, 'black')
      rect(10, 11, 11, 11, null, cross)
      rect(13, 14, 5, 5, null, cross)
      line(8, 16, 10, 16, 'white'); line(21, 16, 23, 16, 'white')
      line(15, 9, 15, 11, 'white'); line(15, 22, 15, 24, 'white')
      for (const [x, y] of [[5, 6], [24, 6], [5, 26], [24, 26]]) px(x, y, 'silver')
    })
  }
  maskPlate('iv_sterile_mask', 'iron', '#49415d', '#c2a1ca')
  function wafer(id, film, rim, exposed) {
    item(id, () => {
      ellipse(3, 6, 26, 20, 'iron')
      ellipse(3, 4, 26, 20, film)
      line(6, 9, 10, 6, rim); line(10, 6, 18, 5, rim)
      if (exposed) {
        for (const y of [9, 13, 17]) {
          for (const x of [9, 14, 19]) {
            rect(x, y, 4, 3, rim)
            px(x + 1, y + 1, 'white')
          }
        }
      } else {
        line(7, 12, 12, 8, rim)
        line(9, 15, 16, 8, '#956d94')
      }
      line(10, 23, 21, 23, 'silver')
    })
  }
  wafer('iv_masked_wafer', '#655079', '#b9a4cb', false)
  wafer('iv_exposed_wafer', '#614161', '#d096ac', true)
  item('iv_clean_die', () => {
    cabinet(3, 18, 15, 3, 6, 'iron', '#b489ad', 'dark')
    poly([[7, 16], [17, 11], [24, 11], [14, 16]], '#6f5879')
    line(10, 15, 16, 12, 'white')
    for (const x of [7, 10, 13]) px(x, 17, 'gold')
    px(18, 13, 'cream'); px(21, 13, 'cream')
  })

  function chip(id, body, plate, mark) {
    item(id, () => {
      rect(5, 6, 22, 20, body, 'edge')
      for (const x of [7, 11, 15, 19, 23]) {
        rect(x, 3, 2, 5, 'silver', 'iron')
        rect(x, 24, 2, 5, 'silver', 'iron')
      }
      rect(8, 9, 16, 14, plate, 'black')
      line(9, 10, 21, 10, 'silver')
      ellipse(12, 12, 8, 8, mark, 'dark')
      px(14, 14, 'white'); px(9, 21, 'gold')
    })
  }
  chip('iv_sealed_processor', 'dark', 'iron', 'violet')
  item('iv_clock_backplane', () => {
    rect(4, 3, 24, 25, '#44675c', 'edge')
    rect(6, 5, 4, 21, 'silver', 'dark')
    for (const y of [7, 13, 19]) {
      rect(13, y, 12, 4, 'dark', 'black')
      for (let x = 15; x <= 22; x += 2) px(x, y + 1, 'gold')
      line(10, y + 1, 13, y + 1, 'copper')
    }
    line(11, 5, 25, 5, 'teal'); px(6, 24, 'white')
  })
  item('iv_arc_plate', () => {
    cabinet(4, 8, 20, 18, 3, 'steel', 'silver', 'iron')
    for (const y of [14, 17, 20]) {
      line(8, y, 19, y, 'black')
      line(8, y + 1, 19, y + 1, 'silver')
    }
    ellipse(5, 9, 4, 4, 'clear', 'iron'); ellipse(19, 9, 4, 4, 'clear', 'iron')
  })
  item('iv_servo_core', () => {
    rect(21, 13, 9, 6, 'silver', 'edge')
    cylinder(6, 8, 16, 8, 'dark', 'steel')
    for (const y of [12, 16, 20]) line(21, y, 25, y, 'copper', 2)
    ellipse(9, 11, 10, 10, '#808090', 'dark')
    rect(2, 13, 13, 6, 'steel', 'edge')
    line(3, 14, 13, 14, 'silver', 2)
  })
  item('iv_switch_stack', () => {
    cabinet(4, 7, 19, 20, 3, 'iron', 'steel', 'dark')
    for (const y of [9, 15, 21]) {
      rect(7, y, 13, 4, 'dark', 'edge')
      rect(6, y + 1, 4, 2, 'bronze', 'edge')
      rect(17, y + 1, 4, 2, 'copper', 'edge')
    }
  })
  item('iv_grid_regulator', () => {
    cabinet(4, 9, 22, 18, 2, 'steel', 'silver', 'iron')
    rect(7, 12, 10, 6, '#283d40', 'black')
    line(9, 16, 11, 16, 'teal'); line(11, 16, 12, 14, 'glass'); line(12, 14, 15, 14, 'glass')
    ellipse(19, 13, 4, 4, 'gold', 'edge')
    for (const x of [7, 11, 15, 19]) rect(x, 22, 3, 3, 'black')
    rect(8, 5, 4, 3, 'silver', 'edge'); rect(19, 5, 4, 3, 'silver', 'edge')
  })
  item('iv_cooling_jacket', () => {
    rect(22, 4, 5, 7, 'teal', 'edge'); rect(22, 21, 5, 7, 'teal', 'edge')
    cylinder(3, 8, 16, 11, 'iron', 'silver')
    for (const y of [12, 15, 18, 21]) line(19, y, 26, y, 'steel')
    ellipse(6, 11, 10, 10, 'clear', 'dark')
    line(23, 6, 25, 6, 'glass'); line(23, 25, 25, 25, 'glass')
  })
  item('iv_bulkhead', () => {
    cabinet(4, 7, 20, 20, 3, 'steel', 'silver', 'iron')
    rect(7, 10, 14, 14, '#9dabb3', 'dark')
    line(8, 14, 19, 14, 'silver'); line(8, 19, 19, 19, 'silver')
    for (const [x, y] of [[5, 8], [22, 8], [5, 25], [22, 25]]) px(x, y, 'black')
    line(24, 20, 28, 18, 'bronze')
  })
  item('iv_reference_module', () => {
    cabinet(5, 10, 21, 17, 2, '#8e5843', 'bronze', 'dark')
    rect(8, 12, 9, 10, 'iron', 'black')
    ellipse(9, 13, 7, 7, 'white', 'steel')
    line(12, 16, 14, 14, 'black')
    rect(19, 15, 5, 7, 'black', 'dark')
    px(20, 17, 'gold'); px(22, 17, 'gold')
  })
  item('iv_calibration_rig', () => {
    cabinet(3, 24, 23, 5, 2, 'iron', 'steel', 'dark')
    rect(5, 6, 5, 18, '#808090', 'edge'); rect(22, 6, 5, 18, '#808090', 'edge')
    rect(6, 10, 2, 12, 'steel'); rect(23, 10, 2, 12, 'steel')
    rect(5, 5, 22, 5, 'steel', 'edge')
    line(7, 6, 24, 6, 'silver', 2)
    rect(13, 9, 6, 9, 'dark', 'edge')
    ellipse(13, 11, 6, 6, 'cream', 'iron'); line(15, 14, 17, 12, 'black')
    rect(14, 17, 4, 5, 'silver', 'edge')
    rect(9, 23, 14, 3, 'bronze', 'dark')
  })
  function tensile(id, face, shine, witness) {
    item(id, () => {
      const profile = [[3, 11], [9, 11], [12, 14], [19, 14], [22, 11], [28, 11], [29, 12], [29, 19],
        [28, 20], [22, 20], [19, 17], [12, 17], [9, 20], [3, 20], [2, 19], [2, 12]]
      poly(profile.map(([x, y]) => [x, y + 2]), 'dark')
      poly(profile, face)
      line(4, 12, 8, 12, shine); line(23, 12, 27, 12, shine)
      line(13, 15, 18, 15, witness)
      ellipse(4, 14, 4, 4, 'clear', 'iron'); ellipse(24, 14, 4, 4, 'clear', 'iron')
    })
  }
  tensile('iv_stress_coupon', 'steel', 'white', 'violet')
  report('iv_commissioning_report', '#65688f', false)

  concentrate('luv_tantalite_concentrate', '#525365', '#85818e', [[10, 18, 'silver'], [16, 14, 'white'], [19, 12, 'violet'], [18, 18, 'blue'], [22, 21, 'iron'], [10, 24, 'violet'], [25, 24, 'steel']])
  cake('luv_niobium_cake', '#779a91', '#455d5a', '#b3c3a9', [[8, 14, 4], [14, 12, 3], [18, 16, 4], [22, 12, 3]])
  mixTray('luv_niobium_charge', ['teal', 'glass', 'steel', 'silver', 'iron', 'white'])
  billet('luv_hot_conductor', '#c17f63', '#5c454f', '#ffcc91', [14, 14, 18, 15])
  mixTray('luv_hssg_charge', ['iron', 'silver', 'green', 'teal', 'bronze', 'paper'])
  billet('luv_hot_hssg', '#b36b49', '#53434a', '#f8c77f', [20, 12, 24, 11])
  item('luv_coil_winding', () => {
    ellipse(4, 6, 24, 24, 'iron')
    ellipse(4, 4, 24, 24, 'bronze')
    ellipse(10, 10, 12, 12, 'clear', 'dark')
    for (let i = 0; i < 12; i++) {
      const angle = i * Math.PI / 6
      const project = radius => [Math.round(15.5 + Math.cos(angle) * radius), Math.round(15.5 + Math.sin(angle) * radius)]
      line(...project(10), ...project(7), 'gold')
    }
    line(24, 20, 28, 24, 'copper', 2); rect(26, 24, 3, 3, 'silver')
  })
  item('luv_pgm_sludge', () => {
    poly([[3, 22], [6, 17], [11, 16], [13, 12], [21, 13], [24, 17], [28, 18], [30, 22], [26, 26], [13, 27], [4, 25]], '#4e4054')
    poly([[5, 22], [10, 18], [13, 17], [15, 13], [20, 14], [24, 19], [28, 21], [23, 24], [10, 25]], '#806b81', null)
    line(9, 20, 13, 18, '#c4a9bb'); line(15, 17, 19, 17, '#c4a9bb')
    ellipse(13, 21, 5, 3, 'violet', null); px(22, 21, 'glass')
  })
  item('luv_rhodium_sponge', () => {
    poly([[4, 13], [8, 8], [14, 5], [22, 7], [27, 13], [28, 20], [22, 25], [16, 28], [7, 25], [3, 20]], '#96929d')
    poly([[5, 13], [12, 7], [18, 7], [24, 11], [22, 17], [15, 21], [7, 19]], '#d5cbd8', null)
    for (const [x, y, w] of [[7, 12, 4], [12, 9, 3], [16, 11, 4], [20, 14, 4], [9, 16, 3], [14, 16, 4], [6, 21, 4], [12, 22, 4], [18, 20, 5]]) {
      ellipse(x, y, w, 3, '#74697a', null)
    }
  })
  mixTray('luv_palladium_charge', ['violet', 'silver', 'silver', 'cream', 'iron', 'white'])
  billet('luv_hot_palladium', '#de9d79', '#704f5a', '#ffe2b3', [15, 16, 20, 13])
  item('luv_dielectric_laminate', () => {
    for (const [y, face, top] of [[20, 'iron', 'steel'], [16, '#b99559', 'paper'], [12, 'teal', '#829991']]) {
      cabinet(3, y, 18, 4, 4, face, top, 'iron')
      line(5, y + 1, 18, y + 1, 'cream')
    }
    line(6, 11, 12, 8, 'glass')
  })
  item('luv_optical_blank', () => {
    cabinet(5, 10, 16, 16, 4, '#83a8a8', 'glass', '#638894')
    line(6, 11, 18, 11, 'white'); line(6, 12, 6, 20, 'glass')
    line(11, 22, 18, 15, '#d0e6de'); line(12, 23, 18, 17, 'glass')
    line(22, 13, 27, 10, 'glass')
  })
  item('luv_polished_waveguide', () => {
    cabinet(3, 13, 22, 8, 2, '#78aaa7', '#b4ddd9', '#598794')
    line(5, 14, 22, 14, 'white')
    line(5, 18, 22, 18, 'blue')
    rect(4, 15, 3, 4, 'glass')
    line(25, 15, 27, 14, 'glass')
  })
  item('luv_optical_core', () => {
    rect(24, 12, 6, 8, 'gold', 'edge')
    cylinder(3, 8, 16, 10, 'steel', 'bronze')
    ellipse(6, 11, 10, 10, '#609a9e', 'black')
    ellipse(8, 13, 6, 6, 'glass', 'teal')
    px(9, 14, 'white')
    line(19, 11, 24, 11, 'silver')
  })
  chip('luv_processor_package', 'iron', '#425a61', '#a1c7b4')
  item('luv_clock_matrix', () => {
    rect(4, 4, 24, 24, '#4f7b6c', 'edge')
    rect(4, 23, 24, 5, 'dark', 'edge')
    for (let x = 7; x <= 24; x += 3) rect(x, 26, 2, 2, 'gold')
    for (const [x, y] of [[8, 8], [18, 8], [8, 16], [18, 16]]) {
      rect(x, y, 6, 5, 'black', 'iron')
      line(x + 1, y + 1, x + 4, y + 1, 'silver')
      line(x + 3, y + 5, x + 3, y + 7, 'copper')
    }
    line(6, 6, 25, 6, 'glass'); px(25, 20, 'cream')
  })
  item('luv_busbar', () => {
    rect(3, 12, 26, 10, 'iron', 'edge')
    rect(3, 10, 26, 10, '#93b8ae', 'edge')
    line(5, 11, 26, 11, 'white')
    for (const x of [6, 14, 22]) ellipse(x, 13, 4, 4, 'clear', 'steel')
  })
  item('luv_magnet_module', () => {
    poly([[5, 5], [26, 5], [29, 10], [29, 21], [24, 27], [5, 27], [3, 24], [3, 20], [19, 20], [21, 17], [21, 14], [19, 12], [3, 12], [3, 8]], 'iron')
    poly([[4, 6], [24, 6], [27, 10], [27, 20], [23, 24], [4, 24], [4, 20], [20, 20], [23, 17], [23, 14], [20, 10], [4, 10]], 'steel')
    for (const x of [9, 13, 17]) {
      rect(x, 5, 3, 7, 'bronze')
      rect(x, 20, 3, 7, 'bronze')
      rect(x, 6, 2, 4, 'copper')
      rect(x, 20, 2, 4, 'copper')
    }
    rect(2, 7, 4, 5, 'silver', 'edge'); rect(2, 20, 4, 6, 'silver', 'edge')
    rect(25, 12, 4, 5, 'teal', 'edge')
  })
  item('luv_fusion_specimen', () => {
    rect(4, 22, 24, 6, 'iron', 'edge')
    rect(6, 6, 3, 17, 'steel', 'dark'); rect(23, 6, 3, 17, 'steel', 'dark')
    rect(6, 5, 20, 4, 'silver', 'edge')
    ellipse(10, 9, 12, 13, 'bronze')
    ellipse(13, 12, 6, 7, 'clear', 'dark')
    line(16, 9, 16, 12, 'silver'); line(16, 19, 16, 22, 'silver')
    rect(13, 24, 6, 2, 'teal')
  })
  item('luv_plasma_coupon', () => {
    cabinet(4, 12, 21, 10, 2, 'steel', 'silver', 'iron')
    ellipse(10, 13, 9, 8, '#8b6d83', '#5b596d')
    ellipse(12, 14, 5, 5, '#a17d6b', 'violet')
    line(13, 17, 16, 16, 'gold')
    ellipse(5, 15, 4, 4, 'clear', 'dark'); ellipse(20, 15, 4, 4, 'clear', 'dark')
  })
  report('luv_ignition_report', 'rust', true)
  tensile('luv_load_coupon', '#8da9a8', 'white', '#a45141')
  report('luv_commissioning_report', '#3f766e', false)
}
