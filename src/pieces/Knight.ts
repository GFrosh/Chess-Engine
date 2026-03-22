import { Board } from "../board/Board";
import { Piece, Position, Color } from "./Piece";

export class Knight extends Piece {
    constructor(color: Color, position: Position) {
        super("knight", color, position);
    }

    getLegalMoves(board: Board): Position[] {
        const moves: Position[] = [];
        const { row, col } = this.position;
        const jumps: Position[] = [
            { row: row - 2, col: col - 1 },
            { row: row - 2, col: col + 1 },
            { row: row - 1, col: col - 2 },
            { row: row - 1, col: col + 2 },
            { row: row + 1, col: col - 2 },
            { row: row + 1, col: col + 2 },
            { row: row + 2, col: col - 1 },
            { row: row + 2, col: col + 1 }
        ];

        jumps.forEach((move) => {
            if (board.isWithinBounds(move) && (board.getPiece(move)?.color !== this.color)) {
                moves.push(move);
            }
        });

        return moves;
    }
}
