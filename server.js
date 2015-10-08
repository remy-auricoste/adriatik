var static = require('node-static');

var port = process.env.PORT || 8000;

var fileServer = new static.Server('./dist', {
    cache: 1
});

String.prototype.startsWith = function(start) {
    return start.length <= this.length && this.substring(0, start.length) === start;
}

require('http').createServer(function (request, response) {
    request.addListener('end', function () {
      fileServer.serve(request, response);
    }).resume();
}).listen(port);
