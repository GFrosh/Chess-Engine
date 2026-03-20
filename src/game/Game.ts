import { Board } from "../board/Board";
import { Color, Position } from "../pieces/Piece";
import { Pawn } from "../pieces/Pawn";
import { algebraicToPosition } from "../utils/square";
import { Move } from "../move/Move";

export class Game {
	board: Board;
	currentPlayer: Color;
	moveHistory: string[];

	constructor() {
		this.board = new Board();
		this.currentPlayer = "white";
		this.moveHistory = [];
	}

	start() {
		this.setupPieces();
	}

	private setupPieces() {
		// Pawns only (for now)

		for (let col = 0; col < this.board.size; col++) {
			// White pawns
			this.board.placePiece(
				new Pawn("white", { row: 6, col: col })
			);

			// Black pawns
			this.board.placePiece(
				new Pawn("black", { row: 1, col: col })
			);
		}
	}

	move(
		fromSquare: string,
		toSquare: string
	) {
		const from = algebraicToPosition(fromSquare);
		const to = algebraicToPosition(toSquare);

		const move = new Move(from, to);
		const piece = this.board.getPiece(move.from);

		if (!piece) {
			throw new Error("No piece at source square");
		}

		if (piece.color !== this.currentPlayer) {
			throw new Error("Not your turn");
		}

		const legalMoves = piece.getLegalMoves(this.board);

		const isLegal = legalMoves.some((pos: Position) => {
			return pos.row === move.to.row && pos.col === move.to.col
		});

		if (!isLegal) {
			throw new Error("Illegal move");
		}

		// UPDATE BOARD STATS AND PIECE POSITION
		this.board.movePiece(move.from, move.to);
		const movedPiece = this.board.getPiece(move.to);
		movedPiece?.moveTo(move.to);
		

		// LOGGING THE MOVE IN HISTORY AND SWITCHING TURNS
		this.moveHistory.push(`${fromSquare}->${toSquare}`);
		this.switchTurn();
	}

	private switchTurn() {
		this.currentPlayer = this.currentPlayer === "white" ? "black" : "white";
	}
}
