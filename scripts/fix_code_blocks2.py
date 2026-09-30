import glob
import re
import json

for filepath in glob.glob("src/pages/CurriculumDSAPage.tsx"):
    with open(filepath, "r") as f:
        content = f.read()

    def replacer(match):
        code_content = match.group(1)
        # We only do this if it has newlines or spans, but actually all code is fine to be dangerouslySetInnerHTML 
        # BUT wait! CurriculumDSAPage uses <code> for inline code like `<code>duration = t - startTime</code>`.
        # Inline code doesn't suffer from newline collapse as much, but if it has elements, it might.
        # Actually, inline code is fine.
        # Let's only convert <code> blocks that have \n in them!
        if '\n' not in code_content:
            return match.group(0)

        code_content = code_content.replace('{"{"}', '{')
        code_content = code_content.replace('{"}"}', '}')
        code_content = code_content.replace('className=', 'class=')
        json_str = json.dumps(code_content)
        return f'<code dangerouslySetInnerHTML={{{{ __html: {json_str} }}}}></code>'
        
    new_content = re.sub(r'<code>(.*?)</code>', replacer, content, flags=re.DOTALL)

    with open(filepath, "w") as f:
        f.write(new_content)

print("Done")
