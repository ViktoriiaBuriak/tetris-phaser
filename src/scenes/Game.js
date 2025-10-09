import { Scene } from "phaser";
import { BLOCK_SIZE } from "../utils/constants";
import { COLS } from "../utils/constants";
import { ROWS } from "../utils/constants";
import { SHAPES } from "../utils/shapes";
import { SHAPE_COLORS } from "../utils/shapes";
import { board } from "../utils/constants";

export default class Game extends Scene {
  constructor() {
    super("Game");
  }

  spawnShape() {
    const bgCenterX = this.bg.x + this.bg.displayWidth / 2;

    const startX = Math.floor(bgCenterX / BLOCK_SIZE) * BLOCK_SIZE;
    const startY = 0;

    const shapeNames = Object.keys(SHAPES);
    const randomName = Phaser.Utils.Array.GetRandom(shapeNames);
    const randomShape = SHAPES[randomName];

    const blocks = [];

    const frameIndex = SHAPE_COLORS[randomName];

    randomShape.forEach((part) => {
      const block = this.add
        .image(
          startX + part.x * BLOCK_SIZE,
          startY + part.y * BLOCK_SIZE,
          "block",
          frameIndex
        )
        .setOrigin(0);
      blocks.push(block);
    });

    this.currentShape = blocks;
  }

  fixShape() {
    for (let block of this.currentShape) {
      const col = Math.floor(block.x / BLOCK_SIZE);
      const row = Math.floor(block.y / BLOCK_SIZE);
      board[row][col] = block;
    }
    this.currentShape = null;
  }

  create() {
    this.bg = this.add.image(0, 0, "background").setOrigin(0);
    this.displayWidth = this.bg.setDisplaySize(
      BLOCK_SIZE * COLS,
      BLOCK_SIZE * ROWS
    );

    this.cursors = this.input.keyboard.createCursorKeys();

    this.spawnShape();
  }

  update() {
    if (!this.currentShape) return;

    if (this.canMoveDown()) {
      this.currentShape.forEach((block) => {
        block.y += 1;
      });
    } else {
      this.fixShape();
      this.spawnShape();
    }

    if (Phaser.Input.Keyboard.JustDown(this.cursors.left)) {
      this.moveShape(-1);
    }

    if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
      this.moveShape(1);
    }

    if (this.cursors.down.isDown) {
      this.currentShape.forEach((block) => (block.y += 5));
    }
  }

  moveShape(dir) {
    let canMove = true;

    for (let block of this.currentShape) {
      const col = Math.floor(block.x / BLOCK_SIZE) + dir;
      const row = Math.floor(block.y / BLOCK_SIZE);

      if (col < 0 || col >= COLS) {
        canMove = false;
        break;
      }

      if (board[row] && board[row][col] !== null) {
        canMove = false;
        break;
      }
    }

    if (canMove) {
      this.currentShape.forEach((block) => {
        block.x += dir * BLOCK_SIZE;
      });
    }
  }

  canMoveDown() {
    for (let block of this.currentShape) {
      const col = Math.floor(block.x / BLOCK_SIZE);
      const row = Math.floor(block.y / BLOCK_SIZE);

      if (row + 1 >= ROWS) return false;

      if (board[row + 1][col] !== null) return false;
    }
    return true;
  }
}
