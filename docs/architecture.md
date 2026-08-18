# Huyền Các v5.2 — Architecture

## Runtime flow

```text
DOM Event
  ↓
AppController (event delegation)
  ↓
Pure Model
  ├─ TarotEngine
  ├─ NumerologyCalculator
  ├─ LunarConverter
  ├─ AstrologyCalculator
  └─ DateScorer
  ↓
AppState.patch()
  ↓ only changed keys
UIManager.render()
  ↓
DOM
```

## Interaction layer

`InteractionManager` is separate from business logic and rendering. It owns pointer-based 3D tilt using one delegated `pointermove` handler and `requestAnimationFrame`. It does not run on coarse pointers or when `prefers-reduced-motion: reduce` is active.

Tarot flip/deal state is class-driven (`dealt`, `revealed`); the model only returns card data.

## Deep-analysis data

- `TarotEngine.synthesize()` returns orientation balance, dominant Major Arcana phase and symbolic tempo.
- `NumerologyCalculator.synthesis()` returns cross-metric alignment axes and a repeated-number family summary.
- `AstrologyCalculator.analyze()` returns a year/day/hour branch relation matrix and element summary.
- `DateScorer.range()` returns Top 3, score distribution, rank separation and strongest positive/caution factor.

These supplemental scores are explicitly UI/reference models. They do not claim scientific predictive accuracy.

## GitHub Pages / Service Worker

All Service Worker precache URLs resolve against `self.registration.scope`, so project-page deployments such as `username.github.io/repository/` do not accidentally request assets from the domain root.
