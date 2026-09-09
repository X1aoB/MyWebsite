export const JSON_INPUT_LIMIT = 1024 * 1024;
export const JSON_OUTPUT_LIMIT = 4 * 1024 * 1024;
export const JSON_DEPTH_LIMIT = 64;

export type JsonMode = "format" | "minify" | "validate";
export type JsonErrorCode = "empty" | "input-limit" | "depth-limit" | "output-limit" | "syntax";
export type JsonResult =
  | { ok: true; output: string | null; inputBytes: number; outputBytes: number }
  | { ok: false; code: JsonErrorCode; line?: number; column?: number };

const encoder = new TextEncoder();

/** Count structure without treating brackets inside strings as nesting. */
const withinDepthLimit = (source: string) => {
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (const character of source) {
    if (inString) {
      if (escaped) escaped = false;
      else if (character === "\\") escaped = true;
      else if (character === '"') inString = false;
    } else if (character === '"') inString = true;
    else if (character === "{" || character === "[") {
      if (++depth > JSON_DEPTH_LIMIT) return false;
    } else if (character === "}" || character === "]") depth -= 1;
  }
  return true;
};

/**
 * Validate with the native parser, then change whitespace between lexical tokens.
 * Never stringify the parsed value: that would round large integers, collapse
 * duplicate keys, and rewrite negative zero or exponent notation.
 */
export const processJson = (source: string, mode: JsonMode, indent: 2 | 4 = 2): JsonResult => {
  if (source.length > JSON_INPUT_LIMIT) return { ok: false, code: "input-limit" };
  const inputBytes = encoder.encode(source).byteLength;
  if (inputBytes > JSON_INPUT_LIMIT) return { ok: false, code: "input-limit" };
  if (!source.trim()) return { ok: false, code: "empty" };
  if (!withinDepthLimit(source)) return { ok: false, code: "depth-limit" };
  try {
    JSON.parse(source);
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    const position = message.match(/position (\d+)/)?.[1];
    const lineColumn = message.match(/line (\d+) column (\d+)/);
    if (lineColumn) return { ok: false, code: "syntax", line: Number(lineColumn[1]), column: Number(lineColumn[2]) };
    if (position) {
      const lines = source.slice(0, Number(position)).split("\n");
      return { ok: false, code: "syntax", line: lines.length, column: lines[lines.length - 1].length + 1 };
    }
    return { ok: false, code: "syntax" };
  }
  if (mode === "validate") return { ok: true, output: null, inputBytes, outputBytes: 0 };

  const tokens = source.match(/"(?:\\[\s\S]|[^"\\])*"|[{}\[\],:]|[^\s{}\[\],:]+/g) ?? [];
  const chunks: string[] = [];
  let outputLength = 0;
  let depth = 0;
  const line = () => `\n${" ".repeat(depth * indent)}`;
  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    let chunk = token;
    if (mode === "format") {
      if (token === "{" || token === "[") {
        depth += 1;
        if (tokens[index + 1] !== "}" && tokens[index + 1] !== "]") chunk += line();
      } else if (token === "}" || token === "]") {
        depth -= 1;
        if (tokens[index - 1] !== "{" && tokens[index - 1] !== "[") chunk = line() + token;
      } else if (token === ",") chunk += line();
      else if (token === ":") chunk += " ";
    }
    outputLength += chunk.length;
    if (outputLength > JSON_OUTPUT_LIMIT) return { ok: false, code: "output-limit" };
    chunks.push(chunk);
  }
  const output = chunks.join("");
  const outputBytes = encoder.encode(output).byteLength;
  if (outputBytes > JSON_OUTPUT_LIMIT) return { ok: false, code: "output-limit" };
  return { ok: true, output, inputBytes, outputBytes };
};
