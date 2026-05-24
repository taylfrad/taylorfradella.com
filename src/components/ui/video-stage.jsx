import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

// Shared font stack used by every project video scene (one source of truth).
export const VIDEO_FONT_STACK =
  "'Inter', -apple-system, 'Helvetica Neue', Helvetica, Arial, sans-serif";

// Easing functions
export const Easing = {
  linear: (t) => t,
  easeInQuad: (t) => t * t,
  easeOutQuad: (t) => t * (2 - t),
  easeInCubic: (t) => t * t * t,
  easeOutCubic: (t) => --t * t * t + 1,
  easeInOutCubic: (t) => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1),
  easeOutBack: (t) => {
    const c1 = 1.70158, c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
  easeInBack: (t) => {
    const c1 = 1.70158, c3 = c1 + 1;
    return c3 * t * t * t - c1 * t * t;
  },
};

export const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

export function animate({ from = 0, to = 1, start = 0, end = 1, ease = Easing.easeInOutCubic }) {
  return (t) => {
    if (t <= start) return from;
    if (t >= end) return to;
    const local = (t - start) / (end - start);
    return from + (to - from) * ease(local);
  };
}

// Timeline context
const TimelineContext = createContext({ time: 0, duration: 10, playing: false });
export const useTime = () => useContext(TimelineContext).time;
export const useTimeline = () => useContext(TimelineContext);

// Sprite context
const SpriteContext = createContext({ localTime: 0, progress: 0, duration: 0 });
export const useSprite = () => useContext(SpriteContext);

export function Sprite({ start = 0, end = Infinity, children }) {
  const { time } = useTimeline();
  const visible = time >= start && time <= end;
  if (!visible) return null;

  const duration = end - start;
  const localTime = Math.max(0, time - start);
  const progress = duration > 0 && Number.isFinite(duration) ? clamp(localTime / duration, 0, 1) : 0;
  const value = { localTime, progress, duration, visible };

  return (
    <SpriteContext.Provider value={value}>
      {children}
    </SpriteContext.Provider>
  );
}

// Lightweight stage — no playback bar, no scaling, just a RAF loop
export function CardStage({ duration = 10, playing = false, loop = true, children }) {
  const [time, setTime] = useState(0);
  const rafRef = useRef(null);
  const lastTsRef = useRef(null);
  // MOBILE-SWARM: webgl single ref accumulator is the source of truth for the
  // playhead. The rAF loop advances it and pushes a concrete value to setTime,
  // replacing the per-frame functional-updater closure (which re-read prev
  // state inside the setter every frame). Visible per-frame animation is
  // unchanged — these scenes read `time` from context synchronously and
  // interpolate sub-second, so a render per frame is still required; this only
  // trims the reconciliation/closure overhead, it does not change pixels.
  const timeRef = useRef(0);

  const setTimeCb = useCallback((t) => {
    timeRef.current = t;
    setTime(t);
  }, []);
  const setPlayingCb = useCallback(() => {}, []);

  // Reset time when starting playback
  const prevPlaying = useRef(false);
  useEffect(() => {
    if (playing && !prevPlaying.current) {
      timeRef.current = 0;
      setTime(0);
    }
    prevPlaying.current = playing;
  }, [playing]);

  // RAF loop
  useEffect(() => {
    if (!playing) {
      lastTsRef.current = null;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }
    const step = (ts) => {
      if (lastTsRef.current == null) lastTsRef.current = ts;
      const dt = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;
      let next = timeRef.current + dt;
      if (next >= duration) {
        next = loop ? next % duration : duration;
      }
      timeRef.current = next;
      setTime(next);
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTsRef.current = null;
    };
  }, [playing, duration, loop]);

  const ctxValue = useMemo(
    () => ({ time, duration, playing, setTime: setTimeCb, setPlaying: setPlayingCb }),
    [time, duration, playing, setTimeCb, setPlayingCb],
  );

  return (
    <TimelineContext.Provider value={ctxValue}>
      {children}
    </TimelineContext.Provider>
  );
}
