var img;
var bgimg;
var lantern;
var dragVal = 0;
var triggered = false;
var touch;

function preload() {
  img = loadImage('assets/lantern.png');
  bgimg = loadImage('assets/background.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  rectMode(CENTER);
  lantern = new Lantern(windowWidth/2, windowHeight*2/3);
  console.log(windowWidth);
  console.log(windowHeight);
}

function draw() {
  background(0);
  image(bgimg, windowWidth/2, windowHeight/2, windowWidth, windowHeight);

  if(lantern.launchStatus) {
    var floating = createVector(0, -0.05);
    lantern.applyForce(floating);
  }
  lantern.update();
  lantern.display();
  if (lantern.position.y < 0 && triggered == false) {
    d3.cue(1);
    triggered = true;
  }
}

/*
function keyPressed() {
  if(keyCode == BACKSPACE) {
    myText = myText.slice(0, -1);
  }
}

function keyTyped() {
    myText += key;
}
*/
function touchStarted() {
  touch = createVector(mouseX, mouseY);
}

function touchMoved() {
  var diff = touch.y - mouseY;
  console.log(diff);
  if (diff > 100) {
    lantern.launch();
  }
  return false;
}

var Lantern = function(x, y) {
  this.position = createVector(x, y);
  this.velocity = createVector(0, 0);
  this.acceleration = createVector(0, 0);
  this.img = img;

  Lantern.prototype.display = function () {
    if (lantern.launchStatus) {
      //this.img.width *= 0.99;
      //this.img.height *= 0.99;
    }

    image(this.img, this.position.x, this.position.y, this.img.width, this.img.height);
  };

  Lantern.prototype.update = function() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  };

  Lantern.prototype.applyForce = function (force) {
    this.acceleration.add(force);
  };

  Lantern.prototype.launch = function() {
    this.launchStart = frameCount;
    this.launchStatus = true;
  };
};
