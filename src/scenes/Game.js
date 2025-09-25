import { Scene } from "phaser";
import { SHAPES } from "../objects/shapes";
import { SHAPE_COLORS } from "../objects/shapes";

export default class Game extends Scene {
    constructor() {
        super('Game');
    }

    create() {
      const bg = this.add.image(0, 0, 'background').setOrigin(0); 
      bg.setDisplaySize(700, 800);

      this.spawnShape();
    }


    spawnShape() {
        const startX = 200;
        const startY = 0;

        const shapeNames = Object.keys(SHAPES);
        const randomName = Phaser.Utils.Array.GetRandom(shapeNames);
        const randomShape = SHAPES[randomName];

        const blocks = [];

        const frameIndex = SHAPE_COLORS[randomName];

        randomShape.forEach(part => {
            const block = this.add.image(
                startX + part.x * 64,
                startY + part.y * 64,
                'block',
                frameIndex
            ).setOrigin(0);
            blocks.push(block);
        });

        this.currentShape = blocks;
    }

    update() {
        if(!this.currentShape) return;

        let canMove = true;

        this.currentShape.forEach(block => {
            if (block.y + 64 >= this.game.config.height) {
                canMove = false;
            }
        })

        if (canMove) {
            this.currentShape.forEach(block => {
                block.y += 1;
            })
        } else {
            this.currentShape = null;

            this.spawnShape();
        }
        
    }
}