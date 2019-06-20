let mongoose = require('mongoose')
let _ = require('lodash')
let moment = require('moment')
let { block_schema,op_schema,acct_schema,fill_order_schema,transfer_schema,
  day_schema} = require('./cy_schema.js')
const Schema = mongoose.Schema
const mongoRaw = 'mongodb://admin:8uy87P8Nh842skM@47.96.73.187/cybex?authSource=admin'//'mongodb://root:liuqianchao@116.62.100.69/cybex?authSource=admin'
const mongoTo = 'mongodb://admin:8usHqpN692x@47.75.154.39/cybex?authSource=admin'//'mongodb://admin:8usHqpN692x@localhost/appserver?authSource=admin'
var mongoRaw_conn = mongoose.createConnection(mongoRaw)
var mongoTo_conn = mongoose.createConnection(mongoTo)

mongoose.Promise = global.Promise
var block = mongoRaw_conn.model('block', block_schema, 'block')
var acct =  mongoRaw_conn.model('account_table', acct_schema, 'account_table')
var fillorder = mongoRaw_conn.model('fill_order_history', fill_order_schema, 'fill_order_history')
var transfer = mongoRaw_conn.model('table_transfer', transfer_schema, 'table_transfer')
var day = mongoRaw_conn.model('day_data', day_schema, 'day_data')
module.exports = {
  block,
  acct,
  fillorder,
  transfer,
  day
}
