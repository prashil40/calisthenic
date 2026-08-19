# Zero to Bar

A 12-week beginner calisthenics program with a daily training log, streak
tracking and progression ladders. One HTML file, no build step, no
dependencies, no server — open `index.html` and start.

## Using it

Open `index.html` in any browser, or host it anywhere static (GitHub Pages
works: Settings → Pages → deploy from the `main` branch, root folder). On a
phone, add it to your home screen and it behaves like an app.

Your log is written to `localStorage` in that browser. Nothing is uploaded
and there is no account. That also means **clearing site data wipes the
log** — use *Program → Your data → Export backup* now and then, and *Import
backup* to move to a new phone or browser.

## The program

A seven-day cycle, repeated for twelve weeks:

| Day | Session | Focus |
|-----|---------|-------|
| Mon | Session A | Push emphasis — push, dip, squat, core |
| Tue | Mobility | Dead hang, deep squat, shoulders, wrists |
| Wed | Session B | Pull emphasis — pull, hinge, push, side plank |
| Thu | Mobility | As Tuesday |
| Fri | Session C | Legs and core — squat, hinge, core, pull |
| Sat | Mobility | As Tuesday |
| Sun | Rest | Sleep, protein, a walk |

Three strength sessions a week is where beginners actually gain; muscle and
connective tissue rebuild on the off days. The other four days still get a
checkbox so the daily habit never breaks and the streak survives.

**Progression is by leverage, not weight.** Each of the seven movement
patterns — push, pull, squat, hinge, dip, core, side — has a ladder of three
to five variations. When you clear the top of the rep range on every set for
two sessions running, the app flags *Ready to level up*; step up a rung and
let the reps drop again. Rep targets themselves rise every second week.

## What it tracks

- **Streak** — consecutive days with anything logged, rest days included,
  drawn as tally marks.
- **Per-set logging** — every set of every exercise, with the week's target
  shown as a ghost value in the field. Saves as you type.
- **12-week calendar** — one square per day, shaded by volume.
- **Best single set** per movement, all-time, with a sparkline of your best
  set across the last twelve sessions.
- **Totals** — days logged, sessions, work units, average per session.

## Working on it

`index.html` is generated. Sources live under `src/`:

| File | Contents |
|------|----------|
| `src/style.css` | Design tokens and all styling |
| `src/markup.html` | Page structure (most content is rendered by JS) |
| `src/app.js` | Program data, state, storage, rendering |

Edit those, then rebuild:

```sh
python3 build.py
```

## Caveat on the video links

The videos listed under *Program → Videos worth following* were found by web
search; YouTube was unreachable from the machine that built this, so titles
and channels come from search listings rather than the videos themselves.
Check a link is still live before building a week around it.

## Not medical advice

Talk to a physician before starting a training program, particularly if you
have any joint, heart or blood-pressure history. Sharp or pinpoint joint
pain means back down a rung, not push through.
