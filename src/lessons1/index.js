import Welcome from "./Welcome.jsx";
import WhatIsJS from "./WhatIsJS.jsx";
import Syntax from "./Syntax.jsx";
import Variables from "./Variables.jsx";
import DataTypes from "./DataTypes.jsx";
import Expressions from "./Expressions.jsx";
import Functions from "./Functions.jsx";
import DomOverview from "./DomOverview.jsx";
import DomMethods from "./DomMethods.jsx";
import CssInJs from "./CssInJs.jsx";
import Events from "./Events.jsx";
import Callbacks from "./Callbacks.jsx";
import Promises from "./Promises.jsx";
import AsyncAwait from "./AsyncAwait.jsx";
import Conclusion from "./Conclusion.jsx";

// `slide` = which slide(s) of the original deck this lesson teaches.
export const lessons = [
  { id: "welcome", title: "Welcome & objectives", group: "Start here", slide: "1–2", component: Welcome },
  { id: "what-is-js", title: "What is JavaScript?", group: "The basics", slide: 3, component: WhatIsJS },
  { id: "syntax", title: "JavaScript syntax", group: "The basics", slide: 4, component: Syntax },
  { id: "variables", title: "Variables", group: "The basics", slide: 5, component: Variables },
  { id: "data-types", title: "Data types", group: "The basics", slide: 6, component: DataTypes },
  { id: "expressions", title: "Expressions & operators", group: "The basics", slide: 7, component: Expressions },
  { id: "functions", title: "Functions", group: "The basics", slide: 7, component: Functions },
  { id: "dom", title: "The DOM", group: "The web page", slide: 8, component: DomOverview },
  { id: "dom-methods", title: "DOM methods", group: "The web page", slide: 9, component: DomMethods },
  { id: "css-in-js", title: "CSS from JavaScript", group: "The web page", slide: 10, component: CssInJs },
  { id: "events", title: "Events", group: "The web page", slide: 11, component: Events },
  { id: "callbacks", title: "Callbacks", group: "Asynchronous JS", slide: 12, component: Callbacks },
  { id: "promises", title: "Promises", group: "Asynchronous JS", slide: 13, component: Promises },
  { id: "async-await", title: "Async / await", group: "Asynchronous JS", slide: 14, component: AsyncAwait },
  { id: "wrap-up", title: "Wrap-up and Q&A", group: "Finish", slide: "15–16", component: Conclusion },
];
