
/**
 *  local/index.js This file is the local server main file.
 *  Usage: node local/. [udp-remote-ip=your.udp.remote.ip] [websocket-ip=your.web.socket.ip]
 *  the default udp-remote-ip is set to 127.0.0.1
 *  the default websocket-ip is set to 127.0.0.1
 */
var osc = require("osc"),
    WebSocket = require("ws"),
    telnet = require("telnet-client");

//handle script arguments
var handleArgs = function() {
  var args = process.argv.splice(2);
  if (args.length == 0) {
    console.log("IP default setting");
    udpRemoteAddress = "127.0.0.1";
    wsAddress = "127.0.0.1";
  } else if (args.length == 1) {
    var ip = args[0].split("=");
    if (ip[0] === "udp-remote-ip") {
      udpRemoteAddress = ip[1];
      wsAddress = "127.0.0.1";
    } else if (ip[0] === "websocket-ip") {
      udpRemoteAddress = "127.0.0.1";
      wsAddress = ip[1];
    }
  } else if (args.length == 2) {
    args.forEach(function (arg) {
      var ip = arg.split("=");
      if (ip[0] === "udp-remote-ip") {
        udpRemoteAddress = ip[1];
      } else if (ip[0] === "websocket-ip") {
        wsAddress = ip[1];
      }
    });
  }


  console.log("UDP remote address: " + udpRemoteAddress);
  console.log("websocket address: " + wsAddress);
}();

process.on("uncaughtException", function (err) {
  if (err) {
    console.log("Uncaught error has occured: " + err);
  }
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
var udpRemoteAddress;
var udp = new osc.UDPPort({
    localAddress: "0.0.0.0",
    localPort: 7400,
    //D3 local IP address
    remoteAddress: udpRemoteAddress,
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
	console.log("UDP(OSC message received): " + oscMsg.address + " " + oscMsg.args);
});

udp.on("error", function (error) {
	console.log("UDP(error): " + error);
});

udp.on("raw", function(data) {
	console.log("UDP(raw data received): " + data);
});


/*---- Setup WebSocket establish ----*/
var wsPort = 8090;
var wsAddress;

var oscPort = new osc.WebSocketPort({
      url: "ws://" + wsAddress + ":" + wsPort,
	//metadata: true
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
  	raw: true
  });
	console.log("WebSocketLocal(ready): identify self");
});

oscPort.on("message", function(oscMsg) {
	console.log("WebsocketLocal(OSC message received): " + oscMsg.address + " " + oscMsg.args);
  //send animation finished message back to web server when animation finished
  setTimeout(function () {
    oscPort.send({
      address: "/finished",
      args: [{
        type: "i",
        value: "1"
      }]
    });
  }, 10000);
});

oscPort.on("error", function(error) {
	console.log("WebsocketLocal(error): " + error);
});

/**
 * Telnet client command and query example for d3
 */

/*---- Setup Telnet establish ----*/
 /*
var telnetPort = new telnet();
var telnetRemoteAddress = "192.168.1.12";
var telnetRemotePort = 54321;

var cmdObject = {
  request: 13,
  track_command: {
    command: "play",
    track: "gamemode:game",
    location: "00:00:15:00",
    player: "gamemode:game",
    transition: 10,
    //brightness: 0,
    //volume: 0
  }
};
var queryObject = {
  request: 1,
  query: {
    q: "trackList"
  }
};
var cmd = JSON.stringify(cmdObject);
var query = JSON.stringify(queryObject);

var params = {
  host: telnetRemoteAddress,
  port: telnetRemotePort,
  //shellPrompt: '/ # ',
  timeout: 1500
};

telnetPort.on('connect', function() {
  console.log('TelnetLocal(connected)');
  console.log("TelnetLocal(send)");
  console.log(cmd);
  telnetPort.send(cmd, function (err, response) {
    console.log(err + " cmd response: " + response);
  });

});

telnetPort.on('ready', function(prompt) {
  console.log("TelnetLocal(ready)");
});

telnetPort.on('timeout', function() {
  console.log('TelnetLocal(timeout)');
  console.log(query);
  telnetPort.send(query, function (err, response) {
    console.log(err + " query response: " + response);
  });
});

telnetPort.on('close', function() {
  console.log('TelnetLocal(closed)');
});

telnetPort.connect(params);
console.log("TelnetLocal(start connection)");
*/
