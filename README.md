# PyFix

**An OpenClaw plugin for diagnosing and fixing common Python errors.**

Created by **Riya Verma**.

PyFix automatically detects Python tracebacks and provides clear explanations, fix suggestions, and example code to help you resolve errors quickly.

## Installation

```bash
npm install openclaw-pyfix
```

Add the plugin to your OpenClaw configuration:

```json
{
  "plugins": ["openclaw-pyfix"]
}
```

## Error Categories

| Category    | Description                              | Examples                                   |
|-------------|------------------------------------------|--------------------------------------------|
| `type`      | Type-related errors                      | not subscriptable, unsupported operand     |
| `attribute` | Attribute access errors                  | has no attribute, module has no attr       |
| `import`    | Import and module errors                 | ModuleNotFoundError, ImportError           |
| `syntax`    | Syntax and indentation errors            | invalid syntax, unexpected indent          |
| `name`      | Name resolution errors                   | NameError, UnboundLocalError               |
| `index`     | Index out of range errors                | list index out of range                    |
| `key`       | Dictionary key errors                    | KeyError                                   |
| `value`     | Value conversion/unpacking errors        | invalid literal, too many values to unpack |
| `io`        | File and permission errors               | FileNotFoundError, PermissionError         |
| `runtime`   | Runtime errors                           | ZeroDivisionError, RecursionError          |
| `misc`      | Other errors                             | UnicodeDecodeError, JSONDecodeError        |

## Agent Tools

PyFix registers three tools for the OpenClaw agent:

- **`py_fix`** - Paste a Python traceback to get diagnosis and fix suggestions
- **`py_explain`** - Look up a specific Python error type by its code
- **`py_errors`** - List known Python errors, optionally filtered by category

## Auto-Detection

PyFix hooks into `after_tool_call` to automatically detect Python errors in tool output. When an error matching common Python exception types is found, it adds an annotation with diagnosis and fix suggestions.

Detected error types: `TypeError`, `AttributeError`, `ImportError`, `SyntaxError`, `NameError`, `IndexError`, `KeyError`, `ValueError`, `FileNotFoundError`.

## CLI

PyFix adds a `pyfix` CLI subcommand:

```bash
# List all known errors
openclaw pyfix errors

# Filter by category
openclaw pyfix errors type

# Look up a specific error
openclaw pyfix lookup "TypeError: 'int' object is not subscriptable"

# List categories
openclaw pyfix categories
```

## Testing

```bash
npm install
npm test
```

The test suite covers:
- Error database integrity (25+ entries, no duplicates, all fields valid)
- Traceback parsing (full tracebacks, bare error lines, multiple errors)
- Markdown formatting (single results, error lists, multiple results)

## License

MIT
