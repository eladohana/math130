"use strict";

class Projectile extends MovingObject{
  constructor(config){
    super(config);
    this.active = true;
    // this.color = config.color;
    // this.radius = config.radius;
  }

  drawSelf(){
    this.context.fillStyle = this.color;
    this.context.beginPath();
    this.context.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
    this.context.fill()
    this.context.closePath();
  }

  alwaysActive(){
    this.drawSelf();
    this.moveForward();
  }

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

  checkShipIntersections(ship){
    let intersections = []
    for (let line of ship.lines){
      intersections.push(...this.findLineIntersection(line));
    }
    return intersections;
  }

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

}
