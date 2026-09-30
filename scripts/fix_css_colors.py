import re

with open("src/index.css", "r") as f:
    css = f.read()

# Replace hardcoded light text colors with Shadcn foreground
css = css.replace('color:#D7E0E8;', 'color:hsl(var(--foreground));')

# The keywords also have hardcoded colors for dark background, e.g. .kw {color:#FF7B72;}
# We can make them use primary/secondary/accent etc. to work on both themes
# Or we can just use Shadcn CSS variables for them
# Let's see what syntax classes exist
# .kw {color:#FF7B72;}
# .tp {color:#79C0FF;}
# .fn {color:#D2A8FF;}
# .st {color:#A5D6FF;}
# .cm {color:#8B949E;}
# .vr {color:#C9D1D9;}
# .no {color:#79C0FF;}

colors_to_replace = {
    'color:#FF7B72;': 'color:hsl(var(--primary));', # keywords
    'color:#79C0FF;': 'color:hsl(var(--accent-foreground));', # types
    'color:#D2A8FF;': 'color:hsl(var(--destructive));', # functions
    'color:#A5D6FF;': 'color:hsl(var(--secondary-foreground));', # strings
    'color:#8B949E;': 'color:hsl(var(--muted-foreground));', # comments
    'color:#C9D1D9;': 'color:hsl(var(--foreground));', # variables
}

for k, v in colors_to_replace.items():
    css = css.replace(k, v)

with open("src/index.css", "w") as f:
    f.write(css)

print("Fixed CSS colors")
