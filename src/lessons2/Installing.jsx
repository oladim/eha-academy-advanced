import React, { useState } from "react";
import Code from "../components/Code.jsx";
import { Note, Panel } from "../components/Bits.jsx";
import Quiz from "../components/Quiz.jsx";

const STEPS = [
  { comment: "# 0. Check Node.js and npm are installed", cmd: "node -v && npm -v", out: "v22.11.0\n10.9.0", why: "If you see version numbers, you're ready. If you get “command not found”, install Node.js from nodejs.org first. npm comes with it." },
  { comment: "# 1. Create a new React project using Vite", cmd: "npm create vite@latest my-react-app --template react", out: "✔ Scaffolding project in /home/you/my-react-app...\n\nDone. Now run:\n  cd my-react-app\n  npm install\n  npm run dev", why: "This downloads Vite's project creator and makes a new folder called my-react-app with a ready-made React project inside. On newer npm versions you may need -- before --template." },
  { comment: "# 2. Move into the project folder", cmd: "cd my-react-app", out: "", why: "cd means “change directory”. The next commands must run inside the project folder." },
  { comment: "# 3. Install dependencies", cmd: "npm install", out: "added 251 packages, and audited 252 packages in 14s\nfound 0 vulnerabilities", why: "Reads package.json and downloads React and the other packages the project needs into a node_modules folder." },
  { comment: "# 4. Start the development server", cmd: "npm run dev", out: "  VITE v6.0.0  ready in 312 ms\n\n  ➜  Local:   http://localhost:5173/\n  ➜  press h + enter to show help", why: "Starts a local server. Open the Local address in your browser to see your app. Leave this terminal running; it reloads the page every time you save a file." },
];

function Terminal() {
  const [n, setN] = useState(0); // number of steps run
  return (
    <Panel title="Demo: the four commands from the slide" sub="Run each command in order and read what it does. (This is a simulation, nothing is installed.)">
      <div style={{ background: "#15181d", borderRadius: 8, border: "2px solid var(--line)", overflow: "hidden" }}>
        <div style={{ padding: "8px 12px", display: "flex", gap: 6, borderBottom: "1px solid #2c323a" }}>
          <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57" }} />
          <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#febc2e" }} />
          <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840" }} />
          <span className="small" style={{ color: "#8b949e", marginLeft: 8 }}>Terminal</span>
        </div>
        <pre className="mono" style={{ margin: 0, padding: 14, color: "#e8e6df", fontSize: 13.5, minHeight: 220, whiteSpace: "pre-wrap" }}>
          {STEPS.slice(0, n).map((s, i) => (
            <span key={i}>
              <span style={{ color: "#7f8a96" }}>{s.comment}</span>{"\n"}
              <span style={{ color: "#9fdc8b" }}>$ </span>{s.cmd}{"\n"}
              {s.out && <span style={{ color: "#b6c0ca" }}>{s.out}{"\n"}</span>}
              {"\n"}
            </span>
          ))}
          {n < STEPS.length && <><span style={{ color: "#7f8a96" }}>{STEPS[n].comment}</span>{"\n"}<span style={{ color: "#9fdc8b" }}>$ </span><span className="caret" /></>}
        </pre>
      </div>
      <div className="row" style={{ marginTop: 12 }}>
        {n < STEPS.length
          ? <button className="btn primary" onClick={() => setN(n + 1)}>Run: <span className="mono">{STEPS[n].cmd}</span></button>
          : <button className="btn" onClick={() => setN(0)}>Start over</button>}
      </div>
      {n > 0 && <div className="box pop" key={n} style={{ marginTop: 12 }}><div className="box-label">What just happened</div>{STEPS[n - 1].why}</div>}
    </Panel>
  );
}

const FILES = {
  "index.html": { note: "The single HTML page. It has an empty <div id=\"root\"> where React draws your app.", code: `<body>\n  <div id="root"></div>\n  <script type="module" src="/src/main.jsx"></script>\n</body>` },
  "package.json": { note: "The project's ID card: its name, the packages it needs, and the npm scripts like dev and build.", code: `{\n  "name": "my-react-app",\n  "scripts": {\n    "dev": "vite",\n    "build": "vite build"\n  },\n  "dependencies": {\n    "react": "^18.3.1",\n    "react-dom": "^18.3.1"\n  }\n}` },
  "src/main.jsx": { note: "The starting point. It finds the root div and tells React to draw <App /> inside it.", code: `import { createRoot } from 'react-dom/client';\nimport App from './App.jsx';\n\ncreateRoot(document.getElementById('root')).render(<App />);` },
  "src/App.jsx": { note: "Your main component. This is where you'll spend most of your time.", code: `function App() {\n  return <h1>Hello, React!</h1>;\n}\n\nexport default App;` },
  "node_modules/": { note: "All the downloaded packages. Never edit it, never commit it to Git; npm install recreates it.", code: "// thousands of files you don't touch" },
};

