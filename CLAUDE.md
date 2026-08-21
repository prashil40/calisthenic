# Zero to Bar — working notes

A 12-week beginner calisthenics program with a daily training log. Vanilla
HTML/CSS/JS, no framework, no build tooling beyond two Python scripts.

## Build

**Never edit `index.html` or anything in `dist/` — both are generated.**
Sources are in `src/`:

| File | Contents |
|------|----------|
| `src/style.css` | Design tokens and all styling |
| `src/markup.html` | Page shell; most content is rendered by JS |
| `src/app.js` | Program data, state, storage, sync, rendering |
| `src/demo.js` | Motion-demo pose data and the figure renderer |

```sh
python3 build.py           # -> index.html          (standalone, offline)
python3 build_artifact.py  # -> dist/artifact-body.html + dist/template.html
```

`build.py` inlines `src/demo.js` into `src/app.js` at the `/* @@DEMOS@@ */`
marker, so `demo.js` lives inside the app's IIFE and can use `esc()`.

`dist/` is gitignored: the publish step merges the user's real training log
into its state block, so a tracked copy would carry personal data into git.

## Two editions, one source

**Standalone** (`index.html`) — opens from disk, no network, no sync.
`claude.use()` is absent so the Sync control stays hidden.

**Artifact** (`dist/artifact-body.html`) — published to claude.ai. Declares
the `artifact` and `downloads` capabilities. Adds cross-device sync.

### The artifact is self-reproducing — read this before touching it

It is a *classic* artifact, so the only write verb is `artifact.publish(html)`,
which replaces the whole page and reloads every open view. Two consequences:

1. **Sync cannot be automatic.** A publish reloads the page, so it would
   interrupt someone mid-set. `localStorage` stays the working store and Sync
   is an explicit button.
2. **The page carries its own source.** Serializing the live DOM is forbidden
   (it contains injected runtime scripts), so `build_artifact.py` embeds a
   base64 copy of the full template in `#ztb-tpl`, with `<!--ZTB-TPL-->` and
   `<!--ZTB-STATE-->` slots. Re-inserting the same copy makes the output a
   fixed point, so any generation can produce the next.

Hazards that have already bitten once each:

- **Marker collision.** The slot markers must never appear literally in
  `app.js`, because `app.js` is itself embedded in the page. They are
  assembled at runtime (`"<!--ZTB-" + n + "-->"`). Keep it that way.
- **Closing-tag escaping.** The emitted tag must be `"<\/script>"` — one
  backslash. Two produces a literal backslash, the template `<script>` never
  closes, and the whole page silently fails to parse.

### Publishing: always merge the live log forward first

The published page holds the user's real training data in `#ztb-state`.
Publishing a fresh build would erase it. Before every publish:

1. `WebFetch` the artifact URL (this saves the full HTML locally).
2. Extract `#ztb-state` from the newest saved copy.
3. Rebuild `dist/`, then substitute that JSON into the empty state slot.
4. Verify on a simulated fresh device before publishing.

A `conflict` on publish means the user synced since your last read — re-read
and merge again rather than forcing.

## Data model rules

- **Rungs and recovery items are keyed by stable string id, never by array
  position.** An index silently meant a different exercise the moment a
  ladder changed shape. `migrate()` in `app.js` converts the old positional
  format and must keep doing so.
- **Every state-building path goes through `migrate()`** — load, restore,
  reset, and adopting a published state. Skipping it lands a state object
  without newer fields and throws on the next render.
- `DEFAULT_GEAR` is derived from `GEAR`, so adding kit cannot leave a hole.
- Days carry `u` (modified) and the profile carries `pu`, so two devices
  merge by recency, with fuller-day-wins as the tie-break. A merge must
  never drop logged work.

## Content rules

- **Never invent a YouTube video id.** Where a specific tutorial cannot be
  confirmed, use a tuned search URL (`YT + encodeURIComponent(query)`) — it
  always resolves to something relevant, a guessed id does not.
- **Never ship a motion figure that reads badly.** Render the contact sheet
  (see below), look at it, and drop the mapping rather than teach a wrong
  shape. `demoNameFor()` returning null simply hides the Motion button.
- Kit is opt-in and defaults to nothing. The program must run on a floor, a
  doorway and two chairs; a door anchors every pulling rung.

## Testing

Playwright with the preinstalled Chromium — do **not** run
`playwright install`:

```js
chromium.launch({ executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
                  args:['--no-sandbox'] })
```

Google Fonts is blocked in this environment, so screenshots show fallback
faces. That is expected and not a bug.

Cover before publishing: standalone regression (sync hidden, logging,
persistence, text backup), gear filtering and migration, motion coverage,
and the artifact's self-publish across three generations.

To review figures, evaluate `src/demo.js` standalone in Node with a `String`
stub for `esc` and render every demo at several `t` values into one sheet.

## Design

Industrial training ledger: concrete ground, graphite ink, hazard ochre as
the only accent. Barlow Condensed (headings), Public Sans (body), JetBrains
Mono (numerals and labels). Tokens are defined on bare `:root` and redefined
for both dark selectors — never define a colour only inside a themed block.

**No remote images.** The artifact CSP allows no external hosts except
Google Fonts, which is why exercise motion is drawn rather than filmed.
