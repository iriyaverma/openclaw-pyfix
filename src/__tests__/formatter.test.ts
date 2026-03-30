import { describe, it, expect } from "vitest";
import { formatFixResult, formatErrorList, formatMultipleResults } from "../formatter.js";
import type { FixResult, PythonError } from "../types.js";

const sampleEntry: PythonError = {
  code: "TypeError-not-subscriptable",
  title: "Object is not subscriptable",
  category: "type",
  pattern: /TypeError: '\w+' object is not subscriptable/,
  explanation: "You tried to index a non-subscriptable object.",
  fixes: ["Check the variable type.", "Ensure it's a list or dict."],
  example: {
    bad: `result = None\nprint(result[0])`,
    good: `result = [1, 2]\nprint(result[0])`,
  },
  docUrl: "https://docs.python.org/3/library/exceptions.html#TypeError",
  difficulty: "beginner",
};

const sampleResult: FixResult = {
  error: {
    errorType: "TypeError",
    message: "'NoneType' object is not subscriptable",
    file: "app.py",
    line: 42,
  },
  matchedEntry: sampleEntry,
  suggestions: sampleEntry.fixes,
  explanation: sampleEntry.explanation,
  example: sampleEntry.example,
  docUrl: sampleEntry.docUrl,
};

describe("formatFixResult", () => {
  it("should include the error type and message", () => {
    const output = formatFixResult(sampleResult);
    expect(output).toContain("TypeError");
    expect(output).toContain("'NoneType' object is not subscriptable");
  });

  it("should include file and line info", () => {
    const output = formatFixResult(sampleResult);
    expect(output).toContain("`app.py`");
    expect(output).toContain("line 42");
  });

  it("should include explanation section", () => {
    const output = formatFixResult(sampleResult);
    expect(output).toContain("### Explanation");
    expect(output).toContain("non-subscriptable");
  });

  it("should include suggested fixes", () => {
    const output = formatFixResult(sampleResult);
    expect(output).toContain("### Suggested Fixes");
    expect(output).toContain("Check the variable type.");
  });

  it("should include example code", () => {
    const output = formatFixResult(sampleResult);
    expect(output).toContain("**Bad:**");
    expect(output).toContain("**Good:**");
    expect(output).toContain("```python");
  });

  it("should include doc URL", () => {
    const output = formatFixResult(sampleResult);
    expect(output).toContain("https://docs.python.org");
  });

  it("should handle result without file info", () => {
    const minimal: FixResult = {
      error: { errorType: "KeyError", message: "'name'" },
      suggestions: ["Use .get() method."],
    };
    const output = formatFixResult(minimal);
    expect(output).toContain("KeyError");
    expect(output).not.toContain("**File:**");
  });
});

describe("formatErrorList", () => {
  it("should format a list of errors as a markdown table", () => {
    const output = formatErrorList([sampleEntry]);
    expect(output).toContain("| Code | Title | Difficulty |");
    expect(output).toContain("`TypeError-not-subscriptable`");
    expect(output).toContain("1 error(s) listed");
  });

  it("should include category in heading when provided", () => {
    const output = formatErrorList([sampleEntry], "type");
    expect(output).toContain("## Python Errors: type");
  });

  it("should use generic heading without category", () => {
    const output = formatErrorList([sampleEntry]);
    expect(output).toContain("## All Python Errors");
  });
});

describe("formatMultipleResults", () => {
  it("should return 'No errors detected' for empty array", () => {
    const output = formatMultipleResults([]);
    expect(output).toContain("No errors detected");
  });

  it("should format single result without numbering", () => {
    const output = formatMultipleResults([sampleResult]);
    expect(output).toContain("TypeError");
    expect(output).not.toContain("Error 1");
  });

  it("should format multiple results with numbering", () => {
    const secondResult: FixResult = {
      error: { errorType: "KeyError", message: "'missing'" },
      suggestions: ["Use .get()."],
    };
    const output = formatMultipleResults([sampleResult, secondResult]);
    expect(output).toContain("2 Error(s) Detected");
    expect(output).toContain("Error 1");
    expect(output).toContain("Error 2");
  });

  it("should include content from all results", () => {
    const secondResult: FixResult = {
      error: { errorType: "ValueError", message: "invalid literal" },
      suggestions: ["Validate input."],
    };
    const output = formatMultipleResults([sampleResult, secondResult]);
    expect(output).toContain("TypeError");
    expect(output).toContain("ValueError");
  });
});
