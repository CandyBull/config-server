let env = require('./env').env
let env_config
try {
    let file = './config.' + env
    env_config = require(file)
} catch (e) {
    env_config = {}
}
let config = {
    cybex_node: "wss://shenzhen.51nebula.com/",
    port: 3039,
    mongo:  "mongodb://localhost/appserver",
    coinmarketcapToken: [] // coinmarket cap 的 api token,用于获取行情
}
if (env_config) {
    Object.assign(config, env_config)
}
module.exports = config