let cybex = require('../../lib/cybex_helper')
let _ = require('lodash')
let { config, readbase } = require('./config')
let fs = require('fs')
let path = require('path')
const Logger = require('../../lib/logger')
let init_file = path.join(__dirname, 'init.json')
let {get_mytoken} = require('../mytoken.js')
let {get_coinmarket} = require('../price.js')
let model = require('./model')
let Cacher = require('../../lib/cache_helper')

let {
  cached
} = new Cacher()

let g = {
  coins:  [],
  logger: new Logger('appserver', 'coin'),
  start_sync: false,
}
let coin2id
let id2coin
async function sync_mytoken(){
  let s = await get_mytoken()
  if (s.code == 0 ){
    await model.msg.findOneAndUpdate({"key":"mytoken"},{"key":"mytoken","value":JSON.stringify(s)}, {
      upsert: true,
      new: true
    })
  }
  g.logger.log(JSON.stringify(s))
}
async function sync_coinmarket(){
  let s = await get_coinmarket()
  if (s){
    await model.msg.findOneAndUpdate({"key":"coinmarket"},{"key":"coinmarket","value":JSON.stringify(s)}, {
      upsert: true,
      new: true
    })
  }
  g.logger.log(JSON.stringify(s))
}
async function price(){
  let r = await cached("price",3,null,async ()=>{
    let s = await model.msg.findOne({"key":"mytoken"})
    if (s){
      return JSON.parse(s.value)
    }else{
      return {}
    }
  })
  return r
}
async function coinmarket_price(){
  let r = await cached("coinmarket_price",60,null,async ()=>{
    let s = await model.msg.findOne({"key":"coinmarket"})
    if (s){
      return JSON.parse(s.value)
    }else{
      return {}
    }
  })
  return r
}
async function init(){
  try {
    g.coins = require(init_file)
  } catch (e) {
    await sync_once()
  }
  await load_quotas()
}
//使用初始化数据
init()
function load_quotas() {
  coin2id = _.mapValues(_.keyBy(g.coins, 'symbol'), i => i.id)
  id2coin = _.mapValues(_.keyBy(g.coins, 'id'), i => i.symbol)
  let { from,base_config } = readbase()
  g.quotas = _.mapKeys(_.mapValues(base_config.bases, o => o.map(i => coin2id[i])), (v, k) => coin2id[k])
  return from
}
load_quotas()
function mapNormalName(name) {
  // if (name.indexOf('JADE.') == 0) {
  //   return name.slice(5)
  // }
  return name
}
function make_exchange_assets(bases) {
  let assets = {}
  for (let base in bases) {
    let base_normal = mapNormalName(base)
    let quotas_normal = _.map(bases[base], i => mapNormalName(i))
    assets[base_normal] = quotas_normal
  }
  assets['CYB'] = _.difference(assets['CYB'], ['JADE.BTC', 'JADE.ETH', 'JADE.USDT'])
  assets['JADE.BTC'] = _.difference(assets['JADE.BTC'], ['JADE.ETH', 'JADE.USDT'])
  assets['JADE.ETH'] = _.difference(assets['JADE.ETH'], ['JADE.USDT'])
  delete assets['JADE.MT']
  return assets
}
g.exchange_assets = make_exchange_assets(config.bases)
async function sync_once() {
  try {
    g.logger.log('start sync coin')
    let data = await sync_coins()
    g.coins = data
    g.logger.log('end sync coin')
  } catch (e) {
    g.logger.error(e)
  }
}
async function start_sync(frist = true) {
  if (frist && g.start_sync) {
    return
  }
  g.start_sync = true
  let time_interval = Math.random() * 2000 + 60 * 60 * 1000
  await sync_once()
  setTimeout(async () => {
    start_sync(frist = false)
  }, time_interval)
}
//1.2.31980
//issuer: '1.2.3','1.2.29'
async function sync_coins() {
  let ids = new Array(3000).fill(1).map((v, i) => '1.3.' + i)
  let assets = await cybex.raw('lookup_asset_symbols', ids)
  assets = assets.filter(i => i)
  // 去掉 options:{}
  assets = assets.map(i => _.pick(i, ['id', 'symbol', 'precision', 'issuer']))
  //初始化数据更新
  fs.writeFileSync(init_file, JSON.stringify(assets))
  return assets
}
function loadbase_config(base_id) {
  return {
    base:base_id,
    data:g.quotas[base_id]
  }
}
async function ticker(base, quote) {
  let x = await cybex.raw('get_ticker', base, quote)
  return x
}
async function loadbase(base_id) {
  let quotes =  loadbase_config(base_id)
  if (quotes) {
    let a1 = quotes.data.map(i => ticker(base_id, i));
    let s1 = await Promise.all(a1)
    s1 = _.sortBy(s1, i => -parseFloat(i.base_volume))
    return s1
  }
  return null
}
async function market_price(base_id){
  let keyname = `market${base_id}`
  let r =  await cached(keyname,2,null,async ()=>{
    await cybex.init()
    if (base_id){
      let s = await loadbase(base_id)
      return s
    }else{
      let base_ids = Object.keys(g.quotas)
      let s = await Promise.all(base_ids.map(i=>loadbase(i)))
      return s
    }
  })
  console.log(r)
  return r
}
module.exports = {
  g,
  start_sync,
  sync_once,
  id2coin,
  coin2id,
  load_quotas,
  sync_mytoken,
  sync_coinmarket,
  price,
  coinmarket_price,
  market_price
}




