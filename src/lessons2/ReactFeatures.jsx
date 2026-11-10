import React, { useEffect, useState } from "react";
import Code from "../components/Code.jsx";
import { Note, Panel } from "../components/Bits.jsx";
import ReactTryIt from "../components/ReactTryIt.jsx";
import Quiz from "../components/Quiz.jsx";
import { compileJsx } from "../components/babel.js";

const START_JSX = `const name = "Ada";
const element = (
  <div className="card">
    <h1>Hello, {name}!</h1>
    <p>2 + 2 = {2 + 2}</p>
  </div>
);`;

function JsxXray() {
  const [src, setSrc] = useState(START_JSX);
  const [out, setOut] = useState("Compiling…");
  const [err, setErr] = useState(false);
  useEffect(() => {
    let live = true;
    const t = setTimeout(() => {
      compileJsx(src)
        .then((js) => { if (live) { setOut(js); setErr(false); } })
        .catch((e) => { if (live) { setOut(e.message.replace(/^unknown: /, "")); setErr(true); } });
    }, 250);
    return () => { live = false; clearTimeout(t); };
  }, [src]);
  return (
    <Panel title="Demo: JSX X-ray" sub="Edit the JSX on the left. The right side shows the plain JavaScript the browser actually runs.">
      <div className="grid-2" style={{ alignItems: "stretch" }}>
        <div>
          <div className="box-label" style={{ marginBottom: 4 }}>What you write (JSX)</div>
          <textarea value={src} onChange={(e) => setSrc(e.target.value)} spellCheck={false} aria-label="JSX input"
            style={{ width: "100%", minHeight: 210, fontFamily: "var(--font-mono)", fontSize: 13.5, lineHeight: 1.6, padding: 12, borderRadius: 6, border: "2px solid var(--line)", background: "var(--code-bg)", color: "var(--code-ink)" }} />
        </div>
        <div>
          <div className="box-label" style={{ marginBottom: 4 }}>What it becomes (JavaScript)</div>
          <pre className="code" style={{ margin: 0, minHeight: 210, whiteSpace: "pre-wrap", color: err ? "#ff9a9a" : undefined, fontSize: 13 }}>{out}</pre>
        </div>
      </div>
      <p className="small muted" style={{ marginBottom: 0 }}>Try breaking a rule: delete <code className="inline">{"</p>"}</code>, or add a second element next to the outer div.</p>
    </Panel>
  );
}

const FEATURES = [
  { name: "JSX", icon: "🏷️", desc: "A syntax that lets you write HTML inside JavaScript code.", where: "This lesson" },
  { name: "Props", icon: "📦", desc: "Inputs passed to components to customize their behavior or display.", where: "Lesson 11" },
  { name: "Hooks", icon: "🪝", desc: "Special functions that let you use state and more in components. Their names start with use.", where: "Lessons 11–13" },
  { name: "useState", icon: "🔢", desc: "A hook to create and update state inside components.", where: "Lesson 11" },
  { name: "useEffect", icon: "⚡", desc: "A hook to run code after render or when data changes.", where: "Lesson 13" },
  { name: "Context API", icon: "📡", desc: "Shares data across components without passing props manually.", where: "This lesson" },
];

export default function ReactFeatures({ markDone }) {
  return (
    <>
      <h1>React's key features</h1>
      <p className="lead">Six ideas make up most everyday React code. Here's what each one is for, then a closer look at JSX and the Context API.</p>

      <div className="grid-3">
        {FEATURES.map((f) => (
          <div className="box" key={f.name}>
            <div className="box-label">{f.where}</div>
            <strong style={{ fontFamily: "var(--font-display)", fontSize: 19 }}>{f.icon} {f.name}</strong>
            <p className="small" style={{ margin: "4px 0 0" }}>{f.desc}</p>
          </div>
        ))}
      </div>

      <h2>JSX: HTML inside JavaScript</h2>
      <p>
        JSX looks like HTML but lives in your JavaScript. Browsers don't understand it directly, so a tool (Babel, run for you by
        Create React App or Vite) turns it into ordinary JavaScript first.
      </p>
      <JsxXray />

      <h3>The JSX rules that trip people up</h3>
      <table className="table">
        <thead><tr><th>Rule</th><th>Example</th></tr></thead>
        <tbody>
          <tr><td>Return one parent element (or a fragment <code className="inline">{"<>…</>"}</code>)</td><td className="mono small">{"<div><h1/><p/></div>"}</td></tr>
          <tr><td>Use <code className="inline">className</code> instead of <code className="inline">class</code></td><td className="mono small">{'<div className="card">'}</td></tr>
          <tr><td>Put JavaScript inside curly braces</td><td className="mono small">{"<p>{2 + 2}</p>"}</td></tr>
          <tr><td>Close every tag, even empty ones</td><td className="mono small">{'<img src="a.png" />'}</td></tr>
          <tr><td>Attributes are camelCase</td><td className="mono small">{"onClick, tabIndex"}</td></tr>
        </tbody>
      </table>

      <h2>Context API: sharing data without passing props</h2>
      <p>
        Normally data is passed down one level at a time as props. When many components need the same thing, like the current theme
        or the logged-in user, passing it through every level gets tedious. Context lets any component read it directly.
      </p>
      <Code>{`const ThemeContext = createContext("light");   // 1. create it

<ThemeContext.Provider value="dark">           // 2. provide a value
  <App />
</ThemeContext.Provider>

const theme = useContext(ThemeContext);       // 3. read it anywhere below`}</Code>
      <ReactTryIt
        title="Live React: a theme shared with Context"
        hint="Click the button in the preview. Toolbar and Card never receive a theme prop; they read it from context."
        code={`import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext('light');

function Card() {
  const theme = useContext(ThemeContext);
  const dark = theme === 'dark';
  return (
    <div style={{ padding: 16, borderRadius: 8,
      background: dark ? '#1b1f24' : '#f0f1ea',
      color: dark ? '#4db3ff' : '#1b1f24' }}>
      The current theme is <b>{theme}</b>
    </div>
  );
}

function Toolbar() {
  return <Card />;  // no props passed down!
}

function App() {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext.Provider value={theme}>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Toggle theme
      </button>
      <Toolbar />
    </ThemeContext.Provider>
  );
}

export default App;`}
      />

      <Note kind="precise">
        <p>Hooks have two rules: call them only inside React components (or your own hooks), and only at the top level, never inside an if or a loop.</p>
      </Note>

      <Quiz
        onPass={markDone}
        questions={[
          { q: "What does JSX turn into?", options: ["CSS", "Plain JavaScript (React.createElement calls)", "A PDF"], answer: 1, explain: "A compiler converts JSX to regular JavaScript." },
          { q: <>In JSX, how do you add a CSS class?</>, options: ['class="box"', 'className="box"', 'css="box"'], answer: 1, explain: "class is a reserved word in JavaScript, so JSX uses className." },
          { q: "Which feature shares data with many components without passing props through every level?", options: ["useEffect", "Context API", "JSX"], answer: 1, explain: "Context makes data available to the whole tree below the provider." },
        ]}
      />
    </>
  );
}
