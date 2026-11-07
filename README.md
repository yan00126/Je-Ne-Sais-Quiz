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

### As a real app (no computer needed)

The app is built in the cloud with EAS and installed through TestFlight. This needs an Apple Developer account
($99/year) and a free Expo account. One-time setup on the Mac:

```bash
npm install
npx eas-cli@latest login               # Expo account
npx eas-cli@latest init                # links the app to an EAS project (writes projectId to app.json)
npx eas-cli@latest update:configure    # writes the update URL to app.json
npm run build:ios                      # cloud build, asks for your Apple ID the first time
npm run submit:ios                     # uploads the build to TestFlight
```

Then install **TestFlight** on the iPhone and open the build from there.

After a code change, most updates do not need a new build:

```bash
npm run update -- --message "what changed"
```

The app downloads the update in the background and uses it from the next launch. A new build (`build:ios` and
`submit:ios`) is only needed when a native package is added or `version` in `app.json` changes.
Data on the phone (progress, recordings) survives both kinds of update.

### With Expo Go (for development)

1. Install **Expo Go** from the App Store.
2. On your computer (Node 20+): `npm install`, then `npm start`.
3. Scan the QR code with the iPhone camera.

Expo Go and the TestFlight app are two different apps: data saved in one is not visible in the other.

## Develop

```bash
npm run typecheck   # TypeScript
npm test            # unit tests (node --test, needs Node 22+)
```

Tests sit next to the code they check (`*.test.ts`). `src/data/content.test.ts` checks the built-in content: unique ids, every question has a valid answer, every tâche is covered. Run `npm test` after adding words or questions. Once `.github/workflows/test.yml` is added, GitHub runs the type check and the tests on every pull request and shows a red ✗ if something broke.

Code lives in `src/`: screens in `src/app/` (Expo Router), content in `src/data/`, storage and scheduling in `src/lib/`.
