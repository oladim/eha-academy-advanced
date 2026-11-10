/* eslint-disable no-template-curly-in-string */ // strings intentionally show template-literal code
import React, { useEffect, useRef, useState } from "react";
import Code from "../components/Code.jsx";
import { Note, Panel } from "../components/Bits.jsx";
import ReactTryIt from "../components/ReactTryIt.jsx";
import Quiz from "../components/Quiz.jsx";

const DEPS = {
  "[name]": { code: "useEffect(() => {\n  console.log(`Name changed to: ${name}`);\n}, [name]);", rule: "Runs after the first render, then again only when name changes." },
  "[]": { code: "useEffect(() => {\n  console.log('Component mounted');\n}, []);", rule: "Runs once, after the first render. Changing state later never runs it again." },
  "none": { code: "useEffect(() => {\n  console.log('Rendered!');\n});", rule: "No array at all: runs after every single render." },
};

function DepsExplorer() {
  const [dep, setDep] = useState("[name]");
  const [name, setName] = useState("Jane");
  const [count, setCount] = useState(0);
  const [log, setLog] = useState([]);
  const renders = useRef(0);
  const prev = useRef(null);

  // Simulate how React decides whether to run the effect after each render.
  useEffect(() => {
    renders.current += 1;
    const first = prev.current === null;
    const nameChanged = !first && prev.current.name !== name;
    let runs;
    if (dep === "none") runs = true;
    else if (dep === "[]") runs = first;
    else runs = first || nameChanged;
    const line = runs
      ? dep === "[name]" ? `Name changed to: ${name}` : dep === "[]" ? "Component mounted" : "Rendered!"
      : null;
    setLog((l) => [{ id: renders.current, render: renders.current, runs, line }, ...l].slice(0, 7));
    prev.current = { name, count };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, count, dep]);

  function pick(d) {
    prev.current = null;
    renders.current = 0;
    setLog([]);
    setName("Jane");
    setCount(0);
    setDep(d);
  }

  return (
    <Panel title="Demo: when does the effect run?" sub="Choose a dependency array, then change the name or an unrelated counter. Watch which renders run the effect.">
      <div className="row" style={{ marginBottom: 12 }}>
        <span className="small">Dependency array:</span>
        {Object.keys(DEPS).map((d) => <button key={d} className={`btn small mono ${dep === d ? "selected" : ""}`} onClick={() => pick(d)}>{d}</button>)}
      </div>
      <div className="grid-2" style={{ alignItems: "start" }}>
        <div>
          <Code>{DEPS[dep].code}</Code>
          <p className="small" style={{ marginTop: 0 }}><strong>Rule:</strong> {DEPS[dep].rule}</p>
          <div className="row">
            <button className="btn primary small" onClick={() => setName(name === "John" ? "Jane" : "John")}>Change name ({name})</button>
            <button className="btn small" onClick={() => setCount(count + 1)}>Change count ({count})</button>
          </div>
        </div>
        <div>
          <div className="box-label" style={{ marginBottom: 4 }}>Renders, newest first</div>
          <div style={{ border: "2px solid var(--line)", borderRadius: 6, background: "var(--code-bg)", padding: 8, minHeight: 180 }}>
            {log.map((r) => (
              <div key={r.id} className="mono small pop" style={{ color: "var(--code-ink)", padding: "3px 0", borderBottom: "1px dashed #2c323a" }}>
                <span style={{ color: "#9aa3ad" }}>render #{r.render}</span>{" "}
                {r.runs ? <span style={{ color: "#9fdc8b" }}>⚡ effect runs → “{r.line}”</span> : <span style={{ color: "#6b7480" }}>effect skipped</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Panel>
  );
}

function Timeline() {
  const steps = ["Component function runs (render)", "React updates the page", "Browser paints the screen", "useEffect callback runs"];
  const [n, setN] = useState(4);
  return (
    <Panel title="When exactly does it run?" sub="Effects run after React has updated the screen, so they never slow down what the user sees.">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
        {steps.map((s, i) => (
          <div key={s} className="box center small" style={{ background: i < n ? (i === 3 ? "var(--accent)" : "var(--accent-soft)") : "#fff", transition: "background .3s", fontWeight: i === 3 ? 700 : 400 }}>
            <div className="mono">{i + 1}</div>{s}
          </div>
        ))}
      </div>
      <button className="btn small" style={{ marginTop: 12 }} onClick={() => { setN(0); [1, 2, 3, 4].forEach((k) => setTimeout(() => setN(k), k * 500)); }}>Replay</button>
    </Panel>
  );
}

export default function UseEffectLesson({ markDone }) {
  return (
    <>
      <h1>The useEffect hook</h1>
      <p className="lead">
        A component's main job is to return JSX. Anything else, like logging, fetching data, starting a timer or changing the page
        title, is a <strong>side effect</strong>. useEffect is where side effects go.
      </p>

      <Code label="App.jsx (from the slide)">{`import { useState, useEffect } from 'react';
import Greeting from './Greeting';

function App() {
  const [name, setName] = useState('Jane');

  const handleClick = () => {
    setName('John');
  };

  useEffect(() => {
    console.log(\`Name changed to: \${name}\`);
  }, [name]); // Runs every time 'name' changes

  return (
    <div>
      <Greeting name={name} />
      <button onClick={handleClick}>Change Name</button>
    </div>
  );
}

export default App;`}</Code>

      <h2>Two parts</h2>
      <ul>
        <li><strong>The function</strong>: what to do, here log the new name.</li>
        <li><strong>The dependency array</strong> <code className="inline">[name]</code>: when to do it again. React re-runs the effect only if something in the array changed.</li>
      </ul>

      <Timeline />
      <DepsExplorer />

      <ReactTryIt
        title="Live React: the slide's useEffect"
        hint="Watch the console below the preview. The effect logs once at the start, then again when the name changes. Clicking again does nothing: the name is already John."
        code={`import { useState, useEffect } from 'react';

function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}

function App() {
  const [name, setName] = useState('Jane');

  const handleClick = () => {
    setName('John');
  };

  useEffect(() => {
    console.log(\`Name changed to: \${name}\`);
  }, [name]); // Runs every time 'name' changes

  return (
    <div>
      <Greeting name={name} />
      <button onClick={handleClick}>Change Name</button>
    </div>
  );
}

export default App;`}
      />

      <h2>Lifecycle behaviour, and cleaning up</h2>
      <p>
        The slide says useEffect handles <em>lifecycle behaviour</em>. With an empty array it runs when the component first appears (mounts).
        If the effect returns a function, React runs that <strong>cleanup</strong> function when the component disappears (unmounts),
        or before the effect runs again. Use it to stop timers and listeners.
      </p>
      <ReactTryIt
        title="Live React: a timer with cleanup"
        hint="Press Hide to remove the Clock. The cleanup stops its timer, so the console messages stop too."
        code={`import { useState, useEffect } from 'react';

function Clock() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    console.log('Clock mounted: timer started');
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);

    return () => {               // cleanup
      clearInterval(id);
      console.log('Clock unmounted: timer stopped');
    };
  }, []);                        // [] = only on mount

  return <h2>⏱ {seconds}s</h2>;
}

function App() {
  const [show, setShow] = useState(true);
  return (
    <div>
      <button onClick={() => setShow(!show)}>{show ? 'Hide' : 'Show'} clock</button>
      {show && <Clock />}
    </div>
  );
}

export default App;`}
      />

      <Note kind="warn" title="Why does my effect log twice?">
        <p>
          In a real project, <code className="inline">{"<React.StrictMode>"}</code> in <code className="inline">main.jsx</code> (Vite) or <code className="inline">index.js</code> (Create React App)
          runs effects twice while developing, to help catch missing cleanups. It doesn't happen in the built app. Students see this all the time;
          the live boxes in these lessons don't use StrictMode, so they log once.
        </p>
      </Note>

      <Quiz
        onPass={markDone}
        questions={[
          { q: "What is useEffect used for?", options: ["Writing CSS", "Side effects like logging, fetching data and timers", "Creating components"], answer: 1, explain: "Anything beyond returning JSX goes in an effect." },
          { q: <>When does <code className="inline">{"useEffect(fn, [name])"}</code> run?</>, options: ["Only once", "After the first render and whenever name changes", "Before every render"], answer: 1, explain: "The dependency array controls when it runs again." },
          { q: <>What does an empty array <code className="inline">[]</code> mean?</>, options: ["Run after every render", "Run once, after the first render", "Never run"], answer: 1, explain: "No dependencies means nothing can trigger it again." },
        ]}
      />
    </>
  );
}
