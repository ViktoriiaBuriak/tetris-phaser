import { Scene } from "phaser";

export default class Preloader extends Scene {
  constructor() {
    super("Preloader");
  }

  preload() {
    this.load.image("background", "assets/back.png");
    this.load.spritesheet("block", "assets/block.png", {
      frameWidth: 44,
      frameHeight: 44,
    });

    this.load.audio("bg", "sounds/tetris_sound.mp3");
    this.load.audio("go", "sounds/game_over.wav");
  }

  create() {
    this.scene.start("MainMenu");
  }
}
