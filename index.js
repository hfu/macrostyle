const hjson = require('hjson')
const fs = require('fs')

const hrequire = (hjsonPath) => {
  return hjson.parse(fs.readFileSync(hjsonPath).toString())
}

let style = hrequire('hjson/root.hjson')

for (let i in style.layers) {
  if (typeof style.layers[i] === 'string') {
    style.layers[i] = hrequire(`hjson/${style.layers[i]}.hjson`)
  }
}

console.log(JSON.stringify(style, null, 2))
fs.writeFileSync('style.json', JSON.stringify(style, null, 2))