export default class Weapon extends Phaser.Physics.Matter.Sprite {
  constructor(world, x, y, texture) {
    super(world, x, y, texture);
    this.world.remove(this.body);
    this.scene.add.existing(this);
    this.setY(-200)
    this.setActive(false);
    this.setFrictionAir(0);
    this.setScale(0.4);
    this.setMass(10);
    this.setAngle(0);
    this.setDepth(1);
    this.setAlpha(1);
    this.particleConfig = {
      speed: 20,
      lifespan: 60,
      scale: { start: 0.2, end: 0 },
      blendMode: 'ADD',
    };
  }
  preload() {
    this.load.image('red', 'assets/GameObjects/red_particle.png');
  }
  fire(x, y) {
    this.world.add(this.body);
    this.setAngularVelocity(0);
    this.setFixedRotation(Infinity);
    this.setX(x);
    this.setY(y - 8);
    this.setActive(true);
    this.setVisible(true);
    this.setVelocityY(-5);
    this.setVelocityX(0);
    this.lifespan = 1500;
    this.emitter = this.scene.add.particles('red')
      .createEmitter(this.particleConfig)
      .startFollow(this);
  }


  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    this.lifespan -= delta;
    if (this.lifespan <= 0) {
      this.setActive(false);
      this.setVisible(false);
      this.world.remove(this.body, true);
      this.emitter.explode(15, 0, 0);
    }
  }
}