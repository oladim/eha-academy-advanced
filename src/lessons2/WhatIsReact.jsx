import React, { useState } from "react";
import Code from "../components/Code.jsx";
import { Note, Panel } from "../components/Bits.jsx";
import Quiz from "../components/Quiz.jsx";

const COLORS = { App: "#1e5eff", Header: "#2a9d8f", Post: "#d93f44", Avatar: "#9b59b6", LikeButton: "#c98a00", Comment: "#23824a" };

function C({ name, show, active, setActive, children, style }) {
  const on = show || active === name;
  return (
    <div
      onMouseEnter={(e) => { e.stopPropagation(); setActive(name); }}
      onMouseLeave={(e) => { e.stopPropagation(); setActive(null); }}
      style={{ position: "relative", outline: on ? `2px dashed ${COLORS[name]}` : "2px dashed transparent", outlineOffset: 2, borderRadius: 6, ...style }}
    >
      {on && <span style={{ position: "absolute", top: -11, left: 6, background: COLORS[name], color: "#fff", fontSize: 11, fontFamily: "var(--font-mono)", padding: "0 5px", borderRadius: 3, zIndex: 1 }}>{`<${name} />`}</span>}
      {children}
    </div>
  );
}

function ComponentLens() {
  const [show, setShow] = useState(false);
  const [active, setActive] = useState(null);
  const p = { show, active, setActive };
  return (
    <Panel title="Demo: seeing a page as components" sub="Hover over parts of this little app, or switch on all the outlines.">
      <label className="row" style={{ gap: 8, marginBottom: 14 }}>
        <input type="checkbox" checked={show} onChange={() => setShow(!show)} /> Show every component
      </label>
      <div className="grid-2" style={{ alignItems: "start" }}>
        <C name="App" {...p} style={{ padding: 14, background: "#fff", border: "2px solid var(--line)" }}>
          <C name="Header" {...p} style={{ padding: "8px 10px", background: "var(--paper-2)", marginBottom: 14 }}><strong>Campus Feed</strong></C>
          <C name="Post" {...p} style={{ padding: 10, border: "1px solid var(--soft-line)" }}>
            <div className="row" style={{ gap: 8 }}>
              <C name="Avatar" {...p} style={{ width: 36, height: 36 }}><div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--accent)", display: "grid", placeItems: "center" }}>H</div></C>
              <div><strong>Hadiza</strong><div className="small muted">2h ago</div></div>
            </div>
            <p style={{ margin: "8px 0" }}>Today we start React! ⚛</p>
            <C name="LikeButton" {...p} style={{ display: "inline-block", marginBottom: 10 }}><span className="btn small">❤️ 12</span></C>
            <C name="Comment" {...p} style={{ padding: "4px 8px", background: "var(--paper-2)", marginBottom: 6 }}><span className="small"><strong>Tunde:</strong> Can't wait!</span></C>
            <C name="Comment" {...p} style={{ padding: "4px 8px", background: "var(--paper-2)" }}><span className="small"><strong>Amaka:</strong> Same here 🙌</span></C>
          </C>
        </C>
        <div>
          <div className="box-label" style={{ marginBottom: 6 }}>The component tree</div>
          <div className="mono small" style={{ lineHeight: 1.9 }}>
            {[["App", 0], ["Header", 1], ["Post", 1], ["Avatar", 2], ["LikeButton", 2], ["Comment", 2], ["Comment", 2]].map(([n, d], i) => (
              <div key={i} style={{ paddingLeft: d * 22 }}>
                <span style={{ padding: "1px 6px", borderRadius: 4, border: `2px solid ${COLORS[n]}`, background: active === n ? COLORS[n] : "#fff", color: active === n ? "#fff" : "var(--ink)" }}>{`<${n} />`}</span>
              </div>
            ))}
          </div>
          <p className="small">Notice <code className="inline">{"<Comment />"}</code> is used twice: write it once, reuse it everywhere.</p>
        </div>
      </div>
    </Panel>
  );
}

export default function WhatIsReact({ markDone }) {
  return (
    <>
      <h1>What is React?</h1>
      <p className="lead">
        React is a JavaScript library for building user interfaces out of small, reusable pieces called components.
      </p>

      <h2>The slide in three points</h2>
      <div className="grid-3">
        <div className="box"><div className="box-label">Where it came from</div><strong style={{ fontFamily: "var(--font-display)" }}>Developed by Facebook (2011)</strong><p className="small" style={{ margin: "4px 0 0" }}>Built to handle Facebook's busy, constantly updating pages. Today Meta and a huge community maintain it.</p></div>
        <div className="box"><div className="box-label">What it does</div><strong style={{ fontFamily: "var(--font-display)" }}>Builds UIs from components</strong><p className="small" style={{ margin: "4px 0 0" }}>A page is split into pieces like Header, Post and Button, each responsible for its own part.</p></div>
        <div className="box"><div className="box-label">How it works</div><strong style={{ fontFamily: "var(--font-display)" }}>JSX and the virtual DOM</strong><p className="small" style={{ margin: "4px 0 0" }}>You write HTML-like JSX; React uses a virtual DOM to update the real page quickly.</p></div>
      </div>

      <ComponentLens />

      <h2>A first look at React code</h2>
      <p>Here's the comment from the demo as a component. The HTML-looking part is JSX, which the next lesson covers.</p>
      <Code>{`function Comment({ author, text }) {
  return (
    <div className="comment">
      <strong>{author}:</strong> {text}
    </div>
  );
}

<Comment author="Tunde" text="Can't wait!" />
<Comment author="Amaka" text="Same here 🙌" />`}</Code>

      <Note kind="precise">
        <p>Jordan Walke, an engineer at Facebook, created React in 2011 and it was first used in Facebook's News Feed. It was released as open source for everyone in 2013.</p>
      </Note>

      <Quiz
        onPass={markDone}
        questions={[
          { q: "Which company developed React?", options: ["Google", "Facebook (now Meta)", "Microsoft"], answer: 1, explain: "React started at Facebook in 2011." },
          { q: "In React, a UI is built from…", options: ["Components", "Spreadsheets", "Servers"], answer: 0, explain: "Components are React's building blocks." },
          { q: "Which two ideas does the slide say React uses?", options: ["JSX and the virtual DOM", "SQL and PHP", "Two-way binding and MVC"], answer: 0, explain: "JSX for writing UI, the virtual DOM for fast updates." },
        ]}
      />
    </>
  );
}
