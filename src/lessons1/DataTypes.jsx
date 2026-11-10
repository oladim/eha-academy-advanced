import React, { useState } from "react";
import Code, { C } from "../components/Code.jsx";
import { Note, Panel, Tabs } from "../components/Bits.jsx";
import TryIt from "../components/TryIt.jsx";
import Quiz from "../components/Quiz.jsx";

const TYPES = [
  { name: "String", group: "primitive", ex: '"Hello"', typeof: "string", desc: "Text. Always inside quotes: \"double\", 'single' or `backticks`." },
  { name: "Number", group: "primitive", ex: "42  or  3.14", typeof: "number", desc: "Any number, whole or decimal. JavaScript has one number type for both." },
  { name: "Boolean", group: "primitive", ex: "true  or  false", typeof: "boolean", desc: "A yes/no value. Used for decisions: let isActive = true;" },
  { name: "Null", group: "primitive", ex: "null", typeof: "object", desc: "“Empty on purpose.” You set it to say: there is deliberately no value here.", quirk: true },
  { name: "Undefined", group: "primitive", ex: "undefined", typeof: "undefined", desc: "“Not set yet.” A declared variable with no value is undefined." },
  { name: "Symbol", group: "primitive", ex: 'Symbol("id")', typeof: "symbol", desc: "A guaranteed-unique label. Rare for beginners; used inside libraries." },
  { name: "BigInt", group: "primitive", ex: "9007199254740993n", typeof: "bigint", desc: "Whole numbers too big for Number. Written with an n at the end." },
  { name: "Object", group: "reference", ex: '{ name: "Ada", age: 36 }', typeof: "object", desc: "A collection of named values (key: value pairs). Describes one “thing”." },
  { name: "Array", group: "reference", ex: "[1, 2, 3]", typeof: "object", desc: "An ordered list. The slide's example: let numbers = [1, 2, 3];" },
  { name: "Function", group: "reference", ex: "function greet() { }", typeof: "function", desc: "A reusable block of code. Yes, functions are values too!" },
];

function TypeExplorer() {
  const [sel, setSel] = useState(0);
  const t = TYPES[sel];
  return (
    <Panel title="Demo: meet every data type" sub="Click a type to see an example and what typeof says about it.">
      <div className="box-label" style={{ marginBottom: 6 }}>Primitive types (simple, single values)</div>
      <div className="row" style={{ marginBottom: 12 }}>
        {TYPES.map((x, i) => x.group === "primitive" && (
          <button key={x.name} className={`btn small ${sel === i ? "selected" : ""}`} onClick={() => setSel(i)}>{x.name}</button>
        ))}
      </div>
      <div className="box-label" style={{ marginBottom: 6 }}>Reference types (containers that can hold many values)</div>
      <div className="row" style={{ marginBottom: 16 }}>
        {TYPES.map((x, i) => x.group === "reference" && (
          <button key={x.name} className={`btn small ${sel === i ? "selected" : ""}`} style={sel === i ? undefined : { background: "var(--blue-soft)" }} onClick={() => setSel(i)}>{x.name}</button>
        ))}
      </div>
      <div className="grid-2 pop" key={sel}>
        <div className="box">
          <div className="box-label">{t.group} · example</div>
          <div className="mono" style={{ fontSize: 20, margin: "6px 0 10px" }}>{t.ex}</div>
          {t.desc}
        </div>
        <div className="box" style={{ background: "var(--code-bg)", color: "var(--code-ink)" }}>
          <div className="box-label" style={{ color: "#9aa3ad" }}>typeof check</div>
          <div className="mono" style={{ fontSize: 17, margin: "6px 0" }}>typeof {t.ex.split("  ")[0]}</div>
          <div className="mono" style={{ fontSize: 20, color: "#9fdc8b" }}>› "{t.typeof}"</div>
          {t.quirk && <p className="small" style={{ color: "#f7d36b", marginBottom: 0 }}>A famous bug from 1995: typeof null says "object" even though null is a primitive. It can't be fixed without breaking old websites.</p>}
          {t.name === "Array" && <p className="small" style={{ color: "#f7d36b", marginBottom: 0 }}>Arrays are a kind of object. To check for an array use Array.isArray(value).</p>}
        </div>
      </div>
    </Panel>
  );
}

/* ---------- Copy by value vs reference ---------- */
const VALUE_STEPS = [
  { line: 0, a: 5, b: null, note: "a holds the number 5 directly." },
  { line: 1, a: 5, b: 5, note: "b gets its own copy of 5. Two separate boxes." },
  { line: 2, a: 5, b: 10, note: "Changing b doesn't touch a. Primitives are copied by value." },
];
const REF_STEPS = [
  { line: 0, arr: [1, 2], b: false, note: "list1 doesn't hold the array itself, it holds an arrow pointing to it." },
  { line: 1, arr: [1, 2], b: true, note: "list2 = list1 copies the arrow, not the array. Both point at the same array." },
  { line: 2, arr: [1, 2, 3], b: true, note: "Pushing through list2 changes the one shared array, so list1 sees 3 too!" },
];

function CopyDemo() {
  const [tab, setTab] = useState("Primitive: copy by value");
  const [i, setI] = useState(0);
  const isValue = tab.startsWith("Primitive");
  const steps = isValue ? VALUE_STEPS : REF_STEPS;
  const s = steps[i];
  const code = isValue ? "let a = 5;\nlet b = a;\nb = 10;" : "let list1 = [1, 2];\nlet list2 = list1;\nlist2.push(3);";

  const varBox = (name, content, active) => (
    <div style={{ textAlign: "center", opacity: active ? 1 : 0.25, transition: "opacity .3s" }}>
      <div style={{ width: 96, height: 64, border: "2px solid var(--line)", borderRadius: 6, display: "grid", placeItems: "center", background: "var(--accent-soft)" }} className="mono">{content}</div>
      <div className="mono small" style={{ marginTop: 4 }}>{name}</div>
    </div>
  );

  return (
    <Panel title="Demo: primitive vs reference" sub="The biggest practical difference between the two groups is what happens when you copy them.">
      <Tabs tabs={["Primitive: copy by value", "Reference: copy by reference"]} value={tab} onChange={(t) => { setTab(t); setI(0); }} />
      <div className="grid-2" style={{ alignItems: "center" }}>
        <div>
          <Code activeLine={s.line}>{code}</Code>
          <div className="row">
            <button className="btn small" disabled={i === 0} onClick={() => setI(i - 1)}>← Back</button>
            <button className="btn small primary" disabled={i === steps.length - 1} onClick={() => setI(i + 1)}>Next step →</button>
          </div>
        </div>
        <div>
          {isValue ? (
            <div className="row" style={{ justifyContent: "center", gap: 30 }}>
              {varBox("a", s.a, true)}
              {varBox("b", s.b ?? "", s.b !== null)}
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 18, alignItems: "center" }}>
              <div style={{ display: "grid", gap: 14 }}>
                {varBox("list1", "→", true)}
                {varBox("list2", "→", s.b)}
              </div>
              <div style={{ border: "2px solid var(--line)", borderRadius: 6, padding: 12, background: "var(--blue-soft)", textAlign: "center" }}>
                <div className="box-label">the array in memory</div>
                <div className="mono pop" key={s.arr.length} style={{ fontSize: 22 }}>[{s.arr.join(", ")}]</div>
                <div className="small muted">{s.b ? "2 arrows point here" : "1 arrow points here"}</div>
              </div>
            </div>
          )}
          <div className="box" style={{ marginTop: 16 }}>{s.note}</div>
        </div>
      </div>
    </Panel>
  );
}

