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
    this.score = 0;
  }

  create() {
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        board[r][c] = null;
      }
    }

    this.bg = this.add.image(0, 0, "background").setOrigin(0);

    this.bgMusic = this.sound.add("bg", {loop: true});
    this.bgMusic.play();

    this.displayWidth = this.bg.setDisplaySize(
      BLOCK_SIZE * COLS,
      BLOCK_SIZE * ROWS
    );

    this.cursors = this.input.keyboard.createCursorKeys();

    this.spawnShape();

    this.scoreText = this.add.text(484, 32, "Score: 0", {
      fontSize: "32px",
      fill: "#fff",
    });

    if (this.sys.game.device.input.touch) {
      let startX = 0;
      let startY = 0;

      this.input.on("pointerdown", (pointer) => {
        startX = pointer.x;
        startY = pointer.y;
      });

      this.input.on("pointerup", (pointer) => {
        const deltaX = pointer.x - startX;
        const deltaY = pointer.y - startY;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          if (deltaX > 50) {
            this.moveShape(1);
          } else if (deltaX < -50) {
            this.moveShape(-1);
          }
        } else {
          if (deltaY > 30) {
            this.currentShape.forEach((block) => (block.y += 20));
          } else if (Math.abs(deltaX) < 5 && Math.abs(deltaY) < 5) {
            this.rotateShape();
          }
        }
      });
    }
  }

  update() {
    if (!this.currentShape) return;

    if (this.canMoveDown()) {
      this.currentShape.forEach((block) => {
        block.y += 1;
      });
    } else {
      this.fixShape();
      this.clearFullRows();

      if (this.checkGameOver(board)) {
        this.bgMusic.stop();
        this.scene.start("GameOver");
      }
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

    if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
      this.rotateShape();
    }
  }

  // Обираємо випадкову фігуру з const SHAPE

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

  // Фіксуємо фігуру

  fixShape() {
    for (let block of this.currentShape) {
      const col = Math.floor(block.x / BLOCK_SIZE);
      const row = Math.floor(block.y / BLOCK_SIZE);
      board[row][col] = block;
    }
    this.currentShape = null;
  }

  // Перевіряємо, чи можна зрушити фігуру вліво/вправо

  moveShape(dir) {
    let canMove = true;

    for (let block of this.currentShape) {
      const col = Math.round(block.x / BLOCK_SIZE) + dir;
      const row = Math.round(block.y / BLOCK_SIZE);

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

  // Перевіряємо, чи можна опустити фігуру на 1 рядок вниз.

  canMoveDown() {
    for (let block of this.currentShape) {
      const col = Math.floor(block.x / BLOCK_SIZE);
      const row = Math.floor(block.y / BLOCK_SIZE);

      if (row + 1 >= ROWS) return false;

      if (board[row + 1][col] !== null) return false;
    }
    return true;
  }

  // Обертаємо фігуру

  rotateShape() {
    if (!this.currentShape) return;

    const pivot = this.currentShape[0];

    const newPosition = this.currentShape.map((block) => {
      const x = (block.x - pivot.x) / BLOCK_SIZE;
      const y = (block.y - pivot.y) / BLOCK_SIZE;

      const rotatedX = y;
      const rotatedY = -x;

      return {
        x: pivot.x + rotatedX * BLOCK_SIZE,
        y: pivot.y + rotatedY * BLOCK_SIZE,
      };
    });

    for (let pos of newPosition) {
      const col = Math.floor(pos.x / BLOCK_SIZE);
      const row = Math.floor(pos.y / BLOCK_SIZE);

      if (
        col < 0 ||
        col >= COLS ||
        row < 0 ||
        row >= ROWS ||
        (board[row] && board[row][col] !== null)
      ) {
        return;
      }
    }

    this.currentShape.forEach((block, i) => {
      block.x = newPosition[i].x;
      block.y = newPosition[i].y;
    });
  }

  // Очищуємо заповнені рядки

  clearFullRows() {
    for (let row = ROWS - 1; row >= 0; row--) {
      const isFull = board[row].every((cell) => cell !== null);

      if (isFull) {
        for (let col = 0; col < COLS; col++) {
          board[row][col].destroy();
          board[row][col] = null;
        }

        for (let r = row - 1; r >= 0; r--) {
          for (let c = 0; c < COLS; c++) {
            const block = board[r][c];
            if (block) {
              block.y += BLOCK_SIZE;
              board[r + 1][c] = block;
              board[r][c] = null;
            }
          }
        }
        this.score += 10;
        this.scoreText.setText("Score: " + this.score);
        row++;
      }
    }
  }

  checkGameOver() {
    for (let col = 0; col < COLS; col++) {
      if (board[0][col] !== null) return true;
    }
    return false;
  }
}
