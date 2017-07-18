var osc = require("osc"),
    WebSocket = require("ws");
    path = require('path');

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



/*---- Setup WebSocket establish ----*/
var wsPort = 9000;
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

    socketPort.on("ready", function () {
      this.port.send({
        address: "/server/whoami",
        args: [
        {
          type: "s",
          value: "local"
        }]
      });
      console.log("WebsocketBrowser(ready): identify self");
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
    //D3 local IP address
    remoteAddress: "192.168.31.2",
    //D3 local port
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
