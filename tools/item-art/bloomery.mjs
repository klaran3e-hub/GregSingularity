import { mkdirSync, writeFileSync } from 'node:fs'
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
texture('bloomery_masonry',palette.masonry,(x,y)=>{const row=Math.floor(y/4),bx=(x+row%2*4)%8,by=y%4,n=noise(x,y);if(by===3||bx===7)return n<8?0:6;if(by===0&&bx<6)return n<9?4:5;if(bx===0)return 4;if(bx===6||by===2)return n<6?1:2;return n<8?2:3})
texture('bloomery_fireclay',palette.fireclay,(x,y)=>{const n=noise(x,y);return (y===0||x===0)?(n<8?3:4):(x===15||y===15)?1:n<3?2:n<16?3:4})
texture('bloomery_scorched',palette.burnt,(x,y)=>{let n=noise(x,y);return y===15||((x+Math.floor(y/5)*3)%9===0&&y%5>1)?0:y<3?1:n<9?2:n>18?4:3})
texture('bloomery_timber',palette.timber,(x,y)=>{let n=noise(x,y);return x===0||y===15?0:(y===0||y===6||y===12)?4:y%5===3?1:n<5?3:2})
texture('bloomery_leather',palette.hide,(x,y)=>{const n=noise(x,y);return y%4===3?1:y%4===0?4:(x===1||x===14)&&y%3===1?5:n<9?2:3})
texture('bloomery_cold_coals',palette.embers,(x,y)=>{const n=noise(x,y);return n<4?0:n<12?1:n<19?2:3})
texture('bloomery_live_coals',palette.embers,(x,y,t)=>{const h=(x+Math.floor(y/3)*3)%5,n=noise(x,y),wave=[0,1,2,1,0,-1,-1,0][(t+Math.floor(x/4))%8];
 if(y<3)return n>14?2:1;if(y<6&&h!==1)return n>12?3:2;return Math.max(2,Math.min(8,(y>=11?6:4)+(h===1?1:0)+(n>16?1:-1)+wave))},8)
texture('bloomery_hearthstone',['3b3937','514c46','62594e','777063','8a8274','a39883'],(x,y)=>{const n=noise(x,y);if(y===15||x===15)return 1;if(y===0||x===0)return n<7?3:4;if((x+y*2)%13===2)return 2;return n<4?2:n<17?3:4})
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
  json(join(root,'models/item',name+'.json'),{parent:'kubejs:block/'+model})
}
function ring(name,x0,x1,y0,y1,z0,z1,thick,texture){return [
 cube(name+'_front',[x0,y0,z0],[x1,y1,z0+thick],texture),cube(name+'_back',[x0,y0,z1-thick],[x1,y1,z1],texture),
 cube(name+'_left',[x0,y0,z0+thick],[x0+thick,y1,z1-thick],texture),cube(name+'_right',[x1-thick,y0,z0+thick],[x1,y1,z1-thick],texture)]}
function corbel(name,r,y,h,thick,texture){let a=8-r,b=8+r,c=3;return [
 cube(name+'_front',[a+c,y,a],[b-c,y+h,a+thick],texture),cube(name+'_back',[a+c,y,b-thick],[b-c,y+h,b],texture),
 cube(name+'_left',[a,y,a+c],[a+thick,y+h,b-c],texture),cube(name+'_right',[b-thick,y,a+c],[b,y+h,b-c],texture),
 ...[[a+1,a+1],[b-1-thick,a+1],[a+1,b-1-thick],[b-1-thick,b-1-thick]].map(([x,z],i)=>cube(name+'_corner'+i,[x,y,z],[x+thick,y+h,z+thick],texture))]}
mdl('bloomery_masonry',[cube('masonry',[0,0,0],[16,16,16],'masonry')])
mdl('bloomery_shoulder',[...corbel('foot',15,0,3,5,'fireclay'),...corbel('lower',13,3,4,5,'masonry'),...corbel('middle',11.5,7,4,4,'masonry'),...corbel('top',10,11,5,4,'scorched')])
mdl('bloomery_stack',[...corbel('base',9,0,4,3,'scorched'),...corbel('shaft',8,4,7,3,'masonry'),...corbel('neck',7.5,11,3,3,'scorched'),...corbel('rim',9,14,2,3,'fireclay')])
mdl('bloomery_casting_basin',[
  cube('hearthstone_plinth',[0,0,0],[16,2,16],'hearthstone'),
  cube('basin_bottom',[1,2,1],[15,3,15],'scorched'),
  ...ring('rim',1,15,3,6,1,15,2,'fireclay')
])
for(const active of [false,true]){
 const elements=[
  cube('back',[0,0,5],[16,16,16],'masonry'),cube('sill',[0,0,0],[16,3,6],'masonry'),
  cube('left_pier',[0,3,0],[3,12,6],'masonry'),cube('right_pier',[13,3,0],[16,12,6],'masonry'),cube('lintel',[0,12,0],[16,16,6],'masonry'),
  cube('firebed',[3,3,3],[13,4,6],active?'live_coals':'cold_coals',active),
  cube('coals',[3,4,4],[13,12,5],active?'live_coals':'cold_coals',active),
  cube('left_arch',[1,3,-2],[4,11,1],'fireclay'),cube('right_arch',[12,3,-2],[15,11,1],'fireclay'),
  cube('arch_left_step',[2,10,-2],[6,13,1],'fireclay'),cube('arch_right_step',[10,10,-2],[14,13,1],'fireclay'),
  cube('keystone',[5,12,-2],[11,15,1],'fireclay'),cube('tapping_sill',[5,2,-2],[11,4,4],'scorched'),
  cube('spout_bed',[5,1,-8],[11,2,-2],'fireclay'),cube('spout_left',[5,2,-8],[6,4,-2],'fireclay'),cube('spout_right',[10,2,-8],[11,4,-2],'fireclay'),
  cube('tuyere_socket',[13,5,-3],[16,9,2],'scorched'),cube('tuyere_neck',[14,6,-5],[20,8,-2],'fireclay'),
  cube('bellows_lower_board',[17,4,-11],[29,5,-2],'timber'),cube('bellows_fold_a',[18,5,-10],[28,7,-3],'leather'),
  cube('bellows_fold_b',[19,7,-9],[27,9,-4],'leather'),cube('bellows_upper_board',[17,9,-11],[29,10,-2],'timber'),
  cube('bellows_handle',[25,9,-15],[28,11,-8],'timber'),cube('rack_left',[18,0,-9],[20,4,-7],'timber'),cube('rack_right',[26,0,-5],[28,4,-3],'timber')]
 const coalFace=elements.find(part=>part.name==='coals');coalFace.faces.north.uv=[0,0,16,16]
 mdl('field_bloomery_'+(active?'lit':'cold'),elements)
}
const plank='minecraft:block/spruce_planks';const trough=[cube('foot_a',[0,0,2],[16,2,5],'plank'),cube('foot_b',[0,0,11],[16,2,14],'plank'),cube('floor',[1,2,1],[15,4,15],'plank'),...ring('wall',0,16,4,9,0,16,2,'plank')];for(let z=4;z<14;z+=3)trough.push(cube('sluice_'+z,[2,4,z],[14,5,z+1],'plank'));mdl('ore_washing_trough',trough,{plank,particle:plank})
