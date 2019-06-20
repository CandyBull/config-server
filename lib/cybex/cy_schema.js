let mongoose = require('mongoose')
const Schema = mongoose.Schema

const block_schema = new Schema({
    blockNumber: { type: Number, unique: true },
    transactions: Object,
    timestamp: String,
    witness: String,
    witness_signature: String,
    extensions: Object,
    previous: String,
    transaction_merkle_root: String
})
const op_schema = new Schema({
    block: Number,
    blocktime: Number,
    operations_msg: Object,
    operations_type: Number,
    sig: String,
    timestamp: String,
    blockaddsig: { type: String, unique: true }
})
const acct_schema = new Schema({
    account_id: String,
    balances: Object,
    create_time: String,
    name: String
})
const fill_order_schema = new Schema({
    time: String,
    op: {
        account_id: String,
        receives: {
            asset_id: String,
            amount: Number
        },
        pays: {
            asset_id: String,
            amount: Number
        }
    }
})
const transfer_schema = new Schema({
    from: String,
    to: String,
    transfer_amount: Number,
    transfer_asset_id: String,
    timestamp: String
})
const day_schema = new Schema({
    day: String,
    data: String,
    current_data: String,
    type: String,
    flag: Object
})
const mongoRaw = ''

module.exports = {
    block_schema,
    op_schema,
    acct_schema,
    fill_order_schema,
    transfer_schema,
    day_schema
}
