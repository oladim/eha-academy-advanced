import React, { useState } from "react";
import Code, { C } from "../components/Code.jsx";
import { Note, Panel } from "../components/Bits.jsx";
import TryIt from "../components/TryIt.jsx";
import Quiz from "../components/Quiz.jsx";

/* ---------- The labelled-box lifecycle ---------- */
const STEPS = [
  { code: "let score;", value: undefined, exists: true, title: "Declaration", text: "A box labelled score is created. Nothing is in it yet, so its value is undefined." },
  { code: "score = 10;", value: 10, exists: true, title: "Initialization", text: "The first value goes into the box. The slide calls this “instantiation”; most JavaScript docs say initialization." },
  { code: "score = 15;", value: 15, exists: true, title: "Reassignment", text: "Using = again replaces the old value. The box is the same, the contents changed." },
];

function Box({ label, value, kind, shake, highlight }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div
        className={shake ? "shake" : highlight ? "pop" : undefined}
        style={{
          width: 120, height: 92, margin: "0 auto", border: "2px solid var(--line)", borderRadius: 6,
          background: kind === "const" ? "var(--blue-soft)" : kind === "var" ? "var(--paper-2)" : "var(--accent-soft)",
          display: "grid", placeItems: "center", position: "relative", boxShadow: "var(--shadow-pop)",
        }}
      >
        {kind === "const" && <span title="locked" style={{ position: "absolute", top: 4, right: 6, fontSize: 14 }}>🔒</span>}
        <span className="mono" style={{ fontSize: 20, fontWeight: 600 }}>
          {value === undefined ? <span className="muted">undefined</span> : typeof value === "string" ? `"${value}"` : String(value)}
        </span>
      </div>
      <div className="mono small" style={{ marginTop: 8 }}>
        {kind && <span className="muted">{kind} </span>}<strong>{label}</strong>
      </div>
    </div>
  );
}

function Lifecycle() {
  const [i, setI] = useState(0);
  const s = STEPS[i];
  return (
    <Panel title="Demo: the life of a variable" sub="A variable is a labelled box that holds a value. Step through the code.">
      <div className="grid-2" style={{ alignItems: "center" }}>
        <div>
          <Code activeLine={i}>{STEPS.map((x) => x.code).join("\n")}</Code>
          <div className="row">
            <button className="btn small" disabled={i === 0} onClick={() => setI(i - 1)}>← Back</button>
            <button className="btn small primary" disabled={i === STEPS.length - 1} onClick={() => setI(i + 1)}>Next step →</button>
          </div>
        </div>
        <div>
          <Box label="score" value={s.value} highlight key={i} />
          <div className="box" style={{ marginTop: 16 }}>
            <div className="box-label">Step {i + 1}: {s.title}</div>
            {s.text}
          </div>
        </div>
      </div>
    </Panel>
  );
}

/* ---------- var / let / const playground ---------- */
const START = { var: 25, let: "John", const: 3.14159 };
const NAMES = { var: "age", let: "name", const: "pi" };
const NEW = { var: 26, let: "Jane", const: 3 };

