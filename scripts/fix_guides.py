import glob
import re

for filepath in glob.glob("src/pages/**/*.tsx", recursive=True):
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Remove projector toggle button
    # Wait, the toggle button is:
    # <button className="toggle-btn" id="projectorToggle" type="button" aria-pressed="false">
    #   <svg ...>...</svg>
    #   <span className="sr-only">Projector Mode</span>
    # </button>
    content = re.sub(r'<button\s+className="toggle-btn"\s+id="projectorToggle"[^>]*>.*?<\/button>', '', content, flags=re.DOTALL)
    
    # Remove footer
    content = re.sub(r'<footer>.*?</footer>', '', content, flags=re.DOTALL)

    with open(filepath, 'w') as f:
        f.write(content)
