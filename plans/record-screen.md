# Record Screen — Lava Lamp Orb

## Context

Mono Log needs a record screen — the active recording experience users see after tapping record. Design goal: blend voice capture (waveform, elapsed time) with meditation timer aesthetic (calm, minimal, contemplative). Inspired by Cleft's audio-reactive 3D blob, but reimagined as a **lava lamp shader orb** — a warm, glowing, organically morphing shape driven by voice amplitude, rendered via react-native-skia shaders on a warm contemplative background. Full-screen immersive takeover, no tab bar.

## Design Decisions (confirmed)

- **Visual**: Shader orb (Skia RuntimeEffect / SkSL) — lava lamp aesthetic, single morphing blob to start
- **Reactivity**: Responsive — tracks voice energy clearly, smoothed to feel organic
- **Audio**: expo-audio (new API) for recording + amplitude metering
- **Mood**: Warm + contemplative (amber/deep orange, dark warm brown background)
- **Transition**: Full-screen immersive takeover, no tab bar
- **Chrome**: Close (X) + Pause/Resume in header. No prompt text. Elapsed timer below blob. Stop button at bottom.
- **Pause**: Blob settles to calm idle (still alive, just quiet). Timer pauses.
- **Stop**: Graceful fade-out, then navigate back to begin processing.

## Layout

```
┌──────────────────────┐
│  X            Pause   │  ← header
│                        │
│      ╭──────────╮     │
│      │  lava    │     │  ← shader orb (centered, dominant)
│      │  lamp    │     │
│      │  blob    │     │
│      ╰──────────╯     │
│                        │
│        0:42            │  ← elapsed timer (M:SS)
│                        │
│         [■]            │  ← stop button
└──────────────────────┘
```

## New Dependencies

1. **`@shopify/react-native-skia`** — GPU shader rendering. Requires native rebuild.
2. **`expo-audio`** — Recording with metering. Add config plugin to `app.json`:
   ```json
   [
     "expo-audio",
     {
       "microphonePermission": "Allow Mono Log to access your microphone for voice recording."
     }
   ]
   ```

## File Changes

### Modified Files

- `src/app/_layout.tsx` — Restructure: providers wrap a `<Stack>` with `(tabs)` + `record` screens
- `app.json` — Add `expo-audio` plugin

### Moved Files

- `src/app/index.tsx` → `src/app/(tabs)/index.tsx`
- `src/app/explore.tsx` → `src/app/(tabs)/explore.tsx`

### New Files

| File                                          | Purpose                                                      |
| --------------------------------------------- | ------------------------------------------------------------ |
| `src/app/(tabs)/_layout.tsx`                  | Tabs layout — renders `AppTabs` + `AnimatedSplashOverlay`    |
| `src/app/record.tsx`                          | Record screen component — composes orb, controls, state      |
| `src/components/record/orb-shader.tsx`        | Skia Canvas + shader, takes `amplitude: SharedValue<number>` |
| `src/components/record/orb-shader-source.ts`  | SkSL shader string constant (lava lamp SDF orb)              |
| `src/components/record/use-audio-recorder.ts` | Hook: expo-audio recording + metering → SharedValue          |
| `src/components/record/use-elapsed-timer.ts`  | Hook: pause-aware elapsed time counter                       |
| `src/constants/record-theme.ts`               | Recording screen warm color palette                          |

## Key Implementation Details

### Navigation Restructuring

Current root `_layout.tsx` renders `AppTabs` directly — no Stack, so no way to present a modal. Restructure to:

- **Root `_layout.tsx`**: Keep providers (GestureHandlerRootView, ThemeProvider, HeroUINativeProvider). Add `<Stack>` with two screens:
  - `(tabs)` — `headerShown: false`
  - `record` — `presentation: 'fullScreenModal'`, `headerShown: false`
- **`(tabs)/_layout.tsx`**: Renders `AppTabs` + `AnimatedSplashOverlay`

Navigate: `router.push('/record')` to open, `router.back()` to close.

### Shader (orb-shader-source.ts)

SkSL fragment shader with three uniforms:

