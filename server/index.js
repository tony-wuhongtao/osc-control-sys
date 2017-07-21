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
var localSocket;
var wsPort = 8090;
var wss = new WebSocket.Server({
      port: wsPort
});

wss.on("connection", function (socket, request) {
    console.log("WebSocketServer:(connection established)");
    var socketPort = new osc.WebSocketPort({
        socket: socket
    });

    socketPort.on("message", function (oscMsg) {
      var address = oscMsg.address.split('/');
      // check identity
      if (address[1] == "whoami") {
        if (oscMsg.args == "browser") {
          console.log("WebSocketServer:(browser connected)");
        } else if (oscMsg.args == "local") {
          console.log("WebSocketServer:(local server connected)");
          localSocket = this;
        }
      // forward message to local server
      } else if (address[1] == "d3") {
        if (localSocket && localSocket.socket.isAlive) {
          console.log("WebSocketServer:(OSC message received): " + oscMsg.address + " " + oscMsg.args);
          //console.log(oscMsg.args);
          localSocket.send(oscMsg);
          console.log("WebSocketServer:(OSC message send): forward to local server");
        } else {
          console.log("WebSocketServer:(no local server connected)");
          this.send({
            address: "/error",
            args: [{
              type: "s",
              value: "nolocalserver"
            }]
          });
        }
      } else {
        console.log("WebSocketServer:(unused OSC message received): " + oscMsg.address + " " + oscMsg.args);
      }
    });
});
