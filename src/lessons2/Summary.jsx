import React, { useState } from "react";
import { Note } from "../components/Bits.jsx";
import ReactTryIt from "../components/ReactTryIt.jsx";
import Quiz from "../components/Quiz.jsx";

const TAKEAWAYS = [
  { title: "Frameworks solve UI challenges in JS", body: "They keep the screen in sync with your data, give projects structure, and let you build on experts' work.", links: [["why-frameworks", "Why frameworks"], ["popular", "Comparison"]] },
  { title: "React offers component-first UI design", body: "Build small components, pass data down with props, keep changing data in state, respond to events, and put side effects in useEffect.", links: [["components", "Components"], ["props-state", "Props & state"], ["use-effect", "useEffect"]] },
  { title: "Next: hooks, Context API, advanced patterns", body: "More hooks (useRef, useReducer, custom hooks), sharing data with Context, lists and forms, routing with React Router, and fetching data.", links: [["react-features", "Context API intro"]] },
];

const NEXT = [
  ["Lists and keys", "Show arrays of data with .map() and give each item a key."],
  ["Forms", "Controlled inputs, validation and submitting data."],
  ["More hooks", "useRef, useReducer, and writing your own custom hooks."],
  ["Context API", "Share data like the logged-in user across the whole app."],
  ["Routing", "Multiple pages with React Router."],
  ["Fetching data", "Load data from an API with fetch and useEffect."],
];

const FAQ = [
  ["Is React a framework or a library?", "Officially a library for building UIs. With tools like React Router and Next.js it does the job of a framework, which is why people use both words."],
  ["Do I need to know JavaScript well before React?", "Yes, the basics: variables, functions (especially arrow functions), arrays and their .map() method, objects, and events. React is “just JavaScript” plus a few ideas."],
  ["Vite or Create React App?", "Both create a working React project. Create React App was retired by the React team in 2025, so Vite (or a framework like Next.js) is recommended for new projects. The code inside your components is the same either way."],
  ["What's the difference between props and state?", "Props come from the parent and are read-only. State belongs to the component and changes with its setter function. A parent's state often becomes a child's props."],
  ["Why does my console.log in useEffect run twice?", "StrictMode runs effects twice in development to catch bugs. It doesn't happen in production builds."],
  ["Where can I learn more?", "The official docs at react.dev are excellent for beginners, especially the “Learn” section and its interactive challenges."],
];

function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <div style={{ border: "2px solid var(--line)", borderRadius: 6, overflow: "hidden" }}>
      {FAQ.map(([q, a], i) => (
        <div key={q} style={{ borderTop: i ? "2px solid var(--line)" : 0 }}>
          <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}
            style={{ width: "100%", textAlign: "left", padding: "12px 16px", border: 0, cursor: "pointer", fontWeight: 700, background: open === i ? "var(--accent)" : "#fff", display: "flex", justifyContent: "space-between", gap: 10 }}>
            {q} <span aria-hidden="true">{open === i ? "−" : "+"}</span>
          </button>
          {open === i && <div className="pop" style={{ padding: "4px 16px 14px", background: "#fff" }}>{a}</div>}
        </div>
      ))}
    </div>
  );
}

export default function Summary({ markDone }) {
  return (
    <>
      <h1>Summary and Q&A</h1>
      <p className="lead">You've covered every slide in the module. Here's what to remember, one last challenge that uses everything, and answers to common questions.</p>

      <h2>Key takeaways</h2>
      <div className="grid-3">
        {TAKEAWAYS.map((t) => (
          <div className="box" key={t.title}>
            <strong style={{ fontFamily: "var(--font-display)", fontSize: 18 }}>{t.title}</strong>
            <p className="small" style={{ margin: "6px 0 10px" }}>{t.body}</p>
            <div className="row">{t.links.map(([id, label]) => <a key={id} href={`#/${id}`} className="chip" style={{ textDecoration: "none", color: "inherit", fontFamily: "var(--font-body)" }}>{label}</a>)}</div>
          </div>
        ))}
      </div>

      <h2>Final challenge: everything together</h2>
      <p>This attendance app uses components, props, state, event handling and useEffect. Read it, run it, then try the ideas in the bar.</p>
      <ReactTryIt
        title="Live React: class attendance"
        hint="Ideas: add a “Mark all present” button; show a message when everyone is present; add a new student with an input."
        code={`import { useState, useEffect } from 'react';

function Student({ name, present, onToggle }) {
  return (
    <li onClick={onToggle} style={{ cursor: 'pointer', padding: '4px 0' }}>
      {present ? '✅' : '⬜'} {name}
    </li>
  );
}

function App() {
  const [students, setStudents] = useState([
    { name: 'Ada', present: false },
    { name: 'Tunde', present: false },
    { name: 'Amaka', present: false },
  ]);

  const toggle = (i) =>
    setStudents(students.map((s, j) => (j === i ? { ...s, present: !s.present } : s)));

  const count = students.filter((s) => s.present).length;

  useEffect(() => {
    console.log(\`\${count} of \${students.length} present\`);
  }, [count, students.length]);

  return (
    <div>
      <h2>Attendance</h2>
      <p>{count} of {students.length} present</p>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {students.map((s, i) => (
          <Student key={s.name} name={s.name} present={s.present} onToggle={() => toggle(i)} />
        ))}
      </ul>
    </div>
  );
}

export default App;`}
      />

      <h2>Final review</h2>
      <Quiz
        title="Final review"
        onPass={markDone}
        questions={[
          { q: "What's the main problem frameworks solve?", options: ["Making websites load without internet", "Keeping complex UIs in sync with changing data", "Replacing HTML"], answer: 1, explain: "They update the UI for you as data changes." },
          { q: "Which is the modern way to write React components?", options: ["Functional components with hooks", "jQuery plugins", "Class components only"], answer: 0, explain: "Functions plus hooks are the current standard." },
          { q: "A parent passes data to a child using…", options: ["state", "props", "useEffect"], answer: 1, explain: "Props flow from parent to child." },
          { q: <>Which hook creates a value that can change and re-render the component?</>, options: ["useState", "useEffect", "useContext"], answer: 0, explain: "useState returns the value and its setter." },
          { q: <>What does <code className="inline">npm run dev</code> do in a Vite project?</>, options: ["Installs React", "Starts the development server", "Deletes the project"], answer: 1, explain: "It starts the local server at localhost:5173." },
          { q: "Which feature lets components share data without passing props through every level?", options: ["JSX", "Context API", "Virtual DOM"], answer: 1, explain: "Context makes a value available to every component below its provider." },
        ]}
      />

      <h2>What to learn next</h2>
      <div className="grid-3">
        {NEXT.map(([t, b], i) => (
          <div className="box" key={t}><div className="box-label">Step {i + 1}</div><strong>{t}</strong><p className="small" style={{ margin: "4px 0 0" }}>{b}</p></div>
        ))}
      </div>

      <h2>Questions?</h2>
      <Faq />
      <Note kind="tip">
        <p>For the live Q&A, invite students to break one of the live React boxes on purpose and read the error together. Learning to read React errors calmly is a skill worth practising.</p>
      </Note>
      <p className="center" style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 800, marginTop: 50 }}>Thank you for your attention!</p>
    </>
  );
}
