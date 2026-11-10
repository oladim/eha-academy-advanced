import React, { useState } from "react";
import Code from "../components/Code.jsx";
import { Note, Panel } from "../components/Bits.jsx";

function LikeButton() {
  const [likes, setLikes] = useState(0);
  return (
    <button className="btn primary" style={{ fontSize: 20, padding: "10px 20px" }} onClick={() => setLikes(likes + 1)}>
      ❤️ {likes} {likes === 1 ? "like" : "likes"}
    </button>
  );
}

const PARTS = [
  { title: "Frameworks and libraries", body: "What they are, why developers use them, and how React, Angular and Vue compare.", lessons: "Lessons 2–6" },
  { title: "Meet React", body: "Where React came from, its key features, and how to create a React project.", lessons: "Lessons 7–9" },
  { title: "Building with React", body: "Components, props, state, event handling and the useEffect hook, with live code.", lessons: "Lessons 10–13" },
  { title: "Putting it together", body: "The same feature with and without React, your first app, and a final review.", lessons: "Lessons 14–16" },
];

export default function Welcome() {
  return (
    <>
      <h1>Intro to JS Frameworks & React Basics</h1>
      <p className="lead">
        A hands-on companion to the slides by Hadiza A. Umar for eHA Academy. Every slide becomes a short lesson with a plain explanation,
        a visual, live React code you can edit, and a quick check.
      </p>

      <Panel title="This button is a React component" sub="Click it. Six lines of React keep the number and the label in sync for you.">
        <div className="grid-2" style={{ alignItems: "center" }}>
          <Code>{`function LikeButton() {
  const [likes, setLikes] = useState(0);
  return (
    <button onClick={() => setLikes(likes + 1)}>
      ❤️ {likes} {likes === 1 ? "like" : "likes"}
    </button>
  );
}`}</Code>
          <div className="center"><LikeButton /></div>
        </div>
        <p className="small muted" style={{ marginBottom: 0 }}>By the end of this module you'll understand every line of that code.</p>
      </Panel>

      <h2>What this module covers</h2>
      <div className="grid-2">
        {PARTS.map((p) => (
          <div className="box" key={p.title}>
            <div className="box-label">{p.lessons}</div>
            <strong style={{ display: "block", fontFamily: "var(--font-display)", fontSize: 19, margin: "4px 0" }}>{p.title}</strong>
            <span className="muted">{p.body}</span>
          </div>
        ))}
      </div>

      <h2>How to use these lessons</h2>
      <ul>
        <li>Go in order using the list on the left, or the button at the bottom of each page.</li>
        <li><strong>Demos</strong> are the boxes with a teal shadow. Click around in them.</li>
        <li><strong>Live React</strong> boxes are real editors: change the code, press <strong>Run code</strong>, and the result appears on the right straight away.</li>
        <li><strong>Quick checks</strong> at the end of each lesson mark it as done.</li>
      </ul>

      <Note title="Before you start">
        <p>This module builds on Module 1 (JavaScript Fundamentals). If functions, arrow functions, events or the DOM feel shaky, a quick revisit will make React much easier.</p>
      </Note>
    </>
  );
}
