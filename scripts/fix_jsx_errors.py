import glob
import re

for filepath in glob.glob("src/pages/**/*.tsx", recursive=True):
    if "guide" in filepath or "Curriculum" in filepath:
        with open(filepath, "r") as f:
            content = f.read()
        
        # Remove script tags
        content = re.sub(r'<script.*?</script>', '', content, flags=re.DOTALL)
        
        # Escape '<' that are followed by space (e.g. sum < target)
        content = re.sub(r'<\s', '&lt; ', content)
        
        # Escape '>' that are not part of tags? 
        # A simple heuristic: '->' becomes '-&gt;'
        content = content.replace('->', '-&gt;')
        
        # Other places where < or > appear in text? 
        # 'zeroCount <= k'
        content = content.replace('<=', '&lt;=')
        
        with open(filepath, "w") as f:
            f.write(content)

print("Fixed JSX syntax errors")
