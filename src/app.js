/* ===================================================================
   Zero to Bar — a local-first beginner calisthenics log.
   No dependencies, no network, no account. State lives in localStorage.
   =================================================================== */
(function () {
  "use strict";

  /* ---------- movements & progression ladders ----------------------
     Rungs carry a stable id, so a stored level survives the ladder
     changing shape, and an optional `needs` naming the kit it requires.
     Rungs you have no kit for are filtered out rather than shown and
     blocked — the no-bar ladders below are real progressions, not
     placeholders.                                                     */
  const MOVES = {
    push: {
      label: "Push", unit: "reps",
      ladder: [
        { id: "wall",    name: "Wall push-up",        cue: "Hands on a wall at chest height, body in one line. Chest to wall, elbows back at 45°." },
        { id: "incline", name: "Incline push-up",     cue: "Hands on a table or kitchen counter. The lower the surface, the harder it gets." },
        { id: "knee",    name: "Knee push-up",        cue: "Knees down, hips forward so shoulders, hips and knees make one line. No piking." },
        { id: "full",    name: "Full push-up",        cue: "Chest to the floor, elbows tucked to roughly 45°, glutes and ribs locked in." },
        { id: "diamond", name: "Diamond push-up",     cue: "Index fingers and thumbs touching under the sternum. Elbows brush the ribs." }
      ]
    },
    pull: {
      label: "Pull", unit: "reps",
      ladder: [
        { id: "door",    name: "Doorframe row",       cue: "Hold a doorframe, feet close, lean back and pull your chest to your hands." },
        { id: "band",    name: "Band row",            cue: "Band anchored at chest height in a closed door. Step back until it is taut and row the handles to your ribs.", needs: "band" },
        { id: "towel",   name: "Towel door row",      cue: "Towel over the top of a latched door. Grip both ends, lean back, row your chest to your hands." },
        { id: "table",   name: "Table row",           cue: "Under a sturdy table, heels on the floor, chest to the edge. Squeeze the shoulder blades.", needs: "table" },
        { id: "towelhi", name: "Towel row, feet forward", cue: "Same towel row with the feet walked well forward, so the body is closer to horizontal." },
        { id: "bandpull", name: "Band lat pulldown",  cue: "Band anchored at the top of the door. Kneel back and pull the handles down to your chest.", needs: "band" },
        { id: "tablehi", name: "Table row, feet up",  cue: "Same row with your heels on a chair, so your body is level and the pull is much harder.", needs: "table" },
        { id: "inv",     name: "Inverted row",        cue: "Bar at hip height, body horizontal, heels on the floor. Chest touches the bar.", needs: "bar" },
        { id: "onearm",  name: "One-arm doorway row", cue: "Hold a doorframe with one hand, lean back, and pull your chest up on that side." },
        { id: "neg",     name: "Negative pull-up",    cue: "Jump to the top, chin over the bar, then lower for a full five-second count.", needs: "bar" },
        { id: "pullup",  name: "Pull-up",             cue: "Dead hang to chin over the bar. Shoulders down and back before you pull.", needs: "bar" }
      ]
    },
    squat: {
      label: "Squat", unit: "reps",
      ladder: [
        { id: "box",     name: "Box squat",           cue: "Sit to a chair, stand up without rocking. Knees track over the middle toes." },
        { id: "bw",      name: "Bodyweight squat",    cue: "Hip crease below the knee, heels planted, chest tall the whole way." },
        { id: "split",   name: "Split squat",         cue: "Feet split front and back, back knee to the floor, weight on the front heel." },
        { id: "bulg",    name: "Bulgarian split squat", cue: "Rear foot on a chair. Slow down, drive up through the front foot." },
        { id: "pistol",  name: "Assisted pistol",     cue: "One leg out front, hold a doorframe for balance. Sit to a low box and stand." }
      ]
    },
    hinge: {
      label: "Hinge", unit: "reps",
      ladder: [
        { id: "bridge",  name: "Glute bridge",        cue: "Feet flat, drive through the heels, squeeze the glutes hard at the top." },
        { id: "slbridge", name: "Single-leg bridge",  cue: "One foot down, other knee pulled in. Keep the hips perfectly level." },
        { id: "thrust",  name: "Elevated hip thrust", cue: "Shoulders on a couch or bench, drive the hips to full lockout." },
        { id: "nordic",  name: "Nordic negative",     cue: "Kneel with heels anchored, lower under control for as long as you can hold." }
      ]
    },
    dip: {
      label: "Dip", unit: "reps",
      ladder: [
        { id: "bknee",   name: "Bench dip, knees bent", cue: "Hands on a chair behind you, feet close. Elbows straight back, not flared." },
        { id: "bstr",    name: "Bench dip, legs straight", cue: "Same, heels out in front. Shoulders stay down away from the ears." },
        { id: "belev",   name: "Bench dip, feet up",  cue: "Heels on a second chair so your weight sits further back. Much harder." },
        { id: "chair",   name: "Chair dip",           cue: "Two sturdy chairs as parallel bars. Slight forward lean, lower to parallel." },
        { id: "dneg",    name: "Dip negative",        cue: "On parallel bars, start locked out and lower for five seconds. Step off, repeat.", needs: "dipbars" },
        { id: "pbar",    name: "Parallel bar dip",    cue: "Slight forward lean, lower to upper arms parallel with the floor, press up.", needs: "dipbars" }
      ]
    },
    core: {
      label: "Core", unit: "sec",
      ladder: [
        { id: "kplank",  name: "Plank on knees",      cue: "Forearms down, knees down, one line from shoulders to knees. Ribs tucked." },
        { id: "plank",   name: "Plank",               cue: "Forearms and toes. Squeeze glutes, tuck the ribs, do not let the hips sag." },
        { id: "hollow",  name: "Hollow hold",         cue: "On your back, low back pressed flat, arms and legs off the floor." },
        { id: "rock",    name: "Hollow rock",         cue: "Hold the hollow shape and rock gently head to heel. The shape never changes." },
        { id: "kraise",  name: "Hanging knee raise",  cue: "Hang from a bar, knees to chest without swinging. Count the hold at the top.", needs: "bar" },
        { id: "tuckl",   name: "Tuck L-sit on floor", cue: "Hands on the floor beside your hips, press down, lift your knees clear of the ground." },
        { id: "lraise",  name: "Hanging leg raise",   cue: "Straight legs to bar height, slow all the way down. No kipping.", needs: "bar" }
      ]
    },
    side: {
      label: "Side", unit: "sec",
      ladder: [
        { id: "sknee",   name: "Side plank on knees", cue: "Bottom knee bent, hips stacked and lifted. Hold both sides." },
        { id: "side",    name: "Side plank",          cue: "Feet stacked, hips high, body in one straight line. Hold both sides." },
        { id: "reach",   name: "Side plank + reach",  cue: "Full side plank, thread the top arm under the body and back up." }
      ]
    }
  };

  const BASE = { push: 6, pull: 5, squat: 10, hinge: 10, dip: 6, core: 20, side: 15 };

  /* ---------- kit ---------------------------------------------------
     Defaults to nothing: everything works on a floor, a doorway, a
     table and two chairs. Turning a piece of kit on unlocks the rungs
     that need it.                                                     */
  const GEAR = [
    { id: "bar",     label: "Pull-up bar",   note: "A doorway bar, a park bar, or anything you can hang from." },
    { id: "dipbars", label: "Parallel bars", note: "A dip station or park parallettes. Two sturdy chairs cover most of this already." },
    { id: "table",   label: "A table you can hang your weight from", note: "It has to take your whole bodyweight pulling up on the edge. Glass, folding and flat-pack tables usually cannot — if in doubt, leave this off and row on a door instead." },
    { id: "band",    label: "Resistance bands", note: "Handled bands with a door anchor. They add both a horizontal row and the vertical pull a bar would otherwise give you." }
  ];

  /* ---------- per-variation coaching detail --------------------------
     Indexed to match each movement's ladder. `how` is setup and execution,
     `watch` is [fault, fix] — the specific way beginners break this rep.
     `vids` mixes direct links with tuned YouTube searches; a search link
     is always valid, which a guessed video id would not be.            */
  const YT = "https://www.youtube.com/results?search_query=";

  /* ---------- per-variation coaching detail --------------------------
     Indexed to match each movement's ladder. `how` is setup and execution,
     `watch` is [fault, fix] — the specific way beginners break this rep.
     `vids` mixes direct links with tuned YouTube searches; a search link
     is always valid, which a guessed video id would not be.            */
  const GUIDE = {
    push: {
      wall: { how: ["Stand an arm's length from a wall, hands flat at chest height and a little wider than your shoulders.",
              "Walk your feet back until your body is one straight line from heel to head.",
              "Bend the elbows and bring your chest to the wall, upper arms angling back at about 45° to your ribs.",
              "Press away until the arms are straight but not jammed at the elbow."],
        watch: [["Hips arriving before the chest", "Squeeze your glutes so the whole body moves as one board."],
                ["Elbows flaring straight out sideways", "Tuck them until your arms make an arrow shape with your torso."],
                ["Chin poking at the wall first", "Tuck the chin and let the chest arrive first."]],
        vids: [{ t: "The Perfect Push Up — Calisthenic Movement", url: "https://www.youtube.com/watch?v=IODxDxX7oi4" },
               { t: "Search: wall push-up form for beginners", q: "wall push up proper form beginners tutorial" }] },
      incline: { how: ["Put your hands on a stable waist-height surface — a kitchen counter, a windowsill, a heavy table.",
              "Step your feet back until your body is a straight line, weight through the hands.",
              "Lower until your chest touches the edge, elbows tracking back at roughly 45°.",
              "As it gets easy, drop to a lower surface: counter, then a chair, then a step, then the floor."],
        watch: [["A surface that slides or tips", "Load it with your full weight before the first rep — this is how wrists get hurt."],
                ["Hips sagging once you tire", "That sag is the real end of the set. Stop there."],
                ["Reps getting shorter as you fatigue", "Chest touches every rep or the rep does not count."]],
        vids: [{ t: "The Perfect Push Up — Calisthenic Movement", url: "https://www.youtube.com/watch?v=IODxDxX7oi4" },
               { t: "Search: incline push-up progression", q: "incline push up tutorial progression beginner" }] },
      knee: { how: ["Kneel with your hands under your shoulders, a little wider than shoulder width.",
              "Walk your knees back until shoulders, hips and knees form one line — push the hips forward to get there.",
              "Cross your ankles and lift the feet.",
              "Lower your chest to the floor over two to three seconds, press up in one."],
        watch: [["Hips piked back over the knees", "Push the hips forward until you feel the work in your abs, not just your arms."],
                ["Stopping halfway down", "Chest to the floor. A half rep trains half the range."],
                ["Sore kneecaps", "Fold a towel under them — this is not a knee-conditioning exercise."]],
        vids: [{ t: "The Perfect Push Up — Calisthenic Movement", url: "https://www.youtube.com/watch?v=IODxDxX7oi4" },
               { t: "Search: knee push-up correct form", q: "knee push up proper form common mistakes" }] },
      full: { how: ["Hands under the shoulders and slightly wider, fingers spread, index fingers pointing forward.",
              "Squeeze the glutes and pull the ribs down so your body is one rigid plank from heel to head.",
              "Lower over two to three seconds until your chest brushes the floor, elbows at about 45°.",
              "Press back up in about a second without letting the hips lead."],
        watch: [["A sagging low back", "Brace as if you are about to be punched. If you cannot hold it for the whole set, drop a rung."],
                ["Elbows out at 90° to the body", "That is where shoulder pain comes from. Tuck to 45°."],
                ["Head craning forward", "Look at a spot on the floor about a foot in front of your hands."]],
        vids: [{ t: "The Perfect Push Up — Calisthenic Movement", url: "https://www.youtube.com/watch?v=IODxDxX7oi4" },
               { t: "Push Up Tutorial — the calisthenics way", url: "https://www.youtube.com/watch?v=qoZ6NGEq8_4" },
               { t: "Search: push-up mistakes and fixes", q: "push up common mistakes how to fix form" }] },
      diamond: { how: ["Put your index fingers and thumbs together under your sternum so your hands form a triangle.",
              "Set the same rigid plank as a full push-up.",
              "Lower until your chest touches your hands, elbows brushing past your ribs.",
              "Press up. Expect far fewer reps than a normal push-up — that is the point."],
        watch: [["Wrist pain", "Widen the triangle slightly, or make fists and use parallel handles."],
                ["Elbows flaring wide", "They should stay close enough to graze your ribs on the way down."],
                ["Hands placed up under the chin", "Set them under the lower chest instead."]],
        vids: [{ t: "Search: diamond push-up form tutorial", q: "diamond push up proper form tutorial triceps" },
               { t: "Search: wrist prep for push-ups", q: "wrist warm up mobility routine before push ups" }] }
    },
    pull: {
      door: { how: ["Stand facing a doorframe with your feet close to it, gripping both sides at about chest height.",
              "Straighten your arms and lean back until they are taking your weight, body in one line.",
              "Pull your chest toward your hands, driving the shoulder blades together and down.",
              "Lower under control. Walk the feet forward to make it harder."],
        watch: [["Pulling with the arms only", "Start each rep by squeezing the shoulder blades, then let the arms follow."],
                ["Hips bending back", "Stay in one line from heel to head, as if standing up at an angle."],
                ["Shoulders creeping toward the ears", "Pull them down away from the ears before you pull your body in."]],
        vids: [{ t: "Search: doorway row beginner back exercise", q: "doorway row bodyweight back exercise beginner no equipment" }] },
      band: { how: ["If your set has a door anchor — a strap with a ball or a knot on one end — feed it through at chest height and shut the door on it, so the stopper sits on the far side and cannot pull back through.",
              "Set up on the side the door closes AGAINST, so pulling seats it into the frame. Give it a hard tug before you load it.",
              "Take a handle in each hand and step back until the band is taut with your arms straight.",
              "Row both handles to your lower ribs, elbows driving back, shoulder blades squeezing together. Return under control."],
        watch: [["Pinching the bare band in the door instead of using an anchor", "A band trapped on a door edge abrades and tears, and it fails toward your face. Use the anchor, or use a towel and row your bodyweight instead."],
                ["Letting the band snap you back", "Two to three seconds on the return. That half is most of the work."],
                ["Trying to progress by adding reps forever", "With a band you progress by TENSION, not leverage: step further back, double the band, or move to a heavier one once you clear the top of the rep range."]],
        vids: [{ t: "Search: resistance band row with door anchor", q: "resistance band row door anchor setup tutorial" },
               { t: "Search: band row form", q: "resistance band row proper form back exercise" }] },
      towel: { how: ["Throw a strong towel over the top of a door, then close and latch the door so it is pinched tight. Knot the ends together if it is long.",
              "Set up on the side the door closes AGAINST, so pulling seats it into the frame instead of swinging it open. Give it a hard tug before you trust it.",
              "Hold one end in each hand, feet either side of the door, and lean back with straight arms.",
              "Pull your chest toward the door, elbows driving back, shoulder blades squeezing together. Walk the feet in to make it harder."],
        watch: [["The door moving at all", "Stop. You are on the wrong side, or the latch is not holding. This is the one thing that can actually hurt you here."],
                ["Pulling with the arms only", "Start each rep by squeezing the shoulder blades, then let the arms follow."],
                ["Hips folding back", "Stay in one line from heel to head, as if standing up at an angle."]],
        vids: [{ t: "Search: towel door row at home", q: "towel door row back exercise no equipment tutorial" },
               { t: "Search: no-equipment back workout", q: "back workout no equipment no pull up bar at home" }] },
      table: { how: ["Lie under a sturdy table, chest below the edge, and grip it with both hands.",
              "Bend your knees, heels on the floor, and hold your body straight from knee to head.",
              "Pull your chest to the edge of the table, shoulder blades squeezing together.",
              "Lower slowly. Straighten the legs out to make it harder."],
        watch: [["A table that lifts or slides", "Test it hard before you trust it with your bodyweight."],
                ["Hips dropping toward the floor", "Squeeze the glutes and keep a straight line."],
                ["Chest never reaching the edge", "Shorten the range by walking the feet in, rather than doing partial reps."]],
        vids: [{ t: "Inverted Rows — beginner to advanced progressions", url: "https://www.youtube.com/watch?v=Fl0UMfdEzsE" },
               { t: "Search: table row at home", q: "table row bodyweight back exercise at home beginner" }] },
      towelhi: { how: ["Set the towel over a latched door as before, and test it hard.",
              "Walk your feet toward the door until your body is at a shallow angle — the closer to horizontal, the harder.",
              "Hold one line from heel to head and pull your chest to your hands.",
              "Lower over two to three seconds. A broom handle laid across two sturdy chairs gives the same angle if you prefer to lie underneath."],
        watch: [["Feet slipping out", "Train barefoot or in grippy shoes, and put a mat under your heels on smooth floors."],
                ["Hips sagging toward the floor", "Squeeze the glutes. A level body is the whole reason this is harder than the last rung."],
                ["Grip failing before your back does", "Wrap the towel once around each hand, or knot the ends into handles."]],
        vids: [{ t: "Search: towel row feet forward", q: "towel door row feet forward horizontal bodyweight row" },
               { t: "Search: inverted row with two chairs and a bar", q: "inverted row two chairs broomstick at home setup" }] },
      bandpull: { how: ["Anchor the band at the TOP of a closed, latched door.",
              "Kneel or sit far enough back that the band is taut with your arms straight overhead.",
              "Pull the handles down and slightly apart toward your chest, driving the elbows down and squeezing the shoulder blades.",
              "Return slowly all the way to straight arms. This is the vertical pull a pull-up trains, which is why it is worth the extra setup."],
        watch: [["Leaning back so your bodyweight does the work", "Stay upright — the band should be doing the resisting, not your hips."],
                ["Shoulders shrugging toward the ears", "Start each rep by pulling the shoulder blades down, then bend the arms."],
                ["Wear where the band crosses the door edge", "Check it for nicks before every session and retire it at the first sign of fraying."]],
        vids: [{ t: "Search: band lat pulldown at home", q: "resistance band lat pulldown door anchor kneeling tutorial" },
               { t: "Search: band pull-apart for upper back", q: "band pull apart face pull upper back tutorial" }] },
      tablehi: { how: ["Set up as for a table row, but put your heels on a chair so your body is level from shoulder to heel.",
              "Grip the edge with straight arms and squeeze the glutes so you are one rigid line.",
              "Pull your chest to the edge, driving the shoulder blades together and down.",
              "Lower over two to three seconds."],
        watch: [["Hips sagging toward the floor", "Squeeze the glutes. A level body is the whole reason this is harder than a table row."],
                ["The chair sliding out from under your heels", "Put it against a wall before you start."],
                ["Shoulders shrugging toward the ears", "Set the blades down and back before each pull."]],
        vids: [{ t: "Inverted rows — beginner to advanced progressions", url: "https://www.youtube.com/watch?v=Fl0UMfdEzsE" },
               { t: "Search: feet-elevated bodyweight row", q: "feet elevated inverted row bodyweight no bar tutorial" }] },
      inv: { how: ["Set a bar at about hip height — a low bar, a smith machine, or rings.",
              "Hang underneath it with your body horizontal, heels on the floor, arms straight.",
              "Pull until your chest touches the bar, elbows tracking back past your ribs.",
              "Lower over two to three seconds. Raise the bar to make it easier, lower it to make it harder."],
        watch: [["Hips sagging so only the chin reaches the bar", "Squeeze the glutes; the chest must be what touches."],
                ["Shrugging into the ears", "Depress the shoulder blades first, then pull."],
                ["Bouncing the heels", "Keep the feet still — a bounced rep is a rep you did not do."]],
        vids: [{ t: "Inverted Rows — beginner to advanced progressions", url: "https://www.youtube.com/watch?v=Fl0UMfdEzsE" },
               { t: "Get your first pull-up with inverted rows", url: "https://www.youtube.com/watch?v=eRxOKu_MiVE" },
               { t: "Search: inverted row form", q: "inverted row proper form tutorial progressions" }] },
      onearm: { how: ["Stand beside an open doorway and take the frame with one hand at about chest height.",
              "Walk your feet toward the frame and lean back until that arm is carrying your weight, body straight.",
              "Pull your chest toward that hand, keeping both hip bones facing the ceiling.",
              "All the reps, then swap sides. Walk the feet back to make it easier. A solid post, railing or table edge works the same way."],
        watch: [["Hips rotating open toward the free side", "Staying square is the entire difficulty — slow right down until you can."],
                ["Hand slipping on a painted frame", "Hook the fingers around the edge of the frame, or drape a towel over it and hold that."],
                ["A sudden jump in difficulty", "This is roughly a negative pull-up in effort. Regress by walking the feet back."]],
        vids: [{ t: "Search: one-arm doorway row", q: "one arm doorway row bodyweight back exercise tutorial" },
               { t: "Search: back training with no pull-up bar", q: "back workout no pull up bar bodyweight at home" }] },
      neg: { how: ["Set a box or step under the bar so you can start with your chin already over it.",
              "Step or jump up to the top position and hold it for a second, shoulders pulled down.",
              "Lower yourself as slowly as you can — aim for a full five seconds.",
              "Step back up and repeat. You are training only the lowering half, which is where the strength comes from."],
        watch: [["Dropping fast after the first inch", "If you cannot control five seconds, do three and build up."],
                ["Shoulders shrugged at the top", "Pull them down and back before you begin lowering."],
                ["Doing these every day", "They are demanding on the elbows — keep them to your pull sessions."]],
        vids: [{ t: "Get your first pull-up with inverted rows", url: "https://www.youtube.com/watch?v=eRxOKu_MiVE" },
               { t: "Search: negative pull-up tutorial", q: "negative pull up tutorial how to get first pull up" }] },
      pullup: { how: ["Hang from the bar with an overhand grip a little wider than your shoulders.",
              "Before pulling, draw your shoulders down and back — the bar should feel like it moves away from your ears.",
              "Pull until your chin clears the bar, keeping your body still rather than kicking.",
              "Lower all the way to a straight-arm hang. That full hang is part of the rep."],
        watch: [["Kipping and swinging", "If you need momentum, you need the negative instead."],
                ["Stopping short of a full hang", "Half-locked elbows at the bottom rob you of most of the range."],
                ["Chin stretching over instead of the chest rising", "Think about pulling your elbows to your ribs."]],
        vids: [{ t: "Get your first pull-up with inverted rows", url: "https://www.youtube.com/watch?v=eRxOKu_MiVE" },
               { t: "Search: pull-up tutorial proper form", q: "pull up tutorial proper form calisthenics beginner" }] }
    },
    squat: {
      box: { how: ["Stand in front of a chair, feet about shoulder width, toes turned slightly out.",
              "Push your hips back and sit down under control — no flopping onto the seat.",
              "Stand back up without rocking forward or using your hands.",
              "Use a lower seat as you get stronger."],
        watch: [["Rocking forward to build momentum", "Pause for a beat sitting down, then stand from a dead stop."],
                ["Knees caving inward", "Push them out so they track over your middle toes."],
                ["Heels lifting", "Drive through the whole foot; if the heels still lift, try a slightly wider stance."]],
        vids: [{ t: "Search: box squat to chair beginner form", q: "box squat to chair beginner proper form bodyweight" }] },
      bw: { how: ["Feet about shoulder width, toes turned slightly out, arms out in front for balance.",
              "Push the hips back and down, keeping your chest tall.",
              "Go until your hip crease is below your knee, if your ankles and hips allow it.",
              "Drive up through the whole foot, squeezing the glutes at the top."],
        watch: [["Chest folding toward the floor", "Think about keeping your sternum up as you descend."],
                ["Knees caving in", "Push the knees out over the middle toes throughout."],
                ["Stopping high", "Depth is the whole point. If you cannot reach it, work on the deep squat hold on mobility days."]],
        vids: [{ t: "Search: bodyweight squat depth and form", q: "bodyweight squat proper form depth tutorial" },
               { t: "Search: ankle mobility for squat depth", q: "ankle mobility drills to squat deeper" }] },
      split: { how: ["Step one foot forward into a long stance, feet about hip width apart side to side.",
              "Lower straight down until the back knee lightly touches the floor.",
              "Keep your weight on the front heel and your torso upright.",
              "Drive up through the front foot. Finish all reps on one side, then swap."],
        watch: [["Front knee shooting far past the toes", "Take a longer stance."],
                ["Wobbling side to side", "Widen the gap between the feet — do not stand on a tightrope."],
                ["Pushing off the back foot", "The back leg is a kickstand; the front leg does the work."]],
        vids: [{ t: "Search: split squat form tutorial", q: "split squat proper form tutorial beginner" }] },
      bulg: { how: ["Put the top of your rear foot on a chair or bench behind you.",
              "Hop the front foot far enough forward that the shin stays close to vertical at the bottom.",
              "Lower under control until the front thigh is roughly parallel to the floor.",
              "Drive up through the front heel. Expect this to be much harder than it looks."],
        watch: [["Balance failing before the muscle does", "Hold a doorframe or wall with one hand — it is not cheating."],
                ["Front knee travelling forward", "Move the front foot further out."],
                ["Rear ankle or knee pain", "Pad the bench, or rest the toes on the floor behind you instead."]],
        vids: [{ t: "Bulgarian split squat — beginner to advanced", url: "https://www.youtube.com/watch?v=rah3eJCPXHA" },
               { t: "Bulgarian split squat proper form", url: "https://www.youtube.com/watch?v=hiLF_pF3EJM" },
               { t: "Search: bulgarian split squat setup", q: "bulgarian split squat setup foot placement tutorial" }] },
      pistol: { how: ["Stand on one leg beside a doorframe, holding it lightly with one hand for balance.",
              "Extend the other leg out in front, roughly straight.",
              "Sit back and down to a low box or chair, touch it, and stand back up on the same leg.",
              "Lower the box over time until you can do it with nothing behind you."],
        watch: [["Collapsing onto the box", "Control the last few inches — that is the part that builds the strength."],
                ["Heel lifting off the floor", "Work ankle mobility; a slight heel raise underfoot is a fine interim fix."],
                ["Knee pain", "Back off to Bulgarian split squats — this rung needs a base you may not have yet."]],
        vids: [{ t: "Search: pistol squat progression", q: "pistol squat progression beginner box assisted tutorial" }] }
    },
    hinge: {
      bridge: { how: ["Lie on your back, knees bent, feet flat and about hip width, heels close to your hips.",
              "Drive through the heels and lift the hips until your body is a straight line from knee to shoulder.",
              "Squeeze the glutes hard at the top for a full second.",
              "Lower under control without letting the hips crash down."],
        watch: [["Arching the low back at the top", "Tuck the ribs down and stop where the glutes are doing the work."],
                ["Feeling it in the hamstrings only", "Bring the heels closer to your hips."],
                ["Rushing the top", "The squeeze at the top is the exercise."]],
        vids: [{ t: "Search: glute bridge form", q: "glute bridge proper form tutorial beginner" }] },
      slbridge: { how: ["Set up as for a glute bridge, then pull one knee toward your chest and hold it there.",
              "Drive through the heel of the planted foot and lift the hips.",
              "Keep both hip bones level — do not let the free side drop.",
              "Complete all reps, then swap sides."],
        watch: [["Hips tilting toward the free leg", "Slow down; level hips matter more than height."],
                ["Hamstring cramping", "Normal at first — shorten the range and build up."],
                ["Pushing off the toes", "Drive through the heel."]],
        vids: [{ t: "Search: single leg glute bridge tutorial", q: "single leg glute bridge proper form tutorial" }] },
      thrust: { how: ["Sit on the floor with your upper back against the edge of a couch or bench, knees bent, feet flat.",
              "Tuck your chin and drive through the heels to lift the hips to full lockout.",
              "Squeeze the glutes hard at the top, ribs down.",
              "Lower until your hips almost touch the floor and go again."],
        watch: [["Ribs flaring at lockout", "Keep the chin tucked and the ribs down; finish with the glutes, not the low back."],
                ["The bench sliding away", "Brace it against a wall."],
                ["Feet too close in", "Shins should be roughly vertical at the top."]],
        vids: [{ t: "Search: hip thrust form without weight", q: "bodyweight hip thrust proper form tutorial couch" }] },
      nordic: { how: ["Kneel on something padded with your heels anchored — under a heavy couch, or held by a partner.",
              "Keep your body in one line from knee to head, ribs down, glutes on.",
              "Lower forward as slowly as you can, resisting the whole way.",
              "Catch yourself with your hands, push back to the start, and repeat."],
        watch: [["Bending at the hips", "The hips stay open; only the knees change angle."],
                ["Falling after a few inches", "Perfectly normal. Put your hands out early and lengthen the controlled part over weeks."],
                ["Hamstring cramping or sharp pain", "Stop the set. This rung is very demanding — two or three reps is a real set."]],
        vids: [{ t: "The ultimate Nordic curl progression", url: "https://www.youtube.com/watch?v=LWfqK8-w1J4" },
               { t: "A 7-step Nordic curl progression", url: "https://www.youtube.com/watch?v=QCVces5NcPc" },
               { t: "Search: nordic curl at home setup", q: "nordic hamstring curl at home anchor feet setup beginner" }] }
    },
    dip: {
      bknee: { how: ["Sit on the edge of a sturdy chair, hands beside your hips gripping the edge.",
              "Slide your hips forward off the seat, knees bent and feet flat, close to the chair.",
              "Lower by bending the elbows straight back until your upper arms are about parallel to the floor.",
              "Press back up without locking the elbows hard."],
        watch: [["Elbows flaring out to the sides", "Drive them straight back behind you."],
                ["Shoulders rolling forward and up", "Keep the chest open and the shoulders down away from the ears."],
                ["Going far too deep", "Stop at about parallel; deeper puts the shoulder in a bad spot."]],
        vids: [{ t: "Bench dip tutorial", url: "https://www.youtube.com/watch?v=M_s88yMWTYI" },
               { t: "Search: bench dip form beginners", q: "bench dip proper form beginners tutorial triceps" }] },
      bstr: { how: ["Same setup as the knees-bent bench dip, but walk your heels out until the legs are straight.",
              "Keep your hips close to the chair as you lower.",
              "Lower to about parallel, elbows tracking straight back.",
              "Press up. Elevating the heels on a second chair makes it harder again."],
        watch: [["Hips drifting away from the chair", "The further out they go, the more the shoulders take — keep them close."],
                ["Shrugging at the bottom", "Actively press the shoulders down."],
                ["Wrist discomfort", "Grip the edge rather than flattening the palms, or move to parallel bars sooner."]],
        vids: [{ t: "Bench dip tutorial", url: "https://www.youtube.com/watch?v=M_s88yMWTYI" },
               { t: "Search: bench dip progression", q: "bench dip progression legs elevated tutorial" }] },
      belev: { how: ["Hands on the chair behind you as for a bench dip.",
              "Put your heels on a second chair so your legs are level with your hips.",
              "Lower until your upper arms are about parallel to the floor, elbows tracking straight back.",
              "Press up without locking the elbows hard."],
        watch: [["Shoulders rolling forward and up", "Keep the chest open and press the shoulders down."],
                ["Dropping below parallel", "The front of the shoulder pays for the extra depth."],
                ["Hips drifting away from the chair", "Keep them brushing the edge the whole way down."]],
        vids: [{ t: "Bench dip tutorial", url: "https://www.youtube.com/watch?v=M_s88yMWTYI" },
               { t: "Search: feet-elevated bench dip", q: "feet elevated bench dip proper form tutorial" }] },
      chair: { how: ["Set two sturdy chairs facing each other, seats about shoulder width apart.",
              "Load them with your full weight before you trust them — this is the step people skip.",
              "Support yourself on straight arms, ankles crossed, leaning slightly forward.",
              "Lower until your upper arms are roughly parallel, then press back up."],
        watch: [["Chairs sliding apart", "Set them on carpet or against a wall, and re-test them every session."],
                ["A bolt-upright torso", "A slight forward lean is correct and keeps the shoulder safe."],
                ["Elbows flaring wide", "Keep them tracking back behind you."]],
        vids: [{ t: "Beginners dips tutorial — progressions and mistakes", url: "https://www.youtube.com/watch?v=nHRrW_JSru8" },
               { t: "Search: chair dips at home", q: "chair dips at home proper form two chairs tutorial" }] },
      dneg: { how: ["On parallel bars, jump or step up to the top with your arms straight, leaning slightly forward.",
              "Pull the shoulders down away from the ears and hold for a second.",
              "Lower yourself as slowly as you can — aim for five seconds — until the upper arms are parallel.",
              "Step off, climb back to the top, and repeat."],
        watch: [["Sinking fast the moment you start", "Three controlled seconds beats five uncontrolled ones."],
                ["Shoulders rising toward the ears at the top", "Depress them before you begin lowering."],
                ["Pain at the front of the shoulder", "Stop. Go back to bench dips and build more base first."]],
        vids: [{ t: "Beginners dips tutorial — progressions and mistakes", url: "https://www.youtube.com/watch?v=nHRrW_JSru8" },
               { t: "Search: dip negatives tutorial", q: "dip negatives tutorial first parallel bar dip progression" }] },
      pbar: { how: ["Support yourself at the top of parallel bars, arms straight, body leaning slightly forward.",
              "Lower under control until your upper arms are roughly parallel to the floor.",
              "Keep the elbows tracking back rather than flaring wide.",
              "Press up to straight arms without shrugging."],
        watch: [["Going as deep as possible", "Parallel is the target. Extra depth is where shoulders get hurt."],
                ["Swinging the legs to help", "Keep them still, or cross the ankles."],
                ["Fully upright torso", "A slight forward lean is correct and keeps the shoulder safe."]],
        vids: [{ t: "Beginners dips tutorial — progressions and mistakes", url: "https://www.youtube.com/watch?v=nHRrW_JSru8" },
               { t: "How to do parallel bar dips", url: "https://www.youtube.com/watch?v=U7HeutDqS_w" },
               { t: "Search: dip form mistakes", q: "parallel bar dip proper form common mistakes shoulder" }] }
    },
    core: {
      kplank: { how: ["Set your forearms on the floor, elbows under the shoulders, knees down.",
              "Walk the knees back until you make one straight line from shoulders to knees.",
              "Pull the ribs down, squeeze the glutes, and hold.",
              "Breathe normally throughout — do not hold your breath."],
        watch: [["Hips sagging toward the floor", "That ends the hold. Note the time and stop."],
                ["Holding your breath", "If you cannot breathe, you are bracing too hard."],
                ["Shoulders creeping toward the ears", "Push the floor away and keep the neck long."]],
        vids: [{ t: "Search: plank form common mistakes", q: "plank proper form common mistakes tutorial" }] },
      plank: { how: ["Forearms on the floor, elbows directly under the shoulders, feet back on the toes.",
              "Make one straight line from heel to head — no sag, no pike.",
              "Squeeze the glutes and pull the ribs down as if bracing for a punch.",
              "Hold and breathe. Stop the moment the line breaks."],
        watch: [["Hips piking up toward the ceiling", "It feels easier because it is. Drop the hips into line."],
                ["Low back sagging", "Tuck the pelvis slightly and squeeze the glutes harder."],
                ["Chasing longer times with a broken shape", "Thirty honest seconds beats two sloppy minutes."]],
        vids: [{ t: "Search: plank form common mistakes", q: "plank proper form common mistakes tutorial" },
               { t: "Search: how long should you plank", q: "how long should you hold a plank form over time" }] },
      hollow: { how: ["Lie on your back, arms overhead, legs straight.",
              "Press your low back flat into the floor and keep it there — this is the whole exercise.",
              "Lift your arms, head and legs a few inches off the floor into a shallow banana shape.",
              "If the back lifts, raise the legs higher or tuck the knees until it stays flat."],
        watch: [["Low back arching off the floor", "Your hip flexors have taken over. Raise the legs until the back flattens again."],
                ["Neck straining", "Keep the chin lightly tucked and look at your knees."],
                ["Expecting plank-like times", "Twenty seconds here is a good hold. It is much harder than a plank."]],
        vids: [{ t: "Search: hollow body hold tutorial", q: "hollow body hold tutorial proper form regression" },
               { t: "Search: hollow hold regressions", q: "hollow hold easier regression tuck variation beginner" }] },
      rock: { how: ["Get into a hollow hold: low back pressed flat, arms overhead, legs off the floor.",
              "Without changing that shape at all, rock gently from your shoulders to your heels.",
              "The motion comes from a small push, never from bending at the hips.",
              "Count the seconds you can keep rocking with the shape intact."],
        watch: [["The banana shape folding up mid-rock", "Stop the set. A rock with a broken shape trains nothing."],
                ["Low back lifting off the floor", "Raise the legs higher until it presses flat again."],
                ["Rocking by bending at the hips", "The whole body moves as one piece, like a rocking chair."]],
        vids: [{ t: "Search: hollow rock tutorial", q: "hollow rock tutorial proper form gymnastics core" },
               { t: "Search: hollow body progression", q: "hollow body hold progression beginner to advanced" }] },
      kraise: { how: ["Hang from a bar with straight arms, shoulders pulled down away from your ears.",
              "Without swinging, raise both knees toward your chest.",
              "Pause at the top and count the hold there.",
              "Lower slowly and under control — no dropping and rebounding."],
        watch: [["Swinging between reps", "Pause at the bottom in a dead hang until you are still."],
                ["Grip failing before the abs", "Use straps, or build grip with dead hangs on mobility days."],
                ["Only the hip flexors working", "Curl the pelvis slightly at the top rather than just lifting the thighs."]],
        vids: [{ t: "Search: hanging knee raise tutorial", q: "hanging knee raise proper form tutorial no swinging" }] },
      tuckl: { how: ["Sit with your knees bent and your hands flat on the floor beside your hips, fingers pointing forward.",
              "Press down hard through straight arms and pull your shoulders down away from your ears.",
              "Lift your hips, then tuck your knees up so your feet clear the floor.",
              "Hold. Hands on books or blocks buys you height and makes it far easier at first."],
        watch: [["Feet that will not leave the floor", "Put your hands on two stacks of books — almost everyone needs this at first."],
                ["Shoulders shrugged up by your ears", "Push the floor away and down; the lift comes from there, not the arms."],
                ["Wrist pain", "Use fists, or parallel handles if you have them."]],
        vids: [{ t: "Search: tuck L-sit progression", q: "tuck l sit progression floor beginner tutorial" },
               { t: "Search: L-sit for beginners", q: "l sit beginner tutorial progression at home" }] },
      lraise: { how: ["Dead hang from the bar, shoulders down and back, legs straight and together.",
              "Raise the legs, keeping them straight, until your toes reach bar height if you can.",
              "Lower slowly with no swing at all.",
              "Count the time under control rather than the reps."],
        watch: [["Kipping to get the legs up", "Slow the lowering right down and use fewer reps."],
                ["Knees bending as you tire", "Switch back to knee raises for the rest of the set."],
                ["Low back arching at the bottom", "Keep the pelvis slightly tucked throughout."]],
        vids: [{ t: "Search: hanging leg raise tutorial", q: "hanging leg raise proper form tutorial strict" }] }
    },
    side: {
      sknee: { how: ["Lie on your side, forearm on the floor with the elbow under your shoulder, knees bent behind you.",
              "Lift your hips so you make a straight line from knee to head.",
              "Stack the hips squarely on top of each other.",
              "Hold, breathe, then do the same on the other side. Both sides count as one set."],
        watch: [["Rolling toward the floor", "Stack the hips and the top shoulder directly over the bottom ones."],
                ["Hips dropping as you tire", "That is the end of the hold."],
                ["Elbow ahead of or behind the shoulder", "Put it directly underneath."]],
        vids: [{ t: "Search: side plank on knees tutorial", q: "side plank knees modified proper form beginner" }] },
      side: { how: ["Lie on your side, elbow under your shoulder, legs straight with the feet stacked.",
              "Lift the hips into one straight line from heel to head.",
              "Keep the top hip stacked over the bottom one, not rotated toward the floor.",
              "Hold, then repeat on the other side."],
        watch: [["Hips sinking", "Push the bottom forearm hard into the floor and lift."],
                ["Body rotating forward", "Square the shoulders and hips; imagine your back against a wall."],
                ["Stacking the feet feeling impossible", "Put the top foot on the floor in front instead — that is a fine variation."]],
        vids: [{ t: "Search: side plank proper form", q: "side plank proper form tutorial common mistakes" }] },
      reach: { how: ["Start in a full side plank with the top arm reaching toward the ceiling.",
              "Keeping the hips high, thread the top arm under your body, rotating the ribcage.",
              "Reverse the motion and reach back up to the ceiling.",
              "Move slowly — count the reps, not the time."],
        watch: [["Hips dropping during the reach", "The hips stay high; only the ribcage rotates."],
                ["Rushing the movement", "Two seconds under, two seconds back."],
                ["Losing the line", "If the shape breaks, go back to the plain side plank for that set."]],
        vids: [{ t: "Search: side plank thread the needle", q: "side plank thread the needle rotation exercise tutorial" }] }
    }
  };
  function guide(move, id) { return (GUIDE[move] || {})[id] || null; }

  /* @@DEMOS@@ */


  /* ---------- sessions ---------------------------------------------
     Recovery-day items carry the same shape of detail as an exercise,
     so a mobility day is something you can learn rather than a list of
     names you tick. `needs` / `unless` swap items on your kit.        */
  const SESSIONS = {
    A: { name: "Session A", focus: "Push emphasis",
         blocks: [{ m: "push", sets: 3 }, { m: "dip", sets: 3 }, { m: "squat", sets: 3 }, { m: "core", sets: 3 }] },
    B: { name: "Session B", focus: "Pull emphasis",
         blocks: [{ m: "pull", sets: 3 }, { m: "hinge", sets: 3 }, { m: "push", sets: 2 }, { m: "side", sets: 2 }] },
    C: { name: "Session C", focus: "Legs and core",
         blocks: [{ m: "squat", sets: 4 }, { m: "hinge", sets: 3 }, { m: "core", sets: 3 }, { m: "pull", sets: 2 }] },
    M: { name: "Mobility", focus: "Active recovery",
         checks: [
           { id: "hang", t: "Dead hang", d: "Two sets, as long as the grip holds.", needs: "bar",
             why: "Decompresses the spine and stretches the lats and shoulders in the exact position a pull-up demands. It also builds the grip that fails before your back does.",
             how: ["Take an overhand grip a little wider than your shoulders and step off.",
                   "Let the shoulders rise toward your ears and simply hang — this is a passive hang.",
                   "Breathe slowly. Aim for thirty seconds, twice, and build from there.",
                   "Step down under control rather than dropping."],
             watch: [["Shoulder pain while hanging", "Come down. Build up with a doorway lat opener first."],
                     ["Grip failing in seconds", "Normal at the start. Do more shorter hangs rather than fewer long ones."]],
             vids: [{ t: "Search: dead hang benefits and how to", q: "dead hang tutorial benefits how long beginner" }] },
           { id: "doorhang", t: "Doorway lat opener", d: "The no-bar stand-in for a dead hang. Ninety seconds a side.", unless: "bar",
             why: "Opens the lats and the front of the shoulder without needing anything to hang from, which is most of what a dead hang gives a beginner.",
             how: ["Take a doorframe with one hand at about head height.",
                   "Step through slightly and sink your hips back and away from that hand.",
                   "Let your ribs rotate open until you feel a long stretch down the side of your back.",
                   "Breathe into it for ninety seconds, then swap sides."],
             watch: [["Pinching at the front of the shoulder", "Lower your hand and turn your chest more toward the door."],
                     ["Holding your breath", "The stretch only releases when you breathe out slowly into it."]],
             vids: [{ t: "Search: doorway lat stretch", q: "doorway lat stretch shoulder opener tutorial" }] },
           { id: "squat", t: "Deep squat hold", d: "Two minutes total, broken up however you like.",
             why: "The bottom of a squat is a position most adults have lost. Sitting in it restores the ankle and hip range that squat depth depends on.",
             how: ["Sink into the bottom of a squat with your heels down and feet a little wider than your shoulders.",
                   "Put your elbows inside your knees and push them gently outward.",
                   "Keep your chest up and your weight through the whole foot.",
                   "Hold. Two minutes in total — thirty seconds at a time is fine."],
             watch: [["Heels lifting off the floor", "Put a rolled towel or a book under them, and widen your stance."],
                     ["Toppling backwards", "Hold a doorframe and let it take some weight until the range comes back."]],
             vids: [{ t: "Search: deep squat hold mobility", q: "deep squat hold mobility drill ankle hip beginner" }] },
           { id: "shoulder", t: "Shoulder pass-through", d: "Twenty slow reps with a broomstick or towel.",
             why: "Restores overhead range and warms the shoulder capsule, which is what protects you in dips, push-ups and hangs.",
             how: ["Hold a broomstick or a towel with a very wide overhand grip.",
                   "Keep the arms straight and lift it over your head and behind you.",
                   "Go only as far as you can without bending the elbows, then return.",
                   "Twenty slow reps. Narrow the grip a little as the range improves."],
             watch: [["Elbows bending to get it round", "Widen the grip. Bending is the range cheating."],
                     ["Ribs flaring as it goes overhead", "Keep the ribs down; the movement comes from the shoulders."]],
             vids: [{ t: "Search: shoulder dislocates with a stick", q: "shoulder pass through dislocates stick mobility tutorial" }] },
           { id: "catcow", t: "Cat-cow and thoracic rotation", d: "Ten rounds, then ten rotations per side.",
             why: "Gets the mid-back moving. A stiff thoracic spine is why many people cannot keep a flat back in planks and rows.",
             how: ["On all fours, alternately round and arch your back through a full slow range — ten rounds.",
                   "Then put one hand behind your head, elbow out.",
                   "Rotate that elbow down under your body, then open it up toward the ceiling.",
                   "Ten per side, following the elbow with your eyes."],
             watch: [["Moving only at the low back", "Aim the movement between the shoulder blades."],
                     ["Rushing", "Two seconds each way. This is not a rep to get through."]],
             vids: [{ t: "Search: thoracic rotation drill", q: "cat cow thoracic rotation mobility drill tutorial" }] },
           { id: "couch", t: "Couch stretch", d: "Ninety seconds a side.",
             why: "Opens the hip flexors, which shorten from sitting and quietly limit both squat depth and glute bridge lockout.",
             how: ["Kneel in front of a couch and put the top of your rear foot up on it.",
                   "Bring the other foot forward and flat, in a lunge.",
                   "Square your hips and squeeze the glute on the kneeling side — this is what makes it work.",
                   "Stay tall and breathe for ninety seconds, then swap."],
             watch: [["Low back arching to get upright", "Tuck the pelvis and squeeze the glute; come out of the stretch a little."],
                     ["Sore kneecap", "Pad the knee with a cushion."]],
             vids: [{ t: "Search: couch stretch hip flexor", q: "couch stretch hip flexor tutorial proper form" }] },
           { id: "wrist", t: "Wrist prep", d: "One minute. Do this before every pushing day.",
             why: "Wrist and elbow pain is what ends most beginner calisthenics runs — far more often than muscle soreness. One minute prevents most of it.",
             how: ["On all fours, put your palms flat with the fingers pointing forward, and rock gently forward and back.",
                   "Turn the hands so the fingers point back toward your knees, and rock again, gently.",
                   "Then flip to the backs of the hands and rock very lightly.",
                   "About twenty seconds in each position. Never push into pain."],
             watch: [["Sharp pain in the wrist joint", "Reduce the range hard. This is preparation, not a stretch to win."],
                     ["Skipping it on push days", "That is exactly when it matters."]],
             vids: [{ t: "Search: wrist warm up for calisthenics", q: "wrist warm up mobility routine calisthenics push ups" }] }
         ] },
    R: { name: "Rest", focus: "Full rest",
         checks: [
           { id: "rest", t: "Rest taken", d: "Nothing to prove today.",
             why: "Training is the stimulus; the adaptation happens now. Skipping rest days is the most common way beginners stall or get hurt.",
             how: ["Do no strength work today.",
                   "Gentle movement is fine — a walk, easy stretching, playing a sport for fun.",
                   "If you feel compelled to train, that is usually a sign the rest is needed."],
             watch: [["Sneaking in 'just a few' push-ups", "Consistency across weeks beats squeezing in one more session."]],
             vids: [] },
           { id: "sleep", t: "Slept seven hours or more", d: "The biggest single lever on progress.",
             why: "Most strength adaptation and tissue repair happens during sleep. Under-sleeping blunts progress more than any programming mistake.",
             how: ["Aim for seven to nine hours.",
                   "Keep the wake time steady; that anchors the whole rhythm.",
                   "If a session felt unusually heavy, look at last night before blaming the program."],
             watch: [["Chasing harder training on poor sleep", "Reduce the sets instead. Fatigue you cannot recover from is not training."]],
             vids: [] },
           { id: "protein", t: "Ate enough protein", d: "Roughly 1.6 g per kg of bodyweight.",
             why: "Strength needs material to build with. Bodyweight training is no exception, even though nothing is being lifted but you.",
             how: ["Aim for roughly 1.6 grams per kilogram of bodyweight across the day.",
                   "Spread it over your meals rather than loading it into one.",
                   "Any source counts — this is about the daily total, not timing."],
             watch: [["Training hard while eating far too little", "You will feel it as stalled reps before you see it anywhere else."]],
             vids: [] },
           { id: "walk", t: "Walked", d: "Twenty to thirty easy minutes.",
             why: "Easy movement keeps blood moving through sore tissue without adding fatigue, and it tends to leave you less stiff tomorrow.",
             how: ["Twenty to thirty minutes at a conversational pace.",
                   "Outdoors if you can.",
                   "This should feel restorative. If it feels like training, slow down."],
             watch: [["Turning the walk into a workout", "That defeats the point of the day."]],
             vids: [] }
         ] }
  };

  const DAY_PLAN = { 1: "A", 2: "M", 3: "B", 4: "M", 5: "C", 6: "M", 0: "R" };
  const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const VIDEOS = [
    { t: "Calisthenics for Complete Beginners — tips, exercise form, programming",
      url: "https://www.youtube.com/watch?v=1mlN0yuxoLE",
      meta: "Primer · form + programming · Dec 2022",
      why: "Start here. It covers why the progressions are ordered the way they are, plus warming up and how sets and reps work — the part that keeps you training in month three." },
    { t: "The Best Workout Plan to Start Calisthenics for Beginners",
      url: "https://www.youtube.com/watch?v=LuM1PZgxWjI",
      meta: "Plan · three days a week · Feb 2026",
      why: "Lays out an explicit three-day beginner split — the same shape as sessions A, B and C in this log. The most recent of these." },
    { t: "20 Min Beginner Calisthenics Workout at Home — no equipment",
      url: "https://www.youtube.com/watch?v=kuUZYUBHryw",
      meta: "Follow-along · 20 min · Feb 2024",
      why: "For days when you want to be told what to do. Nothing needed but floor space." },
    { t: "How to Start Calisthenics for Beginners — best workout routine",
      url: "https://www.youtube.com/watch?v=fO8QmrsCOOE",
      meta: "Guide · full walkthrough · Feb 2025",
      why: "A second take on the same fundamentals. Useful when one coach's cue for a movement does not click." },
    { t: "How to Start Calisthenics — a complete beginner's guide",
      url: "https://www.youtube.com/watch?v=XQJp42f7GJQ",
      meta: "Guide · getting started",
      why: "Broad orientation: equipment, where to train, what the first month actually looks like." },
    { t: "Calisthenicmovement — channel",
      url: "https://www.youtube.com/@calisthenicmovement",
      meta: "Channel · technique library",
      why: "The reference library, and the channel most consistently named as the safest starting point for beginners. When a movement hurts or stalls, their tutorial for it is usually the clearest one on the platform." }
  ];

  /* ---------- date helpers ----------------------------------------- */
  const pad = (n) => String(n).padStart(2, "0");
  const ymd = (d) => d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  function parseYMD(s) { const p = s.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function addDays(d, n) { const x = new Date(d.getTime()); x.setDate(x.getDate() + n); return x; }
  function daysBetween(a, b) { return Math.round((parseYMD(b) - parseYMD(a)) / 86400000); }

  /* ---------- state ------------------------------------------------- */
  const KEY = "ztb.v1";
  const DEFAULT_LEVELS = { push: "incline", pull: "table", squat: "bw",
                           hinge: "bridge", dip: "bknee", core: "plank", side: "side" };
  // Derived from GEAR so adding a piece of kit cannot leave a hole here.
  const DEFAULT_GEAR = GEAR.reduce((o, g) => { o[g.id] = false; return o; }, {});

  // Levels used to be an index into the ladder, and checks a positional
  // array. Both broke the moment a ladder changed shape, so both are keyed
  // by stable id now. These are the orders those indices used to mean.
  const LEGACY_RUNGS = {
    push: ["wall", "incline", "knee", "full", "diamond"],
    pull: ["door", "table", "inv", "neg", "pullup"],
    squat: ["box", "bw", "split", "bulg", "pistol"],
    hinge: ["bridge", "slbridge", "thrust", "nordic"],
    dip: ["bknee", "bstr", "dneg", "pbar"],
    core: ["kplank", "plank", "hollow", "kraise", "lraise"],
    side: ["sknee", "side", "reach"]
  };
  const LEGACY_CHECKS = {
    M: ["hang", "squat", "shoulder", "catcow", "couch", "wrist"],
    R: ["rest", "sleep", "protein", "walk"]
  };

  function migrate(st) {
    const lv = {};
    for (const m in DEFAULT_LEVELS) {
      const v = (st.levels || {})[m];
      lv[m] = typeof v === "number" ? (LEGACY_RUNGS[m][v] || DEFAULT_LEVELS[m])
            : (typeof v === "string" ? v : DEFAULT_LEVELS[m]);
    }
    st.levels = lv;
    st.gear = Object.assign({}, DEFAULT_GEAR, st.gear || {});
    for (const d in st.log || {}) {
      const e = st.log[d];
      if (Array.isArray(e.checks)) {
        const order = LEGACY_CHECKS[e.type] || [];
        const o = {};
        e.checks.forEach((on, i) => { if (on && order[i]) o[order[i]] = true; });
        e.checks = o;
      } else if (!e.checks || typeof e.checks !== "object") {
        e.checks = {};
      }
    }
    return st;
  }

  let state = load();
  let cursor = ymd(new Date());

  function load() {
    let raw = null;
    try { raw = localStorage.getItem(KEY); } catch (e) { /* private mode */ }
    if (raw) {
      try {
        const s = JSON.parse(raw);
        if (s && s.log) {
          s.theme = s.theme || "auto";
          s.pu = s.pu || 0;
          s.syncedAt = s.syncedAt || 0;
          return migrate(s);
        }
      } catch (e) { /* corrupt — fall through to a fresh state */ }
    }
    return { v: 1, start: ymd(new Date()), levels: Object.assign({}, DEFAULT_LEVELS),
             gear: Object.assign({}, DEFAULT_GEAR), log: {},
             theme: "auto", u: 0, pu: 0, syncedAt: 0 };
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); }
    catch (e) { flash("dataMsg", "Could not save — storage is blocked in this browser."); }
  }

  /* ---------- program maths ---------------------------------------- */
  function weekOf(date) { return Math.max(1, Math.floor(daysBetween(state.start, date) / 7) + 1); }
  function planFor(date) { return DAY_PLAN[parseYMD(date).getDay()]; }
  // Rungs you have no kit for are filtered out of the ladder entirely.
  function avail(move) {
    return MOVES[move].ladder.filter((r) => !r.needs || state.gear[r.needs]);
  }
  function rung(move) {
    const list = avail(move), want = state.levels[move];
    const hit = list.find((r) => r.id === want);
    if (hit) return hit;
    // The stored rung needs kit that is switched off. Drop to the hardest
    // available rung BELOW it — never silently promote anyone.
    const full = MOVES[move].ladder;
    const wi = full.findIndex((r) => r.id === want);
    for (let i = (wi < 0 ? full.length : wi) - 1; i >= 0; i--) {
      if (!full[i].needs || state.gear[full[i].needs]) return full[i];
    }
    return list[0] || full[0];
  }
  function nextRung(move) {
    const list = avail(move);
    const i = list.findIndex((r) => r.id === rung(move).id);
    return i >= 0 && i < list.length - 1 ? list[i + 1] : null;
  }
  function lockedCount(move) {
    return MOVES[move].ladder.length - avail(move).length;
  }
  function visibleChecks(S) {
    return (S.checks || []).filter((c) =>
      (!c.needs || state.gear[c.needs]) && (!c.unless || !state.gear[c.unless]));
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
    if (e.checks) return Object.keys(e.checks).some((k) => e.checks[k]);
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
    if (!nextRung(move)) return false;
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
    const list = avail(b.m);
    const opts = list.map((x, i) =>
      '<option value="' + x.id + '"' + (x.id === r.id ? " selected" : "") + ">" + (i + 1) + ". " + esc(x.name) + "</option>").join("");
    const locked = lockedCount(b.m);

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
        (locked ? "<span class='locked'>" + locked + " more with kit</span>" : "") +
      "</div>" + detailPanel(b.m, r.id) + "</div>";
  }

  function vidHref(v) { return v.url || (YT + encodeURIComponent(v.q)); }

  function detailBody(move, id) {
    const g = guide(move, id);
    if (!g) return "";
    return "<p class='eyebrow'>Setup and execution</p><ol class='howto'>"
      + g.how.map((x) => "<li>" + esc(x) + "</li>").join("")
      + "</ol><p class='eyebrow'>Watch for</p><ul class='faults'>"
      + g.watch.map((w) => "<li><b>" + esc(w[0]) + "</b><span>" + esc(w[1]) + "</span></li>").join("")
      + "</ul><p class='eyebrow'>Watch someone do it</p><ul class='exvids'>"
      + g.vids.map((v) => "<li><a href=\"" + esc(vidHref(v)) + "\" target=\"_blank\" rel=\"noopener noreferrer\">"
          + esc(v.t) + "</a></li>").join("")
      + "</ul>";
  }

  function detailPanel(move, id) {
    const body = detailBody(move, id);
    if (!body) return "";
    const d = demoFor(move, id);
    return "<div class='exfoot'>"
      + "<details class='exdet'><summary>How to do it</summary>"
      + "<div class='exdet-body'>" + body + "</div></details>"
      + (d ? "<button type='button' class='motionbtn' data-demo='" + move + ":" + id + "'>Motion</button>" : "")
      + "</div>";
  }

  // The text is deliberately NOT a <label>: wrapping the row in one made
  // the whole block a toggle target, so brushing the description while
  // scrolling flipped the box. aria-labelledby keeps the accessible name
  // without making the text clickable. Detail lives behind its own button
  // on the right, so the only thing that ticks the box is the box.
  function checklistRows(S, e) {
    const done = e.checks || {};
    return visibleChecks(S).map((c) => {
      const has = (c.how && c.how.length) || c.why || (c.vids && c.vids.length);
      return '<div class="check">' +
        '<input type="checkbox" id="chk-' + c.id + '" data-chk="' + c.id + '"' +
          ' aria-labelledby="chkt-' + c.id + '"' + (done[c.id] ? " checked" : "") + ">" +
        '<div class="check-main"><div class="check-head">' +
          '<div class="check-text"><span class="t" id="chkt-' + c.id + '">' + esc(c.t) + "</span>" +
          '<span class="d">' + esc(c.d) + "</span></div>" +
          (has ? '<button type="button" class="expand" data-exp="' + c.id + '"' +
                 ' aria-expanded="false" aria-controls="det-' + c.id + '">Details</button>' : "") +
        "</div>" +
        (has ? '<div class="mobdet" id="det-' + c.id + '" hidden>' + recoveryDetail(c) + "</div>" : "") +
        "</div></div>";
    }).join("");
  }

  function recoveryDetail(c) {
    let h = "";
    if (c.why) h += "<p class='eyebrow'>Why this is here</p><p class='why'>" + esc(c.why) + "</p>";
    if (c.how && c.how.length)
      h += "<p class='eyebrow'>How to do it</p><ol class='howto'>"
         + c.how.map((x) => "<li>" + esc(x) + "</li>").join("") + "</ol>";
    if (c.watch && c.watch.length)
      h += "<p class='eyebrow'>Watch for</p><ul class='faults'>"
         + c.watch.map((w) => "<li><b>" + esc(w[0]) + "</b><span>" + esc(w[1]) + "</span></li>").join("") + "</ul>";
    if (c.vids && c.vids.length)
      h += "<p class='eyebrow'>Watch someone do it</p><ul class='exvids'>"
         + c.vids.map((v) => "<li><a href=\"" + esc(vidHref(v)) + "\" target=\"_blank\" rel=\"noopener noreferrer\">"
             + esc(v.t) + "</a></li>").join("") + "</ul>";
    return h;
  }

  function ensureEntry(date) {
    if (!state.log[date]) state.log[date] = { type: planFor(date), sets: {}, checks: {}, note: "", manual: false, u: 0 };
    const e = state.log[date];
    e.u = Date.now();
    return e;
  }
  function touchProfile() { state.pu = Date.now(); }

  function wireToday() {
    document.querySelectorAll("#workout .setin").forEach((inp) => {
      inp.addEventListener("input", () => {
        const e = ensureEntry(cursor), m = inp.dataset.move, i = +inp.dataset.set;
        if (!e.sets[m]) e.sets[m] = [];
        const v = parseInt(inp.value, 10);
        e.sets[m][i] = isNaN(v) || v < 0 ? 0 : Math.min(v, 999);
        inp.classList.toggle("filled", e.sets[m][i] > 0);
        save(); renderBand(); sync.refresh();
      });
    });
    document.querySelectorAll("#workout [data-lvl]").forEach((sel) => {
      sel.addEventListener("change", () => {
        state.levels[sel.dataset.lvl] = sel.value;
        touchProfile(); save(); renderToday(); renderProgram();
      });
    });
    wireMotion($("workout"));
    document.querySelectorAll("#workout [data-exp]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const panel = $("det-" + btn.dataset.exp);
        const open = panel.hidden;
        panel.hidden = !open;
        btn.setAttribute("aria-expanded", String(open));
        btn.textContent = open ? "Hide" : "Details";
      });
    });
    document.querySelectorAll("#workout [data-chk]").forEach((cb) => {
      cb.addEventListener("change", () => {
        const e = ensureEntry(cursor);
        e.checks[cb.dataset.chk] = cb.checked;
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
      const here = rung(m).id, list = avail(m), hidden = lockedCount(m);
      return "<div class='ladder'><h3>" + esc(M.label) + " <span class='eyebrow' style='font-weight:400'>· " +
        (M.unit === "sec" ? "held for seconds" : "counted in reps") + "</span></h3><div class='rungs'>" +
        list.map((x, i) =>
          "<details class='rung" + (x.id === here ? " cur" : "") + "'>" +
            "<summary><span class='n'>" + (i + 1) + "</span>" +
              "<span class='rname'>" + esc(x.name) + "</span>" +
              (x.id === here ? "<span class='here'>You are here</span>" : "") +
            "</summary><div class='exdet-body'>" + detailBody(m, x.id) +
              (demoFor(m, x.id) ? "<div class='exfoot'><button type='button' class='motionbtn' data-demo='" +
                 m + ":" + x.id + "'>Motion</button></div>" : "") +
            "</div></details>").join("") +
        (hidden ? "<p class='lockednote'>" + hidden + (hidden === 1 ? " rung is" : " rungs are") +
                  " hidden because they need kit you have switched off.</p>" : "") +
        "</div></div>";
    }).join("");

    $("vids").innerHTML = VIDEOS.map((v, i) =>
      "<li><span class='idx'>" + pad(i + 1) + "</span><div><a class='t' href='" + esc(v.url) +
      "' target='_blank' rel='noopener noreferrer'>" + esc(v.t) + "</a>" +
      "<p class='meta'>" + esc(v.meta) + "</p><p class='why'>" + esc(v.why) + "</p></div></li>").join("");

    wireMotion($("ladders"));
    $("gearList").innerHTML = GEAR.map((g) =>
      '<div class="check"><input type="checkbox" id="gear-' + g.id + '" data-gear="' + g.id + '"' +
        ' aria-labelledby="geart-' + g.id + '"' + (state.gear[g.id] ? " checked" : "") + ">" +
      '<div class="check-main"><div class="check-head"><div class="check-text">' +
        '<span class="t" id="geart-' + g.id + '">' + esc(g.label) + "</span>" +
        '<span class="d">' + esc(g.note) + "</span></div></div></div></div>").join("");
    document.querySelectorAll("#gearList [data-gear]").forEach((cb) => {
      cb.addEventListener("change", () => {
        state.gear[cb.dataset.gear] = cb.checked;
        touchProfile(); save();
        renderBand(); renderToday(); renderProgram();
      });
    });

    $("startDate").value = state.start;
  }

  /* ---------- motion modal ------------------------------------------ */
  const motion = (function () {
    let demo = null, raf = 0, playing = true, phase = 0, last = 0, opener = null;

    // Playback runs a full out-and-back cycle, but the slider is labelled
    // by POSITION IN THE REP, so dragging right always goes toward the end.
    const posOf = (ph) => 0.5 - Math.cos(ph * Math.PI * 2) / 2;
    const phaseOf = (t) => Math.acos(1 - 2 * Math.min(Math.max(t, 0), 1)) / (Math.PI * 2);

    function paint() {
      const t = posOf(phase);
      $("demoStage").innerHTML = demoSVG(demo, t);
      $("demoScrub").value = String(Math.round(t * 1000));
      $("demoPhase").textContent = demo.hold ? "Hold"
        : t <= 0.04 ? "Start" : t >= 0.96 ? "End" : "Mid-rep";
    }
    function tick(now) {
      if (!playing) return;
      const dt = last ? (now - last) / 1000 : 0;
      last = now;
      phase = (phase + dt / (demo.hold ? 6 : 2.6)) % 1;
      paint();
      raf = requestAnimationFrame(tick);
    }
    function stop() { cancelAnimationFrame(raf); raf = 0; last = 0; }

    function open(key, opts) {
      demo = DEMOS[DEMO_FOR[key]];
      if (!demo) return;
      opener = opts && opts.from;
      const name = (opts && opts.name) || demo.t;
      $("demoKicker").textContent = "How the rep moves";
      $("demoTitle").textContent = name;
      $("demoNote").textContent = demo.reps
        + (name.toLowerCase() === demo.t.toLowerCase() ? ""
           : " · Drawn as the " + demo.t.toLowerCase() + " it belongs to; your rung changes the angle, not the path.");
      phase = 0; playing = true; $("demoPlay").textContent = "Pause";
      $("demoModal").hidden = false;
      document.body.style.overflow = "hidden";
      paint();
      stop(); raf = requestAnimationFrame(tick);
      $("demoClose").focus();
    }
    function close() {
      stop(); $("demoModal").hidden = true; document.body.style.overflow = "";
      if (opener && document.contains(opener)) opener.focus();
      opener = null;
    }

    $("demoClose").addEventListener("click", close);
    $("demoModal").addEventListener("click", (ev) => { if (ev.target === $("demoModal")) close(); });
    document.addEventListener("keydown", (ev) => {
      if (ev.key === "Escape" && !$("demoModal").hidden) close();
    });
    $("demoPlay").addEventListener("click", () => {
      playing = !playing;
      $("demoPlay").textContent = playing ? "Pause" : "Play";
      if (playing) { last = 0; raf = requestAnimationFrame(tick); } else stop();
    });
    $("demoScrub").addEventListener("input", () => {
      playing = false; stop(); $("demoPlay").textContent = "Play";
      phase = phaseOf(+$("demoScrub").value / 1000);
      paint();
    });
    return { open: open, close: close };
  })();

  function wireMotion(root) {
    root.querySelectorAll("[data-demo]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const key = btn.dataset.demo, m = key.split(":")[0], id = key.split(":")[1];
        const r = MOVES[m].ladder.find((x) => x.id === id);
        motion.open(key, { name: r ? r.name : "", from: btn });
      });
    });
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
    if (SESSIONS[plan].checks) {
      const vis = visibleChecks(SESSIONS[plan]);
      if (!vis.some((c) => e.checks[c.id])) vis.forEach((c) => { e.checks[c.id] = true; });
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
    applyTheme(); touchProfile(); save();
    flash("savedMsg", "Theme: " + state.theme);
  });

  $("startDate").addEventListener("change", (ev) => {
    if (!ev.target.value) return;
    state.start = ev.target.value;
    touchProfile(); save(); renderBand(); renderToday();
    flash("dataMsg", "Program start moved to " + prettyShort(state.start) + ".");
  });

  // Saving a file: when the page is running inside the claude.ai artifact
  // viewer the frame cannot start its own download, so ask the host to
  // offer the file. Everywhere else, a plain object-URL link works.
  async function saveBackupFile() {
    const json = JSON.stringify(state, null, 2);
    const filename = "zero-to-bar-" + ymd(new Date()) + ".json";
    const host = window.claude && typeof window.claude.use === "function"
      ? await window.claude.use("downloads").catch(() => null)
      : null;
    if (host) {
      try {
        await host.save({ filename: filename, data: json });
        flash("dataMsg", "Backup saved.");
      } catch (err) {
        flash("dataMsg", err && err.code === "declined"
          ? "Save cancelled — the text box below always works."
          : "Could not save a file here. Use the text box below.");
      }
      return;
    }
    const blob = new Blob([json], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    flash("dataMsg", "Backup downloaded.");
  }
  $("exportBtn").addEventListener("click", saveBackupFile);

  /* ---------- text backup: the route that works everywhere ---------- */
  function restore(obj) {
    if (!obj || typeof obj !== "object" || !obj.log) throw new Error("shape");
    state = migrate({ v: 1, start: obj.start || ymd(new Date()),
                      levels: obj.levels, gear: obj.gear, log: obj.log,
                      theme: obj.theme || "auto",
                      pu: obj.pu || 0, syncedAt: obj.syncedAt || 0 });
    save(); applyTheme(); renderBand(); renderToday(); renderProgram();
    return Object.keys(state.log).length;
  }

  document.querySelector(".textbackup").addEventListener("toggle", (ev) => {
    if (ev.target.open) $("backupText").value = JSON.stringify(state);
  });

  $("copyTextBtn").addEventListener("click", async () => {
    const text = JSON.stringify(state);
    $("backupText").value = text;
    try {
      await navigator.clipboard.writeText(text);
      flash("dataMsg", "Backup copied to the clipboard.");
    } catch (err) {
      $("backupText").select();
      flash("dataMsg", "Press copy on the selected text.");
    }
  });

  $("restoreTextBtn").addEventListener("click", () => {
    try {
      const n = restore(JSON.parse($("backupText").value));
      flash("dataMsg", "Restored — " + n + (n === 1 ? " day." : " days."));
    } catch (err) {
      flash("dataMsg", "That text is not a Zero to Bar backup.");
    }
  });

  $("importBtn").addEventListener("click", () => $("importFile").click());
  $("importFile").addEventListener("change", (ev) => {
    const f = ev.target.files && ev.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const n = restore(JSON.parse(r.result));
        flash("dataMsg", "Backup restored — " + n + (n === 1 ? " day." : " days."));
      } catch (err) {
        flash("dataMsg", "That file is not a Zero to Bar backup.");
      }
      ev.target.value = "";
    };
    r.readAsText(f);
  });

  $("resetBtn").addEventListener("click", () => {
    if (!confirm("Erase every logged day and start over? Export a backup first if you want to keep it.")) return;
    state = migrate({ v: 1, start: ymd(new Date()), levels: null, gear: state.gear,
                      log: {}, theme: state.theme, pu: Date.now(), syncedAt: 0 });
    save(); renderBand(); renderToday(); renderProgram();
    flash("dataMsg", "Log erased.");
  });


  /* ================================================================
     Cross-device sync, artifact edition.

     This page is a classic artifact, so the only write verb is
     artifact.publish(html) — a whole-page replacement that every open
     view then reloads to. Two consequences shape everything below:

       1. Publishing reloads this view, so it cannot run on a keystroke.
          localStorage stays the working store; Sync is a deliberate act.
       2. To republish itself the page needs its own source. Serializing
          the live DOM is not allowed (it carries injected runtime
          scripts), so the page ships a pristine copy of its source,
          base64 in #ztb-tpl, with slots for that copy and for the log.
          Re-inserting the same copy makes the output a fixed point.

     Outside the artifact viewer none of this exists: claude.use returns
     null, the control stays hidden, and the app behaves exactly as the
     standalone file does.
     ================================================================ */

  const sync = (function () {
    let nsPromise = null;
    let readOnly = false;
    let busy = false;

    function capability() {
      if (!nsPromise) {
        nsPromise = (window.claude && typeof window.claude.use === "function")
          ? Promise.resolve(window.claude.use("artifact")).catch(() => null)
          : Promise.resolve(null);
      }
      return nsPromise;
    }

    // The log baked into this version of the page by the last publish.
    function published() {
      const el = document.getElementById("ztb-state");
      if (!el) return null;
      try {
        const o = JSON.parse(el.textContent || "null");
        return o && o.log ? o : null;
      } catch (err) { return null; }
    }

    // How much real work a day holds — the tie-breaker when two devices
    // stamp the same day at the same millisecond. Never drops the fuller one.
    function weight(e) {
      let n = e.manual ? 1 : 0;
      if (e.sets) for (const m in e.sets) n += e.sets[m].filter((v) => v > 0).length;
      if (e.checks) n += Object.keys(e.checks).filter((k) => e.checks[k]).length;
      if (e.note) n += 1;
      return n;
    }

    function mergeLogs(mine, theirs) {
      const out = {};
      const keys = Object.keys(mine).concat(Object.keys(theirs));
      for (const k of keys) {
        if (out[k]) continue;
        const a = mine[k], b = theirs[k];
        if (!a) { out[k] = b; continue; }
        if (!b) { out[k] = a; continue; }
        const ua = a.u || 0, ub = b.u || 0;
        out[k] = ua === ub ? (weight(a) >= weight(b) ? a : b) : (ua > ub ? a : b);
      }
      return out;
    }

    // Fold the published version into what this device holds. Runs once at
    // load, before anything renders.
    function adopt() {
      const remote = published();
      if (!remote) return;
      const theirs = migrate(JSON.parse(JSON.stringify(remote)));
      state.log = mergeLogs(state.log, theirs.log || {});
      if ((theirs.pu || 0) > (state.pu || 0)) {
        state.start = theirs.start || state.start;
        state.levels = theirs.levels;
        state.gear = theirs.gear;
        state.pu = theirs.pu;
      }
      state.syncedAt = Math.max(state.syncedAt || 0, remote.syncedAt || 0);
      save();
    }

    function pending() {
      const since = state.syncedAt || 0;
      return Object.keys(state.log).filter((k) => (state.log[k].u || 0) > since).length;
    }

    function page(snapshot) {
      const el = document.getElementById("ztb-tpl");
      if (!el) return null;
      const b64 = el.textContent.trim();
      const tpl = new TextDecoder().decode(Uint8Array.from(atob(b64), (c) => c.charCodeAt(0)));
      // Function replacements: the log may contain $& and friends.
      const tplTag = '<script type="text/plain" id="ztb-tpl">' + b64 + "<\/script>";
      const stateTag = '<script type="application/json" id="ztb-state">'
        + JSON.stringify(snapshot).replace(/</g, "\\u003c") + "<\/script>";
      // Assembled, never written literally: this source is itself embedded
      // in the page, so a literal marker here would be a second slot.
      const slot = (n) => "<!--ZTB-" + n + "-->";
      return tpl.replace(slot("TPL"), () => tplTag)
                .replace(slot("STATE"), () => stateTag);
    }

    function show(text, tone) {
      const el = $("syncState");
      el.textContent = text;
      if (tone) el.dataset.tone = tone; else delete el.dataset.tone;
      el.hidden = false;
    }

    function ago(t) {
      if (!t) return "never";
      const m = Math.floor((Date.now() - t) / 60000);
      if (m < 1) return "just now";
      if (m < 60) return m + "m ago";
      const h = Math.floor(m / 60);
      if (h < 24) return h + "h ago";
      return Math.floor(h / 24) + "d ago";
    }

    function refresh() {
      if (readOnly || busy) return;
      const n = pending();
      const btn = $("syncBtn");
      btn.disabled = false;
      btn.classList.toggle("due", n > 0);
      btn.textContent = n > 0 ? "Sync " + n : "Sync";
      show(n > 0 ? n + (n === 1 ? " day unsaved" : " days unsaved") : "Saved " + ago(state.syncedAt),
           n > 0 ? "due" : null);
    }

    function stop(text) {
      readOnly = true;
      $("syncBtn").hidden = true;
      show(text, "bad");
    }

    async function push() {
      if (busy || readOnly) return;
      const ns = await capability();
      if (!ns) return;
      busy = true;
      $("syncBtn").disabled = true;
      show("Saving…");

      const snapshot = JSON.parse(JSON.stringify(state));
      snapshot.syncedAt = Date.now();
      const html = page(snapshot);
      if (!html) { busy = false; stop("Sync unavailable"); return; }

      try {
        // On success the shell reloads this view to the new version, so
        // nothing after this line is guaranteed to run.
        await ns.publish(html);
        state.syncedAt = snapshot.syncedAt;
        save();
        busy = false;
        refresh();
      } catch (err) {
        busy = false;
        const code = (err && err.code) || "upstream_error";
        if (code === "conflict") {
          // Routine: another view won. The shell is already reloading us
          // to that version, and adopt() will merge this device's days in.
          show("Another device saved first — reloading", "due");
          return;
        }
        if (code === "not_writer" || code === "not_granted" || code === "not_declared"
            || code === "capability_disabled" || code === "capability_removed") {
          stop("View only");
          return;
        }
        if (code === "rate_limited") { show("Saving too often — wait a minute", "bad"); }
        else if (code === "too_large") { show("Log too large to save", "bad"); }
        else { show("Could not save — your log is safe on this device", "bad"); }
        setTimeout(refresh, 6000);
      }
    }

    async function start() {
      const ns = await capability();
      if (!ns) return;                       // standalone file: stay hidden
      // The page ships copy written for the offline edition; inside the
      // artifact viewer that copy would be a lie, so correct it.
      $("subline").textContent =
        "Show up, log the set, move the number. Tap Sync to carry it to your other devices.";
      $("dataLede").textContent =
        "This device keeps the working copy, so logging a set never waits on a network. "
        + "Tapping Sync saves your log into this page itself, which is what lets another "
        + "device pick it up — so your training history is stored with the artifact, not "
        + "only in this browser. Export a backup anyway before clearing site data.";
      $("syncBtn").hidden = false;
      $("syncBtn").addEventListener("click", push);
      refresh();
      setInterval(refresh, 60000);
    }

    return { adopt: adopt, start: start, refresh: refresh };
  })();

  /* ---------- go ---------------------------------------------------- */
  save();                // persist any format migration load() just applied
  sync.adopt();          // fold in whatever the last publish carried
  applyTheme();
  renderBand();
  renderToday();
  renderProgram();
  sync.start();
})();
