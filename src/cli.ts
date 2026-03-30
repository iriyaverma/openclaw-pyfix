import { PYTHON_ERRORS, findByCode, findByCategory, listCategories } from "./errors.js";
import { parseTracebackOutput, lookupError } from "./parser.js";
import { formatFixResult, formatErrorList } from "./formatter.js";

export interface CLIContext {
  args: string[];
  stdin?: string;
  write(text: string): void;
}

export function runCLI(ctx: CLIContext): void {
  const [subcommand, ...rest] = ctx.args;

  switch (subcommand) {
    case "errors":
      handleErrors(ctx, rest);
      break;
    case "lookup":
      handleLookup(ctx, rest);
      break;
    case "categories":
      handleCategories(ctx);
      break;
    default:
      ctx.write(
        [
          "PyFix - Python Error Diagnosis Tool",
          "",
          "Usage: pyfix <command>",
          "",
          "Commands:",
          "  errors [category]  List known Python errors (optionally filtered by category)",
          "  lookup <text>      Look up a specific error by pasting traceback text",
          "  categories         List all error categories",
          "",
        ].join("\n")
      );
  }
}

function handleErrors(ctx: CLIContext, args: string[]): void {
  const category = args[0];
  if (category) {
    const errors = findByCategory(category as any);
    if (errors.length === 0) {
      ctx.write(`No errors found for category: ${category}\n`);
      return;
    }
    ctx.write(formatErrorList(errors, category as any));
  } else {
    ctx.write(formatErrorList(PYTHON_ERRORS));
  }
}

function handleLookup(ctx: CLIContext, args: string[]): void {
  const text = args.join(" ") || ctx.stdin || "";
  if (!text.trim()) {
    ctx.write("Please provide error text to look up.\n");
    return;
  }

  const result = lookupError(text);
  if (result) {
    ctx.write(formatFixResult(result));
  } else {
    ctx.write("Could not parse the provided error text.\n");
  }
}

function handleCategories(ctx: CLIContext): void {
  const categories = listCategories();
  ctx.write("## Error Categories\n\n");
  for (const cat of categories) {
    const count = findByCategory(cat).length;
    ctx.write(`- **${cat}** (${count} errors)\n`);
  }
  ctx.write("\n");
}
