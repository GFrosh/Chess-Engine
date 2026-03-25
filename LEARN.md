# Learn: Chess Engine

This guide is for learning how this codebase is organized and where to make changes safely.

It focuses on architecture, flow, and extension points, not just setup commands.

## What this project currently implements

The engine includes:

- board state management (`Board`)
- standard initial piece setup (`Setup.standard`)
- move validation (`MoveValidator`)
- move execution/undo (`MoveService`)
- turn flow and history (`Game`)
- legal move generation for all standard pieces:
  - pawn
  - rook
  - knight
  - bishop
  - queen
  - king

Not yet implemented:

- check/checkmate
- castling
- en passant
- promotion

## Quick start

### Prereqs

- Node.js 18+
- npm

### Install

```bash
npm install
```

### Run demo

```bash
npm run dev
```

### Run tests

```bash
npm test
```

### Watch tests while iterating

```bash
npm run test:watch
```

## Repo map

```text
src/
  index.ts                # sample game sequence
  board/
    Board.ts              # 8x8 grid + safe read/write helpers + ASCII rendering
  game/
    Game.ts               # top-level orchestration (start, move, turns, history)
    Setup.ts              # standard chess piece placement
  move/
    Move.ts               # move model (from/to positions)
    MoveValidator.ts      # legality checks for a proposed move
    MoveService.ts        # execute/undo state mutation
  pieces/
    Piece.ts              # shared base class for all pieces
    Pawn.ts
    Rook.ts
    Knight.ts
    Bishop.ts
    Queen.ts
    King.ts
  utils/
    positionUtils.ts      # position comparisons and helpers
    square.ts             # algebraic <-> position conversion
  types/
    grid.ts
    pieceType.ts

tests/
  pieces/
    Pawn.test.ts
    Bishop.test.ts
    RookKnight.test.ts
  utils/
    positionUtils.test.ts
    square.test.ts
```

## Core mental model

Treat the engine as five layers:

1. `Board`: stores the canonical board state.
2. `Piece` subclasses: generate legal destinations from current board state.
3. `MoveValidator`: checks that a requested move is legal now.
4. `MoveService`: applies or undoes board mutations.
5. `Game`: coordinates turn order and move history.

Rule of thumb:

- legality belongs in piece logic or `MoveValidator`
- mutation belongs in `MoveService`
- sequencing/flow belongs in `Game`

## Move flow walkthrough

Calling `game.move("e2", "e4")` does this:

1. Convert `e2` and `e4` into `{ row, col }` with `algebraicToPosition`.
2. Build a `Move` object.
3. `MoveValidator.validateMove(...)` checks:
   - piece exists on source square
   - piece color matches `currentPlayer`
   - destination is in piece legal moves
4. `MoveService.executeMove(...)` updates squares and piece position.
5. `Game` logs `e2->e4` and switches turns.

## Piece movement details

- `Pawn`: one-step, two-step from start, diagonal captures.
- `Knight`: fixed 8 jump offsets, can jump over blockers.
- `Bishop`: scans diagonal rays until blocked.
- `Rook`: scans horizontal/vertical rays until blocked.
- `Queen`: combines bishop + rook ray movement.
- `King`: one-square movement in any direction.

## Test coverage today

Current tests focus on:

- pawn movement and capture behavior
- bishop ray movement and blocking
- rook and knight movement edge cases
- position helper correctness
- algebraic square conversion correctness

Still worth adding:

- `Game` integration tests (turn switching + history)
- `MoveValidator` error-path tests
- `MoveService` execute/undo behavior tests
- king/queen-specific movement tests

## Good next tasks

1. Add check detection and reject moves that expose your own king.
2. Add promotion handling in `MoveService` and game flow.
3. Add castling with validator checks and two-piece movement execution.
4. Add en passant using last-move state.
5. Add richer move notation (SAN/PGN-like) in history output.

## Common pitfalls

- Mixing algebraic squares and internal `{ row, col }` indexes.
- Mutating board state inside validation logic.
- Re-implementing bounds checks instead of using board helpers.
- Forgetting to test both ally-block and enemy-capture cases.
