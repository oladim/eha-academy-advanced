import React, { useRef, useState } from "react";
import Code from "../components/Code.jsx";
import { Note, Panel } from "../components/Bits.jsx";
import ReactTryIt from "../components/ReactTryIt.jsx";
import Quiz from "../components/Quiz.jsx";

function PropsFlow() {
  const [names, setNames] = useState(["Jane", "Tunde", "Amaka"]);
  const [err, setErr] = useState(false);
  return (
    <Panel title="Demo: props flow from parent to child" sub="App (the parent) decides the name. Each Greeting (the child) just displays what it's given.">
      <div className="box" style={{ background: "var(--accent-soft)" }}>
        <div className="box-label">{"<App />  · the parent owns the data"}</div>
        <div className="row" style={{ marginTop: 6 }}>
          {names.map((n, i) => (
            <input key={i} value={n} aria-label={`name ${i + 1}`} onChange={(e) => setNames(names.map((x, j) => (j === i ? e.target.value : x)))}
              style={{ width: 110, padding: "6px 8px", border: "2px solid var(--line)", borderRadius: 6, font: "inherit" }} />
          ))}
        </div>
      </div>
      <div className="mono small center" style={{ margin: "6px 0", color: "var(--ink-2)" }}>↓ name=&#123;...&#125; passed down as a prop ↓</div>
      <div className="grid-3">
        {names.map((n, i) => (
          <div key={i} className="box">
            <div className="box-label">{`<Greeting name="${n}" />`}</div>
            <h3 style={{ margin: "6px 0 0", fontFamily: "var(--font-body)" }}>Hello, {n}!</h3>
          </div>
        ))}
      </div>
      <div className="row" style={{ marginTop: 14 }}>
        <button className="btn small" onClick={() => setErr(true)}>Make a Greeting change its own prop</button>
        {err && <span className="bad small pop">TypeError: Cannot assign to read only property 'name'</span>}
      </div>
      {err && <p className="small" style={{ marginBottom: 0 }}>Props are <strong>read-only</strong>. A child never changes its props; only the parent that passes them can change them.</p>}
    </Panel>
  );
}

function VariableVsState() {
  const plain = useRef(0);
  const [, force] = useState(0); // used only to refresh the "memory" panel
  const [shownPlain] = useState(0);
  const [count, setCount] = useState(0);
  return (
    <Panel title="Demo: why not just use a normal variable?" sub="Click both buttons a few times. Compare what's in memory with what's on screen.">
      <div className="grid-2">
        <div className="box">
          <div className="box-label">let count = 0;  (a normal variable)</div>
          <button className="btn" style={{ margin: "8px 0" }} onClick={() => { plain.current++; force((x) => x + 1); }}>Clicked {shownPlain} times</button>
          <div className="small">In memory: <strong className="mono">{plain.current}</strong></div>
          <div className="small bad">On screen: stuck at {shownPlain}. React doesn't know it changed, so it never re-draws.</div>
        </div>
        <div className="box">
          <div className="box-label">const [count, setCount] = useState(0);</div>
          <button className="btn primary" style={{ margin: "8px 0" }} onClick={() => setCount(count + 1)}>Clicked {count} times</button>
          <div className="small">In memory: <strong className="mono">{count}</strong></div>
          <div className="small ok">On screen: always up to date. setCount tells React to re-draw.</div>
        </div>
      </div>
    </Panel>
  );
}

export default function PropsState({ markDone }) {
  return (
    <>
      <h1>Props & state</h1>
      <p className="lead">
        Components get their data in two ways. <strong>Props</strong> are handed in from outside, like arguments to a function.
        <strong> State</strong> is the component's own memory, which it can change.
      </p>

      <h2>Props: read-only data passed to components</h2>
      <div className="grid-2">
        <Code label="Greeting.jsx">{`function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}

export default Greeting;`}</Code>
        <Code label="App.jsx">{`import Greeting from './Greeting';

function App() {
  return (
    <div>
      <Greeting name="Jane" />
    </div>
  );
}

export default App;`}</Code>
      </div>
      <p>
        <code className="inline">name="Jane"</code> looks like an HTML attribute. React collects all of them into one object called
        <strong> props</strong>, and <code className="inline">{"{ name }"}</code> pulls the name out of it.
      </p>
      <PropsFlow />
      <Note kind="precise">
        <p><code className="inline">{"function Greeting({ name })"}</code> is a shortcut called destructuring. It's the same as <code className="inline">{"function Greeting(props)"}</code> and then using <code className="inline">props.name</code>.</p>
      </Note>

      <ReactTryIt
        title="Live React: props"
        hint={'Change "Jane" to your name. Then add a second <Greeting name="..." /> with a different name.'}
        code={`function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}

function App() {
  return (
    <div>
      <Greeting name="Jane" />
    </div>
  );
}

export default App;`}
      />

      <h2>State: data that changes</h2>
      <p>
        When a component needs to remember something that changes (a count, what's typed in a box, whether a menu is open), it uses
        state with the <code className="inline">useState</code> hook.
      </p>
      <Code>{`const [name, setName] = useState('Jane');
//     ↑ current value   ↑ function to change it   ↑ starting value`}</Code>
      <VariableVsState />

      <h2>Props vs state at a glance</h2>
      <table className="table">
        <thead><tr><th></th><th>Props</th><th>State</th></tr></thead>
        <tbody>
          <tr><th>Comes from</th><td>The parent component</td><td>The component itself</td></tr>
          <tr><th>Can the component change it?</th><td className="bad">No, read-only</td><td className="ok">Yes, with its setter (setName)</td></tr>
          <tr><th>Like…</th><td>Arguments passed to a function</td><td>The function's own memory</td></tr>
        </tbody>
      </table>
      <p>They work together: a parent keeps something in <strong>state</strong> and passes it down as a <strong>prop</strong>. That's exactly what the next slide's code does.</p>

      <Quiz
        onPass={markDone}
        questions={[
          { q: "Props are…", options: ["Read-only data passed in from a parent", "Data a component changes itself", "CSS styles"], answer: 0, explain: "A component receives props and never changes them." },
          { q: <>What does <code className="inline">useState('Jane')</code> give you?</>, options: ["Just the string 'Jane'", "An array: the current value and a function to change it", "A new component"], answer: 1, explain: "[value, setValue], here [name, setName]." },
          { q: "Why didn't the normal-variable counter update on screen?", options: ["Variables can't hold numbers", "React only re-draws when state changes through its setter", "The button was broken"], answer: 1, explain: "Calling setCount is what tells React to re-render." },
        ]}
      />
    </>
  );
}
