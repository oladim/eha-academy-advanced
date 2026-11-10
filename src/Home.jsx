import React from "react";
import { readProgress } from "./data.js";

export default function Home({ modules }) {
  return (
    <div className="home">
      <header className="home-hero">
        <div className="home-brand">
          <span className="home-mark" aria-hidden="true" />
          eHA Academy
        </div>
        <p className="home-eyebrow">Advanced Cohort · Self-paced</p>
        <h1 className="home-title">
          Learn to build for the web, one interactive lesson at a time.
        </h1>
        <p className="home-lead">
          Every slide becomes a short lesson with a plain explanation, visual demos, code you can
          run, and a quick check. Choose a module to begin.
        </p>
      </header>

      <main className="module-grid">
        {modules.map((m) => {
          const done = readProgress(m.storeKey);
          const count = m.lessons.filter((l) => done[l.id]).length;
          const total = m.lessons.length;
          const started = count > 0;
          const pct = Math.round((count / total) * 100);
          return (
            <a className="module-card" key={m.slug} href={`#/${m.slug}`}>
              <div className="module-card-top">
                <span className="module-mark" aria-hidden="true">{m.mark}</span>
                <span className="module-index">Module {m.number}</span>
              </div>
              <h2 className="module-card-title">{m.title}</h2>
              <p className="module-tagline">{m.tagline}</p>
              <p className="module-blurb">{m.blurb}</p>

              <div className="module-meter" aria-hidden="true">
                <span style={{ width: `${pct}%` }} />
              </div>
              <div className="module-foot">
                <span className="module-count">
                  {started ? `${count} of ${total} done` : `${total} lessons`}
                </span>
                <span className="module-go">{started ? "Continue" : "Start"} →</span>
              </div>
            </a>
          );
        })}
      </main>

      <footer className="home-foot">
        Your progress is saved in this browser, so you can close the page and pick up where you left
        off.
      </footer>
    </div>
  );
}
