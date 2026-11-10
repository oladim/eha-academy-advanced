import React, { useState } from "react";
import Code from "../components/Code.jsx";
import { Note, Panel } from "../components/Bits.jsx";
import Quiz from "../components/Quiz.jsx";

const STEPS = [
  { title: "Install Node.js", body: "Download the LTS version from nodejs.org and install it. Then open a new terminal and check it worked.", code: "node -v\nnpm -v", expect: "Two version numbers, e.g. v22.11.0 and 10.9.0." },
  { title: "Create the project", body: "Go to the folder where you keep your projects and run Vite's creator.", code: "npm create vite@latest my-react-app --template react", expect: "A new my-react-app folder. If it asks questions, pick React and JavaScript." },
  { title: "Open it in your editor", body: "Open the my-react-app folder in VS Code (File → Open Folder) and open its built-in terminal (View → Terminal).", code: "cd my-react-app\ncode .", expect: "VS Code shows index.html, package.json and a src folder." },
  { title: "Install dependencies", body: "Download React and the tools the project needs.", code: "npm install", expect: "A node_modules folder appears. Warnings are usually fine; errors are not." },
  { title: "Start the development server", body: "Start the app and open the Local address in your browser.", code: "npm run dev", expect: "The Vite + React starter page at http://localhost:5173 with a counter button." },
  { title: "Make it yours", body: "Replace everything in src/App.jsx with this, and save. The browser updates on its own.", code: "function App() {\n  return <h1>Hello from my first React app!</h1>;\n}\n\nexport default App;", expect: "Your heading appears instantly, without refreshing. That's hot reloading." },
  { title: "Add a component", body: "Create a new file src/Greeting.jsx, then use it in App.jsx with a prop.", code: "// src/Greeting.jsx\nfunction Greeting({ name }) {\n  return <h2>Welcome, {name}!</h2>;\n}\nexport default Greeting;\n\n// src/App.jsx\nimport Greeting from './Greeting';\n\nfunction App() {\n  return (\n    <div>\n      <h1>Hello from my first React app!</h1>\n      <Greeting name=\"Jane\" />\n    </div>\n  );\n}\nexport default App;", expect: "“Welcome, Jane!” under your heading." },
  { title: "Stop the server", body: "When you're done, click in the terminal and press Ctrl + C. Run npm run dev again next time.", code: "Ctrl + C", expect: "The terminal is free again, and localhost:5173 no longer loads." },
];

const PROBLEMS = [
  ["'npm' is not recognized / command not found", "Node.js isn't installed or the terminal was open before installing. Install Node.js, close the terminal, and open a new one."],
  ["npm ERR! code ENOENT … package.json", "You're in the wrong folder. Run cd my-react-app first, then npm install."],
  ["Port 5173 is in use", "Another server is already running. Stop it with Ctrl + C, or use the new address Vite offers."],
  ["The page is blank", "Open the browser console (F12). Usually it's a typo in App.jsx: a missing closing tag or a missing export default."],
  ["Changes don't show up", "Make sure you saved the file, and that npm run dev is still running in the terminal."],
];

export default function InstallDemo({ markDone }) {
  const [done, setDone] = useState([]);
  const [open, setOpen] = useState(-1);
  const toggle = (i) => setDone(done.includes(i) ? done.filter((x) => x !== i) : [...done, i]);
  return (
    <>
      <h1>Your first React app</h1>
      <p className="lead">
        Slide 15 is the live installation demo. This is the same walkthrough as a checklist, so students can follow along on their own computers
        and tick off each step.
      </p>

      <Panel title={`Checklist: ${done.length} of ${STEPS.length} done`} sub="Do each step in a real terminal, then tick it.">
        <div style={{ height: 10, border: "2px solid var(--line)", borderRadius: 4, marginBottom: 16, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${(done.length / STEPS.length) * 100}%`, background: "var(--teal)", transition: "width .3s" }} />
        </div>
        {STEPS.map((s, i) => (
          <div key={s.title} style={{ borderTop: i ? "1px dashed var(--soft-line)" : 0, padding: "12px 0", opacity: done.includes(i) ? 0.6 : 1 }}>
            <label className="row" style={{ gap: 10, cursor: "pointer" }}>
              <input type="checkbox" checked={done.includes(i)} onChange={() => toggle(i)} style={{ width: 20, height: 20 }} />
              <strong style={{ fontFamily: "var(--font-display)", fontSize: 18 }}>Step {i + 1}: {s.title}</strong>
            </label>
            <div style={{ paddingLeft: 30 }}>
              <p style={{ margin: "4px 0" }}>{s.body}</p>
              <Code>{s.code}</Code>
              <p className="small" style={{ margin: 0 }}><span className="ok">You should see: </span>{s.expect}</p>
            </div>
          </div>
        ))}
        {done.length === STEPS.length && <div className="box pop" style={{ background: "var(--green-soft)", marginTop: 8 }}>🎉 You've built and run your first React app.</div>}
      </Panel>

      <h2>If something goes wrong</h2>
      <div style={{ border: "2px solid var(--line)", borderRadius: 6, overflow: "hidden" }}>
        {PROBLEMS.map(([q, a], i) => (
          <div key={q} style={{ borderTop: i ? "2px solid var(--line)" : 0 }}>
            <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}
              style={{ width: "100%", textAlign: "left", padding: "10px 14px", border: 0, cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: 14, background: open === i ? "var(--accent)" : "#fff", display: "flex", justifyContent: "space-between" }}>
              {q} <span aria-hidden="true">{open === i ? "−" : "+"}</span>
            </button>
            {open === i && <div className="pop" style={{ padding: "6px 14px 12px" }}>{a}</div>}
          </div>
        ))}
      </div>

      <Note title="Prefer Create React App?">
        <p>The same project with Create React App: <code className="inline">npx create-react-app my-react-app</code>, then <code className="inline">cd my-react-app</code> and <code className="inline">npm start</code> (opens localhost:3000). Your component goes in <code className="inline">src/App.js</code>.</p>
      </Note>
      <Note kind="tip">
        <p>Ask students to finish step 5 before class if they can. Installs on slow connections are the most common thing that eats class time.</p>
      </Note>

      <Quiz
        onPass={markDone}
        questions={[
          { q: "Which command starts the app once it's created and installed?", options: ["npm install", "npm run dev", "node -v"], answer: 1, explain: "npm run dev starts the Vite development server." },
          { q: "You saved App.jsx and the browser updated without refreshing. That's called…", options: ["Hot reloading", "Caching", "Routing"], answer: 0, explain: "The dev server pushes changes to the page as you save." },
          { q: "How do you stop the development server?", options: ["Close the browser tab", "Press Ctrl + C in the terminal", "Delete node_modules"], answer: 1, explain: "Ctrl + C stops the running command." },
        ]}
      />
    </>
  );
}
