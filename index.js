const hjson = require('hjson')
const fs = require('fs')

const hrequire = (hjsonPath) => {
  return hjson.parse(fs.readFileSync(hjsonPath).toString())
}

const macroReplace = (v) => {
  if (typeof v === 'string') {
    const r = macros[v]
    if (r) {
      return r
    } else {
      throw new Error(`${v} was not found in macros.hjson`)
    }
  } else {
    return v
  }
}

let style = hrequire('hjson/root.hjson')
let macros = hrequire('hjson/macros.hjson')

let errorCount = 0
for (let i in style.layers) {
  if (typeof style.layers[i] === 'string') {
    const hjsonPath = `hjson/${style.layers[i]}.hjson`
    if (fs.existsSync(hjsonPath)) {
      style.layers[i] = hrequire(hjsonPath)
      style.layers[i].filter = macroReplace(style.layers[i].filter)
      style.layers[i].layout = macroReplace(style.layers[i].layout)
      style.layers[i].paint = macroReplace(style.layers[i].paint)
    } else {
      errorCount++
      console.log(`${errorCount}: ${hjsonPath} not found. Skip.`)
      delete style.layers[i]
    }
  }
}
style.layers = style.layers.filter(v => v)
fs.writeFileSync('style.json', JSON.stringify(style, null, 2))
