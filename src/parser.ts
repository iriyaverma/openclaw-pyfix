import { ParsedError, FixResult } from "./types.js";
import { findByPattern } from "./errors.js";

const TRACEBACK_HEADER = /Traceback \(most recent call last\):/;
const FILE_LINE = /File "(.+?)", line (\d+)/;
const ERROR_LINE = /^(\w+(?:\.\w+)*(?:Error|Exception|Warning|Interrupt)): (.+)$/m;
const BARE_ERROR_LINE = /^(\w+(?:\.\w+)*(?:Error|Exception|Warning|Interrupt)):?\s*(.*)?$/m;

export function parseTracebackOutput(output: string): ParsedError[] {
  const errors: ParsedError[] = [];
  const blocks = output.split(TRACEBACK_HEADER);

  for (let i = 1; i < blocks.length; i++) {
    const block = blocks[i];
    const fullTraceback = "Traceback (most recent call last):" + block;

    const fileMatch = block.match(FILE_LINE);
    const errorMatch = block.match(ERROR_LINE);

    if (errorMatch) {
      errors.push({
        errorType: errorMatch[1],
        message: errorMatch[2],
        file: fileMatch?.[1],
        line: fileMatch ? parseInt(fileMatch[2], 10) : undefined,
        fullTraceback: fullTraceback.trim(),
      });
    }
  }

  if (blocks.length === 1) {
    const lines = output.split("\n");
    for (const line of lines) {
      const match = line.match(BARE_ERROR_LINE);
      if (match) {
        errors.push({
          errorType: match[1],
          message: match[2] || "",
        });
      }
    }
  }

  return errors;
}

export function lookupError(errorText: string): FixResult | null {
  const parsed = parseTracebackOutput(errorText);
  if (parsed.length === 0) return null;

  const error = parsed[0];
  const fullText = `${error.errorType}: ${error.message}`;
  const matchedEntry = findByPattern(fullText);

  if (!matchedEntry) {
    return {
      error,
      suggestions: ["No matching fix found. Check the Python documentation for this error type."],
    };
  }

  return {
    error,
    matchedEntry,
    suggestions: matchedEntry.fixes,
    explanation: matchedEntry.explanation,
    example: matchedEntry.example,
    docUrl: matchedEntry.docUrl,
  };
}

export function extractErrorType(text: string): string | null {
  const match = text.match(BARE_ERROR_LINE);
  return match ? match[1] : null;
}
