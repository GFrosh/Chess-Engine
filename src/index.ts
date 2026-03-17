import { Game } from "./game/Game";

const game = new Game();

game.start();

game.move("e2", "e4"); // ✅ valid
game.move("e7", "e5"); // ✅ valid

// game.move("e4", "e6"); // ❌ should throw an error (illegal move)
console.log(game);
