import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { png } from '../png.mjs'

const output = fileURLToPath(new URL('../../pack/overrides/kubejs/assets/kubejs/textures/item/', import.meta.url))
const palette = {
  k: '2e3032', d: '454b4b', s: '768683', m: 'acbbb4', h: 'e4e1c6',
  b: '583b2d', c: '895435', o: 'bc7446', y: 'e5a56c', g: 'ffd39a',
  n: '5d564c', p: '918979', l: 'b8b3a3', w: 'dedac6'
}

// The three projections share the same top-left light and oxidized copper palette.
const sprites = {
  lv_terminal_block: [
    '................','................','.......nnnn.....','.....nnwwllnn...',
    '...nnwwhsswlpnn.','..nwwlbsdhwlppln','.nwsswbycwppllpn',
    '.nlsdhlcnlllpppn','.nwbbyllpppnpppn','.nlcoowpppnpnppn',
    '..nbolpppnpnppnn','...nnpppnppnnn..','.....nnppnnn....',
    '.......nnn......','................','................'
  ],
  lv_contact_bridge: [
    '................','................','..........bbb...','.........bgymb..',
    '........bcyssb..','.......byoccdb..','......byocbbdb..',
    '.....byocbbbbb..','....byocbb......','...byocbb.......',
    '..bgycbb........','.byhmdb.........','.bccssb.........',
    '..bcbdb.........','...bbb..........','................'
  ],
  lv_line_contactor: [
    '................','........kkk.....','.....kkkmmhkk...','...kkmhsydmsskk.',
    '..kmsddcbyksssdk','.kmhyckmssdddssk','.ksbykssskbbbdsk',
    '.kmmssskbyoyobdk','.kssssdkbyoyobdk','.kskdddkbyoyobdk',
    '.kdsdmdkboyocbdk','.kkhyckdbbcbbdkk','..kbykdmdkddkk..',
    '...kkkmhdkkk....','.....kyckk......','......kk........'
  ]
}

for (const [id, rows] of Object.entries(sprites)) {
  if (rows.length !== 16 || rows.some(row => row.length !== 16)) throw new Error('Invalid sprite size for ' + id)
  const pixels = Buffer.alloc(16 * 16 * 4)
  rows.forEach((row, y) => [...row].forEach((key, x) => {
    if (key === '.') return
    if (!palette[key]) throw new Error('Unknown color ' + key)
    const offset = (16 * y + x) * 4
    pixels.writeUIntBE(parseInt(palette[key], 16), offset, 3)
    pixels[offset + 3] = 255
  }))
  writeFileSync(join(output, id + '.png'), png(16, 16, pixels))
}
