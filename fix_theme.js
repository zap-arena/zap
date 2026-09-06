const fs = require("node:fs");
const content = fs.readFileSync("src/store/theme.ts", "utf8");

const replaced = content
  .replace(
    "const notify = () => listeners.forEach((fn) => fn());",
    "const notify = () => listeners.forEach((fn) => { fn(); });",
  )
  .replace(
    "const notifyAccent = () => accentListeners.forEach((fn) => fn());",
    "const notifyAccent = () => accentListeners.forEach((fn) => { fn(); });",
  );

fs.writeFileSync("src/store/theme.ts", replaced);
