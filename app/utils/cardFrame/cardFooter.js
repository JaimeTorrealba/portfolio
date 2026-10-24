// The card's footer button: footer: { height, button: { label, onClick, variant, ... } }.
// Builds a real <button> centred in the footer plate, makes it a red button seeded from
// the card (card seed + 101) and lit from the card's light angle.
import { createRedButton } from './red-button.js'

export const FOOTER_BUTTON_HEIGHT = 64

// The requested button, from footer.button (or a top-level button option).
export const getFooterButtonOptions = (options) => (options.footer && options.footer.button) || options.button || null

// Options that belong to the <button> element, not to createRedButton.
const ELEMENT_OPTION_KEYS = ['onClick', 'ariaLabel', 'type']

const getButtonOptions = ({ buttonOptions, cardSeed, lightAngle, bake }) => ({
  seed: cardSeed + 101,
  lightAngle,
  bake,
  ...Object.fromEntries(Object.entries(buttonOptions).filter(([key]) => !ELEMENT_OPTION_KEYS.includes(key))),
})

// cardSeed, lightAngle and bake come from the card; the button options can override them.
export const mountFooterButton = ({ cardElement, buttonOptions, cardSeed, lightAngle, bake }) => {
  const footerElement = document.createElement('div')
  footerElement.className = 'card-frame__footer'
  const buttonElement = document.createElement('button')
  buttonElement.type = buttonOptions.type ?? 'button'
  buttonElement.textContent = buttonOptions.label ?? 'Cancel'
  if (buttonOptions.ariaLabel) buttonElement.setAttribute('aria-label', buttonOptions.ariaLabel)
  footerElement.append(buttonElement)
  cardElement.append(footerElement)

  // One listener for the button's life; update() can swap the handler behind it.
  let onClick = buttonOptions.onClick
  const handleClick = (event) => onClick?.(event)
  buttonElement.addEventListener('click', handleClick)

  const button = createRedButton(buttonElement, getButtonOptions({ buttonOptions, cardSeed, lightAngle, bake }))

  return {
    button,
    update: (next) => {
      onClick = next.buttonOptions.onClick
      if (next.buttonOptions.ariaLabel) buttonElement.setAttribute('aria-label', next.buttonOptions.ariaLabel)
      button.update(getButtonOptions(next))
    },
    destroy: ({ keepDom = false } = {}) => {
      buttonElement.removeEventListener('click', handleClick)
      button.destroy({ keepDom })
      if (!keepDom) footerElement.remove()
    },
  }
}
