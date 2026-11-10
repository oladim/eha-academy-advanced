import React from "react";

const KEYWORDS = new Set([
  "let", "const", "var", "function", "return", "if", "else", "new", "true", "false",
  "null", "undefined", "async", "await", "typeof", "for", "while", "of", "in", "try",
  "catch", "throw", "class", "this", "document", "console", "window",
]);

// A tiny highlighter: good enough for teaching snippets, no dependency needed.
const TOKEN = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|(`(?:\\.|[^`])*`|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(<\/?[a-zA-Z][\w-]*|\/?>)|\b(\d+(?:\.\d+)?n?)\b|([A-Za-z_$][\w$]*)(?=\s*\()|([A-Za-z_$][\w$]*)/g;

export function highlight(src) {
  const out = [];
  let last = 0;
  let m;
  let i = 0;
  TOKEN.lastIndex = 0;
  while ((m = TOKEN.exec(src))) {
    if (m.index > last) out.push(src.slice(last, m.index));
    const [text, com, str, tag, num, fn, word] = m;
    let cls = null;
    if (com) cls = "tk-com";
    else if (str) cls = "tk-str";
    else if (tag) cls = "tk-tag";
    else if (num) cls = "tk-num";
    else if (fn) cls = KEYWORDS.has(fn) ? "tk-kw" : "tk-fn";
    else if (word && KEYWORDS.has(word)) cls = "tk-kw";
    out.push(cls ? <span key={i++} className={cls}>{text}</span> : text);
    last = m.index + text.length;
  }
  if (last < src.length) out.push(src.slice(last));
  return out;
}

/** Read-only, highlighted code. `activeLine` (0-based) highlights one line. */
export default function Code({ children, label, activeLine = -1 }) {
  const src = String(children).replace(/^\n/, "").replace(/\s+$/, "");
  if (activeLine < 0) {
    return (
      <pre className="code">
        {label && <span className="label">{label}</span>}
        <code>{highlight(src)}</code>
      </pre>
    );
  }
  const lines = src.split("\n");
  return (
    <pre className="code">
      {label && <span className="label">{label}</span>}
      <code>
        {lines.map((ln, idx) => (
          <span key={idx} className={`code-line${idx === activeLine ? " line-active" : ""}`}>
            {highlight(ln || " ")}
          </span>
        ))}
      </code>
    </pre>
  );
}

export function C({ children }) {
  return <code className="inline">{children}</code>;
}
