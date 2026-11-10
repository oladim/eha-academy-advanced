/* eslint-disable no-template-curly-in-string */ // these strings intentionally show template-literal code
import React, { useState } from "react";
import Code, { C } from "../components/Code.jsx";
import { Note, Panel, Tabs } from "../components/Bits.jsx";
import TryIt from "../components/TryIt.jsx";
import Quiz from "../components/Quiz.jsx";

const STYLES = {
  "Function declaration": "function greet(name) {\n  return `Hello, ${name}`;\n}",
  "Arrow function": "const greet = (name) => `Hello, ${name}`;",
};

function Machine() {
  const [style, setStyle] = useState("Function declaration");
  const [input, setInput] = useState("Ada");
  const [phase, setPhase] = useState("idle"); // idle | running | done
  const [output, setOutput] = useState(null);
  const [calls, setCalls] = useState(0);

  function call() {
    setPhase("running");
    setOutput(null);
    setTimeout(() => {
      setOutput(`Hello, ${input}`);
      setPhase("done");
      setCalls((c) => c + 1);
    }, 700);
  }

  return (
    <Panel title="Demo: the function machine" sub="A function takes something in, does a job, and hands something back. Both styles below do exactly the same job.">
      <Tabs tabs={Object.keys(STYLES)} value={style} onChange={setStyle} />
      <Code>{STYLES[style]}</Code>

      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 14, alignItems: "center", marginTop: 18 }}>
        <div>
          <label className="box-label" htmlFor="fn-in">Argument (input)</label>
          <input id="fn-in" value={input} onChange={(e) => setInput(e.target.value)} className="mono"
            style={{ width: "100%", padding: "8px 10px", border: "2px solid var(--line)", borderRadius: 6, font: "inherit", fontFamily: "var(--font-mono)" }} />
        </div>
        <div style={{
          border: "2px solid var(--line)", borderRadius: 10, padding: "16px 20px", background: phase === "running" ? "var(--accent)" : "var(--blue-soft)",
          textAlign: "center", transition: "background .2s", minWidth: 130,
        }}>
          <div style={{ fontSize: 28 }} className={phase === "running" ? "spin" : undefined}>⚙️</div>
          <div className="mono" style={{ fontWeight: 600 }}>greet( )</div>
        </div>
        <div>
          <div className="box-label">Return value (output)</div>
          <div className="mono" style={{ padding: "8px 10px", border: "2px dashed var(--line)", borderRadius: 6, minHeight: 42, background: output ? "var(--green-soft)" : "#fff" }}>
            {output ? <span className="pop">"{output}"</span> : <span className="muted">{phase === "running" ? "working…" : "…"}</span>}
          </div>
        </div>
      </div>
      <style>{`.spin{display:inline-block;animation:spin .7s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div className="row" style={{ marginTop: 16 }}>
        <button className="btn primary" onClick={call} disabled={phase === "running"}>
          Call greet("{input}")
        </button>
        <span className="small muted">Called {calls} time{calls === 1 ? "" : "s"}. Write once, use as often as you like.</span>
      </div>
    </Panel>
  );
}

function Variants() {
  const rows = [
    { title: "No parameters, no return", code: 'function sayHi() {\n  console.log("Hi!");\n}\nsayHi();', out: 'Prints "Hi!". Returns undefined.' },
    { title: "Parameters, no return", code: "function showSum(a, b) {\n  console.log(a + b);\n}\nshowSum(2, 3);", out: "Prints 5. Returns undefined." },
    { title: "Parameters and a return value", code: "function add(a, b) {\n  return a + b;\n}\nlet total = add(2, 3);", out: "Prints nothing. total is now 5." },
  ];
  return (
    <div className="grid-3">
      {rows.map((r) => (
        <div key={r.title}>
          <strong style={{ fontFamily: "var(--font-display)" }}>{r.title}</strong>
          <Code>{r.code}</Code>
          <div className="small">{r.out}</div>
        </div>
      ))}
    </div>
  );
}

export default function Functions({ markDone }) {
  return (
    <>
      <h1>Functions</h1>
      <p className="lead">
        A function is a named block of code you can reuse. Like a recipe: write the steps once, then cook it whenever you want,
        with different ingredients each time.
      </p>

      <Machine />

      <h2>Words you need</h2>
      <table className="table">
        <tbody>
          <tr><th>Parameter</th><td>The placeholder name in the definition: <C>name</C> in <C>function greet(name)</C>.</td></tr>
          <tr><th>Argument</th><td>The real value you pass when calling: <C>"Ada"</C> in <C>greet("Ada")</C>.</td></tr>
          <tr><th>Calling</th><td>Running the function by writing its name followed by brackets: <C>greet()</C>.</td></tr>
          <tr><th>Return value</th><td>What the function hands back with <C>return</C>. Without return, you get <C>undefined</C>.</td></tr>
        </tbody>
      </table>

      <h2>With or without parameters and return values</h2>
      <p>The slide says functions can have parameters or not, and a return value or not. Here are the combinations:</p>
      <Variants />

      <h2>Two ways to write a function</h2>
      <p>
        A <strong>function declaration</strong> starts with the word <C>function</C>. An <strong>arrow function</strong> is a shorter
        <em> function expression</em>: a function stored in a variable, written with <C>{"=>"}</C>.
      </p>
      <div className="grid-2">
        <Code label="Function declaration">{STYLES["Function declaration"]}</Code>
        <Code label="Arrow function">{STYLES["Arrow function"]}</Code>
      </div>
      <Note title="What are the backticks and ${ }?">
        <p>
          Text in backticks <C>`...`</C> is a <strong>template literal</strong>. Anything inside <C>{"${ }"}</C> is worked out and dropped
          into the text. <C>{"`Hello, ${name}`"}</C> is a neater way of writing <C>"Hello, " + name</C>.
        </p>
      </Note>
      <Note kind="precise">
        <p>
          An arrow function written on one line without <C>{"{ }"}</C> returns its value automatically. If you add braces you must write
          <C>return</C> yourself: <C>{"const greet = (name) => { return `Hello, ${name}`; };"}</C>
        </p>
      </Note>

      <TryIt
        title="Try it: write and call functions"
        hint="Add a function called square(n) that returns n * n, then log square(4)."
        code={`function greet(name) {
  return \`Hello, \${name}\`;
}

const greetArrow = (name) => \`Hello, \${name}\`;

console.log(greet("Ada"));
console.log(greetArrow("Chima"));

function add(a, b) {
  return a + b;
}
console.log(add(2, 3));
`}
      />

      <Quiz
        onPass={markDone}
        questions={[
          { q: <>In <C>greet("Ada")</C>, what is <C>"Ada"</C>?</>, options: ["A parameter", "An argument", "A return value"], answer: 1, explain: "The value you pass in when calling is the argument." },
          { q: "What does a function return if it has no return statement?", options: ["0", "null", "undefined"], answer: 2, explain: "Without return, a function gives back undefined." },
          { q: <>Which is an arrow function?</>, options: ["function add(a, b) { }", "const add = (a, b) => a + b;", "add => function"], answer: 1, explain: "Arrow functions use => and are usually stored in a variable." },
        ]}
      />
    </>
  );
}