export default function DataTypes({ markDone }) {
  return (
    <>
      <h1>Data types</h1>
      <p className="lead">
        Every value in JavaScript has a type: is it text, a number, a yes/no? The type decides what you can do with the value.
        You can't do maths with a name, or make a number uppercase.
      </p>

      <h2>Two families of types</h2>
      <div className="grid-2">
        <div className="box" style={{ background: "var(--accent-soft)" }}>
          <strong style={{ fontFamily: "var(--font-display)", fontSize: 19 }}>Primitive types</strong>
          <p className="small" style={{ margin: "4px 0" }}>Simple, single values: String, Number, Boolean, Null, Undefined, Symbol, BigInt.</p>
          <code className="inline">let isActive = true;</code>
        </div>
        <div className="box" style={{ background: "var(--blue-soft)" }}>
          <strong style={{ fontFamily: "var(--font-display)", fontSize: 19 }}>Reference types</strong>
          <p className="small" style={{ margin: "4px 0" }}>Containers that can hold many values: Objects, Arrays, Functions.</p>
          <code className="inline">let numbers = [1, 2, 3];</code>
        </div>
      </div>

      <TypeExplorer />

      <Note title="null vs undefined, in one sentence">
        <p><C>undefined</C> means “nobody has given this a value yet”; <C>null</C> means “I deliberately set this to nothing”.</p>
      </Note>

      <h2>Why the two families matter</h2>
      <CopyDemo />
      <Note kind="precise">
        <p>
          Technically, arrays and functions are both special kinds of <strong>objects</strong>. That's why <C>typeof [1,2,3]</C> is
          <C>"object"</C>. Grouping them as “Objects, Arrays, Functions” like the slide does is a helpful way to learn them.
        </p>
      </Note>

      <TryIt
        title="Try it: ask JavaScript for the type"
        hint="Add your own values to the list and run again."
        code={`console.log(typeof "Hello");      // string
console.log(typeof 42);           // number
console.log(typeof true);         // boolean
console.log(typeof undefined);    // undefined
console.log(typeof null);         // object (the famous bug)
console.log(typeof [1, 2, 3]);    // object
console.log(Array.isArray([1, 2, 3])); // true
console.log(typeof function () {}); // function

let numbers = [1, 2, 3];
let person = { name: "Ada", city: "Lagos" };
console.log(numbers[0], person.name);`}
      />

      <Quiz
        onPass={markDone}
        questions={[
          { q: "Which of these is a reference type?", options: ["\"Lagos\"", "true", "[1, 2, 3]", "42"], answer: 2, explain: "Arrays are reference types; the others are primitives." },
          { q: <>After <C>let a = [1]; let b = a; b.push(2);</C> what is <C>a</C>?</>, options: ["[1]", "[1, 2]", "[2]"], answer: 1, explain: "a and b point to the same array, so the change shows through both." },
          { q: "A variable you declared but never gave a value is…", options: ["null", "undefined", "0"], answer: 1, explain: "undefined means no value has been set yet." },
        ]}
      />
    </>
  );
}
