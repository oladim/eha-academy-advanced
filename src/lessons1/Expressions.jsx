import React, { useState } from "react";
import Code, { C } from "../components/Code.jsx";
import { Note, Panel, Tabs } from "../components/Bits.jsx";
import TryIt from "../components/TryIt.jsx";
import Quiz from "../components/Quiz.jsx";

/* ---------- Order of operations ---------- */
const EXPRS = {
  "10 + 5 * 3": [
    { show: ["10 + ", "5 * 3"], note: "Multiplication goes first, just like in maths (BODMAS / PEMDAS)." },
    { show: ["10 + ", "15"], note: "5 * 3 became 15. Now only the addition is left." },
    { show: ["", "25"], note: "The whole expression produces one value: 25." },
  ],
  "(10 + 5) * 3": [
    { show: ["", "(10 + 5)", " * 3"], note: "Brackets go first, always." },
    { show: ["", "15", " * 3"], note: "10 + 5 became 15." },
    { show: ["", "45"], note: "Same numbers, different order, different answer: 45." },
  ],
};

function Precedence() {
  const [expr, setExpr] = useState("10 + 5 * 3");
  const [i, setI] = useState(0);
  const steps = EXPRS[expr];
  const s = steps[i];
  return (
    <Panel title="Demo: how an expression is worked out" sub="From the slide: let result = 10 + 5 * 3; Step through it.">
      <Tabs tabs={Object.keys(EXPRS)} value={expr} onChange={(e) => { setExpr(e); setI(0); }} />
      <div className="mono pop" key={expr + i} style={{ fontSize: "clamp(26px, 5vw, 40px)", margin: "10px 0 14px" }}>
        <span className="muted" style={{ fontSize: "0.6em" }}>result = </span>
        {s.show.map((part, k) => (
          <span key={k} className={k === 1 ? "hl" : undefined} style={k === 1 ? { borderRadius: 4 } : undefined}>{part}</span>
        ))}
      </div>
      <div className="box" style={{ marginBottom: 12 }}>{s.note}</div>
      <div className="row">
        <button className="btn small" disabled={i === 0} onClick={() => setI(i - 1)}>← Back</button>
        <button className="btn small primary" disabled={i === steps.length - 1} onClick={() => setI(i + 1)}>Next step →</button>
      </div>
    </Panel>
  );
}

/* ---------- Assignment operators ---------- */
function AssignDemo() {
  const [x, setX] = useState(10);
  const [last, setLast] = useState("let x = 10;");
  const ops = [
    { label: "x += 5", f: (v) => v + 5 },
    { label: "x -= 3", f: (v) => v - 3 },
    { label: "x *= 2", f: (v) => v * 2 },
    { label: "x++", f: (v) => v + 1 },
    { label: "x--", f: (v) => v - 1 },
  ];
  return (
    <Panel title="Demo: assignment operators" sub="Shortcuts that update a variable using its current value.">
      <div className="grid-2" style={{ alignItems: "center" }}>
        <div>
          <div className="row">
            {ops.map((o) => (
              <button key={o.label} className="btn small mono" onClick={() => { setX(o.f(x)); setLast(o.label + ";"); }}>{o.label}</button>
            ))}
            <button className="btn small ghost" onClick={() => { setX(10); setLast("let x = 10;"); }}>Reset</button>
          </div>
          <p className="small muted">x += 5 is short for x = x + 5. x++ is short for x = x + 1.</p>
        </div>
        <div className="center">
          <div className="mono small muted">{last}</div>
          <div className="mono pop" key={x + last} style={{ fontSize: 52, fontWeight: 600 }}>x = {x}</div>
        </div>
      </div>
    </Panel>
  );
}

/* ---------- Comparison + logic ---------- */
function Light({ on, label }) {
  return (
    <div className="row" style={{ gap: 8 }}>
      <span style={{ width: 18, height: 18, borderRadius: "50%", border: "2px solid var(--line)", background: on ? "var(--green)" : "var(--red-soft)", transition: "background .2s" }} />
      <span className="mono">{label}</span>
      <span className={on ? "ok" : "bad"}>{String(on)}</span>
    </div>
  );
}

