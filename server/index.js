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
//    server: server
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
    });

//relay UDP to WebSocket
    var relay = new osc.Relay(udp, socketPort, {
        raw: true
    });
});

/*---- Set up UDP establish ----*/
var udp = new osc.UDPPort({
    localAddress: "0.0.0.0",
    localPort: 7400,
    remoteAddress: "192.168.31.2",
    remotePort: 7500
});

udp.on("ready", function () {
    var ipAddresses = getIPAddresses();
    console.log("UDP(ready):");
    console.log("\tlisten from:");
    ipAddresses.forEach(function (address) {
        console.log("\t" + address + ":", udp.options.localPort);
    });
    console.log("\tsend to:");
    console.log("\t" + udp.options.remoteAddress + ":", udp.options.remotePort);
});

udp.open();
