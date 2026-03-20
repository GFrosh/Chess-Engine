import { Position, Piece } from "../pieces/Piece";
export type Moves = Position[];

export class Move {
    from: Position;
    to: Position;

    constructor(from: Position, to: Position) {
        this.from = from;
        this.to = to;
    }
}
