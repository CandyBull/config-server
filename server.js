const server = require('./lib/server')
const Logger = require('./lib/logger')
const route = require('./route')
const sub = require('./sub')
let agenda = require('./lib/agenda_helper.js')
let config = require('./config/config')
// let tasks = require('./tasks')

// tasks.startSub()
// server.addSub()
server.g.logger = new Logger('appserver', 'server')
agenda.g.logger = new Logger('appserver', 'agenda')
async function main(){
// lib init
  await agenda.init(config.mongo)
  // sub init
  await sub.init()

  // start services
  server.app.use('/', route)
  // route要在start前
  server.start()
  agenda.startAgenda()
}
main()
