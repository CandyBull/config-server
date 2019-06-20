let model = require('./model')
let _ = require('lodash')
const Logger = require('../../lib/logger')
const logger = new Logger('ieoserver', 'easyobj')
let config = require('./config')
let request = require('request')
const util = require('util')
let r_get = util.promisify(request.get)
// 查看 db.getCollection('easyobj').find({"type":"banner","msg.banner.disable":true})
async function create(data){
  let msg = {
  }
  msg[data.type] = data.msg
  data.msg = msg
  if (!data.tag){
    data.tag = {default:1}
  }
  let findobj = {
    type:data.type,
    name:data.name,
    tag:data.tag
  }
  
  let r = await model.easyobj.findOneAndUpdate(findobj, data, {
    upsert: true,
    new: true
  })
  return r
}

async function banners(lang,status="online"){
  logger.log('lang',lang)
  status = status.split(",")
  let s = await model.easyobj.find({"type":"banner"}).limit(100)
  s = _.groupBy(s,'name')
  s= _.map(s,(v,k)=>{
    let d1 = _.find(v,x=>{
      return x.tag.default === 1
    }) 
    let d2 = {}
    if (lang){
      d2 = _.find(v,x=>{
        return x.tag.lang === lang
      })
    }
    logger.log('ds',d1,d2)
    let r =  _.merge(d1,d2).msg
    if(r){
      r = r.banner
      r.name = k
    }
    return r
  })
  s = _.orderBy(s, ['score'], ['desc']).filter(i=>!!i && status.indexOf(i.status)!==-1);
  return s
}
async function hotpair(){
  let s = await model.easyobj.findOne({"type":"hotpair","name":"hotpair1"})
  return s.msg.hotpair
}
async function app_sublinks(lang,env,status="online"){
  logger.log('lang',lang,status)
  status = status.split(",")
  let findObj = {"type":"app_sublink"}
  if (lang){
    findObj["tag.lang"]=lang
  }
  if (env){
    findObj["tag.env"]=env
  }else{
    findObj["tag.env"]= {$exists:false}
  }
  if (status.length>0){
    let statusStr = `msg.app_sublink.status`
    findObj[statusStr]= {$in:status}
  } 
  let s = await model.easyobj.find(findObj).limit(100)
  s = s.map(i=>{
    console.log(i)
    let x = i.msg.app_sublink
    x.name = i.name
    return x
  })
  s = _.orderBy(s, ['score'], ['desc'])
  return s
}
async function announce(lang){
  let url
  var compiled = _.template(config.announce_url);
    
  if (lang==='zh'){
    url =  compiled({ 'lang':'zh-cn/categories/360000274254' })
  }else if(lang==='en'){
    url =  compiled({ 'lang':'en-us/categories/360001262353' })
  }else{
    return []
  }
  let data = await r_get(url, {
    timeout:4000
  })
  console.log(data)
  data = JSON.parse(data.body)
  return data.articles
}
module.exports = {
  create,
  banners,
  announce,
  hotpair,
  app_sublinks
}