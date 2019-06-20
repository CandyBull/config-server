process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const request = require('request')
const util = require('util')
const _ = require('lodash')
const Logger = require('../lib/logger')
const logger = new Logger('appserver', 'mytoken')
const sleep = require('await-sleep')
let r_get = util.promisify(request.get)
const headers = {
}
const coin_type = {
  'CYB': '1303_Cybex_CYB_CNY',
  'BTC': '1303_Bitcoin_BTC_CNY',
  'ETH': '1303_Ethereum_ETH_CNY',
  'USDT': '1303_Tether_USDT_CNY', 
  'EOS': '1303_EOS_EOS_CNY',
  'XRP': '1303_Ripple_XRP_CNY',
  'LTC': '1303_Litecoin_LTC_CNY',
  'NEO': '1303_NEO_NEO_CNY',
  'ETC'  :'1303_Ethereum Classic_ETC_CNY'
}

const url = 'https://api2.mytoken.org/currency/refreshprice?timestamp=1526370106095&code=b5332dc4629b4c46257927d17686fe2d&platform=m'
// console.log(_.values(coin_type))
async function getData(names = null) {
  let coin_type_now = coin_type
  if (names) {
    coin_type_now = _.pick(coin_type_now, names)
  }
  let mytoken_coins = _.values(coin_type_now)
  let pair_list = "&pair_list=" + mytoken_coins.join(',')
  let mytoken_url = url + pair_list
  let data = await r_get(mytoken_url, {
    headers: headers,
    timeout:4000
  })
  data = JSON.parse(data.body)
  if (data.code === 0) {
    return data
  } else {
    logger.error('获取mytoken失败', data)
    return null
  }
}
async function get_mytoken(){
  let time_interval = Math.random() * 2000 
  await sleep(time_interval)
  try {
    logger.log('start get price from mytoken')
    let data = await getData()
    logger.log('end get price from mytoken')
    if (data) {
      let prices = data.data.map(i => {
        return { name: i.symbol, value: i.price, time: i.updated_at }
      })
      return {
        code: data.code,
        prices:prices
      }
    }
  }catch(e){
    logger.error(e)
  }
  return {code:-1}
}
async function start_mytoken() {
  let time_interval = Math.random() * 2000 + 4000
  setTimeout(async () => {
    try {
      logger.log('start get price from mytoken')
      let data = await getData()
      logger.log('end get price from mytoken')
      if (data) {
        let prices = data.data.map(i => {
          return { name: i.symbol, value: i.price, time: i.updated_at }
        })
        out.price = {
          code: data.code,
          prices:prices
        }
      }
    }catch(e){
      logger.error(e)
    }
    start_mytoken()
  }, time_interval)
}

let out = {
  get_mytoken,
  start_mytoken,
  price: {}
}
module.exports = out
