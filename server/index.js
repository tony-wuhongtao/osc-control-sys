var osc = require("osc"),
    WebSocket = require("ws");
    http = require("http"),
    url = require('url'),
    path = require('path'),
    express = require('express');


/*---- Express server ----*/
var app = express();

// serve static file
app.use(express.static(path.join(__dirname, '../web')));

// root router
app.get('/', function (req, res) {
  console.log(__dirname);
  res.sendFile(path.join(__dirname+'/index.html'));
});

// listen localhost on port 8080
app.listen(8080, function () {
  console.log("http server running at http://127.0.0.1:8080/");
});


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


/*---- Setup WebSocket establish ----*/
var wsPort = 8081;
var wss = new WebSocket.Server({
    port: wsPort
});

wss.on("connection", function (socket) {
    console.log("WebSocketServer:(connection established)");
    console.log("\tlisten from:" + wsPort);
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
