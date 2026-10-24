// All the vector geometry of one card: the spiky outer outline, the uneven inner edge,
// the chips and the optional footer plate. Pure functions of (seed, size, options).
import { buildEdges, getEdgePoints, getPerimeter, traceOutline } from './rectWalker.js'
import { createNoise1D, createStream, randomBetween, randomIntBetween } from './random.js'
import { buildCornerCluster, buildEdgeChips, buildEdgeThorns, buildNotch } from './thorns.js'

const createStepper = (random) => () => randomBetween(random, 6, 10)

// Low-frequency wobble (two octaves) plus a tiny per-sample jitter, in px along the normal.
const createRoughDisplace = (seed, name, wobble, jitterAmount) => {
  const broad = createNoise1D(createStream(seed, `${name}-broad`))
  const fine = createNoise1D(createStream(seed, `${name}-fine`))
  const jitter = createStream(seed, `${name}-jitter`)
  return (s) => wobble * (broad(s * 0.025) * 0.75 + fine(s * 0.09) * 0.25) + (jitter() * 2 - 1) * jitterAmount
}

// The inner edge wobbles less, and drifts in and out by up to 25% of the thickness so
// the border is never the same width twice.
const createInnerDisplace = (seed, wobble, thickness) => {
  const wobbleNoise = createNoise1D(createStream(seed, 'inner-wobble'))
  const widthNoise = createNoise1D(createStream(seed, 'inner-width'))
  return (s) => wobble * 0.4 * wobbleNoise(s * 0.03) - thickness * 0.25 * widthNoise(s * 0.012)
}

const sortByStart = (features) => [...features].sort((a, b) => a.start - b.start)

// Corners carry 2-3 barbs when thornCount.corner is 3: each corner may drop one.
const getCornerBarbCount = (random, wanted) => (wanted <= 0 ? 0 : Math.max(1, wanted - (random() < 0.35 ? 1 : 0)))

const buildOuterOutline = ({ seed, width, height, options }) => {
  const edges = buildEdges({ x: 0, y: 0, width, height })
  const displace = createRoughDisplace(seed, 'outer', options.wobble, 0.4)
  const thornRandom = createStream(seed, 'thorns')
  const chipRandom = createStream(seed, 'chips')
  const { corner, top, sides } = options.thornCount
  const edgeThornCounts = [top, sides, 0, sides]

  const corners = edges.map((edge) => {
    const barbCount = getCornerBarbCount(thornRandom, corner)
    if (!barbCount) return null
    const previousEdge = edges[(edge.index + 3) % 4]
    return buildCornerCluster({ edge, previousEdge, random: thornRandom, displace, barbCount, thornLength: options.thornLength })
  })
  const edgeFeatures = edges.map((edge) => {
    const thornArgs = { edge, random: thornRandom, displace, thornLength: options.thornLength }
    const thorns = buildEdgeThorns({ ...thornArgs, count: edgeThornCounts[edge.index] })
    const chips = buildEdgeChips({ edge, random: chipRandom, displace, density: options.chipDensity, taken: thorns })
    return { features: sortByStart([...thorns, ...chips]), chips }
  })

  return {
    commands: traceOutline({
      edges,
      displace,
      nextStep: createStepper(createStream(seed, 'outer-step')),
      corners: (edge) => corners[edge.index],
      features: (edge) => edgeFeatures[edge.index].features,
    }),
    chips: edgeFeatures.flatMap((entry) => entry.chips.map((chip) => chip.points)),
    perimeter: getPerimeter(edges),
  }
}

const buildInnerOutline = ({ seed, width, height, options }) => {
  const { thickness } = options
  const edges = buildEdges({ x: thickness, y: thickness, width: width - thickness * 2, height: height - thickness * 2 })
  const commands = traceOutline({
    edges,
    displace: createInnerDisplace(seed, options.wobble, thickness),
    nextStep: createStepper(createStream(seed, 'inner-step')),
  })
  // Right and bottom: the lower lip of the recess, the side that catches the light.
  return { commands, lipPoints: getEdgePoints(commands, [1, 2]) }
}

// Footer: its own plate inside the bottom of the frame, rougher than the card, with a
// couple of chips bitten out of its top edge.
const buildFooterPlate = ({ seed, width, height, options }) => {
  const { thickness, footer, wobble } = options
  const rect = { x: thickness, y: height - thickness - footer.height, width: width - thickness * 2, height: footer.height }
  const random = createStream(seed, 'footer')
  const outerDisplace = createRoughDisplace(seed, 'footer-outer', wobble * 1.5, 0.5)
  const outerEdges = buildEdges(rect)
  const topEdge = outerEdges[0]
  const chipCount = randomIntBetween(random, 2, 3)
  const chips = Array.from({ length: chipCount }, (_, index) => {
    const slot = topEdge.length / chipCount
    const chipWidth = randomBetween(random, 4, 10)
    const u = slot * index + randomBetween(random, 0.2, 0.8) * (slot - chipWidth)
    return buildNotch({ edge: topEdge, random, displace: outerDisplace, u, width: chipWidth, depth: randomBetween(random, 1.5, 3) })
  })
  const outerCommands = traceOutline({
    edges: outerEdges,
    displace: outerDisplace,
    nextStep: createStepper(random),
    features: (edge) => (edge.index === 0 ? chips : []),
  })
  const inset = Math.max(3, thickness * 0.35)
  const innerEdges = buildEdges({ x: rect.x + inset, y: rect.y + inset, width: rect.width - inset * 2, height: rect.height - inset * 2 })
  const innerCommands = traceOutline({
    edges: innerEdges,
    displace: createRoughDisplace(seed, 'footer-inner', wobble * 0.6, 0.3),
    nextStep: createStepper(random),
  })
  // The divider rides the plate's top edge, chips included.
  const divider = getEdgePoints(outerCommands, [0])
  return { rect, outerCommands, innerCommands, chips: chips.map((chip) => chip.points), divider }
}

export const buildCardGeometry = ({ seed, width, height, options }) => ({
  width,
  height,
  outer: buildOuterOutline({ seed, width, height, options }),
  inner: buildInnerOutline({ seed, width, height, options }),
  footer: options.footer ? buildFooterPlate({ seed, width, height, options }) : null,
})