| Uniform       | Type     | Source                                    |
| ------------- | -------- | ----------------------------------------- |
| `iResolution` | `float2` | Canvas `onSize` SharedValue               |
| `iTime`       | `float`  | `useClock()` / 1000                       |
| `iAmplitude`  | `float`  | Normalized metering (0–1) from audio hook |

Algorithm: SDF circle with multi-octave sinusoidal distortion on the boundary. `iAmplitude` scales distortion intensity + radius. Color mapped via `smoothstep`: dark warm brown bg → deep orange-red edge → bright amber core, with exponential glow halo. Reference starting point: [animatereactnative.com orb shader](https://www.animatereactnative.com/post/orb-shader-animation-with-react-native-skia).

### Audio Pipeline (use-audio-recorder.ts)

1. `useAudioRecorder` from expo-audio with `isMeteringEnabled: true`
2. `statusListener` receives `metering` in dB (typically -160 to 0). Normalize: `clamp((metering + 60) / 60, 0, 1)`
3. Write to SharedValue with `withTiming(normalized, { duration: 100 })` for organic smoothing
4. On pause: animate amplitude to ~0.05 (calm idle, not dead)
5. On stop: animate amplitude to 0, then cleanup

### State Machine

```
idle → requesting-permission → recording ⇄ paused → stopping → (navigate back)
```

Simple `useState` — state space is too small for a reducer.

### Permissions

Check on mount → request if undetermined → proceed if granted → navigate back if denied (with brief explanation).

## Risks

| Risk                                       | Impact                                                                      | Mitigation                                                                                                   |
| ------------------------------------------ | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| **expo-audio metering callback frequency** | If < 10Hz, orb will feel laggy                                              | Test immediately in Phase 3. Fallback: poll `getStatus()` from `setInterval` at 50ms                         |
| **SkSL shader compatibility iOS/Android**  | Shader may compile on one platform, fail on other                           | Validate shader at [shaders.skia.org](https://shaders.skia.org/) before embedding. Test both platforms early |
| **NativeTabs in route group**              | `NativeTabs.Trigger name="index"` might not resolve after move to `(tabs)/` | Test immediately after restructuring in Phase 1                                                              |
| **Skia native rebuild**                    | Can't use Expo Go — need dev build                                          | Expected. Run `npx expo run:ios` after install                                                               |

## Build Order

### Phase 1: Route Scaffold (no new deps)

1. Create `(tabs)/` group — move `index.tsx` and `explore.tsx`, create `(tabs)/_layout.tsx`
2. Restructure root `_layout.tsx` to Stack with providers
3. Create placeholder `record.tsx` (colored View + back button)
4. **Verify**: tabs still work, record modal opens full-screen

### Phase 2: Shader (add Skia)

5. Install `@shopify/react-native-skia`, rebuild native
6. Create `orb-shader-source.ts` with SkSL shader, `record-theme.ts` with warm colors
7. Create `orb-shader.tsx` with Canvas + Shader + `useClock()`, hardcoded amplitude
8. **Verify**: animated morphing orb renders on screen

### Phase 3: Audio (add expo-audio)

9. Install `expo-audio`, add plugin, rebuild native
10. Create `use-audio-recorder.ts` — test metering frequency
11. Connect amplitude SharedValue to shader uniform
12. **Verify**: orb reacts to voice input

### Phase 4: Controls + Polish

13. Create `recording-controls.tsx` (header, stop button)
14. Create `use-elapsed-timer.ts`
15. Wire full state machine in `record.tsx`
16. Style with `record-theme.ts` colors
17. Handle permission denied state
18. **Verify**: full record flow works end-to-end (open → record → pause → resume → stop → close)

### Phase 5: Iterate

19. Tune shader aesthetics (colors, distortion, glow)
20. Tune metering smoothing (timing curve, decay)
21. Add fade-out animation on stop
22. Explore multi-blob shader if single blob feels too simple

## Verification

1. Route restructuring: existing tab navigation still works, no regressions
2. Record screen opens as full-screen modal from home, closes with X
3. Shader orb renders and animates with time-based morphing
4. Speaking into mic causes visible orb deformation/glow increase
5. Pause settles orb to idle, timer stops; resume restarts both
6. Stop fades out gracefully and navigates back
7. Permission denied shows explanation and navigates back
8. Works on both iOS and Android
