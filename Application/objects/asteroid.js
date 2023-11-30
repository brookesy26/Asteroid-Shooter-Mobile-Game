// asteroid class which extends Phaser.Physics.Matter.Sprite
// sets physical properties of each asteroid on creation 
export default class Asteroid extends Phaser.Physics.Matter.Sprite {
  constructor(world, x, y, texture, velocity) {
    super(world, x, y, texture);
    this.setCircle(45);
    this.scene.add.existing(this);
    this.setScale(Phaser.Math.Between(4, 8.5) * 0.1);
    this.setFrictionAir(0);
    this.setMass(this.scale * 100);
    this.setAngularVelocity(0.02);
    this.setVelocityY(velocity);
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
  }
}