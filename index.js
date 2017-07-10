var osc = require("osc"),
    WebSocket = require("ws");
    http = require("http"),
    url = require('url'),
    path = require('path'),
    express = require('express');
    
var app = express();

app.use(express.static(path.join(__dirname, '/')));

app.get('/', function (req, res) {
  console.log(__dirname);
  res.sendFile(path.join(__dirname+'/index.html'));
});

app.listen(8080, function () {
  console.log("http server running at http://127.0.0.1:8080/");
});



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

var udp = new osc.UDPPort({
    localAddress: "0.0.0.0",
    localPort: 7400,
    remoteAddress: "localhost",
    remotePort: 7500
});

udp.on("ready", function () {
    var ipAddresses = getIPAddresses();
    console.log("===Receive====");
    console.log("Listening for OSC over UDP.");
    ipAddresses.forEach(function (address) {
        console.log(" Host:", address + ", Port:", udp.options.localPort);
    });
    console.log("==============");
    console.log("=====Send=====");
    console.log("Broadcasting OSC over UDP to", udp.options.remoteAddress + ", Port:", udp.options.remotePort);
});

udp.open();

var wss = new WebSocket.Server({
    port: 8081
});

wss.on("connection", function (socket) {
    console.log("A Web Socket connection has been established!");
    var socketPort = new osc.WebSocketPort({
        socket: socket
    });

//Websocket <-> UDP
    var relay = new osc.Relay(udp, socketPort, {
        raw: true
    });
});
