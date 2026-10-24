// Procedural dark-fantasy button: a worn blood-red lacquered face in a chipped metal rim,
// lit like the card frame. The element stays a real <button>: keyboard, forms and
// screen readers work as usual, and the label is real DOM text that no filter touches.
//
//   const button = createRedButton(document.querySelector('button'), { seed: 7 })
//   button.setLabel('Retreat'); button.update({ variant: 'primary' }); button.destroy()
//
// DOM it builds inside the button (styles in ./red-button.css):
//   button.cf-btn
//     svg|img.cf-btn__art     plate + face, all the filters (baked to a bitmap with bake)
//     span.cf-btn__overlay    bevel lines (--hl / --sh) and the worn glow line (ember pulse)
//     span.cf-btn__shine      optional pointer highlight, clipped to the face
//     span.cf-btn__label      the text (an existing .cf-btn__label is kept)
//
// Every state (hover, pressed, focus, disabled) is CSS on top of the rendered art, so no
// state change ever re-runs an SVG filter.
import { buildButtonGeometry } from './buttonGeometry.js'
import { BUTTON_OVERFLOW, buildButtonArtSvg, buildButtonOverlayMarkup } from './buttonMarkup.js'
import { createArtSlot } from './artSlot.js'
import { createInstanceId } from './ids.js'
import { createRenderScheduler } from './scheduler.js'
import { buildShineClipPath, createShine, supportsShine } from './shine.js'
import { shouldBake, supportsSvgFilters } from './support.js'

/**
 * @typedef {object} RedButtonPalette
 * @property {string} faceTop      lacquer colour at the top of the face
 * @property {string} faceBottom   lacquer colour at the bottom
 * @property {string} outline      worn inner outline
 * @property {string} highlight    bevel highlight on the lit edges
 * @property {string} rim          scratch / chip highlight tone of the metal
 * @property {string} metalLight   plate gradient, lit corner
 * @property {string} metalDark    plate gradient, far corner
 * @property {string} text         label colour (--cf-btn-text)
 * @property {string} glow         hover glow (--cf-btn-glow)
 */

/**
 * @typedef {object} RedButtonOptions
 * @property {number} [seed]          defaults to 1337 + 101; a card's footer button uses the card seed + 101
 * @property {'danger'|'primary'} [variant]  danger: blood red; primary: dark gold
 * @property {number} [wobble]        px amplitude of the outline displacement
 * @property {number} [chipCount]
 * @property {number} [scratchCount]
 * @property {number} [grain]         0..1 strength of the face grain
 * @property {Partial<RedButtonPalette>} [palette]  overrides on top of the variant's palette
 * @property {number} [lightAngle]    deg; a footer button inherits the card's
 * @property {boolean|'auto'} [bake]
 * @property {boolean} [interactive]  pointer highlight on the face
 * @property {boolean} [lazy]         wait until the button nears the viewport
 * @property {string} [label]         replaces the label text
 * @property {string} [labelMaxWidth] CSS length; longer labels end in an ellipsis (default 14em)
 */

/**
 * @typedef {object} RedButtonController
 * @property {(options?: RedButtonOptions) => void} update  merge options and regenerate
 * @property {(seed: number) => void} setSeed
 * @property {(label: string) => void} setLabel
 * @property {(teardown?: { keepDom?: boolean }) => void} destroy
 */

export const RED_BUTTON_PALETTES = {
  danger: {
    faceTop: '#9a1c22',
    faceBottom: '#4e0c10',
    outline: '#d12a30',
    highlight: '#ff6a6a',
    rim: '#7b7f88',
    metalLight: '#26282d',
    metalDark: '#090a0c',
    text: '#e8dfd0',
    glow: 'rgb(209 42 48 / 0.45)',
  },
  primary: {
    faceTop: '#7d6128',
    faceBottom: '#33250c',
    outline: '#d9a441',
    highlight: '#ffdc8a',
    rim: '#7b7f88',
    metalLight: '#26282d',
    metalDark: '#090a0c',
    text: '#f1e6cf',
    glow: 'rgb(217 164 65 / 0.4)',
  },
}

export const DEFAULT_RED_BUTTON_OPTIONS = {
  seed: 1337 + 101,
  variant: 'danger',
  wobble: 0.6,
  chipCount: 2,
  scratchCount: 2,
  grain: 0.5,
  palette: {},
  lightAngle: 225,
  bake: 'auto',
  interactive: true,
  lazy: false,
}

const resolveButtonOptions = (options) => {
  const variant = RED_BUTTON_PALETTES[options.variant] ? options.variant : 'danger'
  return {
    ...DEFAULT_RED_BUTTON_OPTIONS,
    ...options,
    variant,
    palette: { ...RED_BUTTON_PALETTES[variant], ...options.palette },
  }
}

