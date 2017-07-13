var img;
var bgimg;
var lantern;
var floaters = new Array(5);
var locations = new Array(floaters.length);
var selected = (floaters.length-1)/2;

var launched = false;

var touch;
var triggered = false;

var xoff = 0;
var noiseInc = 0.05;

function preload() {
  img = loadImage('assets/lantern.png');
  bgimg = loadImage('assets/background.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  rectMode(CENTER);
  colorMode(RGB, 255, 255, 255, 255);
  textSize(60);
  textAlign(CENTER);
  //lantern = new Lantern(windowWidth/2, windowHeight*2/3);

  // create an array of floaters
  for (var i = 0, offset = 300; i < floaters.length; i++) {
    //
    var xoff = i-((floaters.length-1)/2);
    locations[i] = windowWidth/2 + offset * xoff;
    floaters[i] = new Lantern(locations[i], windowHeight*2/3, selected == i, i);
  }
}

function draw() {
  background(0);
  //image(bgimg, windowWidth/2, windowHeight/2, windowWidth, windowHeight);



  //lantern.update();
  //lantern.display();
  /*
  if (lantern.position.y < 0 && lantern.triggered == false) {
    d3.cue(1);
    lantern.triggered = true;
  }
  */

  for (var i = 0; i < floaters.length; i++) {
    var floater = floaters[i];

    if (launched && floater.selected) {
      var floating = createVector(0, -0.05);
      floater.applyForce(floating);
    }
    floater.update();

    var destLocation = floater.location;
    var diff = (locations[destLocation] - floater.position.x);

    if (floater.direction * diff < 0) {
      diff *= -1;
    }

    // smoothing
    if (floater.position.x != locations[destLocation]) {
      floater.position.x += diff * 0.1;
    }

    if (floater.position.y < 0) {
      fill(255);
      textSize(60 + (sin(xoff) - 0.5)*3);
      text("Please Refresh!", windowWidth/2, windowHeight/3);
      if (!triggered) {
        console.log("BOW!");
      }
      triggered = true;

    }

    floater.checkEdge();

    if (!launched) {
      floater.render();
    } else if (i == selected) {
      floater.render();
    }

  }
  xoff += noiseInc;
}


function touchStarted() {
  touch = createVector(mouseX, mouseY);
}


function touchEnded() {
  var diffY = touch.y - mouseY;
  var diffX = touch.x - mouseX;
  if (diffY > 300) {
    for (var i = 0; i < floaters.length; i++) {
      floaters[i].launch();
    }
  }

  if (!launched && diffX > 200) {
    swipe(-1);// swipe left
    console.log("swipe left");
  }

  if (!launched && diffX < -200) {
    swipe(1);
    console.log("swipe right");
  }
  return false;
}


function swipe(direction) {
  selected = (selected - direction + floaters.length) % floaters.length;
  console.log(selected);
  for (var i = 0; i < floaters.length; i++) {
    floaters[i].location = (floaters[i].location + direction + floaters.length) % floaters.length;
    floaters[i].direction = direction;
    if (i == selected) {
      floaters[i].selected = true;
    } else {
      floaters[i].selected = false;
    }
  }
}


var Lantern = function(x, y, s, l) {

  this.position = createVector(x, y);
  this.velocity = createVector(0, 0);
  this.acceleration = createVector(0, 0);
  this.c = color(random(255), random(255), random(255));
  this.alpha = 255;
  this.img = img;
  this.selected = false;
  this.triggered =  false;
  this.destination = createVector(x, 0);
  this.selected = s;
  this.direction = 0;
  this.location = l;

  Lantern.prototype.render = function () {
    // display image
    //image(this.img, this.position.x, this.position.y, this.img.width, this.img.height);
    if (this.selected) {
      stroke(255);
      strokeWeight(8);
    } else {
      noStroke();
    }

    fill(this.c);
    if(launched && !this.selected) {
      //fill(this.c, 127);
      this.alpha -= 1;
      if (this.alpha < 0) {
        this.alpha = 0;
      }

    }
    rect(this.position.x, this.position.y, 200, 200);
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
    launched = true;
  };

  Lantern.prototype.checkEdge = function () {
    if (this.position.x < -windowWidth*0.5) {
      this.position.x = windowWidth*1.5;
    }
    if (this.position.x > windowWidth*1.5) {
      this.position.x = -windowWidth*0.5;
    }
  }

};
