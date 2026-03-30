import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { Type } from "@sinclair/typebox";
import { PYTHON_ERRORS, findByCode, findByCategory, listCategories } from "./src/errors.js";
import { parseTracebackOutput, lookupError, extractErrorType } from "./src/parser.js";
import { formatFixResult, formatErrorList, formatMultipleResults } from "./src/formatter.js";
import { runCLI } from "./src/cli.js";

const PYTHON_ERROR_PATTERN =
  /(TypeError|AttributeError|ImportError|SyntaxError|NameError|IndexError|KeyError|ValueError|FileNotFoundError):/;

export default definePluginEntry({
  id: "pyfix",
  name: "PyFix",
  version: "1.0.0",

  init(api) {
    api.registerCLI({
      commands: ["pyfix"],
      handler(ctx) {
        runCLI({
          args: ctx.args,
          stdin: ctx.stdin,
          write: (text) => ctx.write(text),
        });
      },
    });

    if (api.registrationMode === "cli-metadata") return;

    api.registerTool({
      name: "py_fix",
      description: "Paste a Python traceback to get diagnosis and fix suggestions",
      parameters: Type.Object({
        traceback: Type.String({ description: "The full Python traceback or error text" }),
      }),
      async execute({ traceback }) {
        const parsed = parseTracebackOutput(traceback);
        const results = parsed.map((error) => {
          const fullText = `${error.errorType}: ${error.message}`;
          const matchedEntry = PYTHON_ERRORS.find((e) => e.pattern.test(fullText));
          return {
            error,
            matchedEntry,
            suggestions: matchedEntry?.fixes ?? ["No matching fix found."],
            explanation: matchedEntry?.explanation,
            example: matchedEntry?.example,
            docUrl: matchedEntry?.docUrl,
          };
        });
        return formatMultipleResults(results);
      },
    });

    api.registerTool({
      name: "py_explain",
      description: "Look up a specific Python error type by its code",
      parameters: Type.Object({
        code: Type.String({ description: "Error code, e.g. 'TypeError-not-subscriptable'" }),
      }),
      async execute({ code }) {
        const entry = findByCode(code);
        if (!entry) {
          return `Error code "${code}" not found. Use py_errors to list available codes.`;
        }
        return formatFixResult({
          error: { errorType: entry.title, message: entry.explanation },
          matchedEntry: entry,
          suggestions: entry.fixes,
          explanation: entry.explanation,
          example: entry.example,
          docUrl: entry.docUrl,
        });
      },
    });

    api.registerTool({
      name: "py_errors",
      description: "List known Python errors, optionally filtered by category",
      parameters: Type.Object({
        category: Type.Optional(
          Type.String({ description: "Filter by category (e.g. 'type', 'syntax', 'import')" })
        ),
      }),
      async execute({ category }) {
        if (category) {
          const errors = findByCategory(category as any);
          if (errors.length === 0) return `No errors found for category: ${category}`;
          return formatErrorList(errors, category as any);
        }
        return formatErrorList(PYTHON_ERRORS);
      },
    });

    api.registerHook("after_tool_call", async (ctx) => {
      if (typeof ctx.result !== "string") return;
      const match = ctx.result.match(PYTHON_ERROR_PATTERN);
      if (!match) return;

      const result = lookupError(ctx.result);
      if (result && result.matchedEntry) {
        ctx.addAnnotation({
          type: "pyfix",
          title: `PyFix: ${result.matchedEntry.title}`,
          message: formatFixResult(result),
        });
      }
    });
  },
});
