// Procedural dark-fantasy card frame: worn leather panel, bevelled metal border, thorns,
// chips and scratches, all generated at runtime from a numeric seed. No images, no
// dependencies, no framework: mount it on any element.
//
//   const frame = createCardFrame(element, { seed: 7 })
//   frame.setSeed(8); frame.update({ thickness: 14 }); frame.destroy()
//
//   // With the red button in the footer plate (footer auto-enabled at 64px):
//   createCardFrame(element, { footer: { height: 64, button: { label: 'Cancel', onClick } } })
//
// Vue 3: create it in onMounted on a template ref, destroy it in onBeforeUnmount.
//
// DOM it builds inside `element` (styles in ./card-frame.css):
//   .card-frame                 the element itself (position: relative, isolation: isolate)
//     svg|img.card-frame__art   every visual, overflowing by --card-frame-overflow, aria-hidden
//     .card-frame__shine        optional pointer highlight, clipped to the frame
//     .card-frame__content      the content: never filtered, displaced or blended
//     .card-frame__footer       optional, holds the footer's button.cf-btn
// An existing .card-frame__content child is used as is; otherwise the children are wrapped.
import { buildCardGeometry } from './geometry.js'
import { buildCardSvg } from './markup.js'
import { createArtSlot } from './artSlot.js'
import { createInstanceId } from './ids.js'
import { createRenderScheduler } from './scheduler.js'
import { buildShineClipPath, createShine, supportsShine } from './shine.js'
import { shouldBake, supportsSvgFilters } from './support.js'
import { FOOTER_BUTTON_HEIGHT, getFooterButtonOptions, mountFooterButton } from './cardFooter.js'

export { createRedButton, DEFAULT_RED_BUTTON_OPTIONS, RED_BUTTON_PALETTES } from './red-button.js'

/**
 * @typedef {import('./red-button.js').RedButtonOptions & {
 *   label?: string, onClick?: (event: MouseEvent) => void, ariaLabel?: string, type?: string
 * }} FooterButtonOptions
 */

/**
 * @typedef {object} CardFrameOptions
 * @property {number} [seed]
 * @property {number} [thickness]
 * @property {{ corner?: number, top?: number, sides?: number }} [thornCount]
 * @property {[number, number]} [thornLength]
 * @property {number} [wobble]
 * @property {number} [chipDensity]
 * @property {number} [scratchDensity]
 * @property {number} [grain]
 * @property {{ base?: string, baseLight?: string, light?: string, shadow?: string, rim?: string }} [palette]
 * @property {false | true | { height?: number, button?: FooterButtonOptions }} [footer]
 * @property {FooterButtonOptions} [button]  shorthand for footer.button
 * @property {number} [lightAngle]
 * @property {number} [safeMargin]
 * @property {boolean|'auto'} [bake]
 * @property {boolean} [interactive]
 * @property {boolean} [lazy]
 */

export const DEFAULT_CARD_FRAME_OPTIONS = {
  seed: 1337,
  thickness: 12,
  thornCount: { corner: 3, top: 4, sides: 0 },
  thornLength: [10, 26],
  wobble: 1.5, // px amplitude of the outline displacement
  chipDensity: 0.6,
  scratchDensity: 0.5,
  grain: 0.6,
  palette: { base: '#1a1c20', baseLight: '#2a2d33', light: '#2e3036', shadow: '#0b0c0e', rim: '#7b7f88' },
  footer: false, // or { height: 56 }, or { height: 64, button: { label, onClick } }
  lightAngle: 225, // deg, SVG azimuth: 225 = light from the top-left
  safeMargin: 8, // px between the frame and the content
  bake: 'auto', // true: rasterise once; 'auto': only in Safari, where the lighting filters are slow
  interactive: true, // moving highlight on pointermove
  lazy: true, // wait until the card nears the viewport
}

const MIN_FRAMED_SIZE = 120

// A requested button turns the footer on (64px) when the card has none.
const resolveFooter = (options) => {
  const button = getFooterButtonOptions(options)
  if (!options.footer) return button ? { height: FOOTER_BUTTON_HEIGHT, button } : false
  return { height: button ? FOOTER_BUTTON_HEIGHT : 56, ...(options.footer === true ? {} : options.footer), button }
}

const resolveOptions = (options) => ({
  ...DEFAULT_CARD_FRAME_OPTIONS,
  ...options,
  thornCount: { ...DEFAULT_CARD_FRAME_OPTIONS.thornCount, ...options.thornCount },
  palette: { ...DEFAULT_CARD_FRAME_OPTIONS.palette, ...options.palette },
  footer: resolveFooter(options),
})

// What else besides seed and size changes the card's pixels: part of the bake cache key.
// Only the footer's height counts: the button draws itself.
const VISUAL_OPTION_KEYS = ['thickness', 'thornCount', 'thornLength', 'wobble', 'chipDensity', 'scratchDensity', 'grain', 'palette', 'footer', 'lightAngle']
const getOptionsSignature = (options) =>
  JSON.stringify(VISUAL_OPTION_KEYS.map((key) => (key === 'footer' ? options.footer && options.footer.height : options[key])))

