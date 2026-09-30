import re
import os
import glob

files = glob.glob("course-materials/*.html")
os.makedirs("src/pages/guide", exist_ok=True)

css_blocks = []

def dash_to_camel(match):
    return match.group(1) + match.group(2).upper()

for file in files:
    with open(file, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Extract CSS
    style_match = re.search(r'<style>(.*?)</style>', content, re.DOTALL)
    if style_match:
        css = style_match.group(1)
        # Remove :root and projector stuff
        css = re.sub(r':root\s*\{.*?\}', '', css, flags=re.DOTALL)
        css = re.sub(r'body\.projector\s*\{.*?\}', '', css, flags=re.DOTALL)
        css = re.sub(r'body\.projector.*?(?=\{)', '', css) # clean up other projector selectors
        css_blocks.append(css)
    
    # Extract body content
    body_match = re.search(r'<body[^>]*>(.*?)</body>', content, re.DOTALL)
    if not body_match:
        continue
    
    body_content = body_match.group(1)
    
    # Remove header
    body_content = re.sub(r'<header.*?</header>', '', body_content, flags=re.DOTALL)
    
    # Replace class with className
    body_content = body_content.replace('class=', 'className=')
    
    # Fix inline styles: style="--card-accent: var(--amber);" -> style={{"--card-accent": "var(--amber)"} as React.CSSProperties}
    def style_replacer(match):
        style_str = match.group(1)
        # simplistic conversion
        rules = style_str.split(';')
        out = []
        for r in rules:
            if not r.strip(): continue
            k, v = r.split(':', 1)
            k = k.strip()
            v = v.strip()
            # if k is custom prop
            out.append(f'"{k}": "{v}"')
        return "style={{" + ", ".join(out) + "} as React.CSSProperties}"

    body_content = re.sub(r'style="([^"]+)"', style_replacer, body_content)
    
    # Replace onclick with onClick
    body_content = re.sub(r'onclick="([^"]+)"', r'onClick={() => {\1}}', body_content)
    
    # Fix self-closing tags
    body_content = re.sub(r'<br\s*>', '<br/>', body_content)
    body_content = re.sub(r'<hr\s*>', '<hr/>', body_content)
    body_content = re.sub(r'<img([^>]*?)(?<!/)>', r'<img\1 />', body_content)
    
    # Wrap in React component
    basename = os.path.basename(file)
    name = basename.replace('.html', '').title().replace('-', '')
    
    jsx = f"""import React from 'react';
import Navbar from "../../components/Navbar";

export default function {name}Page() {{
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      {body_content}
    </div>
  );
}}
"""
    
    out_file = f"src/pages/guide/{name}Page.tsx"
    with open(out_file, "w", encoding="utf-8") as f:
        f.write(jsx)
    print(f"Generated {out_file}")

with open("guide_styles.css", "w", encoding="utf-8") as f:
    f.write("\n".join(css_blocks))

