import { gsap } from "gsap";
import { spiralLoaderConfig as config } from "./config.js";

// Each ring's text runs along a circle of radius 187.66 in its 500-unit viewBox.
const RING_RADIUS_RATIO = 187.66 / 500;
const clamp01 = gsap.utils.clamp(0, 1);

const smoothstep = (edge0, edge1, x) => {
  const k = clamp01((x - edge0) / (edge1 - edge0));
  return k * k * (3 - 2 * k);
};

// Resting blur of a ring in screen px: blurMax · smoothstep(0.15, 0.95, r)^1.3, where r is
// the ring's radius over the centre-to-corner distance. The rings are the only text, so the
// profile is sampled at their three radii.
export const restBlurPxForRing = (ringWidthPx) => {
  const cornerPx = Math.hypot(window.innerWidth, window.innerHeight) / 2;
  const r = (ringWidthPx * RING_RADIUS_RATIO) / cornerPx;
  const blurMaxPx = (window.innerWidth * config.blurMaxVw) / 100;
  const falloff = smoothstep(config.blurProfileInner, config.blurProfileOuter, r);
  return blurMaxPx * falloff ** config.blurProfilePower;
};
