import { Board } from "../board/Board";
import { PieceType } from "../types/pieceType";

const PIECE_VALUES: Record<PieceType, number> = {
	pawn: 100,
	knight: 320,
	bishop: 330,
	rook: 500,
	queen: 900,
	king: 20000,
};

// Piece-square tables (from White's perspective; row 0 = rank 8, row 7 = rank 1).
// Black pieces use the vertically-mirrored row index so each side's table is
// equivalent from their own point of view.

const PAWN_TABLE: number[][] = [
	[  0,  0,  0,  0,  0,  0,  0,  0],
	[ 50, 50, 50, 50, 50, 50, 50, 50],
	[ 10, 10, 20, 30, 30, 20, 10, 10],
	[  5,  5, 10, 25, 25, 10,  5,  5],
	[  0,  0,  0, 20, 20,  0,  0,  0],
	[  5, -5,-10,  0,  0,-10, -5,  5],
	[  5, 10, 10,-20,-20, 10, 10,  5],
	[  0,  0,  0,  0,  0,  0,  0,  0],
];

const KNIGHT_TABLE: number[][] = [
	[-50,-40,-30,-30,-30,-30,-40,-50],
	[-40,-20,  0,  0,  0,  0,-20,-40],
	[-30,  0, 10, 15, 15, 10,  0,-30],
	[-30,  5, 15, 20, 20, 15,  5,-30],
	[-30,  0, 15, 20, 20, 15,  0,-30],
	[-30,  5, 10, 15, 15, 10,  5,-30],
	[-40,-20,  0,  5,  5,  0,-20,-40],
	[-50,-40,-30,-30,-30,-30,-40,-50],
];

const BISHOP_TABLE: number[][] = [
	[-20,-10,-10,-10,-10,-10,-10,-20],
	[-10,  0,  0,  0,  0,  0,  0,-10],
	[-10,  0,  5, 10, 10,  5,  0,-10],
	[-10,  5,  5, 10, 10,  5,  5,-10],
	[-10,  0, 10, 10, 10, 10,  0,-10],
	[-10, 10, 10, 10, 10, 10, 10,-10],
	[-10,  5,  0,  0,  0,  0,  5,-10],
	[-20,-10,-10,-10,-10,-10,-10,-20],
];

const ROOK_TABLE: number[][] = [
	[  0,  0,  0,  0,  0,  0,  0,  0],
	[  5, 10, 10, 10, 10, 10, 10,  5],
	[ -5,  0,  0,  0,  0,  0,  0, -5],
	[ -5,  0,  0,  0,  0,  0,  0, -5],
	[ -5,  0,  0,  0,  0,  0,  0, -5],
	[ -5,  0,  0,  0,  0,  0,  0, -5],
	[ -5,  0,  0,  0,  0,  0,  0, -5],
	[  0,  0,  0,  5,  5,  0,  0,  0],
];

const QUEEN_TABLE: number[][] = [
	[-20,-10,-10, -5, -5,-10,-10,-20],
	[-10,  0,  0,  0,  0,  0,  0,-10],
	[-10,  0,  5,  5,  5,  5,  0,-10],
	[ -5,  0,  5,  5,  5,  5,  0, -5],
	[  0,  0,  5,  5,  5,  5,  0, -5],
	[-10,  5,  5,  5,  5,  5,  0,-10],
	[-10,  0,  5,  0,  0,  0,  0,-10],
	[-20,-10,-10, -5, -5,-10,-10,-20],
];

const KING_TABLE: number[][] = [
	[-30,-40,-40,-50,-50,-40,-40,-30],
	[-30,-40,-40,-50,-50,-40,-40,-30],
	[-30,-40,-40,-50,-50,-40,-40,-30],
	[-30,-40,-40,-50,-50,-40,-40,-30],
	[-20,-30,-30,-40,-40,-30,-30,-20],
	[-10,-20,-20,-20,-20,-20,-20,-10],
	[ 20, 20,  0,  0,  0,  0, 20, 20],
	[ 20, 30, 10,  0,  0, 10, 30, 20],
];

const PIECE_SQUARE_TABLES: Record<PieceType, number[][]> = {
	pawn: PAWN_TABLE,
	knight: KNIGHT_TABLE,
	bishop: BISHOP_TABLE,
	rook: ROOK_TABLE,
	queen: QUEEN_TABLE,
	king: KING_TABLE,
};

export class Evaluator {
	/**
	 * Evaluates the board position from White's perspective.
	 * Positive values favour White; negative values favour Black.
	 * Combines material value with piece-square positional bonuses.
	 */
	static evaluate(board: Board): number {
		let score = 0;

		for (let row = 0; row < board.size; row++) {
			for (let col = 0; col < board.size; col++) {
				const piece = board.getPiece({ row, col });
				if (!piece) {
					continue;
				}

				const pieceValue = PIECE_VALUES[piece.type];
				const table = PIECE_SQUARE_TABLES[piece.type];
				// Mirror the row for Black so the table is from each side's own perspective
				const tableRow = piece.color === "white" ? row : 7 - row;
				const positionalBonus = table[tableRow][col];

				if (piece.color === "white") {
					score += pieceValue + positionalBonus;
				} else {
					score -= pieceValue + positionalBonus;
				}
			}
		}

		return score;
	}
}
