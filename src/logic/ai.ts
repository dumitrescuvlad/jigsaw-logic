import type { Board, PieceId, PieceDef, Distribution } from "./types";
import { Pieces } from "./pieces";
import {
  placements,
  place,
  boardFilled,
  countIsolatedSingles,
  countAwkwardV3,
  emptyComponents,
} from "./board";

function buildSampler(dist: Distribution) {
  const ids = (Object.keys(dist.weights) as PieceId[]).filter(
    (id) => id !== "DELUXE"
  );
  const w = ids.map((id) => dist.weights[id] ?? 0);
  const total = w.reduce((a, b) => a + b, 0);
  const cum = w.map(
    (x, i) => w.slice(0, i + 1).reduce((a, b) => a + b, 0) / total
  );
  return () => {
    if (Math.random() < dist.deluxeChancePerDraw) return "DELUXE" as PieceId;
    const r = Math.random();
    const idx = cum.findIndex((x) => r <= x);
    return ids[idx >= 0 ? idx : ids.length - 1];
  };
}

export interface AiOptions {
  lookahead?: number;
  rolloutsPerMove?: number;
  skipPenalty?: number;
}
const DEFAULTS: Required<AiOptions> = {
  lookahead: 2,
  rolloutsPerMove: 32,
  skipPenalty: 0.35,
};

function scoreBoard(b: Board): number {
  if (boardFilled(b)) return 10_000;
  const empties = b.flat().filter((v) => v === 0).length;
  const iso = countIsolatedSingles(b);
  const awk = countAwkwardV3(b);
  const comps = emptyComponents(b);
  return -empties - 1.8 * iso - 0.9 * awk - 0.6 * comps;
}

export type Action =
  | { kind: "PLACE"; piece: PieceDef; r: number; c: number }
  | { kind: "SKIP"; piece: PieceDef };

export function chooseAction(
  b: Board,
  incoming: PieceDef,
  dist: Distribution,
  opts?: AiOptions
): Action {
  const cfg = { ...DEFAULTS, ...(opts ?? {}) };
  const sampler = buildSampler(dist);

  const legal = placements(b, incoming);
  const candidates: Action[] = legal.map((p) => ({
    kind: "PLACE",
    piece: incoming,
    r: p.r,
    c: p.c,
  }));
  candidates.push({ kind: "SKIP", piece: incoming });

  function rolloutScore(board: Board, depth: number): number {
    if (depth === 0 || boardFilled(board)) return scoreBoard(board);
    const nextId = sampler();
    const nextPiece = Pieces[nextId];
    const ps = placements(board, nextPiece);
    if (ps.length === 0) return scoreBoard(board);
    let best = -Infinity;
    for (const p of ps)
      best = Math.max(best, scoreBoard(place(board, nextPiece, p)));
    return best;
  }

  function simulate(a: Action): number {
    let base = b;
    let penalty = 0;
    if (a.kind === "PLACE") base = place(b, incoming, { r: a.r, c: a.c });
    else penalty = cfg.skipPenalty;

    let acc = 0;
    for (let i = 0; i < cfg.rolloutsPerMove; i++)
      acc += rolloutScore(base, cfg.lookahead);
    return acc / cfg.rolloutsPerMove - penalty;
  }

  let best = candidates[0];
  let bestScore = -Infinity;
  for (const a of candidates) {
    const s = simulate(a);
    if (s > bestScore) {
      bestScore = s;
      best = a;
    }
  }
  return best;
}
