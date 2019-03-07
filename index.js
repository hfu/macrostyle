const hjson = require('hjson')
const fs = require('fs')

const hrequire = (hjsonPath) => {
  return hjson.parse(fs.readFileSync(hjsonPath).toString())
}

let style = hrequire('hjson/root.hjson')

let errorCount = 0
for (let i in style.layers) {
  if (typeof style.layers[i] === 'string') {
    const hjsonPath = `hjson/${style.layers[i]}.hjson`
    if (fs.existsSync(hjsonPath)) {
      style.layers[i] = hrequire(hjsonPath)
    } else {
      errorCount++
      console.log(`${errorCount}: ${hjsonPath} not found. Skip.`)
      delete style.layers[i]
    }
  }
}
style.layers = style.layers.filter(v => v)
fs.writeFileSync('style.json', JSON.stringify(style, null, 2))
