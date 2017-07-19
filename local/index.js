var osc = require("osc"),
    WebSocket = require("ws");

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
    //D3 local IP address
    remoteAddress: "192.168.1.20",
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

udp.on("message", function (oscMsg) {
	console.log(oscMsg.address + " " + oscMsg.args);
});

udp.on("error", function (error) {
	console.log("UDP(error): " + error);
});


process.on("uncaughtException", function (err) {
	console.log(err);
});


/*---- Setup WebSocket establish ----*/
var wsPort = 8090;
var wsAddress = "192.168.1.20";

var oscPort = new osc.WebSocketPort({
      url: "ws://" + wsAddress + ":" + wsPort,
	metadata: true
});


oscPort.open();
console.log("WebsocketLocal(open):");
console.log("\tconnet to ws://" + wsAddress + ":" + wsPort);

oscPort.on("ready", function() {
	oscPort.send({
		address: "/whoami",
		args: [
		{
			type: "s",
			value: "local"
		}]
	});

  //relay UDP to WebSocket
  var relay = new osc.Relay(oscPort, udp, {
    // specifically set raw to false to send osc message
  	raw: false
  });
	console.log("WebSocketLocal(read): identify self");
});

oscPort.on("message", function(oscMsg) {
	console.log("WebsocketLocal(message): " + oscMsg.address + " " + oscMsg.args);
});

oscPort.on("error", function(error) {
	console.log("WebsocketLocal(error): " + error);
});
