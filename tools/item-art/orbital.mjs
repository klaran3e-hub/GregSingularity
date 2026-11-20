import { png } from '../png.mjs'
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const dest = fileURLToPath(new URL('../../pack/overrides/kubejs/assets/kubejs/textures/item/',import.meta.url))
function sprite(id, colors, pixel) {
  const pixels = Buffer.alloc(16*16*4)
  for (let y=0;y<16;y++) for (let x=0;x<16;x++) {
    const shade=pixel(x,y)
    if (shade===undefined) continue
    pixels.writeUIntBE(colors[shade],(16*y+x)*4,3)
    pixels[(16*y+x)*4+3]=255
  }
  writeFileSync(dest+id+'.png',png(16,16,pixels))
}
sprite('lunar_vacuum_seal',[0x222829,0x404746,0x5d6563,0x9a9e91,0xd3cbb4,0xa8894e],(x,y)=>{
  const r=(x-7.5)**2+(y-7.5)**2
  if (r>46||r<7) return
  if (r>38||r<11) return 0
  if (r>30) return x+y<15?4:2
  if (r<16) return x+y<14?1:3
  if ((x===7||x===8||y===7||y===8)&&r>=20) return 5
  return x+y<13?3:1
})
const liner=['................','....00000000....','..002444333200..','.02223333332220.','.02443333332210.','.02442000023410.','.02320....02310.','.02310....02310.','.02310....02310.','.02320....02310.','.02432000023210.','.02222222222110.','.01233222223310.','..011111111110..','....00000000....','................']
const shield=['................','.......00.......','.....004400.....','...0043344200...','.00433332224400.','.04442244332220.','.03324433224420.','.02443322443310.','.03332244332210.','.01224433224410.','..012332244310..','...0112443210...','....01133210....','.....011110.....','......0110......','.......00.......']
const crystal=['................','.........00.....','........0240....','....00.02430....','...0240244310...','..02430244310...','..02330243310...','..02310243310...','...023023310.00.','...012023310030.','....01223310230.','.....0123102310.','......01312310..','......0111110...','.......00000....','................']
function tile(id,colors,rows) {
  if(rows.length!==16||rows.some(row=>row.length!==16))throw Error('Invalid 16x16 tile '+id)
  sprite(id,colors,(x,y)=>rows[y][x]==='.'?undefined:Number(rows[y][x]))
}
tile('martian_pressure_liner',[0x2e2828,0x553d35,0x825844,0xa87d66,0xd6b49a],liner)
tile('venus_thermal_screen',[0x342d30,0x584345,0x865c48,0xb47a4e,0xe5af67],shield)
tile('glacio_reference_crystal',[0x243340,0x385467,0x487c88,0x80b6b1,0xc5e2d8],crystal)
