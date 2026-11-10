import React, { useRef, useState } from "react";
import Code, { C } from "../components/Code.jsx";
import { Note, Panel } from "../components/Bits.jsx";
import TryIt from "../components/TryIt.jsx";
import Quiz from "../components/Quiz.jsx";

const PAGE = `<!doctype html><html><head><meta charset="utf-8"><style>
  body{font-family:system-ui,sans-serif;margin:0;padding:16px;color:#1b1f24}
  .className{border:2px dashed #2a9d8f;padding:8px;border-radius:6px;margin:10px 0}
  .btn{padding:6px 12px;margin-right:6px;border:2px solid #1b1f24;border-radius:6px;background:#fff;font:inherit}
  .picked{outline:4px solid #0090fc !important;outline-offset:3px;transition:outline .2s}
  .new{background:#dcf2ee;border:2px solid #2a9d8f;padding:8px;border-radius:6px;margin-top:10px}
</style></head><body>
  <h2 id="demo">I am #demo</h2>
  <div class="className">I am a .className box</div>
  <button class="btn">Button 1</button><button class="btn">Button 2</button><button class="btn">Button 3</button>
</body></html>`;

const ACTIONS = [
  {
    group: "Select", code: 'document.getElementById("demo");',
    explain: "Finds the one element whose id is \"demo\". ids are unique, so you get a single element (or null if none).",
    run: (d) => { const el = d.getElementById("demo"); pick([el]); return el; },
  },
  {
    group: "Select", code: 'document.querySelector(".className");',
    explain: "Uses a CSS selector (.class, #id, tag) and returns the FIRST matching element. The most flexible way to select.",
    run: (d) => { const el = d.querySelector(".className"); pick([el]); return el; },
  },
  {
    group: "Select", code: 'document.getElementsByClassName("btn");',
    explain: "Returns ALL elements with that class, as a list (an HTMLCollection). Here: 3 buttons.",
    run: (d) => { const els = d.getElementsByClassName("btn"); pick([...els]); return els; },
  },
  {
    group: "Modify", code: 'element.innerHTML = "New text";',
    explain: "Replaces everything inside the element. Here element is the #demo heading.",
    run: (d) => { const el = d.getElementById("demo"); el.innerHTML = "New text"; pick([el]); return "New text"; },
  },
  {
    group: "Modify", code: 'element.style.color = "red";',
    explain: "Changes one CSS property directly on the element. CSS names like font-size become fontSize in JavaScript.",
    run: (d) => { const el = d.getElementById("demo"); el.style.color = "red"; pick([el]); return "red"; },
  },
  {
    group: "Create", code: 'let div = document.createElement("div");\ndiv.textContent = "I was created by JavaScript";\ndiv.className = "new";\ndocument.body.appendChild(div);',
    explain: "createElement makes a brand-new element in memory. It only appears on the page once you attach it with appendChild (or append).",
    run: (d) => { const div = d.createElement("div"); div.textContent = "I was created by JavaScript"; div.className = "new"; d.body.appendChild(div); pick([div]); return div; },
  },
];

let pickedEls = [];
function pick(els) {
  pickedEls.forEach((e) => e && e.classList && e.classList.remove("picked"));
  pickedEls = els.filter(Boolean);
  pickedEls.forEach((e) => e.classList.add("picked"));
}

function describe(v) {
  if (v == null) return String(v);
  if (typeof v === "string") return `"${v}"`;
  if (v.nodeType === 1) return `<${v.tagName.toLowerCase()}${v.id ? ` id="${v.id}"` : ""}${v.className.replace("picked", "").trim() ? ` class="${v.className.replace("picked", "").trim()}"` : ""}>`;
  if (v.length !== undefined) return `HTMLCollection(${v.length}) [${[...v].map((e) => `<${e.tagName.toLowerCase()}>`).join(", ")}]`;
  return String(v);
}

