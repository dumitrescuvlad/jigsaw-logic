import type { Board as B } from "../logic/types";
import type { PieceDef } from "../logic/types";
import { ROWS, COLS, canPlace } from "../logic/board";

type Props = {
  board: B;
  current: PieceDef;
  onPlace: (r: number, c: number) => void;
};

export default function Board({ board, current, onPlace }: Props) {
  return (
    <div className="board">
      {Array.from({ length: ROWS }).map((_, r) =>
        Array.from({ length: COLS }).map((__, c) => {
          const filled = board[r][c] === 1;
          const legal = !filled && canPlace(board, current, { r, c });
          return (
            <div
              key={`${r}-${c}`}
              className={`cell ${filled ? "filled" : ""} ${
                legal ? "legal" : ""
              }`}
              onClick={() => legal && onPlace(r, c)}
              title={legal ? "Click to place piece" : ""}
            />
          );
        })
      )}
    </div>
  );
}
