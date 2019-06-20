let moment = require('moment')
let _ = require('lodash')
let model = require('./cy_model.js')
let jiqiren = require('../config.jiqirenid')
let acct_cybex_id = '1.2.4733' //cybex-jadegateway  1.2.4733
let { id2coin } = require('../config.coin_pair.js')
async function acct_create_num(start = '2017-01', end = '2030' ,human=false) {
  let startUTC = moment(start).utc().format('YYYY-MM-DDTHH:MM:SS')
  let endUTC = moment(end).utc().format('YYYY-MM-DDTHH:MM:SS')
  console.log('acct创建', startUTC, endUTC)
  let s = await model.acct.find({ create_time: { $gte: startUTC, $lte: endUTC } }).count()
  console.log('acct创建个数', s)
  return s
}
// 交易
async function accts_file_order(start = '2017-01', end = '2030',human = false, pays = [], receives = []) {
  let startUTC = moment(start).utc().format('YYYY-MM-DDTHH:MM:SS')
  let endUTC = moment(end).utc().format('YYYY-MM-DDTHH:MM:SS')
  console.log('成交统计', startUTC, endUTC)
  let accts_num, order_num
  let findObj = {
    'time': { $gte: startUTC, $lte: endUTC }
  }
  if (pays.length > 0) {
    findObj['op.pays.asset_id'] = { $in: pays }
  }
  if (receives.length > 0) {
    findObj['op.receives.asset_id'] = { $in: receives }
  }
  let s = await model.fillorder.find(findObj)
  let accts = {}
  let paysDic = {}
  let receivesDic = {}
  order_num = s.length
  console.log('order length:', order_num)
  for (let order of s) {
    if (human){
      if (jiqiren.indexOf(order.op.account_id)!=-1){
        continue
      }
    }
    accts[order.op.account_id] = 1
    let pay_id = order.op.pays.asset_id
    let re_id = order.op.receives.asset_id
    if (!paysDic[pay_id]) {
      paysDic[pay_id] = 0
    }
    if (!receivesDic[re_id]) {
      receivesDic[re_id] = 0
    }
    paysDic[pay_id] = paysDic[pay_id] + order.op.pays.amount
    receivesDic[re_id] = receivesDic[re_id] + order.op.receives.amount
  }
  accts_num = Object.keys(accts).length
  console.log(accts_num, accts, order_num, paysDic, receivesDic)
  return { accts_num, accts, order_num, paysDic, receivesDic }
}
//充值
async function acct_deposit(start = '2017-01', end = '2030',human =false, coins = []) {
  let startUTC = moment(start).utc().format('YYYY-MM-DDTHH:MM:SS')
  let endUTC = moment(end).utc().format('YYYY-MM-DDTHH:MM:SS')
  console.log('充值统计', startUTC, endUTC)
  let findObj = {
    'timestamp': { $gte: startUTC, $lte: endUTC },
    from: acct_cybex_id
  }
  if (coins.length > 0) {
    findObj['transfer_asset_id'] = { $in: coins }
  }
  let s = await model.transfer.find(findObj)
  let tr_num = s.length
  let accts = {}
  let coins_amount = {}
  for (let tr of s) {
    if (human){
      if (jiqiren.indexOf(tr.to)!=-1){
        continue
      }
    }
    accts[tr.to] = 1
    if (!coins_amount[tr.transfer_asset_id]) {
      coins_amount[tr.transfer_asset_id] = 0
    }
    coins_amount[tr.transfer_asset_id] = coins_amount[tr.transfer_asset_id] + tr.transfer_amount
  }
  let acct_num = Object.keys(accts).length
  console.log(tr_num, acct_num, accts, coins_amount)
  return { tr_num, acct_num, accts, coins_amount }
}
async function acct_withdraw(start = '2017-01', end = '2030',human=false, coins = []) {
  let startUTC = moment(start).utc().format('YYYY-MM-DDTHH:MM:SS')
  let endUTC = moment(end).utc().format('YYYY-MM-DDTHH:MM:SS')
  console.log('提现统计', startUTC, endUTC)
  let findObj = {
    'timestamp': { $gte: startUTC, $lte: endUTC },
    to: acct_cybex_id
  }
  if (coins.length > 0) {
    findObj['transfer_asset_id'] = { $in: coins }
  }
  let s = await model.transfer.find(findObj)
  let tr_num = s.length
  let accts = {}
  let coins_amount = {}
  for (let tr of s) {
    if (human){
      if (jiqiren.indexOf(tr.from)!=-1){
        continue
      }
    }
    accts[tr.from] = 1
    if (!coins_amount[tr.transfer_asset_id]) {
      coins_amount[tr.transfer_asset_id] = 0
    }
    coins_amount[tr.transfer_asset_id] = coins_amount[tr.transfer_asset_id] + tr.transfer_amount
  }
  let acct_num = Object.keys(accts).length
  console.log(tr_num, acct_num, accts, coins_amount)
  return { tr_num, acct_num, accts, coins_amount }
}

