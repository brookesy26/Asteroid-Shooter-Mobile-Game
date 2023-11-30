export default class MainMenu extends Phaser.Scene {
  constructor() {
    //scene key
    super({ key: 'MainMenu' });
  }
  init() {
    //mode default set to normal
    this.modeSelected = 'normal';
  }

  preload() {
    // Load assets for UI mainMenu screen
    this.load.image('purple_bg', 'assets/ui/darkPurple.png');
    this.load.image('headingBox', 'assets/ui/HeadingBackground.png');
    this.load.image('playBox', 'assets/ui/PlayButton.png');
  }

  create() {
    //text style objects
    const headingStyle = {
      font: '16px gameFont',
      fill: '#E86A17'
    };

    const textStyle = {
      font: '16px gameFont',
      fill: '#ffffff'
    };
    //background repeating image 
    this.add.tileSprite(0, 0, 800, 600, 'purple_bg').setOrigin(0, 0);

    //difficulty images and text
    this.add.text(110, 320, 'difficulty', headingStyle);
    this.easyMode = this.add.image(120, 350, 'playBox').setScale(0.5, 0.6).setOrigin(0, 0).setInteractive();
    const easyText = this.add.text(140, 355, 'Easy', textStyle).setOrigin(0, 0);
    this.normalMode = this.add.image(120, 385, 'playBox').setScale(0.5, 0.6).setOrigin(0, 0).setInteractive().setTint(0x00FF00);
    this.normalText = this.add.text(130, 390, 'Normal', textStyle).setOrigin(0, 0);
    this.hardMode = this.add.image(120, 420, 'playBox').setScale(0.5, 0.6).setOrigin(0, 0).setInteractive();
    const hardText = this.add.text(140, 425, 'Hard', textStyle).setOrigin(0, 0);

    //runs the selectMode functions
    this.selectMode.call(this, this.easyMode, 'easy');
    this.selectMode.call(this, this.normalMode, 'normal');
    this.selectMode.call(this, this.hardMode, 'hard');

    //how to play button and text
    const howToPlayButton = this.add.image(70, 465, 'headingBox').setOrigin(0, 0).setInteractive();
    const howToPlayText = this.add.text(100, 479, 'how to play', headingStyle);

    // Sart Game image and text
    const play = this.add.image(70, 530, 'playBox').setOrigin(0, 0).setInteractive();
    this.add.text(136, 543, 'Start', textStyle).setOrigin(0, 0);

    // How to play button interactivity
    // sets tint and color - on hover
    howToPlayButton.on('pointerover', () => {
      howToPlayButton.setTint(0xE86A17);
      howToPlayText.setColor('#ffffff');
    });

    /// clears tint and color - on pointer out
    howToPlayButton.on('pointerout', () => {
      howToPlayButton.clearTint();
      howToPlayText.setColor('#E86A17');
    });

    // switches scenes - sleeps this one and starts the next - on click
    howToPlayButton.on('pointerdown', () => {
      const elem = document.getElementById("game-container");
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
        this.scene.switch('HowToPlay');
      }
    });


    // play button interactivity
    // sets tint - hover
    play.on('pointerover', () => play.setTint(0x00FF00));

    // clears tint - hover
    play.on('pointerout', () => play.clearTint());

    // starts next scene / stops this one - on click
    play.on('pointerdown', () => {
      this.scene.start('GameScene', this.modeSelected);
      this.scene.stop('MainMenu');
    });
  };

  // select mode function - takes in game mode selected and which button was clicked
  // on click event - clears tints / adds tint to selected button / sets the selected mode
  selectMode(modeButton, mode) {
    modeButton.on('pointerdown', () => {
      this.easyMode.clearTint();
      this.normalMode.clearTint();
      this.hardMode.clearTint();
      modeButton.setTint(0x00FF00);
      this.modeSelected = mode;
      console.log(mode);
    });
  }
}

