import glob

files = [
    "src/components/Navbar.tsx",
    "src/pages/HomePage.tsx",
    "src/pages/LoginPage.tsx",
    "src/pages/RegisterPage.tsx",
]

for filepath in files:
    with open(filepath, "r") as f:
        content = f.read()

    # Clean up Code2 import
    content = content.replace("Code2, ", "")
    content = content.replace(", Code2", "")
    content = content.replace("{ Code2 }", "{}")

    with open(filepath, "w") as f:
        f.write(content)

print("Fixed imports")
