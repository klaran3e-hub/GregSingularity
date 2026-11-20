import { writeFileSync } from 'node:fs'
import { png } from '../png.mjs'

const folder = new URL('../../pack/overrides/kubejs/assets/kubejs/textures/item/', import.meta.url)
const steel = [0x24272b,0x3a4349,0x56656b,0x77878a,0xa0ada9,0xd8d9bd,0x8c6940,0xd6aa60]
function tile(name, palette, draw) {
  const pixels = Buffer.alloc(16 * 16 * 4)
  for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
    const shade = draw(x,y)
    if (shade == null) continue
    if (palette[shade] == null) throw Error(name + ' invalid shade')
    const offset = 4 * (16*y+x)
    pixels.writeUIntBE(palette[shade],offset,3)
    pixels[offset+3] = 255
  }
  writeFileSync(new URL(name+'.png',folder),png(16,16,pixels))
}
function print(name, palette, rows) {
  if (rows.length !== 16 || rows.some(row=>row.length!==16)) throw Error(name+' grid')
  tile(name,palette,(x,y)=>rows[y][x]==='.'?null:Number(rows[y][x]))
}
const cartridge = ['................','.....000000.....','....03454320....','...0344443220...','...0223332210...','...0444443220...','...0257676210...','...0256767210...','...0257676210...','...0256767210...','...0257676210...','...0322222110...','...0454443220...','....03222210....','.....000000.....','................']
print('ev_vacuum_getter',steel,cartridge)
print('ev_spent_getter',[...steel.slice(0,6),0x624a3a,0x82694d],cartridge.map((row,y)=>y>=6&&y<=10?row.replace('25','21'):row))
print('ev_rutile_filter_cake',[0x302623,0x504136,0x6a5141,0x866345,0xaa855c,0xc5a079],['................','................','......00000.....','....004433300...','..003544323340..','.03433423343230.','.04324324322330.','.03324242332420.','.03343324332320.','.01222222222110.','.02333223323310.','..0122222222110.','...00111111100..','.....0000000....','................','................'])
print('ev_filter_pleat',steel,['................','................','.......0000.....','.....00454500...','...004545454500.','.00454545454320.','.04545454543220.','.05454545432210.','.04545454322210.','.03454543222110.','.0234543222110..','.012343222110...','..0123222110....','...01221100.....','....00100.......','................'])
function wafer(x,y) {
  const r=(x-7.5)**2+(y-7.5)**2
  if(r>46 || y===14) return
  if(r>36 || y===13) return 0
  if((x+2*y)%8===0) return 4
  if(x===4||x===9||y===5||y===10) return 2
  return x+y<13?3:1
}
tile('ev_rinsed_wafer',[0x29313d,0x485b70,0x61768b,0x849dab,0xaec2c9],wafer)
print('ev_alignment_coupon',steel,['................','................','......00000000..','....0044445430..','..004432323230..','.0444223223220..','.0332442242320..','.0232327722320..','.0322376723220..','.0222277723210..','.022322322210...','.01222322100....','..01222100......','...01100........','....00..........','................'])
const ring=['................','.....000000.....','...0045543300...','..033222222320..','.04327000072320.','.04220....02220.','.0420......0220.','.0320......0210.','.0320......0210.','.03220....02210.','.03227000072210.','..032222222210..','...0322222210...','....00111100....','......0000......','................']
print('ev_liner_preform',steel,ring)
print('ev_mercury_thermal_insert',[0x332824,0x503b32,0x73503e,0x956b50,0xb18a67,0xe0bf88,0x784a32,0xd99958],ring.map((row,y)=>y===6||y===9?row.replace('320','370').replace('420','470'):row))
