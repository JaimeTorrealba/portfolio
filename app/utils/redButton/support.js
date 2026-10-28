// Feature checks for the button.

export const supportsSvgFilters = () =>
  typeof SVGFEDiffuseLightingElement !== 'undefined' && typeof SVGFESpecularLightingElement !== 'undefined'

const isSafari = () => /^((?!chrome|chromium|android|crios|fxios|edg).)*safari/i.test(navigator.userAgent)

// bake: true always rasterises; 'auto' only in Safari, where the lighting filters are slow.
export const shouldBake = (bake) => (bake === 'auto' ? isSafari() : Boolean(bake))
