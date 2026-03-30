export interface PythonError {
  code: string;
  title: string;
  category: ErrorCategory;
  pattern: RegExp;
  explanation: string;
  fixes: string[];
  example: {
    bad: string;
    good: string;
  };
  docUrl: string;
  difficulty: "beginner" | "intermediate" | "advanced";
}

export type ErrorCategory =
  | "type"
  | "attribute"
  | "import"
  | "syntax"
  | "name"
  | "index"
  | "key"
  | "value"
  | "io"
  | "runtime"
  | "misc";

export interface ParsedError {
  errorType: string;
  message: string;
  file?: string;
  line?: number;
  fullTraceback?: string;
}

export interface FixResult {
  error: ParsedError;
  matchedEntry?: PythonError;
  suggestions: string[];
  explanation?: string;
  example?: {
    bad: string;
    good: string;
  };
  docUrl?: string;
}
