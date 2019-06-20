async function test(){
  let x = require('../../memo.json')
  let ids = _.uniq(x.map(i=>i.operation_msg.to))
  let s = await model.op.find({operation_type:0,'operation_msg.to':'1.2.2091','operation_msg.from':{$in:ids},timestamp:{$gte:'2018-06-03',$lte:'2018-06-12'}}).sort({timestamp:-1})
  fs.writeFileSync('memo2.json',JSON.stringify(s))
}
test()