import { Piece } from "../pieces/Piece"
export type Grid = (Piece | null)[][];
export type SquareContent = Piece | null;
export type Row = SquareContent[];
