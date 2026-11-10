import React from "react";

/** Callout boxes. kind: "note" | "precise" | "tip" | "warn" */
export function Note({ kind = "note", title, children }) {
  const defaults = {
    note: "Good to know",
    precise: "More precisely…",
    tip: "Teaching tip",
    warn: "Watch out",
  };
  return (
    <div className={`note ${kind === "note" ? "" : kind}`}>
      <span className="note-title">{title || defaults[kind]}</span>
      {children}
    </div>
  );
}

/** A demo panel with the deck's hard offset shadow. */
export function Panel({ title, sub, children }) {
  return (
    <section className="panel">
      {title && <h3 className="panel-title">{title}</h3>}
      {sub && <p className="panel-sub">{sub}</p>}
      {children}
    </section>
  );
}

export function Tabs({ tabs, value, onChange }) {
  return (
    <div className="tabs" role="tablist">
      {tabs.map((t) => (
        <button
          key={t}
          role="tab"
          aria-selected={value === t}
          className={`tab ${value === t ? "active" : ""}`}
          onClick={() => onChange(t)}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
