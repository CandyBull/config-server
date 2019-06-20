let moment = require('moment')
let op_data = require('./cybex/op_data.js')
let model = require('./cybex/cy_model.js')
async function make_day_data(day,human=false) {
  nextday = moment(day).add(1, 'days').format('YYYY-MM-DD')
  console.log(nextday)
  let s = await op_data.getData(day, nextday,human)
  let record_type = 'new'
  if (human){
    record_type = 'human'
  }
  let day_type = day + record_type
  try {
    let str_s = JSON.stringify(s)
    console.log('data is ', str_s)
    let x = await model.day.findOneAndUpdate({ day: day, type: record_type }, { day: day, data: str_s, type: record_type }, { upsert: true, new: true })
    return day_type
  } catch (e) {
    console.log(e)
    return null
  }
}
// make_day_data('2018-05-29',true)
// make_day_data('2018-05-31',true)
async function makedays(n,human=false) {
  let s = new Array(n)
  let daynow = moment().format('YYYY-MM-DD')
  let days = s.fill(1).map((i, v) => {
    return moment(daynow).subtract(v, 'days').format('YYYY-MM-DD')
  })
  for (let day of days) {
    await make_day_data(day,human)
  }
}
async function dayarr(arr){
  for (let day of arr){
    await make_day_data(day)
    await make_day_data(day,true)
  }
}
// dayarr(['2018-06-05','2018-06-06','2018-06-07'])
module.exports = {
  makedays
}
