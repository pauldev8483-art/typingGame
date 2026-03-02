# Typing Game Plan

## Goals
- Build a lightweight, accuracy-first typing trainer with a modular front-end that runs as a static Vite build.
- Keep data local-first (localStorage/IndexedDB), with optional backend sync later.
- Provide clear feedback (visual/audio), history, and per-key error insights.

## Milestones
1) **Baseline typing loop**  
   - Scaffold Vite app, dark theme shell, modular JS structure.  
   - Render target text, track caret position, capture keystrokes, show per-letter correctness, compute accuracy and WPM.  
   - Gate scoring on accuracy-first (no speed reward for mistakes).  
2) **Feedback polish**  
   - Current-letter highlight, error shake, success flashes; simple sound cues for hit/miss/end via a tiny audio helper.  
3) **Scoring model**  
   - Word scores and streak/combos only when accuracy stays above threshold; store detailed errors (key, index, word).  
4) **Results & history**  
   - Session summary card; session list; charts for accuracy/WPM over time; per-key error heatmap/table.  
5) **Content modes & settings**  
   - Random words, quotes, code snippets; selectable difficulty/time/length; optional AI-generated text via pluggable fetch (stubbed offline).  
6) **Persistence & export**  
   - Local reset, export/import JSON; optional backend API (Django/SQLite) for syncing while keeping static front-end functional.

## Stack & structure
- Build: Vite (vanilla, ES modules).  
- UI: Lightweight CSS (can add Tailwind later), custom theme tokens.  
- Animations: CSS transitions; optional `anime.js` for richer bursts.  
- Sound: `howler.js` (if added).  
- Charts: `Chart.js` (or `uPlot` if lighter).  
- Data: Start with `localStorage`; upgrade to IndexedDB via `idb` wrapper if needed.  
- Suggested modules: `state/typingSession.js`, `logic/textSources.js`, `logic/metrics.js`, `ui/renderers.js`, `ui/anim.js`, `storage/sessionStore.js`, `audio/sfx.js`.
