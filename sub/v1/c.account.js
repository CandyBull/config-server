let model = require('./model')
let hash = require('./hash')
let moment = require('moment')
const Logger = require('../../lib/logger')
const logger = new Logger('ieoserver', 'account')
function check_account(username){
  // 是否有效账户,避免进行无效账号的操作
}
async function needroot(req,res,next){
  if (req.acct.user_type === "root"){
    return next()
  }
  return next(new Error('不是root用户，不能调用admin'))
}
async function needlogin(req,res,next){
  if (!req.body.token){
    return next(new Error('没有传入token'))
  }
  let acct = await model.account.findOne({ token: req.body.token })
  if (acct) {
    req.acct = acct
    delete req.body.token
    return next()
  }
  return next(new Error('token无效，请登录'))
}

async function loggin(acct_id,password){
  try{
    let hashed_pw = hash(password)
    let acct = await model.account.findOne({name:acct_id,password:hashed_pw})
    if (acct){
      // acct + password + time = token
      let token = hash(acct_id+password+new Date().toISOString())
      acct.token = token
      let expire_time = moment().add(1,"days").format("YYYY-MM-DD HH:mm:ss")
      acct.expire_time = expire_time
      console.log(acct_id,"loggin success",token,expire_time)
      await acct.save()
      return token
    }
    console.log(acct_id,"loggin fail")
    return null
  }catch(e){
    console.error(e)
    return null
  }

}
// loggin("yangyu","123456")
async function create_acct(acct,new_acct_id,new_password){
  if (!new_acct_id || ! new_password){
    throw new Error('必须传入user和password')
  }
  let passwd = hash(new_password)
  let s = new model.account({ name:new_acct_id, password: passwd,created_time:moment().format("YYYY-MM-DD HH:mm:ss") })
  let x = await s.save()
  logger.log(acct.name,"创建了账号",new_acct_id)
  return x
}
function change_password(acct_id,old_password,new_password){
  let result = "fails"
  return result
}
module.exports = {
  loggin,
  create_acct,
  check_account,
  change_password,
  needlogin,
  needroot
}