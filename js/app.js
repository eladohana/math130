"use strict";


const game = new Game();


// Numbers to test formula
let m=2;
let h=3;
let k=4;
let r=5;
let b=1;
let a = (m**2+1)**0.5;
let c = m*(b-k)-h;
let d = r**2 - (b-k)**2 - h**2
let v = (d + (c/a)**2)**0.5
let x1 = (v - c/a)/a;
let x2 = (-v - c/a)/a;
let y1 = m * x1 + b;
let y2 = m * x2 + b;

console.log(`${x1}, ${y1}`);
console.log(`${x2}, ${y2}`);
