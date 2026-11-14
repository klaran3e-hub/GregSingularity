export default function drawFactoryItems({ item, poly, rect, ellipse, line, px }) {
  const shadedSteel = '#73717e'
  const brightSteel = '#c6c6d6'
  const deepSteel = '#45424e'
  const steelFace = '#8e8c9c'
  const copperLight = '#ffc081'
  const copperShade = '#9e563d'
  const anodized = '#496d72'
  const mint = '#a9e1cb'
  const amber = '#e2a854'
  const beige = '#e1d3b1'
  const ceramic = '#b7c6b9'

  function bolts(points, color = brightSteel) {
    for (const [x, y] of points) {
      rect(x, y, 3, 3, 'edge')
      line(x, y, x + 1, y, color)
      px(x + 1, y + 1, shadedSteel)
    }
  }

  // Rectangular front with the same depth axis on both receding faces.
  function box(x, y, width, height, depth, front, top, side) {
    const right = x + width - 1
    const bottom = y + height - 1
    const dx = 2 * depth
    poly([[x, y], [x + dx, y - depth], [right + dx, y - depth], [right, y]], top)
    poly([[right, y], [right + dx, y - depth], [right + dx, bottom - depth], [right, bottom]], side)
    rect(x, y, width, height, front, 'edge')
  }

  function railProfile(head, web, base) {
    // The rear plane is 14 px right and 7 px above the I section.
    box(3, 23, 13, 5, 7, base, brightSteel, deepSteel)
    box(7, 17, 5, 8, 7, web, 'silver', shadedSteel)
    box(3, 13, 13, 5, 7, head, brightSteel, shadedSteel)
    rect(8, 18, 3, 5, web)
    rect(4, 24, 11, 2, base)
  }

  function document(back, front, tab) {
    rect(7, 5, 21, 25, back, 'edge')
    poly([[5, 3], [20, 3], [25, 8], [25, 27], [5, 27]], front)
    poly([[20, 3], [20, 8], [25, 8]], tab, null)
    line(7, 25, 22, 25, tab)
  }

  function conductorPin(x, y, width = 5) {
    rect(x, y, width, 4, copperShade)
    rect(x, y, width - 2, 2, 'copper')
    rect(x, y, 2, 2, copperLight)
  }

  function metalCase(x, y, width, height, depth) {
    box(x, y, width, height, depth, steelFace, shadedSteel, deepSteel)
    rect(x + 2, y + 2, width - 4, 2, brightSteel)
    rect(x + 2, y + 4, 2, height - 6, shadedSteel)
    rect(x + 2, y + height - 4, width - 4, 2, deepSteel)
  }

  item('rail_profile_blank', () => {
    railProfile(shadedSteel, deepSteel, 'iron')
    line(3, 17, 15, 17, 'copper')
    line(3, 23, 15, 23, 'copper')
    for (const x of [4, 7, 11, 14]) px(x, 17, 'gold')
    for (const [x, y] of [[15, 23], [19, 21], [23, 19], [27, 17]]) px(x, y, 'copper')
  })

  item('rolled_rail', () => {
    railProfile('silver', 'steel', 'silver')
    line(4, 14, 14, 14, 'white')
    line(9, 19, 9, 22, 'silver')
    line(4, 26, 14, 26, shadedSteel)
    line(5, 12, 17, 6, 'white')
  })

  item('treated_sleeper', () => {
    box(2, 14, 23, 11, 2, 'wood', 'oak', 'walnut')
    for (const x of [7, 16]) {
      rect(x, 15, 5, 7, shadedSteel, 'edge')
      line(x + 1, 16, x + 3, 16, brightSteel)
      px(x + 2, 19, 'edge')
    }
    line(3, 23, 23, 23, 'walnut')
    line(5, 12, 25, 12, 'straw')
    line(4, 18, 5, 18, 'oak')
    line(22, 19, 23, 19, 'oak')
  })

  item('rail_fastener_blank', () => {
    box(4, 10, 22, 15, 1, 'steel', brightSteel, shadedSteel)
    rect(9, 13, 12, 9, null, shadedSteel)
    ellipse(5, 15, 4, 5, 'clear', 'edge')
    ellipse(21, 15, 4, 5, 'clear', 'edge')
    line(11, 17, 18, 17, 'copper')
    line(11, 19, 18, 19, 'iron')
  })

  item('rail_fastener', () => {
    // Squared spring clip in top view, with uniform bar widths.
    poly([[4, 8], [27, 8], [27, 12], [9, 12], [9, 14], [20, 14], [20, 18], [9, 18], [9, 20], [27, 20], [27, 24], [4, 24]], 'steel')
    line(5, 9, 26, 9, brightSteel)
    line(5, 10, 5, 22, brightSteel)
    line(9, 15, 19, 15, brightSteel)
    line(9, 21, 26, 21, brightSteel)
    line(5, 23, 26, 23, shadedSteel)
  })

  item('axle_blank', () => {
    // Solid square-section stock before the lathe cut.
    box(3, 12, 21, 10, 2, shadedSteel, 'silver', deepSteel)
    line(4, 14, 22, 14, 'steel')
    line(4, 20, 22, 20, deepSteel)
    for (const x of [7, 12, 19]) px(x, 17, 'rust')
    line(25, 12, 25, 17, 'iron')
  })

  item('balanced_rail_axle', () => {
    // The shaft and both collars are concentric about y=15.5.
    rect(2, 13, 28, 6, 'steel', 'edge')
    rect(6, 9, 5, 14, 'silver', 'edge')
    rect(21, 9, 5, 14, 'silver', 'edge')
    rect(12, 11, 8, 10, shadedSteel, 'edge')
    line(3, 14, 5, 14, brightSteel)
    line(7, 10, 9, 10, 'white')
    line(13, 12, 18, 12, 'silver')
    line(22, 10, 24, 10, 'white')
    line(26, 14, 28, 14, brightSteel)
    line(7, 21, 9, 21, 'iron')
    line(22, 21, 24, 21, 'iron')
  })

  item('traction_housing', () => {
    box(4, 23, 21, 5, 2, deepSteel, 'steel', 'iron')
    metalCase(6, 8, 18, 18, 2)
    ellipse(6, 10, 18, 14, brightSteel)
    ellipse(8, 12, 14, 10, shadedSteel, null)
    ellipse(10, 12, 10, 10, 'clear', deepSteel)
    rect(24, 12, 2, 8, shadedSteel)
    rect(6, 24, 4, 2, brightSteel)
    rect(20, 24, 4, 2, brightSteel)
  })

  item('signal_relay', () => {
    for (const x of [5, 11, 17, 23]) conductorPin(x, 24, 4)
    metalCase(4, 8, 24, 16, 1)
    rect(8, 12, 16, 8, deepSteel)
    rect(10, 14, 6, 4, copperShade)
    rect(10, 14, 4, 2, copperLight)
    rect(16, 16, 4, 2, brightSteel)
    rect(20, 14, 2, 2, 'green')
  })

  item('rail_waybill', () => {
    document('walnut', 'paper', '#b49b75')
    rect(8, 6, 10, 3, 'blue')
    rect(8, 11, 8, 5, deepSteel)
    rect(15, 13, 6, 3, deepSteel)
    rect(9, 12, 3, 2, 'glass')
    ellipse(8, 16, 4, 4, 'iron', 'edge')
    ellipse(15, 16, 4, 4, 'iron', 'edge')
    line(7, 21, 22, 21, '#83765e')
    line(7, 23, 17, 23, '#83765e')
    rect(21, 20, 5, 5, '#935848', '#5d3f38')
  })

  item('rail_delivery_receipt', () => {
    poly([[6, 3], [25, 3], [25, 28], [22, 26], [19, 28], [16, 26], [13, 28], [10, 26], [6, 28]], '#ece4cd')
    line(8, 6, 22, 6, deepSteel, 2)
    line(8, 10, 22, 10, '#a99a7e')
    line(8, 13, 19, 13, '#a99a7e')
    line(8, 16, 18, 16, '#a99a7e')
    ellipse(14, 16, 12, 11, null, 'teal')
    line(17, 21, 19, 23, '#2b8260', 2)
    line(19, 23, 23, 18, '#2b8260', 2)
  })

  item('drawer_runner_blank', () => {
    // A flat blank in top view with centre-punched end holes.
    rect(3, 11, 26, 10, shadedSteel, 'edge')
    line(4, 12, 27, 12, brightSteel)
    line(4, 19, 27, 19, deepSteel)
    ellipse(5, 14, 4, 4, 'clear', 'edge')
    ellipse(23, 14, 4, 4, 'clear', 'edge')
    rect(12, 14, 8, 4, 'iron')
    line(13, 15, 18, 15, 'copper')
  })

  item('drawer_slide', () => {
    // Parallel C-sections and a row of ball bearings in the exposed channel.
    rect(2, 10, 27, 13, deepSteel, 'edge')
    rect(3, 11, 25, 3, brightSteel, 'edge')
    rect(3, 19, 25, 3, shadedSteel, 'edge')
    rect(4, 14, 24, 5, 'edge')
    for (const x of [6, 10, 14, 18, 22, 26]) px(x, 16, 'silver')
    rect(11, 12, 19, 4, 'steel', 'edge')
    line(12, 13, 28, 13, 'white')
    line(4, 20, 27, 20, 'silver')
  })

  item('drawer_cartridge', () => {
    // Open wooden tray. Its inner rim recedes along [8,-4].
    box(3, 12, 18, 15, 4, 'wood', 'oak', 'walnut')
    poly([[6, 11], [12, 8], [25, 8], [19, 11]], 'edge')
    poly([[8, 10], [12, 8], [24, 8], [20, 10]], 'walnut', null)
    line(4, 23, 19, 23, 'walnut')
    line(4, 24, 19, 24, 'oak')
    rect(8, 16, 8, 5, 'iron', 'edge')
    line(9, 17, 14, 17, brightSteel)
    rect(10, 18, 4, 2, 'edge')
    line(22, 23, 28, 20, 'silver', 2)
  })

  item('drawer_selector', () => {
    metalCase(4, 8, 22, 20, 2)
    rect(6, 11, 9, 10, 'black', 'iron')
    for (const [x, y] of [[8, 14], [12, 14], [8, 18], [12, 18]]) rect(x, y, 2, 2, copperLight)
    ellipse(16, 12, 8, 8, 'copper')
    ellipse(18, 14, 4, 4, 'black', null)
    rect(20, 14, 2, 2, copperLight)
    rect(8, 22, 6, 2, copperShade)
    rect(16, 22, 6, 2, copperShade)
  })

  item('me_isolation_shell', () => {
    // Closed folded shield with a lid seam, flange and centered bulkhead.
    rect(2, 24, 26, 4, deepSteel)
    metalCase(4, 8, 22, 18, 2)
    rect(8, 12, 14, 2, deepSteel)
    ellipse(8, 12, 14, 12, brightSteel, deepSteel)
    ellipse(10, 14, 10, 8, deepSteel, null)
    rect(12, 16, 2, 4, 'violet')
    rect(16, 16, 2, 4, 'violet')
    rect(4, 24, 4, 2, copperShade)
    rect(22, 24, 4, 2, copperShade)
  })

  item('me_piezo_laminate', () => {
    box(4, 10, 21, 14, 2, '#ad8fbd', '#d0b1dd', '#514060')
    line(5, 18, 23, 18, 'cream')
    line(5, 21, 23, 21, '#6f526e')
    line(25, 18, 28, 16, 'cream')
    line(25, 21, 28, 19, '#6f526e')
    line(7, 12, 20, 12, 'glass')
    for (const x of [8, 14, 20]) conductorPin(x, 24, 4)
  })

  item('me_memory_foil', () => {
    // Thin flexible ribbon, with a visible curl and repeating contact pads.
    poly([[3, 9], [19, 5], [27, 9], [29, 14], [24, 23], [12, 27], [6, 23], [9, 20], [16, 18], [14, 16], [5, 16], [2, 13]], '#ba8958')
    poly([[3, 9], [19, 5], [26, 9], [14, 14], [5, 16], [2, 13]], 'gold')
    poly([[14, 16], [24, 10], [29, 14], [24, 23], [12, 27], [6, 23], [9, 20]], '#8f5f43')
    line(11, 23, 23, 19, amber, 2)
    for (const [x, y] of [[5, 11], [9, 10], [13, 9], [17, 8], [21, 9]]) {
      line(x, y, x + 1, y + 2, 'violet')
    }
    line(13, 25, 24, 21, 'copper')
  })

  item('me_etched_foil', () => {
    rect(4, 4, 24, 24, copperShade, 'edge')
    rect(6, 8, 20, 16, '#523e62')
    rect(12, 10, 8, 12, deepSteel)
    rect(14, 12, 4, 6, 'violet')
    for (const y of [12, 18]) {
      rect(8, y, 4, 2, 'copper')
      rect(20, y, 4, 2, 'copper')
    }
    rect(6, 6, 20, 2, copperLight)
  })

  item('me_pattern_laminate', () => {
    rect(4, 4, 24, 24, '#527375', 'edge')
    rect(8, 8, 16, 16, '#2e4952')
    for (const x of [10, 16, 22]) {
      rect(x - 2, 10, 2, 12, '#6c9b94')
      for (const y of [10, 18]) rect(x, y, 2, 2, mint)
    }
    rect(6, 6, 20, 2, '#a1bbbc')
    for (const x of [8, 14, 20]) conductorPin(x, 24, 4)
  })

  item('me_optical_link', () => {
    // Straight duplex optical jumper with two symmetric connector blocks.
    line(7, 14, 24, 14, 'edge', 3)
    line(7, 17, 24, 17, 'edge', 3)
    line(7, 14, 24, 14, '#9c7ac5')
    line(7, 17, 24, 17, '#b7a1da')
    rect(3, 10, 7, 12, 'steel', 'edge')
    rect(22, 10, 7, 12, 'steel', 'edge')
    rect(2, 12, 3, 8, 'silver', 'edge')
    rect(27, 12, 3, 8, 'silver', 'edge')
    rect(5, 13, 3, 6, 'violet', 'edge')
    rect(24, 13, 3, 6, 'violet', 'edge')
    px(6, 14, 'glass')
    px(25, 14, 'glass')
  })

  item('me_press_blank', () => {
    metalCase(4, 8, 22, 18, 2)
    rect(8, 12, 14, 10, deepSteel)
    rect(10, 14, 10, 6, shadedSteel)
    rect(10, 14, 10, 2, brightSteel)
  })

  function freightCrate(accepted) {
    box(3, 9, 20, 20, 3, '#8c5633', '#a57045', '#603d2b')
    line(4, 15, 21, 15, 'oak')
    line(4, 21, 21, 21, 'walnut')
    line(23, 15, 27, 13, '#885834')
    line(23, 21, 27, 19, 'walnut')
    line(8, 7, 23, 7, 'walnut')
    rect(6, 10, 2, 18, shadedSteel)
    rect(17, 10, 2, 18, shadedSteel)
    line(6, 9, 12, 6, brightSteel, 2)
    line(17, 9, 23, 6, brightSteel, 2)
    if (accepted) {
      rect(8, 16, 10, 9, '#d4e1c2', 'edge')
      line(10, 20, 12, 22, '#327849', 2)
      line(12, 22, 16, 18, '#327849', 2)
    } else {
      line(13, 11, 13, 20, 'iron', 2)
      ellipse(9, 19, 8, 8, '#aa5845', '#533b34')
      line(11, 21, 14, 21, '#e78e5f')
      line(11, 24, 14, 24, '#57352c')
    }
  }
  item('sealed_refractory_crate', () => freightCrate(false))
  item('received_refractory_crate', () => freightCrate(true))

  item('nether_brick_blank', () => {
    box(3, 13, 20, 11, 3, '#753f3e', '#9c4e46', '#562f35')
    line(9, 11, 26, 11, '#be7161')
    line(5, 21, 20, 21, '#5a3839')
    line(23, 21, 27, 19, '#8e4c4b')
    for (const [x, y] of [[12, 11], [17, 12], [8, 16], [13, 18], [19, 19], [24, 15]]) px(x, y, 'edge')
  })

  item('netherite_upgrade_charge', () => {
    // Keyed insert from above, with opposing slots on the centre line.
    poly([[3, 10], [7, 10], [7, 7], [24, 7], [24, 10], [28, 10], [28, 21], [24, 21], [24, 24], [7, 24], [7, 21], [3, 21]], '#514654')
    rect(8, 9, 16, 14, '#736575', 'edge')
    rect(9, 12, 14, 8, '#262633', 'edge')
    line(11, 14, 20, 14, '#aa8e9f')
    line(11, 17, 20, 17, 'copper')
    rect(4, 14, 3, 4, 'bronze')
    rect(25, 14, 3, 4, 'bronze')
  })

  item('end_transit_permit', () => {
    rect(4, 9, 26, 17, deepSteel, 'edge')
    rect(3, 7, 26, 17, brightSteel, 'edge')
    rect(5, 9, 22, 13, '#385652', 'edge')
    ellipse(7, 10, 10, 10, '#172f2e', '#76ae9b')
    ellipse(10, 12, 4, 6, mint, null)
    line(18, 12, 24, 12, 'white')
    line(18, 15, 24, 15, '#93c3b0')
    line(18, 18, 24, 18, '#93c3b0')
    px(26, 20, 'gold')
  })

  item('ender_optical_insert', () => {
    // Glass on a concentric round collar mounted to a square ceramic face.
    rect(4, 6, 24, 24, '#5a715e', 'edge')
    rect(4, 4, 24, 24, ceramic, 'edge')
    ellipse(7, 7, 18, 18, 'bronze')
    ellipse(9, 9, 14, 14, '#337d72', 'edge')
    ellipse(11, 11, 10, 10, '#56b7a4', '#80cab0')
    line(12, 13, 15, 12, '#d4f0d8', 2)
    line(17, 19, 19, 17, '#22817c', 2)
    bolts([[5, 5], [24, 5], [5, 24], [24, 24]], 'gold')
  })

  item('endstone_grit', () => {
    poly([[3, 24], [5, 19], [10, 17], [13, 10], [20, 8], [23, 15], [27, 17], [29, 23], [26, 27], [9, 28]], '#b7ab71')
    poly([[7, 19], [13, 13], [18, 13], [17, 18], [12, 22]], '#e4db9d')
    poly([[14, 11], [19, 9], [22, 13], [18, 15]], '#d6cb88')
    poly([[18, 17], [24, 16], [27, 20], [22, 24], [17, 22]], '#e0d495')
    for (const [x, y] of [[4, 25], [11, 25], [14, 22], [18, 25], [25, 21], [13, 15], [21, 15]]) px(x, y, '#867853')
    px(5, 16, 'cream')
    px(28, 15, 'cream')
  })

  item('end_filter_blank', () => {
    rect(4, 6, 24, 24, deepSteel, 'edge')
    rect(4, 4, 24, 24, brightSteel, 'edge')
    rect(7, 7, 18, 18, 'clear', 'edge')
    for (const x of [8, 11, 14, 17, 20, 23]) line(x, 8, x, 23, 'iron')
    for (const y of [8, 11, 14, 17, 20, 23]) line(8, y, 23, y, shadedSteel)
    line(6, 26, 25, 26, 'silver')
    bolts([[4, 4], [25, 4], [4, 25], [25, 25]])
  })

  function gasCartridge(spent) {
    const rim = spent ? '#67665f' : shadedSteel
    const medium = spent ? '#615447' : '#467268'
    const pleat = spent ? '#9c7a50' : '#8fb7a1'
    ellipse(7, 20, 18, 9, rim)
    rect(7, 9, 18, 16, medium, 'edge')
    for (const x of [10, 13, 16, 19, 22]) {
      line(x, 12, x, 23, pleat)
      line(x + 1, 13, x + 1, 23, 'edge')
    }
    ellipse(7, 6, 18, 10, rim)
    ellipse(10, 7, 12, 6, spent ? 'rust' : brightSteel)
    rect(13, 3, 6, 6, spent ? 'rust' : anodized, 'edge')
    line(14, 4, 17, 4, spent ? 'copper' : 'silver')
    line(8, 25, 23, 25, rim)
    if (spent) {
      px(10, 17, 'rust')
      px(16, 20, 'rust')
      px(21, 15, 'rust')
      line(18, 21, 21, 18, '#bc7747')
    } else {
      line(8, 15, 8, 22, 'silver')
      line(22, 23, 22, 16, mint)
    }
  }
  item('end_sampling_filter', () => gasCartridge(false))
  item('spent_end_filter', () => gasCartridge(true))

  item('vacuum_seal_preform', () => {
    // Four identical locating tabs around the seal centre.
    rect(13, 3, 6, 26, '#5a666b', 'edge')
    rect(3, 13, 26, 6, '#5a666b', 'edge')
    ellipse(6, 6, 20, 20, '#798c89')
    ellipse(11, 11, 10, 10, 'clear', 'edge')
    line(13, 8, 18, 8, 'silver')
    px(15, 5, 'silver')
    px(5, 15, 'silver')
  })

  item('vacuum_gasket', () => {
    // Opposed rings share exactly the same centre.
    ellipse(4, 4, 24, 24, 'edge', null)
    ellipse(6, 6, 20, 20, '#758e88', '#343c44')
    ellipse(10, 10, 12, 12, 'clear', 'edge')
    line(12, 8, 19, 8, 'silver')
    line(12, 24, 19, 24, anodized)
    px(8, 13, 'silver')
  })

  item('vacuum_tile_mix', () => {
    // Powder in a loose mound with separate clay granules.
    poly([[2, 24], [5, 18], [9, 18], [13, 10], [17, 9], [22, 13], [23, 17], [28, 19], [30, 24], [25, 27], [8, 28]], '#7d857b')
    poly([[6, 21], [12, 15], [15, 11], [20, 14], [21, 18], [26, 21], [21, 24], [10, 25]], '#a3ac96', null)
    for (const [x, y] of [[6, 23], [9, 26], [13, 22], [15, 15], [18, 18], [20, 24], [23, 21], [25, 25], [28, 23]]) px(x, y, '#4c5b54')
    px(6, 15, 'clay')
    px(27, 17, ceramic)
  })

  function ceramicTile(top, side, bottom, fired) {
    box(3, 17, 20, 7, 3, side, top, bottom)
    line(8, 16, 23, 16, fired ? 'white' : ceramic)
    line(23, 19, 27, 17, fired ? '#b8d0c4' : '#94a28e')
    if (fired) {
      line(11, 15, 25, 15, '#e4eee0')
      line(5, 21, 20, 21, '#7f9b8c')
    } else {
      for (const [x, y] of [[10, 15], [13, 14], [15, 15], [19, 16], [22, 15]]) px(x, y, '#718274')
      line(5, 21, 20, 21, '#9b9d8e')
    }
  }
  item('vacuum_tile_blank', () => ceramicTile('#9aa48d', '#7a8071', '#616b62', false))
  item('sintered_vacuum_tile', () => ceramicTile('#d4e2cc', '#a1b7a6', '#748b7f', true))

  item('vacuum_pump_core', () => {
    // Pump cover, concentric inlet, ribbed motor and centred evacuation port.
    rect(4, 24, 24, 4, deepSteel)
    metalCase(8, 10, 18, 16, 2)
    rect(18, 12, 8, 10, deepSteel)
    for (const x of [20, 24]) {
      rect(x, 12, 2, 8, shadedSteel)
      rect(x, 12, 2, 4, brightSteel)
    }
    rect(8, 4, 8, 8, shadedSteel, 'edge')
    rect(6, 4, 12, 4, steelFace, 'edge')
    rect(8, 4, 4, 2, brightSteel)
    ellipse(2, 10, 20, 16, shadedSteel, deepSteel)
    ellipse(4, 12, 16, 12, brightSteel, null)
    ellipse(6, 14, 12, 8, deepSteel, null)
    rect(10, 14, 4, 2, shadedSteel)
    rect(20, 22, 4, 2, copperShade)
    rect(20, 22, 2, 2, copperLight)
  })

  item('purified_rutile', () => {
    // Small reddish-brown rutile needles on the washed sand.
    poly([[4, 24], [7, 19], [13, 19], [16, 15], [22, 16], [26, 19], [28, 24], [24, 27], [9, 27]], '#715849')
    poly([[8, 20], [12, 9], [16, 8], [17, 12], [13, 22]], '#954d39')
    poly([[15, 22], [20, 11], [23, 10], [24, 14], [20, 23]], '#ab674b')
    line(11, 19, 14, 10, 'copper')
    line(18, 20, 22, 12, '#dfa77a')
    for (const [x, y] of [[7, 23], [11, 25], [14, 23], [19, 25], [22, 22], [25, 24]]) px(x, y, beige)
  })

  item('titanium_reduction_charge', () => {
    // Symmetric refractory boat with a top opening for the charge.
    poly([[3, 14], [28, 14], [25, 22], [22, 25], [9, 25], [6, 22]], '#795844')
    ellipse(3, 9, 26, 12, '#c5a182', 'edge')
    ellipse(6, 11, 20, 8, '#64433b', 'edge')
    for (const [x, y] of [[9, 15], [13, 13], [18, 15], [22, 13]]) {
      poly([[x - 2, y], [x + 1, y - 2], [x + 3, y], [x, y + 2]], 'silver', 'iron')
    }
    line(10, 21, 21, 21, 'cream')
  })

  item('hot_titanium_billet', () => {
    box(3, 13, 20, 11, 3, '#c37453', '#f5bb85', '#a95d4e')
    line(10, 11, 26, 11, '#fff2cd', 2)
    line(5, 15, 20, 15, '#ffc693')
    line(5, 21, 20, 21, '#d47c58')
    line(23, 19, 27, 17, '#ed9062')
  })

  function cleanPanel(top, side, field, highlight) {
    box(3, 9, 23, 17, 2, top, highlight, side)
    rect(7, 12, 15, 11, field, side)
    line(8, 13, 20, 13, highlight)
    line(8, 21, 20, 21, side)
  }

  item('clean_panel_blank', () => {
    cleanPanel('#abb1a5', '#717e75', '#788579', '#bfc8b6')
    bolts([[4, 10], [22, 10], [4, 22], [22, 22]], ceramic)
  })
  item('hot_clean_panel', () => {
    cleanPanel('#e29269', '#9c5145', '#e6b187', '#ffd69d')
    line(9, 16, 19, 16, '#ffe1ba')
    line(9, 19, 19, 19, '#ffd69d')
    px(6, 23, 'rust')
    px(23, 23, 'red')
  })
  item('vacuum_treated_panel', () => {
    cleanPanel('#d6e2db', '#738e88', '#bdd8cd', '#edf4e7')
    line(9, 17, 19, 17, '#f1fff4')
    line(7, 24, 21, 24, '#49796d')
    bolts([[4, 10], [22, 10], [4, 22], [22, 22]], brightSteel)
  })

  item('cleanroom_filter_pack', () => {
    box(3, 9, 23, 17, 2, '#b6c5ba', brightSteel, deepSteel)
    rect(6, 12, 17, 11, '#637969', 'edge')
    for (const x of [8, 11, 14, 17, 20]) {
      line(x, 13, x, 21, '#d2e4c7')
      line(x + 1, 13, x + 1, 21, '#435f50')
    }
    line(7, 23, 21, 23, 'white')
    bolts([[4, 10], [22, 10], [4, 22], [22, 22]])
  })

  item('laser_mask', () => {
    // Square photomask with an open window and thin, orthogonal traces.
    rect(4, 4, 24, 24, 'bronze', 'edge')
    rect(7, 7, 18, 18, 'clear', 'edge')
    line(8, 11, 14, 11, '#8fceb5')
    line(14, 11, 14, 14, '#8fceb5')
    line(14, 14, 23, 14, '#8fceb5')
    line(8, 18, 17, 18, '#8fceb5')
    line(17, 18, 17, 21, '#8fceb5')
    line(17, 21, 23, 21, '#8fceb5')
    bolts([[4, 4], [25, 4], [4, 25], [25, 25]], 'gold')
    line(9, 26, 22, 26, 'gold')
  })

  function wafer(top, rim, glint) {
    ellipse(4, 4, 24, 24, rim)
    ellipse(6, 6, 20, 20, top, rim)
    line(12, 7, 19, 7, glint)
    line(8, 12, 8, 15, glint)
    rect(14, 25, 4, 3, 'clear')
  }

  item('vacuum_wafer_preform', () => {
    wafer('#9e9b8f', '#636768', '#d1c8ad')
    ellipse(8, 8, 16, 16, '#8a7f72', '#665f58')
    for (const [x, y] of [[6, 8], [22, 8], [6, 21], [22, 21]]) conductorPin(x, y, 4)
    line(11, 13, 20, 13, '#ae9c7d')
    line(11, 18, 20, 18, '#afa591')
  })

  item('conditioned_wafer', () => {
    wafer('#80a7a0', '#3f6c69', '#e0f4d4')
    line(10, 11, 18, 8, '#b7dfc2')
    line(11, 13, 21, 9, '#a5ccbd')
    line(10, 19, 23, 12, '#689e92')
    line(16, 22, 24, 17, '#669083')
  })

  item('etched_cleanroom_wafer', () => {
    wafer('#659388', '#365d5e', '#c2e6cc')
    for (const y of [10, 14, 18, 22]) {
      line(9, y, 22, y, '#3e5c58')
      for (const x of [11, 15, 19]) px(x, y + 1, '#aee1b7')
    }
    for (const x of [10, 14, 18, 22]) line(x, 9, x, 22, '#385e58')
    px(11, 11, 'white')
    px(19, 19, '#d9cfa0')
  })

  item('chorus_dielectric_film', () => {
    // Thin purple dielectric peels away from its paper roll.
    poly([[3, 19], [9, 13], [20, 9], [27, 11], [29, 15], [25, 20], [14, 22], [7, 26], [3, 24]], '#956aaa')
    poly([[4, 19], [10, 14], [21, 11], [27, 13], [24, 17], [14, 20], [6, 24]], '#c7a7d4')
    line(5, 21, 17, 15, '#e3c8e8')
    line(8, 24, 21, 19, '#a37bba')
    ellipse(20, 5, 10, 13, '#846197')
    ellipse(22, 6, 8, 11, '#bb94ce')
    ellipse(24, 9, 4, 6, '#4d3859')
    px(25, 10, '#d2b4d9')
  })

  item('ev_logic_preform', () => {
    rect(4, 4, 24, 24, '#334c44', 'edge')
    rect(6, 6, 20, 18, '#61795d')
    rect(6, 6, 16, 2, '#9bb68a')
    rect(10, 10, 12, 12, deepSteel)
    rect(12, 12, 8, 6, shadedSteel)
    rect(12, 12, 6, 2, brightSteel)
    for (const y of [12, 18]) {
      rect(6, y, 4, 2, copperLight)
      rect(22, y, 4, 2, copperLight)
    }
    conductorPin(8, 26, 6)
    conductorPin(18, 26, 6)
  })

  item('ev_control_module', () => {
    metalCase(4, 8, 22, 18, 2)
    rect(6, 12, 18, 4, deepSteel)
    rect(8, 12, 4, 2, 'blue')
    rect(8, 18, 16, 6, 'black')
    for (const x of [8, 12, 16, 20]) rect(x, 20, 2, 4, 'copper')
    rect(10, 24, 12, 2, copperShade)
    rect(24, 14, 2, 6, shadedSteel)
  })

  item('ev_harness', () => {
    // Four parallel bare strands terminating in paired ferrules.
    for (const y of [10, 14, 18, 22]) {
      line(7, y, 24, y, 'edge', 3)
      line(7, y, 24, y, 'silver')
    }
    for (const x of [2, 24]) {
      rect(x, 8, 6, 16, deepSteel)
      rect(x + 2, 8, 4, 12, 'copper')
      rect(x + 2, 8, 2, 8, copperLight)
      rect(x + 2, 20, 4, 4, copperShade)
    }
  })

  item('ev_pressure_cage', () => {
    // Rectangular front and rear planes, joined by [6,-3] braces.
    const front = [[4, 10], [22, 10], [22, 26], [4, 26]]
    const rear = front.map(([x, y]) => [x + 6, y - 3])
    for (let index = 0; index < front.length; index++) {
      const next = (index + 1) % front.length
      line(...rear[index], ...rear[next], deepSteel, 3)
      line(...front[index], ...rear[index], 'edge', 3)
      line(...front[index], ...rear[index], 'silver')
    }
    for (let index = 0; index < front.length; index++) {
      const next = (index + 1) % front.length
      line(...front[index], ...front[next], 'edge', 4)
      line(...front[index], ...front[next], index < 2 ? steelFace : shadedSteel, 2)
    }
    rect(4, 10, 18, 2, brightSteel)
    rect(4, 12, 2, 12, brightSteel)
    rect(4, 26, 18, 2, shadedSteel)
    rect(4, 10, 2, 2, copperLight)
    rect(22, 26, 2, 2, 'copper')
  })

  item('ev_traction_coil', () => {
    // Concentric toroid and paired leads, seen along the shaft axis.
    line(10, 22, 10, 28, 'edge', 3)
    line(21, 22, 21, 28, 'edge', 3)
    line(10, 22, 10, 28, 'copper')
    line(21, 22, 21, 28, 'copper')
    ellipse(4, 3, 24, 24, '#a86f46')
    for (const [x, y, a, b] of [[6, 10, 11, 12], [9, 6, 13, 11], [14, 5, 15, 10], [17, 5, 16, 10], [22, 6, 18, 11], [25, 10, 20, 12], [26, 15, 20, 15], [25, 19, 20, 17], [22, 23, 18, 18], [17, 24, 16, 19], [14, 24, 15, 19], [9, 23, 13, 18], [6, 19, 11, 17], [5, 15, 11, 15]]) {
      line(x, y, a, b, '#dcae71', 2)
    }
    ellipse(10, 9, 12, 12, 'clear', 'edge')
    px(10, 28, 'gold')
    px(21, 28, 'gold')
  })

  item('ev_phase_relay', () => {
    // Three top and bottom contacts on the same pitch.
    for (const x of [6, 14, 22]) {
      conductorPin(x, 4, 4)
      conductorPin(x, 26, 4)
    }
    metalCase(4, 8, 24, 18, 1)
    rect(6, 12, 20, 10, deepSteel)
    for (const x of [8, 14, 20]) rect(x, 14, 4, 2, 'blue')
    rect(8, 18, 16, 2, '#537c9e')
  })

  item('ev_engine_jacket', () => {
    // Open bore, fluted cooling mantle and two bronze pipe unions.
    box(4, 10, 18, 16, 4, shadedSteel, steelFace, deepSteel)
    for (const [x, y] of [[22, 10], [26, 8]]) {
      rect(x, y, 2, 14, shadedSteel)
      rect(x, y, 2, 8, brightSteel)
    }
    ellipse(4, 8, 18, 20, steelFace, deepSteel)
    ellipse(6, 10, 14, 16, brightSteel, null)
    ellipse(8, 12, 10, 12, 'clear', deepSteel)
    for (const y of [4, 26]) {
      rect(10, y, 6, 4, copperShade)
      rect(10, y, 4, 2, copperLight)
    }
  })

  item('ev_etching_mask', () => {
    // Symmetric square reticle with registration lugs.
    rect(2, 12, 5, 8, 'silver', 'edge')
    rect(25, 12, 5, 8, 'silver', 'edge')
    poly([[7, 3], [24, 3], [28, 7], [28, 24], [24, 28], [7, 28], [3, 24], [3, 7]], deepSteel)
    poly([[8, 5], [23, 5], [26, 8], [26, 23], [23, 26], [8, 26], [5, 23], [5, 8]], '#66837e')
    rect(8, 8, 16, 16, 'clear', 'edge')
    line(9, 11, 22, 11, mint)
    line(11, 9, 11, 22, mint)
    line(20, 9, 20, 22, mint)
    line(9, 20, 22, 20, mint)
    rect(14, 14, 4, 4, 'clear', 'gold')
    bolts([[6, 6], [23, 6], [6, 23], [23, 23]])
  })

  item('ev_calibrated_wafer', () => {
    wafer('#8caa95', '#42695f', '#dbecd6')
    for (const y of [9, 14, 19]) {
      for (const x of [9, 14, 19]) {
        rect(x, y, 4, 4, '#678475', '#3e655a')
        px(x + 1, y + 1, '#c5e3b9')
        px(x + 2, y + 2, '#95bc9a')
      }
    }
    line(12, 7, 19, 7, 'white')
    px(7, 15, 'gold')
    px(24, 15, 'gold')
  })

  item('ev_commissioning_report', () => {
    document(deepSteel, '#e0e8db', '#a7bdb0')
    rect(8, 6, 8, 4, '#3b695c')
    line(8, 13, 22, 13, '#789287')
    line(8, 16, 19, 16, '#789287')
    line(8, 19, 16, 19, '#789287')
    line(8, 22, 14, 22, '#789287')
    rect(16, 17, 10, 9, '#a6c8a6', '#4e7962')
    line(18, 21, 20, 23, '#2c6d53', 2)
    line(20, 23, 24, 19, '#2c6d53', 2)
    rect(11, 2, 9, 3, shadedSteel, 'edge')
    line(12, 2, 18, 2, brightSteel)
  })
}
