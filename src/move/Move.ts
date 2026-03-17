import { Position } from "../pieces/Piece";

export class Move {
    from: Position;
    to: Position;

    constructor(from: Position, to: Position) {
        this.from = from;
        this.to = to;
    }
}
