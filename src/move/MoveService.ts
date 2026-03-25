import { Board } from "../board/Board";
import { Piece } from "../pieces/Piece";
import { Move } from "./Move";


// Handles the execution of moves on the board and piece state
// Single source of truth for move execution logic
export class MoveService {
	
    // Execute a move: update board state AND piece internal state atomically
	static executeMove(board: Board, move: Move): Piece {
		
		// CONFIRM PIECE EXISTENCE
        const piece = board.getPiece(move.from);
		if (!piece) {
			throw new Error("Cannot execute move: no piece at source");
		}

		// CHECK IF MOVE IS A CAPTURE MOVE
		const captured: Piece | null = board.getPiece(move.to);
		if (captured) {
			captured.updateStatus();
		}


		// Update board state
		board.setSquare(move.to.row, move.to.col, piece);
		board.setSquare(move.from.row, move.from.col, null);

		// Update piece state
		piece.moveTo(move.to);
		return piece;
	}

	// Undo a move: restore board state AND piece internal state atomically
	static undoMove(board: Board, move: Move, piece: Piece): void {
		board.setSquare(move.from.row, move.from.col, piece);
		board.setSquare(move.to.row, move.to.col, null);
		piece.moveTo(move.from);
	}
}
