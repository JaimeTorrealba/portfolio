// Assembles the card's SVG markup from its geometry. 1 viewBox unit = 1 CSS px, with
// (0, 0) at the card's top-left corner and `overflow` px of room around it for thorns.
import { serializeCommands, serializePolyline } from './rectWalker.js'
import { buildDefs, createDefsIds } from './filters.js'
import { buildChipsMarkup, buildGrimeMarkup, buildScratchesMarkup } from './details.js'

// Recessed panel: leather fill, vignette, the rim's shadow, a dark inner edge and the
// lit lower lip on the bottom/right.
const buildSurface = ({ ids, geometry, paths, options }) => {
  const { width, height } = geometry
  return `<g class="surface" clip-path="url(#${ids.panelClip})">
    <rect width="${width}" height="${height}" fill="url(#${ids.panel})" filter="url(#${ids.surface})"/>
    <rect width="${width}" height="${height}" fill="url(#${ids.vignette})"/>
    <path d="${paths.inner}" filter="url(#${ids.inset})"/>
    <path d="${paths.inner}" fill="none" stroke="#000" stroke-opacity="0.7" stroke-width="4"/>
    <path d="${serializePolyline(geometry.inner.lipPoints)}" fill="none" stroke="${options.palette.rim}" stroke-opacity="0.3" stroke-width="2"/>
  </g>`
}

const buildFrame = ({ ids, geometry, paths, options }) => `<g class="frame">
    <path d="${paths.outer}" transform="translate(3 5)" opacity="0.6" filter="url(#${ids.shadow})"/>
    <path d="${paths.frame}" fill-rule="evenodd" fill="url(#${ids.metal})" filter="url(#${ids.bevel})"/>
    <path d="${paths.frame}" fill-rule="evenodd" fill="${options.palette.rim}" fill-opacity="0.22" mask="url(#${ids.wearMask})"/>
    <g clip-path="url(#${ids.frameClip})">${buildGrimeMarkup({ width: geometry.width, height: geometry.height, options, gradientId: ids.grime })}</g>
  </g>`

const buildDetails = ({ ids, seed, geometry, options }) => `<g class="details" clip-path="url(#${ids.frameClip})">
    ${buildScratchesMarkup({ seed, width: geometry.width, height: geometry.height, options, perimeter: geometry.outer.perimeter })}
    ${buildChipsMarkup(geometry.outer.chips, options.lightAngle)}
  </g>`

// Footer: a separate plate with its own bevelled border, a rougher, darker face and a
// bevelled divider (dark line, 1px light line under it) along its top.
const buildFooter = ({ ids, footer, options }) => {
  const outer = serializeCommands(footer.outerCommands)
  const inner = serializeCommands(footer.innerCommands)
  const divider = serializePolyline(footer.divider)
  return `<g class="footer">
    <path d="${inner}" fill="${options.palette.shadow}" filter="url(#${ids.footerSurface})"/>
    <path d="${outer}${inner}" fill-rule="evenodd" fill="url(#${ids.metal})" filter="url(#${ids.bevel})"/>
    <path d="${divider}" fill="none" stroke="#000" stroke-opacity="0.8" stroke-width="1.5" transform="translate(0 -1)"/>
    <path d="${divider}" fill="none" stroke="${options.palette.rim}" stroke-opacity="0.45" stroke-width="1" transform="translate(0 0.75)"/>
    <clipPath id="${ids.footerClip}"><path d="${outer}${inner}" clip-rule="evenodd"/></clipPath>
    <g clip-path="url(#${ids.footerClip})">${buildChipsMarkup(footer.chips, options.lightAngle)}</g>
  </g>`
}

// The frame and the panel as "d" strings, in card coordinates.
export const buildPaths = (geometry) => {
  const outer = serializeCommands(geometry.outer.commands)
  const inner = serializeCommands(geometry.inner.commands)
  return { outer, inner, frame: outer + inner }
}

export const buildCardSvg = ({ idPrefix, seed, geometry, options, overflow }) => {
  const ids = createDefsIds(idPrefix)
  const paths = buildPaths(geometry)
  const { width, height } = geometry
  const bounds = { x: -overflow, y: -overflow, width: width + overflow * 2, height: height + overflow * 2 }
  const panelBounds = { x: 0, y: 0, width, height }
  const context = { ids, seed, geometry, paths, options }
  return `<svg xmlns="http://www.w3.org/2000/svg" class="card-frame__art" aria-hidden="true" focusable="false"
  width="${bounds.width}" height="${bounds.height}" viewBox="${bounds.x} ${bounds.y} ${bounds.width} ${bounds.height}">
  ${buildDefs({ ids, seed, options, paths, bounds, panelBounds, wearStroke: options.thickness * 0.9 })}
  ${buildSurface(context)}
  ${buildFrame(context)}
  ${buildDetails(context)}
  ${geometry.footer ? buildFooter({ ids, footer: geometry.footer, options }) : ''}
</svg>`
}
