# 🎣 Fishing Jigsaw Solver (React + Vite + TypeScript)

A browser-based clone of the **Metin2 Fishing Jigsaw** mini-game with an integrated **AI solver**.  
This project mimics the original event puzzle (4×6 grid, fixed-orientation pieces, deluxe piece support) and adds a smart placement strategy to minimize wasted resources.

---

## ✨ Features

- 🧩 **Accurate piece set**  
  Includes all 6 standard pieces + deluxe 2×3 piece.

- 🎮 **Interactive gameplay**

  - Click cells on the board to manually place the current piece.
  - Skip pieces you don’t want.
  - Reset to start a new puzzle anytime.

- 🤖 **AI solver**

  - Uses **Monte-Carlo expectimax** with heuristics.
  - Evaluates whether to place or skip each piece.
  - Tries to minimize total pieces used (≤10 best reward).

- ⚡ **Modern stack**  
  Built with **React 18 + Vite + TypeScript** for a fast and responsive web experience.

---

## 🖼️ Screenshots

_(Add your screenshots here once you run the app, e.g. board with pieces, AI solving, etc.)_

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/dumitrescuvlad/jigsaw-logic
cd fishing-jigsaw-solver
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start dev server

```bash
npm run dev
```

## 📂 Project Structure

```
src/
  App.tsx              # Main app entry
  main.tsx             # React/Vite bootstrap
  index.css            # Styles
  components/          # UI components (Board, Controls, NextPiece)
  hooks/               # Custom hook: usePuzzle
  logic/               # Core puzzle logic
    ai.ts              # AI solver
    board.ts           # Board operations & heuristics
    pieces.ts          # Piece definitions & distribution
    types.ts           # Shared types
```

---

## 🧠 AI Solver

The AI evaluates each piece using a **rollout simulation**:

- Runs multiple random futures (Monte-Carlo rollouts).
- Scores boards based on:
  - ✅ Fewer empty cells
  - ❌ Isolated 1-cell holes
  - ❌ Fragmentation (too many empty regions)
  - ❌ Awkward 3-cell vertical gaps
- Penalizes skips slightly (to avoid wasting too much).
- Chooses **place vs skip** with the best expected outcome.

---

## 🛠️ Customization

- Adjust piece probabilities in `src/logic/pieces.ts`.
- Enable deluxe pieces by setting:

```ts
deluxeChancePerDraw: 0.05;
```

- Tweak AI parameters in `src/logic/ai.ts` (lookahead, rollouts, skip penalty).

---

## 📜 License

MIT License © 2025 — feel free to use, modify, and share.

---

## 🙌 Credits

- Inspired by **Metin2 Gameforge Fishing Jigsaw Event**
- Built with ❤️ using React + Vite
