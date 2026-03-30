import { describe, it, expect } from "vitest";
import { parseTracebackOutput, lookupError, extractErrorType } from "../parser.js";

describe("parseTracebackOutput", () => {
  it("should parse a full Python traceback", () => {
    const traceback = `Traceback (most recent call last):
  File "script.py", line 10, in <module>
    result = 1 / 0
ZeroDivisionError: division by zero`;

    const results = parseTracebackOutput(traceback);
    expect(results).toHaveLength(1);
    expect(results[0].errorType).toBe("ZeroDivisionError");
    expect(results[0].message).toBe("division by zero");
    expect(results[0].file).toBe("script.py");
    expect(results[0].line).toBe(10);
    expect(results[0].fullTraceback).toContain("Traceback (most recent call last):");
  });

  it("should parse a bare error line (no traceback)", () => {
    const text = "TypeError: 'int' object is not subscriptable";
    const results = parseTracebackOutput(text);
    expect(results).toHaveLength(1);
    expect(results[0].errorType).toBe("TypeError");
    expect(results[0].message).toBe("'int' object is not subscriptable");
  });

  it("should handle multiple tracebacks in one output", () => {
    const output = `Traceback (most recent call last):
  File "a.py", line 1, in <module>
    x = int("abc")
ValueError: invalid literal for int() with base 10: 'abc'

Traceback (most recent call last):
  File "b.py", line 5, in <module>
    y = 1 / 0
ZeroDivisionError: division by zero`;

    const results = parseTracebackOutput(output);
    expect(results).toHaveLength(2);
    expect(results[0].errorType).toBe("ValueError");
    expect(results[1].errorType).toBe("ZeroDivisionError");
  });

  it("should parse traceback with nested file references", () => {
    const traceback = `Traceback (most recent call last):
  File "main.py", line 15, in <module>
    run()
  File "utils.py", line 8, in run
    process(data)
  File "core.py", line 3, in process
    return data[0]
IndexError: list index out of range`;

    const results = parseTracebackOutput(traceback);
    expect(results).toHaveLength(1);
    expect(results[0].errorType).toBe("IndexError");
    expect(results[0].message).toBe("list index out of range");
  });

  it("should return empty array for no errors", () => {
    const results = parseTracebackOutput("All good, no errors here.");
    expect(results).toHaveLength(0);
  });

  it("should parse NameError correctly", () => {
    const text = "NameError: name 'undefined_var' is not defined";
    const results = parseTracebackOutput(text);
    expect(results).toHaveLength(1);
    expect(results[0].errorType).toBe("NameError");
  });

  it("should parse ImportError correctly", () => {
    const traceback = `Traceback (most recent call last):
  File "app.py", line 1, in <module>
    from collections import OrderDict
ImportError: cannot import name 'OrderDict'`;

    const results = parseTracebackOutput(traceback);
    expect(results).toHaveLength(1);
    expect(results[0].errorType).toBe("ImportError");
    expect(results[0].file).toBe("app.py");
  });

  it("should parse AttributeError correctly", () => {
    const text = "AttributeError: 'list' object has no attribute 'add'";
    const results = parseTracebackOutput(text);
    expect(results).toHaveLength(1);
    expect(results[0].errorType).toBe("AttributeError");
    expect(results[0].message).toContain("no attribute");
  });
});

describe("lookupError", () => {
  it("should return a FixResult with matched entry for known error", () => {
    const result = lookupError("IndexError: list index out of range");
    expect(result).not.toBeNull();
    expect(result!.matchedEntry).toBeDefined();
    expect(result!.matchedEntry!.code).toBe("IndexError-list-out-of-range");
    expect(result!.suggestions.length).toBeGreaterThan(0);
  });

  it("should return null for non-parseable text", () => {
    const result = lookupError("this is just regular output");
    expect(result).toBeNull();
  });

  it("should return a result with suggestions even for unmatched errors", () => {
    const result = lookupError("RuntimeError: something unusual happened");
    expect(result).not.toBeNull();
    expect(result!.suggestions.length).toBeGreaterThan(0);
  });

  it("should match full traceback input", () => {
    const traceback = `Traceback (most recent call last):
  File "test.py", line 5, in <module>
    x[10]
IndexError: list index out of range`;

    const result = lookupError(traceback);
    expect(result).not.toBeNull();
    expect(result!.matchedEntry).toBeDefined();
    expect(result!.error.file).toBe("test.py");
  });
});

describe("extractErrorType", () => {
  it("should extract error type from error line", () => {
    expect(extractErrorType("TypeError: 'int' object is not subscriptable")).toBe("TypeError");
  });

  it("should extract error type from bare error", () => {
    expect(extractErrorType("ValueError: invalid literal")).toBe("ValueError");
  });

  it("should return null for non-error text", () => {
    expect(extractErrorType("Hello world")).toBeNull();
  });
});
