import type { PieceDef } from "../logic/types";

export default function NextPiece({ piece }: { piece: PieceDef }) {
  const maxR = Math.max(...piece.shape.map((p) => p.r));
  const maxC = Math.max(...piece.shape.map((p) => p.c));

  return (
    <div style={{ display: "inline-block" }}>
      {Array.from({ length: maxR + 1 }).map((_, r) => (
        <div key={r} style={{ display: "flex" }}>
          {Array.from({ length: maxC + 1 }).map((__, c) => {
            const on = piece.shape.some((p) => p.r === r && p.c === c);
            return (
              <div
                key={c}
                style={{
                  width: 22,
                  height: 22,
                  margin: 2,
                  borderRadius: 6,
                  border: "1px solid #374151",
                  background: on ? piece.color : "transparent",
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
