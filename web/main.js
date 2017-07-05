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

var oscAddress = "/hello/from/oscjs";
var value = "world";

var sayHello = function () {
    port.send({
        address: oscAddress,
        args: [value]
    });
    console.log("send", value, " to ", oscAddress);
};