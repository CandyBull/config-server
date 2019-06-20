const express = require('express')
const _ = require('lodash')
const app = express()
const http = require('http').Server(app)
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
// 供改变的变量
let g = {
  logger: console
}
morgan.token('localedate', function (req, res) { return new Date().toLocaleString() })
app.use(morgan(':localedate|[RESTful][:method]|url=:url,status=:status,response-time=:response-time ms,res-content-length=:res[content-length]'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())

async function start(host, port) {
  app.use(express.static('public'))
  app.use((req, res, next) => {
    let e = new Error('404')
    e.status = 404
    throw e
  })
  app.use((err, req, res, next) => {
    const status = err.status || 500
    if (status == 500) {
      g.logger.error(err)
    }
    res.status(status).json({ 'code': 1, status: status, msg: err.message })
  })
  port = port || 3039
  host = host || undefined
  http.listen(port, host, () => g.logger.log(`port=${port}`, ['HTTP Listening']))
}

module.exports = {
  start,
  g,
  app
}