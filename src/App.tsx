import React from "react";
import Board from "./components/Board";
import NextPiece from "./components/NextPiece";
import Controls from "./components/Controls";

import { usePuzzle } from "./hooks/usePuzzle";
import { place, placements } from "./logic/board";
import { chooseAction } from "./logic/ai";
import { DefaultDistribution } from "./logic/pieces";

export default function App() {
  const {
    board,
    setBoard,
    current,
    nextPiece,
    drawn,
    skips,
    setSkips,
    reset,
    status,
  } = usePuzzle({
    ...DefaultDistribution,
    deluxeChancePerDraw: 0.0, // set > 0 to include the 2x3 deluxe occasionally
  });

  const stats = status
    ? `Finished with ${drawn} pieces → Reward ${status}`
    : `Drawn: ${drawn} | Skips: ${skips}`;

  function handleManualPlace(r: number, c: number) {
    // Manual placement via grid click
    const legal = placements(board, current).some(
      (p) => p.r === r && p.c === c
    );
    if (!legal) return;
    setBoard(place(board, current, { r, c }));
    nextPiece();
  }

  function handleSkip() {
    setSkips((s) => s + 1);
    nextPiece();
  }

  function handleAi() {
    const action = chooseAction(
      board,
      current,
      { ...DefaultDistribution, deluxeChancePerDraw: 0.0 },
      { lookahead: 2, rolloutsPerMove: 48, skipPenalty: 0.35 }
    );

    if (action.kind === "SKIP") {
      handleSkip();
      return;
    }
    setBoard(place(board, current, { r: action.r, c: action.c }));
    nextPiece();
  }

  React.useEffect(() => {
    if (status) {
      // Simple notify on completion
      // eslint-disable-next-line no-alert
      alert(`Puzzle complete with ${drawn} pieces (reward ${status}).`);
    }
  }, [status, drawn]);

  return (
    <div className="page">
      <h1>Fishing Jigsaw (Metin2) — Web Solver</h1>

      <div className="layout">
        <Board board={board} current={current} onPlace={handleManualPlace} />

        <div className="side">
          <h3>Incoming piece</h3>
          <NextPiece piece={current} />
          <Controls
            stats={stats}
            onAiPlace={handleAi}
            onSkip={handleSkip}
            onReset={reset}
          />

          <div className="legend">
            <p>
              Solver policy: Monte-Carlo expectimax with heuristics (minimize
              pieces used; penalize isolated holes & fragmentation).
            </p>
            <p className="hint">
              Tip: tweak <code>deluxeChancePerDraw</code> or piece weights in{" "}
              <code>logic/pieces.ts</code> to match your server.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
