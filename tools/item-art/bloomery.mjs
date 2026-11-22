import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { png } from '../png.mjs'

const root = fileURLToPath(new URL('../../pack/overrides/kubejs/assets/kubejs/',import.meta.url))
const modelDir = join(root,'models/block'), texDir = join(root,'textures/block')
for(const dir of [modelDir,join(modelDir,'fieldwork'),texDir,join(root,'models/item')]) mkdirSync(dir,{recursive:true})
function json(path,data){writeFileSync(path,JSON.stringify(data,null,2)+'\n')}
const noise=(x,y)=>((x*131+y*359+x*y*17)^((x+5)*(y+3)*29))%23
const palette={
  masonry:['5b3d34','73503f','895a47','9d6951','ad7b5c','bc8d69','716053'],
  fireclay:['52362c','714534','8c5740','a46b4b','bc8460','cc9971'],
  burnt:['282321','38302c','493a32','61483c','7e5847'],
  timber:['383029','503d30','69513a','806545','a18055','c29c6c'],
  hide:['302a26','4e3930','65493b','81604a','9c7657','c39c72'],
  embers:['241e1b','352824','4f3029','6e3e2d','a15a32','d97d34','ffb347','ffdd77','fff0b1']
}
function texture(id,pal,sample,frames=1){const data=Buffer.alloc(16*16*frames*4);for(let t=0;t<frames;t++)for(let y=0;y<16;y++)for(let x=0;x<16;x++){
 const col=pal[sample(x,y,t)],idx=(t*256+y*16+x)*4;data.writeUIntBE(parseInt(col,16),idx,3);data[idx+3]=255
 }writeFileSync(join(texDir,id+'.png'),png(16,16*frames,data));if(frames>1)json(join(texDir,id+'.png.mcmeta'),{animation:{frametime:3,interpolate:false}})}
if (!process.argv.includes('--geometry-only')) {
texture('bloomery_masonry',palette.masonry,(x,y)=>{const row=Math.floor(y/4),bx=(x+row%2*4)%8,by=y%4,n=noise(x,y);if(by===3||bx===7)return n<8?0:6;if(by===0&&bx<6)return n<9?4:5;if(bx===0)return 4;if(bx===6||by===2)return n<6?1:2;return n<8?2:3})
texture('bloomery_fireclay',palette.fireclay,(x,y)=>{const n=noise(x,y);return (y===0||x===0)?(n<8?3:4):(x===15||y===15)?1:n<3?2:n<16?3:4})
texture('bloomery_scorched',palette.burnt,(x,y)=>{let n=noise(x,y);return y===15||((x+Math.floor(y/5)*3)%9===0&&y%5>1)?0:y<3?1:n<9?2:n>18?4:3})
texture('bloomery_timber',palette.timber,(x,y)=>{let n=noise(x,y);return x===0||y===15?0:(y===0||y===6||y===12)?4:y%5===3?1:n<5?3:2})
texture('bloomery_leather',palette.hide,(x,y)=>{const n=noise(x,y);return y%4===3?1:y%4===0?4:(x===1||x===14)&&y%3===1?5:n<9?2:3})
texture('bloomery_cold_coals',palette.embers,(x,y)=>{const n=noise(x,y);return n<4?0:n<12?1:n<19?2:3})
texture('bloomery_live_coals',palette.embers,(x,y,t)=>{const h=(x+Math.floor(y/3)*3)%5,n=noise(x,y),wave=[0,1,2,1,0,-1,-1,0][(t+Math.floor(x/4))%8];
 if(y<3)return n>14?2:1;if(y<6&&h!==1)return n>12?3:2;return Math.max(2,Math.min(8,(y>=11?6:4)+(h===1?1:0)+(n>16?1:-1)+wave))},8)
texture('bloomery_hearthstone',['3b3937','514c46','62594e','777063','8a8274','a39883'],(x,y)=>{const n=noise(x,y);if(y===15||x===15)return 1;if(y===0||x===0)return n<7?3:4;if((x+y*2)%13===2)return 2;return n<4?2:n<17?3:4})
}
const textureMap={};for(const slot of ['masonry','fireclay','scorched','timber','leather','cold_coals','live_coals','hearthstone'])textureMap[slot]='kubejs:block/bloomery_'+slot
const dirs=['down','up','north','south','west','east']
function cube(name,a,b,tex,emissive=false) {
 const dimensions=[b[0]-a[0],b[1]-a[1],b[2]-a[2]]
 const faces={};for(const dir of dirs){const [u,v]=dir==='up'||dir==='down'?[dimensions[0],dimensions[2]]:dir==='north'||dir==='south'?[dimensions[0],dimensions[1]]:[dimensions[2],dimensions[1]];faces[dir]={uv:[0,0,Math.min(16,u),Math.min(16,v)],texture:'#'+tex};if(emissive)faces[dir].forge_data={block_light:15,sky_light:15}}
 return {name,from:a,to:b,shade:!emissive,faces}
}
function mdl(name,elements,extraTextures={}) {
  // KubeJS generates a model at block/<registered ID> above the mod resource pack.
  // Give the authored geometry its own path so blockstates and inventory items both use it.
  const model = name.startsWith('field_bloomery_') ? name : 'fieldwork/'+name
  json(join(modelDir,model+'.json'),{
    parent:'minecraft:block/block',ambientocclusion:true,
    textures:{particle:textureMap.masonry,...textureMap,...extraTextures},elements
  })
  if (name !== 'field_bloomery_formed') {
    json(join(root,'models/item',name+'.json'),{parent:'kubejs:block/'+model})
  }
}
function ring(name,x0,x1,y0,y1,z0,z1,thick,texture){return [
 cube(name+'_front',[x0,y0,z0],[x1,y1,z0+thick],texture),cube(name+'_back',[x0,y0,z1-thick],[x1,y1,z1],texture),
 cube(name+'_left',[x0,y0,z0+thick],[x0+thick,y1,z1-thick],texture),cube(name+'_right',[x1-thick,y0,z0+thick],[x1,y1,z1-thick],texture)]}
