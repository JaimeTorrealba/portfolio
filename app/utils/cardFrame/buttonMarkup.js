// 2. SVG layers of the red button. Split in two on purpose:
//  - the art (plate, face, grain, mottle, vignette, scratches, chips): every filter, so
//    it can be baked to a bitmap;
//  - the overlays (bevel lines, worn inner glow line): plain strokes driven by CSS
//    variables and animations, so pressed and ember states work on a baked button too.
import { serializeCommands, serializePolyline } from './rectWalker.js'
import { addCentred, bevelFilter, createDefsIds, distantLight, greyNoise, region } from './filters.js'
import { buildChipsMarkup, buildScratchStrokes, splitLitEdges } from './details.js'
import { createStream } from './random.js'
import { BUTTON_PLATE_BORDER } from './buttonGeometry.js'

// Room around the button for the outline's wobble.
export const BUTTON_OVERFLOW = 2

const ART_DEF_NAMES = ['plateBevel', 'face', 'metal', 'faceGradient', 'vignette', 'plateClip', 'faceClip']

const getBounds = ({ width, height }) => ({
  x: -BUTTON_OVERFLOW,
  y: -BUTTON_OVERFLOW,
  width: width + BUTTON_OVERFLOW * 2,
  height: height + BUTTON_OVERFLOW * 2,
})

const openSvg = (className, bounds) =>
  `<svg xmlns="http://www.w3.org/2000/svg" class="${className}" aria-hidden="true" focusable="false" width="${bounds.width}" height="${bounds.height}" viewBox="${bounds.x} ${bounds.y} ${bounds.width} ${bounds.height}">`

// Lacquered leather: diffuse-lit fine noise multiplied in at `grain` (0.5 = half
// strength), a little grey grain, and slow mottling multiplied at 0.2.
const faceFilter = ({ id, seed, grain, lightAngle, bounds }) => {
  const amount = Math.min(1, grain)
  return `<filter id="${id}" ${region(bounds)} color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="${seed}" result="grainNoise"/>
    <feDiffuseLighting in="grainNoise" surfaceScale="1" diffuseConstant="1" lighting-color="#fff" result="bump">${distantLight(lightAngle, 55)}</feDiffuseLighting>
    <feComposite in="SourceGraphic" in2="bump" operator="arithmetic" k1="${(1.22 * amount).toFixed(3)}" k2="${(1 - amount).toFixed(3)}" k3="0" k4="0" result="bumped"/>
    ${greyNoise('grainNoise', 'grainGrey')}
    ${addCentred('bumped', 'grainGrey', 0.12 * grain, 'grained')}
    <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" seed="${seed + 7}" result="mottleNoise"/>
    ${greyNoise('mottleNoise', 'mottleGrey')}
    <feComposite in="grained" in2="mottleGrey" operator="arithmetic" k1="0.4" k2="0.8" k3="0" k4="0" result="mottled"/>
    <feComposite in="mottled" in2="SourceGraphic" operator="in"/>
  </filter>`
}

const buildArtDefs = ({ ids, seed, options, paths, bounds, faceBounds }) => {
  const { palette, grain, lightAngle } = options
  const turbulenceSeed = seed % 10000
  return `<defs>
  ${bevelFilter({ id: ids.plateBevel, seed: turbulenceSeed, grain, lightAngle, bounds, blur: 0.8, surfaceScale: 2 })}
  ${faceFilter({ id: ids.face, seed: turbulenceSeed + 1, grain, lightAngle, bounds: faceBounds })}
  <linearGradient id="${ids.metal}" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${palette.metalLight}"/><stop offset="1" stop-color="${palette.metalDark}"/>
  </linearGradient>
  <linearGradient id="${ids.faceGradient}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${palette.faceTop}"/><stop offset="1" stop-color="${palette.faceBottom}"/>
  </linearGradient>
  <radialGradient id="${ids.vignette}" cx="0.5" cy="0.5" r="0.75">
    <stop offset="0.45" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.45"/>
  </radialGradient>
  <clipPath id="${ids.plateClip}"><path d="${paths.plate}" clip-rule="evenodd"/></clipPath>
  <clipPath id="${ids.faceClip}"><path d="${paths.face}"/></clipPath>
</defs>`
}

