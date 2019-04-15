"use strict";

class Ship extends MovingObject{

  /**
    * Constructor method for this object
    */
  constructor(config){
    super(config);
    // this.game = config.game;
    this.fireRate = 10;
    this.fireCounter = 0;
    this.shots = []
  }

  /**
    * Calculates the time needed to wait between shots based on fire rate
    * @return {int} time in milliseconds
    */
  get fireRefresh(){
    return 1000/this.fireRate;
  }

  /**
    * Provides the corners needed to build the ship
    * @return {array} array of objects with x, y properties
    */
  get corners(){
    let x = this.x;
    let y = this.y
    let corners = [{x: x, y: y}]
    let degDiff = this.degToRad(135);
    let angles = [this.radians + degDiff, this.radians, this.radians - degDiff]

    for (let angle of angles){
      corners.push({x: x + this.xDist(this.radius, angle),
                    y: y + this.yDist(this.radius, angle)});
    }
    corners.push({x: x, y: y});
    return corners;
  }

  /**
    * provides lines that are used to check for intersections and collisions
    * @return {array} array of line objects with various calculation properties
    */
  get lines(){
    const lines = [];
    for (let i = 1; i < this.corners.length; i++){
      let p1 = this.corners[i-1];
      let p2 = this.corners[i];
      let slope = this.slopeCalc(p1, p2);
      let yInt = this.yIntCalc(p2, slope);
      let xInt = this.xIntCalc(p2, slope, yInt);
      lines.push(
        {
          slope: slope,
          yInt: yInt,
          xInt: xInt,
          p1: p1,
          p2: p2,
          minX: Math.min(p1.x, p2.x),
          maxX: Math.max(p1.x, p2.x),
          minY: Math.min(p1.y, p2.y),
          maxY: Math.max(p1.y, p2.y),
        })
    }
    return lines;
  }


  /**
    * Calculates the slope given two points
    * @param {object} point1 first point with x, y properties
    * @param {object} point2 second point with x, y properties
    * @return {int} calculated slope for the two given points
    */
  slopeCalc(point1, point2) {
    let xdist = point2.x - point1.x;
    let ydist = point2.y - point1.y;
    return ydist/xdist;
  }


  /**
    * Calculates the y-intercept(the point at which x=0 for a given line given the slope of the line and a point through which it goes
    * @param {object} point point that intersects the line
    * @param {object} slope the slope of the line
    * @return {int|null} y-intercept of the line or null if line is vertical
    */
  yIntCalc(point, slope) {
    if (slope < 1/0 && slope > -1/0){
      return point.y - (point.x * slope);
    }
    else {
      return null;
    }
  }


  /**
    * Calculates the x-intercept(the point at which y=0 for a given line given the slope of the line and a point through which it goes along with y-intercept (optional)
    * @param {object} point point that intersects the line
    * @param {object} slope the slope of the line
    * @param {object} [yInt=null] the y-intercept of the line
    * @return {int|null} x-intercept of the line or null if line is horizontal
    */
  xIntCalc(point, slope, yInt = null){
    yInt = yInt || this.yIntCalc(point, slope);
    if (slope && yInt){
      return -yInt / slope;
    }
    else if (!yInt){
      return point.x;
    }
    else{
      return null;
    }
  }

  /** Checks collision with another ship by seeing if the intersect lines are within both of their boundaries
-- NEEDS TO BE UPDATED TO INCLUDE PROJECTILE
    * @param {object} other another Ship object
    * @return {object|boolean} intersect point if true, false if no collision
    */
  checkCollision(other){
    for (let l1 of this.lines){
      for(let l2 of other.lines){
        for (let intersect of this.checkIntersections(other)){
          if (intersect.y === l1.slope * intersect.x + l1.yInt && intersect.y === l2.slope * intersect.x + l2.yInt){
            if (intersect.x >= l1.minX && intersect.x <= l1.maxX && intersect.x >= l2.minX && intersect.x <= l2.maxX){
              return intersect;
            }
          }
        }
      }
    }
    return false;
  }


