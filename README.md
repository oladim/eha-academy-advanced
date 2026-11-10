# eHA Academy — interactive lessons

One React app (Create React App) for the eHA Academy Advanced Cohort. The home screen lets students
pick a module; each module is a set of self-paced lessons with plain explanations, visual demos,
code you can run, and a quick check.

| Module | Lessons | Route |
|--------|---------|-------|
| Module 1 — JavaScript Fundamentals | 15 | `#/m1` |
| Module 2 — JS Frameworks & React Basics | 16 | `#/m2` |

## Run it locally

You need [Node.js](https://nodejs.org) 18 or newer.

```bash
npm install
npm start          # opens http://localhost:3000
```

Edit a lesson in `src/lessons1/` (Module 1) or `src/lessons2/` (Module 2), save, and the browser
updates. `npm install` prints some "deprecated" warnings; that's normal for Create React App.

To build the static site:

```bash
npm run build      # output goes to the build/ folder
```

## Publishing (GitHub Pages)

The site deploys automatically with GitHub Actions (`.github/workflows/deploy.yml`) on every push to
`main`. One-time setup: in the repository, go to **Settings → Pages → Build and deployment → Source**
and choose **GitHub Actions**. The site then appears at
`https://<your-username>.github.io/<repo-name>/`.

`homepage` is set to `"."` in `package.json`, so the app uses relative paths and works under any
GitHub Pages sub-path.

## How it's organised

```
public/index.html         the page shell
src/
  index.js                entry point (font imports)
  App.jsx                 hash router: home vs. a module
  Home.jsx                the module picker (landing screen)
  ModuleView.jsx          sidebar + lesson shell, shared by both modules
  data.js                 the two modules and their lesson lists
  styles.css              the whole "Ink & Gold" theme (design tokens at the top)
  components/             Code, TryIt, ReactTryIt, Quiz, Bits (shared by both modules)
  lessons1/               Module 1 lessons + index.js (order & titles)
  lessons2/               Module 2 lessons + index.js (order & titles)
```

Each student's progress is saved in their own browser (localStorage), per module.

### Changing the look

All colours, fonts and shadows are CSS variables at the top of `src/styles.css`. The accent gold is
`--gold`; the secondary blue is `--blue`. Change those two and the whole site follows.
