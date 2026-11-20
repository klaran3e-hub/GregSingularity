import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { png } from '../png.mjs'

const output = fileURLToPath(new URL('../../pack/overrides/kubejs/assets/kubejs/textures/', import.meta.url))
const can = [
  '................','.....kkkkkk.....','...kkshhhhmkk...',
  '..ksmhhlllmsdk..','.ksmhlooollmssk.','.ksmmooooocmssk.',
  '.kdsmllcllmsdsk.','.ksdmmmmmmmsdsk.','.kdkocpcpcocddk.',
  '.kdkocpcpcocddk.','.kdkocpcpcocddk.','.kdkcpcpcpocddk.',
  '.kssdddddddsdsk.','..ksmmsssssddk..','...kkddddddkk...','.....kkkkkk.....'
]
const sheets = [
  '................','................','........kkk.....','......kklllk....',
  '....kkllhpplkk..','..kklhhppplccck.','.kllhppplccpssk.',
  '.khppllccpoossk.','.klslccpoosdksk.','.kdsspoosdkkpck.',
  '.kclsssdkkplcck.','..kcpdkklppcsk..','...kklpppccsk...',
  '.....kcccssk....','......kddkk.....','.......kk.......'
]
const metal = { k:0x293034, d:0x424c4c, s:0x768486, m:0xa6b1a6, h:0xd1d9c8,
  l:0xc4b893, o:0xac875a, c:0x71553a, p:0xd6be88 }
const oily = { ...metal, d:0x363d3d, m:0x85948a, l:0x97805a, o:0x554136, c:0x38332d, p:0xad924e }
const paper = { ...metal, l:0xcfaa6d, h:0xf3d39b, p:0xb38b4f, c:0x8a5835, o:0xab6939, s:0x86694c, d:0x594839 }
function item(id, rows, colors) {
  if (rows.length !== 16 || rows.some(row => row.length !== 16)) throw Error(id + ' must be 16 by 16')
  const data = Buffer.alloc(16 * 16 * 4)
  for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
    const key = rows[y][x]
    if (key === '.') continue
    const i = (16 * y + x) * 4
    data.writeUIntBE(colors[key], i, 3)
    data[i + 3] = 255
  }
  writeFileSync(join(output, 'item', id + '.png'), png(16, 16, data))
}
item('mv_coalescer', can, metal)
item('mv_saturated_coalescer', can.map((row, y) => y === 9 || y === 10 ? row.replace('cpcpc','cccoo') : row), oily)
item('mv_impregnated_insulation', sheets, paper)

function liquid(id, palette) {
  for (const direction of ['still', 'flow']) {
    const side = direction === 'still' ? 16 : 32
    const data = Buffer.alloc(side * side * 4 * 4)
    for (let frame = 0; frame < 4; frame++) for (let y = 0; y < side; y++) for (let x = 0; x < side; x++) {
      const angle = Math.PI * 2 / side
      const shift = frame * Math.PI / 2
      const ripple = Math.sin(y * angle * 2 + shift + Math.sin(x * angle))
      const surface = ripple + 0.55 * Math.cos(angle * (direction === 'still' ? x + y : 2 * x - y) - shift)
      const index = surface > 1.16 ? 3 : surface > 0.36 ? 2 : surface > -0.65 ? 1 : 0
      const i = ((frame * side + y) * side + x) * 4
      data.writeUIntBE(palette[index], i, 3)
      data[i + 3] = 255
    }
    const target = join(output, 'block', id + '_' + direction + '.png')
    writeFileSync(target, png(side, side * 4, data))
    writeFileSync(target + '.mcmeta', JSON.stringify({ animation: { frametime: 8, interpolate: true } }) + '\n')
  }
}
liquid('lunar_transfer_fuel', [0x374971,0x4d6594,0x6d8ca7,0xa4b0bf])
liquid('calorite_flight_gel', [0x652e37,0x964a49,0xb16c55,0xd59978])
liquid('survey_propellant', [0x24565d,0x368486,0x79b4a6,0xb4d5aa])
liquid('europa_transfer_medium', [0x2c3968,0x405a93,0x8097c5,0xbecce2])
liquid('titan_flight_matrix', [0x704523,0xa66d32,0xc79056,0xe5bc75])
liquid('luv_optical_coolant', [0x17576b,0x287d91,0x58aab1,0xa5d7ce])
liquid('luv_warm_optical_coolant', [0x514158,0x7c576f,0xaa7780,0xcf9d97])
liquid('ev_rutile_slurry', [0x503d37,0x674d40,0x83644e,0x9c805e])
liquid('ev_filtered_coolant', [0x3e6a70,0x53848c,0x6e9e9e,0x94b8ae])
liquid('iv_bonding_slurry', [0x394245,0x4f5b5b,0x687575,0x9aaba0])
liquid('iv_ceramic_suspension', [0x683e30,0x83513e,0xa16f50,0xc5936b])
liquid('ev_clean_rinse', [0x718caa,0x88a8bc,0xa3c1cd,0xc6dbdf])
liquid('stabilized_flight_blend', [0x61402d,0x86583a,0xae7650,0xc99362])
liquid('desalted_crude', [0x2a2420,0x403325,0x594633,0x695441])
liquid('mv_dielectric_oil', [0x79531d,0x9a702c,0xbf9745,0xd6b86c])
