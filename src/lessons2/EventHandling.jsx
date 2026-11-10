import React, { useEffect, useRef, useState } from "react";
import Code from "../components/Code.jsx";
import { Note, Panel, Tabs } from "../components/Bits.jsx";
import ReactTryIt from "../components/ReactTryIt.jsx";
import Quiz from "../components/Quiz.jsx";

const SLIDE_CODE = `function App() {
  const [name, setName] = useState('Jane');

  const handleClick = () => {
    setName('John');
  };

  return (
    <div>
      <Greeting name={name} />
      <button onClick={handleClick}>Change Name</button>
    </div>
  );
}`;

const STAGES = [
  { line: 10, title: "1. The user clicks", text: "The button's onClick prop points at handleClick, so React calls it." },
  { line: 4, title: "2. The handler runs", text: "handleClick calls setName('John') to ask for new state." },
  { line: 1, title: "3. React re-renders App", text: "App runs again. This time useState returns 'John' instead of 'Jane'." },
  { line: 9, title: "4. The screen updates", text: "Greeting receives name=\"John\" as a prop and shows the new name. Only that text changes in the real DOM." },
];

function Cycle() {
  const [stage, setStage] = useState(-1);
  const [name, setName] = useState("Jane");
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  function click() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setStage(0);
    [1, 2, 3].forEach((s) => timers.current.push(setTimeout(() => { setStage(s); if (s === 3) setName("John"); }, s * 1100)));
  }
  function reset() {
    timers.current.forEach(clearTimeout);
    setStage(-1);
    setName("Jane");
  }
  return (
    <Panel title="Demo: what happens when you click" sub="This is the slide's code running live. Click the button and follow the four steps.">
      <div className="grid-2" style={{ alignItems: "start" }}>
        <Code activeLine={stage >= 0 ? STAGES[stage].line : -1}>{SLIDE_CODE}</Code>
        <div>
          <div className="box" style={{ minHeight: 120 }}>
            <div className="box-label">The app</div>
            <h2 className={stage === 3 ? "flash" : undefined} style={{ margin: "6px 0 10px", fontFamily: "var(--font-body)" }}>Hello, {name}!</h2>
            <button className="btn primary" onClick={click} disabled={stage >= 0 && stage < 3}>Change Name</button>{" "}
            <button className="btn small ghost" onClick={reset}>Reset</button>
          </div>
          <div className="row" style={{ margin: "10px 0", gap: 6 }}>
            state: <span className="chip">name = "{name}"</span>
          </div>
          {stage >= 0 && (
            <div className="box pop" key={stage}>
              <div className="box-label">{STAGES[stage].title}</div>
              {STAGES[stage].text}
            </div>
          )}
        </div>
      </div>
    </Panel>
  );
}

function Pitfall() {
  const [tab, setTab] = useState("onClick={handleClick}");
  const good = tab === "onClick={handleClick}";
  return (
    <Panel title="The most common mistake" sub="Spot the difference: two characters.">
      <Tabs tabs={["onClick={handleClick}", "onClick={handleClick()}"]} value={tab} onChange={setTab} />
      {good ? (
        <p style={{ margin: 0 }}><span className="ok">Correct.</span> You hand React the function itself. React calls it later, when the click happens.</p>
      ) : (
        <>
          <p style={{ marginTop: 0 }}><span className="bad">Wrong.</span> The brackets <em>call</em> the function immediately, while the component is drawing, before anyone clicks. If it sets state, React re-draws, calls it again, and loops:</p>
          <div className="preview-error" style={{ margin: 0 }}>Error: Too many re-renders. React limits the number of renders to prevent an infinite loop.</div>
          <p className="small" style={{ marginBottom: 0 }}>Need to pass a value? Wrap it in an arrow function: <code className="inline">{"onClick={() => setName('John')}"}</code></p>
        </>
      )}
    </Panel>
  );
}

export default function EventHandling({ markDone }) {
  return (
    <>
      <h1>Event handling in React</h1>
      <p className="lead">
        Event handlers are functions that run when the user does something: clicks, types, submits a form. In React they usually
        update state, and the screen follows.
      </p>

      <h2>The pattern</h2>
      <Code>{`<button onClick={() => setCount(count + 1)}>Click</button>`}</Code>
      <ul>
        <li>Events are props on the element, written in camelCase: <code className="inline">onClick</code>, not <code className="inline">onclick</code>.</li>
        <li>You pass a <strong>function</strong> inside curly braces, not a string.</li>
        <li>Inside the handler you usually <strong>change state</strong>, and React updates the page for you. No <code className="inline">document.getElementById</code> needed.</li>
      </ul>
      <Note title="Compare with Module 1">
        <p>In plain JavaScript you'd write <code className="inline">{'btn.addEventListener("click", ...)'}</code> and then update the DOM yourself. In React you attach the handler right in the JSX, and only update state.</p>
      </Note>

      <Cycle />
      <Pitfall />

      <ReactTryIt
        title="Live React: the slide's example"
        hint="Click the button in the preview. Then change 'John' to your name, or add a second button that sets the name back to 'Jane'."
        code={`import { useState } from 'react';

function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}

function App() {
  const [name, setName] = useState('Jane');

  const handleClick = () => {
    setName('John');
  };

  return (
    <div>
      <Greeting name={name} />
      <button onClick={handleClick}>Change Name</button>
    </div>
  );
}

export default App;`}
      />

      <h2>Other common events</h2>
      <table className="table">
        <thead><tr><th>Event prop</th><th>Fires when…</th></tr></thead>
        <tbody>
          <tr><td className="mono">onClick</td><td>An element is clicked</td></tr>
          <tr><td className="mono">onChange</td><td>An input's value changes (every keystroke)</td></tr>
          <tr><td className="mono">onSubmit</td><td>A form is submitted (call <span className="mono">e.preventDefault()</span> to stop the page reloading)</td></tr>
          <tr><td className="mono">onMouseEnter</td><td>The pointer moves onto an element</td></tr>
          <tr><td className="mono">onKeyDown</td><td>A key is pressed</td></tr>
        </tbody>
      </table>

      <ReactTryIt
        title="Live React: typing and submitting"
        hint="Type a name and press Add. Notice the event object (e) gives you the input's value and lets you stop the form reloading the page."
        code={`import { useState } from 'react';

function App() {
  const [text, setText] = useState('');
  const [names, setNames] = useState(['Jane']);

  const handleSubmit = (e) => {
    e.preventDefault();          // stop the page reloading
    if (!text.trim()) return;
    setNames([...names, text]);
    setText('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a name"
      />
      <button type="submit">Add</button>
      <ul>
        {names.map((n, i) => <li key={i}>{n}</li>)}
      </ul>
    </form>
  );
}

export default App;`}
      />

      <Quiz
        onPass={markDone}
        questions={[
          { q: "How is the click event written in React?", options: ["onclick", "onClick", "on-click"], answer: 1, explain: "React event props are camelCase." },
          { q: <>What's wrong with <code className="inline">{"onClick={handleClick()}"}</code>?</>, options: ["Nothing", "It calls the function straight away instead of on click", "It's too short"], answer: 1, explain: "Pass the function itself: onClick={handleClick}." },
          { q: "After setName('John') runs, what does React do?", options: ["Reloads the browser", "Re-renders the component with the new state", "Nothing until you refresh"], answer: 1, explain: "Setting state triggers a re-render." },
        ]}
      />
    </>
  );
}
