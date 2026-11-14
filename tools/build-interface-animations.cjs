const fs = require('node:fs')
const path = require('node:path')
const zlib = require('node:zlib')

const config = path.resolve(__dirname, '../pack/overrides/config')
const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
const crcTable = Array.from({ length: 256 }, (_, value) => {
  for (let bit = 0; bit < 8; bit++) value = (value >>> 1) ^ (value & 1 ? 0xedb88320 : 0)
  return value >>> 0
})

function chunk(type, data) {
  const output = Buffer.alloc(data.length + 12)
  output.writeUInt32BE(data.length)
  output.write(type, 4, 'ascii')
  data.copy(output, 8)
  let crc = 0xffffffff
  for (const byte of output.subarray(4, -4)) crc = (crc >>> 8) ^ crcTable[(crc ^ byte) & 0xff]
  output.writeUInt32BE((crc ^ 0xffffffff) >>> 0, output.length - 4)
  return output
}

function integerBytes(...values) {
  const data = Buffer.alloc(values.length * 4)
  values.forEach((value, index) => data.writeUInt32BE(value, index * 4))
  return data
}

function writeAnimation(relative, width, height, frameCount, delay, paint) {
  const header = Buffer.concat([integerBytes(width, height), Buffer.from([8, 6, 0, 0, 0])])
  const parts = [signature, chunk('IHDR', header), chunk('acTL', integerBytes(frameCount, 0))]
  let sequence = 0
  for (let frame = 0; frame < frameCount; frame++) {
    const bounds = integerBytes(sequence++, width, height, 0, 0)
    const timing = Buffer.alloc(6)
    timing.writeUInt16BE(delay, 0)
    timing.writeUInt16BE(1000, 2)
    parts.push(chunk('fcTL', Buffer.concat([bounds, timing])))
    const stride = width * 4 + 1
    const pixels = Buffer.alloc(stride * height)
    paint(frame / frameCount, (x, y, r, g, b, a) => {
      x = Math.floor(x)
      y = Math.floor(y)
      if (x < 0 || y < 0 || x >= width || y >= height || a <= 0) return
      const offset = y * stride + x * 4 + 1
      const alpha = Math.min(255, Math.round(a))
      if (alpha <= pixels[offset + 3]) return
      pixels.set([r, g, b, alpha], offset)
    })
    const data = zlib.deflateSync(pixels, { level: 9 })
    if (frame === 0) parts.push(chunk('IDAT', data))
    else parts.push(chunk('fdAT', Buffer.concat([integerBytes(sequence++), data])))
  }
  parts.push(chunk('IEND', Buffer.alloc(0)))
  const output = path.join(config, relative)
  fs.mkdirSync(path.dirname(output), { recursive: true })
  fs.writeFileSync(output, Buffer.concat(parts))
  console.log(relative, frameCount + ' frames', fs.statSync(output).size + ' bytes')
}

writeAnimation('gtibd-interface/foundry-fx.apng', 384, 216, 36, 100, (time, pixel) => {
  for (let index = 0; index < 32; index++) {
    const flight = (time + (index * 29 % 113) / 113) % 1
    const x = 189 + (index * 59 % 180) + flight * (index % 9 - 3)
    const y = 189 - (index * 17 % 57) - flight * (21 + index % 13)
    const glow = Math.sin(flight * Math.PI) ** 2 * (88 + (index * 37 % 115))
    pixel(x, y, 255, 172, 72, glow)
    pixel(x - 1, y, 243, 109, 37, glow * 0.24)
    pixel(x + 1, y, 243, 109, 37, glow * 0.22)
    pixel(x, y + 1, 243, 109, 37, glow * 0.40)
  }
})

writeAnimation('fancymenu/assets/gtibd-loading-scan.apng', 460, 24, 36, 70, (time, pixel) => {
  const center = -64 + time * 588
  for (let x = 0; x < 460; x++) {
    const distance = Math.abs(x - center)
    const falloff = Math.max(0, 1 - distance / 52) ** 2
    for (let y = 0; y < 24; y++) {
      const vertical = Math.max(0, 1 - Math.abs(y - 11) / 11)
      pixel(x, y, 57, 176, 186, 124 * falloff * vertical)
    }
    if (x % 13 === 0) pixel(x, 11, 136, 221, 213, 22 + falloff * 92)
  }
})
