console.log("start server.js");
var static = require('node-static');

var port = process.env.PORT || 8000;

console.log("starting static servers");
var fileServer = new static.Server('./dist/assets', {
    cache: 1
});
var distServer = new static.Server('./dist', {
    cache: 1
});

String.prototype.startsWith = function(start) {
    return start.length <= this.length && this.substring(0, start.length) === start;
}
String.prototype.endsWith = function(end) {
    return end.length <= this.length && this.substring(this.length-end.length) === end;
}

console.log("creating server listening on port", port);
require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        if (request.url.endsWith(".css") || request.url.endsWith(".js")) {
            distServer.serve(request, response);
        } else {
            fileServer.serve(request, response);
        }
    }).resume();
}).listen(port);
