// Every number of the loader's motion. All of it is derived from one clock (./clock.js);
// nothing else may tween these properties. Times are in seconds.
export const spiralLoaderConfig = {
  // Entry: the rings fade in where they sit, heavily blurred and slightly large, then pull
  // into focus as they settle. Everything starts at t = 0 and only decelerates.
  fadeInDur: 0.6,
  fadeInEase: "power2.out",
  settleDur: 1.6,
  settleEase: "power3.out",
  settleScaleFrom: 1.2,
  focusBlurFromPx: 16, // extra blur on top of the resting profile, gone once settled

  // C. Idle: constant spin, accumulated from dt.
  rotateDegPerSec: 6.5,

  // D. Exit, once loading has finished (and never before the settle has).
  exitDur: 1.0,
  exitScaleTo: 2.0,
  exitForeground: { start: 0, end: 0.35, ease: "power2.out" }, // the centre icon fades out
  // Rings blur back up to focusBlurFromPx, only while the loader is fading (same window).
  exitBlur: { start: 0.6, end: 0.9, ease: "power2.out" },
  exitScale: { start: 0.3, end: 1.0, ease: "power2.in" },
  exitFade: { start: 0.6, end: 0.9, ease: "power1.inOut" },
  exitPageBlur: { start: 0.4, end: 0.95, ease: "power3.out", fromPx: 20 },
  // The menu starts entering here, with the loader about 80% faded out.
  exitMenuCue: 0.8,

  // Resting blur: blurMax · smoothstep(inner, outer, r)^power, r = 0 centre → 1 corner.
  blurMaxVw: 1.5,
  blurProfileInner: 0.15,
  blurProfileOuter: 0.95,
  blurProfilePower: 1.3,

  // prefers-reduced-motion: entry and exit collapse to this fade, and nothing spins.
  reducedFadeDur: 0.3,
};
