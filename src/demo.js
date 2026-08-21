  /* ================================================================
     Motion demos.

     Remote images cannot load in the artifact viewer — its CSP allows
     no external hosts — and hotlinking exercise GIFs would also mean
     redistributing someone else's copyrighted frames. So the movement
     is drawn here instead: a side-view figure interpolated between the
     start and end of the rep, which is the part a still image cannot
     show anyway. Costs a few KB, works offline, and is ours.

     A pose is a bag of joint coordinates in a 160x104 box, y downward,
     floor at 92. Missing joints are simply not drawn, so a one-legged
     side view and a two-legged split squat share the same renderer.
     ================================================================ */
  const FLOOR = 92;

  // props: f=floor, w=wall at x, b=bench/box rect, bar=bar at [x,y],
  // seat=chair, table=edge line at y
  const DEMOS = {
    pushfull: { t: "Push-up", props: ["f"], reps: "Lower for 2–3 seconds, press up in 1",
      a: { an:[24,90], kn:[52,83], hp:[76,76], nk:[112,63], hd:[122,56], el:[112,76], wr:[112,90] },
      b: { an:[24,90], kn:[52,86], hp:[76,83], nk:[112,77], hd:[122,71], el:[95,84], wr:[112,90] } },
    pushknee: { t: "Knee push-up", props: ["f"], reps: "Shoulders, hips and knees stay in one line",
      a: { an:[26,72], kn:[46,90], hp:[70,78], nk:[108,64], hd:[118,57], el:[108,77], wr:[108,90] },
      b: { an:[26,76], kn:[46,90], hp:[70,84], nk:[108,78], hd:[118,71], el:[92,85], wr:[108,90] } },
    pushincline: { t: "Incline push-up", props: ["f", "bench"], reps: "The lower the surface, the harder it gets",
      a: { an:[20,90], kn:[48,82], hp:[72,73], nk:[108,53], hd:[118,46], el:[108,62], wr:[108,70] },
      b: { an:[20,90], kn:[48,85], hp:[72,78], nk:[108,64], hd:[118,57], el:[92,68], wr:[108,70] } },
    pushwall: { t: "Wall push-up", props: ["f", "wall"], reps: "Body stays one straight board",
      a: { an:[62,90], kn:[62,68], hp:[62,48], nk:[62,24], hd:[62,15], el:[96,26], wr:[128,28] },
      b: { an:[62,90], kn:[66,68], hp:[70,48], nk:[86,26], hd:[88,17], el:[112,36], wr:[128,28] } },
    row: { t: "Row", props: ["f", "table"], reps: "Chest to the edge, shoulder blades together",
      a: { an:[30,90], kn:[58,81], hp:[82,71], nk:[112,58], hd:[122,52], el:[112,49], wr:[112,40] },
      b: { an:[30,90], kn:[58,79], hp:[82,67], nk:[112,49], hd:[122,43], el:[96,46], wr:[112,40] } },
    rowhi: { t: "Row, body level", props: ["f", "box", "table"], reps: "One line from heel to head throughout",
      a: { an:[26,62], kn:[54,60], hp:[80,58], nk:[112,56], hd:[122,51], el:[112,48], wr:[112,40] },
      b: { an:[26,62], kn:[54,59], hp:[80,55], nk:[112,47], hd:[122,42], el:[96,44], wr:[112,40] } },
    pullup: { t: "Pull-up", props: ["bar"], reps: "Dead hang to chin over the bar",
      a: { wr:[80,16], el:[80,32], nk:[80,48], hd:[90,40], hp:[80,70], kn:[72,88], an:[86,94] },
      b: { wr:[80,16], el:[66,32], nk:[80,24], hd:[90,16], hp:[80,46], kn:[72,64], an:[86,70] } },
    squat: { t: "Squat", props: ["f"], reps: "Hip crease finishes below the knee",
      a: { an:[70,90], kn:[70,66], hp:[70,44], nk:[70,22], hd:[70,13], el:[76,32], wr:[86,28] },
      b: { an:[70,90], kn:[86,70], hp:[58,72], nk:[66,50], hd:[72,42], el:[78,56], wr:[90,52] } },
    split: { t: "Split squat", props: ["f"], reps: "Straight down, weight on the front heel",
      a: { an:[94,90], kn:[94,66], hp:[74,46], nk:[74,24], hd:[74,15], an2:[36,88], kn2:[54,68], el:[74,38], wr:[74,50] },
      b: { an:[94,90], kn:[94,68], hp:[74,60], nk:[74,38], hd:[74,29], an2:[36,88], kn2:[58,86], el:[74,52], wr:[74,64] } },
    bridge: { t: "Glute bridge", props: ["f"], reps: "Squeeze the glutes hard at the top",
      a: { an:[30,90], kn:[52,70], hp:[76,88], nk:[106,90], hd:[118,83], el:[106,90], wr:[92,90] },
      b: { an:[30,90], kn:[52,64], hp:[76,62], nk:[106,90], hd:[118,83], el:[106,90], wr:[92,90] } },
    thrust: { t: "Hip thrust", props: ["f", "bench"], reps: "Drive to full lockout, ribs down",
      a: { an:[36,90], kn:[54,74], hp:[80,88], nk:[110,66], hd:[122,60], el:[110,74], wr:[122,74] },
      b: { an:[36,90], kn:[54,66], hp:[80,64], nk:[110,66], hd:[122,58], el:[110,74], wr:[122,74] } },
    nordic: { t: "Nordic negative", props: ["f"], reps: "Hips stay open — only the knees change angle",
      a: { kn:[70,90], an:[92,92], hp:[70,66], nk:[70,42], hd:[70,33], el:[80,52], wr:[90,46] },
      b: { kn:[70,90], an:[92,92], hp:[78,70], nk:[106,58], hd:[116,52], el:[112,72], wr:[118,86] } },
    benchdip: { t: "Bench dip", props: ["f", "seat"], reps: "Elbows straight back, stop at parallel",
      a: { wr:[114,62], el:[114,50], nk:[114,38], hd:[124,31], hp:[88,60], kn:[62,60], an:[54,90] },
      b: { wr:[114,62], el:[102,70], nk:[114,58], hd:[124,51], hp:[88,78], kn:[62,72], an:[54,90] } },
    dip: { t: "Dip", props: ["bars"], reps: "Slight forward lean, lower to parallel",
      a: { wr:[80,36], el:[80,27], nk:[80,18], hd:[89,11], hp:[78,42], kn:[70,60], an:[82,66] },
      b: { wr:[80,36], el:[66,42], nk:[80,40], hd:[89,33], hp:[78,64], kn:[70,82], an:[82,88] } },
    plank: { t: "Plank", props: ["f"], hold: true, reps: "One line from heel to head — hold it",
      a: { an:[24,90], kn:[52,84], hp:[76,77], nk:[110,67], hd:[121,61], el:[110,90], wr:[126,90] },
      b: { an:[24,90], kn:[52,84], hp:[76,79], nk:[110,68], hd:[121,62], el:[110,90], wr:[126,90] } },
    sideplank: { t: "Side plank", props: ["f"], hold: true, reps: "Hips stacked and lifted, top arm to the ceiling",
      a: { an:[24,90], kn:[52,83], hp:[76,76], nk:[110,64], hd:[121,58], el:[110,90], wr:[126,90], el2:[110,48], wr2:[110,30] },
      b: { an:[24,90], kn:[52,84], hp:[76,78], nk:[110,65], hd:[121,59], el:[110,90], wr:[126,90], el2:[110,49], wr2:[110,31] } },
    hollow: { t: "Hollow hold and rock", props: ["f"], reps: "The banana shape never changes",
      a: { an:[22,70], kn:[46,76], hp:[74,88], nk:[102,78], hd:[112,70], el:[120,66], wr:[134,60] },
      b: { an:[28,66], kn:[52,73], hp:[80,86], nk:[108,80], hd:[118,72], el:[126,68], wr:[140,62] } },
    kneeraise: { t: "Hanging knee raise", props: ["bar"], reps: "No swinging — pause at the top",
      a: { wr:[80,10], el:[80,28], nk:[80,46], hd:[80,37], hp:[80,66], kn:[80,84], an:[80,99] },
      b: { wr:[80,10], el:[80,28], nk:[80,46], hd:[80,37], hp:[80,64], kn:[100,58], an:[106,74] } },
    legraise: { t: "Hanging leg raise", props: ["bar"], reps: "Straight legs, slow all the way down",
      a: { wr:[80,10], el:[80,28], nk:[80,46], hd:[80,37], hp:[80,66], kn:[80,84], an:[80,99] },
      b: { wr:[80,10], el:[80,28], nk:[80,46], hd:[80,37], hp:[80,62], kn:[102,44], an:[122,26] } },
    pulldown: { t: "Band lat pulldown", props: ["bar"], reps: "Elbows drive down, shoulder blades pull first",
      a: { wr:[88,12], el:[82,28], nk:[74,44], hd:[64,36], hp:[70,66], kn:[70,88], an:[92,90] },
      b: { wr:[84,52], el:[80,62], nk:[74,44], hd:[64,36], hp:[70,66], kn:[70,88], an:[92,90] } },

    /* ---- recovery-day demos ---------------------------------------- */
    deadhang: { t: "Dead hang", props: ["bar"], hold: true, reps: "Relax into it and breathe — thirty seconds, twice",
      a: { wr:[80,12], el:[80,30], nk:[80,48], hd:[90,40], hp:[80,70], kn:[76,90], an:[88,98] },
      b: { wr:[80,12], el:[80,31], nk:[80,51], hd:[90,43], hp:[80,73], kn:[76,93], an:[88,101] } },
    doorhang: { t: "Doorway lat opener", props: ["f", "wall"], reps: "Sink the hips back and away from the hand",
      a: { an:[96,90], kn:[96,68], hp:[96,48], nk:[96,26], hd:[96,17], el:[114,24], wr:[130,24] },
      b: { an:[96,90], kn:[92,68], hp:[76,56], nk:[94,34], hd:[98,25], el:[112,28], wr:[130,24] } },
    squathold: { t: "Deep squat hold", props: ["f"], hold: true, reps: "Heels down, elbows pushing the knees out",
      a: { an:[70,90], kn:[86,70], hp:[58,72], nk:[66,50], hd:[72,41], el:[78,56], wr:[90,52] },
      b: { an:[70,90], kn:[86,69], hp:[58,71], nk:[66,48], hd:[72,39], el:[78,55], wr:[90,51] } },
    passthrough: { t: "Shoulder pass-through", props: ["f"], reps: "Arms stay straight — widen the grip rather than bending",
      a: { an:[70,90], kn:[70,72], hp:[70,54], nk:[70,34], hd:[70,25], el:[84,42], wr:[96,50] },
      m: { an:[70,90], kn:[70,72], hp:[70,54], nk:[70,34], hd:[70,25], el:[70,19], wr:[70,5] },
      b: { an:[70,90], kn:[70,72], hp:[70,54], nk:[70,34], hd:[70,25], el:[56,42], wr:[44,50] } },
    catcow: { t: "Cat-cow", props: ["f"], reps: "Round and arch through the mid-back, not the low back",
      a: { nk:[104,52], mid:[84,58], hp:[62,52], hd:[116,44], el:[104,70], wr:[104,90], kn:[62,70], an:[50,90] },
      b: { nk:[104,56], mid:[84,38], hp:[62,56], hd:[112,56], el:[104,70], wr:[104,90], kn:[62,70], an:[50,90] } },
    couch: { t: "Couch stretch", props: ["f", "couch"], hold: true, reps: "Square the hips and squeeze the kneeling glute",
      a: { hp:[72,62], nk:[72,38], hd:[72,29], kn:[62,90], an:[38,68], kn2:[100,64], an2:[100,90], el:[78,50], wr:[86,56] },
      b: { hp:[76,64], nk:[76,40], hd:[76,31], kn:[62,90], an:[38,68], kn2:[100,64], an2:[100,90], el:[82,52], wr:[90,58] } },
    wristprep: { t: "Wrist prep", props: ["f"], reps: "Rock gently — this is preparation, not a stretch to win",
      a: { nk:[96,54], mid:[78,54], hp:[60,54], hd:[108,48], el:[100,70], wr:[104,90], kn:[60,72], an:[48,90] },
      b: { nk:[110,50], mid:[86,52], hp:[64,54], hd:[120,45], el:[108,70], wr:[104,90], kn:[60,72], an:[48,90] } },

    lsit: { t: "Tuck L-sit", props: ["f", "blocks"], reps: "Press the floor down and away",
      a: { hp:[70,84], nk:[70,58], hd:[70,49], wr:[92,82], el:[92,70], kn:[46,80], an:[32,90] },
      b: { hp:[70,76], nk:[70,50], hd:[70,41], wr:[92,82], el:[92,66], kn:[50,66], an:[36,74] } }
  };

  // which demo stands in for each rung
  const DEMO_FOR = {
    "push:wall": "pushwall", "push:incline": "pushincline", "push:knee": "pushknee",
    "push:full": "pushfull", "push:diamond": "pushfull",
    "pull:door": "row", "pull:band": "row", "pull:towel": "row", "pull:table": "row",
    "pull:bandpull": "pulldown",
    "pull:towelhi": "rowhi", "pull:tablehi": "rowhi", "pull:inv": "rowhi",
    "pull:onearm": "row", "pull:neg": "pullup", "pull:pullup": "pullup",
    "squat:box": "squat", "squat:bw": "squat", "squat:split": "split",
    "squat:bulg": "split", "squat:pistol": "split",
    "hinge:bridge": "bridge", "hinge:slbridge": "bridge", "hinge:thrust": "thrust", "hinge:nordic": "nordic",
    "dip:bknee": "benchdip", "dip:bstr": "benchdip", "dip:belev": "benchdip",
    "dip:chair": "dip", "dip:dneg": "dip", "dip:pbar": "dip",
    "core:kplank": "plank", "core:plank": "plank", "core:hollow": "hollow", "core:rock": "hollow",
    "core:kraise": "kneeraise", "core:tuckl": "lsit", "core:lraise": "legraise",
    "side:sknee": "sideplank", "side:side": "sideplank", "side:reach": "sideplank"
  };
  const RECOVERY_DEMO = {
    hang: "deadhang", doorhang: "doorhang", squat: "squathold", shoulder: "passthrough",
    catcow: "catcow", couch: "couch", wrist: "wristprep"
  };
  function demoNameFor(move, id) { return DEMO_FOR[move + ":" + id] || null; }
  function demoFor(move, id) { return DEMOS[DEMO_FOR[move + ":" + id]] || null; }

  const PROPS = {
    f:      '<line x1="4" y1="92" x2="156" y2="92" class="d-ground"/>',
    wall:   '<line x1="132" y1="6" x2="132" y2="92" class="d-ground"/>',
    bench:  '<rect x="96" y="70" width="56" height="22" class="d-prop"/>',
    box:    '<rect x="10" y="62" width="34" height="30" class="d-prop"/>',
    seat:   '<rect x="102" y="62" width="50" height="30" class="d-prop"/>',
    table:  '<line x1="86" y1="40" x2="154" y2="40" class="d-bar"/>',
    bar:    '<circle cx="80" cy="10" r="4" class="d-barc"/><line x1="20" y1="10" x2="140" y2="10" class="d-bar"/>',
    bars:   '<line x1="30" y1="46" x2="130" y2="46" class="d-bar"/><circle cx="80" cy="46" r="4" class="d-barc"/>',
    blocks: '<rect x="84" y="82" width="18" height="10" class="d-prop"/><line x1="4" y1="92" x2="156" y2="92" class="d-ground"/>',
    couch:  '<rect x="8" y="68" width="46" height="24" class="d-prop"/>'
  };

  const lerp = (a, b, t) => a + (b - a) * t;
  function pair(p, q, t) {
    const o = {};
    for (const k in p) o[k] = q[k] ? [lerp(p[k][0], q[k][0], t), lerp(p[k][1], q[k][1], t)] : p[k];
    return o;
  }
  // A limb swinging through a wide arc collapses into the joint if you
  // interpolate its endpoints in a straight line, so demos with an `m`
  // waypoint run a->m->b instead.
  function poseAt(d, t) {
    if (!d.m) return pair(d.a, d.b, t);
    return t < 0.5 ? pair(d.a, d.m, t * 2) : pair(d.m, d.b, (t - 0.5) * 2);
  }
  function seg(p, a, b) {
    return p[a] && p[b]
      ? '<line x1="' + p[a][0].toFixed(1) + '" y1="' + p[a][1].toFixed(1) +
        '" x2="' + p[b][0].toFixed(1) + '" y2="' + p[b][1].toFixed(1) + '" class="d-limb"/>' : "";
  }
  function figure(p) {
    // nk->mid->hp when a mid-spine is given: a straight two-point spine
    // cannot show a rounded or arched back, which is the whole point of
    // cat-cow and most of what makes a hollow shape read.
    return (p.mid ? seg(p, "nk", "mid") + seg(p, "mid", "hp") : seg(p, "nk", "hp")) +
           seg(p, "hp", "kn") + seg(p, "kn", "an") +
           seg(p, "hp", "kn2") + seg(p, "kn2", "an2") +
           seg(p, "nk", "el") + seg(p, "el", "wr") +
           seg(p, "nk", "el2") + seg(p, "el2", "wr2") +
           (p.hd ? '<circle cx="' + p.hd[0].toFixed(1) + '" cy="' + p.hd[1].toFixed(1) +
                   '" r="6" class="d-head"/>' : "");
  }
  function demoSVG(d, t) {
    return '<svg viewBox="0 0 160 104" class="demo-svg" role="img" aria-label="' + esc(d.t) + ' movement">' +
      d.props.map((k) => PROPS[k] || "").join("") + figure(poseAt(d, t)) + "</svg>";
  }
