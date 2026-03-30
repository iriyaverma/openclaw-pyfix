import { FixResult, PythonError, ErrorCategory } from "./types.js";

export function formatFixResult(result: FixResult): string {
  const lines: string[] = [];

  lines.push(`## ${result.error.errorType}: ${result.error.message}`);
  lines.push("");

  if (result.error.file) {
    lines.push(`**File:** \`${result.error.file}\`${result.error.line ? ` (line ${result.error.line})` : ""}`);
    lines.push("");
  }

  if (result.matchedEntry) {
    lines.push(`**Code:** \`${result.matchedEntry.code}\``);
    lines.push(`**Difficulty:** ${result.matchedEntry.difficulty}`);
    lines.push("");
  }

  if (result.explanation) {
    lines.push("### Explanation");
    lines.push("");
    lines.push(result.explanation);
    lines.push("");
  }

  if (result.suggestions.length > 0) {
    lines.push("### Suggested Fixes");
    lines.push("");
    for (const fix of result.suggestions) {
      lines.push(`- ${fix}`);
    }
    lines.push("");
  }

  if (result.example) {
    lines.push("### Example");
    lines.push("");
    lines.push("**Bad:**");
    lines.push("```python");
    lines.push(result.example.bad);
    lines.push("```");
    lines.push("");
    lines.push("**Good:**");
    lines.push("```python");
    lines.push(result.example.good);
    lines.push("```");
    lines.push("");
  }

  if (result.docUrl) {
    lines.push(`**Docs:** ${result.docUrl}`);
    lines.push("");
  }

  return lines.join("\n");
}

export function formatErrorList(
  errors: PythonError[],
  category?: ErrorCategory
): string {
  const lines: string[] = [];

  const heading = category
    ? `## Python Errors: ${category}`
    : "## All Python Errors";
  lines.push(heading);
  lines.push("");

  lines.push("| Code | Title | Difficulty |");
  lines.push("|------|-------|------------|");

  for (const error of errors) {
    lines.push(`| \`${error.code}\` | ${error.title} | ${error.difficulty} |`);
  }

  lines.push("");
  lines.push(`*${errors.length} error(s) listed.*`);
  lines.push("");

  return lines.join("\n");
}

export function formatMultipleResults(results: FixResult[]): string {
  if (results.length === 0) {
    return "No errors detected.\n";
  }

  if (results.length === 1) {
    return formatFixResult(results[0]);
  }

  const lines: string[] = [];
  lines.push(`# PyFix: ${results.length} Error(s) Detected`);
  lines.push("");

  for (let i = 0; i < results.length; i++) {
    lines.push(`---`);
    lines.push("");
    lines.push(`### Error ${i + 1}`);
    lines.push("");
    lines.push(formatFixResult(results[i]));
  }

  return lines.join("\n");
}
