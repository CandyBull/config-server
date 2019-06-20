let mongoose = require('mongoose')
const moment = require('moment')
const Schema = mongoose.Schema

function now() {
    return moment().format('YYYY-MM-DD HH:mm:ss')
}

const account = new Schema({
    name:  { type: String, unique: true },  //acct1 ,nomal   root
    password: String,
    token: String,
    expire_time: String,
    user_type: String,
    created_time: String
})
const easyobj = new Schema({
    name: String,
    type:String,
    tag:Object,
    msg: Object
})
easyobj.index({type: 1})
module.exports = {
    account,
    easyobj
}