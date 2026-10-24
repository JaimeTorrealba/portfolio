// 1. Geometry of the red button: a slightly rough rounded plate (outer), the lacquered
// face 3px inside it, and the bright inner outline 3px inside the face. Chips are bitten
// out of the plate's outer edge. Pure functions of (seed, size, options).
import { buildEdges, getPerimeter, traceOutline } from './rectWalker.js'
import { createNoise1D, createStream, randomBetween, randomIntBetween } from './random.js'
import { buildNotch } from './thorns.js'

export const BUTTON_PLATE_BORDER = 3
const GLOW_INSET = 3
const CORNER_RADIUS = 2

const createButtonDisplace = (seed, name, wobble, jitterAmount) => {
  const noise = createNoise1D(createStream(seed, name))
  const jitter = createStream(seed, `${name}-jitter`)
  return (s) => wobble * noise(s * 0.08) + (jitter() * 2 - 1) * jitterAmount
}

// Quarter arc replacing the sharp corner at edge.start, from the previous edge's normal
// round to this edge's. Its centre sits `radius` in from both edges.
const buildRoundedCorner = ({ edge, previousEdge, radius, displace }) => {
  if (radius <= 0) return null
  const [cornerX, cornerY] = edge.start
  const center = [cornerX + (edge.dir[0] - previousEdge.dir[0]) * radius, cornerY + (edge.dir[1] - previousEdge.dir[1]) * radius]
  const fromAngle = Math.atan2(previousEdge.normal[1], previousEdge.normal[0])
  const commands = [0, 0.5, 1].map((step) => {
    const angle = fromAngle + (step * Math.PI) / 2
    const reach = radius + displace(edge.perimeterOffset)
    return { type: 'L', point: [center[0] + Math.cos(angle) * reach, center[1] + Math.sin(angle) * reach] }
  })
  return { span: radius, commands }
}

const traceRoundedRect = ({ rect, radius, displace, random, features = () => [] }) => {
  const edges = buildEdges(rect)
  const commands = traceOutline({
    edges,
    displace,
    nextStep: () => randomBetween(random, 4, 6),
    corners: (edge) => buildRoundedCorner({ edge, previousEdge: edges[(edge.index + 3) % 4], radius, displace }),
    features,
  })
  return { edges, commands }
}

const insetRect = ({ width, height }, inset) => ({ x: inset, y: inset, width: width - inset * 2, height: height - inset * 2 })

// chipCount notches, 2-3px deep and 3-6px wide, on random edges, clear of the corners
// and of each other.
const placeButtonChips = ({ edges, random, displace, chipCount }) => {
  const chipsByEdge = edges.map(() => [])
  for (let attempt = 0; attempt < chipCount * 4 && chipsByEdge.flat().length < chipCount; attempt += 1) {
    const edge = edges[randomIntBetween(random, 0, 3)]
    const width = randomBetween(random, 3, 6)
    const u = randomBetween(random, CORNER_RADIUS + 3, edge.length - CORNER_RADIUS - 3 - width)
    const isTaken = chipsByEdge[edge.index].some((chip) => u < chip.end + 3 && u + width > chip.start - 3)
    if (isTaken || u < 0) continue
    chipsByEdge[edge.index].push(buildNotch({ edge, random, displace, u, width, depth: randomBetween(random, 2, 3) }))
  }
  return chipsByEdge.map((chips) => chips.sort((a, b) => a.start - b.start))
}

export const buildButtonGeometry = ({ seed, width, height, options }) => {
  const outerRect = { x: 0, y: 0, width, height }
  const outerDisplace = createButtonDisplace(seed, 'btn-outer', options.wobble, 0.25)
  const chipsByEdge = placeButtonChips({
    edges: buildEdges(outerRect),
    random: createStream(seed, 'btn-chips'),
    displace: outerDisplace,
    chipCount: options.chipCount,
  })
  const outer = traceRoundedRect({
    rect: outerRect,
    radius: CORNER_RADIUS,
    displace: outerDisplace,
    random: createStream(seed, 'btn-outer-step'),
    features: (edge) => chipsByEdge[edge.index],
  })
  const innerWobble = options.wobble * 0.5
  const face = traceRoundedRect({
    rect: insetRect(outerRect, BUTTON_PLATE_BORDER),
    radius: CORNER_RADIUS / 2,
    displace: createButtonDisplace(seed, 'btn-face', innerWobble, 0.1),
    random: createStream(seed, 'btn-face-step'),
  })
  const glow = traceRoundedRect({
    rect: insetRect(outerRect, BUTTON_PLATE_BORDER + GLOW_INSET),
    radius: 0,
    displace: createButtonDisplace(seed, 'btn-glow', innerWobble, 0),
    random: createStream(seed, 'btn-glow-step'),
  })
  return {
    width,
    height,
    outerCommands: outer.commands,
    faceCommands: face.commands,
    glowCommands: glow.commands,
    chips: chipsByEdge.flat().map((chip) => chip.points),
    perimeter: getPerimeter(outer.edges),
  }
}
