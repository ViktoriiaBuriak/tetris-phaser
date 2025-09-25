import {Scene} from "phaser";

export default class Preloader extends Scene {
    constructor() {
        super('Preloader');
    }

    preload() {
        this.load.image('background', 'assets/back_2.jpg');
        this.load.spritesheet('block', 'assets/block.png', {
            frameWidth: 64,
            frameHeight: 64
        });
    }

    create() {
        this.scene.start('Game');
    }
}