import { Scene } from "phaser";

export class GameOver extends Scene {
  constructor() {
    super("GameOver");
  }

  create() {
    this.cameras.main.setBackgroundColor(0x7f0303);

    this.goMusic = this.sound.add("go");
    this.goMusic.play();

    this.add
      .text(this.scale.width / 2, this.scale.height / 2, "Game Over", {
        fontFamily: "Arial Black",
        fontSize: 64,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
      .setOrigin(0.5)
      .setInteractive({ cursor: "pointer" });

    this.input.once("pointerdown", () => {
      this.scene.start("Game");
    });
  }
}
