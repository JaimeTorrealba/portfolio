// Notches cut into the button rim's outer edge. Returns path commands that
// rectWalker.js splices into the outline.
import { getRoughEdgePoint } from './rectWalker.js'
import { randomBetween, randomIntBetween } from './random.js'

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
