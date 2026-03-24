import { Game } from "./game/Game";

const game = new Game();

game.start();
game.move("e2", "e4");
game.move("d7", "d5");
game.move("d1", "g4");
game.move("c8", "g4");
game.move("e1", "e2");

console.log("Game History: ");
console.log(game.moveHistory);

console.log("Board State: ");
game.board.print();
