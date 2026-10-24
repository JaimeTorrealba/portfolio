// The element holding an instance's filtered art: a live <svg>, or the baked <img> that
// replaces it. Swapped in place, so overlays that follow it keep their stacking order.
import { bakeSvg, createBakedImage, getBakeDpr, hasBakedSvg } from './bake.js'

// The HTML parser puts <svg> in the SVG namespace and fixes the camelCase names.
export const parseSvg = (markup) => {
  const template = document.createElement('template')
  template.innerHTML = markup
  return template.content.firstElementChild
}

// followers: elements kept right after the art (shine, overlays), inserted on first show.
export const createArtSlot = ({ hostElement, className, followers = [] }) => {
  let artElement = null

  const show = (nextArt) => {
    if (artElement) artElement.replaceWith(nextArt)
    else hostElement.prepend(nextArt)
    artElement = nextArt
    // Last first, each right after the art, so they end up in the given order.
    ;[...followers].reverse().forEach((follower) => {
      if (!follower.isConnected) artElement.after(follower)
    })
  }

  const remove = () => {
    artElement?.remove()
    artElement = null
  }

  // Live: the SVG straight away. Baked: the live SVG first (unless the bitmap is cached,
  // or keepCurrent and something is already showing), then the <img> once decoded. If
  // baking fails, for example on a tainted canvas, the live SVG stays.
  const render = async ({ markup, bake, bakeKey, width, height, isCurrent, keepCurrent = false }) => {
    if (!bake) {
      show(parseSvg(markup))
      return
    }
    const dpr = getBakeDpr()
    const key = `${bakeKey}-${dpr}`
    if (!hasBakedSvg(key) && !(keepCurrent && artElement)) show(parseSvg(markup))
    try {
      const url = await bakeSvg({ key, markup, width, height, dpr })
      const image = await createBakedImage(url, className)
      if (isCurrent()) show(image)
    } catch {
      if (isCurrent() && !(artElement instanceof SVGElement)) show(parseSvg(markup))
    }
  }

  return { render, remove }
}
