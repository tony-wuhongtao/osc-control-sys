var wsAddress = "localhost";
var wsPort = "8081";



var port = new osc.WebSocketPort({
    url: "ws://"+ wsAddress + ":" + wsPort
});

port.on("message", function (oscMessage) {
    $("#message").text(JSON.stringify(oscMessage, undefined, 2));
    console.log("message", oscMessage);
});

port.open();

var oscTestAddress = "/hello/from/oscjs";
var value = "world";

var sayHello = function () {
    port.send({
        address: oscTestAddress,
        args: [value]
    });
    console.log("send", value, " to ", oscTestAddress);
};

var oscd3PlayAddress = "/d3/showcontrol/play";
var value = 1;
var d3Play = function () {
    port.send({
        address: oscd3PlayAddress,
        args: [
        {
        	type: "f",
        	value: value
        }]
    });
    console.log("send", value, " to ", oscd3PlayAddress);
};