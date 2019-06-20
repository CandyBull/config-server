let fs = require('fs')
let g =  {
  "market_issuer": "1.2.29",
  "bases": {
    "CYB": [
      "JADE.INK",
      "JADE.LHT",
      "JADE.ENG",
      "JADE.SNT",
      "JADE.KNC",
      "JADE.EOS",
      "JADE.BAT",
      "JADE.OMG",
      "JADE.PAY",
      "JADE.VEN",
      "JADE.NAS",
      "JADE.MT",
      "JADE.TCT",
      "JADE.DPY",
      "JADE.GET",
      "JADE.GNX",
      "JADE.KEY",
      "JADE.MAD",
      "JADE.LTC"
    ],
    "JADE.BTC": [
      "CYB",
      "JADE.LTC",
      "JADE.LHT"
    ],
    "JADE.ETH": [
      "JADE.INK",
      "CYB",
      "JADE.LHT",
      "JADE.MT",
      "JADE.EOS",
      "JADE.DPY",
      "JADE.PPT",
      "JADE.TCT",
      "JADE.GNX",
      // "JADE.GET",
      // "JADE.KEY",
      // "JADE.MAD",
      // "JADE.SNT",
      // "JADE.OMG",
      // "JADE.NAS",
      // "JADE.KNC",
      // "JADE.BTC",
      // "JADE.BAT",
      // "JADE.ENG",
      // "JADE.PAY"
      "JADE.MVP",
      "JADE.GNT",
      "JADE.MKR",
      "JADE.FUN"
    ],
    "JADE.USDT": [
      "CYB",
      "JADE.ETH",
      "JADE.BTC",
      "JADE.EOS",
      "JADE.LTC"
    ],
    "JADE.MT": [
      "JADE.ETH",
      "CYB",
      "JADE.BTC"
    ]
  }
}
var readbase = (path='../../public/json/bases.json') => {
  try {
  let s = fs.readFileSync(require.resolve(path))
  let re = JSON.parse(s)
  return {from:'public',base_config:re}
  }catch(e){
    console.error(e)
    console.error('没有public/json/bases.json')
    return {from:'default',base_config:g}
  }
}
module.exports = {
  readbase,
  config:g,
}