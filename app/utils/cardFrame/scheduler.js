// When to regenerate, shared by the card and the button: on size changes, at most once
// per frame, and only once the element has come near the viewport.
const LAZY_ROOT_MARGIN = '200px'

export const createRenderScheduler = ({ element, lazy, render }) => {
  let isVisible = !lazy || typeof IntersectionObserver === 'undefined'
  let isStopped = false
  let frameRequest = 0
  let renderedSizeKey = ''

  // offsetWidth/Height are the layout box: a GSAP scale on an ancestor does not change them.
  const runRender = () => {
    frameRequest = 0
    const width = element.offsetWidth
    const height = element.offsetHeight
    const sizeKey = `${width}x${height}`
    if (sizeKey === renderedSizeKey) return
    renderedSizeKey = sizeKey
    render({ width, height })
  }

  const schedule = () => {
    if (!isVisible || frameRequest || isStopped) return
    frameRequest = requestAnimationFrame(runRender)
  }

  const resizeObserver = new ResizeObserver(schedule)
  resizeObserver.observe(element)

  const intersectionObserver = isVisible
    ? null
    : new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return
          isVisible = true
          intersectionObserver.disconnect()
          schedule()
        },
        { rootMargin: LAZY_ROOT_MARGIN },
      )
  intersectionObserver?.observe(element)
  schedule()

  return {
    // Regenerate even at the same size (options or seed changed).
    invalidate: () => {
      renderedSizeKey = ''
      schedule()
    },
    stop: () => {
      isStopped = true
      cancelAnimationFrame(frameRequest)
      resizeObserver.disconnect()
      intersectionObserver?.disconnect()
    },
  }
}
