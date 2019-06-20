const rootroute = require('../../route')
const route = require('./route')

async function init_route(){
  rootroute.use('/v1',(req,res,next)=>{
    res.removeHeader("X-Powered-By")
    next()
  }, route)
}
async function init(){
  init_route()
}
module.exports = {
  init
}




