var express = require('express');
var app = express();
var urlTool = require("url");

var port = process.env.PORT || 3000;


String.prototype.startsWith = function(start) {
    return start.length <= this.length && this.substring(0, start.length) === start;
}

app.use("/", express.static("dist"));

var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
