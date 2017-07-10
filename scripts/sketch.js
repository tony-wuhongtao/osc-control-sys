var img;
var bgimg;
var lantern;
var dragVal = 0;

function preload() {
  img = loadImage('assets/lantern.png');
  bgimg = loadImage('assets/background.png');
}

function setup() {
  createCanvas(document.body.clientWidth, window.innerHeight);
  //imageMode(CENTER);
  rectMode(CENTER);
  lantern = new Lantern(750, 1118);
  console.log(document.body.clientWidth);
  console.log(document.body.clientHeight);
}

function draw() {
  background(0);
  image(bgimg, 0, 0, document.body.clientWidth, window.innerHeight);

  if(lantern.launchStatus) {
    var floating = createVector(0, -0.05);
    lantern.applyForce(floating);
  }
  lantern.update();
  lantern.display();
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

function mouseDragged() {
  dragVal += 5;
  if (dragVal > 50) {
    lantern.launch();
  }
  value = 0;
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
