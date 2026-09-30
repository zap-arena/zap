import re
import os
import glob

# Fix JSX syntax in generated pages
files = glob.glob("src/pages/guide/*.tsx")

def fix_jsx(content):
    # Remove HTML comments
    content = re.sub(r'<!--(.*?)-->', r'', content, flags=re.DOTALL)
    # Fix tabIndex? Wait, we didn't add any.
    return content

for file in files:
    with open(file, "r") as f:
        content = f.read()
    
    content = fix_jsx(content)
    
    # Rename links in IndexPage
    if "IndexPage" in file:
        content = content.replace('href="hashing-dsa-guide.html"', 'href="/curriculum/dsa/hashing"')
        content = content.replace('href="sliding-window-dsa-guide.html"', 'href="/curriculum/dsa/sliding-window"')
        content = content.replace('href="two-pointer-dsa-guide.html"', 'href="/curriculum/dsa/two-pointer"')
        
        # Rename component
        content = content.replace('IndexPage', 'CurriculumDSAPage')
        
    with open(file, "w") as f:
        f.write(content)

# rename IndexPage.tsx to CurriculumDSAPage.tsx
if os.path.exists("src/pages/guide/IndexPage.tsx"):
    os.rename("src/pages/guide/IndexPage.tsx", "src/pages/CurriculumDSAPage.tsx")

