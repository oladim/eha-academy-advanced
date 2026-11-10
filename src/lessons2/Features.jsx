import React, { useEffect, useRef, useState } from "react";
import { Note, Panel } from "../components/Bits.jsx";
import Quiz from "../components/Quiz.jsx";

/* ---------- One tiny live demo per feature ---------- */
function ComponentsDemo() {
  const Card = ({ emoji, name, price }) => (
    <div className="box center" style={{ padding: 10 }}>
      <div style={{ fontSize: 30 }}>{emoji}</div><strong>{name}</strong><div className="small">₦{price}</div>
    </div>
  );
  return (
    <>
      <p className="small" style={{ marginTop: 0 }}>One <code className="inline">{"<Card />"}</code> component, written once, reused three times with different data:</p>
      <div className="grid-3"><Card emoji="🍍" name="Pineapple" price="1,200" /><Card emoji="🥥" name="Coconut" price="800" /><Card emoji="🍌" name="Banana" price="500" /></div>
    </>
  );
}

function StateDemo() {
  const [n, setN] = useState(0);
  return (
    <>
      <p className="small" style={{ marginTop: 0 }}>State is data that changes over time. Change it and the screen re-draws itself.</p>
      <div className="row"><button className="btn" onClick={() => setN(n - 1)}>−</button><span className="mono" style={{ fontSize: 34, minWidth: 60, textAlign: "center" }}>{n}</span><button className="btn" onClick={() => setN(n + 1)}>+</button></div>
      <div className="code small" style={{ marginTop: 10 }}>{`state: { count: ${n} }`}</div>
    </>
  );
}

function RoutingDemo() {
  const [page, setPage] = useState("home");
  const pages = { home: "🏠 Welcome to our app!", about: "ℹ️ We teach JavaScript in Lagos.", contact: "✉️ Write to hello@example.com" };
  return (
    <>
      <p className="small" style={{ marginTop: 0 }}>Click the links. The view and address change, but the page never reloads.</p>
      <div style={{ border: "2px solid var(--line)", borderRadius: 8, overflow: "hidden" }}>
        <div className="mono small" style={{ padding: "6px 10px", background: "var(--paper-2)", borderBottom: "2px solid var(--line)" }}>myapp.com/{page === "home" ? "" : page}</div>
        <div className="row" style={{ padding: "8px 10px", borderBottom: "1px solid var(--soft-line)" }}>
          {Object.keys(pages).map((p) => <button key={p} className={`btn small ${page === p ? "selected" : ""}`} onClick={() => setPage(p)}>{p}</button>)}
        </div>
        <div className="pop" key={page} style={{ padding: 16 }}>{pages[page]}</div>
      </div>
    </>
  );
}

function BindingDemo() {
  const [name, setName] = useState("Ada");
  return (
    <>
      <p className="small" style={{ marginTop: 0 }}>The input and the greeting are both connected to the same data. Type, and both stay in step.</p>
      <input value={name} onChange={(e) => setName(e.target.value)} aria-label="Your name" style={{ padding: "8px 10px", border: "2px solid var(--line)", borderRadius: 6, font: "inherit" }} />
      <h3 style={{ margin: "12px 0 6px", fontFamily: "var(--font-display)" }}>Hello, {name || "stranger"}! 👋</h3>
      <button className="btn small" onClick={() => setName("Chima")}>Set data to “Chima”</button>
      <span className="small muted"> ← changing the data updates the input too</span>
    </>
  );
}

function VdomDemo() {
  const start = ["Rice", "Beans", "Yam", "Garri", "Eggs"];
  const [items, setItems] = useState(start);
  const [changed, setChanged] = useState(-1);
  function change() {
    const i = Math.floor(Math.random() * items.length);
    const next = [...items];
    next[i] = next[i] === start[i] ? next[i] + " ✓" : start[i];
    setItems(next);
    setChanged(i);
  }
  return (
    <>
      <p className="small" style={{ marginTop: 0 }}>React keeps a quick copy of the page in memory. When data changes, it compares the new copy with the old one and only touches what's different.</p>
      <button className="btn small primary" onClick={change}>Change one item</button>
      <div className="grid-2" style={{ marginTop: 12 }}>
        <div className="box"><div className="box-label">Virtual DOM (compared in memory)</div>{items.map((x, i) => <div key={i} className="mono small" style={{ padding: "2px 0" }}>{"<li>"}{x}{"</li>"}</div>)}</div>
        <div className="box"><div className="box-label">Real DOM updates</div>
          {items.map((x, i) => <div key={i + x} className={i === changed ? "mono small flash" : "mono small"} style={{ padding: "2px 4px", opacity: i === changed ? 1 : 0.4 }}>{i === changed ? "✏️ updated: " : "untouched: "}{x}</div>)}
        </div>
      </div>
      {changed >= 0 && <p className="small" style={{ marginBottom: 0 }}><strong>1</strong> real update instead of re-drawing all <strong>5</strong> items.</p>}
    </>
  );
}

function LifecycleChild({ log }) {
  const [ticks, setTicks] = useState(0);
  const first = useRef(true);
  useEffect(() => { log("🟢 mounted: added to the page"); return () => log("🔴 unmounted: removed from the page"); }, [log]);
  useEffect(() => { if (first.current) { first.current = false; return; } log(`🟡 updated: ticks is now ${ticks}`); }, [ticks, log]);
  return <div className="box" style={{ background: "var(--accent-soft)" }}>I'm a component. <button className="btn small" onClick={() => setTicks(ticks + 1)}>Update me ({ticks})</button></div>;
}
function LifecycleDemo() {
  const [show, setShow] = useState(false);
  const [lines, setLines] = useState([]);
  const log = React.useCallback((t) => setLines((l) => [t, ...l].slice(0, 6)), []);
  return (
    <>
      <p className="small" style={{ marginTop: 0 }}>A component is born (mounted), changes (updated), and is removed (unmounted).</p>
      <button className="btn small primary" onClick={() => setShow(!show)}>{show ? "Remove the component" : "Add the component"}</button>
      <div style={{ margin: "10px 0", minHeight: 50 }}>{show && <LifecycleChild log={log} />}</div>
      <div className="code small">{lines.length ? lines.join("\n") : "// lifecycle events appear here"}</div>
    </>
  );
}

