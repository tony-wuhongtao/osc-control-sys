var img;
var bgimg;
var loadingimg;
var loadingCount = 0;

var touch;
var loading = true;

var gallery = new Gallery(3);
var imgs = new Array(3);

function preload() {
  loadingimg = loadImage('assets/loading.gif', function () {
    loadingCount++;
    if (loadingCount == 5) {
      loading = false;
    }
  });
  for (var i = 0; i < imgs.length; i++) {
    imgs[i] = loadImage('assets/' + 'lantern' + i + '.png', function () {
      loadingCount++;
      if (loadingCount == 5) {
        loading = false;
      }
    });
  }
  bgimg =loadImage('assets/background.png', function () {
    loadingCount++;
    if (loadingCount == 5) {
      loading = false;
    }
  });
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
  if (loading) {
    image(loadingimg, windowWidth/2, windowHeight/2, windowWidth, windowHeight);
  } else {
    image(bgimg, windowWidth/2, windowHeight/2, windowWidth, windowHeight);
    gallery.render();
  }
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

  /*
  if (gallery.launched) {
    if (mouseX > windowWidth/2 - cWidth/2 && mouseX < windowWidth/2 + cWidth/2 &&
        mouseY > windowHeight/3 - cHeight/2 && mouseX < windowHeight/3 + cHeight/2) {
          window.location.reload();
    }
  }
  */
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
      this.floaters[index] = new Floater(this.slots[index], windowHeight*3/4, imgs[index], this.selected == index, index);
    }
  };

  Gallery.prototype.swipe = function (direction) {
    // update selected floater index
    this.pselected = this.selected;
    this.selected = (this.selected - direction + this.floaters.length) % this.floaters.length;

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


      if (this.launched) {
        // float if selected
        if (floater.selected) {
          var floating = createVector(0, -0.05);
          floater.applyForce(floating);
        } else {
        // fade if unselected
        //floater.fade();
          //var diff = windowHeight + floater.img.height/2 - floater.w;
          //floater.position.y += diff * 0.02;
          var floating = createVector(0, 0.05);
          floater.applyForce(floating);
        }

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

      // expand if selected
      if (floater.selected) {
        var diffW = floater.img.width*1.5 - floater.w;
        floater.w += diffW * 0.1;
        var diffH = floater.img.height*1.5 - floater.h;
        floater.h += diffH * 0.1;
      } else {
      // shrink if deselected
        var diffW = floater.img.width - floater.w;
        floater.w += diffW * 0.1;
        var diffH = floater.img.height - floater.h;
        floater.h += diffH * 0.1;
      }

      // floater move out of upper border
      if (floater.position.y < 0) {
        // pop up a hint to refresh
        fill(255, 0, 0);
        stroke(0);
        strokeWeight(4);
        // animation text
        var achar = "再来一发";
        var cHeight = 80;
        textSize(cHeight);
        var cWidth = textWidth(achar);
        text(achar, windowWidth/2, windowHeight/3);


        if (!this.triggered) {
          // fire a message
          console.log("BOW!");
          d3.cue(i);
        }
        this.triggered = true;
      }
      floater.checkEdge();
      floater.render();
    }
  };

}


function Floater(xPos, yPos, img, isSelected, destSlotLocation) {

  // motion-wise properties
  this.position = createVector(xPos, yPos);
  this.velocity = createVector(0, 0);
  this.acceleration = createVector(0, 0);

  // display-wise properties
  this.c = color(random(255), random(255), random(255));
  this.img = img;
  this.w = this.img.width;
  this.h = this.img.height;
  this.alpha = 255;

  // gallery-wise properties
  this.pselected = false;
  this.selected = isSelected;
  this.direction = 0;
  this.destSlotLocation = destSlotLocation;


  Floater.prototype.render = function () {
    // display image
    image(this.img, this.position.x, this.position.y, this.w, this.h);

    /*
    if (this.selected) {
      stroke(255);
      strokeWeight(8);
    } else {
      noStroke();
    }

    fill(this.c);
    rect(this.position.x, this.position.y, 200, 200);
    */
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

  Floater.prototype.fade = function () {
    /*
    this.img.loadPixels();
    var d = 4;
    for (var x = 0; x < this.img.width; x++) {
      for (var y = 0; y < this.img.height; y++) {
        for (var i = 0; i < d; i++) {
          for (var j = 0; j < d; j++) {
            // loop over
            idx = 4 * ((y * d + j) * width * d + (x * d + i));
            pixels[idx+3] = this.alpha;
          }
        }
      }
    }
    this.img.updatePixels();
    this.alpha -= 5;
    */
  };

}
