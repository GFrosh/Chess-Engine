import { describe, expect, it } from "vitest";
import { Board } from "../../src/board/Board";
import { AI } from "../../src/ai/AI";
import { Evaluator } from "../../src/ai/Evaluator";
import { MoveValidator } from "../../src/move/MoveValidator";
import { MoveService } from "../../src/move/MoveService";
import { Game } from "../../src/game/Game";
import { King } from "../../src/pieces/King";
import { Queen } from "../../src/pieces/Queen";
import { Rook } from "../../src/pieces/Rook";
import { Pawn } from "../../src/pieces/Pawn";
import { positionToAlgebraic } from "../../src/utils/square";

// ---------------------------------------------------------------------------
// Evaluator tests
// ---------------------------------------------------------------------------

describe("Evaluator", () => {
	it("returns 0 for a symmetric empty board (both sides with only kings)", () => {
		const board = new Board();
		board.placePiece(new King("white", { row: 7, col: 4 }));
		board.placePiece(new King("black", { row: 0, col: 4 }));

		// Both kings are on symmetric squares (same column, opposite rows),
		// so piece-square bonuses cancel out and the score should be 0.
		expect(Evaluator.evaluate(board)).toBe(0);
	});

	it("returns a positive score when White has a material advantage", () => {
		const board = new Board();
		board.placePiece(new King("white", { row: 7, col: 4 }));
		board.placePiece(new Queen("white", { row: 6, col: 4 }));
		board.placePiece(new King("black", { row: 0, col: 4 }));

		expect(Evaluator.evaluate(board)).toBeGreaterThan(0);
	});

	it("returns a negative score when Black has a material advantage", () => {
		const board = new Board();
		board.placePiece(new King("white", { row: 7, col: 4 }));
		board.placePiece(new King("black", { row: 0, col: 4 }));
		board.placePiece(new Queen("black", { row: 1, col: 4 }));

		expect(Evaluator.evaluate(board)).toBeLessThan(0);
	});
});

// ---------------------------------------------------------------------------
// getAllLegalMoves tests
// ---------------------------------------------------------------------------

describe("MoveValidator.getAllLegalMoves", () => {
	it("returns 20 legal moves for White from the starting position", () => {
		const game = new Game();
		game.start();

		const moves = MoveValidator.getAllLegalMoves(game.board, "white");
		// 16 pawn moves (2 each) + 4 knight moves = 20
		expect(moves).toHaveLength(20);
	});

	it("returns an empty array when the player is in checkmate", () => {
		// Fool's mate position – Black queen on h4, White king in checkmate
		const game = new Game();
		game.start();
		game.move("f2", "f3");
		game.move("e7", "e5");
		game.move("g2", "g4");
		game.move("d8", "h4");

		const moves = MoveValidator.getAllLegalMoves(game.board, "white", game.lastMove);
		expect(moves).toHaveLength(0);
	});
});

// ---------------------------------------------------------------------------
// AI tests
// ---------------------------------------------------------------------------

describe("AI", () => {
	it("returns a non-null move from the starting position", () => {
		const game = new Game();
		game.start();

		const ai = new AI(2);
		const best = ai.getBestMove(game.board, "white");

		expect(best).not.toBeNull();
	});

	it("returned move can be executed on the board without throwing", () => {
		const game = new Game();
		game.start();

		const ai = new AI(2);
		const best = ai.getBestMove(game.board, "white");
		expect(best).not.toBeNull();

		const from = positionToAlgebraic(best!.from);
		const to = positionToAlgebraic(best!.to);
		expect(() => game.move(from, to, best!.promotionPiece)).not.toThrow();
	});

	it("returns null when the player has no legal moves (checkmate)", () => {
		const game = new Game();
		game.start();
		game.move("f2", "f3");
		game.move("e7", "e5");
		game.move("g2", "g4");
		game.move("d8", "h4");

		const ai = new AI(2);
		// White is in checkmate, so getBestMove should return null
		const best = ai.getBestMove(game.board, "white", game.lastMove);
		expect(best).toBeNull();
	});

	it("finds checkmate in one move (depth 2)", () => {
		// Position: White King f7, White Rook a6 – Black King h8.
		// The only move that delivers immediate checkmate is Rook a6 → h6 (Rh6#).
		//
		// After Rh6 the rook covers the entire h-file (h8 is in check) and
		// the White king on f7 controls g7 and g8, leaving the Black king
		// with no safe square.
		const board = new Board();
		board.placePiece(new King("white", { row: 1, col: 5 }));  // f7
		board.placePiece(new Rook("white", { row: 2, col: 0 }));  // a6
		board.placePiece(new King("black", { row: 0, col: 7 }));  // h8

		const ai = new AI(2);
		const best = ai.getBestMove(board, "white");

		expect(best).not.toBeNull();

		// Execute the move and verify it results in checkmate
		const move = MoveValidator.getAllLegalMoves(board, "white").find(
			(m) => m.from.row === best!.from.row && m.from.col === best!.from.col &&
				m.to.row === best!.to.row && m.to.col === best!.to.col,
		)!;
		MoveService.executeMove(board, move);
		expect(MoveValidator.isCheckmate(board, "black", move)).toBe(true);
	});

	it("captures a free opponent piece when available", () => {
		// White King e1, White Rook e4 (on same file as black queen).
		// Black King e8, Black Queen e5 (undefended, directly attackable by White rook).
		// The AI should capture the black queen.
		const board = new Board();
		board.placePiece(new King("white", { row: 7, col: 4 })); // e1
		board.placePiece(new Rook("white", { row: 4, col: 4 })); // e4
		board.placePiece(new King("black", { row: 0, col: 4 })); // e8
		board.placePiece(new Queen("black", { row: 3, col: 4 })); // e5

		const ai = new AI(2);
		const best = ai.getBestMove(board, "white");

		expect(best).not.toBeNull();
		// The best move should be capturing the queen (Rook e4 → e5)
		expect(best!.from).toEqual({ row: 4, col: 4 });
		expect(best!.to).toEqual({ row: 3, col: 4 });
	});

	it("promotes a pawn to queen when reaching the last rank", () => {
		// White pawn on the 7th rank (one step from promotion), nothing blocking it.
		const board = new Board();
		board.placePiece(new King("white", { row: 7, col: 4 })); // e1
		board.placePiece(new Pawn("white", { row: 1, col: 0 })); // a7
		board.placePiece(new King("black", { row: 0, col: 6 })); // g8

		const ai = new AI(1);
		const best = ai.getBestMove(board, "white");

		expect(best).not.toBeNull();
		// Pawn should advance from a7 to a8 with queen promotion
		expect(best!.from).toEqual({ row: 1, col: 0 });
		expect(best!.to).toEqual({ row: 0, col: 0 });
		expect(best!.promotionPiece).toBe("queen");
	});
});
