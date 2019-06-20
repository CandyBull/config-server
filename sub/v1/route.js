const router = require('express-promise-router')()
const account = require('./c.account')
const easyobj = require('./c.easyobj')
const Logger = require('../../lib/logger')
const logger = new Logger('appserver', 'v1')
let config = require('./config')
let Cacher = require('../../lib/cache_helper')

let {
  cached
} = new Cacher()

const login_router = require('express-promise-router')()
const easy_router = require('express-promise-router')()

router.use('/auth', account.needlogin, login_router, error_handle)
router.use('/api', easy_router, error_nohandle)

function error_handle(err, req, res, next) {
  const status = err.status || 500
  if (status == 500) {
    logger.error(err)
  }
  res.status(status).json({
    'code': -1,
    result: err.message
  })
}

function error_nohandle(err, req, res, next) {
  const status = err.status || 500
  if (status == 500) {
    logger.error('url:', req.originalUrl, 'query:', JSON.stringify(req.query), 'body:', JSON.stringify(req.body), err)
  }
  let err_msg = "err2"
  if (err.message.length < 100) {
    err_msg = err.message
  }
  res.status(status).json({
    'code': -1,
    result: err_msg
  })
}

router.post('/account/login', async (req, res) => {
  //判断cache
  let save_key = "acct:" + req.body.account
  // 是否密码正确
  let re = await account.loggin(req.body.account, req.body.password)
  // 生成token 获取时间+密码生成token 
  // 返回token
  if (re) {
    res.send({
      code: 0,
      result: re
    })
  } else {
    // 错误就缓存这个账户
    res.send({
      code: -1,
      result: "用户名或者密码不对"
    })
  }
})
login_router.route('/object/create').post(async (req, res) => {
  let re = await easyobj.create(req.body.data)
  logger.log(`${req.acct.name}创建了对象 ${re}`)
  res.send({
    code: 0,
    result: re
  })
})

easy_router.get('/banners', async (req, res) => {
  let banner_key = `banner:${req.query.lang}`
  let r = await cached(banner_key,config.cache_time,null,async ()=>{
    let s = await easyobj.banners(req.query.lang)
    return s
  })
  res.send({
    code: 0,
    data: r
  })
})
easy_router.get('/announce', async (req, res) => {
  let banner_key = `announce:${req.query.lang}`
  let r = await cached(banner_key,config.cache_time,null,async ()=>{
    let s = await easyobj.announce(req.query.lang)
    return s.map(i=>{
      return {
        title:i.title,
        url:i.html_url
      }
    })
  })
  res.send({
    code: 0,
    data: r
  })
})
easy_router.get('/hotpair', async (req, res) => {
  let banner_key = `hotpair`
  let r = await cached(banner_key,config.cache_time,null,async ()=>{
    let s = await easyobj.hotpair(req.query.lang)
    return s
  })
  res.send({
    code: 0,
    data: r
  })
})
easy_router.get('/app_sublinks', async (req, res) => {
  let banner_key = `app_sublinks:${req.query.lang}:${req.query.env}`
  let r = await cached(banner_key,config.cache_time,null,async ()=>{
    let s = await easyobj.app_sublinks(req.query.lang,req.query.env)
    return s
  })
  res.send({
    code: 0,
    data: r
  })
})
module.exports = router