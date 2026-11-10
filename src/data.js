import { lessons as module1Lessons } from "./lessons1/index.js";
import { lessons as module2Lessons } from "./lessons2/index.js";

// The two modules of the course. Each lesson array is defined in its own
// lessons folder; nothing about the lesson content changes when they are merged.
export const MODULES = [
  {
    slug: "m1",
    number: 1,
    mark: "JS",
    title: "JavaScript Fundamentals",
    tagline: "The language of the web",
    blurb:
      "Syntax, variables, data types, functions, the DOM, events, callbacks, promises and async/await.",
    storeKey: "eha-m1-progress-v1",
    lessons: module1Lessons,
  },
  {
    slug: "m2",
    number: 2,
    mark: "⚛",
    title: "JS Frameworks & React Basics",
    tagline: "Building user interfaces with React",
    blurb:
      "What frameworks are, React vs Angular vs Vue, components, props, state, events and useEffect — with live React code.",
    storeKey: "eha-m2-progress-v1",
    lessons: module2Lessons,
  },
];

export const moduleBySlug = (slug) => MODULES.find((m) => m.slug === slug);

/** Reads a module's saved progress without needing the module mounted. */
export function readProgress(storeKey) {
  try {
    return JSON.parse(localStorage.getItem(storeKey)) || {};
  } catch {
    return {};
  }
}
