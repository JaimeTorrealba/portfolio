import { gsap } from "gsap";
import { spiralLoaderConfig as config } from "./config.js";
import { restBlurPxForRing } from "./blurProfile.js";

const { interpolate } = gsap.utils;
const clamp01 = gsap.utils.clamp(0, 1);
// A tab switch hands over one huge dt; cap it so the timeline can't skip a whole phase.
const MAX_DT = 0.1;
const VIEWBOX_SIZE = 500;
// TresCanvas marks its canvas with data-tres; it is the page the exit reveals.
const PAGE_CANVAS_SELECTOR = "canvas[data-tres]";

const phaseProgress = (time, { start, end }) => clamp01((time - start) / (end - start));
const easedPhase = (time, phase) => gsap.parseEase(phase.ease)(phaseProgress(time, phase));

const blurFilter = (px) => (px > 0.01 ? `blur(${px.toFixed(2)}px)` : "");

// Only touch the DOM when a value changes, so a settled loader stops restyling its filters.
const createStyleWriter = () => {
  const written = new WeakMap();
  return (el, prop, value) => {
    const styles = written.get(el) ?? {};
    if (styles[prop] === value) return;
    styles[prop] = value;
    written.set(el, styles);
    el.style[prop] = value;
  };
};

// One rAF clock for the whole loader: every value is derived from `elapsed`, and the spin
// from an angle accumulated with dt, so nothing jumps when a phase starts or ends.
export const createLoaderClock = ({ rings, foreground, reducedMotion }) => {
  const writeStyle = createStyleWriter();
  const fadeInEase = gsap.parseEase(config.fadeInEase);
  const settleEase = gsap.parseEase(config.settleEase);
  const reducedFade = { start: 0, end: config.reducedFadeDur, ease: config.exitFade.ease };
  const introEnd = reducedMotion
    ? config.reducedFadeDur
    : Math.max(config.fadeInDur, config.settleDur);
  const exitEnd = reducedMotion ? config.reducedFadeDur : config.exitDur;

  let frameId = 0;
  let lastNow = null;
  let elapsed = 0;
  let angle = 0;
  let exit = null;

  rings.forEach((ring) => {
    ring.startOpacity = parseFloat(getComputedStyle(ring.svg).opacity);
  });

  const measureRings = () => {
    rings.forEach((ring) => {
      ring.unitsPerPx = VIEWBOX_SIZE / ring.svg.clientWidth;
      ring.restBlurPx = restBlurPxForRing(ring.svg.clientWidth);
    });
  };

  // Fade, focus and scale all start at t = 0 and only slow down from there, so the rings are
  // in motion from their very first frame instead of popping in mid-sequence.
  const introPose = () => {
    const settled = settleEase(clamp01(elapsed / config.settleDur));
    return {
      opacity: fadeInEase(clamp01(elapsed / config.fadeInDur)),
      focusBlurPx: config.focusBlurFromPx * (1 - settled),
      scale: interpolate(config.settleScaleFrom, 1, settled),
    };
  };

  const paintRings = (exitTime) => {
    const pose = introPose();
    // The exit never starts before the settle ends, so this picks up from exactly 1.
    const scale = pose.scale * interpolate(1, config.exitScaleTo, easedPhase(exitTime, config.exitScale));
    // On the way out the rings lose focus again, back to the blur they entered with.
    const blurPx = pose.focusBlurPx + config.focusBlurFromPx * easedPhase(exitTime, config.exitBlur);
    rings.forEach((ring) => {
      const rotation = (angle * ring.dir).toFixed(3);
      writeStyle(
        ring.svg,
        "transform",
        `translate(-50%, -50%) rotate(${rotation}deg) scale(${scale.toFixed(4)})`
      );
      // The svg's filter sits under its own scale; divide it back out to keep screen px.
      writeStyle(ring.svg, "filter", blurFilter(blurPx / scale));
      writeStyle(ring.svg, "opacity", pose.opacity.toFixed(3));
      writeStyle(ring.text, "filter", blurFilter(ring.restBlurPx * ring.unitsPerPx));
    });
  };

  const paintExit = (exitTime) => {
    writeStyle(foreground, "opacity", (1 - easedPhase(exitTime, config.exitForeground)).toFixed(3));
    writeStyle(exit.root, "opacity", String(1 - easedPhase(exitTime, config.exitFade)));
    if (!exit.page) return;
    const pageBlurPx = config.exitPageBlur.fromPx * (1 - easedPhase(exitTime, config.exitPageBlur));
    writeStyle(exit.page, "filter", blurFilter(pageBlurPx));
  };

  const paintReduced = (exitTime) => {
    const fadeIn = clamp01(elapsed / config.reducedFadeDur);
    rings.forEach((ring) => {
      writeStyle(ring.svg, "opacity", String(interpolate(ring.startOpacity, 1, fadeIn)));
      writeStyle(ring.text, "filter", blurFilter(ring.restBlurPx * ring.unitsPerPx));
    });
    if (exit) writeStyle(exit.root, "opacity", String(1 - easedPhase(exitTime, reducedFade)));
  };

  const tick = (now) => {
    const dt = lastNow === null ? 0 : Math.min((now - lastNow) / 1000, MAX_DT);
    lastNow = now;
    elapsed += dt;
    if (!reducedMotion) angle = (angle + config.rotateDegPerSec * dt) % 360;
    const exitTime = exit ? elapsed - exit.start : -1;
    if (reducedMotion) {
      paintReduced(exitTime);
    } else {
      paintRings(exitTime);
      if (exit) paintExit(exitTime);
    }
    // Under reduced motion the whole exit is shorter than the cue, so it fires at the end.
    if (exit && !exit.cued && exitTime >= Math.min(config.exitMenuCue, exitEnd)) {
      exit.cued = true;
      exit.onAlmostGone();
    }
    if (exit && exitTime >= exitEnd) return exit.done();
    frameId = requestAnimationFrame(tick);
  };

  const start = () => {
    measureRings();
    window.addEventListener("resize", measureRings, { passive: true });
    frameId = requestAnimationFrame(tick);
  };

  // Called from the Transition's leave hook; `done` lets Vue remove the loader, and
  // `onAlmostGone` fires at config.exitMenuCue.
  const playExit = (root, done, onAlmostGone) => {
    exit = {
      root,
      done,
      onAlmostGone,
      cued: false,
      // Waiting for the settle to finish keeps the exit from cutting a tween mid-flight.
      start: Math.max(elapsed, introEnd),
      page: document.querySelector(PAGE_CANVAS_SELECTOR),
    };
  };

  const stop = () => {
    cancelAnimationFrame(frameId);
    window.removeEventListener("resize", measureRings);
    // The page canvas outlives the loader; never leave it blurred.
    if (exit?.page) exit.page.style.filter = "";
  };

  return { start, playExit, stop };
};
