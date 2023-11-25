import Ship from '../objects/ship.js';
import Weapon from '../objects/weapon.js';
import Asteroid from '../objects/asteroid.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }
  init(data) {
    // Dependent on difficulty 
    this.modeSelected = data;
    this.gameModeSelected;

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

    // other variables
    this.energy = 100;
    this.levelText;
    this.scoreText;
    this.playerShip;
    this.controls;
    this.missile;
    this.missileStorage = [];
    this.rocks = [];
    this.timePast = 0;
    this.energyMeter;
    this.missileAndAsteroidGroup;
    this.scoreCheck = 0;
    this.shipCollision = false;
    this.GameOver = { font: '32px KenVector Future', fill: '#E86A17' };
    this.textStyle = { font: '16px KenVector Future', fill: '#ffffff' };

    this.timing;
  }

  preload() {
    // Load assets
    this.load.image('black_bg', 'assets/ui/black.png');
    this.load.image('purple_bg', 'assets/ui/darkPurple.png');
    this.load.image('ship', 'assets/GameObjects/Ship_270.png');
    this.load.image('red', 'assets/GameObjects/red_particle.png');
    this.load.image('rocket', 'assets/GameObjects/weaponLevel1.png');
    this.load.image('bolt', 'assets/GameObjects/EnergyMeter.png');
    this.load.image('energyBar', 'assets/ui/energyBar.png');
    this.load.image('smallMet', 'assets/GameObjects/SmallMet.png')
    this.load.image('largeMet', 'assets/GameObjects/LargeMet.png')
  }

  create() {
    //difficulty object return function
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
    // console.log(`the game mode has been changed to ${this.modeSelected}`);

    const worldObj = this.matter.world.setBounds(0, 0, 340, 600, 64, true, true, false, false,);
    // console.log(worldObj);
    const gameHeight = this.game.config.height;
    const gameWidth = this.game.config.width;

    // Collision categories 
    this.missileAndAsteroidGroup = this.matter.world.nextCategory();
    //background
    this.add.tileSprite(0, 0, 800, 600, 'purple_bg').setOrigin(0, 0);
    //score and levels
    this.scoreText = this.add.text(10, 10, `Score: 0`, this.textStyle);
    this.levelText = this.add.text(10, 30, `L 1`, this.textStyle);

    //energy level 
    this.energyMeter = this.add.image(30, gameHeight - 14, 'energyBar').setOrigin(0, 0);

    //energy border 
    const energyBorder = this.add.graphics();
    energyBorder.lineStyle(2, 0xffffff, 0.7);
    energyBorder.strokeRoundedRect(30, gameHeight - 15, 300, 10, 5);

    //energy image
    this.add.image(5, gameHeight - 19, 'bolt').setScale(0.5).setOrigin(0, 0)

    //Player sprite - from ship class
    this.playerShip = new Ship(
      this.matter.world,
      gameWidth / 2,
      gameHeight - 35,
      'ship',
      'red',
    );
    //Ship Collision detection - if ship hits wall log it, else (hits a asteroid) end the game
    this.playerShip.setOnCollide((collisionData) => {
      // console.log(collisionData.bodyA.gameObject)
      if (collisionData.bodyA.gameObject === null) {
        // console.log('wall collision')
      } else {
        const ship = collisionData.bodyA.gameObject;
        const rock = collisionData.bodyB.gameObject;
        ship.setActive(false);
        ship.setVisible(false);
        ship.world.remove(this.playerShip, true);
        ship.emitter.explode(5, 0, 0);
        rock.setActive(false);
        rock.setVisible(false);
        rock.world.remove(rock.body, true);
        // Calls endGame
        this.endGame();
      }
    });

    //weapons
    for (let i = 0; i < 100; i++) {
      this.missile = new Weapon(
        this.matter.world,
        this.playerShip.x,
        this.playerShip.y,
        'rocket',
      );
      this.missileStorage.push(this.missile);
      //missile collision detection - if hits an asteroid
      this.missile.setOnCollide((collisionDataObject) => {
        // console.log(collisionDataObject.bodyA.gameObject)
        const missile = collisionDataObject.bodyA.gameObject;
        const asteroid = collisionDataObject.bodyB.gameObject;
        missile.setActive(false);
        missile.setVisible(false);
        missile.world.remove(missile.body, true);
        asteroid.setActive(false);
        asteroid.setVisible(false);
        asteroid.world.remove(asteroid.body, true);
        this.scoreText.setText(`Score: ${this.playerScore += 10}`);
        this.asteroidsDestroyed += 1;
        missile.emitter.explode(15, 0, 0);

        // Player level check
        // level text update 
        // velocity(asteroid speed) increase
        if (this.playerScore - this.scoreCheck >= 100) {
          this.levelText.setText(`L ${this.playerLevel += 1}`);
          this.scoreCheck = this.playerScore;
          switch (this.playerLevel) {
            case 5:
              this.timing.remove()
              this.handler(this.gameModeSelected.timeDelay -= 100);
              this.gameModeSelected.velocity += 0.1;
              break;
            case 10:
              this.timing.remove()
              this.handler(this.gameModeSelected.timeDelay -= 100);
              this.gameModeSelected.velocity += 0.1;
              break;
            case 15:
              this.timing.remove()
              this.handler(this.gameModeSelected.timeDelay -= 100);
              this.gameModeSelected.velocity += 0.1;
              break;
            case 20:
              console.log(this.gameModeSelected.timeDelay);
              this.timing.remove()
              this.handler(this.gameModeSelected.timeDelay -= 100);
              this.gameModeSelected.velocity += 0.1;
              break;
          }
        }
      })
    };


    const bottomWall = this.add.image(0, this.game.config.height, 'bg').setOrigin(0, 0).setScale(2, 0.2)

    //Phaser.Physics.Matter.Events.COLLISION_START
    //collision object has the pairs stores in an array
    this.matter.world.on('collisionstart', collisionObject => {
      const pairs = collisionObject.pairs;
      //loops through all pairs
      for (let i = 0; i < pairs.length; i++) {
        const bodyA = pairs[i].bodyA;
        const bodyB = pairs[i].bodyB;
        //ship id is 7
        //world bottom id === 6
        // console.log(bodyB);
        // console.log(bodyA);
        // console.log(worldObj);
        //error here - on second play bottom wall is not 6 ????? ERROR!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        if (bodyA.id === 6) {
          // console.log(bodyA.id);
          this.shipEnd = true;
          if (this.shipEnd === true) {
            // console.log(this.playerShip);
            this.playerShip.body.gameObject.setActive(false);
            this.playerShip.body.gameObject.setVisible(false);
            this.playerShip.body.gameObject.world.remove(this.playerShip, true)
            this.playerShip.emitter.stop();
          }
          // End Game
          this.endGame();
        }
      }
    });

    //creates the key contrrols
    this.controls = this.input.keyboard.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT');

    // Event Emmitter setup - used in time event
    var emitter = new Phaser.Events.EventEmitter();
    emitter.on('level1', this.handler, this);
    emitter.emit('level1', this.gameModeSelected.timeDelay);
  };

  // time event handler
  // calls asteroid function
  handler(delay) {
    this.timing = this.time.addEvent({
      delay: delay,
      callback: this.newAsteroid,
      callbackScope: this,
      loop: true
    });
    return this.timing
  }

  //Create new Asteroid
  newAsteroid() {
    let x = Phaser.Math.Between(20, 320);
    let rock;
    rock = new Asteroid(this.matter.world, x, -100, 'largeMet', this.gameModeSelected.velocity);
    rock.setBounce(0.8);
    this.rocks.push(rock);
  };

  // End Game
  endGame() {
    this.add.text(65, 200, 'game over', this.GameOver).setDepth(1);
    const menuButton = this.add.image(80, 250, 'playBox').setOrigin(0, 0).setInteractive().setDepth(1);
    this.add.text(100, 265, 'Achievements', this.textStyle).setDepth(1);
    menuButton.on('pointerover', () => menuButton.setTint(0x00FF00));
    menuButton.on('pointerout', () => menuButton.clearTint());
    menuButton.on('pointerdown', () => {
      this.scene.start('EndScene',
        {
          energyUsage: this.energyUsageTracking,
          level: this.playerLevel,
          destroyedAsteroids: this.asteroidsDestroyed,
          score: this.playerScore,
        }
      );
      this.scene.stop();
    });
  }

  update(time, delta) {
    // controls for movement and weapons
    // Movement right ->
    // energy consumption updates
    if (this.controls.RIGHT.isDown && this.energy > 0) {
      this.playerShip.thrustRight(this.gameModeSelected.thrustSpeed);
      this.energy -= this.gameModeSelected.thrustEnergyCost;
      this.energyMeter.scaleX = this.energy / 100;
      this.energyUsageTracking += this.gameModeSelected.thrustEnergyCost;
    }
    // Movement left <-
    // energy consumption updates
    else if (this.controls.LEFT.isDown && this.energy > 0) {
      this.playerShip.thrustLeft(this.gameModeSelected.thrustSpeed);
      this.energy -= this.gameModeSelected.thrustEnergyCost;
      this.energyMeter.scaleX = this.energy / 100;
      this.energyUsageTracking += this.gameModeSelected.thrustEnergyCost;
    }

    //when arrow up key is pressed and as long as energy is greater than 10 then a misile will fire
    //gets first missile in the array that is not active and returns the object
    // if there is an un-active missile,
    // and the current time is greater than the time past since the last fire 
    //accesses the fire function within the weapon class
    //reduces the energy per fire
    //adjusts the size of the energy bar to be between scale 0 and 1
    if (this.controls.UP.isDown && this.energy > 10 && this.playerShip.active) {
      const weaponObject = this.missileStorage.find(Missile => !Missile.active);
      if (weaponObject && time >= this.timePast) {
        weaponObject.fire(this.playerShip.x, this.playerShip.y - 20);
        this.timePast = time + this.gameModeSelected.fireSpeed;
        this.energy -= this.gameModeSelected.weaponEnergyCost;
        this.energyUsageTracking += this.gameModeSelected.weaponEnergyCost;
        this.energyMeter.scaleX = this.energy / 100;
      }
    }
    //stops the energy bar from going above 100% (Scale 1)
    if (this.energy < 100) {
      this.energy += this.gameModeSelected.energyRegen;
      this.energyMeter.scaleX = this.energy / 100;
    }
  }
}
