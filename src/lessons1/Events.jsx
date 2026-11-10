import React, { useRef, useState } from "react";
import Code, { C } from "../components/Code.jsx";
import { Note, Panel } from "../components/Bits.jsx";
import TryIt from "../components/TryIt.jsx";
import Quiz from "../components/Quiz.jsx";

const TYPES = {
  click: "var(--accent)",
  dblclick: "#ffc48a",
  mouseover: "var(--blue-soft)",
  mouseout: "var(--paper-2)",
  keydown: "var(--teal-soft)",
};

function Playground() {
  const [log, setLog] = useState([]);
  const [flash, setFlash] = useState(null);
  const n = useRef(0);

  function add(e, detail) {
    n.current += 1;
    setFlash(e.type);
    setLog((l) => [{ id: n.current, type: e.type, detail }, ...l].slice(0, 8));
  }

  return (
    <Panel title="Demo: events happen all the time" sub="Click, double-click, hover over the box, or type in the field. Every action fires an event.">
      <div className="grid-2" style={{ alignItems: "start" }}>
        <div>
          <div
            role="button"
            tabIndex={0}
            onClick={(e) => add(e, `at x=${Math.round(e.nativeEvent.offsetX)}, y=${Math.round(e.nativeEvent.offsetY)}`)}
            onDoubleClick={(e) => add(e, "two quick clicks")}
            onMouseOver={(e) => e.target === e.currentTarget && add(e, "pointer entered")}
            onMouseOut={(e) => e.target === e.currentTarget && add(e, "pointer left")}
            style={{
              height: 150, border: "2px solid var(--line)", borderRadius: 8, display: "grid", placeItems: "center",
              background: flash ? TYPES[flash] : "#fff", transition: "background .25s", cursor: "pointer", userSelect: "none",
              fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20,
            }}
          >
            Interact with me
          </div>
          <input
            placeholder="Type here…"
            onKeyDown={(e) => add(e, `key "${e.key}"`)}
            style={{ marginTop: 12, width: "100%", padding: "8px 10px", border: "2px solid var(--line)", borderRadius: 6, font: "inherit" }}
          />
        </div>
        <div>
          <div className="box-label" style={{ marginBottom: 6 }}>Event log (newest first)</div>
          <div style={{ border: "2px solid var(--line)", borderRadius: 6, minHeight: 200, background: "var(--code-bg)", padding: 8 }}>
            {log.length === 0 && <div className="mono small" style={{ color: "#6b7480" }}>Waiting for events…</div>}
            {log.map((l) => (
              <div key={l.id} className="mono small pop" style={{ color: "var(--code-ink)", padding: "3px 0", borderBottom: "1px dashed #2c323a" }}>
                <span style={{ background: TYPES[l.type], color: "var(--ink)", padding: "0 6px", borderRadius: 4 }}>{l.type}</span>{" "}
                <span style={{ color: "#9aa3ad" }}>{l.detail}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Panel>
  );
}

const PARTS = [
  { code: 'document.getElementById("btn")', label: "1. The target", desc: "Which element are we listening to?" },
  { code: '.addEventListener(', label: "2. Start listening", desc: "“Tell me when something happens to this element.”" },
  { code: '"click"', label: "3. The event type", desc: "Which action: click, mouseover, keydown, submit…" },
  { code: ', () => { alert("Button clicked!"); }', label: "4. The handler", desc: "A function that runs every time the event happens. Not before!" },
  { code: ");", label: "", desc: "" },
];

function Anatomy() {
  const [sel, setSel] = useState(0);
  return (
    <Panel title="Anatomy of the slide's example" sub="Click each coloured part.">
      <div className="mono" style={{ fontSize: 15, lineHeight: 2.2, background: "var(--code-bg)", color: "var(--code-ink)", padding: 14, borderRadius: 6, border: "2px solid var(--line)" }}>
        {PARTS.map((p, i) =>
          p.label ? (
            <button key={i} onClick={() => setSel(i)} style={{
              font: "inherit", border: 0, borderRadius: 4, padding: "2px 4px", cursor: "pointer",
              background: sel === i ? "var(--accent)" : "rgba(255,255,255,.08)", color: sel === i ? "var(--ink)" : "inherit",
            }}>{p.code}</button>
          ) : <span key={i}>{p.code}</span>
        )}
      </div>
      <div className="box pop" key={sel} style={{ marginTop: 12 }}>
        <div className="box-label">{PARTS[sel].label}</div>
        {PARTS[sel].desc}
      </div>
      <div style={{ marginTop: 12 }}>
        <button className="btn primary" id="btn-demo" onClick={() => alert("Button clicked!")}>Try the real button</button>
      </div>
    </Panel>
  );
}

export default function Events({ markDone }) {
  return (
    <>
      <h1>Events & event handling</h1>
      <p className="lead">
        An event is something that happens on the page: a click, a key press, the mouse moving over something.
        Event handling means telling JavaScript: “when <em>this</em> happens, run <em>that</em> code.”
      </p>

      <Playground />

      <h2>Listening for an event</h2>
      <Code>{`document.getElementById("btn").addEventListener("click", () => {
  alert("Button clicked!");
});`}</Code>
      <Anatomy />

      <h2>Common events</h2>
      <table className="table">
        <thead><tr><th>Event</th><th>Fires when…</th></tr></thead>
        <tbody>
          <tr><td className="mono">click</td><td>The element is clicked or tapped</td></tr>
          <tr><td className="mono">mouseover / mouseout</td><td>The pointer moves onto / off the element (hover)</td></tr>
          <tr><td className="mono">keydown</td><td>A key is pressed</td></tr>
          <tr><td className="mono">input</td><td>The text in a field changes</td></tr>
          <tr><td className="mono">submit</td><td>A form is sent</td></tr>
        </tbody>
      </table>

      <Note title="The event object">
        <p>
          The handler receives an object with details about what happened: <C>{'btn.addEventListener("click", (event) => { console.log(event.type); });'}</C>.
          For a key press, <C>event.key</C> tells you which key.
        </p>
      </Note>
      <Note kind="precise">
        <p>
          The slide says an event is “fired (initiated)”. Usually it's the user's action that fires it, but the browser fires some by itself
          too, like <C>load</C> when the page has finished loading.
        </p>
      </Note>

      <TryIt
        title="Try it: a click counter"
        hint="Run it, then click the button on the page. Next, add a listener for 'mouseover' that logs a message."
        html={`<button id="btn">Click me</button>
<p>Clicks: <strong id="count">0</strong></p>
<input id="name" placeholder="Type your name">
<p id="hello"></p>`}
        code={`let clicks = 0;

document.getElementById("btn").addEventListener("click", () => {
  clicks++;
  document.getElementById("count").textContent = clicks;
  console.log("Button clicked!", clicks);
});

document.getElementById("name").addEventListener("input", (event) => {
  document.getElementById("hello").textContent = "Hello, " + event.target.value;
});

console.log("Listeners added. Click the button or type your name.");`}
      />

      <Note kind="tip">
        <p>Point out that the arrow function in addEventListener is passed in to be run <em>later</em>. That's exactly what a callback is, which is the next lesson.</p>
      </Note>

      <Quiz
        onPass={markDone}
        questions={[
          { q: "Which method attaches an event handler to an element?", options: ["listen()", "addEventListener()", "onEvent()"], answer: 1, explain: "element.addEventListener(type, handler) is the standard way." },
          { q: "When does the handler function run?", options: ["Immediately when the page loads", "Every time the event happens", "Only once ever"], answer: 1, explain: "It runs each time the event fires, as many times as it happens." },
          { q: "Which event fires when the user presses a key?", options: ["keydown", "click", "submit"], answer: 0, explain: "keydown fires when a key is pressed." },
        ]}
      />
    </>
  );
}
