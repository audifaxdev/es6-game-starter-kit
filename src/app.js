import 'babel-polyfill';
import * as p2 from 'p2';
import {autoDetectRenderer, Container, Graphics} from 'pixi.js';

let defaultCfg = {
  graphics: {
    width: 480,
    height: 640
  },
  sphere: {
    radius: 20,
    mass: 100
  },
  physics: {
    fixedTimeStep: 1/60,
    maxSubSteps: 10
  }
};

class Application {

  constructor() {
    this.cfg = Object.assign({}, defaultCfg);
    this.setupGraphics();
    this.setupPhysics();
    requestAnimationFrame(this.update.bind(this));
  }

  setupGraphics() {
    let w = this.cfg.graphics.width;
    let h = this.cfg.graphics.height;
    let radius = this.cfg.sphere.radius;

    this.renderer = PIXI.autoDetectRenderer(
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
    this.stage.scale.y = -1;
    //position to bottom left
    this.stage.position.x = 0;
    this.stage.position.y = h;

    this.ground = new Graphics();
    this.ground.beginFill(0x007700);
    this.ground.lineStyle(0, 0x000000, 1);
    this.ground.drawRect(0, 0, w, 10);

    this.circle = new Graphics();
    this.circle.beginFill(0x167716);
    this.circle.lineStyle(1, 0x000000, 1);
    this.circle.drawCircle(0, 0, radius);
    this.circle.position.x = w/2;
    this.circle.position.y = h;

    this.stage.addChild(this.ground);
    this.stage.addChild(this.circle);

    document.body.appendChild(this.renderer.view);
  }

  setupPhysics() {
    let w = this.cfg.graphics.width;
    let h = this.cfg.graphics.height;
    let radius = this.cfg.sphere.radius;
    let mass = this.cfg.sphere.mass;

    this.world = new p2.World({
      gravity: [0, -5],
    });

    this.circleBody = new p2.Body({
      mass: mass,
      position: [w/2, h]
    });

    this.circleShape = new p2.Circle({ radius: radius });
    this.circleBody.addShape(this.circleShape);
    this.world.addBody(this.circleBody);

    this.groundBody = new p2.Body({
      mass: 0,
      position: [w/2, 100],
      angle: 0,
      velocity: [0, 0],
      angularVelocity: 0
    });

    this.groundShape = new p2.Plane();
    this.groundBody.addShape(this.groundShape);
    this.world.addBody(this.groundBody);

    this.lastTime = null;
  }

  syncGfx(gfx, body) {
    gfx.position.x = body.position[0];
    gfx.position.y = body.position[1];
    gfx.rotation =   body.angle;
  }

  update(time) {
    let deltaTime = this.lastTime ? (time - this.lastTime) / 1000 : 0;
    this.world.step(this.cfg.physics.fixedTimeStep, deltaTime, this.cfg.physics.maxSubSteps);

    this.syncGfx(this.circle, this.circleBody);

    this.renderer.render(this.stage);

    requestAnimationFrame(this.update.bind(this));
  }

}

document.addEventListener("DOMContentLoaded", () => {
  let app = new Application();
});