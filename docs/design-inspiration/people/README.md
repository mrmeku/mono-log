# People Screen — Design Inspiration

The People screen is novel to Mono Log — no existing app does exactly this. It shows a list of tracked people, each linking to a re-distilled feed of entries mentioning them. The closest analog is Day One's tag-filtered timeline.

## Day One — Tag-filtered timeline (closest analog)

Day One's timeline can be filtered by tags, producing a focused feed of entries matching a specific label. This is the closest pattern to Mono Log's per-person entry feed.

- **day-one-list-view.png** — The list/timeline view showing entries as preview cards with metadata
- **day-one-timeline-ios.png** — Full iOS screenshot of the timeline view, showing chronological entry cards with text previews, timestamps, and media indicators
- **day-one-journals.png** — The journal switcher/list view, showing how Day One organizes entries into named containers (analogous to our people list being a list of named entities)

**What to take**: The entry card format for the per-person feed (text preview, timestamp, optional media). The chronological list layout. The clean card design with rounded corners and generous whitespace. The journal sidebar/list as a model for the people list (simple rows with names and counts).

## Design notes

The People list itself is intentionally simple — a standard list of names with entry counts or last-mentioned dates. The innovation is in the re-distillation (showing only the parts of each entry relevant to that person), not in the UI. Keep the list view straightforward and invest design effort in the re-distilled entry cards.
