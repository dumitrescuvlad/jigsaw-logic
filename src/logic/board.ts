import type { Board, Coord, PieceDef, Cell } from "./types";

export const ROWS = 4;
export const COLS = 6;

export const emptyBoard = (): Board =>
  Array.from({ length: ROWS }, () => Array<Cell>(COLS).fill(0));

export const clone = (b: Board): Board => b.map((r) => r.slice());

export function canPlace(b: Board, piece: PieceDef, topLeft: Coord): boolean {
  for (const { r, c } of piece.shape) {
    const R = topLeft.r + r,
      C = topLeft.c + c;
    if (R < 0 || C < 0 || R >= ROWS || C >= COLS) return false;
    if (b[R][C] === 1) return false;
  }
  return true;
}

export function place(b: Board, piece: PieceDef, topLeft: Coord): Board {
  const nb = clone(b);
  for (const { r, c } of piece.shape) nb[topLeft.r + r][topLeft.c + c] = 1;
  return nb;
}

export function boardFilled(b: Board): boolean {
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++) if (b[r][c] === 0) return false;
  return true;
}

export function placements(b: Board, piece: PieceDef) {
  const out: Coord[] = [];
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
      if (canPlace(b, piece, { r, c })) out.push({ r, c });
  return out;
}

export function countIsolatedSingles(b: Board): number {
  let k = 0;
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++) {
      if (b[r][c]) continue;
      const neigh = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ]
        .map(([dr, dc]) => {
          const R = r + dr,
            C = c + dc;
          return R < 0 || C < 0 || R >= ROWS || C >= COLS ? 1 : b[R][C];
        })
        .reduce<number>((a, x) => a + x, 0);
      if (neigh >= 3) k++;
    }
  return k;
}

export function countAwkwardV3(b: Board): number {
  let bad = 0;
  for (let c = 0; c < COLS; c++)
    for (let r = 0; r <= ROWS - 3; r++) {
      const empty3 = [0, 1, 2].every((i) => b[r + i][c] === 0);
      if (!empty3) continue;
      const leftWall =
        c - 1 < 0 ? true : [0, 1, 2].every((i) => b[r + i][c - 1] === 1);
      const rightWall =
        c + 1 >= COLS ? true : [0, 1, 2].every((i) => b[r + i][c + 1] === 1);
      if (!(leftWall || rightWall)) bad++;
    }
  return bad;
}

export function emptyComponents(b: Board): number {
  const seen = Array.from({ length: ROWS }, () =>
    Array<boolean>(COLS).fill(false)
  );
  const inb = (r: number, c: number) =>
    r >= 0 && c >= 0 && r < ROWS && c < COLS;
  const dirs: Array<[number, number]> = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  let comp = 0;
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++) {
      if (b[r][c] === 1 || seen[r][c]) continue;
      comp++;
      seen[r][c] = true;
      const q: Array<[number, number]> = [[r, c]];
      while (q.length) {
        const [R, C] = q.pop()!;
        for (const [dr, dc] of dirs) {
          const nr = R + dr,
            nc = C + dc;
          if (inb(nr, nc) && !seen[nr][nc] && b[nr][nc] === 0) {
            seen[nr][nc] = true;
            q.push([nr, nc]);
          }
        }
      }
    }
  return comp;
}
