var http = require('http');
var fs = require('fs');
var { data } = require('./public/market_list.json')
var _ = require('lodash')
var request = require('request')
let x = _.uniq(_.flatten(data)).map(i => {
  return i.replace(/\./gi, '_')
})
console.log(x)
for (let name of x) {
  let filename = `public/icons/${name}_grey.png`
  var stream = fs.createWriteStream(filename)
  let url = `https://cybex.io/icons/${name}_grey.png`
  request(url).pipe(stream)
}
// var file = fs.createWriteStream("file.jpg");
// var request = http.get("http://i3.ytimg.com/vi/J---aiyznGQ/mqdefault.jpg", function(response) {
//   response.pipe(file);
// });