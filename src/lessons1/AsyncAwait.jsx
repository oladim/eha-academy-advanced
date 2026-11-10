import React, { useEffect, useRef, useState } from "react";
import Code, { C } from "../components/Code.jsx";
import { Note, Panel } from "../components/Bits.jsx";
import TryIt from "../components/TryIt.jsx";
import Quiz from "../components/Quiz.jsx";

const CODE = `async function loadData() {
  const res = await fetch("api/data");
  const data = await res.json();
  console.log(data);
}

loadData();
console.log("Meanwhile, the page stays responsive");`;

const DATA = '{ id: 1, course: "JavaScript Fundamentals", students: 24 }';

// line = active line (0-based), dot = where the request is: null | "out" | "back" | "read"
const STEPS = [
  { line: 6, dot: null, out: [], note: "loadData() is called. Because it's async, it will hand back a promise." },
  { line: 1, dot: "out", out: [], note: "await fetch(...) sends a request to the server and PAUSES loadData until the response arrives." },
  { line: 7, dot: "out", out: ["Meanwhile, the page stays responsive"], note: "While loadData is paused, the rest of the program carries on. await only pauses the async function, not the whole page." },
  { line: 1, dot: "back", out: ["Meanwhile, the page stays responsive"], note: "The response comes back. fetch's promise is fulfilled, so res now holds the response." },
  { line: 2, dot: "read", out: ["Meanwhile, the page stays responsive"], note: "await res.json() pauses again while the body of the response is read and turned into a JavaScript object." },
  { line: 3, dot: null, out: ["Meanwhile, the page stays responsive", DATA], note: "Now data is a normal object and we can use it. The code reads top to bottom, like ordinary code." },
];

function Packet({ dot }) {
  const left = dot === "out" ? "calc(100% - 46px)" : dot === "back" || dot === "read" ? "4px" : "4px";
  return (
    <div style={{ position: "relative", height: 46, margin: "4px 0" }}>
      <div style={{ position: "absolute", top: 21, left: 0, right: 0, borderTop: "2px dashed var(--soft-line)" }} />
      {dot && (
        <div style={{
          position: "absolute", top: 6, left, width: 40, height: 32, borderRadius: 6, border: "2px solid var(--line)",
          background: dot === "out" ? "var(--accent)" : "var(--green-soft)", display: "grid", placeItems: "center",
          transition: "left 1s ease-in-out", fontSize: 16,
        }}>{dot === "out" ? "📨" : "📦"}</div>
      )}
    </div>
  );
}

function Stepper() {
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(false);
  const t = useRef(null);

  useEffect(() => {
    if (!auto) return;
    if (i >= STEPS.length - 1) { setAuto(false); return; }
    t.current = setTimeout(() => setI((x) => x + 1), 1500);
    return () => clearTimeout(t.current);
  }, [auto, i]);

  const s = STEPS[i];
  const paused = s.dot === "out" || s.dot === "read";
  return (
    <Panel title="Demo: the slide's loadData(), step by step" sub="Use Next to go one step at a time, or Play to watch it run.">
      <div className="grid-2" style={{ alignItems: "start" }}>
        <div>
          <Code activeLine={s.line}>{CODE}</Code>
          <div className="row">
            <button className="btn small" disabled={i === 0} onClick={() => { setAuto(false); setI(i - 1); }}>← Back</button>
            <button className="btn small primary" disabled={i === STEPS.length - 1} onClick={() => { setAuto(false); setI(i + 1); }}>Next step →</button>
            <button className="btn small" onClick={() => { setI(0); setAuto(true); }}>▶ Play</button>
          </div>
        </div>
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 8, alignItems: "center" }}>
            <div className="box center small" style={{ padding: 8 }}>🖥️<br />Browser</div>
            <Packet dot={s.dot === "read" ? null : s.dot} />
            <div className="box center small" style={{ padding: 8 }}>🗄️<br />Server</div>
          </div>
          <div className="row small" style={{ margin: "10px 0" }}>
            loadData is
            <span className="chip" style={{ background: i === STEPS.length - 1 ? "var(--green-soft)" : paused ? "var(--accent)" : "#fff" }}>
              {i === STEPS.length - 1 ? "finished" : paused ? "⏸ paused at await" : "running"}
            </span>
          </div>
          <div className="console" style={{ border: "2px solid var(--line)", borderRadius: 6 }}>
            <div className="cap">Console</div>
            {s.out.length === 0 && <div className="empty">(nothing yet)</div>}
            {s.out.map((o, k) => <div key={k} className="ln pop">› {o}</div>)}
          </div>
          <div className="box pop" key={i} style={{ marginTop: 12 }}>
            <div className="box-label">Step {i + 1} of {STEPS.length}</div>
            {s.note}
          </div>
        </div>
      </div>
    </Panel>
  );
}

