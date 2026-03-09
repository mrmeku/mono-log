# Mono Log

## Vision

Mono Log lets you think out loud. There's something that happens when you speak — thoughts take shape differently than when you write. You hear yourself say things you didn't know you were thinking.

The app captures that raw, spoken processing, then distills it back to you as text. Over time, it becomes a living archive of how you've thought and what you've lived through — browsable, zoomable, structured around time and people.

The input is your voice. The output is clarity, both in the moment and in retrospect.

## Core Principle

Speaking is immediate and ephemeral. Mono Log makes it lasting and structured.

Do a few things really well. Don't do too much.

## The Core Loop

- **Record**: Dead simple capture. Open the app and talk — about anything, for any length. Each recording is its own entry. A 30-minute vent and a 2-minute idea are separate things with separate meaning.
- **Distill**: Every entry is transcribed and intelligently restructured into scannable text — faithful to what was said, reorganized for clarity. Not a template, not a cleanup. A mirror that's easier to read than the original. (See [distillation-style.md](distillation-style.md) for details.)
- **Revisit**: Browse your entries through the calendar. Day view, week view, month view — temporal zooming through your own thinking. The calendar serves memory, not planning.
- **People**: A separate axis for exploring your archive by the people in your life. Auto-extracted from transcripts, but user-correctable — you decide who matters enough to track.

## Primary Entity

The atom is the **entry**: a single recording session and its distillation. Not a day, not a topic — one continuous recording produces one entry with one distilled output. Multiple entries can exist on the same day and they stay separate.

Audio is stored as a primary source (for future re-transcription as services improve) but is not a UI surface. The user's experience of an entry is its text.

## Lenses: Structured Questions Over Entries

People is not a standalone feature — it's the first instance of a **lens**: a structured question applied across the archive. Architecturally, a lens is a question an LLM answers for each entry. "People" is the lens "What did I say about [person]?" applied to every entry where that person appears, with results re-summarized through that person's perspective to increase signal-to-noise.

This means entries viewed through a lens are not just filtered — they're **re-distilled with the question in mind**. An entry where you talked about Will for 2 minutes inside a 20-minute ramble should surface only the Will-relevant parts when viewed through the Will lens.

For v1, People is the only lens, with a dedicated screen and curation UX. But the underlying architecture should treat it as a specific case of the general pattern, so future lenses (themes, decisions, open questions) can reuse the same pipeline.

### People Curation

Names are auto-extracted from transcripts and accumulate silently as candidates. The user promotes candidates to their tracked People list on their own terms — no nudges, no badges, no "new person detected" prompts. The app never asks for more engagement.

## What This App Is Not

- Not proactive. The app doesn't surface memories, push insights, or tell you patterns. You come to it — it doesn't come to you.
- Not a query engine. No AI chat, no "ask your journal." Exploration is browsing, not searching.
- Not a notes tool. Entries are personal, spoken, reflective. Export and integrations are not the point.

## Screens

- **Today (Home)**: What you see when you open the app. Today's entries if any, and the record button. Capture-first — the primary action is always "start talking."
- **Entry Detail**: The distilled Markdown output of a single entry. Full transcript available behind a toggle. Audio hidden.
- **Calendar**: Month grid with entry indicators. Tap a day to see its entries. Supports day, week, and month views — temporal zooming into your archive. Design should map onto calendar metaphors people already know.
- **People**: A list of people you've chosen to track. Tap a person, see all entries where they appear, chronologically.

## Why Voice

Writing filters. Speaking flows. When you journal by talking, you access a different kind of processing — more raw, more honest, more surprising. Mono Log is built for people who think better out loud.
