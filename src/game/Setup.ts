import { Board } from "../board/Board";
import { Knight } from "../pieces/Knight";
import { Pawn } from "../pieces/Pawn";
import { Rook } from "../pieces/Rook";
import { Bishop } from "../pieces/Bishop";
import { Queen } from "../pieces/Queen";
import { King } from "../pieces/King";

export class Setup {
    private static pawns(board: Board) {
        for (let col = 0; col < board.size; col++) {
            // White pawns
            board.placePiece(
                new Pawn("white", { row: 6, col: col })
            );
            // Black pawns
            board.placePiece(
                new Pawn("black", { row: 1, col: col })
            );
        }
    }


    private static knights(board: Board) {
        // White Knights
        board.placePiece(
            new Knight("white", { row: 7, col: 1 })
        );
        board.placePiece(
            new Knight("white", { row: 7, col: 6 })
        );
        // Black Knights
        board.placePiece(
            new Knight("black", { row: 0, col: 1 })
        );
        board.placePiece(
            new Knight("black", { row: 0, col: 6 })
        );
    }

    private static rooks(board: Board) {
        // WHITE ROOKS
        board.placePiece(
            new Rook("white", { row: 7, col: 0})
        );
        board.placePiece(
            new Rook("white", { row: 7, col: 7 })
        );

        // BLACK ROOKS
        board.placePiece(
            new Rook("black", { row: 0, col: 0 })
        );
        board.placePiece(
            new Rook("black", { row: 0, col: 7 })
        );
    }

    private static bishops(board: Board) {
        // WHITE BISHOPS
        board.placePiece(
            new Bishop("white", { row: 7, col: 2 })
        );
        board.placePiece(
            new Bishop("white", { row: 7, col: 5 })
        );

        // BLACK BISHOPS
        board.placePiece(
            new Bishop("black", { row: 0, col: 2 })
        );
        board.placePiece(
            new Bishop("black", { row: 0, col: 5 })
        );
    }

    private static queens(board: Board) {
        // WHITE QUEEN
        board.placePiece(
            new Queen("white", { row: 7, col: 3 })
        );

        // BLACK QUEEN
        board.placePiece(
            new Queen("black", { row: 0, col: 3 })
        );
    }

    private static kings(board: Board) {
        // WHITE KING
        board.placePiece(
            new King("white", { row: 7, col: 4 })
        );

        // BLACK KING
        board.placePiece(
            new King("black", { row: 0, col: 4 })
        );
    }

    static default(board: Board) {
        this.pawns(board);
        this.knights(board);
        this.rooks(board);
        this.bishops(board);
        this.queens(board);
        this.kings(board);
    }

    static standard(board: Board) {
        this.pawns(board);
        this.knights(board);
        this.rooks(board);
        this.bishops(board);
        this.queens(board);
        this.kings(board);
    }
}
