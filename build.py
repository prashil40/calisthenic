#!/usr/bin/env python3
"""Inline src/style.css, src/markup.html and src/app.js into index.html."""
import pathlib

root = pathlib.Path(__file__).parent
src = root / "src"

body = (
    "<style>\n" + (src / "style.css").read_text() + "\n</style>\n\n"
    + (src / "markup.html").read_text()
    + "\n<script>\n" + (src / "app.js").read_text() + "\n</script>\n"
)

page = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Zero to Bar</title>
<meta name="description" content="A 12-week beginner calisthenics program with a daily training log, streak tracking and progression ladders.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=Public+Sans:ital,wght@0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@400;500;700&display=swap">
</head>
<body>
%s</body>
</html>
""" % body

(root / "index.html").write_text(page)
print("built index.html (%d bytes)" % len(page))
