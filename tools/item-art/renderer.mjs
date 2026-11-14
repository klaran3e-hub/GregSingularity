export const size = 16
const drawingSize = size * 2

const palette = {
  edge: '#3e3a43', black: '#1d1c21', dark: '#504a50',
  iron: '#716a70', steel: '#a5a5b5', silver: '#d7d7e7', white: '#eaeafa',
  wood: '#83623a', walnut: '#4f3825', oak: '#a8894d', straw: '#ceb677',
  clay: '#b68969', terracotta: '#a15c46', copper: '#e7a056', bronze: '#9e6338',
  gold: '#e7c300', rust: '#794239', red: '#b13e3d', orange: '#fcb882',
  green: '#6b9862', teal: '#48948a', blue: '#4e7ab1', violet: '#8769a0',
  glass: '#b6dddb', paper: '#e3d6ae', cream: '#f3e5be', clear: '#00000000'
}

function rasterize(pixels) {
  const sprite = Buffer.alloc(size * size * 4)
  const row = drawingSize * 4
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const start = y * 2 * row + x * 8
      const samples = [start, start + 4, start + row, start + row + 4]
        .filter(index => pixels[index + 3] !== 0)
      if (samples.length < 2) continue

      // Use a color already painted in the cell to keep solid pixel clusters.
      let color = samples[0]
      let minDistance = Infinity
      for (const index of samples) {
        const distance = samples.reduce((sum, other) => sum
          + Math.abs(pixels[index] - pixels[other])
          + Math.abs(pixels[index + 1] - pixels[other + 1])
          + Math.abs(pixels[index + 2] - pixels[other + 2]), 0)
        if (distance < minDistance) {
          minDistance = distance
          color = index
        }
      }
      pixels.copy(sprite, (y * size + x) * 4, color, color + 4)
    }
  }
  return sprite
}

export function drawItems(modules) {
  const images = new Map()
  const colors = new Map()
  let pixels

  function px(x, y, color) {
    if (color === null || x < 0 || x >= drawingSize || y < 0 || y >= drawingSize) return
    if (!Number.isInteger(x) || !Number.isInteger(y)) throw new Error('Fractional sprite coordinate')
    let rgba = colors.get(color)
    if (!rgba) {
      const hex = palette[color] ?? color
      if (!/^#[0-9a-f]{6}(?:[0-9a-f]{2})?$/i.test(hex)) throw new Error('Unknown sprite color ' + color)
      rgba = Buffer.from(hex.slice(1) + (hex.length === 7 ? 'ff' : ''), 'hex')
      colors.set(color, rgba)
    }
    pixels.set(rgba, (y * drawingSize + x) * 4)
  }

  function line(x0, y0, x1, y1, color, width = 1) {
    if (![x0, y0, x1, y1, width].every(Number.isInteger) || width < 1) throw new Error('Invalid sprite line')
    const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0)
    const sx = Math.sign(x1 - x0), sy = Math.sign(y1 - y0)
    const start = -Math.floor((width - 1) / 2)
    let error = dx + dy
    for (;;) {
      for (let oy = start; oy < start + width; oy++) {
        for (let ox = start; ox < start + width; ox++) px(x0 + ox, y0 + oy, color)
      }
      if (x0 === x1 && y0 === y1) return
      const next = error * 2
      if (next >= dy) { error += dy; x0 += sx }
      if (next <= dx) { error += dx; y0 += sy }
    }
  }

  function rect(x, y, width, height, fill, stroke = null) {
    for (let dy = 0; dy < height; dy++) {
      for (let dx = 0; dx < width; dx++) {
        const rim = dx === 0 || dy === 0 || dx === width - 1 || dy === height - 1
        px(x + dx, y + dy, rim && stroke !== null ? stroke : fill)
      }
    }
  }

  function ellipse(x, y, width, height, fill, stroke = 'edge') {
    const rx = width / 2, ry = height / 2
    function inside(dx, dy) {
      return ((dx + 0.5 - rx) / rx) ** 2 + ((dy + 0.5 - ry) / ry) ** 2 <= 1
    }
    for (let dy = 0; dy < height; dy++) {
      for (let dx = 0; dx < width; dx++) {
        if (!inside(dx, dy)) continue
        const rim = !inside(dx - 1, dy) || !inside(dx + 1, dy) || !inside(dx, dy - 1) || !inside(dx, dy + 1)
        px(x + dx, y + dy, rim && stroke !== null ? stroke : fill)
      }
    }
  }

  function poly(points, fill, stroke = 'edge') {
    const xs = points.map(([x]) => x), ys = points.map(([, y]) => y)
    if (fill !== null) {
      for (let y = Math.min(...ys); y <= Math.max(...ys); y++) {
        for (let x = Math.min(...xs); x <= Math.max(...xs); x++) {
          let inside = false
          for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
            const [ax, ay] = points[i], [bx, by] = points[j]
            const sampleY = y + 0.5
            if ((ay > sampleY) !== (by > sampleY) && x + 0.5 < ax + (bx - ax) * (sampleY - ay) / (by - ay)) {
              inside = !inside
            }
          }
          if (inside) px(x, y, fill)
        }
      }
    }
    if (stroke !== null) {
      for (let i = 0; i < points.length; i++) line(...points[i], ...points[(i + 1) % points.length], stroke)
    }
  }

  function cuboid(x, y, width, height, depth, face, top, side) {
    const right = x + width - 1, bottom = y + height - 1, dx = depth * 2
    poly([[x, y], [x + dx, y - depth], [right + dx, y - depth], [right, y]], top)
    poly([[right, y], [right + dx, y - depth], [right + dx, bottom - depth], [right, bottom]], side)
    rect(x, y, width, height, face, 'edge')
  }

  function item(id, draw) {
    if (images.has(id)) throw new Error('Duplicate sprite ' + id)
    pixels = Buffer.alloc(drawingSize * drawingSize * 4)
    try {
      draw()
    } catch (error) {
      throw new Error('Failed drawing ' + id, { cause: error })
    }
    images.set(id, rasterize(pixels))
  }

  const brushes = { item, poly, rect, ellipse, line, px, cuboid }
  for (const module of modules) module(brushes)
  return images
}
