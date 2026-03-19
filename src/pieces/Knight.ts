import { Board } from "../board/Board";
import { Piece, Position, Color } from "./Piece";

export class Knight extends Piece {
    constructor(color: Color, position: Position) {
        super("knight", color, position);
    }

    getLegalMoves(board: Board): Position[] {
        const moves: Position[] = [];
        const direction: number = this.color === "white" ? -1 : 1;

        // STILL THINKING OF HOW TO IMPLEMENT A KNIGHT MOVEMENTS
        // KINDA COMPLEX THO




        return moves;
    }
}