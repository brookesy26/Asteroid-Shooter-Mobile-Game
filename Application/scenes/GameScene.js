// import classes to be used
import Ship from '../objects/ship.js';
import Weapon from '../objects/weapon.js';
import Asteroid from '../objects/asteroid.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }
  init(data) {
    // data from previous scene
    // Dependent on difficulty 
    this.modeSelected = data;
    this.gameModeSelected;

    //game mode objects 
    this.easyObject = {
      fireSpeed: 100,
      velocity: 0.9,
      timeDelay: 1000,
      energyRegen: 0.08,
      weaponEnergyCost: 2.5,
      thrustEnergyCost: 0.09,
      thrustSpeed: 0.05,
    };
    this.normalObject = {
      fireSpeed: 150,
      velocity: 1,
      timeDelay: 700,
      energyRegen: 0.05,
      weaponEnergyCost: 3,
      thrustEnergyCost: 0.1,
      thrustSpeed: 0.09,
    };
    this.hardObject = {
      fireSpeed: 200,
      velocity: 1.5,
      timeDelay: 600,
      energyRegen: 0.5,
      weaponEnergyCost: 5,
      thrustEnergyCost: 1,
      thrustSpeed: 0.09,
    };

    //Achievement stats
    this.energyUsageTracking = 0;
    this.playerLevel = 1;
    this.playerScore = 0;
    this.asteroidsDestroyed = 0;

    // game variables 
    this.energy = 100;
    this.levelText;
    this.scoreText;
    this.playerShip;
    this.controls;
    this.rocks = [];
    this.timePast = 0;
    this.energyMeter;
    this.scoreCheck = 0;
    this.timing;

    // text objects
    this.GameOver = { font: '32px gameFont', fill: '#E86A17' };
    this.textStyle = { font: '16px gameFont', fill: '#ffffff' };

  }

  preload() {
    // Load assets
    this.load.image('purple_bg', 'assets/ui/darkPurple.png');
    this.load.image('ship', 'assets/GameObjects/Ship_270.png');
    this.load.image('red', 'assets/GameObjects/red_particle.png');
    this.load.image('rocket', 'assets/GameObjects/weaponLevel1.png');
    this.load.image('bolt', 'assets/GameObjects/EnergyMeter.png');
    this.load.image('energyBar', 'assets/ui/energyBar.png');
    this.load.image('smallMet', 'assets/GameObjects/SmallMet.png')
    this.load.image('largeMet', 'assets/GameObjects/LargeMet.png')
    this.load.image('arrow', 'assets/ui/arrow.png');
  }

  create() {
    // Game mode selection statment
    switch (this.modeSelected) {
      case 'easy':
        this.gameModeSelected = this.easyObject;
        break;
      case 'normal':
        this.gameModeSelected = this.normalObject;
        break;
      case 'hard':
        this.gameModeSelected = this.hardObject;
        break;
    }
    // logging game mode
    console.log(`the game mode has been changed to ${this.modeSelected}`);
    // world bounding walls - left, right, top, bottom
    this.matter.world.setBounds(0, 0, 340, 600, 64, true, true, false, false);

    // world dimensions
    const gameHeight = this.game.config.height;
    const gameWidth = this.game.config.width;

    // background repating image
    this.add.tileSprite(0, 0, 800, 600, 'purple_bg').setOrigin(0, 0);

    // score and levels
    this.scoreText = this.add.text(10, 10, `Score: 0`, this.textStyle);
    this.levelText = this.add.text(10, 30, `L 1`, this.textStyle);

    // energy level 
    this.energyMeter = this.add.image(30, gameHeight - 14, 'energyBar').setOrigin(0, 0);

    // energy border 
    const energyBorder = this.add.graphics();
    energyBorder.lineStyle(2, 0xffffff, 0.7);
    energyBorder.strokeRoundedRect(30, gameHeight - 15, 300, 10, 5);

    // energy image
    this.add.image(5, gameHeight - 19, 'bolt').setScale(0.5).setOrigin(0, 0)

    //Player sprite - from ship class
    this.playerShip = new Ship(
      this.matter.world,
      gameWidth / 2,
      gameHeight - 35,
      'ship',
      'red',
    ).setDepth(10);

    //Ship Collision detection - if ship hits wall log it, else (hits a asteroid) end the game
    // removes the specific rock the ship collided with / runs end game function
    this.playerShip.setOnCollide((collisionData) => {
      if (collisionData.bodyA.gameObject === null) {
        console.log('wall collision')
      } else {
        const rock = collisionData.bodyB.gameObject;
        rock.setActive(false);
        rock.setVisible(false);
        rock.world.remove(rock.body, true);
        this.endGame();
      }
    });

    // touch control areas for detection, left, right, middle
    const touchRight = this.add.image(250, 0, 'purple_bg').setOrigin(0, 0).setDepth(-1).setInteractive().setScale(1, 3);
    const touchLeft = this.add.image(-170, 0, 'purple_bg').setOrigin(0, 0).setDepth(-1).setInteractive().setScale(1, 3);
    const touchMiddle = this.add.image(85, 0, 'purple_bg').setOrigin(0, 0).setDepth(-2).setInteractive().setScale(0.7, 3);
    // input event for pointer down (works same for touch)
    // adds time event with a small delay to repeat the callback function while pointer is down
    touchRight.on('pointerdown', () => {
      if (this.energy > 0) {
        this.thrustEvent = this.time.addEvent({
          callback: this.rightControl,
          delay: 5,
          callbackScope: this,
          loop: true
        });
      }
    });

    // removes the time event on pointer up
    touchRight.on('pointerup', () => { if (this.thrustEvent) this.thrustEvent.destroy() });

    // input event for pointer down (works same for touch)
    // adds time event with a small delay to repeat the callback function while pointer is down
    touchLeft.on('pointerdown', () => {
      if (this.energy > 0) {
        this.thrustEvent = this.time.addEvent({
          callback: this.leftControl,
          delay: 5,
          callbackScope: this,
          loop: true
        });
      }
    })

    // removes the time event on pointer up
    touchLeft.on('pointerup', () => { if (this.thrustEvent) this.thrustEvent.destroy() });

    // input event for pointer down on middle of screen
    // runs through the process of weapon fire, collision, and updates
    // checks the current time against the time that has past for fire rate control
    touchMiddle.on('pointerdown', () => {
      if (this.energy > 10 && this.playerShip.active) {
        if (this.time.now >= this.timePast) {
          const bullet = this.bulletCreation();
          this.firingBullet(bullet);
          this.weaponFireUsage();
          this.bulletCollision(bullet);
          this.timePast = this.time.now + this.gameModeSelected.fireSpeed;
        }
      }
    });

    // creates the key controlls and enables them
    this.controls = this.input.keyboard.addKeys('UP,LEFT,RIGHT');
    this.input.keyboard.enabled = true;

    // Event Emmitter setup - runs the default handler function on game start
    var emitter = new Phaser.Events.EventEmitter();
    emitter.on('level1', this.handler, this);
    emitter.emit('level1', this.gameModeSelected.timeDelay);
  };

  // energy meter adjustments based on consumption of thrust
  thrustUsage() {
    this.energy -= this.gameModeSelected.thrustEnergyCost;
    this.energyMeter.scaleX = this.energy / 100;
    this.energyUsageTracking += this.gameModeSelected.thrustEnergyCost;
  };

  // energy meter adjustments based on consumption of weapon
  weaponFireUsage() {
    this.energy -= this.gameModeSelected.weaponEnergyCost;
    this.energyMeter.scaleX = this.energy / 100;
    this.energyUsageTracking += this.gameModeSelected.weaponEnergyCost;
  };

  // calls thrust left
  leftControl() {
    this.playerShip.thrustLeft(this.gameModeSelected.thrustSpeed);
  };

  // calls thrust right
  rightControl() {
    this.playerShip.thrustRight(this.gameModeSelected.thrustSpeed);
  };

  // creates a new weapon object ands returns it
  bulletCreation() {
    const bullet = new Weapon(this.matter.world, this.playerShip.x, this.playerShip.y, 'rocket');
    console.log('bullet Created');
    return bullet;
  };

  // takes in the collision item to be tested, runs the collision detection for missiles and asteroids colliding
  // calls usedBullets to destroy the given bullet
  // removes the asteroid from the world
  // explodes the bullets emmiter
  // updates score, score text, and amount of asteroids destroyed
  // calls level up conditions to determin if the player has gained enough poits to level up
  bulletCollision(bullet) {
    bullet.setOnCollide((collisionDataObject) => {
      const missile = collisionDataObject.bodyA.gameObject;
      const asteroid = collisionDataObject.bodyB.gameObject;
      this.usedBullet(missile);
      asteroid.setActive(false);
      asteroid.setVisible(false);
      asteroid.world.remove(asteroid.body, true);
      bullet.emitter.explode(15, 0, 0);
      console.log('after');
      console.log(missile);
      this.scoreText.setText(`Score: ${this.playerScore += 10}`);
      this.asteroidsDestroyed += 1;
      this.levelUpConditions();
    });
  }

  // calls the weapon class fire function to fire the given bullet
  firingBullet(bullet) {
    bullet.fire(this.playerShip.x, this.playerShip.y - 20);
    console.log('fired');
  }

  // removes given item from the world
  usedBullet(item) {
    item.setActive(false);
    item.setVisible(false);
    item.world.remove(item.body, true);
  }

  // removes current time event
  // calls new time event with new delay
  // increases velocity of asteroids
  levelUpDifficulty() {
    this.timing.remove()
    this.handler(this.gameModeSelected.timeDelay -= 100);
    this.gameModeSelected.velocity += 0.1;
  };

  // Player level check for every time score goes over 100
  // level text update 
  // runs level up difficulty function every 5 levels up to 40
  levelUpConditions() {
    if (this.playerScore - this.scoreCheck >= 100) {
      this.levelText.setText(`L ${this.playerLevel += 1}`);
      this.scoreCheck = this.playerScore;
      switch (this.playerLevel) {
        case 5:
          this.levelUpDifficulty();
          break;
        case 10:
          this.levelUpDifficulty();
          break;
        case 15:
          this.levelUpDifficulty();
          break;
        case 20:
          this.levelUpDifficulty();
          break;
        case 25:
          this.levelUpDifficulty();
          break;
        case 30:
          this.levelUpDifficulty();
          break;
        case 40:
          this.levelUpDifficulty();
          break;
      }
    }
  }

  // time event handler
  handler(delay) {
    this.timing = this.time.addEvent({
      delay: delay,
      callback: this.newAsteroid,
      callbackScope: this,
      loop: true
    });
    return this.timing
  };

  // Create new Asteroid in random location between 20 - 320 above the top screen and adds them to an array
  newAsteroid() {
    let x = Phaser.Math.Between(20, 320);
    let rock;
    rock = new Asteroid(this.matter.world, x, -100, 'largeMet', this.gameModeSelected.velocity);
    this.rocks.push(rock);
  };

  // End Game function removes ship, explodes emitter, adds end game text / image
  endGame() {
    this.input.keyboard.enabled = false;
    this.playerShip.setActive(false);
    this.playerShip.setVisible(false);
    this.playerShip.world.remove(this.playerShip, true);
    this.playerShip.emitter.explode(5, 0, 0);
    this.add.text(65, 200, 'game over', this.GameOver).setDepth(1);
    const menuButton = this.add.image(80, 250, 'playBox').setOrigin(0, 0).setInteractive().setDepth(1);

    // Achievements button interactivity
    // hover - adds tint / removes on out
    this.add.text(100, 265, 'Achievements', this.textStyle).setDepth(1);
    menuButton.on('pointerover', () => menuButton.setTint(0x00FF00));
    menuButton.on('pointerout', () => menuButton.clearTint());

    // on click start the next scene and pass over these variables as an object
    menuButton.on('pointerdown', () => {
      this.scene.start('EndScene',
        {
          energyUsage: this.energyUsageTracking,
          level: this.playerLevel,
          destroyedAsteroids: this.asteroidsDestroyed,
          score: this.playerScore,
        }
      );
      // stop this scene
      this.scene.stop();
    });
  };

  update(time, delta) {
    // controls for movement and weapons
    // Movement right ->
    // energy bar consumption updates
    if (this.controls.RIGHT.isDown && this.energy > 0) {
      this.rightControl();
      this.thrustUsage();
    }

    // Movement left <-
    // energy bar consumption updates
    else if (this.controls.LEFT.isDown && this.energy > 0) {
      this.leftControl();
      this.thrustUsage();
    }

    // up key controls 
    // runs through the process of weapon fire, collision, and updates
    // checks the current time against the time that has past for fire rate control
    if (this.controls.UP.isDown && this.energy > 10 && this.playerShip.active) {
      if (this.time.now >= this.timePast) {
        const bullet = this.bulletCreation();
        this.firingBullet(bullet);
        this.weaponFireUsage();
        this.bulletCollision(bullet);
        this.timePast = this.time.now + this.gameModeSelected.fireSpeed;
      }
    };

    // stops the energy bar from going above 100% (Scale 1)
    if (this.energy < 100) {
      this.energy += this.gameModeSelected.energyRegen;
      this.energyMeter.scaleX = this.energy / 100;
    }

    // Loops through asteroid array checking if any rock is below the botom wall (greater than y axis 600)
    // End asteroid spawn by stopping time event
    // Calls End Game function
    for (let i = 0; i < this.rocks.length; i++) {
      if (this.rocks[i].y > 600) {
        this.timing.remove();
        this.rocks = [];
        this.endGame();
      }
    }
  }
}
