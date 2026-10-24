// Bake: run the SVG filters once, offscreen, and keep the result as a bitmap. A baked
// card or button is a plain <img>, so transforms, scroll and the shine overlay never make the
// browser re-run the lighting filters (slow in Safari over large regions).
//
// Results are cached by key; cards (or buttons) with the same seed, size, options and DPR
// share one bitmap. The cache is capped: evicting a URL does not affect an <img> already showing it.

const CACHE_LIMIT = 64
const bakedUrls = new Map()

const loadImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('card-frame: the SVG could not be loaded for baking'))
    image.src = url
  })

const canvasToBlob = (canvas) =>
  new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('card-frame: toBlob returned nothing'))), 'image/png')
  })

const rasterizeSvg = async ({ markup, width, height, dpr }) => {
  const svgUrl = URL.createObjectURL(new Blob([markup], { type: 'image/svg+xml' }))
  try {
    const image = await loadImage(svgUrl)
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(width * dpr)
    canvas.height = Math.round(height * dpr)
    canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height)
    return URL.createObjectURL(await canvasToBlob(canvas))
  } finally {
    URL.revokeObjectURL(svgUrl)
  }
}

const evictOldest = () => {
  const [oldestKey, oldestUrl] = bakedUrls.entries().next().value
  bakedUrls.delete(oldestKey)
  oldestUrl.then((url) => URL.revokeObjectURL(url)).catch(() => {})
}

export const hasBakedSvg = (key) => bakedUrls.has(key)

// Capped at 2: past that the bitmap grows 2x+ for detail nobody can see.
export const getBakeDpr = () => Math.min(window.devicePixelRatio || 1, 2)

// Resolves to an object URL of the baked PNG. Concurrent calls with one key share the work.
export const bakeSvg = ({ key, markup, width, height, dpr }) => {
  if (bakedUrls.has(key)) {
    const cached = bakedUrls.get(key)
    // Re-insert so the Map's order stays least-recently-used first.
    bakedUrls.delete(key)
    bakedUrls.set(key, cached)
    return cached
  }
  if (bakedUrls.size >= CACHE_LIMIT) evictOldest()
  const pending = rasterizeSvg({ markup, width, height, dpr }).catch((error) => {
    bakedUrls.delete(key)
    throw error
  })
  bakedUrls.set(key, pending)
  return pending
}

// <img> showing a baked URL, decoded before it is swapped in so the frame never flickers.
export const createBakedImage = async (url, className) => {
  const image = new Image()
  image.className = className
  image.alt = ''
  image.setAttribute('aria-hidden', 'true')
  image.draggable = false
  image.src = url
  await image.decode()
  return image
}
