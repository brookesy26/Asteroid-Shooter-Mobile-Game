export default class HowToPlay extends Phaser.Scene {
  constructor() {
    super({ key: 'HowToPlay' });
    this.controlA
    this.controlD
  }
  preload() {
    // Load assets
    this.load.image('bg', 'assets/ui/black.png');
    this.load.image('headingBox', 'assets/ui/HeadingBackground.png');
    this.load.image('playBox', 'assets/ui/PlayButton.png');
    this.load.image('arrow', 'assets/ui/arrow.png');
    this.load.image('bg', 'assets/ui/darkPurple.png');
    this.load.image('cap', 'assets/GameObjects/EnergyPill.png');
    this.load.image('bolt', 'assets/GameObjects/EnergyMeter.png');
  }

  create() {
    //variables
    const headingStyle = { font: '20px KenVector Future', fill: '#E86A17' };
    const textStyle = { font: '16px KenVector Future', fill: '#ffffff' };
    const gameWidth = this.game.config.width;
    const info = ['Weapons and movement', 'consume energy,', 'collect capsules to', 'replenish the supply', 'faster.']

    //background
    this.add.tileSprite(0, 0, 800, 600, 'bg').setOrigin(0, 0);

    //title
    this.add.text(94, 27, 'How To Play', headingStyle);

    //info
    this.add.text(24, 70, 'Information', headingStyle);
    this.add.text(24, 95, info, textStyle).setAlign('left');

    //power packs
    this.add.text(24, 185, 'power packs', headingStyle);
    this.add.image(24, 215, 'cap').setScale(0.7).setOrigin(0, 0);
    this.add.image(23, 240, 'bolt').setScale(0.5).setOrigin(0, 0);
    this.add.text(45, 215, 'energy capsule', textStyle);
    this.add.text(46, 240, 'energy meter', textStyle);

    //weapons
    this.add.text(24, 270, 'Weapons', headingStyle);
    this.add.text(24, 295, 'basic: missiles', textStyle);
    this.add.text(24, 320, 'ultimate: Energy Blast', textStyle);

    //player controls
    this.add.text(24, 350, 'Controls', headingStyle);
    this.add.text(24, 375, 'Movement', textStyle);
    this.add.text(24, 400, 'Basic Weapon', textStyle);
    this.add.text(24, 425, 'ultimate weapon', textStyle);

    //player controls visuals
    this.add.image(170, 370, 'arrow').setOrigin(0, 0).setScale(0.8);
    this.add.image(210, 389, 'arrow').setOrigin(0, 0).setScale(0.8).setAngle(180);
    this.add.image(210, 397, 'arrow').setOrigin(0, 0).setScale(0.8).setAngle(90);
    this.add.image(225, 445, 'arrow').setOrigin(0, 0).setScale(0.8).setAngle(270);

    //menu button
    const menuButton = this.add.image(75, 500, 'playBox').setOrigin(0, 0).setInteractive();
    this.add.text(105, 515, 'Main Menu', textStyle);
    menuButton.on('pointerover', () => menuButton.setTint(0x00FF00));
    menuButton.on('pointerout', () => menuButton.clearTint());
    menuButton.on('pointerdown', () => this.scene.switch('MainMenu'));
  }

  update() {
    // Game logic
  }
}