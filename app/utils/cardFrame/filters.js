// SVG <defs>: the filters that turn flat fills into leather and bevelled metal, plus the
// gradients, clip paths and the wear mask. Every id is prefixed per instance so several
// cards on one page never pick up each other's defs.
//
// All filters use userSpaceOnUse regions sized to what they draw: the browser never
// processes the default 10%-bigger box, and turbulence frequencies are in CSS px.

export const region = ({ x, y, width, height }) => `filterUnits="userSpaceOnUse" x="${x}" y="${y}" width="${width}" height="${height}"`

// Grey copy of a noise result (R into RGB), opaque, so it can be added or used as a height map.
export const greyNoise = (input, result) =>
  `<feColorMatrix in="${input}" type="matrix" values="1 0 0 0 0  1 0 0 0 0  1 0 0 0 0  0 0 0 0 1" result="${result}"/>`

// base + amount * (noise - 0.5): zero-mean variation, no overall brightening.
export const addCentred = (base, noise, amount, result) =>
  `<feComposite in="${base}" in2="${noise}" operator="arithmetic" k1="0" k2="1" k3="${amount}" k4="${-amount / 2}" result="${result}"/>`

export const distantLight = (angle, elevation) => `<feDistantLight azimuth="${angle}" elevation="${elevation}"/>`

// Leather / stone panel: diffuse-lit fine noise as a bump, fine grain and slow mottling on top.
const surfaceFilter = ({ id, seed, grain, lightAngle, bounds, grainFrequency = 0.9 }) => `
  <filter id="${id}" ${region(bounds)} color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency="${grainFrequency}" numOctaves="3" seed="${seed}" result="grainNoise"/>
    <feDiffuseLighting in="grainNoise" surfaceScale="1.5" diffuseConstant="1" lighting-color="#fff" result="bump">${distantLight(lightAngle, 55)}</feDiffuseLighting>
    <feComposite in="SourceGraphic" in2="bump" operator="arithmetic" k1="1.18" k2="0" k3="0" k4="0" result="bumped"/>
    ${greyNoise('grainNoise', 'grainGrey')}
    ${addCentred('bumped', 'grainGrey', 0.14 * grain, 'grained')}
    <feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves="4" seed="${seed + 7}" result="mottleNoise"/>
    ${greyNoise('mottleNoise', 'mottleGrey')}
    ${addCentred('grained', 'mottleGrey', 0.22, 'mottled')}
    <feComposite in="mottled" in2="SourceGraphic" operator="in"/>
  </filter>`

// Bevel: the blurred alpha is a height map, so the bevel follows every wobble and thorn.
// Diffuse light darkens the faces turned away, specular adds the rim facing the light.
export const bevelFilter = ({ id, seed, grain, lightAngle, bounds, blur = 2, surfaceScale = 4 }) => `
  <filter id="${id}" ${region(bounds)} color-interpolation-filters="sRGB">
    <feGaussianBlur in="SourceAlpha" stdDeviation="${blur}" result="height"/>
    <feDiffuseLighting in="height" surfaceScale="${surfaceScale}" diffuseConstant="1" lighting-color="#fff" result="diffuse">${distantLight(lightAngle, 35)}</feDiffuseLighting>
    <feSpecularLighting in="height" surfaceScale="${surfaceScale}" specularConstant="0.75" specularExponent="22" lighting-color="#dfe3ec" result="specular">${distantLight(lightAngle, 40)}</feSpecularLighting>
    <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="${seed + 3}" result="metalNoise"/>
    ${greyNoise('metalNoise', 'metalGrey')}
    ${addCentred('SourceGraphic', 'metalGrey', 0.1 * grain, 'metal')}
    <feComposite in="metal" in2="diffuse" operator="arithmetic" k1="1.6" k2="0" k3="0" k4="0" result="shaded"/>
    <feComposite in="shaded" in2="specular" operator="arithmetic" k1="0" k2="1" k3="0.85" k4="0" result="lit"/>
    <feComposite in="lit" in2="SourceAlpha" operator="in"/>
  </filter>`

