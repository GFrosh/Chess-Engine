import { Board } from "../board/Board";

export type Color = "white" | "black";

export type Position = {
	row: number;
	col: number;
};

export class Piece {
	type: string;
	color: Color;
	position: Position;

	constructor(type: string, color: Color, position: Position) {
		this.type = type;
		this.color = color;
		this.position = position;
	}

	moveTo(position: Position) {
		this.position = position;
	}

	getLegalMoves(_board: Board): Position[] {
    	return [];
  	}
}
