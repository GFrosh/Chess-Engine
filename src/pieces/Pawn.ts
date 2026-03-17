import { Piece, Position, Color } from "./Piece";
import { Board } from "../board/Board";

export class Pawn extends Piece {
    constructor(color: Color, position: Position) {
        super("pawn", color, position);
    }

    getLegalMoves(board: Board): Position[] {
        const moves: Position[] = [];

        const direction = this.color === "white" ? -1 : 1;

        const { row, col } = this.position;

        // 1 step forward
        const oneStep = { row: row + direction, col };

        if (!board.getPiece(oneStep)) {
        moves.push(oneStep);

        // 2 steps from starting position
        const startingRow = this.color === "white" ? 6 : 1;

        if (row === startingRow) {
            const twoStep = { row: row + 2 * direction, col };

            if (!board.getPiece(twoStep)) {
            moves.push(twoStep);
            }
        }
        }

        return moves;
    }
}
