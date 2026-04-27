import { Board } from "../board/Board";
import { Color, Position } from "../pieces/Piece";
import { Move } from "../move/Move";
import { MoveValidator } from "../move/MoveValidator";
import { MoveService } from "../move/MoveService";
import { Evaluator } from "./Evaluator";
import { PromotionPieceType } from "../types/pieceType";

export type BestMove = {
	from: Position;
	to: Position;
	promotionPiece?: PromotionPieceType;
};

/**
 * AI bot that selects moves using minimax search with alpha-beta pruning.
 * Scores are always from White's perspective (positive = good for White).
 */
export class AI {
	/** Search depth (half-moves / plies). Default is 3. */
	readonly depth: number;

	constructor(depth: number = 3) {
		this.depth = depth;
	}

	private static oppositeColor(color: Color): Color {
		return color === "white" ? "black" : "white";
	}

	/**
	 * Minimax with alpha-beta pruning.
	 *
	 * @param board        Current board state (mutated in place, always restored)
	 * @param depth        Remaining search depth
	 * @param alpha        Best score the maximiser can guarantee so far
	 * @param beta         Best score the minimiser can guarantee so far
	 * @param isMaximizing True when it is White's (maximiser's) turn
	 * @param currentColor Color whose turn it is at this node
	 * @param lastMove     Previous move (needed for en-passant validation)
	 * @returns            Evaluated score from White's perspective
	 */
	private minimax(
		board: Board,
		depth: number,
		alpha: number,
		beta: number,
		isMaximizing: boolean,
		currentColor: Color,
		lastMove?: Move,
	): number {
		if (depth === 0) {
			return Evaluator.evaluate(board);
		}

		const legalMoves = MoveValidator.getAllLegalMoves(board, currentColor, lastMove);

		if (legalMoves.length === 0) {
			if (MoveValidator.isKingInCheck(board, currentColor)) {
				// Checkmate: the current player has lost.
				// A loss is the worst possible outcome for the current side.
				return isMaximizing ? -Infinity : Infinity;
			}
			// Stalemate: draw.
			return 0;
		}

		const nextColor = AI.oppositeColor(currentColor);

		if (isMaximizing) {
			let best = -Infinity;
			for (const move of legalMoves) {
				const executionState = MoveService.executeMove(board, move);
				const score = this.minimax(board, depth - 1, alpha, beta, false, nextColor, move);
				MoveService.undoMove(board, executionState);
				if (score > best) {
					best = score;
				}
				if (best > alpha) {
					alpha = best;
				}
				if (beta <= alpha) {
					break; // Beta cut-off
				}
			}
			return best;
		} else {
			let best = Infinity;
			for (const move of legalMoves) {
				const executionState = MoveService.executeMove(board, move);
				const score = this.minimax(board, depth - 1, alpha, beta, true, nextColor, move);
				MoveService.undoMove(board, executionState);
				if (score < best) {
					best = score;
				}
				if (best < beta) {
					beta = best;
				}
				if (beta <= alpha) {
					break; // Alpha cut-off
				}
			}
			return best;
		}
	}

	/**
	 * Returns the best move for the given color using minimax with alpha-beta
	 * pruning at the configured depth.  Returns `null` when no legal moves are
	 * available (checkmate or stalemate).
	 *
	 * @param board     Current board state (not mutated permanently)
	 * @param color     The color to find a move for
	 * @param lastMove  The previous move played (used for en-passant detection)
	 */
	getBestMove(board: Board, color: Color, lastMove?: Move): BestMove | null {
		const legalMoves = MoveValidator.getAllLegalMoves(board, color, lastMove);
		if (legalMoves.length === 0) {
			return null;
		}

		const isMaximizing = color === "white";
		const nextColor = AI.oppositeColor(color);
		let bestMove: Move | null = null;
		let bestScore = isMaximizing ? -Infinity : Infinity;

		for (const move of legalMoves) {
			const executionState = MoveService.executeMove(board, move);
			const score = this.minimax(
				board,
				this.depth - 1,
				-Infinity,
				Infinity,
				!isMaximizing,
				nextColor,
				move,
			);
			MoveService.undoMove(board, executionState);

			if (isMaximizing ? score > bestScore : score < bestScore) {
				bestScore = score;
				bestMove = move;
			}
		}

		if (!bestMove) {
			return null;
		}

		return {
			from: bestMove.from,
			to: bestMove.to,
			promotionPiece: bestMove.promotionPiece,
		};
	}
}
