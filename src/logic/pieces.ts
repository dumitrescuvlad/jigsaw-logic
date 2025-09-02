import type { PieceDef, PieceId, Shape } from "./types";

const S = (coords: [number, number][]): Shape =>
  coords.map(([r, c]) => ({ r, c }));

export const Pieces: Record<PieceId, PieceDef> = {
  L3_A: {
    id: "L3_A",
    color: "#4ade80",
    shape: S([
      [0, 0],
      [1, 0],
      [1, 1],
    ]),
    size: 3,
  },
  L3_B: {
    id: "L3_B",
    color: "#fde047",
    shape: S([
      [0, 0],
      [0, 1],
      [1, 1],
    ]),
    size: 3,
  },
  O2: {
    id: "O2",
    color: "#67e8f9",
    shape: S([
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ]),
    size: 4,
  },
  I3_V: {
    id: "I3_V",
    color: "#60a5fa",
    shape: S([
      [0, 0],
      [1, 0],
      [2, 0],
    ]),
    size: 3,
  },
  L4: {
    id: "L4",
    color: "#fb7185",
    shape: S([
      [0, 0],
      [0, 1],
      [0, 2],
      [1, 0],
    ]),
    size: 4,
  },
  MONO: { id: "MONO", color: "#fbbf24", shape: S([[0, 0]]), size: 1 },
  DELUXE: {
    id: "DELUXE",
    color: "#d946ef",
    shape: S([
      [0, 0],
      [0, 1],
      [0, 2],
      [1, 0],
      [1, 1],
      [1, 2],
    ]),
    size: 6,
  },
};

export const DefaultDistribution = {
  weights: { L3_A: 1, L3_B: 1, O2: 1, I3_V: 1, L4: 1, MONO: 1 },
  deluxeChancePerDraw: 0,
} as const;