// The released controller provides the arch, timber bellows, and fittings for the assembled model.
const controllerParts = [
  ["sill",[0,0,0],[16,3,6],"masonry"],
  ["left_pier",[0,3,0],[3,12,6],"masonry"],
  ["right_pier",[13,3,0],[16,12,6],"masonry"],
  ["lintel",[0,12,0],[16,16,6],"masonry"],
  ["firebed",[3,3,3],[13,4,11],"cold_coals"],
  ["coals",[3,4,11],[13,12,11.5],"cold_coals"],
  ["left_arch",[1,3,-2],[4,11,1],"fireclay"],
  ["right_arch",[12,3,-2],[15,11,1],"fireclay"],
  ["arch_left_step",[2,10,-2],[6,13,1],"fireclay"],
  ["arch_right_step",[10,10,-2],[14,13,1],"fireclay"],
  ["keystone",[5,12,-2],[11,15,1],"fireclay"],
  ["tapping_sill",[5,2,-2],[11,4,4],"scorched"],
  ["spout_bed",[5,2.45,-8],[11,3.45,-2],"fireclay"],
  ["spout_left",[5,3,-8],[6,4.35,-2],"fireclay"],
  ["spout_right",[10,3,-8],[11,4.35,-2],"fireclay"],
  ["tuyere_socket",[13,5,-3],[16,9,2],"scorched"],
  ["tuyere_neck",[14,6,-5],[20,8,-2],"fireclay"],
  ["bellows_lower_board",[17,4,-11],[29,5,-2],"timber"],
  ["bellows_fold_a",[18,5,-10],[28,7,-3],"leather"],
  ["bellows_fold_b",[19,7,-9],[27,9,-4],"leather"],
  ["bellows_upper_board",[17,9,-11],[29,10,-2],"timber"],
  ["bellows_handle",[25,9,-15],[28,11,-8],"timber"],
  ["rack_left",[18,0,-9],[20,4,-7],"timber"],
  ["rack_right",[26,0,-5],[28,4,-3],"timber"],
  ["inner_wall",[0,0,5],[16,3,16],"fireclay"],
  ["arch_ceiling",[0,13,6],[16,16,16],"masonry"],
  ["mantle_left",[-16,13.2,-1],[0,15.2,1],"scorched"],
  ["mantle_right",[16,13.2,-1],[32,15.2,1],"scorched"],
  ["firebrick_shelf",[2,1,16],[14,3,31],"fireclay"],
  ["inner_wall_left",[0,3,16],[2,15,32],"fireclay"],
  ["inner_wall_right",[14,3,16],[16,15,32],"fireclay"],
  ["chamber_rail_left",[3,3,17],[4,4,31],"scorched"],
  ["chamber_rail_right",[12,3,17],[13,4,31],"scorched"],
  ["crucible_foot",[5,4,20],[11,5,26],"scorched"]
]

