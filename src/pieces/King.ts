import { Board } from "../board/Board";
import { Piece, Position, Color } from "./Piece";

export class King extends Piece {
    constructor(color: Color, position: Position) {
        super("king", color, position);
    }


    getLegalMoves(board: Board): Position[] {
        const moves: Position[] = [];
        const { row, col } = this.position;
        const directions: Position[] = [
            { row: row - 1, col },
            { row: row + 1, col },
            { row, col: col - 1 },
            { row, col: col + 1 },
            { row: row - 1, col: col - 1 },
            { row: row - 1, col: col + 1 },
            { row: row + 1, col: col + 1 },
            { row: row + 1, col: col - 1 }
        ];

        for (const direction of directions) {
            const targetSpot: Piece | null = board.getPiece(direction);
            if (board.isWithinBounds(direction)) {
				if ((targetSpot?.color !== this.color) || !targetSpot) {
					moves.push(direction);
				}
            }
        }
        return moves;
    }
}
