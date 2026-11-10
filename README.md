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

Each student's progress is saved in their own browser (localStorage), per module.


