/* Usage: set the wsAddress to the websocket server address,
 * wsPort to server http port or tcp port(if serve no web page) */

function D3Transport() {
  //wsAddress settings
  //localhost mode: 127.0.0.1
  //local network mode: this machine's local network ip ie:192.168.1.10
  //public network mode: server IP ie:120.24.91.179
  this.wsAddress = window.location.hostname;
  this.wsPort = 8090;
  this.port = new osc.WebSocketPort({
    // the server IP
      url: "ws://" + this.wsAddress + ":" + this.wsPort
  });

  D3Transport.prototype.init = function () {
    console.log("WebsocketBrowser(open):");
    console.log("\tconnect to: ws://" + this.wsAddress + ":" + this.wsPort);
    this.port.open();
    var that = this;
    this.port.on("ready", function () {
      that.port.send({
        address: "/whoami",
        args: [
        {
          type: "s",
          value: "browser"
        }]
      });
      console.log("WebsocketBrowser(ready): identify self");
    });

    this.port.on("message", function (oscMsg) {
      console.log("WebSocketServer:(OSC message received) " + oscMsg.address + " " + oscMsg.args);
    });

    this.port.on("error", function (error) {
      console.log("WebsocketBrowser(error)");
      console.log("\t" + error);
    });



  };

  D3Transport.prototype.play = function () {
    this.port.send({
        address: "/d3/showcontrol/play",
        args: [
        {
        	type: "f",
        	value: 1.0
        }]
    });
    console.log("/d3/showcontrol/play");
  };

  D3Transport.prototype.playToEndOfSection = function () {
    this.port.send({
        address: "/d3/showcontrol/playsection",
        args: [
        {
        	type: "f",
        	value: 1.0
        }]
    });
    console.log("/d3/showcontrol/playsection");
  };

  D3Transport.prototype.loopSection = function () {
    this.port.send({
        address: "/d3/showcontrol/loop",
        args: [
        {
        	type: "f",
        	value: 1.0
        }]
    });
    console.log("/d3/showcontrol/loop");
  };

  D3Transport.prototype.stop = function () {
    this.port.send({
        address: "/d3/showcontrol/stop",
        args: [
        {
        	type: "f",
        	value: 1.0
        }]
    });
    console.log("/d3/showcontrol/stop");
  };

  D3Transport.prototype.previousSection = function () {
    this.port.send({
        address: "/d3/showcontrol/previoussection",
        args: [
        {
        	type: "f",
        	value: 1.0
        }]
    });
    console.log("/d3/showcontrol/previoussection");
  };

  D3Transport.prototype.nextSection = function () {
    this.port.send({
        address: "/d3/showcontrol/nextsection",
        args: [
        {
        	type: "f",
        	value: 1.0
        }]
    });
    console.log("/d3/showcontrol/nextsection");
  };

  D3Transport.prototype.returnToStart = function () {
    this.port.send({
        address: "/d3/showcontrol/returntostart",
        args: [
        {
        	type: "f",
        	value: 1.0
        }]
    });
    console.log("/d3/showcontrol/returntostart");
  };

  D3Transport.prototype.previousTrack = function () {
    this.port.send({
        address: "/d3/showcontrol/previoustrack",
        args: [
        {
        	type: "f",
        	value: 1.0
        }]
    });
    console.log("/d3/showcontrol/previoustrack")
  };

  D3Transport.prototype.nextTrack = function () {
    this.port.send({
        address: "/d3/showcontrol/nexttrack",
        args: [
        {
        	type: "f",
        	value: 1.0
        }]
    });
    console.log("/d3/showcontrol/nexttrack");
  };

  D3Transport.prototype.cue = function (cueLevel1) {
    this.port.send({
        address: "/d3/showcontrol/cue",
        args: [
        {
        	type: "i",
        	value: cueLevel1
        }]
    });
    console.log("/d3/showcontrol/cue " + cueLevel1);
  };
  /*
  D3Transport.prototype.cue = function (cueLevel1, cueLevel2) {
    this.port.send({
        address: "/d3/showcontrol/cue",
        args: [
        {
        	type: "i",
        	value: cueLevel1
        },
        {
          type: "i",
          value: cueLevel2
        }]
    });
    console.log("/d3/showcontrol/cue " + cueLevel1 + " " + cueLevel2);
  };

  D3Transport.prototype.cue = function (cueLevel1, cueLevel2, cueLevel3) {
    this.port.send({
        address: "/d3/showcontrol/cue",
        args: [
        {
        	type: "i",
        	value: cueLevel1
        },
        {
          type: "i",
          value: cueLevel2
        },
        {
          type: "i",
          value: cueLevel3
        }]
    });
    console.log("/d3/showcontrol/cue " + cueLevel1 + " " + cueLevel2 + " " + cueLevel3);
  };
  */

  D3Transport.prototype.fadeUp = function () {
    this.port.send({
        address: "/d3/showcontrol/fadeup",
        args: [
        {
        	type: "f",
        	value: 1.0
        }]
    });
    console.log("/d3/showcontrol/fadeup");
  };

  D3Transport.prototype.fadeDown = function () {
    this.port.send({
        address: "/d3/showcontrol/fadedown",
        args: [
        {
        	type: "f",
        	value: 1.0
        }]
    });
    console.log("/d3/showcontrol/fadedown");
  };

  D3Transport.prototype.volume = function (obj) {
    var vol = obj.value;
    vol = vol/255.0;
    this.port.send({
        address: "/d3/showcontrol/volume",
        args: [
        {
        	type: "f",
        	value: vol
        }]
    });
    console.log("/d3/showcontrol/volume " + vol);
  };

  D3Transport.prototype.brightness = function (obj) {
    var b = obj.value;
    b = b/255.0;
    this.port.send({
        address: "/d3/showcontrol/brightness",
        args: [
        {
        	type: "f",
        	value: b
        }]
    });
    console.log("/d3/showcontrol/brightness " + b);
  };
}

var d3 = new D3Transport();
d3.init();
