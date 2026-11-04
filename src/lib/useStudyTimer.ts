import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { lastActive, markActive } from './activity';
import { logStudyTime, type Skill } from './db';
import { activeMs } from './stats';

const TICK_MS = 5_000;
const SAVE_EVERY_S = 60;

// Counts active study time on a practice screen: only while the screen is in front, the app is open,
// and the learner touched or typed in the last 3 minutes. `busy` keeps it counting without touches,
// e.g. while recording a long answer. Time is saved about once a minute, so a crash loses little.
export function useStudyTimer(skill: Skill, busy = false) {
  const db = useSQLiteContext();
  const busyRef = useRef(busy);
  busyRef.current = busy;
  useEffect(() => {
    if (busy) markActive();
  }, [busy]);

  useFocusEffect(
    useCallback(() => {
      let running = false;
      let prevTick = 0;
      let chunkStart = 0;
      let seconds = 0;

      const save = () => {
        if (seconds >= 1) logStudyTime(db, skill, chunkStart, Math.round(seconds)).catch(() => {});
        seconds = 0;
        chunkStart = Date.now();
      };
      const tick = () => {
        if (!running) return;
        const now = Date.now();
        if (busyRef.current) markActive();
        seconds += activeMs(prevTick, now, lastActive()) / 1000;
        prevTick = now;
        if (seconds >= SAVE_EVERY_S) save();
      };
      const start = () => {
        if (running) return;
        running = true;
        prevTick = chunkStart = Date.now();
        seconds = 0;
        markActive();
      };
      const stop = () => {
        if (!running) return;
        tick();
        running = false;
        save();
      };

      if (AppState.currentState === 'active') start();
      const interval = setInterval(tick, TICK_MS);
      const sub = AppState.addEventListener('change', (s) => (s === 'active' ? start() : stop()));
      return () => {
        clearInterval(interval);
        sub.remove();
        stop();
      };
    }, [db, skill]),
  );
}
