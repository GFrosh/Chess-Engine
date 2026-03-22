import { Game } from "./game/Game";

const game = new Game();

game.start();
game.move("e2", "e4");
game.move("d7", "d5");
game.move("e4", "d5");
game.move("b8", "c6");
game.move("d5", "c6");
game.move("a8", "f8");

console.log("Game History: ");
console.log(game.moveHistory);

console.log("Board State: ");
game.board.print();