function MethodRunner() {
  const frame = useRef(null);
  const [key, setKey] = useState(0);
  const [active, setActive] = useState(null);
  const [result, setResult] = useState(null);

  function run(i) {
    const doc = frame.current?.contentDocument;
    if (!doc) return;
    setActive(i);
    setResult(describe(ACTIONS[i].run(doc)));
  }
  function reset() {
    pickedEls = [];
    setActive(null);
    setResult(null);
    setKey((k) => k + 1);
  }

  let group = null;
  return (
    <Panel title="Demo: every method from the slide, on a real page" sub="Click a line of code to run it on the page. Selected elements glow yellow.">
      <div className="grid-2" style={{ alignItems: "start" }}>
        <div>
          {ACTIONS.map((a, i) => {
            const header = a.group !== group ? <div className="box-label" style={{ margin: i ? "12px 0 4px" : "0 0 4px" }}>{{ Select: "Selecting", Modify: "Modifying", Create: "Creating" }[a.group]} elements</div> : null;
            group = a.group;
            return (
              <React.Fragment key={i}>
                {header}
                <button
                  onClick={() => run(i)}
                  className="mono"
                  style={{
                    display: "block", width: "100%", textAlign: "left", whiteSpace: "pre-wrap", fontSize: 13,
                    border: "2px solid var(--line)", borderRadius: 6, padding: "6px 10px", marginBottom: 6, cursor: "pointer",
                    background: active === i ? "var(--accent)" : "#fff",
                  }}
                >
                  {a.code}
                </button>
              </React.Fragment>
            );
          })}
          <button className="btn small ghost" onClick={reset}>Reset page</button>
        </div>
        <div>
          <div style={{ border: "2px solid var(--line)", borderRadius: 6, overflow: "hidden" }}>
            <iframe key={key} ref={frame} title="Practice page" srcDoc={PAGE} style={{ width: "100%", height: 230, border: 0, display: "block" }} />
          </div>
          {active !== null ? (
            <div className="box pop" key={active + "-" + key + result} style={{ marginTop: 12 }}>
              <div className="box-label">Returned</div>
              <div className="mono small" style={{ marginBottom: 6 }}>{result}</div>
              {ACTIONS[active].explain}
            </div>
          ) : (
            <p className="small muted">Pick a line of code on the left.</p>
          )}
        </div>
      </div>
    </Panel>
  );
}

export default function DomMethods({ markDone }) {
  return (
    <>
      <h1>DOM methods</h1>
      <p className="lead">
        Working with the page always follows the same three moves: <strong>select</strong> an element, then <strong>modify</strong> it,
        or <strong>create</strong> a new one and add it.
      </p>

      <MethodRunner />

      <h2>1. Selecting elements</h2>
      <table className="table">
        <thead><tr><th>Method</th><th>Finds</th><th>Gives back</th></tr></thead>
        <tbody>
          <tr><td className="mono">getElementById("demo")</td><td>The element with id="demo"</td><td>One element</td></tr>
          <tr><td className="mono">querySelector(".className")</td><td>The first match for a CSS selector</td><td>One element</td></tr>
          <tr><td className="mono">getElementsByClassName("btn")</td><td>Every element with class="btn"</td><td>A list</td></tr>
        </tbody>
      </table>
      <Note title="Bonus method">
        <p><C>document.querySelectorAll(".btn")</C> returns <em>all</em> matches for a CSS selector. Together with querySelector, it can replace the other two.</p>
      </Note>

      <h2>2. Modifying elements</h2>
      <p>Once you have an element stored in a variable, change its content or its style:</p>
      <Code>{`const element = document.getElementById("demo");
element.innerHTML = "New text";   // change what's inside
element.style.color = "red";      // change how it looks`}</Code>
      <Note kind="precise">
        <p>
          <C>innerHTML</C> reads its value as HTML, so tags in it become real elements. For plain text, <C>textContent</C> is safer:
          never put text typed by users into innerHTML, as it can let someone inject harmful code.
        </p>
      </Note>

      <h2>3. Creating elements</h2>
      <p>The slide shows <C>let div = document.createElement("div");</C>. That makes the element, but there's one more step to show it:</p>
      <Code>{`let div = document.createElement("div"); // 1. make it (only in memory)
div.textContent = "Hello!";               // 2. fill it
document.body.appendChild(div);            // 3. attach it, now it's visible`}</Code>

      <TryIt
        title="Try it: build a list from data"
        hint="Add more foods to the array and run again. Then try changing the heading's color."
        html={`<h2 id="title">Today's menu</h2>
<ul id="menu"></ul>`}
        code={`const foods = ["Jollof rice", "Suya", "Puff-puff"];
const menu = document.getElementById("menu");

for (const food of foods) {
  const li = document.createElement("li");
  li.textContent = food;
  menu.appendChild(li);
}

document.querySelector("#title").style.color = "teal";
console.log(menu.children.length + " items added");`}
      />

      <Quiz
        onPass={markDone}
        questions={[
          { q: <>What does <C>document.querySelector(".card")</C> return when there are 5 cards?</>, options: ["All 5 cards", "The first card", "The last card"], answer: 1, explain: "querySelector always returns the first match. Use querySelectorAll for all." },
          { q: <>You called <C>document.createElement("p")</C> but nothing appeared. Why?</>, options: ["p isn't allowed", "It hasn't been attached with appendChild yet", "You need to refresh"], answer: 1, explain: "New elements live only in memory until you add them to the page." },
          { q: <>Which line makes an element's text red?</>, options: ['element.color = "red"', 'element.style.color = "red"', 'element.innerHTML = "red"'], answer: 1, explain: "CSS properties live under element.style." },
        ]}
      />
    </>
  );
}