// What changes the art's pixels besides seed, size and variant: part of the bake key.
const getButtonSignature = ({ wobble, chipCount, scratchCount, grain, palette, lightAngle }) =>
  JSON.stringify([wobble, chipCount, scratchCount, grain, palette, lightAngle])

// Reuses an existing .cf-btn__label, otherwise moves the button's text into a new one.
const ensureLabel = (buttonElement) => {
  const existing = buttonElement.querySelector(':scope > .cf-btn__label')
  if (existing) return existing
  const label = document.createElement('span')
  label.className = 'cf-btn__label'
  label.textContent = buttonElement.textContent.trim()
  buttonElement.replaceChildren(label)
  return label
}

const setLabelText = (label, text) => {
  label.textContent = text
  // Read by the etched duplicate in the CSS (::before content: attr(data-label)).
  label.dataset.label = text
}

const BUTTON_VARIABLES = ['--cf-btn-text', '--cf-btn-glow', '--cf-btn-label-max']

/**
 * @param {HTMLButtonElement} buttonElement
 * @param {RedButtonOptions} [initialOptions]
 * @returns {RedButtonController}
 */
export const createRedButton = (buttonElement, initialOptions = {}) => {
  let requestedOptions = { ...initialOptions }
  let options = resolveButtonOptions(requestedOptions)
  const idPrefix = createInstanceId('cf-btn', options.seed)
  // A button without a type would submit its form; an explicit type is left alone.
  if (!buttonElement.hasAttribute('type')) buttonElement.type = 'button'
  const label = ensureLabel(buttonElement)
  setLabelText(label, options.label ?? label.textContent)
  const overlay = document.createElement('span')
  overlay.className = 'cf-btn__overlay'
  overlay.setAttribute('aria-hidden', 'true')
  const shine = options.interactive && supportsShine() ? createShine(buttonElement, 'cf-btn__shine') : null
  const slot = createArtSlot({ hostElement: buttonElement, className: 'cf-btn__art', followers: [overlay, shine?.element].filter(Boolean) })
  let renderToken = 0
  let isDestroyed = false

  buttonElement.classList.add('cf-btn')

  const applyVariables = () => {
    buttonElement.dataset.variant = options.variant
    buttonElement.style.setProperty('--cf-btn-text', options.palette.text)
    buttonElement.style.setProperty('--cf-btn-glow', options.palette.glow)
    if (options.labelMaxWidth) buttonElement.style.setProperty('--cf-btn-label-max', options.labelMaxWidth)
  }
  applyVariables()

  const render = ({ width, height }) => {
    renderToken += 1
    const token = renderToken
    const useFallback = !supportsSvgFilters() || !width || !height
    buttonElement.classList.toggle('cf-btn--fallback', useFallback)
    if (useFallback) {
      slot.remove()
      overlay.replaceChildren()
      return
    }
    const geometry = buildButtonGeometry({ seed: options.seed, width, height, options })
    const context = { idPrefix, seed: options.seed, geometry, options }
    overlay.innerHTML = buildButtonOverlayMarkup(context)
    shine?.setClipPath(buildShineClipPath([geometry.faceCommands], BUTTON_OVERFLOW))
    // keepCurrent: on a resize the old art stays until the new bitmap is ready.
    slot.render({
      markup: buildButtonArtSvg(context),
      bake: shouldBake(options.bake),
      bakeKey: `${options.seed}-${width}x${height}-${options.variant}-${getButtonSignature(options)}`,
      width: width + BUTTON_OVERFLOW * 2,
      height: height + BUTTON_OVERFLOW * 2,
      isCurrent: () => token === renderToken && !isDestroyed,
      keepCurrent: true,
    })
  }

  const scheduler = createRenderScheduler({ element: buttonElement, lazy: options.lazy, render })

  const setLabel = (text) => setLabelText(label, text)

  const update = (nextOptions = {}) => {
    requestedOptions = { ...requestedOptions, ...nextOptions }
    options = resolveButtonOptions(requestedOptions)
    if (nextOptions.label !== undefined) setLabel(nextOptions.label)
    applyVariables()
    scheduler.invalidate()
  }

  // keepDom: stop observing but leave the button drawn (it is about to be removed anyway).
  const destroy = ({ keepDom = false } = {}) => {
    isDestroyed = true
    scheduler.stop()
    shine?.destroy({ keepDom })
    if (keepDom) return
    slot.remove()
    overlay.remove()
    buttonElement.classList.remove('cf-btn', 'cf-btn--fallback')
    delete buttonElement.dataset.variant
    BUTTON_VARIABLES.forEach((name) => buttonElement.style.removeProperty(name))
  }

  return { update, setSeed: (seed) => update({ seed }), setLabel, destroy }
}
