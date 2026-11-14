import { deflateSync } from 'node:zlib'

function crc(bytes) {
  let value = 0xffffffff
  for (const byte of bytes) {
    value ^= byte
    for (let bit = 0; bit < 8; bit++) value = (value >>> 1) ^ ((value & 1) ? 0xedb88320 : 0)
  }
  return (value ^ 0xffffffff) >>> 0
}

function chunk(type, content) {
  const frame = Buffer.alloc(content.length + 12)
  frame.writeUInt32BE(content.length)
  frame.write(type, 4, 'ascii')
  content.copy(frame, 8)
  frame.writeUInt32BE(crc(frame.subarray(4, -4)), frame.length - 4)
  return frame
}

export function png(width, height, pixels) {
  const header = Buffer.alloc(13)
  header.writeUInt32BE(width, 0)
  header.writeUInt32BE(height, 4)
  header[8] = 8
  header[9] = 6
  const scan = Buffer.alloc((width * 4 + 1) * height)
  for (let y = 0; y < height; y++) pixels.copy(scan, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4)
  return Buffer.concat([Buffer.from('89504e470d0a1a0a', 'hex'), chunk('IHDR', header), chunk('IDAT', deflateSync(scan)), chunk('IEND', Buffer.alloc(0))])
}
