# Architecture & Technical Decisions

## The Two-Service Boundary
The monorepo is split into two distinct services to respect the constraint of Cognee being Python-only while keeping the frontend in a modern React stack.
- `apps/web`: Next.js 15 (App Router), TypeScript, Tailwind CSS. Handles all UI, animations, and WebSocket client connections. **Never imports `cognee` directly.**
- `services/memory-engine`: FastAPI (Python). The sole owner of `cognee` integration, providing a REST API for claims submission and a WebSocket server for pushing live graph updates.

## Tech Choices
- **Frontend Framework**: Next.js 15 (App Router)
- **Styling & UI**: Tailwind CSS, shadcn/ui
- **Animation & Graphs**: Framer Motion (page transitions, micro-interactions), GSAP / Three.js / anime.js (for the force-directed graph)
- **Backend Framework**: FastAPI with Uvicorn
- **Real-time Comm**: `websockets` (Python) and native `WebSocket` API (JS)
- **Dev Runner**: Root `package.json` with `concurrently` to boot both the Next.js dev server and the FastAPI uvicorn server in a single terminal.

## Architectural Decision: Barba.js vs. Framer Motion
**Decision**: Use **Framer Motion (AnimatePresence) + View Transitions API** instead of Barba.js.
**Reasoning**: Barba.js is fantastic for orchestrating page transitions on vanilla, multi-page HTML sites. However, using it inside a React SPA (like Next.js) fights the framework's native virtual DOM and routing lifecycle. Framer Motion's `AnimatePresence` is idiomatic to React, seamlessly hooks into Next.js route changes, and provides the exact same "app-like" fluid transition capabilities without the overhead of wrestling two conflicting routers.

## API Contract Surface

### REST Endpoints (FastAPI)
- `POST /api/claims`
  - **Payload**: `{ "userId": "string", "claim": "string", "evidenceType": "string", "timestamp": "ISO8601" }`
  - **Response**: `{ "status": "received", "claimId": "string" }`
- `GET /api/verdict`
  - **Response**: `{ "verdict": "string", "confidence": 0.95, "debtors": [{ "user": "string", "amount": number }] }`

### WebSocket Events (Live Updates)
**Endpoint**: `ws://localhost:8000/ws/graph`

**Event Types (Server -> Client)**:
1. `GRAPH_INIT`: Sends the initial state of the knowledge graph.
   - **Payload**: `{ "nodes": [...], "edges": [...] }`
2. `NODE_ADDED`: Pushed when a new claim or evidence is registered.
   - **Payload**: `{ "id": "string", "label": "string", "type": "claim|evidence" }`
3. `CONFIDENCE_UPDATE`: Pushed when Cognee reranks the most likely truth.
   - **Payload**: `{ "nodeId": "string", "newConfidence": 0.88, "winner": true|false }`
