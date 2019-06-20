let mongoose = require('mongoose')
let _ = require('lodash')
let moment = require('moment')
let schemas = require('./schema')
let config = require('../../config/config.js')
const mongo_url = config.mongo//'mongodb://root:liuqianchao@116.62.100.69/cybex?authSource=admin'
var mongoRaw_conn = mongoose.createConnection(mongo_url,{ useNewUrlParser: true })

let out = {}
mongoose.Promise = global.Promise
for (let schema_name in schemas){
  out[schema_name] = mongoRaw_conn.model(schema_name, schemas[schema_name], schema_name)
}
out.ObjectId = mongoose.Types.ObjectId
module.exports = out