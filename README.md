# HR Workflow Designer — Tredence Case Study

A visual, drag-and-drop HR workflow designer built with **React**, **TypeScript**, **React Flow**, and **Zustand**.

---

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

---

## 🏗️ Architecture

```
src/
├── api/
│   └── mockApi.ts          # Mock GET /automations + POST /simulate
├── components/
│   ├── nodes/              # Custom React Flow node components
│   │   ├── StartNode.tsx
│   │   ├── TaskNode.tsx
│   │   ├── ApprovalNode.tsx
│   │   ├── AutomatedNode.tsx
│   │   └── EndNode.tsx
│   ├── forms/              # Per-node config forms (controlled components)
│   │   ├── StartNodeForm.tsx
│   │   ├── TaskNodeForm.tsx
│   │   ├── ApprovalNodeForm.tsx
│   │   ├── AutomatedNodeForm.tsx
│   │   └── EndNodeForm.tsx
│   ├── panels/             # Layout panels
│   │   ├── NodeSidebar.tsx      # Left: drag-to-add node palette
│   │   ├── NodeConfigPanel.tsx  # Right: selected node editor
│   │   └── SimulationPanel.tsx  # Right: sandbox execution timeline
│   └── ui/
│       ├── Header.tsx           # Top bar with Simulate button
│       └── WorkflowCanvas.tsx   # React Flow canvas
├── hooks/
│   ├── useSimulate.ts      # Simulation orchestration hook
│   └── useAutomations.ts   # Fetches mock automation actions
├── store/
│   └── workflowStore.ts    # Zustand global state
├── types/
│   └── workflow.ts         # All TypeScript interfaces
└── styles/
    └── index.css           # Full theme system (light + dark)
```

---

## ✅ Functional Features

### Canvas (React Flow)
- **5 node types**: Start, Task, Approval, Automated Step, End
- **Drag from sidebar** onto canvas, or click to add at a random position
- **Connect nodes** with edges via handle drag
- **Select a node** to open its config panel
- **Delete** nodes/edges via the `Delete` key or trash icon
- **MiniMap** + zoom controls + dotted background

### Node Config Forms
Each node type has a dedicated form panel (appears on selection):

| Node | Fields |
|------|--------|
| Start | Title, trigger source, key-value metadata pairs |
| Task | Title*, description, assignee, due date, custom key-value fields |
| Approval | Title, approver role (select), auto-approve threshold |
| Automated | Title, action select (from mock API), dynamic params per action |
| End | Title, completion message, show-summary toggle |

### Mock API Layer (`src/api/mockApi.ts`)
- `GET /automations` → 6 mock actions (send_email, generate_doc, send_slack, …)
- `POST /simulate` → accepts workflow graph, returns step-by-step execution log
- Validates: start node exists, end node exists, no disconnected nodes, no cycles

### Simulation Panel
- Opened via the **Simulate** button in the header
- Serializes the full graph and sends to mock `/simulate`
- Displays animated execution timeline with status badges (`Success`, `Pending`, `Error`)
- Shows validation errors clearly
- Shows total execution time

### Extra Features
- **Export** workflow as JSON file (download button)
- **Import** workflow from JSON (upload button)
- **Clear canvas** with confirmation
- **Dark / Light theme toggle** (persists across re-renders via Zustand)
- Editable workflow name in the header

---

## 🎨 Design Decisions

- **Zustand** for state — minimal boilerplate, no context drilling
- **CSS variables** for full theme switching without re-renders
- Node forms are fully **controlled components** with typed interfaces
- Mock API layer is abstracted behind `src/api/mockApi.ts` — easy to swap for real endpoints
- Node types are extensible: adding a new type only requires: a node component, a form component, an entry in the store defaults, and a nodeTypes map entry
- Simulation uses **topological sort** for deterministic execution order and cycle detection via DFS

---

## 🔮 What I'd Add With More Time

- **Undo/Redo** (React Flow has a `useUndoRedo` hook candidate)
- **Validation overlays** on nodes with red border + tooltip for missing required fields
- **Node templates** / workflow presets
- **Auto-layout** using a library like dagre
- **Backend persistence** with FastAPI + PostgreSQL
- **Real WebSocket simulation** for live step-by-step streaming
- **Branching / conditional edges** (e.g. Approval → Approved / Rejected paths)
- **Node search / filter** in the sidebar
- **Keyboard shortcuts** (Ctrl+Z, Ctrl+S, etc.)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 18 + TypeScript |
| Build | Vite |
| Canvas | React Flow v11 |
| State | Zustand |
| Styling | Plain CSS with CSS variables |
| Icons | Lucide React |
| IDs | uuid |
