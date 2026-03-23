import { Board } from "../board/Board";
import { Color } from "../pieces/Piece";
import { algebraicToPosition } from "../utils/square";
import { Move } from "../move/Move";
import { MoveValidator } from "../move/MoveValidator";
import { MoveService } from "../move/MoveService";
import { Setup } from "./Setup";

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
		Setup.all(this.board);
	}

	move(fromSquare: string, toSquare: string) {
		const from = algebraicToPosition(fromSquare);
		const to = algebraicToPosition(toSquare);

		const move = new Move(from, to);

		MoveValidator.validateMove(this.board, move, this.currentPlayer);
		MoveService.executeMove(this.board, move);

		// Log and switch turns
		this.moveHistory.push(`${fromSquare}->${toSquare}`);
		this.switchTurn();
	}

	private switchTurn() {
		this.currentPlayer = this.currentPlayer === "white" ? "black" : "white";
	}
}
