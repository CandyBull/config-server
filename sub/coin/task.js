let { addTask } = require('../../lib/agenda_helper')
let { sync_once, sync_mytoken, sync_coinmarket } = require('./c')

async function init() {
  addTask('1 hours', 'coins_sync', async () => {
    await sync_once()
  })
  // addTask('5 seconds', 'sync_mytoken', async () => {
  //   await sync_mytoken()
  // })
  // addTask('10 minutes','sync_coinmarket',async () => {
  // await sync_coinmarket()
  // })
}

module.exports = {
  init
}