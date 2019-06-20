let coin = require('./coin')
let v1 = require('./v1')
async function init(){
  await coin.init()
  await v1.init()
}

module.exports = {
  init
}