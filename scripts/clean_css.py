import re

with open("src/index.css", "r") as f:
    css = f.read()

# Remove all stray blocks like:  {font-size:38px;}
# These are lines that match exactly some spaces, followed by { ... }
css = re.sub(r'^\s*\{[^}]+\}\s*$', '', css, flags=re.MULTILINE)

with open("src/index.css", "w") as f:
    f.write(css)

print("Cleaned up CSS")
