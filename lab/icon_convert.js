var fs = require('fs')
var c = require('../sub/coin/c')
console.log(c.coin2id)

let s = fs.readdirSync('icons')
for (let name of s){
  path = 'icons/'+name
  // fs.renameSync(path,'icons/'+"1"+name)
  // let x1 = name.split("@")[0]
  let x1 = name.split('.')[0]
  let big = x1.toUpperCase()
  console.log(big)
  let coinname = 'JADE.'+big
  let cid = c.coin2id[coinname]
  if (cid){
    let name_new = cid.replace(/\./gi, '_')+'_grey.png'
    let path2 = '../public/icons/'+name_new
    fs.renameSync(path,path2)
  }
}