// Room around the card for the longest barb, the wobble and the drop shadow's blur.
const getOverflow = (options) => Math.ceil(options.thornLength[1] + options.wobble + 16)

const ensureContentElement = (cardElement) => {
  const existing = [...cardElement.children].find((child) => child.classList.contains('card-frame__content'))
  if (existing) return { element: existing, wasCreated: false }
  const element = document.createElement('div')
  element.className = 'card-frame__content'
  element.append(...cardElement.childNodes)
  cardElement.append(element)
  return { element, wasCreated: true }
}

const FRAME_VARIABLES = ['--card-frame-thickness', '--card-frame-safe-margin', '--card-frame-overflow', '--card-frame-footer']

const setFrameVariables = (cardElement, options, overflow) => {
  const values = [options.thickness, options.safeMargin, overflow, options.footer ? options.footer.height : 0]
  FRAME_VARIABLES.forEach((name, index) => cardElement.style.setProperty(name, `${values[index]}px`))
}

/**
 * @param {HTMLElement} cardElement
 * @param {CardFrameOptions} [initialOptions]
 * @returns {{ update: (options?: CardFrameOptions) => void, setSeed: (seed: number) => void,
 *   destroy: (teardown?: { keepDom?: boolean }) => void }}
 */
export const createCardFrame = (cardElement, initialOptions = {}) => {
  let requestedOptions = { ...initialOptions }
  let options = resolveOptions(requestedOptions)
  const idPrefix = createInstanceId('cf', options.seed)
  const content = ensureContentElement(cardElement)
  const shine = options.interactive && supportsShine() ? createShine(cardElement, 'card-frame__shine') : null
  const slot = createArtSlot({ hostElement: cardElement, className: 'card-frame__art', followers: shine ? [shine.element] : [] })
  let footerButton = null
  let renderToken = 0
  let isDestroyed = false

  cardElement.classList.add('card-frame')

  // Mounts, updates or removes the footer button to match the options.
  const syncFooterButton = () => {
    const buttonOptions = options.footer && options.footer.button
    const source = { buttonOptions, cardSeed: options.seed, lightAngle: options.lightAngle, bake: options.bake }
    if (buttonOptions && footerButton) footerButton.update(source)
    else if (buttonOptions) footerButton = mountFooterButton({ cardElement, ...source })
    else if (footerButton) {
      footerButton.destroy()
      footerButton = null
    }
  }
  syncFooterButton()

  const render = ({ width, height }) => {
    renderToken += 1
    const token = renderToken
    const useFallback = !supportsSvgFilters() || Math.min(width, height) < MIN_FRAMED_SIZE
    cardElement.classList.toggle('card-frame--fallback', useFallback)
    const overflow = getOverflow(options)
    setFrameVariables(cardElement, options, overflow)
    if (useFallback) {
      slot.remove()
      return
    }

    const geometry = buildCardGeometry({ seed: options.seed, width, height, options })
    shine?.setClipPath(buildShineClipPath([geometry.outer.commands, geometry.inner.commands], overflow))
    slot.render({
      markup: buildCardSvg({ idPrefix, seed: options.seed, geometry, options, overflow }),
      bake: shouldBake(options.bake),
      bakeKey: `${options.seed}-${width}x${height}-${getOptionsSignature(options)}`,
      width: width + overflow * 2,
      height: height + overflow * 2,
      isCurrent: () => token === renderToken && !isDestroyed,
    })
  }

  const scheduler = createRenderScheduler({ element: cardElement, lazy: options.lazy, render })

  const getArtKey = () => `${options.seed}-${options.safeMargin}-${shouldBake(options.bake)}-${getOptionsSignature(options)}`

  // Merge option changes in. The frame regenerates (even at the same size) only when
  // something it draws changed; a button-only change just updates the button.
  const update = (nextOptions = {}) => {
    const previousArtKey = getArtKey()
    requestedOptions = { ...requestedOptions, ...nextOptions }
    options = resolveOptions(requestedOptions)
    syncFooterButton()
    if (getArtKey() !== previousArtKey) scheduler.invalidate()
  }

  // keepDom: stop observing but leave the frame drawn, for a card that is about to be
  // removed anyway and may still be animating out (a Vue <Transition> leave).
  const destroy = ({ keepDom = false } = {}) => {
    isDestroyed = true
    scheduler.stop()
    shine?.destroy({ keepDom })
    footerButton?.destroy({ keepDom })
    if (keepDom) return
    slot.remove()
    cardElement.classList.remove('card-frame', 'card-frame--fallback')
    FRAME_VARIABLES.forEach((name) => cardElement.style.removeProperty(name))
    if (content.wasCreated) content.element.replaceWith(...content.element.childNodes)
  }

  return { update, setSeed: (seed) => update({ seed }), destroy }
}
