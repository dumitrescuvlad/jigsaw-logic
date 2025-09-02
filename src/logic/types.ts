// Board cell: 0 = empty, 1 = filled
export type Cell = 0 | 1;
export type Board = Cell[][]; // [row][col] => 4x6 grid
export type Coord = { r: number; c: number };

// All the piece IDs from Metin2 Fishing Jigsaw
export type PieceId =
  | "L3_A" // small L (└ shape, 3 cells)
  | "L3_B" // small L mirrored (┌ shape, 3 cells)
  | "O2" // 2x2 square
  | "I3_V" // vertical bar (3 cells)
  | "L4" // big L (4 cells)
  | "MONO" // single cell
  | "DELUXE"; // 2x3 block (from deluxe chest)

// Shape = list of relative coordinates from the piece's anchor (0,0)
export type Shape = Coord[];

// Piece definition
export interface PieceDef {
  id: PieceId;
  color: string; // display color
  shape: Shape; // local offsets
  size: number; // number of cells
}

// Distribution of pieces when drawing randomly
export interface Distribution {
  weights: Partial<Record<PieceId, number>>; // relative weights of pieces
  deluxeChancePerDraw: number; // chance of deluxe piece
}

// Track stats of the playthrough
export interface StepStats {
  placed: boolean;
  skipped: boolean;
  usedPieces: number;
  skips: number;
}
