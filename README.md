# Learner

> Interactive learning surface and domain pack built on Episteme's cognitive graph infrastructure.

Learner provides the interaction surface where inquiry turns into persistent, evolving understanding:
- **`packages/domain-learn`**: The Learn domain pack (vocabulary, node types, edge types, cognitive state dimensions, guards, and hybrid retriever).
- **`apps/learn`**: The Learn interaction surface (terminal CLI + local Web interface).

## Setup & Quick Start

Learner runs against the Episteme graph primitives via local monorepo links.

```bash
pnpm install
pnpm build
pnpm check              # typecheck + lint + tests
pnpm learn:web          # start the local web interface (default http://127.0.0.1:4321)
# or
pnpm learn              # interactive terminal session
```

## Structure

```text
learner/
├── apps/
│   └── learn/           Interactive surface: CLI & Web server
├── packages/
│   └── domain-learn/    Domain pack: node/edge definitions, guards, hybrid retrieval
└── tests/               Integration test suite
```
