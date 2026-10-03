const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'

// Called on Tab while a card is open: Tab and Shift+Tab wrap around inside `container`
// instead of leaving it for the page behind, as in a modal dialog.
export const keepFocusInside = (container, event) => {
  const focusables = [...container.querySelectorAll(FOCUSABLE_SELECTOR)]
  if (focusables.length === 0) return
  const first = focusables[0]
  const last = focusables[focusables.length - 1]
  const active = document.activeElement

  if (!container.contains(active)) {
    event.preventDefault()
    first.focus()
  } else if (event.shiftKey && active === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && active === last) {
    event.preventDefault()
    first.focus()
  }
}
