const rootroute = require('../../route')
const route = require('./route')
const task = require('./task')
async function init_route(){
  rootroute.use('/', route)
}
async function init(){
  init_route()
  task.init()
}
module.exports = {
  init
}




