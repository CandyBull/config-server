const router = require('express-promise-router')()
const coin = require('./c')

router.route('/api/ping').get((req, res) => {
  res.send('ok')
})
router.route('/price').get(async (req, res) => {
  let price = await coin.price()
  res.send(price)
})
router.route('/coinmarket_price').get(async (req, res) => {
  if (req.header("PRICE-KEY") !== "P5K14upLe8CdpU4BqnCxpnmpNNZph2JfKxFdWcsTYfAz6"){
    res.send({code:-1})
    return
  }
  let price = await coin.coinmarket_price()
  res.send(price)
})
router.route('/price_check').get(async (req, res) => {
  let price = await coin.price()
  let x = price.prices[0].time
  let now = parseInt(Date.now() / 1000)
  if (now - x < 100){
    res.send("ok")
  }else{
    res.send('fail')
  }
})
router.route('/refresh_base').get((req, res) => {
  let code = req.query['code']
  if (code !== 'dasjkdhhiaskdakjhsduwcushpk') {
    throw new Error('不允许刷新')
  }
  let s = coin.load_quotas()
  res.send(s)
})
router.route('/lab/exchange/asset').get((req, res) => {
  res.send(coin.g.exchange_assets)
})
router.route('/market_list').get((req, res) => {
  let base = req.query['base']
  if (!base) {
    throw new Error('必须传入base')
  }
  if (!coin.g.quotas[base]) {
    throw new Error('没有数据')
  }
  let data = coin.g.quotas[base]
  res.send({
    code: 0,
    data: data
  })
})
router.get('/market_price', async (req, res) => {
  let s = await coin.market_price(req.query.base)
  res.send({
    code: 0,
    data: s
  })
})
module.exports = router