function CliDemo() {
  const steps = [
    ["npm create vite@latest my-app -- --template react", "✔ Scaffolding project in ./my-app… Done."],
    ["cd my-app && npm install", "added 251 packages in 12s"],
    ["npm run dev", "➜ Local: http://localhost:5173/"],
  ];
  const [n, setN] = useState(0);
  return (
    <>
      <p className="small" style={{ marginTop: 0 }}>Command line tools create, run and build projects for you from the terminal.</p>
      <div className="code small" style={{ minHeight: 120 }}>
        {steps.slice(0, n).map(([c, o]) => `$ ${c}\n${o}\n`).join("")}{n < steps.length ? "$ █" : ""}
      </div>
      <button className="btn small primary" onClick={() => setN(n < steps.length ? n + 1 : 0)}>{n < steps.length ? "Run next command" : "Start over"}</button>
    </>
  );
}

function EventsDemo() {
  const [log, setLog] = useState([]);
  const add = (t) => setLog((l) => [t, ...l].slice(0, 5));
  return (
    <>
      <p className="small" style={{ marginTop: 0 }}>Components respond to what users do: clicks, typing, hovering.</p>
      <div className="row">
        <button className="btn" onClick={() => add("click on the button")}>Click me</button>
        <input placeholder="Type…" onChange={(e) => add(`typed: “${e.target.value}”`)} style={{ padding: "7px 10px", border: "2px solid var(--line)", borderRadius: 6, font: "inherit" }} />
        <span className="box small" onMouseEnter={() => add("mouse entered the box")} style={{ padding: "7px 10px" }}>Hover me</span>
      </div>
      <div className="code small" style={{ marginTop: 10 }}>{log.length ? log.join("\n") : "// events appear here"}</div>
    </>
  );
}

const FEATURES = [
  { name: "Components", icon: "🧩", desc: "Reusable UI blocks that build the structure of your app.", Demo: ComponentsDemo },
  { name: "State management", icon: "🔢", desc: "Handles dynamic data that changes over time in your app.", Demo: StateDemo },
  { name: "Routing", icon: "🧭", desc: "Lets you switch pages or views without reloading the browser.", Demo: RoutingDemo },
  { name: "Data binding", icon: "🔗", desc: "Connects UI elements to data, updating both as needed.", Demo: BindingDemo },
  { name: "Virtual DOM", icon: "🪞", desc: "A fast in-memory copy of the real DOM for quick updates.", Demo: VdomDemo },
  { name: "Component lifecycle", icon: "🔄", desc: "Stages in a component's lifetime.", Demo: LifecycleDemo },
  { name: "Command line tools", icon: "⌨️", desc: "Help you create, build, and run apps from the terminal.", Demo: CliDemo },
  { name: "Event handling", icon: "👆", desc: "Lets components respond to user actions like clicks or typing.", Demo: EventsDemo },
];

export default function Features({ markDone }) {
  const [sel, setSel] = useState(0);
  const F = FEATURES[sel];
  return (
    <>
      <h1>Features & capabilities</h1>
      <p className="lead">
        Most modern frameworks share the same eight building blocks. Every demo below is running live, built with React itself.
      </p>

      <Panel title="Demo: the eight features, live" sub="Pick a feature to try it.">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 8, marginBottom: 18 }}>
          {FEATURES.map((f, i) => (
            <button key={f.name} onClick={() => setSel(i)} style={{
              border: "2px solid var(--line)", borderRadius: 8, padding: "8px 10px", cursor: "pointer", textAlign: "left", fontWeight: 700, fontSize: 14,
              background: sel === i ? "var(--accent)" : "#fff",
            }}>
              <span style={{ marginRight: 6 }}>{f.icon}</span>{f.name}
            </button>
          ))}
        </div>
        <div className="pop" key={sel} style={{ borderTop: "2px dashed var(--soft-line)", paddingTop: 14 }}>
          <h3 style={{ margin: "0 0 2px", fontFamily: "var(--font-display)" }}>{F.icon} {F.name}</h3>
          <p style={{ marginTop: 0 }}>{F.desc}</p>
          <F.Demo />
        </div>
      </Panel>

      <Note kind="precise">
        <p>
          Not every framework has every feature built in. React itself covers components, state, the virtual DOM, lifecycle (through hooks)
          and events; routing comes from a separate library like React Router. Data binding in React is one-way: data flows into the input,
          and an event handler sends changes back, which is exactly how the data-binding demo above works.
        </p>
      </Note>

      <Quiz
        onPass={markDone}
        questions={[
          { q: "Which feature lets you change pages without reloading the browser?", options: ["Routing", "Virtual DOM", "Props"], answer: 0, explain: "Routing swaps views inside the same page." },
          { q: "What is the virtual DOM?", options: ["A second browser", "An in-memory copy of the page used to work out the smallest set of real updates", "A CSS file"], answer: 1, explain: "React compares copies and only changes what's different." },
          { q: "“Mounted, updated, unmounted” are stages of…", options: ["The component lifecycle", "Routing", "The command line"], answer: 0, explain: "They describe a component's life on the page." },
        ]}
      />
    </>
  );
}
