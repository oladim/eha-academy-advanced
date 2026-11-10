import React, { useEffect, useState } from "react";
import { MODULES } from "./data.js";

function loadDone(storeKey) {
  try {
    return JSON.parse(localStorage.getItem(storeKey)) || {};
  } catch {
    return {};
  }
}

export default function ModuleView({ module, lessonId }) {
  const { lessons, storeKey, slug } = module;
  const [done, setDone] = useState(() => loadDone(storeKey));
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => setMenuOpen(false), [lessonId]);

  useEffect(() => {
    try {
      localStorage.setItem(storeKey, JSON.stringify(done));
    } catch {
      /* storage blocked: progress just won't persist */
    }
  }, [done, storeKey]);

  const index = lessons.findIndex((l) => l.id === lessonId);
  const lesson = lessons[index];
  const prev = lessons[index - 1];
  const next = lessons[index + 1];
  const Lesson = lesson.component;
  const completed = lessons.filter((l) => done[l.id]).length;

  const markDone = () => setDone((d) => (d[lesson.id] ? d : { ...d, [lesson.id]: true }));
  const toggleDone = () => setDone((d) => ({ ...d, [lesson.id]: !d[lesson.id] }));

  const other = MODULES.find((m) => m.slug !== slug);
  let lastGroup = null;

  return (
    <div className="shell">
      <aside className={`sidebar ${menuOpen ? "open" : ""}`} aria-label="Lessons">
        <a className="sidebar-home" href="#/">
          <span aria-hidden="true">←</span> All modules
        </a>

        <div className="brand">
          <div className="brand-mark" aria-hidden="true">{module.mark}</div>
          <div>
            <div className="brand-kicker">Module {module.number}</div>
            <div className="brand-name">{module.title}</div>
          </div>
        </div>

        <div className="progress">
          <div className="progress-top">
            <span>Your progress</span>
            <span>{completed} / {lessons.length}</span>
          </div>
          <div className="progress-bar" aria-hidden="true">
            <span style={{ width: `${(completed / lessons.length) * 100}%` }} />
          </div>
        </div>

        <ul className="nav">
          {lessons.map((l, i) => {
            const groupHeader = l.group !== lastGroup ? <li className="nav-group">{l.group}</li> : null;
            lastGroup = l.group;
            return (
              <React.Fragment key={l.id}>
                {groupHeader}
                <li>
                  <a
                    href={`#/${slug}/${l.id}`}
                    className={l.id === lessonId ? "active" : ""}
                    aria-current={l.id === lessonId ? "page" : undefined}
                  >
                    <span className="num">{String(i + 1).padStart(2, "0")}</span>
                    <span className="nav-title">{l.title}</span>
                    <span className="tick">{done[l.id] ? "✓" : ""}</span>
                  </a>
                </li>
              </React.Fragment>
            );
          })}
        </ul>

        {other && (
          <a className="sidebar-switch" href={`#/${other.slug}`}>
            <span className="muted">Next up</span>
            <strong>Module {other.number}: {other.title} →</strong>
          </a>
        )}
      </aside>

      <div className="main">
        <button className="menu-btn" onClick={() => setMenuOpen((o) => !o)} aria-expanded={menuOpen}>
          <span aria-hidden="true">☰</span>
          <span>{index + 1}. {lesson.title}</span>
        </button>

        <main className="lesson" key={lesson.id}>
          <div className="lesson-meta">
            <span className="lesson-meta-mod">Module {module.number}</span>
            Lesson {index + 1} of {lessons.length} · From slide {lesson.slide}
          </div>
          <Lesson markDone={markDone} />

          <div className="lesson-foot">
            {prev ? (
              <a className="btn" href={`#/${slug}/${prev.id}`}>← {prev.title}</a>
            ) : (
              <a className="btn" href="#/">← All modules</a>
            )}
            <button className={`btn done-btn ${done[lesson.id] ? "is-done" : ""}`} onClick={toggleDone}>
              {done[lesson.id] ? "✓ Lesson done" : "Mark lesson done"}
            </button>
            {next ? (
              <a className="btn primary" href={`#/${slug}/${next.id}`}>{next.title} →</a>
            ) : (
              <a className="btn primary" href="#/">Finish module ✓</a>
            )}
          </div>
        </main>
      </div>

      {menuOpen && <div className="scrim" onClick={() => setMenuOpen(false)} />}
    </div>
  );
}