export default function AsyncAwait({ markDone }) {
  return (
    <>
      <h1>Async / await</h1>
      <p className="lead">
        <C>async</C> and <C>await</C> let you write code that waits for slow things, like loading data, in a way that reads top to
        bottom like normal code. No <C>.then()</C> chains needed.
      </p>

      <h2>The two keywords</h2>
      <div className="grid-2">
        <div className="box">
          <div className="box-label">async</div>
          <strong style={{ fontFamily: "var(--font-display)" }}>Put it before a function</strong>
          <p className="small" style={{ marginBottom: 0 }}>It marks the function as asynchronous. An async function always returns a promise, automatically.</p>
        </div>
        <div className="box">
          <div className="box-label">await</div>
          <strong style={{ fontFamily: "var(--font-display)" }}>Put it before a promise</strong>
          <p className="small" style={{ marginBottom: 0 }}>It pauses the async function until the promise is fulfilled (and gives you the value) or rejected (and throws the error).</p>
        </div>
      </div>

      <Stepper />

      <h2>Same job, two styles</h2>
      <p>Both versions below do exactly the same thing. Async/await is just easier to read.</p>
      <div className="grid-2">
        <Code label="With .then()">{`function loadData() {
  fetch("api/data")
    .then((res) => res.json())
    .then((data) => console.log(data));
}`}</Code>
        <Code label="With async / await">{`async function loadData() {
  const res = await fetch("api/data");
  const data = await res.json();
  console.log(data);
}`}</Code>
      </div>

      <Note kind="precise">
        <p>
          The slide presents async/await as an alternative to promises. More exactly, it's built <em>on top of</em> promises:
          <C>await</C> only works with promises, and every async function returns one. Think of it as a nicer way to use promises, not a replacement.
        </p>
      </Note>

      <h2>Handling errors with try / catch</h2>
      <p>With <C>.then()</C> you'd use <C>.catch()</C>. With await, wrap the code in <C>try</C>, and handle problems in <C>catch</C>:</p>
      <Code>{`async function loadData() {
  try {
    const res = await fetch("api/data");
    const data = await res.json();
    console.log(data);
  } catch (error) {
    console.error("Could not load data:", error.message);
  }
}`}</Code>

      <TryIt
        title="Try it: async / await"
        hint={<>This box gives you <C>fakeFetch(url)</C>, a pretend fetch that answers after 0.8s. Run it, then change the URL to "api/fail" to see the catch block work.</>}
        code={`async function loadData() {
  try {
    console.log("Loading…");
    const res = await fakeFetch("api/data");
    const data = await res.json();
    console.log(data);
    console.log("Course:", data.course);
  } catch (error) {
    console.error("Could not load data:", error.message);
  }
}

loadData();
console.log("This prints while we wait");`}
      />

      <Note kind="tip" title="Want a real network request?">
        <p>
          With internet access, replace <C>fakeFetch</C> with the real <C>fetch</C> and use a free practice API, for example
          <C>https://jsonplaceholder.typicode.com/users/1</C>. The slide's <C>"api/data"</C> is a placeholder address, not a real one.
        </p>
      </Note>

      <Quiz
        onPass={markDone}
        questions={[
          { q: "What does an async function always return?", options: ["A string", "A promise", "Nothing"], answer: 1, explain: "Whatever you return gets wrapped in a promise automatically." },
          { q: <>What does <C>await</C> pause?</>, options: ["The whole browser", "Only the async function it's in", "All other JavaScript"], answer: 1, explain: "Other code keeps running while that one function waits." },
          { q: "How do you handle errors when using await?", options: ["try / catch", "if / else", "You can't"], answer: 0, explain: "A rejected promise throws at the await, so try/catch catches it." },
        ]}
      />
    </>
  );
}
