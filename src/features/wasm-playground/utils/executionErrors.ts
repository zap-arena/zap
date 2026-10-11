/**
 * Formats runtime and compilation error messages for display.
 */
export function formatExecutionError(errorText: string): {
  headline: string;
  details: string;
} {
  if (!errorText) {
    return { headline: "Unknown Execution Error", details: "" };
  }

  const lines = errorText.trim().split("\n");
  const lastLine = lines[lines.length - 1] || "Error occurred";

  // Check if it's a Python traceback
  if (errorText.includes("Traceback (most recent call last):")) {
    return {
      headline: lastLine,
      details: errorText,
    };
  }

  // Check for C++ clang compiler diagnostics
  if (errorText.includes("error:")) {
    const errorLine = lines.find((l) => l.includes("error:")) || lines[0];
    return {
      headline: errorLine,
      details: errorText,
    };
  }

  return {
    headline: lines[0] || "Execution Error",
    details: errorText,
  };
}
