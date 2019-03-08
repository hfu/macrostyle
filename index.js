const hjson = require('hjson')
const fs = require('fs')
const materialColors = require('material-colors')
const Color = require('color')

const hrequire = (hjsonPath) => {
  return hjson.parse(fs.readFileSync(hjsonPath).toString())
}

let style = hrequire('hjson/root.hjson')
let macros = hrequire('hjson/macros.hjson')

let colors = {}
for (const c0 of Object.keys(materialColors)) {
  if (['white', 'black'].includes(c0)) {
    colors[c0] = Color(materialColors[c0]).rgb().array().unshift('rgb')
  } else {
    for (const c1 of Object.keys(materialColors[c0])) {
      let v = Color(materialColors[c0][c1]).rgb().array()
      if (v.length === 3) {
        v.unshift('rgb')
      } else {
        v.unshift('rgba')
      }
      colors[`${c0}-${c1}`] = v
    }
  }
}

const replace = (lut, v) => {
  if (typeof v === 'string') {
    const r = lut[v]
    if (r) {
      return r
    } else {
      throw new Error(`${v} was not found in ${lut}`)
    }
  } else {
    return v
  }
}

let errorCount = 0
for (let i in style.layers) {
  if (typeof style.layers[i] === 'string') {
    const hjsonPath = `hjson/${style.layers[i]}.hjson`
    if (fs.existsSync(hjsonPath)) {
      style.layers[i] = hrequire(hjsonPath)
      style.layers[i].filter = replace(macros, style.layers[i].filter)
      style.layers[i].layout = replace(macros, style.layers[i].layout)
      style.layers[i].paint = replace(macros, style.layers[i].paint)
      style.layers[i].paint['fill-color'] =
        replace(colors, style.layers[i].paint['fill-color'])
    } else {
      errorCount++
      console.log(`${errorCount}: ${hjsonPath} not found. Skip.`)
      delete style.layers[i]
    }
  }
}
style.layers = style.layers.filter(v => v)
fs.writeFileSync('style.json', JSON.stringify(style, null, 2))
