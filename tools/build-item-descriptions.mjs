import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { addProcessDescriptions } from './item-tooltips/routes.mjs'

const root = fileURLToPath(new URL('../', import.meta.url))
const source = resolve(root, 'tools/item-tooltips')
const text = { ru_ru: {}, en_us: {} }
const defined = new Set()

function item(id, kind, use, hint = []) {
  if (!id.includes(':')) id = 'kubejs:' + id
  if (defined.has(id)) throw Error('Duplicated item description: ' + id)
  defined.add(id)
  const prefix = 'tooltip.gtibd_core.' + id.replace(':', '.') + '.'
  for (const [i, lang] of ['ru_ru', 'en_us'].entries()) {
    if (!kind[i] || !use[i] || (!!hint[0] !== !!hint[1])) throw Error('Missing translation for ' + id)
    text[lang][prefix + 'kind'] = kind[i]
    text[lang][prefix + 'use'] = use[i]
    if (hint[i]) text[lang][prefix + 'hint'] = hint[i]
  }
}

for (const name of readdirSync(source).filter(name => name.endsWith('.txt')).sort()) {
  let kind
  for (const [i, raw] of readFileSync(resolve(source, name), 'utf8').split(/\r?\n/).entries()) {
    const line = raw.trim()
    if (!line || line.startsWith('#')) continue
    if (line.startsWith('@')) { kind = line.slice(1).split('|'); continue }
    const [id, ru, en, ruHint, enHint, extra] = line.split('|')
    if (!kind || extra !== undefined) throw Error(name + ' line ' + (i + 1))
    item(id, kind, [ru, en], [ruHint, enHint])
  }
}

addProcessDescriptions(item,defined,text)

for (const lang of Object.keys(text)) {
  const path = resolve(root, 'pack/overrides/kubejs/assets/gtibd_core/lang', lang + '.json')
  mkdirSync(dirname(path), { recursive: true })
  const ordered = Object.fromEntries(Object.entries(text[lang]).sort(([a], [b]) => a.localeCompare(b, 'en')))
  writeFileSync(path, JSON.stringify(ordered, null, 2) + '\n')
}
console.log(defined.size + ' bilingual item descriptions')
