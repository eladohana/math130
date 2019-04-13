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

  /** Converts a degree number to radian
    * @param {int|float} deg a number in degrees
    * @return {float} the calculated radian value
    */
  degToRad(deg){
    return deg * Math.PI/180;
  }

  /** Converts a radian number to degrees
    * @param {int|float} rad a number in radians
    * @return {float} the calculated degree value
    */
  radToDeg(rad){
    return rad * 180/Math.PI;
  }

  /** Get the radian value of the object's degrees
    * @return {float} the calculated radian value
    */
  get radians(){
    return this.degToRad(this.degrees);
  }

  /** Set a radian value
    * @param {int|float} rad the desired radian value
    */
  set radians(rad){
    this.degrees = this.radToDeg(rad);
  }

  /** Calculates a horizontal distance based on the distance and angle
    * @param {int|float} distance the distance between two points
    * @param {int|float} angle the angle in radians
    */
  xDist(distance, angle){
    return distance * Math.cos(angle);
  }

  /** Calculates a vertical distance based on the distance and angle
    * @param {int|float} distance the distance between two points
    * @param {int|float} angle the angle in radians
    */
  yDist(distance, angle){
    return distance * Math.sin(angle) * -1;
  }

  /** Move the object based on a given distance and angle
    * @param {int|float} distance the distance between two points
    * @param {int|float} angle the angle in radians
    */
  move(distance, angle) {
    this.x += this.xDist(distance, angle);
    this.y += this.yDist(distance, angle);
  }

  /** Change the angle value so that it stays between 0 and 360 degrees
    */
  normalizeAngle(){
    while (this.degrees >= 360){
      this.degrees -= 360;
    }
    while (this.degrees < 0){
      this.degrees += 360;
    }
  }

  /** Rotate the object a give number of degrees
    * @param {int|float} deg number of degrees to rotate
    */
  rotate(deg) {
    let currentDegrees = this.degrees + deg;
    this.degrees = currentDegrees;
    this.normalizeAngle();
  }

  /** Rotate the object counterclockwise based on its rotation speed
    */
  rotateCounter() {
    this.rotate(this.rotationSpeed);
  }
  /** Rotate the object clockwise based on its rotation speed
    */
  rotateClock() {
    this.rotate(this.rotationSpeed * -1);
  }

  /** Propel the object forward based on its speed and angle
    */
  moveForward(){
    this.move(this.speed, this.radians);

  }

  /** Constrain the object so that it stays within the limits of the canvas
    * @param {int} width the width of the canvas
    * @param {int} height the height of the canvas
    */
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

  /** Generic draw function for testing and will be overridden in child classes
    */
  drawSelf(){
    this.context.fillStyle = "#FF0000";
    this.context.fillRect(this.x, this.y, 20, 20);
  }

  /** Determine if a line is vertical
    * @param {object} line a line object
    */
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
