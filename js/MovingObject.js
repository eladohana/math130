"use strict";

class MovingObject{
  constructor(config){
    this.x = config.x;
    this.y = config.y;
    this.speed = config.speed;
    this.degrees = config.degrees;
    this.context = config.context;
    this.color = config.color;
    this.radius = config.radius;
    this.rotationSpeed = config.rotationSpeed;
  }

  degToRad(deg){
    return deg * Math.PI/180;
  }

  radToDeg(rad){
    return rad * 180/Math.PI;
  }

  get radians(){
    return this.degToRad(this.degrees);
  }

  set radians(rad){
    this.degrees = this.radToDeg(rad);
  }

  xDist(distance, angle){
    return distance * Math.cos(angle);
  }

  yDist(distance, angle){
    return distance * Math.sin(angle) * -1;
  }

  move(distance, angle) {
    this.x += this.xDist(distance, angle);
    this.y += this.yDist(distance, angle);
  }

  normalizeAngle(){
    while (this.degrees >= 360){
      this.degrees -= 360;
    }
    while (this.degrees < 0){
      this.degrees += 360;
    }
  }

  rotate(deg) {
    let currentDegrees = this.degrees + deg;
    this.degrees = currentDegrees;
    this.normalizeAngle();
  }

  rotateCounter() {
    this.rotate(this.rotationSpeed);
  }
  rotateClock() {
    this.rotate(this.rotationSpeed * -1);
  }

  moveForward(){
    this.move(this.speed, this.radians);

  }

  keepInBox(width, height){
    if (this.x - this.radius < 0){
      this.x = this.radius;
    }
    else if (this.x + this.radius > width){
      this.x = width - this.radius;
    }
    if (this.y - this.radius < 0){
      this.y = this.radius;
    }
    else if (this.y + this.radius > height){
      this.y = height - this.radius;
    }
  }

  drawSelf(){
    this.context.fillStyle = "#FF0000";
    this.context.fillRect(this.x, this.y, 20, 20);
  }

  verticalLine(line){
    return (line.slope === 1/0 || line.slope === -1/0)
  }
}


class MovingObjectConfig{
  constructor(x, y, degrees, radius, color, gameConfig){
    this.x = x;
    this.y = y;
    this.degrees = degrees;
    this.radius = radius;
    this.color = color;
    this.context = gameConfig.gameArea.context;
  }
}
