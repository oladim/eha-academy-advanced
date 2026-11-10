import React, { useEffect, useState } from "react";
import { Note, Panel } from "../components/Bits.jsx";
import Quiz from "../components/Quiz.jsx";
import { C } from "../components/Code.jsx";

function LayersDemo() {
  const [css, setCss] = useState(true);
  const [js, setJs] = useState(true);
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState(null);
  const [likes, setLikes] = useState(0);

  function submit(e) {
    e.preventDefault();
    if (!js) return;
    setMsg(email.includes("@") ? { ok: true, t: "Thanks! You're signed up." } : { ok: false, t: "That email needs an @ sign." });
  }

  const styled = {
    card: css ? { fontFamily: "var(--font-body)", background: "linear-gradient(160deg,#fff, #f3f6ff)", border: "2px solid var(--line)", borderRadius: 10, padding: 20, boxShadow: "var(--shadow-pop)" } : { fontFamily: "Times New Roman, serif", padding: 4 },
    h: css ? { fontFamily: "var(--font-display)", margin: "0 0 6px", fontSize: 24 } : { margin: "0 0 6px" },
    input: css ? { padding: "8px 10px", border: "2px solid var(--line)", borderRadius: 6, width: "100%", font: "inherit" } : {},
    btn: css ? { marginTop: 10, padding: "8px 16px", background: "var(--accent)", border: "2px solid var(--line)", borderRadius: 6, fontWeight: 700, cursor: "pointer" } : { marginTop: 6 },
  };

  return (
    <Panel title="Demo: one page, three languages" sub="Turn CSS and JavaScript off and on. HTML is always there: it's the content itself.">
      <div className="row" style={{ marginBottom: 16 }}>
        <span className="chip" style={{ background: "var(--paper-2)" }}>HTML ✓ always on</span>
        <button className={`btn small ${css ? "selected" : ""}`} onClick={() => setCss(!css)}>CSS {css ? "on" : "off"}</button>
        <button className={`btn small ${js ? "selected" : ""}`} onClick={() => { setJs(!js); setMsg(null); }}>JavaScript {js ? "on" : "off"}</button>
      </div>
      <div className="grid-2">
        <div style={styled.card}>
          <h4 style={styled.h}>Join the cohort</h4>
          <p style={{ margin: "0 0 10px" }}>Get weekly JavaScript tips.</p>
          <form onSubmit={submit}>
            <input style={styled.input} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" aria-label="Email" />
            <br />
            <button style={styled.btn} type="submit">Sign up</button>{" "}
            <button style={styled.btn} type="button" onClick={() => js && setLikes(likes + 1)}>👍 {likes}</button>
          </form>
          {msg && <p className="pop" style={{ color: msg.ok ? "var(--green)" : "var(--red)", fontWeight: 700, margin: "10px 0 0" }}>{msg.t}</p>}
        </div>
        <div className="small">
          <p style={{ marginTop: 0 }}><strong>HTML</strong> gives the page its content and structure: a heading, a paragraph, a box, a button.</p>
          <p><strong>CSS</strong> makes it look good: colors, fonts, spacing.{!css && <span className="bad"> (Off now: plain browser defaults.)</span>}</p>
          <p><strong>JavaScript</strong> makes it <em>do</em> things: check the email, count likes.{!js && <span className="bad"> (Off now: the buttons do nothing.)</span>}</p>
        </div>
      </div>
    </Panel>
  );
}

function LiveClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return <span className="mono" style={{ fontSize: 22, fontWeight: 600 }}>{now.toLocaleTimeString()}</span>;
}

const places = [
  { name: "Front-end (browser)", body: "Code runs inside Chrome, Firefox or Safari and controls the page you see.", ex: "Menus, sliders, form checks" },
  { name: "Back-end (Node.js)", body: "Node.js lets JavaScript run on a server, outside the browser.", ex: "APIs, saving to a database" },
  { name: "Mobile apps", body: "Tools like React Native turn JavaScript into phone apps.", ex: "Android and iOS apps" },
];

export default function WhatIsJS({ markDone }) {
  return (
    <>
      <h1>What is JavaScript?</h1>
      <p className="lead">
        JavaScript is the programming language of the web. If HTML is the words on a page and CSS is the styling,
        JavaScript is what makes the page react when you click, type or scroll.
      </p>

      <h2>A lightweight, interpreted language</h2>
      <p>
        <strong>Lightweight</strong> means it's easy to start with: no heavy setup, no installs. Every browser already
        understands it. <strong>Interpreted</strong> means you write the code and the browser runs it directly. You don't
        need a separate step to turn it into a program first.
      </p>
      <Note kind="precise">
        <p>
          Modern browsers actually compile JavaScript behind the scenes while it runs (this is called “just-in-time”
          compilation) so it can be fast. For you as the programmer, though, it still feels interpreted: write it, refresh, it runs.
        </p>
      </Note>

      <h2>It works alongside HTML and CSS</h2>
      <p>Think of a house: HTML is the walls and rooms, CSS is the paint and furniture, JavaScript is the electricity that makes the lights and doorbell work.</p>
      <LayersDemo />

      <h2>Where JavaScript runs</h2>
      <div className="grid-3">
        {places.map((p) => (
          <div className="box" key={p.name}>
            <strong style={{ fontFamily: "var(--font-display)" }}>{p.name}</strong>
            <p className="small" style={{ margin: "6px 0" }}>{p.body}</p>
            <span className="small muted">e.g. {p.ex}</span>
          </div>
        ))}
      </div>

      <h2>What it's used for</h2>
      <p>The slide lists four everyday examples. You've already used all of them today:</p>
      <ul>
        <li><strong>Animations</strong>: the typing effect on the welcome page.</li>
        <li><strong>Form validation</strong>: the email check in the demo above.</li>
        <li><strong>API calls</strong>: fetching data from a server, like loading new posts. You'll do this in the async lessons.</li>
        <li><strong>Real-time updates</strong>: this clock is updated by JavaScript every second: <LiveClock /></li>
      </ul>

      <Note kind="warn" title="JavaScript is not Java">
        <p>Despite the name, they're completely different languages. The name was a marketing choice in 1995.</p>
      </Note>

      <Quiz
        onPass={markDone}
        questions={[
          { q: "Which of the three web languages makes a page respond to a button click?", options: ["HTML", "CSS", "JavaScript"], answer: 2, explain: "HTML is the content, CSS is the look, JavaScript is the behaviour." },
          { q: "What lets JavaScript run on a server, outside the browser?", options: ["Node.js", "CSS", "The DOM"], answer: 0, explain: "Node.js runs JavaScript on servers, which is how JS is used for back-ends." },
          { q: <>What does <C>interpreted</C> mean for you as a programmer?</>, options: ["You must compile the code by hand before running it", "You write the code and it runs directly", "It only works on Windows"], answer: 1, explain: "No separate build step is needed: the browser runs your code as it is." },
        ]}
      />
    </>
  );
}
