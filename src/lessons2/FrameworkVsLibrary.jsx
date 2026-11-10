import React, { useState } from "react";
import Code from "../components/Code.jsx";
import { Note, Panel, Tabs } from "../components/Bits.jsx";
import Quiz from "../components/Quiz.jsx";

function WhoCalls() {
  const [tab, setTab] = useState("Library");
  const lib = tab === "Library";
  const box = (label, sub, strong) => (
    <div style={{ border: "2px solid var(--line)", borderRadius: 8, padding: "12px 14px", textAlign: "center", background: strong ? "var(--accent)" : "#fff", boxShadow: strong ? "3px 3px 0 var(--line)" : "none", minWidth: 150 }}>
      <strong style={{ fontFamily: "var(--font-display)" }}>{label}</strong>
      <div className="small">{sub}</div>
    </div>
  );
  return (
    <Panel title="Demo: who is in charge?" sub="The simplest way to tell them apart: who calls whom.">
      <Tabs tabs={["Library", "Framework"]} value={tab} onChange={setTab} />
      <div className="pop" key={tab} style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 12, margin: "8px 0 16px" }}>
        {box("Your code", lib ? "in charge" : "fills in the gaps", lib)}
        <div className="mono center" style={{ fontSize: 15 }}>
          {lib ? <>calls →<br /><span className="muted small">when you want</span></> : <>← calls<br /><span className="muted small">when it decides</span></>}
        </div>
        {box(lib ? "Library" : "Framework", lib ? "a tool you pick up" : "in charge", !lib)}
      </div>
      {lib ? (
        <>
          <p style={{ marginTop: 0 }}><strong>You call the library.</strong> Your code decides when to use it, like grabbing a tool from a toolbox.</p>
          <Code label="Example: a date library">{`import dayjs from "dayjs";

const today = dayjs().format("DD MMM YYYY"); // you call it, when you need it`}</Code>
        </>
      ) : (
        <>
          <p style={{ marginTop: 0 }}><strong>The framework calls you.</strong> It runs the show, and calls your code at the right moments, like a kitchen with a set routine where you cook your part when the head chef says.</p>
          <Code label="Example: an Angular component">{`export class ProfileComponent {
  ngOnInit() {
    // Angular calls this for you when the component starts
  }
}`}</Code>
        </>
      )}
    </Panel>
  );
}

const TOOLS = [
  { name: "React Router", adds: "pages and URLs" },
  { name: "A state library (e.g. Redux, Zustand)", adds: "app-wide data" },
  { name: "Next.js", adds: "a full project structure, routing and server rendering" },
];

function Spectrum() {
  const [on, setOn] = useState([]);
  const pos = 22 + on.length * 22; // percent along the line
  return (
    <Panel title="Demo: where does React sit?" sub="React on its own is a library for UIs. Add tools from its ecosystem and watch where it lands.">
      <div style={{ position: "relative", height: 70, margin: "10px 10px 6px" }}>
        <div style={{ position: "absolute", top: 32, left: 0, right: 0, height: 6, borderRadius: 3, background: "linear-gradient(90deg, var(--accent-soft), var(--accent))", border: "2px solid var(--line)" }} />
        <div style={{ position: "absolute", top: 0, left: `calc(${pos}% - 30px)`, transition: "left .4s", textAlign: "center", width: 60 }}>
          <div style={{ fontSize: 26, lineHeight: 1 }}>⚛</div>
          <div className="small" style={{ fontWeight: 700 }}>React</div>
        </div>
      </div>
      <div className="row small" style={{ justifyContent: "space-between", margin: "0 0 14px" }}>
        <span>Library: small, focused</span><span>Framework: complete, opinionated</span>
      </div>
      {TOOLS.map((t) => (
        <label key={t.name} className="row" style={{ gap: 8, margin: "4px 0" }}>
          <input type="checkbox" checked={on.includes(t.name)} onChange={() => setOn(on.includes(t.name) ? on.filter((x) => x !== t.name) : [...on, t.name])} />
          <span><strong>{t.name}</strong> <span className="muted small">adds {t.adds}</span></span>
        </label>
      ))}
      <p className="small muted" style={{ marginBottom: 0 }}>That's what the slide means by “React behaves like a framework with ecosystem tools.”</p>
    </Panel>
  );
}

export default function FrameworkVsLibrary({ markDone }) {
  return (
    <>
      <h1>Framework vs library</h1>
      <p className="lead">
        People often use the two words as if they mean the same thing. They don't, though they share a goal: saving you from
        re-inventing the wheel and speeding up development.
      </p>

      <table className="table">
        <thead><tr><th></th><th>Library</th><th>Framework</th></tr></thead>
        <tbody>
          <tr><th>Size</th><td>Smaller, focused on one job</td><td>Larger, covers many jobs</td></tr>
          <tr><th>Who's in charge</th><td>You call it</td><td>It calls your code</td></tr>
          <tr><th>Freedom</th><td>Mix and match as you like</td><td>Follow its way of doing things</td></tr>
          <tr><th>Examples</th><td>React, Lodash, Day.js</td><td>Angular, Next.js, Ember</td></tr>
        </tbody>
      </table>

      <WhoCalls />
      <Spectrum />

      <Note kind="precise">
        <p>
          React does a bit of both. You don't call your components yourself; React decides when to run them, which is framework-like.
          But it only handles the UI, which is library-like. That's why the slide's comparison table on lesson 6 lists React as a “Library (for UI)”.
        </p>
      </Note>

      <Quiz
        onPass={markDone}
        questions={[
          { q: "Which statement best describes a library?", options: ["It controls your whole app", "You call it when you need it", "It can't be used with JavaScript"], answer: 1, explain: "A library is a tool your code calls." },
          { q: "Which is generally more comprehensive?", options: ["A library", "A framework"], answer: 1, explain: "Frameworks cover more of what an app needs." },
          { q: "Why do people call React a framework even though it's a library?", options: ["Because of its name", "With its ecosystem tools, it covers most of what a framework does", "Because it uses TypeScript"], answer: 1, explain: "Router, state tools and Next.js fill in the rest." },
        ]}
      />
    </>
  );
}
