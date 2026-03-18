import { Piece } from "../pieces/Piece"
export type SquareContent = Piece | null;
export type Row = SquareContent[];
export type Grid = Row[];
