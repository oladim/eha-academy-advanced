import React, { useEffect, useState } from "react";
import TryIt from "../components/TryIt.jsx";
import { Note } from "../components/Bits.jsx";
import { C } from "../components/Code.jsx";

const LINE = 'console.log("Hello, JavaScript!");';

function TypedLine() {
  const reduce = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const [n, setN] = useState(reduce ? LINE.length : 0);
  useEffect(() => {
    if (n >= LINE.length) return;
    const t = setTimeout(() => setN((x) => x + 1), 45);
    return () => clearTimeout(t);
  }, [n]);
  const finished = n >= LINE.length;
  return (
    <div className="hero-code" aria-label={LINE}>
      <span style={{ color: "#7f8a96" }}>&gt; </span>
      {LINE.slice(0, n)}
      {!finished && <span className="caret" />}
      {finished && (
        <div className="pop" style={{ color: "#9fdc8b", marginTop: 6 }}>Hello, JavaScript!</div>
      )}
    </div>
  );
}

const objectives = [
  { title: "Understand the basics of JavaScript", body: "What it is, where it runs, and how it fits with HTML and CSS.", lessons: "Lessons 2–3" },
  { title: "Learn core syntax, variables and functions", body: "Store data, work with values, and write reusable blocks of code.", lessons: "Lessons 3–7" },
  { title: "Explore the DOM, promises and async JavaScript", body: "Change a web page with code, react to clicks, and handle work that takes time.", lessons: "Lessons 8–14" },
  { title: "Q&A", body: "Common beginner questions answered, plus a final review quiz.", lessons: "Lesson 15" },
];

export default function Welcome() {
  return (
    <>
      <h1>JavaScript Fundamentals</h1>
      <p className="lead">
        A hands-on companion to the slides by Chima Nwadike. Every slide becomes a short lesson with a plain
        explanation, a picture or live demo, code you can run, and a quick check.
      </p>

      <TypedLine />

      <h2>What you will be able to do</h2>
      <div className="grid-2">
        {objectives.map((o, i) => (
          <div className="box" key={o.title}>
            <div className="box-label">Objective {i + 1} · {o.lessons}</div>
            <strong style={{ display: "block", fontFamily: "var(--font-display)", fontSize: 19, margin: "4px 0" }}>{o.title}</strong>
            <span className="muted">{o.body}</span>
          </div>
        ))}
      </div>

      <h2>How to use these lessons</h2>
      <ul>
        <li>Go in order using the list on the left, or the button at the bottom of each page.</li>
        <li><strong>Demos</strong> are boxes with a teal shadow. Click the buttons inside them and watch what changes.</li>
        <li><strong>Try it yourself</strong> boxes are real code editors. Change the code, press <strong>Run code</strong>, and read the console underneath.</li>
        <li><strong>Quick checks</strong> at the end of a lesson tell you if the idea stuck. Passing one marks the lesson done.</li>
      </ul>

      <TryIt
        title="Your first line of JavaScript"
        hint="Change the text between the quotes, then press Run code."
        code={`console.log("Hello, JavaScript!");
console.log("My name is ...");`}
      />

      <Note title="What is console.log?">
        <p>
          <C>console.log(...)</C> prints a value to the console, a panel developers use to see what their code is doing.
          In a real browser you open it with F12 (or right-click → Inspect → Console). In these lessons it appears
          under each code box.
        </p>
      </Note>

      <Note kind="tip">
        <p>
          Before lesson 2, ask students to open the console in their own browser and type <C>2 + 2</C>. Seeing JavaScript
          answer instantly takes the fear out of it.
        </p>
      </Note>
    </>
  );
}
