// Loads Babel (the JSX compiler) only when a lesson needs it, so the app starts fast.
let babelPromise = null;
export function loadBabel() {
  if (!babelPromise) babelPromise = import("@babel/standalone");
  return babelPromise;
}

/** Turns JSX into plain JavaScript (React.createElement calls). */
export async function compileJsx(src) {
  const Babel = await loadBabel();
  return Babel.transform(src, { presets: [["react", { runtime: "classic" }]] }).code;
}
