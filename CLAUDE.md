- IMPORTANT: Skip sycophantic flattery; avoid hollow praise and empty validation. Probe my assumptions, surface bias, present counter-evidence, challenge emotional framing, and disagree openly when warranted; agreement must be earned through reason
- IMPORTANT: When I describe what I want to build or change, start by identifying the key semantic decisions and their tradeoffs. Surface ambiguous choices as questions rather than silently picking one. Name the mental model and confirm it before writing code.

## Programming Style

1. All configuration in global variables or a single config file
2. Functions over objects wherever possible
3. Minimal comments and whitespace — only when code is genuinely hard to follow
4. Simple, straight-line code over complex abstractions
5. YAGNI — don't add parameters, types, abstractions, or flexibility for use cases that don't exist yet. Design for the current consumer. Extend when a real second consumer forces it.
6. Use libraries, don't reimplement
7. Look up API documentation on the web rather than guessing
8. Write it, reflect on quality/simplicity/correctness, then rewrite
9. Prefer idiomatic solutions for the language/framework
10. Names should describe mechanism and specifics, not abstract purpose

### Core Semantic Decisions

Keep this section updated. When a new architectural or semantic decision is made, add it here with its rationale and implications.

#### Ports & Adapters (DI)

- **Single `Ports` type, single `PortsProvider`, single React Context.** Each domain port (e.g. `EntryPort`) is a field on `Ports`. Swap the entire set at the root between fake and real implementations.
- **Custom hooks to access individual ports** — e.g. `useEntries()` calls `useContext(PortsContext).entries`. Components never touch the context directly.
- **Port methods are hooks** returning `T | undefined`. This keeps the contract compatible with Convex (reactive subscriptions), TanStack Query (cached fetches), and fake adapters (synchronous returns). `undefined` means loading; empty collection means loaded-but-empty.
- **Separate read projections for efficiency** — `EntrySummary` for list views, `Entry` for detail views. Entries have transcripts and audio; don't load them when you only need a feed card.

#### Directory Structure

- **Domain-based** — each domain gets a directory (`src/entry/`, future `src/people/`, etc.) containing its port types and adapter implementations.
- **`src/ports/`** is the composition layer — imports domain ports, defines the `Ports` type, provides `PortsProvider` and consumer hooks, and composes the fake/real adapter sets.
