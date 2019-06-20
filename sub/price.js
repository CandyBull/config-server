const request = require('request')
const util = require('util')
const _ = require('lodash')
const Logger = require('../lib/logger')
const logger = new Logger('appserver', 'coinmarketcap')
const config = require("../config/config")
let r_get = util.promisify(request.get)
async function getData() {
  let mytoken_url = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=5000"
  let token = _.sample(config.coinmarketcapToken)
  let headers = {
    "X-CMC_PRO_API_KEY":token
  }
  let data = await r_get(mytoken_url, {
    headers: headers,
    timeout:4000
  })
  data = JSON.parse(data.body)
  if (_.get(data,"status.error_code") === 0) {
    return data
  } else {
    logger.error('get coinmarketcap fail', data)
    return null
  }
}
async function test(){
  getData()
}
async function start_price(){
  let time_interval = Math.random() * 2000 + 1000 * 60 *5
  setTimeout(async () => {
    try {
      logger.log('start get price from coinmarketcap')
      let data = await getData()
      logger.log('end get price from coinmarketcap')
      if (data) {
        out.data = data
      }
    }catch(e){
      logger.error(e)
    }
    start_price()
  }, time_interval)
}
let out = {
  data : null ,
  get_coinmarket:getData
}
module.exports = out