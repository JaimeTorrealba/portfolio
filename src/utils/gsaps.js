import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'

gsap.registerPlugin(SplitText, DrawSVGPlugin)

export const showText = (elem, options, className) => {
  console.log('jaime ~ showText ~ elem:', elem)
  gsap.set(elem, { overflowY: 'hidden' }) // prevent fouc
  const tl = gsap.timeline(),
    mySplitText = new SplitText(elem, { type: 'lines', linesClass: className ?? 'line' }),
    words = mySplitText.lines

  return tl.from(words, {
    yPercent: 300,
    ease: options?.ease ?? 'Power3.out',
    stagger: options?.stagger ?? 0.01,
    duration: options?.duration ?? 1,
    delay: options?.delay ?? 0.5,
    ...options
  })
}

export const showLongText = (elem, options) => {
  console.log('jaime ~ showLongText ~ elem:', elem)
  gsap.set(elem, { overflowY: 'hidden' }) // prevent fouc
  const tl = gsap.timeline(),
    mySplitText = new SplitText(elem, { type: 'words', linesClass: 'line' }),
    words = mySplitText.words
  return tl.from(words, {
    yPercent: 300,
    ease: options?.ease ?? 'Power3.in',
    stagger: options?.stagger ?? 0.01,
    duration: options?.duration ?? 1,
    delay: options?.delay ?? 0.5,
    ...options
  })
}

export const appear = (elem, options) => {
  const tl = gsap.timeline()
  return tl.from(elem, {
    y: 50,
    opacity: 0,
    duration: 1,
    delay: 1,
    ...options
  })
}

export const drawIllustration = (elem, options) => {
  gsap.set(`${elem}`, { opacity: 1 }) // prevent fouc
  gsap.set(`${elem} *`, { drawSVG: 0 })

  return gsap
    .timeline()
    .to(`${elem} *`, {
      drawSVG: true,
      duration: 1,
      ...options,
      stagger: {
        amount: 0.5,
        from: 'center'
      }
    })
    .from(`${elem} *`, { fill: 'transparent', duration: 0.15 })
    .to(`${elem} *`, { stroke: '#e4e4e4' })
}
