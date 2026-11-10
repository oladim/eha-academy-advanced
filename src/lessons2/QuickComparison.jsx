import React from "react";
import { Note } from "../components/Bits.jsx";
import TryIt from "../components/TryIt.jsx";
import ReactTryIt from "../components/ReactTryIt.jsx";
import Quiz from "../components/Quiz.jsx";

const VANILLA_HTML = `<h2>My tasks</h2>
<form id="form">
  <input id="task" placeholder="New task">
  <button>Add</button>
</form>
<p id="left"></p>
<ul id="list"></ul>
<style>.done { text-decoration: line-through; color: #888; } li { cursor: pointer; padding: 3px 0; }</style>`;

const VANILLA_JS = `// 1. Keep the data
const tasks = [{ text: "Learn JavaScript", done: true }, { text: "Learn React", done: false }];

// 2. Find every element we need to update by hand
const form = document.getElementById("form");
const input = document.getElementById("task");
const list = document.getElementById("list");
const left = document.getElementById("left");

// 3. Write a function that rebuilds the list in the DOM
function render() {
  list.innerHTML = "";
  for (const task of tasks) {
    const li = document.createElement("li");
    li.textContent = task.text;
    if (task.done) li.classList.add("done");
    li.addEventListener("click", () => {
      task.done = !task.done;
      render();                 // remember to re-draw!
    });
    list.appendChild(li);
  }
  left.textContent = tasks.filter((t) => !t.done).length + " left";
}

// 4. Wire up the form
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!input.value.trim()) return;
  tasks.push({ text: input.value, done: false });
  input.value = "";
  render();                     // remember to re-draw!
});

render();
console.log("Vanilla to-do list ready");`;

const REACT_CODE = `import { useState } from 'react';

function App() {
  const [tasks, setTasks] = useState([
    { text: 'Learn JavaScript', done: true },
    { text: 'Learn React', done: false },
  ]);
  const [text, setText] = useState('');

  const add = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setTasks([...tasks, { text, done: false }]);
    setText('');
  };

  const toggle = (i) =>
    setTasks(tasks.map((t, j) => (j === i ? { ...t, done: !t.done } : t)));

  return (
    <div>
      <h2>My tasks</h2>
      <form onSubmit={add}>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="New task" />
        <button>Add</button>
      </form>
      <p>{tasks.filter((t) => !t.done).length} left</p>
      <ul>
        {tasks.map((t, i) => (
          <li key={i} onClick={() => toggle(i)} style={{ cursor: 'pointer',
            textDecoration: t.done ? 'line-through' : 'none', color: t.done ? '#888' : 'inherit' }}>
            {t.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;`;

export default function QuickComparison({ markDone }) {
  return (
    <>
      <h1>Without vs with React</h1>
      <p className="lead">
        Same feature, two ways. Below is a small to-do list: add a task, click a task to mark it done, and see how many are left.
        Build it in plain JavaScript, then in React, and compare.
      </p>

      <Note title="From the slide">
        <p>
          The original slide links two CodePen demos by Chima Nwadike: <a href="https://codepen.io/Chima-Nwadike/pen/myemoVw" target="_blank" rel="noreferrer">feature without React</a> and{" "}
          <a href="https://codepen.io/Chima-Nwadike/pen/GgpmeZM" target="_blank" rel="noreferrer">feature with React</a>. Open them in class too; the to-do list here shows the same idea and runs right on this page.
        </p>
      </Note>

      <h2>1. Without React (plain JavaScript)</h2>
      <p>You keep the data <em>and</em> manage the page: find elements, create list items, attach listeners, and remember to re-draw after every change.</p>
      <TryIt title="Plain JavaScript to-do list" hint="Run it, then add a task and click tasks on the page." html={VANILLA_HTML} code={VANILLA_JS} />

      <h2>2. With React</h2>
      <p>You keep the data in state and describe what the list should look like. React works out the DOM changes.</p>
      <ReactTryIt title="Live React to-do list" hint="Add a task and click tasks in the preview. There's no getElementById, no createElement, no manual render()." code={REACT_CODE} />

      <h2>What's different?</h2>
      <table className="table">
        <thead><tr><th></th><th>Plain JavaScript</th><th>React</th></tr></thead>
        <tbody>
          <tr><th>Style</th><td><strong>Imperative</strong>: you give the browser step-by-step instructions</td><td><strong>Declarative</strong>: you describe the result for the current data</td></tr>
          <tr><th>Updating the page</th><td>You find and change elements yourself</td><td>Change state; React updates the DOM</td></tr>
          <tr><th>Forget to re-draw?</th><td>The page shows stale data (a bug)</td><td>Can't happen: every state change re-renders</td></tr>
          <tr><th>Reuse</th><td>Copy code or write helper functions</td><td>Turn a piece into a component and reuse it</td></tr>
          <tr><th>Setup</th><td>None, works in any browser</td><td>Needs Node.js and a build tool</td></tr>
        </tbody>
      </table>

      <Note kind="tip">
        <p>Ask students to add a “Delete” feature to both versions. They'll feel the difference in how much code each one needs.</p>
      </Note>

      <Quiz
        onPass={markDone}
        questions={[
          { q: "In the plain JavaScript version, what must you remember after changing the data?", options: ["Nothing", "To call render() so the page updates", "To reload the browser"], answer: 1, explain: "Forgetting leaves the page showing old data." },
          { q: "React's style is called…", options: ["Imperative", "Declarative", "Procedural"], answer: 1, explain: "You declare what the UI should look like; React handles how." },
          { q: "Which version needs no build tool or setup?", options: ["Plain JavaScript", "React"], answer: 0, explain: "Plain JS runs directly in the browser." },
        ]}
      />
    </>
  );
}