async function acct_active(start = '2017-01', end = '2030', human = false) {
  let withdraw = await acct_withdraw(start, end,human)
  let deposit = await acct_deposit(start, end, human)
  let file_order = await accts_file_order(start, end, human)
  let accts = Object.assign({}, withdraw.accts, deposit.accts, file_order.accts)
  let accts_num = Object.keys(accts).length
  console.log(withdraw.acct_num, deposit.acct_num, file_order.accts_num, accts_num)
  return {
    withdraw: {
      acct_num: withdraw.acct_num,
      amount: withdraw.coins_amount
    },
    deposit: {
      acct_num: deposit.acct_num,
      amount: deposit.coins_amount
    },
    file_order: {
      accts_num: file_order.accts_num,
      paysDic: file_order.paysDic,
      receivesDic: file_order.receivesDic
    },
    active_num: accts_num
  }
}
// acct_create_num(start='2018-04-26',end='2018-04-27')
// acct_active(start='2018-04-26',end='2018-04-27')
// accts_file_order(start='2018-04-26',end='2018-04-27',['1.3.0'],[])

// acct_deposit(start='2018-04-26',end='2018-04-27',['1.3.0'])
// acct_withdraw(start='2018-04-26',end='2018-04-27',[])

async function getData(start, end, human = false) {
  let s = await acct_active(start, end, human)
  let x = await acct_create_num(start, end, human)
  s['created_num'] = x
  console.log(s)
  return s
}
async function getDataMongo(start, end, human) {
  let findObj = { day: { $gte: start, $lte: end } }
  if (human === '1') {
    findObj['type'] = 'human'
  } else {
    findObj['type'] = 'new'
  }
  let s = await model.day.find(findObj).sort({ day: 1 })
  s = s.map(i => {
    let data = JSON.parse(i.data)
    data.withdraw.amount = _.mapValues(_.mapKeys(data.withdraw.amount, (v, k) => {
      return id2coin[k] || k
    }), i => i / 1000000)
    data.deposit.amount = _.mapValues(_.mapKeys(data.deposit.amount, (v, k) => {
      return id2coin[k] || k
    }), i => i / 1000000)
    data.file_order.paysDic = _.mapValues(_.mapKeys(data.file_order.paysDic, (v, k) => {
      return id2coin[k] || k
    }), i => i / 1000000)
    data.file_order.receivesDic = _.mapValues(_.mapKeys(data.file_order.receivesDic, (v, k) => {
      return id2coin[k] || k
    }), i => i / 1000000)
    return {
      "day": i.day,
      "data": data
    }
  })
  return s
}

async function getBalance(start, end) {

}
getDataMongo(start = '2018-03-26', end = '2018-04-27')
module.exports = {
  getData,
  getDataMongo
}
