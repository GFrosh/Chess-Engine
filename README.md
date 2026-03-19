# Chess Engine (TypeScript)

A lightweight chess engine project written in TypeScript.

Current scope is focused on core board state management and pawn movement while the rest of the engine is being built incrementally.

## Current Features

- 8x8 board model with bounds-safe access
- Piece placement and piece movement on the board
- Pawn legal move generation:
  - single forward move
  - double forward move from starting rank
  - diagonal captures
  - out-of-bounds filtering
- Turn-based move validation in the game loop (`white` then `black`)
- Algebraic square parsing (for example, `e2`, `e4`)

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
  pieces/
    Piece.ts
    Pawn.ts
  types/
    grid.ts
    pieceType.ts
  utils/
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
- Promotion flow exists in type definitions but is still being integrated end-to-end
- No check/checkmate validation yet
- No castling or en passant yet
- No full algebraic notation output yet

## Roadmap

- Add remaining piece movement logic (knight, bishop, rook, queen, king)
- Implement king safety checks (no move that leaves king in check)
- Implement promotion execution in game flow
- Add castling and en passant
- Add unit tests for board and move legality

## License

This project is licensed under the ISC License. See the `LICENSE` file for details.
