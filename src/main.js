import Preloader from "./scenes/Preloader";
import Game from "./scenes/Game";

const config = {
  type: Phaser.AUTO,
  width: 1024,
  height: 768,
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
  scene: [Preloader, Game],
};

export default new Phaser.Game(config);
