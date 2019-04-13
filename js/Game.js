"use strict";


class GameArea {
  constructor(width, height, id){
    this.width = width;
    this.height = height;
    this.canvas = document.createElement("canvas");
    this.start(width, height, id);

  }

  /** Configures a canvas element and displays on html page
    * @param {int} width the width of the canvas
    * @param {int} height the height of the canvas
    * @param {string} id the id attribute parent element
    */
  start(width, height, id){
    this.canvas.width = width;
    this.canvas.height = height;
    this.context = this.canvas.getContext("2d");
    document.getElementById(id).appendChild(this.canvas);
  }

  /** Clear canvas for page refresh
    */
  clear(){
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.fillStyle = "#000000";
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
}


class Game{
  constructor(){
    this.width = window.visualViewport.width * .98;
    this.height = window.visualViewport.height * .70
    this.gameArea = new GameArea(this.width, this.height, "game-area");
    // gameArea.background()
    this.refreshRate = 120;
    this.moveUnits = 50;
    this.playerConfig = new ShipConfig(this.width/2,this.height * 0.85, 45, 80, "#00FF00", this);
    this.enemyConfig = new ShipConfig(this.width/3,this.height * 0.35, 300, 80, "#FFFF00", this);
    this.playerShip = new Ship(this.playerConfig);
    this.enemyShip = new Ship(this.enemyConfig);
    this.displayInfo = document.getElementById("info");
    this.intersectColors = "#FF0000";
    this.htmlSetup();

    this.counter = 0;
    setInterval(()=>{
      this.drawGame();
      this.displayGameInfo();
    }, 1000/this.refreshRate)
  }

  /** Runs all the game functions performed
    */
  drawGame() {
    this.gameArea.clear();
    this.playerShip.alwaysActive();
    this.enemyShip.alwaysActive();
    this.drawIntersections();
    this.performKeyFunctions();
    this.checkCollision();
  }

  /** Returns a random integer between 0 and the given range
    * @param {int} range the upper end of the range
    * @return {int} a number between 0 and the range
    */
  randomInt(range){
    return Math.trunc(Math.random() * range);
  }

  /** Creates a random color in RGB
    * @return {string} a string signifying the rgb color value
    */
  randomColor(){
    const rand = this.randomInt
    return `rgb(${rand(256)}, ${rand(256)}, ${rand(256)})`;
  }


  /** Check collision between the ships and projectiles and change everything to random colors
    */
  checkCollision() {
    // if (this.playerShip.checkCollision(this.enemyShip)){
    //   this.enemyShip.color = "FFFFFF";
    // }
    let collision = this.playerShip.checkCollision(this.enemyShip);

    let count = 0;
    while (!collision && this.playerShip.shots.length > count){
      collision = this.playerShip.shots[count].checkShipCollision(this.enemyShip);
      count++;
    }


    if (collision){
      console.log(collision)
      this.playerShip.color = this.randomColor();
      this.enemyShip.color = this.randomColor();
      this.intersectColors = this.randomColor();
    }
  }

  /** Draw a small circle
    * @param {int|float} centerX the x coordinate of the center
    * @param {int|float} centerY the Y coordinate of the center
    * @param {int|float} radius the radius of the circle
    * @param {string} color the color of the circle
    */
  drawCircle(centerX, centerY, radius, color){
    this.gameArea.context.fillStyle = color;
    this.gameArea.context.beginPath();
    this.gameArea.context.arc(centerX, centerY, radius, 0, 2*Math.PI);
    this.gameArea.context.fill();

  }

  /** Draw circles at intersection points
    */
  drawIntersections(){

    let intersections = this.playerShip.checkIntersections(this.enemyShip);


    let playerShots = this.playerShip.shots;
    // if (playerShots){
    for (let shot of playerShots){
      intersections.push(...shot.checkShipIntersections(this.enemyShip));
    }
    // console.log(intersections);
    // }
    for (let intersect of intersections){
      this.drawCircle(intersect.x, intersect.y, 4, this.intersectColors);
    }
    //
    // return intersections;
    // return this.playerShip.checkIntersections(this.enemyShip);
  }

  /** Create small HTML table displaying ship information
    */
  displayGameInfo() {
    this.counter += 1000/this.refreshRate;
    if (this.counter >= 100){
      this.counter -= 100;
      this.displayInfo.innerHTML = `<table style="width:100%">
        <tr>
          <th>Player X Position</th>
          <th>Player Y Position</th>
          <th>Degrees</th>
          <th>Radians</th>
        </tr>
        <tr>
          <td>${Math.round(this.playerShip.x * 100)/100}</td>
          <td>${Math.round(this.playerShip.y * 100)/100}</td>
          <td>${Math.round(this.playerShip.degrees * 100)/100}</td>
          <td>${Math.round(this.playerShip.radians * 100)/100}</td>
        </tr>
      </table>
      `
    }
  }

  /** Perform the functions based on keys pressed
    */
  performKeyFunctions() {
    for (let key of this.keysPressed) {
      this.keyFunctions[key]();
    }
  }

  /** Listen for player input and pass the information to other functions
    */
  htmlSetup(){
    this.keyFunctions = {
      'ArrowUp': () => {this.playerShip.moveForward()},
      'ArrowRight': () => {this.playerShip.rotateClock()},
      'ArrowLeft': () => {this.playerShip.rotateCounter()},
      ' ': () => {this.playerShip.shoot()},

    };

    this.keysPressed = [];

    document.addEventListener('keydown', (event)=>{
      const key = event.key;
      // console.log(key);
      const availableKeys = Object.keys(this.keyFunctions);
      if (!this.keysPressed.find(element => {
        return element === key;
      }) && availableKeys.find(element => {
        return element === key;
      })) {
        this.keysPressed.push(event.key);
      }
    });

    document.addEventListener('keyup', (event)=>{
      const key = event.key;
      for (let i = 0; i < this.keysPressed.length; i++){
        if (this.keysPressed[i] === key){
          this.keysPressed.splice(i, 1);
        }
      }
    });
  }

}
