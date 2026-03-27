import { Board } from "../board/Board";
import { Color } from "../pieces/Piece";
import { algebraicToPosition } from "../utils/square";
import { Move } from "../move/Move";
import { MoveValidator } from "../move/MoveValidator";
import { MoveExecutionState, MoveService } from "../move/MoveService";
import { Setup } from "./Setup";
import { PromotionPieceType } from "../types/pieceType";

type GameStateSnapshot = {
	currentPlayer: Color;
	lastMove?: Move;
	inCheck: Color | null;
	isGameOver: boolean;
	winner: Color | null;
	gameEndReason: "checkmate" | "stalemate" | null;
	moveHistoryLength: number;
};

type ExecutedMoveRecord = {
	executionState: MoveExecutionState;
	stateBeforeMove: GameStateSnapshot;
};

export class Game {
	board: Board;
	currentPlayer: Color;
	moveHistory: string[];
	lastMove?: Move;
	inCheck: Color | null;
	isGameOver: boolean;
	winner: Color | null;
	gameEndReason: "checkmate" | "stalemate" | null;
	private executedMoves: ExecutedMoveRecord[];

	constructor() {
		this.board = new Board();
		this.currentPlayer = "white";
		this.moveHistory = [];
		this.lastMove = undefined;
		this.inCheck = null;
		this.isGameOver = false;
		this.winner = null;
		this.gameEndReason = null;
		this.executedMoves = [];
	}

	start() {
		this.setupPieces();
	}

	private setupPieces() {
		Setup.standard(this.board);
	}

	move(fromSquare: string, toSquare: string, promotionPiece?: PromotionPieceType) {
		if (this.isGameOver) {
			throw new Error(`Game is over (${this.gameEndReason ?? "unknown"}). Winner: ${this.winner ?? "none"}`);
		}

		const stateBeforeMove: GameStateSnapshot = {
			currentPlayer: this.currentPlayer,
			lastMove: this.lastMove,
			inCheck: this.inCheck,
			isGameOver: this.isGameOver,
			winner: this.winner,
			gameEndReason: this.gameEndReason,
			moveHistoryLength: this.moveHistory.length
		};

		const from = algebraicToPosition(fromSquare);
		const to = algebraicToPosition(toSquare);

		const move = new Move(from, to, promotionPiece);

		MoveValidator.validateMove(this.board, move, this.currentPlayer, this.lastMove);
		const executionState = MoveService.executeMove(this.board, move);
		this.executedMoves.push({ executionState, stateBeforeMove });
		this.lastMove = move;

		// Log and switch turns
		this.moveHistory.push(`${fromSquare}->${toSquare}`);
		this.switchTurn();

		this.inCheck = MoveValidator.isKingInCheck(this.board, this.currentPlayer)
			? this.currentPlayer
			: null;

		if (MoveValidator.isCheckmate(this.board, this.currentPlayer, this.lastMove)) {
			this.isGameOver = true;
			this.winner = this.currentPlayer === "white" ? "black" : "white";
			this.gameEndReason = "checkmate";
			return;
		}

		if (MoveValidator.isStalemate(this.board, this.currentPlayer, this.lastMove)) {
			this.isGameOver = true;
			this.winner = null;
			this.gameEndReason = "stalemate";
		}
	}

	undo() {
		const lastExecutedMove = this.executedMoves.pop();
		if (!lastExecutedMove) {
			throw new Error("No moves to undo");
		}

		MoveService.undoMove(this.board, lastExecutedMove.executionState);

		this.currentPlayer = lastExecutedMove.stateBeforeMove.currentPlayer;
		this.lastMove = lastExecutedMove.stateBeforeMove.lastMove;
		this.inCheck = lastExecutedMove.stateBeforeMove.inCheck;
		this.isGameOver = lastExecutedMove.stateBeforeMove.isGameOver;
		this.winner = lastExecutedMove.stateBeforeMove.winner;
		this.gameEndReason = lastExecutedMove.stateBeforeMove.gameEndReason;
		this.moveHistory = this.moveHistory.slice(0, lastExecutedMove.stateBeforeMove.moveHistoryLength);
	}

	private switchTurn() {
		this.currentPlayer = this.currentPlayer === "white" ? "black" : "white";
	}
}
