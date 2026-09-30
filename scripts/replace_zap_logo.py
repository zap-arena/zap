import re
import glob

# Replace <Code2 with <Zap across the specific pages that act as logos
files_to_fix = [
    "src/pages/HomePage.tsx",
    "src/pages/RegisterPage.tsx",
    "src/pages/LoginPage.tsx",
    "src/pages/ContestLandingPage.tsx",
    "src/components/AdminLayout.tsx",
]

for filepath in files_to_fix:
    with open(filepath, "r") as f:
        content = f.read()

    # Add Zap to import
    if "Zap" not in content and "lucide-react" in content:
        content = re.sub(r'(import \{.*?)(Code2)(.*\} from "lucide-react";)', r'\1\2, Zap\3', content)

    # Replace <Code2> where it's used as a logo
    content = content.replace('<Code2 size={20} />', '<Zap size={20} className="fill-current" />')
    content = content.replace('<Code2 size={14} className="text-brand" />', '<Zap size={14} className="text-brand fill-brand" />')
    
    # In HomePage
    content = content.replace('<Code2 size={14} className="text-primary" />', '<Zap size={14} className="text-primary fill-primary" />')

    with open(filepath, "w") as f:
        f.write(content)

print("Replaced Code2 with Zap")
