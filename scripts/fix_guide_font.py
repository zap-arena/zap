import re

with open("src/index.css", "r") as f:
    css = f.read()

# Make sure guide layout inherits the global font
font_fix = """
/* Force global fonts in guide layout */
.layout, .layout h1, .layout h2, .layout h3, .layout p, .layout span:not(.kw):not(.tp):not(.fn):not(.st):not(.cm):not(.vr):not(.no) {
  font-family: "Plus Jakarta Sans", sans-serif !important;
}
.layout code, .layout pre, .layout .code-panel, .layout .code-panel *, .code-label {
  font-family: "JetBrains Mono", monospace !important;
}
"""

if "/* Force global fonts in guide layout */" not in css:
    css += font_fix
    with open("src/index.css", "w") as f:
        f.write(css)

print("Applied font fix")
