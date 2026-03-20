# Chess Engine (TypeScript)

A lightweight chess engine project written in TypeScript.

Current scope is focused on board state, pawn movement, and a cleaner move pipeline split across validation and execution services.

## Current Features

- 8x8 board model with bounds-safe access (`Board`)
- Piece placement and retrieval APIs (`placePiece`, `getPiece`, `setSquare`)
- Pawn legal move generation:
  - single forward move
  - double forward move from starting rank
  - diagonal captures
  - out-of-bounds filtering
- Turn-based move validation pipeline (`MoveValidator`)
- Atomic move execution service (`MoveService`)
- Centralized position helpers (`arePositionsEqual`, `findPosition`, row/col/diagonal checks)
- Algebraic square parsing and formatting (`algebraicToPosition`, `positionToAlgebraic`)
- Move history logging in game flow (`from->to` format)

## Architecture Progress

- `Game` orchestrates turn flow and move history
- `MoveValidator` owns legality checks (piece exists, correct turn, legal destination)
- `MoveService` owns board + piece state updates for move/undo
- `Board` owns grid storage and bounds-safe square access
- `Piece` subclasses own legal move generation
- `MovementPatterns` utility is added for reusable piece movement logic as more pieces are implemented

## Project Structure

```text
src/
  index.ts
  board/
    Board.ts
  game/
    Game.ts
  move/
    Move.ts
    MoveService.ts
    MoveValidator.ts
  pieces/
    MovementPatterns.ts
    Piece.ts
    Pawn.ts
  types/
    grid.ts
    pieceType.ts
  utils/
    positionUtils.ts
    square.ts
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
npm install
```

### Run in Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Run Built Output

```bash
npm start
```

## Usage Example

From `src/index.ts`:

```ts
import { Game } from "./game/Game";

const game = new Game();
game.start();

game.move("e2", "e4");
game.move("e7", "e5");
```

## Known Limitations (In Progress)

- Pawns are currently the only fully modeled piece class
- `MoveService.executeMove` returns the moved piece, but the return value is not yet consumed in `Game`
- Movement pattern helpers exist but are not yet wired into concrete non-pawn pieces
- No check/checkmate validation yet
- No castling or en passant yet
- No full algebraic notation output yet

## Roadmap

- Add remaining piece movement logic (knight, bishop, rook, queen, king)
- Integrate `MovementPatterns` into the new piece implementations
- Decide whether to consume the returned moved piece from `MoveService` or change return type to `void`
- Implement king safety checks (no move that leaves king in check)
- Implement promotion execution in game flow
- Add castling and en passant
- Add unit tests for board and move legality

## License

This project is licensed under the ISC License. See the `LICENSE` file for details.
