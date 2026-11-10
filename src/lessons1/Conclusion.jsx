import React, { useState } from "react";
import { C } from "../components/Code.jsx";
import { Note } from "../components/Bits.jsx";
import TryIt from "../components/TryIt.jsx";
import Quiz from "../components/Quiz.jsx";

const TAKEAWAYS = [
  { title: "JavaScript basics", points: ["Syntax: statements, { } blocks, comments, case-sensitivity", "Variables: const by default, let when it changes", "Data types, expressions and functions"], links: [["syntax", "Syntax"], ["variables", "Variables"], ["functions", "Functions"]] },
  { title: "DOM manipulation", points: ["The page is a tree of objects", "Select → modify → create", "Change CSS with style and classList", "React to users with events"], links: [["dom", "The DOM"], ["dom-methods", "DOM methods"], ["events", "Events"]] },
  { title: "Asynchronous programming", points: ["Callbacks run later, when a job finishes", "Promises: pending → fulfilled or rejected", "async/await: promise code that reads top to bottom"], links: [["callbacks", "Callbacks"], ["promises", "Promises"], ["async-await", "Async / await"]] },
];

const FAQ = [
  { q: "Should I ever use var?", a: <>Not in new code. <C>let</C> and <C>const</C> are block-scoped and stop you from accidentally redeclaring a name. You'll still see <C>var</C> in older tutorials, so it's worth recognising.</> },
  { q: "What's the difference between == and ===?", a: <><C>==</C> converts types before comparing (<C>5 == "5"</C> is true). <C>===</C> also checks the type (<C>5 === "5"</C> is false). Use <C>===</C> unless you have a reason not to.</> },
  { q: "Do I really need semicolons?", a: "JavaScript inserts them for you in most places, so code runs without them. Many teams still write them for consistency. Pick a style and use a formatter like Prettier to keep it consistent." },
  { q: "Is JavaScript the same as Java?", a: "No. They're unrelated languages that happen to share part of a name." },
  { q: "Where should I put my <script> tag?", a: <>At the end of <C>{"<body>"}</C>, or in <C>{"<head>"}</C> with the <C>defer</C> attribute: <C>{'<script src="app.js" defer></script>'}</C>. Either way, the HTML exists before your code tries to select it.</> },
  { q: "Why does my querySelector return null?", a: "Usually the element doesn't exist yet when the code runs (see the question above), or the selector has a typo. Remember # for ids and . for classes." },
  { q: "Promises or async/await: which should I learn?", a: "Both. async/await is built on promises, so understanding promises makes await make sense. In day-to-day code, async/await is usually easier to read." },
  { q: "What should I learn next?", a: "Arrays and their methods (map, filter), objects, loops and conditionals in more depth, then build small projects: a to-do list, a quiz app, a weather app using a real API." },
];

function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <div style={{ border: "2px solid var(--line)", borderRadius: 6, overflow: "hidden" }}>
      {FAQ.map((f, i) => (
        <div key={i} style={{ borderTop: i ? "2px solid var(--line)" : 0 }}>
          <button
            onClick={() => setOpen(open === i ? -1 : i)}
            aria-expanded={open === i}
            style={{ width: "100%", textAlign: "left", padding: "12px 16px", border: 0, cursor: "pointer", fontWeight: 700, background: open === i ? "var(--accent)" : "#fff", display: "flex", justifyContent: "space-between", gap: 10 }}
          >
            {f.q} <span aria-hidden="true">{open === i ? "−" : "+"}</span>
          </button>
          {open === i && <div className="pop" style={{ padding: "4px 16px 14px", background: "#fff" }}>{f.a}</div>}
        </div>
      ))}
    </div>
  );
}

export default function Conclusion({ markDone }) {
  return (
    <>
      <h1>Wrap-up and Q&A</h1>
      <p className="lead">You've covered every slide. Here's what to remember, a final challenge that uses everything, and answers to common questions.</p>

      <h2>Key takeaways</h2>
      <div className="grid-3">
        {TAKEAWAYS.map((t) => (
          <div className="box" key={t.title}>
            <strong style={{ fontFamily: "var(--font-display)", fontSize: 19 }}>{t.title}</strong>
            <ul className="small" style={{ paddingLeft: 18, margin: "8px 0" }}>
              {t.points.map((p) => <li key={p}>{p}</li>)}
            </ul>
            <div className="row">
              {t.links.map(([id, label]) => <a key={id} className="chip" style={{ textDecoration: "none", color: "inherit", fontFamily: "var(--font-body)" }} href={`#/${id}`}>{label}</a>)}
            </div>
          </div>
        ))}
      </div>

      <h2>Final challenge: everything together</h2>
      <p>
        This small app uses variables, a function, the DOM, an event, CSS classes and async/await. Run it, click the button, and read
        each line. Then try the ideas in the yellow bar.
      </p>
      <TryIt
        title="Mini project: load the class list"
        hint={<>Ideas: change the heading text; add a “Clear” button; try <C>fakeFetch("api/fail")</C> and show the error on the page.</>}
        html={`<style>
  .card { border: 2px solid #1b1f24; border-radius: 8px; padding: 10px 14px; margin-top: 10px; }
  .loading { opacity: .5; }
</style>
<h2 id="heading">Our cohort</h2>
<button id="load">Load course info</button>
<div id="output"></div>`}
        code={`const button = document.getElementById("load");
const output = document.getElementById("output");

async function loadCourse() {
  button.textContent = "Loading…";
  button.classList.add("loading");
  try {
    const res = await fakeFetch("api/data");
    const data = await res.json();

    const card = document.createElement("div");
    card.className = "card";
    card.textContent = \`\${data.course}: \${data.students} students\`;
    output.appendChild(card);
    console.log("Loaded", data);
  } catch (error) {
    output.textContent = "Error: " + error.message;
  } finally {
    button.textContent = "Load course info";
    button.classList.remove("loading");
  }
}

button.addEventListener("click", loadCourse);
console.log("Ready! Click “Load course info” on the page.");`}
      />

      <h2>Final review</h2>
      <Quiz
        title="Final review"
        onPass={markDone}
        questions={[
          { q: "Which keyword should you use for a value that never changes?", options: ["var", "let", "const"], answer: 2, explain: "const can't be reassigned." },
          { q: <>What is <C>typeof [1, 2, 3]</C>?</>, options: ['"array"', '"object"', '"list"'], answer: 1, explain: "Arrays are objects. Use Array.isArray() to check for one." },
          { q: <>Which method selects the first element matching a CSS selector?</>, options: ["getElementById", "querySelector", "getElementsByClassName"], answer: 1, explain: "querySelector takes any CSS selector and returns the first match." },
          { q: <>Which line adds a class called <C>active</C>?</>, options: ['element.class = "active"', 'element.classList.add("active")', 'element.style.active = true'], answer: 1, explain: "classList.add switches the class on." },
          { q: "A promise that failed is…", options: ["pending", "fulfilled", "rejected"], answer: 2, explain: "reject() puts it in the rejected state and .catch() runs." },
          { q: <>Where can you use <C>await</C>?</>, options: ["Anywhere", "Inside an async function (or a module's top level)", "Only inside loops"], answer: 1, explain: "await belongs inside async functions; JavaScript modules also allow it at the top level." },
        ]}
      />

      <h2>Questions & answers</h2>
      <Faq />

      <Note kind="tip">
        <p>For the live Q&A, invite students to bring a line of code from any lesson that surprised them. Running it together in a Try it box usually answers the question better than an explanation.</p>
      </Note>
      <p className="center" style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 800, marginTop: 50 }}>Thank you!</p>
    </>
  );
}
