let Agenda = require('agenda')
let config = require('../config/config')
let agenda = null

let g = {
  logger:console
}
function init(mongoURL) {
  if (!agenda){
    g.logger.log(`mongo aganda >>> ${mongoURL}`)
    agenda = new Agenda({ db: { address: mongoURL } ,defaultLockLifetime: 10000})
  }
}
let agenda_tasks = []
function addTask(every, name, func) {
  init()
  agenda.define(name, async function (job, done) {
    g.logger.log(`start task >>> ${name}`)
    try {
      await func()
    }catch(e){
      g.logger.error(`error task >>> ${name}`,e)
    }
    g.logger.log(`end task >>> ${name}`)
    done()
  })
  agenda_tasks.push({ every, name })
  // agenda.every(every, name)
}
function startAgenda() {
  init()
  g.logger.log(`agenda tasks ${JSON.stringify(agenda_tasks)}`)
  agenda.on('ready', function () {
    for (let task of agenda_tasks) {
      agenda.every(task.every, task.name);
    }
    agenda.start();
  });
}

module.exports = {
  g,
  init,
  agenda,
  startAgenda,
  addTask
}