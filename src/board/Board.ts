import { Piece, Position } from "../pieces/Piece";
import { Grid, Row } from "../types/grid";

export class Board {
	grid: Grid;

	constructor() {
		this.grid = this.createEmptyBoard();
	}

	private createEmptyBoard(): Grid {
		const grid: Grid = [];

		for (let row = 0; row < 8; row++) {
			const currentRow: Row = [];

			for (let col = 0; col < 8; col++) {
				currentRow.push(null);
			}
			grid.push(currentRow);
		}
		return grid;
	}

	isWithinBounds(position: Position): boolean {
		return (
			position.row >= 0 &&
			position.row < 8 &&
			position.col >= 0 &&
			position.col < 8
		);
	}

	placePiece(piece: Piece) {
		const { row, col } = piece.position;

		if (!this.isWithinBounds(piece.position)) {
			throw new Error("Cannot place piece out of bounds");
		}

		this.grid[row][col] = piece;
	}

	getPiece(position: Position): Piece | null {
		if (!this.isWithinBounds(position)) {
			return null;
		}

		return this.grid[position.row][position.col];
	}

	movePiece(from: Position, to: Position) {
		if (!this.isWithinBounds(from) || !this.isWithinBounds(to)) {
			throw new Error("Move out of bounds");
		}

		const piece = this.getPiece(from);

		if (!piece) {
			throw new Error("No piece at starting position");
		}

		this.grid[to.row][to.col] = piece;
		this.grid[from.row][from.col] = null;

		piece.moveTo(to);
	}
}
