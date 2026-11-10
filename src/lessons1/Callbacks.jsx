import React, { useEffect, useRef, useState } from "react";
import Code, { C } from "../components/Code.jsx";
import { Note, Panel } from "../components/Bits.jsx";
import TryIt from "../components/TryIt.jsx";
import Quiz from "../components/Quiz.jsx";

const CODE = `function fetchData(callback) {
  setTimeout(() => callback("Data loaded"), 1000);
}

console.log("1. Asking for data…");
fetchData((message) => console.log("3. " + message));
console.log("2. This line does NOT wait");`;

// Which code line is active at each phase of the animation
const PHASES = [
  { line: 4, out: ["1. Asking for data…"], note: "The program starts and logs the first line." },
  { line: 5, out: ["1. Asking for data…"], note: "fetchData is called and handed our arrow function (the callback). It starts a 1-second timer and returns straight away.", waiting: true },
  { line: 6, out: ["1. Asking for data…", "2. This line does NOT wait"], note: "JavaScript doesn't sit and wait for the timer. It moves on to the next line.", waiting: true },
  { line: 1, out: ["1. Asking for data…", "2. This line does NOT wait", "3. Data loaded"], note: "One second later the timer goes off and fetchData calls our callback with \"Data loaded\". Called back!" },
];

function Timeline() {
  const [phase, setPhase] = useState(-1);
  const [progress, setProgress] = useState(0);
  const timers = useRef([]);

  const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  useEffect(() => clear, []);

  function play() {
    clear();
    setProgress(0);
    setPhase(0);
    const at = (ms, fn) => timers.current.push(setTimeout(fn, ms));
    at(700, () => setPhase(1));
    at(1400, () => setPhase(2));
    for (let i = 1; i <= 10; i++) at(700 + i * 100 * 1.4, () => setProgress(i * 10));
    at(2100, () => setPhase(3));
  }

  const p = PHASES[phase];
  return (
    <Panel title="Demo: the slide's callback, in slow motion" sub="Watch the order things happen in. Line 2 prints before line 3!">
      <div className="grid-2" style={{ alignItems: "start" }}>
        <div>
          <Code activeLine={p ? p.line : -1}>{CODE}</Code>
          <button className="btn primary" onClick={play}>{phase === -1 ? "Play" : "Play again"}</button>
        </div>
        <div>
          <div className="box-label">Timer inside fetchData (1 second)</div>
          <div style={{ height: 16, border: "2px solid var(--line)", borderRadius: 4, background: "#fff", margin: "6px 0 14px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progress}%`, background: progress === 100 ? "var(--green)" : "var(--accent)", transition: "width .14s linear" }} />
          </div>
          <div className="console" style={{ border: "2px solid var(--line)", borderRadius: 6, minHeight: 100 }}>
            <div className="cap">Console</div>
            {(p ? p.out : []).map((o, i) => <div key={i} className="ln pop">› {o}</div>)}
          </div>
          {p && <div className="box pop" key={phase} style={{ marginTop: 12 }}>{p.note}</div>}
        </div>
      </div>
    </Panel>
  );
}

export default function Callbacks({ markDone }) {
  return (
    <>
      <h1>Callbacks</h1>
      <p className="lead">
        A callback is a function you pass into another function, so that function can “call it back” later, when its job is done.
      </p>

      <Note title="An everyday picture">
        <p>
          At a busy restaurant you order, and they hand you a buzzer. You don't stand at the counter waiting; you sit down and chat.
          When the food is ready, the buzzer calls you back. The buzzer is the callback.
        </p>
      </Note>

      <h2>You've already used one</h2>
      <p>In the events lesson, the arrow function passed to <C>addEventListener</C> was a callback: the browser calls it back each time there's a click.</p>
      <Code>{`button.addEventListener("click", () => {   // ← this function is the callback
  console.log("clicked!");
});`}</Code>

      <h2>Callbacks for things that take time</h2>
      <p>
        Some jobs take a while: loading data from a server, waiting for a timer. JavaScript won't freeze while it waits. Instead you give it a
        callback to run when the job finishes. That's called <strong>asynchronous</strong> code.
      </p>
      <Timeline />
      <Note kind="precise">
        <p>
          <C>setTimeout(fn, 1000)</C> runs <C>fn</C> after <em>at least</em> 1000 milliseconds (1 second). The slide's <C>fetchData</C> doesn't
          really fetch anything; it uses a timer to pretend the data took a second to arrive, which is a common way to practise.
        </p>
      </Note>

      <h2>A callback you can swap</h2>
      <p>Callbacks also let one function do different jobs, depending on what you pass in:</p>
      <TryIt
        title="Try it: callbacks"
        hint="Write a subtract callback and pass it to calculate. Then change the 1000 in fetchData to 3000."
        code={`function calculate(a, b, operation) {
  return operation(a, b);   // call back whatever function we were given
}

const add = (x, y) => x + y;
const multiply = (x, y) => x * y;

console.log(calculate(4, 5, add));       // 9
console.log(calculate(4, 5, multiply));  // 20

// The slide's example
function fetchData(callback) {
  setTimeout(() => callback("Data loaded"), 1000);
}
fetchData((msg) => console.log(msg));
console.log("Waiting…");`}
      />

      <Note kind="warn" title="The problem with lots of callbacks">
        <p>When one slow step depends on another, callbacks end up nested inside callbacks, drifting to the right. People call this “callback hell”. Promises, in the next lesson, fix it.</p>
      </Note>
      <Code>{`getUser(id, (user) => {
  getOrders(user, (orders) => {
    getDetails(orders[0], (details) => {
      console.log(details);    // hard to read, harder to handle errors
    });
  });
});`}</Code>

      <Quiz
        onPass={markDone}
        questions={[
          { q: "What is a callback?", options: ["A function passed into another function to be called later", "A phone feature in JavaScript", "A variable that can't change"], answer: 0, explain: "It's handed over as an argument and called when the time is right." },
          { q: <>In the slow-motion demo, why does “2.” print before “3.”?</>, options: ["Line numbers are random", "JavaScript doesn't wait for the timer; it moves on and calls the callback later", "console.log is slow"], answer: 1, explain: "Async work happens in the background; the callback runs when it finishes." },
          { q: <>How long does <C>setTimeout(fn, 1000)</C> wait?</>, options: ["1000 seconds", "About 1 second", "1 minute"], answer: 1, explain: "The delay is in milliseconds: 1000 ms = 1 second." },
        ]}
      />
    </>
  );
}
