const fs = require('fs')
const style = JSON.parse(fs.readFileSync('../../onyx-tapioca/style.json'))

for (const layer of style.layers) {
  console.log(`    ${layer.id}`)
}

