import { Game } from "./game/Game";

const game = new Game();
const parser = (obj: object) => {
    return JSON.stringify(obj);
}

game.start();

game.move("e2", "e4");
game.move("e7", "e5");

console.log("Game History: ");
console.log(parser(game.moveHistory));

console.log("Current Board State: ");
console.log(parser(game.board));

console.log("Current Grid: ");
console.log(parser(game.board.grid));
