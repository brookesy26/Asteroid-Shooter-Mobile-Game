// scene imports
import MainMenu from "./scenes/MenuScene.js";
import GameScene from "./scenes/GameScene.js";
import EndScene from "./scenes/EndScene.js";
import HowToPlay from "./scenes/HowToPlay.js";

// game config object 
const config =
{
  type: Phaser.AUTO,
  width: 340,
  height: 600,
  transparent: true,
  parent: 'body',
  physics: {
    default: 'matter',
    matter: {
      debug: false,
      gravity: {
        x: 0,
        y: 0
      },
    }
  },
  scene: [MainMenu, HowToPlay, GameScene, EndScene]
};

const game = new Phaser.Game(config);


