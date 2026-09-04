import os
import re

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    original = content
    content = re.sub(r'([a-zA-Z0-9_\.\[\]]+)\s*\|\s*None', r'Optional[\1]', content)
    content = content.replace('bytes | zipfile.ZipInfo', 'Union[bytes, zipfile.ZipInfo]')

    if content != original:
        imports = []
        if 'Optional[' in content and 'Optional' not in original:
            imports.append('Optional')
        if 'Union[' in content and 'Union' not in original:
            imports.append('Union')
        
        if imports:
            import_stmt = f"from typing import {', '.join(imports)}\n"
            # find first import
            first_import = re.search(r'^import |^from ', content, flags=re.MULTILINE)
            if first_import:
                idx = first_import.start()
                content = content[:idx] + import_stmt + content[idx:]
            else:
                content = import_stmt + content
        
        with open(filepath, 'w') as f:
            f.write(content)

for root, _, files in os.walk('api'):
    for file in files:
        if file.endswith('.py'):
            process_file(os.path.join(root, file))
