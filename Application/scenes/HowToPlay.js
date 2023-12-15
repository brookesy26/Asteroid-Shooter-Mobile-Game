export default class HowToPlay extends Phaser.Scene {
  constructor() {
    super({ key: 'HowToPlay' });
  }
  preload() {
    // Load assets
    this.load.image('headingBox', 'assets/ui/HeadingBackground.png');
    this.load.image('playBox', 'assets/ui/PlayButton.png');
    this.load.image('arrow', 'assets/ui/arrow.png');
    this.load.image('purp_bg', 'assets/ui/darkPurple.png');
    this.load.image('bolt', 'assets/GameObjects/EnergyMeter.png');
  }

  create() {
    // text style objects 
    const headingStyle = { font: '20px gameFont', fill: '#E86A17' };
    const textStyle = { font: '16px gameFont', fill: '#ffffff' };

    // text array 
    const info = [
      'destroy the asteroids',
      'to gain points. weapon',
      'fire and movement',
      'consume energy, be',
      'careful not to run out!'
    ];

    //background repating image
    this.add.tileSprite(0, 0, 800, 600, 'purp_bg').setOrigin(0, 0);

    //title text
    this.add.text(94, 27, 'How To Play', headingStyle);

    //info text - pulls in array
    this.add.text(24, 70, 'Information', headingStyle);
    this.add.text(24, 95, info, textStyle).setAlign('left');

    //power packs text / image
    this.add.text(24, 185, 'power system', headingStyle);
    this.add.image(22, 215, 'bolt').setScale(0.5).setOrigin(0, 0);
    this.add.text(45, 215, 'energy meter', textStyle);
    this.add.text(24, 240, 'stop to regen energy', textStyle);

    //weapons text
    this.add.text(24, 270, 'Weapons', headingStyle);
    this.add.text(24, 295, 'Energy missiles', textStyle);

    //player keyboard controls text
    this.add.text(24, 325, 'Keyboard Controls', headingStyle);
    this.add.text(24, 350, 'energy Weapon', textStyle);
    this.add.text(24, 375, 'Movement', textStyle);

    //player touch controls text
    this.add.text(24, 405, 'Touch Controls', headingStyle);
    this.add.text(24, 430, 'energy Weapon:   middle', textStyle);
    this.add.text(24, 455, 'Movement:   left and right ', textStyle);

    //player controls arrows    
    this.add.image(230, 347, 'arrow').setOrigin(0, 0).setScale(0.8).setAngle(90);
    this.add.image(160, 375, 'arrow').setOrigin(0, 0).setScale(0.8);
    this.add.image(200, 394, 'arrow').setOrigin(0, 0).setScale(0.8).setAngle(180);

    //menu button image and text
    const menuButton = this.add.image(75, 500, 'playBox').setOrigin(0, 0);
    menuButton.setInteractive();
    this.add.text(115, 515, 'Main Menu', textStyle);

    // menu button interactibity - sets / clears tint on hover / switches scenes on click
    menuButton.on('pointerover', () => menuButton.setTint(0x00FF00));
    menuButton.on('pointerout', () => menuButton.clearTint());
    menuButton.on('pointerdown', () => this.scene.switch('MainMenu'));
  }
}