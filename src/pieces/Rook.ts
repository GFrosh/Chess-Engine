import { Board } from "../board/Board";
import { Position, Piece, Color } from "../pieces/Piece";

export class Rook extends Piece {
    constructor(color: Color, position: Position) {
        super("rook", color, position);
    }


    getLegalMoves(_board: Board): Position[] {
        const moves: Position[] = [];
        const direction: number = this.color === "white" ? -1 : 1;
        const { row, col } = this.position;


        // POSSIBLE ROOK MOVES
        
        
        
        return moves;
    }
}