"use strict";


const game = new Game();

const button = document.querySelector('button');

button.addEventListener('click', ()=>{
  if (game.showLines) {
    button.textContent = "Show Lines";
    game.showLines = false;
  }
  else {
    button.textContent = "Hide Lines";
    game.showLines = true;
  }
});
