let modle = require("./model")
var hash = require('./hash');

async function test_account(name,pass,user_type){
  try {
    let passwd = hash(pass)
    let s = new modle.account({ name: name, password: passwd,created_time:"2018-06-21 12:00:00","user_type":user_type })
    let x = await s.save()
    console.log(x)
  }catch(e){
    console.log(e)
  }
}

test_account("yangyu",'123456','root')
// test_project()
// test_project_create()