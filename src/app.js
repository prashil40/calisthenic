/* ===================================================================
   Zero to Bar — a local-first beginner calisthenics log.
   No dependencies, no network, no account. State lives in localStorage.
   =================================================================== */
(function () {
  "use strict";

  /* ---------- movements & progression ladders ---------------------- */
  const MOVES = {
    push: {
      label: "Push", unit: "reps",
      ladder: [
        { name: "Wall push-up",        cue: "Hands on a wall at chest height, body in one line. Chest to wall, elbows back at 45°." },
        { name: "Incline push-up",     cue: "Hands on a table or kitchen counter. The lower the surface, the harder it gets." },
        { name: "Knee push-up",        cue: "Knees down, hips forward so shoulders, hips and knees make one line. No piking." },
        { name: "Full push-up",        cue: "Chest to the floor, elbows tucked to roughly 45°, glutes and ribs locked in." },
        { name: "Diamond push-up",     cue: "Index fingers and thumbs touching under the sternum. Elbows brush the ribs." }
      ]
    },
    pull: {
      label: "Pull", unit: "reps",
      ladder: [
        { name: "Doorframe row",       cue: "Hold a doorframe, feet close, lean back and pull your chest to your hands." },
        { name: "Table row",           cue: "Under a sturdy table, heels on the floor, chest to the edge. Squeeze the shoulder blades." },
        { name: "Inverted row",        cue: "Bar at hip height, body horizontal, heels on the floor. Chest touches the bar." },
        { name: "Negative pull-up",    cue: "Jump to the top, chin over the bar, then lower for a full five-second count." },
        { name: "Pull-up",             cue: "Dead hang to chin over the bar. Shoulders down and back before you pull." }
      ]
    },
    squat: {
      label: "Squat", unit: "reps",
      ladder: [
        { name: "Box squat",           cue: "Sit to a chair, stand up without rocking. Knees track over the middle toes." },
        { name: "Bodyweight squat",    cue: "Hip crease below the knee, heels planted, chest tall the whole way." },
        { name: "Split squat",         cue: "Feet split front and back, back knee to the floor, weight on the front heel." },
        { name: "Bulgarian split squat", cue: "Rear foot on a chair. Slow down, drive up through the front foot." },
        { name: "Assisted pistol",     cue: "One leg out front, hold a doorframe for balance. Sit to a low box and stand." }
      ]
    },
    hinge: {
      label: "Hinge", unit: "reps",
      ladder: [
        { name: "Glute bridge",        cue: "Feet flat, drive through the heels, squeeze the glutes hard at the top." },
        { name: "Single-leg bridge",   cue: "One foot down, other knee pulled in. Keep the hips perfectly level." },
        { name: "Elevated hip thrust", cue: "Shoulders on a couch or bench, drive the hips to full lockout." },
        { name: "Nordic negative",     cue: "Kneel with heels anchored, lower under control for as long as you can hold." }
      ]
    },
    dip: {
      label: "Dip", unit: "reps",
      ladder: [
        { name: "Bench dip, knees bent", cue: "Hands on a chair behind you, feet close. Elbows straight back, not flared." },
        { name: "Bench dip, legs straight", cue: "Same, heels out in front. Shoulders stay down away from the ears." },
        { name: "Dip negative",        cue: "On parallel bars, start locked out and lower for five seconds. Step off, repeat." },
        { name: "Parallel bar dip",    cue: "Slight forward lean, lower to upper arms parallel with the floor, press up." }
      ]
    },
    core: {
      label: "Core", unit: "sec",
      ladder: [
        { name: "Plank on knees",      cue: "Forearms down, knees down, one line from shoulders to knees. Ribs tucked." },
        { name: "Plank",               cue: "Forearms and toes. Squeeze glutes, tuck the ribs, do not let the hips sag." },
        { name: "Hollow hold",         cue: "On your back, low back pressed flat, arms and legs off the floor." },
        { name: "Hanging knee raise",  cue: "Hang from a bar, knees to chest without swinging. Count the hold at the top." },
        { name: "Hanging leg raise",   cue: "Straight legs to bar height, slow all the way down. No kipping." }
      ]
    },
    side: {
      label: "Side", unit: "sec",
      ladder: [
        { name: "Side plank on knees", cue: "Bottom knee bent, hips stacked and lifted. Hold both sides." },
        { name: "Side plank",          cue: "Feet stacked, hips high, body in one straight line. Hold both sides." },
        { name: "Side plank + reach",  cue: "Full side plank, thread the top arm under the body and back up." }
      ]
    }
  };

  const BASE = { push: 6, pull: 5, squat: 10, hinge: 10, dip: 6, core: 20, side: 15 };

  /* ---------- sessions --------------------------------------------- */
  const SESSIONS = {
    A: { name: "Session A", focus: "Push emphasis",
         blocks: [{ m: "push", sets: 3 }, { m: "dip", sets: 3 }, { m: "squat", sets: 3 }, { m: "core", sets: 3 }] },
    B: { name: "Session B", focus: "Pull emphasis",
         blocks: [{ m: "pull", sets: 3 }, { m: "hinge", sets: 3 }, { m: "push", sets: 2 }, { m: "side", sets: 2 }] },
    C: { name: "Session C", focus: "Legs and core",
         blocks: [{ m: "squat", sets: 4 }, { m: "hinge", sets: 3 }, { m: "core", sets: 3 }, { m: "pull", sets: 2 }] },
    M: { name: "Mobility", focus: "Active recovery",
         checks: [
           ["Dead hang", "Hang from a bar, shoulders relaxed. Two sets, as long as the grip holds."],
           ["Deep squat hold", "Sit in the bottom of a squat, heels down, elbows pushing the knees out. Two minutes total."],
           ["Shoulder pass-through", "Broomstick or towel, wide grip, over the head and back. Twenty slow reps."],
           ["Cat-cow and thoracic rotation", "Ten slow rounds on all fours, then ten rotations per side."],
           ["Couch stretch", "Rear foot up on a couch, hips square, squeeze the glute. Ninety seconds a side."],
           ["Wrist prep", "Palms down then palms up on the floor, rock gently. One minute. Do this before every push day."]
         ] },
    R: { name: "Rest", focus: "Full rest",
         checks: [
           ["Rest taken", "Nothing to prove today. Growth happens now, not during the sets."],
           ["Slept seven hours or more", "The single biggest lever on how fast you progress."],
           ["Ate enough protein", "Roughly 1.6 g per kg of bodyweight. Strength needs material to build with."],
           ["Walked", "Twenty to thirty easy minutes keeps blood moving without adding fatigue."]
         ] }
  };

  const DAY_PLAN = { 1: "A", 2: "M", 3: "B", 4: "M", 5: "C", 6: "M", 0: "R" };
  const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const VIDEOS = [
    { t: "Calisthenics for Complete Beginners — tips, exercise form, programming",
      url: "https://www.youtube.com/watch?v=1mlN0yuxoLE",
      meta: "Primer · form + programming",
      why: "Start here. It covers why the progressions are ordered the way they are, which is the part that keeps you training in month three." },
    { t: "The Best Workout Plan to Start Calisthenics for Beginners",
      url: "https://www.youtube.com/watch?v=LuM1PZgxWjI",
      meta: "Plan · three days a week",
      why: "Lays out an explicit three-day beginner split — the same shape as sessions A, B and C in this log." },
    { t: "20 Min Beginner Calisthenics Workout at Home — no equipment",
      url: "https://www.youtube.com/watch?v=kuUZYUBHryw",
      meta: "Follow-along · 20 min · no kit",
      why: "For days when you want to be told what to do. Nothing needed but floor space." },
    { t: "How to Start Calisthenics for Beginners — best workout routine",
      url: "https://www.youtube.com/watch?v=fO8QmrsCOOE",
      meta: "Guide · full walkthrough",
      why: "A second take on the same fundamentals. Useful when one coach's cue for a movement does not click." },
    { t: "How to Start Calisthenics — a complete beginner's guide",
      url: "https://www.youtube.com/watch?v=XQJp42f7GJQ",
      meta: "Guide · getting started",
      why: "Broad orientation: equipment, where to train, what the first month actually looks like." },
    { t: "Calisthenicmovement — channel",
      url: "https://www.youtube.com/@calisthenicmovement",
      meta: "Channel · technique library",
      why: "The reference library. When a movement hurts or stalls, their tutorial for it is usually the clearest one on the platform." }
  ];

  /* ---------- date helpers ----------------------------------------- */
  const pad = (n) => String(n).padStart(2, "0");
  const ymd = (d) => d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  function parseYMD(s) { const p = s.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function addDays(d, n) { const x = new Date(d.getTime()); x.setDate(x.getDate() + n); return x; }
  function daysBetween(a, b) { return Math.round((parseYMD(b) - parseYMD(a)) / 86400000); }

  /* ---------- state ------------------------------------------------- */
  const KEY = "ztb.v1";
  const DEFAULT_LEVELS = { push: 1, pull: 1, squat: 1, hinge: 0, dip: 0, core: 1, side: 1 };

  let state = load();
  let cursor = ymd(new Date());

  function load() {
    let raw = null;
    try { raw = localStorage.getItem(KEY); } catch (e) { /* private mode */ }
    if (raw) {
      try {
        const s = JSON.parse(raw);
        if (s && s.log) {
          s.levels = Object.assign({}, DEFAULT_LEVELS, s.levels || {});
          s.theme = s.theme || "auto";
          return s;
        }
      } catch (e) { /* corrupt — fall through to a fresh state */ }
    }
    return { v: 1, start: ymd(new Date()), levels: Object.assign({}, DEFAULT_LEVELS), log: {}, theme: "auto" };
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); }
    catch (e) { flash("dataMsg", "Could not save — storage is blocked in this browser."); }
  }

  /* ---------- program maths ---------------------------------------- */
  function weekOf(date) { return Math.max(1, Math.floor(daysBetween(state.start, date) / 7) + 1); }
  function planFor(date) { return DAY_PLAN[parseYMD(date).getDay()]; }
  function rung(move) {
    const l = MOVES[move].ladder;
    return l[Math.min(Math.max(state.levels[move] | 0, 0), l.length - 1)];
  }
  function target(move, date) {
    const step = Math.floor((weekOf(date) - 1) / 2);
    if (MOVES[move].unit === "sec") return Math.min(BASE[move] + step * 5, BASE[move] + 40);
    return Math.min(BASE[move] + step, BASE[move] + 8);
  }
  function entry(date) { return state.log[date] || null; }
  function isDone(e) {
    if (!e) return false;
    if (e.manual) return true;
    if (e.sets) for (const k in e.sets) if (e.sets[k].some((v) => v > 0)) return true;
    if (e.checks) return e.checks.some(Boolean);
    return false;
  }
  function volume(e) {
    if (!e || !e.sets) return 0;
    let t = 0;
    for (const m in e.sets) {
      const div = MOVES[m] && MOVES[m].unit === "sec" ? 5 : 1;
      t += e.sets[m].reduce((a, b) => a + (b > 0 ? b : 0), 0) / div;
    }
    return Math.round(t);
  }
  function streak() {
    let d = new Date(), n = 0;
    if (!isDone(entry(ymd(d)))) d = addDays(d, -1);
    while (isDone(entry(ymd(d)))) { n++; d = addDays(d, -1); }
    return n;
  }
  function longestStreak() {
    const days = Object.keys(state.log).filter((k) => isDone(state.log[k])).sort();
    let best = 0, run = 0, prev = null;
    for (const d of days) {
      run = prev && daysBetween(prev, d) === 1 ? run + 1 : 1;
      if (run > best) best = run;
      prev = d;
    }
    return best;
  }
  // A strength session counts only once real sets are in it — an empty
  // Session A that was merely ticked off is a logged day, not a session.
  function sessionsDone() {
    return Object.keys(state.log).filter((k) => isDone(state.log[k]) && volume(state.log[k]) > 0).length;
  }
  function bestSet(move) {
    let b = 0;
    for (const k in state.log) {
      const s = state.log[k].sets;
      if (s && s[move]) for (const v of s[move]) if (v > b) b = v;
    }
    return b;
  }
  function history(move, n) {
    return Object.keys(state.log).sort()
      .filter((k) => state.log[k].sets && state.log[k].sets[move] && state.log[k].sets[move].some((v) => v > 0))
      .slice(-n)
      .map((k) => Math.max.apply(null, state.log[k].sets[move]));
  }
  function totalReps(move) {
    let t = 0;
    for (const k in state.log) {
      const s = state.log[k].sets;
      if (s && s[move]) t += s[move].reduce((a, b) => a + (b > 0 ? b : 0), 0);
    }
    return t;
  }
  // Two consecutive sessions where every set cleared the target by 2 → step up.
  function readyToLevel(move) {
    if (state.levels[move] >= MOVES[move].ladder.length - 1) return false;
    const days = Object.keys(state.log).sort()
      .filter((k) => state.log[k].sets && state.log[k].sets[move] && state.log[k].sets[move].some((v) => v > 0))
      .slice(-2);
    if (days.length < 2) return false;
    return days.every((k) => {
      const need = target(move, k) + 2;
      return state.log[k].sets[move].filter((v) => v > 0).every((v) => v >= need);
    });
  }

  /* ---------- tiny DOM helpers ------------------------------------- */
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  let flashTimer = null;
  function flash(id, msg) {
    const el = $(id); if (!el) return;
    el.textContent = msg;
    clearTimeout(flashTimer);
    flashTimer = setTimeout(() => { el.textContent = ""; }, 2600);
  }

  /* ---------- render: summary band --------------------------------- */
  function tallyMarks(n) {
    if (n === 0) return '<span class="rest">No streak yet — today can start one.</span>';
    const shown = Math.min(n, 50);
    let html = "";
    for (let i = 0; i < Math.floor(shown / 5); i++) html += '<span class="tallygrp five"><i></i><i></i><i></i><i></i></span>';
    const rem = shown % 5;
    if (rem) { html += '<span class="tallygrp">' + "<i></i>".repeat(rem) + "</span>"; }
    if (n > 50) html += '<span class="rest">+' + (n - 50) + "</span>";
    return html;
  }
  function renderBand() {
    const s = streak(), wk = weekOf(ymd(new Date()));
    $("band").innerHTML =
      '<div class="stat hero"><p class="eyebrow">Current streak</p>' +
        '<div class="v">' + s + '<small>' + (s === 1 ? "day" : "days") + '</small></div>' +
        '<div class="tally" aria-hidden="true">' + tallyMarks(s) + '</div></div>' +
      '<div class="stat"><p class="eyebrow">Program week</p><div class="v">' + wk + '<small>of 12</small></div>' +
        '<p class="eyebrow" style="color:var(--ink-2)">Started ' + prettyShort(state.start) + '</p></div>' +
      '<div class="stat"><p class="eyebrow">Sessions logged</p><div class="v">' + sessionsDone() + '</div>' +
        '<p class="eyebrow" style="color:var(--ink-2)">Strength days only</p></div>' +
      '<div class="stat"><p class="eyebrow">Longest streak</p><div class="v">' + longestStreak() + '<small>days</small></div>' +
        '<p class="eyebrow" style="color:var(--ink-2)">Beat it</p></div>';
  }
  function prettyShort(d) { const x = parseYMD(d); return MONTHS[x.getMonth()] + " " + x.getDate() + ", " + x.getFullYear(); }

  /* ---------- render: today ---------------------------------------- */
  function renderToday() {
    const date = cursor, plan = planFor(date), S = SESSIONS[plan];
    const d = parseYMD(date), today = ymd(new Date());
    const e = entry(date) || {};

    $("dayTitle").textContent = date === today ? "Today" : DAY_NAMES[d.getDay()];
    $("dayMeta").textContent = DAY_NAMES[d.getDay()] + " · " + prettyShort(date) + " · week " + weekOf(date);
    $("nextDay").disabled = daysBetween(date, today) <= 0;   // no logging the future

    const mark = $("sessionMark");
    mark.className = "sessionmark" + (plan === "R" ? " rest" : plan === "M" ? " mob" : "");
    mark.innerHTML = "<b>" + esc(S.name) + "</b> · " + esc(S.focus);
    $("sessionHint").textContent = S.blocks
      ? "Rest 60–90 seconds between sets. Leave two clean reps in the tank."
      : plan === "M" ? "Ten to fifteen minutes. Never push a stretch into pain."
      : "Tick what you managed. The streak survives a rest day.";

    const box = $("workout");
    box.innerHTML = S.blocks ? S.blocks.map((b) => exerciseRow(b, date, e)).join("") : checklistRows(S, e);
    $("note").value = e.note || "";
    $("saveBtn").textContent = isDone(e) ? "Update the log" : "Log the day";
    wireToday();
  }

  function exerciseRow(b, date, e) {
    const M = MOVES[b.m], r = rung(b.m), tgt = target(b.m, date);
    const unit = M.unit === "sec" ? "sec" : "reps";
    const vals = (e.sets && e.sets[b.m]) || [];
    let inputs = "";
    for (let i = 0; i < b.sets; i++) {
      const v = vals[i] > 0 ? vals[i] : "";
      inputs += '<input class="setin' + (v ? " filled" : "") + '" type="number" inputmode="numeric" min="0" max="999"' +
        ' data-move="' + b.m + '" data-set="' + i + '" value="' + v + '" placeholder="' + tgt + '"' +
        ' aria-label="' + esc(r.name) + ' set ' + (i + 1) + ' — ' + unit + '">';
    }
    const opts = M.ladder.map((x, i) =>
      '<option value="' + i + '"' + (i === state.levels[b.m] ? " selected" : "") + ">" + (i + 1) + ". " + esc(x.name) + "</option>").join("");

    return '<div class="ex">' +
      '<div class="ex-head"><div>' +
        '<span class="ex-move">' + esc(M.label) + '</span>' +
        '<span class="ex-name">' + esc(r.name) + '</span>' +
        (readyToLevel(b.m) ? '<span class="chip">Ready to level up</span>' : "") +
      '</div>' +
      '<span class="ex-target">' + b.sets + ' × <b>' + tgt + '</b> ' + unit + '</span></div>' +
      '<p class="ex-cue">' + esc(r.cue) + '</p>' +
      '<div class="ex-ctl">' + inputs +
        '<span class="lvl"><label for="lvl-' + b.m + '">Rung</label>' +
        '<select id="lvl-' + b.m + '" data-lvl="' + b.m + '">' + opts + "</select></span>" +
      "</div></div>";
  }

  function checklistRows(S, e) {
    return S.checks.map((c, i) =>
      '<div class="check"><input type="checkbox" id="chk' + i + '" data-chk="' + i + '"' +
      (e.checks && e.checks[i] ? " checked" : "") + '>' +
      '<label for="chk' + i + '"><span class="t">' + esc(c[0]) + '</span><br>' +
      '<span class="d">' + esc(c[1]) + "</span></label></div>").join("");
  }

  function ensureEntry(date) {
    if (!state.log[date]) state.log[date] = { type: planFor(date), sets: {}, checks: [], note: "", manual: false };
    return state.log[date];
  }

  function wireToday() {
    document.querySelectorAll("#workout .setin").forEach((inp) => {
      inp.addEventListener("input", () => {
        const e = ensureEntry(cursor), m = inp.dataset.move, i = +inp.dataset.set;
        if (!e.sets[m]) e.sets[m] = [];
        const v = parseInt(inp.value, 10);
        e.sets[m][i] = isNaN(v) || v < 0 ? 0 : Math.min(v, 999);
        inp.classList.toggle("filled", e.sets[m][i] > 0);
        save(); renderBand();
      });
    });
    document.querySelectorAll("#workout [data-lvl]").forEach((sel) => {
      sel.addEventListener("change", () => {
        state.levels[sel.dataset.lvl] = +sel.value;
        save(); renderToday(); renderProgram();
      });
    });
    document.querySelectorAll("#workout [data-chk]").forEach((cb) => {
      cb.addEventListener("change", () => {
        const e = ensureEntry(cursor);
        e.checks[+cb.dataset.chk] = cb.checked;
        save(); renderBand();
      });
    });
  }

  /* ---------- render: progress ------------------------------------- */
  function renderProgress() {
    const today = new Date();
    const end = addDays(today, (7 - (today.getDay() || 7)));   // this week's Sunday
    const start = addDays(end, -83);                            // 12 weeks back, a Monday
    $("calRange").textContent = prettyShort(ymd(start)) + " — " + prettyShort(ymd(end));

    let maxVol = 1;
    for (let i = 0; i < 84; i++) { const v = volume(entry(ymd(addDays(start, i)))); if (v > maxVol) maxVol = v; }

    let cells = "", months = "", lastMonth = -1;
    for (let w = 0; w < 12; w++) {
      const first = addDays(start, w * 7);
      months += "<span>" + (first.getMonth() !== lastMonth ? MONTHS[first.getMonth()] : "&nbsp;") + "</span>";
      lastMonth = first.getMonth();
    }
    for (let w = 0; w < 12; w++) {
      for (let dow = 0; dow < 7; dow++) {
        const dt = addDays(start, w * 7 + dow), key = ymd(dt), e = entry(key);
        const done = isDone(e), vol = volume(e);
        let lv = "0";
        if (done && vol > 0) lv = vol >= maxVol * 0.66 ? "3" : vol >= maxVol * 0.33 ? "2" : "1";
        else if (done) lv = "rest";
        const label = prettyShort(key) + " — " + (done ? (vol > 0 ? vol + " units of work" : "logged, no sets") : "not logged");
        cells += '<span class="cell" data-lv="' + lv + '"' + (key === ymd(today) ? ' data-today="1"' : "") +
                 ' title="' + esc(label) + '" role="img" aria-label="' + esc(label) + '"></span>';
      }
    }
    $("calMonths").innerHTML = months;
    $("cal").innerHTML = cells;

    let rows = "<thead><tr><th>Movement</th><th>Best set</th><th>Last 12 sessions</th><th>Total logged</th></tr></thead><tbody>";
    for (const m in MOVES) {
      const M = MOVES[m], b = bestSet(m), h = history(m, 12);
      rows += "<tr><td><span class='m'>" + esc(M.label) + "<span class='var'>" + esc(rung(m).name) + "</span></span></td>" +
        "<td><span class='best'>" + (b || "—") + "</span> <span class='mono' style='font-size:11px;color:var(--ink-3)'>" +
          (b ? (M.unit === "sec" ? "sec" : "reps") : "") + "</span></td>" +
        "<td class='spark'>" + spark(h) + "</td>" +
        "<td class='mono'>" + (totalReps(m) ? totalReps(m) + " " + (M.unit === "sec" ? "sec" : "reps") : "—") + "</td></tr>";
    }
    $("prTable").innerHTML = rows + "</tbody>";

    const days = Object.keys(state.log).filter((k) => isDone(state.log[k]));
    const strengthDays = days.filter((k) => volume(state.log[k]) > 0);
    const totalVol = strengthDays.reduce((a, k) => a + volume(state.log[k]), 0);
    $("totalTable").innerHTML =
      "<tbody>" +
      trow("Days logged", days.length) +
      trow("Strength sessions", strengthDays.length) +
      trow("Recovery days logged", days.length - strengthDays.length) +
      trow("Total work units", totalVol) +
      trow("Average per session", strengthDays.length ? Math.round(totalVol / strengthDays.length) : "—") +
      "</tbody>";
  }
  function trow(k, v) { return "<tr><td><span class='m'>" + k + "</span></td><td class='best'>" + v + "</td></tr>"; }

  function spark(vals) {
    if (vals.length < 2) return "<span class='mono' style='font-size:10.5px;color:var(--ink-3)'>2+ sessions</span>";
    const w = 100, h = 28, min = Math.min.apply(null, vals), max = Math.max.apply(null, vals);
    const range = max - min || 1;
    const pts = vals.map((v, i) => [
      (i / (vals.length - 1)) * (w - 2) + 1,
      h - 3 - ((v - min) / range) * (h - 7)
    ]);
    const line = pts.map((p) => p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" ");
    const area = "1," + (h - 1) + " " + line + " " + (w - 1) + "," + (h - 1);
    const last = pts[pts.length - 1];
    return '<svg viewBox="0 0 ' + w + " " + h + '" width="100" height="28" role="img" aria-label="Best set trend: ' +
      vals.join(", ") + '"><polygon points="' + area + '" fill="var(--mark)" opacity=".16"></polygon>' +
      '<polyline points="' + line + '" fill="none" stroke="var(--mark)" stroke-width="1.6" ' +
      'stroke-linejoin="round" stroke-linecap="round"></polyline>' +
      '<circle cx="' + last[0].toFixed(1) + '" cy="' + last[1].toFixed(1) + '" r="2.4" fill="var(--mark)"></circle></svg>';
  }

  /* ---------- render: program -------------------------------------- */
  function renderProgram() {
    $("weekGrid").innerHTML = [1, 2, 3, 4, 5, 6, 0].map((dow) => {
      const S = SESSIONS[DAY_PLAN[dow]];
      return "<div><p class='d'>" + DAY_NAMES[dow].slice(0, 3) + "</p><p class='s'>" + esc(S.name) +
             "</p><p class='f'>" + esc(S.focus) + "</p></div>";
    }).join("");

    $("ladders").innerHTML = Object.keys(MOVES).map((m) => {
      const M = MOVES[m];
      return "<div class='ladder'><h3>" + esc(M.label) + " <span class='eyebrow' style='font-weight:400'>· " +
        (M.unit === "sec" ? "held for seconds" : "counted in reps") + "</span></h3><ul class='rungs'>" +
        M.ladder.map((x, i) => "<li" + (i === state.levels[m] ? " class='cur'" : "") +
          "><span class='n'>" + (i + 1) + "</span>" + esc(x.name) + "</li>").join("") + "</ul></div>";
    }).join("");

    $("vids").innerHTML = VIDEOS.map((v, i) =>
      "<li><span class='idx'>" + pad(i + 1) + "</span><div><a class='t' href='" + esc(v.url) +
      "' target='_blank' rel='noopener noreferrer'>" + esc(v.t) + "</a>" +
      "<p class='meta'>" + esc(v.meta) + "</p><p class='why'>" + esc(v.why) + "</p></div></li>").join("");

    $("startDate").value = state.start;
  }

  /* ---------- tabs -------------------------------------------------- */
  const TABS = ["today", "progress", "program"];
  function show(name) {
    TABS.forEach((t) => {
      $("tab-" + t).setAttribute("aria-selected", String(t === name));
      $("panel-" + t).hidden = t !== name;
    });
    if (name === "progress") renderProgress();
    if (name === "program") renderProgram();
  }

  /* ---------- theme ------------------------------------------------- */
  function applyTheme() {
    if (state.theme === "auto") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", state.theme);
  }

  /* ---------- wiring ------------------------------------------------ */
  TABS.forEach((t) => $("tab-" + t).addEventListener("click", () => show(t)));

  $("prevDay").addEventListener("click", () => { cursor = ymd(addDays(parseYMD(cursor), -1)); renderToday(); });
  $("nextDay").addEventListener("click", () => { cursor = ymd(addDays(parseYMD(cursor), 1)); renderToday(); });
  $("todayBtn").addEventListener("click", () => { cursor = ymd(new Date()); renderToday(); });

  $("note").addEventListener("input", () => { ensureEntry(cursor).note = $("note").value; save(); });

  $("saveBtn").addEventListener("click", () => {
    const e = ensureEntry(cursor), plan = planFor(cursor);
    if (SESSIONS[plan].checks && !e.checks.some(Boolean)) {
      SESSIONS[plan].checks.forEach((_, i) => { e.checks[i] = true; });
    }
    e.manual = true;
    save(); renderToday(); renderBand();
    const n = streak();
    flash("savedMsg", "Logged. Streak is now " + n + (n === 1 ? " day." : " days."));
  });

  $("clearBtn").addEventListener("click", () => {
    if (!state.log[cursor]) return;
    if (!confirm("Clear everything logged for " + prettyShort(cursor) + "?")) return;
    delete state.log[cursor];
    save(); renderToday(); renderBand();
    flash("savedMsg", "Day cleared.");
  });

  $("themeBtn").addEventListener("click", () => {
    state.theme = state.theme === "auto" ? "light" : state.theme === "light" ? "dark" : "auto";
    applyTheme(); save();
    flash("savedMsg", "Theme: " + state.theme);
  });

  $("startDate").addEventListener("change", (ev) => {
    if (!ev.target.value) return;
    state.start = ev.target.value;
    save(); renderBand(); renderToday();
    flash("dataMsg", "Program start moved to " + prettyShort(state.start) + ".");
  });

  $("exportBtn").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "zero-to-bar-" + ymd(new Date()) + ".json";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    flash("dataMsg", "Backup downloaded.");
  });

  $("importBtn").addEventListener("click", () => $("importFile").click());
  $("importFile").addEventListener("change", (ev) => {
    const f = ev.target.files && ev.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const s = JSON.parse(r.result);
        if (!s || typeof s !== "object" || !s.log) throw new Error("shape");
        state = { v: 1, start: s.start || ymd(new Date()),
                  levels: Object.assign({}, DEFAULT_LEVELS, s.levels || {}),
                  log: s.log, theme: s.theme || "auto" };
        save(); applyTheme(); renderBand(); renderToday(); renderProgram();
        flash("dataMsg", "Backup restored — " + Object.keys(state.log).length + " days.");
      } catch (err) {
        flash("dataMsg", "That file is not a Zero to Bar backup.");
      }
      ev.target.value = "";
    };
    r.readAsText(f);
  });

  $("resetBtn").addEventListener("click", () => {
    if (!confirm("Erase every logged day and start over? Export a backup first if you want to keep it.")) return;
    state = { v: 1, start: ymd(new Date()), levels: Object.assign({}, DEFAULT_LEVELS), log: {}, theme: state.theme };
    save(); renderBand(); renderToday(); renderProgram();
    flash("dataMsg", "Log erased.");
  });

  /* ---------- go ---------------------------------------------------- */
  applyTheme();
  renderBand();
  renderToday();
  renderProgram();
})();
