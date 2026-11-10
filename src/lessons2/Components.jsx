import React, { useState } from "react";
import Code from "../components/Code.jsx";
import { Note, Panel } from "../components/Bits.jsx";
import ReactTryIt from "../components/ReactTryIt.jsx";
import Quiz from "../components/Quiz.jsx";

function Files() {
  const [step, setStep] = useState(0);
  const notes = [
    "Greeting.jsx defines a component: a function that returns JSX.",
    "export default Greeting makes it available to other files.",
    "App.jsx brings it in with import Greeting from './Greeting'.",
    "<Greeting /> inside App's JSX uses it, like a custom HTML tag.",
  ];
  const hl = (i) => ({ background: step === i ? "rgba(0,144,252,.25)" : "transparent", display: "block", margin: "0 -16px", padding: "0 16px", transition: "background .2s" });
  return (
    <Panel title="Demo: the slide's two files, connected" sub="Step through how a component travels from one file to another.">
      <div className="grid-2">
        <pre className="code" style={{ margin: 0 }}>
          <span className="label">Greeting.jsx</span>
          <span style={hl(0)}>{"function Greeting() {\n  return <h1>Hello, welcome to React!</h1>;\n}"}</span>
          {"\n"}
          <span style={hl(1)}>export default Greeting;</span>
        </pre>
        <pre className="code" style={{ margin: 0 }}>
          <span className="label">App.jsx</span>
          <span style={hl(2)}>{"import Greeting from './Greeting';"}</span>
          {"\nfunction App() {\n  return (\n    <div>\n"}
          <span style={hl(3)}>{"      <Greeting />"}</span>
          {"    </div>\n  );\n}\n\nexport default App;"}
        </pre>
      </div>
      <div className="row" style={{ marginTop: 12 }}>
        <button className="btn small" disabled={step === 0} onClick={() => setStep(step - 1)}>← Back</button>
        <button className="btn small primary" disabled={step === 3} onClick={() => setStep(step + 1)}>Next step →</button>
        <span className="small"><strong>Step {step + 1}:</strong> {notes[step]}</span>
      </div>
      {step === 3 && (
        <div className="box pop" style={{ marginTop: 12 }}>
          <div className="box-label">Result in the browser</div>
          <h2 style={{ margin: 0, fontFamily: "var(--font-body)" }}>Hello, welcome to React!</h2>
        </div>
      )}
    </Panel>
  );
}

function Builder() {
  const [list, setList] = useState(["Greeting"]);
  const parts = { Greeting: <h3 style={{ margin: "4px 0", fontFamily: "var(--font-body)" }}>Hello, welcome to React!</h3>, Button: <button className="btn small" style={{ margin: "4px 0" }}>Click me</button>, Divider: <hr style={{ border: 0, borderTop: "2px dashed var(--soft-line)" }} /> };
  return (
    <Panel title="Demo: components are reusable and composable" sub="Add components to App. Each one is written once and can be used as many times as you like.">
      <div className="row" style={{ marginBottom: 12 }}>
        {Object.keys(parts).map((p) => <button key={p} className="btn small" onClick={() => setList([...list, p])}>+ {`<${p} />`}</button>)}
        <button className="btn small ghost" onClick={() => setList([])}>Clear</button>
      </div>
      <div className="grid-2" style={{ alignItems: "start" }}>
        <pre className="code" style={{ margin: 0 }}>{`function App() {\n  return (\n    <div>\n${list.map((p) => `      <${p} />`).join("\n")}${list.length ? "\n" : ""}    </div>\n  );\n}`}</pre>
        <div className="box" style={{ minHeight: 120 }}>
          <div className="box-label">Preview</div>
          {list.length === 0 && <p className="small muted">App is empty. Add a component.</p>}
          {list.map((p, i) => <div key={i} className="pop">{parts[p]}</div>)}
        </div>
      </div>
    </Panel>
  );
}

export default function Components({ markDone }) {
  return (
    <>
      <h1>React components</h1>
      <p className="lead">
        A component is a JavaScript function that returns some UI. Small components combine into bigger ones, like LEGO bricks, until
        you have a whole app.
      </p>

      <h2>Functional components: the modern way</h2>
      <Code label="Greeting.jsx">{`function Greeting() {
  return <h1>Hello, welcome to React!</h1>;
}

export default Greeting;`}</Code>
      <ul>
        <li>It's an ordinary function. The JSX it returns is what appears on screen.</li>
        <li>The name <strong>must start with a capital letter</strong>. <code className="inline">{"<greeting />"}</code> would be treated as an unknown HTML tag.</li>
        <li><strong>Reusable</strong>: write it once, use it anywhere. <strong>Composable</strong>: components can contain other components.</li>
      </ul>

      <Files />
      <Builder />

      <ReactTryIt
        title="Live React: the slide's components"
        hint="Both files are in one editor here. Try adding a second <Greeting /> in App, or create a Footer component and use it."
        code={`// Greeting.jsx
function Greeting() {
  return <h1>Hello, welcome to React!</h1>;
}

// App.jsx
function App() {
  return (
    <div>
      <Greeting />
    </div>
  );
}

export default App;`}
      />

      <Note kind="precise">
        <p>
          Older React code uses <em>class components</em> (<code className="inline">class Greeting extends React.Component</code>). They still work,
          but functions plus hooks are the modern standard, which is why the slide says “modern way”.
        </p>
      </Note>

      <Quiz
        onPass={markDone}
        questions={[
          { q: "What is a functional component?", options: ["A CSS rule", "A function that returns JSX", "A database table"], answer: 1, explain: "It's a JavaScript function that returns UI." },
          { q: "Why must component names start with a capital letter?", options: ["It looks nicer", "So React can tell them apart from normal HTML tags", "Capital letters run faster"], answer: 1, explain: "Lowercase tags like <div> are treated as HTML." },
          { q: "How does App.jsx get access to Greeting?", options: ["It happens automatically", "Greeting is exported, and App imports it", "You copy and paste it"], answer: 1, explain: "export default in one file, import in the other." },
        ]}
      />
    </>
  );
}
