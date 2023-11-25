export default class MainMenu extends Phaser.Scene {
  constructor() {
    super({ key: 'MainMenu' });
    this.modeSelected = 'normal';
  }

  preload() {
    // Load assets for UI mainMenu screen
    this.load.image('bg', 'assets/ui/black.png');
    this.load.image('headingBox', 'assets/ui/HeadingBackground.png');
    this.load.image('playBox', 'assets/ui/PlayButton.png');
    this.load.image('arrow', 'assets/ui/arrow.png');
  }

  create() {
    //text styles
    const headingStyle = {
      font: '16px KenVector Future',
      fill: '#E86A17'
    };

    const textStyle = {
      font: '16px KenVector Future',
      fill: '#ffffff'
    };

    //difficulty image and text
    this.add.text(110, 320, 'difficulty', headingStyle);

    this.easyMode = this.add.image(120, 350, 'playBox')
      .setScale(0.5, 0.6)
      .setOrigin(0, 0)
      .setInteractive();

    const easyText = this.add.text(140, 355, 'Easy', textStyle)
      .setOrigin(0, 0);

    this.normalMode = this.add.image(120, 385, 'playBox')
      .setScale(0.5, 0.6)
      .setOrigin(0, 0)
      .setInteractive()
      .setTint(0x00FF00);

    this.normalText = this.add.text(130, 390, 'Normal', textStyle)
      .setOrigin(0, 0);

    this.hardMode = this.add.image(120, 420, 'playBox')
      .setScale(0.5, 0.6)
      .setOrigin(0, 0)
      .setInteractive();

    const hardText = this.add.text(140, 425, 'Hard', textStyle)
      .setOrigin(0, 0);

    selectMode.call(this, this.easyMode, 'easy');
    selectMode.call(this, this.normalMode, 'normal');
    selectMode.call(this, this.hardMode, 'hard');

    //how to -  button and text
    const howToPlayButton = this.add.image(70, 465, 'headingBox')
      .setOrigin(0, 0)
      .setInteractive();

    const howToPlayText = this.add.text(100, 479, 'how to play', headingStyle);

    //Start Game image and text
    const play = this.add.image(70, 530, 'playBox')
      .setOrigin(0, 0)
      .setInteractive();

    this.add.text(130, 543, 'Start', textStyle)
      .setOrigin(0, 0);

    //How to button interactivity 
    howToPlayButton.on('pointerover', () => {
      howToPlayButton.setTint(0xE86A17);
      howToPlayText.setColor('#ffffff');
    });

    howToPlayButton.on('pointerout', () => {
      howToPlayButton.clearTint();
      howToPlayText.setColor('#E86A17');
    });

    howToPlayButton.on('pointerdown', () => this.scene.switch('HowToPlay'));
    //play button interactivity 
    play.on('pointerover', () => play.setTint(0x00FF00));
    play.on('pointerout', () => play.clearTint());
    play.on('pointerdown', () => {
      this.scene.start('GameScene', this.modeSelected);
      this.scene.stop('MainMenu');
    });
  };
}
function selectMode(modeButton, mode) {
  modeButton.on('pointerdown', () => {
    this.easyMode.clearTint();
    this.normalMode.clearTint();
    this.hardMode.clearTint();
    modeButton.setTint(0x00FF00);
    this.modeSelected = mode;
    console.log(mode);
  });
}
