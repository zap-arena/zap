import glob

for filepath in glob.glob("src/pages/guide/*.tsx"):
    with open(filepath, "r") as f:
        content = f.read()
    
    # fix the double replaced {
    content = content.replace('{"{"{"}"}', '{"{"}')
    
    with open(filepath, "w") as f:
        f.write(content)

print("Fixed double braces")
