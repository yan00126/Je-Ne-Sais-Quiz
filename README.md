# Je Ne Sais Quiz

An iPhone app for preparing the **TCF Canada** in about six months, from early B1 toward B2.
Every day it gives you a short plan that covers the four tested skills equally:

- **Compréhension orale**: listening documents read aloud, with exam-style multiple-choice questions
- **Compréhension écrite**: reading texts with multiple-choice questions
- **Expression écrite**: the three TCF writing tasks, with timer and word counter
- **Expression orale**: the three TCF speaking tasks, recorded with the exam time limits

Vocabulary is reviewed with spaced repetition (FSRS). New words start as flashcards; known words come back as
typed exercises (dictation, meaning → French, fill in the blank) that are graded automatically.
Wrong answers in listening and reading go to a mistake log with explanations. Everything is stored on the phone.

A step of the daily plan (about an hour) only counts as done after real work: all vocabulary cards reviewed,
3 listening documents, 3 reading texts, and either one writing task with the minimum word count or
3 spoken answers of at least 60 % of the time limit. The rules live in `src/lib/plan.ts`.

## Run it on your iPhone

### From the cloud in Expo Go (free, no computer needed)

The app is published to Expo's servers with EAS Update and opened in **Expo Go**. Free Expo account, no Apple
Developer account. `runtimeVersion` uses the `sdkVersion` policy (`exposdk:58.0.0`), which is what Expo Go accepts.

One-time setup on the Mac:

```bash
npm install
npx eas-cli@latest login               # Expo account
npx eas-cli@latest init                # links the app to an EAS project (writes projectId to app.json)
npx eas-cli@latest update:configure    # writes the update URL to app.json
git add app.json && git commit -m "Link EAS project" && git push
npm run update -- --message "first version"
```

Then on the iPhone, sign in to Expo Go with the same Expo account. The app shows up under **Projects**; open it
and pick the `production` branch. (Or open expo.dev → the project → Updates → the update → **Preview** and scan
the QR code.) After that, Expo Go lists it under **Recently opened**.

After a code change: `npm run update -- --message "what changed"`. Expo Go loads the new version the next time the
app is opened. Expo Go's own updates can move to a newer Expo SDK; when that happens, the project's SDK has to be
upgraded too.

### As a real app with TestFlight

Needs an Apple Developer account ($99/year). After the setup above:

```bash
npm run build:ios                      # cloud build, asks for your Apple ID the first time
npm run submit:ios                     # uploads the build to TestFlight
```

Install **TestFlight** on the iPhone and open the build from there. The same `npm run update` reaches it too.
A new build is only needed when a native package is added.

### With the dev server (for development)

1. Install **Expo Go** from the App Store.
2. On your computer (Node 20+): `npm install`, then `npm start`.
3. Scan the QR code with the iPhone camera.

Data is stored per app and per project: the dev-server version, the cloud version in Expo Go, and the TestFlight
app each keep their own progress.

## Develop

```bash
npm run typecheck   # TypeScript
npm test            # unit tests (node --test, needs Node 22+)
```

Tests sit next to the code they check (`*.test.ts`). `src/data/content.test.ts` checks the built-in content: unique ids, every question has a valid answer, every tâche is covered. Run `npm test` after adding words or questions. Once `.github/workflows/test.yml` is added, GitHub runs the type check and the tests on every pull request and shows a red ✗ if something broke.

Code lives in `src/`: screens in `src/app/` (Expo Router), content in `src/data/`, storage and scheduling in `src/lib/`.
