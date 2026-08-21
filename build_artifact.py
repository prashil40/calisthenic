#!/usr/bin/env python3
"""Build the artifact edition of Zero to Bar.

A classic artifact republishes itself by handing the shell a complete
replacement document, so the page has to carry its own source. It ships a
pristine copy base64-encoded in #ztb-tpl, with two slots: one for that copy
and one for the training log. Re-inserting the same copy each time makes the
output a fixed point, so generation N can always produce generation N+1.

Emits two files:
  dist/artifact-body.html  generation 0 — body content, for the Artifact tool,
                           which supplies the doctype/head/body wrapper itself
  dist/template.html       the full document the page republishes as
"""
import base64
import pathlib

root = pathlib.Path(__file__).parent
src = root / "src"
dist = root / "dist"
dist.mkdir(exist_ok=True)

HEAD = """<title>Zero to Bar</title>
<meta name="description" content="A 12-week beginner calisthenics program with a daily training log, streak tracking and progression ladders.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=Public+Sans:ital,wght@0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@400;500;700&display=swap">"""

BODY = """<!--ZTB-TPL-->
<!--ZTB-STATE-->
<style>
%s
</style>

%s
<script>
%s
</script>
""" % ((src / "style.css").read_text(),
       (src / "markup.html").read_text(),
       (src / "app.js").read_text().replace("  /* @@CONFIG@@ */", (src / "config.js").read_text()).replace("  /* @@DEMOS@@ */", (src / "demo.js").read_text()))

# The document the page republishes as. Its slots stay unfilled — they are
# what generation N+1 fills in.
TEMPLATE = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
%s
</head>
<body>
%s</body>
</html>
""" % (HEAD, BODY)

(dist / "template.html").write_text(TEMPLATE)

# Generation 0: the same body, with the slots filled — the template encoded
# once, and an empty log. Every later generation is produced by the page.
b64 = base64.b64encode(TEMPLATE.encode("utf-8")).decode("ascii")
gen0 = (HEAD + "\n" + BODY) \
    .replace("<!--ZTB-TPL-->", '<script type="text/plain" id="ztb-tpl">%s</script>' % b64, 1) \
    .replace("<!--ZTB-STATE-->", '<script type="application/json" id="ztb-state">{"log":{}}</script>', 1)

(dist / "artifact-body.html").write_text(gen0)

print("template.html      %7d bytes" % len(TEMPLATE))
print("artifact-body.html %7d bytes  (embedded source %d bytes base64)" % (len(gen0), len(b64)))
