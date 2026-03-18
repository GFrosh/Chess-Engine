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

        if (board.isWithinBounds(oneStep) && !board.getPiece(oneStep)) {
        moves.push(oneStep);

        // 2 steps from starting position
        const startingRow = this.color === "white" ? 6 : 1;

        if (row === startingRow) {
            const twoStep = { row: row + 2 * direction, col };

            if (board.isWithinBounds(twoStep) && !board.getPiece(twoStep)) {
            moves.push(twoStep);
            }
        }
        }

        const diagonalLeft = { row: row + direction, col: col - 1 };
        const diagonalRight = { row: row + direction, col: col + 1 };

        const diagonalTargets = [diagonalLeft, diagonalRight];

        for (const target of diagonalTargets) {
            if (!board.isWithinBounds(target)) {
                continue;
            }

            const piece = board.getPiece(target);

            if (piece && piece.color !== this.color) {
                moves.push(target);
            }
        }

        return moves;
    }
}
