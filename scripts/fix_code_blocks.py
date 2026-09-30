import glob
import re
import json

for filepath in glob.glob("src/pages/guide/*.tsx"):
    with open(filepath, "r") as f:
        content = f.read()

    def replacer(match):
        code_content = match.group(1)
        # Undo JSX stuff
        code_content = code_content.replace('{"{"}', '{')
        code_content = code_content.replace('{"}"}', '}')
        code_content = code_content.replace('className=', 'class=')
        
        # we don't strictly need to unescape &lt; and &gt; because HTML parsers handle them perfectly
        
        # Serialize to JSON string
        json_str = json.dumps(code_content)
        
        return f'<code dangerouslySetInnerHTML={{{{ __html: {json_str} }}}}></code>'
        
    new_content = re.sub(r'<code>(.*?)</code>', replacer, content, flags=re.DOTALL)

    with open(filepath, "w") as f:
        f.write(new_content)

print("Done")