function completeFurnace(working) {
  const coals = working ? 'live_coals' : 'cold_coals'
  const parts = controllerParts.map(([name, from, to, material]) => {
    const yOffset = working && /bellows_(fold_b|upper_board|handle)/.test(name) ? 0.65 : 0
    const shift = coordinates => [coordinates[0], coordinates[1] + yOffset, coordinates[2]]
    return cube(name, name === 'bellows_fold_b' ? from : shift(from), shift(to),
      material === 'cold_coals' ? coals : material)
  })
  parts.push(
    cube('crucible_floor',[4,5,19],[12,5.65,27],'fireclay'),
    ...ring('crucible_body',4,12,5.65,8,19,27,1.4,'fireclay'),
    ...ring('crucible_lip',3.5,12.5,8,9,18.5,27.5,1.9,'scorched'),
    cube('crucible_charge',[5.45,6.75,20.45],[10.55,7,25.55],coals),
    cube('basin_link_floor',[5,2.5,-14],[11,3.45,-8],'fireclay'),
    cube('basin_link_left',[5,3.45,-14],[6,4.5,-8],'fireclay'),
    cube('basin_link_right',[10,3.45,-14],[11,4.5,-8],'fireclay')
  )
  // Coordinates use the controller front as Z=0. The original stone foundation stays in the world.
  const masonry = [
    [-16,0,0],[16,0,0],
    [-16,0,16],[16,0,16],
    [-16,0,32],[0,0,32],[16,0,32]
  ]
  for (const [x,y,z] of masonry) {
    parts.push(cube('masonry',[x,y,z],[x+16,y+16,z+16],'masonry'))
  }
  const basin = JSON.parse(readFileSync(join(modelDir,'fieldwork/bloomery_casting_basin.json'),'utf8'))
  for (const element of basin.elements) {
    const offset = coordinates => [coordinates[0], coordinates[1], coordinates[2]-16]
    parts.push({...element,from:offset(element.from),to:offset(element.to)})
  }
  // Leave the cast recess open and keep the old fireclay rim.
  parts.push(
    cube('left_mould_seat',[3.25,3,-13],[4.25,3.7,-4],'hearthstone'),
    cube('right_mould_seat',[11.75,3,-13],[12.75,3.7,-4],'hearthstone'),
    cube('back_cleanout_frame',[2.5,3.5,47.97],[13.5,11.5,48.4],'fireclay'),
    cube('back_cleanout_plug',[3.4,4.3,48.4],[12.6,10.7,48.85],'scorched'),
    cube('back_cleanout_grip',[6,6.7,48.85],[10,8.4,49.4],'scorched')
  )
  if (working) parts.push(cube('heated_runner',[6.2,3.46,-13.8],[9.8,3.55,-3.1],'live_coals'))
  return parts
}

