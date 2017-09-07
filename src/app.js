 import 'babel-polyfill';
 import * as p2 from 'p2';

 class Sp8sBall {
   constructor() {
     //HTMLCanvasElement && CanvasRenderingContext2D
     this.canvas = document.getElementById("app");
     this.ctx = this.canvas.getContext("2d");

     this.world = new p2.World({
       gravity: [0, -5]
     });

     this.cfg = {
       size: {
         width: 480,
         height: 640
       }
     };

     this.ctx.canvas.width = this.cfg.size.width;
     this.ctx.canvas.height = this.cfg.size.height;
     requestAnimationFrame(this.render.bind(this));
   }

   render(timestamp) {
     console.log('Rendering');
     this.ctx.fillStyle = 'rgb(200,0,0)';
     this.ctx.moveTo(0,0);
     this.ctx.lineTo(this.cfg.size.width,this.cfg.size.height);
     this.ctx.stroke();

     requestAnimationFrame(this.render.bind(this));
   }

 }

 document.addEventListener("DOMContentLoaded", () => {
   let sp8sBall = new Sp8sBall();
 });