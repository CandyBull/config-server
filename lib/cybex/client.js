const fs = require('fs')
const { CybexDaemon } = require("./CybexDaemon")
let daemonG
const argv = process.argv
const isTest = argv.some(arg => arg === "--test")
const NODE_URL = isTest
  ? "wss://shenzhen.51nebula.com/"
  : "wss://shanghai.51nebula.com/"
function makeDaemon(user,pass) {
  if (daemonG)  return daemonG
  let daemon = (this.daemon = new CybexDaemon(
    NODE_URL,
    user,
    pass
    // KEY_MODE.WIF
  ))
  daemonG = daemon
  console.log("Daemon Created")
  // await daemon.init() // 配置守护链接的初始化
  daemon.init() // 配置守护链接的初始化
  console.log("Daemon Setup")
  return daemon
}
async function printf (fn) {
  return async function (...args)  {
    let s = await fn(...args)
    console.log(s)
  }
}
function test(fn) {
  return function (...args) {
    this.daemon = makeDaemon()
    fn.bind(this)
    setTimeout(async () => {
      console.log(await fn(...args))
    }, 1000);
  }
}
function test_f(func) {
  return function (...args) {
    this.daemon = makeDaemon()
    func.bind(this)
    setTimeout(async () => {
      await func()
      // process.exit()
    }, 1000);
  }
}
async function get_file_data(file_name, func, refresh = false) {
  let result = null
  try {
    if (refresh) {
      throw new Error('refresh')
    }
    result = JSON.parse(fs.readFileSync(file_name))
  } catch (e) {
    result = await func()
    fs.writeFileSync(file_name, JSON.stringify(result))
  }
  return result
}
module.exports = {
  makeDaemon,
  test,
  test_f,
  get_file_data
}