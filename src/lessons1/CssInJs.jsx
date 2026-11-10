import React, { useState } from "react";
import Code, { C } from "../components/Code.jsx";
import { Note, Panel } from "../components/Bits.jsx";
import TryIt from "../components/TryIt.jsx";
import Quiz from "../components/Quiz.jsx";

const CLASS_STYLES = {
  active: { outline: "4px solid var(--blue)", outlineOffset: 3 },
  hidden: { opacity: 0.12 },
  big: { transform: "scale(1.12)" },
  rounded: { borderRadius: 28 },
};

function StyleDemo() {
  const [bg, setBg] = useState("#ffffff");
  const [color, setColor] = useState("#1b1f24");
  const [classes, setClasses] = useState(["card", "hidden"]);
  const [last, setLast] = useState('// click a button to run a line of code');

  function setStyle(prop, val, setter) {
    setter(val);
    setLast(`card.style.${prop} = "${val}";`);
  }
  function cls(action, name) {
    setClasses((c) => {
      const has = c.includes(name);
      if (action === "add") return has ? c : [...c, name];
      if (action === "remove") return c.filter((x) => x !== name);
      return has ? c.filter((x) => x !== name) : [...c, name];
    });
    setLast(`card.classList.${action}("${name}");`);
  }

  const classStyle = Object.assign({}, ...classes.map((c) => CLASS_STYLES[c] || {}));

  return (
    <Panel title="Demo: style vs classList" sub="Left: change single CSS properties. Right: switch whole classes on and off.">
      <div className="grid-2">
        <div>
          <div className="box-label">element.style</div>
          <div className="row" style={{ margin: "6px 0 10px" }}>
            {["#0090fc", "#f2d94e", "#2a9d8f", "#ffffff"].map((c) => (
              <button key={c} aria-label={`background ${c}`} onClick={() => setStyle("backgroundColor", c, setBg)}
                style={{ width: 34, height: 34, borderRadius: 6, border: "2px solid var(--line)", background: c, cursor: "pointer" }} />
            ))}
            <span className="small muted">backgroundColor</span>
          </div>
          <div className="row" style={{ marginBottom: 16 }}>
            {["#1b1f24", "#ffffff", "#d93f44"].map((c) => (
              <button key={c} aria-label={`text ${c}`} onClick={() => setStyle("color", c, setColor)}
                style={{ width: 34, height: 34, borderRadius: "50%", border: "2px solid var(--line)", background: c, cursor: "pointer" }} />
            ))}
            <span className="small muted">color</span>
          </div>

          <div className="box-label">element.classList</div>
          {Object.keys(CLASS_STYLES).map((name) => (
            <div className="row" key={name} style={{ marginTop: 6 }}>
              <span className="mono small" style={{ width: 70 }}>"{name}"</span>
              <button className="btn small" onClick={() => cls("add", name)}>add</button>
              <button className="btn small" onClick={() => cls("remove", name)}>remove</button>
              <button className="btn small" onClick={() => cls("toggle", name)}>toggle</button>
            </div>
          ))}
        </div>
        <div>
          <div style={{ display: "grid", placeItems: "center", minHeight: 210, background: "var(--paper-2)", borderRadius: 6, border: "2px dashed var(--soft-line)" }}>
            <div style={{
              width: 190, padding: 18, border: "2px solid var(--line)", borderRadius: 8, textAlign: "center",
              background: bg, color, transition: "all .25s", ...classStyle,
            }}>
              <div style={{ fontSize: 34 }}>👩🏾‍💻</div>
              <strong style={{ fontFamily: "var(--font-display)" }}>Ada</strong>
              <div className="small">Front-end learner</div>
            </div>
          </div>
          <div className="code" style={{ margin: "12px 0 8px", fontSize: 13 }} key={last}>{last}</div>
          <div className="small">
            Current classes:{" "}
            {classes.map((c) => <span key={c} className="chip pop" style={{ marginRight: 4, background: c === "card" ? "#fff" : "var(--accent-soft)" }}>{c}</span>)}
          </div>
        </div>
      </div>
    </Panel>
  );
}

export default function CssInJs({ markDone }) {
  return (
    <>
      <h1>Working with CSS in JavaScript</h1>
      <p className="lead">
        JavaScript can change how things look while the page is open: highlight a selected item, show a menu, switch to dark mode.
        There are two ways to do it.
      </p>

      <h2>1. Change one style directly</h2>
      <Code>{`document.querySelector("#btn").style.backgroundColor = "blue";`}</Code>
      <p>
        Select the element, then set a property on its <C>style</C>. CSS property names with dashes are written in camelCase:
        <C>background-color</C> becomes <C>backgroundColor</C>, <C>font-size</C> becomes <C>fontSize</C>.
      </p>

      <h2>2. Add or remove classes</h2>
      <Code>{`element.classList.add("active");
element.classList.remove("hidden");
element.classList.toggle("open"); // adds it if missing, removes it if there`}</Code>
      <p>
        The look of <C>.active</C> or <C>.hidden</C> is written once in your CSS file. JavaScript just switches the class on or off.
      </p>

      <StyleDemo />

      <Note kind="tip" title="Which one should students use?">
        <p>
          Prefer <strong>classes</strong>: the design stays in CSS where it belongs, and one class can change many properties at once.
          Use <C>.style</C> for values that are only known while the code runs, like moving something to the mouse position.
        </p>
      </Note>
      <Note kind="precise">
        <p><C>toggle</C> isn't on the slide, but it's the one you'll use most for things like menus and dark mode buttons.</p>
      </Note>

      <TryIt
        title="Try it: a dark mode switch"
        hint="Run it, then click the button on the page. Try changing the colors in the .dark rule."
        html={`<style>
  .dark { background: #1b1f24; color: #4db3ff; }
  body { transition: all .3s; }
</style>
<h2>Night owl mode</h2>
<p>Click the button to switch themes.</p>
<button id="btn">Toggle dark mode</button>`}
        code={`const btn = document.querySelector("#btn");

btn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  console.log("Dark mode is " + (isDark ? "on" : "off"));
});

btn.style.backgroundColor = "blue";
btn.style.color = "white";
console.log("Ready! Click the button on the page.");`}
      />

      <Quiz
        onPass={markDone}
        questions={[
          { q: <>How do you write the CSS property <C>font-size</C> in JavaScript?</>, options: ["element.style.font-size", "element.style.fontSize", "element.fontSize"], answer: 1, explain: "Dashed CSS names become camelCase in JavaScript." },
          { q: <>What does <C>classList.remove("hidden")</C> do?</>, options: ["Deletes the element", "Takes the hidden class off the element", "Hides the element"], answer: 1, explain: "It only removes that class; the element stays." },
          { q: "Why are classes usually better than .style?", options: ["They run faster in every case", "The design stays in CSS and one class can change many properties", "style doesn't work in Chrome"], answer: 1, explain: "Classes keep styling in CSS and are easier to reuse." },
        ]}
      />
    </>
  );
}
