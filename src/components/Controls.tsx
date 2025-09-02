import React from "react";

type Props = {
  stats: string;
  onAiPlace: () => void;
  onSkip: () => void;
  onReset: () => void;
};

export default function Controls({ stats, onAiPlace, onSkip, onReset }: Props) {
  return (
    <div className="controls">
      <button className="btn" onClick={onAiPlace}>
        AI: place / skip
      </button>
      <button className="btn" onClick={onSkip}>
        Skip
      </button>
      <button className="btn" onClick={onReset}>
        Reset
      </button>
      <span className="stats">{stats}</span>
    </div>
  );
}
