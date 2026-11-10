import React, { useState } from "react";
import { Note, Panel } from "../components/Bits.jsx";
import Quiz from "../components/Quiz.jsx";

const JOBS = [
  { name: "UI", icon: "🧱", by: "You describe what the screen should look like; the framework builds and updates the HTML.", hand: "Create every element with createElement, then remember to update each one when data changes." },
  { name: "State", icon: "🔢", by: "Data that changes (a cart total, a logged-in user) is tracked for you, and the screen follows it.", hand: "Store values in variables and manually find every place on the page that shows them." },
  { name: "Routing", icon: "🧭", by: "Switch between “pages” like /home and /profile without reloading the browser.", hand: "Listen for URL changes, hide and show sections yourself, handle the back button." },
  { name: "And more", icon: "🧰", by: "Forms, fetching data, animations, testing tools, a command line to create and build projects.", hand: "Write or find a separate solution for each, and make them work together." },
];

function Kit() {
  const [sel, setSel] = useState(0);
  const j = JOBS[sel];
  return (
    <Panel title="Demo: what a framework manages for you" sub="Pick a job. Compare doing it with a framework to doing it by hand with plain JavaScript.">
      <div className="grid-2" style={{ alignItems: "start" }}>
        <div style={{ border: "3px solid var(--line)", borderRadius: 10, padding: 14, background: "var(--accent-soft)" }}>
          <div className="box-label" style={{ marginBottom: 8 }}>The framework: a box of ready-made tools</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {JOBS.map((x, i) => (
              <button key={x.name} onClick={() => setSel(i)} style={{
                border: "2px solid var(--line)", borderRadius: 8, padding: "14px 8px", cursor: "pointer", fontWeight: 700,
                background: sel === i ? "var(--accent)" : "#fff", boxShadow: sel === i ? "3px 3px 0 var(--line)" : "none",
              }}>
                <div style={{ fontSize: 26 }}>{x.icon}</div>{x.name}
              </button>
            ))}
          </div>
        </div>
        <div className="pop" key={sel}>
          <div className="box" style={{ background: "var(--green-soft)", marginBottom: 10 }}>
            <div className="box-label">With a framework</div>{j.by}
          </div>
          <div className="box" style={{ background: "var(--red-soft)" }}>
            <div className="box-label">By hand</div>{j.hand}
          </div>
        </div>
      </div>
    </Panel>
  );
}

const EXAMPLES = [
  { name: "React", by: "Meta (Facebook)", note: "Builds UIs from components. The focus of this module." },
  { name: "Angular", by: "Google", note: "A complete, all-in-one framework that uses TypeScript." },
  { name: "Vue", by: "Evan You & community", note: "Known for being gentle to learn; easy to add to a page bit by bit." },
  { name: "Svelte", by: "Rich Harris & community", note: "Does most of its work at build time, so very little code ships to the browser." },
];

export default function WhatIsFramework({ markDone }) {
  return (
    <>
      <h1>What is a JavaScript framework?</h1>
      <p className="lead">
        A framework is a pre-built structure for building apps. Instead of starting from an empty file, you start with a solid
        skeleton and fill in the parts that make your app unique.
      </p>

      <Note title="An everyday picture">
        <p>
          You could build a house by making your own bricks, cutting your own wood and designing the plumbing from scratch. Or you could
          start with a well-tested frame where the plumbing and wiring are already planned, and spend your time on the rooms.
          A framework is that frame.
        </p>
      </Note>

      <h2>The slide in plain words</h2>
      <table className="table">
        <tbody>
          <tr><th>Pre-built structure</th><td>The basic shape of an app is already there: where files go, how pieces connect.</td></tr>
          <tr><th>A compilation of libraries and utilities</th><td>Lots of smaller tools bundled together so they work well as a set.</td></tr>
          <tr><th>Manages UI, state, routing and more</th><td>It handles the jobs every app needs, so you don't build them yourself.</td></tr>
          <tr><th>Avoid re-inventing the wheel</th><td>Experts have already solved these problems. You reuse their solution.</td></tr>
        </tbody>
      </table>

      <Kit />

      <h2>Examples</h2>
      <div className="grid-2">
        {EXAMPLES.map((e) => (
          <div className="box" key={e.name}>
            <strong style={{ fontFamily: "var(--font-display)", fontSize: 20 }}>{e.name}</strong>
            <div className="small muted">by {e.by}</div>
            <p className="small" style={{ margin: "6px 0 0" }}>{e.note}</p>
          </div>
        ))}
      </div>
      <Note kind="precise">
        <p>Strictly speaking, React calls itself a <em>library</em>, not a framework. Lesson 4 explains the difference and why people still group it with frameworks.</p>
      </Note>

      <Quiz
        onPass={markDone}
        questions={[
          { q: "What is a JavaScript framework?", options: ["A new programming language", "A pre-built structure and set of tools for building apps", "A web browser"], answer: 1, explain: "It gives you the skeleton and tools so you can focus on your app." },
          { q: "Which of these is NOT a JavaScript framework or UI library?", options: ["Vue", "Angular", "Python", "Svelte"], answer: 2, explain: "Python is a separate programming language." },
          { q: "“Avoid re-inventing the wheel” means…", options: ["Reuse proven solutions instead of building everything yourself", "Never write any code", "Only use old technology"], answer: 0, explain: "Frameworks package solutions to common problems." },
        ]}
      />
    </>
  );
}
