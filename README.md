# Je Ne Sais Quiz

An iPhone app for preparing the **TCF Canada** in about six months, from early B1 toward B2.
Every day it gives you a short plan that covers the four tested skills equally:

- **Compréhension orale**: listening documents read aloud, with exam-style multiple-choice questions
- **Compréhension écrite**: reading texts with multiple-choice questions
- **Expression écrite**: the three TCF writing tasks, with timer and word counter
- **Expression orale**: the three TCF speaking tasks, recorded with the exam time limits

Vocabulary is reviewed with spaced repetition (FSRS), and everything is stored on the phone.

## Run it on your iPhone

1. Install **Expo Go** from the App Store.
2. On your computer (Node 20+): `npm install`, then `npm start`.
3. Scan the QR code with the iPhone camera.

## Develop

```bash
npm run typecheck   # TypeScript
npm test            # unit tests (node --test)
```

Code lives in `src/`: screens in `src/app/` (Expo Router), content in `src/data/`, storage and scheduling in `src/lib/`.
