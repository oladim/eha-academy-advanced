import React, { useState } from "react";
import Code, { C } from "../components/Code.jsx";
import { Note, Panel } from "../components/Bits.jsx";
import TryIt from "../components/TryIt.jsx";
import Quiz from "../components/Quiz.jsx";

// One sample page described as a tree. Both the tree view and the page view are drawn from this.
const TREE = {
  id: "html", tag: "html", children: [
    { id: "head", tag: "head", children: [{ id: "title", tag: "title", text: "My Page" }] },
    {
      id: "body", tag: "body", children: [
        { id: "h1", tag: "h1", text: "Shopping list" },
        { id: "p", tag: "p", text: "Things to buy today:" },
        {
          id: "ul", tag: "ul", children: [
            { id: "li1", tag: "li", text: "Rice" },
            { id: "li2", tag: "li", text: "Plantain" },
          ],
        },
      ],
    },
  ],
};

function find(node, id, parent = null) {
  if (node.id === id) return { node, parent };
  for (const c of node.children || []) {
    const r = find(c, id, node);
    if (r) return r;
  }
  return null;
}
const textOf = (n) => n.text ?? (n.children || []).map(textOf).join(" ");

function TreeNode({ node, sel, onSel, depth = 0 }) {
  const active = sel === node.id;
  return (
    <li style={{ listStyle: "none", position: "relative" }}>
      <button
        onClick={() => onSel(node.id)}
        className="mono"
        style={{
          border: "2px solid var(--line)", borderRadius: 6, padding: "3px 10px", margin: "4px 0", cursor: "pointer",
          background: active ? "var(--accent)" : depth === 0 ? "var(--code-bg)" : "#fff",
          color: active ? "var(--ink)" : depth === 0 ? "var(--code-ink)" : "var(--ink)", fontWeight: 600, fontSize: 14,
        }}
      >
        &lt;{node.tag}&gt;
        {node.text && <span style={{ fontWeight: 400, color: active ? "var(--ink)" : "var(--ink-2)" }}> "{node.text}"</span>}
      </button>
      {node.children && (
        <ul style={{ margin: 0, paddingLeft: 26, borderLeft: "2px solid var(--soft-line)", marginLeft: 12 }}>
          {node.children.map((c) => <TreeNode key={c.id} node={c} sel={sel} onSel={onSel} depth={depth + 1} />)}
        </ul>
      )}
    </li>
  );
}

function PageView({ sel, onSel }) {
  const ring = (id) => ({
    outline: sel === id ? "3px solid var(--blue)" : "1px dashed transparent",
    outlineOffset: 2, background: sel === id ? "var(--accent-soft)" : undefined, cursor: "pointer", borderRadius: 4,
  });
  const click = (id) => (e) => { e.stopPropagation(); onSel(id); };
  return (
    <div style={{ border: "2px solid var(--line)", borderRadius: 6, overflow: "hidden", background: "#fff" }}>
      <div onClick={click("title")} style={{ ...ring("title"), background: sel === "title" ? "var(--accent-soft)" : "var(--paper-2)", borderBottom: "2px solid var(--line)", padding: "6px 10px", fontSize: 13, borderRadius: 0 }}>
        🗂 My Page <span className="muted">(the tab title comes from &lt;title&gt;)</span>
      </div>
      <div onClick={click("body")} style={{ ...ring("body"), padding: 14, fontFamily: "Georgia, serif", minHeight: 180 }}>
        <h4 onClick={click("h1")} style={{ ...ring("h1"), margin: "0 0 8px", fontSize: 24 }}>Shopping list</h4>
        <p onClick={click("p")} style={{ ...ring("p"), margin: "0 0 8px" }}>Things to buy today:</p>
        <ul onClick={click("ul")} style={{ ...ring("ul"), margin: 0, paddingLeft: 26 }}>
          <li onClick={click("li1")} style={ring("li1")}>Rice</li>
          <li onClick={click("li2")} style={ring("li2")}>Plantain</li>
        </ul>
      </div>
    </div>
  );
}

