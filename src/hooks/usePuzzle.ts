import { useMemo, useState } from "react";
import type { Board, Distribution, PieceId } from "../logic/types";
import { ROWS, COLS, emptyBoard, boardFilled } from "../logic/board";
import { DefaultDistribution, Pieces } from "../logic/pieces";

function makeSampler(dist: Distribution) {
  const ids = (Object.keys(dist.weights) as PieceId[]).filter(
    (id) => id !== "DELUXE"
  );
  const weights = ids.map((id) => dist.weights[id] ?? 0);
  const total = weights.reduce((a, b) => a + b, 0);
  const cumulative = weights.map(
    (w, i) => weights.slice(0, i + 1).reduce((a, b) => a + b, 0) / total
  );
  return () => {
    if (Math.random() < dist.deluxeChancePerDraw) return "DELUXE" as PieceId;
    const r = Math.random();
    const idx = cumulative.findIndex((x) => r <= x);
    return ids[idx >= 0 ? idx : ids.length - 1];
  };
}

export function usePuzzle(dist: Distribution = DefaultDistribution) {
  const [board, setBoard] = useState<Board>(() => emptyBoard());
  const [drawn, setDrawn] = useState<number>(0);
  const [skips, setSkips] = useState<number>(0);

  const sampler = useMemo(() => makeSampler(dist), [dist]);
  const [current, setCurrent] = useState(() => Pieces[sampler()]);

  function nextPiece() {
    setCurrent(Pieces[sampler()]);
    setDrawn((d) => d + 1);
  }

  function reset() {
    setBoard(emptyBoard());
    setDrawn(0);
    setSkips(0);
    setCurrent(Pieces[sampler()]);
  }

  const status = boardFilled(board)
    ? drawn <= 10
      ? "L"
      : drawn <= 24
      ? "M"
      : "S"
    : null;

  return {
    ROWS,
    COLS,
    board,
    setBoard,
    current,
    nextPiece,
    drawn,
    skips,
    setSkips,
    reset,
    status,
  };
}
