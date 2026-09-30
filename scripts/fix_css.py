import re

with open("guide_styles.css", "r") as f:
    css = f.read()

# Replace variables
css = css.replace('var(--bg)', 'hsl(var(--background))')
css = css.replace('var(--surface)', 'hsl(var(--card))')
css = css.replace('var(--surface-2)', 'hsl(var(--secondary))')
css = css.replace('var(--border)', 'hsl(var(--border))')
css = css.replace('var(--text)', 'hsl(var(--foreground))')
css = css.replace('var(--text-dim)', 'hsl(var(--muted-foreground))')

css = css.replace('var(--amber)', 'hsl(38 92% 50%)') # warning color for amber
css = css.replace('var(--amber-dim)', 'hsl(38 92% 50% / 0.2)')
css = css.replace('var(--teal)', 'hsl(142 70% 45%)') # success for teal
css = css.replace('var(--teal-dim)', 'hsl(142 70% 45% / 0.2)')
css = css.replace('var(--rose)', 'hsl(0 62.8% 30.6%)') # destructive for rose
css = css.replace('var(--rose-dim)', 'hsl(0 62.8% 30.6% / 0.2)')

css = css.replace('var(--code-bg)', 'hsl(var(--muted))')
css = css.replace('var(--radius)', 'var(--radius)')
css = css.replace('var(--focus)', 'hsl(var(--ring))')
css = css.replace('var(--fs-base)', '1rem')
css = css.replace('var(--fs-code)', '0.875rem')
css = css.replace('var(--maxw)', '1120px')

with open("guide_styles.css", "w") as f:
    f.write(css)

