var net = require("net");

// copied from https://github.com/acroca/http-docker-debug-proxy
// credit: https://github.com/acroca

var host = process.env["HOST"];
var port = process.env["PORT"];
var bindPort = process.env["BIND"] || 8000;

proxy = net.createServer(function(socket){
  var client;
  console.log('**** Client connected to proxy');

  client = net.connect({port: port, host: host});

  clientToServer = socket.pipe(client)
  serverToClient = clientToServer.pipe(socket);

  socket.on('close', function () {
      console.log('**** Client disconnected from proxy');
  });
  socket.on('error', function (err) {
      console.log('Error: ' + err.soString());
  });

  socket.on('data', function(d) {
    var s = d.toString()
    console.log("=> " + s.replace(/\n/g, "\n=> "))
  })
  clientToServer.on('data', function(d) {
    var s = d.toString()
    console.log("<= " + s.replace(/\n/g, "\n<= "))
  })

})
proxy.listen(bindPort)
