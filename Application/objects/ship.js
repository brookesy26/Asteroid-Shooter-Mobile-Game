export default class Ship extends Phaser.Physics.Matter.Sprite {
  constructor(world, x, y, texture, particleTexture) {
    super(world, x, y, texture)
    this.scene.add.existing(this);
    this.setFixedRotation(Infinity);
    this.setScale(0.3);
    this.setAngle(270);
    this.setFrictionAir(0.06);
    this.setMass(50);
    this.particleConfig = {
      speed: { onEmit: () => this.body.speed },
      lifespan: { onEmit: () => Phaser.Math.Percent(this.body.speed, 0, 300) * 2000 },
      scale: { start: 0.4, end: 0 },
      blendMode: 'SCREEN',
    };
    this.emitter = this.scene.add.particles(particleTexture)
      .createEmitter(this.particleConfig)
      .startFollow(this);
  }
}

