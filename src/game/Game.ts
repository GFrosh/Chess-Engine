import { Board } from "../board/Board";
import { Piece, Color } from "../pieces/Piece";
import { algebraicToPosition } from "../utils/square";

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

		for (let col = 0; col < 8; col++) {
		// White pawns
		this.board.placePiece(
			new Piece("pawn", "white", { row: 6, col })
		);

		// Black pawns
		this.board.placePiece(
			new Piece("pawn", "black", { row: 1, col })
		);
		}
	}

	move(fromSquare: string, toSquare: string) {
		const from = algebraicToPosition(fromSquare);
		const to = algebraicToPosition(toSquare);

		const piece = this.board.getPiece(from);

		if (!piece) {
		throw new Error("No piece at source square");
		}

		if (piece.color !== this.currentPlayer) {
		throw new Error("Not your turn");
		}

		this.board.movePiece(from, to);

		this.moveHistory.push(`${fromSquare} -> ${toSquare}`);

		this.switchTurn();
	}

	private switchTurn() {
		this.currentPlayer = this.currentPlayer === "white" ? "black" : "white";
	}
}
