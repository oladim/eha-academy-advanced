import React, { useState } from "react";
import Code, { C } from "../components/Code.jsx";
import { Note, Panel, Tabs } from "../components/Bits.jsx";
import TryIt from "../components/TryIt.jsx";
import Quiz from "../components/Quiz.jsx";

const WAYS = {
  "Inside a <script> tag": {
    code: `<script type="text/javascript">
  alert("JavaScript is working in your browser!");
</script>`,
    explain: "Write the code directly in the HTML page, between <script> and </script>. Quick for small experiments.",
    good: "Fast to try something out.",
    bad: "Gets messy as the code grows; can't reuse it on other pages.",
  },
  "External .js file": {
    code: `<!-- index.html -->
<script type="text/javascript" src="path/to/file.js"></script>

// file.js
alert("Hello from file.js!");`,
    explain: "Put the code in its own file ending in .js and link it with the src attribute. This is how real projects do it.",
    good: "Clean, reusable on many pages, the browser can cache it.",
    bad: "One more file to manage (worth it).",
  },
  "As an HTML attribute": {
    code: `<a href="javascript:alert('JavaScript alert!');">
  Link
</a>`,
    explain: "Put a tiny piece of code directly inside an HTML attribute. You'll see this in older code.",
    good: "Very short for one-off actions.",
    bad: "Mixes code into HTML and is hard to maintain. Avoid in new code.",
  },
};

function WaysDemo() {
  const [tab, setTab] = useState(Object.keys(WAYS)[0]);
  const w = WAYS[tab];
  return (
    <Panel title="Three ways to add JavaScript to a page" sub="Pick a tab to compare them.">
      <Tabs tabs={Object.keys(WAYS)} value={tab} onChange={setTab} />
      <p style={{ marginTop: 0 }}>{w.explain}</p>
      <Code>{w.code}</Code>
      <div className="grid-2 small">
        <div><span className="ok">Good: </span>{w.good}</div>
        <div><span className="bad">Downside: </span>{w.bad}</div>
      </div>
      <div style={{ marginTop: 14 }}>
        <button className="btn small primary" onClick={() => alert("JavaScript is working in your browser!")}>
          Run the alert to see what it does
        </button>
      </div>
    </Panel>
  );
}

const PARTS = [
  { text: "let", label: "keyword", desc: "A reserved word that tells JavaScript what you're doing (here: making a variable)." },
  { text: " " },
  { text: "greeting", label: "name", desc: "The name you choose. Case-sensitive: greeting and Greeting are different." },
  { text: " " },
  { text: "=", label: "operator", desc: "The assignment operator: put the value on the right into the name on the left." },
  { text: " " },
  { text: '"Hi"', label: "value", desc: "The data being stored. Text goes inside quotes." },
  { text: ";", label: "semicolon", desc: "Marks the end of the statement. Optional in JavaScript, but a good habit." },
];

function Anatomy() {
  const [sel, setSel] = useState(2);
  return (
    <Panel title="Anatomy of a statement" sub="A statement is one instruction. Click each part.">
      <div className="mono" style={{ fontSize: 30, display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: 0, margin: "8px 0 16px" }}>
        {PARTS.map((p, i) =>
          p.label ? (
            <button
              key={i}
              onClick={() => setSel(i)}
              style={{
                font: "inherit", border: "2px solid " + (sel === i ? "var(--line)" : "transparent"),
                background: sel === i ? "var(--accent)" : "var(--paper-2)", borderRadius: 6, padding: "0 6px", cursor: "pointer",
              }}
            >
              {p.text}
            </button>
          ) : (
            <span key={i}>&nbsp;</span>
          )
        )}
      </div>
      <div className="box pop" key={sel}>
        <div className="box-label">{PARTS[sel].label}</div>
        {PARTS[sel].desc}
      </div>
    </Panel>
  );
}

export default function Syntax({ markDone }) {
  return (
    <>
      <h1>JavaScript syntax</h1>
      <p className="lead">
        Syntax is the grammar of a programming language: the rules for how code must be written so the computer understands it.
      </p>

      <h2>Getting JavaScript onto a page</h2>
      <p>
        In the browser, JavaScript is made of <strong>statements</strong> (instructions) that live inside an HTML page,
        usually through a <C>{"<script>"}</C> tag. Outside the browser, the same language runs on <strong>Node.js</strong> to build server apps.
      </p>
      <WaysDemo />
      <Note kind="precise">
        <p>
          The <C>type="text/javascript"</C> part is optional today: browsers assume JavaScript. <C>{'<script src="file.js"></script>'}</C> is enough.
          For links, the modern way is to add a click listener with JavaScript (lesson 11) instead of <C>javascript:</C> in the href.
        </p>
      </Note>

      <Anatomy />

      <h2>The rules from the slide</h2>

      <h3>1. JavaScript is case-sensitive</h3>
      <p>Upper and lower case letters are different. <C>name</C>, <C>Name</C> and <C>NAME</C> are three different things.</p>
      <TryIt
        title="Try it: case matters"
        hint="Run it and read the error. Then change Name to name on line 2 and run it again."
        code={`let name = "Ada";
console.log(Name);`}
      />

      <h3>2. Semicolons are optional</h3>
      <p>Each statement can end with <C>;</C>. If you leave it out, JavaScript usually adds it for you.</p>
      <div className="grid-2">
        <Code label="With semicolons">{`let a = 1;
let b = 2;
console.log(a + b);`}</Code>
        <Code label="Without: also works">{`let a = 1
let b = 2
console.log(a + b)`}</Code>
      </div>
      <Note kind="tip">
        <p>Pick one style and stick to it. Many teams use semicolons because in a few rare cases leaving them out changes what the code means.</p>
      </Note>

      <h3>3. Code blocks live inside curly braces</h3>
      <p>Braces <C>{"{ }"}</C> group several statements into one block, for example the body of a function or an <C>if</C>.</p>
      <Code>{`if (score > 50) {
  console.log("You passed!");   // inside the block
  console.log("Well done.");    // also inside
}
console.log("Always runs");      // outside the block`}</Code>

      <h3>4. Comments are notes for humans</h3>
      <p>JavaScript ignores comments completely. Use them to explain <em>why</em> your code does something.</p>
      <TryIt
        title="Try it: comments are ignored"
        hint="Only one line prints. Remove the // on line 3 to switch the second line on."
        code={`// Single-line comment: everything after // is ignored
console.log("I run!");
// console.log("I am switched off");

/* Multi-line comment:
   everything between the markers
   is ignored too */`}
      />

      <Quiz
        onPass={markDone}
        questions={[
          { q: <>Which is the recommended way to add JavaScript in a real project?</>, options: ["Inside an href attribute", "An external .js file linked with src", "Copying it into every page"], answer: 1, explain: "External files keep code organised and reusable across pages." },
          { q: <>Are <C>score</C> and <C>Score</C> the same variable?</>, options: ["Yes", "No, JavaScript is case-sensitive"], answer: 1, explain: "Different capitals mean different names." },
          { q: <>What does JavaScript do with <C>{"/* ... */"}</C>?</>, options: ["Runs it twice", "Ignores it: it's a multi-line comment", "Shows it on the page"], answer: 1, explain: "Comments are notes for people and are never run." },
        ]}
      />
    </>
  );
}
