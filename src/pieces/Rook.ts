import { Board } from "../board/Board";
import { Position, Piece, Color } from "../pieces/Piece";

export class Rook extends Piece {
    constructor(color: Color, position: Position) {
        super("rook", color, position);
    }


    getLegalMoves(board: Board): Position[] {
        const moves: Position[] = [];
        const { row, col } = this.position;
        const directions: Position[] = [
            { row: -1, col: 0 },
            { row: 1, col: 0 },
            { row: 0, col: -1 },
            { row: 0, col: 1 }
        ];


        for (const offset of directions) {
            let target: Position = {
                row: row + offset.row,
                col: col + offset.col
            };

            while (board.isWithinBounds(target)) {
                const pieceAtTarget = board.getPiece(target);

                if (!pieceAtTarget) {
                    moves.push({ row: target.row, col: target.col });
                } else {
                    if (pieceAtTarget.color !== this.color) {
                        moves.push({ row: target.row, col: target.col });
                    }
                    break;
                }

                target = {
                    row: target.row + offset.row,
                    col: target.col + offset.col
                };
            }
        }

        return moves;
    }
}
