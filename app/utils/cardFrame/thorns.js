// The spiky, chipped silhouette: barb clusters on the corners, small thorns on the
// edges and notches cut into the outer edge. Each one returns path commands that
// rectWalker.js splices into the outline.
import { getRoughEdgePoint } from './rectWalker.js'
import { randomBetween, randomIntBetween, randomSign } from './random.js'

const DEG = Math.PI / 180
const CORNER_SPAN = 22 // px of each edge a corner cluster replaces
const CORNER_FAN = 32 * DEG // spread of the barbs around the diagonal

const lerpPoint = (from, to, amount) => [from[0] + (to[0] - from[0]) * amount, from[1] + (to[1] - from[1]) * amount]

const getAngleVector = (angle) => [Math.cos(angle), Math.sin(angle)]

// One barb: base p0 -> curved tip -> base p1. Both sides bend the same way through
// their quadratic controls, so the barb hooks a little instead of being a straight triangle.
const buildBarbCommands = ({ baseStart, baseEnd, angle, length, bend }) => {
  const baseMiddle = lerpPoint(baseStart, baseEnd, 0.5)
  const axis = getAngleVector(angle)
  const side = [-axis[1] * bend, axis[0] * bend]
  const tip = [baseMiddle[0] + axis[0] * length, baseMiddle[1] + axis[1] * length]
  const bendControl = (base) => {
    const control = lerpPoint(base, tip, 0.6)
    return [control[0] + side[0], control[1] + side[1]]
  }
  return [
    { type: 'L', point: baseStart },
    { type: 'Q', control: bendControl(baseStart), point: tip },
    { type: 'Q', control: bendControl(baseEnd), point: baseEnd },
  ]
}

const getNormalAngle = (edge) => Math.atan2(edge.normal[1], edge.normal[0])

// Corner cluster at edge.start, fanned between the previous edge's normal and this one's.
// t runs 0..2*span over the L-shaped corner: the end of the previous edge, then the start of this.
export const buildCornerCluster = ({ edge, previousEdge, random, displace, barbCount, thornLength }) => {
  const span = CORNER_SPAN
  const cornerPointAt = (t) =>
    t < span
      ? getRoughEdgePoint(previousEdge, previousEdge.length - span + t, displace)
      : getRoughEdgePoint(edge, t - span, displace)
  // Out-normal is the in-normal turned +90deg when walking clockwise, so the diagonal is +45deg.
  const diagonal = getNormalAngle(previousEdge) + 45 * DEG
  const slotWidth = (span * 2) / barbCount
  const commands = []
  let t = 0
  // Plain base between barbs, plus the corner vertex itself when the stretch crosses it.
  const sampleUntil = (limit) => {
    const stops = []
    for (let stop = t; stop < limit; stop += 7) stops.push(stop)
    if (span >= t && span < limit) stops.push(span)
    stops.sort((a, b) => a - b).forEach((stop) => commands.push({ type: 'L', point: cornerPointAt(stop) }))
  }
  for (let barb = 0; barb < barbCount; barb += 1) {
    const fanPosition = barbCount === 1 ? 0 : (barb / (barbCount - 1)) * 2 - 1
    const baseWidth = Math.min(randomBetween(random, 6, 12), slotWidth * 0.85)
    const slack = slotWidth - baseWidth
    const baseFrom = barb * slotWidth + randomBetween(random, 0.2, 0.8) * slack
    sampleUntil(baseFrom)
    commands.push(
      ...buildBarbCommands({
        baseStart: cornerPointAt(baseFrom),
        baseEnd: cornerPointAt(baseFrom + baseWidth),
        angle: diagonal + fanPosition * CORNER_FAN + randomBetween(random, -8, 8) * DEG,
        // The middle barb is the longest, the outer ones shorter.
        length: randomBetween(random, thornLength[0], thornLength[1]) * (1 - 0.35 * Math.abs(fanPosition)),
        bend: randomSign(random) * randomBetween(random, 1, 3),
      }),
    )
    t = baseFrom + baseWidth + 3
  }
  sampleUntil(span * 2)
  return { span, commands }
}

// Stratified placement: one thorn per slot, anywhere in the middle 70% of it, so the
// thorns never fall into an even rhythm but never clump either.
const pickStratifiedPositions = (random, count, from, to) => {
  const slot = (to - from) / count
  return Array.from({ length: count }, (_, index) => from + slot * (index + randomBetween(random, 0.15, 0.85)))
}

export const buildEdgeThorns = ({ edge, random, displace, count, thornLength }) => {
  if (count <= 0 || edge.length < CORNER_SPAN * 2 + 40) return []
  return pickStratifiedPositions(random, count, CORNER_SPAN + 14, edge.length - CORNER_SPAN - 14).map((u) => {
    const baseWidth = randomBetween(random, 5, 9)
    const start = u - baseWidth / 2
    const end = u + baseWidth / 2
    return {
      start,
      end,
      commands: buildBarbCommands({
        baseStart: getRoughEdgePoint(edge, start, displace),
        baseEnd: getRoughEdgePoint(edge, end, displace),
        angle: getNormalAngle(edge) + randomBetween(random, -25, 25) * DEG,
        length: randomBetween(random, thornLength[0], thornLength[1]) * randomBetween(random, 0.3, 0.55),
        bend: randomSign(random) * randomBetween(random, 0.5, 1.5),
      }),
    }
  })
}

// A notch: in from the edge, 2-4 points deep, back out. Returns the polyline too, so
// details.js can shade the dent.
export const buildNotch = ({ edge, random, displace, u, width, depth }) => {
  const innerCount = randomIntBetween(random, 2, 4)
  const points = [getRoughEdgePoint(edge, u, displace)]
  for (let step = 1; step <= innerCount; step += 1) {
    const along = step / (innerCount + 1)
    const sink = depth * Math.sin(Math.PI * along) * randomBetween(random, 0.6, 1.15)
    points.push(getRoughEdgePoint(edge, u + width * along, displace, -sink))
  }
  points.push(getRoughEdgePoint(edge, u + width, displace))
  return { start: u, end: u + width, points, commands: points.map((point) => ({ type: 'L', point })) }
}

const overlapsAny = (features, start, end) => features.some((feature) => start < feature.end + 4 && end > feature.start - 4)

// Chips go where nothing else is: away from the corners and the thorns already placed.
export const buildEdgeChips = ({ edge, random, displace, density, taken }) => {
  const wanted = Math.round((edge.length / 100) * density * randomBetween(random, 1.1, 1.9))
  const chips = []
  for (let attempt = 0; attempt < wanted * 4 && chips.length < wanted; attempt += 1) {
    const width = randomBetween(random, 4, 14)
    const u = randomBetween(random, CORNER_SPAN + 6, edge.length - CORNER_SPAN - 6 - width)
    if (overlapsAny([...taken, ...chips], u, u + width)) continue
    chips.push(buildNotch({ edge, random, displace, u, width, depth: randomBetween(random, 2, 5) }))
  }
  return chips
}
