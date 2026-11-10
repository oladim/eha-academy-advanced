import Welcome from "./Welcome.jsx";
import WhatIsFramework from "./WhatIsFramework.jsx";
import WhyFramework from "./WhyFramework.jsx";
import FrameworkVsLibrary from "./FrameworkVsLibrary.jsx";
import Features from "./Features.jsx";
import Popular from "./Popular.jsx";
import WhatIsReact from "./WhatIsReact.jsx";
import ReactFeatures from "./ReactFeatures.jsx";
import Installing from "./Installing.jsx";
import Components from "./Components.jsx";
import PropsState from "./PropsState.jsx";
import EventHandling from "./EventHandling.jsx";
import UseEffectLesson from "./UseEffectLesson.jsx";
import QuickComparison from "./QuickComparison.jsx";
import InstallDemo from "./InstallDemo.jsx";
import Summary from "./Summary.jsx";

// `slide` = which slide(s) of the original deck this lesson teaches.
export const lessons = [
  { id: "welcome", title: "Welcome", group: "Start here", slide: 1, component: Welcome },
  { id: "what-is-a-framework", title: "What is a JS framework?", group: "Frameworks", slide: 2, component: WhatIsFramework },
  { id: "why-frameworks", title: "Why use a framework?", group: "Frameworks", slide: 3, component: WhyFramework },
  { id: "framework-vs-library", title: "Framework vs library", group: "Frameworks", slide: 4, component: FrameworkVsLibrary },
  { id: "features", title: "Features & capabilities", group: "Frameworks", slide: 5, component: Features },
  { id: "popular", title: "React, Angular and Vue", group: "Frameworks", slide: 6, component: Popular },
  { id: "what-is-react", title: "What is React?", group: "Meet React", slide: 7, component: WhatIsReact },
  { id: "react-features", title: "React's key features", group: "Meet React", slide: 8, component: ReactFeatures },
  { id: "installing", title: "Installing React", group: "Meet React", slide: 9, component: Installing },
  { id: "components", title: "Components", group: "Building with React", slide: 10, component: Components },
  { id: "props-state", title: "Props & state", group: "Building with React", slide: 11, component: PropsState },
  { id: "events", title: "Event handling", group: "Building with React", slide: 12, component: EventHandling },
  { id: "use-effect", title: "The useEffect hook", group: "Building with React", slide: 13, component: UseEffectLesson },
  { id: "comparison", title: "Without vs with React", group: "Putting it together", slide: 14, component: QuickComparison },
  { id: "install-demo", title: "Your first React app", group: "Putting it together", slide: 15, component: InstallDemo },
  { id: "summary", title: "Summary and Q&A", group: "Finish", slide: "16–17", component: Summary },
];
