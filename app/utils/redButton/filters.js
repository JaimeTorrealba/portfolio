// SVG filter helpers for the button art: the bevelled metal rim and the noise building
// blocks. Every id is prefixed per instance so several buttons on one page never pick up
// each other's defs.
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

export const createDefsIds = (prefix, names) => Object.fromEntries(names.map((name) => [name, `${prefix}-${name}`]))
