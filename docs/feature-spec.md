# Mono Log — Feature Spec (v1)

## Design Ethos

Calm, intentional, non-reactive. The app never asks for more from you. No engagement nudges, no badges, no "come back" notifications. You come to it — it doesn't come to you. Do a few things really well.

---

## Features

### 1. Record

The app's reason to exist. One-tap voice capture from the Today screen.

- Tap the record button, start talking, tap to stop
- Each recording session produces one entry — recordings are never merged or grouped
- No time limit (practical limits TBD)
- Recording should feel immediate — no setup, no prompts, no "what kind of entry is this?"

**Design influence**: Cleft's single-action recording. Apple Journal's aggressive simplicity. The record button should be the most prominent element on the Today screen, like Daylio's mood picker is the first thing you see.

### 2. Distill

Automatic, invisible processing that turns audio into text the user actually wants to read.

**Pipeline**:
1. **Transcription** — speech-to-text (on-device or cloud TBD)
2. **Restructuring** — LLM takes the raw transcript and produces a distilled Markdown document
3. **Entity extraction** — names are identified and added to the people candidates list

**Distillation output** (see [distillation-style.md](distillation-style.md)):
- Context-dependent Markdown — headings, bullets, paragraphs chosen based on content
- Reorganized, not just cleaned up — related thoughts clustered even if spoken out of order
- Faithful to what was said — reflects, doesn't coach or editorialize
- Concise — a 30-minute ramble becomes something scannable in under a minute

**What the user experiences**: they stop recording, wait briefly, and see their distilled entry. The transcript is available behind a toggle. Audio is stored but not surfaced.

### 3. Revisit (Calendar)

Browse your archive through time. The calendar serves memory, not planning.

**Month view**:
- Standard month grid with indicators on days that have entries
- Tap a day to see that day's entries as a list
- Navigation between months via swipe or header controls
- Design influence: Day One's calendar (entry dots), Diarium's calendar-as-home-screen

**Day view**:
- A single day's entries listed chronologically
- Each entry shows its distilled summary as a preview card (first few lines, timestamp)
- Tap to open Entry Detail
- Today view is a special case of this — it's the day view for the current date, with the record button

**Future: temporal summarization**:
- The calendar is architected to eventually support "summarize this week/month" — selecting a time range and getting an LLM-generated distillation of that period
- This is out of scope for v1 but the screen architecture should not preclude it

**Design influence**: Fantastical's temporal zooming (day → week → month → year) as an aspiration for future iterations. Day One and Diarium's calendar-as-navigation-into-past for v1.

### 4. People (First Lens)

A curated list of people in your life, as an axis for exploring your archive.

**Candidates list**:
- Names auto-extracted from transcripts during distillation
- Accumulate silently — no notifications, no prompts
- Accessible from the People screen as a secondary/management view

**Tracked people**:
- User promotes candidates to the tracked list on their own terms
- Each tracked person shows all entries where they appear, chronologically
- Entries viewed through a person are **re-distilled with that person in mind** — only the relevant parts of an entry surface, not the full distillation

**Architectural note**: People is the first instance of a "lens" — a structured question applied across the archive. The underlying pipeline (question + entries → re-distilled results) should be built generally, even though v1 only ships the People lens. See [vision.md](vision.md) > Lenses.

**Design influence**: No direct analog in the audit — this is novel to Mono Log. The list-of-people UI is straightforward (a simple list view). The per-person entry feed resembles Day One's tag-filtered timeline.

---

## Screens

### Today (Home)

- **Purpose**: Capture-first landing screen
- **Content**: Record button (prominent, primary action), today's entries listed below if any exist
- **Navigation**: Tab bar or equivalent to reach Calendar and People
- **Empty state**: Just the record button and an invitation to talk. No onboarding wizard, no tips carousel.
- **Design influence**: Cleft's record-forward home. Apple Journal's single-screen simplicity. The record button should have the visual weight of Daylio's mood selector — it's the thing you came here to do.

### Entry Detail

- **Purpose**: Read a single distilled entry
- **Content**: Distilled Markdown output, timestamp, duration indicator
- **Toggle**: Switch to raw transcript view (like Cleft's transcript toggle)
- **Audio**: Not surfaced in UI — stored in background
- **Design influence**: Cleft's note view. Day One's entry detail (clean, full-screen, metadata in header).

### Calendar

- **Purpose**: Temporal navigation into the archive
- **Content**: Month grid with entry indicators. Tap a day to see its entries.
- **Navigation**: Swipe between months, tap a day to drill into day view
- **Future-ready**: Architecture should support week view and temporal range summarization without a redesign
- **Design influence**: Day One's calendar (dots on days with entries), Diarium's calendar-as-home. Fantastical's temporal zoom hierarchy as a north star for future iterations.

### People

- **Purpose**: Browse your archive through the people in your life
- **Content**: List of tracked people, each showing entry count or last-mentioned date. Tap a person to see their re-distilled entry feed.
- **Secondary view**: Candidates list for promoting new people
- **Design influence**: Novel to Mono Log. The list itself is simple — the innovation is in the re-distillation, not the UI.

---

## What Is Explicitly Out of Scope for v1

- Search / querying
- Proactive surfacing (On This Day, notifications, insights)
- AI chat / "ask your journal"
- Export / integrations
- Mood tracking
- Tags / manual categorization
- Templates / prompts
- Map view
- Media attachments (photos, etc.) — voice only
- Week view / temporal summarization (architecture should support it, UI deferred)
- Additional lenses beyond People
