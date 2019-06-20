let {
  makeDaemon,
  test,
  test_f,
  get_file_data
} = require('./cybex/client')
let sleep = require('await-sleep')
let { id2coin } = require('./config.coin_pair.js')
async function getAccountTotalBalance(...idOrNames) {
  // let { daemon } = this;
  let groupedIds = [];
  do {
    let group = idOrNames.splice(0, 4000);
    if (!group.length) {
      break;
    }
    groupedIds.push(group);
  } while (true);
  console.log('get accts ...')
  let res = (await Promise.all(
    groupedIds.map(ids =>
      daemon.Apis.instance()
        .db_api()
        .exec("get_full_accounts", [ids, false])
    )
  )).reduce((total, next) => total.concat(next));
  console.log('get accts ok')
  let coin_dic = {}
  res.forEach(([name, user]) => {
    user.balances.forEach(b => {
      let asset_type = id2coin[b.asset_type] || b.asset_type
      if (!coin_dic[asset_type]) {
        coin_dic[asset_type] = 0
      }
      coin_dic[asset_type] = coin_dic[asset_type] + parseInt(b.balance)
    })
  })
  return coin_dic
}

async function getAccountCount() {
  return await daemon.Apis.instance()
    .db_api()
    .exec("get_account_count", []);
}

async function getAllAccountBalance(
  lower_limit = 0,
  sortBy = "balance"
) {
  let amountOfAccount = await getAccountCount.call(this);
  console.log('amountOfAccount', amountOfAccount)
  let idListOfAccount = new Array(amountOfAccount)
    .fill(1)
    .map((u, i) => `1.2.${i}`);
  let res = await getAccountTotalBalance.call(
    this,
    ...idListOfAccount
  );
  // let res = await Promise.all();
  return res
}
const DAEMON_USER = "yangyu1"//"cybex-service-a"// "yangyu1"
const DAEMON_PASSWORD = "P5JrZEZ6iBeKkREgFBWHYTwJTUxKfVeU8pDjhfbXP3oV5" //"Cybex20180106"// "P5JrZEZ6iBeKkREgFBWHYTwJTUxKfVeU8pDjhfbXP3oV5"
let daemon = makeDaemon(DAEMON_USER, DAEMON_PASSWORD)

module.exports = {
  test_f,
  getAllAccountBalance
}
