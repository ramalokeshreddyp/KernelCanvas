# ProcessOS

Interactive Operating System Simulator built to explain scheduling, memory, paging, and deadlock behavior with live visual feedback.

## Project Overview

ProcessOS transforms OS theory into an interactive simulator where users can create workloads, run classic algorithms, and inspect outcomes through Gantt timelines, metrics panels, and monitoring charts.

Primary goals:
- Make operating system concepts tangible and visual
- Keep algorithm execution deterministic and testable
- Provide a clean, scalable frontend architecture for future full-stack expansion

## Experience Snapshot

| Area | What You Get |
|---|---|
| Scheduling | FCFS, SJF, Round Robin, Priority |
| Memory Allocation | First Fit, Best Fit, Worst Fit |
| Page Replacement | FIFO, LRU, Optimal |
| Deadlock | Safety and cycle detection simulation |
| Visualization | Gantt animation, process table, health charts |
| Quality | Type-safe contracts, test suite, lint checks |

## System Map

```mermaid
flowchart LR
  U[User] --> UI[React UI]
  UI --> CTX[Simulation Context]
  CTX --> SCH[Scheduler Engine]
  CTX --> MEM[Memory Engine]
  CTX --> PAG[Paging Engine]
  CTX --> DL[Deadlock Engine]
  SCH --> VIZ[Charts and Gantt]
  MEM --> VIZ
  PAG --> VIZ
  DL --> VIZ
```

## Tech Stack

| Layer | Technology | Why It Was Chosen |
|---|---|---|
| Frontend | React 18 + TypeScript | Component model + strong type safety |
| Build Tooling | Vite 5 | Fast dev server and production build performance |
| Styling | Tailwind CSS + shadcn/ui + Radix | Rapid UI composition with consistent primitives |
| Visualization | Chart.js + react-chartjs-2 + D3 | Practical charting with flexible data transforms |
| State/Fetching | React Context + React Query | Shared state + predictable async boundaries |
| Testing | Vitest + Testing Library | Fast unit/component coverage |
| Quality | ESLint | Static checks for maintainability |

## Folder Organization

```text
PLACEMENT/
  public/
  shared/
    types/
      simulation.models.ts
  src/
    components/
      layout/
      ui/
    context/
    engine/
    hooks/
    lib/
    pages/
      modules/
    test/
    App.tsx
    main.tsx
    index.css
  architecture.md
  projectdocumentation.md
  README.md
  package.json
```

## Workflow

```mermaid
flowchart TD
  A[Create Process Set] --> B[Choose Module and Algorithm]
  B --> C[Execute Simulation]
  C --> D[Engine Computes Results]
  D --> E[Context Updates Shared State]
  E --> F[UI Renders Timeline and Metrics]
  F --> G[User Compares Outcomes]
```

## Execution Flow Diagram

```mermaid
sequenceDiagram
  participant User
  participant View as React View
  participant Context as Simulation Context
  participant Engine as Algorithm Engine
  participant Charts as Visual Components

  User->>View: Submit workload parameters
  View->>Context: Dispatch typed action
  Context->>Engine: Execute selected algorithm
  Engine-->>Context: Return result and metrics
  Context-->>Charts: Publish updated simulation state
  Charts-->>User: Render timeline and analysis
```

## Route-Level Navigation Flow

```mermaid
flowchart LR
  H["/"] --> S["/scheduling"]
  H --> M["/memory"]
  H --> P["/paging"]
  H --> D["/deadlock"]
  H --> B["/dashboard"]
```

## Local Setup and Installation

### Prerequisites
- Node.js `>=18`
- npm `>=9`

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

### Build Production Artifacts

```bash
npm run build
```

### Run Test Suite

```bash
npm run test
```

### Run Lint Checks

```bash
npm run lint
```

### Full Verification Pipeline

```bash
npm run verify:all
```

## Command Matrix

| Goal | Command |
|---|---|
| Start local app | `npm run dev` |
| Execute tests | `npm run test` |
| Run lint checks | `npm run lint` |
| Build for production | `npm run build` |
| End-to-end verification | `npm run verify:all` |

## Usage Instructions

1. Open the app and navigate to a simulation module.
2. Add process inputs such as arrival time, burst time, priority, and memory demand.
3. Select an algorithm.
4. Run the simulation.
5. Inspect Gantt timeline, metrics, and charts.
6. Switch algorithms for the same workload and compare results.

## Verification Flow

```mermaid
flowchart TD
  I[Install Dependencies] --> T[Run Test Suite]
  T --> L[Run Lint]
  L --> B[Build Production Bundle]
  B --> M[Manual Scenario Validation]
  M --> R[Release Ready]
```

## Scope Clarity

Current implementation:
- Frontend simulator
- Algorithm engines
- Shared types
- Automated tests and build pipeline

Not currently implemented:
- Backend API server
- Database persistence

## Documentation Index

- `README.md`: onboarding, setup, usage, execution visuals
- `architecture.md`: architecture model, design rationale, integration map
- `projectdocumentation.md`: complete engineering documentation and validation strategy
