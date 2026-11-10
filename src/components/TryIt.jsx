import React, { useCallback, useEffect, useRef, useState } from "react";

/* ---------- Pretty-printing values for the fake console ---------- */
function formatValue(v, depth = 0) {
  if (v === null) return "null";
  if (v === undefined) return "undefined";
  const t = typeof v;
  if (t === "string") return depth === 0 ? v : JSON.stringify(v);
  if (t === "number" || t === "boolean") return String(v);
  if (t === "bigint") return `${v}n`;
  if (t === "symbol") return v.toString();
  if (t === "function") return `ƒ ${v.name || "anonymous"}()`;
  if (v && v.nodeType === 1) {
    const html = v.outerHTML || "";
    return html.length > 90 ? html.slice(0, 90) + "…" : html;
  }
  if (v && typeof v.then === "function") return "Promise {…}";
  if (v instanceof Error || (v && v.name && v.message !== undefined && v.stack)) return `${v.name}: ${v.message}`;
  if (depth > 2) return Array.isArray(v) ? "[…]" : "{…}";
  if (Array.isArray(v)) return `[${v.map((x) => formatValue(x, depth + 1)).join(", ")}]`;
  if (v && v.length !== undefined && v.item) {
    // HTMLCollection / NodeList
    return `${v.constructor?.name || "Collection"}(${v.length}) [${Array.from(v).map((x) => formatValue(x, depth + 1)).join(", ")}]`;
  }
  try {
    const entries = Object.entries(v).map(([k, val]) => `${k}: ${formatValue(val, depth + 1)}`);
    return `{ ${entries.join(", ")} }`;
  } catch {
    return String(v);
  }
}

/* ---------- Helpers injected into every Try it box ---------- */
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const FAKE_DATA = {
  "api/data": { id: 1, course: "JavaScript Fundamentals", students: 24 },
  "api/user": { id: 7, name: "Ada", city: "Lagos" },
};

/** Pretends to be fetch(): waits ~0.8s, then answers. Any URL containing "fail" errors. */
function fakeFetch(url = "api/data") {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (String(url).includes("fail")) {
        reject(new Error(`Network error while loading "${url}"`));
        return;
      }
      const body = FAKE_DATA[url] ?? { url, message: "Hello from the fake server" };
      resolve({ ok: true, status: 200, json: async () => body });
    }, 800);
  });
}

/**
 * An editable code box with a Run button and a console.
 * If `html` is given, the code runs inside a real mini web page (an iframe),
 * so `document` refers to that page and changes are visible on the right.
 */
export default function TryIt({ code: initial, html, title = "Try it yourself", hint, height }) {
  const [code, setCode] = useState(initial.replace(/^\n/, ""));
  const [logs, setLogs] = useState([]);
  const [frameKey, setFrameKey] = useState(0);
  const runId = useRef(0);
  const pendingRun = useRef(false);
  const frameRef = useRef(null);

  const execute = useCallback(
    (win) => {
      const id = ++runId.current;
      setLogs([]);
      const push = (kind) => (...args) => {
        if (id !== runId.current) return; // ignore late logs from an old run
        setLogs((l) => [...l, { kind, text: args.map((a) => formatValue(a)).join(" ") }]);
      };
      const fakeConsole = { log: push("log"), info: push("log"), warn: push("warn"), error: push("err") };
      try {
        const fn = new win.Function(
          "console", "wait", "fakeFetch",
          `return (async () => {\n${code}\n})();`
        );
        fn(fakeConsole, wait, fakeFetch).catch((e) => push("err")(friendly(e)));
      } catch (e) {
        push("err")(friendly(e));
      }
    },
    [code]
  );

  function run() {
    if (html) {
      // reload the mini page so every run starts fresh, then execute on load
      pendingRun.current = true;
      setFrameKey((k) => k + 1);
    } else {
      execute(window);
    }
  }

  function onFrameLoad() {
    if (pendingRun.current && frameRef.current) {
      pendingRun.current = false;
      execute(frameRef.current.contentWindow);
    }
  }

  function reset() {
    runId.current++;
    setCode(initial.replace(/^\n/, ""));
    setLogs([]);
    setFrameKey((k) => k + 1);
  }

  function onKeyDown(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      run();
    } else if (e.key === "Tab" && !e.shiftKey) {
      e.preventDefault();
      const el = e.target;
      const s = el.selectionStart;
      const next = code.slice(0, s) + "  " + code.slice(el.selectionEnd);
      setCode(next);
      requestAnimationFrame(() => (el.selectionStart = el.selectionEnd = s + 2));
    }
  }

  useEffect(() => () => void runId.current++, []);

  const rows = Math.max(6, code.split("\n").length + 1);
  const srcDoc = html
    ? `<!doctype html><html><head><meta charset="utf-8"><title>My Page</title><style>
        body{font-family:system-ui,sans-serif;padding:14px;margin:0;color:#1b1f24}
        button{font:inherit;padding:6px 12px;cursor:pointer}
        .active{outline:3px solid #1e5eff}
        .hidden{display:none}
        .highlight{background:#0090fc}
      </style></head><body>${html}</body></html>`
    : null;

  return (
    <div className="tryit">
      <div className="tryit-head">
        <strong>{title}</strong>
        <div className="row">
          <span className="small muted" style={{ color: "#0b2a45" }}>Ctrl + Enter runs</span>
          <button className="btn small" onClick={reset}>Reset</button>
          <button className="btn small blue" onClick={run}>Run code</button>
        </div>
      </div>
      {hint && <div className="small" style={{ padding: "8px 14px", borderBottom: "2px solid var(--line)", background: "var(--paper-2)" }}>{hint}</div>}
      <div className={`tryit-body ${html ? "with-preview" : ""}`}>
        <textarea
          aria-label="Code editor"
          spellCheck={false}
          value={code}
          rows={rows}
          style={height ? { minHeight: height } : undefined}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={onKeyDown}
        />
        {html && (
          <div className="tryit-preview">
            <div className="cap">The web page your code controls</div>
            <iframe key={frameKey} ref={frameRef} title="Mini web page" srcDoc={srcDoc} onLoad={onFrameLoad} />
          </div>
        )}
      </div>
      <div className="console" aria-live="polite">
        <div className="cap">Console output</div>
        {logs.length === 0 && <div className="empty">Press “Run code” to see the result here.</div>}
        {logs.map((l, i) => (
          <div key={i} className={`ln ${l.kind}`}>{l.kind === "err" ? "✖ " : l.kind === "warn" ? "⚠ " : "› "}{l.text}</div>
        ))}
      </div>
    </div>
  );
}

function friendly(e) {
  if (!e) return "Error";
  if (typeof e === "string") return `Uncaught (rejected): ${e}`;
  return `${e.name || "Error"}: ${e.message}`;
}
