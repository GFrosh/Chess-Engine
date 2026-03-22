import { describe, expect, it } from "vitest";
import { Board } from "../../src/board/Board";
import { Pawn } from "../../src/pieces/Pawn";
import { Rook } from "../../src/pieces/Rook";
import { Knight } from "../../src/pieces/Knight";
import { Position } from "../../src/pieces/Piece";

function containsPosition(positions: Position[], target: Position): boolean {
	return positions.some((pos) => pos.row === target.row && pos.col === target.col);
}

describe("Rook legal moves", () => {
	it("still allows horizontal moves when vertical path is blocked", () => {
		const board = new Board();
		const rook = new Rook("black", { row: 0, col: 0 });
		const blockingPawn = new Pawn("black", { row: 1, col: 0 });
		board.placePiece(rook);
		board.placePiece(blockingPawn);

		const moves = rook.getLegalMoves(board);

		expect(containsPosition(moves, { row: 0, col: 1 })).toBe(true);
		expect(containsPosition(moves, { row: 1, col: 0 })).toBe(false);
	});
});

describe("Knight legal moves", () => {
	it("returns all 8 jumps from center on an empty board", () => {
		const board = new Board();
		const knight = new Knight("white", { row: 4, col: 4 });
		board.placePiece(knight);

		const moves = knight.getLegalMoves(board);

		expect(moves).toHaveLength(8);
		expect(containsPosition(moves, { row: 2, col: 3 })).toBe(true);
		expect(containsPosition(moves, { row: 2, col: 5 })).toBe(true);
		expect(containsPosition(moves, { row: 3, col: 2 })).toBe(true);
		expect(containsPosition(moves, { row: 3, col: 6 })).toBe(true);
		expect(containsPosition(moves, { row: 5, col: 2 })).toBe(true);
		expect(containsPosition(moves, { row: 5, col: 6 })).toBe(true);
		expect(containsPosition(moves, { row: 6, col: 3 })).toBe(true);
		expect(containsPosition(moves, { row: 6, col: 5 })).toBe(true);
	});

	it("can capture enemy but not land on ally", () => {
		const board = new Board();
		const knight = new Knight("white", { row: 4, col: 4 });
		const enemy = new Pawn("black", { row: 2, col: 3 });
		const ally = new Pawn("white", { row: 2, col: 5 });
		board.placePiece(knight);
		board.placePiece(enemy);
		board.placePiece(ally);

		const moves = knight.getLegalMoves(board);

		expect(containsPosition(moves, { row: 2, col: 3 })).toBe(true);
		expect(containsPosition(moves, { row: 2, col: 5 })).toBe(false);
	});
});
