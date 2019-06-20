/**
 * http://docs.bitshares.org/api/database.html  api
 * var x = $('.function code.descname').toArray()
 * var x1 = x.map(i=>i.innerHTML)
 */
var funcs = ["get_objects", "set_subscribe_callback", "set_pending_transaction_callback", "set_block_applied_callback", "cancel_all_subscriptions", "get_block_header", "get_block", "get_transaction", "get_recent_transaction_by_id", "get_chain_properties", "get_global_properties", "get_config", "get_chain_id", "get_dynamic_global_properties", "get_key_references", "get_accounts", "get_full_accounts", "get_account_by_name", "get_account_references", "lookup_account_names", "lookup_accounts", "get_account_count", "get_account_balances", "get_named_account_balances", "get_balance_objects", "get_vested_balances", "get_vesting_balances", "get_assets", "list_assets", "lookup_asset_symbols", "get_order_book", "get_limit_orders", "get_call_orders", "get_settle_orders", "get_margin_positions", "subscribe_to_market", "unsubscribe_from_market", "get_ticker", "get_24_volume", "get_trade_history", "get_witnesses", "get_witness_by_account", "lookup_witness_accounts", "get_witness_count", "get_committee_members", "get_committee_member_by_account", "lookup_committee_member_accounts", "get_workers_by_account", "lookup_vote_ids", "get_transaction_hex", "get_required_signatures", "get_potential_signatures", "get_potential_address_signatures", "verify_authority", "verify_account_authority", "validate_transaction", "get_required_fees", "get_proposed_transactions", "get_blinded_balances"]
let {
  Apis
} = require("cybexjs-ws")
var {
  ChainStore
} = require("cybexjs")
let config = require("../config/config")
const NODE_URL = config.cybex_node
let inited = false
async function init(cb, refresh = false) {
  if (inited && !refresh) {
    return
  }
  try {
    let res = await Apis.instance(NODE_URL, true).init_promise
    console.log('init ok', NODE_URL)
    inited = true
  } catch (e) {
    console.log(e)
    setTimeout(init, 5000)
  }
  if (Apis.instance().ws_rpc) {
    Apis.instance().ws_rpc.ws.on("close", async (e) => {
      console.error("Ws connection has been broken. Reconnect to ws server");
      setTimeout(async () => {
        await init();
      }, 1000)
    })
  }
  // 订阅
  if (cb) {
    let init = await ChainStore.init()
    ChainStore.subscribe(cb)
  }
}
async function task() {
  let n = 0
  setInterval(async () => {
    let s = await raw('get_full_accounts', ['yangyu1'], false)
    console.log(s[0][0], n)
    n = n + 1
  }, 1000)
}
async function raw(apiName, ...args) {
  if (!inited) {
    await init()
  }
  if (!Apis.instance().db_api()) {
    console.error('')
  }
  try {
    let result = await Apis.instance()
      .db_api()
      .exec(apiName, args);
    return result
  } catch (e) {
    if (e.message.includes("websocket state error")) {
      await init(null,true)
    }
    throw (e)
  }
}

let dynamicGlobal = null;

function updateState(object) {
  dynamicGlobal = ChainStore.getObject("2.1.0");
  console.log("ChainStore object update\n", dynamicGlobal ? dynamicGlobal.toJS() : dynamicGlobal);
}
async function main() {
  await init()
  // await task()
}


module.exports = {
  init,
  Apis,
  raw
}