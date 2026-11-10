import React, { useCallback, useEffect, useRef, useState } from "react";
import * as ReactAll from "react";
import { createRoot } from "react-dom/client";
import { compileJsx } from "./babel.js";

/* Pretty-print values for the fake console */
function fmt(v, depth = 0) {
  if (v === null) return "null";
  if (v === undefined) return "undefined";
  if (typeof v === "string") return depth ? JSON.stringify(v) : v;
  if (typeof v === "function") return `ƒ ${v.name || "anonymous"}()`;
  if (typeof v !== "object") return String(v);
  if (v instanceof Error) return `${v.name}: ${v.message}`;
  if (depth > 2) return Array.isArray(v) ? "[…]" : "{…}";
  if (Array.isArray(v)) return `[${v.map((x) => fmt(x, depth + 1)).join(", ")}]`;
  try {
    return `{ ${Object.entries(v).map(([k, x]) => `${k}: ${fmt(x, depth + 1)}`).join(", ")} }`;
  } catch {
    return String(v);
  }
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error) {
    this.props.onError?.(error);
  }
  render() {
    if (this.state.error) {
      return <div className="preview-error">Your component crashed: {this.state.error.message}</div>;
    }
    return this.props.children;
  }
}

/** Removes import/export lines (React and the hooks are provided automatically) and finds the root component. */
function prepare(code) {
  let root = null;
  const exp = code.match(/export\s+default\s+(?:function\s+)?([A-Z][\w$]*)/g);
  if (exp) root = exp[exp.length - 1].replace(/export\s+default\s+(?:function\s+)?/, "");
  const cleaned = code
    .replace(/^\s*import\s[^;\n]*;?\s*$/gm, "")
    .replace(/^\s*export\s+default\s+[A-Z][\w$]*\s*;?\s*$/gm, "")
    .replace(/export\s+default\s+function/g, "function")
    .replace(/^\s*export\s+/gm, "");
  if (!root) root = /function\s+App\b|const\s+App\b/.test(cleaned) ? "App" : null;
  return { cleaned, root };
}

const HOOK_NAMES = ["useState", "useEffect", "useContext", "createContext", "useRef", "useReducer", "useMemo", "useCallback", "Fragment"];

/**
 * An editable React code box. The code is compiled in the browser and the
 * component is rendered live on the right. The last `export default` (or App) is shown.
 */
export default function ReactTryIt({ code: initial, title = "Try it: live React", hint, height }) {
  const start = initial.replace(/^\n/, "");
  const [code, setCode] = useState(start);
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("loading");
  const host = useRef(null);
  const rootRef = useRef(null);
  const runId = useRef(0);

  const run = useCallback(async (src) => {
    const id = ++runId.current;
    setLogs([]);
    setError(null);
    const push = (kind) => (...args) => {
      if (id !== runId.current) return;
      setLogs((l) => [...l, { kind, text: args.map((a) => fmt(a)).join(" ") }].slice(-40));
    };
    const fakeConsole = { log: push("log"), info: push("log"), warn: push("warn"), error: push("err") };
    try {
      const { cleaned, root } = prepare(src);
      if (!root) throw new Error("Couldn't find a component to show. Add `export default App;` (or name a component App).");
      const js = await compileJsx(cleaned);
      if (id !== runId.current) return;
      // eslint-disable-next-line no-new-func
      const factory = new Function("React", ...HOOK_NAMES, "console", `${js}\nreturn ${root};`);
      const Comp = factory(ReactAll, ...HOOK_NAMES.map((h) => ReactAll[h]), fakeConsole);
      if (typeof Comp !== "function") throw new Error(`${root} is not a component.`);
      // A separate root (outside the app's StrictMode) so effects run once, like they will in class.
      if (!rootRef.current) rootRef.current = createRoot(host.current);
      rootRef.current.render(
        <ErrorBoundary key={id} onError={(e) => push("err")(`${e.name}: ${e.message}`)}>
          <Comp />
        </ErrorBoundary>
      );
      setStatus("ok");
    } catch (e) {
      if (id !== runId.current) return;
      setError(e.message.replace(/^unknown: /, ""));
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    run(start);
    return () => {
      // invalidate any in-flight run (intentionally reads the latest value)
      // eslint-disable-next-line react-hooks/exhaustive-deps
      runId.current++;
      const r = rootRef.current;
      rootRef.current = null;
      if (r) setTimeout(() => r.unmount(), 0);
    };
    // run once on mount with the starting code
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onKeyDown(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      run(code);
    } else if (e.key === "Tab" && !e.shiftKey) {
      e.preventDefault();
      const el = e.target;
      const s = el.selectionStart;
      setCode(code.slice(0, s) + "  " + code.slice(el.selectionEnd));
      requestAnimationFrame(() => (el.selectionStart = el.selectionEnd = s + 2));
    }
  }

  function reset() {
    setCode(start);
    run(start);
  }

  const rows = Math.max(8, code.split("\n").length + 1);

  return (
    <div className="tryit">
      <div className="tryit-head">
        <strong>{title}</strong>
        <div className="row">
          <span className="small" style={{ color: "#0b2a45" }}>Ctrl + Enter runs</span>
          <button className="btn small" onClick={reset}>Reset</button>
          <button className="btn small blue" onClick={() => run(code)}>Run code</button>
        </div>
      </div>
      {hint && <div className="small" style={{ padding: "8px 14px", borderBottom: "2px solid var(--line)", background: "var(--paper-2)" }}>{hint}</div>}
      <div className="tryit-body with-preview">
        <textarea
          aria-label="React code editor"
          spellCheck={false}
          value={code}
          rows={rows}
          style={height ? { minHeight: height } : undefined}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <div className="tryit-preview">
          <div className="cap">Live preview {status === "loading" && "· compiling…"}</div>
          {error && <div className="preview-error">{error}</div>}
          <div ref={host} className="preview-host" style={error ? { display: "none" } : undefined} />
        </div>
      </div>
      <div className="console" aria-live="polite">
        <div className="cap">Console output</div>
        {logs.length === 0 && <div className="empty">Messages from console.log appear here.</div>}
        {logs.map((l, i) => (
          <div key={i} className={`ln ${l.kind}`}>{l.kind === "err" ? "✖ " : l.kind === "warn" ? "⚠ " : "› "}{l.text}</div>
        ))}
      </div>
    </div>
  );
}
