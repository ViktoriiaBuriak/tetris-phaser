import Preloader from "./scenes/Preloader";
import Game from "./scenes/Game";
import { GameOver } from "./scenes/GameOver";

const config = {
  type: Phaser.AUTO,
  width: 778,
  height: 880,
  parent: "game-container",
  backgroundColor: "#838586ff",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false, 
    },
  },
  scene: [Preloader, Game, GameOver],
};

export default new Phaser.Game(config);
