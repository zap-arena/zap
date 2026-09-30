import os
import glob
import re

for filepath in glob.glob("src/pages/guide/*.tsx"):
    with open(filepath, "r") as f:
        content = f.read()

    style_matches = []
    def style_repl(m):
        style_matches.append(m.group(0))
        return f"__STYLE_{len(style_matches)-1}__"
    
    onclick_matches = []
    def onclick_repl(m):
        onclick_matches.append(m.group(0))
        return f"__ONCLICK_{len(onclick_matches)-1}__"

    body_start = content.find('<div className="min-h-screen')
    body_end = content.rfind('</div>')
    
    prefix = content[:body_start]
    body = content[body_start:body_end+6]
    suffix = content[body_end+6:]
    
    navbar_end = body.find('<Navbar />') + 10
    b_prefix = body[:navbar_end]
    b_content = body[navbar_end:]
    
    b_content = re.sub(r'style=\{\{[^}]+\}\s+as\s+React\.CSSProperties\}', style_repl, b_content)
    b_content = re.sub(r'onClick=\{\(\)\s*=>\s*\{[^}]+\}\}', onclick_repl, b_content)
    
    b_content = b_content.replace('{', '{"{"}').replace('}', '{"}"}')
    
    for i, m in enumerate(style_matches):
        b_content = b_content.replace(f"__STYLE_{i}__", m)
    for i, m in enumerate(onclick_matches):
        b_content = b_content.replace(f"__ONCLICK_{i}__", m)
        
    final_content = prefix + b_prefix + b_content + suffix
    
    with open(filepath, "w") as f:
        f.write(final_content)
        
print("Done fixing braces")
