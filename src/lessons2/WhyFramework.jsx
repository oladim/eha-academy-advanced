import React, { useState } from "react";
import Code from "../components/Code.jsx";
import { Note, Panel, Tabs } from "../components/Bits.jsx";
import Quiz from "../components/Quiz.jsx";

const PRICE = 1500;

function SyncDemo() {
  const [mode, setMode] = useState("Plain JavaScript");
  const [real, setReal] = useState(1);          // the true number of items
  const [shown, setShown] = useState({ badge: 1, row: 1, total: 1 }); // what each spot displays
  const [remember, setRemember] = useState({ badge: true, row: true, total: false });
  const plain = mode === "Plain JavaScript";

  function add() {
    const next = real + 1;
    setReal(next);
    if (plain) {
      setShown((s) => ({
        badge: remember.badge ? next : s.badge,
        row: remember.row ? next : s.row,
        total: remember.total ? next : s.total,
      }));
    }
  }
  function reset(m) {
    setMode(m);
    setReal(1);
    setShown({ badge: 1, row: 1, total: 1 });
  }

  const v = plain ? shown : { badge: real, row: real, total: real };
  const wrong = (k) => plain && v[k] !== real;
  const spot = (k) => ({ background: wrong(k) ? "var(--red-soft)" : "transparent", outline: wrong(k) ? "2px solid var(--red)" : "none", borderRadius: 4, padding: "0 4px" });

  const plainCode = `let count = 1;
addBtn.addEventListener("click", () => {
  count++;
${remember.badge ? "  badge.textContent = count;" : "  // forgot to update the badge!"}
${remember.row ? "  row.textContent = count;" : "  // forgot to update the row!"}
${remember.total ? "  total.textContent = count * 1500;" : "  // forgot to update the total!"}
});`;

  return (
    <Panel title="Demo: keeping the screen in sync" sub="A tiny shop shows the same number in three places. Watch what happens as it grows.">
      <Tabs tabs={["Plain JavaScript", "With a framework"]} value={mode} onChange={reset} />
      <div className="grid-2" style={{ alignItems: "start" }}>
        <div>
          {plain ? (
            <>
              <p className="small" style={{ marginTop: 0 }}>With plain JavaScript, you must update every spot yourself. Which lines did you remember to write?</p>
              {["badge", "row", "total"].map((k) => (
                <label key={k} className="row small" style={{ gap: 6 }}>
                  <input type="checkbox" checked={remember[k]} onChange={() => setRemember({ ...remember, [k]: !remember[k] })} />
                  update the {k}
                </label>
              ))}
              <Code>{plainCode}</Code>
            </>
          ) : (
            <>
              <p className="small" style={{ marginTop: 0 }}>With a framework you change the data once. Every spot that uses it updates automatically.</p>
              <Code>{`const [count, setCount] = useState(1);
// ...
<button onClick={() => setCount(count + 1)}>Add</button>`}</Code>
            </>
          )}
        </div>
        <div style={{ border: "2px solid var(--line)", borderRadius: 8, overflow: "hidden", background: "#fff" }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "var(--paper-2)", borderBottom: "2px solid var(--line)" }}>
            <strong>Mama's Shop</strong>
            <span>🛒 <span style={spot("badge")} className="mono">{v.badge}</span></span>
          </div>
          <div style={{ padding: 12 }}>
            <div className="row" style={{ justifyContent: "space-between" }}>
              <span>🥭 Mangoes × <span style={spot("row")} className="mono">{v.row}</span></span>
              <button className="btn small primary" onClick={add}>Add one</button>
            </div>
            <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px dashed var(--soft-line)" }}>
              Total: <strong style={spot("total")} className="mono">₦{(v.total * PRICE).toLocaleString()}</strong>
            </div>
          </div>
          <div className="small" style={{ padding: "8px 12px", borderTop: "2px solid var(--line)", background: Object.keys(v).some(wrong) ? "var(--red-soft)" : "var(--green-soft)" }}>
            Real number of mangoes: <strong>{real}</strong>. {Object.keys(v).some(wrong) ? "Some spots are out of date: that's a bug." : "Everything matches."}
          </div>
        </div>
      </div>
    </Panel>
  );
}

const REASONS = [
  ["Plain JavaScript is hard for complex UIs", "Fine for a button or two. With hundreds of moving parts, keeping everything correct by hand becomes slow and error-prone, as the demo shows."],
  ["Better structure and maintainability", "Frameworks give every project a familiar shape, so a new teammate (or you in six months) can find their way around."],
  ["Streamlined front-end development", "Common chores like updating the screen, handling forms and switching pages are handled for you."],
  ["Rapid development", "Less setup and less repeated code means features ship faster."],
  ["Focus on the product", "Your time goes into what makes your app special, not into plumbing."],
  ["Piggyback on the experts", "Thousands of skilled developers have tested and improved these tools. You get their work for free."],
];

export default function WhyFramework({ markDone }) {
  return (
    <>
      <h1>Why use a JavaScript framework?</h1>
      <p className="lead">
        You can build anything with plain JavaScript. The problem is what happens as the app grows: keeping the screen correct gets
        harder with every new feature.
      </p>

      <SyncDemo />

      <h2>The reasons from the slide</h2>
      <div className="grid-2">
        {REASONS.map(([t, b]) => (
          <div className="box" key={t}>
            <strong style={{ fontFamily: "var(--font-display)" }}>{t}</strong>
            <p className="small" style={{ margin: "4px 0 0" }}>{b}</p>
          </div>
        ))}
      </div>

      <Note kind="tip">
        <p>Let students break the plain-JavaScript shop on purpose by unticking a line. The “out of sync” bug makes the case for frameworks better than any slide.</p>
      </Note>
      <Note kind="precise" title="Frameworks aren't always the answer">
        <p>For a small page with a little interactivity, plain JavaScript is often simpler and faster to load. Frameworks pay off as apps get bigger.</p>
      </Note>

      <Quiz
        onPass={markDone}
        questions={[
          { q: "What went wrong in the plain-JavaScript shop?", options: ["The price was wrong", "Some places on the page weren't updated when the data changed", "The button didn't work"], answer: 1, explain: "With plain JS you must remember to update every spot by hand." },
          { q: "How does a framework fix that?", options: ["You change the data once and the screen updates to match", "It hides the bugs", "It removes buttons"], answer: 0, explain: "The UI follows the data automatically." },
          { q: "“Piggyback on the experts” means…", options: ["Copy other people's homework", "Benefit from tools built and tested by many skilled developers", "Hire an expert for every project"], answer: 1, explain: "You reuse well-tested work instead of starting from zero." },
        ]}
      />
    </>
  );
}
