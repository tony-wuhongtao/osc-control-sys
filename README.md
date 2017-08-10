# osc-control-sys
Middleware service for UDP send OSC messages to Intranet and communicate with Internet.

## Setup
### For Local Server
1. In the <code>local</code> folder, run <code> npm install</code>
2. run <code>node . [udp-remote-ip=your.remote.udp.ip] [websocket-ip=your.online.server.ipOrDomain]</code>
3. Note: the UDP remote port is set to 7500, if u want to change the default, put change in the local/index.js.

### For Online Server
1. In the <code>server</code> folder, run <code> npm install</code>
2. In the <code>web</code> folder, run <code>bower install</code>
3. In the <code>server</code> folder, run <code>node .</code>
4. In a web browser, type your online server IP or domain name then hit ENTER
5. Have fun!

---
## Structure

### Local Server side
the local server mainly side consist of 2 parts
* the **webSocket** client to send or receive OSC messages between local server and online server
* the **UDP** connection establish OSC connection between server and D3
* the **Telnet** client send commands and queries to D3 telnet server, mostly to control d3's multitransport

### Server side
the server side consist of three parts in 'index.js' file,
* the **http** server to serve web page
* the **webSocket** server to establish OSC connection between browser and server


### Browser side
the browser side consist of 2 parts
* the 'D3Transport.js' file wrap the D3 OSC control command set into a class
the file also contains a **webSocket** client to send or receive OSC message between browser and online server
* the 'sketch.js' file provide the user interactive interface to trigger OSC command, when multiple browsers trigger the animation of large screen, the request is queued.

---
## Misc
* in the 'main.js' file there is a function to disable the browser overscroll
* there is also a 'D3Test.html' page providing all the D3 OSC control interface

## TO-DO
* bash script to automate deployment
* integrate 'hammer.js' gesture recognition
* compress the image file and replace the .js with .min.js to reduce the loading time