function Explorer() {
  const [f, setF] = useState("src/App.jsx");
  return (
    <Panel title="Demo: what's inside the new project" sub="Click a file.">
      <div className="grid-2" style={{ alignItems: "start" }}>
        <div className="mono small" style={{ border: "2px solid var(--line)", borderRadius: 6, padding: 10, background: "#fff" }}>
          <div>📁 my-react-app</div>
          {Object.keys(FILES).map((name) => (
            <button key={name} onClick={() => setF(name)} style={{
              display: "block", width: "100%", textAlign: "left", border: 0, padding: "3px 8px", marginLeft: 14, cursor: "pointer", borderRadius: 4,
              fontFamily: "inherit", fontSize: "inherit", background: f === name ? "var(--accent)" : "transparent",
            }}>{name.endsWith("/") ? "📁" : "📄"} {name}</button>
          ))}
        </div>
        <div className="pop" key={f}>
          <p style={{ marginTop: 0 }}>{FILES[f].note}</p>
          <Code>{FILES[f].code}</Code>
        </div>
      </div>
    </Panel>
  );
}

export default function Installing({ markDone }) {
  return (
    <>
      <h1>Installing React</h1>
      <p className="lead">
        React projects are created and run from the command line, using npm, the Node.js package manager.
      </p>

      <h2>What you need</h2>
      <div className="grid-3">
        <div className="box"><strong style={{ fontFamily: "var(--font-display)" }}>Node.js</strong><p className="small" style={{ margin: "4px 0 0" }}>Runs JavaScript outside the browser. Download the LTS version from nodejs.org.</p></div>
        <div className="box"><strong style={{ fontFamily: "var(--font-display)" }}>npm</strong><p className="small" style={{ margin: "4px 0 0" }}>Node Package Manager. Comes with Node.js; downloads React and other packages (“dependencies”).</p></div>
        <div className="box"><strong style={{ fontFamily: "var(--font-display)" }}>A little command line</strong><p className="small" style={{ margin: "4px 0 0" }}>Enough to type commands and move between folders. See the cheat sheet below.</p></div>
      </div>

      <Terminal />
      <Explorer />

      <h2>Command line cheat sheet</h2>
      <table className="table">
        <thead><tr><th>Command</th><th>What it does</th></tr></thead>
        <tbody>
          <tr><td className="mono">cd folder-name</td><td>Go into a folder</td></tr>
          <tr><td className="mono">cd ..</td><td>Go up one folder</td></tr>
          <tr><td className="mono">ls</td><td>List files (on Windows Command Prompt: <span className="mono">dir</span>)</td></tr>
          <tr><td className="mono">mkdir projects</td><td>Make a new folder</td></tr>
          <tr><td className="mono">Ctrl + C</td><td>Stop the running server</td></tr>
        </tbody>
      </table>

      <Note title="The other way: Create React App">
        <p>You'll see older tutorials (and these lesson apps) use Create React App instead of Vite:</p>
        <Code>{`npx create-react-app my-react-app
cd my-react-app
npm start          # opens http://localhost:3000`}</Code>
        <p>Both give you a working React project. React's team retired Create React App in 2025 and recommends tools like Vite for new projects, which is why the slide uses Vite.</p>
      </Note>

      <Quiz
        onPass={markDone}
        questions={[
          { q: "How do you get npm?", options: ["Install Node.js; npm comes with it", "Download it from the React website", "It's built into the browser"], answer: 0, explain: "npm is bundled with Node.js." },
          { q: "What does npm install do?", options: ["Starts the app", "Downloads the packages listed in package.json", "Deletes node_modules"], answer: 1, explain: "It installs the project's dependencies." },
          { q: "Which command starts the Vite development server?", options: ["npm run dev", "npm create", "cd my-react-app"], answer: 0, explain: "npm run dev starts the local server at localhost:5173." },
        ]}
      />
    </>
  );
}
