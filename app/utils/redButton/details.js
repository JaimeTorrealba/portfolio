// Vector wear on the button rim: scratches and the shading of each chip. Everything
// here is drawn clipped to the rim shape.
import { buildEdges, getEdgePoint, getEdgePoints, serializePolyline } from './rectWalker.js'
import { randomBetween, randomIntBetween } from './random.js'

const DEG = Math.PI / 180
const SCRATCH_LIGHT = '#9a9ea8'

export const getLightVector = (lightAngle) => [Math.cos(lightAngle * DEG), Math.sin(lightAngle * DEG)]

// A point on the band's centre line at perimeter distance s, with that edge's direction.
const getBandPlacement = (edges, s) => {
  let rest = s
  const edge = edges.find((candidate) => {
    if (rest < candidate.length) return true
    rest -= candidate.length
    return false
  }) ?? edges[3]
  return { edge, u: Math.min(rest, edge.length) }
}

// 2-4 point polyline, mostly along the rim (+-25deg), drifting a little per segment.
const buildScratchPoints = (random, origin, baseAngle, lengthRange) => {
  const pointCount = randomIntBetween(random, 2, 4)
  const segmentLength = randomBetween(random, lengthRange[0], lengthRange[1]) / (pointCount - 1)
  let angle = baseAngle + randomBetween(random, -25, 25) * DEG
  const points = [origin]
  for (let index = 1; index < pointCount; index += 1) {
    const [x, y] = points[index - 1]
    points.push([x + Math.cos(angle) * segmentLength, y + Math.sin(angle) * segmentLength])
    angle += randomBetween(random, -8, 8) * DEG
  }
  return points
}

const offsetPoints = (points, [dx, dy]) => points.map(([x, y]) => [x + dx, y + dy])

// Scratches along a band (the rectangle of its centre line, `thickness` wide). A groove
// is a dark line plus a light lip shifted `lipDistance` px toward the light; with
// alternate, every other scratch is a light scuff on its own instead.
export const buildScratchStrokes = ({ random, band, thickness, count, lengthRange, widthRange, lipDistance, lightAngle, alternate }) => {
  const edges = buildEdges(band)
  const bandLength = edges.reduce((sum, edge) => sum + edge.length, 0)
  const light = getLightVector(lightAngle)
  const lipOffset = [light[0] * lipDistance, light[1] * lipDistance]
  const strokes = []
  for (let index = 0; index < count; index += 1) {
    const { edge, u } = getBandPlacement(edges, random() * bandLength)
    const origin = getEdgePoint(edge, u, randomBetween(random, -0.35, 0.35) * thickness)
    const points = buildScratchPoints(random, origin, Math.atan2(edge.dir[1], edge.dir[0]), lengthRange)
    const strokeWidth = randomBetween(random, widthRange[0], widthRange[1]).toFixed(2)
    const isGroove = !alternate || index % 2 === 0
    if (isGroove) {
      strokes.push(`<path d="${serializePolyline(points)}" stroke="#000" stroke-opacity="0.5" stroke-width="${strokeWidth}"/>`)
    }
    const lipPoints = isGroove ? offsetPoints(points, lipOffset) : points
    strokes.push(`<path d="${serializePolyline(lipPoints)}" stroke="${SCRATCH_LIGHT}" stroke-opacity="0.35" stroke-width="${strokeWidth}"/>`)
  }
  return `<g fill="none" stroke-linecap="round">${strokes.join('')}</g>`
}

// Splits a rectangular outline into the run of edges facing the light and the run facing
// away, each as one continuous polyline in walking order (for bevel lines).
export const splitLitEdges = (commands, lightAngle) => {
  const light = getLightVector(lightAngle)
  const normals = [[0, -1], [1, 0], [0, 1], [-1, 0]]
  const isLit = normals.map(([x, y]) => x * light[0] + y * light[1] > 0.01)
  const collectRun = (wantLit) => {
    // Start right after an edge of the other kind, so the run never wraps mid-way.
    const first = [0, 1, 2, 3].find((index) => isLit[index] === wantLit && isLit[(index + 3) % 4] !== wantLit) ?? 0
    const run = [0, 1, 2, 3].map((step) => (first + step) % 4).filter((index) => isLit[index] === wantLit)
    // Plus the first point of the next edge, so the line reaches the corner.
    const closingPoint = getEdgePoints(commands, [(run[run.length - 1] + 1) % 4])[0]
    return [...run.flatMap((index) => getEdgePoints(commands, [index])), closingPoint]
  }
  return { lit: collectRun(true), shaded: collectRun(false) }
}

// Segment walls of a notch that face the light (outward normal . light > 0.2): the lit
// side of the dent. Clockwise in y-down, a segment's outward normal is (dy, -dx).
const getLitSegments = (points, light) =>
  points.slice(1).flatMap((point, index) => {
    const previous = points[index]
    const dx = point[0] - previous[0]
    const dy = point[1] - previous[1]
    const length = Math.hypot(dx, dy) || 1
    const facing = (dy / length) * light[0] + (-dx / length) * light[1]
    return facing > 0.2 ? [[previous, point]] : []
  })

// Each chip reads as a dent: a dark rim hugging the cut, and a 1px highlight on the walls
// that face the light. Half of each stroke falls outside the rim and is clipped away.
export const buildChipsMarkup = (chips, lightAngle, { shadeWidth = 3, highlightWidth = 1.2 } = {}) => {
  const light = getLightVector(lightAngle)
  return chips
    .map((points) => {
      const shade = `<path d="${serializePolyline(points)}" fill="none" stroke="#000" stroke-opacity="0.5" stroke-width="${shadeWidth}" stroke-linejoin="round"/>`
      const highlights = getLitSegments(points, light)
        .map((segment) => `<path d="${serializePolyline(segment)}" stroke="${SCRATCH_LIGHT}" stroke-opacity="0.55" stroke-width="${highlightWidth}"/>`)
        .join('')
      return shade + highlights
    })
    .join('')
}