function Keywords() {
  const [vals, setVals] = useState(START);
  const [log, setLog] = useState([]);
  const [shake, setShake] = useState(null);

  function attempt(kind, action) {
    const name = NAMES[kind];
    let line, result, ok;
    if (action === "reassign") {
      line = `${name} = ${JSON.stringify(NEW[kind])};`;
      ok = kind !== "const";
      result = ok ? "OK, value replaced" : "TypeError: Assignment to constant variable.";
      if (ok) setVals((v) => ({ ...v, [kind]: NEW[kind] }));
    } else {
      line = `${kind} ${name} = ${JSON.stringify(START[kind])};  // again`;
      ok = kind === "var";
      result = ok ? "OK, var lets you declare the same name twice (this can hide bugs)" : `SyntaxError: Identifier '${name}' has already been declared`;
      if (ok) setVals((v) => ({ ...v, [kind]: START[kind] }));
    }
    if (!ok) {
      setShake(kind);
      setTimeout(() => setShake(null), 450);
    }
    setLog((l) => [{ line, result, ok, id: Date.now() }, ...l].slice(0, 5));
  }

  return (
    <Panel title="Demo: var, let and const" sub="These are the slide's three examples. Try to change each one.">
      <style>{`.shake{animation:shake .4s}@keyframes shake{25%{transform:translateX(-6px)}50%{transform:translateX(6px)}75%{transform:translateX(-4px)}}`}</style>
      <div className="grid-3">
        {["let", "const", "var"].map((k) => (
          <div key={k}>
            <Box label={NAMES[k]} value={vals[k]} kind={k} shake={shake === k} />
            <div className="row" style={{ justifyContent: "center", marginTop: 10 }}>
              <button className="btn small" onClick={() => attempt(k, "reassign")}>Reassign</button>
              <button className="btn small" onClick={() => attempt(k, "redeclare")}>Redeclare</button>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16 }}>
        {log.length === 0 && <p className="small muted">Results appear here.</p>}
        {log.map((r) => (
          <div key={r.id} className="small pop" style={{ padding: "6px 0", borderBottom: "1px dashed var(--soft-line)" }}>
            <span className="mono">{r.line}</span> → <span className={r.ok ? "ok" : "bad"}>{r.result}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 10 }}><button className="btn small ghost" onClick={() => { setVals(START); setLog([]); }}>Reset boxes</button></div>
    </Panel>
  );
}

/* ---------- Scope demo ---------- */
function Scope() {
  const [kw, setKw] = useState("let");
  const leaks = kw === "var";
  return (
    <Panel title="Demo: block scope" sub="“Scope” means where in the code a variable can be seen. Switch the keyword.">
      <div className="row" style={{ marginBottom: 12 }}>
        {["let", "const", "var"].map((k) => (
          <button key={k} className={`btn small ${kw === k ? "selected" : ""}`} onClick={() => setKw(k)}>{k}</button>
        ))}
      </div>
      <div className="grid-2" style={{ alignItems: "start" }}>
        <div style={{ border: "2px solid var(--line)", borderRadius: 6, padding: 12, background: leaks ? "var(--accent-soft)" : "#fff" }} className="mono small">
          <div className="muted">{"// outside the block"}</div>
          <div style={{ border: "2px dashed var(--blue)", borderRadius: 6, padding: 10, margin: "8px 0", background: "var(--blue-soft)" }}>
            if (true) {"{"}
            <div style={{ paddingLeft: 16 }}><strong>{kw}</strong> message = "hi";</div>
            {"}"}
          </div>
          console.log(message);
        </div>
        <div>
          <div className="box pop" key={kw}>
            <div className="box-label">Result</div>
            {leaks ? (
              <><span className="ok">› hi</span><p className="small" style={{ marginBottom: 0 }}><C>var</C> ignores the {"{ }"} block. It is <strong>function-scoped</strong>, so the variable leaks out (the whole yellow area can see it).</p></>
            ) : (
              <><span className="bad">ReferenceError: message is not defined</span><p className="small" style={{ marginBottom: 0 }}><C>{kw}</C> is <strong>block-scoped</strong>: it only exists inside the blue {"{ }"} block. Outside, it's invisible.</p></>
            )}
          </div>
        </div>
      </div>
    </Panel>
  );
}

export default function Variables({ markDone }) {
  return (
    <>
      <h1>Variables</h1>
      <p className="lead">
        A variable stores a piece of data so you can use it later. Think of it as a box with a name label on it.
      </p>

      <h2>Giving a variable a value</h2>
      <p>
        You put a value into a variable with the <strong>assignment operator</strong> <C>=</C>. Read <C>age = 25</C> as
        “age gets 25”, not “age equals 25”.
      </p>
      <Lifecycle />
      <Note kind="precise">
        <p>
          The slide says a declaration states a variable's “name and type”. In JavaScript you only give the <strong>name</strong>:
          there is no type in the declaration. The type belongs to the value, and it can change (<C>let x = 5; x = "five";</C> is allowed).
          You can also declare and initialize in one line: <C>let score = 10;</C>
        </p>
      </Note>

      <h2>Three keywords: var, let and const</h2>
      <table className="table">
        <thead><tr><th>Keyword</th><th>Scope</th><th>Reassign?</th><th>Redeclare?</th><th>When to use</th></tr></thead>
        <tbody>
          <tr><td className="mono">let</td><td>Block</td><td className="ok">Yes</td><td className="bad">No</td><td>Values that change (a score, a counter)</td></tr>
          <tr><td className="mono">const</td><td>Block</td><td className="bad">No</td><td className="bad">No</td><td>Your default: values that stay the same</td></tr>
          <tr><td className="mono">var</td><td>Function</td><td className="ok">Yes</td><td className="ok">Yes</td><td>Old code only; prefer let and const</td></tr>
        </tbody>
      </table>
      <Keywords />
      <Note kind="precise">
        <p>
          <C>const</C> stops you from <em>reassigning</em> the name. If a const holds an array or object, you can still change what's
          inside it: <C>const nums = [1, 2]; nums.push(3);</C> works. You'll see why in the data types lesson.
        </p>
      </Note>

      <h2>Scope: where a variable is visible</h2>
      <Scope />

      <TryIt
        title="Try it: your own variables"
        hint="Run it. Then uncomment the last line (remove //) and run again to see the const error."
        code={`let name = "John";
const pi = 3.14159;
var age = 25;

age = age + 1;          // let and var can change
name = "Jane";

console.log(name, age, pi);
// pi = 3;              // const cannot be reassigned`}
      />

      <Note kind="tip">
        <p>A simple rule for students: use <C>const</C> by default; switch to <C>let</C> only when the value must change; don't use <C>var</C> in new code.</p>
      </Note>

      <Quiz
        onPass={markDone}
        questions={[
          { q: <>What happens when you run <C>const pi = 3.14; pi = 3;</C>?</>, options: ["pi becomes 3", "TypeError: Assignment to constant variable", "Nothing"], answer: 1, explain: "A const can't be reassigned after it's created." },
          { q: <>A <C>let</C> variable created inside <C>{"if (...) { }"}</C> is visible…</>, options: ["Everywhere in the file", "Only inside that block", "Only in other files"], answer: 1, explain: "let and const are block-scoped." },
          { q: "Giving a variable its first value is called…", options: ["Initialization", "Deletion", "Compilation"], answer: 0, explain: "The slide's word is “instantiation”; the usual JavaScript term is initialization." },
        ]}
      />
    </>
  );
}
