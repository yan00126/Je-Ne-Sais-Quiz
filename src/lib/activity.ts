// When the learner last touched the screen or typed. The study timer stops counting after a few idle minutes.
let last = Date.now();

export function markActive() {
  last = Date.now();
}

export function lastActive() {
  return last;
}
