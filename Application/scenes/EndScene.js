export default class EndScene extends Phaser.Scene {
  constructor() {
    super({ key: 'EndScene' });
  }
  init(data) {
    // data passed over from previous scene
    this.destroyedAsteroids = data.destroyedAsteroids;
    this.energyUsage = data.energyUsage;
    this.level = data.level;
    this.score = data.score;

    // this.destroyedAsteroids = 30;
    // this.energyUsage = 300;
    // this.level = 10;
    // this.score = 2000;
  }

  preload() {
    // prepares (preloads) image that will be used within the scene
    this.load.image('achi_bg', 'assets/ui/darkPurple.png');
    this.load.image('black_bg', 'assets/ui/black.png');
    this.load.image('playBox', 'assets/ui/PlayButton.png');
    this.load.json('achievements', 'objects/achievements.json');
  }

  create() {
    // retrives json data file
    const achiData = this.cache.json.get('achievements');
    // style objects
    const headingStyle = { font: '20px KenVector Future', fill: '#ffffff' };
    const textStyle = { font: '16px KenVector Future', fill: '#ffffff' };
    // adds the page heading 
    const heading = this.add.text(0, 0, 'Achievements', headingStyle).setOrigin(0, 0);
    // page heading alignment
    heading.setPosition((this.cameras.main.width / 2) - heading.width / 2, 45).setDepth(5);

    const test = this.add.image(0, 0, 'black_bg').setOrigin(0, 0).setScale(1.5, 0.4).setDepth(4);
    const test2 = this.add.image(0, 480, 'black_bg').setOrigin(0, 0).setScale(1.5, 0.6).setDepth(4);
    test.setAlpha(1, 1, 0.8, 0.8);
    test2.setAlpha(0.8, 0.8, 1, 1);

    // Container creation
    const cont1 = this.add.container();
    const cont2 = this.add.container();
    const cont3 = this.add.container();
    const cont4 = this.add.container();
    const achievementsStorage = this.add.container()
    // condensed property names 
    const DA = this.destroyedAsteroids;
    const energy = this.energyUsage;
    const lvl = this.level;
    const score = this.score;
    // condensed data name - json path
    const asteroidData = achiData.asteroidAchievements;
    const energyData = achiData.energyAchievements;
    const levelData = achiData.levelAchievements;
    const scoreData = achiData.scoreAchievements;

    // parameters for different levels of achievements
    // Invokes the achi function for the structure
    // invokes dataCall function within for the json data
    // container entered

    // Asteroid Achievements
    if (DA >= 10 && DA < 30) achi.call(this, dataCall(asteroidData, 1), cont1);
    else if (DA >= 30 && DA < 50) achi.call(this, dataCall(asteroidData, 2), cont1);
    else if (DA >= 50 && DA < 75) achi.call(this, dataCall(asteroidData, 3), cont1);
    else if (DA >= 75) achi.call(this, dataCall(asteroidData, 4), cont1);
    // Energy Achievements
    if (energy >= 100 && energy < 200) achi.call(this, dataCall(energyData, 1), cont2);
    else if (energy >= 200 && energy < 300) achi.call(this, dataCall(energyData, 2), cont2);
    else if (energy >= 300 && energy < 400) achi.call(this, dataCall(energyData, 3), cont2);
    else if (energy >= 500) achi.call(this, dataCall(energyData, 4), cont2);
    // Level Achievements
    if (lvl >= 5 && lvl < 10) achi.call(this, dataCall(levelData, 1), cont3);
    else if (lvl >= 10 && lvl < 15) achi.call(this, dataCall(levelData, 2), cont3);
    else if (lvl >= 15 && lvl < 20) achi.call(this, dataCall(levelData, 3), cont3);
    else if (lvl >= 20) achi.call(this, dataCall(levelData, 4), cont3);
    // Score Achievements
    if (score >= 1000 && score < 2000) achi.call(this, dataCall(scoreData, 1), cont4);
    else if (score >= 2000 && score < 3000) achi.call(this, dataCall(scoreData, 2), cont4);
    else if (score >= 3000 && score < 4000) achi.call(this, dataCall(scoreData, 3), cont4);
    else if (score >= 4000) achi.call(this, dataCall(scoreData, 4), cont4);

    // takes in a jsonData object and the number of an object, returns an array for level, title, and details 
    function dataCall(jsonData, i) {
      const achievement = jsonData[i]
      return [achievement.level, achievement.title, achievement.details];
    }

    // creates the structure of an achievement , 
    // images and text, adds everything to a container
    // adds alignments 
    function achi([lvl, tit, dets], container) {
      achievementsStorage.add(container);
      const bg = this.add.image(0, 0, 'achi_bg').setOrigin(0, 0).setScale(1, 0.5);
      const level = this.add.text(0, 0, `Level: ${lvl}`, textStyle).setOrigin(0, 0);
      const title = this.add.text(0, 0, tit, textStyle).setOrigin(0, 0);
      const details = this.add.text(0, 0, dets, textStyle).setOrigin(0, 0);
      details.setAlign('center');
      container.add(bg);
      container.add(title);
      container.add(details);
      container.add(level);
      title.setPosition((bg.width / 2) - (title.displayWidth / 2), 5);
      details.setPosition((bg.width / 2) - (details.displayWidth / 2), (bg.height / 4) - details.height / 2);
      level.setPosition((bg.width / 2) - (level.displayWidth / 2), (bg.height / 2) - level.height - 5);
    }

    const cont = achievementsStorage.list
    const centerX = this.cameras.main.width / 2;
    console.log(centerX);
    achievementsStorage.setPosition(45, 100);
    let padding = 0;
    for (let i = 0; i < cont.length; i++) {
      cont[i].setPosition(0, padding);
      padding += 140;
    };
    achievementsStorage

    this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
      achievementsStorage.x += deltaX * 0.2;
      achievementsStorage.y += deltaY * 0.2;
    });





    // creates menu button - adds interactive events
    // starts the next scene and stops the current one
    const menuButton = this.add.image(75, 500, 'playBox').setOrigin(0, 0).setInteractive().setDepth(4);
    this.add.text(115, 515, 'Main Menu', textStyle).setDepth(5);
    menuButton.on('pointerover', () => menuButton.setTint(0x00FF00));
    menuButton.on('pointerout', () => menuButton.clearTint());
    menuButton.on('pointerdown', () => {
      this.scene.start('MainMenu');
      this.scene.stop('EndScene');
    });
  }
}