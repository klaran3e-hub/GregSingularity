import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { png } from '../png.mjs'

const base = fileURLToPath(new URL('../../pack/overrides/kubejs/assets/kubejs/', import.meta.url))
const colors = {
  d: '29282a', I: '737b7e', s: 'a3afb0', h: 'dce1d4', b: '553c2c', c: '805339',
  B: 'ab7447', g: 'd59c60', G: 'f0c78a', f: '64563c', F: 'aa9160', l: 'd6c697'
}

function canvas() {
  const rgba = Buffer.alloc(16 * 16 * 4)
  function put(x, y, color) {
    const index = (y * 16 + x) * 4
    rgba.writeUIntBE(parseInt(colors[color], 16), index, 3)
    rgba[index + 3] = 255
  }
  function line(x, y, endX, endY, color) {
    const dx = Math.abs(endX - x), dy = -Math.abs(endY - y)
    const stepX = Math.sign(endX - x), stepY = Math.sign(endY - y)
    let error = dx + dy
    for (;;) {
      put(x, y, color)
      if (x === endX && y === endY) break
      const twice = 2 * error
      if (twice >= dy) { error += dy; x += stepX }
      if (twice <= dx) { error += dx; y += stepY }
    }
  }
  function rows(x, y, pattern) {
    pattern.forEach((row, j) => [...row].forEach((color, i) => {
      if (color !== '.') put(x + i, y + j, color)
    }))
  }
  return { put, line, rows, rgba }
}

function item(name, draw) {
  const sprite = canvas()
  draw(sprite)
  writeFileSync(join(base, 'textures/item', name + '.png'), png(16, 16, sprite.rgba))
}

item('valve_spindle_blank',p=>{
  p.rows(1,1,['..........bb..','.........bGGb.','........bGBBcb','.......bGBBccb','......bGBBccb.','.....bGBBccb..','....bGBBccb...','...bGBBccb....','..bGBBccb.....','.bGBBccb......','bGBBccb.......','bBBccb........','.bccb.........','..bb..........'])
  p.line(5,8,8,11,'b');p.line(5,7,8,10,'g');p.line(9,4,11,6,'G')
})
item('bronze_valve_spindle',p=>{
  p.line(2,13,13,2,'d');p.line(3,14,14,3,'b');p.line(3,13,13,3,'G')
  for(const [x,y] of [[3,9],[7,5]])p.rows(x,y,['.bb..','bGGb.','bBBgb','.bBcb','..bb.'])
  p.put(14,2,'h');p.line(1,12,3,14,'I')
})
item('braided_valve_packing',p=>{
  p.rows(1,2,['....fffff.....','..ffFllFFff...','.fFlFFFFFllf..','fFlFfffffFFlf.','fFFf.....fFFf.','fFlf.....fFlf.','fFlf.....fFFf.','fFFf.....fFlf.','.fFlfffffFlf..','..fFFlFFlFf...','...ffFFFff....','.....fff......'])
  for(const [x,y] of [[3,5],[5,4],[7,3],[9,4],[11,5],[3,9],[5,11],[8,11],[11,9]])p.line(x,y,x+1,y+1,'l')
})
function valve(p,packed){
  p.rows(1,4,['.....bbb......','....bGGBb.....','bbb..bBb...bb.','bGgbbGGBbbbGgb','bBBggBBgBBBGBb','bBcBBGGBccBBcb','.bbbcBBccb.bbb','....bcccb.....','.....bbb......'])
  p.rows(5,2,['..dd..','.dIId.','..ss..','..II..'])
  if(packed) p.rows(5,4,['.fff.','fFllf','ffFff','.bbb.'])
}
item('unseated_steam_valve',p=>valve(p,false));item('packed_steam_valve',p=>valve(p,true))