  /**
    * Draws an extended line from the ship edges to demonstrate the line path
    * @param {object} line line object
    */
  drawLine(line){
    this.context.beginPath();
    if (line.yInt){
      this.context.moveTo(0, line.yInt);
      this.context.lineTo(this.game.width, line.slope * this.game.width + line.yInt);
    }
    else {
      this.context.moveTo(line.xInt, 0);
      this.context.lineTo(line.xInt, this.game.height)
    }
    this.context.stroke();

  }

  /**
    * Draw lines for all available lines
    */
  drawLines(){
    this.context.strokeStyle = this.color;
    for (let line of this.lines){
      this.drawLine(line);
    }
  }

  /**
    * Get an intersection given two lines
    * @param {object} l1 first line
    * @param {object} l2 second line
    * @return {object|null} return intersection point if found or null if not
    */
  findLineIntersection(l1, l2){
    if (!(this.verticalLine(l1) || this.verticalLine(l2))) {
      let x = (l2.yInt - l1.yInt) / (l1.slope - l2.slope);
      let y = l1.slope * x + l1.yInt;
      return {x: x, y: y};
    }
    else if (this.verticalLine(l1)) {
      let x = l1.xInt;
      let y = l2.slope * x + l2.yInt;
      return {x: x, y: y};
    }
    else {
      return this.findLineIntersection(l2, l1);
    }
    return null;
  }

  /**
    * Check the line intersections between two ships
    * @param {object} other another ship
    * @return {array} return intersection points found
    */
  checkIntersections(other){
    const intersections = [];
    if (other.__proto__.constructor.name === "Ship"){
      for (let l1 of this.lines){
        for (let l2 of other.lines){
          // let x = (l2.yInt - l1.yInt) / (l1.slope - l2.slope);
          // let y = l1.slope * x + l1.yInt;
          let intersect = this.findLineIntersection(l1, l2);
          if (intersect){
            intersections.push(intersect);
          }
        }
      }
    }
    return intersections;
  }

  /**
    * Draw ship on the canvas
    */
  drawSelf(){
    this.context.fillStyle = this.color;
    this.context.beginPath();
    this.context.moveTo(this.corners[0].x, this.corners[0].y);
    for (let i = 1; i < this.corners.length; i++){
      this.context.lineTo(this.corners[i].x, this.corners[i].y)
    }

    this.context.fill();

  }

  /**
    * Propel the ship forward at current angle and check that it does not go outside of canvas area
    */
  moveForward(){
    super.moveForward();
    this.keepInBox(this.game.width, this.game.height);
  }


  /**
    * Create a projectile object to hit the other ship
    */
  shoot(){
    if (this.fireCounter >= this.fireRefresh){
      const config = {};
      for (let key in this){

        config[key] = this[key];
      }
      config.x = this.corners[2].x;
      config.y = this.corners[2].y;
      config.speed *= 2;
      config.radius /= 5;
      this.shots.push(new Projectile(config));
      this.fireCounter = 0;
    }
  }


  /**
    * Run the functions that will need to run throughout the game
    */
  alwaysActive(){
    this.drawSelf();
    if (this.game.showLines){
      this.drawLines();
    }
    this.shots = this.shots.filter(shot => shot.active);
    this.fireCounter += 1000/this.game.refreshRate;
    for (let shot of this.shots){
      shot.alwaysActive();
    }
  }
}



/**
  * Object constructor with the details for the ship
  */
class ShipConfig extends MovingObjectConfig{
  constructor(x, y, degrees, radius, color, gameConfig){
    super(x, y, degrees, radius, color, gameConfig);
    this.speedCoeff = 10 * 0.5;
    this.angleCoeff = 1 * 1;
    this.speed = this.speedCoeff * gameConfig.moveUnits/gameConfig.refreshRate;
    this.rotationSpeed = this.angleCoeff * 360 / gameConfig.refreshRate;
    this.game = gameConfig;
  }
}
