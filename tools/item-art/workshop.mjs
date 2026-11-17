export default function drawWorkshop({ item, poly, rect, ellipse, line, px }) {
  const bark = '#564133'
  const endgrain = '#b18b54'
  const woodLight = '#c8a76b'
  const clayDark = '#693e30'
  const clayBody = '#a3664d'
  const clayLip = '#d7a57d'
  const flintDark = '#484752'
  const flintFace = '#716f7a'
  const flintEdge = '#a7a6b1'
  const steelDark = '#504a50'
  const steelLight = '#d7d7e7'
  const brassDark = '#77523a'
  const brassLight = '#e0ac63'

  function projection(x, y) {
    return (u, v, drop = 0) => [x + 2 * (u - v), y + u + v + drop]
  }

  function beam(point, u, v, length, width, top, depth, colors) {
    const [face, lightSide, darkSide] = colors
    const a = point(u,v,top), b = point(u+length,v,top)
    const c = point(u+length,v+width,top), d = point(u,v+width,top)
    const bLow = point(u+length,v,top+depth), cLow = point(u+length,v+width,top+depth)
    const dLow = point(u,v+width,top+depth)
    poly([d,c,cLow,dLow],lightSide)
    poly([b,c,cLow,bLow],darkSide)
    poly([a,b,c,d],face)
  }

  function chippedFlint(x, y, size) {
    const scale = size / 20
    const facet = (points, fill, stroke = null) => poly(points.map(([u, v]) => [
      Math.round(x + u * scale), Math.round(y + v * scale)
    ]), fill, stroke)
    facet([[0,16],[4,9],[9,8],[13,3],[19,0],[20,3],[16,9],[12,13],[10,17],[4,20]], flintFace, 'edge')
    facet([[3,16],[7,10],[11,10],[16,5],[13,12],[7,17]], flintEdge)
    facet([[4,18],[11,15],[14,10],[18,5],[16,10],[10,17],[5,19]], flintDark)
    facet([[6,11],[10,9],[11,7],[13,6],[10,11]], '#e0e1d8')
  }

  function grip() {
    poly([[4,25],[4,22],[9,18],[13,16],[24,5],[27,5],[28,8],[26,12],[17,20],[12,26],[8,29],[5,28]], bark)
    poly([[5,23],[10,19],[15,16],[25,6],[27,7],[26,9],[17,18],[13,20],[8,26],[6,26]], endgrain, null)
    line(7,23,15,17,woodLight)
    line(10,23,17,17,'wood')
    line(19,14,25,8,bark)
    line(6,26,9,27,endgrain)
  }

  function lash(x, y) {
    line(x,y,x+4,y+4,'walnut',3)
    line(x-1,y+1,x+3,y+5,'straw')
    line(x+1,y-1,x+5,y+3,'straw')
    line(x+3,y+1,x+1,y+5,'oak')
  }

  function powder(base, highlight, shadow, spill) {
    poly([[2,24],[6,20],[8,19],[11,15],[15,12],[19,13],[21,16],[25,18],[26,21],[29,25],[25,27],[8,28]], shadow)
    poly([[4,24],[9,21],[12,16],[16,13],[19,15],[23,18],[25,22],[23,24],[18,25],[9,26]], base, null)
    poly([[10,21],[15,15],[18,14],[20,17],[18,20],[14,21]], highlight, null)
    for (const [x, y] of [[7,23],[10,24],[11,20],[14,23],[17,18],[18,22],[20,24],[23,22],[25,23]]) px(x,y,shadow)
    for (const [x, y] of [[8,24],[13,19],[14,21],[16,16],[17,24],[21,21],[24,25]]) px(x,y,highlight)
    for (const [x, y] of spill) px(x,y,base)
  }

  function rawOre(shadow, vein, glint) {
    const colors = { e: '#28262b', d: '#3c3d43', f: '#575b63', h: '#979ca6', s: shadow, v: vein, m: glint }
    const cells = [
      '................',
      '.......ee.......',
      '......ehe.......',
      '....ehfdm.......',
      '...ehffdde......',
      '..ehfddddee.....',
      '..efffmvdeehee..',
      '..dddvddeehfde..',
      '..dvddeeeffmvs..',
      '..edfdeefdddde..',
      '...efeeedvedee..',
      '....eeeeddeee...',
      '........ehmde...',
      '.........dd.....',
      '.........ee.....',
      '................'
    ]
    cells.forEach((row, y) => {
      Array.from(row).forEach((cell, x) => {
        if (cell !== '.') rect(x * 2, y * 2, 2, 2, colors[cell])
      })
    })
  }

  function concentrate(base, glint, dark) {
    powder(base,glint,dark,[[3,19],[24,16],[27,22],[28,28],[4,27]])
    for (const [x, y] of [[8,22],[12,22],[13,17],[16,22],[18,17],[21,20],[23,24]]) {
      line(x,y,x+1,y,glint)
      px(x+1,y+1,dark)
    }
  }

  function crucible(body, lip, dark, load = null) {
    poly([[3,10],[5,20],[7,23],[10,26],[12,28],[19,28],[21,26],[24,23],[26,20],[28,10]], dark)
    poly([[5,13],[9,15],[11,24],[14,27],[12,27],[9,25],[7,21]], body,null)
    poly([[9,15],[22,15],[24,14],[22,23],[19,26],[12,26],[10,24]], body,null)
    line(8,17,10,23,lip,2)
    line(12,25,19,25,dark,2)
    ellipse(3,4,26,13,body)
    ellipse(6,6,20,9,'black',dark)
    if (load) {
      const [grain, glint, secondMetal] = load
      poly([[7,11],[10,9],[13,10],[15,7],[17,7],[19,10],[22,9],[24,11],[21,13],[10,13]], grain,dark)
      line(10,10,12,10,glint,2)
      line(15,8,17,8,glint,2)
      rect(20,10,2,2,glint)
      if (secondMetal) {
        poly([[18,10],[20,8],[22,9],[23,11],[20,12]], secondMetal,grain)
        px(20,9,'silver')
      }
    }
    line(6,12,10,14,lip,2)
    line(10,14,13,15,lip,2)
    line(13,15,20,15,lip,2)
    line(20,15,25,12,lip,2)
    line(8,7,12,5,lip,2)
  }

  item('flint_shard', () => chippedFlint(4,5,22))

  item('plant_fibre', () => {
    for (const [endX, endY, bendX, shade] of [[3,8,9,'green'],[8,3,11,'oak'],[13,2,14,'straw'],[20,3,17,'green'],[25,7,19,'oak'],[28,12,22,'green']]) {
      line(17,28,bendX,17,'walnut',2)
      line(bendX,17,endX,endY,shade,2)
      line(bendX,16,endX,endY,'straw')
    }
    line(12,23,21,23,'oak',3)
    line(14,22,18,25,'straw')
    px(25,7,'cream')
  })

  item('washed_fibre', () => {
    const roots = [[4,7],[7,4],[11,3],[15,3],[18,2],[22,3],[25,6],[27,8]]
    roots.forEach(([x,y], index) => {
      const center = 7 + index * 2
      line(x,y,center,16,index % 2 ? '#d9d8ad' : '#9fa484',2)
      line(center,16,20 + Math.floor(index/2),27,index % 2 ? '#e4e0b8' : '#8a957f',2)
      px(x,y,'cream')
    })
    line(12,19,22,17,'oak',2)
    line(13,20,23,18,'straw')
    poly([[25,19],[24,22],[23,24],[24,26],[27,26],[28,24],[27,22]], '#88bcb5', '#43666f')
    px(25,23,'white')
  })

  item('fibre_cord', () => {
    ellipse(2,6,26,20,'walnut')
    ellipse(3,4,25,20,'oak')
    ellipse(8,8,16,12,'walnut',null)
    ellipse(10,9,12,9,'clear',null)
    ellipse(5,6,21,16,null,'straw')
    ellipse(6,7,19,14,null,'wood')
    line(23,18,25,23,'walnut',3)
    line(25,23,29,27,'walnut',3)
    line(23,18,25,23,'straw',2)
    line(25,23,29,26,'oak',2)
    for (const [x,y,dx,dy] of [[5,9,2,1],[8,6,1,2],[12,5,1,2],[16,5,1,2],[20,6,-1,2],[24,9,-2,1],[26,14,-2,0],[24,18,-2,-1],[19,22,-1,-2],[14,23,0,-2],[9,21,1,-2],[5,18,2,-1]]) {
      line(x,y,x+dx,y+dy,bark)
    }
  })

  item('tool_binding', () => {
    poly([[3,13],[7,8],[22,8],[27,12],[28,19],[23,24],[7,24],[3,20]], 'walnut')
    poly([[4,13],[8,9],[22,9],[26,13],[27,18],[22,22],[8,22],[4,18]], 'oak',null)
    for (const [y,x] of [[12,6],[15,4],[18,4],[21,7]]) {
      line(x,y,26,y-1,'straw',2)
      line(x,y+1,25,y,'wood')
    }
    line(12,11,19,20,'walnut',5)
    line(17,10,12,20,'walnut',5)
    line(12,11,19,20,'straw',2)
    line(17,10,12,20,'cream',2)
    line(19,20,25,26,'oak',2)
    line(12,19,6,26,'straw',2)
    px(25,26,'cream')
    px(6,26,'cream')
  })

  item('tool_handle', () => {
    grip()
    line(24,7,26,8,'walnut',2)
    line(25,6,27,7,woodLight)
    line(7,25,10,22,'wood')
  })

  item('rough_slat', () => {
    poly([[2,20],[7,17],[10,17],[21,9],[23,6],[27,6],[26,8],[30,9],[28,14],[24,15],[18,20],[15,20],[8,26],[4,25],[2,23]], bark)
    poly([[3,20],[7,18],[10,18],[22,9],[24,7],[25,7],[24,9],[29,9],[28,12],[22,15],[19,15],[13,21],[7,23],[3,22]], endgrain,null)
    line(5,20,20,11,woodLight)
    line(7,23,17,17,woodLight)
    line(10,22,26,11,'wood')
    line(13,19,16,18,bark)
    line(19,12,22,10,bark)
    line(21,15,24,14,bark)
    line(8,24,12,22,'oak')
    px(25,11,woodLight)
  })

  item('wooden_peg', () => {
    poly([[5,24],[18,7],[23,4],[27,6],[27,10],[24,12],[8,26],[4,27]], bark)
    poly([[5,24],[19,7],[22,6],[25,8],[23,10],[8,24]], endgrain,null)
    ellipse(20,4,8,7,woodLight)
    line(23,6,25,7,'wood')
    line(7,23,21,9,'oak')
    line(11,22,22,11,'wood')
    px(24,6,'cream')
  })

  item('workbench_frame', () => {
    function leg(x, y, face) {
      poly([[x,y],[x+4,y],[x+6,y-2],[x+6,y+10],[x+4,y+12],[x,y+12]], face,'walnut')
      rect(x+3,y+2,2,9,'wood')
    }
    leg(12,11,'wood')
    leg(24,11,'wood')
    rect(12,8,17,6,'wood','walnut')
    poly([[4,15],[12,9],[16,9],[8,15],[8,19],[4,19]], 'oak','walnut')
    poly([[20,15],[28,9],[28,13],[20,19]], 'wood','walnut')
    leg(4,17,'oak')
    leg(16,17,'oak')
    rect(4,14,17,6,'oak','walnut')
    rect(6,15,13,2,'straw')
    rect(6,18,13,2,'wood')
    rect(6,16,2,2,'walnut')
    rect(16,16,2,2,'walnut')
  })

  item('workbench_top', () => {
    poly([[4,15],[20,15],[28,9],[28,15],[20,21],[4,21]], 'wood','walnut')
    poly([[4,15],[12,9],[28,9],[20,15]], 'oak','walnut')
    poly([[5,15],[13,9],[16,9],[8,15]], woodLight,null)
    poly([[15,15],[23,9],[27,9],[19,15]], endgrain,null)
    line(9,14,16,9,'wood',2)
    line(14,14,21,9,'wood',2)
    line(6,16,18,16,woodLight,2)
    line(21,16,27,11,'oak',2)
    rect(7,18,3,2,'walnut')
    rect(16,18,3,2,'walnut')
  })

  function pickHead() {
    poly([[3,13],[6,8],[12,5],[19,5],[25,7],[29,11],[29,16],[25,13],[21,11],[15,10],[10,11],[6,13],[4,17]], flintDark)
    poly([[5,12],[8,9],[13,6],[19,6],[24,8],[27,11],[23,10],[17,8],[12,8],[8,10]], flintFace,null)
    line(9,8,13,6,flintEdge)
    line(21,7,25,9,flintEdge)
    line(16,9,19,9,'silver')
  }

  function axeHead() {
    poly([[8,10],[12,6],[17,5],[24,2],[28,4],[30,9],[29,14],[26,18],[23,21],[19,20],[17,17],[11,15]], flintDark)
    poly([[11,10],[16,7],[24,4],[27,5],[29,9],[27,12],[23,16],[19,17],[16,13]], flintFace,null)
    poly([[23,5],[26,5],[28,9],[27,13],[23,18],[20,19],[19,17],[23,14],[25,11],[25,8]], flintEdge,null)
    line(26,5,29,9,'silver')
    line(28,13,24,18,'silver')
    line(17,10,20,8,'steel')
  }

  item('pick_head', pickHead)
  item('axe_head', axeHead)

  item('sand_temper', () => powder('#bd9d61','#e0c898','#886e45',[[2,26],[5,28],[22,14],[24,17],[27,28],[28,23]]))

  item('wet_lining', () => {
    poly([[4,14],[15,8],[22,9],[27,11],[29,14],[28,21],[17,27],[12,27],[5,24],[3,20]], '#725444')
    poly([[4,14],[15,9],[22,10],[27,12],[28,14],[17,20],[12,20],[5,18]], '#b49a7d',null)
    poly([[5,18],[12,20],[17,20],[17,25],[12,26],[6,23]], '#9a7d65',null)
    poly([[17,20],[28,14],[27,20],[17,26]], '#8a6955',null)
    line(6,14,15,10,'#ddc8a8')
    line(7,17,12,19,'#d7ba95')
    line(12,15,15,13,'straw')
    line(18,13,20,12,'straw')
    line(22,15,24,14,'oak')
    line(17,21,25,16,'clay')
    px(10,21,'straw')
  })

  item('fired_lining', () => {
    poly([[4,13],[16,6],[27,10],[29,13],[29,21],[17,28],[5,24],[3,21]], clayDark)
    poly([[4,13],[16,7],[27,11],[16,18],[5,16]], clayBody)
    poly([[5,16],[16,18],[16,25],[6,22]], '#bd7c59',null)
    poly([[17,18],[28,13],[28,20],[17,26]], '#8e4e36',null)
    line(6,13,16,8,clayLip)
    line(6,17,15,19,clayLip)
    line(10,22,11,23,'terracotta')
    line(23,18,25,16,'rust')
    px(21,12,'cream')
    px(9,13,'rust')
  })

  item('unfired_crucible', () => crucible('#a38a72','#d6c1a3','#625549'))
  item('fired_crucible', () => crucible(clayBody,clayLip,clayDark))

  item('kiln_grate', () => {
    rect(8,8,22,6,'iron')
    for (const x of [2,8,14,20]) {
      poly([[x,19],[x+4,19],[x+10,11],[x+6,11],[x,19]], '#8c8684')
      line(x+1,18,x+6,11,'steel',2)
    }
    rect(2,18,23,6,'iron','edge')
    rect(4,18,20,2,'steel')
    rect(10,8,18,2,'steel')
  })

  item('copper_grit', () => rawOre('#8e5139', '#bd7151', '#edaa83'))
  item('washed_copper_grit', () => concentrate('#a35d38','#d58f5e','#694939'))
  item('copper_charge', () => crucible(clayBody,clayLip,clayDark,['#9a593c','#ed9d6c']))

  item('copper_strap', () => {
    poly([[3,20],[8,16],[18,12],[24,7],[28,8],[29,12],[23,17],[16,20],[9,25],[4,25]], '#81422d')
    poly([[4,20],[9,17],[19,13],[25,8],[28,9],[24,13],[20,16],[12,20],[8,23],[4,23]], '#cf875b',null)
    line(5,20,18,14,'#ffc898')
    line(19,14,26,9,'#ffc898')
    line(10,24,20,19,'copper')
    line(9,20,13,18,'#a96140')
    px(23,12,'white')
  })

  item('iron_grit', () => rawOre('#724b43', '#a87563', '#d6ac96'))
  item('washed_iron_grit', () => concentrate('#796e60','#b7a18e','#514a47'))
  item('iron_charge', () => crucible(clayBody,clayLip,clayDark,['#5c6062','#b5a69a']))

  item('iron_bloom', () => {
    poly([[3,18],[5,14],[9,13],[9,9],[14,7],[18,8],[20,6],[24,9],[27,13],[29,18],[27,22],[22,25],[10,25],[5,22]], '#3f4347')
    poly([[5,17],[11,14],[11,10],[15,8],[18,11],[21,8],[25,12],[25,17],[20,21],[10,22]], '#646b6e',null)
    poly([[7,16],[12,15],[15,10],[17,12],[15,15],[11,17],[8,19]], '#9da3a0',null)
    poly([[16,17],[20,13],[23,13],[24,16],[21,20],[17,21],[14,20]], '#876b5a',null)
    for (const [x,y] of [[8,19],[11,19],[13,11],[16,18],[19,15],[21,12],[22,17],[25,19],[18,22],[7,21]]) {
      line(x,y,x+1,y,'dark')
      px(x+1,y-1,'steel')
    }
  })

  item('iron_rivet', () => {
    poly([[8,22],[17,11],[23,13],[24,17],[13,27],[9,26],[7,24]], steelDark)
    poly([[9,22],[19,13],[22,14],[21,16],[11,25]], 'steel',null)
    line(10,22,19,14,'silver')
    ellipse(15,5,13,12,'iron')
    ellipse(16,5,12,9,'silver')
    ellipse(18,7,7,4,'steel',null)
    line(18,7,23,6,'white')
    line(17,13,24,15,steelDark)
  })

  item('hand_forged_plate', () => {
    poly([[2,16],[7,12],[10,11],[13,8],[16,8],[21,5],[28,9],[30,11],[27,15],[23,17],[18,22],[13,24],[10,25],[6,23],[3,22]], steelDark)
    poly([[3,16],[9,13],[15,9],[21,6],[28,10],[26,13],[21,16],[16,20],[9,23],[4,20]], '#929b9d',null)
    line(4,16,11,12,steelLight)
    line(11,12,21,7,'silver')
    line(5,19,9,21,'silver')
    line(12,22,24,15,'steel')
    line(7,17,9,18,'iron')
    line(14,13,16,14,'iron')
    line(19,10,21,11,'iron')
    px(13,17,'silver')
    px(19,15,'steel')
  })

  item('tin_grit', () => rawOre('#555e69', '#98a7b5', '#d9e4e7'))
  item('washed_tin_grit', () => concentrate('#a9aba8','#e0dfd5','#686d6b'))
  item('tin_charge', () => crucible(clayBody,clayLip,clayDark,['#a8adae','#eaebdd']))
  item('gold_grit', () => rawOre('#86602c', '#c69a4c', '#ffe09a'))
  item('washed_gold_grit', () => concentrate('#b8904f','#efcf7a','#79613d'))
  item('gold_charge', () => crucible(clayBody,clayLip,clayDark,['#ad8240','#f9dc88']))
  item('bronze_charge', () => crucible(clayBody,clayLip,clayDark,['#88573d','#d19670','#9ca8aa']))
  item('ore_tailings', () => powder('#64645f','#9f9380','#434543',[[2,22],[3,27],[22,15],[25,18],[29,22],[28,28]]))

  item('wooden_joint', () => {
    const point = projection(15,9)
    beam(point,2,0,2,3,1,5,[endgrain,'wood',bark])
    beam(point,0,3,6,2,1,5,[woodLight,endgrain,bark])
    beam(point,2,5,2,1,1,5,[endgrain,'wood',bark])
    beam(point,2,3,2,2,0,2,['oak',endgrain,bark])
    line(...point(1,4,1),...point(2,4,1),'oak')
    line(...point(4,4,1),...point(5,4,1),'oak')
    line(...point(3,1,1),...point(3,2,1),woodLight)
    ellipse(14,14,4,3,'walnut')
    px(15,14,'straw')
  })

  item('iron_hinge', () => {
    const leaf = [[3,8],[5,6],[12,6],[15,9],[15,22],[12,25],[5,25],[3,23]]
    const inset = [[4,8],[6,7],[12,7],[14,9],[14,22],[12,24],[6,24],[4,22]]
    const mirror = points => points.map(([x,y]) => [31-x,y])
    poly(leaf,steelDark)
    poly(mirror(leaf),steelDark)
    poly(inset,'steel',null)
    poly(mirror(inset),'iron',null)
    rect(13,4,6,24,'silver','edge')
    rect(14,6,2,20,'white')
    for (const y of [10,16,22]) rect(14,y,4,2,steelDark)
    for (const x of [6,20]) {
      for (const y of [8,18]) {
        ellipse(x,y,6,6,'clear','dark')
        rect(x+2,y+4,2,2,'silver')
      }
    }
  })

  item('stone_chisel', () => {
    poly([[6,21],[11,17],[17,12],[19,13],[18,17],[10,25],[7,27],[4,25]], bark)
    line(6,24,16,15,endgrain,3)
    line(7,23,14,17,woodLight)
    poly([[13,17],[17,10],[21,6],[24,5],[28,6],[27,10],[24,13],[18,18],[15,20]], flintDark)
    poly([[16,16],[19,10],[23,7],[26,7],[24,11],[20,13],[17,17]], flintFace,null)
    line(24,6,27,7,'silver')
    line(20,10,25,7,flintEdge)
    lash(13,15)
  })

  item('clay_mortar', () => {
    poly([[3,19],[8,16],[11,15],[15,12],[20,12],[23,15],[25,17],[29,19],[29,22],[26,24],[20,23],[16,26],[7,25],[2,22]], '#7d5844')
    poly([[4,20],[11,17],[15,13],[20,13],[23,16],[26,18],[24,20],[17,22],[8,23]], '#b48c70',null)
    poly([[12,17],[16,14],[20,15],[22,17],[16,19],[11,20],[9,19]], '#ceab8a',null)
    line(5,21,10,22,'cream')
    line(20,20,26,19,'clay')
    line(15,24,19,22,'clay')
    px(18,16,'cream')
  })

  item('abrasive_paste', () => {
    poly([[3,22],[7,20],[9,16],[13,13],[18,12],[23,14],[26,17],[29,22],[25,25],[19,25],[15,27],[8,26],[4,25]], '#515758')
    poly([[5,22],[10,19],[13,14],[18,13],[22,15],[25,18],[25,21],[18,23],[13,24],[8,24]], '#8b9287',null)
    line(12,18,17,15,'silver',2)
    line(9,22,14,21,'steel')
    for (const [x,y] of [[8,21],[10,23],[13,16],[14,22],[17,20],[19,17],[21,21],[22,17],[25,21],[27,24]]) {
      px(x,y,'dark')
      px(x+1,y-1,'cream')
    }
  })

  item('glass_batch', () => {
    powder('#a7b3a7','#e0e1c7','#74827e',[[2,21],[5,28],[23,14],[28,21],[29,26]])
    for (const [x,y] of [[11,19],[14,21],[17,15],[18,23],[22,20]]) {
      poly([[x,y],[x+2,y-1],[x+3,y+1],[x+1,y+2]], '#c4dacd','#7d9b91')
      px(x+1,y,'white')
    }
  })

  item('wheel_segment', () => {
    poly([[3,21],[4,15],[8,10],[13,7],[19,5],[26,6],[29,10],[27,14],[23,11],[18,11],[14,12],[10,15],[8,19],[7,25]], bark)
    poly([[4,20],[6,15],[10,11],[15,8],[21,7],[26,8],[27,11],[23,10],[18,10],[13,12],[9,16],[7,22]], endgrain,null)
    poly([[2,19],[5,16],[11,20],[11,23],[8,26],[2,22]], 'wood')
    poly([[7,11],[10,8],[15,13],[14,17],[12,18],[7,14]], 'oak')
    poly([[15,6],[18,4],[23,7],[22,12],[19,14],[16,11]], 'wood')
    poly([[23,6],[27,5],[30,7],[29,12],[26,14],[23,11]], 'oak')
    line(3,19,8,23,woodLight)
    line(9,10,13,15,woodLight)
    line(16,6,20,10,woodLight)
    line(25,7,28,9,woodLight)
    px(8,24,'walnut')
    px(13,16,'walnut')
    px(21,11,'walnut')
    px(28,11,'walnut')
  })

  item('shaft_bushing', () => {
    ellipse(17,5,12,16,'iron')
    poly([[7,13],[21,6],[26,8],[28,13],[27,18],[13,25],[7,25]], 'iron')
    poly([[8,13],[22,6],[26,8],[12,15]], '#a6a18a',null)
    line(13,18,27,11,'steel')
    line(13,22,27,15,steelDark)
    ellipse(3,12,12,16,'bronze')
    ellipse(4,14,10,12,'iron','walnut')
    ellipse(6,16,6,8,'clear','black')
    line(5,14,7,13,'gold')
    line(5,24,7,26,steelLight)
  })

  function gearRim() {
    poly([[10,3],[13,5],[18,5],[21,3],[25,6],[24,9],[27,12],[30,12],[30,18],[27,18],[24,22],[25,25],[21,28],[18,26],[13,26],[10,28],[6,25],[7,22],[4,19],[2,19],[2,12],[5,12],[7,9],[6,6]], brassDark)
    ellipse(5,5,22,21,'bronze',brassLight)
    ellipse(10,9,13,13,'clear','walnut')
    line(8,9,12,6,brassLight)
    line(19,24,24,20,brassDark)
    line(4,13,4,17,'gold')
    line(26,13,28,13,'gold')
    line(10,5,12,6,'gold')
    line(20,6,22,5,'gold')
    px(9,23,'gold')
    px(22,22,'gold')
  }

  item('gear_rim', gearRim)

  item('saw_teeth', () => {
    function tooth(x, y) {
      poly([[x,y+6],[x+6,y],[x+10,y+6],[x+10,y+13],[x,y+13]], steelDark)
      poly([[x+2,y+6],[x+6,y+2],[x+8,y+6],[x+8,y+11],[x+2,y+11]], 'steel',null)
      line(x+1,y+6,x+6,y+1,'silver',2)
      ellipse(x+2,y+6,6,6,'clear','dark')
    }
    tooth(2,14)
    tooth(10,4)
    tooth(20,14)
  })

  item('saw_blade', () => {
    for (let y = 3; y <= 12; y++) {
      for (let x = 3; x <= 12; x++) {
        const radius = Math.hypot(x-7.5,y-7.5)
        if (radius > 5.15 || radius <= 1.5) continue
        const shade = radius > 4.25 ? 'iron' : radius < 2.55 ? 'dark' : 'steel'
        rect(x*2,y*2,2,2,shade)
      }
    }
    const teeth = [[13,6],[14,6],[13,7],[14,7],[13,8],[11,3],[12,2],[13,2],[12,3],[12,4]]
    for (const [startX,startY] of teeth) {
      let x = startX, y = startY
      for (let turn = 0; turn < 4; turn++) {
        rect(x*2,y*2,2,2,turn >= 2 ? 'silver' : 'iron')
        const nextX = 15-y
        y = x
        x = nextX
      }
    }
    for (const [x,y] of [[5,5],[6,4],[7,4],[4,6]]) rect(x*2,y*2,2,2,'silver')
  })

  item('woven_drive_belt', () => {
    ellipse(2,9,28,18,bark)
    ellipse(2,6,28,18,'oak')
    ellipse(5,8,22,14,'walnut')
    ellipse(7,9,18,12,'clear',null)
    line(5,19,10,22,woodLight)
    line(10,22,21,22,woodLight)
    line(21,22,26,19,woodLight)
    for (const x of [8,11,14,17,20,23]) {
      line(x,23,x+1,24,'wood')
      px(x,22,'straw')
    }
    line(15,21,15,26,'dark',2)
    px(15,22,'gold')
    px(15,25,'gold')
  })

  item('sealed_boiler_joint', () => {
    ellipse(16,4,14,18,'bronze')
    ellipse(18,6,10,14,'black',brassDark)
    poly([[6,14],[20,7],[25,8],[28,12],[27,17],[13,24],[7,24],[5,19]], brassDark)
    poly([[8,14],[22,7],[25,9],[11,16]], 'bronze',null)
    line(12,16,26,9,brassLight)
    line(13,21,27,14,'black',2)
    ellipse(2,11,14,18,'copper')
    ellipse(4,13,10,14,'bronze','dark')
    ellipse(6,15,6,10,'clear','black')
    for (const x of [5,12]) {
      px(x,15,'gold')
      px(x,24,'gold')
    }
    line(6,12,11,12,brassLight)
  })

  item('stamped_bronze_blank', () => {
    const point = projection(15,8)
    beam(point,0,0,6,5,0,5,['bronze',brassDark,'#644936'])
    poly([point(1,1),point(5,1),point(5,4),point(1,4)], '#af7649',brassDark)
    line(...point(1,1,1),...point(1,4,1),brassLight)
    line(...point(1,4,1),...point(5,4,1),brassLight)
    line(...point(1,5,1),...point(5,5,1),brassLight)
    line(...point(6,1,1),...point(6,4,1),brassLight)
    px(...point(0,4),'walnut')
    px(...point(5,0),'walnut')
  })

  item('insulating_gum', () => {
    poly([[3,20],[5,15],[9,13],[12,15],[15,12],[18,9],[22,9],[24,12],[25,17],[28,19],[29,23],[25,26],[17,25],[11,26],[5,24]], '#684723')
    poly([[4,20],[7,16],[10,15],[13,18],[16,14],[19,10],[22,11],[24,15],[24,19],[28,22],[25,24],[17,23],[11,25],[6,23]], '#a56c32',null)
    poly([[7,18],[9,16],[12,18],[11,21],[7,22],[5,20]], '#cb8e44',null)
    poly([[17,14],[19,11],[21,12],[22,14],[21,18],[18,19],[16,18]], '#d69c4e',null)
    line(7,17,10,17,'straw')
    line(18,13,19,12,'cream')
    line(24,21,27,22,'gold')
    px(13,23,'straw')
  })

  item('impregnated_fibre', () => {
    poly([[3,22],[6,17],[15,11],[23,5],[28,7],[29,12],[23,17],[17,20],[8,26],[4,26]], 'walnut')
    for (const [y,color] of [[20,'#785539'],[22,'#a78055'],[24,'#6c4e3b']]) {
      line(5,y,15,y-7,color,2)
      line(15,y-7,26,y-14,color,2)
    }
    line(6,20,16,13,'straw')
    line(17,16,23,12,'oak')
    line(10,16,14,22,'walnut',3)
    line(10,16,14,22,'oak')
    line(20,9,24,15,'walnut',3)
    line(20,9,24,15,'oak')
  })

  item('pressed_insulation', () => {
    poly([[3,19],[16,11],[26,11],[29,15],[28,19],[16,27],[6,27],[3,24]], '#414337')
    poly([[4,19],[16,12],[26,12],[28,15],[26,18],[15,24],[6,24]], '#74785f',null)
    line(5,20,14,21,'#a9aa80')
    line(6,23,16,23,'#3c4036')
    poly([[16,11],[22,7],[27,8],[29,11],[28,16],[23,20],[18,19],[15,15]], '#8e8f69')
    ellipse(22,7,8,10,'#aaac83','dark')
    ellipse(24,9,4,6,'black','dark')
    line(16,12,22,8,'cream')
    line(18,18,22,19,'walnut')
  })

  item('tin_wire_blank', () => {
    for (const [x,y] of [[5,17],[9,20],[12,23]]) {
      poly([[x-2,y],[x+14,y-12],[x+16,y-12],[x+17,y-10],[x+15,y-8],[x,y+3],[x-2,y+3]], steelDark)
      line(x-1,y,x+14,y-11,'silver',2)
      line(x+1,y+1,x+15,y-9,'steel')
      line(x-1,y+1,x-1,y+2,'iron')
      px(x+14,y-11,'white')
    }
  })

  item('copper_contact_strip', () => {
    const point = projection(22,7)
    beam(point,0,0,3,9,1,3,['#c78352',brassDark,'#7c4938'])
    line(...point(0,1,1),...point(0,8,1),'#e9b47c')
    for (const v of [1,3,5,7]) {
      poly([point(1,v),point(2,v),point(2,v+1),point(1,v+1)],brassLight,brassDark)
      px(...point(1,v),'cream')
    }
    px(...point(1,0,1),'black')
    px(...point(1,8,2),'black')
  })

  item('circuit_laminate', () => {
    const point = projection(14,7)
    beam(point,0,0,7,5,6,3,['wood',bark,'walnut'])
    beam(point,0,0,7,5,3,3,['gold','copper','bronze'])
    beam(point,0,0,7,5,0,3,['#42574a','#364b43','#293a38'])
    for (const [u,v,u2,v2,wire] of [[1,1,4,1,'gold'],[4,1,4,3,'gold'],[1,3,3,3,'copper'],[3,3,3,2,'copper'],[3,2,5,2,'copper'],[5,2,5,4,'copper']]) {
      line(...point(u,v),...point(u2,v2),wire,2)
    }
    for (const [u,v] of [[1,1],[4,3],[1,3],[5,4]]) rect(...point(u,v),2,2,'straw')
    line(...point(1,5,5),...point(5,5,5),'copper',2)
    line(...point(7,1,5),...point(7,4,5),'bronze',2)
  })

  item('carbon_resistor_core', () => {
    poly([[4,19],[7,15],[20,7],[25,8],[28,12],[27,16],[13,25],[8,26],[5,24]], '#25292d')
    poly([[6,18],[9,16],[21,8],[25,10],[25,13],[12,21],[7,22]], '#555b58',null)
    line(8,18,21,10,'#7e8075',2)
    line(10,24,25,15,'dark')
    ellipse(4,17,11,10,'#353837','edge')
    ellipse(6,18,7,6,'#575b54','dark')
    px(8,20,'black')
    px(11,22,'dark')
    px(20,12,'black')
    px(23,10,'steel')
  })

  item('glass_tube_blank', () => {
    poly([[8,12],[9,9],[12,7],[13,6],[13,3],[18,3],[18,6],[19,7],[22,9],[23,12],[23,23],[21,26],[10,26],[8,23]], '#507a78')
    poly([[9,12],[11,9],[14,7],[14,4],[17,4],[17,7],[20,9],[22,12],[22,22],[20,25],[11,25],[9,22]], '#a4c8bc',null)
    poly([[12,12],[14,10],[17,10],[19,12],[19,21],[17,23],[14,23],[12,21]], '#67978e',null)
    line(10,12,10,20,'white',2)
    line(11,10,14,8,'white')
    line(20,13,20,19,'glass')
    ellipse(8,22,16,7,'#9b8770','#4e544c')
    ellipse(10,22,12,4,'#c8ddd2','#6f9693')
    line(12,25,19,25,'glass')
    px(14,5,'white')
  })

  item('tin_solder_preform', () => {
    ellipse(3,8,23,17,'iron')
    ellipse(3,5,23,17,'silver')
    ellipse(7,8,15,12,'steel',null)
    ellipse(9,9,11,9,'clear','iron')
    ellipse(5,6,19,14,null,'iron')
    ellipse(4,6,20,15,null,'white')
    line(23,17,25,21,'silver',2)
    line(25,21,29,24,'silver',2)
    line(24,18,25,21,'steel')
    line(26,22,29,24,'white')
    px(28,24,'dark')
  })

  item('bench_soldering_iron', () => {
    poly([[3,23],[5,20],[11,16],[15,17],[16,21],[8,28],[5,28],[3,26]], bark)
    line(6,24,12,19,endgrain,3)
    line(7,23,12,19,woodLight)
    poly([[12,17],[14,14],[18,10],[21,11],[22,14],[16,21]], steelDark)
    line(14,17,19,12,'silver',2)
    poly([[18,10],[22,6],[25,5],[28,6],[29,9],[27,12],[26,14],[23,16],[21,14],[21,11]], 'copper')
    poly([[20,9],[24,6],[27,7],[27,9],[23,12],[22,12]], '#d99561',null)
    line(23,7,26,6,'cream')
    line(24,14,28,10,'rust')
    px(26,14,'silver')
  })

  item('wound_stator', () => {
    ellipse(3,7,26,21,'iron')
    ellipse(3,4,26,21,'steel')
    ellipse(6,6,20,17,'dark','iron')
    for (const [x,y,w,h] of [[6,10,5,9],[10,6,5,6],[17,6,5,6],[21,10,5,9],[10,17,5,6],[17,17,5,6]]) {
      rect(x,y,w,h,'copper','rust')
      line(x+1,y+1,x+w-2,y+1,'gold')
      line(x+1,y+3,x+w-2,y+3,'gold')
    }
    ellipse(10,9,12,11,'clear','black')
    line(5,10,11,5,'silver')
    line(20,24,26,21,steelDark)
    px(25,17,'silver')
  })

  item('magnetic_armature', () => {
    line(5,24,27,13,steelDark,5)
    line(5,23,27,12,'silver',2)
    for (const [x,y] of [[18,8],[16,9],[14,10],[12,11],[10,12],[8,13]]) {
      ellipse(x,y,10,14,'iron',steelDark)
      line(x+2,y+2,x+5,y+1,'silver')
    }
    ellipse(8,13,10,14,'steel')
    ellipse(10,16,6,8,'dark','iron')
    line(6,23,12,20,'silver',2)
    line(17,22,25,18,'blue')
    line(9,16,11,14,'red',2)
    line(25,13,27,12,'silver',2)
  })

  function turbineRotor(balanced) {
    line(15,17,27,11,steelDark,5)
    line(15,16,27,10,'silver',2)
    ellipse(4,7,24,24,brassDark)
    ellipse(4,5,24,24,'bronze',balanced ? 'silver' : 'edge')
    ellipse(6,7,20,20,'black',brassDark)
    for (let i = 0; i < 8; i++) {
      const angle = i * Math.PI / 4
      const points = [[3,-0.24],[8,-0.28],[10,-0.09],[10,0.17],[6,0.19],[3,0.42]].map(([radius,sweep]) => [
        Math.round(15.5+Math.cos(angle+sweep)*radius), Math.round(16.5+Math.sin(angle+sweep)*radius)
      ])
      poly(points,i % 2 ? 'bronze' : brassLight,brassDark)
    }
    ellipse(11,12,10,10,'iron','black')
    ellipse(13,14,6,6,'silver','edge')
    line(7,11,11,7,brassLight)
    line(20,27,24,23,brassLight)
    if (balanced) {
      px(8,24,'silver')
      px(23,9,'silver')
      line(14,15,17,15,'white')
    } else {
      rect(6,21,3,3,brassDark,'edge')
      rect(23,10,3,3,'bronze','edge')
    }
  }

  item('turbine_rotor_blank', () => turbineRotor(false))
  item('balanced_turbine_rotor', () => turbineRotor(true))

  item('flint_knife', () => {
    poly([[3,25],[4,21],[10,15],[15,15],[16,19],[10,27],[7,29],[4,28]], bark)
    line(5,25,13,17,endgrain,3)
    line(6,23,11,18,woodLight)
    poly([[11,16],[16,11],[19,9],[27,3],[29,3],[28,8],[23,14],[20,16],[15,20]], flintDark)
    poly([[13,16],[18,12],[21,10],[27,5],[25,10],[20,14],[17,17]], flintFace,null)
    line(16,19,20,16,flintEdge)
    line(20,16,24,12,flintEdge)
    line(24,12,28,5,'silver')
    lash(10,15)
  })

  item('stone_hammer', () => {
    poly([[3,25],[4,22],[15,14],[21,11],[24,13],[22,16],[17,19],[8,28],[5,29]], bark)
    line(6,26,19,15,endgrain,3)
    line(7,24,13,19,woodLight)
    poly([[11,11],[15,5],[22,3],[28,5],[30,9],[28,14],[25,17],[19,18],[13,15]], '#62696a')
    poly([[12,11],[16,6],[21,4],[28,6],[27,9],[21,10],[17,13]], '#a1a6a0',null)
    poly([[21,10],[28,7],[29,9],[26,15],[22,16],[19,14]], '#7a7f7b',null)
    line(15,8,19,6,'silver')
    line(22,11,25,10,'steel')
    line(13,11,15,14,'iron')
    lash(15,12)
  })

  item('fire_drill', () => {
    poly([[3,25],[12,21],[23,21],[28,24],[27,27],[16,30],[4,28]], bark)
    poly([[4,25],[13,22],[22,22],[27,24],[17,27],[5,27]], endgrain,null)
    ellipse(12,22,9,4,'black','wood')
    poly([[14,24],[14,8],[17,4],[19,5],[19,20],[17,25]], endgrain)
    line(15,23,16,7,'straw')
    poly([[5,9],[9,6],[15,5],[23,6],[27,9],[27,11],[24,12],[20,10],[12,10],[7,12],[4,11]], bark)
    line(7,9,13,7,'oak',2)
    line(13,7,22,8,woodLight)
    line(7,11,13,16,'straw')
    line(13,16,25,11,'straw')
    line(14,14,18,16,'oak',2)
    px(17,25,'orange')
    px(18,26,'red')
    px(20,26,'gold')
  })

  item('flint_pickaxe', () => {
    poly([[5,27],[7,23],[12,17],[15,11],[17,8],[20,10],[18,16],[15,21],[10,27],[7,30],[5,29]], bark)
    line(7,27,14,19,endgrain,3)
    line(13,20,18,11,woodLight,2)
    pickHead()
    lash(14,8)
    line(14,10,19,9,'oak')
  })

  item('flint_axe', () => {
    grip()
    axeHead()
    lash(10,11)
    line(10,13,15,11,'oak',2)
  })
}
