let mongoose = require('mongoose')
const moment = require('moment')
const Schema = mongoose.Schema

function now() {
    return moment().format('YYYY-MM-DD HH:mm:ss')
}

const msg = new Schema({
    key: String,
    value:String,
    msg: Object
})

module.exports = {
    msg
}