var img;
var bgimg;
var loadingimg;
var loadingCount = 0;

var touch;
var loading = true;

var gallery = new Gallery(3);
var imgs = new Array(3);

function preload() {
  for (var i = 0; i < imgs.length; i++) {
    imgs[i] = loadImage('assets/' + 'lantern' + i + '.png');
  }
  bgimg = loadImage('assets/background.png');
  rlimg = loadImage('assets/reload.png');
  rlimg.rotateAngle = 0;
  rlimg.angleInc = 0.05;
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
  image(bgimg, windowWidth/2, windowHeight/2, windowWidth, windowHeight);
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

  if (gallery.triggered) {
    console.log(windowWidth/2 - rlimg.width/2);
    if (mouseX > (windowWidth/2 - rlimg.width/2) && mouseX < (windowWidth/2 + rlimg.width/2) &&
        mouseY > (windowHeight/3 - rlimg.height/2) && mouseY < (windowHeight/3 + rlimg.height/2)) {
          window.location.reload();
    }
  }
  return false;
}

function Gallery(n) {
  // gallery status flags
  this.launched = false;
  this.triggered = false;
  this.queue = 0;

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

  Gallery.prototype.renderFloaters = function () {
    // render floaters
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
        push();
        translate(windowWidth/2, windowHeight/3);
        rotate(rlimg.rotateAngle);
        image(rlimg, 0, 0);
        rlimg.rotateAngle += rlimg.angleInc;
        pop();
        //rect(windowWidth/2, windowHeight/3, 200, 200);


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
  };

  Gallery.prototype.render = function () {
    var achar = "";
    if (this.queue == 0) {
      achar = "请点亮您的灯笼";
      this.renderFloaters();
    } else {
      achar = "您前面还有\n" + this.queue + "盏灯笼等待点亮";
    }

    // render hint
    if (!this.launched) {
      fill(255);
      var cHeight = 80;
      textSize(cHeight);
      strokeWeight(8);
      var cWidth = textWidth(achar);
      this.text = text(achar, windowWidth/2, windowHeight/3);
    }
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