function LogicDemo() {
  const [x, setX] = useState(2);
  const [y, setY] = useState(1);
  const a = x === 2;
  const b = y === 3;
  return (
    <Panel title="Demo: comparison and logical operators" sub="From the slide: let allTrue = x == 2 && y == 3; Move the sliders.">
      <div className="grid-2">
        <div>
          <label className="mono" style={{ display: "block" }}>x = {x}
            <input type="range" min="0" max="5" value={x} onChange={(e) => setX(+e.target.value)} style={{ width: "100%" }} />
          </label>
          <label className="mono" style={{ display: "block", marginTop: 8 }}>y = {y}
            <input type="range" min="0" max="5" value={y} onChange={(e) => setY(+e.target.value)} style={{ width: "100%" }} />
          </label>
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          <Light on={a} label="x == 2" />
          <Light on={b} label="y == 3" />
          <hr style={{ border: 0, borderTop: "2px dashed var(--soft-line)", width: "100%", margin: "2px 0" }} />
          <Light on={a && b} label="x == 2 && y == 3" />
          <Light on={a || b} label="x == 2 || y == 3" />
          <Light on={x >= y} label="x >= y" />
        </div>
      </div>
      <p className="small muted" style={{ marginBottom: 0 }}><C>&&</C> (AND) is true only when <strong>both</strong> sides are true. <C>||</C> (OR) is true when <strong>at least one</strong> side is true.</p>
    </Panel>
  );
}

const OPS = {
  Assignment: [["=", "x = 5", "puts 5 in x"], ["+=", "x += 2", "x = x + 2"], ["*=", "x *= 3", "x = x * 3"]],
  Arithmetic: [["+  -", "7 + 2, 7 - 2", "9, 5"], ["*  /", "7 * 2, 7 / 2", "14, 3.5"], ["%", "7 % 2", "1 (the remainder)"], ["++", "x++", "add 1 to x"]],
  Comparison: [["==", '5 == "5"', "true (loose: converts types)"], ["===", '5 === "5"', "false (strict: types must match)"], [">=  <", "4 >= 4, 3 < 1", "true, false"], ["!=", "4 != 5", "true"]],
  Logical: [["&&", "true && false", "false (AND: both needed)"], ["||", "true || false", "true (OR: one is enough)"], ["!", "!true", "false (NOT: flips it)"]],
  String: [["+", '"Java" + "Script"', '"JavaScript"'], ["+", '"Age: " + 25', '"Age: 25"'], ["+=", 'msg += "!"', "adds ! to the end"]],
};

function OperatorTable() {
  const [tab, setTab] = useState("Arithmetic");
  return (
    <Panel title="The five operator families from the slide">
      <Tabs tabs={Object.keys(OPS)} value={tab} onChange={setTab} />
      <table className="table">
        <thead><tr><th>Operator</th><th>Example</th><th>Result</th></tr></thead>
        <tbody>
          {OPS[tab].map(([op, ex, res], i) => (
            <tr key={i}><td className="mono">{op}</td><td className="mono">{ex}</td><td>{res}</td></tr>
          ))}
        </tbody>
      </table>
    </Panel>
  );
}

export default function Expressions({ markDone }) {
  return (
    <>
      <h1>Expressions & operators</h1>
      <p className="lead">
        An expression is any piece of code that produces a value. <C>5</C> is an expression. So is <C>10 + 5 * 3</C>.
        Operators are the symbols (<C>+</C>, <C>==</C>, <C>&&</C>…) that combine values into new ones.
      </p>

      <Code>{`"Ada"              // produces "Ada"
10 + 5 * 3         // produces 25
age >= 18          // produces true or false
"Hi " + name       // produces a new string`}</Code>

      <Precedence />
      <OperatorTable />
      <AssignDemo />
      <LogicDemo />

      <Note kind="precise" title="More precisely: prefer === over ==">
        <p>
          The slide uses <C>==</C>. It works, but it quietly converts types first, so <C>0 == ""</C> is <C>true</C>, which surprises people.
          <C>===</C> (strict equality) checks the value <em>and</em> the type. Most teams use <C>===</C> and <C>!==</C> by default.
        </p>
      </Note>

      <Note kind="warn" title="Watch out: + with text">
        <p>If either side of <C>+</C> is a string, JavaScript joins instead of adding: <C>"5" + 3</C> gives <C>"53"</C>, not 8.</p>
      </Note>

      <TryIt
        title="Try it: predict, then run"
        hint="Before running, guess each answer. Then run and compare."
        code={`let result = 10 + 5 * 3;
console.log(result);

let x = 2, y = 3;
let allTrue = x == 2 && y == 3;
console.log(allTrue);

console.log(7 % 2);
console.log("5" + 3);
console.log(5 == "5", 5 === "5");`}
      />

      <Quiz
        onPass={markDone}
        questions={[
          { q: <>What is <C>2 + 3 * 4</C>?</>, options: ["20", "14", "24"], answer: 1, explain: "3 * 4 = 12 first, then 2 + 12 = 14." },
          { q: <>If <C>x = 2</C> and <C>y = 5</C>, what is <C>x == 2 && y == 3</C>?</>, options: ["true", "false"], answer: 1, explain: "&& needs both sides true; y == 3 is false." },
          { q: <>What is <C>"Hello " + "World"</C>?</>, options: ["An error", "\"Hello World\"", "NaN"], answer: 1, explain: "+ joins (concatenates) strings." },
        ]}
      />
    </>
  );
}
