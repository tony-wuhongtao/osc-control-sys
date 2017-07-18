var osc = require("osc"),
    WebSocket = require("ws");
    http = require("http"),
    url = require('url'),
    path = require('path'),
    express = require('express'),
    serverPort = 8080;

  // helper function to get local IP address
  var getIPAddresses = function () {
      var os = require("os"),
      interfaces = os.networkInterfaces(),
      ipAddresses = [];

      for (var deviceName in interfaces){
          var addresses = interfaces[deviceName];

          for (var i = 0; i < addresses.length; i++) {
              var addressInfo = addresses[i];

              if (addressInfo.family === "IPv4" && !addressInfo.internal) {
                  ipAddresses.push(addressInfo.address);
              }
          }
      }

      return ipAddresses;
  };


/*---- Express server ----*/
var app = express(),
    server = app.listen(serverPort, function () {
      console.log("http server running, listening to port: " + serverPort);
    });

// serve static file
app.use(express.static(path.join(__dirname, '../web')));

// root router
app.get('/', function (req, res) {
  console.log(__dirname);
  res.sendFile(path.join(__dirname+'/index.html'));
});

/*---- Setup WebSocket establish ----*/
var wsPort = 8090;
var wss = new WebSocket.Server({
      port: wsPort
});

wss.on("connection", function (socket) {
    console.log("WebSocketServer:(connection established)");
    console.log("\tlisten from:" + serverPort);
    var socketPort = new osc.WebSocketPort({
        socket: socket
    });

    socketPort.on("message", function (oscMsg) {
      console.log("WebSocketServer:(OSC message received) " + oscMsg.address + " " + oscMsg.args);
      var destnation = oscMsg.address.split('/')[1];
      if (destnation == "d3") {
        this.send(oscMsg);
      }
    });

});
