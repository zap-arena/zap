import glob
import re

for filepath in glob.glob("src/pages/guide/*.tsx"):
    with open(filepath, 'r') as f:
        content = f.read()
    
    if "useGuideLogic" not in content:
        # Import the hook
        content = re.sub(r'(import Navbar from)', r'import { useGuideLogic } from "../../hooks/useGuideLogic";\n\1', content)
        
        # Call the hook inside the component
        content = re.sub(r'(export default function \w+\(\) {\n)', r'\1  useGuideLogic();\n', content)
        
        with open(filepath, 'w') as f:
            f.write(content)

print("Injected useGuideLogic")
