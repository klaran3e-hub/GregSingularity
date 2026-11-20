import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { png } from './png.mjs'
import { drawItems, size as spriteSize } from './item-art/renderer.mjs'
import workshop from './item-art/workshop.mjs'
import plant from './item-art/plant.mjs'
import factory from './item-art/factory.mjs'
import precision from './item-art/precision.mjs'
import zpm from './item-art/zpm.mjs'
import uv from './item-art/uv.mjs'
import final from './item-art/final.mjs'
import postUv from './item-art/post-uv.mjs'

const root = fileURLToPath(new URL('..', import.meta.url))
const assets = join(root, 'pack', 'overrides', 'kubejs')
const target = join(assets, 'assets', 'kubejs', 'textures', 'item')
const art = drawItems([workshop, plant, factory, precision, zpm, uv, final, postUv])

const translations = JSON.parse(readFileSync(join(assets, 'assets', 'kubejs', 'lang', 'ru_ru.json'), 'utf8'))
// These three item models reuse the Minecraft bucket texture with runtime tints.
const tintedBucketModels = new Set(['unfired_clay_bucket', 'clay_bucket', 'clay_water_bucket'])
const recoloredToolSprites = new Set(['copper_pickaxe', 'copper_axe', 'copper_sword', 'copper_hoe', 'copper_shovel', 'copper_mining_hammer'])
const names = Object.keys(translations)
  .filter(key => key.startsWith('item.kubejs.')).map(key => key.slice(12))
  .filter(id => !tintedBucketModels.has(id) && !recoloredToolSprites.has(id))
const expected = new Set(names)
const missing = names.filter(id => !art.has(id))
const extra = [...art.keys()].filter(id => !expected.has(id))
if (missing.length || extra.length) {
  throw new Error('Sprite catalogue differs from item translations. Missing [' + missing.join(', ') + '], extra [' + extra.join(', ') + ']')
}
const distinct = new Set([...art.values()].map(sprite => sprite.toString('base64')))
if (distinct.size !== art.size) throw new Error('Duplicate sprite pixels')
mkdirSync(target, { recursive: true })
for (const [id, pixels] of art) writeFileSync(join(target, id + '.png'), png(spriteSize, spriteSize, pixels))
const bucketWater = Buffer.alloc(16 * 16 * 4)
const waterColors = [[42, 73, 160, 255], [67, 110, 202, 255], [99, 156, 230, 255]]
const surface = [[4, 3, '01111110'], [3, 4, '0122222210'], [5, 5, '011110']]
for (const [x, y, row] of surface) {
  for (let i = 0; i < row.length; i++) bucketWater.set(waterColors[Number(row[i])], (y * 16 + x + i) * 4)
}
writeFileSync(join(target, 'clay_bucket_water_surface.png'), png(16, 16, bucketWater))
console.log(art.size + ' item textures and a bucket water overlay at ' + spriteSize + 'x' + spriteSize)

const fluidTextures = join(assets, 'assets', 'kubejs', 'textures', 'block')
mkdirSync(fluidTextures, { recursive: true })
for (const [name, diagonal] of [['washed_crude_still', 2], ['washed_crude_flow', 5]]) {
  const pixels = Buffer.alloc(16 * 16 * 4)
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      const wave = Math.sin((x + diagonal * y) * Math.PI / 8) + 0.45 * Math.cos((2 * x - y) * Math.PI / 8)
      const glint = wave > 1.03 ? 10 : wave > 0.2 ? 4 : 0
      pixels.set([40 + glint, 30 + glint, 27 + (glint >> 1), 255], (y * 16 + x) * 4)
    }
  }
  writeFileSync(join(fluidTextures, name + '.png'), png(16, 16, pixels))
}

const processFluidColors = [
  ["reclaim_depleted_brine",[65,68,59],[135,144,113]],
  ["reclaim_recovered_acid",[68,61,26],[225,176,71]],
  ["reclaim_electrolyte",[46,73,79],[143,232,206]],
  ["reclaim_spent_electrolyte",[79,59,39],[167,139,91]],
  ["reclaim_permeate",[40,60,93],[110,164,222]],
  ["reclaim_recovered_electrolyte",[54,78,45],[169,210,125]],
  ["reclaim_brine",[77,49,61],[195,117,131]],
  ['end_atmosphere', [58, 49, 70], [149, 125, 162]],
  ['vacuum_shield_gas', [57, 81, 80], [164, 192, 174]],
  ['chilled_vacuum_coolant', [49, 78, 103], [142, 193, 205]],
  ['warm_vacuum_coolant', [91, 59, 61], [201, 140, 102]],
  ['tungsten_leach_solution', [87, 79, 41], [187, 162, 85]],
  ['spent_tungsten_leach', [56, 57, 43], [130, 116, 75]],
  ['iv_photoresist', [68, 48, 88], [167, 126, 185]],
  ['spent_iv_photoresist', [51, 48, 68], [113, 103, 135]],
  ['niobium_leach_solution', [48, 78, 69], [133, 176, 144]],
  ['spent_niobium_leach', [65, 58, 47], [137, 127, 94]],
  ['spent_fusion_helium', [64, 61, 83], [150, 142, 181]],
  ['zpm_europium_feed', [89, 56, 47], [208, 131, 99]],
  ['zpm_europium_plasma', [155, 67, 56], [255, 196, 135]],
  ['zpm_americium_feed', [59, 44, 84], [160, 112, 195]],
  ['uv_duranium_feed', [93, 67, 44], [212, 165, 110]],
  ['uv_neutronium_feed', [45, 71, 66], [167, 222, 198]],
  ['final_quench_mix', [33, 73, 80], [113, 205, 207]],
  ['final_return_coolant', [86, 57, 48], [201, 132, 82]]
]
for (const [name, base, high] of processFluidColors) {
  for (const [variant, slope] of [['still', 2], ['flow', 5]]) {
    const pixels = Buffer.alloc(16 * 16 * 4)
    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        const wave = (Math.sin((x * 2 + y * slope) * Math.PI / 8) + 1) / 2
        const ripple = (Math.cos((x * 7 - y * 3) * Math.PI / 8) + 1) / 2
        const strength = wave * 0.53 + ripple * 0.2
        const rgb = base.map((channel, i) => Math.round(channel + (high[i] - channel) * strength))
        pixels.set([...rgb, 255], (y * 16 + x) * 4)
      }
    }
    writeFileSync(join(fluidTextures, name + '_' + variant + '.png'), png(16, 16, pixels))
  }
}
