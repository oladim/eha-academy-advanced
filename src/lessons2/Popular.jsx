import React, { useState } from "react";
import Code from "../components/Code.jsx";
import { Note, Panel, Tabs } from "../components/Bits.jsx";
import Quiz from "../components/Quiz.jsx";

const ROWS = [
  ["Type", "Library (for UI)", "Full Framework", "Progressive Framework", "How much it does out of the box. “Progressive” means you can start small and add more of Vue as you need it."],
  ["Learning Curve", "Moderate", "Steep", "Gentle", "How long it takes a beginner to get productive."],
  ["Data Binding", "One-way", "Two-way", "Two-way", "Which way data flows between your code and the screen. See the demo below."],
  ["Language", "JavaScript/JSX", "TypeScript", "JavaScript", "What you write your code in. JSX is JavaScript with HTML-like tags; TypeScript is JavaScript with types."],
  ["Core Concept", "Component-based UI", "MVC architecture, Modules", "Component-based UI", "The main idea used to organise an app."],
  ["Ecosystem", "Large and flexible", "Opinionated and robust", "Growing and approachable", "The extra tools, libraries and community around it."],
];

function CompareTable() {
  const [row, setRow] = useState(0);
  return (
    <Panel title="The slide's comparison" sub="Click a row to see what it means.">
      <div style={{ overflowX: "auto" }}>
        <table className="table" style={{ margin: 0 }}>
          <thead><tr><th>Feature</th><th>React</th><th>Angular</th><th>Vue.js</th></tr></thead>
          <tbody>
            {ROWS.map((r, i) => (
              <tr key={r[0]} onClick={() => setRow(i)} style={{ cursor: "pointer", background: row === i ? "var(--accent-soft)" : undefined }}>
                <th>{r[0]}</th><td>{r[1]}</td><td>{r[2]}</td><td>{r[3]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="box pop" key={row} style={{ marginTop: 12 }}><div className="box-label">{ROWS[row][0]}</div>{ROWS[row][4]}</div>
    </Panel>
  );
}

function BindingDemo() {
  const [mode, setMode] = useState("One-way (React)");
  const [data, setData] = useState("Ada");
  const [typed, setTyped] = useState("Ada");
  const one = mode.startsWith("One");
  return (
    <Panel title="Demo: one-way vs two-way data binding" sub="Type in the input and watch the data.">
      <Tabs tabs={["One-way (React)", "Two-way (Angular, Vue)"]} value={mode} onChange={(m) => { setMode(m); setData("Ada"); setTyped("Ada"); }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 12 }}>
        <div className="box center"><div className="box-label">Data in your code</div><div className="mono" style={{ fontSize: 20 }}>name = "{data}"</div></div>
        <div className="mono center small">
          <div>→ shows in →</div>
          <div style={{ color: one ? "var(--ink-2)" : "var(--green)" }}>{one ? "← via onChange handler" : "← updates automatically"}</div>
        </div>
        <div className="box center">
          <div className="box-label">The input on screen</div>
          <input value={one ? typed : data} onChange={(e) => (one ? setTyped(e.target.value) : setData(e.target.value))}
            style={{ padding: "6px 8px", border: "2px solid var(--line)", borderRadius: 6, font: "inherit", width: "100%" }} />
        </div>
      </div>
      {one ? (
        <div className="small" style={{ marginTop: 12 }}>
          <p style={{ margin: "0 0 8px" }}>In React, data flows <strong>one way</strong>: from your code to the screen. To send typing back, you write a handler yourself. Right now there isn't one, so the data didn't change.</p>
          <button className="btn small primary" onClick={() => setData(typed)}>Run the handler: setName(input value)</button>
          <Code>{`<input value={name} onChange={(e) => setName(e.target.value)} />`}</Code>
        </div>
      ) : (
        <div className="small" style={{ marginTop: 12 }}>
          <p style={{ margin: "0 0 8px" }}>With <strong>two-way</strong> binding, the input and the data are tied together in both directions automatically.</p>
          <Code>{`<!-- Vue -->
<input v-model="name" />

<!-- Angular -->
<input [(ngModel)]="name" />`}</Code>
        </div>
      )}
    </Panel>
  );
}

const COUNTERS = {
  React: `function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  );
}`,
  Angular: `@Component({
  selector: "app-counter",
  template: \`
    <button (click)="count = count + 1">
      Clicked {{ count }} times
    </button>\`,
})
export class CounterComponent {
  count = 0;
}`,
  Vue: `<script setup>
import { ref } from "vue";
const count = ref(0);
</script>

<template>
  <button @click="count++">
    Clicked {{ count }} times
  </button>
</template>`,
};

function SameApp() {
  const [fw, setFw] = useState("React");
  const [n, setN] = useState(0);
  return (
    <Panel title="The same counter in all three" sub="Different syntax, same idea: data plus a template that shows it.">
      <Tabs tabs={Object.keys(COUNTERS)} value={fw} onChange={setFw} />
      <div className="grid-2" style={{ alignItems: "center" }}>
        <Code>{COUNTERS[fw]}</Code>
        <div className="center"><button className="btn primary" onClick={() => setN(n + 1)}>Clicked {n} times</button><p className="small muted">All three produce this.</p></div>
      </div>
    </Panel>
  );
}

export default function Popular({ markDone }) {
  return (
    <>
      <h1>React, Angular and Vue</h1>
      <p className="lead">
        These are the three most popular choices for building UIs today. They solve the same problems in different ways.
      </p>

      <CompareTable />
      <BindingDemo />
      <SameApp />

      <Note kind="precise">
        <p>
          A few table cells are simplified. Modern Angular is also component-based; “MVC” describes the older AngularJS more than today's Angular.
          Vue's two-way binding comes from <code className="inline">v-model</code>, but data still flows one way from parent to child components, like React.
          And all three can be written in TypeScript if you want.
        </p>
      </Note>
      <Note kind="tip" title="Which should beginners learn?">
        <p>Any of them is a good first framework, and the ideas transfer. React has the largest job market and community, which is why this course uses it.</p>
      </Note>

      <Quiz
        onPass={markDone}
        questions={[
          { q: "According to the slide, which has the gentlest learning curve?", options: ["React", "Angular", "Vue.js"], answer: 2, explain: "Vue is known for being approachable." },
          { q: "What kind of data binding does React use?", options: ["One-way", "Two-way", "None"], answer: 0, explain: "Data flows down to the screen; you send changes back with event handlers." },
          { q: "Which one is written in TypeScript by default?", options: ["React", "Angular", "Vue.js"], answer: 1, explain: "Angular uses TypeScript out of the box." },
        ]}
      />
    </>
  );
}
