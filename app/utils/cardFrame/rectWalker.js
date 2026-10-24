// Walks a rectangle clockwise and turns it into a rough outline: one sample every few
// pixels, each pushed along the edge's outward normal by a displacement function.
// Corners and edge features (thorns, chips) are spliced in by the caller.
//
// Coordinates are card pixels (y down). Clockwise in y-down space keeps the shape's
// inside on the right of the walking direction, so the outward normal is (dir.y, -dir.x).

export const buildEdges = ({ x, y, width, height }) => {
  const corners = [
    [x, y],
    [x + width, y],
    [x + width, y + height],
    [x, y + height],
  ]
  let perimeterOffset = 0
  return corners.map((start, index) => {
    const end = corners[(index + 1) % 4]
    const length = Math.hypot(end[0] - start[0], end[1] - start[1])
    const dir = [(end[0] - start[0]) / length, (end[1] - start[1]) / length]
    const edge = { index, start, dir, normal: [dir[1], -dir[0]], length, perimeterOffset }
    perimeterOffset += length
    return edge
  })
}

export const getPerimeter = (edges) => edges.reduce((sum, edge) => sum + edge.length, 0)

// Point at distance u along the edge, pushed `offset` px outwards.
export const getEdgePoint = (edge, u, offset = 0) => [
  edge.start[0] + edge.dir[0] * u + edge.normal[0] * offset,
  edge.start[1] + edge.dir[1] * u + edge.normal[1] * offset,
]

// Same point, displaced by the outline's own displacement function.
export const getRoughEdgePoint = (edge, u, displace, extraOffset = 0) =>
  getEdgePoint(edge, u, displace(edge.perimeterOffset + u) + extraOffset)

const lineTo = (point) => ({ type: 'L', point })

const traceEdge = (edge, { from, to, features, displace, nextStep }) => {
  const commands = []
  let u = from
  const sampleUntil = (limit) => {
    while (u < limit) {
      commands.push(lineTo(getRoughEdgePoint(edge, u, displace)))
      u += nextStep()
    }
  }
  for (const feature of features) {
    sampleUntil(feature.start)
    commands.push(...feature.commands)
    u = feature.end + nextStep() * 0.5
  }
  sampleUntil(to)
  return commands
}

// corners(edge) -> { span, commands } | null. A corner replaces the last `span` px of
// the edge before it and the first `span` px of this edge.
// features(edge) -> sorted [{ start, end, commands }] in edge distance.
export const traceOutline = ({ edges, displace, nextStep, corners = () => null, features = () => [] }) => {
  const cornerList = edges.map((edge) => corners(edge))
  const commands = edges.flatMap((edge, index) => {
    const startCorner = cornerList[index]
    const endCorner = cornerList[(index + 1) % 4]
    // Tagged with their edge (a corner belongs to the edge it starts), so a stroke can
    // follow just part of the outline.
    return [
      ...(startCorner ? startCorner.commands : []),
      ...traceEdge(edge, {
        from: startCorner ? startCorner.span : 0,
        to: edge.length - (endCorner ? endCorner.span : 0),
        features: features(edge),
        displace,
        nextStep,
      }),
    ].map((command) => ({ ...command, edgeIndex: index }))
  })
  return commands
}

// Points of the outline that lie on the given edges (0 top, 1 right, 2 bottom, 3 left).
export const getEdgePoints = (commands, edgeIndexes) =>
  commands.filter((command) => edgeIndexes.includes(command.edgeIndex)).map((command) => command.point)

const formatNumber = (value) => Math.round(value * 100) / 100

const formatPoint = ([x, y], dx, dy) => `${formatNumber(x + dx)} ${formatNumber(y + dy)}`

// Closed SVG subpath. dx/dy shift it, for the CSS clip-path whose box starts at -overflow.
export const serializeCommands = (commands, dx = 0, dy = 0) =>
  commands
    .map((command, index) => {
      if (command.type === 'Q') {
        return `Q${formatPoint(command.control, dx, dy)} ${formatPoint(command.point, dx, dy)}`
      }
      return `${index === 0 ? 'M' : 'L'}${formatPoint(command.point, dx, dy)}`
    })
    .join('') + 'Z'

export const serializePolyline = (points) =>
  points.map((point, index) => `${index === 0 ? 'M' : 'L'}${formatPoint(point, 0, 0)}`).join('')
