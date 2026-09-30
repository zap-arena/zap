import re
import glob

# 1. Update index.css
with open("src/index.css", "r") as f:
    css = f.read()

css = re.sub(r'\.tab-btn\.\w+\.active\{[^\}]+\}', '.tab-btn.active{color:hsl(var(--primary)); border-bottom-color:hsl(var(--primary));}', css)

# Make sure `.tab-btn.active` is added if not present (the regex above collapses the variations)
# Wait, some are .tab-btn.tool.active, etc. Let's just do a simpler replacement
css = re.sub(r'color:hsl\(0 62\.8% 30\.6%\); border-bottom-color:hsl\(0 62\.8% 30\.6%\);', 'color:hsl(var(--primary)); border-bottom-color:hsl(var(--primary));', css)
css = re.sub(r'color:hsl\(38 92% 50%\); border-bottom-color:hsl\(38 92% 50%\);', 'color:hsl(var(--primary)); border-bottom-color:hsl(var(--primary));', css)
css = re.sub(r'color:hsl\(142 70% 45%\); border-bottom-color:hsl\(142 70% 45%\);', 'color:hsl(var(--primary)); border-bottom-color:hsl(var(--primary));', css)

# Fix .lang-btn.active
css = css.replace('.lang-btn.active{color:hsl(var(--foreground)); background:hsl(var(--muted)); border-color:hsl(var(--border));}', '.lang-btn.active{color:hsl(var(--primary-foreground)); background:hsl(var(--primary)); border-color:hsl(var(--primary));}')

with open("src/index.css", "w") as f:
    f.write(css)

# 2. Update .tsx files
for filepath in glob.glob("src/pages/guide/*.tsx"):
    with open(filepath, "r") as f:
        content = f.read()
    
    content = content.replace('var(--rose)', 'hsl(var(--primary))')
    content = content.replace('var(--teal)', 'hsl(var(--primary))')
    content = content.replace('var(--amber)', 'hsl(var(--primary))')
    content = content.replace('var(--card-accent)', 'hsl(var(--primary))')
    
    with open(filepath, "w") as f:
        f.write(content)

print("Applied theme fixes")
