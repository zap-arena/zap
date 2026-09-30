import re

# Fix useGuideLogic.ts
with open("src/hooks/useGuideLogic.ts", "r") as f:
    ts = f.read()

ts = ts.replace(".closest('.lang-btn[data-lang]')", ".closest('[data-lang]')")
ts = ts.replace("document.querySelectorAll('.lang-btn')", "document.querySelectorAll('[data-lang]')")
ts = ts.replace("document.querySelectorAll(`.lang-btn[data-lang=\"${lang}\"]`)", "document.querySelectorAll(`[data-lang=\"${lang}\"]`)")

with open("src/hooks/useGuideLogic.ts", "w") as f:
    f.write(ts)

# Fix index.css
with open("src/index.css", "r") as f:
    css = f.read()

css = re.sub(r'\.lang-switch button\.active\{[^\}]+\}', '.lang-switch button.active{background:hsl(var(--primary)); color:hsl(var(--primary-foreground)); font-weight:600;}', css)

with open("src/index.css", "w") as f:
    f.write(css)

print("Fixed hooks and css")
