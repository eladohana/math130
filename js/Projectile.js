"use strict";

class Projectile extends MovingObject{
  constructor(config){
    super(config);
    this.active = true;
    // this.color = config.color;
    // this.radius = config.radius;
  }
  /**
    * Draw projectile on the canvas
    */
  drawSelf(){
    this.context.fillStyle = this.color;
    this.context.beginPath();
    this.context.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
    this.context.fill()
    this.context.closePath();
  }


  /**
    * Run the functions that will need to run throughout the game
    */
  alwaysActive(){
    this.normalizeAngle();
    this.drawSelf();
    this.moveForward();
    this.bounce();
  }


  /**
    * Get an intersection given the projectile circle and a line
    * @param {object} line a line object
    * @return {array|null} return an array of objects representing intersection points or null if none are found
    */
  findLineIntersection(line){
    if (!this.verticalLine(line)){
      let h = this.x;
      let k = this.y;
      let b = line.yInt;
      let m = line.slope;
      let r = this.radius;
      let a = (m**2+1)**0.5;
      let c = m*(b-k)-h;
      let d = r**2 - (b-k)**2 - h**2
      let v = (d + (c/a)**2)**0.5
      let x1 = (v - c/a)/a;
      let x2 = (-v - c/a)/a;
      let y1 = m * x1 + b;
      let y2 = m * x2 + b;
      return [{x: x1, y: y1}, {x : x2, y : y2}]
    }
    return null;
  }


  /**
    * Find all line intersections with the ship
    * @param {object} ship a ship object
    * @return {array} return an array of objects representing intersection points
    */
  checkShipIntersections(ship){
    let intersections = []
    for (let line of ship.lines){
      intersections.push(...this.findLineIntersection(line));
    }
    return intersections;
  }


  /**
    * Check if the projectile has collided with a ship
    * @param {object} ship a ship object
    * @return {object|boolean} return a point where the ship collides or false if none
    */
  checkShipCollision(ship){
    if (this.active){
      for (let line of ship.lines){
        // console.log(line)
        for (let intersect of this.checkShipIntersections(ship)){
          if (intersect.y === line.slope * intersect.x + line.yInt){
            if (intersect.x >= line.minX && intersect.x <= line.maxX){
              this.active = false;
              return intersect;
            }
          }
        }
      }
    }
    return false;

  }

  /**
    * Check if the projectile has hit the border
    * @return {array} an array of one or two angles based on the border in question
    */
  checkBorderCollision(){
    let walls = [];
    if ((this.x - this.radius <=0 && this.degrees > 90 && this.degrees < 270) || (this.x + this.radius >= this.game.width && (this.degrees < 90 || this.degrees > 270))) {
      walls.push(180);
    }
    if ((this.y - this.radius <=0 && this.degrees < 180) || (this.y + this.radius >= this.game.height && this.degrees > 180)) {
      walls.push(0);
    }
    return walls
  }

  /**
    */
  bounce(){
    for (let wall of this.checkBorderCollision()){
      this.degrees = 360 - this.degrees + wall;
    }
  }
}
