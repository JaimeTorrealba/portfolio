// Seeded randomness for the red button. Nothing in it may call Math.random():
// the same seed has to draw the same button every time.

// mulberry32: tiny, fast, good enough for visuals. Returns floats in [0, 1).
export const createRandom = (seed) => {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let mixed = state
    mixed = Math.imul(mixed ^ (mixed >>> 15), mixed | 1)
    mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61)
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296
  }
}

// Every feature (chips, scratches...) draws from its own stream, so a button that
// grows taller and samples more outline points keeps the same chips.
export const createStream = (seed, streamName) => {
  let hash = seed ^ 0x811c9dc5
  for (const char of streamName) hash = Math.imul(hash ^ char.charCodeAt(0), 0x01000193)
  return createRandom(hash)
}

export const randomBetween = (random, min, max) => min + random() * (max - min)

export const randomIntBetween = (random, min, max) => Math.floor(randomBetween(random, min, max + 1))

export const randomSign = (random) => (random() < 0.5 ? -1 : 1)

// 1D value noise with smoothstep interpolation, in [-1, 1]. 256 lattice values, so it
// repeats every 256 units of input; at the frequencies used here that is several metres.
export const createNoise1D = (random) => {
  const lattice = Float32Array.from({ length: 256 }, () => random() * 2 - 1)
  return (x) => {
    const cell = Math.floor(x)
    const fraction = x - cell
    const eased = fraction * fraction * (3 - 2 * fraction)
    const from = lattice[cell & 255]
    const to = lattice[(cell + 1) & 255]
    return from + (to - from) * eased
  }
}