// Recessed panel: black everywhere outside the shape, nudged away from the light, blurred
// and kept inside: the rim's shadow falling onto the panel.
const insetShadowFilter = ({ id, lightAngle, bounds }) => {
  const radians = (lightAngle * Math.PI) / 180
  const dx = (-Math.cos(radians) * 3).toFixed(2)
  const dy = (-Math.sin(radians) * 3).toFixed(2)
  return `
  <filter id="${id}" ${region(bounds)}>
    <feFlood flood-color="#000" flood-opacity="0.6" result="flood"/>
    <feComposite in="flood" in2="SourceAlpha" operator="out" result="outside"/>
    <feOffset in="outside" dx="${dx}" dy="${dy}" result="shifted"/>
    <feGaussianBlur in="shifted" stdDeviation="4" result="soft"/>
    <feComposite in="soft" in2="SourceAlpha" operator="in"/>
  </filter>`
}

// Wear mask: blotchy turbulence, thresholded into patches, kept only where the source
// (a wide stroke of the outer edge) is: the rubbed rim of the frame.
const wearFilter = ({ id, seed, bounds }) => `
  <filter id="${id}" ${region(bounds)} color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency="0.08" numOctaves="2" seed="${seed + 11}" result="blotches"/>
    <feColorMatrix in="blotches" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  1 0 0 0 0" result="blotchAlpha"/>
    <feComponentTransfer in="blotchAlpha" result="patches"><feFuncA type="table" tableValues="0 0 0 0.5 1 1"/></feComponentTransfer>
    <feComposite in="patches" in2="SourceAlpha" operator="in"/>
  </filter>`

const dropShadowFilter = ({ id, bounds }) => `
  <filter id="${id}" ${region(bounds)}>
    <feGaussianBlur in="SourceAlpha" stdDeviation="6"/>
  </filter>`

const gradients = ({ ids, palette }) => `
  <linearGradient id="${ids.metal}" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${palette.light}"/><stop offset="1" stop-color="${palette.shadow}"/>
  </linearGradient>
  <linearGradient id="${ids.panel}" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${palette.baseLight}"/><stop offset="1" stop-color="${palette.base}"/>
  </linearGradient>
  <radialGradient id="${ids.vignette}" cx="0.5" cy="0.5" r="0.72">
    <stop offset="0.5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.55"/>
  </radialGradient>
  <radialGradient id="${ids.grime}">
    <stop offset="0" stop-color="#000" stop-opacity="0.4"/><stop offset="1" stop-color="#000" stop-opacity="0"/>
  </radialGradient>`

const CARD_DEF_NAMES = ['surface', 'footerSurface', 'bevel', 'inset', 'wear', 'wearMask', 'shadow', 'metal', 'panel', 'vignette', 'grime', 'panelClip', 'frameClip', 'footerClip']

export const createDefsIds = (prefix, names = CARD_DEF_NAMES) => Object.fromEntries(names.map((name) => [name, `${prefix}-${name}`]))

// paths: { frame, inner } "d" strings. bounds: the whole viewBox; panelBounds: the card box.
export const buildDefs = ({ ids, seed, options, paths, bounds, panelBounds, wearStroke }) => {
  const { grain, lightAngle, palette } = options
  const turbulenceSeed = seed % 10000
  return `<defs>
  ${surfaceFilter({ id: ids.surface, seed: turbulenceSeed, grain, lightAngle, bounds: panelBounds })}
  ${surfaceFilter({ id: ids.footerSurface, seed: turbulenceSeed + 5, grain: grain * 1.5, lightAngle, bounds: panelBounds, grainFrequency: 1.4 })}
  ${bevelFilter({ id: ids.bevel, seed: turbulenceSeed, grain, lightAngle, bounds })}
  ${insetShadowFilter({ id: ids.inset, lightAngle, bounds: panelBounds })}
  ${wearFilter({ id: ids.wear, seed: turbulenceSeed, bounds })}
  ${dropShadowFilter({ id: ids.shadow, bounds })}
  ${gradients({ ids, palette })}
  <clipPath id="${ids.panelClip}"><path d="${paths.inner}"/></clipPath>
  <clipPath id="${ids.frameClip}"><path d="${paths.frame}" clip-rule="evenodd"/></clipPath>
  <mask id="${ids.wearMask}" maskUnits="userSpaceOnUse" x="${bounds.x}" y="${bounds.y}" width="${bounds.width}" height="${bounds.height}">
    <path d="${paths.outer}" fill="none" stroke="#fff" stroke-width="${wearStroke}" filter="url(#${ids.wear})"/>
  </mask>
</defs>`
}