// Hairline scratches along the 3px plate, every one a groove with its lit lip 0.6px off.
const buildPlateDetails = ({ seed, geometry, options }) => {
  const half = BUTTON_PLATE_BORDER / 2
  const scratches = buildScratchStrokes({
    random: createStream(seed, 'btn-scratches'),
    band: { x: half, y: half, width: geometry.width - BUTTON_PLATE_BORDER, height: geometry.height - BUTTON_PLATE_BORDER },
    thickness: BUTTON_PLATE_BORDER,
    count: options.scratchCount,
    lengthRange: [4, 14],
    widthRange: [0.4, 0.7],
    lipDistance: 0.6,
    lightAngle: options.lightAngle,
    alternate: false,
  })
  return scratches + buildChipsMarkup(geometry.chips, options.lightAngle, { shadeWidth: 1.6, highlightWidth: 1 })
}

export const buildButtonArtSvg = ({ idPrefix, seed, geometry, options }) => {
  const ids = createDefsIds(`${idPrefix}-art`, ART_DEF_NAMES)
  const outer = serializeCommands(geometry.outerCommands)
  const face = serializeCommands(geometry.faceCommands)
  const paths = { plate: outer + face, face }
  const { width, height } = geometry
  const bounds = getBounds(geometry)
  const faceBounds = { x: 0, y: 0, width, height }
  return `${openSvg('cf-btn__art', bounds)}
  ${buildArtDefs({ ids, seed, options, paths, bounds, faceBounds })}
  <path d="${paths.plate}" fill-rule="evenodd" fill="url(#${ids.metal})" filter="url(#${ids.plateBevel})"/>
  <g clip-path="url(#${ids.faceClip})">
    <rect width="${width}" height="${height}" fill="url(#${ids.faceGradient})" filter="url(#${ids.face})"/>
    <rect width="${width}" height="${height}" fill="url(#${ids.vignette})"/>
  </g>
  <g clip-path="url(#${ids.plateClip})">${buildPlateDetails({ seed, geometry, options })}</g>
</svg>`
}

// Bevel lines: 2px strokes clipped to the face, so 1px shows just inside its edge. Their
// opacities are --hl / --sh (see the CSS), which the pressed state swaps.
const buildBevelSvg = ({ ids, geometry, options, bounds }) => {
  const face = serializeCommands(geometry.faceCommands)
  const { lit, shaded } = splitLitEdges(geometry.faceCommands, options.lightAngle)
  return `${openSvg('cf-btn__bevel', bounds)}
  <defs><clipPath id="${ids.bevelClip}"><path d="${face}"/></clipPath></defs>
  <g clip-path="url(#${ids.bevelClip})" fill="none" stroke-width="2" stroke-linejoin="round">
    <path class="cf-btn__highlight" d="${serializePolyline(lit)}" stroke="${options.palette.highlight}"/>
    <path class="cf-btn__shadow" d="${serializePolyline(shaded)}" stroke="#000"/>
  </g>
</svg>`
}

// Worn inner outline: low-frequency noise, thresholded, masks the line so it fades out
// in places. Its own <svg> so the ember pulse animates only this element's opacity.
const buildEmberSvg = ({ ids, seed, geometry, options, bounds }) => `${openSvg('cf-btn__ember', bounds)}
  <defs>
    <filter id="${ids.glowBreak}" ${region(bounds)} color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.05 0.1" numOctaves="2" seed="${(seed % 10000) + 13}" result="breaks"/>
      <feColorMatrix in="breaks" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  1 0 0 0 0" result="breakAlpha"/>
      <feComponentTransfer in="breakAlpha" result="kept"><feFuncA type="table" tableValues="0 0 0.7 1 1"/></feComponentTransfer>
      <feComposite in="kept" in2="SourceAlpha" operator="in"/>
    </filter>
    <mask id="${ids.glowMask}" maskUnits="userSpaceOnUse" x="${bounds.x}" y="${bounds.y}" width="${bounds.width}" height="${bounds.height}">
      <rect x="${bounds.x}" y="${bounds.y}" width="${bounds.width}" height="${bounds.height}" fill="#fff" filter="url(#${ids.glowBreak})"/>
    </mask>
  </defs>
  <path d="${serializeCommands(geometry.glowCommands)}" fill="none" stroke="${options.palette.outline}" stroke-width="1" stroke-opacity="0.8" mask="url(#${ids.glowMask})"/>
</svg>`

export const buildButtonOverlayMarkup = ({ idPrefix, seed, geometry, options }) => {
  const ids = createDefsIds(`${idPrefix}-overlay`, ['bevelClip', 'glowBreak', 'glowMask'])
  const context = { ids, seed, geometry, options, bounds: getBounds(geometry) }
  return buildBevelSvg(context) + buildEmberSvg(context)
}
