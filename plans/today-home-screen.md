# Today Home Screen — Implementation Plan

## Context

The app's home screen (`src/app/index.tsx`) currently shows Expo placeholder content. We're replacing it with the Today Home screen — a scrollable reverse-chronological feed of voice entry cards grouped by date, with a floating record button. Visual reference: Apple Journal's single-screen simplicity adapted for voice-only entries.

The existing tab bar (`NativeTabs` in `src/components/app-tabs.tsx`) stays as-is — we're only replacing the Home tab's content.

---

## Design Decisions Summary

| Decision | Choice |
|----------|--------|
| Feed scope | Recent history (scrolls back through past entries) |
| Date grouping | Today → Yesterday → This Week → Last Week → by month |
| Header | Large "Today" title + date subtitle, collapsing on scroll |
| Header action | Nothing (future: search/filter) |
| Entry cards | Title + text preview + timestamp · duration + people chips |
| Card style | Elevated cards (HeroUI Card default variant — surface + surface-shadow) |
| Record button | Small floating FAB, bottom-right, filled circle icon, accent color |
| Empty state | Spacious + "What's on your mind?" text hint |
| Data layer | Ports and adapters — typed interfaces with mock implementation |
| Colors | HeroUI semantic tokens only — never hardcoded values |

---

## New Files

### `src/data/entry-port.ts` — Entry model + port interface

```typescript
type EntryStatus = 'recording' | 'transcribing' | 'distilling' | 'complete'

type Entry = {
  id: string
  title: string              // Auto-generated from distillation
  textPreview: string        // First 2-3 lines of distilled output
  timestamp: Date
  durationSeconds: number
  people: string[]
  status: EntryStatus
}

type EntryPort = {
  getRecentEntries(): Promise<Entry[]>
}
```

- `textPreview` is a separate field (not truncated from full markdown client-side) — the port only returns what the screen needs
- `status` included for future in-progress entry states; mock data uses `'complete'`

### `src/data/mock-entry-adapter.ts` — Fake data adapter

`createMockEntryAdapter(): EntryPort` returning static entries spanning ~3 weeks:
- 2-3 entries today (March 14, 2026)
- 1-2 entries yesterday
- 1 entry earlier this week
- 2 entries last week
- 3 entries in February 2026
- 1 entry in January 2026

Realistic titles/previews in distillation style. People arrays 0-3 names. Durations 45s–25min.

### `src/lib/group-entries-by-date.ts` — Pure date grouping function

```typescript
type DateSection = {
  label: string    // "Today" | "Yesterday" | "This Week" | "Last Week" | "February 2026"
  entries: Entry[]
}

function groupEntriesByDate(entries: Entry[], now?: Date): DateSection[]
```

Algorithm:
1. Compute `startOfToday`, `startOfYesterday`, `startOfThisWeek` (Sunday), `startOfLastWeek`
2. Sort entries descending by timestamp
3. Bucket each entry into first matching group
4. Return sections in display order, skip empty sections
5. Native `Date` APIs only — no external date library

### `src/components/entry-card.tsx` — Single entry card

Uses HeroUI `Card` (default variant) + `Chip` (secondary variant, for people names):

```
Card (default variant → bg-surface + surface-shadow)
  └── Card.Body
        ├── Card.Title → entry.title
        ├── Card.Description (numberOfLines={3}) → entry.textPreview
        ├── View (flex-row) → "9:14 AM · 4m 32s" in text-muted
        └── View (flex-row, flex-wrap) → [Chip "Sarah"] [Chip "Will"]
```

- Time/duration formatting as simple helper functions within the file
- No `onPress` yet (Entry Detail screen doesn't exist)

### `src/components/date-section-header.tsx` — Section label

Simple `Text` rendering the section label (e.g., "Today", "Last Week", "February 2026") in `text-foreground` with semibold weight.

---

## Modified Files

### `src/app/index.tsx` — Complete rewrite

Component hierarchy:

```
HomeScreen
  ├── SmallHeader (absolute, z-10, fades in on scroll)
  │     └── SafeAreaView → Text "Today" (17pt semibold)
  ├── Animated.ScrollView
  │     ├── SafeAreaView padding-top
  │     ├── LargeHeader (scrolls with content)
  │     │     ├── Text "Today" (34pt bold, text-foreground)
  │     │     └── Text "Saturday, March 14" (text-muted)
  │     ├── DateSectionHeader + EntryCard[] (for each section)
  │     └── OR EmptyState ("What's on your mind?" centered, text-muted)
  │     └── bottom padding for record button clearance
  └── RecordButton (absolute, bottom-right, z-10)
```

**Collapsing header** (react-native-reanimated, already installed):
- `useAnimatedScrollHandler` tracks scroll offset in a `useSharedValue`
- Large header: opacity interpolates 1→0 over 0→60px scroll
- Small header: opacity interpolates 0→1 (inverse), positioned absolutely at top with `bg-background`
- `expo-glass-effect` (already installed) can be used for frosted small header — defer to polish step

**Record button**:
- HeroUI `Button` with `isIconOnly`, `variant="primary"`, circular
- Inner element: a small filled circle (View with `rounded-full bg-accent-foreground`) — the universal record symbol
- Positioned `absolute bottom-8 right-6` (adjusted for `BottomTabInset`)

**Data loading**:
```typescript
const [entries, setEntries] = useState<Entry[]>([])
useEffect(() => { adapter.getRecentEntries().then(setEntries) }, [])
const sections = groupEntriesByDate(entries)
```

---

## Implementation Order

1. **Data layer** — `entry-port.ts` + `mock-entry-adapter.ts`
2. **Grouping logic** — `group-entries-by-date.ts`
3. **Leaf components** — `entry-card.tsx` + `date-section-header.tsx`
4. **Screen (basic)** — Rewrite `index.tsx` with plain ScrollView, mock data, cards, FAB, empty state. Verify rendering.
5. **Collapsing header** — Upgrade to Animated.ScrollView + reanimated interpolation for large/small header transition.
6. **Polish** — Glass effect on collapsed header, dark mode verification, spacing refinements.

## No New Dependencies

Everything needed is already installed: `react-native-reanimated`, `expo-symbols`, `heroui-native`, `react-native-safe-area-context`, `expo-glass-effect`.

---

## Visual Feedback Loop

After each implementation step, capture an iOS simulator screenshot to verify rendering:

```bash
xcrun simctl io booted screenshot /tmp/today-home.png
```

Then read the screenshot with the Read tool to visually inspect layout, spacing, colors, and component composition. Iterate based on what we see.

The app must be running on the iOS simulator first (`npx expo run:ios` or press `i` from the Expo dev server).

## Verification Checklist

1. Feed shows mock entries grouped under correct date headers (Today, Yesterday, etc.)
2. Scrolling collapses "Today" header into small inline header
3. Entry cards show title, preview text, time · duration, and people chips
4. Empty state renders when no entries (temporarily clear mock data)
5. Record FAB is visible and positioned correctly above tab bar
6. Dark mode — all elements use semantic tokens, no visual artifacts
7. `bg-background` canvas, `bg-surface` cards with `surface-shadow` elevation distinction
