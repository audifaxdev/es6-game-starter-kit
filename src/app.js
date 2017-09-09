import 'babel-polyfill';
import * as p2 from 'p2';
import {autoDetectRenderer, Container, Graphics} from 'pixi.js';

import level01 from './levels/level01';

let defaultCfg = {
  graphics: {
    width: 480,
    height: 640,
    pixelsPerLengthUnit: 16
  },
  physics: {
    gravity: [0, -10],
    fixedTimeStep: 1/60,
    maxSubSteps: 10
  }
};

class Application {

  constructor() {
    this.cfg = Object.assign({}, defaultCfg);
    this.gameObjects = [];
    this.setupGraphics();
    this.setupPhysics();
    this.loadLevel(level01);
    requestAnimationFrame(this.update.bind(this));
  }

  setupGraphics() {
    let ppu = this.cfg.graphics.pixelsPerLengthUnit;
    let w = this.cfg.graphics.width;
    let h = this.cfg.graphics.height;

    this.renderer = autoDetectRenderer(
      w, h, {
        backgroundColor : 0xf0f0f0,
        antialias: true,
        autoResize: true
      }
    );

    this.renderer.view.style.width = w + 'px';
    this.renderer.view.style.height = h + 'px';

    this.stage = new Container();
    //reverse y axis
    // this.stage.scale.y = -1;
    //origin to bottom left
    this.stage.position.x = 0;
    this.stage.position.y = h;
    // this.stage.position.y = h -ppu;

    this.ground = new Graphics();
    this.ground.beginFill(0x007700);
    this.ground.lineStyle(0, 0x000000, 1);
    this.ground.drawRect(0, -1, w*ppu, 3);
    this.ground.endFill();

    // this.circle = new Graphics();
    // this.circle.beginFill(0x167716);
    // this.circle.lineStyle(1, 0x000000, 1);
    // this.circle.drawCircle(0, 0, radius*ppu);
    // this.circle.endFill();

    this.stage.addChild(this.ground);
    // this.stage.addChild(this.circle);

    document.body.appendChild(this.renderer.view);
  }

  setupPhysics() {
    let ppu = this.cfg.graphics.pixelsPerLengthUnit;
    let w = this.cfg.graphics.width;
    let h = this.cfg.graphics.height;
    let gravity = this.cfg.physics.gravity;

    this.world = new p2.World({gravity});

    this.groundBody = new p2.Body({
      mass: 0,
      position: [0, 0],
    });
    this.groundShape = new p2.Plane();
    this.groundBody.addShape(this.groundShape);
    this.world.addBody(this.groundBody);

    this.lastTime = null;
  }

  computeP2Size(shape) {
    let aabb = new p2.AABB();
    shape.computeAABB(aabb, [0, 0], 0);
    let left = aabb.lowerBound[0];
    let bottom = aabb.lowerBound[1];
    let right = aabb.upperBound[0];
    let top = aabb.upperBound[1];
    let width = right - left;
    let height = top - bottom;
    return {width, height};
  }

  loadLevel(level) {
    let ppu = this.cfg.graphics.pixelsPerLengthUnit;
    let w = this.cfg.graphics.width;
    let h = this.cfg.graphics.height;

    let blocks = level({xMax: (w/ppu), yMax: (h/ppu)});

    blocks.forEach((block) => {
      let shape;
      let size;
      let gfx;
      let body = new p2.Body({
        mass: block.mass,
        position: block.position,
        angle: block.angle,
        restitution: 1
      });

      switch (block.type) {
        case "box":
          shape = new p2.Box({ width: block.width, height: block.height });
          body.addShape(shape);
          this.world.addBody(body);
          size = this.computeP2Size(shape);
          gfx = new Graphics();
          gfx.beginFill(0x007700);
          gfx.lineStyle(0, 0x000000, 1);
          gfx.drawRect(-(size.width/2)*ppu, -(size.height/2)*ppu, size.width*ppu, size.height*ppu);
          gfx.endFill();
          gfx.position.x = block.position[0]*ppu;
          gfx.position.y = -block.position[1]*ppu;
          gfx.rotation = -block.angle;
          this.stage.addChild(gfx);
          break;
        case "circle":
          shape = new p2.Circle({ radius: block.radius });
          body.addShape(shape);
          this.world.addBody(body);
          size = this.computeP2Size(shape);
          gfx = new Graphics();
          gfx.beginFill(0x007700);
          gfx.lineStyle(0, 0x000000, 1);
          gfx.drawCircle(0, 0, block.radius*ppu);
          gfx.endFill();
          gfx.position.x = block.position[0]*ppu;
          gfx.position.y = -block.position[1]*ppu;
          gfx.rotation = -block.angle;
          this.stage.addChild(gfx);
          break;
        default:
          break;
      }
      this.gameObjects.push({gfx,shape, body});
    });

    setTimeout(() => {
    }, 5000)
  }


  syncGfx(gameObj) {
    let ppu = this.cfg.graphics.pixelsPerLengthUnit;
    gameObj.gfx.position.x = gameObj.body.position[0] * ppu;
    gameObj.gfx.position.y = -gameObj.body.position[1] * ppu;
    gameObj.gfx.rotation =  -gameObj.body.angle;
  }

  update(time) {
    let deltaTime = this.lastTime
      ? (time - this.lastTime) / 1000 : 0;
    this.world.step(
      this.cfg.physics.fixedTimeStep,
      deltaTime,
      this.cfg.physics.maxSubSteps
    );

    this.gameObjects.forEach((gameObj) => this.syncGfx(gameObj));

    this.renderer.render(this.stage);

    requestAnimationFrame(this.update.bind(this));
  }

}

document.addEventListener("DOMContentLoaded", () => {
  let app = new Application();
});