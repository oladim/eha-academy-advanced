import React, { useEffect, useState } from "react";
import { MODULES, moduleBySlug } from "./data.js";
import Home from "./Home.jsx";
import ModuleView from "./ModuleView.jsx";

/** Parses the hash into a route: the home screen, or a module + lesson. */
function parseHash() {
  const raw = window.location.hash.replace(/^#\/?/, ""); // "", "m1", "m1/variables"
  const [slug, lessonId] = raw.split("/");
  const mod = moduleBySlug(slug);
  if (!mod) return { view: "home" };
  const lesson = mod.lessons.find((l) => l.id === lessonId) || mod.lessons[0];
  return { view: "module", mod, lessonId: lesson.id };
}

export default function App() {
  const [route, setRoute] = useState(parseHash);

  useEffect(() => {
    const onHash = () => {
      setRoute(parseHash());
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  if (route.view === "home") return <Home modules={MODULES} />;
  return <ModuleView module={route.mod} lessonId={route.lessonId} />;
}
