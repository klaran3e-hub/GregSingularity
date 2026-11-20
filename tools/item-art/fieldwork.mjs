import { writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { png } from '../png.mjs'

const out = fileURLToPath(new URL('../../pack/overrides/kubejs/assets/kubejs/textures/item/', import.meta.url))
mkdirSync(out, {recursive:true})
const palettes = {
  flint:['272832','414451','606672','929aa3','c7cbd0'], wood:['352820','594032','835b3e','af8052','d8ad76'],
  grass:['343327','555333','807747','b3a064','dbca85'], wet:['2a3331','43504a','687363','8c9479','c0ba92'],
  clay:['4c3b38','70534b','927267','ba9685','d6b5a0'], fired:['4e302c','764438','a25e48','c4815d','e9b184'],
  stone:['313135','515156','6e6e6e','959590','bdb6a6'], metal:['343337','505156','777b7e','a3a6a4','d1cec1'],
  bronze:['45362b','705038','a37146','c8965b','eac482'], flour:['514634','7d6749','ab906a','ceb68b','ead7a6'],
  hide:['3b2927','603f36','895749','ad7a61','cc9878']
}
let pixels, material
const xy = s => s.trim().split(/ +/).map(v=>v.split(',').map(Number))
function dot(x,y,c){ if(x>=0&&x<16&&y>=0&&y<16) pixels[y*16+x] = palettes[material][c] }
function line(a,b,c){let [x,y]=a;const [ex,ey]=b,dx=Math.abs(ex-x),dy=-Math.abs(ey-y),sx=x<ex?1:-1,sy=y<ey?1:-1;let err=dx+dy;for(;;){dot(x,y,c);if(x===ex&&y===ey)break;const e=2*err;if(e>=dy){err+=dy;x+=sx}if(e<=dx){err+=dx;y+=sy}}}
function stroke(s,c){const p=xy(s);for(let i=1;i<p.length;i++)line(p[i-1],p[i],c)}
function poly(s,c=2){const p=xy(s);for(let y=0;y<16;y++)for(let x=0;x<16;x++){let inside=false;for(let i=0,j=p.length-1;i<p.length;j=i++){const [a,b]=p[i],[d,e]=p[j];if((b>y)!==(e>y)&&x<(d-a)*(y-b)/(e-b)+a)inside=!inside}if(inside)dot(x,y,c)}for(let i=0;i<p.length;i++)line(p[i],p[(i+1)%p.length],0)}
function stone(){poly('1,11 3,6 7,4 10,1 13,2 14,6 12,10 8,14 4,14');stroke('3,10 5,7 8,5 11,3',3);stroke('6,12 8,9 11,7 12,4',1);stroke('3,12 5,12 6,11',4)}
function bundle(wet){material=wet?'wet':'grass';for(let i=0;i<4;i++){let x=1+i*2;stroke(x+',13 '+(x+4)+',7 '+(x+6)+',2',1);stroke(x+',12 '+(x+4)+',6 '+(x+5)+',3',2+i%2)}material='wood';stroke('5,7 9,10',0);stroke('5,6 10,9',3);if(wet){material='wet';stroke('12,11 12,12 11,13',3);dot(12,14,1)}}
function rod(){poly('1,12 10,3 13,2 14,3 13,5 4,14 2,14');stroke('2,12 10,4 12,3',3);stroke('5,12 11,6',1)}
function slab(){poly('1,8 9,3 14,5 14,9 6,14 1,12');stroke('2,9 6,11 13,7',1);stroke('3,8 9,4 12,5',4);stroke('7,12 13,8',3)}
function tray(){slab();poly('3,8 9,5 12,6 6,10',1);stroke('4,8 9,6 10,6',0);stroke('6,10 12,7',3)}
function tube(){poly('1,10 10,2 13,2 15,4 14,7 5,14 2,14 1,12');stroke('3,10 11,3 13,3',3);stroke('5,12 13,6',1);poly('1,11 3,9 6,10 6,12 4,14 2,14',1);stroke('2,11 4,10 5,10',4);dot(3,12,0)}
function powder(){poly('1,12 3,9 6,8 8,5 10,5 12,8 14,10 14,12 10,14 4,14');stroke('2,11 7,8 9,6',3);for(const [x,y] of xy('4,11 7,10 9,8 11,10 8,12 12,12'))dot(x,y,(x+y)%2?3:1)}
function roller(){poly('1,7 4,3 7,2 11,3 14,6 14,10 11,13 7,14 3,12 1,10');stroke('2,7 5,4 8,3 11,4',3);stroke('2,10 5,12 8,13 12,11',1);poly('6,7 8,5 10,6 10,8 8,10 6,9',1);stroke('7,8 8,7 9,7',0);dot(4,7,4);dot(11,9,3)}
function register(bank){material='bronze';for(let i=0;i<5;i++){let x=1+i*2;line([x,9],[x+5,4],0);line([x,10],[x+5,5],3);dot(x,11,0)}material='metal';stroke('2,8 10,12',1);stroke('3,7 11,11',3);if(bank){stroke('3,10 9,13 14,9',0);stroke('4,11 9,13 13,10',2);stroke('6,4 13,7',4)}}
const designs = {
  scored_flint_core:['flint',()=>{stone();stroke('4,8 7,8 9,6',4)}],
  retting_bundle:['grass',()=>bundle(false)], retted_bundle:['wet',()=>bundle(true)],
  haft_blank:['wood',()=>{rod();stroke('9,5 11,6',1);dot(12,2,4)}],
  lapped_edge:['flint',()=>{poly('1,13 3,9 11,2 14,1 13,5 7,12 3,14');stroke('2,12 6,9 11,3 13,2',4);stroke('7,10 11,6',2)}],
  wedged_tenon:['wood',()=>{slab();poly('6,8 7,3 9,2 11,3 10,7 8,9');stroke('7,7 8,4 9,3',4)}],
  clay_slip_cake:['clay',()=>{slab();stroke('4,8 7,6 10,6',3)}],
  kiln_biscuit:['fired',()=>{roller();stroke('7,7 9,6',2);dot(11,5,4)}],
  chamotte:['fired',()=>{powder();dot(1,9,2);dot(13,6,3);dot(10,11,4)}],
  ramming_mix:['clay',()=>{powder();material='fired';for(const [x,y] of xy('4,11 8,8 9,12 11,9 7,10'))dot(x,y,3)}],
  green_tuyere:['clay',tube],fired_tuyere:['fired',tube],green_ingot_mould:['clay',tray],ingot_mould:['fired',tray],
  hearth_bellows:['hide',()=>{poly('1,11 3,7 4,4 8,3 12,6 12,9 9,13 5,14');stroke('3,10 5,6 8,4 10,5',3);stroke('4,12 7,13 11,9',1);material='wood';stroke('1,14 5,10',3);stroke('3,15 7,11',1);material='fired';stroke('11,6 14,2',0);stroke('12,6 15,3',3)}],
  grinding_runner:['stone',roller],
  forging_saddle:['metal',()=>{poly('1,5 5,5 10,2 14,3 14,6 10,8 9,11 12,12 12,13 5,15 2,13 6,10 6,8 3,8');stroke('2,5 5,6 11,3 13,3',4);stroke('6,12 10,9',1);stroke('4,13 7,14 10,13',3)}],
  turned_spindle:['wood',()=>{rod();material='bronze';for(const [x,y] of xy('4,10 8,6 11,3')){line([x-1,y],[x+2,y+2],0);line([x,y-1],[x+3,y+1],3)}}],
  hand_pump_barrel:['bronze',()=>{tube();material='metal';stroke('6,7 9,9',0);stroke('7,6 10,8',4);stroke('9,3 12,5',1)}],
  coarse_flour:['flour',powder],camp_dough:['flour',()=>{poly('1,10 3,7 6,5 11,5 14,7 14,10 11,13 5,14 2,12');stroke('3,9 6,6 10,6',4);stroke('5,11 7,8 8,8',2);stroke('10,10 12,8',3)}],
  roasted_alloy_feed:['bronze',()=>{powder();material='stone';for(const [x,y] of xy('2,12 6,9 12,11 7,13 10,7'))dot(x,y,2)}],
  bronze_mould_frame:['fired',()=>{tray();material='bronze';stroke('2,8 5,10',4);stroke('9,4 14,6',3);stroke('5,12 6,13 13,9',1)}],
  five_tube_register:['bronze',()=>register(false)],boiler_tube_bank:['metal',()=>register(true)]
}
for(const [id,[base,draw]] of Object.entries(designs)){pixels=Array(256).fill(null);material=base;draw();const data=Buffer.alloc(1024);pixels.forEach((c,i)=>{if(c){data.writeUIntBE(parseInt(c,16),i*4,3);data[i*4+3]=255}});writeFileSync(out+'/'+id+'.png',png(16,16,data))}
