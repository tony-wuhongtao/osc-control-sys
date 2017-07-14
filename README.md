# osc-control-sys
Middleware service for UDP send OSC messages to Intranet and communicate with Internet.

## How to install and run
1. In the <code>server</code> folder, run <code> npm install</code>
2. In the <code>web</code> folder, run <code>bower install</code>
3. In the <code>server</code> folder, run <code>node .</code>
4. In <code>web</code> folder, open index.html in a web browser
5. Have fun!

---
## Structure

### Server side
the server side consist of three parts in 'index.js' file,
* the **http** server to serve web page
* the **webSocket** server to establish OSC connection between browser and server
* and the **UDP** connection establish OSC connection between server and D3

### Browser side
the browser side consist of 2 parts
* the 'D3Transport.js' file wrap the D3 OSC control command set into a class
* the 'sketch.js' file provide the user interactive interface to trigger OSC command

---
## Misc
* in the 'main.js' file there is a function to disable the browser overscroll
* there is also a 'D3Test.html' page providing all the D3 OSC control interface

## TO-DO
* integrate 'hammer.js' gesture recognition
* add a loading screen
* compress the image file and replace the .js with .min.js to reduce the loading time
