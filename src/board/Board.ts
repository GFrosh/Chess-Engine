import { Piece, Position } from "../pieces/Piece";

export class Board {
	grid: (Piece | null)[][];

	constructor() {
		this.grid = this.createEmptyBoard();
	}

	private createEmptyBoard(): (Piece | null)[][] {
		const grid: (Piece | null)[][] = [];

		for (let row = 0; row < 8; row++) {
			const currentRow: (Piece | null)[] = [];

			for (let col = 0; col < 8; col++) {
				currentRow.push(null);
			}
			grid.push(currentRow);
		}
		return grid;
	}

	placePiece(piece: Piece) {
		const { row, col } = piece.position;
		this.grid[row][col] = piece;
	}

	getPiece(position: Position): Piece | null {
		return this.grid[position.row][position.col];
	}

	movePiece(from: Position, to: Position) {
		const piece = this.getPiece(from);

		if (!piece) {
		throw new Error("No piece at starting position");
		}

		this.grid[to.row][to.col] = piece;
		this.grid[from.row][from.col] = null;

		piece.moveTo(to);
	}
}