function writeFurnaceMesh(name, working) {
  const geometry = ['mtllib field_bloomery.mtl', 'o field_bloomery']
  let index = 1
  const quad = (points, material, u = 1, v = 1, uvs = [[0,0],[u,0],[u,v],[0,v]]) => {
    const [a,b,c] = points
    const ab = b.map((n,i)=>n-a[i]), ac = c.map((n,i)=>n-a[i])
    const normal = [ab[1]*ac[2]-ab[2]*ac[1],ab[2]*ac[0]-ab[0]*ac[2],ab[0]*ac[1]-ab[1]*ac[0]]
    const length = Math.hypot(...normal)
    if (length === 0) throw Error('Degenerate furnace face')
    geometry.push('usemtl '+material)
    for(const point of points) geometry.push('v '+point.map(n=>n/16).join(' '))
    for (const uv of uvs) geometry.push('vt '+uv.join(' '))
    geometry.push('vn '+normal.map(n=>n/length).join(' '))
    const faceNormal = (index+3)/4
    geometry.push('f '+[0,1,2,3].map(n=>{const id=index+n;return id+'/'+id+'/'+faceNormal}).join(' '))
    index += 4
  }
  for (const part of completeFurnace(working)) {
    const [x,y,z] = part.from, [X,Y,Z] = part.to
    const faces = {
      north:[[X,y,z],[x,y,z],[x,Y,z],[X,Y,z]],
      south:[[x,y,Z],[X,y,Z],[X,Y,Z],[x,Y,Z]],
      west:[[x,y,z],[x,y,Z],[x,Y,Z],[x,Y,z]],
      east:[[X,y,Z],[X,y,z],[X,Y,z],[X,Y,Z]],
      up:[[x,Y,z],[x,Y,Z],[X,Y,Z],[X,Y,z]],
      down:[[x,y,Z],[x,y,z],[X,y,z],[X,y,Z]]
    }
    for(const [side,points] of Object.entries(faces)){
      const {texture}=part.faces[side]
      const [a,b,,d]=points
      const width=Math.hypot(...b.map((n,i)=>n-a[i]))
      const height=Math.hypot(...d.map((n,i)=>n-a[i]))
      const uvPoint=(u,v)=>a.map((n,i)=>n+(b[i]-n)*u+(d[i]-n)*v)
      for(let left=0;left<width;left+=16)for(let low=0;low<height;low+=16){
        const right=Math.min(left+16,width), high=Math.min(low+16,height)
        quad([uvPoint(left/width,low/height),uvPoint(right/width,low/height),
          uvPoint(right/width,high/height),uvPoint(left/width,high/height)],
          texture.slice(1),(right-left)/16,(high-low)/16)
      }
    }
  }
  // Rebuild the original flared shoulder and chimney as watertight bevels.
  const contour = (half, y, bevel) => {
    const x = 8, z = 24
    return [[x-half+bevel,y,z-half],[x-half,y,z-half+bevel],
      [x-half,y,z+half-bevel],[x-half+bevel,y,z+half],[x+half-bevel,y,z+half],
      [x+half,y,z+half-bevel],[x+half,y,z-half+bevel],[x+half-bevel,y,z-half]]
  }
  const bevelBand = (lower, upper, material, inside = false) => {
    for (let side=0;side<lower.length;side++) {
      const next = (side+1)%lower.length
      const points = [lower[side],lower[next],upper[next],upper[side]]
      const distance = (a,b) => Math.hypot(...a.map((n,i)=>n-b[i]))
      quad(inside ? points.reverse() : points,material,
        Math.min(1,distance(lower[side],lower[next])/16),
        Math.min(1,distance(lower[side],upper[side])/16))
    }
  }
  // A continuous course of brick joins the rectangular firebox to the shaft.
  const masonryOutline = (radius, y) => Array.from({length:16}, (_, side) => {
    const angle = -Math.PI / 2 - side * Math.PI / 8
    return [8 + radius * Math.cos(angle), y, 24 + radius * Math.sin(angle)]
  })
  const course = [
    masonryOutline(21.7,16),
    masonryOutline(22.4,17.1),
    masonryOutline(22.4,19.25),
    masonryOutline(21.8,20.15),
    masonryOutline(21.1,27.9),
    masonryOutline(20.4,30.3),
    masonryOutline(19.8,32)
  ]
  const courseStep = 9 // Nine complete 16-pixel tiles around the whole course.
  const lerp = (a,b,t) => a.map((value,i) => value+(b[i]-value)*t)
  const brickBand = (lower, upper, bottomV, topV) => {
    for (let side=0; side<lower.length; side++) {
      const next = (side+1)%lower.length
      // Split at the tile boundary so no UV crosses into another atlas sprite.
      const begin = side*courseStep
      const end = begin+courseStep
      for (let left=begin; left<end-1e-6;) {
        const tile = Math.floor(left/16)
        const right = Math.min(end,(tile+1)*16)
        const a = (left-begin)/courseStep, b = (right-begin)/courseStep
        const fromU = (left-tile*16)/16, toU = (right-tile*16)/16
        const points = [lerp(lower[side],lower[next],a),lerp(lower[side],lower[next],b),
          lerp(upper[side],upper[next],b),lerp(upper[side],upper[next],a)]
        const uvs = [[fromU,bottomV],[toU,bottomV],[toU,topV],[fromU,topV]]
        quad(points, 'masonry', 1, 1, uvs)
        left = right
      }
    }
  }
  for (let band=1; band<course.length; band++) {
    const lower = course[band-1], upper = course[band]
    brickBand(lower, upper, (lower[0][1]-16)/16, (upper[0][1]-16)/16)
  }
  brickBand(course[0].slice().reverse(), masonryOutline(13.8,16).reverse(), 0, 0.49)
  brickBand(course.at(-1), masonryOutline(13.8,32), 0, 0.375)
  const tower = [
    [15,32,3,'fireclay'],[15,34.7,3,'fireclay'],[13,35.4,3,'masonry'],
    [13,38.6,3,'masonry'],[11.5,39.4,2.8,'masonry'],[11.5,42.5,2.8,'masonry'],
    [10,43.3,2.6,'scorched'],[10,47.5,2.6,'scorched'],[9,48.2,2.8,'scorched'],
    [9,51.5,2.8,'scorched'],[8,52,2.8,'masonry'],[8,58.5,2.8,'masonry'],
    [7.5,59.2,2.8,'scorched'],[7.5,61.9,2.8,'scorched'],
    [9,62.2,2.8,'fireclay'],[9,64,2.8,'fireclay']
  ]
  for (let i=1;i<tower.length;i++) {
    const [lowerRadius,lowerY,lowerBevel]=tower[i-1]
    const [upperRadius,upperY,upperBevel]=tower[i]
    bevelBand(contour(lowerRadius,lowerY,lowerBevel),contour(upperRadius,upperY,upperBevel),tower[i][3])
  }
  bevelBand(contour(9,64,2.8),contour(5.3,64,2.3),'fireclay')
  bevelBand(contour(5.3,32,2.3),contour(5.3,64,2.3),'scorched',true)
  writeFileSync(join(modelDir,name+'.obj'),geometry.join('\n')+'\n')
  json(join(modelDir,name+'.json'),{
    loader:'forge:obj',model:'kubejs:models/block/'+name+'.obj',
    automatic_culling:false,ambientocclusion:false,shade_quads:true,flip_v:true,emissive_ambient:working,
    textures:{particle:textureMap.masonry}
  })
}
const materials = Object.entries(textureMap).map(([name,tex])=>
  'newmtl '+name+'\nKd 1 1 1\nKa '+(name==='live_coals'?'1 1 1':'0 0 0')+'\nmap_Kd '+tex)
writeFileSync(join(modelDir,'field_bloomery.mtl'),materials.join('\n\n')+'\n')
writeFurnaceMesh('field_bloomery_formed',false)
writeFurnaceMesh('field_bloomery_lit',true)
if (!process.argv.includes('--geometry-only')) {
const plank='minecraft:block/spruce_planks';const trough=[cube('foot_a',[0,0,2],[16,2,5],'plank'),cube('foot_b',[0,0,11],[16,2,14],'plank'),cube('floor',[1,2,1],[15,4,15],'plank'),...ring('wall',0,16,4,9,0,16,2,'plank')];for(let z=4;z<14;z+=3)trough.push(cube('sluice_'+z,[2,4,z],[14,5,z+1],'plank'));mdl('ore_washing_trough',trough,{plank,particle:plank})
}
