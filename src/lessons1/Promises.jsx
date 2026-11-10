import React, { useEffect, useRef, useState } from "react";
import Code, { C } from "../components/Code.jsx";
import { Note, Panel } from "../components/Bits.jsx";
import TryIt from "../components/TryIt.jsx";
import Quiz from "../components/Quiz.jsx";

function StateBox({ name, desc, on, color }) {
  return (
    <div style={{
      border: "2px solid var(--line)", borderRadius: 8, padding: "10px 12px", textAlign: "center",
      background: on ? color : "#fff", opacity: on ? 1 : 0.55, transform: on ? "scale(1.04)" : "none",
      transition: "all .25s", boxShadow: on ? "3px 3px 0 var(--line)" : "none",
    }}>
      <strong style={{ fontFamily: "var(--font-display)" }}>{name}</strong>
      <div className="small">{desc}</div>
    </div>
  );
}

function PromiseMachine() {
  const [success, setSuccess] = useState(true);
  const [state, setState] = useState("idle"); // idle | pending | fulfilled | rejected
  const t = useRef(null);
  useEffect(() => () => clearTimeout(t.current), []);

  function run() {
    clearTimeout(t.current);
    setState("pending");
    t.current = setTimeout(() => setState(success ? "fulfilled" : "rejected"), 1500);
  }

  const code = `const myPromise = new Promise((resolve, reject) => {
  const success = ${success}; // Simulate success or failure
  if (success) {
    resolve("Operation succeeded!");
  } else {
    reject("Operation failed!");
  }
});

myPromise
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.error(error);
  });`;

  // 0-based line numbers in `code` above
  const handlerLine = { idle: -1, pending: success ? 3 : 5, fulfilled: 11, rejected: 14 }[state];

  return (
    <Panel title="Demo: the slide's promise, step by step" sub="Flip the switch, run it, and watch which path the promise takes. (A 1.5s delay is added so you can see the pending state.)">
      <div className="row" style={{ marginBottom: 12 }}>
        <span className="mono small">const success =</span>
        <button className={`btn small ${success ? "selected" : ""}`} onClick={() => { setSuccess(true); setState("idle"); }}>true</button>
        <button className={`btn small ${!success ? "selected" : ""}`} onClick={() => { setSuccess(false); setState("idle"); }}>false</button>
        <button className="btn primary" onClick={run} disabled={state === "pending"}>Run the promise</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 10, alignItems: "center", margin: "6px 0 18px" }}>
        <StateBox name="pending" desc="Waiting for an answer…" on={state === "pending"} color="var(--accent)" />
        <div className="mono center" style={{ lineHeight: 1.3 }}>
          <div style={{ color: state === "fulfilled" ? "var(--green)" : "var(--soft-line)" }}>resolve →</div>
          <div style={{ color: state === "rejected" ? "var(--red)" : "var(--soft-line)" }}>reject →</div>
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          <StateBox name="fulfilled" desc=".then() runs" on={state === "fulfilled"} color="var(--green-soft)" />
          <StateBox name="rejected" desc=".catch() runs" on={state === "rejected"} color="var(--red-soft)" />
        </div>
      </div>

      <div className="grid-2" style={{ alignItems: "start" }}>
        <Code activeLine={handlerLine}>{code}</Code>
        <div>
          <div className="console" style={{ border: "2px solid var(--line)", borderRadius: 6 }}>
            <div className="cap">Console</div>
            {state === "idle" && <div className="empty">Press “Run the promise”.</div>}
            {state === "pending" && <div className="empty">…nothing yet, the promise is pending</div>}
            {state === "fulfilled" && <div className="ln pop">› Operation succeeded!</div>}
            {state === "rejected" && <div className="ln err pop">✖ Operation failed!</div>}
          </div>
          <div className="box" style={{ marginTop: 12 }}>
            {state === "idle" && "A promise starts out pending. Only one of resolve or reject will ever be called."}
            {state === "pending" && "The promise has been made but not kept yet. Your other code keeps running meanwhile."}
            {state === "fulfilled" && <>resolve() was called, so the promise is <strong>fulfilled</strong>. The value goes to <C>.then()</C>; <C>.catch()</C> is skipped.</>}
            {state === "rejected" && <>reject() was called, so the promise is <strong>rejected</strong>. <C>.then()</C> is skipped and the error goes to <C>.catch()</C>.</>}
          </div>
        </div>
      </div>
    </Panel>
  );
}

export default function Promises({ markDone }) {
  return (
    <>
      <h1>Promises</h1>
      <p className="lead">
        A promise is an object that stands for a result you don't have yet. It's a placeholder that says: “I'll give you the
        answer when it's ready, or tell you if something went wrong.”
      </p>

      <Note title="An everyday picture">
        <p>
          You order shoes online and get an order number. You don't have the shoes yet, but you have a <strong>promise</strong> of them.
          Later, either the shoes arrive (<strong>fulfilled</strong>) or you get a “sorry, out of stock” message (<strong>rejected</strong>).
          Until then, the order is <strong>pending</strong>.
        </p>
      </Note>

      <h2>The three states</h2>
      <table className="table">
        <tbody>
          <tr><th>pending</th><td>Still waiting. The starting state.</td></tr>
          <tr><th>fulfilled</th><td>It worked. <C>resolve(value)</C> was called, and <C>.then()</C> receives the value.</td></tr>
          <tr><th>rejected</th><td>It failed. <C>reject(error)</C> was called, and <C>.catch()</C> receives the error.</td></tr>
        </tbody>
      </table>

      <PromiseMachine />

      <h2>Why promises beat nested callbacks</h2>
      <p>Each step returns a promise, so steps line up one under another instead of nesting deeper and deeper. One <C>.catch()</C> at the end handles an error from any step.</p>
      <div className="grid-2">
        <Code label="Callbacks: nested">{`getUser(id, (user) => {
  getOrders(user, (orders) => {
    console.log(orders);
  });
});`}</Code>
        <Code label="Promises: a flat chain">{`getUser(id)
  .then((user) => getOrders(user))
  .then((orders) => console.log(orders))
  .catch((err) => console.error(err));`}</Code>
      </div>

      <Note kind="precise">
        <p>
          In the slide's example the promise settles instantly, because nothing in it takes time. Real promises usually wrap slow work,
          like a network request. The <C>fetch()</C> function you'll meet next already returns a promise for you.
          It's also good practice to reject with an <C>Error</C>: <C>reject(new Error("Operation failed!"))</C>.
        </p>
      </Note>

      <TryIt
        title="Try it: make and keep a promise"
        hint="Change success to false and run again. Then change 1000 to 3000 and notice the wait."
        code={`const myPromise = new Promise((resolve, reject) => {
  const success = true; // Simulate success or failure
  setTimeout(() => {
    if (success) {
      resolve("Operation succeeded!");
    } else {
      reject("Operation failed!");
    }
  }, 1000);
});

console.log("Promise created. Waiting…");

myPromise
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.error(error);
  });`}
      />

      <Quiz
        onPass={markDone}
        questions={[
          { q: "What state is a promise in before it has a result?", options: ["fulfilled", "pending", "rejected"], answer: 1, explain: "Every promise starts out pending." },
          { q: <>If the promise calls <C>reject()</C>, which handler runs?</>, options: [".then()", ".catch()", "Both"], answer: 1, explain: "Rejections skip .then() and go to .catch()." },
          { q: "Can a promise be fulfilled and then later rejected?", options: ["Yes", "No, once settled it stays that way"], answer: 1, explain: "A promise settles only once." },
        ]}
      />
    </>
  );
}
