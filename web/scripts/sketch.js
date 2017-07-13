var img;
var bgimg;
var touch;
var xoff = 0;
var noiseInc = 0.05;
var gallery = new Gallery(3);

function preload() {
  //img = loadImage('assets/Floater.png');
  //bgimg = loadImage('assets/background.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  rectMode(CENTER);
  colorMode(RGB, 255, 255, 255, 255);
  textSize(60);
  textAlign(CENTER);
  gallery.init();
}

function draw() {
  background(0);
  //image(bgimg, windowWidth/2, windowHeight/2, windowWidth, windowHeight);
  gallery.render();

}


function touchStarted() {
  touch = createVector(mouseX, mouseY);
}


function touchEnded() {
  var diffY = touch.y - mouseY;
  var diffX = touch.x - mouseX;
  if (diffY > 300) {
    gallery.launched = true;
  }

  if (!gallery.launched && diffX > 200) {
    gallery.swipe(-1);// swipe left
  }

  if (!gallery.launched && diffX < -200) {
    gallery.swipe(1); // swite right
  }
  return false;
}




function Gallery(n) {
  // gallery status flags
  this.launched = false;
  this.triggered = false;

  // floaters array
  this.floaters = new Array(n);
  // location slots to hold floaters
  this.slots = new Array(this.floaters.length);
  // current selected floater index
  this.selected = (this.floaters.length-1)/2;

  Gallery.prototype.init = function () {
    // create an array of floaters
    for (var index = 0, offset = 300; index < this.floaters.length; index++) {
      //
      var xoff = index-((this.floaters.length-1)/2);
      this.slots[index] = windowWidth/2 + offset * xoff;
      this.floaters[index] = new Floater(this.slots[index], windowHeight*2/3, this.selected == index, index);
    }
  };

  Gallery.prototype.swipe = function (direction) {
    // update selected floater index
    this.selected = (this.selected - direction + this.floaters.length) % this.floaters.length;
    console.log(this.selected);

    // update individual floater's destination slot index
    for (var currentIndex = 0; currentIndex < this.floaters.length; currentIndex++) {
      this.floaters[currentIndex].destSlotLocation = (this.floaters[currentIndex].destSlotLocation + direction + this.floaters.length) % this.floaters.length;
      this.floaters[currentIndex].direction = direction;
      if (currentIndex == this.selected) {
        this.floaters[currentIndex].selected = true;
      } else {
        this.floaters[currentIndex].selected = false;
      }
    }
  };

  Gallery.prototype.render = function () {
    for (var i = 0; i < this.floaters.length; i++) {
      var floater = this.floaters[i];

      // apply floating force to the selected floater
      if (this.launched && floater.selected) {
        var floating = createVector(0, -0.05);
        floater.applyForce(floating);
      }
      floater.update();

      // move if swipe
      var dest = floater.destSlotLocation;
      var diff = (this.slots[dest] - floater.position.x);

      // if move towards different direction, reverse it
      if (floater.direction * diff < 0) {
        diff *= -1;
      }

      // smoothing movement
      if (floater.position.x != this.slots[floater.destSlotLocation]) {
        floater.position.x += diff * 0.1;
      }

      // floater move out of upper border
      if (floater.position.y < 0) {
        // pop up a hint to refresh
        fill(255);
        stroke(4);
        // animation text
        textSize(60 + (sin(xoff) - 0.5)*3);
        xoff += noiseInc;
        text("Please Refresh!", windowWidth/2, windowHeight/3);
        if (!this.triggered) {
          // fire a message
          console.log("BOW!");
        }
        this.triggered = true;
      }
      floater.checkEdge();

      // when not launched, display all floaters
      if (!this.launched) {
        floater.render();
      } else if (i == this.selected) {
        // if launched only display selected floater
        floater.render();
      }
    }
  };


}


function Floater(xPos, yPos, isSelected, destSlotLocation) {

  // motion-wise properties
  this.position = createVector(xPos, yPos);
  this.velocity = createVector(0, 0);
  this.acceleration = createVector(0, 0);

  // display-wise properties
  this.c = color(random(255), random(255), random(255));
  this.alpha = 255;
  this.img = img;

  // gallery-wise properties
  this.selected = isSelected;
  this.direction = 0;
  this.destSlotLocation = destSlotLocation;


  Floater.prototype.render = function () {
    // display image
    //image(this.img, this.position.x, this.position.y, this.img.width, this.img.height);
    if (this.selected) {
      stroke(255);
      strokeWeight(8);
    } else {
      noStroke();
    }

    fill(this.c);
    rect(this.position.x, this.position.y, 200, 200);
  };

  Floater.prototype.update = function() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  };

  Floater.prototype.applyForce = function (force) {
    this.acceleration.add(force);
  };

  Floater.prototype.checkEdge = function () {
    if (this.position.x < -windowWidth*0.5) {
      this.position.x = windowWidth*1.5;
    }
    if (this.position.x > windowWidth*1.5) {
      this.position.x = -windowWidth*0.5;
    }
  };

}
