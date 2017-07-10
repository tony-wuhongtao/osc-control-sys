function D3Transport() {
  this.port = new osc.WebSocketPort({
      url: "ws://localhost:8081"
  });

  D3Transport.prototype.init = function () {
    console.log("open port");
    this.port.open();
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
