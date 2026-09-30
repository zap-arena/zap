import glob

files_to_fix = [
    "src/pages/HomePage.tsx",
    "src/pages/RegisterPage.tsx",
    "src/pages/LoginPage.tsx",
    "src/pages/ContestLandingPage.tsx",
    "src/components/AdminLayout.tsx",
    "src/components/Navbar.tsx",
]

for filepath in files_to_fix:
    with open(filepath, "r") as f:
        content = f.read()

    # Import ThunderLogo
    if "ThunderLogo" not in content and "lucide-react" in content:
        if filepath.startswith("src/components/"):
            import_statement = 'import { ThunderLogo } from "./ThunderLogo";\n'
        else:
            import_statement = 'import { ThunderLogo } from "../components/ThunderLogo";\n'
        
        # Add import at the top
        content = import_statement + content
        
        # Remove Zap from lucide-react import
        content = content.replace(", Zap ", " ")
        content = content.replace(" Zap,", "")
        content = content.replace(" Zap }", " }")

    # Replace <Zap ...> with <ThunderLogo ...>
    content = content.replace("<Zap ", "<ThunderLogo ")

    with open(filepath, "w") as f:
        f.write(content)

print("Replaced Zap with ThunderLogo")