function DomExplorer() {
  const [sel, setSel] = useState("ul");
  const { node, parent } = find(TREE, sel);
  const kids = node.children || [];
  const siblings = parent ? parent.children.filter((c) => c.id !== node.id) : [];
  return (
    <Panel title="Demo: the page and its tree are the same thing" sub="Click any box in the tree, or anything on the page. They stay in sync.">
      <div className="grid-2" style={{ alignItems: "start" }}>
        <div>
          <div className="box-label" style={{ marginBottom: 4 }}>The DOM tree</div>
          <ul style={{ margin: 0, padding: 0 }}><TreeNode node={TREE} sel={sel} onSel={setSel} /></ul>
        </div>
        <div>
          <div className="box-label" style={{ marginBottom: 4 }}>What the browser shows</div>
          <PageView sel={sel} onSel={setSel} />
          <div className="box pop" key={sel} style={{ marginTop: 14, background: "var(--code-bg)", color: "var(--code-ink)" }}>
            <div className="box-label" style={{ color: "#9aa3ad" }}>To JavaScript, this is an object:</div>
            <div className="mono small" style={{ lineHeight: 1.8 }}>
              <div>tagName: <span style={{ color: "#9fdc8b" }}>"{node.tag.toUpperCase()}"</span></div>
              <div>parentElement: {parent ? <span style={{ color: "#8cc4ff" }}>&lt;{parent.tag}&gt;</span> : <span className="muted">null (it's the root)</span>}</div>
              <div>children: {kids.length ? kids.map((k) => <span key={k.id} style={{ color: "#8cc4ff" }}>&lt;{k.tag}&gt; </span>) : <span className="muted">none</span>}</div>
              <div>siblings: {siblings.length ? siblings.map((k) => <span key={k.id} style={{ color: "#8cc4ff" }}>&lt;{k.tag}&gt; </span>) : <span className="muted">none</span>}</div>
              <div>textContent: <span style={{ color: "#9fdc8b" }}>"{textOf(node)}"</span></div>
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
}

export default function DomOverview({ markDone }) {
  return (
    <>
      <h1>The DOM (Document Object Model)</h1>
      <p className="lead">
        When a browser loads your HTML, it doesn't keep it as text. It builds a tree of objects in memory called the DOM.
        JavaScript talks to that tree, and every change you make to the tree shows up on the screen.
      </p>

      <h2>HTML as a tree</h2>
      <p>
        Every tag becomes a <strong>node</strong> in the tree. Tags inside other tags become their <strong>children</strong>. It works like a
        family tree: <C>{"<ul>"}</C> is the <strong>parent</strong> of the two <C>{"<li>"}</C> items, and those two are <strong>siblings</strong>.
      </p>
      <div className="grid-2">
        <Code label="The HTML you write">{`<html>
  <head>
    <title>My Page</title>
  </head>
  <body>
    <h1>Shopping list</h1>
    <p>Things to buy today:</p>
    <ul>
      <li>Rice</li>
      <li>Plantain</li>
    </ul>
  </body>
</html>`}</Code>
        <div>
          <p style={{ marginTop: 14 }}>The slide's key ideas, in plain words:</p>
          <ul>
            <li>The DOM is the browser's <strong>data version</strong> of your page: its structure and its content.</li>
            <li>The browser treats <strong>every HTML element as an object</strong>, with properties (like its text) and methods (things it can do).</li>
            <li>So JavaScript can <strong>change the HTML and CSS</strong> while the page is open.</li>
            <li>The DOM gives you methods to <strong>select</strong> elements, <strong>modify</strong> them, and <strong>handle events</strong> like clicks.</li>
          </ul>
        </div>
      </div>

      <DomExplorer />

      <Note kind="precise">
        <p>
          The text inside an element is a node too (a “text node”). The tree above folds it into its element to keep the picture simple.
          Also, the DOM isn't your HTML file: if JavaScript changes the DOM, the file on disk stays the same.
        </p>
      </Note>

      <TryIt
        title="Try it: look at the DOM from JavaScript"
        hint="document is the starting point of the tree. Run it, then try logging document.querySelector('p').textContent."
        html={`<h1>Shopping list</h1>
<p>Things to buy today:</p>
<ul>
  <li>Rice</li>
  <li>Plantain</li>
</ul>`}
        code={`console.log(document.title);
console.log(document.body.children.length + " children in <body>");

const list = document.querySelector("ul");
console.log(list.children.length + " items in the list");
console.log(list.parentElement.tagName);

// Change the tree, and the page updates:
document.querySelector("h1").textContent = "My shopping list";`}
      />

      <Quiz
        onPass={markDone}
        questions={[
          { q: "What is the DOM?", options: ["A new programming language", "The browser's tree of objects that represents the page", "A CSS framework"], answer: 1, explain: "The DOM is the page turned into a tree of objects that JavaScript can use." },
          { q: <>In the shopping list, what is the parent of each <C>{"<li>"}</C>?</>, options: ["<body>", "<ul>", "<p>"], answer: 1, explain: "The <li> items sit directly inside <ul>." },
          { q: "If JavaScript changes the DOM, what happens on screen?", options: ["Nothing until you edit the file", "The page updates straight away", "The browser crashes"], answer: 1, explain: "The screen always reflects the current DOM." },
        ]}
      />
    </>
  );
}
