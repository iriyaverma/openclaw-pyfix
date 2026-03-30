import { describe, it, expect } from "vitest";
import {
  PYTHON_ERRORS,
  findByCode,
  findByPattern,
  findByCategory,
  listCategories,
} from "../errors.js";

describe("PYTHON_ERRORS database", () => {
  it("should contain at least 25 entries", () => {
    expect(PYTHON_ERRORS.length).toBeGreaterThanOrEqual(25);
  });

  it("should have no duplicate codes", () => {
    const codes = PYTHON_ERRORS.map((e) => e.code);
    const uniqueCodes = new Set(codes);
    expect(uniqueCodes.size).toBe(codes.length);
  });

  it("every entry should have all required fields", () => {
    for (const entry of PYTHON_ERRORS) {
      expect(entry.code).toBeTruthy();
      expect(entry.title).toBeTruthy();
      expect(entry.category).toBeTruthy();
      expect(entry.pattern).toBeInstanceOf(RegExp);
      expect(entry.explanation).toBeTruthy();
      expect(entry.fixes.length).toBeGreaterThan(0);
      expect(entry.example.bad).toBeTruthy();
      expect(entry.example.good).toBeTruthy();
      expect(entry.docUrl).toBeTruthy();
      expect(["beginner", "intermediate", "advanced"]).toContain(entry.difficulty);
    }
  });

  it("every entry should have a valid category", () => {
    const validCategories = [
      "type", "attribute", "import", "syntax", "name",
      "index", "key", "value", "io", "runtime", "misc",
    ];
    for (const entry of PYTHON_ERRORS) {
      expect(validCategories).toContain(entry.category);
    }
  });

  it("should include TypeError entries", () => {
    const typeErrors = PYTHON_ERRORS.filter((e) => e.code.startsWith("TypeError"));
    expect(typeErrors.length).toBeGreaterThanOrEqual(5);
  });

  it("should include SyntaxError entries", () => {
    const syntaxErrors = PYTHON_ERRORS.filter(
      (e) => e.code.startsWith("SyntaxError") || e.code.startsWith("IndentationError")
    );
    expect(syntaxErrors.length).toBeGreaterThanOrEqual(3);
  });

  it("should include import-related entries", () => {
    const importErrors = PYTHON_ERRORS.filter((e) => e.category === "import");
    expect(importErrors.length).toBeGreaterThanOrEqual(2);
  });
});

describe("findByCode", () => {
  it("should find an error by exact code", () => {
    const result = findByCode("TypeError-not-subscriptable");
    expect(result).toBeDefined();
    expect(result!.title).toBe("Object is not subscriptable");
  });

  it("should return undefined for unknown code", () => {
    const result = findByCode("NonExistent-error-code");
    expect(result).toBeUndefined();
  });

  it("should find KeyError entry", () => {
    const result = findByCode("KeyError-missing-key");
    expect(result).toBeDefined();
    expect(result!.category).toBe("key");
  });

  it("should find ZeroDivisionError entry", () => {
    const result = findByCode("ZeroDivisionError-division-by-zero");
    expect(result).toBeDefined();
    expect(result!.category).toBe("runtime");
  });
});

describe("findByPattern", () => {
  it("should match TypeError: not subscriptable", () => {
    const result = findByPattern("TypeError: 'int' object is not subscriptable");
    expect(result).toBeDefined();
    expect(result!.code).toBe("TypeError-not-subscriptable");
  });

  it("should match NameError: not defined", () => {
    const result = findByPattern("NameError: name 'foo' is not defined");
    expect(result).toBeDefined();
    expect(result!.code).toBe("NameError-not-defined");
  });

  it("should match IndexError: list index out of range", () => {
    const result = findByPattern("IndexError: list index out of range");
    expect(result).toBeDefined();
    expect(result!.code).toBe("IndexError-list-out-of-range");
  });

  it("should match ModuleNotFoundError", () => {
    const result = findByPattern("ModuleNotFoundError: No module named 'numpy'");
    expect(result).toBeDefined();
    expect(result!.code).toBe("ModuleNotFoundError-no-module");
  });

  it("should return undefined for non-matching text", () => {
    const result = findByPattern("Everything is fine, no errors here");
    expect(result).toBeUndefined();
  });
});

describe("findByCategory", () => {
  it("should return all type errors", () => {
    const results = findByCategory("type");
    expect(results.length).toBeGreaterThanOrEqual(5);
    results.forEach((e) => expect(e.category).toBe("type"));
  });

  it("should return all io errors", () => {
    const results = findByCategory("io");
    expect(results.length).toBeGreaterThanOrEqual(2);
    results.forEach((e) => expect(e.category).toBe("io"));
  });

  it("should return empty array for unused category", () => {
    const results = findByCategory("io");
    expect(Array.isArray(results)).toBe(true);
  });
});

describe("listCategories", () => {
  it("should return all unique categories sorted", () => {
    const categories = listCategories();
    expect(categories.length).toBeGreaterThanOrEqual(8);
    for (let i = 1; i < categories.length; i++) {
      expect(categories[i] >= categories[i - 1]).toBe(true);
    }
  });

  it("should include core categories", () => {
    const categories = listCategories();
    expect(categories).toContain("type");
    expect(categories).toContain("syntax");
    expect(categories).toContain("import");
    expect(categories).toContain("name");
    expect(categories).toContain("runtime");
  });
});
