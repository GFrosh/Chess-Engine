import { Board } from "../board/Board";
import { Piece, Position, Color } from "./Piece";

export class King extends Piece {
    constructor(color: Color, position: Position) {
        super("king", color, position);
    }


    getLegalMoves(_board: Board): Position[] {
        const moves: Position[] = [];
        return moves;
    }
}