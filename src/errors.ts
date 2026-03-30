import { PythonError, ErrorCategory } from "./types.js";

export const PYTHON_ERRORS: PythonError[] = [
  {
    code: "TypeError-not-subscriptable",
    title: "Object is not subscriptable",
    category: "type",
    pattern: /TypeError: '(\w+)' object is not subscriptable/,
    explanation:
      "You tried to use square bracket indexing on an object that doesn't support it, such as an int, float, or NoneType.",
    fixes: [
      "Check the variable type before indexing — it may be None or a non-collection type.",
      "Ensure the variable holds a list, dict, or tuple before using [] on it.",
      "Use a type guard or default value: `value = obj[key] if obj else default`.",
    ],
    example: {
      bad: `result = None\nprint(result[0])`,
      good: `result = [1, 2, 3]\nprint(result[0])`,
    },
    docUrl: "https://docs.python.org/3/library/exceptions.html#TypeError",
    difficulty: "beginner",
  },
  {
    code: "TypeError-unsupported-operand",
    title: "Unsupported operand type(s)",
    category: "type",
    pattern: /TypeError: unsupported operand type\(s\) for .+:/,
    explanation:
      "You tried to use an operator (like +, -, *, /) between two incompatible types, such as adding a string and an integer.",
    fixes: [
      "Convert one of the operands to match the other type using int(), str(), or float().",
      "Check that variables hold the expected types before performing operations.",
      "Use f-strings for string concatenation with mixed types: `f'{name}{age}'`.",
    ],
    example: {
      bad: `result = "age: " + 25`,
      good: `result = "age: " + str(25)`,
    },
    docUrl: "https://docs.python.org/3/library/exceptions.html#TypeError",
    difficulty: "beginner",
  },
  {
    code: "TypeError-takes-n-args",
    title: "Function takes N positional arguments",
    category: "type",
    pattern: /TypeError: \w+\(\) takes \d+ positional arguments? but \d+ (?:was|were) given/,
    explanation:
      "A function was called with the wrong number of arguments. This often happens when forgetting `self` in a class method.",
    fixes: [
      "Check the function signature and match the number of arguments.",
      "For class methods, ensure `self` is the first parameter.",
      "Use keyword arguments or default parameter values for optional arguments.",
    ],
    example: {
      bad: `def greet(name):\n    print(name)\ngreet("Alice", "Bob")`,
      good: `def greet(name, other=None):\n    print(name)\ngreet("Alice", "Bob")`,
    },
    docUrl: "https://docs.python.org/3/library/exceptions.html#TypeError",
    difficulty: "beginner",
  },
  {
    code: "TypeError-not-callable",
    title: "Object is not callable",
    category: "type",
    pattern: /TypeError: '(\w+)' object is not callable/,
    explanation:
      "You used parentheses () on an object that isn't a function, often by shadowing a built-in name or misusing parentheses.",
    fixes: [
      "Check if you accidentally reassigned a built-in like `list`, `dict`, `str`, or `int`.",
      "Use square brackets [] for indexing instead of parentheses ().",
      "Rename variables that shadow built-in functions.",
    ],
    example: {
      bad: `list = [1, 2, 3]\nnew_list = list([4, 5])`,
      good: `my_list = [1, 2, 3]\nnew_list = list([4, 5])`,
    },
    docUrl: "https://docs.python.org/3/library/exceptions.html#TypeError",
    difficulty: "beginner",
  },
  {
    code: "TypeError-not-iterable",
    title: "Object is not iterable",
    category: "type",
    pattern: /TypeError: '(\w+)' object is not iterable/,
    explanation:
      "You tried to iterate over an object that doesn't support iteration, such as an int or NoneType.",
    fixes: [
      "Ensure the variable is a list, tuple, set, dict, or other iterable before looping.",
      "Check if a function returned None instead of a collection.",
      "Wrap a single value in a list: `for x in [value]:`.",
    ],
    example: {
      bad: `for i in 42:\n    print(i)`,
      good: `for i in range(42):\n    print(i)`,
    },
    docUrl: "https://docs.python.org/3/library/exceptions.html#TypeError",
    difficulty: "beginner",
  },
  {
    code: "TypeError-unhashable",
    title: "Unhashable type",
    category: "type",
    pattern: /TypeError: unhashable type: '(\w+)'/,
    explanation:
      "You tried to use a mutable type (like a list or dict) as a dictionary key or set element. Only hashable (immutable) types are allowed.",
    fixes: [
      "Convert lists to tuples before using as dict keys or set elements.",
      "Use frozenset instead of set for nested set elements.",
      "Restructure your data to avoid mutable keys.",
    ],
    example: {
      bad: `my_dict = {[1, 2]: "value"}`,
      good: `my_dict = {(1, 2): "value"}`,
    },
    docUrl: "https://docs.python.org/3/library/exceptions.html#TypeError",
    difficulty: "intermediate",
  },
  {
    code: "AttributeError-no-attribute",
    title: "Object has no attribute",
    category: "attribute",
    pattern: /AttributeError: '(\w+)' object has no attribute '(\w+)'/,
    explanation:
      "You tried to access an attribute or method that doesn't exist on the object. This often happens due to a typo or wrong type.",
    fixes: [
      "Check for typos in the attribute name.",
      "Verify the object is the expected type using `type(obj)` or `isinstance()`.",
      "Use `hasattr(obj, 'attr')` to check before accessing.",
      "Check if the variable might be None (NoneType has no attribute).",
    ],
    example: {
      bad: `my_list = [1, 2, 3]\nmy_list.add(4)`,
      good: `my_list = [1, 2, 3]\nmy_list.append(4)`,
    },
    docUrl: "https://docs.python.org/3/library/exceptions.html#AttributeError",
    difficulty: "beginner",
  },
  {
    code: "AttributeError-module-no-attribute",
    title: "Module has no attribute",
    category: "attribute",
    pattern: /AttributeError: module '(\w[\w.]*)' has no attribute '(\w+)'/,
    explanation:
      "You tried to access something from a module that doesn't exist. This often happens when a local file shadows a standard library module.",
    fixes: [
      "Ensure you don't have a local file with the same name as the module.",
      "Check the correct function/class name in the module documentation.",
      "Verify the module version — the attribute may have been added or removed.",
    ],
    example: {
      bad: `import math\nresult = math.squared(4)`,
      good: `import math\nresult = math.sqrt(4)`,
    },
    docUrl: "https://docs.python.org/3/library/exceptions.html#AttributeError",
    difficulty: "intermediate",
  },
  {
    code: "ImportError-cannot-import",
    title: "Cannot import name",
    category: "import",
    pattern: /ImportError: cannot import name '(\w+)'/,
    explanation:
      "The specified name could not be found in the module. It may not exist, or there may be a circular import.",
    fixes: [
      "Check for typos in the imported name.",
      "Verify the name is exported from the module.",
      "Look for circular imports and restructure if necessary.",
      "Check if the module version has the expected export.",
    ],
    example: {
      bad: `from collections import OrderDict`,
      good: `from collections import OrderedDict`,
    },
    docUrl: "https://docs.python.org/3/library/exceptions.html#ImportError",
    difficulty: "intermediate",
  },
  {
    code: "ModuleNotFoundError-no-module",
    title: "No module named",
    category: "import",
    pattern: /ModuleNotFoundError: No module named '([\w.]+)'/,
    explanation:
      "Python cannot find the module you're trying to import. It may not be installed, or the name may be wrong.",
    fixes: [
      "Install the module: `pip install <module_name>`.",
      "Check that your virtual environment is activated.",
      "Verify the module name — PyPI names sometimes differ from import names.",
      "Ensure there's no local file shadowing the module.",
    ],
    example: {
      bad: `import reqeusts`,
      good: `import requests  # pip install requests`,
    },
    docUrl: "https://docs.python.org/3/library/exceptions.html#ModuleNotFoundError",
    difficulty: "beginner",
  },
  {
    code: "SyntaxError-invalid-syntax",
    title: "Invalid syntax",
    category: "syntax",
    pattern: /SyntaxError: invalid syntax/,
    explanation:
      "Python encountered code it could not parse. Common causes include missing colons, unmatched brackets, or incorrect keywords.",
    fixes: [
      "Check for missing colons after `if`, `for`, `while`, `def`, `class`.",
      "Verify all brackets, parentheses, and quotes are matched.",
      "Look for Python 2 syntax used in Python 3 (e.g., `print \"hello\"`).",
      "Check the line above — the error is sometimes reported on the next line.",
    ],
    example: {
      bad: `if x == 5\n    print(x)`,
      good: `if x == 5:\n    print(x)`,
    },
    docUrl: "https://docs.python.org/3/library/exceptions.html#SyntaxError",
    difficulty: "beginner",
  },
  {
    code: "SyntaxError-unexpected-indent",
    title: "Unexpected indent",
    category: "syntax",
    pattern: /IndentationError: unexpected indent/,
    explanation:
      "A line is indented more than expected. Python uses indentation for code blocks, so inconsistent indentation causes errors.",
    fixes: [
      "Use consistent indentation (4 spaces per level is standard).",
      "Don't mix tabs and spaces — configure your editor to use spaces.",
      "Check that the line belongs inside the current code block.",
    ],
    example: {
      bad: `def foo():\n    x = 1\n        y = 2`,
      good: `def foo():\n    x = 1\n    y = 2`,
    },
    docUrl: "https://docs.python.org/3/library/exceptions.html#IndentationError",
    difficulty: "beginner",
  },
  {
    code: "SyntaxError-eol-scanning",
    title: "EOL while scanning string literal",
    category: "syntax",
    pattern: /SyntaxError: (?:EOL while scanning string literal|unterminated string literal)/,
    explanation:
      "A string literal was opened but not properly closed before the end of the line.",
    fixes: [
      "Add the matching closing quote at the end of the string.",
      "Use triple quotes for multi-line strings: `'''...'''` or `\"\"\"...\"\"\"` .",
      "Escape internal quotes if needed: `\\'` or `\\\"`.",
    ],
    example: {
      bad: `message = "Hello world`,
      good: `message = "Hello world"`,
    },
    docUrl: "https://docs.python.org/3/library/exceptions.html#SyntaxError",
    difficulty: "beginner",
  },
  {
    code: "SyntaxError-fstring",
    title: "f-string expression error",
    category: "syntax",
    pattern: /SyntaxError: f-string[:\s]/,
    explanation:
      "There is a syntax error inside an f-string expression. This can happen with unmatched braces, backslashes, or invalid expressions.",
    fixes: [
      "Ensure all braces are matched: use `{{` and `}}` for literal braces.",
      "Move complex expressions out of the f-string into a variable.",
      "Avoid backslashes inside f-string expressions (use a variable instead).",
    ],
    example: {
      bad: `name = "world"\nprint(f"Hello {name!}")`,
      good: `name = "world"\nprint(f"Hello {name}!")`,
    },
    docUrl: "https://docs.python.org/3/reference/lexical_analysis.html#f-strings",
    difficulty: "intermediate",
  },
  {
    code: "NameError-not-defined",
    title: "Name is not defined",
    category: "name",
    pattern: /NameError: name '(\w+)' is not defined/,
    explanation:
      "A variable, function, or class was used before being defined or is out of scope.",
    fixes: [
      "Check for typos in the variable name.",
      "Ensure the variable is defined before use.",
      "Import the module or function if it comes from an external library.",
      "Check the variable scope — variables inside functions are local by default.",
    ],
    example: {
      bad: `print(message)\nmessage = "hello"`,
      good: `message = "hello"\nprint(message)`,
    },
    docUrl: "https://docs.python.org/3/library/exceptions.html#NameError",
    difficulty: "beginner",
  },
  {
    code: "IndexError-list-out-of-range",
    title: "List index out of range",
    category: "index",
    pattern: /IndexError: list index out of range/,
    explanation:
      "You tried to access a list element at an index that doesn't exist. Lists are zero-indexed, so the last valid index is `len(list) - 1`.",
    fixes: [
      "Check the list length before accessing: `if i < len(items):`.",
      "Use `try/except IndexError` for safe access.",
      "Use negative indexing for last elements: `items[-1]`.",
      "Verify loop bounds when using `range()`.",
    ],
    example: {
      bad: `items = [1, 2, 3]\nprint(items[5])`,
      good: `items = [1, 2, 3]\nprint(items[2])`,
    },
    docUrl: "https://docs.python.org/3/library/exceptions.html#IndexError",
    difficulty: "beginner",
  },
  {
    code: "KeyError-missing-key",
    title: "KeyError",
    category: "key",
    pattern: /KeyError: (.+)/,
    explanation:
      "You tried to access a dictionary key that doesn't exist.",
    fixes: [
      "Use `.get(key, default)` to safely access keys.",
      "Check if the key exists first: `if key in my_dict:`.",
      "Use `collections.defaultdict` for automatic defaults.",
      "Verify the key spelling and type (e.g., string vs int).",
    ],
    example: {
      bad: `data = {"name": "Alice"}\nprint(data["age"])`,
      good: `data = {"name": "Alice"}\nprint(data.get("age", "unknown"))`,
    },
    docUrl: "https://docs.python.org/3/library/exceptions.html#KeyError",
    difficulty: "beginner",
  },
  {
    code: "ValueError-invalid-literal",
    title: "Invalid literal for int()/float()",
    category: "value",
    pattern: /ValueError: invalid literal for (?:int|float)\(\) with base \d+: /,
    explanation:
      "You tried to convert a string to a number, but the string doesn't represent a valid number.",
    fixes: [
      "Validate the input before converting: `str.isdigit()` or `try/except`.",
      "Strip whitespace from the input: `value.strip()`.",
      "Handle non-numeric characters: remove commas, currency symbols, etc.",
    ],
    example: {
      bad: `number = int("12.5")`,
      good: `number = int(float("12.5"))`,
    },
    docUrl: "https://docs.python.org/3/library/exceptions.html#ValueError",
    difficulty: "beginner",
  },
  {
    code: "ValueError-too-many-values",
    title: "Too many values to unpack",
    category: "value",
    pattern: /ValueError: (?:too many|not enough) values to unpack/,
    explanation:
      "The number of variables on the left side of an assignment doesn't match the number of values on the right.",
    fixes: [
      "Match the number of variables to the number of values.",
      "Use a starred expression to collect extras: `a, *rest = values`.",
      "Check the data source — it may have unexpected extra or missing items.",
    ],
    example: {
      bad: `a, b = [1, 2, 3]`,
      good: `a, b, c = [1, 2, 3]`,
    },
    docUrl: "https://docs.python.org/3/library/exceptions.html#ValueError",
    difficulty: "beginner",
  },
  {
    code: "FileNotFoundError-no-such-file",
    title: "No such file or directory",
    category: "io",
    pattern: /FileNotFoundError: \[Errno 2\] No such file or directory/,
    explanation:
      "The specified file or directory does not exist at the given path.",
    fixes: [
      "Verify the file path is correct (check for typos).",
      "Use `os.path.exists()` or `Path.exists()` before accessing.",
      "Use absolute paths or verify the current working directory with `os.getcwd()`.",
      "Create the file or directory first if it's expected to be new.",
    ],
    example: {
      bad: `with open("data.txt") as f:\n    content = f.read()`,
      good: `from pathlib import Path\nif Path("data.txt").exists():\n    with open("data.txt") as f:\n        content = f.read()`,
    },
    docUrl: "https://docs.python.org/3/library/exceptions.html#FileNotFoundError",
    difficulty: "beginner",
  },
  {
    code: "ZeroDivisionError-division-by-zero",
    title: "Division by zero",
    category: "runtime",
    pattern: /ZeroDivisionError: (?:division by zero|integer division or modulo by zero|float division by zero)/,
    explanation: "You tried to divide a number by zero.",
    fixes: [
      "Check the divisor before dividing: `if divisor != 0:`.",
      "Provide a default value when the divisor is zero.",
      "Use `try/except ZeroDivisionError` for safe division.",
    ],
    example: {
      bad: `result = 10 / 0`,
      good: `divisor = 0\nresult = 10 / divisor if divisor != 0 else 0`,
    },
    docUrl:
      "https://docs.python.org/3/library/exceptions.html#ZeroDivisionError",
    difficulty: "beginner",
  },
  {
    code: "RecursionError-max-depth",
    title: "Maximum recursion depth exceeded",
    category: "runtime",
    pattern: /RecursionError: maximum recursion depth exceeded/,
    explanation:
      "A function called itself too many times without reaching a base case, exceeding Python's recursion limit (default 1000).",
    fixes: [
      "Add or fix the base case in your recursive function.",
      "Convert the recursion to an iterative approach using a loop or stack.",
      "Increase the limit with `sys.setrecursionlimit()` only if truly needed.",
      "Use `@functools.lru_cache` for memoization to avoid redundant calls.",
    ],
    example: {
      bad: `def factorial(n):\n    return n * factorial(n - 1)`,
      good: `def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)`,
    },
    docUrl:
      "https://docs.python.org/3/library/exceptions.html#RecursionError",
    difficulty: "intermediate",
  },
  {
    code: "IndentationError-expected-block",
    title: "Expected an indented block",
    category: "syntax",
    pattern: /IndentationError: expected an indented block/,
    explanation:
      "Python expected an indented block of code after a colon (e.g., after `if`, `for`, `def`, `class`), but found none.",
    fixes: [
      "Add the indented code block after the statement.",
      "Use `pass` as a placeholder for empty blocks.",
      "Ensure the block isn't accidentally commented out.",
    ],
    example: {
      bad: `def my_function():\n\nprint("hello")`,
      good: `def my_function():\n    print("hello")`,
    },
    docUrl:
      "https://docs.python.org/3/library/exceptions.html#IndentationError",
    difficulty: "beginner",
  },
  {
    code: "UnboundLocalError-referenced-before-assignment",
    title: "Local variable referenced before assignment",
    category: "name",
    pattern: /UnboundLocalError: (?:local variable|cannot access local variable) '(\w+)' referenced before assignment/,
    explanation:
      "A variable was read inside a function before being assigned, usually because the function has a later assignment that shadows a global variable.",
    fixes: [
      "Use `global` or `nonlocal` keyword if you intend to modify an outer variable.",
      "Initialize the variable before the conditional or loop that sets it.",
      "Rename the local variable to avoid shadowing.",
    ],
    example: {
      bad: `x = 10\ndef foo():\n    print(x)\n    x = 20`,
      good: `x = 10\ndef foo():\n    global x\n    print(x)\n    x = 20`,
    },
    docUrl:
      "https://docs.python.org/3/library/exceptions.html#UnboundLocalError",
    difficulty: "intermediate",
  },
  {
    code: "StopIteration-misuse",
    title: "StopIteration raised unexpectedly",
    category: "runtime",
    pattern: /StopIteration/,
    explanation:
      "A `next()` call on an exhausted iterator raised StopIteration. In generators, this can propagate unexpectedly.",
    fixes: [
      "Provide a default value: `next(iterator, default_value)`.",
      "Use a `for` loop instead of manually calling `next()`.",
      "Catch `StopIteration` explicitly if manual iteration is needed.",
    ],
    example: {
      bad: `it = iter([])\nvalue = next(it)`,
      good: `it = iter([])\nvalue = next(it, None)`,
    },
    docUrl:
      "https://docs.python.org/3/library/exceptions.html#StopIteration",
    difficulty: "intermediate",
  },
  {
    code: "PermissionError-access-denied",
    title: "Permission denied",
    category: "io",
    pattern: /PermissionError: \[Errno 13\] Permission denied/,
    explanation:
      "The program doesn't have permission to access the file or resource.",
    fixes: [
      "Check file permissions with `ls -la` or `os.access()`.",
      "Run the script with appropriate permissions.",
      "Ensure the file isn't locked by another process.",
      "Use a different output location where you have write access.",
    ],
    example: {
      bad: `with open("/etc/passwd", "w") as f:\n    f.write("data")`,
      good: `with open("output.txt", "w") as f:\n    f.write("data")`,
    },
    docUrl:
      "https://docs.python.org/3/library/exceptions.html#PermissionError",
    difficulty: "intermediate",
  },
  {
    code: "UnicodeDecodeError-codec",
    title: "UnicodeDecodeError",
    category: "misc",
    pattern: /UnicodeDecodeError: '(\w+)' codec can't decode/,
    explanation:
      "A file or byte string couldn't be decoded with the specified encoding. The data likely uses a different encoding than expected.",
    fixes: [
      "Specify the correct encoding: `open(file, encoding='utf-8')`.",
      "Use `errors='replace'` or `errors='ignore'` to handle bad bytes.",
      "Detect encoding with the `chardet` library.",
      "Read in binary mode (`'rb'`) and decode manually.",
    ],
    example: {
      bad: `with open("data.bin") as f:\n    text = f.read()`,
      good: `with open("data.bin", encoding="utf-8", errors="replace") as f:\n    text = f.read()`,
    },
    docUrl:
      "https://docs.python.org/3/library/exceptions.html#UnicodeDecodeError",
    difficulty: "intermediate",
  },
  {
    code: "JSONDecodeError-invalid-json",
    title: "JSONDecodeError",
    category: "misc",
    pattern: /json\.decoder\.JSONDecodeError: |JSONDecodeError: Expecting/,
    explanation:
      "The input string is not valid JSON. This often happens with trailing commas, single quotes, or empty responses.",
    fixes: [
      "Validate your JSON with a linter or `json.tool` module.",
      "Check for trailing commas, single quotes, or comments (not valid JSON).",
      "Handle empty or non-JSON responses gracefully.",
      "Use `try/except json.JSONDecodeError` for safe parsing.",
    ],
    example: {
      bad: `import json\njson.loads("{'key': 'value'}")`,
      good: `import json\njson.loads('{"key": "value"}')`,
    },
    docUrl: "https://docs.python.org/3/library/json.html#json.JSONDecodeError",
    difficulty: "beginner",
  },
  {
    code: "ConnectionError-connection-failed",
    title: "ConnectionError",
    category: "misc",
    pattern: /ConnectionError:|ConnectionRefusedError:|ConnectionResetError:/,
    explanation:
      "A network connection failed, was refused, or was reset. The target server may be down or unreachable.",
    fixes: [
      "Check your network connection and the server URL.",
      "Add retry logic with exponential backoff.",
      "Use a `try/except` block to handle connection failures gracefully.",
      "Verify firewall rules and proxy settings.",
    ],
    example: {
      bad: `import requests\nresponse = requests.get("http://localhost:9999")`,
      good: `import requests\ntry:\n    response = requests.get("http://localhost:9999", timeout=5)\nexcept requests.ConnectionError:\n    print("Server unavailable")`,
    },
    docUrl:
      "https://docs.python.org/3/library/exceptions.html#ConnectionError",
    difficulty: "intermediate",
  },
  {
    code: "OverflowError-result-too-large",
    title: "OverflowError",
    category: "runtime",
    pattern: /OverflowError: (?:math range error|int too large to convert to float|result too large)/,
    explanation:
      "A numeric operation produced a result too large to be represented. This often happens with float operations or math functions.",
    fixes: [
      "Use Python's arbitrary-precision integers instead of floats where possible.",
      "Use the `decimal` module for high-precision arithmetic.",
      "Add bounds checking before operations that might overflow.",
      "Use `math.inf` to represent infinity when appropriate.",
    ],
    example: {
      bad: `import math\nresult = math.exp(1000)`,
      good: `from decimal import Decimal\nresult = Decimal("2.718") ** 1000`,
    },
    docUrl:
      "https://docs.python.org/3/library/exceptions.html#OverflowError",
    difficulty: "advanced",
  },
];

export function findByCode(code: string): PythonError | undefined {
  return PYTHON_ERRORS.find((e) => e.code === code);
}

export function findByPattern(text: string): PythonError | undefined {
  return PYTHON_ERRORS.find((e) => e.pattern.test(text));
}

export function findByCategory(category: ErrorCategory): PythonError[] {
  return PYTHON_ERRORS.filter((e) => e.category === category);
}

export function listCategories(): ErrorCategory[] {
  const categories = new Set(PYTHON_ERRORS.map((e) => e.category));
  return Array.from(categories).sort() as ErrorCategory[];
}
