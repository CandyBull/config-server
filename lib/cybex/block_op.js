/**
 * change block to ops
 */
let mongoose = require('mongoose')
let _ = require('lodash')
let moment = require('moment')
const Schema = mongoose.Schema
const mongoRaw = 'mongodb://root:liuqianchao@116.62.100.69/cybex?authSource=admin'
const mongoTo = 'mongodb://admin:8usHqpN692x@47.75.154.39/cybex?authSource=admin'//'mongodb://admin:8usHqpN692x@localhost/appserver?authSource=admin'
var mongoRaw_conn = mongoose.createConnection(mongoRaw)
var mongoTo_conn = mongoose.createConnection(mongoTo)
const schema = new Schema({
  blockNumber: Number,
  transactions: Object,
  timestamp: String
})
const schemaTo = new Schema({
  block: Number,
  blocktime: Number,
  operations_msg: Object,
  operations_type: Number,
  sig: String,
  timestamp:String,
  blockaddsig:{ type: String, unique: true }
})
mongoose.Promise = global.Promise
var mblock = mongoRaw_conn.model('block', schema, 'block')
var tblock = mongoTo_conn.model('block', schemaTo, 'block')
async function map_reduce_block(block_from, block_to, num, func_piece, func_reduce) {
  let p = _.floor((block_to - block_from) / num)
  let arr = Array.from(Array(num).keys())
  arr = arr.map(i => {
    if (i !== arr.length - 1) {
      return [block_from + i * p, block_from + (i + 1) * p - 1]
    } else {
      return [block_from + i * p, block_to]
    }
  }).map(i => func_piece(i))
  let result = await Promise.all(arr)
  result = await func_reduce(result)
  return result
}
async function task(start, end, limit) {
  let offset = 0
  let go = true
  let arr_len = 0
  while (go) {
    let s1 = await mblock.find({ "transactions.1": { $exists: true }, "blockNumber": { $gte: start, $lte: end } }).sort({ "blockNumber": 1 }).skip(offset).limit(limit)
    if (!s1 || s1.length < limit) {
      go = false
    }
    if (s1) {
      let s2 = s1.map(i => i.transactions.map(i2 => {
        let x = JSON.parse(JSON.stringify(i2))
        x.operations_type = x.operations[0][0]
        x.operations_msg = x.operations[0][1]
        x.block = i.blockNumber
        x.sig = x.signatures[0]
        x.blockaddsig = String(x.block)+'_'+x.sig
        x.blocktime = parseInt(moment.utc(i.timestamp).format('X'))
        x.timestamp = i.timestamp
        return x
      }))
      offset = offset + limit
      ops = _.flatMapDeep(s2)
      // console.log(ops.length)
      // console.log(1,arr_len)
      arr_len = arr_len + ops.length
      // console.log(1,arr_len)
      let s = await tblock.insertMany(ops)
      console.log(s.length)
      // 这里处理推送到数据库
    }
  }
  return arr_len
}

async function task2(start, end, limit) {
  let offset = 0
  let go = true
  let arr_len = 0
  while (go) {
    let s1 = await mblock.find({ "transactions.1": { $exists: true }, "blockNumber": { $gte: start, $lte: end } }).sort({ "blockNumber": 1 }).skip(offset).limit(limit)
    if (!s1 || s1.length < limit) {
      go = false
    }
    if (s1) {
      let s2 = s1.map(i => i.transactions.map(i2 => {
        let x = JSON.parse(JSON.stringify(i2))
        x.operations_type = x.operations[0][0]
        x.operations_msg = x.operations[0][1]
        x.block = i.blockNumber
        x.sig = x.signatures[0]
        x.blockaddsig = String(x.block)+'_'+x.sig
        x.blocktime = parseInt(moment.utc(i.timestamp).format('X'))
        x.timestamp = i.timestamp
        return x
      }))
      offset = offset + limit
      ops = _.flatMapDeep(s2)
      // console.log(ops.length)
      // console.log(1,arr_len)
      arr_len = arr_len + ops.length
      // console.log(1,arr_len)
      let s = await tblock.insertMany(ops)
      console.log(s.length)
      // 这里处理推送到数据库
    }
  }
  return arr_len
}


async function main() {
  let s = await map_reduce_block(1, 2521675, 50, async ([start_block, end_block]) => {
    return await task2(start_block, end_block, 100)
  }, i => i)
  console.log("finished",s.length)
}
main()